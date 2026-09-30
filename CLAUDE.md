# CLAUDE.md

Hướng dẫn cho Claude Code khi làm việc trong repo này.

## Tổng quan
Landing page Aquanix (https://landingpage-aquanix.vercel.app/) — **trang tĩnh, không build step**: React 18 UMD + Babel standalone qua CDN.
Vercel tự deploy khi push lên `main`. `vercel.json` bật `cleanUrls` nên `/roadmap` phục vụ `roadmap.html`.

| File | Vai trò |
|---|---|
| `index.html` | Landing; nạp `header.jsx`, `hero.jsx`, `sections.jsx`, `feedback.jsx` |
| `roadmap.html` + `roadmap.jsx` + `roadmap.css` | Trang **Phát triển sản phẩm** (Kanban / Danh sách / lọc / chi tiết / admin PIN) |
| `feedback.jsx` + `feedback.css` | Nút **Góp ý** nổi: chụp viewport (html2canvas-pro) → vẽ bút đỏ → gửi ticket |
| `feedback-core.js` | Client Supabase + hàm dùng chung (`window.AqxFb`) |
| `config.js` | `SUPABASE_URL`, `SUPABASE_ANON_KEY` (anon key công khai được) |
| `supabase/migrations/001_feedback.sql` | Schema, RLS, view, RPC, bucket, seed PIN |
| `scripts/tickets.mjs` | CLI đọc/chốt ticket bằng service role (`.env.local`) |
| `tokens/*.css`, `_ds_bundle.js` | Design system (màu, font, `Button`, `FieldInput`, `StatusBadge`) |

Chạy local: phục vụ thư mục gốc bằng server tĩnh bất kỳ, vd `npx serve .` hoặc `python -m http.server`, rồi mở `/` và `/roadmap.html`.

Lưu ý khi viết JSX: `header.jsx`/`hero.jsx`/`sections.jsx` dùng preset Babel mặc định và khai báo biến toàn cục. File mới nên bọc trong IIFE và nạp với `data-presets="react"` (như `feedback.jsx`, `roadmap.jsx`) để tránh trùng tên.

## Vai trò & quyền (Góp ý / Roadmap)
- **Khách**: gửi góp ý, xem roadmap. Đọc qua view `tickets_public` (không có `reporter_contact`).
- **Admin (PIN)**: đổi trạng thái, xem SĐT/Email. PIN kiểm tra phía server trong RPC (`set_ticket_status`, `get_ticket_private`), khoá 5 phút sau 5 lần sai.
- **Claude Code**: dùng service role qua `scripts/tickets.mjs`; **chỉ được set `Done`** (RPC `mark_ticket_done`), không bao giờ tự set `Doing`/`Failed`.

## Quy trình làm ticket góp ý
Dùng slash command `/ticket` (định nghĩa ở `.claude/commands/ticket.md`):
- `/ticket` → liệt kê ticket Backlog + Doing để chọn.
- `/ticket FB-012` → đọc ticket + xem 2 ảnh trong `.tickets/FB-012/` → tóm tắt + kế hoạch → sửa code → trình bày diff → **chờ chủ dự án gõ "ok"** → commit `FB-012: <tóm tắt>` → `git push origin main` → nếu push thành công mới chạy `node scripts/tickets.mjs done FB-012 --sha <sha> --url <commit_url>`.
- Không "ok" hoặc push lỗi → không commit/không đổi trạng thái.

Điều kiện: `.env.local` có `SUPABASE_URL` và `SUPABASE_SERVICE_ROLE_KEY` (xem `.env.example`).

## Bảo mật
- `SUPABASE_SERVICE_ROLE_KEY` chỉ nằm trong `.env.local` (đã `.gitignore`). Không đưa vào `config.js`, không commit, không in ra.
- `reporter_contact` là dữ liệu riêng tư — không đưa vào commit message hay nội dung công khai.
