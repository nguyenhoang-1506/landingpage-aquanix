---
description: Làm một ticket góp ý (FB-xxx) từ trang Phát triển sản phẩm — đọc, sửa, chờ duyệt, push, set Done
argument-hint: "[FB-012]"
allowed-tools: Bash(node scripts/tickets.mjs:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*), Read, Edit, Write, Glob, Grep
---

Mã ticket: `$ARGUMENTS`

## Nếu KHÔNG có mã ticket
Chạy `node scripts/tickets.mjs list --status backlog,doing`, trình bày kết quả dạng bảng và hỏi chủ dự án muốn làm ticket nào. Dừng ở đó.

## Nếu có mã ticket
1. **Đọc ticket**: `node scripts/tickets.mjs show $ARGUMENTS`. Sau đó dùng Read để **xem cả hai ảnh** trong `.tickets/<MÃ>/` — `annotated.*` (vùng khoanh bút đỏ = chỗ người dùng muốn nói tới) và `raw.*` (ảnh gốc). `page_section` (vd `#sell`) cho biết section đang xem, `viewport` cho biết desktop hay mobile.
2. **Tóm tắt lại hiểu biết** cho chủ dự án, ngắn gọn:
   - Vấn đề người dùng nêu
   - Vị trí trên trang (URL / section / file + component liên quan)
   - Hướng sửa dự kiến
   Nếu mô tả mơ hồ hoặc có nhiều cách hiểu → **hỏi chủ dự án trước**, chưa sửa code.
3. **Sửa code** theo kiến trúc hiện có (trang tĩnh, React UMD + Babel, không build step; giữ font/màu/token trong `tokens/`). Kiểm tra lại ở cả desktop và mobile nếu có thể (mở trang local, chụp so sánh).
4. **Trình bày thay đổi**: `git diff` + giải thích ngắn (và ảnh trước/sau nếu có). Rồi **DỪNG, chờ chủ dự án gõ "ok"**.
   - Chủ dự án không nói "ok" (yêu cầu sửa thêm, huỷ, im lặng…) → **không commit, không push, không đổi trạng thái ticket**.
5. Sau khi có "ok":
   - `git add` đúng các file đã sửa (không add `.tickets/`, `.env.local`)
   - `git commit -m "<MÃ>: <tóm tắt ngắn>"`
   - `git push origin main`
6. **Chỉ khi push thành công**: lấy SHA bằng `git rev-parse HEAD` rồi chạy
   `node scripts/tickets.mjs done <MÃ> --sha <sha> --url https://github.com/nguyenhoang-1506/landingpage-aquanix/commit/<sha>`
   Push lỗi → báo lỗi, **không** chạy `done`.
7. Báo lại: link commit + link ticket `https://landingpage-aquanix.vercel.app/roadmap?ticket=<MÃ>`. Vercel tự deploy khi push lên `main`.

## Quy tắc
- Claude Code **chỉ** được set `Done` (qua `done` sau khi push thành công). **Không bao giờ** tự chuyển `Doing` / `Failed` — admin làm trên web.
- Không in, không commit `SUPABASE_SERVICE_ROLE_KEY`; không đưa key này vào bất kỳ file frontend nào.
- SĐT/Email người gửi (`reporter_contact`) là thông tin riêng tư — không đưa vào commit message, code hay trả lời công khai.
