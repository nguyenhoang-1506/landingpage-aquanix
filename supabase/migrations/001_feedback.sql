-- ============================================================================
-- Aquanix — Góp ý (Feedback) & Phát triển sản phẩm (Roadmap)
-- Chạy toàn bộ file này một lần trong Supabase → SQL Editor.
-- Chạy lại được (idempotent) — không xoá dữ liệu đã có.
--
-- Nguyên tắc bảo mật:
--   * Client chỉ có anon key. Anon KHÔNG đọc/ghi trực tiếp bảng nào.
--   * Đọc công khai qua view tickets_public / ticket_events_public (không có reporter_contact).
--   * Mọi thao tác ghi đi qua RPC security definer, PIN kiểm tra phía server.
--   * mark_ticket_done chỉ service_role gọi được (Claude Code trên máy chủ dự án).
-- ============================================================================

create extension if not exists pgcrypto with schema extensions;
create extension if not exists unaccent with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

do $$ begin
  create type public.ticket_status as enum ('backlog', 'doing', 'done', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ticket_actor as enum ('reporter', 'admin', 'claude-code');
exception when duplicate_object then null; end $$;

-- FB-001 … FB-999, rồi FB-1000 … (không cắt số)
create or replace function public.ticket_code(p_id bigint) returns text
language sql immutable parallel safe set search_path = '' as $$
  select 'FB-' || case when p_id < 1000 then lpad(p_id::text, 3, '0') else p_id::text end
$$;

-- ---------------------------------------------------------------------------
-- Bảng
-- ---------------------------------------------------------------------------
create table if not exists public.tickets (
  id                        bigint generated always as identity primary key,
  code                      text generated always as (public.ticket_code(id)) stored unique,
  title                     text not null check (char_length(title) between 1 and 80),
  description               text not null check (char_length(description) between 10 and 2000),
  reporter_name             text not null check (char_length(reporter_name) between 2 and 60),
  reporter_contact          text check (reporter_contact is null or char_length(reporter_contact) <= 120),
  status                    public.ticket_status not null default 'backlog',
  page_url                  text check (page_url is null or char_length(page_url) <= 500),
  page_section              text check (page_section is null or char_length(page_section) <= 60),
  viewport                  text check (viewport is null or char_length(viewport) <= 20),
  user_agent                text check (user_agent is null or char_length(user_agent) <= 400),
  screenshot_raw_path       text,
  screenshot_annotated_path text,
  status_note               text check (status_note is null or char_length(status_note) <= 1000),
  commit_sha                text,
  commit_url                text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  status_changed_at         timestamptz not null default now(),
  search_text               text
);
create index if not exists tickets_status_created_idx on public.tickets (status, created_at desc);

create table if not exists public.ticket_events (
  id          bigint generated always as identity primary key,
  ticket_id   bigint not null references public.tickets (id) on delete cascade,
  from_status public.ticket_status,
  to_status   public.ticket_status not null,
  actor       public.ticket_actor not null,
  note        text,
  created_at  timestamptz not null default now()
);
create index if not exists ticket_events_ticket_idx on public.ticket_events (ticket_id, created_at);

create table if not exists private.admin_settings (
  id         int primary key default 1 check (id = 1),
  pin_hash   text not null,
  updated_at timestamptz not null default now()
);

create table if not exists private.pin_attempts (
  id         bigint generated always as identity primary key,
  ip         text not null,
  ok         boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists pin_attempts_ip_idx on private.pin_attempts (ip, created_at desc);

create table if not exists private.submit_log (
  id         bigint generated always as identity primary key,
  ip         text not null,
  created_at timestamptz not null default now()
);
create index if not exists submit_log_ip_idx on private.submit_log (ip, created_at desc);

-- PIN mặc định 8888 (chỉ seed lần đầu). Đổi PIN: xem README.
insert into private.admin_settings (id, pin_hash)
values (1, extensions.crypt('8888', extensions.gen_salt('bf')))
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- RLS + quyền: anon/authenticated không đụng trực tiếp vào bảng
-- ---------------------------------------------------------------------------
alter table public.tickets        enable row level security;
alter table public.ticket_events  enable row level security;
alter table private.admin_settings enable row level security;
alter table private.pin_attempts  enable row level security;
alter table private.submit_log    enable row level security;

revoke all on public.tickets, public.ticket_events from anon, authenticated;
revoke all on all tables in schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Trigger: search_text (không dấu) + updated_at
-- ---------------------------------------------------------------------------
create or replace function private.tickets_before_write() returns trigger
language plpgsql set search_path = '' as $$
begin
  -- cột code (generated) chưa có trong BEFORE trigger → tính lại từ id
  new.search_text := lower(extensions.unaccent('extensions.unaccent'::regdictionary,
    concat_ws(' ', public.ticket_code(new.id), new.title, new.description, new.reporter_name)));
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists tickets_before_write on public.tickets;
create trigger tickets_before_write before insert or update on public.tickets
for each row execute function private.tickets_before_write();

-- ---------------------------------------------------------------------------
-- View công khai (chạy với quyền owner → đọc được dù RLS chặn anon)
-- ---------------------------------------------------------------------------
create or replace view public.tickets_public as
select id, code, title, description, reporter_name, status,
       page_url, page_section, viewport, user_agent,
       screenshot_raw_path, screenshot_annotated_path,
       status_note, commit_sha, commit_url,
       created_at, updated_at, status_changed_at, search_text
from public.tickets;

create or replace view public.ticket_events_public as
select e.id, t.code, e.from_status, e.to_status, e.actor, e.note, e.created_at
from public.ticket_events e
join public.tickets t on t.id = e.ticket_id;

-- tickets_public là view đơn giản → Postgres cho UPDATE/INSERT xuyên qua view.
-- Thu hồi hết rồi chỉ cấp SELECT, nếu không anon sửa được bảng qua view.
revoke all on public.tickets_public, public.ticket_events_public from public, anon, authenticated;
grant select on public.tickets_public, public.ticket_events_public to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Helpers riêng tư
-- ---------------------------------------------------------------------------
create or replace function private.request_ip() returns text
language plpgsql stable set search_path = '' as $$
declare h json;
begin
  h := nullif(current_setting('request.headers', true), '')::json;
  return coalesce(
    nullif(h ->> 'cf-connecting-ip', ''),
    nullif(h ->> 'x-real-ip', ''),
    nullif(btrim(split_part(h ->> 'x-forwarded-for', ',', 1)), ''),
    'unknown');
exception when others then
  return 'unknown';
end $$;

-- Kiểm tra PIN + khoá: 5 lần sai trong 5 phút (theo IP) → khoá tới khi lần sai cũ nhất trong 5 lần đó quá 5 phút.
-- Chốt chặn thêm: toàn hệ thống sai ≥ 50 lần / 5 phút → khoá tất cả (chống đổi IP để dò PIN 4 số).
create or replace function private.check_pin(p_pin text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_ip          text := private.request_ip();
  v_last_ok     timestamptz;
  v_fifth       timestamptz;
  v_fails       int;
  v_global      int;
  v_hash        text;
  v_ok          boolean;
begin
  select max(created_at) into v_last_ok from private.pin_attempts where ip = v_ip and ok;

  select created_at into v_fifth
  from private.pin_attempts
  where ip = v_ip and not ok
    and created_at > now() - interval '5 minutes'
    and created_at > coalesce(v_last_ok, '-infinity')
  order by created_at desc
  offset 4 limit 1;

  if v_fifth is not null then
    return jsonb_build_object('ok', false, 'error', 'locked',
      'retry_after', greatest(1, ceil(extract(epoch from (v_fifth + interval '5 minutes' - now())))::int));
  end if;

  select count(*) into v_global from private.pin_attempts
  where not ok and created_at > now() - interval '5 minutes';
  if v_global >= 50 then
    return jsonb_build_object('ok', false, 'error', 'locked', 'retry_after', 300);
  end if;

  select pin_hash into v_hash from private.admin_settings where id = 1;
  v_ok := v_hash is not null
          and coalesce(p_pin, '') ~ '^[0-9]{4,8}$'
          and extensions.crypt(p_pin, v_hash) = v_hash;

  insert into private.pin_attempts (ip, ok) values (v_ip, v_ok);
  if v_ok then
    return jsonb_build_object('ok', true);
  end if;

  select count(*) into v_fails from private.pin_attempts
  where ip = v_ip and not ok
    and created_at > now() - interval '5 minutes'
    and created_at > coalesce(v_last_ok, '-infinity');

  if v_fails >= 5 then
    return jsonb_build_object('ok', false, 'error', 'locked', 'retry_after', 300);
  end if;
  return jsonb_build_object('ok', false, 'error', 'bad_pin', 'remaining', 5 - v_fails);
end $$;

revoke all on function private.request_ip() from public, anon, authenticated;
revoke all on function private.check_pin(text) from public, anon, authenticated;
revoke all on function private.tickets_before_write() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- RPC công khai
-- ---------------------------------------------------------------------------
create or replace function public.submit_ticket(
  p_description      text,
  p_reporter_name    text,
  p_reporter_contact text default null,
  p_page_url         text default null,
  p_page_section     text default null,
  p_viewport         text default null,
  p_user_agent       text default null,
  p_raw_path         text default null,
  p_annotated_path   text default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_ip      text := private.request_ip();
  v_desc    text := btrim(coalesce(p_description, ''));
  v_name    text := btrim(coalesce(p_reporter_name, ''));
  v_contact text := nullif(btrim(coalesce(p_reporter_contact, '')), '');
  v_title   text;
  v_id      bigint;
  v_recent  int;
  v_path_re text := '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-(raw|annotated)\.(webp|png|jpg)$';
begin
  if char_length(v_desc) < 10 or char_length(v_desc) > 2000 then
    return jsonb_build_object('ok', false, 'error', 'invalid_description');
  end if;
  if char_length(v_name) < 2 or char_length(v_name) > 60 then
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

  -- chống spam phía server: tối đa 10 góp ý / 10 phút / IP
  select count(*) into v_recent from private.submit_log
  where ip = v_ip and created_at > now() - interval '10 minutes';
  if v_recent >= 10 then
    return jsonb_build_object('ok', false, 'error', 'rate_limited');
  end if;

  v_title := left(btrim(split_part(v_desc, E'\n', 1)), 80);
  if v_title = '' then v_title := left(v_desc, 80); end if;

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

create or replace function public.verify_admin_pin(p_pin text) returns jsonb
language sql security definer set search_path = '' as $$
  select private.check_pin(p_pin)
$$;

create or replace function public.set_ticket_status(
  p_code   text,
  p_status text,
  p_pin    text,
  p_note   text default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check jsonb;
  v_note  text := nullif(btrim(coalesce(p_note, '')), '');
  v_t     public.tickets%rowtype;
  v_to    public.ticket_status;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;

  if p_status is null or p_status not in ('backlog', 'doing', 'done', 'failed') then
    return jsonb_build_object('ok', false, 'error', 'invalid_status');
  end if;
  v_to := p_status::public.ticket_status;

  if v_to = 'failed' and v_note is null then
    return jsonb_build_object('ok', false, 'error', 'note_required');
  end if;
  if v_note is not null and char_length(v_note) > 1000 then
    return jsonb_build_object('ok', false, 'error', 'note_too_long');
  end if;

  select * into v_t from public.tickets where code = p_code for update;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  if v_t.status = v_to and v_note is null then
    return jsonb_build_object('ok', false, 'error', 'unchanged');
  end if;

  update public.tickets
  set status = v_to,
      status_note = v_note,
      status_changed_at = case when v_t.status <> v_to then now() else status_changed_at end
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, v_to, 'admin', v_note);

  return jsonb_build_object('ok', true, 'status', v_to);
end $$;

create or replace function public.get_ticket_private(p_code text, p_pin text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_check   jsonb;
  v_contact text;
begin
  v_check := private.check_pin(p_pin);
  if not (v_check ->> 'ok')::boolean then
    return v_check;
  end if;
  select reporter_contact into v_contact from public.tickets where code = p_code;
  if not found then
    return jsonb_build_object('ok', false, 'error', 'not_found');
  end if;
  return jsonb_build_object('ok', true, 'reporter_contact', v_contact);
end $$;

-- Chỉ service_role (Claude Code chạy scripts/tickets.mjs) được set Done kèm commit.
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
      status_changed_at = case when v_t.status <> 'done' then now() else status_changed_at end
  where id = v_t.id;

  insert into public.ticket_events (ticket_id, from_status, to_status, actor, note)
  values (v_t.id, v_t.status, 'done', 'claude-code',
          coalesce(v_note, 'Commit ' || left(p_sha, 7)));

  return jsonb_build_object('ok', true, 'code', p_code, 'status', 'done');
end $$;

revoke all on function public.submit_ticket(text, text, text, text, text, text, text, text, text) from public;
revoke all on function public.verify_admin_pin(text) from public;
revoke all on function public.set_ticket_status(text, text, text, text) from public;
revoke all on function public.get_ticket_private(text, text) from public;
revoke all on function public.mark_ticket_done(text, text, text, text) from public, anon, authenticated;

grant execute on function public.submit_ticket(text, text, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.verify_admin_pin(text) to anon, authenticated;
grant execute on function public.set_ticket_status(text, text, text, text) to anon, authenticated;
grant execute on function public.get_ticket_private(text, text) to anon, authenticated;
grant execute on function public.mark_ticket_done(text, text, text, text) to service_role;

-- ---------------------------------------------------------------------------
-- Storage: bucket ảnh công khai, khách chỉ được upload (không sửa/xoá)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('feedback-screenshots', 'feedback-screenshots', true, 5242880,
        array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "feedback screenshots: anon upload" on storage.objects;
create policy "feedback screenshots: anon upload" on storage.objects
for insert to anon, authenticated
with check (
  bucket_id = 'feedback-screenshots'
  and name ~ '^[0-9]{4}/[0-9]{2}/[0-9a-f-]{36}-(raw|annotated)\.(webp|png|jpg)$'
);
