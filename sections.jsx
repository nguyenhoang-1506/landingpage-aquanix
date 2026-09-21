const { Button, StatusBadge, FieldInput } = window.AquanixDesignSystem_4effac;
const P = './assets/photos/opt/';
const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', boxShadow: 'var(--shadow-card)' };
const photo = { width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 'var(--radius-xl)' };
const FOCUS = { 'feeding.jpg': '14% 50%', 'water-test.jpg': '74% 50%', 'farmer-phone.jpg': '20% 50%', 'harvest-scan.jpg': '30% 50%' };
function Eyebrow({ children }) { return <div className="t-label" style={{ color: 'var(--brand-600)', marginBottom: 'var(--space-3)' }}>{children}</div>; }
// App screenshot in a uniform rounded device frame
// app-home / app-account already carry a device bezel — show them bare; the others get a frame
const BEZELED = ['app-home.png', 'app-account.png'];
const TRIM = { 'app-home.png': 'app-home-trim.webp', 'app-account.png': 'app-account-trim.webp' };
function Phone({ src, style, className }) {
  if (BEZELED.includes(src)) return <div className={className} style={{ position: 'relative', ...style }}><img src={P + TRIM[src]} alt="Màn hình app Aquanix" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', filter: 'drop-shadow(0 24px 40px rgba(11,42,51,.28))' }} /></div>;
  return <div className={className} style={{ borderRadius: 36, overflow: 'hidden', background: 'var(--ink)', padding: 6, boxShadow: '0 24px 48px rgba(11,42,51,.28)', ...style }}><img src={P + src} alt="Màn hình app Aquanix" loading="lazy" decoding="async" style={{ width: '100%', display: 'block', borderRadius: 30 }} /></div>;
}
// Photo + phone side by side, phone slightly tucked over the photo with a white ring so both stay legible
function PhotoPhone({ src, app, h = 440 }) {
  return <div className="pp" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,32%)', alignItems: 'center' }}>
    <div className="pp-photo" style={{ height: h, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}><img src={P + src} alt="" loading="lazy" decoding="async" style={{ ...photo, objectPosition: FOCUS[src] || '50% 50%' }} /></div>
    <Phone src={app} className="pp-phone" style={{ marginLeft: '-12%', outline: BEZELED.includes(app) ? 'none' : '8px solid var(--surface)', position: 'relative' }} />
  </div>;
}
function Day() {
  const steps = [
    ['06:30', 'Cho ăn', 'Đổ cám như mọi sáng. Bấm "Cho ăn", chọn ao, nhập số kg.', 'App ghi giờ, ghi ao thay bạn. Cuối vụ, tổng cám từng ao tự cộng xong.', 'feeding.jpg', 'app-log.jpg', 'ok', 'Đã ghi · Ao A06 · 18 kg'],
    ['08:15', 'Đo nước', 'Đo pH, đo oxy như thường lệ. Nhập hai con số.', 'Oxy tụt, app báo ngay ở trang chủ và nói rõ việc cần làm — bật quạt, giảm cám.', 'water-test.jpg', 'app-home.png', 'stop', 'Ao A06 · Oxy 3,2 mg/L · thấp'],
    ['10:40', 'Dùng thuốc', 'Chọn tên thuốc, ghi liều, ghi ao.', 'App tự tính ngày được bán và nhắc bạn trước. Không lo bán sớm, không lo nhà máy trả cá.', 'farmer-phone.jpg', null, 'warn', 'Ao B02 · còn 6 ngày mới được bán'],
  ];
  return <section id="day"><div className="wrap sec">
    <Eyebrow>Một ngày ở ao</Eyebrow>
    <h2 className="t-display-l one-line" style={{ margin: '0 0 var(--space-2)' }}>Việc vẫn làm như cũ. Chỉ thêm một chạm.</h2>
    <p className="t-body-lg" style={{ margin: '0 0 var(--space-7)', color: 'var(--ink-muted)', maxWidth: 560 }}>Ba việc quen tay mỗi sáng — app ghi lại, bạn không phải nhớ.</p>
    <div className="steps" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {steps.map(([t, h, d1, d2, pic, app, st, badge], i) => <div key={t} className={'step' + (i % 2 ? ' rev' : '') + (i === 0 ? ' first' : '') + (i === steps.length - 1 ? ' last' : '')}>
        <div className="step-text">
          <div className="t-code" style={{ color: 'var(--brand-500)', marginBottom: 'var(--space-2)' }}>{t}</div>
          <h3 className="t-display-m day-h3" style={{ margin: '0 0 var(--space-3)', fontSize: 28, lineHeight: '36px' }}>{h}</h3>
          <p className="t-body-lg" style={{ margin: '0 0 var(--space-2)' }}>{d1}</p>
          <p className="t-body-lg" style={{ margin: '0 0 var(--space-4)', color: 'var(--ink-muted)' }}>{d2}</p>
          <StatusBadge status={st} style={{ whiteSpace: 'normal' }}>{badge}</StatusBadge>
        </div>
        <div className="step-rail" aria-hidden="true"><span className="step-no">{i + 1}</span></div>
        <div className="step-media">{app ? <PhotoPhone src={pic} app={app} /> : <div className="solo-photo" style={{ height: 440, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}><img src={P + pic} alt="" loading="lazy" decoding="async" style={{ ...photo, objectPosition: FOCUS[pic] || '50% 50%' }} /></div>}</div>
      </div>)}
    </div>
  </div></section>;
}
function Sell() {
  return <section id="sell" style={{ background: 'var(--surface-sunken)' }}><div className="wrap sec">
    <div className="g2" style={{ gap: 'var(--space-7)', alignItems: 'center' }}>
      <div>
        <Eyebrow>Ngày bán cá</Eyebrow>
        <h2 className="t-display-l" style={{ margin: '0 0 var(--space-4)' }}>Nhập số cân. Hồ sơ cả vụ đã sẵn.</h2>
        <p className="t-body-lg" style={{ margin: '0 0 var(--space-3)' }}>Mọi lần cho ăn, đo nước, dùng thuốc đã nằm trong app từ đầu vụ. Bấm "Khai báo thu hoạch", nhập số cân — hồ sơ lô gửi thẳng cho nhà máy.</p>
        <p className="t-body-lg" style={{ margin: '0 0 var(--space-5)', color: 'var(--ink-muted)' }}>Nhà máy nhận cá kèm giấy tờ đủ: không hỏi lại, không trả về, không trừ giá.</p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}><StatusBadge status="ok">Đủ ngày ngưng thuốc</StatusBadge><StatusBadge>Hồ sơ đã gửi nhà máy</StatusBadge></div>
      </div>
      <PhotoPhone src="harvest-scan.jpg" app="app-trace.jpg" h={460} />
    </div>
  </div></section>;
}
function Why() {
  const items = [['Không mất sổ', 'Sổ tay ướt, rách, thất lạc là mất cả vụ. App giữ dữ liệu trên máy và trên mạng — đổi điện thoại vẫn còn nguyên.'], ['Không bị trả cá', 'Nhà máy chỉ nhận cá đã ngưng thuốc đủ ngày. App nhắc trước nhiều ngày, nên đến lúc bán không ai phải quay xe.'], ['Bán được giá hơn', 'Cá có hồ sơ mới vào được lô xuất khẩu. Lô xuất khẩu, nhà máy trả giá cao hơn lô bán chợ.']];
  return <section id="why"><div className="wrap sec">
    <Eyebrow>Bạn được gì</Eyebrow><h2 className="t-display-l" style={{ margin: '0 0 var(--space-6)' }}>Ba điều hộ nuôi thấy ngay trong vụ đầu</h2>
    <div className="g3" style={{ gap: 'var(--space-4)' }}>{items.map(([t, d], i) => <div key={t} style={{ ...card, background: i === 2 ? 'var(--brand-50)' : 'var(--surface)', borderColor: i === 2 ? 'transparent' : 'var(--border)' }}><h3 className="t-display-m" style={{ margin: '0 0 var(--space-2)' }}>{t}</h3><p className="t-body" style={{ margin: 0, color: 'var(--ink-muted)' }}>{d}</p></div>)}</div>
  </div></section>;
}
function Voice() {
  return <section style={{ position: 'relative', color: '#fff', overflow: 'hidden' }}>
    <img src={P + 'cooperative.jpg'} alt="" loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(11,42,51,.92) 0%, rgba(11,42,51,.55) 60%, rgba(11,42,51,.25) 100%)' }}></div>
    <div className="wrap sec" style={{ position: 'relative' }}>
      <blockquote className="quote" style={{ margin: 0, maxWidth: 640, fontSize: 28, lineHeight: '38px', fontWeight: 600 }}>"Cho ăn xong bấm một cái, khỏi phải nhớ. Sắp bán, app báo còn mấy ngày. Nhà máy nhận cá không hỏi thêm câu nào."</blockquote>
      <div style={{ marginTop: 'var(--space-5)' }}><div className="t-body-strong">Hộ nuôi ao A12</div><div className="t-caption" style={{ color: 'rgba(255,255,255,.75)' }}>Trích dẫn minh hoạ</div></div>
    </div>
  </section>;
}
function Faq() {
  const qs = [['Có tốn tiền không?', 'Không. Hộ nuôi dùng miễn phí — không giới hạn số ao, số lần ghi.'], ['Ở ao mạng yếu thì sao?', 'Vẫn ghi được. App lưu vào máy, có mạng thì tự gửi lên. Bạn không cần làm gì thêm.'], ['Điện thoại cũ có dùng được?', 'Được. Android từ 2018, iPhone từ đời 8. Nút to, chữ to, nhìn rõ ngoài nắng.'], ['Ai xem được dữ liệu ao của tôi?', 'Chỉ bạn và Aquanix. Nhà máy chỉ thấy hồ sơ lô bạn gửi khi bán cá.'], ['Ghi nhầm thì sửa được không?', 'Sửa được trong ngày. Bản sửa lưu kèm bản cũ, hồ sơ vẫn rõ ràng.'], ['Ai cài giúp tôi?', 'Aquanix đến tận ao, cài và hướng dẫn trong 10 phút. Để lại số điện thoại ở cuối trang.']];
  return <section id="faq" style={{ background: 'var(--surface-sunken)' }}><div className="wrap sec">
    <Eyebrow>Hỏi đáp</Eyebrow><h2 className="t-display-l" style={{ margin: '0 0 var(--space-6)' }}>Hộ nuôi hay hỏi</h2>
    <div className="g2" style={{ gap: 'var(--space-4)' }}>{qs.map(([q, a]) => <div key={q} style={card}><h3 style={{ margin: '0 0 var(--space-2)', fontSize: 17, lineHeight: '26px', fontWeight: 600 }}>{q}</h3><p className="t-body" style={{ margin: 0, color: 'var(--ink-muted)' }}>{a}</p></div>)}</div>
  </div></section>;
}
// QR codes for the store links — replace LINKS with the real store URLs
const LINKS = { ios: 'https://apps.apple.com/vn/app/aquanix/id6790356932', android: 'https://aquanix.co/' };
function Qr({ text, label, sub }) {
  const ref = React.useRef();
  React.useEffect(() => { if (window.QRCode && ref.current) { ref.current.innerHTML = ''; new QRCode(ref.current, { text, width: 132, height: 132, colorDark: '#0B2A33', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M }); } }, [text]);
  return <a href={text} target="_blank" rel="noopener" aria-label={'Tải Aquanix trên ' + sub} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', textAlign: 'center', textDecoration: 'none', color: 'var(--ink)' }}><div ref={ref} style={{ width: 120, height: 120, flex: 'none', background: '#fff', padding: 6, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxSizing: 'content-box' }}></div><div><div className="t-body-strong" style={{ color: 'var(--brand-600)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{label}</div><div className="t-caption" style={{ color: 'var(--ink-muted)' }}>{sub}</div></div></a>;
}
function Download({ sent, onSend }) {
  return <section id="download"><div className="wrap sec">
    <Eyebrow>Bắt đầu</Eyebrow>
    <h2 className="t-display-l" style={{ margin: '0 0 var(--space-2)' }}>Bắt đầu vụ này cùng Aquanix</h2>
    <p className="t-body-lg" style={{ margin: '0 0 var(--space-6)', color: 'var(--ink-muted)', maxWidth: 560 }}>Tự cài trong một phút, hoặc để Aquanix đến tận ao cài giúp.</p>
    <div className="g2" style={{ gap: 'var(--space-5)', alignItems: 'start' }}>
      <div style={{ ...card, background: 'var(--brand-50)', borderColor: 'transparent', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        <div><h3 className="t-display-m" style={{ margin: '0 0 var(--space-1)' }}>Tự cài app</h3><p className="t-body" style={{ margin: 0, color: 'var(--ink-muted)' }}>Mở máy ảnh điện thoại, đưa vào mã — app tự mở.</p></div>
        <div className="dl-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', gap: 'var(--space-5)', alignItems: 'center', flex: 1 }}>
          <Phone src="app-home.png" className="dl-phone" style={{ width: '100%', maxWidth: 190, justifySelf: 'center' }} />
          <div className="dl-qrs" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <Qr text={LINKS.android} label="Android" sub="Google Play" />
            <Qr text={LINKS.ios} label="iPhone" sub="App Store" />
          </div>
        </div>
      </div>
      <form style={{ ...card, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }} onSubmit={e => { e.preventDefault(); onSend(); }}>
        <div><h3 className="t-display-m" style={{ margin: '0 0 var(--space-1)' }}>Để Aquanix cài giúp</h3><p className="t-body" style={{ margin: 0, color: 'var(--ink-muted)' }}>Điền thông tin, Aquanix gọi lại trong ngày và hẹn đến ao.</p></div>
        {sent ? <div style={{ padding: 'var(--space-4) 0' }}><StatusBadge status="ok">Đã nhận thông tin · Aquanix gọi lại trong hôm nay</StatusBadge></div> : <>
          <FieldInput label="Họ và tên hộ nuôi" required />
          <div className="g2 form-2" style={{ gap: 'var(--space-4)' }}><FieldInput label="Số điện thoại" inputMode="tel" required /><FieldInput label="Địa chỉ" placeholder="Xã, huyện, tỉnh hoặc tên vùng nuôi" /></div>
          <label style={{ display: 'block' }}><span style={{ display: 'block', fontSize: 12, fontWeight: 600, letterSpacing: '.08em', color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: 8, lineHeight: '16px' }}>Nhu cầu / ghi chú</span><textarea rows={2} placeholder="Ví dụ: nhà có 3 ao, muốn được cài giúp tại ao." style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px 14px', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink)', background: 'var(--surface)', resize: 'vertical' }}></textarea></label>
          <Button type="submit" variant="accent" fullWidth>Gọi lại cho tôi</Button>
        </>}
      </form>
    </div>
  </div></section>;
}
function Footer() {
  return <footer style={{ borderTop: '1px solid var(--border)' }}><div className="wrap" style={{ padding: 'var(--space-6) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
    <img src="../../assets/logo/aquanix-wordmark.png" alt="Aquanix — Nhật ký thuỷ sản điện tử" style={{ height: 40 }} />
    <span className="t-caption" style={{ color: 'var(--ink-muted)', marginLeft: 'auto' }}>Công Ty TNHH Công Nghệ Aquanix</span>
  </div></footer>;
}
Object.assign(window, { Day, Sell, Why, Voice, Faq, Download, Footer });