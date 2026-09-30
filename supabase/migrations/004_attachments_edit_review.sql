-- ============================================================================
-- Aquanix — tệp đính kèm, sửa phiếu, duyệt & đưa lên từ /roadmap, báo cáo build dạng Markdown.
-- Chạy sau 003. Chạy lại được (idempotent).
-- ============================================================================

alter table public.tickets
  add column if not exists attachments jsonb not null default '[]'::jsonb,
  add column if not exists build_steps jsonb;

create or replace view public.tickets_public as
select id, code, title, description, reporter_name, status,
       page_url, page_section, viewport, user_agent,
       screenshot_raw_path, screenshot_annotated_path,
       status_note, commit_sha, commit_url,
       created_at, updated_at, status_changed_at, search_text,
       build_status, preview_url, diff_url, build_note, build_requested_at, build_updated_at,
       build_started_at, build_seconds, build_log_url,
       attachments, build_steps
from public.tickets;

revoke all on public.tickets_public from public, anon, authenticated;
grant select on public.tickets_public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: thêm tệp đính kèm (ảnh, PDF, văn bản) ≤ 10MB; ảnh trước/sau do máy build tải lên
-- ---------------------------------------------------------------------------
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/webp', 'image/png', 'image/jpeg', 'image/gif',
                               'application/pdf', 'text/plain', 'text/csv', 'text/markdown']
where id = 'feedback-screenshots';

drop policy if exists "feedback screenshots: anon upload" on storage.objects;
create policy "feedback screenshots: anon upload" on storage.objects
for insert to anon, authenticated
with check (
  bucket_id = 'feedback-screenshots'
  and name ~ '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-(raw|annotated|att[0-9])\.(webp|png|jpg|gif|pdf|txt|csv|md)$'
);

-- ---------------------------------------------------------------------------
-- submit_ticket: thêm p_attachments = [{path, name, type, size}] (tối đa 5)
-- ---------------------------------------------------------------------------
drop function if exists public.submit_ticket(text, text, text, text, text, text, text, text, text, text);

