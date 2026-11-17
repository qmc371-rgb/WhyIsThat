// Code-drawn microwave: animatable door (perspective-projected), interior light,
// turntable, display. Stays in code so the later schematic cutaway matches it.
import React, {useId} from 'react';
import {C, FONT} from '../brand/tokens';
import {SIDE} from './Bowl';

export const MW = {x: 1030, y: 390, w: 600, h: 310} as const; // base sits on the H1 counter (y=700)
const DOOR = {x: MW.x + 14, y: MW.y + 14, w: MW.w * 0.72 - 14, h: MW.h - 28};
export const CAVITY = {x: MW.x + 30, y: MW.y + 30, w: MW.w * 0.70 - 30, h: MW.h - 60};
export const INSIDE_BOWL = {x: CAVITY.x + CAVITY.w / 2, y: CAVITY.y + CAVITY.h - 22 - SIDE.FOOT * 0.42, s: 0.42};

type Props = {
  door: number; // 0 closed .. 1 open (~100°, swung toward the viewer)
  light: number; // interior light 0..1
  display: string;
  displayOn?: boolean;
  fastForward?: boolean;
  progress?: number | null; // cook progress bar 0..1, null hides
  turntable?: number; // rotation phase, seconds
  inside?: React.ReactNode;
};

const quad = (pts: Array<[number, number]>) => pts.map((p) => p.join(',')).join(' ');

