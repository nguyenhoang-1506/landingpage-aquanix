// Lớp dùng chung cho Góp ý + trang Phát triển sản phẩm: client Supabase, trạng thái, định dạng.
(function () {
  const cfg = window.AQX_CONFIG || {};
  const BUCKET = 'feedback-screenshots';
  const TZ = 'Asia/Ho_Chi_Minh';
  const ready = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase && window.supabase.createClient);
  const sb = ready ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } }) : null;

  function need() { if (!sb) { const e = new Error('Chưa cấu hình máy chủ góp ý (config.js).'); e.code = 'not_configured'; throw e; } }
  async function rpc(name, args) {
    need();
    const { data, error } = await sb.rpc(name, args);
    if (error) throw error;
    return data;
  }

  const STATUS = {
    backlog: { label: 'Backlog', color: 'var(--ink-muted)', bg: 'var(--surface-sunken)', dot: '#8A9EA6' },
    doing: { label: 'Doing', color: 'var(--accent-600)', bg: 'var(--accent-100)', dot: '#FE731E' },
    done: { label: 'Done', color: 'var(--success)', bg: 'var(--success-bg)', dot: '#0F7A4A' },
    failed: { label: 'Failed', color: 'var(--danger)', bg: 'var(--danger-bg)', dot: '#B3241A' },
  };
  const STATUS_ORDER = ['backlog', 'doing', 'done', 'failed'];
  const ACTOR = { reporter: 'Người gửi', admin: 'Admin', 'claude-code': 'Claude Code' };

  const ERR = {
    not_configured: 'Chưa cấu hình máy chủ góp ý (config.js).',
    invalid_description: 'Mô tả cần 10–2000 ký tự.',
    invalid_name: 'Tên cần 2–60 ký tự.',
    invalid_contact: 'SĐT/Email không đúng định dạng.',
    invalid_path: 'Đường dẫn ảnh không hợp lệ.',
    rate_limited: 'Bạn gửi hơi nhiều, vui lòng thử lại sau ít phút.',
    bad_pin: 'Mã PIN không đúng.',
    locked: 'Nhập sai quá nhiều lần. Vui lòng thử lại sau.',
    note_required: 'Chuyển sang Failed cần ghi lý do.',
    note_too_long: 'Ghi chú tối đa 1000 ký tự.',
    unchanged: 'Ticket đã ở trạng thái này.',
    not_found: 'Không tìm thấy ticket.',
    invalid_status: 'Trạng thái không hợp lệ.',
  };
  function errText(e) {
    if (!e) return 'Có lỗi xảy ra.';
    if (typeof e === 'string') return ERR[e] || e;
    if (e.code && ERR[e.code]) return ERR[e.code];
    if (e.error && ERR[e.error]) return ERR[e.error];
    if (e.message && /fetch|network|Failed to fetch|NetworkError/i.test(e.message)) return 'Mất kết nối mạng. Vui lòng thử lại.';
    return (e.message || 'Có lỗi xảy ra.');
  }

  // --- định dạng ---
  const dayFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
  const fullFmt = new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  const shortFmt = new Intl.DateTimeFormat('vi-VN', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' });
  const vnDay = d => dayFmt.format(new Date(d)); // 'YYYY-MM-DD' theo giờ VN
  const fmtFull = d => d ? fullFmt.format(new Date(d)) : '';
  const fmtDate = d => d ? shortFmt.format(new Date(d)) : '';
  function relTime(d) {
    const s = Math.round((Date.now() - new Date(d).getTime()) / 1000);
    if (s < 60) return 'vừa xong';
    const m = Math.round(s / 60); if (m < 60) return m + ' phút trước';
    const h = Math.round(m / 60); if (h < 24) return h + ' giờ trước';
    const dd = Math.round(h / 24); if (dd < 30) return dd + ' ngày trước';
    const mo = Math.round(dd / 30); if (mo < 12) return mo + ' tháng trước';
    return Math.round(mo / 12) + ' năm trước';
  }
  // bỏ dấu tiếng Việt để tìm "nguyen" ra "Nguyễn"
  const fold = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  function browserName(ua) {
    ua = ua || '';
    const m = ua.match(/(Edg|OPR|SamsungBrowser|CriOS|FxiOS|Firefox|Chrome|Version)\/([\d]+)/);
    const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
    if (!m) return os || ua.slice(0, 40);
    const name = { Edg: 'Edge', OPR: 'Opera', SamsungBrowser: 'Samsung Internet', CriOS: 'Chrome', FxiOS: 'Firefox', Version: 'Safari' }[m[1]] || m[1];
    return name + ' ' + m[2] + (os ? ' · ' + os : '');
  }

  // --- storage an toàn (có thể ném lỗi ở chế độ riêng tư) ---
  const store = {
    get(k, area) { try { return (area || localStorage).getItem(k); } catch (e) { return null; } },
    set(k, v, area) { try { (area || localStorage).setItem(k, v); } catch (e) {} },
    del(k, area) { try { (area || localStorage).removeItem(k); } catch (e) {} },
  };
  const session = () => { try { return sessionStorage; } catch (e) { return null; } };
  const admin = {
    pin() { const s = session(); return s ? store.get('aqx_admin_pin', s) : null; },
    set(pin) { const s = session(); if (s) store.set('aqx_admin_pin', pin, s); window.dispatchEvent(new Event('aqx:admin-change')); },
    clear() { const s = session(); if (s) store.del('aqx_admin_pin', s); window.dispatchEvent(new Event('aqx:admin-change')); },
  };

  function publicUrl(path) {
    if (!path || !cfg.SUPABASE_URL) return null;
    return cfg.SUPABASE_URL.replace(/\/$/, '') + '/storage/v1/object/public/' + BUCKET + '/' + path.split('/').map(encodeURIComponent).join('/');
  }

  const api = {
    ready,
    async upload(path, blob) {
      need();
      const { error } = await sb.storage.from(BUCKET).upload(path, blob, { contentType: blob.type, upsert: false, cacheControl: '31536000' });
      if (error) throw error;
      return path;
    },
    submit(a) {
      return rpc('submit_ticket', {
        p_description: a.description, p_reporter_name: a.name, p_reporter_contact: a.contact || null,
        p_page_url: a.pageUrl, p_page_section: a.section || null, p_viewport: a.viewport, p_user_agent: a.userAgent,
        p_raw_path: a.rawPath || null, p_annotated_path: a.annotatedPath || null,
      });
    },
    async listTickets() {
      need();
      const { data, error } = await sb.from('tickets_public').select('*').order('created_at', { ascending: false }).limit(2000);
      if (error) throw error;
      return data || [];
    },
    async listEvents(code) {
      need();
      const { data, error } = await sb.from('ticket_events_public').select('*').eq('code', code).order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    verifyPin: pin => rpc('verify_admin_pin', { p_pin: pin }),
    setStatus: (code, status, pin, note) => rpc('set_ticket_status', { p_code: code, p_status: status, p_pin: pin, p_note: note || null }),
    getPrivate: (code, pin) => rpc('get_ticket_private', { p_code: code, p_pin: pin }),
  };

  // Vercel phục vụ /roadmap (cleanUrls); server tĩnh khi chạy local thì cần roadmap.html
  const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  const roadmapHref = (qs = '') => (local ? './roadmap.html' : '/roadmap') + qs;
  const homeHref = (hash = '') => (local ? './index.html' : '/') + hash;

  window.AqxFb = { api, STATUS, STATUS_ORDER, ACTOR, errText, vnDay, fmtFull, fmtDate, relTime, fold, browserName, store, admin, publicUrl, cfg, TZ, roadmapHref, homeHref };
})();
