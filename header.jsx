const { Button } = window.AquanixDesignSystem_4effac;
const NAV = [['top', 'Mở đầu'], ['day', 'Một ngày ở ao'], ['sell', 'Ngày bán cá'], ['why', 'Bạn được gì'], ['faq', 'Hỏi đáp'], ['download', 'Tải app']];
function useActiveSection() {
  const [active, setActive] = React.useState('top');
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement; setProgress(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
      let cur = 'top'; for (const [id] of NAV) { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = id; } setActive(cur);
    };
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return [active, progress];
}
function Header({ onCta }) {
  const [active, progress] = useActiveSection();
  const [open, setOpen] = React.useState(false);
  const go = id => e => { e.preventDefault(); setOpen(false); const el = document.getElementById(id); if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: 'smooth' }); };
  React.useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return <>
    <header style={{ position: 'sticky', top: 0, zIndex: 20, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
      <div className="wrap hdr" style={{ height: 72, display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <a href="#top" onClick={go('top')} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--ink)' }}><img src="./assets/logo/aquanix-mark.png" alt="Aquanix" style={{ height: 36 }} /><span className="hdr-brand-text" style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em' }}>Aquanix</span></a>
        <nav className="nav" style={{ display: 'flex', gap: 'var(--space-5)', marginLeft: 'auto' }}>{NAV.slice(1, 5).map(([id, l]) => <a key={id} href={'#' + id} onClick={go(id)} style={{ color: active === id ? 'var(--brand-600)' : 'var(--ink-muted)', fontSize: 15, fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: '2px solid ' + (active === id ? 'var(--accent-500)' : 'transparent'), paddingBottom: 2, transition: 'color .15s' }}>{l}</a>)}</nav>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Button size="sm" onClick={onCta}>Tải app</Button>
          <button type="button" className="menu-btn" aria-label={open ? 'Đóng menu' : 'Mở menu'} aria-expanded={open} onClick={() => setOpen(o => !o)} style={{ width: 44, height: 44, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)', cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, padding: 0 }}>
            {[0, 1, 2].map(i => <span key={i} style={{ display: 'block', width: 18, height: 2, borderRadius: 1, background: 'var(--ink)', transition: 'transform .2s, opacity .2s', transform: open ? (i === 0 ? 'translateY(7px) rotate(45deg)' : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none') : 'none', opacity: open && i === 1 ? 0 : 1 }}></span>)}
          </button>
        </div>
      </div>
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, bottom: -1, height: 3, width: (progress * 100) + '%', background: 'var(--accent-500)', transition: 'width .1s linear' }}></div>
      {open && <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', background: 'var(--surface)', borderBottom: '1px solid var(--border)', boxShadow: 'var(--shadow-pop)', padding: '0 var(--space-4) var(--space-4)' }}>
        {NAV.map(([id, l]) => <a key={id} href={'#' + id} onClick={go(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 52, padding: '0 var(--space-2)', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: active === id ? 'var(--brand-600)' : 'var(--ink)', fontSize: 17, fontWeight: 600 }}>{l}<span aria-hidden="true" style={{ color: 'var(--ink-subtle)' }}>›</span></a>)}
      </div>}
    </header>
    {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 15, background: 'rgba(11,42,51,.35)' }}></div>}
    <nav className="dots" aria-label="Vị trí trên trang" style={{ position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)', zIndex: 9, display: 'flex', flexDirection: 'column', gap: 14 }}>
      {NAV.map(([id, l]) => { const on = active === id; return <a key={id} href={'#' + id} onClick={go(id)} title={l} style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', textDecoration: 'none' }}>
        <span className="dot-label" style={{ fontSize: 12, fontWeight: 600, color: on ? 'var(--ink)' : 'var(--ink-subtle)', background: 'rgba(255,255,255,.9)', padding: '3px 8px', borderRadius: 999, opacity: on ? 1 : 0, transition: 'opacity .15s', whiteSpace: 'nowrap' }}>{l}</span>
        <span style={{ width: on ? 12 : 8, height: on ? 12 : 8, borderRadius: '50%', background: on ? 'var(--accent-500)' : 'var(--border-strong)', boxShadow: '0 0 0 3px rgba(255,255,255,.9)', transition: 'all .15s' }}></span>
      </a>; })}
    </nav>
  </>;
}
window.Header = Header;
