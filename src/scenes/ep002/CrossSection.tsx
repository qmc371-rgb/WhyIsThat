// Side-view cross-section through the window at the hole's height. Cabin on the left, outside on
// the right. The two structural panes sit in a simplified fuselage wall, so the space between them
// is enclosed except for the breather hole in the inner structural pane. The outer pane has no hole.
// Coordinates are 1920×1080 units (CS in geom.ts); wrap in <g transform> to reuse at other sizes.
import React, {useId} from 'react';
import {C} from '../../brand/tokens';
import {CS, CS_SPACE, csMidX} from './geom';
import {AirDots} from './parts';

export type CSState = {
  tint?: number; // 0–1: cabin-air dots (cabin side + inter-pane space) turn warm gold: one pressure zone
  dots?: number; // air-dot opacity multiplier
  glow?: Partial<Record<'protective' | 'inner' | 'outer' | 'space' | 'cabinSide', number>>;
  dim?: Partial<Record<'protective' | 'inner' | 'outer', number>>;
  ghostOuter?: number; // 0–1: outer pane shown only as a dashed outline (static "if it fails" panel)
  outsideDensity?: number;
};

const H = 1080;

export const CrossSectionBase: React.FC<CSState> = ({tint = 0, dots = 1, glow = {}, dim = {}, ghostOuter = 0, outsideDensity = 0.3}) => {
  const id = useId().replace(/:/g, '');
  const ix = CS.inner;
  const ox = CS.outer;
  const pr = CS.prot;
  const g = (k: keyof NonNullable<CSState['glow']>) => glow[k] ?? 0;
  const paneRect = (x0: number, x1: number, y0: number, y1: number) => <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} rx={4} />;
  const holeTop = CS.holeY - CS.holeR;
  const holeBot = CS.holeY + CS.holeR;
  const cabinRects: Array<[number, number, number, number]> = [
    [30, 30, CS.wallX0, H - 30],
    [CS.wallX0 + 16, CS.top + 6, ix.x0, CS.bot - 6],
  ];
  const outsideRects: Array<[number, number, number, number]> = [
    [CS.wallX1, 30, 1890, H - 30],
    [ox.x1, CS.top + 6, CS.wallX1 - 16, CS.bot - 6],
  ];
  return (
    <g>
      <defs>
        <pattern id={`${id}h`} width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="22" height="22" fill={C.navy800} />
          <line x1="0" y1="0" x2="0" y2="22" stroke={C.navy700} strokeWidth="6" />
        </pattern>
      </defs>

      {/* shared cabin-air tint: the cabin side and the inter-pane space are one pressure zone */}
      {tint > 0 && (
        <g opacity={tint} fill="rgba(255,197,46,0.045)">
          <rect x={0} y={0} width={CS.wallX0} height={H} />
          <rect x={CS.wallX0} y={CS.top} width={ix.x0 - CS.wallX0} height={CS.bot - CS.top} />
          <rect x={CS_SPACE.x0} y={CS_SPACE.y0} width={CS_SPACE.x1 - CS_SPACE.x0} height={CS_SPACE.y1 - CS_SPACE.y0} />
        </g>
      )}

      {/* schematic air: same density in the cabin and the space, thinner outside */}
      <g opacity={dots}>
        <AirDots rects={cabinRects} spacing={46} seed={3} exclude={[[pr.x0 - 4, pr.y0, pr.x1 + 4, pr.y1]]} opacity={0.45 * (1 - tint)} />
        <AirDots rects={[[CS_SPACE.x0 + 4, CS_SPACE.y0 + 6, CS_SPACE.x1 - 4, CS_SPACE.y1 - 6]]} spacing={46} seed={5} opacity={0.45 * (1 - tint)} />
        {tint > 0 && (
          <g opacity={tint}>
            <AirDots rects={cabinRects} spacing={46} seed={3} exclude={[[pr.x0 - 4, pr.y0, pr.x1 + 4, pr.y1]]} color={C.goldLight} opacity={0.62} />
            <AirDots rects={[[CS_SPACE.x0 + 4, CS_SPACE.y0 + 6, CS_SPACE.x1 - 4, CS_SPACE.y1 - 6]]} spacing={46} seed={5} color={C.goldLight} opacity={0.62} />
          </g>
        )}
        <AirDots rects={outsideRects} spacing={46} seed={7} density={outsideDensity} />
      </g>

      {/* fuselage wall above and below the window (simplified): lining | structure | skin */}
      {[
        [0, CS.top],
        [CS.bot, H],
      ].map(([y0, y1], i) => (
        <g key={i}>
          <rect x={CS.wallX0} y={y0} width={CS.wallX1 - CS.wallX0} height={y1 - y0} fill={`url(#${id}h)`} />
          <rect x={CS.wallX0} y={y0} width={16} height={y1 - y0} fill={C.paperShade} />
          <rect x={CS.wallX1 - 16} y={y0} width={16} height={y1 - y0} fill={C.paper} />
          <line x1={CS.wallX0} x2={CS.wallX1} y1={i === 0 ? y1 : y0} y2={i === 0 ? y1 : y0} stroke={C.navy600} strokeWidth={4} />
        </g>
      ))}

      {/* space between the structural panes: highlight */}
      {g('space') > 0 && (
        <rect
          x={CS_SPACE.x0 + 3}
          y={CS_SPACE.y0 + 3}
          width={CS_SPACE.x1 - CS_SPACE.x0 - 6}
          height={CS_SPACE.y1 - CS_SPACE.y0 - 6}
          fill="rgba(255,197,46,0.10)"
          stroke={C.gold}
          strokeWidth={4}
          strokeDasharray="14 10"
          opacity={g('space')}
        />
      )}
      {g('cabinSide') > 0 && (
        <rect
          x={CS.wallX0 + 19}
          y={CS.top + 3}
          width={ix.x0 - CS.wallX0 - 22}
          height={CS.bot - CS.top - 6}
          fill="rgba(255,197,46,0.10)"
          stroke={C.gold}
          strokeWidth={4}
          strokeDasharray="14 10"
          opacity={g('cabinSide')}
        />
      )}

      {/* protective panel (cabin side, not a pressure barrier in this simplified picture) */}
      <g opacity={(dim.protective ?? 1) * 0.85}>
        <g fill="rgba(244,247,252,0.30)" stroke="rgba(255,255,255,0.75)" strokeWidth={2.5}>
          {paneRect(pr.x0, pr.x1, pr.y0, pr.y1)}
        </g>
        {g('protective') > 0 && <rect x={pr.x0 - 6} y={pr.y0 - 6} width={pr.x1 - pr.x0 + 12} height={pr.y1 - pr.y0 + 12} rx={8} fill="none" stroke={C.gold} strokeWidth={5} opacity={g('protective')} />}
      </g>

      {/* inner structural pane, with the breather hole as a real gap in this pane only */}
      <g opacity={dim.inner ?? 1}>
        <g fill="rgba(174,190,218,0.55)" stroke={C.white} strokeWidth={2.5}>
          {paneRect(ix.x0, ix.x1, CS.top - 14, holeTop)}
          {paneRect(ix.x0, ix.x1, holeBot, CS.bot + 14)}
        </g>
        {g('inner') > 0 && (
          <g fill="none" stroke={C.gold} strokeWidth={5} opacity={g('inner')}>
            <rect x={ix.x0 - 7} y={CS.top - 4} width={ix.x1 - ix.x0 + 14} height={CS.bot - CS.top + 8} rx={8} />
          </g>
        )}
      </g>

      {/* outer structural pane: no hole */}
      <g opacity={dim.outer ?? 1}>
        <g opacity={1 - ghostOuter} fill="rgba(174,190,218,0.62)" stroke={C.white} strokeWidth={2.5}>
          {paneRect(ox.x0, ox.x1, CS.top - 14, CS.bot + 14)}
        </g>
        {ghostOuter > 0 && (
          <rect x={ox.x0} y={CS.top - 14} width={ox.x1 - ox.x0} height={CS.bot - CS.top + 28} rx={4} fill="none" stroke={C.navy300} strokeWidth={3} strokeDasharray="10 8" opacity={ghostOuter} />
        )}
        {g('outer') > 0 && (
          <rect x={ox.x0 - 7} y={CS.top - 4} width={ox.x1 - ox.x0 + 14} height={CS.bot - CS.top + 8} rx={8} fill="none" stroke={C.gold} strokeWidth={5} opacity={g('outer')} />
        )}
      </g>

      {/* seals where the structural panes meet the wall */}
      {[ix, ox].map((p, i) =>
        [CS.top - 18, CS.bot + 4].map((y, j) => <rect key={`${i}${j}`} x={p.x0 - 5} y={y} width={p.x1 - p.x0 + 10} height={14} rx={6} fill={C.navy950} opacity={i === 1 ? 1 - ghostOuter * 0.7 : 1} />),
      )}
    </g>
  );
};

/** Handy points for overlays (all in CS units). */
export const CSP = {
  hole: [csMidX(CS.inner), CS.holeY] as [number, number],
  innerTop: [csMidX(CS.inner), CS.top + 30] as [number, number],
  outerTop: [csMidX(CS.outer), CS.top + 30] as [number, number],
  protTop: [csMidX(CS.prot), CS.prot.y0 + 30] as [number, number],
  spaceMid: [(CS_SPACE.x0 + CS_SPACE.x1) / 2, (CS.top + CS.bot) / 2] as [number, number],
  spaceBot: [(CS_SPACE.x0 + CS_SPACE.x1) / 2, CS.bot - 24] as [number, number],
  // airflow: cabin side → through the hole → into the space
  flowIn: `M700,690 C760,700 790,${CS.holeY} ${csMidX(CS.inner)},${CS.holeY} C905,${CS.holeY} 935,760 985,712`,
};
