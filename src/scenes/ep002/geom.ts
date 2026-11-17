// EP002 geometry: art anchors (measured on the Higgsfield plates), the hole's place on the
// pane, the exploded-view projection and the cross-section layout. One source of truth, so
// the window close-up, the exploded view and the cross-section always agree.

export type Art = {file: string; w: number; h: number};

export const W1: Art & {win: {x: number; y: number; w: number; h: number}} = {
  file: 'assets/higgsfield/ep002/W1_passenger_window_seat_v1.jpg',
  w: 2752,
  h: 1536,
  win: {x: 1381, y: 682, w: 502, h: 705}, // window glass the passenger looks at (measured)
};

export const W2: Art & {glass: {x: number; y: number; hw: number; hh: number}} = {
  file: 'assets/higgsfield/ep002/W2_window_closeup_v1.jpg',
  w: 5504,
  h: 3072,
  glass: {x: 2752, y: 1606, hw: 868, hh: 984}, // clean glass, no marks (checked at full size)
};

export const W3: Art & {win: {x: number; y: number}} = {
  file: 'assets/higgsfield/ep002/W3_airliner_climb_v1.jpg',
  w: 2752,
  h: 1536,
  win: {x: 1220, y: 687}, // one ordinary cabin window in the row (21 detected)
};

/** Where the breather hole sits on the inner structural pane, as a fraction of the half-width
 *  (u, + = right) and half-height (v, + = down). Lower right of centre, on plain sky in W2. */
export const HOLE_REL = {u: 0.24, v: 0.86};
export const W2_HOLE = {x: W2.glass.x + HOLE_REL.u * W2.glass.hw, y: W2.glass.y + HOLE_REL.v * W2.glass.hh};

/* ------------------------------ exploded view ------------------------------ */
export const PANE = {a: 150, b: 170, rc: 110}; // half-width, half-height, corner radius (local units)
export type LayerId = 'protective' | 'inner' | 'outer';
export const LAYERS: Array<{id: LayerId; k: number; t: number}> = [
  {id: 'protective', k: -1, t: 7}, // k = slot along the cabin→outside axis
  {id: 'inner', k: 0, t: 15},
  {id: 'outer', k: 1, t: 22},
];
export const LAYER_NAME: Record<LayerId, string> = {
  protective: 'PROTECTIVE PANEL',
  inner: 'INNER STRUCTURAL PANE',
  outer: 'OUTER STRUCTURAL PANE',
};
export const GAP = 120; // local units between layers at sep = 1
const CAM_D = 1500; // perspective camera distance (local units)

/** phi: turn about the vertical axis in degrees (0 = straight on, 90 = edge-on, cabin left).
 *  sep: how far apart the layers are (0 = together). */
export type XView = {cx: number; cy: number; scale: number; phi: number; sep: number};

export const layerZ = (v: XView, k: number) => k * GAP * v.sep;

export const project = (v: XView, x: number, y: number, z: number): [number, number] => {
  const ph = (v.phi * Math.PI) / 180;
  const xr = x * Math.cos(ph) + z * Math.sin(ph);
  const zr = -x * Math.sin(ph) + z * Math.cos(ph);
  const p = CAM_D / (CAM_D + zr);
  return [v.cx + xr * p * v.scale, v.cy + y * p * v.scale];
};

/** Rounded-rectangle outline in local units, clockwise from the top. */
export const outline = (a = PANE.a, b = PANE.b, rc = PANE.rc, n = 14): Array<[number, number]> => {
  const pts: Array<[number, number]> = [];
  const corners: Array<[number, number, number, number]> = [
    [a - rc, -b + rc, -90, 0],
    [a - rc, b - rc, 0, 90],
    [-a + rc, b - rc, 90, 180],
    [-a + rc, -b + rc, 180, 270],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= n; i++) {
      const t = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
      pts.push([cx + rc * Math.cos(t), cy + rc * Math.sin(t)]);
    }
  }
  return pts;
};

export const circlePts = (cx: number, cy: number, r: number, n = 24): Array<[number, number]> =>
  Array.from({length: n}, (_, i) => [cx + r * Math.cos((i / n) * Math.PI * 2), cy + r * Math.sin((i / n) * Math.PI * 2)]);

export const toPath = (pts: Array<[number, number]>) => `M${pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' L')} Z`;

/** Convex hull (monotone chain) — the silhouette of an extruded convex face. */
export const hull = (pts: Array<[number, number]>): Array<[number, number]> => {
  const p = [...pts].sort((A, B) => A[0] - B[0] || A[1] - B[1]);
  const cross = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: Array<[number, number]> = [];
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop();
    lower.push(q);
  }
  const upper: Array<[number, number]> = [];
  for (const q of [...p].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop();
    upper.push(q);
  }
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};

export const HOLE_LOCAL = {x: HOLE_REL.u * PANE.a, y: HOLE_REL.v * PANE.b, r: 9};

/** Screen anchor on a layer: its top or bottom centre, or the hole. */
export const anchor = (v: XView, id: LayerId | 'hole', where: 'top' | 'bottom' | 'centre' = 'top'): [number, number] => {
  if (id === 'hole') {
    const L = LAYERS[1];
    return project(v, HOLE_LOCAL.x, HOLE_LOCAL.y, layerZ(v, L.k) - L.t / 2);
  }
  const L = LAYERS.find((l) => l.id === id)!;
  const y = where === 'top' ? -PANE.b : where === 'bottom' ? PANE.b : 0;
  return project(v, 0, y, layerZ(v, L.k) - L.t / 2);
};

/* ------------------------------ cross-section ------------------------------ */
// Side view through the window at the hole's height, cabin on the left. 1920×1080 units.
export const CS = {
  wallX0: 600, // cabin lining
  wallX1: 1150, // outer skin
  top: 250, // window opening
  bot: 830,
  prot: {x0: 634, x1: 646, y0: 264, y1: 816}, // protective panel (gaps top/bottom)
  inner: {x0: 834, x1: 862},
  outer: {x0: 1062, x1: 1098},
  holeY: 0, // set below
  holeR: 9,
};
CS.holeY = Math.round((CS.top + CS.bot) / 2 + HOLE_REL.v * ((CS.bot - CS.top) / 2)); // 789
export const CS_SPACE = {x0: CS.inner.x1, x1: CS.outer.x0, y0: CS.top, y1: CS.bot};
export const csMidX = (p: {x0: number; x1: number}) => (p.x0 + p.x1) / 2;