create or replace function public.submit_ticket(
  p_description      text,
  p_reporter_name    text default null,
  p_reporter_contact text default null,
  p_page_url         text default null,
  p_page_section     text default null,
  p_viewport         text default null,
  p_user_agent       text default null,
  p_raw_path         text default null,
  p_annotated_path   text default null,
  p_title            text default null,
  p_attachments      jsonb default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_ip      text := private.request_ip();
  v_desc    text := btrim(coalesce(p_description, ''));
  v_name    text := btrim(coalesce(p_reporter_name, ''));
  v_contact text := nullif(btrim(coalesce(p_reporter_contact, '')), '');
  v_title   text := nullif(btrim(coalesce(p_title, '')), '');
  v_atts    jsonb := '[]'::jsonb;
  v_a       jsonb;
  v_id      bigint;
  v_recent  int;
  v_path_re text := '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-(raw|annotated)\.(webp|png|jpg)$';
  v_att_re  text := '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-att[0-9]\.(webp|png|jpg|gif|pdf|txt|csv|md)$';
begin
  if char_length(v_desc) < 10 or char_length(v_desc) > 2000 then
    return jsonb_build_object('ok', false, 'error', 'invalid_description');
  end if;
  if v_title is not null and (char_length(v_title) < 5 or char_length(v_title) > 150) then
    return jsonb_build_object('ok', false, 'error', 'invalid_title');
  end if;
  if v_name = '' then
    v_name := 'Ẩn danh';
  elsif char_length(v_name) < 2 or char_length(v_name) > 60 then
    return jsonb_build_object('ok', false, 'error', 'invalid_name');
  end if;
  if v_contact is not null and (char_length(v_contact) > 120
     or not (v_contact ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' or v_contact ~ '^\+?[0-9 .\-]{9,20}$')) then
    return jsonb_build_object('ok', false, 'error', 'invalid_contact');
  end if;
  if (p_raw_path is not null and p_raw_path !~ v_path_re)
     or (p_annotated_path is not null and p_annotated_path !~ v_path_re) then
    return jsonb_build_object('ok', false, 'error', 'invalid_path');
  end if;

  if p_attachments is not null and jsonb_typeof(p_attachments) = 'array' then
    if jsonb_array_length(p_attachments) > 5 then
      return jsonb_build_object('ok', false, 'error', 'too_many_attachments');
    end if;
    for v_a in select * from jsonb_array_elements(p_attachments) loop
      if coalesce(v_a ->> 'path', '') !~ v_att_re then
        return jsonb_build_object('ok', false, 'error', 'invalid_path');
      end if;
      v_atts := v_atts || jsonb_build_array(jsonb_build_object(
        'path', v_a ->> 'path',
        'name', left(coalesce(nullif(btrim(v_a ->> 'name'), ''), 'tep-dinh-kem'), 120),
        'type', left(coalesce(v_a ->> 'type', ''), 100),
        'size', case when coalesce(v_a ->> 'size', '') ~ '^[0-9]{1,9}$' then (v_a ->> 'size')::int else null end));
    end loop;
  end if;

  select count(*) into v_recent from private.submit_log
  where ip = v_ip and created_at > now() - interval '10 minutes';
  if v_recent >= 10 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  if v_title is null then
    v_title := left(btrim(split_part(v_desc, E'\n', 1)), 80);
    if v_title = '' then v_title := left(v_desc, 80); end if;
  end if;

  insert into public.tickets (title, description, reporter_name, reporter_contact,
    page_url, page_section, viewport, user_agent, screenshot_raw_path, screenshot_annotated_path, attachments)
  values (v_title, v_desc, v_name, v_contact,
    left(p_page_url, 500), left(p_page_section, 60), left(p_viewport, 20), left(p_user_agent, 400),
    p_raw_path, p_annotated_path, v_atts)
  returning id into v_id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor)
  values (v_id, null, 'backlog', 'reporter');
  insert into private.submit_log (ip) values (v_ip);

  return jsonb_build_object('ok', true, 'code', public.ticket_code(v_id));
end $$;

revoke all on function public.submit_ticket(text, text, text, text, text, text, text, text, text, text, jsonb) from public;
grant execute on function public.submit_ticket(text, text, text, text, text, text, text, text, text, text, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin (PIN) sửa nội dung phiếu — chỉ khi Backlog / Doing
-- ---------------------------------------------------------------------------
create or replace function public.update_ticket(p_code text, p_pin text, p_title text, p_description text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check jsonb;
  v_t     public.tickets%rowtype;
  v_title text := btrim(coalesce(p_title, ''));
  v_desc  text := btrim(coalesce(p_description, ''));
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;
  if char_length(v_title) < 5 or char_length(v_title) > 150 then
    return jsonb_build_object('ok', false, 'error', 'invalid_title');
  end if;
  if char_length(v_desc) < 10 or char_length(v_desc) > 2000 then
    return jsonb_build_object('ok', false, 'error', 'invalid_description');
  end if;

  select * into v_t from public.tickets where code = p_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_t.status not in ('backlog', 'doing') then
    return jsonb_build_object('ok', false, 'error', 'cannot_edit');
  end if;

  update public.tickets set title = v_title, description = v_desc where id = v_t.id;
  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, v_t.status, 'admin', 'Sửa nội dung phiếu');
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.update_ticket(text, text, text, text) from public;
grant execute on function public.update_ticket(text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- delete_ticket: không cho xoá phiếu đã Done
-- ---------------------------------------------------------------------------
create or replace function public.delete_ticket(p_code text, p_pin text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check  jsonb;
  v_status public.ticket_status;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;
  select status into v_status from public.tickets where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_status = 'done' then
    return jsonb_build_object('ok', false, 'error', 'cannot_delete_done');
  end if;
  delete from public.tickets where code = p_code;
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------------------
-- Admin (PIN) duyệt bản xem trước → workflow gộp vào main; hoặc từ chối
-- ---------------------------------------------------------------------------
create or replace function public.review_build(p_code text, p_pin text, p_approve boolean) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check jsonb;
  v_t     public.tickets%rowtype;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;

  select * into v_t from public.tickets where code = p_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_t.build_status is distinct from 'preview' then
    return jsonb_build_object('ok', false, 'error', 'no_preview');
  end if;

  if not private.dispatch_workflow('review-ticket.yml',
       jsonb_build_object('code', p_code, 'decision', case when p_approve then 'approve' else 'reject' end)) then
    return jsonb_build_object('ok', false, 'error', 'build_not_configured');
  end if;

  update public.tickets
  set build_status = case when p_approve then 'merging' else 'rejected' end,
      build_updated_at = now()
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, v_t.status, 'admin',
          case when p_approve then 'Duyệt bản xem trước — đưa lên trang chính thức' else 'Từ chối bản xem trước' end);

  return jsonb_build_object('ok', true, 'build_status', case when p_approve then 'merging' else 'rejected' end);
end $$;

revoke all on function public.review_build(text, text, boolean) from public;
grant execute on function public.review_build(text, text, boolean) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- set_ticket_build: báo cáo Markdown dài hơn (8000) + danh sách bước Claude đã làm
-- ---------------------------------------------------------------------------
drop function if exists public.set_ticket_build(text, text, text, text, text, text, integer);

create or replace function public.set_ticket_build(
  p_code        text,
  p_state       text,
  p_preview_url text default null,
  p_diff_url    text default null,
  p_note        text default null,
  p_log_url     text default null,
  p_seconds     integer default null,
  p_steps       jsonb default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
begin
  if p_state is null or p_state not in ('queued', 'running', 'preview', 'merging', 'failed', 'rejected', 'merged') then
    return jsonb_build_object('ok', false, 'error', 'invalid_state');
  end if;
  update public.tickets
  set build_status = p_state,
      preview_url = coalesce(p_preview_url, preview_url),
      diff_url = coalesce(p_diff_url, diff_url),
      build_note = coalesce(left(nullif(btrim(p_note), ''), 8000), build_note),
      build_log_url = coalesce(p_log_url, build_log_url),
      build_started_at = case when p_state = 'running' then now() else build_started_at end,
      build_seconds = case when p_state = 'running' then null else coalesce(p_seconds, build_seconds) end,
      build_steps = case when p_state = 'running' then null else coalesce(p_steps, build_steps) end,
      build_updated_at = now()
  where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object('ok', true, 'build_status', p_state);
end $$;

revoke all on function public.set_ticket_build(text, text, text, text, text, text, integer, jsonb) from public, anon, authenticated;
grant execute on function public.set_ticket_build(text, text, text, text, text, text, integer, jsonb) to service_role;
