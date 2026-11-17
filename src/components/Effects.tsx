// Steam, bubbles, spatter and "hot object" heat lines. These are cartoon cues,
// not temperature data: no thermal colour maps anywhere in the project.
import React, {useId} from 'react';
import {noise2D} from '@remotion/noise';
import {C} from '../brand/tokens';
import {rand} from '../lib/anim';

type Pt = {x: number; y: number};

export const SteamWisps: React.FC<{
  origins: Pt[];
  height: number;
  intensity: number;
  t: number;
  width?: number;
  seed?: number;
}> = ({origins, height, intensity, t, width = 12, seed = 1}) => {
  const id = useId().replace(/:/g, '');
  if (intensity <= 0.001) return null;
  const period = 2.4;
  return (
    <g filter={`url(#${id}b)`}>
      <defs>
        <filter id={`${id}b`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={width * 0.32} />
        </filter>
      </defs>
      {origins.flatMap((o, i) =>
        [0, 1].map((k) => {
          const ph = (t / period + rand(seed * 31 + i * 7 + k * 3)) % 1;
          const len = height * 0.5;
          const base = o.y - ph * height * 0.55;
          const pts: string[] = [];
          for (let j = 0; j <= 12; j++) {
            const s = j / 12;
            const y = base - s * len;
            const amp = (10 + 34 * (ph + s * 0.4)) * (width / 12);
            const x = o.x + noise2D(`st${seed}${i}${k}`, (y - o.y) / 150, t * 0.35) * amp;
            pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
          }
          const op = Math.pow(Math.sin(Math.PI * ph), 1.3) * intensity * 0.62;
          return (
            <polyline
              key={`${i}-${k}`}
              points={pts.join(' ')}
              fill="none"
              stroke={C.white}
              strokeWidth={width * (1 - 0.35 * ph)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={op}
            />
          );
        }),
      )}
    </g>
  );
};

/** Bubbles that grow and pop near the edge of an elliptical food surface. */
export const EdgeBubbles: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  intensity: number;
  t: number;
  seed?: number;
  angleFilter?: (a: number) => boolean;
  size?: number;
}> = ({cx, cy, rx, ry, intensity, t, seed = 3, angleFilter, size = 1}) => {
  if (intensity <= 0.001) return null;
  const n = Math.round(8 + 26 * intensity);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < n * 3 && items.length < n; i++) {
    const a = rand(seed * 101 + i) * Math.PI * 2;
    if (angleFilter && !angleFilter(a)) continue;
    const rr = 0.8 + 0.15 * rand(seed * 53 + i);
    const x = cx + Math.cos(a) * rx * rr;
    const y = cy + Math.sin(a) * ry * rr;
    const period = (1.15 - 0.55 * intensity) * (0.7 + 0.6 * rand(seed * 17 + i));
    const ph = (t / period + rand(seed * 7 + i)) % 1;
    const rmax = (4 + 8 * intensity) * size * (0.6 + 0.8 * rand(seed * 13 + i));
    if (ph < 0.8) {
      const r = rmax * Math.sin((ph / 0.8) * (Math.PI / 2));
      items.push(
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={C.curryLight} stroke={C.curryDeep} strokeWidth={1.2 * size} />
          <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill={C.white} opacity={0.85} />
        </g>,
      );
    } else {
      const q = (ph - 0.8) / 0.2;
      items.push(
        <circle key={i} cx={x} cy={y} r={rmax * (1 + q * 0.9)} fill="none" stroke={C.curryLight} strokeWidth={1.6 * size} opacity={1 - q} />,
      );
    }
  }
  return <g>{items}</g>;
};

/** Droplets that jump from the rim when the edges are "furious". */
export const Spatter: React.FC<{cx: number; cy: number; rx: number; ry: number; intensity: number; t: number; seed?: number}> = ({
  cx,
  cy,
  rx,
  ry,
  intensity,
  t,
  seed = 9,
}) => {
  if (intensity <= 0.001) return null;
  const n = Math.round(10 * intensity);
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const period = 0.55 + 0.35 * rand(seed + i * 5);
        const ph = (t / period + rand(seed + i * 11)) % 1;
        const a = (0.15 + 0.8 * rand(seed + i * 3)) * Math.PI;
        const x0 = cx + side * rx * (0.55 + 0.4 * rand(seed + i * 19));
        const y0 = cy + Math.sin(a) * ry * 0.5;
        const vx = side * (40 + 60 * rand(seed + i * 23));
        const vy = 160 + 120 * rand(seed + i * 29);
        const x = x0 + vx * ph;
        const y = y0 - vy * ph + 420 * ph * ph;
        return <circle key={i} cx={x} cy={y} r={3.5 + 2 * rand(i + seed)} fill={C.curry} opacity={(1 - ph) * intensity} />;
      })}
    </g>
  );
};

/** Wavy gold lines beside an object: the cartoon convention for "this is hot". */
export const HeatLines: React.FC<{x: number; y: number; w: number; h: number; intensity: number; t: number}> = ({
  x,
  y,
  w,
  h,
  intensity,
  t,
}) => {
  if (intensity <= 0.001) return null;
  const per = intensity > 0.75 ? 3 : 2;
  const lines: React.ReactNode[] = [];
  [-1, 1].forEach((side) => {
    for (let k = 0; k < per; k++) {
      const lx = x + side * (w / 2 + 26 + k * 26);
      const amp = 5 + 5 * intensity;
      const top = y - h / 2 + k * 14;
      const bot = y + h / 2 - k * 10;
      const pts: string[] = [];
      for (let j = 0; j <= 16; j++) {
        const s = j / 16;
        const yy = bot - (bot - top) * s;
        const xx = lx + Math.sin(s * Math.PI * 3 - t * 9 + k) * amp;
        pts.push(`${xx.toFixed(1)},${yy.toFixed(1)}`);
      }
      const op = intensity * (0.55 + 0.45 * Math.sin(t * 6 + k * 1.7 + side));
      lines.push(
        <polyline key={`${side}${k}`} points={pts.join(' ')} fill="none" stroke={C.gold} strokeWidth={5} strokeLinecap="round" opacity={op} />,
      );
    }
  });
  return <g>{lines}</g>;
};
