// Góp ý: nút nổi → chụp phần màn hình đang xem → vẽ bút đỏ + mô tả → gửi thành ticket Backlog.
// Mở từ nơi khác: window.dispatchEvent(new Event('aqx:feedback-open'))
(() => {
  const { Button, FieldInput } = window.AquanixDesignSystem_4effac;
  const { api, errText, store, vnDay, roadmapHref } = window.AqxFb;
  const H2C = 'https://cdn.jsdelivr.net/npm/html2canvas-pro@1.6.7/dist/html2canvas-pro.min.js';
  const PEN = '#FF3B30', PEN_W = 4, MAX_SIDE = 1920, COOLDOWN = 30000, MAX_FILE = 5 * 1024 * 1024;
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/, PHONE_RE = /^\+?[0-9 .\-]{9,20}$/;

  let h2cPromise = null;
  function loadH2C() {
    if (window.html2canvas) return Promise.resolve(window.html2canvas);
    if (!h2cPromise) h2cPromise = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = H2C; s.async = true; s.crossOrigin = 'anonymous';
      s.onload = () => window.html2canvas ? res(window.html2canvas) : rej(new Error('html2canvas missing'));
      s.onerror = () => { h2cPromise = null; rej(new Error('html2canvas load failed')); };
      document.head.appendChild(s);
    });
    return h2cPromise;
  }
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

  function currentSection() {
    let cur = null;
    document.querySelectorAll('main section[id]').forEach(el => { if (el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = el.id; });
    return cur ? '#' + cur : null;
  }

  // Chụp đúng phần viewport đang thấy. Bỏ qua nút Góp ý, overlay, popup (data-fb-ignore / role=dialog).
  async function captureViewport() {
    const h2c = await loadH2C();
    const w = document.documentElement.clientWidth, h = window.innerHeight, sy = window.scrollY;
    // scroll-behavior:smooth làm iframe clone cuộn chậm → chụp nhầm đầu trang. Tắt tạm trong lúc chụp.
    const root = document.documentElement, prevSB = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    try { return await h2c(document.body, {
      x: window.scrollX, y: sy, width: w, height: h, windowWidth: w, windowHeight: h,
      scale: Math.min(window.devicePixelRatio || 1, 2), useCORS: true, logging: false,
      backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
      ignoreElements: el => !!(el.hasAttribute && (el.hasAttribute('data-fb-ignore') || el.getAttribute('role') === 'dialog')),
      // html2canvas không hiểu position:sticky → dời header xuống đúng chỗ đang dính
      onclone: doc => doc.querySelectorAll('[data-fb-sticky]').forEach(el => { el.style.position = 'relative'; el.style.top = sy + 'px'; }),
    }); } finally { root.style.scrollBehavior = prevSB; }
  }

  function drawStrokes(ctx, strokes, W, H) {
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = PEN;
    for (const s of strokes) {
      ctx.lineWidth = s.w * W;
      ctx.beginPath();
      s.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x * W, y * H) : ctx.moveTo(x * W, y * H)));
      if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] * W + 0.01, s.pts[0][1] * H);
      ctx.stroke();
    }
  }
  // cạnh dài tối đa 1920px, có/không có nét vẽ
  function flatten(src, strokes) {
    const k = Math.min(1, MAX_SIDE / Math.max(src.width, src.height));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(src.width * k)); c.height = Math.max(1, Math.round(src.height * k));
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(src, 0, 0, c.width, c.height);
    if (strokes) drawStrokes(ctx, strokes, c.width, c.height);
    return c;
  }
  // WebP 0.85; trình duyệt không mã hoá được WebP (Safari cũ) → JPEG 0.85
  const toBlob = c => new Promise(res => c.toBlob(b => {
    if (b && b.type === 'image/webp') return res(b);
    c.toBlob(j => res(j), 'image/jpeg', 0.85);
  }, 'image/webp', 0.85));
  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const b = crypto.getRandomValues(new Uint8Array(16)); b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }
  function readReporter() { try { return JSON.parse(store.get('aqx_fb_reporter') || '{}') || {}; } catch (e) { return {}; } }

  const Ico = {
    chat: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 11h7M8.5 14h4" /></svg>,
    undo: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></svg>,
    trash: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>,
    upload: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>,
  };

  function Annotator({ shot, captureError, context, onClose, onSent }) {
    const saved = React.useMemo(readReporter, []);
    const [base, setBase] = React.useState(shot);
    const [capErr, setCapErr] = React.useState(captureError);
    const [uploaded, setUploaded] = React.useState(false);
    const [fileErr, setFileErr] = React.useState(null);
    const [desc, setDesc] = React.useState('');
    const [name, setName] = React.useState(saved.name || '');
    const [contact, setContact] = React.useState(saved.contact || '');
    const [hp, setHp] = React.useState('');
    const [tried, setTried] = React.useState(false);
    const [sending, setSending] = React.useState(false);
    const [sendErr, setSendErr] = React.useState(null);
    const [failedOnce, setFailedOnce] = React.useState(false);
    const [waitUntil, setWaitUntil] = React.useState(0);
    const [, tick] = React.useState(0);
    const [nStrokes, setNStrokes] = React.useState(0);
    const [fit, setFit] = React.useState(null);
    const strokes = React.useRef([]);
    const cur = React.useRef(null);
    const areaRef = React.useRef(null);
    const cvRef = React.useRef(null);
    const fileRef = React.useRef(null);

    // khung ảnh vừa khít vùng hiển thị (contain)
    React.useEffect(() => {
      const el = areaRef.current; if (!el) return;
      const measure = () => {
        if (!base) return setFit(null);
        const cs = getComputedStyle(el);
        const aw = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        const ah = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const k = Math.min(aw / base.width, ah / base.height);
        setFit({ w: Math.max(1, Math.floor(base.width * k)), h: Math.max(1, Math.floor(base.height * k)) });
      };
      measure();
      const ro = new ResizeObserver(measure); ro.observe(el);
      return () => ro.disconnect();
    }, [base]);

    const redraw = React.useCallback(() => {
      const cv = cvRef.current; if (!cv || !base || !fit) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(fit.w * dpr); cv.height = Math.round(fit.h * dpr);
      const ctx = cv.getContext('2d');
      ctx.drawImage(base, 0, 0, cv.width, cv.height);
      drawStrokes(ctx, strokes.current, cv.width, cv.height);
    }, [base, fit]);
    React.useEffect(redraw, [redraw]);

    const pt = (e, r) => [Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)), Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))];
    function onDown(e) {
      if (!base || sending) return;
      e.preventDefault();
      const cv = cvRef.current, r = cv.getBoundingClientRect();
      cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
      cur.current = { w: PEN_W / r.width, pts: [pt(e, r)], r };
      const ctx = cv.getContext('2d');
      drawStrokes(ctx, [cur.current], cv.width, cv.height);
    }
    function onMove(e) {
      const s = cur.current; if (!s) return;
      e.preventDefault();
      const cv = cvRef.current, ctx = cv.getContext('2d');
      const evs = e.nativeEvent.getCoalescedEvents ? e.nativeEvent.getCoalescedEvents() : [e];
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = PEN; ctx.lineWidth = s.w * cv.width;
      for (const ev of (evs.length ? evs : [e])) {
        const p = pt(ev, s.r), last = s.pts[s.pts.length - 1];
        s.pts.push(p);
        ctx.beginPath(); ctx.moveTo(last[0] * cv.width, last[1] * cv.height); ctx.lineTo(p[0] * cv.width, p[1] * cv.height); ctx.stroke();
      }
    }
    function onUp() {
      const s = cur.current; if (!s) return;
      cur.current = null;
      strokes.current.push({ w: s.w, pts: s.pts });
      setNStrokes(strokes.current.length);
    }
    function undo() { strokes.current.pop(); setNStrokes(strokes.current.length); redraw(); }
    function clearAll() { strokes.current = []; setNStrokes(0); redraw(); }

    function onFile(e) {
      const f = e.target.files && e.target.files[0]; e.target.value = '';
      if (!f) return;
      if (!/^image\/(png|jpeg|webp)$/.test(f.type)) return setFileErr('Chỉ nhận ảnh PNG, JPG hoặc WebP.');
      if (f.size > MAX_FILE) return setFileErr('Ảnh tối đa 5MB.');
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
        strokes.current = []; setNStrokes(0); setBase(c); setCapErr(false); setFileErr(null); setUploaded(true);
      };
      img.onerror = () => { URL.revokeObjectURL(url); setFileErr('Không đọc được ảnh này.'); };
      img.src = url;
    }

    const d = desc.trim(), n = name.trim(), ct = contact.trim();
    const errs = {
      desc: d.length < 10 ? 'Mô tả cần ít nhất 10 ký tự.' : d.length > 2000 ? 'Mô tả tối đa 2000 ký tự.' : null,
      name: n.length < 2 ? 'Vui lòng nhập tên (2–60 ký tự).' : n.length > 60 ? 'Tên tối đa 60 ký tự.' : null,
      contact: ct && !(EMAIL_RE.test(ct) || (PHONE_RE.test(ct) && ct.replace(/\D/g, '').length >= 9)) ? 'SĐT hoặc email chưa đúng định dạng.' : null,
    };
    const dirty = nStrokes > 0 || uploaded || d.length > 0 || n !== (saved.name || '') || ct !== (saved.contact || '');

    const requestClose = React.useCallback(() => {
      if (sending) return;
      if (dirty && !window.confirm('Huỷ góp ý này? Nét vẽ và nội dung đã nhập sẽ mất.')) return;
      onClose();
    }, [dirty, sending, onClose]);
    React.useEffect(() => {
      // capture + chặn lan để Esc không đóng luôn drawer/hộp thoại bên dưới
      const k = e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); requestClose(); } };
      document.addEventListener('keydown', k, true);
      return () => document.removeEventListener('keydown', k, true);
    }, [requestClose]);

    const waitLeft = Math.ceil((waitUntil - Date.now()) / 1000);
    React.useEffect(() => {
      if (waitUntil <= Date.now()) return;
      const t = setInterval(() => { tick(x => x + 1); if (Date.now() >= waitUntil) clearInterval(t); }, 500);
      return () => clearInterval(t);
    }, [waitUntil]);

    async function submit(e) {
      e.preventDefault();
      setTried(true); setSendErr(null);
      if (errs.desc || errs.name || errs.contact) return;
      if (hp) return onSent(null); // honeypot: bot → giả vờ thành công
      const last = Number(store.get('aqx_fb_last') || 0);
      if (Date.now() - last < COOLDOWN) { setWaitUntil(last + COOLDOWN); return; }
      if (!api.ready) { setSendErr(errText('not_configured')); return; }
      setSending(true);
      try {
        let rawPath = null, annotatedPath = null;
        if (base) {
          const [rb, ab] = await Promise.all([toBlob(flatten(base)), toBlob(flatten(base, strokes.current))]);
          const id = uuid(), ym = vnDay(new Date()).slice(0, 7).replace('-', '/');
          const ext = b => (b.type === 'image/webp' ? 'webp' : 'jpg');
          rawPath = `${ym}/${id}-raw.${ext(rb)}`; annotatedPath = `${ym}/${id}-annotated.${ext(ab)}`;
          await Promise.all([api.upload(rawPath, rb), api.upload(annotatedPath, ab)]);
        }
        const res = await api.submit({ description: d, name: n, contact: ct, rawPath, annotatedPath, ...context });
        if (!res || !res.ok) throw (res || new Error('Gửi không thành công.'));
        store.set('aqx_fb_reporter', JSON.stringify({ name: n, contact: ct }));
        store.set('aqx_fb_last', String(Date.now()));
        onSent(res.code);
      } catch (err) {
        console.warn('[feedback] submit failed', err);
        setSendErr(errText(err)); setFailedOnce(true); setSending(false);
      }
    }

    return <div className="fb-modal" role="dialog" aria-modal="true" aria-label="Góp ý" data-fb-ignore="">
      <div className="fb-stage">
        <div className="fb-area" ref={areaRef}>
          {base && fit ? <canvas ref={cvRef} className="fb-canvas" style={{ width: fit.w, height: fit.h }} aria-label="Ảnh chụp màn hình — vẽ để khoanh vùng"
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onLostPointerCapture={onUp} />
            : !base && <div className="fb-empty">
              <p style={{ margin: '0 0 16px' }}>{capErr ? 'Không chụp được màn hình. Bạn có thể tải ảnh lên, hoặc chỉ gửi mô tả.' : 'Chưa có ảnh.'}</p>
              <button type="button" className="fb-tool" onClick={() => fileRef.current.click()}>{Ico.upload}Tải ảnh lên</button>
            </div>}
        </div>
        <div className="fb-tools">
          <button type="button" className="fb-tool on" aria-pressed="true" disabled={!base} title="Bút đỏ"><span className="fb-sw" aria-hidden="true"></span><span className="fb-tool-text">Bút đỏ</span></button>
          <button type="button" className="fb-tool" onClick={undo} disabled={!nStrokes || sending} title="Hoàn tác" aria-label="Hoàn tác">{Ico.undo}<span className="fb-tool-text">Hoàn tác</span></button>
          <button type="button" className="fb-tool" onClick={clearAll} disabled={!nStrokes || sending} title="Xoá hết nét vẽ" aria-label="Xoá hết nét vẽ">{Ico.trash}<span className="fb-tool-text">Xoá hết</span></button>
          <button type="button" className="fb-tool" onClick={() => fileRef.current.click()} disabled={sending} title="Tải ảnh khác lên" aria-label="Tải ảnh lên">{Ico.upload}<span className="fb-tool-text">Tải ảnh lên</span></button>
          <span className="fb-tools-hint">Khoanh vùng bằng chuột hoặc ngón tay</span>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onFile} />
        </div>
      </div>
      <form className="fb-panel" onSubmit={submit} noValidate>
        <span className="fb-grab" aria-hidden="true"></span>
        <div>
          <h2>Góp ý</h2>
          <p className="t-body" style={{ margin: '4px 0 0', color: 'var(--ink-muted)' }}>Khoanh vùng bằng bút đỏ trên ảnh, rồi mô tả lỗi hoặc đề xuất của bạn.</p>
        </div>
        {capErr && base == null && <p className="fb-alert warn">Không chụp được màn hình, bạn có thể tải ảnh lên (PNG/JPG/WebP ≤ 5MB).</p>}
        {fileErr && <p className="fb-alert stop">{fileErr}</p>}
        <label style={{ display: 'block' }}>
          <span className="fb-label"><span>Mô tả *</span><em style={{ color: d.length > 2000 ? 'var(--danger)' : undefined }}>{d.length}/2000</em></span>
          <textarea className={'fb-textarea' + (tried && errs.desc ? ' err' : '')} value={desc} onChange={e => setDesc(e.target.value)} maxLength={2200} autoFocus={window.innerWidth > 760}
            placeholder="Ví dụ: Nút Tải app trên điện thoại bị che mất một nửa." aria-invalid={!!(tried && errs.desc)} />
          {tried && errs.desc && <span className="fb-err">{errs.desc}</span>}
        </label>
        <FieldInput label="Tên của bạn *" value={name} onChange={e => setName(e.target.value)} maxLength={60} autoComplete="name" error={tried ? errs.name : null} />
        <FieldInput label="SĐT / Email (không bắt buộc)" value={contact} onChange={e => setContact(e.target.value)} maxLength={120} autoComplete="email" error={tried ? errs.contact : null} hint="Chỉ đội ngũ Aquanix thấy, để liên hệ khi cần." />
        <label className="fb-hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} name="website" /></label>
        <p className="fb-note">Ảnh chụp, mô tả và tên sẽ hiển thị công khai trên trang Phát triển sản phẩm.</p>
        {waitLeft > 0 && <p className="fb-alert warn">Bạn vừa gửi góp ý. Vui lòng chờ {waitLeft} giây rồi gửi tiếp.</p>}
        {sendErr && <p className="fb-alert stop" role="alert">{sendErr} Nội dung vẫn được giữ nguyên.</p>}
        <div className="fb-actions">
          <Button variant="secondary" onClick={requestClose} disabled={sending}>Huỷ</Button>
          <Button type="submit" disabled={sending || waitLeft > 0}>{sending ? 'Đang gửi…' : failedOnce ? 'Gửi lại' : 'Gửi'}</Button>
        </div>
      </form>
    </div>;
  }

  function FeedbackWidget() {
    const [phase, setPhase] = React.useState('idle'); // idle | capturing | open
    const [shot, setShot] = React.useState(null);
    const [capErr, setCapErr] = React.useState(false);
    const [context, setContext] = React.useState(null);
    const [toast, setToast] = React.useState(null);
    const busy = React.useRef(false);

    const start = React.useCallback(async () => {
      if (busy.current) return;
      busy.current = true; setToast(null);
      window.dispatchEvent(new Event('aqx:close-popups'));
      const ctx = { pageUrl: location.href, section: currentSection(), viewport: window.innerWidth + 'x' + window.innerHeight, userAgent: navigator.userAgent };
      setPhase('capturing');
      await nextFrame();
      let canvas = null, err = false;
      try { canvas = await withTimeout(captureViewport(), 10000); } catch (e) { console.warn('[feedback] capture failed', e); err = true; }
      setShot(canvas); setCapErr(err); setContext(ctx); setPhase('open');
    }, []);

    React.useEffect(() => {
      const h = () => start();
      window.addEventListener('aqx:feedback-open', h);
      return () => window.removeEventListener('aqx:feedback-open', h);
    }, [start]);

    React.useEffect(() => {
      if (phase !== 'open') return;
      const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }, [phase]);

    React.useEffect(() => {
      if (!toast) return;
      const t = setTimeout(() => setToast(null), 10000);
      return () => clearTimeout(t);
    }, [toast]);

    const close = () => { setPhase('idle'); setShot(null); busy.current = false; };
    const sent = code => {
      close();
      setToast({ code });
      if (code) window.dispatchEvent(new CustomEvent('aqx:ticket-created', { detail: { code } }));
    };

    return <>
      {phase === 'idle' && <button type="button" className="fb-fab" onClick={start} aria-label="Góp ý" data-fb-ignore="">{Ico.chat}<span className="fb-fab-label">Góp ý</span></button>}
      {phase === 'capturing' && <div className="fb-busy" data-fb-ignore="" role="status"><div><span className="fb-spin" aria-hidden="true"></span>Đang chụp màn hình…</div></div>}
      {phase === 'open' && <Annotator shot={shot} captureError={capErr} context={context} onClose={close} onSent={sent} />}
      {toast && <div className="fb-toast" role="status" data-fb-ignore="">
        <span>{toast.code
          ? <>Đã gửi góp ý <b>{toast.code}</b>. Theo dõi tại <a href={roadmapHref('?ticket=' + encodeURIComponent(toast.code))}>trang Phát triển sản phẩm</a>.</>
          : 'Đã gửi góp ý. Cảm ơn bạn!'}</span>
        <button type="button" aria-label="Đóng" onClick={() => setToast(null)}>×</button>
      </div>}
    </>;
  }

  // tải sẵn html2canvas khi rảnh để lần bấm đầu tiên chụp nhanh (≤ 3 giây)
  const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500));
  window.addEventListener('load', () => setTimeout(() => idle(() => loadH2C().catch(() => {})), 3000));

  // Tự gắn vào trang, tách khỏi cây React chính
  const host = document.createElement('div');
  host.id = 'aqx-feedback-root';
  document.body.appendChild(host);
  ReactDOM.createRoot(host).render(<FeedbackWidget />);
})();
