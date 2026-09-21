const { Button, StatusBadge } = window.AquanixDesignSystem_4effac;
const P = './assets/photos/';
// "Flycam" sequence: high → low. Drop a real drone clip at ui_kits/landing/hero-video.mp4 and it plays instead.
const SHOTS = [P + 'aerial-dawn.png', P + 'lake-cages.png', P + 'feeding.png'];
function FlycamHero() {
  const [i, setI] = React.useState(0);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [videoExists, setVideoExists] = React.useState(false);
  React.useEffect(() => { const t = setInterval(() => setI(x => (x + 1) % SHOTS.length), 6000); return () => clearInterval(t); }, []);
  React.useEffect(() => { fetch('./hero-video.mp4', { method: 'HEAD' }).then(r => r.ok && setVideoExists(true)).catch(() => {}); }, []);
  return <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: 'var(--ink)' }}>
    {SHOTS.map((src, k) => <img key={src} src={src} alt="" className={'shot' + (k === i ? ' on' : '')} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />)}
    {videoExists && <video muted autoPlay loop playsInline onCanPlay={() => setHasVideo(true)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: hasVideo ? 1 : 0, transition: 'opacity 1s' }}><source src="./hero-video.mp4" type="video/mp4" /></video>}
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,42,51,.45) 0%, rgba(11,42,51,.2) 40%, rgba(11,42,51,.85) 100%)' }}></div>
  </div>;
}
function HeroGhost({ children, onClick }) {
  const [h, setH] = React.useState(false);
  return <button type="button" onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600, lineHeight: '20px', borderRadius: 'var(--radius-md)', padding: '14px 20px', minHeight: 48, border: '1.5px solid rgba(255,255,255,.6)', background: h ? 'rgba(255,255,255,.18)' : 'transparent', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 120ms ease-out' }}>{children}</button>;
}
function Hero({ onCta, onDay }) {
  return <section id="top" style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'flex-end', color: '#fff' }}>
    <FlycamHero />
    <div className="wrap" style={{ position: 'relative', width: '100%', paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)' }}>
      <StatusBadge status="ok">Miễn phí cho hộ nuôi</StatusBadge>
      <h1 className="hero-h1" style={{ margin: 'var(--space-4) 0', color: '#fff', fontWeight: 700, letterSpacing: '-0.02em', maxWidth: 820, textWrap: 'pretty' }}>Nuôi cá có nhật ký, <span style={{ textDecoration: 'underline', textDecorationColor: 'var(--accent-500)', textDecorationThickness: 6, textUnderlineOffset: 10, textDecorationSkipInk: 'none' }}>bán cá có niềm tin</span>.</h1>
      <p className="t-body-lg" style={{ margin: '0 0 var(--space-6)', color: 'rgba(255,255,255,.88)', maxWidth: 560, textWrap: 'pretty' }}>Aquanix ghi lại từng ngày ở ao để con cá của bạn đi xa hơn: vào nhà máy, ra siêu thị, đến bàn ăn — và ai cũng biết cá đến từ ao nào.</p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}><Button onClick={onCta}>Tải app miễn phí</Button><HeroGhost onClick={onDay}>Xem một ngày ở ao</HeroGhost></div>
    </div>
  </section>;
}
Object.assign(window, { Hero });