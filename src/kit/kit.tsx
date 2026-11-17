// Explainer toolkit: reusable, brand-locked building blocks for every section.
import React, {useId} from 'react';
import {AbsoluteFill, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {C, FONT} from '../brand/tokens';
import {clamp01, pop, ramp} from '../lib/anim';
import {Kitchen} from '../components/Kitchen';

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/** Pops content in at `at` (seconds); fades out at `until`. */
export const Appear: React.FC<{
  at: number;
  until?: number;
  dir?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none';
  dist?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, until = 1e9, dir = 'up', dist = 40, style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at - 0.01) return <div style={{...style, opacity: 0}}>{children}</div>; // keeps layout stable
  const p = pop(frame, fps, at, 14);
  const out = 1 - ramp(t, until, until + 0.3);
  if (out <= 0) return null;
  const d = (1 - p) * dist;
  const tr =
    dir === 'up' ? `translateY(${d}px)` : dir === 'down' ? `translateY(${-d}px)` : dir === 'left' ? `translateX(${d}px)` : dir === 'right' ? `translateX(${-d}px)` : dir === 'scale' ? `scale(${0.6 + 0.4 * p})` : 'none';
  return <div style={{...style, opacity: Math.min(1, p * 1.4) * out, transform: `${style?.transform ?? ''} ${tr}`}}>{children}</div>;
};

/** Absolutely-positioned wrapper. anchor: which point of the box sits at (x, y). */
export const At: React.FC<{x: number; y: number; anchor?: 'tl' | 'tc' | 'cc' | 'cl' | 'cr' | 'bc'; children: React.ReactNode}> = ({x, y, anchor = 'tl', children}) => {
  const tr = {tl: 'none', tc: 'translate(-50%,0)', cc: 'translate(-50%,-50%)', cl: 'translate(0,-50%)', cr: 'translate(-100%,-50%)', bc: 'translate(-50%,-100%)'}[anchor];
  return <div style={{position: 'absolute', left: x, top: y, transform: tr}}>{children}</div>;
};

export const Mark: React.FC<{kind: 'check' | 'cross'; size?: number}> = ({kind, size = 44}) => (
  <svg width={size} height={size} viewBox="0 0 44 44" style={{display: 'block', flex: 'none'}}>
    <circle cx={22} cy={22} r={20} fill={kind === 'check' ? C.gold : C.white} />
    {kind === 'check' ? (
      <path d="M12 23 L19 30 L32 15" stroke={C.navy950} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M14 14 L30 30 M30 14 L14 30" stroke={C.navy950} strokeWidth={5} strokeLinecap="round" />
    )}
  </svg>
);

/** Rounded label pill: optional small key line, optional ✓/✕, optional icon. */
export const Chip: React.FC<{
  text: string;
  k?: string;
  tone?: 'gold' | 'white';
  mark?: 'check' | 'cross';
  size?: number;
  icon?: React.ReactNode;
  maxWidth?: number;
}> = ({text, k, tone = 'gold', mark, size = 34, icon, maxWidth}) => {
  const accent = tone === 'gold' ? C.gold : C.white;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: `${size * 0.36}px ${size * 0.7}px ${size * 0.36}px ${size * 0.5}px`,
        background: 'rgba(6,15,34,0.9)',
        border: `3px solid ${accent}`,
        borderRadius: 18,
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        maxWidth,
        width: 'max-content', // maxWidth (if set) caps it; never squeezed by the container
      }}
    >
      {mark && <Mark kind={mark} size={size * 1.25} />}
      {icon}
      <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
        {k && <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size * 0.56, letterSpacing: '0.16em', color: accent}}>{k}</span>}
        <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size, lineHeight: 1.15, letterSpacing: '0.01em', color: C.white}}>{text}</span>
      </div>
    </div>
  );
};

export const Headline: React.FC<{text: string; size?: number; color?: string; align?: 'left' | 'center'; maxWidth?: number}> = ({
  text,
  size = 72,
  color = C.white,
  align = 'left',
  maxWidth,
}) => (
  <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: size, lineHeight: 1.05, color, textAlign: align, maxWidth}}>{text}</div>
);

/** Every energy/warmth pattern carries this tag. */
export const SchematicTag: React.FC<{note?: string; width?: number}> = ({note, width = 520}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 10, width}}>
    <span
      style={{
        alignSelf: 'flex-start',
        fontFamily: FONT.ui,
        fontWeight: 800,
        fontSize: 22,
        letterSpacing: '0.2em',
        color: C.navy950,
        background: C.gold,
        padding: '7px 14px',
        borderRadius: 8,
      }}
    >
      SCHEMATIC
    </span>
    {note && <span style={{fontFamily: FONT.ui, fontWeight: 500, fontSize: 22, lineHeight: 1.4, color: C.navy200}}>{note}</span>}
  </div>
);

