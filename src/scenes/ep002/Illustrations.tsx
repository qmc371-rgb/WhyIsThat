// Code-drawn illustrations for EP002: fuselage cross-section (pressure), the two-barrier analogy
// (top-down plan) and the "on the ground" house window. All schematic; no values anywhere.
import React, {useId} from 'react';
import {C} from '../../brand/tokens';
import {AirDots, HoleMark, PersonTop} from './parts';

/* ------------------------------ fuselage cross-section ------------------------------ */
export const FUS = {cx: 700, cy: 560, R: 340, wall: 30, winDy: -46};
const wr = FUS.R - FUS.wall / 2;
const wdx = Math.sqrt(wr * wr - FUS.winDy * FUS.winDy);
export const FUS_WIN = {
  left: [FUS.cx - wdx, FUS.cy + FUS.winDy] as [number, number],
  right: [FUS.cx + wdx, FUS.cy + FUS.winDy] as [number, number],
};

export const Fuselage: React.FC<{insideDots?: number; outsideDots?: number; winGlow?: number}> = ({insideDots = 1, outsideDots = 1, winGlow = 0}) => {
  const id = useId().replace(/:/g, '');
  const {cx, cy, R, wall} = FUS;
  const floorY = cy + 130;
  const seat = (x: number) => (
    <g key={x} transform={`translate(${x} ${floorY})`}>
      <rect x={-27} y={-146} width={54} height={118} rx={14} fill={C.navy600} />
      <rect x={-21} y={-140} width={42} height={30} rx={9} fill={C.navy500} />
      <rect x={-6} y={-28} width={12} height={28} fill={C.navy700} />
    </g>
  );
  const winRect = ([x, y]: [number, number], side: 1 | -1) => {
    const ang = (Math.atan2(y - cy, x - cx) * 180) / Math.PI;
    return (
      <g transform={`translate(${x} ${y}) rotate(${ang})`}>
        <rect x={-(wall + 10) / 2} y={-34} width={wall + 10} height={68} rx={10} fill="rgba(174,190,218,0.85)" stroke={winGlow > 0.5 ? C.gold : C.white} strokeWidth={winGlow > 0.5 ? 5 : 3} />
        {side === 1 ? null : null}
      </g>
    );
  };
  return (
    <g>
      <defs>
        <clipPath id={`${id}in`}>
          <circle cx={cx} cy={cy} r={R - wall} />
        </clipPath>
        <mask id={`${id}out`}>
          <rect width={1920} height={1080} fill="white" />
          <circle cx={cx} cy={cy} r={R + 8} fill="black" />
        </mask>
      </defs>
      <g mask={`url(#${id}out)`} opacity={outsideDots}>
        <AirDots rects={[[20, 20, 1900, 1060]]} spacing={44} seed={21} density={0.28} />
      </g>
      <circle cx={cx} cy={cy} r={R - wall / 2} fill={C.navy850} />
      <g clipPath={`url(#${id}in)`}>
        <rect x={cx - R} y={floorY} width={R * 2} height={R} fill={C.navy800} />
        <line x1={cx - R} x2={cx + R} y1={floorY} y2={floorY} stroke={C.navy500} strokeWidth={5} />
        {[-232, -172, -112, 112, 172, 232].map((dx) => seat(cx + dx))}
        <g opacity={insideDots}>
          <AirDots rects={[[cx - R, cy - R, cx + R, cy + R]]} spacing={30} seed={23} opacity={0.5} />
        </g>
      </g>
      <circle cx={cx} cy={cy} r={R - wall / 2} fill="none" stroke={C.paper} strokeWidth={wall} />
      <circle cx={cx} cy={cy} r={R - wall} fill="none" stroke={C.navy500} strokeWidth={3} />
      {winRect(FUS_WIN.left, -1)}
      {winRect(FUS_WIN.right, 1)}
    </g>
  );
};

/* ------------------------------ analogy: two barriers, one small room ------------------------------ */
export const AN = {b1: 700, b2: 1200, bw: 26, top: 170, bot: 910, gapY: 540, gapH: 70, person: [360, 540] as [number, number]};

