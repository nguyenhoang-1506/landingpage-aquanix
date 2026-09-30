#!/usr/bin/env node
// CLI cho Claude Code làm ticket góp ý. Không cần cài thư viện (Node 18+, dùng fetch).
//   node scripts/tickets.mjs list [--status backlog,doing]
//   node scripts/tickets.mjs show FB-012
//   node scripts/tickets.mjs done FB-012 --sha <sha> --url <commit_url> [--note "..."]
// Đọc SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY từ .env.local (không commit file này).
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUCKET = 'feedback-screenshots';
const STATUSES = ['backlog', 'doing', 'done', 'failed'];

function loadEnv() {
  const env = { ...process.env };
  const file = join(ROOT, '.env.local');
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !line.trim().startsWith('#')) env[m[1]] ??= m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    fail('Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong .env.local (xem .env.example).');
  }
  return { url: env.SUPABASE_URL.replace(/\/$/, ''), key: env.SUPABASE_SERVICE_ROLE_KEY };
}

function fail(msg) { console.error('✖ ' + msg); process.exit(1); }

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      out[k] = v ?? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true);
    } else out._.push(a);
  }
  return out;
}

async function api(env, path, init = {}) {
  const headers = { apikey: env.key, 'Content-Type': 'application/json', ...init.headers };
  // service_role dạng JWT (eyJ…) cần Authorization; secret key mới (sb_secret_…) chỉ cần apikey
  if (env.key.startsWith('eyJ')) headers.Authorization = 'Bearer ' + env.key;
  const res = await fetch(env.url + path, { ...init, headers });
  const text = await res.text();
  if (!res.ok) fail(`${res.status} ${res.statusText} — ${text}`);
  return text ? JSON.parse(text) : null;
}

const normCode = c => {
  const m = String(c || '').trim().toUpperCase().match(/^(?:FB-?)?(\d+)$/);
  if (!m) fail('Mã ticket không hợp lệ: ' + c + ' (vd FB-012)');
  const n = Number(m[1]);
  return 'FB-' + (n < 1000 ? String(n).padStart(3, '0') : String(n));
};
const vnTime = d => new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short', timeStyle: 'short' }).format(new Date(d));

function table(rows, cols) {
  const w = cols.map(([k, h]) => Math.max(h.length, ...rows.map(r => String(r[k] ?? '').length)));
  const line = cells => cells.map((c, i) => String(c ?? '').padEnd(w[i])).join(' | ');
  console.log(line(cols.map(c => c[1])));
  console.log(w.map(n => '-'.repeat(n)).join('-|-'));
  rows.forEach(r => console.log(line(cols.map(([k]) => r[k]))));
}

async function list(env, args) {
  let q = '/rest/v1/tickets?select=code,status,created_at,reporter_name,title&order=created_at.desc';
  if (args.status && args.status !== true) {
    const st = String(args.status).split(',').map(s => s.trim()).filter(Boolean);
    const bad = st.filter(s => !STATUSES.includes(s));
    if (bad.length) fail('Trạng thái không hợp lệ: ' + bad.join(', '));
    q += '&status=in.(' + st.join(',') + ')';
  }
  const rows = await api(env, q);
  if (!rows.length) return console.log('Không có ticket nào.');
  table(rows.map(r => ({ ...r, created_at: vnTime(r.created_at), title: r.title.length > 60 ? r.title.slice(0, 59) + '…' : r.title })),
    [['code', 'Mã'], ['status', 'Trạng thái'], ['created_at', 'Ngày tạo'], ['reporter_name', 'Người gửi'], ['title', 'Tiêu đề']]);
}

async function download(env, path, dest) {
  const url = `${env.url}/storage/v1/object/public/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`;
  const res = await fetch(url);
  if (!res.ok) { console.error(`! Không tải được ${path}: ${res.status}`); return null; }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  return dest;
}

async function show(env, args) {
  const code = normCode(args._[1]);
  const [t] = await api(env, `/rest/v1/tickets?code=eq.${code}&select=*`);
  if (!t) fail('Không tìm thấy ' + code);
  const events = await api(env, `/rest/v1/ticket_events?ticket_id=eq.${t.id}&select=from_status,to_status,actor,note,created_at&order=created_at.asc`);
  const dir = join(ROOT, '.tickets', code);
  mkdirSync(dir, { recursive: true });
  const images = {};
  for (const [kind, p] of [['annotated', t.screenshot_annotated_path], ['raw', t.screenshot_raw_path]]) {
    if (!p) continue;
    const saved = await download(env, p, join(dir, kind + extname(p)));
    if (saved) images[kind] = relative(ROOT, saved).replace(/\\/g, '/');
  }
  delete t.search_text;
  if (args['no-contact']) delete t.reporter_contact; // CI: không đưa liên hệ người gửi cho Claude
  const out = { ...t, events, local_images: images };
  writeFileSync(join(dir, 'ticket.json'), JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  if (!Object.keys(images).length) console.error('(Ticket không có ảnh.)');
}

async function done(env, args) {
  const code = normCode(args._[1]);
  const sha = args.sha, url = args.url;
  if (!sha || sha === true || !/^[0-9a-f]{7,40}$/.test(sha)) fail('Thiếu hoặc sai --sha <commit sha>');
  if (!url || url === true || !/^https:\/\/github\.com\//.test(url)) fail('Thiếu hoặc sai --url https://github.com/.../commit/<sha>');
  const res = await api(env, '/rest/v1/rpc/mark_ticket_done', {
    method: 'POST',
    body: JSON.stringify({ p_code: code, p_sha: sha, p_url: url, p_note: args.note && args.note !== true ? String(args.note) : null }),
  });
  if (!res || !res.ok) fail('Không set Done được: ' + JSON.stringify(res));
  console.log(`✔ ${code} → Done (commit ${sha.slice(0, 7)})`);
}

// Dùng trong GitHub Actions: cập nhật tiến độ "Build by Claude"
async function build(env, args) {
  const code = normCode(args._[1]);
  const str = k => (args[k] && args[k] !== true ? String(args[k]) : null);
  let note = str('note');
  const noteFile = str('note-file');
  if (noteFile && existsSync(noteFile)) note = readFileSync(noteFile, 'utf8').trim().slice(0, 2000) || note;
  const res = await api(env, '/rest/v1/rpc/set_ticket_build', {
    method: 'POST',
    body: JSON.stringify({ p_code: code, p_state: str('state'), p_preview_url: str('preview'), p_diff_url: str('diff'), p_note: note }),
  });
  if (!res || !res.ok) fail('Không cập nhật được build: ' + JSON.stringify(res));
  console.log(`✔ ${code} build → ${res.build_status}`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
const cmds = { list, show, done, build };
if (!cmds[cmd]) {
  console.log('Cách dùng:\n  node scripts/tickets.mjs list [--status backlog,doing]\n  node scripts/tickets.mjs show FB-012\n  node scripts/tickets.mjs done FB-012 --sha <sha> --url <commit_url> [--note "..."]');
  process.exit(cmd ? 1 : 0);
}
await cmds[cmd](loadEnv(), args);