/** Navy blueprint background for diagram scenes. */
export const GridBg: React.FC = () => {
  const id = useId().replace(/:/g, '');
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id={`${id}g`} width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke={C.navy800} strokeWidth={2} />
          </pattern>
          <radialGradient id={`${id}v`} cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.6" stopColor={C.navy950} stopOpacity="0" />
            <stop offset="1" stopColor={C.navy950} stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill={`url(#${id}g)`} />
        <rect width={1920} height={1080} fill={`url(#${id}v)`} />
      </svg>
    </AbsoluteFill>
  );
};

/** The same kitchen, blurred, as a backdrop for close-ups. */
export const KitchenBlur: React.FC<{cx?: number; cy?: number; s?: number; blur?: number; dim?: number}> = ({cx = 700, cy = 560, s = 2.1, blur = 9, dim = 0.35}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{filter: `blur(${blur}px)`}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        <g transform={`translate(${960 - cx * s} ${540 - cy * s}) scale(${s})`}>
          <Kitchen />
        </g>
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{background: C.navy950, opacity: dim}} />
  </AbsoluteFill>
);

/** Full-frame illustration (cover fit) with a slow push. */
export const FullArt: React.FC<{file: string; w: number; h: number; zoom?: number; ox?: number; oy?: number}> = ({file, w, h, zoom = 1, ox = 0.5, oy = 0.5}) => {
  const s = Math.max(1920 / w, 1080 / h) * zoom;
  const W = w * s;
  const H = h * s;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy900}}>
      <img src={staticFile(file)} style={{position: 'absolute', width: W, height: H, left: (1920 - W) * ox, top: (1080 - H) * oy}} />
    </AbsoluteFill>
  );
};

/** Sine wave along a polyline. Returns an SVG path string. */
export const wavePath = (pts: Array<[number, number]>, amp = 10, wl = 60, phase = 0, step = 4) => {
  let d = '';
  let dist = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const L = Math.hypot(bx - ax, by - ay);
    const nx = -(by - ay) / L;
    const ny = (bx - ax) / L;
    const n = Math.max(2, Math.ceil(L / step));
    for (let s = i === 0 ? 0 : 1; s <= n; s++) {
      const p = s / n;
      const off = Math.sin(((dist + p * L) / wl) * Math.PI * 2 + phase) * amp;
      const x = ax + (bx - ax) * p + nx * off;
      const y = ay + (by - ay) * p + ny * off;
      d += `${d ? ' L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    dist += L;
  }
  return d;
};

/** Progressively drawn path with an optional arrowhead at the drawn tip. */
export const DrawPath: React.FC<{
  d: string;
  at: number;
  dur?: number;
  until?: number;
  stroke?: string;
  width?: number;
  arrow?: boolean;
  dash?: string;
  opacity?: number;
}> = ({d, at, dur = 0.8, until = 1e9, stroke = C.gold, width = 5, arrow = true, dash, opacity = 1}) => {
  const t = useT();
  if (t < at) return null;
  const p = ramp(t, at, at + dur, Easing.inOut(Easing.cubic));
  const out = 1 - ramp(t, until, until + 0.3);
  const L = getLength(d);
  const tip = getPointAtLength(d, Math.max(0.01, L * p)) ?? {x: 0, y: 0};
  const tan = getTangentAtLength(d, Math.max(0.01, L * p)) ?? {x: 1, y: 0};
  const ang = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
  if (dash) {
    return <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} opacity={opacity * out * p} />;
  }
  return (
    <g opacity={opacity * out}>
      <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${L} ${L}`} strokeDashoffset={L * (1 - p)} />
      {arrow && p > 0.02 && <path d="M-14,-11 L6,0 L-14,11 Z" fill={stroke} transform={`translate(${tip.x} ${tip.y}) rotate(${ang})`} />}
    </g>
  );
};

/* ---------------- icons (120x120 viewBox, gold/white on navy) ---------------- */
type IconProps = {size?: number; t?: number; spin?: number};
const Svg: React.FC<{size: number; children: React.ReactNode}> = ({size, children}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{display: 'block', overflow: 'visible'}}>
    {children}
  </svg>
);

export const IconTurntable: React.FC<IconProps> = ({size = 120, spin = 0}) => (
  <Svg size={size}>
    <ellipse cx={60} cy={74} rx={50} ry={20} fill="none" stroke={C.white} strokeWidth={6} />
    <g transform={`translate(60 74) scale(1 0.4) rotate(${spin})`}>
      <path d="M 0 -50 A 50 50 0 0 1 43 25" fill="none" stroke={C.gold} strokeWidth={14} strokeLinecap="round" />
    </g>
    <path d="M 98 58 l 10 -2 l -4 10 z" fill={C.gold} />
    <ellipse cx={60} cy={60} rx={22} ry={9} fill={C.paper} />
    <path d="M38 60 Q 40 78 60 80 Q 80 78 82 60" fill={C.paper} />
  </Svg>
);

