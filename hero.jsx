const { Button, StatusBadge } = window.AquanixDesignSystem_4effac;
const P = './assets/photos/opt/';
const SHOTS = [P + 'aerial-dawn.jpg', P + 'lake-cages.jpg', P + 'feeding.jpg'];
function FlycamHero() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % SHOTS.length), 6000); return () => clearInterval(t); }, []);
  return <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--ink)' }}>
    {SHOTS.map((src, k) => <img key={src} src={src} alt="" fetchpriority={k === 0 ? 'high' : 'low'} loading={k === 0 ? 'eager' : 'lazy'} decoding="async" className={'shot' + (k === i ? ' on' : '')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />)}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,42,51,.45) 0%, rgba(11,42,51,.2) 40%, rgba(11,42,51,.85) 100%)' }}></div>
  </div>;
}
function HeroGhost({ children, onClick }) {
  const [h, setH] = React.useState(false);
  return <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, lineHeight: '20px', borderRadius: 'var(--radius-md)', padding: '14px 20px', minHeight: 48, border: '1.5px solid rgba(255,255,255,.6)', background: h ? 'rgba(255,255,255,.18)' : 'transparent', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 120ms ease-out', display: 'inline-flex', alignItems: 'center', gap: 10 }}>{children}</button>;
}
function PlayIcon() {
  return <span style={{ width: 22, height: 22, borderRadius: 999, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><span style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '5px 0 5px 8px', borderColor: 'transparent transparent transparent var(--ink)', marginLeft: 2 }}></span></span>;
}
function VideoModal({ onClose }) {
  React.useEffect(() => {
    const k = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, []);
  return <div onClick={onClose} role="dialog" aria-modal="true" aria-label="Video hành trình Aquanix" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(11,42,51,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-5)' }}>
    <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: 'min(1100px, 100%)', aspectRatio: '16/9', background: '#000', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.6)' }}>
      <video autoPlay controls playsInline preload="metadata" poster={P + 'aerial-dawn.jpg'} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}><source src="./hero-video.mp4" type="video/mp4" /></video>
    </div>
    <button type="button" onClick={onClose} aria-label="Đóng" style={{ position: 'fixed', top: 20, right: 20, width: 44, height: 44, borderRadius: 999, border: '1.5px solid rgba(255,255,255,.5)', background: 'rgba(255,255,255,.12)', color: '#fff', fontSize: 22, lineHeight: 1, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>×</button>
  </div>;
}
function Hero({ onCta, onDay }) {
  const [videoExists, setVideoExists] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { fetch('./hero-video.mp4', { method: 'HEAD' }).then(r => r.ok && setVideoExists(true)).catch(() => {}); }, []);
  return <section id="top" className="hero-sec" style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'flex-end', color: '#fff' }}>
    <FlycamHero />
    <div className="wrap" style={{ position: 'relative', width: '100%', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      <StatusBadge status="ok">Giải pháp hiệu quả cho hộ nuôi</StatusBadge>
      <h1 className="hero-h1" style={{ margin: 'var(--space-4) 0', color: '#fff', fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 820 }}>Nuôi cá có nhật ký, <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--accent-500)', textDecorationThickness: 6, textUnderlineOffset: 10, textDecorationSkipInk: 'none' }}>bán cá có niềm tin</span>.</h1>
      <p className="t-body-lg" style={{ margin: '0 0 var(--space-6)', color: 'rgba(255,255,255,.88)', maxWidth: 560 }}>Aquanix ghi lại từng ngày ở ao để con cá của bạn đi xa hơn: vào nhà máy, ra siêu thị, đến bàn ăn — và ai cũng biết cá đến từ ao nào.</p>
      <div className="hero-ctas" style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <Button onClick={onCta}>Tải app miễn phí</Button>
        {videoExists ? <HeroGhost onClick={() => setOpen(true)}><PlayIcon />Xem hành trình Aquanix</HeroGhost> : <HeroGhost onClick={onDay}>Xem một ngày ở ao</HeroGhost>}
      </div>
    </div>
    {open && <VideoModal onClose={() => setOpen(false)} />}
  </section>;
}
Object.assign(window, { Hero });