export const AnalogyPlan: React.FC<{opening: number; roomDensity: number; b1Glow?: number; b2Glow?: number; dim?: number}> = ({opening, roomDensity, b1Glow = 0, b2Glow = 0, dim = 1}) => {
  const id = useId().replace(/:/g, '');
  const {b1, b2, bw, top, bot, gapY, gapH} = AN;
  const g0 = gapY - (gapH / 2) * opening;
  const g1 = gapY + (gapH / 2) * opening;
  const glass = 'rgba(244,247,252,0.28)';
  const barrier = (x: number, glow: number, gap: boolean) => (
    <g>
      <g fill={glass} stroke={glow > 0.5 ? C.gold : C.white} strokeWidth={glow > 0.5 ? 5 : 3}>
        {gap && opening > 0.01 ? (
          <>
            <rect x={x} y={top} width={bw} height={g0 - top} rx={6} />
            <rect x={x} y={g1} width={bw} height={bot - g1} rx={6} />
          </>
        ) : (
          <rect x={x} y={top} width={bw} height={bot - top} rx={6} />
        )}
      </g>
      <line x1={x + bw * 0.3} y1={top + 40} x2={x + bw * 0.3} y2={top + 200} stroke="rgba(255,255,255,0.35)" strokeWidth={5} strokeLinecap="round" />
    </g>
  );
  return (
    <g opacity={dim}>
      <defs>
        <pattern id={`${id}h`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill={C.navy800} />
          <line x1="0" y1="0" x2="0" y2="22" stroke={C.navy700} strokeWidth="6" />
        </pattern>
      </defs>
      {/* floor areas */}
      <rect x={60} y={top} width={b1 - 60} height={bot - top} rx={18} fill="rgba(74,111,168,0.16)" />
      <rect x={b1 + bw} y={top} width={b2 - b1 - bw} height={bot - top} fill="rgba(255,255,255,0.03)" />
      <AirDots rects={[[70, top + 10, b1 - 6, bot - 10]]} spacing={46} seed={31} />
      <AirDots rects={[[b1 + bw + 6, top + 10, b2 - 6, bot - 10]]} spacing={46} seed={33} density={roomDensity} />
      <AirDots rects={[[b2 + bw + 6, top + 10, 1880, bot - 10]]} spacing={46} seed={35} density={0.28} />
      {/* solid walls close the small room above and below */}
      <rect x={b1} y={top - 44} width={b2 + bw - b1} height={44} fill={`url(#${id}h)`} />
      <rect x={b1} y={bot} width={b2 + bw - b1} height={44} fill={`url(#${id}h)`} />
      {barrier(b1, b1Glow, true)}
      {barrier(b2, b2Glow, false)}
      <PersonTop x={AN.person[0]} y={AN.person[1]} s={1.15} />
    </g>
  );
};

/* ------------------------------ on the ground: a house window with a hole ------------------------------ */
export const HouseWindow: React.FC<{x: number; y: number; s?: number; hole?: number}> = ({x, y, s = 1, hole = 1}) => {
  const id = useId().replace(/:/g, '');
  const W = 520;
  const Hh = 600;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.navy400} />
          <stop offset="1" stopColor={C.navy200} />
        </linearGradient>
      </defs>
      <rect x={-W / 2 - 40} y={-Hh / 2 - 40} width={W + 80} height={Hh + 80} rx={10} fill={C.navy700} />
      <rect x={-W / 2 - 18} y={-Hh / 2 - 18} width={W + 36} height={Hh + 36} rx={8} fill={C.paper} />
      <rect x={-W / 2} y={-Hh / 2} width={W} height={Hh} fill={`url(#${id}sky)`} />
      <circle cx={-W / 4} cy={-Hh / 4} r={44} fill={C.goldLight} opacity={0.9} />
      <path d={`M${W / 2 - 170},${Hh / 2 - 120} q40,-50 90,-20 q30,-40 80,0 l0,140 l-170,0 Z`} fill={C.paper} opacity={0.75} />
      <rect x={-8} y={-Hh / 2} width={16} height={Hh} fill={C.paper} />
      <rect x={-W / 2} y={-8} width={W} height={16} fill={C.paper} />
      <rect x={-W / 2 - 40} y={Hh / 2 + 18} width={W + 80} height={30} rx={6} fill={C.paperShade} />
      <g opacity={hole}>
        <HoleMark x={W / 4 + 20} y={Hh / 4 - 10} r={16} />
      </g>
    </g>
  );
};
