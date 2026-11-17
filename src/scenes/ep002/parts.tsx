// EP002 building blocks. Visual grammar used everywhere in the episode:
//   AIRFLOW        = dashed white line with marching dashes + moving air dots (FlowPath)
//   PRESSURE FORCE = solid golden arrow (ForceArrow)
// Every diagram carries DiagramTag ("Simplified illustration — not to scale."; + SCHEMATIC on dot patterns).
import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {C, FONT} from '../../brand/tokens';
import {clamp01, pop, rand, ramp} from '../../lib/anim';
import {Mark, useT} from '../../kit/kit';
import type {Art} from './geom';

export type Cam = {x: number; y: number; z: number};

/** Lerp between two cameras (z eased in log space so pushes feel even). */
export const camMix = (a: Cam, b: Cam, p: number): Cam => ({
  x: a.x + (b.x - a.x) * p,
  y: a.y + (b.y - a.y) * p,
  z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * p),
});

/** Camera keyframes [time, cam] → cam at t (eased between keys). */
export const camAt = (t: number, keys: Array<[number, Cam]>, ease = Easing.inOut(Easing.cubic)): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, c0] = keys[i];
    const [t1, c1] = keys[i + 1];
    if (t <= t1) return camMix(c0, c1, ease(clamp01((t - t0) / Math.max(1e-6, t1 - t0))));
  }
  return keys[keys.length - 1][1];
};

const fit = (art: Art, cam: Cam, W: number, H: number) => {
  const s = Math.max(W / art.w, H / art.h) * cam.z;
  const hw = W / 2 / s;
  const hh = H / 2 / s;
  const x = Math.min(Math.max(cam.x, hw), art.w - hw);
  const y = Math.min(Math.max(cam.y, hh), art.h - hh);
  return {s, left: W / 2 - x * s, top: H / 2 - y * s};
};

/** Image-space point → screen point for a camera (so labels can follow the art). */
export const artToScreen = (art: Art, cam: Cam, W: number, H: number, x: number, y: number): [number, number] => {
  const f = fit(art, cam, W, H);
  return [f.left + x * f.s, f.top + y * f.s];
};
export const artScale = (art: Art, cam: Cam, W: number, H: number) => fit(art, cam, W, H).s;

