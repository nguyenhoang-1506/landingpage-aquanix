-- ============================================================================
-- Aquanix — cấu trúc góp ý mới (Vấn đề + Mô tả/gợi ý), xoá góp ý, nhật ký & thời gian build.
-- Chạy sau 002. Chạy lại được (idempotent).
-- ============================================================================

alter table public.tickets
  add column if not exists build_started_at timestamptz,
  add column if not exists build_seconds    integer,
  add column if not exists build_log_url    text;

-- "Vấn đề gặp phải" dài hơn tiêu đề cũ
alter table public.tickets drop constraint if exists tickets_title_check;
alter table public.tickets add constraint tickets_title_check check (char_length(title) between 1 and 150);

create or replace view public.tickets_public as
select id, code, title, description, reporter_name, status,
       page_url, page_section, viewport, user_agent,
       screenshot_raw_path, screenshot_annotated_path,
       status_note, commit_sha, commit_url,
       created_at, updated_at, status_changed_at, search_text,
       build_status, preview_url, diff_url, build_note, build_requested_at, build_updated_at,
       build_started_at, build_seconds, build_log_url
from public.tickets;

revoke all on public.tickets_public from public, anon, authenticated;
grant select on public.tickets_public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- submit_ticket: thêm p_title (Vấn đề gặp phải); tên không bắt buộc (mặc định "Ẩn danh")
-- ---------------------------------------------------------------------------
drop function if exists public.submit_ticket(text, text, text, text, text, text, text, text, text);

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
  p_title            text default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_ip      text := private.request_ip();
  v_desc    text := btrim(coalesce(p_description, ''));
  v_name    text := btrim(coalesce(p_reporter_name, ''));
  v_contact text := nullif(btrim(coalesce(p_reporter_contact, '')), '');
  v_title   text := nullif(btrim(coalesce(p_title, '')), '');
  v_id      bigint;
  v_recent  int;
  v_path_re text := '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-(raw|annotated)\.(webp|png|jpg)$';
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
    page_url, page_section, viewport, user_agent, screenshot_raw_path, screenshot_annotated_path)
  values (v_title, v_desc, v_name, v_contact,
    left(p_page_url, 500), left(p_page_section, 60), left(p_viewport, 20), left(p_user_agent, 400),
    p_raw_path, p_annotated_path)
  returning id into v_id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor)
  values (v_id, null, 'backlog', 'reporter');
  insert into private.submit_log (ip) values (v_ip);

  return jsonb_build_object('ok', true, 'code', public.ticket_code(v_id));
end $$;

revoke all on function public.submit_ticket(text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.submit_ticket(text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Admin (PIN) xoá góp ý — xoá cả lịch sử (cascade). Ảnh trong storage không xoá ở đây.
-- ---------------------------------------------------------------------------
create or replace function public.delete_ticket(p_code text, p_pin text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check jsonb;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;
  delete from public.tickets where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object('ok', true);
end $$;

revoke all on function public.delete_ticket(text, text) from public;
grant execute on function public.delete_ticket(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- set_ticket_build: thêm link nhật ký + số giây Claude chạy
-- ---------------------------------------------------------------------------
drop function if exists public.set_ticket_build(text, text, text, text, text);

create or replace function public.set_ticket_build(
  p_code        text,
  p_state       text,
  p_preview_url text default null,
  p_diff_url    text default null,
  p_note        text default null,
  p_log_url     text default null,
  p_seconds     integer default null
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
      build_note = coalesce(left(nullif(btrim(p_note), ''), 2000), build_note),
      build_log_url = coalesce(p_log_url, build_log_url),
      build_started_at = case when p_state = 'running' then now() else build_started_at end,
      build_seconds = case when p_state = 'running' then null else coalesce(p_seconds, build_seconds) end,
      build_updated_at = now()
  where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object('ok', true, 'build_status', p_state);
end $$;

revoke all on function public.set_ticket_build(text, text, text, text, text, text, integer) from public, anon, authenticated;
grant execute on function public.set_ticket_build(text, text, text, text, text, text, integer) to service_role;

-- request_build: xoá số liệu lần build trước khi xếp hàng lần mới
create or replace function public.request_build(p_code text, p_pin text, p_note text default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check jsonb;
  v_note  text := nullif(btrim(coalesce(p_note, '')), '');
  v_t     public.tickets%rowtype;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;
  if v_note is not null and char_length(v_note) > 1000 then
    return jsonb_build_object('ok', false, 'error', 'note_too_long');
  end if;

  select * into v_t from public.tickets where code = p_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_t.status not in ('backlog', 'doing') then
    return jsonb_build_object('ok', false, 'error', 'invalid_state');
  end if;
  if v_t.build_status in ('queued', 'running', 'merging') and v_t.build_updated_at > now() - interval '20 minutes' then
    return jsonb_build_object('ok', false, 'error', 'already_building');
  end if;

  if not private.dispatch_workflow('build-ticket.yml', jsonb_build_object('code', p_code, 'note', coalesce(v_note, ''))) then
    return jsonb_build_object('ok', false, 'error', 'build_not_configured');
  end if;

  update public.tickets
  set status = 'doing',
      status_changed_at = case when v_t.status <> 'doing' then now() else status_changed_at end,
      build_status = 'queued', build_note = null, preview_url = null, diff_url = null,
      build_started_at = null, build_seconds = null, build_log_url = null,
      build_requested_at = now(), build_updated_at = now()
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, 'doing', 'admin', 'Build by Claude' || coalesce(': ' || v_note, ''));

  return jsonb_build_object('ok', true, 'build_status', 'queued');
end $$;
