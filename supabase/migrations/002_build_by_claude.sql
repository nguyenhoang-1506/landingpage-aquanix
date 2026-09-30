-- ============================================================================
-- Aquanix — "Build by Claude": admin bấm nút trên /roadmap → GitHub Actions chạy Claude Code
-- → đẩy nhánh ticket/FB-xxx → mở Pull Request → Vercel tạo bản xem trước → admin Merge PR trên GitHub → Done.
-- Chạy sau 001_feedback.sql. Chạy lại được (idempotent).
--
-- Cần 1 secret trong Supabase Vault tên  github_dispatch_token
-- (GitHub fine-grained token, chỉ repo landingpage-aquanix, quyền Actions: Read and write).
-- ============================================================================

create extension if not exists pg_net with schema extensions;

alter table public.tickets
  add column if not exists build_status       text,
  add column if not exists preview_url        text,
  add column if not exists diff_url           text,
  add column if not exists build_note         text,
  add column if not exists build_requested_at timestamptz,
  add column if not exists build_updated_at   timestamptz;

alter table public.tickets drop constraint if exists tickets_build_status_check;
alter table public.tickets add constraint tickets_build_status_check
  check (build_status is null or build_status in ('queued', 'running', 'preview', 'merging', 'failed', 'rejected', 'merged'));

-- cột mới nối vào cuối view (create or replace giữ nguyên quyền đã cấp)
create or replace view public.tickets_public as
select id, code, title, description, reporter_name, status,
       page_url, page_section, viewport, user_agent,
       screenshot_raw_path, screenshot_annotated_path,
       status_note, commit_sha, commit_url,
       created_at, updated_at, status_changed_at, search_text,
       build_status, preview_url, diff_url, build_note, build_requested_at, build_updated_at
from public.tickets;

revoke all on public.tickets_public from public, anon, authenticated;
grant select on public.tickets_public to anon, authenticated;

-- Gọi GitHub workflow_dispatch. Trả false nếu chưa cấu hình token trong Vault.
create or replace function private.dispatch_workflow(p_file text, p_inputs jsonb) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  v_token text;
begin
  begin
    select decrypted_secret into v_token from vault.decrypted_secrets where name = 'github_dispatch_token' limit 1;
  exception when others then
    v_token := null;
  end;
  if v_token is null or btrim(v_token) = '' then
    return false;
  end if;

  perform net.http_post(
    url := 'https://api.github.com/repos/nguyenhoang-1506/landingpage-aquanix/actions/workflows/' || p_file || '/dispatches',
    body := jsonb_build_object('ref', 'main', 'inputs', p_inputs),
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || btrim(v_token),
      'Accept', 'application/vnd.github+json',
      'X-GitHub-Api-Version', '2022-11-28',
      'User-Agent', 'aquanix-feedback',
      'Content-Type', 'application/json'));
  return true;
end $$;
revoke all on function private.dispatch_workflow(text, jsonb) from public, anon, authenticated;

-- Admin (PIN) yêu cầu Claude làm ticket
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
      build_requested_at = now(), build_updated_at = now()
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, 'doing', 'admin', 'Build by Claude' || coalesce(': ' || v_note, ''));

  return jsonb_build_object('ok', true, 'build_status', 'queued');
end $$;

-- GitHub Actions (service_role) cập nhật tiến độ build
create or replace function public.set_ticket_build(
  p_code        text,
  p_state       text,
  p_preview_url text default null,
  p_diff_url    text default null,
  p_note        text default null
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
      build_updated_at = now()
  where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object('ok', true, 'build_status', p_state);
end $$;

-- mark_ticket_done: thêm build_status = merged
create or replace function public.mark_ticket_done(
  p_code text,
  p_sha  text,
  p_url  text,
  p_note text default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_t    public.tickets%rowtype;
  v_note text := nullif(btrim(coalesce(p_note, '')), '');
begin
  if p_sha is null or p_sha !~ '^[0-9a-f]{7,40}$' then
    return jsonb_build_object('ok', false, 'error', 'invalid_sha');
  end if;
  if p_url is null or p_url !~ '^https://github\.com/' then
    return jsonb_build_object('ok', false, 'error', 'invalid_url');
  end if;

  select * into v_t from public.tickets where code = p_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;

  update public.tickets
  set status = 'done',
      status_note = v_note,
      commit_sha = p_sha,
      commit_url = p_url,
      status_changed_at = case when v_t.status <> 'done' then now() else status_changed_at end,
      build_status = case when v_t.build_status is not null then 'merged' else null end,
      build_updated_at = case when v_t.build_status is not null then now() else build_updated_at end
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, 'done', 'claude-code',
          coalesce(v_note, 'Commit ' || left(p_sha, 7)));

  return jsonb_build_object('ok', true, 'code', p_code, 'status', 'done');
end $$;

revoke all on function public.request_build(text, text, text) from public;
revoke all on function public.set_ticket_build(text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.mark_ticket_done(text, text, text, text) from public, anon, authenticated;

grant execute on function public.request_build(text, text, text) to anon, authenticated;
grant execute on function public.set_ticket_build(text, text, text, text, text) to service_role;
grant execute on function public.mark_ticket_done(text, text, text, text) to service_role;