export const IconSpoon: React.FC<IconProps> = ({size = 120}) => (
  <Svg size={size}>
    <ellipse cx={44} cy={44} rx={22} ry={30} transform="rotate(-40 44 44)" fill={C.paper} />
    <ellipse cx={44} cy={44} rx={15} ry={22} transform="rotate(-40 44 44)" fill={C.paperShade} />
    <line x1={60} y1={62} x2={102} y2={104} stroke={C.paper} strokeWidth={11} strokeLinecap="round" />
    <path d="M 20 96 q 18 10 36 0" stroke={C.gold} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M 52 98 l 8 -3 l -3 8 z" fill={C.gold} />
  </Svg>
);

export const IconHourglass: React.FC<IconProps> = ({size = 120, t = 0}) => {
  const flip = (t % 4) / 4;
  const sand = clamp01(flip * 1.3);
  return (
    <Svg size={size}>
      <g transform={`rotate(${flip > 0.85 ? (flip - 0.85) / 0.15 * 180 : 0} 60 60)`}>
        <rect x={28} y={14} width={64} height={8} rx={4} fill={C.gold} />
        <rect x={28} y={98} width={64} height={8} rx={4} fill={C.gold} />
        <path d="M36 22 L84 22 L84 30 Q84 52 64 60 Q84 68 84 90 L84 98 L36 98 L36 90 Q36 68 56 60 Q36 52 36 30 Z" fill="none" stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
        <path d={`M ${44 + 6 * sand} ${32 + 22 * sand} L ${76 - 6 * sand} ${32 + 22 * sand} L 60 58 Z`} fill={C.goldLight} opacity={1 - sand * 0.95} />
        <path d={`M 44 92 L 76 92 L ${60 + 14 * sand} ${92 - 20 * sand} L ${60 - 14 * sand} ${92 - 20 * sand} Z`} fill={C.goldLight} opacity={0.25 + sand * 0.75} />
        <line x1={60} y1={60} x2={60} y2={90} stroke={C.goldLight} strokeWidth={2} opacity={sand < 0.98 ? 0.9 : 0} />
      </g>
    </Svg>
  );
};

export const IconPackage: React.FC<IconProps> = ({size = 120}) => (
  <Svg size={size}>
    <rect x={16} y={20} width={88} height={80} rx={10} fill={C.navy700} stroke={C.white} strokeWidth={5} />
    <rect x={28} y={34} width={40} height={26} rx={4} fill="none" stroke={C.gold} strokeWidth={4} />
    <rect x={33} y={39} width={22} height={16} rx={2} fill={C.gold} opacity={0.5} />
    <circle cx={61} cy={47} r={3} fill={C.gold} />
    {[70, 80, 90].map((y) => (
      <line key={y} x1={28} y1={y} x2={92 - (y === 90 ? 20 : 0)} y2={y} stroke={C.navy200} strokeWidth={4} strokeLinecap="round" />
    ))}
  </Svg>
);

export const IconManual: React.FC<IconProps> = ({size = 120}) => (
  <Svg size={size}>
    <path d="M60 30 Q40 18 16 24 L16 98 Q40 92 60 104 Q80 92 104 98 L104 24 Q80 18 60 30 Z" fill={C.navy700} stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
    <line x1={60} y1={30} x2={60} y2={104} stroke={C.white} strokeWidth={4} />
    {[42, 54, 66, 78].map((y) => (
      <g key={y}>
        <line x1={26} y1={y} x2={50} y2={y + 2} stroke={C.navy200} strokeWidth={4} strokeLinecap="round" />
        <line x1={70} y1={y + 2} x2={94} y2={y} stroke={C.navy200} strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
    <rect x={70} y={38} width={20} height={12} rx={2} fill={C.gold} />
  </Svg>
);

export const IconThermometer: React.FC<IconProps> = ({size = 120}) => (
  <Svg size={size}>
    <line x1={60} y1={62} x2={60} y2={108} stroke={C.white} strokeWidth={7} strokeLinecap="round" />
    <path d="M56 104 L60 116 L64 104 Z" fill={C.white} />
    <circle cx={60} cy={38} r={28} fill={C.navy700} stroke={C.white} strokeWidth={5} />
    {[-150, -120, -90, -60, -30].map((a) => (
      <line key={a} x1={60 + Math.cos((a * Math.PI) / 180) * 18} y1={38 + Math.sin((a * Math.PI) / 180) * 18} x2={60 + Math.cos((a * Math.PI) / 180) * 24} y2={38 + Math.sin((a * Math.PI) / 180) * 24} stroke={C.navy200} strokeWidth={3} strokeLinecap="round" />
    ))}
    <path d="M60 38 L72 24" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
    <circle cx={60} cy={38} r={4} fill={C.gold} />
  </Svg>
);

export const IconCover: React.FC<IconProps> = ({size = 120}) => (
  <Svg size={size}>
    <path d="M14 78 Q14 30 60 28 Q106 30 106 78 Z" fill={C.paper} opacity={0.9} />
    <rect x={10} y={76} width={100} height={8} rx={4} fill={C.paperShade} />
    <rect x={52} y={18} width={16} height={12} rx={4} fill={C.gold} />
    <circle cx={80} cy={50} r={4} fill={C.navy700} />
    <circle cx={90} cy={58} r={4} fill={C.navy700} />
  </Svg>
);