/** A Higgsfield plate under a camera; children draw in image pixels and move with the art. */
export const ArtCam: React.FC<{art: Art; cam: Cam; children?: React.ReactNode}> = ({art, cam, children}) => {
  const {width, height} = useVideoConfig();
  const f = fit(art, cam, width, height);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.navy900}}>
      <div style={{position: 'absolute', left: f.left, top: f.top, width: art.w * f.s, height: art.h * f.s}}>
        <Img src={staticFile(art.file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} />
        {children && (
          <svg viewBox={`0 0 ${art.w} ${art.h}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
            {children}
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** The breather hole as seen through the window: a small bevelled opening (r in the parent's units). */
export const HoleMark: React.FC<{x: number; y: number; r: number; opacity?: number}> = ({x, y, r, opacity = 1}) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={r * 1.25} fill="rgba(255,255,255,0.22)" />
    <circle cx={x} cy={y} r={r} fill="rgba(6,15,34,0.55)" stroke="rgba(255,255,255,0.92)" strokeWidth={r * 0.34} />
    <circle cx={x - r * 0.32} cy={y - r * 0.32} r={r * 0.22} fill="rgba(255,255,255,0.85)" />
  </g>
);

/** Pulsing golden attention ring (radius in the parent's units). */
export const GoldRing: React.FC<{x: number; y: number; r: number; at: number; until?: number; width?: number}> = ({x, y, r, at, until = 1e9, width = 5}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at || t > until + 0.3) return null;
  const p = pop(frame, fps, at, 11);
  const out = 1 - ramp(t, until, until + 0.3);
  const ph = ((t - at) / 1.4) % 1;
  return (
    <g opacity={out}>
      <circle cx={x} cy={y} r={r * (0.4 + 0.6 * p)} fill="none" stroke={C.gold} strokeWidth={width} />
      <circle cx={x} cy={y} r={r * (1 + ph * 0.9)} fill="none" stroke={C.gold} strokeWidth={width * 0.7} opacity={(1 - ph) * 0.55 * p} />
    </g>
  );
};

/** Label pill with a leader line to a target dot. Sized to the composition (works in 16:9 and 9:16). */
export const Pin: React.FC<{
  target?: [number, number];
  label: [number, number];
  k?: string;
  v: string;
  at: number;
  until?: number;
  tone?: 'gold' | 'white';
  side?: 'left' | 'right' | 'center';
  vAlign?: 'center' | 'top' | 'bottom';
  size?: number;
  mark?: 'check' | 'cross';
  dot?: boolean;
  maxWidth?: number;
  dim?: number;
}> = ({target, label, k, v, at, until = 1e9, tone = 'gold', side = 'right', vAlign = 'center', size = 32, mark, dot = true, maxWidth, dim = 1}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  if (t < at || t > until + 0.3) return null;
  const accent = tone === 'gold' ? C.gold : C.white;
  const pd = pop(frame, fps, at, 11);
  const draw = ramp(t, at + 0.04, at + 0.32, Easing.out(Easing.cubic));
  const pill = pop(frame, fps, at + 0.14, 14);
  const out = (1 - ramp(t, until, until + 0.3)) * dim;
  const [lx, ly] = label;
  const tx = side === 'right' ? '0' : side === 'left' ? '-100%' : '-50%';
  const ty = vAlign === 'center' ? '-50%' : vAlign === 'top' ? '0' : '-100%';
  return (
    <AbsoluteFill style={{opacity: out, pointerEvents: 'none'}}>
      {target && (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          <line x1={target[0]} y1={target[1]} x2={target[0] + (lx - target[0]) * draw} y2={target[1] + (ly - target[1]) * draw} stroke={accent} strokeWidth={4} strokeLinecap="round" />
          {dot && (
            <>
              <circle cx={target[0]} cy={target[1]} r={15 * pd} fill="none" stroke={accent} strokeWidth={4} opacity={0.6} />
              <circle cx={target[0]} cy={target[1]} r={7 * pd} fill={accent} />
            </>
          )}
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          left: lx,
          top: ly,
          transform: `translate(${tx}, ${ty}) scale(${0.6 + 0.4 * pill})`,
          transformOrigin: side === 'right' ? 'left center' : side === 'left' ? 'right center' : 'center center',
          opacity: Math.min(1, pill * 1.4),
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: `${size * 0.36}px ${size * 0.66}px ${size * 0.36}px ${size * 0.5}px`,
          background: 'rgba(6,15,34,0.92)',
          border: `3px solid ${accent}`,
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          width: 'max-content',
          maxWidth,
        }}
      >
        {mark && <Mark kind={mark} size={size * 1.2} />}
        <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          {k && <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size * 0.56, letterSpacing: '0.16em', color: accent}}>{k}</span>}
          <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size, lineHeight: 1.15, color: C.white}}>{v}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Bottom-left tag on every diagram. */
export const DiagramTag: React.FC<{schematic?: boolean; at?: number; x?: number; y?: number; size?: number}> = ({schematic = false, at = -1, x = 40, y = 1040, size = 22}) => {
  const t = useT();
  const o = at < 0 ? 1 : ramp(t, at, at + 0.4);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translateY(-100%)', display: 'flex', alignItems: 'center', gap: 14, opacity: o}}>
      {schematic && (
        <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size, letterSpacing: '0.2em', color: C.navy950, background: C.gold, padding: '6px 12px', borderRadius: 8}}>
          SCHEMATIC
        </span>
      )}
      <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: size, color: C.navy200, background: 'rgba(6,15,34,0.7)', padding: '6px 12px', borderRadius: 8}}>
        Simplified illustration — not to scale.
      </span>
    </div>
  );
};

/** Top-left tag: this is one common design. */
export const CommonDesignTag: React.FC<{at: number; until?: number; x?: number; y?: number; size?: number}> = ({at, until = 1e9, x = 40, y = 40, size = 24}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at) return null;
  const p = pop(frame, fps, at, 14);
  const out = 1 - ramp(t, until, until + 0.3);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: Math.min(1, p * 1.4) * out,
        transform: `translateY(${(1 - p) * -20}px)`,
        fontFamily: FONT.ui,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '0.14em',
        color: C.gold,
        border: `2px solid ${C.gold}`,
        borderRadius: 10,
        padding: '8px 16px',
        background: 'rgba(6,15,34,0.85)',
      }}
    >
      COMMON DESIGN · NOT EVERY AIRCRAFT
    </div>
  );
};

/** Solid golden pressure-force arrow; grows from its tail. */
export const ForceArrow: React.FC<{from: [number, number]; to: [number, number]; at: number; until?: number; w?: number; head?: number; opacity?: number}> = ({
  from,
  to,
  at,
  until = 1e9,
  w = 14,
  head = 34,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at || t > until + 0.3) return null;
  const p = pop(frame, fps, at, 15, 0.7);
  const out = 1 - ramp(t, until, until + 0.3);
  const [x0, y0] = from;
  const dx = to[0] - x0;
  const dy = to[1] - y0;
  const L = Math.hypot(dx, dy) * Math.min(1, p);
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  const hl = Math.min(head, L * 0.6);
  const sw = w / 2;
  const hw = Math.max(w * 1.25, head * 0.62);
  const d = `M0,${-sw} L${L - hl},${-sw} L${L - hl},${-hw} L${L},0 L${L - hl},${hw} L${L - hl},${sw} L0,${sw} Z`;
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${ang})`} opacity={opacity * out * Math.min(1, p * 1.6)}>
      <path d={d} fill={C.gold} stroke={C.navy950} strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
};

const headAt = (d: string, atLen: number, dir: 1 | -1, color: string, size: number) => {
  const p = getPointAtLength(d, atLen) ?? {x: 0, y: 0};
  const tan = getTangentAtLength(d, atLen) ?? {x: 1, y: 0};
  const ang = (Math.atan2(tan.y, tan.x) * 180) / Math.PI + (dir === -1 ? 180 : 0);
  return <path d={`M${-size},${-size * 0.72} L${size * 0.5},0 L${-size},${size * 0.72} Z`} fill={color} transform={`translate(${p.x} ${p.y}) rotate(${ang})`} />;
};

/** AIRFLOW: dashed white path whose dashes march in the flow direction, with air dots riding it. */
export const FlowPath: React.FC<{
  d: string;
  at: number;
  until?: number;
  dir?: 1 | -1 | 0; // 1 = along the path, -1 = against it, 0 = both ways (dots shuttle)
  dots?: number;
  speed?: number; // path lengths per second for the dots
  width?: number;
  color?: string;
  heads?: 'end' | 'start' | 'both' | 'none';
  opacity?: number;
}> = ({d, at, until = 1e9, dir = 1, dots = 5, speed = 0.45, width = 5, color = C.white, heads = 'end', opacity = 1}) => {
  const t = useT();
  if (t < at || t > until + 0.3) return null;
  const L = getLength(d);
  const fade = ramp(t, at, at + 0.35) * (1 - ramp(t, until, until + 0.3));
  const reveal = ramp(t, at, at + 0.6, Easing.out(Easing.cubic));
  const march = (t - at) * 60 * (dir === -1 ? 1 : -1);
  const hs = width * 3.2;
  return (
    <g opacity={fade * opacity}>
      <path d={d} fill="none" stroke="rgba(6,15,34,0.55)" strokeWidth={width + 6} strokeLinecap="round" strokeDasharray={`${L * reveal} ${L}`} />
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray="16 13" strokeDashoffset={march} opacity={reveal > 0.98 ? 1 : reveal} />
      {(heads === 'end' || heads === 'both') && reveal > 0.95 && headAt(d, L - 1, 1, color, hs)}
      {(heads === 'start' || heads === 'both') && reveal > 0.95 && headAt(d, 1, -1, color, hs)}
      {Array.from({length: dots}, (_, i) => {
        let f: number;
        if (dir === 0) {
          const ph = ((t - at) * speed + i / dots) % 2;
          f = ph < 1 ? ph : 2 - ph;
        } else {
          const ph = ((t - at) * speed + i / dots) % 1;
          f = dir === 1 ? ph : 1 - ph;
        }
        const p = getPointAtLength(d, Math.max(0.5, Math.min(L - 0.5, f * L))) ?? {x: 0, y: 0};
        const edge = Math.min(1, f * 8, (1 - f) * 8);
        return <circle key={i} cx={p.x} cy={p.y} r={width * 1.15} fill={C.white} opacity={0.9 * edge * reveal} />;
      })}
    </g>
  );
};

/** Schematic air: dots in rectangles. density 0–1 hides a deterministic subset; dots drift gently. */
export const AirDots: React.FC<{
  rects: Array<[number, number, number, number]>;
  spacing: number;
  seed?: number;
  density?: number;
  r?: number;
  color?: string;
  opacity?: number;
  exclude?: Array<[number, number, number, number]>;
}> = ({rects, spacing, seed = 1, density = 1, r = 4, color = C.white, opacity = 0.45, exclude = []}) => {
  const t = useT();
  const dots: React.ReactNode[] = [];
  let k = seed * 1000;
  for (const [x0, y0, x1, y1] of rects) {
    for (let y = y0 + spacing / 2; y < y1; y += spacing) {
      for (let x = x0 + spacing / 2; x < x1; x += spacing) {
        k++;
        if (rand(k * 3.1) > density) continue;
        const bx = x + (rand(k) - 0.5) * spacing * 0.8;
        const by = y + (rand(k * 1.7) - 0.5) * spacing * 0.8;
        const px = bx + Math.sin(t * 0.9 + rand(k * 2.3) * 6.28) * spacing * 0.12;
        const py = by + Math.cos(t * 0.7 + rand(k * 2.9) * 6.28) * spacing * 0.12;
        if (px < x0 + r || px > x1 - r || py < y0 + r || py > y1 - r) continue;
        if (exclude.some(([a, b, c, d]) => px > a - r && px < c + r && py > b - r && py < d + r)) continue;
        dots.push(<circle key={k} cx={px} cy={py} r={r} fill={color} opacity={opacity} />);
      }
    }
  }
  return <g>{dots}</g>;
};

/** Legend that separates the two arrow kinds. */
export const Legend: React.FC<{at: number; x?: number; y?: number; force?: boolean; flow?: boolean; size?: number}> = ({at, x = 1880, y = 1040, force = true, flow = true, size = 24}) => {
  const t = useT();
  if (t < at) return null;
  const o = ramp(t, at, at + 0.4);
  const row = (icon: React.ReactNode, text: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <svg width={size * 3.4} height={size * 1.4} viewBox="0 0 80 32" style={{overflow: 'visible'}}>
        {icon}
      </svg>
      <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size, letterSpacing: '0.12em', color: C.white}}>{text}</span>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-100%, -100%)',
        opacity: o,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '14px 20px',
        background: 'rgba(6,15,34,0.88)',
        border: `2px solid ${C.navy600}`,
        borderRadius: 14,
      }}
    >
      {flow &&
        row(
          <>
            <path d="M4,16 L60,16" stroke={C.white} strokeWidth={5} strokeDasharray="12 9" strokeLinecap="round" />
            <path d="M58,7 L74,16 L58,25 Z" fill={C.white} />
            <circle cx={30} cy={16} r={5.5} fill={C.white} />
          </>,
          'AIRFLOW',
        )}
      {force &&
        row(
          <>
            <path d="M4,10 L52,10 L52,3 L76,16 L52,29 L52,22 L4,22 Z" fill={C.gold} stroke={C.navy950} strokeWidth={2} strokeLinejoin="round" />
          </>,
          'PRESSURE FORCE',
        )}
    </div>
  );
};

