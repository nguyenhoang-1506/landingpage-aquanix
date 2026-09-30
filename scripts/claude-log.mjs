#!/usr/bin/env node
// Đổi nhật ký stream-json của Claude Code thành:
//  - bản dễ đọc in ra GitHub Actions log
//  - (tuỳ chọn) danh sách bước ngắn gọn để hiện trên ticket: --json <out.json>
//   node scripts/claude-log.mjs <file.jsonl> [--json out.json]
import { readFileSync, existsSync, writeFileSync } from 'node:fs';

const file = process.argv[2];
const jsonOut = process.argv.indexOf('--json') > 0 ? process.argv[process.argv.indexOf('--json') + 1] : null;
if (!file || !existsSync(file)) { console.log('(Không có nhật ký Claude.)'); process.exit(0); }

const short = (s, n = 600) => { s = String(s ?? '').trim(); return s.length > n ? s.slice(0, n) + ' …' : s; };
const base = p => String(p || '').replace(/\\/g, '/').split('/').filter(Boolean).slice(-2).join('/');
// Diễn giải công cụ thành câu dễ hiểu cho người không rành kỹ thuật
function describe(b) {
  const i = b.input || {};
  const p = i.file_path || i.path || '';
  if (/\.tickets\//.test(p)) {
    if (/annotated|raw/.test(p)) return ['look', 'Xem ảnh chụp màn hình của khách'];
    if (/attachments\//.test(p)) return ['look', 'Xem tệp đính kèm: ' + base(p).split('/').pop()];
    if (/ticket\.json/.test(p)) return ['read', 'Đọc nội dung góp ý'];
    if (/summary\.md/.test(p)) return ['write', 'Viết lời nhắn gửi admin'];
    if (/admin-note/.test(p)) return ['read', 'Đọc chỉ dẫn của admin'];
  }
  switch (b.name) {
    case 'Read': return ['read', 'Đọc ' + base(p)];
    case 'Edit': case 'MultiEdit': return ['edit', 'Sửa ' + base(p)];
    case 'Write': return ['edit', 'Viết ' + base(p)];
    case 'Grep': return ['search', 'Tìm "' + short(i.pattern, 40) + '"'];
    case 'Glob': return ['search', 'Tìm tệp ' + short(i.pattern, 40)];
    default: return ['other', b.name];
  }
}

const steps = [];
let step = 0, final = null;
for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  let ev; try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === 'system' && ev.subtype === 'init') {
    console.log(`Model: ${ev.model || '?'}`);
  } else if (ev.type === 'assistant' && ev.message?.content) {
    for (const b of ev.message.content) {
      if (b.type === 'text' && b.text.trim()) {
        console.log(`\n💬 ${short(b.text, 1500)}`);
        steps.push({ k: 'think', t: short(b.text, 280) });
      } else if (b.type === 'tool_use') {
        const [k, t] = describe(b);
        console.log(`${String(++step).padStart(2)}. 🔧 ${b.name} ${b.input?.file_path || b.input?.pattern || ''}`);
        const last = steps[steps.length - 1];
        if (!(last && last.k === k && last.t === t)) steps.push({ k, t });
      }
    }
  } else if (ev.type === 'result') {
    final = ev;
    const s = Math.round((ev.duration_ms || 0) / 1000);
    console.log(`\n✅ Kết thúc: ${ev.subtype || ''} · ${Math.floor(s / 60)} phút ${s % 60} giây · ${ev.num_turns ?? '?'} lượt`);
    if (ev.is_error) console.log('⚠️ ' + short(ev.result, 800));
  }
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(steps.slice(0, 80)));
