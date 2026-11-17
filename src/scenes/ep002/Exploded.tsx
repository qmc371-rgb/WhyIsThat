// Exploded view of one common passenger-window design: protective panel (nearest the cabin),
// inner structural pane (with the breather hole), outer structural pane. Projected in code from
// real 3D outlines, so labels can anchor to exact points. The hole is drawn only through the
// inner structural pane's own thickness: never as a passage through the whole assembly.
import React, {useId} from 'react';
import {C} from '../../brand/tokens';
import {HOLE_LOCAL, LAYERS, LayerId, PANE, XView, circlePts, hull, layerZ, outline, project, toPath} from './geom';

export type LayerStyle = {opacity?: number; glow?: number};

const STYLE: Record<LayerId, {glass: string; rim: string; edge: string}> = {
  protective: {glass: 'rgba(244,247,252,0.10)', rim: 'rgba(217,226,239,0.55)', edge: 'rgba(255,255,255,0.75)'},
  inner: {glass: 'rgba(174,190,218,0.16)', rim: 'rgba(120,145,189,0.85)', edge: 'rgba(255,255,255,0.92)'},
  outer: {glass: 'rgba(174,190,218,0.22)', rim: 'rgba(74,111,168,0.92)', edge: 'rgba(255,255,255,0.95)'},
};

const OUT = outline();

export const ExplodedWindow: React.FC<{
  v: XView;
  layer?: Partial<Record<LayerId, LayerStyle>>;
  holeOpacity?: number;
  sky?: number; // 0–1: sky picture behind the glass (continuity from the W2 close-up)
}> = ({v, layer = {}, holeOpacity = 1, sky = 0}) => {
  const id = useId().replace(/:/g, '');
  // farthest first: with phi ≥ 0 the outer pane is farthest from the viewer
  const order = [...LAYERS].sort((a, b) => b.k - a.k);
  const outerL = LAYERS[2];
  const skyFace = OUT.map(([x, y]) => project(v, x, y, layerZ(v, outerL.k) + outerL.t / 2));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.navy700} />
          <stop offset="0.55" stopColor={C.navy500} />
          <stop offset="0.78" stopColor={C.goldLight} />
          <stop offset="1" stopColor={C.navy600} />
        </linearGradient>
      </defs>
      {sky > 0 && <path d={toPath(skyFace)} fill={`url(#${id}sky)`} opacity={sky} />}
      {order.map((L) => {
        const st = layer[L.id] ?? {};
        const op = st.opacity ?? 1;
        const glow = st.glow ?? 0;
        const zc = layerZ(v, L.k);
        const front = OUT.map(([x, y]) => project(v, x, y, zc - L.t / 2));
        const back = OUT.map(([x, y]) => project(v, x, y, zc + L.t / 2));
        const sil = hull([...front, ...back]);
        const fp = toPath(front);
        const s = STYLE[L.id];
        // two soft reflection streaks inside the face
        const streak = (a: [number, number], b: [number, number]) => {
          const A = project(v, a[0] * PANE.a, a[1] * PANE.b, zc - L.t / 2);
          const B = project(v, b[0] * PANE.a, b[1] * PANE.b, zc - L.t / 2);
          return <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="rgba(255,255,255,0.16)" strokeWidth={13 * v.scale} strokeLinecap="round" />;
        };
        let hole: React.ReactNode = null;
        if (L.id === 'inner' && holeOpacity > 0) {
          const hf = circlePts(HOLE_LOCAL.x, HOLE_LOCAL.y, HOLE_LOCAL.r).map(([x, y]) => project(v, x, y, zc - L.t / 2));
          const hb = circlePts(HOLE_LOCAL.x, HOLE_LOCAL.y, HOLE_LOCAL.r).map(([x, y]) => project(v, x, y, zc + L.t / 2));
          hole = (
            <g opacity={holeOpacity}>
              <path d={toPath(hull([...hf, ...hb]))} fill="rgba(6,15,34,0.6)" />
              <path d={toPath(hf)} fill="none" stroke={C.white} strokeWidth={2.4 * v.scale} />
            </g>
          );
        }
        return (
          <g key={L.id} opacity={op}>
            <path d={`${toPath(sil)} ${fp}`} fillRule="evenodd" fill={s.rim} />
            <path d={fp} fill={s.glass} />
            {streak([-0.62, -0.05], [-0.08, -0.7])}
            {streak([-0.5, 0.42], [0.18, -0.38])}
            {hole}
            {glow > 0 && <path d={toPath(sil)} fill="none" stroke={C.gold} strokeWidth={14} opacity={glow * 0.35} strokeLinejoin="round" />}
            <path d={fp} fill="none" stroke={glow > 0.5 ? C.gold : s.edge} strokeWidth={3} strokeLinejoin="round" />
          </g>
        );
      })}
    </g>
  );
};
