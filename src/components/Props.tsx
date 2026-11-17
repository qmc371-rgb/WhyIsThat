// Small illustrated props: hands, spoon, fridge pictogram, counter-top surface.
import React from 'react';
import {C} from '../brand/tokens';
import {rand} from '../lib/anim';

/** Palm-up hand seen from the side, fingers pointing right. Origin = top of palm. */
export const Hand: React.FC<{x: number; y: number; s?: number; flip?: boolean; rot?: number}> = ({x, y, s = 1, flip = false, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
    {/* sleeve + cuff */}
    <line x1={-92} y1={18} x2={-360} y2={420} stroke={C.gold} strokeWidth={118} strokeLinecap="round" />
    <line x1={-92} y1={18} x2={-118} y2={58} stroke={C.goldDeep} strokeWidth={124} strokeLinecap="butt" />
    {/* palm + fingers */}
    <path
      d="M-96,-4 C-70,-14 -16,-12 34,-10 C68,-9 92,-16 108,-26 C122,-35 134,-22 126,-6 C116,12 94,24 60,28 L-44,34 C-72,36 -98,28 -96,-4 Z"
      fill={C.skin}
    />
    <path d="M-92,22 C-60,34 0,34 60,28 C90,24 112,14 124,-2" stroke={C.skinShade} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
    <path d="M82,-4 C96,-8 106,-14 112,-20 M70,6 C88,4 104,-2 116,-10" stroke={C.skinShade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.75} />
    {/* thumb */}
    <path d="M-44,-6 C-42,-34 -24,-52 -2,-50 C12,-49 15,-36 6,-27 C-4,-17 -14,-11 -16,-4 Z" fill={C.skin} />
    <path d="M-2,-50 C12,-49 15,-36 6,-27" stroke={C.skinShade} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);

/** Top-view spoon; bowl of the spoon at the origin, handle toward +x/+y. */
export const Spoon: React.FC<{x: number; y: number; s?: number; rot?: number; dollop?: number; dip?: number}> = ({
  x,
  y,
  s = 1,
  rot = 0,
  dollop = 0,
  dip = 0,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * (1 - 0.06 * dip)})`}>
    <ellipse cx={10} cy={14} rx={44} ry={58} fill={C.navy950} opacity={0.35 * (1 - dip)} />
    <rect x={-11} y={40} width={22} height={300} rx={11} fill={C.paperShade} />
    <rect x={-11} y={40} width={10} height={300} rx={5} fill={C.white} opacity={0.7} />
    <ellipse cx={0} cy={0} rx={42} ry={56} fill={C.paper} stroke={C.paperDeep} strokeWidth={3} />
    <ellipse cx={0} cy={2} rx={33} ry={45} fill={C.paperShade} />
    {dollop > 0 && (
      <g opacity={dollop} transform={`scale(${0.6 + 0.4 * dollop})`}>
        <ellipse cx={4} cy={6} rx={30} ry={38} fill={C.curry} />
        <ellipse cx={-10} cy={-6} rx={18} ry={20} fill={C.rice} />
        {Array.from({length: 7}, (_, i) => (
          <ellipse
            key={i}
            cx={-14 + rand(i) * 18}
            cy={-16 + rand(i + 9) * 22}
            rx={5}
            ry={2.4}
            transform={`rotate(${rand(i + 3) * 180} ${-14 + rand(i) * 18} ${-16 + rand(i + 9) * 22})`}
            fill={C.rice}
            stroke={C.riceShade}
            strokeWidth={1}
          />
        ))}
        <ellipse cx={14} cy={14} rx={11} ry={8} fill={C.chicken} />
      </g>
    )}
    {dip > 0 && <ellipse cx={0} cy={0} rx={44} ry={58} fill={C.curry} opacity={0.55 * dip} />}
  </g>
);

export const FridgeIcon: React.FC<{size?: number; color?: string}> = ({size = 46, color = C.white}) => (
  <svg width={size * 0.66} height={size} viewBox="0 0 40 60" style={{display: 'block'}}>
    <rect x={3} y={3} width={34} height={54} rx={6} fill="none" stroke={color} strokeWidth={4} />
    <line x1={3} y1={23} x2={37} y2={23} stroke={color} strokeWidth={4} />
    <line x1={10} y1={10} x2={10} y2={17} stroke={color} strokeWidth={4} strokeLinecap="round" />
    <line x1={10} y1={30} x2={10} y2={42} stroke={color} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** Same kitchen counter, seen from above (for top-down shots). */
export const CounterTop: React.FC = () => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="ctop" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={C.navy500} />
        <stop offset="1" stopColor={C.navy700} />
      </linearGradient>
      <radialGradient id="cvig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.55" stopColor={C.navy950} stopOpacity="0" />
        <stop offset="1" stopColor={C.navy950} stopOpacity="0.6" />
      </radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="url(#ctop)" />
    {Array.from({length: 260}, (_, i) => (
      <circle key={i} cx={rand(i * 3) * 1920} cy={rand(i * 3 + 1) * 1080} r={1 + rand(i * 3 + 2) * 2.2} fill={i % 3 ? C.navy400 : C.navy800} opacity={0.45} />
    ))}
    <rect x={0} y={1004} width={1920} height={6} fill={C.white} opacity={0.18} />
    <rect x={0} y={1010} width={1920} height={70} fill={C.navy850} />
    <rect width={1920} height={1080} fill="url(#cvig)" />
  </svg>
);
