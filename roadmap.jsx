// Trang Phát triển sản phẩm: Kanban / Danh sách / bộ lọc / chi tiết ticket / chế độ admin (PIN).
(() => {
  const { Button } = window.AquanixDesignSystem_4effac;
  const F = window.AqxFb;
  const { api, STATUS, STATUS_ORDER, ACTOR } = F;
  const PAGE_SIZE = 20;
  const VI = { backlog: 'Chờ xử lý', doing: 'Đang làm', done: 'Đã xong', failed: 'Không thực hiện' };
  const SORTS = {
    created_desc: ['created_at', -1, 'Ngày tạo · mới nhất'],
    created_asc: ['created_at', 1, 'Ngày tạo · cũ nhất'],
    updated_desc: ['updated_at', -1, 'Cập nhật · mới nhất'],
    updated_asc: ['updated_at', 1, 'Cập nhật · cũ nhất'],
  };
  const DAY = 864e5;
  const isDay = d => /^\d{4}-\d{2}-\d{2}$/.test(d || '');

  function readUrl() {
    const p = new URLSearchParams(location.search);
    return {
      view: p.get('view') === 'list' ? 'list' : 'kanban',
      q: p.get('q') || '',
      from: isDay(p.get('from')) ? p.get('from') : '',
      to: isDay(p.get('to')) ? p.get('to') : '',
      status: (p.get('status') || '').split(',').filter(s => STATUS[s]),
      sort: SORTS[p.get('sort')] ? p.get('sort') : 'created_desc',
      page: Math.max(1, parseInt(p.get('page'), 10) || 1),
      ticket: p.get('ticket') || null,
    };
  }
  function toQuery(s) {
    const p = new URLSearchParams();
    if (s.view === 'list') p.set('view', 'list');
    if (s.q) p.set('q', s.q);
    if (s.from) p.set('from', s.from);
    if (s.to) p.set('to', s.to);
    if (s.view === 'list' && s.status.length) p.set('status', s.status.join(','));
    if (s.view === 'list' && s.sort !== 'created_desc') p.set('sort', s.sort);
    if (s.view === 'list' && s.page > 1) p.set('page', String(s.page));
    if (s.ticket) p.set('ticket', s.ticket);
    const q = p.toString();
    return location.pathname + (q ? '?' + q : '');
  }
  const PRESETS = [['today', 'Hôm nay', 0], ['7', '7 ngày', 6], ['30', '30 ngày', 29]];
  const presetRange = n => ({ from: F.vnDay(Date.now() - n * DAY), to: F.vnDay(Date.now()) });

  const Ico = {
    search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
    lock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>,
    unlock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></svg>,
    board: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="10" y="4" width="5" height="10" rx="1.5" /><rect x="17" y="4" width="4" height="13" rx="1.5" /></svg>,
    list: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>,
  };

  function Badge({ status }) {
    const m = STATUS[status] || STATUS.backlog;
    return <span className="rm-badge" style={{ background: m.bg, color: m.color }}><span className="rm-dot" style={{ background: m.dot, width: 8, height: 8 }}></span>{m.label}</span>;
  }
  function Thumb({ t, className }) {
    const src = F.publicUrl(t.screenshot_annotated_path || t.screenshot_raw_path);
    return src ? <img className={className} src={src} alt="" loading="lazy" decoding="async" /> : <div className={className} aria-hidden="true"></div>;
  }
  function pageLabel(t) {
    let path = '';
    try { path = new URL(t.page_url).pathname.replace(/\.html$/, '').replace(/\/index$/, '/'); } catch (e) {}
    return [path || '—', t.page_section].filter(Boolean).join(' · ');
  }
  const openKeys = fn => e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } };

  function useMedia(q) {
    const [m, setM] = React.useState(() => window.matchMedia(q).matches);
    React.useEffect(() => { const mq = window.matchMedia(q), h = () => setM(mq.matches); mq.addEventListener('change', h); return () => mq.removeEventListener('change', h); }, [q]);
    return m;
  }
  // Esc cho lớp trên cùng: bắt ở capture phase rồi chặn lan xuống drawer/trang
  function useEscTop(fn) {
    React.useEffect(() => {
      const h = e => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); fn(); } };
      document.addEventListener('keydown', h, true);
      return () => document.removeEventListener('keydown', h, true);
    }, [fn]);
  }

  // ---------------------------------------------------------------- Kanban
  function Board({ items, onOpen, onMove, canDrag }) {
    const [drag, setDrag] = React.useState(null);
    const [over, setOver] = React.useState(null);
    return <div className="rm-board">
      {STATUS_ORDER.map(s => {
        const col = items.filter(t => t.status === s).sort((a, b) => (a.created_at < b.created_at ? 1 : -1)); // mới nhất trên cùng
        const m = STATUS[s];
        return <section key={s} className={'rm-col' + (over === s && drag && drag.status !== s ? ' over' : '')} aria-label={m.label} data-status={s}
          onDragOver={e => { if (drag && drag.status !== s) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(s); } }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(o => (o === s ? null : o)); }}
          onDrop={e => { e.preventDefault(); const t = drag; setDrag(null); setOver(null); if (t && t.status !== s) onMove(t, s); }}>
          <div className="rm-col-h"><span className="rm-dot" style={{ background: m.dot }}></span>{m.label}<span className="rm-muted" style={{ fontWeight: 400, fontSize: 13 }}>{VI[s]}</span><span className="rm-count">{col.length}</span></div>
          <div className="rm-col-bar" style={{ background: m.dot }}></div>
          {col.length === 0 && <div className="rm-col-empty">Trống</div>}
          {col.map(t => <div key={t.code} role="button" tabIndex={0} className={'rm-card' + (drag && drag.code === t.code ? ' dragging' : '')} data-status={t.status}
            draggable={canDrag} onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.code); setDrag(t); }}
            onDragEnd={() => { setDrag(null); setOver(null); }}
            onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))} aria-label={t.code + ': ' + t.title}>
            {s !== 'done' && s !== 'failed' && <Thumb t={t} className="rm-card-img" />}
            <div className="rm-card-b">
              <span className="rm-code">{t.code}</span>
              <p className="rm-clamp" style={{ fontWeight: 600 }}>{t.title}</p>
              {(isBuilding(t) || t.build_status === 'preview') && <span className="rm-badge" style={{ alignSelf: 'flex-start', background: BUILD[t.build_status][1], color: BUILD[t.build_status][2] }}>{t.build_status === 'preview' ? 'Claude xong — chờ duyệt' : 'Claude đang làm…'}</span>}
              <div className="rm-meta"><span>{t.reporter_name}</span><span title={F.fmtFull(t.created_at)}>{F.relTime(t.created_at)}</span></div>
            </div>
          </div>)}
        </section>;
      })}
    </div>;
  }

  // ---------------------------------------------------------------- Danh sách
  function List({ items, sort, page, onSort, onPage, onOpen }) {
    const pages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const p = Math.min(page, pages);
    const rows = items.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
    const sortTh = (field, label) => {
      const [f, dir] = SORTS[sort];
      const on = f === field;
      const next = field === 'created_at' ? (on && dir < 0 ? 'created_asc' : 'created_desc') : (on && dir < 0 ? 'updated_asc' : 'updated_desc');
      return <th aria-sort={on ? (dir < 0 ? 'descending' : 'ascending') : 'none'}><button type="button" className="rm-sort" onClick={() => onSort(next)}>{label}<span aria-hidden="true">{on ? (dir < 0 ? '↓' : '↑') : '↕'}</span></button></th>;
    };
    return <>
      <div className="rm-table-wrap"><table className="rm-table">
        <thead><tr><th>Mã</th><th>Ảnh</th><th>Mô tả</th><th>Người gửi</th><th>Trang / Section</th><th>Trạng thái</th>{sortTh('created_at', 'Ngày tạo')}{sortTh('updated_at', 'Cập nhật')}</tr></thead>
        <tbody>{rows.map(t => <tr key={t.code} tabIndex={0} data-status={t.status} onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))}>
          <td><span className="rm-code">{t.code}</span></td>
          <td><Thumb t={t} className="rm-thumb" /></td>
          <td style={{ maxWidth: 340 }}><p className="rm-clamp" style={{ fontWeight: 600 }}>{t.title}</p></td>
          <td>{t.reporter_name}</td>
          <td className="rm-muted">{pageLabel(t)}</td>
          <td><Badge status={t.status} /></td>
          <td className="rm-muted" title={F.fmtFull(t.created_at)} style={{ whiteSpace: 'nowrap' }}>{F.fmtDate(t.created_at)}</td>
          <td className="rm-muted" title={F.fmtFull(t.updated_at)} style={{ whiteSpace: 'nowrap' }}>{F.relTime(t.updated_at)}</td>
        </tr>)}</tbody>
      </table></div>
      <div className="rm-mlist">{rows.map(t => <div key={t.code} role="button" tabIndex={0} className="rm-mcard" data-status={t.status} onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))}>
        <Thumb t={t} className="rm-thumb" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}><span className="rm-code">{t.code}</span><Badge status={t.status} /></div>
          <p className="rm-clamp" style={{ fontWeight: 600 }}>{t.title}</p>
          <div className="rm-meta"><span>{t.reporter_name} · {pageLabel(t)}</span><span>{F.relTime(t.created_at)}</span></div>
        </div>
      </div>)}</div>
      {pages > 1 && <nav className="rm-pager" aria-label="Phân trang">
        <Button size="sm" variant="secondary" disabled={p <= 1} onClick={() => onPage(p - 1)}>‹ Trước</Button>
        <span>Trang {p}/{pages} · {items.length} ticket</span>
        <Button size="sm" variant="secondary" disabled={p >= pages} onClick={() => onPage(p + 1)}>Sau ›</Button>
      </nav>}
    </>;
  }

  // ---------------------------------------------------------------- Hộp thoại
  function Modal({ title, onClose, children, label }) {
    useEscTop(onClose);
    return <div className="rm-modal-back" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="rm-modal" role="dialog" aria-modal="true" aria-label={label || title}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>;
  }

  function PinDialog({ onDone }) {
    const [pin, setPin] = React.useState('');
    const [err, setErr] = React.useState(null);
    const [busy, setBusy] = React.useState(false);
    const [lockUntil, setLockUntil] = React.useState(0);
    const [, tick] = React.useState(0);
    const left = Math.ceil((lockUntil - Date.now()) / 1000);
    React.useEffect(() => {
      if (lockUntil <= Date.now()) return;
      const t = setInterval(() => { tick(x => x + 1); if (Date.now() >= lockUntil) clearInterval(t); }, 1000);
      return () => clearInterval(t);
    }, [lockUntil]);
    const cancel = React.useCallback(() => onDone(false), [onDone]);
    async function submit(e) {
      e.preventDefault();
      if (!/^\d{4}$/.test(pin)) return setErr('Nhập đủ 4 số.');
      setBusy(true); setErr(null);
      try {
        const res = await api.verifyPin(pin);
        if (res && res.ok) { F.admin.set(pin); onDone(true); return; }
        if (res && res.error === 'locked') { setLockUntil(Date.now() + (res.retry_after || 300) * 1000); setErr(null); }
        else setErr('Mã PIN không đúng.' + (res && res.remaining != null ? ` Còn ${res.remaining} lần thử.` : ''));
        setPin('');
      } catch (ex) { setErr(F.errText(ex)); }
      setBusy(false);
    }
    return <Modal title="Chế độ admin" onClose={cancel}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        <p className="t-body" style={{ margin: 0, color: 'var(--ink-muted)' }}>Nhập mã PIN 4 số để đổi trạng thái ticket và xem liên hệ người gửi.</p>
        <input className="rm-input rm-pin" type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4} autoComplete="off" autoFocus aria-label="Mã PIN"
          value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} disabled={busy || left > 0} />
        {left > 0 && <p className="rm-err" role="alert">Nhập sai quá 5 lần. Thử lại sau {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}.</p>}
        {err && <p className="rm-err" role="alert">{err}</p>}
        <div className="rm-actions">
          <Button variant="secondary" onClick={cancel}>Huỷ</Button>
          <Button type="submit" disabled={busy || left > 0 || pin.length !== 4}>{busy ? 'Đang kiểm tra…' : 'Mở khoá'}</Button>
        </div>
      </form>
    </Modal>;
  }

  function StatusForm({ ticket, initialTo, onApply, onCancel, compact }) {
    const [to, setTo] = React.useState(initialTo || ticket.status);
    const [note, setNote] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState(null);
    const needNote = to === 'failed';
    async function submit(e) {
      e.preventDefault();
      if (needNote && !note.trim()) return setErr('Chuyển sang Failed cần ghi lý do.');
      if (to === ticket.status && !note.trim()) return setErr('Chọn trạng thái khác hoặc thêm ghi chú.');
      setBusy(true); setErr(null);
      const r = await onApply(ticket, to, note.trim());
      setBusy(false);
      if (r && r.ok) { setNote(''); } else setErr(r ? r.message : 'Có lỗi xảy ra.');
    }
    return <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {!compact && <p className="t-body" style={{ margin: 0 }}><b>{ticket.code}</b>: {STATUS[ticket.status].label} → {STATUS[to].label}</p>}
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="rm-lbl">Trạng thái</span>
        <select className="rm-select" value={to} onChange={e => { setTo(e.target.value); setErr(null); }}>
          {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS[s].label} — {VI[s]}</option>)}
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="rm-lbl">{needNote ? 'Lý do *' : 'Ghi chú (không bắt buộc)'}</span>
        <textarea className="rm-textarea" value={note} maxLength={1000} onChange={e => { setNote(e.target.value); setErr(null); }} placeholder={needNote ? 'Vì sao không thực hiện góp ý này?' : ''} />
      </label>
      {err && <p className="rm-err" role="alert">{err}</p>}
      <div className="rm-actions">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Huỷ</Button>}
        <Button type="submit" disabled={busy}>{busy ? 'Đang lưu…' : 'Cập nhật trạng thái'}</Button>
      </div>
    </form>;
  }

  // ---------------------------------------------------------------- Build by Claude
  const BUILD = {
    queued: ['Đã gửi yêu cầu, đang chờ Claude bắt đầu…', 'var(--accent-100)', 'var(--accent-600)'],
    running: ['Claude đang phân tích và sửa…', 'var(--accent-100)', 'var(--accent-600)'],
    preview: ['Claude đã sửa xong — chờ duyệt', 'var(--brand-50)', 'var(--brand-700)'],
    merging: ['Đang đưa lên trang chính thức… (khoảng 1 phút)', 'var(--accent-100)', 'var(--accent-600)'],
    failed: ['Claude chưa sửa — xem lời nhắn bên dưới', 'var(--warning-bg)', 'var(--warning)'],
    rejected: ['Bản xem trước đã bị từ chối', 'var(--surface-sunken)', 'var(--ink-muted)'],
    merged: ['Đã đưa lên trang chính thức', '#E6F4EC', '#2E7D5B'],
  };
  const BUILD_STALE = 20 * 60 * 1000; // quá 20 phút không cập nhật → coi như treo, cho bấm lại
  const isBuilding = t => ['queued', 'running', 'merging'].includes(t.build_status) && Date.now() - new Date(t.build_updated_at || 0).getTime() < BUILD_STALE;

  // Báo cáo của Claude là Markdown (tiêu đề, chữ đậm, danh sách, bảng, ảnh trước/sau) → HTML đã lọc an toàn.
  // Nội dung có thể bị ảnh hưởng bởi góp ý của người lạ nên luôn qua DOMPurify.
  function mdToHtml(text) {
    const src = String(text || '');
    if (!window.marked || !window.DOMPurify) return null;
    const html = window.marked.parse(src, { gfm: true, breaks: true });
    return window.DOMPurify.sanitize(html, { ADD_ATTR: ['target'], FORBID_TAGS: ['style', 'form', 'input', 'iframe'] });
  }
  function Md({ text, onImage }) {
    const html = React.useMemo(() => mdToHtml(text), [text]);
    const ref = React.useRef(null);
    React.useEffect(() => {
      const el = ref.current; if (!el) return;
      el.querySelectorAll('a[href]').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
      el.querySelectorAll('img').forEach(img => { img.loading = 'lazy'; });
      el.querySelectorAll('table').forEach(t => { if (!t.parentElement.classList.contains('rm-md-table')) { const w = document.createElement('div'); w.className = 'rm-md-table'; t.replaceWith(w); w.appendChild(t); } });
    }, [html]);
    if (html == null) return <p className="rm-md" style={{ whiteSpace: 'pre-wrap' }}>{text}</p>;
    return <div ref={ref} className="rm-md" dangerouslySetInnerHTML={{ __html: html }}
      onClick={e => { if (e.target.tagName === 'IMG' && onImage) { e.preventDefault(); onImage(e.target.src); } }} />;
  }
  // Các bước Claude đã làm (thu gọn, bấm để xem)
  const STEP_ICON = { think: '💭', read: '📖', look: '👀', search: '🔎', edit: '✏️', write: '📝', other: '•' };
  function BuildSteps({ steps }) {
    if (!Array.isArray(steps) || !steps.length) return null;
    const n = steps.filter(s => s.k !== 'think').length;
    return <details className="rm-steps">
      <summary>Các bước Claude đã làm <span className="rm-muted">({n} thao tác)</span></summary>
      <ol>{steps.map((s, i) => <li key={i} className={'k-' + s.k}><span aria-hidden="true">{STEP_ICON[s.k] || '•'}</span><span>{s.t}</span></li>)}</ol>
    </details>;
  }
  const fmtDur = sec => { sec = Math.max(0, Math.round(sec)); const m = Math.floor(sec / 60), r = sec % 60; return m ? `${m} phút ${String(r).padStart(2, '0')} giây` : `${r} giây`; };

  // Số phút giây Claude đã suy nghĩ: đang chạy thì đếm trực tiếp, xong thì hiện tổng
  function BuildTimer({ ticket, building }) {
    const [, tick] = React.useState(0);
    const live = building && ticket.build_status === 'running' && ticket.build_started_at;
    React.useEffect(() => { if (!live) return; const t = setInterval(() => tick(x => x + 1), 1000); return () => clearInterval(t); }, [live]);
    if (live) return <span className="rm-timer">⏱ Claude đã suy nghĩ {fmtDur((Date.now() - new Date(ticket.build_started_at).getTime()) / 1000)}</span>;
    if (building) return <span className="rm-timer">⏱ Đang khởi động máy chủ…</span>;
    if (ticket.build_seconds != null) return <span className="rm-timer">⏱ Claude đã suy nghĩ {fmtDur(ticket.build_seconds)}</span>;
    return null;
  }

  // Mục thu gọn / mở rộng được, nhớ trạng thái theo từng mục
  function Section({ id, title, right, defaultOpen = true, children }) {
    const key = 'aqx_rm_sec_' + id;
    const [open, setOpen] = React.useState(() => { const v = F.store.get(key); return v == null ? defaultOpen : v === '1'; });
    const toggle = () => setOpen(o => { F.store.set(key, o ? '0' : '1'); return !o; });
    return <section className={'rm-sec' + (open ? ' open' : '')}>
      <header className="rm-sec-h">
        <button type="button" className="rm-sec-toggle" onClick={toggle} aria-expanded={open}>
          <span className="rm-sec-caret" aria-hidden="true">▸</span>{title}
        </button>
        {right && <div className="rm-sec-right">{right}</div>}
      </header>
      {open && <div className="rm-sec-b">{children}</div>}
    </section>;
  }

  // Thanh tiến trình: Tiếp nhận → Claude xử lý → Chờ duyệt → Hoàn thành
  function Stepper({ t }) {
    const bs = t.build_status, building = isBuilding(t);
    let cur = 0;
    if (t.status === 'done') cur = 4;
    else if (t.status === 'failed') cur = 3;
    else if (bs === 'preview' || bs === 'merging') cur = 2;
    else if (t.status === 'doing') cur = 1;
    const failed = t.status === 'failed';
    const steps = [
      ['Tiếp nhận', F.fmtFull(t.created_at)],
      ['Claude xử lý', building && bs !== 'merging' ? 'Đang làm…' : t.build_started_at ? F.fmtFull(t.build_started_at) : t.status === 'doing' ? 'Đang xử lý' : ''],
      ['Chờ duyệt', bs === 'merging' ? 'Đang đưa lên…' : bs === 'preview' ? 'Có bản xem trước' : ''],
      [failed ? 'Không thực hiện' : 'Hoàn thành', (t.status === 'done' || failed) ? F.fmtFull(t.status_changed_at) : ''],
    ];
    return <ol className="rm-stepper" aria-label="Tiến trình">
      {steps.map(([label, sub], i) => {
        const state = i < cur || (i === 3 && cur === 4) ? 'done' : i === cur ? 'cur' : 'todo';
        const cls = 'rm-step ' + state + (failed && i === 3 ? ' failed' : '');
        return <li key={i} className={cls}>
          <span className="rm-step-dot" aria-hidden="true">{state === 'done' ? '✓' : failed && i === 3 ? '✕' : i + 1}</span>
          <span className="rm-step-txt"><b>{label}</b>{sub && <small>{sub}</small>}</span>
        </li>;
      })}
    </ol>;
  }

  // Menu "Thêm hành động"
  function MoreMenu({ items }) {
    const [open, setOpen] = React.useState(false);
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (!open) return;
      const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener('mousedown', h);
      return () => document.removeEventListener('mousedown', h);
    }, [open]);
    const list = items.filter(Boolean);
    if (!list.length) return null;
    return <div className="rm-more" ref={ref}>
      <button type="button" className="rm-btn ghost" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>Thêm hành động <span aria-hidden="true">▾</span></button>
      {open && <div className="rm-menu" role="menu">
        {list.map(([label, fn, danger]) => <button key={label} type="button" role="menuitem" className={danger ? 'danger' : ''} onClick={() => { setOpen(false); fn(); }}>{label}</button>)}
      </div>}
    </div>;
  }

  // Nội dung mục "Claude xử lý": trạng thái, báo cáo (Markdown), các bước, phản hồi để Claude sửa tiếp
  function ClaudePanel({ ticket, isAdmin, onImage, note, setNote, onSend, busy, err, canBuild }) {
    const bs = ticket.build_status, meta = BUILD[bs], building = isBuilding(ticket);
    return <div className="rm-claude">
      {meta && <p className="fb-alert rm-claude-status" style={{ background: meta[1], color: meta[2] }}>
        {building && <span className="fb-spin" aria-hidden="true" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: 'currentColor' }}></span>}
        <b>{meta[0]}</b>
      </p>}
      {!bs && <p className="rm-muted" style={{ margin: 0 }}>{isAdmin ? 'Claude chưa xử lý góp ý này. Bấm Build by Claude ở góc trên để bắt đầu.' : 'Góp ý này chưa được xử lý.'}</p>}
      {ticket.build_note && !building && <div className="rm-claude-note">
        <div className="rm-claude-head"><span className="rm-claude-avatar" aria-hidden="true">✳</span><b>Claude</b>
          {ticket.build_seconds != null && <span className="rm-muted" style={{ fontWeight: 400, fontSize: 13 }}>· suy nghĩ {fmtDur(ticket.build_seconds)}</span>}</div>
        <Md text={ticket.build_note} onImage={onImage} />
      </div>}
      {!building && <BuildSteps steps={ticket.build_steps} />}
      {bs === 'preview' && <div className="rm-review-links">
        {ticket.preview_url && <a href={ticket.preview_url} target="_blank" rel="noopener">Mở bản xem trước ↗</a>}
        {ticket.diff_url && <a href={ticket.diff_url} target="_blank" rel="noopener" className="rm-muted">Xem thay đổi trên GitHub ↗</a>}
      </div>}
      {canBuild && isAdmin && <div className="rm-reply">
        <textarea className="rm-textarea" value={note} maxLength={1000} onChange={e => setNote(e.target.value)}
          placeholder={bs ? 'Phản hồi cho Claude để sửa tiếp, ví dụ: giữ câu hỏi cũ, chỉ đổi câu trả lời…' : 'Chỉ dẫn thêm cho Claude (không bắt buộc), ví dụ: chỉ sửa trên điện thoại.'} />
        <div className="rm-reply-bar">
          {err ? <span className="rm-err" role="alert">{err}</span> : <span className="rm-muted" style={{ fontSize: 13 }}>{bs ? 'Claude sẽ làm lại từ bản mới nhất, kèm phản hồi của bạn.' : ''}</span>}
          <Button size="sm" variant="accent" disabled={busy} onClick={onSend}>{busy ? 'Đang gửi…' : bs ? 'Gửi & build lại' : 'Build by Claude'}</Button>
        </div>
      </div>}
    </div>;
  }

  function Lightbox({ src, onClose }) {
    useEscTop(onClose);
    return <div className="rm-light" role="dialog" aria-modal="true" aria-label="Ảnh phóng to" onClick={onClose}><img src={src} alt="Ảnh chụp màn hình" /></div>;
  }

  // ---------------------------------------------------------------- Chi tiết
  // Tệp khách gửi kèm: ảnh hiện lưới (bấm để phóng to), tài liệu hiện dạng thẻ mở trong tab mới
  function Attachments({ list, onImage }) {
    if (!Array.isArray(list) || !list.length) return null;
    const isImg = a => (a.type || '').startsWith('image/');
    const imgs = list.filter(isImg), docs = list.filter(a => !isImg(a));
    return <div className="rm-atts">
      <span className="rm-lbl">Tệp đính kèm ({list.length})</span>
      {imgs.length > 0 && <div className="rm-att-grid">{imgs.map(a => { const u = F.publicUrl(a.path); return <button key={a.path} type="button" onClick={() => onImage(u)} title={a.name}><img src={u} alt={a.name} loading="lazy" /></button>; })}</div>}
      {docs.map(a => <a key={a.path} className="rm-att-doc" href={F.publicUrl(a.path)} target="_blank" rel="noopener">
        <span aria-hidden="true">{(a.type || '').includes('pdf') ? 'PDF' : 'TXT'}</span>{a.name}
      </a>)}
    </div>;
  }
  // Admin sửa nội dung phiếu (Backlog / Doing)
  function EditForm({ ticket, onSave, onCancel }) {
    const [t, setT] = React.useState(ticket.title);
    const [d, setD] = React.useState(ticket.description);
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState(null);
    async function save(e) {
      e.preventDefault();
      if (t.trim().length < 5) return setErr('Vấn đề gặp phải cần ít nhất 5 ký tự.');
      if (d.trim().length < 10) return setErr('Mô tả cần ít nhất 10 ký tự.');
      setBusy(true); setErr(null);
      const r = await onSave(t.trim(), d.trim());
      setBusy(false);
      if (!r || !r.ok) setErr(r ? r.message : 'Có lỗi xảy ra.');
    }
    return <form className="rm-box" onSubmit={save}>
      <h3>Sửa nội dung phiếu</h3>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="rm-lbl">Vấn đề gặp phải</span>
        <input className="rm-input" value={t} maxLength={150} onChange={e => setT(e.target.value)} autoFocus /></label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="rm-lbl">Mô tả và gợi ý giải quyết</span>
        <textarea className="rm-textarea" style={{ minHeight: 140 }} value={d} maxLength={2000} onChange={e => setD(e.target.value)} /></label>
      {err && <p className="rm-err" role="alert">{err}</p>}
      <div className="rm-actions"><Button variant="secondary" onClick={onCancel} disabled={busy}>Huỷ</Button><Button type="submit" disabled={busy}>{busy ? 'Đang lưu…' : 'Lưu'}</Button></div>
    </form>;
  }

  function Drawer({ code, ticket, loaded, isAdmin, version, onClose, askAdmin, onApply, onBuild, onDelete, onReview, onEdit }) {
    const [events, setEvents] = React.useState(null);
    const [contact, setContact] = React.useState(undefined);
    const [which, setWhich] = React.useState('annotated');
    const [zoom, setZoom] = React.useState(null); // src ảnh đang phóng to
    const [editing, setEditing] = React.useState(false);
    const [full, setFull] = React.useState(() => F.store.get('aqx_rm_full') === '1');
    const [note, setNote] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState(null);
    const closeRef = React.useRef(null);
    const claudeRef = React.useRef(null);
    const toggleFull = () => setFull(f => { F.store.set('aqx_rm_full', f ? '0' : '1'); return !f; });

    React.useEffect(() => { closeRef.current && closeRef.current.focus(); }, []);
    React.useEffect(() => {
      const h = e => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', h);
      return () => document.removeEventListener('keydown', h);
    }, [onClose]);
    React.useEffect(() => {
      if (!ticket) return;
      let off = false;
      api.listEvents(code).then(ev => { if (!off) setEvents(ev); }).catch(() => { if (!off) setEvents([]); });
      return () => { off = true; };
    }, [code, !!ticket, version]);
    React.useEffect(() => {
      setContact(undefined);
      const pin = F.admin.pin();
      if (!ticket || !isAdmin || !pin) return;
      let off = false;
      api.getPrivate(code, pin).then(r => {
        if (off) return;
        if (r && r.ok) setContact(r.reporter_contact || null);
        else { if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear(); setContact(undefined); }
      }).catch(() => {});
      return () => { off = true; };
    }, [code, !!ticket, isAdmin]);

    const ensureAdmin = async () => F.admin.pin() || (await askAdmin());
    async function run(fn) { setBusy(true); setErr(null); const r = await fn(); setBusy(false); if (!r || !r.ok) setErr(r ? r.message : 'Có lỗi xảy ra.'); return r; }
    async function build() {
      if (!(await ensureAdmin())) return;
      const r = await run(() => onBuild(ticket, note.trim()));
      if (r && r.ok) setNote('');
    }
    async function review(approve) {
      if (!(await ensureAdmin())) return;
      if (!window.confirm(approve ? 'Đưa thay đổi này lên trang chính thức? Khách sẽ thấy sau khoảng 1 phút.' : 'Từ chối bản xem trước này? Thay đổi của Claude sẽ bị bỏ.')) return;
      run(() => onReview(ticket, approve));
    }
    async function del() {
      if (!(await ensureAdmin())) return;
      if (!window.confirm(`Xoá hẳn góp ý ${code}? Không khôi phục lại được.`)) return;
      run(() => onDelete(ticket));
    }
    const focusClaude = () => { F.store.set('aqx_rm_sec_claude', '1'); claudeRef.current && claudeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

    const t = ticket;
    const ann = t && F.publicUrl(t.screenshot_annotated_path);
    const raw = t && F.publicUrl(t.screenshot_raw_path);
    const img = which === 'raw' ? (raw || ann) : (ann || raw);
    const building = t && isBuilding(t);
    const bs = t && t.build_status;
    const open = t && ['backlog', 'doing'].includes(t.status);
    const canBuild = open && !building;

    // Nút hành động chính ở góc phải trên
    let cta = null;
    if (t && !isAdmin) cta = <button type="button" className="rm-btn" onClick={() => askAdmin()}>{Ico.lock} Chế độ admin</button>;
    else if (t && bs === 'preview') cta = <>
      <button type="button" className="rm-btn ok" disabled={busy} onClick={() => review(true)}>✓ Duyệt & đưa lên</button>
      <button type="button" className="rm-btn no" disabled={busy} onClick={() => review(false)}>✕ Từ chối</button>
    </>;
    else if (t && building) cta = <button type="button" className="rm-btn" disabled><span className="fb-spin" aria-hidden="true" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: 'currentColor' }}></span> {bs === 'merging' ? 'Đang đưa lên…' : 'Claude đang làm…'}</button>;
    else if (t && canBuild) cta = <button type="button" className="rm-btn claude" disabled={busy} onClick={bs ? focusClaude : build}>✳ {bs ? 'Build lại bằng Claude' : 'Build by Claude'}</button>;

    const more = t && isAdmin ? [
      open && ['Sửa nội dung phiếu', () => setEditing(true)],
      bs === 'preview' && canBuild && ['Phản hồi để Claude sửa tiếp', focusClaude],
      t.preview_url && bs === 'preview' && ['Mở bản xem trước', () => window.open(t.preview_url, '_blank', 'noopener')],
      t.diff_url && ['Xem thay đổi trên GitHub', () => window.open(t.diff_url, '_blank', 'noopener')],
      t.build_log_url && ['Xem nhật ký Claude', () => window.open(t.build_log_url, '_blank', 'noopener')],
      t.commit_url && ['Xem commit đã đưa lên', () => window.open(t.commit_url, '_blank', 'noopener')],
      t.status !== 'done' && ['Xoá góp ý', del, true],
    ] : [];

    return <>
      <div className="rm-back" onClick={onClose}></div>
      <aside className={'rm-drawer v2' + (full ? ' full' : '')} role="dialog" aria-modal="true" aria-label={'Chi tiết ' + code}>
        <header className="rm-dh">
          <div className="rm-dh-top">
            <div className="rm-dh-title">
              <div className="rm-dh-sub"><span className="rm-code">{code}</span>{t && <Badge status={t.status} />}{t && <span className="rm-muted">{t.reporter_name} · {F.relTime(t.created_at)}</span>}</div>
              <h2>{t ? t.title : code}</h2>
            </div>
            <div className="rm-dh-actions">
              {cta}
              <MoreMenu items={more} />
              <button type="button" className="rm-icon" onClick={toggleFull} title={full ? 'Thu nhỏ' : 'Mở rộng toàn màn hình'} aria-label={full ? 'Thu nhỏ' : 'Mở rộng toàn màn hình'}>{full ? '⤡' : '⤢'}</button>
              <button ref={closeRef} type="button" className="rm-icon" onClick={onClose} aria-label="Đóng">×</button>
            </div>
          </div>
          {err && <p className="rm-err" role="alert" style={{ margin: '8px 0 0' }}>{err}</p>}
          {t && <Stepper t={t} />}
        </header>
        <div className="rm-db">
          {!t ? <div className="rm-empty"><h3>{loaded ? 'Không tìm thấy ticket' : 'Đang tải…'}</h3>{loaded && <p>Mã {code} không tồn tại hoặc đã bị xoá.</p>}</div> : <>
            <Section id="info" title="Thông tin phiếu" right={isAdmin && open && !editing && <button type="button" className="rm-link" onClick={() => setEditing(true)}>Sửa nội dung</button>}>
              {editing
                ? <EditForm ticket={t} onCancel={() => setEditing(false)} onSave={async (a, b) => { const r = await onEdit(t, a, b); if (r && r.ok) setEditing(false); return r; }} />
                : <div className="rm-info-desc">
                  <span className="rm-lbl">Mô tả và gợi ý</span>
                  <p className="rm-desc">{t.description}</p>
                </div>}
              <div className="rm-info-grid">
                {img && <div className="rm-info-shot">
                  {ann && raw && <div className="rm-seg" role="group" aria-label="Chọn ảnh">
                    <button type="button" aria-pressed={which === 'annotated'} onClick={() => setWhich('annotated')}>Ảnh đã vẽ</button>
                    <button type="button" aria-pressed={which === 'raw'} onClick={() => setWhich('raw')}>Ảnh gốc</button>
                  </div>}
                  <img className="rm-shot" src={img} alt={'Ảnh chụp màn hình của ' + code} onClick={() => setZoom(img)} />
                </div>}
                <dl className="rm-dl">
                  <dt>Người gửi</dt><dd>{t.reporter_name}</dd>
                  {isAdmin && <><dt>SĐT / Email</dt><dd>{contact === undefined ? '…' : contact || <span className="rm-muted">Không để lại</span>}</dd></>}
                  <dt>Ngày tạo</dt><dd>{F.fmtFull(t.created_at)}</dd>
                  <dt>Cập nhật</dt><dd>{F.fmtFull(t.updated_at)}</dd>
                  <dt>Trang</dt><dd>{t.page_url ? <a href={t.page_url} target="_blank" rel="noopener">{pageLabel(t)}</a> : '—'}</dd>
                  <dt>Màn hình</dt><dd>{t.viewport || '—'} · {F.browserName(t.user_agent) || '—'}</dd>
                  {t.commit_url && <><dt>Đã đưa lên</dt><dd><a href={t.commit_url} target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)' }}>{(t.commit_sha || '').slice(0, 7)}</a></dd></>}
                  {t.status_note && <><dt>Ghi chú</dt><dd>{t.status_note}</dd></>}
                </dl>
              </div>
              <Attachments list={t.attachments} onImage={setZoom} />
            </Section>

            <div ref={claudeRef}>
              <Section id="claude" title={<>Claude xử lý</>} right={<>
                {bs && <BuildTimer ticket={t} building={building} />}
                {t.build_log_url && <a className="rm-loglink" href={t.build_log_url} target="_blank" rel="noopener">Nhật ký</a>}
              </>}>
                <ClaudePanel key={'c' + version} ticket={t} isAdmin={isAdmin} onImage={setZoom} note={note} setNote={setNote} onSend={build} busy={busy} err={null} canBuild={canBuild} />
              </Section>
            </div>

            {isAdmin && <Section id="status" title="Đổi trạng thái" defaultOpen={false}>
              <StatusForm key={t.status + version} ticket={t} compact onApply={onApply} />
            </Section>}

            <Section id="history" title={`Lịch sử${events ? ` (${events.length})` : ''}`} defaultOpen={false}>
              {events == null ? <p className="rm-muted" style={{ margin: 0 }}>Đang tải…</p> : events.length === 0 ? <p className="rm-muted" style={{ margin: 0 }}>Chưa có.</p> :
                <ol className="rm-tl">{events.slice().reverse().map(ev => <li key={ev.id}>
                  <span className="rm-dot" style={{ background: STATUS[ev.to_status].dot }}></span>
                  <div className="rm-tl-t">{!ev.from_status ? `Tạo phiếu · ${STATUS[ev.to_status].label}` : ev.from_status === ev.to_status ? (ev.note || 'Cập nhật') : `${STATUS[ev.from_status].label} → ${STATUS[ev.to_status].label}`}</div>
                  <div className="rm-tl-s">{ACTOR[ev.actor] || ev.actor} · {F.fmtFull(ev.created_at)}</div>
                  {ev.note && ev.from_status !== ev.to_status && <p className="rm-tl-n">{ev.note}</p>}
                </li>)}</ol>}
            </Section>
          </>}
        </div>
      </aside>
      {zoom && <Lightbox src={zoom} onClose={() => setZoom(null)} />}
    </>;
  }

  // ---------------------------------------------------------------- Trang
  function Roadmap() {
    const [st, setSt] = React.useState(readUrl);
    const [tickets, setTickets] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [loadErr, setLoadErr] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(!!F.admin.pin());
    const [pinAsk, setPinAsk] = React.useState(null);
    const [change, setChange] = React.useState(null);
    const [version, setVersion] = React.useState(0);
    const [flash, setFlash] = React.useState(null);
    const canDrag = useMedia('(pointer: fine) and (min-width: 761px)');

    const update = React.useCallback((patch, opts = {}) => {
      setSt(prev => {
        const next = { ...prev, ...patch };
        if (opts.push) history.pushState({ rmTicket: true }, '', toQuery(next));
        else history.replaceState(history.state, '', toQuery(next));
        return next;
      });
    }, []);
    const filter = patch => update({ ...patch, page: 1 });

    const load = React.useCallback(async () => {
      if (!api.ready) { setLoadErr('not_configured'); setLoaded(true); return; }
      try { setTickets(await api.listTickets()); setLoadErr(null); }
      catch (e) { console.warn(e); setLoadErr(F.errText(e)); }
      setLoaded(true);
    }, []);
    React.useEffect(() => { load(); }, [load]);
    React.useEffect(() => {
      const onCreated = () => { load(); };
      const onPop = () => setSt(readUrl());
      const onAdmin = () => setIsAdmin(!!F.admin.pin());
      window.addEventListener('aqx:ticket-created', onCreated);
      window.addEventListener('popstate', onPop);
      window.addEventListener('aqx:admin-change', onAdmin);
      return () => { window.removeEventListener('aqx:ticket-created', onCreated); window.removeEventListener('popstate', onPop); window.removeEventListener('aqx:admin-change', onAdmin); };
    }, [load]);
    React.useEffect(() => { if (!flash) return; const t = setTimeout(() => setFlash(null), 4000); return () => clearTimeout(t); }, [flash]);
    React.useEffect(() => {
      const prev = document.body.style.overflow;
      if (st.ticket) document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }, [st.ticket]);

    const askAdmin = React.useCallback(() => new Promise(res => setPinAsk({ res })), []);
    const pinDone = React.useCallback(ok => { setPinAsk(p => { p && p.res(ok); return null; }); }, []);

    async function applyStatus(t, to, note) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.setStatus(t.code, to, pin, note);
        if (r && r.ok) {
          setTickets(list => list.map(x => (x.code === t.code ? { ...x, status: to, status_note: note || null, updated_at: new Date().toISOString() } : x)));
          setVersion(v => v + 1); setChange(null);
          setFlash(`${t.code} → ${STATUS[to].label}`);
          load();
          return { ok: true };
        }
        if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear();
        return { ok: false, message: F.errText(r) };
      } catch (e) { return { ok: false, message: F.errText(e) }; }
    }
    async function editTicket(t, title, description) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.updateTicket(t.code, pin, title, description);
        if (r && r.ok) {
          setTickets(list => list.map(x => (x.code === t.code ? { ...x, title, description, updated_at: new Date().toISOString() } : x)));
          setVersion(v => v + 1); setFlash(`${t.code} — đã lưu nội dung`);
          return { ok: true };
        }
        if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear();
        return { ok: false, message: F.errText(r) };
      } catch (e) { return { ok: false, message: F.errText(e) }; }
    }
    async function reviewBuild(t, approve) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.reviewBuild(t.code, pin, approve);
        if (r && r.ok) {
          setTickets(list => list.map(x => (x.code === t.code ? { ...x, build_status: r.build_status, build_updated_at: new Date().toISOString() } : x)));
          setVersion(v => v + 1);
          setFlash(approve ? `${t.code} — đang đưa lên trang chính thức` : `${t.code} — đã từ chối bản xem trước`);
          return { ok: true };
        }
        if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear();
        return { ok: false, message: F.errText(r) };
      } catch (e) { return { ok: false, message: F.errText(e) }; }
    }
    async function deleteTicket(t) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.deleteTicket(t.code, pin);
        if (r && r.ok) {
          setTickets(list => list.filter(x => x.code !== t.code));
          closeTicket();
          setFlash(`${t.code} — đã xoá`);
          return { ok: true };
        }
        if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear();
        return { ok: false, message: F.errText(r) };
      } catch (e) { return { ok: false, message: F.errText(e) }; }
    }
    async function requestBuild(t, note) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.requestBuild(t.code, pin, note);
        if (r && r.ok) {
          const now = new Date().toISOString();
          setTickets(list => list.map(x => (x.code === t.code ? { ...x, status: 'doing', build_status: 'queued', build_note: null, preview_url: null, diff_url: null, build_started_at: null, build_seconds: null, build_log_url: null, build_updated_at: now } : x)));
          setVersion(v => v + 1);
          setFlash(`${t.code} — đã gửi cho Claude`);
          return { ok: true };
        }
        if (r && (r.error === 'bad_pin' || r.error === 'locked')) F.admin.clear();
        return { ok: false, message: F.errText(r) };
      } catch (e) { return { ok: false, message: F.errText(e) }; }
    }
    // đang có ticket Claude xử lý → tự tải lại mỗi 15 giây
    const anyBuilding = tickets.some(isBuilding);
    React.useEffect(() => {
      if (!anyBuilding) return;
      const t = setInterval(() => { if (!document.hidden) load().then(() => setVersion(v => v + 1)); }, 15000);
      return () => clearInterval(t);
    }, [anyBuilding, load]);

    async function requestMove(t, to) {
      if (!F.admin.pin() && !(await askAdmin())) return; // huỷ PIN → thẻ giữ nguyên chỗ cũ
      setChange({ ticket: t, to });
    }
    const openTicket = code => update({ ticket: code }, { push: true });
    const closeTicket = React.useCallback(() => {
      if (history.state && history.state.rmTicket) history.back();
      else update({ ticket: null });
    }, [update]);

    // lọc
    const indexed = React.useMemo(() => tickets.map(t => ({ ...t, _s: F.fold([t.code, t.title, t.description, t.reporter_name].join(' ')), _d: F.vnDay(t.created_at) })), [tickets]);
    const q = F.fold(st.q.trim());
    const base = indexed.filter(t => (!q || t._s.includes(q)) && (!st.from || t._d >= st.from) && (!st.to || t._d <= st.to));
    const listItems = React.useMemo(() => {
      const [f, dir] = SORTS[st.sort];
      return base.filter(t => !st.status.length || st.status.includes(t.status)).sort((a, b) => (a[f] < b[f] ? -1 : a[f] > b[f] ? 1 : 0) * dir);
    }, [base, st.status, st.sort]);
    const counts = STATUS_ORDER.reduce((o, s) => ((o[s] = tickets.filter(t => t.status === s).length), o), {});
    const hasFilter = !!(st.q || st.from || st.to || (st.view === 'list' && st.status.length));
    const clearFilters = () => filter({ q: '', from: '', to: '', status: [] });
    const activePreset = (PRESETS.find(([, , n]) => { const r = presetRange(n); return st.from === r.from && st.to === r.to; }) || [!st.from && !st.to ? 'all' : null])[0];
    const shown = st.view === 'list' ? listItems : base;
    const current = st.ticket ? tickets.find(t => t.code.toUpperCase() === st.ticket.toUpperCase()) : null;

    return <main className="wrap rm" data-screen-label="Phát triển sản phẩm">
      <div className="rm-head">
        <div>
          <h1>Phát triển sản phẩm</h1>
          <p className="t-body-lg">Mọi góp ý gửi về Aquanix đều nằm ở đây — xem góp ý của bạn đang ở bước nào.</p>
        </div>
        <Button variant="accent" onClick={() => window.dispatchEvent(new Event('aqx:feedback-open'))}>Gửi góp ý</Button>
      </div>

      <div className="rm-stats">{STATUS_ORDER.map(s => <div key={s} className="rm-stat">
        <div className="rm-stat-top"><span className="rm-dot" style={{ background: STATUS[s].dot }}></span>{STATUS[s].label}</div>
        <div className="rm-stat-n">{loaded ? counts[s] : '–'}</div>
        <div className="rm-stat-sub">{VI[s]}</div>
      </div>)}</div>

      <div className="rm-bar">
        <div className="rm-row">
          <div className="rm-seg" role="group" aria-label="Kiểu xem">
            <button type="button" aria-pressed={st.view === 'kanban'} onClick={() => filter({ view: 'kanban' })}>{Ico.board}Kanban</button>
            <button type="button" aria-pressed={st.view === 'list'} onClick={() => filter({ view: 'list' })}>{Ico.list}Danh sách</button>
          </div>
          <label className="rm-search">{Ico.search}<input className="rm-input" type="search" placeholder="Tìm mã, mô tả, tên người gửi…" value={st.q} onChange={e => filter({ q: e.target.value })} aria-label="Tìm kiếm" /></label>
          <Button size="sm" variant={isAdmin ? 'primary' : 'secondary'} className="rm-admin" icon={isAdmin ? Ico.unlock : Ico.lock}
            onClick={() => (isAdmin ? F.admin.clear() : askAdmin())} title={isAdmin ? 'Thoát chế độ admin' : 'Chế độ admin'}>
            {isAdmin ? 'Thoát admin' : 'Chế độ admin'}
          </Button>
        </div>
        <div className="rm-row">
          <span className="rm-lbl">Ngày tạo</span>
          {PRESETS.map(([k, l, n]) => <button key={k} type="button" className="rm-chip" aria-pressed={activePreset === k} onClick={() => filter(presetRange(n))}>{l}</button>)}
          <button type="button" className="rm-chip" aria-pressed={activePreset === 'all'} onClick={() => filter({ from: '', to: '' })}>Tất cả</button>
          <input className="rm-input rm-date" type="date" value={st.from} max={st.to || undefined} onChange={e => filter({ from: e.target.value })} aria-label="Từ ngày" />
          <span className="rm-muted">–</span>
          <input className="rm-input rm-date" type="date" value={st.to} min={st.from || undefined} onChange={e => filter({ to: e.target.value })} aria-label="Đến ngày" />
          {st.view === 'kanban' && hasFilter && <button type="button" className="rm-link" onClick={clearFilters}>Xoá lọc</button>}
        </div>
        {st.view === 'list' && <div className="rm-row">
          <span className="rm-lbl">Trạng thái</span>
          {STATUS_ORDER.map(s => { const on = st.status.includes(s); return <button key={s} type="button" className="rm-chip" aria-pressed={on}
            onClick={() => filter({ status: on ? st.status.filter(x => x !== s) : [...st.status, s] })}><span className="rm-dot" style={{ background: STATUS[s].dot, width: 8, height: 8 }}></span>{STATUS[s].label}</button>; })}
          <span className="rm-sep" aria-hidden="true"></span>
          <span className="rm-lbl">Sắp xếp</span>
          <select className="rm-select" value={st.sort} onChange={e => update({ sort: e.target.value, page: 1 })} aria-label="Sắp xếp" style={{ minHeight: 40, fontSize: 14 }}>
            {Object.entries(SORTS).map(([k, [, , l]]) => <option key={k} value={k}>{l}</option>)}
          </select>
          {hasFilter && <button type="button" className="rm-link" onClick={clearFilters}>Xoá lọc</button>}
        </div>}
      </div>

      {flash && <p className="rm-ok" role="status" style={{ margin: '0 0 var(--space-3)', fontSize: 14 }}>✓ {flash}</p>}

      {!loaded ? <div className="rm-empty"><h3>Đang tải…</h3></div>
        : loadErr ? <div className="rm-empty"><h3>Không tải được danh sách</h3><p>{loadErr === 'not_configured' ? F.errText('not_configured') : loadErr}</p>{loadErr !== 'not_configured' && <Button variant="secondary" onClick={load}>Thử lại</Button>}</div>
        : tickets.length === 0 ? <div className="rm-empty"><h3>Chưa có góp ý nào</h3><p>Bạn thấy chỗ nào chưa ổn trên trang? Hãy là người góp ý đầu tiên.</p><Button variant="accent" onClick={() => window.dispatchEvent(new Event('aqx:feedback-open'))}>Gửi góp ý</Button></div>
        : shown.length === 0 && (st.view === 'list' || hasFilter) ? <div className="rm-empty"><h3>Không có góp ý nào khớp bộ lọc</h3><p>Thử từ khoá khác hoặc mở rộng khoảng ngày.</p><Button variant="secondary" onClick={clearFilters}>Xoá lọc</Button></div>
        : st.view === 'list'
          ? <List items={listItems} sort={st.sort} page={st.page} onSort={s => update({ sort: s, page: 1 })} onPage={p => { update({ page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpen={openTicket} />
          : <Board items={base} onOpen={openTicket} onMove={requestMove} canDrag={canDrag} />}

      {st.ticket && <Drawer key={st.ticket} code={st.ticket.toUpperCase()} ticket={current} loaded={loaded} isAdmin={isAdmin} version={version}
        onClose={closeTicket} askAdmin={askAdmin} onApply={applyStatus} onBuild={requestBuild} onDelete={deleteTicket} onReview={reviewBuild} onEdit={editTicket} />}
      {change && <Modal title="Đổi trạng thái" onClose={() => setChange(null)}>
        <StatusForm ticket={change.ticket} initialTo={change.to} onApply={applyStatus} onCancel={() => setChange(null)} />
      </Modal>}
      {pinAsk && <PinDialog onDone={pinDone} />}
    </main>;
  }

  function Page() {
    return <>
      <Header page="roadmap" onCta={() => { location.href = F.homeHref('#download'); }} />
      <Roadmap />
      <Footer />
    </>;
  }
  ReactDOM.createRoot(document.getElementById('root')).render(<Page />);
})();
