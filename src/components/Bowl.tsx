// The one white bowl of leftovers (golden curry + rice), using approved Higgsfield
// art (H2 three-quarter, H3 top-down). Code layers on top: steam, bubbles,
// spatter, heat lines. Anchors come from scripts/measure_asset.py.
import React, {useId} from 'react';
import {staticFile} from 'remotion';
import {C} from '../brand/tokens';
import {EdgeBubbles, HeatLines, SteamWisps, Spatter} from './Effects';

// H2: rim centre (1200, 736) px, radii 684 x 319 px, foot at y=1465 px, image 2400x1792.
const K_SIDE = 170 / 684;
export const SIDE = {
  RX: 170,
  RY: 319 * K_SIDE,
  FOOT: (1465 - 736) * K_SIDE,
  IRX: 160,
  IRY: 72,
  FCX: 10,
  FCY: 9,
  FRX: 150,
  FRY: 60,
} as const;
// H3: centre (1018.5, 1023.5) px, radius 873.5 px, image 2048x2048.
const K_TOP = 230 / 873.5;
export const TOP = {R: 230, RIM_IN: 212, FOOD: 192} as const;
/** Named spots on the top-down art (local units, origin = bowl centre). */
export const TOP_SPOTS = {
  middle: [-6, -2],
  thick: [83, 13],
  sauce: [150, -70],
  rice: [-112, -5],
} as const;

export type Heat = {steam?: number; bubbles?: number; spatter?: number; heat?: number};

/** Three-quarter view. Local origin = rim centre; foot at y = SIDE.FOOT. */
export const BowlSide: React.FC<{x: number; y: number; s: number; t: number; heat?: Heat; shadow?: boolean; rot?: number}> = ({
  x,
  y,
  s,
  t,
  heat = {},
  shadow = true,
  rot = 0,
}) => {
  const id = useId().replace(/:/g, '');
  const {RX, FOOT, IRX, IRY, FCX, FCY, FRX, FRY} = SIDE;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <clipPath id={`${id}open`}>
          <ellipse cx={0} cy={2} rx={IRX} ry={IRY} />
        </clipPath>
      </defs>
      {shadow && <ellipse cx={0} cy={FOOT - 2} rx={RX * 0.62} ry={14} fill={C.navy950} opacity={0.4} />}
      <HeatLines x={0} y={FOOT * 0.55} w={RX * 1.9} h={FOOT * 0.8} intensity={heat.heat ?? 0} t={t} />
      <image href={staticFile('assets/higgsfield/H2_bowl_side_cut.png')} x={-1200 * K_SIDE} y={-736 * K_SIDE} width={2400 * K_SIDE} height={1792 * K_SIDE} />
      <g clipPath={`url(#${id}open)`}>
        <EdgeBubbles cx={FCX} cy={FCY} rx={FRX} ry={FRY} intensity={heat.bubbles ?? 0} t={t} angleFilter={(a) => Math.cos(a) > -0.3} />
      </g>
      <Spatter cx={FCX} cy={FCY} rx={FRX} ry={FRY} intensity={heat.spatter ?? 0} t={t} />
      <SteamWisps
        origins={[-0.9, -0.7, -0.48, 0.48, 0.7, 0.9].map((k) => ({x: FCX + k * FRX, y: FCY - 20 + Math.abs(k) * 6}))}
        height={300}
        intensity={heat.steam ?? 0}
        t={t}
        width={13}
      />
    </g>
  );
};

/** Top-down view. Local origin = bowl centre (= "the middle"). */
export const BowlTop: React.FC<{x: number; y: number; s: number; t: number; steam?: number; rot?: number; children?: React.ReactNode}> = ({
  x,
  y,
  s,
  t,
  steam = 0,
  rot = 0,
  children,
}) => {
  const id = useId().replace(/:/g, '');
  const {R} = TOP;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <filter id={`${id}sh`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={16} />
        </filter>
        <clipPath id={`${id}clip`}>
          <circle r={R} />
        </clipPath>
      </defs>
      <circle cx={14} cy={22} r={R} fill={C.navy950} opacity={0.5} filter={`url(#${id}sh)`} />
      <g transform={`rotate(${rot})`} clipPath={`url(#${id}clip)`}>
        <image href={staticFile('assets/higgsfield/H3_bowl_top_cut.png')} x={-1018.5 * K_TOP} y={-1023.5 * K_TOP} width={2048 * K_TOP} height={2048 * K_TOP} />
      </g>
      {children}
      <TopSteam R={R} t={t} intensity={steam} />
    </g>
  );
};

/** Steam seen from above: wisps rising off the hot rim (none from the middle). */
const TopSteam: React.FC<{R: number; t: number; intensity: number}> = ({R, t, intensity}) => (
  <SteamWisps
    origins={[-150, -120, -80, -35, 35, 80, 120, 150].map((deg) => {
      const a = (deg * Math.PI) / 180 - Math.PI / 2;
      return {x: Math.cos(a) * R * 0.97, y: Math.sin(a) * R * 0.97};
    })}
    height={260}
    intensity={intensity}
    t={t}
    width={12}
    seed={5}
  />
);
