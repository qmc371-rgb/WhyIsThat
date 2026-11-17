// Scientific diagrams drawn in code. Every pattern is SCHEMATIC: simplified,
// single-hue gold on navy, no numbers, no thermal-camera look.
import React, {useId} from 'react';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {C} from '../brand/tokens';
import {rand} from '../lib/anim';

/* ---------------- top-down chamber map ---------------- */
export const CH = {x: 150, y: 250, w: 900, h: 620} as const;
const s2 = (k: number, p: number) => Math.sin(k * Math.PI * p) ** 2;
const patA = (u: number, v: number) => 0.55 * s2(3, u) * s2(2, v) + 0.45 * s2(2, u) * s2(3, v);
const patB = (u: number, v: number) => 0.5 * s2(3, u + 0.06) * s2(2, v - 0.05) + 0.5 * s2(2, u - 0.05) * s2(3, v + 0.07);
export const mapI = (u: number, v: number, morph = 0) => patA(u, v) * (1 - morph) + patB(u, v) * morph;

const findSpot = (want: 'max' | 'min', region: [number, number, number, number], pat = patA) => {
  let best = want === 'max' ? -1 : 2;
  let at: [number, number] = [0.5, 0.5];
  for (let u = region[0]; u <= region[2]; u += 0.01) {
    for (let v = region[1]; v <= region[3]; v += 0.01) {
      const I = pat(u, v);
      if ((want === 'max' && I > best) || (want === 'min' && I < best)) {
        best = I;
        at = [u, v];
      }
    }
  }
  return {x: CH.x + at[0] * CH.w, y: CH.y + at[1] * CH.h};
};
/** Screen positions of a bright and a dark spot in pattern A (for labels). */
export const SPOTS = {bright: findSpot('max', [0.55, 0.1, 0.95, 0.45]), dark: findSpot('min', [0.3, 0.35, 0.6, 0.65])};
/** Same, after the food has changed the pattern (morph = 1). Dark spot kept off the bowl. */
export const SPOTS_B = {bright: findSpot('max', [0.7, 0.1, 0.95, 0.4], patB), dark: findSpot('min', [0.05, 0.05, 0.25, 0.4], patB)};
export const INLET = {x: CH.x + CH.w, y: CH.y + 150};
export const REFLECT_PATHS: Array<Array<[number, number]>> = [
  [[INLET.x, INLET.y], [CH.x + 520, CH.y], [CH.x + 140, CH.y + CH.h], [CH.x, CH.y + 470]],
  [[INLET.x, INLET.y], [CH.x + 690, CH.y + CH.h], [CH.x + 260, CH.y], [CH.x, CH.y + 220]],
];

export const ChamberMap: React.FC<{reveal?: number; morph?: number; pulse?: number; dim?: number; children?: React.ReactNode}> = ({
  reveal = 1,
  morph = 0,
  pulse = 0,
  dim = 0,
  children,
}) => {
  const id = useId().replace(/:/g, '');
  const cols = 60;
  const rows = 42;
  const cw = CH.w / cols;
  const rh = CH.h / rows;
  const cells: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++) {
    const u = (i + 0.5) / cols;
    if (u > reveal) break;
    for (let j = 0; j < rows; j++) {
      const I = mapI(u, (j + 0.5) / rows, morph);
      cells.push(
        <rect key={`${i}-${j}`} x={CH.x + i * cw} y={CH.y + j * rh} width={cw + 0.6} height={rh + 0.6} fill={C.gold} opacity={(0.08 + 0.85 * Math.pow(I, 0.85)) * (1 + 0.25 * pulse) * (1 - dim)} />,
      );
    }
  }
  return (
    <g>
      <defs>
        <filter id={`${id}soft`} x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={9} />
        </filter>
        <clipPath id={`${id}ch`}>
          <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} rx={18} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}ch)`}>
        <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} fill={C.navy950} />
        <g filter={`url(#${id}soft)`}>{cells}</g>
        {children}
      </g>
      <rect x={CH.x} y={CH.y} width={CH.w} height={CH.h} rx={18} fill="none" stroke={C.paper} strokeWidth={10} />
      <rect x={INLET.x - 6} y={INLET.y - 40} width={46} height={80} rx={6} fill={C.navy600} stroke={C.paper} strokeWidth={4} />
    </g>
  );
};

/** Gold legend bar: LESS ENERGY ↔ MORE ENERGY (no numbers, no units). */
export const EnergyLegend: React.FC<{width?: number; left?: string; right?: string}> = ({width = 520, left = 'LESS ENERGY', right = 'MORE ENERGY'}) => (
  <div style={{width}}>
    <div style={{height: 36, borderRadius: 10, background: `linear-gradient(90deg, rgba(255,197,46,0.08), rgba(255,197,46,0.93)), ${C.navy950}`}} />
    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: 21, letterSpacing: '0.14em', color: C.navy200}}>
      <span>{left}</span>
      <span style={{color: C.gold}}>{right}</span>
    </div>
  </div>
);

