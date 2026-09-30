# Aquanix landing page (static)

Site tĩnh hoàn chỉnh: `index.html` ở gốc + `assets/`, `tokens/`, `styles.css`, `_ds_bundle.js`, các file `.jsx`.
Không có build step — React/Babel/QR/Supabase nạp từ CDN. Deploy trên Vercel (tự deploy khi push `main`).

## Góp ý & trang Phát triển sản phẩm (`/roadmap`)

### 1. Tạo Supabase project
1. https://supabase.com → New project (region **Singapore**).
2. Project Settings → API: lấy **Project URL**, **anon / publishable key**, **service_role / secret key**.

### 2. Chạy migration
SQL Editor → dán toàn bộ `supabase/migrations/001_feedback.sql` → Run. Chạy lại được nhiều lần, không mất dữ liệu.
Migration tạo: bảng `tickets`, `ticket_events`, view công khai, RPC, bucket `feedback-screenshots`, và PIN admin mặc định **8888**.

### 3. Cấu hình frontend
Điền `config.js`:
```js
SUPABASE_URL: 'https://<project-ref>.supabase.co',
SUPABASE_ANON_KEY: '<anon / publishable key>',
```
Anon key công khai được. **Không** đặt service role key ở đây.

### 4. Cấu hình cho Claude Code (máy chủ dự án)
Copy `.env.example` → `.env.local` (đã `.gitignore`) và điền `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
```
node scripts/tickets.mjs list --status backlog,doing
node scripts/tickets.mjs show FB-001
```
Trong Claude Code: `/ticket` hoặc `/ticket FB-001` (xem `CLAUDE.md`).

### Đổi PIN admin
Nên đổi khỏi 8888 khi go-live. Chạy trong SQL Editor (thay `1234`):
```sql
update private.admin_settings set pin_hash = extensions.crypt('1234', extensions.gen_salt('bf')), updated_at = now() where id = 1;
```
Mở khoá IP đang bị khoá do nhập sai: `delete from private.pin_attempts where not ok;`

## Chạy local
```
npx serve .
```
Mở `http://localhost:3000/` và `http://localhost:3000/roadmap.html` (trên Vercel là `/roadmap`).

## Build by Claude (nút trên /roadmap)
Chạy thêm `supabase/migrations/002_build_by_claude.sql`, rồi cấu hình 3 khoá (chỉ làm một lần):

| Khoá | Đặt ở đâu | Lấy từ đâu |
|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | GitHub → repo → Settings → Secrets and variables → Actions | Chạy `claude setup-token` trong terminal (gói Claude Pro/Max) |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub → repo → Settings → Secrets and variables → Actions | Supabase → Settings → API Keys → Secret keys |
| `github_dispatch_token` | Supabase → Integrations → Vault → Add new secret | GitHub → Settings → Developer settings → Fine-grained tokens: chỉ repo này, quyền **Actions: Read and write** |

Nên bật thêm: GitHub → repo → Settings → Actions → General → **Allow GitHub Actions to create and approve pull requests** (để Claude tự mở Pull Request; nếu không bật, link "Duyệt trên GitHub" sẽ dẫn tới trang tạo Pull Request).

Quy trình: mở ticket (chế độ admin) → **Build by Claude** → chờ vài phút → **Xem bản xem trước** → **Duyệt trên GitHub** → *Merge pull request* → Vercel deploy, ticket tự chuyển Done.