/** Golden square bracket (horizontal) with a label below or above. */
export const Bracket: React.FC<{x0: number; x1: number; y: number; at: number; until?: number; up?: boolean; color?: string}> = ({x0, x1, y, at, until = 1e9, up = false, color = C.gold}) => {
  const t = useT();
  if (t < at || t > until + 0.3) return null;
  const p = ramp(t, at, at + 0.45, Easing.out(Easing.cubic)) * (1 - ramp(t, until, until + 0.3));
  const h = up ? -18 : 18;
  const m = (x0 + x1) / 2;
  const hw = ((x1 - x0) / 2) * p;
  return <path d={`M${m - hw},${y - h} L${m - hw},${y} L${m + hw},${y} L${m + hw},${y - h} M${m},${y} L${m},${y + h * 0.9}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={p} />;
};

/** Big text card with a ✓ / ✕ mark (narration wording only). */
export const Card: React.FC<{at: number; until?: number; mark?: 'check' | 'cross'; k?: string; text: string; tone?: 'gold' | 'white'; width?: number; size?: number}> = ({
  at,
  until = 1e9,
  mark,
  k,
  text,
  tone = 'gold',
  width = 1240,
  size = 52,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at - 0.01) return <div style={{width, opacity: 0, height: size * 2.6}} />;
  const p = pop(frame, fps, at, 14);
  const out = 1 - ramp(t, until, until + 0.3);
  const accent = tone === 'gold' ? C.gold : C.white;
  return (
    <div
      style={{
        width,
        display: 'flex',
        alignItems: 'center',
        gap: 30,
        padding: '30px 40px',
        background: 'rgba(6,15,34,0.9)',
        border: `4px solid ${accent}`,
        borderRadius: 24,
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
        opacity: Math.min(1, p * 1.4) * out,
        transform: `translateY(${(1 - p) * 40}px)`,
      }}
    >
      {mark && <Mark kind={mark} size={size * 1.5} />}
      <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
        {k && <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: size * 0.46, letterSpacing: '0.18em', color: accent}}>{k}</span>}
        <span style={{fontFamily: FONT.display, fontWeight: 600, fontSize: size, lineHeight: 1.12, color: C.white}}>{text}</span>
      </div>
    </div>
  );
};

/** Source attribution card (wording mirrors the narration; the source list is in the description). */
export const SourceCard: React.FC<{at: number; until?: number; source: string; quote: string; x: number; y: number; width?: number}> = ({at, until = 1e9, source, quote, x, y, width = 1100}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at || t > until + 0.3) return null;
  const p = pop(frame, fps, at, 14);
  const out = 1 - ramp(t, until, until + 0.3);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        transform: `translate(-50%, 0) translateY(${(1 - p) * -24}px)`,
        opacity: Math.min(1, p * 1.4) * out,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: '22px 30px',
        background: 'rgba(6,15,34,0.94)',
        borderLeft: `8px solid ${C.gold}`,
        borderRadius: 14,
        boxShadow: '0 14px 36px rgba(0,0,0,0.4)',
      }}
    >
      <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.18em', color: C.gold}}>SOURCE · {source}</span>
      <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 32, lineHeight: 1.3, color: C.white}}>{quote}</span>
    </div>
  );
};

/* ---------------- icons ---------------- */
export const IconWrench: React.FC<{size?: number}> = ({size = 120}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{display: 'block', overflow: 'visible'}}>
    <path
      d="M84 14 a24 24 0 0 0 -27 31 L18 84 a10 10 0 0 0 14 14 L71 59 a24 24 0 0 0 31 -27 l-15 15 l-12 -3 l-3 -12 Z"
      fill={C.paper}
      stroke={C.navy950}
      strokeWidth={4}
      strokeLinejoin="round"
    />
    <circle cx={25} cy={91} r={4} fill={C.navy700} />
  </svg>
);

export const IconShield: React.FC<{size?: number}> = ({size = 160}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" style={{display: 'block', overflow: 'visible'}}>
    <path d="M60 8 L102 22 L102 58 Q102 92 60 112 Q18 92 18 58 L18 22 Z" fill={C.navy700} stroke={C.gold} strokeWidth={6} strokeLinejoin="round" />
    <rect x={44} y={34} width={10} height={54} rx={4} fill={C.paper} opacity={0.9} />
    <rect x={64} y={34} width={10} height={54} rx={4} fill={C.paper} opacity={0.9} />
    <path d="M40 98 L80 98" stroke={C.gold} strokeWidth={5} strokeLinecap="round" />
  </svg>
);

/** Person pictogram for the analogy plan ("your side"). */
export const PersonTop: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-46} r={26} fill={C.gold} />
    <path d="M-44,62 L-44,8 Q-44,-14 -22,-14 L22,-14 Q44,-14 44,8 L44,62 Z" fill={C.gold} />
  </g>
);
