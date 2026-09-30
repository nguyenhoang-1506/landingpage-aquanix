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
        return <section key={s} className={'rm-col' + (over === s && drag && drag.status !== s ? ' over' : '')} aria-label={m.label}
          onDragOver={e => { if (drag && drag.status !== s) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setOver(s); } }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(o => (o === s ? null : o)); }}
          onDrop={e => { e.preventDefault(); const t = drag; setDrag(null); setOver(null); if (t && t.status !== s) onMove(t, s); }}>
          <div className="rm-col-h"><span className="rm-dot" style={{ background: m.dot }}></span>{m.label}<span className="rm-muted" style={{ fontWeight: 400, fontSize: 13 }}>{VI[s]}</span><span className="rm-count">{col.length}</span></div>
          <div className="rm-col-bar" style={{ background: m.dot }}></div>
          {col.length === 0 && <div className="rm-col-empty">Trống</div>}
          {col.map(t => <div key={t.code} role="button" tabIndex={0} className={'rm-card' + (drag && drag.code === t.code ? ' dragging' : '')}
            draggable={canDrag} onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', t.code); setDrag(t); }}
            onDragEnd={() => { setDrag(null); setOver(null); }}
            onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))} aria-label={t.code + ': ' + t.title}>
            <Thumb t={t} className="rm-card-img" />
            <div className="rm-card-b">
              <span className="rm-code">{t.code}</span>
              <p className="rm-clamp">{t.description}</p>
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
        <tbody>{rows.map(t => <tr key={t.code} tabIndex={0} onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))}>
          <td><span className="rm-code">{t.code}</span></td>
          <td><Thumb t={t} className="rm-thumb" /></td>
          <td style={{ maxWidth: 340 }}><p className="rm-clamp">{t.description}</p></td>
          <td>{t.reporter_name}</td>
          <td className="rm-muted">{pageLabel(t)}</td>
          <td><Badge status={t.status} /></td>
          <td className="rm-muted" title={F.fmtFull(t.created_at)} style={{ whiteSpace: 'nowrap' }}>{F.fmtDate(t.created_at)}</td>
          <td className="rm-muted" title={F.fmtFull(t.updated_at)} style={{ whiteSpace: 'nowrap' }}>{F.relTime(t.updated_at)}</td>
        </tr>)}</tbody>
      </table></div>
      <div className="rm-mlist">{rows.map(t => <div key={t.code} role="button" tabIndex={0} className="rm-mcard" onClick={() => onOpen(t.code)} onKeyDown={openKeys(() => onOpen(t.code))}>
        <Thumb t={t} className="rm-thumb" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}><span className="rm-code">{t.code}</span><Badge status={t.status} /></div>
          <p className="rm-clamp">{t.description}</p>
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
    merging: ['Đang đưa lên bản chính thức…', 'var(--accent-100)', 'var(--accent-600)'],
    failed: ['Claude chưa sửa được', 'var(--danger-bg)', 'var(--danger)'],
    rejected: ['Bản xem trước đã bị từ chối', 'var(--surface-sunken)', 'var(--ink-muted)'],
    merged: ['Đã đưa lên bản chính thức', 'var(--success-bg)', 'var(--success)'],
  };
  const BUILD_STALE = 20 * 60 * 1000; // quá 20 phút không cập nhật → coi như treo, cho bấm lại
  const isBuilding = t => ['queued', 'running', 'merging'].includes(t.build_status) && Date.now() - new Date(t.build_updated_at || 0).getTime() < BUILD_STALE;

  function BuildBox({ ticket, isAdmin, askAdmin, onBuild }) {
    const [note, setNote] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [err, setErr] = React.useState(null);
    const bs = ticket.build_status, meta = BUILD[bs];
    const building = isBuilding(ticket);
    const canBuild = ['backlog', 'doing'].includes(ticket.status) && !building;
    if (!bs && !(canBuild && isAdmin)) return null; // khách chỉ thấy khi đã có tiến độ build
    async function go() {
      if (!F.admin.pin() && !(await askAdmin())) return;
      setBusy(true); setErr(null);
      const r = await onBuild(ticket, note.trim());
      setBusy(false);
      if (r && r.ok) setNote(''); else setErr(r ? r.message : 'Có lỗi xảy ra.');
    }
    return <div className="rm-box">
      <h3>Build by Claude</h3>
      {meta && <p className="fb-alert" style={{ background: meta[1], color: meta[2], margin: 0, display: 'flex', gap: 8, alignItems: 'center' }}>
        {building && <span className="fb-spin" aria-hidden="true" style={{ borderColor: 'rgba(0,0,0,.15)', borderTopColor: 'currentColor' }}></span>}
        <b>{meta[0]}</b>
      </p>}
      {ticket.build_note && bs !== 'merged' && <p className="rm-tl-n" style={{ margin: 0 }}>{ticket.build_note}</p>}
      {bs === 'preview' && <div className="rm-actions">
        {ticket.preview_url && <Button size="sm" onClick={() => window.open(ticket.preview_url, '_blank', 'noopener')}>Xem bản xem trước</Button>}
        {ticket.diff_url && <Button size="sm" variant="secondary" onClick={() => window.open(ticket.diff_url, '_blank', 'noopener')}>Duyệt trên GitHub</Button>}
      </div>}
      {bs === 'preview' && <p className="rm-muted" style={{ margin: 0, fontSize: 13 }}>Xem bản xem trước, nếu ổn thì mở GitHub và bấm <b>Merge pull request</b> — trang chính thức sẽ tự cập nhật và ticket chuyển Done.</p>}
      {canBuild && isAdmin && <>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span className="rm-lbl">Chỉ dẫn thêm cho Claude (không bắt buộc)</span>
          <textarea className="rm-textarea" value={note} maxLength={1000} onChange={e => setNote(e.target.value)} placeholder="Ví dụ: chỉ sửa trên mobile, giữ nguyên desktop." />
        </label>
        {err && <p className="rm-err" role="alert">{err}</p>}
        <div><Button size="sm" variant="accent" disabled={busy} onClick={go}>{busy ? 'Đang gửi…' : bs ? 'Build lại bằng Claude' : 'Build by Claude'}</Button></div>
      </>}
    </div>;
  }

  function Lightbox({ src, onClose }) {
    useEscTop(onClose);
    return <div className="rm-light" role="dialog" aria-modal="true" aria-label="Ảnh phóng to" onClick={onClose}><img src={src} alt="Ảnh chụp màn hình" /></div>;
  }

  // ---------------------------------------------------------------- Chi tiết
  function Drawer({ code, ticket, loaded, isAdmin, version, onClose, askAdmin, onApply, onBuild }) {
    const [events, setEvents] = React.useState(null);
    const [contact, setContact] = React.useState(undefined);
    const [which, setWhich] = React.useState('annotated');
    const [zoom, setZoom] = React.useState(false);
    const closeRef = React.useRef(null);

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

    const ann = ticket && F.publicUrl(ticket.screenshot_annotated_path);
    const raw = ticket && F.publicUrl(ticket.screenshot_raw_path);
    const img = which === 'raw' ? (raw || ann) : (ann || raw);

    return <>
      <div className="rm-back" onClick={onClose}></div>
      <aside className="rm-drawer" role="dialog" aria-modal="true" aria-label={'Chi tiết ' + code}>
        <div className="rm-drawer-h">
          <span className="rm-code" style={{ fontSize: 15 }}>{code}</span>
          {ticket && <Badge status={ticket.status} />}
          <button ref={closeRef} type="button" className="rm-x" onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <div className="rm-drawer-b">
          {!ticket ? <div className="rm-empty"><h3>{loaded ? 'Không tìm thấy ticket' : 'Đang tải…'}</h3>{loaded && <p>Mã {code} không tồn tại hoặc đã bị xoá.</p>}</div> : <>
            {img && <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {ann && raw && <div className="rm-seg" role="group" aria-label="Chọn ảnh" style={{ alignSelf: 'flex-start' }}>
                <button type="button" aria-pressed={which === 'annotated'} onClick={() => setWhich('annotated')}>Ảnh đã vẽ</button>
                <button type="button" aria-pressed={which === 'raw'} onClick={() => setWhich('raw')}>Ảnh gốc</button>
              </div>}
              <img className="rm-shot" src={img} alt={'Ảnh chụp màn hình của ' + code} onClick={() => setZoom(true)} />
            </div>}
            <p className="rm-desc">{ticket.description}</p>
            {ticket.status === 'done' && ticket.commit_url && <p className="fb-alert" style={{ background: 'var(--success-bg)', color: 'var(--success)', margin: 0 }}>
              Đã sửa trong commit <a href={ticket.commit_url} target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{(ticket.commit_sha || '').slice(0, 7)}</a> trên GitHub.
            </p>}
            {ticket.status_note && <p className="fb-alert" style={{ background: 'var(--surface-sunken)', color: 'var(--ink)', margin: 0 }}><b>Ghi chú: </b>{ticket.status_note}</p>}
            <dl className="rm-dl">
              <dt>Người gửi</dt><dd>{ticket.reporter_name}</dd>
              {isAdmin && <><dt>SĐT / Email</dt><dd>{contact === undefined ? '…' : contact || <span className="rm-muted">Không để lại</span>}</dd></>}
              <dt>Ngày tạo</dt><dd>{F.fmtFull(ticket.created_at)}</dd>
              <dt>Cập nhật</dt><dd>{F.fmtFull(ticket.updated_at)}</dd>
              <dt>Trang</dt><dd>{ticket.page_url ? <a href={ticket.page_url} target="_blank" rel="noopener">{pageLabel(ticket)}</a> : '—'}</dd>
              <dt>Màn hình</dt><dd>{ticket.viewport || '—'}</dd>
              <dt>Trình duyệt</dt><dd title={ticket.user_agent}>{F.browserName(ticket.user_agent) || '—'}</dd>
            </dl>
            <BuildBox key={'b' + version} ticket={ticket} isAdmin={isAdmin} askAdmin={askAdmin} onBuild={onBuild} />
            <div className="rm-box">
              <h3>Đổi trạng thái</h3>
              {isAdmin
                ? <StatusForm key={ticket.status + version} ticket={ticket} compact onApply={onApply} />
                : <div><Button size="sm" variant="secondary" icon={Ico.lock} onClick={() => askAdmin()}>Mở chế độ admin</Button></div>}
            </div>
            <div className="rm-box">
              <h3>Lịch sử trạng thái</h3>
              {events == null ? <p className="rm-muted" style={{ margin: 0 }}>Đang tải…</p> : events.length === 0 ? <p className="rm-muted" style={{ margin: 0 }}>Chưa có.</p> :
                <ol className="rm-tl">{events.slice().reverse().map(ev => <li key={ev.id}>
                  <span className="rm-dot" style={{ background: STATUS[ev.to_status].dot }}></span>
                  <div className="rm-tl-t">{ev.from_status ? `${STATUS[ev.from_status].label} → ${STATUS[ev.to_status].label}` : `Tạo ticket · ${STATUS[ev.to_status].label}`}</div>
                  <div className="rm-tl-s">{ACTOR[ev.actor] || ev.actor} · {F.fmtFull(ev.created_at)}</div>
                  {ev.note && <p className="rm-tl-n">{ev.note}</p>}
                </li>)}</ol>}
            </div>
          </>}
        </div>
      </aside>
      {zoom && img && <Lightbox src={img} onClose={() => setZoom(false)} />}
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
    async function requestBuild(t, note) {
      const pin = F.admin.pin();
      if (!pin) return { ok: false, message: 'Phiên admin đã hết. Vui lòng nhập lại PIN.' };
      try {
        const r = await api.requestBuild(t.code, pin, note);
        if (r && r.ok) {
          const now = new Date().toISOString();
          setTickets(list => list.map(x => (x.code === t.code ? { ...x, status: 'doing', build_status: 'queued', build_note: null, preview_url: null, diff_url: null, build_updated_at: now } : x)));
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

      {flash && <p className="rm-ok" role="status" style={{ margin: '0 0 var(--space-3)', fontSize: 14 }}>Đã cập nhật {flash}.</p>}

      {!loaded ? <div className="rm-empty"><h3>Đang tải…</h3></div>
        : loadErr ? <div className="rm-empty"><h3>Không tải được danh sách</h3><p>{loadErr === 'not_configured' ? F.errText('not_configured') : loadErr}</p>{loadErr !== 'not_configured' && <Button variant="secondary" onClick={load}>Thử lại</Button>}</div>
        : tickets.length === 0 ? <div className="rm-empty"><h3>Chưa có góp ý nào</h3><p>Bạn thấy chỗ nào chưa ổn trên trang? Hãy là người góp ý đầu tiên.</p><Button variant="accent" onClick={() => window.dispatchEvent(new Event('aqx:feedback-open'))}>Gửi góp ý</Button></div>
        : shown.length === 0 && (st.view === 'list' || hasFilter) ? <div className="rm-empty"><h3>Không có góp ý nào khớp bộ lọc</h3><p>Thử từ khoá khác hoặc mở rộng khoảng ngày.</p><Button variant="secondary" onClick={clearFilters}>Xoá lọc</Button></div>
        : st.view === 'list'
          ? <List items={listItems} sort={st.sort} page={st.page} onSort={s => update({ sort: s, page: 1 })} onPage={p => { update({ page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpen={openTicket} />
          : <Board items={base} onOpen={openTicket} onMove={requestMove} canDrag={canDrag} />}

      {st.ticket && <Drawer key={st.ticket} code={st.ticket.toUpperCase()} ticket={current} loaded={loaded} isAdmin={isAdmin} version={version}
        onClose={closeTicket} askAdmin={askAdmin} onApply={applyStatus} onBuild={requestBuild} />}
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
