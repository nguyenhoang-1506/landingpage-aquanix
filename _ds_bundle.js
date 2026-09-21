/* @ds-bundle: {"format":4,"namespace":"AquanixDesignSystem_4effac","components":[{"name":"Cover","sourcePath":"components/brand/Cover.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"FieldInput","sourcePath":"components/core/FieldInput.jsx"},{"name":"FieldRow","sourcePath":"components/core/FieldRow.jsx"},{"name":"ScanFrame","sourcePath":"components/core/ScanFrame.jsx"},{"name":"StatTile","sourcePath":"components/core/StatTile.jsx"},{"name":"StatusBadge","sourcePath":"components/core/StatusBadge.jsx"}],"sourceHashes":{"components/brand/Cover.jsx":"161d16034263","components/core/Button.jsx":"1796eeb4abaa","components/core/FieldInput.jsx":"dd4220349d52","components/core/FieldRow.jsx":"5bd86172d30d","components/core/ScanFrame.jsx":"c7ccc7ea8fc9","components/core/StatTile.jsx":"a6f175d3b9ca","components/core/StatusBadge.jsx":"985d99578c26","ui_kits/landing/Header.jsx":"9d997bc11d79","ui_kits/landing/Hero-v2.jsx":"ccb1c5b10b89","ui_kits/landing/Hero.jsx":"cffeb0f8f509","ui_kits/landing/Sections-v2.jsx":"9fb1621aa6ea","ui_kits/landing/Sections.jsx":"9c7ed90ea39a","ui_kits/landing/image-slot.js":"fff26d081c8d"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AquanixDesignSystem_4effac = window.AquanixDesignSystem_4effac || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Cover.jsx
try { (() => {
/** 960×320 brand cover: teal slab, ink + brand-100 satellites bleeding right, accent band, four brackets. Copied from source Cover.html. */
function Cover({
  title = 'Aquanix',
  tagline = 'Nhật ký thuỷ sản điện tử — từ ao nuôi đến tem QR trên bao bì',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 960,
      height: 320,
      background: 'var(--surface)',
      fontFamily: 'var(--font-sans)',
      overflow: 'hidden',
      ...style
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 960 320",
    width: "960",
    height: "320",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("rect", {
    fill: "var(--brand-500)",
    x: "536",
    y: "32",
    width: "260",
    height: "256",
    rx: "28"
  }), /*#__PURE__*/React.createElement("rect", {
    fill: "var(--ink)",
    x: "828",
    y: "32",
    width: "132",
    height: "124",
    rx: "28"
  }), /*#__PURE__*/React.createElement("rect", {
    fill: "var(--brand-100)",
    x: "828",
    y: "164",
    width: "132",
    height: "124",
    rx: "28"
  }), /*#__PURE__*/React.createElement("rect", {
    fill: "var(--accent-500)",
    x: "488",
    y: "32",
    width: "24",
    height: "256",
    rx: "12"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "var(--accent-500)",
    strokeWidth: "7",
    fill: "none",
    strokeLinecap: "square"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M512 92 L512 60 A28 28 0 0 1 540 32 L572 32"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M760 32 L792 32 A28 28 0 0 1 820 60 L820 92"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M820 228 L820 260 A28 28 0 0 1 792 288 L760 288"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M572 288 L540 288 A28 28 0 0 1 512 260 L512 228"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'absolute',
      left: 64,
      top: 150,
      margin: 0,
      maxWidth: 440,
      fontSize: 96,
      lineHeight: .92,
      fontWeight: 700,
      color: 'var(--ink)',
      letterSpacing: '-0.03em'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      position: 'absolute',
      left: 64,
      top: 258,
      margin: 0,
      fontSize: 14,
      lineHeight: '20px',
      color: 'var(--ink-muted)'
    }
  }, tagline));
}
Object.assign(__ds_scope, { Cover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Cover.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  primary: {
    background: 'var(--brand-600)',
    color: 'var(--ink-invert)',
    borderColor: 'transparent'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--brand-600)',
    borderColor: 'var(--border-strong)'
  },
  accent: {
    background: 'var(--accent-500)',
    color: 'var(--ink)',
    borderColor: 'transparent'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--ink-muted)',
    borderColor: 'transparent'
  },
  blocked: {
    background: 'var(--danger-bg)',
    color: 'var(--danger)',
    borderColor: 'transparent',
    cursor: 'not-allowed'
  }
};
const HOVER = {
  primary: {
    background: 'var(--brand-700)'
  },
  secondary: {
    background: 'var(--brand-50)'
  },
  accent: {
    background: 'var(--accent-600)',
    color: 'var(--ink-invert)'
  },
  ghost: {
    background: 'var(--surface-sunken)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  fullWidth,
  style,
  disabled,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const blocked = variant === 'blocked';
  const base = {
    fontFamily: 'var(--font-sans)',
    fontSize: size === 'sm' ? 14 : 15,
    fontWeight: 600,
    lineHeight: '20px',
    borderRadius: 'var(--radius-md)',
    padding: size === 'sm' ? '9px 14px' : '14px 20px',
    minHeight: size === 'sm' ? 40 : 48,
    border: '1.5px solid transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    width: fullWidth ? '100%' : undefined,
    transition: 'background 120ms ease-out, color 120ms ease-out',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    ...V[variant],
    ...(h && !blocked && !disabled ? HOVER[variant] : null),
    ...(disabled && !blocked ? {
      opacity: .5,
      cursor: 'not-allowed'
    } : null),
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    style: base,
    disabled: disabled || blocked,
    "aria-disabled": blocked || disabled || undefined,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest), icon, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/FieldInput.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Write face: labelled input with hint / error line. Label above, never placeholder-as-label. */
function FieldInput({
  label,
  hint,
  error,
  style,
  inputStyle,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '.08em',
      color: 'var(--ink-muted)',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-2)',
      lineHeight: '16px'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({}, rest, {
    onFocus: e => {
      setF(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setF(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      width: '100%',
      boxSizing: 'border-box',
      minHeight: 48,
      border: '1.5px solid ' + (error ? 'var(--danger)' : f ? 'var(--brand-600)' : 'var(--border)'),
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--ink)',
      background: 'var(--surface)',
      outline: 'none',
      boxShadow: f ? '0 0 0 3px var(--brand-100)' : 'none',
      ...inputStyle
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      lineHeight: '20px',
      color: error ? 'var(--danger)' : 'var(--ink-muted)',
      marginTop: 'var(--space-2)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { FieldInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FieldInput.jsx", error: String((e && e.message) || e) }); }

// components/core/FieldRow.jsx
try { (() => {
/** Read face: label–value row inside a lot dossier. Stack several; borders separate them. */
function FieldRow({
  label,
  value,
  code,
  first,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      padding: 'var(--space-3) 0',
      borderTop: first ? 0 : '1px solid var(--border)',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      lineHeight: '23px',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink)',
      fontWeight: code ? 500 : 600,
      fontFamily: code ? 'var(--font-mono)' : undefined,
      fontSize: code ? 14 : 15,
      textAlign: 'right'
    }
  }, value));
}
Object.assign(__ds_scope, { FieldRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/FieldRow.jsx", error: String((e && e.message) || e) }); }

// components/core/ScanFrame.jsx
try { (() => {
/** Four detached corners — the orange part of the logo. Wraps an image / mockup / QR viewfinder. */
function ScanFrame({
  children,
  width = 236,
  height = 180,
  dark,
  onAccent,
  radius = 28,
  arm = 38,
  stroke = 3,
  style
}) {
  const c = onAccent ? 'var(--surface)' : 'var(--accent-500)';
  const b = stroke + 'px solid ' + c;
  const corners = [{
    top: 0,
    left: 0,
    borderRight: 0,
    borderBottom: 0,
    borderTopLeftRadius: radius
  }, {
    top: 0,
    right: 0,
    borderLeft: 0,
    borderBottom: 0,
    borderTopRightRadius: radius
  }, {
    bottom: 0,
    left: 0,
    borderRight: 0,
    borderTop: 0,
    borderBottomLeftRadius: radius
  }, {
    bottom: 0,
    right: 0,
    borderLeft: 0,
    borderTop: 0,
    borderBottomRightRadius: radius
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width,
      height,
      borderRadius: radius,
      overflow: 'hidden',
      background: dark ? 'var(--ink)' : 'var(--brand-100)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--brand-700)',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, corners.map((s, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      width: arm,
      height: arm,
      border: b,
      ...s
    }
  }))));
}
Object.assign(__ds_scope, { ScanFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ScanFrame.jsx", error: String((e && e.message) || e) }); }

// components/core/StatTile.jsx
try { (() => {
function StatTile({
  label,
  value,
  sub,
  progress,
  brand,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: brand ? 'var(--brand-50)' : 'var(--surface)',
      border: '1px solid ' + (brand ? 'transparent' : 'var(--border)'),
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-4)',
      boxShadow: 'var(--shadow-card)',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: 'var(--ink-muted)',
      lineHeight: '16px'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      lineHeight: '38px',
      fontWeight: 700,
      color: brand ? 'var(--brand-700)' : 'var(--ink)',
      marginTop: 'var(--space-2)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, value ?? '—'), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: '20px',
      color: 'var(--ink-muted)',
      marginTop: 'var(--space-1)'
    }
  }, sub), progress != null && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--brand-100)',
      marginTop: 'var(--space-3)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      display: 'block',
      height: '100%',
      width: progress + '%',
      background: 'var(--brand-500)'
    }
  })));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusBadge.jsx
try { (() => {
const T = {
  ok: ['var(--success-bg)', 'var(--success)'],
  warn: ['var(--warning-bg)', 'var(--warning)'],
  stop: ['var(--danger-bg)', 'var(--danger)'],
  neutral: ['var(--brand-100)', 'var(--brand-700)', 'var(--brand-600)']
};
function StatusBadge({
  status = 'neutral',
  children,
  style
}) {
  const [bg, fg, dot] = T[status] || T.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 14px 6px 10px',
      fontFamily: 'var(--font-sans)',
      fontSize: 13,
      fontWeight: 600,
      lineHeight: '20px',
      background: bg,
      color: fg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 9,
      height: 9,
      borderRadius: '50%',
      flex: 'none',
      background: dot || fg
    }
  }), children);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Header.jsx
try { (() => {
const {
  Button
} = window.AquanixDesignSystem_4effac;
const NAV = [['top', 'Mở đầu'], ['day', 'Một ngày ở ao'], ['sell', 'Ngày bán cá'], ['why', 'Bạn được gì'], ['faq', 'Hỏi đáp'], ['download', 'Tải app']];
function useActiveSection() {
  const [active, setActive] = React.useState('top');
  const [progress, setProgress] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(h.scrollTop / (h.scrollHeight - h.clientHeight || 1));
      let cur = 'top';
      for (const [id] of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return [active, progress];
}
function Header({
  onCta
}) {
  const [active, progress] = useActiveSection();
  const go = id => e => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) window.scrollTo({
      top: el.offsetTop - 72,
      behavior: 'smooth'
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      height: 72,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    onClick: go('top'),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      textDecoration: 'none',
      color: 'var(--ink)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/aquanix-mark.png",
    alt: "Aquanix",
    style: {
      height: 36
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: '-0.01em'
    }
  }, "Aquanix")), /*#__PURE__*/React.createElement("nav", {
    className: "nav",
    style: {
      display: 'flex',
      gap: 'var(--space-5)',
      marginLeft: 'auto'
    }
  }, NAV.slice(1, 5).map(([id, l]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    href: '#' + id,
    onClick: go(id),
    style: {
      color: active === id ? 'var(--brand-600)' : 'var(--ink-muted)',
      fontSize: 15,
      fontWeight: 600,
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      borderBottom: '2px solid ' + (active === id ? 'var(--accent-500)' : 'transparent'),
      paddingBottom: 2,
      transition: 'color .15s'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: onCta
  }, "T\u1EA3i app mi\u1EC5n ph\xED"))), /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: 0,
      bottom: -1,
      height: 3,
      width: progress * 100 + '%',
      background: 'var(--accent-500)',
      transition: 'width .1s linear'
    }
  })), /*#__PURE__*/React.createElement("nav", {
    className: "dots",
    "aria-label": "V\u1ECB tr\xED tr\xEAn trang",
    style: {
      position: 'fixed',
      right: 20,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 9,
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, NAV.map(([id, l]) => {
    const on = active === id;
    return /*#__PURE__*/React.createElement("a", {
      key: id,
      href: '#' + id,
      onClick: go(id),
      title: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'flex-end',
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "dot-label",
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: on ? 'var(--ink)' : 'var(--ink-subtle)',
        background: 'rgba(255,255,255,.9)',
        padding: '3px 8px',
        borderRadius: 999,
        opacity: on ? 1 : 0,
        transition: 'opacity .15s',
        whiteSpace: 'nowrap'
      }
    }, l), /*#__PURE__*/React.createElement("span", {
      style: {
        width: on ? 12 : 8,
        height: on ? 12 : 8,
        borderRadius: '50%',
        background: on ? 'var(--accent-500)' : 'var(--border-strong)',
        boxShadow: '0 0 0 3px rgba(255,255,255,.9)',
        transition: 'all .15s'
      }
    }));
  })));
}
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero-v2.jsx
try { (() => {
const {
  Button,
  StatTile,
  StatusBadge
} = window.AquanixDesignSystem_4effac;
const P = '../../assets/photos/';
// "Flycam" sequence: high aerial → lake cages → underwater. Each shot slow-zooms (Ken Burns) and crossfades to the next.
// Drop a real drone clip at ui_kits/landing/hero-video.mp4 and it plays instead of the image sequence.
const SHOTS = [[P + 'aerial-dawn.png', 'Toàn cảnh vùng nuôi'], [P + 'lake-cages.png', 'Lồng bè trên hồ'], [P + 'underwater.png', 'Dưới mặt nước']];
function FlycamHero() {
  const [i, setI] = React.useState(0);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [videoExists, setVideoExists] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % SHOTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    fetch('./hero-video.mp4', {
      method: 'HEAD'
    }).then(r => r.ok && setVideoExists(true)).catch(() => {});
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'var(--ink)'
    }
  }, SHOTS.map(([src], k) => /*#__PURE__*/React.createElement("img", {
    key: src,
    src: src,
    alt: "",
    className: 'shot' + (k === i ? ' on' : ''),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), videoExists && /*#__PURE__*/React.createElement("video", {
    muted: true,
    autoPlay: true,
    loop: true,
    playsInline: true,
    onCanPlay: () => setHasVideo(true),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: hasVideo ? 1 : 0,
      transition: 'opacity 1s'
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "./hero-video.mp4",
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(11,42,51,.55) 0%, rgba(11,42,51,.25) 40%, rgba(11,42,51,.85) 100%)'
    }
  }), !hasVideo && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      display: 'flex',
      gap: 8,
      alignItems: 'center'
    }
  }, SHOTS.map(([, l], k) => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => setI(k),
    "aria-label": l,
    style: {
      width: k === i ? 28 : 8,
      height: 8,
      borderRadius: 999,
      border: 0,
      background: k === i ? 'var(--accent-500)' : 'rgba(255,255,255,.5)',
      cursor: 'pointer',
      padding: 0,
      transition: 'width .3s'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "t-caption",
    style: {
      color: '#fff',
      marginLeft: 8
    }
  }, SHOTS[i][1])));
}
function HeroGhost({
  children,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      lineHeight: '20px',
      borderRadius: 'var(--radius-md)',
      padding: '14px 20px',
      minHeight: 48,
      border: '1.5px solid rgba(255,255,255,.6)',
      background: h ? 'rgba(255,255,255,.18)' : 'transparent',
      color: '#fff',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background 120ms ease-out'
    }
  }, children);
}
function Hero({
  onCta,
  onPricing
}) {
  const steps = ['Nhật ký ao', 'Thu hoạch', 'Nhập nhà máy', 'Tem QR'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'flex-end',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(FlycamHero, null), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      width: '100%',
      paddingTop: 'var(--space-8)',
      paddingBottom: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 'var(--space-4)'
    }
  }, steps.map((s, k) => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: 'rgba(255,255,255,.14)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,.25)',
      borderRadius: 999,
      padding: '6px 12px 6px 6px',
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-code",
    style: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: k === 3 ? 'var(--accent-500)' : '#fff',
      color: 'var(--ink)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 11
    }
  }, k + 1), s))), /*#__PURE__*/React.createElement("h1", {
    className: "hero-h1",
    style: {
      margin: '0 0 var(--space-4)',
      color: '#fff',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      maxWidth: 820,
      textWrap: 'pretty'
    }
  }, "Gi\u1EEF quy\u1EC1n xu\u1EA5t kh\u1EA9u cho ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'underline',
      textDecorationColor: 'var(--accent-500)',
      textDecorationThickness: 6,
      textUnderlineOffset: 10,
      textDecorationSkipInk: 'none'
    }
  }, "t\u1EEBng l\xF4"), " c\xE1 r\xF4 phi"), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-6)',
      color: 'rgba(255,255,255,.85)',
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "Nh\u1EADt k\xFD ao \u0111i\u1EC7n t\u1EED cho h\u1ED9 nu\xF4i, h\u1ED3 s\u01A1 truy xu\u1EA5t cho nh\xE0 m\xE1y, tem QR \u0111\u1ED1i so\xE1t v\u1EDBi NDATrace cho ng\u01B0\u1EDDi mua. \u0110\xE1p \u1EE9ng y\xEAu c\u1EA7u truy xu\u1EA5t c\u1EE7a FDA SIMP (M\u1EF9) v\xE0 EU."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCta
  }, "\u0110\u1EB7t l\u1ECBch demo"), /*#__PURE__*/React.createElement(HeroGhost, {
    onClick: onPricing
  }, "Xem b\u1EA3ng gi\xE1")), /*#__PURE__*/React.createElement("div", {
    className: "g3",
    style: {
      gap: 'var(--space-3)',
      marginTop: 'var(--space-7)'
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    brand: true,
    label: "Ao \u0111ang nu\xF4i",
    value: "48",
    sub: "12 h\u1ED9 nu\xF4i li\xEAn k\u1EBFt"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "L\xF4 \u0111\xE3 truy xu\u1EA5t",
    value: "1.592",
    sub: "T\u1EEB 01/2026"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "H\u1ED3 s\u01A1 \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n",
    value: "96%",
    progress: 96
  }))));
}
function Standards() {
  return /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      alignItems: 'center',
      flexWrap: 'wrap',
      paddingTop: 'var(--space-5)',
      paddingBottom: 'var(--space-5)',
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-caption",
    style: {
      color: 'var(--ink-subtle)'
    }
  }, "\u0110\u1ED1i so\xE1t v\xE0 tu\xE2n th\u1EE7 theo"), ['NDATrace', 'GS1', 'GDST', 'FDA SIMP', 'EU IUU'].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: '-0.01em',
      color: 'var(--ink-muted)'
    }
  }, s)));
}
function Gallery() {
  const pics = ['feeding.png', 'water-test.png', 'fingerlings.png', 'harvest-scan.png', 'cooperative.png', 'farmer-phone.png', 'lake-cages.png', 'underwater.png'];
  const all = pics.concat(pics);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      padding: 'var(--space-6) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "marquee",
    style: {
      display: 'flex',
      gap: 16,
      width: 'max-content'
    }
  }, all.map((p, k) => /*#__PURE__*/React.createElement("img", {
    key: k,
    src: P + p,
    alt: "",
    style: {
      height: 220,
      width: 'auto',
      borderRadius: 'var(--radius-lg)',
      objectFit: 'cover',
      flex: 'none'
    }
  }))));
}
Object.assign(window, {
  Hero,
  Standards,
  Gallery
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero-v2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Hero.jsx
try { (() => {
const {
  Button,
  StatusBadge
} = window.AquanixDesignSystem_4effac;
const P = '../../assets/photos/';
// "Flycam" sequence: high → low. Drop a real drone clip at ui_kits/landing/hero-video.mp4 and it plays instead.
const SHOTS = [P + 'aerial-dawn.png', P + 'lake-cages.png', P + 'feeding.png'];
function FlycamHero() {
  const [i, setI] = React.useState(0);
  const [hasVideo, setHasVideo] = React.useState(false);
  const [videoExists, setVideoExists] = React.useState(false);
  React.useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % SHOTS.length), 6000);
    return () => clearInterval(t);
  }, []);
  React.useEffect(() => {
    fetch('./hero-video.mp4', {
      method: 'HEAD'
    }).then(r => r.ok && setVideoExists(true)).catch(() => {});
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      background: 'var(--ink)'
    }
  }, SHOTS.map((src, k) => /*#__PURE__*/React.createElement("img", {
    key: src,
    src: src,
    alt: "",
    className: 'shot' + (k === i ? ' on' : ''),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), videoExists && /*#__PURE__*/React.createElement("video", {
    muted: true,
    autoPlay: true,
    loop: true,
    playsInline: true,
    onCanPlay: () => setHasVideo(true),
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity: hasVideo ? 1 : 0,
      transition: 'opacity 1s'
    }
  }, /*#__PURE__*/React.createElement("source", {
    src: "./hero-video.mp4",
    type: "video/mp4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(11,42,51,.45) 0%, rgba(11,42,51,.2) 40%, rgba(11,42,51,.85) 100%)'
    }
  }));
}
function HeroGhost({
  children,
  onClick
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      fontWeight: 600,
      lineHeight: '20px',
      borderRadius: 'var(--radius-md)',
      padding: '14px 20px',
      minHeight: 48,
      border: '1.5px solid rgba(255,255,255,.6)',
      background: h ? 'rgba(255,255,255,.18)' : 'transparent',
      color: '#fff',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'background 120ms ease-out'
    }
  }, children);
}
function Hero({
  onCta,
  onDay
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      position: 'relative',
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'flex-end',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(FlycamHero, null), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      position: 'relative',
      width: '100%',
      paddingTop: 'var(--space-8)',
      paddingBottom: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "ok"
  }, "Mi\u1EC5n ph\xED cho h\u1ED9 nu\xF4i"), /*#__PURE__*/React.createElement("h1", {
    className: "hero-h1",
    style: {
      margin: 'var(--space-4) 0',
      color: '#fff',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      maxWidth: 820,
      textWrap: 'pretty'
    }
  }, "Nu\xF4i c\xE1 c\xF3 nh\u1EADt k\xFD, ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'underline',
      textDecorationColor: 'var(--accent-500)',
      textDecorationThickness: 6,
      textUnderlineOffset: 10,
      textDecorationSkipInk: 'none'
    }
  }, "b\xE1n c\xE1 c\xF3 ni\u1EC1m tin"), "."), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-6)',
      color: 'rgba(255,255,255,.88)',
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "Aquanix ghi l\u1EA1i t\u1EEBng ng\xE0y \u1EDF ao \u0111\u1EC3 con c\xE1 c\u1EE7a b\u1EA1n \u0111i xa h\u01A1n: v\xE0o nh\xE0 m\xE1y, ra si\xEAu th\u1ECB, \u0111\u1EBFn b\xE0n \u0103n \u2014 v\xE0 ai c\u0169ng bi\u1EBFt c\xE1 \u0111\u1EBFn t\u1EEB ao n\xE0o."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: onCta
  }, "T\u1EA3i app mi\u1EC5n ph\xED"), /*#__PURE__*/React.createElement(HeroGhost, {
    onClick: onDay
  }, "Xem m\u1ED9t ng\xE0y \u1EDF ao"))));
}
Object.assign(window, {
  Hero
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Sections-v2.jsx
try { (() => {
const {
  Button,
  StatusBadge,
  FieldRow,
  FieldInput,
  ScanFrame
} = window.AquanixDesignSystem_4effac;
const P = '../../assets/photos/';
const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-card)'
};
const img = (src, h, extra) => /*#__PURE__*/React.createElement("img", {
  src: P + src,
  alt: "",
  style: {
    width: '100%',
    height: h,
    objectFit: 'cover',
    display: 'block',
    borderRadius: 'var(--radius-xl)',
    ...extra
  }
});
function Eyebrow({
  children,
  light
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "t-label",
    style: {
      color: light ? 'var(--brand-500)' : 'var(--brand-600)',
      marginBottom: 'var(--space-3)'
    }
  }, children);
}
function Problem() {
  const items = [['Bị từ chối nhập khẩu', 'Một lô thiếu hồ sơ ngưng thuốc là cả container quay đầu. Chi phí lưu kho, vận chuyển và uy tín đổ lên nhà máy.'], ['Thu hồi lô hàng', 'Khi có sự cố, không truy được lô đó đến từ ao nào, thu hoạch ngày nào — buộc thu hồi toàn bộ thay vì một lô.'], ['Dữ liệu giấy rời rạc', 'Sổ tay ở ao, Excel ở AM, phiếu nhập ở nhà máy. Ghép lại mất nhiều ngày, sai một dòng là hồ sơ không khớp.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "problem",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-7)',
      alignItems: 'end',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "V\u1EA5n \u0111\u1EC1"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: 0,
      textWrap: 'pretty'
    }
  }, "Ng\u01B0\u1EDDi mua ng\xE0y c\xE0ng h\u1ECFi \"l\xF4 n\xE0y t\u1EEB ao n\xE0o\" \u2014 v\xE0 gi\u1EA5y kh\xF4ng tr\u1EA3 l\u1EDDi \u0111\u01B0\u1EE3c")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t-metric",
    style: {
      color: 'var(--brand-700)',
      fontSize: 44,
      lineHeight: '48px'
    }
  }, "8 / 10"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: '4px 0 0',
      color: 'var(--ink-muted)'
    }
  }, "nh\xE0 m\xE1y xu\u1EA5t kh\u1EA9u \u0111\u01B0\u1EE3c kh\u1EA3o s\xE1t ph\u1EA3i b\u1ED5 sung h\u1ED3 s\u01A1 truy xu\u1EA5t trong 12 th\xE1ng qua ", /*#__PURE__*/React.createElement("span", {
    className: "t-caption"
  }, "(s\u1ED1 minh ho\u1EA1)")))), img('manual-vs-smart.png', 'auto', {
    marginBottom: 'var(--space-6)',
    aspectRatio: '16/9',
    boxShadow: 'var(--shadow-card)'
  }), /*#__PURE__*/React.createElement("div", {
    className: "g3",
    style: {
      gap: 'var(--space-4)'
    }
  }, items.map(([t, d]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: card
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "stop",
    style: {
      marginBottom: 'var(--space-3)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)',
      textWrap: 'pretty'
    }
  }, d))))));
}
function Ecosystem() {
  const nodes = [['Hộ nuôi', 'Ghi nhật ký ao trên điện thoại', 'feeding.png'], ['Account Manager', 'Theo dõi vùng nuôi, nhắc ngưng thuốc', 'cooperative.png'], ['Nhà máy', 'Nhận lô kèm hồ sơ, tạo lô sản xuất', 'harvest-scan.png'], ['Người mua / QR', 'Quét tem, thấy cả chuỗi', 'pack-qr-phone.png']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "H\u1EC7 sinh th\xE1i"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-6)',
      maxWidth: 620,
      textWrap: 'pretty'
    }
  }, "M\u1ED9t h\u1ED3 s\u01A1 ch\u1EA1y su\u1ED1t t\u1EEB ao \u0111\u1EBFn bao b\xEC"), /*#__PURE__*/React.createElement("div", {
    className: "g4",
    style: {
      gap: 'var(--space-4)'
    }
  }, nodes.map(([t, d, p], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      minHeight: 340,
      display: 'flex',
      alignItems: 'flex-end',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + p,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, transparent 35%, rgba(11,42,51,.9) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      padding: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-code",
    style: {
      color: i === 3 ? 'var(--accent-500)' : 'var(--brand-500)'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: '6px 0 4px',
      fontSize: 20,
      lineHeight: '28px',
      color: '#fff'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.8)'
    }
  }, d)))))));
}
function Flow() {
  const steps = [['01', 'Ghi nhật ký ao', 'Cho ăn, dùng thuốc, đo nước — ghi một tay ngay bờ ao, mạng yếu vẫn lưu.'], ['02', 'Khai báo thu hoạch', 'Hệ thống kiểm tra thời gian ngưng thuốc trước khi cho tạo lô.'], ['03', 'Nhập nhà máy', 'Lô nhập kèm hồ sơ đầy đủ; thiếu dữ liệu thì báo ngay tại cổng.'], ['04', 'Tem QR / NDATrace', 'Mỗi lô sản xuất một tem; dữ liệu đối soát với NDATrace.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    style: {
      position: 'relative',
      color: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + 'underwater.png',
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(11,42,51,.82)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap sec",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    light: true
  }, "C\xE1ch ho\u1EA1t \u0111\u1ED9ng"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-6)',
      color: '#fff',
      maxWidth: 560,
      textWrap: 'pretty'
    }
  }, "B\u1ED1n b\u01B0\u1EDBc, m\u1ED9t h\u1ED3 s\u01A1, kh\xF4ng b\u1ECB t\u1EEB ch\u1ED1i nh\u1EADp kh\u1EA9u"), /*#__PURE__*/React.createElement("div", {
    className: "g4",
    style: {
      gap: 'var(--space-4)'
    }
  }, steps.map(([n, t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      background: 'rgba(255,255,255,.08)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(255,255,255,.15)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "t-code",
    style: {
      color: i === 3 ? 'var(--accent-500)' : 'var(--brand-500)'
    }
  }, n), /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: 'var(--space-3) 0 var(--space-2)',
      fontSize: 20,
      lineHeight: '28px',
      color: '#fff'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.8)'
    }
  }, d))))));
}
function Features() {
  const blocks = [['Nhật ký ao', 'Ghi được khi đứng bên bờ ao', 'Nút cao 48px, nền sáng, ba việc chính một chạm: cho ăn, dùng thuốc, đo nước. Mất mạng vẫn ghi, có mạng tự đồng bộ.', 'farmer-phone.png'], ['Kiểm tra ngưng thuốc', 'Chặn trước khi sai, không phạt sau khi xong', 'Khai báo thu hoạch chỉ mở khi đủ ngày ngưng thuốc. Nút bị chặn nói rõ lý do và còn bao nhiêu ngày.', 'water-test.png'], ['Hồ sơ lô', 'Mỗi lô trả lời được: hợp lệ không, dựa trên dữ liệu nào', 'Nhật ký ao, kết quả ngưng thuốc, phiếu nhập nhà máy gom vào một hồ sơ. Mã lô, mã ao, mã tem đối chiếu từng ký tự.', null]];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, blocks.map(([eb, h, d, p], i) => /*#__PURE__*/React.createElement("div", {
    key: eb,
    className: 'g2 feat' + (i % 2 ? ' rev' : ''),
    style: {
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, eb), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-4)',
      textWrap: 'pretty'
    }
  }, h), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: 0,
      color: 'var(--ink-muted)',
      textWrap: 'pretty'
    }
  }, d)), p ? /*#__PURE__*/React.createElement(ScanFrame, {
    width: "100%",
    height: 380,
    style: {
      background: 'var(--brand-100)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + p,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })) : /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      padding: 'var(--space-4) var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      paddingBottom: 'var(--space-3)',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "t-code"
  }, "RP-2026-A12-0417"), /*#__PURE__*/React.createElement("span", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)'
    }
  }, "Ao A12 \xB7 thu ho\u1EA1ch 18/09"), /*#__PURE__*/React.createElement(StatusBadge, {
    status: "ok",
    style: {
      marginLeft: 'auto'
    }
  }, "\u0110\u1EA1t chu\u1EA9n")), /*#__PURE__*/React.createElement(FieldRow, {
    first: true,
    label: "Ao",
    value: "A12 \u2014 H\u1EA3i V\u01B0\u01A1ng 3"
  }), /*#__PURE__*/React.createElement(FieldRow, {
    label: "Ng\xE0y thu",
    value: "18/09/2026"
  }), /*#__PURE__*/React.createElement(FieldRow, {
    label: "Kh\u1ED1i l\u01B0\u1EE3ng",
    value: "1.240 kg"
  }), /*#__PURE__*/React.createElement(FieldRow, {
    label: "Ng\u01B0ng thu\u1ED1c",
    value: "21 ng\xE0y \xB7 \u0111\u1EE7"
  }), /*#__PURE__*/React.createElement(FieldRow, {
    label: "M\xE3 tem QR",
    value: "NDA-7F2K-90AX",
    code: true
  }))))));
}
function Qr() {
  return /*#__PURE__*/React.createElement("section", {
    id: "qr",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-7)',
      alignItems: 'center',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Tr\u1EA3i nghi\u1EC7m QR"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-4)',
      textWrap: 'pretty'
    }
  }, "Ng\u01B0\u1EDDi mua qu\xE9t tem tr\xEAn bao b\xEC, th\u1EA5y c\u1EA3 chu\u1ED7i"), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-6)',
      color: 'var(--ink-muted)',
      maxWidth: 480,
      textWrap: 'pretty'
    }
  }, "Tem ch\u1EC9 \u0111\u01B0\u1EE3c t\u1EA1o khi l\xF4 \u0111\u1EE7 \u0111i\u1EC1u ki\u1EC7n. Qu\xE9t b\u1EB1ng b\u1EA5t k\u1EF3 \u0111i\u1EC7n tho\u1EA1i n\xE0o, kh\xF4ng c\u1EA7n c\xE0i app \u2014 ra \u0111\xFAng ao, \u0111\xFAng ng\xE0y thu, \u0111\xFAng nh\xE0 m\xE1y, \u0111\u1ED1i so\xE1t v\u1EDBi NDATrace."), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "T\u1EA1o tem QR th\u1EED")), img('pack-qr-phone.png', 'auto', {
    aspectRatio: '16/9',
    boxShadow: 'var(--shadow-card)'
  })), img('pack-qr-journey.png', 'auto', {
    aspectRatio: '16/9',
    boxShadow: 'var(--shadow-card)'
  })));
}
function Audiences() {
  const a = [['Hộ nuôi', 'Miễn phí', 'Ghi nhật ký một tay, nhận nhắc ngưng thuốc, có hồ sơ khi bán cá.', 'fingerlings.png'], ['Account Manager', 'Theo vùng nuôi', 'Thấy mọi ao trong vùng, biết ao nào thiếu nhật ký, ao nào sắp thu.', 'farmer-data.png'], ['Nhà máy', 'Tuân thủ & báo cáo', 'Nhận lô kèm hồ sơ, tạo tem QR, xuất chứng từ cho khách nước ngoài.', 'harvest-scan.png']];
  return /*#__PURE__*/React.createElement("section", {
    id: "who"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Cho t\u1EEBng \u0111\u1ED1i t\u01B0\u1EE3ng"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-6)',
      textWrap: 'pretty'
    }
  }, "Ba vai, m\u1ED9t d\u1EEF li\u1EC7u"), /*#__PURE__*/React.createElement("div", {
    className: "g3",
    style: {
      gap: 'var(--space-5)'
    }
  }, a.map(([t, tag, d, p]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      ...card,
      padding: 0,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + p,
    alt: "",
    style: {
      width: '100%',
      height: 220,
      objectFit: 'cover',
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, null, tag), /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: 'var(--space-3) 0 var(--space-2)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)',
      textWrap: 'pretty'
    }
  }, d)))))));
}
function Pricing({
  onCta
}) {
  const tiers = [['Hộ nuôi', 'Miễn phí', 'mãi mãi', ['Nhật ký ao không giới hạn', 'Nhắc thời gian ngưng thuốc', 'Khai báo thu hoạch', 'Hồ sơ lô của mình'], 'secondary', 'Tải app'], ['Nhà máy', 'Liên hệ', 'gói theo năm + phí theo lô / tem QR', ['Nhận lô kèm hồ sơ truy xuất', 'Tạo tem QR đối soát NDATrace', 'Báo cáo tuân thủ FDA SIMP, EU', 'Kết nối hộ nuôi & AM trong vùng'], 'primary', 'Đặt lịch demo'], ['Chuỗi / Tập đoàn', 'Liên hệ', 'nhiều nhà máy, nhiều vùng nuôi', ['Tất cả của gói Nhà máy', 'Nhiều nhà máy trong một tài khoản', 'Kết nối API với ERP', 'Hỗ trợ triển khai tại vùng nuôi'], 'secondary', 'Liên hệ']];
  return /*#__PURE__*/React.createElement("section", {
    id: "pricing",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "B\u1EA3ng gi\xE1"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-2)',
      textWrap: 'pretty'
    }
  }, "H\u1ED9 nu\xF4i mi\u1EC5n ph\xED. Nh\xE0 m\xE1y tr\u1EA3 theo l\xF4."), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-6)',
      color: 'var(--ink-muted)'
    }
  }, "D\u1EEF li\u1EC7u ao c\xE0ng \u0111\u1EA7y \u0111\u1EE7 th\xEC h\u1ED3 s\u01A1 nh\xE0 m\xE1y c\xE0ng ch\u1EAFc \u2014 n\xEAn ch\xFAng t\xF4i kh\xF4ng thu ti\u1EC1n ng\u01B0\u1EDDi ghi."), /*#__PURE__*/React.createElement("div", {
    className: "g3",
    style: {
      gap: 'var(--space-4)',
      alignItems: 'stretch'
    }
  }, tiers.map(([t, p, s, feats, v, cta], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      ...card,
      display: 'flex',
      flexDirection: 'column',
      border: i === 1 ? '2px solid var(--brand-600)' : '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: 0
    }
  }, t), i === 1 && /*#__PURE__*/React.createElement(StatusBadge, null, "Ph\u1ED5 bi\u1EBFn")), /*#__PURE__*/React.createElement("div", {
    className: "t-metric",
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 30,
      lineHeight: '36px'
    }
  }, p), /*#__PURE__*/React.createElement("div", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)'
    }
  }, s), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 'var(--space-5) 0',
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1
    }
  }, feats.map(x => /*#__PURE__*/React.createElement("li", {
    key: x,
    style: {
      display: 'flex',
      gap: 10,
      fontSize: 15,
      lineHeight: '23px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--success)',
      marginTop: 8,
      flex: 'none'
    }
  }), x))), /*#__PURE__*/React.createElement(Button, {
    variant: v,
    fullWidth: true,
    onClick: onCta
  }, cta))))));
}
function Testimonials() {
  const q = [['"Trước đây mỗi lần khách Mỹ hỏi hồ sơ là cả phòng QA lục sổ ba ngày. Giờ gửi một mã lô là xong."', 'Trưởng phòng QA', 'Nhà máy chế biến Hải Vương 1', 'harvest-scan.png'], ['"Tôi ghi cho ăn xong bấm một cái, khỏi phải nhớ. Đến ngày bán, app báo còn mấy ngày ngưng thuốc."', 'Hộ nuôi', 'Ao A12, vùng nuôi Hải Vương 3', 'feeding.png']];
  return /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-5)'
    }
  }, q.map(([t, r, o, p]) => /*#__PURE__*/React.createElement("figure", {
    key: o,
    style: {
      ...card,
      margin: 0,
      display: 'grid',
      gridTemplateColumns: '120px 1fr',
      gap: 'var(--space-4)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + p,
    alt: "",
    style: {
      width: 120,
      height: 160,
      objectFit: 'cover',
      borderRadius: 'var(--radius-md)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("blockquote", {
    className: "t-body-lg",
    style: {
      margin: 0,
      textWrap: 'pretty'
    }
  }, t), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "t-body-strong"
  }, r), /*#__PURE__*/React.createElement("div", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)'
    }
  }, o)))))), /*#__PURE__*/React.createElement("p", {
    className: "t-caption",
    style: {
      color: 'var(--ink-subtle)',
      marginTop: 'var(--space-3)'
    }
  }, "Tr\xEDch d\u1EABn minh ho\u1EA1 \u2014 thay b\u1EB1ng ph\u1EA3n h\u1ED3i th\u1EADt tr\u01B0\u1EDBc khi c\xF4ng b\u1ED1.")));
}
function Contact({
  sent,
  onSend
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      position: 'relative',
      color: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + 'aerial-dawn.png',
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(11,42,51,.7)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap sec g2",
    style: {
      position: 'relative',
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-4)',
      color: '#fff',
      textWrap: 'pretty'
    }
  }, "\u0110\u1EB7t l\u1ECBch demo v\u1EDBi v\xF9ng nu\xF4i c\u1EE7a b\u1EA1n"), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: 0,
      color: 'rgba(255,255,255,.85)',
      textWrap: 'pretty'
    }
  }, "Ch\xFAng t\xF4i \u0111\u1EBFn t\u1EADn ao, d\u1EF1ng h\u1ED3 s\u01A1 m\u1ED9t l\xF4 th\u1EADt trong 30 ph\xFAt.")), /*#__PURE__*/React.createElement("form", {
    style: {
      ...card,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      color: 'var(--ink)'
    },
    onSubmit: e => {
      e.preventDefault();
      onSend();
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "ok"
  }, "\u0110\xE3 nh\u1EADn y\xEAu c\u1EA7u \xB7 g\u1ECDi l\u1EA1i trong 1 ng\xE0y l\xE0m vi\u1EC7c")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FieldInput, {
    label: "H\u1ECD t\xEAn",
    required: true
  }), /*#__PURE__*/React.createElement(FieldInput, {
    label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
    inputMode: "tel",
    required: true,
    hint: "Ch\xFAng t\xF4i g\u1ECDi l\u1EA1i trong gi\u1EDD h\xE0nh ch\xEDnh."
  }), /*#__PURE__*/React.createElement(FieldInput, {
    label: "Nh\xE0 m\xE1y / v\xF9ng nu\xF4i"
  }), /*#__PURE__*/React.createElement(FieldInput, {
    label: "B\u1EA1n l\xE0",
    defaultValue: "Nh\xE0 m\xE1y ch\u1EBF bi\u1EBFn"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    fullWidth: true
  }, "G\u1EEDi y\xEAu c\u1EA7u")))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: 'var(--space-6) var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/aquanix-wordmark.png",
    alt: "Aquanix \u2014 Nh\u1EADt k\xFD thu\u1EF7 s\u1EA3n \u0111i\u1EC7n t\u1EED",
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)',
      marginLeft: 'auto'
    }
  }, "R\xF4 Phi H\u1EA3i V\u01B0\u01A1ng VN \xB7 \u0110\u1ED1i so\xE1t NDATrace")));
}
Object.assign(window, {
  Problem,
  Ecosystem,
  Flow,
  Features,
  Qr,
  Audiences,
  Pricing,
  Testimonials,
  Contact,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Sections-v2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/Sections.jsx
try { (() => {
const {
  Button,
  StatusBadge,
  FieldInput
} = window.AquanixDesignSystem_4effac;
const P = '../../assets/photos/';
const card = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-card)'
};
const photo = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  borderRadius: 'var(--radius-xl)'
};
const FOCUS = {
  'feeding.png': '14% 50%',
  'water-test.png': '74% 50%',
  'farmer-phone.png': '20% 50%',
  'harvest-scan.png': '30% 50%'
};
function Eyebrow({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "t-label",
    style: {
      color: 'var(--brand-600)',
      marginBottom: 'var(--space-3)'
    }
  }, children);
}
// App screenshot in a uniform rounded device frame
// app-home / app-account already carry a device bezel — show them bare; the others get a frame
const BEZELED = ['app-home.png', 'app-account.png'];
const TRIM = {
  'app-home.png': 'app-home-trim.png',
  'app-account.png': 'app-account-trim.png'
};
function Phone({
  src,
  style
}) {
  if (BEZELED.includes(src)) return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + TRIM[src],
    alt: "M\xE0n h\xECnh app Aquanix",
    style: {
      width: '100%',
      display: 'block',
      filter: 'drop-shadow(0 24px 40px rgba(11,42,51,.28))'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 36,
      overflow: 'hidden',
      background: 'var(--ink)',
      padding: 6,
      boxShadow: '0 24px 48px rgba(11,42,51,.28)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + src,
    alt: "M\xE0n h\xECnh app Aquanix",
    style: {
      width: '100%',
      display: 'block',
      borderRadius: 30
    }
  }));
}
// Photo + phone side by side, phone slightly tucked over the photo with a white ring so both stay legible
function PhotoPhone({
  src,
  app,
  h = 440
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,32%)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: h,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + src,
    alt: "",
    style: {
      ...photo,
      objectPosition: FOCUS[src] || '50% 50%'
    }
  })), /*#__PURE__*/React.createElement(Phone, {
    src: app,
    style: {
      marginLeft: '-12%',
      outline: BEZELED.includes(app) ? 'none' : '8px solid var(--surface)',
      position: 'relative'
    }
  }));
}
function Day() {
  const steps = [['06:30', 'Cho ăn', 'Đổ cám như mọi sáng. Bấm "Cho ăn", chọn ao, nhập số kg.', 'App ghi giờ, ghi ao thay bạn. Cuối vụ, tổng cám từng ao tự cộng xong.', 'feeding.png', 'app-log.png', 'ok', 'Đã ghi · Ao A06 · 18 kg'], ['08:15', 'Đo nước', 'Đo pH, đo oxy như thường lệ. Nhập hai con số.', 'Oxy tụt, app báo ngay ở trang chủ và nói rõ việc cần làm — bật quạt, giảm cám.', 'water-test.png', 'app-home.png', 'stop', 'Ao A06 · Oxy 3,2 mg/L · thấp'], ['10:40', 'Dùng thuốc', 'Chọn tên thuốc, ghi liều, ghi ao.', 'App tự tính ngày được bán và nhắc bạn trước. Không lo bán sớm, không lo nhà máy trả cá.', 'farmer-phone.png', null, 'warn', 'Ao B02 · còn 6 ngày mới được bán']];
  return /*#__PURE__*/React.createElement("section", {
    id: "day"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "M\u1ED9t ng\xE0y \u1EDF ao"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-2)',
      maxWidth: 640,
      textWrap: 'pretty'
    }
  }, "Vi\u1EC7c v\u1EABn l\xE0m nh\u01B0 c\u0169. Ch\u1EC9 th\xEAm m\u1ED9t ch\u1EA1m."), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-7)',
      color: 'var(--ink-muted)',
      maxWidth: 560
    }
  }, "Ba vi\u1EC7c quen tay m\u1ED7i s\xE1ng \u2014 app ghi l\u1EA1i, b\u1EA1n kh\xF4ng ph\u1EA3i nh\u1EDB."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-8)'
    }
  }, steps.map(([t, h, d1, d2, pic, app, st, badge], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    className: 'g2 feat' + (i % 2 ? ' rev' : ''),
    style: {
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t-code",
    style: {
      color: 'var(--brand-500)',
      marginBottom: 'var(--space-2)'
    }
  }, t), /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: '0 0 var(--space-3)',
      fontSize: 28,
      lineHeight: '36px'
    }
  }, h), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-2)'
    }
  }, d1), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-4)',
      color: 'var(--ink-muted)'
    }
  }, d2), /*#__PURE__*/React.createElement(StatusBadge, {
    status: st
  }, badge)), app ? /*#__PURE__*/React.createElement(PhotoPhone, {
    src: pic,
    app: app
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      height: 440,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-card)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + pic,
    alt: "",
    style: {
      ...photo,
      objectPosition: FOCUS[pic] || '50% 50%'
    }
  })))))));
}
function Sell() {
  return /*#__PURE__*/React.createElement("section", {
    id: "sell",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-7)',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Ng\xE0y b\xE1n c\xE1"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-4)',
      textWrap: 'pretty'
    }
  }, "Nh\u1EADp s\u1ED1 c\xE2n. H\u1ED3 s\u01A1 c\u1EA3 v\u1EE5 \u0111\xE3 s\u1EB5n."), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-3)'
    }
  }, "M\u1ECDi l\u1EA7n cho \u0103n, \u0111o n\u01B0\u1EDBc, d\xF9ng thu\u1ED1c \u0111\xE3 n\u1EB1m trong app t\u1EEB \u0111\u1EA7u v\u1EE5. B\u1EA5m \"Khai b\xE1o thu ho\u1EA1ch\", nh\u1EADp s\u1ED1 c\xE2n \u2014 h\u1ED3 s\u01A1 l\xF4 g\u1EEDi th\u1EB3ng cho nh\xE0 m\xE1y."), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-5)',
      color: 'var(--ink-muted)'
    }
  }, "Nh\xE0 m\xE1y nh\u1EADn c\xE1 k\xE8m gi\u1EA5y t\u1EDD \u0111\u1EE7: kh\xF4ng h\u1ECFi l\u1EA1i, kh\xF4ng tr\u1EA3 v\u1EC1, kh\xF4ng tr\u1EEB gi\xE1."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "ok"
  }, "\u0110\u1EE7 ng\xE0y ng\u01B0ng thu\u1ED1c"), /*#__PURE__*/React.createElement(StatusBadge, null, "H\u1ED3 s\u01A1 \u0111\xE3 g\u1EEDi nh\xE0 m\xE1y"))), /*#__PURE__*/React.createElement(PhotoPhone, {
    src: "harvest-scan.png",
    app: "app-trace.png",
    h: 460
  }))));
}
function Why() {
  const items = [['Không mất sổ', 'Sổ tay ướt, rách, thất lạc là mất cả vụ. App giữ dữ liệu trên máy và trên mạng — đổi điện thoại vẫn còn nguyên.'], ['Không bị trả cá', 'Nhà máy chỉ nhận cá đã ngưng thuốc đủ ngày. App nhắc trước nhiều ngày, nên đến lúc bán không ai phải quay xe.'], ['Bán được giá hơn', 'Cá có hồ sơ mới vào được lô xuất khẩu. Lô xuất khẩu, nhà máy trả giá cao hơn lô bán chợ.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "why"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "B\u1EA1n \u0111\u01B0\u1EE3c g\xEC"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-6)',
      textWrap: 'pretty'
    }
  }, "Ba \u0111i\u1EC1u h\u1ED9 nu\xF4i th\u1EA5y ngay trong v\u1EE5 \u0111\u1EA7u"), /*#__PURE__*/React.createElement("div", {
    className: "g3",
    style: {
      gap: 'var(--space-4)'
    }
  }, items.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      ...card,
      background: i === 2 ? 'var(--brand-50)' : 'var(--surface)',
      borderColor: i === 2 ? 'transparent' : 'var(--border)'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: '0 0 var(--space-2)'
    }
  }, t), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)',
      textWrap: 'pretty'
    }
  }, d))))));
}
function Voice() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      color: '#fff',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: P + 'cooperative.png',
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, rgba(11,42,51,.92) 0%, rgba(11,42,51,.55) 60%, rgba(11,42,51,.25) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap sec",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("blockquote", {
    style: {
      margin: 0,
      maxWidth: 640,
      fontSize: 28,
      lineHeight: '38px',
      fontWeight: 600,
      textWrap: 'pretty'
    }
  }, "\"Cho \u0103n xong b\u1EA5m m\u1ED9t c\xE1i, kh\u1ECFi ph\u1EA3i nh\u1EDB. S\u1EAFp b\xE1n, app b\xE1o c\xF2n m\u1EA5y ng\xE0y. Nh\xE0 m\xE1y nh\u1EADn c\xE1 kh\xF4ng h\u1ECFi th\xEAm c\xE2u n\xE0o.\""), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "t-body-strong"
  }, "H\u1ED9 nu\xF4i ao A12"), /*#__PURE__*/React.createElement("div", {
    className: "t-caption",
    style: {
      color: 'rgba(255,255,255,.75)'
    }
  }, "V\xF9ng nu\xF4i H\u1EA3i V\u01B0\u01A1ng 3 \xB7 tr\xEDch d\u1EABn minh ho\u1EA1"))));
}
function Faq() {
  const qs = [['Có tốn tiền không?', 'Không. Hộ nuôi dùng miễn phí — không giới hạn số ao, số lần ghi.'], ['Ở ao mạng yếu thì sao?', 'Vẫn ghi được. App lưu vào máy, có mạng thì tự gửi lên. Bạn không cần làm gì thêm.'], ['Điện thoại cũ có dùng được?', 'Được. Android từ 2018, iPhone từ đời 8. Nút to, chữ to, nhìn rõ ngoài nắng.'], ['Ai xem được dữ liệu ao của tôi?', 'Chỉ bạn và Aquanix. Nhà máy chỉ thấy hồ sơ lô bạn gửi khi bán cá.'], ['Ghi nhầm thì sửa được không?', 'Sửa được trong ngày. Bản sửa lưu kèm bản cũ, hồ sơ vẫn rõ ràng.'], ['Ai cài giúp tôi?', 'Aquanix đến tận ao, cài và hướng dẫn trong 10 phút. Để lại số điện thoại ở cuối trang.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "faq",
    style: {
      background: 'var(--surface-sunken)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "H\u1ECFi \u0111\xE1p"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-6)'
    }
  }, "H\u1ED9 nu\xF4i hay h\u1ECFi"), /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-4)'
    }
  }, qs.map(([q, a]) => /*#__PURE__*/React.createElement("div", {
    key: q,
    style: card
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 var(--space-2)',
      fontSize: 17,
      lineHeight: '26px',
      fontWeight: 600
    }
  }, q), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)'
    }
  }, a))))));
}
// QR codes for the store links — replace LINKS with the real store URLs
const LINKS = {
  ios: 'https://apps.apple.com/vn/app/aquanix',
  android: 'https://play.google.com/store/apps/details?id=vn.aquanix'
};
function Qr({
  text,
  label,
  sub
}) {
  const ref = React.useRef();
  React.useEffect(() => {
    if (window.QRCode && ref.current) {
      ref.current.innerHTML = '';
      new QRCode(ref.current, {
        text,
        width: 132,
        height: 132,
        colorDark: '#0B2A33',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }, [text]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-2)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      width: 120,
      height: 120,
      flex: 'none',
      background: '#fff',
      padding: 6,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      boxSizing: 'content-box'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "t-body-strong"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)'
    }
  }, sub)));
}
function Download({
  sent,
  onSend
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: "download"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap sec"
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "B\u1EAFt \u0111\u1EA7u"), /*#__PURE__*/React.createElement("h2", {
    className: "t-display-l",
    style: {
      margin: '0 0 var(--space-2)',
      textWrap: 'pretty'
    }
  }, "B\u1EAFt \u0111\u1EA7u v\u1EE5 n\xE0y c\xF9ng Aquanix"), /*#__PURE__*/React.createElement("p", {
    className: "t-body-lg",
    style: {
      margin: '0 0 var(--space-6)',
      color: 'var(--ink-muted)',
      maxWidth: 560
    }
  }, "T\u1EF1 c\xE0i trong m\u1ED9t ph\xFAt, ho\u1EB7c \u0111\u1EC3 Aquanix \u0111\u1EBFn t\u1EADn ao c\xE0i gi\xFAp."), /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-5)',
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      background: 'var(--brand-50)',
      borderColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: '0 0 var(--space-1)'
    }
  }, "T\u1EF1 c\xE0i app"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)'
    }
  }, "M\u1EDF m\xE1y \u1EA3nh \u0111i\u1EC7n tho\u1EA1i, \u0111\u01B0a v\xE0o m\xE3 \u2014 app t\u1EF1 m\u1EDF.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) auto',
      gap: 'var(--space-5)',
      alignItems: 'center',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Phone, {
    src: "app-home.png",
    style: {
      width: '100%',
      maxWidth: 190,
      justifySelf: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(Qr, {
    text: LINKS.android,
    label: "Android",
    sub: "Google Play"
  }), /*#__PURE__*/React.createElement(Qr, {
    text: LINKS.ios,
    label: "iPhone",
    sub: "App Store"
  })))), /*#__PURE__*/React.createElement("form", {
    style: {
      ...card,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    },
    onSubmit: e => {
      e.preventDefault();
      onSend();
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "t-display-m",
    style: {
      margin: '0 0 var(--space-1)'
    }
  }, "\u0110\u1EC3 Aquanix c\xE0i gi\xFAp"), /*#__PURE__*/React.createElement("p", {
    className: "t-body",
    style: {
      margin: 0,
      color: 'var(--ink-muted)'
    }
  }, "\u0110i\u1EC1n th\xF4ng tin, Aquanix g\u1ECDi l\u1EA1i trong ng\xE0y v\xE0 h\u1EB9n \u0111\u1EBFn ao.")), sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 'var(--space-4) 0'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "ok"
  }, "\u0110\xE3 nh\u1EADn th\xF4ng tin \xB7 Aquanix g\u1ECDi l\u1EA1i trong h\xF4m nay")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FieldInput, {
    label: "H\u1ECD v\xE0 t\xEAn h\u1ED9 nu\xF4i",
    required: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "g2",
    style: {
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(FieldInput, {
    label: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i",
    inputMode: "tel",
    required: true
  }), /*#__PURE__*/React.createElement(FieldInput, {
    label: "\u0110\u1ECBa ch\u1EC9",
    hint: "X\xE3, huy\u1EC7n, t\u1EC9nh ho\u1EB7c t\xEAn v\xF9ng nu\xF4i"
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: '.08em',
      color: 'var(--ink-muted)',
      textTransform: 'uppercase',
      marginBottom: 8,
      lineHeight: '16px'
    }
  }, "Nhu c\u1EA7u / ghi ch\xFA"), /*#__PURE__*/React.createElement("textarea", {
    rows: 2,
    style: {
      width: '100%',
      boxSizing: 'border-box',
      border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 15,
      color: 'var(--ink)',
      background: 'var(--surface)',
      resize: 'vertical'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 13,
      lineHeight: '20px',
      color: 'var(--ink-muted)',
      marginTop: 8
    }
  }, "V\xED d\u1EE5: nh\xE0 c\xF3 3 ao, mu\u1ED1n \u0111\u01B0\u1EE3c c\xE0i gi\xFAp t\u1EA1i ao.")), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    variant: "accent",
    fullWidth: true
  }, "G\u1ECDi l\u1EA1i cho t\xF4i"))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      padding: 'var(--space-6) var(--space-5)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/aquanix-wordmark.png",
    alt: "Aquanix \u2014 Nh\u1EADt k\xFD thu\u1EF7 s\u1EA3n \u0111i\u1EC7n t\u1EED",
    style: {
      height: 40
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "t-caption",
    style: {
      color: 'var(--ink-muted)',
      marginLeft: 'auto'
    }
  }, "R\xF4 Phi H\u1EA3i V\u01B0\u01A1ng VN")));
}
Object.assign(window, {
  Day,
  Sell,
  Why,
  Voice,
  Faq,
  Download,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/landing/image-slot.js
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).
/* BEGIN USAGE */
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever a design needs an image.
 * You control the slot's shape; it sizes to its container by default. When the search_stock_photos tool
 * is available, prefill the slot by default — write the photo's URL into
 * src (with credit/credit-href); the user can still fill or replace it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The sidecar is a SIBLING of the HTML file that uses this component: the
 * read is a document-relative fetch, and the host resolves the bridge's
 * sidecar writes into the previewed file's directory to match (same
 * contract as design_canvas.jsx). Pages in the same directory share one
 * sidecar; keep slot ids distinct across them.
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          Initial framing baseline: cover | contain.   (default 'cover')
 *                cover starts the image filling the frame (overflow cropped);
 *                contain starts it fully visible (letterboxed). Either way the
 *                user can always pan/scale from there — double-click, or the
 *                Edit control, enters reframe mode (drag to move, scroll or
 *                corner-handles to scale; Escape / click-out commits). The
 *                crop persists alongside the image in the sidecar.
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. Prefill it with a real
 *                photo via search_stock_photos when that tool is available
 *                (set credit/credit-href from the result). A user drop
 *                overrides it; clearing the drop reveals src again.
 *   credit       Attribution text shown as a small overlay at the
 *                bottom-left of the filled slot. REQUIRED whenever src
 *                points at any Unsplash host (images.unsplash.com,
 *                plus.unsplash.com, …): an Unsplash src with no credit
 *                renders an error tile INSTEAD of the photo (Unsplash
 *                terms forbid showing their photos unattributed). Use the
 *                exact form 'Photo by {photographer name} on Unsplash' —
 *                the overlay then links the name to credit-href and
 *                'Unsplash' to the Unsplash homepage, and links back to
 *                unsplash.com automatically get the required utm referral
 *                params appended at render time. The credit belongs to
 *                the src image, so it only shows while src is what's
 *                displayed — a user-dropped image hides it.
 *   credit-href  Link for the photographer's name in the credit overlay
 *                (their Unsplash profile URL from the stock-photo search
 *                results). http(s) URLs only — anything else renders the
 *                name as plain text.
 *
 * Sizing: the slot fills its container by default (width/height 100%).
 * Put it in a sized wrapper — absolutely positioned, a grid cell, a fixed
 * frame — and it takes exactly that box. When the parent's height is
 * indefinite (ordinary flow), it falls back to full width at a 3:2 aspect
 * ratio instead of collapsing. In a shrink-to-fit parent (a float,
 * width:max-content, an unsized absolute wrapper), percentages have
 * nothing to resolve against — size the slot or its wrapper explicitly
 * there. For a fixed-size slot, set
 * width/height on the element itself (inline style), which overrides the
 * default. When
 * layering content above a slot (full-bleed layouts), make the overlay
 * click-through — pointer-events: none on scrims/text plates, re-enabled
 * on interactive children — so the slot's hover controls stay reachable.
 * Keep the slot's bottom-left corner visually clear as well: the credit
 * overlay renders there, and a dark fade or text plate covering it hides
 * the attribution Unsplash's terms require — end the fade above that
 * corner, or keep it nearly transparent where the credit sits.
 *
 * Usage:
 *   <div style="position:relative;width:100%;height:100%">      <!-- full-bleed: -->
 *     <image-slot id="bg" shape="rect"></image-slot>            <!-- fills the wrapper -->
 *   </div>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */
/* END USAGE */

(() => {
  const STATE_FILE = '.image-slots.state.json';

  // Unsplash terms require visible attribution wherever their photos
  // display, and every link back to unsplash.com must carry utm referral
  // params. Two render-time rules enforce that here:
  //  - an Unsplash-src slot with NO credit attribute renders an error
  //    tile INSTEAD of the photo (an uncredited Unsplash photo on screen
  //    is itself the terms violation, so it never renders bare);
  //  - rendered credit links pointing at unsplash.com get the referral
  //    params appended when absent (credit-href values live in page
  //    content that can't be edited after the fact).
  // Keep the utm_source value in sync with UTM_SOURCE in
  // platform/web-agent/unsplash.ts — this file is a project-local
  // artifact and cannot import it (equality is pinned by tests).
  const UNSPLASH_HOMEPAGE_HREF = 'https://unsplash.com/?utm_source=claude_design&utm_medium=referral';
  // Host rule mirrors the hotlink validator that admits Unsplash srcs into
  // pages in the first place (cdn$ in unsplash.ts: apex or any subdomain)
  // — Unsplash+ results serve from plus.unsplash.com, not just images.*,
  // and an admitted-but-uncredited photo must error whatever unsplash
  // host it rides on.
  // Trailing-dot FQDNs (images.unsplash.com.) are the same host to the
  // browser but would miss the regex — strip one dot so the check fails
  // CLOSED (unrecognized-but-real Unsplash srcs must error, not render).
  const isUnsplashHost = u => {
    try {
      return /(^|\.)unsplash\.com$/.test(new URL(u, document.baseURI).hostname.replace(/\.$/, ''));
    } catch {
      return false;
    }
  };
  // Render-time referral normalization for links back to Unsplash:
  // appends utm_source/utm_medium when absent, preserves every existing
  // query param, never overwrites an existing utm_source, and passes
  // non-Unsplash URLs through untouched. Input is an ABSOLUTE validated
  // http(s) URL (the credit render funnel resolves + validates first).
  const withReferral = href => {
    try {
      const u = new URL(href);
      if (!/(^|\.)unsplash\.com$/.test(u.hostname.replace(/\.$/, ''))) {
        return href;
      }
      if (!u.searchParams.has('utm_source')) {
        u.searchParams.set('utm_source', 'claude_design');
      }
      if (!u.searchParams.has('utm_medium')) {
        u.searchParams.set('utm_medium', 'referral');
      }
      return u.toString();
    } catch (e) {
      return href;
    }
  };
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  // Unload-time flush: save()'s serialization defers a mid-RTT re-fire to a
  // .then that never runs in an unloading document, silently dropping a
  // pagehide commit. Post the current slots immediately instead — content
  // is a superset snapshot of any in-flight save's, the write is a
  // whole-file last-writer-wins replace, and postMessage FIFO delivers it
  // to the host after the in-flight one, so a backend-side reorder at
  // worst reproduces the dropped-commit outcome this flush improves on.
  // Guarded on the initial sidecar read: pre-hydration slots can miss
  // other slots' persisted entries, and flushing it would clobber them —
  // that narrow case stays best-effort (the in-memory merge in load()
  // cannot happen in an unloading document anyway).
  function flushNow() {
    if (!loaded) return;
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    try {
      Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {});
    } catch (e) {}
  }
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet =
  // Fill the container by default: slots are usually placed inside a
  // sized wrapper (a hero frame, a grid cell, an inset:0 layer) and are
  // expected to take that box — a fixed intrinsic size would render as
  // a small tile in the corner of a full-bleed wrapper instead.
  // aspect-ratio is the companion fallback that keeps a bare slot
  // visible when the parent's height is indefinite: height:100%
  // resolves to auto there, and the ratio then derives height from
  // width instead of letting the slot collapse to zero height.
  // Explicit width/height on the element override all of this.
  // color:inherit (not a fixed near-black): the placeholder chrome —
  // empty-state icon/caption (currentColor) and the dashed ring — must
  // read on dark decks too, and the slide's own text color is the one
  // color guaranteed to contrast with the slide background. The soft
  // look comes from opacity on those parts, not from a baked-in alpha.
  ':host{display:block;position:relative;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;' + '  width:100%;height:100%;aspect-ratio:3/2}' + '.empty .cap,.empty .sub{opacity:.75}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(127,127,127,.08)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  // popover=manual promotes the spill to the top layer on reframe, so it is
  // not clipped by any overflow:hidden / clip-path / scroll-container
  // ancestor (a plain z-index can't escape overflow clipping). UA popover
  // defaults (inset:0;margin:auto) are reset; _applyView sets viewport px.
  '.spill{position:fixed;margin:0;inset:auto;border:0;padding:0;background:transparent;' + '  overflow:visible;transform:translate(-50%,-50%);z-index:1;cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px}' + '.empty:hover .sub{opacity:1}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed currentColor;' + '  opacity:.35;transition:border-color .12s,opacity .12s}' + ':host([data-over]) .ring{border-color:#c96442;opacity:1}' + ':host([data-filled]) .ring{display:none}' +
  // Controls overlay INSIDE the frame, pinned to the top-right corner, so
  // a full-bleed slot in an overflow:hidden container still shows them
  // (the old below-mask placement got clipped). Credit sits bottom-left,
  // so top-right avoids collision. The blurred pill background keeps them
  // legible over the image.
  // The UA [popover] base rule styles the element in EVERY state (only
  // display:none is gated on :not(:popover-open), and the display:flex
  // below overrides that) — so the UA resets live HERE, like .spill's,
  // or the ordinary hover-state strip renders as a bordered Canvas box
  // centered by margin:auto. inset:auto precedes top/right (shorthand).
  '.ctl{position:absolute;inset:auto;top:8px;right:8px;margin:0;border:0;padding:0;' + '  background:transparent;overflow:visible;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' +
  // While reframing, the spill owns the top layer and would swallow every
  // click on the in-frame controls. Promoting .ctl into the top layer
  // ABOVE the spill (shown after it — later popovers stack higher) keeps
  // Edit-as-toggle and Replace clickable mid-reframe. _applyView pins it
  // to the frame's top-right in viewport px (translateX(-100%)
  // right-aligns against the computed left edge); inset:auto clears the
  // base rule's top/right so the inline left/top position it alone.
  '.ctl:popover-open{position:fixed;inset:auto;transform:translateX(-100%)}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}' +
  // Replacement in flight: after a src swap the browser keeps painting
  // the PREVIOUS image until the new one decodes, so a Replace would
  // flash the old photo and then pop. Hide the stale frame (visibility,
  // not display — _applyView geometry still applies) and spin until the
  // new image reports in (load/error clears data-swapping).
  ':host([data-swapping]) .frame img{visibility:hidden}' + '.loading{position:absolute;inset:0;display:none;align-items:center;' + '  justify-content:center;pointer-events:none}' + ':host([data-swapping]) .loading{display:flex}' + '.loading::after{content:"";width:22px;height:22px;border-radius:50%;' + '  border:2px solid rgba(127,127,127,.25);border-top-color:currentColor;' + '  animation:om-slot-spin .7s linear infinite}' + '@keyframes om-slot-spin{to{transform:rotate(360deg)}}' +
  // Reduced motion: the static two-tone ring still reads as "working".
  '@media (prefers-reduced-motion:reduce){.loading::after{animation:none}}' + '.credit{position:absolute;left:6px;bottom:6px;max-width:calc(100% - 12px);display:none;' + '  padding:3px 7px;border-radius:5px;background:rgba(0,0,0,.55);color:#fff;' + '  font:10px/1.2 system-ui,-apple-system,sans-serif;text-decoration:none;' + '  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;backdrop-filter:blur(6px)}' +
  // The credit is a SPAN holding one or two <a>s (Unsplash's prescribed
  // form links the photographer AND Unsplash) — anchors style inline so
  // the overlay reads as one line of text.
  '.credit a{color:inherit;text-decoration:none}' + '.credit a:hover,.credit a:focus-visible{text-decoration:underline}' + ':host([data-filled][data-credit]) .credit{display:block}' +
  // Exports must ship JUST the image — no hover controls, no credit chip
  // (the host marks <html data-om-exporting> for the capture window; the
  // page-level hide script can't reach shadow DOM, this rule can).
  ':host-context([data-om-exporting]) .ctl,' + ':host-context([data-om-exporting]) .credit{display:none !important}' +
  // Print must ship just the image too: the hover-gated controls can be
  // mid-hover when print() fires, and the credit chip is screen chrome —
  // the same rule the capture window gets, keyed on print media instead
  // of the host's data-om-exporting mark (the print path sets no mark).
  '@media print{.ctl,.credit{display:none !important}}' +
  // No export-window mask rules here on purpose: the export capture
  // releases the replacement mask by REMOVING data-swapping (the
  // shadow-root pass in pages/export/shared.ts HIDE_EXPORT_CHROME_SCRIPT)
  // — attribute removal works in every engine (:host-context is
  // Chromium-only), is scoped by construction to slots actually
  // mid-swap, and hides the spinner through the same gate. A masked img
  // would otherwise be silently dropped from PPTX decks (the capture
  // walk skips visibility:hidden imgs).
  // Attribution error tile: REPLACES the photo when an Unsplash src has
  // no credit attribute — rendering the photo uncredited is the terms
  // violation, so the photo must not appear at all.
  // Calm and neutral on purpose (review feedback): the tile informs the
  // user; the fix instructions are machine-facing (usage docblock, tool
  // description, and the turn-end scan's bounce copy name the attributes
  // for the agent).
  '.attr-error{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  background:#f2f1ef;color:#6e6c66;user-select:none;' + '  font:13px/1.45 system-ui,-apple-system,sans-serif}' + '.attr-error svg{opacity:.55}' + '.attr-error .cap{max-width:92%;font-weight:500;letter-spacing:.01em}' + ':host([data-attribution-error]) .attr-error{display:flex}' + ':host([data-attribution-error]) .ring{display:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  const warnIcon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>' + '<path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'placeholder', 'src', 'id', 'credit', 'credit-href'];
    }

    /** Duplicate-slide hook (called by deck-stage, see its
     *  _remintDuplicateIds): copy this id's stored image, if any, under a
     *  freshly minted key and return that key — so a duplicated slide's
     *  slot keeps its dropped photo instead of reverting to the
     *  placeholder. 'isFree' is the caller's uniqueness check (document
     *  ids); candidates must ALSO be unused in the sidecar, which can
     *  hold keys from other pages sharing the project root. (An EMPTY
     *  slot on another page leaves no sidecar entry, so its id is not
     *  detectable here — a minted key can collide with it and that slot
     *  would show this photo. Same blast radius as two pages reusing an
     *  id by hand, which the shared sidecar already permits.) Returns null
     *  when no id could be minted (caller strips the id, today's
     *  behavior). */
    static cloneSlot(fromId, isFree) {
      if (typeof fromId !== 'string' || !fromId) return null;
      // Pre-hydration the store can't veto candidates or source the copy
      // — degrade to the strip (today's behavior) rather than mint
      // against keys we can't see yet. Any rendered (= droppable) slot
      // means load() has already settled.
      if (!loaded) return null;
      const stem = fromId.replace(/-\d+$/, '') || fromId;
      for (let n = 2; n < 100; n++) {
        const toId = stem + '-' + n;
        if (toId === fromId) continue;
        if (slots[toId] !== undefined) {
          // Reuse a key holding this exact value (bytes AND crop) if no
          // live element here owns it — a duplicate op the host refused
          // after minting leaves such a key behind, and reusing keeps
          // refused retries from accumulating one orphaned copy per
          // attempt. Full equality (not just bytes) so a byte-identical
          // key another PAGE owns with its own crop is stepped past, not
          // adopted or rewritten. (Entries without .u never match.)
          const prev = getSlot(toId);
          const cur = getSlot(fromId);
          if (!(prev && cur && prev.u && prev.u === cur.u && prev.s === cur.s && prev.x === cur.x && prev.y === cur.y && (typeof isFree !== 'function' || isFree(toId)))) continue;
          return toId;
        }
        if (typeof isFree === 'function' && !isFree(toId)) continue;
        const v = getSlot(fromId);
        if (v) setSlot(toId, Object.assign({}, v));
        return toId;
      }
      return null;
    }
    constructor() {
      super();
      // clonable: rail thumbnails deep-clone slides and carry this shadow
      // along; reuse an already-cloned root so upgrade-after-clone works.
      // (Deliberately NOT serializable — a getHTML consumer would embed
      // multi-MB sidecar data-URLs into serialized page HTML.)
      const root = this.shadowRoot || this.attachShadow({
        mode: 'open',
        clonable: true
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="attr-error" part="attribution-error">' + warnIcon + '    <div class="cap">This photo needs attribution</div></div>' + '  <div class="loading" part="loading"></div>' + '  <div class="ring" part="ring"></div>' + '</div>' +
      // Outside .frame, like .spill/.ctl — the frame's overflow:hidden +
      // border-radius/clip-path would cut the credit off on circle/pill/mask.
      // A SPAN, not an <a>: the prescribed Unsplash credit holds two links
      // (photographer + Unsplash), built per-render in _render().
      '<span class="credit" part="credit"></span>' + '<div class="spill" popover="manual" data-dc-edit-transparent>' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' +
      // data-dc-edit-transparent: the DC editor's edit-mode picker lets
      // clicks through for chrome marked with it (EDIT_TRANSPARENT_SEL)
      // — without it, Replace/Edit clicks in Edit mode are swallowed by
      // element selection and the controls look dead.
      '<div class="ctl" popover="manual" data-dc-edit-transparent><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="edit" title="Reframe image">Edit</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ctl = root.querySelector('.ctl');
      this._credit = root.querySelector('.credit');
      this._attrError = root.querySelector('.attr-error');
      // Credit clicks open the link, not browse/reframe.
      this._credit.addEventListener('click', e => e.stopPropagation());
      this._credit.addEventListener('dblclick', e => e.stopPropagation());
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      // Encode-in-flight marker (the owning _ingest generation): while set,
      // the same-src "nothing in flight" clear in _render must not fire —
      // the stored value still points at the OLD image until the encode
      // lands, so that clear would unmask the stale image mid-replace.
      this._swapGen = 0;
      // Render-owned swap in flight: set when _render assigns a new src,
      // cleared only by the img's own load/error (or the empty branch).
      // img.complete CANNOT stand in for this — setting src only QUEUES
      // the current-request swap (a microtask), so synchronously after an
      // assignment, complete still reports the OLD settled request. The
      // pick path does exactly that: the host sets src, credit, and
      // credit-href back-to-back in one task, and renders #2/#3 would
      // read the stale complete === true and drop the mask one render
      // after it was set.
      this._loadPending = false;
      // See _render's empty branch: a transient attribution-error wipe of a
      // showing image must make the follow-up render a replacement (spinner),
      // not a first fill (blank frame).
      this._hidShowing = false;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (!act) return;
        // The hidden controls are opacity-0 but still tabbable — without
        // this gate a keyboard user could drive them on a read-only share
        // link (mirrors the dblclick handler's editable gate).
        if (!this.hasAttribute('data-editable')) return;
        if (act === 'replace') {
          this._exitReframe(true);
          // Host-owned picker (Unsplash modal; it also offers local import).
          this.dispatchEvent(new CustomEvent('image-slot:pick', {
            bubbles: true,
            composed: true,
            detail: {
              id: this.id || null
            }
          }));
        }
        if (act === 'edit') {
          if (!this._reframes()) return;
          if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      // load/error also release the replacement-in-flight mask (via the
      // single discipline in _releaseMask): the swap is only revealed once
      // the new image can actually paint (on error the frame shows its
      // background, same as a fresh slot with a broken src).
      this._img.addEventListener('load', () => {
        this._loadPending = false;
        this._releaseMask(true);
        this._applyView();
      });
      this._img.addEventListener('error', () => {
        this._loadPending = false;
        this._releaseMask(true);
      });
      // Gated only on editable — any filled slot can be repositioned/scaled,
      // regardless of fit. Share links (no writeFile) stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
          const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // The host may inject window.omelette.writeFile AFTER the first render;
      // re-render on hover so the editable-gated controls reliably appear.
      this.addEventListener('pointerenter', this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('pointerenter', this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      // commit=false: a disconnect is not a user intent — committing here
      // would persist whatever half-finished drag a React remount or DOM
      // splice happened to interrupt. Deliberate exits commit on their own
      // paths (Escape/click-out/toggle), and unloads commit via pagehide.
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._signalReframe(true);
      // Best-effort commit when the document unloads mid-reframe (a host
      // navigation racing the enter signal, a manual reload, tab close):
      // the sidecar write rides the host bridge, which outlives this
      // document, so the crop survives even though the mode dies with the
      // DOM. Held on the instance so _exitReframe detaches exactly what
      // was attached.
      this._pagehide = () => {
        this._exitReframe(true);
        flushNow();
      };
      window.addEventListener('pagehide', this._pagehide);
      // Promote spill to the top layer, then keep it pinned over the frame:
      // scroll/resize cover the common cases, and a per-frame rect check
      // catches layout shifts that fire neither (an image above finishing
      // load, streamed DOM pushing the slot down, an ancestor transform
      // change) so the overlay can't detach from the frame.
      try {
        this._spill.showPopover();
      } catch {}
      // After the spill, so the controls stack above it in the top layer.
      try {
        this._ctl.showPopover();
      } catch {}
      this._reposition = () => {
        if (this.hasAttribute('data-reframe')) this._applyView();
      };
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
      this._lastRect = '';
      this._watch = () => {
        if (!this.hasAttribute('data-reframe')) return;
        const r = this.getBoundingClientRect();
        const key = r.left + ',' + r.top + ',' + r.width + ',' + r.height;
        if (key !== this._lastRect) {
          this._lastRect = key;
          this._applyView();
        }
        this._watchId = requestAnimationFrame(this._watch);
      };
      this._watchId = requestAnimationFrame(this._watch);
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (this._reposition) {
        window.removeEventListener('scroll', this._reposition, true);
        window.removeEventListener('resize', this._reposition);
        this._reposition = null;
      }
      if (this._watchId) {
        cancelAnimationFrame(this._watchId);
        this._watchId = 0;
      }
      if (this._pagehide) {
        window.removeEventListener('pagehide', this._pagehide);
        this._pagehide = null;
      }
      try {
        this._spill.hidePopover();
      } catch {}
      try {
        this._ctl.hidePopover();
      } catch {}
      this._ctl.style.left = '';
      this._ctl.style.top = '';
      if (commit) this._commitView();
      this._signalReframe(false);
    }

    // Reframe state lives only in this DOM until commit, invisible to the
    // host's dirty signals — announce enter/exit so the host can hold
    // auto-reloads for exactly the gesture (the guest bundle forwards
    // image-slot:reframe to the host as imageSlotReframe). Dispatched on
    // the element (composed, so it escapes shadow roots) while connected;
    // a disconnected exit (disconnectedCallback) falls back to document so
    // the host still hears it.
    _signalReframe(active) {
      const target = this.isConnected ? this : document;
      target.dispatchEvent(new CustomEvent('image-slot:reframe', {
        bubbles: true,
        composed: true,
        detail: {
          active: active,
          id: this.id || null
        }
      }));
    }

    // Public: host's "Import from computer" calls this to run local browse.
    openFilePicker() {
      this._exitReframe(true);
      this._input.click();
    }

    // A src write is a newer intent for this slot's content — the host
    // pick path (setImageSlotImage) or an agent edit — so it must win
    // over any encode still in flight from an earlier drop: left live,
    // that encode lands later, passes _ingest's gen guard, and its
    // setSlot silently overwrites the pick (the stored value shadows
    // src in _render). Bumping _gen kills the encode before its own
    // _swapGen clear runs, so clear the dead claim here too — otherwise
    // _releaseMask (gated on !_swapGen) never fires and the pick's
    // spinner is stranded. src ONLY: the pick sets credit/credit-href
    // in the same task, and clearing _swapGen on those would let the
    // same-src branch unmask the old image mid-encode.
    attributeChangedCallback(name, oldVal, newVal) {
      if (name === 'src' && oldVal !== newVal) {
        this._gen++;
        this._swapGen = 0;
      }
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      // Replacing a shown image: surface the swap through the encode too,
      // not just the decode — otherwise the old photo sits there with no
      // feedback while the canvas re-encode runs. An empty slot keeps its
      // placeholder (no spinner) until the encode lands, as before.
      // _swapGen guards the mask against re-renders DURING the encode
      // (pointerenter, ResizeObserver, another slot's store write): the
      // stored value still resolves to the old image there, so _render's
      // same-src clear would otherwise unmask it mid-replace.
      if (this.hasAttribute('data-filled')) {
        this.setAttribute('data-swapping', '');
        this._swapGen = gen;
      }
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        // Clear BEFORE setSlot: its synchronous re-render must see no
        // pending encode, so a byte-identical re-upload (same data URL, no
        // load event coming) still clears the mask via the complete branch.
        this._swapGen = 0;
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._swapGen = 0;
        // Reveal the kept old image — unless another replacement (a
        // remote pick's src swap) is still in flight, in which case the
        // mask stays until THAT image settles (its load/error releases).
        this._releaseMask();
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is available on any filled slot — the user can
    // always reposition/scale. `fit` only sets the initial baseline (see
    // _geom): contain starts fully-visible, cover starts frame-filling.
    _reframes() {
      return this.hasAttribute('data-filled');
    }

    // The single release discipline for the replacement-in-flight mask
    // (data-swapping). The mask comes off only when BOTH hold:
    //  - no encode is pending (_swapGen) — mid-encode the stored value
    //    still resolves to the old image, so any reveal paints it;
    //  - the frame img has settled on its current src — an unsettled src
    //    means some replacement is still in flight (e.g. a remote pick),
    //    whoever started it, and revealing would paint the previous
    //    frame. The load/error listeners pass settled=true (the event IS
    //    the settlement signal, per spec complete is true by then);
    //    other callers rely on the complete flag (covers loaded AND
    //    failed).
    // Every release path funnels through here EXCEPT _render's empty
    // branch (the img is being cleared — nothing will ever settle).
    _releaseMask(settled) {
      if (!this._swapGen && !this._loadPending && (settled || this._img.complete)) {
        this.removeAttribute('data-swapping');
      }
    }

    // Baseline geometry, shared by clamp/apply/resize. `base` is the scale at
    // view-scale s=1: cover = fill the frame (overflow on the looser axis),
    // contain = fit fully inside (letterboxed). Zooming a contain image past
    // s where it overflows naturally becomes a crop. Null until the img has
    // loaded (naturalWidth is 0 before that) or when the slot has no layout
    // box — ResizeObserver fires with a 0×0 rect under display:none, and
    // clamping against a degenerate 1×1 frame would silently pull the stored
    // pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
      const base = contain ? Math.min(fw / iw, fh / ih) : Math.max(fw / iw, fh / ih);
      return {
        iw,
        ih,
        fw,
        fh,
        base
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      // Top-layer controls: pin to the frame's top-right in viewport px
      // (the same 8px inset as the in-frame layout; unscaled — top-layer UI
      // reads as chrome, not page content). BEFORE the geometry branch:
      // placement needs only the frame rect, and a not-yet-loaded or broken
      // src must not leave the promoted strip floating unpositioned. Gated
      // on the popover actually being open: without the Popover API,
      // showPopover() threw (swallowed in _enterReframe), .ctl stays in
      // its in-frame absolute layout, and viewport-px coordinates would
      // shove it off-frame — and matches(':popover-open') itself throws
      // there (unknown pseudo-class), hence the try/catch.
      if (this.hasAttribute('data-reframe')) {
        let onTop = false;
        try {
          onTop = this._ctl.matches(':popover-open');
        } catch {}
        if (onTop) {
          const r = this.getBoundingClientRect();
          this._ctl.style.left = r.right - 8 + 'px';
          this._ctl.style.top = r.top + 8 + 'px';
        }
      }
      if (!g) {
        // Dimensions not known yet (before img load) — centered fit so there
        // is no flash of an unpositioned image before the geometry lands.
        const contain = (this.getAttribute('fit') || 'cover').toLowerCase() === 'contain';
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = contain ? 'contain' : 'cover';
        return;
      }
      // Baseline (cover-fill or contain-fit) × view scale. Width/height and
      // left/top are all frame-% — depends only on the frame aspect ratio, so
      // a responsive resize keeps the same crop. The spill layer mirrors the
      // same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      if (this.hasAttribute('data-reframe')) {
        // Top-layer spill: position in viewport px over the frame. The top
        // layer escapes ancestor transforms entirely, so EVERY term must be
        // in viewport units: getBoundingClientRect gives the frame's scaled
        // origin AND size, and the rect/layout ratio rescales the ghost —
        // sizing from layout px alone renders it 1/scale too large under a
        // scaled deck slide. Inner ghost + handles stay box-relative.
        const r = this.getBoundingClientRect();
        const sx = g.fw ? r.width / g.fw : 1;
        const sy = g.fh ? r.height / g.fh : 1;
        this._spill.style.width = g.iw * k * sx + 'px';
        this._spill.style.height = g.ih * k * sy + 'px';
        this._spill.style.left = r.left + (50 + this._view.x) / 100 * r.width + 'px';
        this._spill.style.top = r.top + (50 + this._view.y) / 100 * r.height + 'px';
      }
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      // An Unsplash src with no credit attribute must NOT render — showing
      // the photo uncredited is the Unsplash-terms violation itself. The
      // error tile replaces the photo until the credit is written. A
      // user-dropped image is the user's own content and always renders.
      // Trimmed: credit is agent/user-editable content, and a whitespace-
      // only value must count as missing — otherwise it would suppress the
      // error tile AND render an empty credit box (no text, no links),
      // exactly the unattributed state this gate exists to prevent.
      const credit = (this.getAttribute('credit') || '').trim();
      const attrError = !!(!credit && !this._userUrl && srcAttr && isUnsplashHost(srcAttr));
      this.toggleAttribute('data-attribution-error', attrError);
      if (url && !attrError) {
        const prev = this._img.getAttribute('src');
        if (prev !== url) {
          // Replacing an already-shown image: mark the swap BEFORE setting
          // src so the stale frame is never revealed (see the data-swapping
          // stylesheet rules). First fill (prev empty) keeps the existing
          // placeholder-until-load behavior — no spinner. _hidShowing
          // covers the pick path's transient attribution-error wipe: prev
          // is gone, but an image WAS showing, so this is a replacement.
          if (prev || this._hidShowing) this.setAttribute('data-swapping', '');
          // Mark the swap BEFORE assigning src: complete keeps reporting
          // the old settled request until the browser's
          // update-the-image-data microtask runs, so same-task re-renders
          // (the pick path's credit/credit-href setAttributes) need this
          // flag, not complete, to know a load is in flight.
          this._loadPending = true;
          this._img.src = url;
          this._ghost.src = url;
        } else {
          // Same-src re-render — release if settled, so an ingest-set
          // spinner can't stick after a byte-identical re-upload (same
          // data URL, no further load event ever fires).
          this._releaseMask();
        }
        this._hidShowing = false;
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this.removeAttribute('data-swapping');
        // The src is being removed — no load/error will ever fire for it.
        this._loadPending = false;
        // A transient attribution-error wipe of a showing image happens on
        // the pick path: the host sets src one setAttribute before credit,
        // so render N hides the old image (attrError) and render N+1
        // restores a URL. Remember the wipe so that restore renders as a
        // replacement (spinner), not a first fill (blank frame).
        this._hidShowing = attrError && !!this._img.getAttribute('src');
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        // The error tile owns the blocked-photo state; .empty stays for
        // the genuinely-empty slot.
        this._empty.style.display = attrError ? 'none' : 'flex';
        this.removeAttribute('data-filled');
      }

      // Credit belongs to the author src, so a user drop hides it.
      // textContent + the http(s)-only funnel keep external strings inert.
      const showCredit = !!(url && credit && !this._userUrl && !attrError);
      this._credit.textContent = '';
      if (showCredit) {
        // Validate once (resolved against the document, http(s) only),
        // then append the terms-required utm referral params to links
        // that point back at unsplash.com.
        let href = '';
        const rawHref = this.getAttribute('credit-href') || '';
        if (rawHref) {
          try {
            const u = new URL(rawHref, document.baseURI);
            if (u.protocol === 'http:' || u.protocol === 'https:') {
              href = withReferral(u.href);
            }
          } catch {}
        }
        const mkLink = (text, linkHref) => {
          const a = document.createElement('a');
          a.setAttribute('target', '_blank');
          a.setAttribute('rel', 'noopener noreferrer');
          a.setAttribute('href', linkHref);
          a.textContent = text;
          return a;
        };
        // Unsplash's prescribed credit is TWO links — the photographer's
        // name to their profile (credit-href) and 'Unsplash' to the
        // homepage. Render that split whenever the text has the canonical
        // shape; other text keeps the legacy single-link rendering.
        const m = /^Photo by (.+) on Unsplash$/.exec(credit);
        if (m) {
          this._credit.appendChild(document.createTextNode('Photo by '));
          this._credit.appendChild(href ? mkLink(m[1], href) : document.createTextNode(m[1]));
          this._credit.appendChild(document.createTextNode(' on '));
          this._credit.appendChild(mkLink('Unsplash', UNSPLASH_HOMEPAGE_HREF));
        } else if (href) {
          this._credit.appendChild(mkLink(credit, href));
        } else {
          this._credit.textContent = credit;
        }
      }
      this.toggleAttribute('data-credit', showCredit);
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/landing/image-slot.js", error: String((e && e.message) || e) }); }

__ds_ns.Cover = __ds_scope.Cover;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FieldInput = __ds_scope.FieldInput;

__ds_ns.FieldRow = __ds_scope.FieldRow;

__ds_ns.ScanFrame = __ds_scope.ScanFrame;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

})();