export const Microwave: React.FC<Props> = ({
  door,
  light,
  display,
  displayOn = true,
  fastForward = false,
  progress = null,
  turntable = 0,
  inside,
}) => {
  const id = useId().replace(/:/g, '');
  const theta = door * (100 * Math.PI) / 180;
  const D = 1400;
  const vp: [number, number] = [MW.x + MW.w / 2, MW.y + MW.h / 2];
  // door-local (u along the door from hinge, absolute y) -> projected screen point
  const P = (u: number, y: number): [number, number] => {
    const X = DOOR.x + u * Math.cos(theta);
    const Z = u * Math.sin(theta);
    const f = D / (D - Z);
    return [vp[0] + (X - vp[0]) * f, vp[1] + (y - vp[1]) * f];
  };
  const rectQ = (u0: number, y0: number, u1: number, y1: number) => [P(u0, y0), P(u1, y0), P(u1, y1), P(u0, y1)];
  const outer = rectQ(0, DOOR.y, DOOR.w, DOOR.y + DOOR.h);
  const win = rectQ(34, DOOR.y + 32, DOOR.w - 58, DOOR.y + DOOR.h - 32);
  const handle = rectQ(DOOR.w - 40, DOOR.y + 46, DOOR.w - 22, DOOR.y + DOOR.h - 46);
  const doorShade = 0.35 * Math.sin(theta);
  const panelX = MW.x + MW.w * 0.72 + 6;
  const panelW = MW.w - (panelX - MW.x) - 20;
  const ttAngle = turntable * 1.6;

  return (
    <g>
      <defs>
        <radialGradient id={`${id}glow`} cx="0.5" cy="0.15" r="0.9">
          <stop offset="0" stopColor={C.goldLight} stopOpacity="0.95" />
          <stop offset="0.6" stopColor={C.gold} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.white} />
          <stop offset="1" stopColor={C.paperShade} />
        </linearGradient>
        <pattern id={`${id}mesh`} width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4.5" r="1.6" fill={C.navy950} />
        </pattern>
      </defs>

      {/* contact shadow on the counter */}
      <ellipse cx={MW.x + MW.w / 2} cy={MW.y + MW.h + 4} rx={MW.w * 0.52} ry={14} fill={C.navy950} opacity={0.45} />
      {/* feet */}
      <rect x={MW.x + 40} y={MW.y + MW.h - 6} width={40} height={10} rx={4} fill={C.navy950} />
      <rect x={MW.x + MW.w - 80} y={MW.y + MW.h - 6} width={40} height={10} rx={4} fill={C.navy950} />
      {/* body */}
      <rect x={MW.x} y={MW.y} width={MW.w} height={MW.h} rx={26} fill={`url(#${id}body)`} />
      <rect x={MW.x + 16} y={MW.y + 6} width={MW.w - 32} height={7} rx={3.5} fill={C.white} opacity={0.9} />

      {/* cavity */}
      <rect x={CAVITY.x} y={CAVITY.y} width={CAVITY.w} height={CAVITY.h} rx={10} fill={C.navy700} />
      <rect x={CAVITY.x + 36} y={CAVITY.y + 26} width={CAVITY.w - 72} height={CAVITY.h - 70} rx={6} fill={C.navy600} />
      {[
        [CAVITY.x, CAVITY.y, CAVITY.x + 36, CAVITY.y + 26],
        [CAVITY.x + CAVITY.w, CAVITY.y, CAVITY.x + CAVITY.w - 36, CAVITY.y + 26],
        [CAVITY.x, CAVITY.y + CAVITY.h, CAVITY.x + 36, CAVITY.y + CAVITY.h - 44],
        [CAVITY.x + CAVITY.w, CAVITY.y + CAVITY.h, CAVITY.x + CAVITY.w - 36, CAVITY.y + CAVITY.h - 44],
      ].map(([a, b, c, d], i) => (
        <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={C.navy500} strokeWidth={2} />
      ))}
      <rect x={CAVITY.x} y={CAVITY.y} width={CAVITY.w} height={CAVITY.h} rx={10} fill={`url(#${id}glow)`} opacity={light} />
      {/* turntable with a moving glint so rotation reads in front view */}
      <ellipse cx={CAVITY.x + CAVITY.w / 2} cy={CAVITY.y + CAVITY.h - 22} rx={CAVITY.w * 0.38} ry={15} fill={C.white} opacity={0.16} stroke={C.white} strokeOpacity={0.35} strokeWidth={2} />
      <ellipse
        cx={CAVITY.x + CAVITY.w / 2 + Math.cos(ttAngle) * CAVITY.w * 0.3}
        cy={CAVITY.y + CAVITY.h - 22 + Math.sin(ttAngle) * 11}
        rx={14}
        ry={3}
        fill={C.white}
        opacity={0.55 * (0.5 + 0.5 * Math.sin(ttAngle))}
      />
      {inside}

      {/* door: frame with a window hole, tinted glass, mesh, handle */}
      <path
        d={`M${quad(outer).replace(/ /g, ' L')} Z M${quad(win).replace(/ /g, ' L')} Z`}
        fillRule="evenodd"
        fill={C.paper}
        stroke={C.paperShade}
        strokeWidth={2}
      />
      <polygon points={quad(outer)} fill={C.navy900} opacity={doorShade} />
      <polygon points={quad(win)} fill={C.navy950} opacity={0.42 - 0.2 * light} />
      <polygon points={quad(win)} fill={`url(#${id}mesh)`} opacity={0.22} />
      <polygon
        points={quad([P(60, DOOR.y + 34), P(140, DOOR.y + 34), P(70, DOOR.y + DOOR.h - 34), P(-10 + 34, DOOR.y + DOOR.h - 34)])}
        fill={C.white}
        opacity={0.07 * (1 - door)}
      />
      <polygon points={quad(handle)} fill={C.paperShade} />

      {/* control panel */}
      <rect x={panelX} y={MW.y + 26} width={panelW} height={60} rx={10} fill={C.navy950} />
      {displayOn && (
        <text
          x={panelX + panelW / 2 + (fastForward ? 12 : 0)}
          y={MW.y + 68}
          textAnchor="middle"
          fontFamily={FONT.ui}
          fontWeight={700}
          fontSize={32}
          letterSpacing={2}
          fill={C.gold}
          style={{fontVariantNumeric: 'tabular-nums'}}
        >
          {display}
        </text>
      )}
      {fastForward && (
        <path
          d={`M${panelX + 12} ${MW.y + 46} l12 10 l-12 10 z M${panelX + 26} ${MW.y + 46} l12 10 l-12 10 z`}
          fill={C.goldLight}
        />
      )}
      {progress !== null && (
        <g>
          <rect x={panelX + 14} y={MW.y + 94} width={panelW - 28} height={8} rx={4} fill={C.paperShade} />
          <rect x={panelX + 14} y={MW.y + 94} width={(panelW - 28) * Math.min(1, Math.max(0, progress))} height={8} rx={4} fill={C.gold} />
        </g>
      )}
      {Array.from({length: 12}, (_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const bw = (panelW - 28 - 2 * 10) / 3;
        return (
          <rect
            key={i}
            x={panelX + 14 + col * (bw + 10)}
            y={MW.y + 116 + row * 30}
            width={bw}
            height={20}
            rx={6}
            fill={C.paperShade}
          />
        );
      })}
      <rect x={panelX + 14} y={MW.y + MW.h - 58} width={panelW - 28} height={34} rx={10} fill={C.gold} />
      <path d={`M${panelX + panelW / 2 - 7} ${MW.y + MW.h - 50} l16 9 l-16 9 z`} fill={C.navy900} />
    </g>
  );
};