/* ---------------- side-view microwave cutaway ---------------- */
export const CUT = {
  body: {x: 290, y: 230, w: 1340, h: 600},
  chamber: {x: 340, y: 276, w: 860, h: 508},
  magnetron: {x: 1300, y: 560, w: 210, h: 180},
  guide: [[1405, 560], [1405, 330], [1200, 330]] as Array<[number, number]>,
  turntableY: 752,
};

export const MicrowaveCutaway: React.FC<{wallFlash?: number; children?: React.ReactNode}> = ({wallFlash = 0, children}) => {
  const {body, chamber, magnetron} = CUT;
  return (
    <g>
      <rect x={body.x} y={body.y} width={body.w} height={body.h} rx={34} fill={C.navy850} stroke={C.navy400} strokeWidth={4} />
      {/* waveguide channel */}
      <path d="M1380 560 L1380 306 L1200 306 L1200 354 L1430 354 L1430 560" fill={C.navy700} stroke={C.navy300} strokeWidth={3} />
      <rect x={1384} y={310} width={42} height={250} fill={C.navy700} />
      {/* chamber with metal walls */}
      <rect x={chamber.x} y={chamber.y} width={chamber.w} height={chamber.h} rx={14} fill={C.navy950} />
      <rect x={chamber.x} y={chamber.y} width={chamber.w} height={chamber.h} rx={14} fill="none" stroke={C.paper} strokeWidth={10} />
      <rect x={chamber.x} y={chamber.y} width={chamber.w} height={chamber.h} rx={14} fill="none" stroke={C.goldLight} strokeWidth={16} opacity={wallFlash * 0.6} />
      <rect x={1196} y={306} width={14} height={48} fill={C.navy700} />
      {/* magnetron: body, cooling fins, antenna */}
      <rect x={magnetron.x} y={magnetron.y} width={magnetron.w} height={magnetron.h} rx={18} fill={C.navy600} stroke={C.paper} strokeWidth={4} />
      {Array.from({length: 7}, (_, i) => (
        <line key={i} x1={magnetron.x + 22} y1={magnetron.y + 34 + i * 18} x2={magnetron.x + magnetron.w - 22} y2={magnetron.y + 34 + i * 18} stroke={C.navy300} strokeWidth={4} strokeLinecap="round" />
      ))}
      <rect x={1395} y={538} width={20} height={26} rx={4} fill={C.gold} />
      {/* turntable */}
      <ellipse cx={chamber.x + chamber.w / 2} cy={CUT.turntableY} rx={330} ry={22} fill={C.white} opacity={0.12} stroke={C.white} strokeOpacity={0.5} strokeWidth={3} />
      {children}
    </g>
  );
};

