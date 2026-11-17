// Style frame for L15–L18 ("Imagine an invisible map…"). A SCHEMATIC two-mode
// standing-wave sketch: brighter = more energy, darker = less. Not measured data,
// no units, no numbers, single-hue gold on navy (never a thermal-camera palette).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BowlTop} from '../../components/Bowl';

const CH = {x: 150, y: 250, w: 900, h: 620};

const intensity = (u: number, v: number) => {
  const s = (k: number, p: number) => Math.sin(k * Math.PI * p) ** 2;
  return 0.55 * s(3, u) * s(2, v) + 0.45 * s(2, u) * s(3, v);
};

const Tag: React.FC<{x: number; y: number; text: string; anchor?: 'start' | 'end' | 'middle'}> = ({x, y, text, anchor = 'start'}) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.ui} fontWeight={800} fontSize={22} letterSpacing="0.14em" fill={C.navy200}>
    {text}
  </text>
);

export const StyleFrameMap: React.FC = () => {
  const cols = 60;
  const rows = 42;
  const cw = CH.w / cols;
  const rh = CH.h / rows;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const I = intensity((i + 0.5) / cols, (j + 0.5) / rows);
      cells.push(<rect key={`${i}-${j}`} x={CH.x + i * cw} y={CH.y + j * rh} width={cw + 0.6} height={rh + 0.6} fill={C.gold} opacity={0.08 + 0.85 * Math.pow(I, 0.85)} />);
    }
  }
  // a reflected wave path entering from the waveguide on the right wall
  const path = [
    [CH.x + CH.w, CH.y + 150],
    [CH.x + 520, CH.y],
    [CH.x + 140, CH.y + CH.h],
    [CH.x, CH.y + 470],
  ];
  const wavy = (a: number[], b: number[], k = 9) => {
    const n = 180;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const L = Math.hypot(dx, dy);
    const nx = -dy / L;
    const ny = dx / L;
    return Array.from({length: n + 1}, (_, s) => {
      const p = s / n;
      const off = Math.sin(p * k * Math.PI * 2) * 9;
      return `${(a[0] + dx * p + nx * off).toFixed(1)},${(a[1] + dy * p + ny * off).toFixed(1)}`;
    }).join(' ');
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke={C.navy800} strokeWidth={2} />
          </pattern>
          <filter id="soft" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
          <clipPath id="chamber">
            <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} rx={18} />
          </clipPath>
          <linearGradient id="legend" x1="0" x2="1">
            <stop offset="0" stopColor={C.gold} stopOpacity="0.08" />
            <stop offset="1" stopColor={C.gold} stopOpacity="0.93" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill={C.goldLight} />
          </marker>
        </defs>
        <rect width={1920} height={1080} fill="url(#grid)" />
        <g clipPath="url(#chamber)">
          <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} fill={C.navy950} />
          <g filter="url(#soft)">{cells}</g>
        </g>
        {/* metal walls */}
        <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} rx={18} fill="none" stroke={C.paper} strokeWidth={10} />
        {/* waveguide inlet on the right wall */}
        <rect x={CH.x + CH.w - 6} y={CH.y + 110} width={46} height={80} rx={6} fill={C.navy600} stroke={C.paper} strokeWidth={4} />
        {/* reflections */}
        {path.slice(0, -1).map((a, i) => (
          <polyline key={i} points={wavy(a, path[i + 1])} fill="none" stroke={C.goldLight} strokeWidth={4} strokeLinecap="round" markerEnd="url(#arrow)" opacity={0.95} />
        ))}
        {/* turntable + the same bowl, top view */}
        <circle cx={CH.x + 430} cy={CH.y + 330} r={215} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="12 10" opacity={0.7} />
        <BowlTop x={CH.x + 430} y={CH.y + 330} s={0.62} t={0} />

        <Tag x={CH.x} y={CH.y - 26} text="COOKING CHAMBER · TOP VIEW" />
        <Tag x={CH.x + CH.w + 40} y={CH.y - 26} text="FROM MAGNETRON" anchor="end" />
        <line x1={CH.x + CH.w + 17} y1={CH.y - 14} x2={CH.x + CH.w + 17} y2={CH.y + 104} stroke={C.navy200} strokeWidth={3} strokeDasharray="6 6" />
        <Tag x={CH.x + CH.w} y={CH.y + CH.h + 46} text="METAL WALLS REFLECT THE WAVES" anchor="end" />
        <Tag x={CH.x + 430} y={CH.y + 330 + 250} text="TURNTABLE" anchor="middle" />
      </svg>

      {/* right-hand panel: schematic badge, caveat, legend */}
      <div style={{position: 'absolute', left: 1200, top: 250, width: 600, display: 'flex', flexDirection: 'column', gap: 26}}>
        <div
          style={{
            alignSelf: 'flex-start',
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: '0.2em',
            color: C.navy950,
            background: C.gold,
            padding: '10px 18px',
            borderRadius: 10,
          }}
        >
          SCHEMATIC
        </div>
        <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 64, lineHeight: 1.05, color: C.white}}>An invisible map</div>
        <div style={{fontFamily: FONT.ui, fontWeight: 500, fontSize: 28, lineHeight: 1.45, color: C.navy200}}>
          Simplified pattern for illustration, not measured data. Real patterns are more complicated, and the food itself changes them.
        </div>
        <div style={{marginTop: 24}}>
          <svg width={520} height={40}>
            <rect width={520} height={40} rx={10} fill={C.navy950} />
            <rect width={520} height={40} rx={10} fill="url(#legend)" />
          </svg>
          <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.14em', color: C.navy200, width: 520, marginTop: 10}}>
            <span>LESS ENERGY</span>
            <span style={{color: C.gold}}>MORE ENERGY</span>
          </div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 28, top: 24, fontFamily: FONT.ui, fontWeight: 600, fontSize: 17, letterSpacing: '0.06em', color: 'rgba(255,255,255,0.82)', background: 'rgba(6,15,34,0.62)', padding: '8px 14px', borderRadius: 10}}>
        <span style={{color: C.gold, fontWeight: 800}}>WHY IS THAT? · EP001 · STYLE FRAME (L15–L18)</span> · PLACEHOLDER ART · NOT FOR PUBLICATION
      </div>
    </AbsoluteFill>
  );
};
