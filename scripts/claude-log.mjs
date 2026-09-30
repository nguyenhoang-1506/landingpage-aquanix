#!/usr/bin/env node
// Đổi nhật ký stream-json của Claude Code (mỗi dòng một JSON) thành bản dễ đọc cho GitHub Actions log.
//   node scripts/claude-log.mjs <file.jsonl>
import { readFileSync, existsSync } from 'node:fs';

const file = process.argv[2];
if (!file || !existsSync(file)) { console.log('(Không có nhật ký Claude.)'); process.exit(0); }

const short = (s, n = 600) => { s = String(s ?? '').trim(); return s.length > n ? s.slice(0, n) + ' …' : s; };
const toolLine = b => {
  const i = b.input || {};
  const target = i.file_path || i.path || i.pattern || '';
  return `🔧 ${b.name}${target ? ' → ' + target : ''}${i.pattern && i.path ? ' (trong ' + i.path + ')' : ''}`;
};

let step = 0;
for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
  if (!line.trim()) continue;
  let ev; try { ev = JSON.parse(line); } catch { continue; }
  if (ev.type === 'system' && ev.subtype === 'init') {
    console.log(`Model: ${ev.model || '?'}`);
  } else if (ev.type === 'assistant' && ev.message?.content) {
    for (const b of ev.message.content) {
      if (b.type === 'text' && b.text.trim()) console.log(`\n💬 ${short(b.text, 1500)}`);
      else if (b.type === 'tool_use') console.log(`${String(++step).padStart(2)}. ${toolLine(b)}`);
    }
  } else if (ev.type === 'result') {
    const s = Math.round((ev.duration_ms || 0) / 1000);
    console.log(`\n✅ Kết thúc: ${ev.subtype || ''} · ${Math.floor(s / 60)} phút ${s % 60} giây · ${ev.num_turns ?? '?'} lượt`);
    if (ev.is_error) console.log('⚠️ ' + short(ev.result, 800));
  }
}