/* ---------------- water molecule ---------------- */
export const WaterMolecule: React.FC<{x: number; y: number; angle: number; s?: number}> = ({x, y, angle, s = 1}) => {
  const a = (52 * Math.PI) / 180;
  const hx = Math.cos(a) * 44;
  const hy = Math.sin(a) * 44;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`}>
      <line x1={0} y1={0} x2={hx} y2={hy} stroke={C.paperShade} strokeWidth={8} />
      <line x1={0} y1={0} x2={hx} y2={-hy} stroke={C.paperShade} strokeWidth={8} />
      <circle r={28} fill={C.paper} stroke={C.navy300} strokeWidth={3} />
      <circle cx={hx} cy={hy} r={16} fill={C.gold} />
      <circle cx={hx} cy={-hy} r={16} fill={C.gold} />
    </g>
  );
};

/* ---------------- bowl cross-section (thick portion) ---------------- */
const OUTER = 'M -330,-150 C -330,115 -175,200 0,200 C 175,200 330,115 330,-150';
const INNER = 'M -298,-150 C -298,92 -152,166 0,166 C 152,166 298,92 298,-150';
export const XS_POINTS = {outerWall: [-318, 40] as [number, number], foodCenter: [0, 36] as [number, number], surfaceY: -108};

/** Side cross-section of the bowl full of food. band/core: schematic warmth 0..1 (brighter = warmer). */
export const BowlCrossSection: React.FC<{
  x: number;
  y: number;
  s?: number;
  band?: number;
  core?: number;
  intoWall?: number;
  energyIn?: number;
  conduction?: number;
  t?: number;
}> = ({x, y, s = 1, band = 0, core = 0, intoWall = 0, energyIn = 0, conduction = 0, t = 0}) => {
  const id = useId().replace(/:/g, '');
  const L = getLength(INNER);
  const sY = XS_POINTS.surfaceY;
  const arrowsInto = [0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88].map((f) => {
    const p = getPointAtLength(INNER, L * f) ?? {x: 0, y: 0};
    const tg = getTangentAtLength(INNER, L * f) ?? {x: 1, y: 0};
    const nx = tg.y;
    const ny = -tg.x;
    return {x0: p.x - nx * 34, y0: p.y - ny * 34, x1: p.x + nx * 22, y1: p.y + ny * 22, ang: (Math.atan2(ny, nx) * 180) / Math.PI};
  });
  const energy: Array<[number, number, number, number]> = [
    [-560, 0, -258, 4],
    [560, -20, 258, -16],
    [-150, -380, -150, sY + 8],
    [150, -380, 150, sY + 8],
    [-470, 300, -200, 118],
    [470, 300, 200, 118],
  ];
  const cond: Array<[number, number, number, number]> = [
    [-236, 20, -120, 30],
    [236, 20, 120, 30],
    [-150, sY + 30, -90, -20],
    [150, sY + 30, 90, -20],
    [0, 150, 0, 92],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}food`}>
          <path d={`${INNER} Z`} />
        </clipPath>
        <clipPath id={`${id}below`}>
          <rect x={-400} y={sY} width={800} height={500} />
        </clipPath>
        <filter id={`${id}b`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
      </defs>
      {/* bowl wall */}
      <path d={`${OUTER} L 298,-150 C 298,92 152,166 0,166 C -152,166 -298,92 -298,-150 Z`} fill={C.paper} />
      <path d={`${OUTER}`} fill="none" stroke={C.paperShade} strokeWidth={4} />
      {/* food (clipped to the inside, below the surface line) */}
      <g clipPath={`url(#${id}food)`}>
        <g clipPath={`url(#${id}below)`}>
        <rect x={-340} y={sY} width={680} height={400} fill={C.curryDeep} />
        <g filter={`url(#${id}b)`}>
          <path d={INNER} fill="none" stroke={C.goldLight} strokeWidth={130} opacity={band} />
          <line x1={-340} y1={sY} x2={340} y2={sY} stroke={C.goldLight} strokeWidth={110} opacity={band} />
          <ellipse cx={0} cy={40} rx={150} ry={62} fill={C.gold} opacity={core * 0.85} />
        </g>
        <line x1={-340} y1={sY} x2={340} y2={sY} stroke={C.curryLight} strokeWidth={6} />
        </g>
      </g>
      {/* heat moving from the food into the bowl wall */}
      {intoWall > 0 &&
        arrowsInto.map((a, i) => (
          <g key={i} opacity={Math.min(1, intoWall * 2 - i * 0.12)}>
            <line x1={a.x0} y1={a.y0} x2={a.x1} y2={a.y1} stroke={C.gold} strokeWidth={6} strokeLinecap="round" />
            <path d="M-12,-9 L5,0 L-12,9 Z" fill={C.gold} transform={`translate(${a.x1} ${a.y1}) rotate(${a.ang})`} />
          </g>
        ))}
      {/* energy arriving from outside (passes through the ceramic) */}
      {energy.map(([x0, y0, x1, y1], i) => {
        const p = Math.max(0, Math.min(1, energyIn * 1.6 - i * 0.1));
        if (p <= 0) return null;
        const ex = x0 + (x1 - x0) * p;
        const ey = y0 + (y1 - y0) * p;
        const len = Math.hypot(ex - x0, ey - y0);
        const nx = -(ey - y0) / (len || 1);
        const ny = (ex - x0) / (len || 1);
        let d = '';
        const n = Math.max(2, Math.floor(len / 4));
        for (let k = 0; k <= n; k++) {
          const q = k / n;
          const off = Math.sin(q * len / 22 - t * 8) * 9;
          d += `${k ? ' L' : 'M'}${(x0 + (ex - x0) * q + nx * off).toFixed(1)},${(y0 + (ey - y0) * q + ny * off).toFixed(1)}`;
        }
        return <path key={i} d={d} fill="none" stroke={C.goldLight} strokeWidth={5} strokeLinecap="round" opacity={0.95} />;
      })}
      {/* conduction: heat spreading inward */}
      {conduction > 0 &&
        cond.map(([x0, y0, x1, y1], i) => {
          const p = Math.min(1, conduction * 1.5 - i * 0.08);
          if (p <= 0) return null;
          const ex = x0 + (x1 - x0) * p;
          const ey = y0 + (y1 - y0) * p;
          const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
          return (
            <g key={i}>
              <line x1={x0} y1={y0} x2={ex} y2={ey} stroke={C.white} strokeWidth={7} strokeLinecap="round" />
              <path d="M-13,-10 L6,0 L-13,10 Z" fill={C.white} transform={`translate(${ex} ${ey}) rotate(${ang})`} />
            </g>
          );
        })}
    </g>
  );
};

/** Little gold sparkles (e.g., energy meeting food). */
export const Sparkles: React.FC<{x: number; y: number; r: number; n?: number; t: number; o?: number}> = ({x, y, r, n = 10, t, o = 1}) => (
  <g opacity={o}>
    {Array.from({length: n}, (_, i) => {
      const a = rand(i * 7) * Math.PI * 2;
      const d = r * Math.sqrt(rand(i * 13));
      const ph = (t * 1.6 + rand(i * 3)) % 1;
      const k = Math.sin(Math.PI * ph);
      return (
        <path
          key={i}
          d="M0,-9 L2.5,-2.5 L9,0 L2.5,2.5 L0,9 L-2.5,2.5 L-9,0 L-2.5,-2.5 Z"
          fill={C.goldLight}
          transform={`translate(${x + Math.cos(a) * d} ${y + Math.sin(a) * d * 0.5}) scale(${k})`}
        />
      );
    })}
  </g>
);
