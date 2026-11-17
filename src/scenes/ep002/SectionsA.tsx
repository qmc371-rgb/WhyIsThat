// EP002 sections A–E: cold open, the layers, the reframe, pressure, the cross-section.
// Every beat is anchored to the final narration with cue(); fallbacks are the real times.
import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {cue, line} from './timing';
import {clamp01, mix, pop, ramp} from '../../lib/anim';
import {Appear, GridBg, Headline, useT} from '../../kit/kit';
import {Shot} from '../../kit/shots';
import {TitleCard} from '../../components/TitleCard';
import {CS, LAYER_NAME, LayerId, W1, W2, W2_HOLE, W3, XView, anchor, project, layerZ, LAYERS, PANE} from './geom';
import {ExplodedWindow, LayerStyle} from './Exploded';
import {CrossSectionBase, CSP} from './CrossSection';
import {FUS, FUS_WIN, Fuselage, HouseWindow} from './Illustrations';
import {
  AirDots,
  ArtCam,
  Cam,
  Card,
  CommonDesignTag,
  DiagramTag,
  FlowPath,
  ForceArrow,
  GoldRing,
  HoleMark,
  IconWrench,
  Legend,
  Pin,
  artScale,
  artToScreen,
  camAt,
} from './parts';

/* ------------------------------ shared views ------------------------------ */
export const V_FRONT: XView = {cx: 960, cy: 540, scale: 2.197, phi: 0, sep: 0}; // = W2 glass at z 1.08
export const V_34: XView = {cx: 960, cy: 575, scale: 1.35, phi: 50, sep: 2.3};
export const V_EDGE: XView = {cx: 848, cy: 540, scale: 1.706, phi: 90, sep: 1.075}; // = cross-section panes
export const mixView = (a: XView, b: XView, p: number): XView => ({
  cx: mix(a.cx, b.cx, p),
  cy: mix(a.cy, b.cy, p),
  scale: mix(a.scale, b.scale, p),
  phi: mix(a.phi, b.phi, p),
  sep: mix(a.sep, b.sep, p),
});
const GLASS: Cam = {x: W2.glass.x, y: W2.glass.y, z: 1.0};
const HOLE_CAM = (z: number): Cam => ({x: W2_HOLE.x, y: W2_HOLE.y, z});

/** W2 close-up with the code-drawn hole; `ring` = [from, until]. Children get the hole's screen point. */
export const W2Shot: React.FC<{cam: Cam; ring?: [number, number]; glintAt?: number; children?: (hole: [number, number], s: number) => React.ReactNode}> = ({cam, ring, glintAt, children}) => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const s = artScale(W2, cam, width, height);
  const hole = artToScreen(W2, cam, width, height, W2_HOLE.x, W2_HOLE.y);
  const g = glintAt !== undefined ? clamp01(1 - Math.abs(t - glintAt - 0.35) / 0.4) : 0;
  return (
    <AbsoluteFill>
      <ArtCam art={W2} cam={cam}>
        <HoleMark x={W2_HOLE.x} y={W2_HOLE.y} r={13} />
        {ring && <GoldRing x={W2_HOLE.x} y={W2_HOLE.y} r={40 / s} width={5 / s} at={ring[0]} until={ring[1]} />}
      </ArtCam>
      {g > 0 && (
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <path
            d={`M${hole[0]},${hole[1] - 30 * g} L${hole[0] + 6 * g},${hole[1] - 6 * g} L${hole[0] + 30 * g},${hole[1]} L${hole[0] + 6 * g},${hole[1] + 6 * g} L${hole[0]},${hole[1] + 30 * g} L${hole[0] - 6 * g},${hole[1] + 6 * g} L${hole[0] - 30 * g},${hole[1]} L${hole[0] - 6 * g},${hole[1] - 6 * g} Z`}
            fill={C.goldLight}
            opacity={g}
          />
        </svg>
      )}
      {children?.(hole, s)}
    </AbsoluteFill>
  );
};

/** Region word (CABIN / OUTSIDE …) */
const Region: React.FC<{text: string; x: number; y: number; at: number; until?: number; size?: number; color?: string}> = ({text, x, y, at, until, size = 60, color = C.white}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}>
    <Appear at={at} until={until} dir="scale">
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: size, color, letterSpacing: '0.04em', textShadow: '0 4px 18px rgba(0,0,0,0.5)'}}>{text}</div>
    </Appear>
  </div>
);

/** Orientation arrows used with the layer diagrams. */
export const Orientation: React.FC<{at: number; y?: number; until?: number}> = ({at, y = 470, until}) => (
  <>
    <div style={{position: 'absolute', left: 60, top: y, transform: 'translateY(-50%)'}}>
      <Appear at={at} until={until} dir="right">
        <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.navy200}}>← CABIN</div>
      </Appear>
    </div>
    <div style={{position: 'absolute', right: 60, top: y, transform: 'translateY(-50%)'}}>
      <Appear at={at} until={until} dir="left">
        <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: C.navy200}}>OUTSIDE →</div>
      </Appear>
    </div>
  </>
);

/** The three layer labels for a given (settled) exploded view. */
export const LayerLabels: React.FC<{v: XView; at: Partial<Record<LayerId, number>>; until?: number; dim?: Partial<Record<LayerId, number>>; k?: Partial<Record<LayerId, string>>}> = ({v, at, until, dim = {}, k = {}}) => {
  const pos: Record<LayerId, {label: [number, number]; side: 'left' | 'right' | 'center'}> = {
    protective: {label: [anchor(v, 'protective')[0] + 10, 205], side: 'left'},
    inner: {label: [anchor(v, 'inner')[0], 110], side: 'center'},
    outer: {label: [anchor(v, 'outer')[0] - 10, 205], side: 'right'},
  };
  return (
    <>
      {(Object.keys(pos) as LayerId[]).map((id) =>
        at[id] === undefined ? null : (
          <Pin key={id} target={anchor(v, id)} label={pos[id].label} side={pos[id].side} k={k[id]} v={LAYER_NAME[id]} at={at[id]!} until={until} size={28} tone={id === 'protective' ? 'white' : 'gold'} dim={dim[id] ?? 1} />
        ),
      )}
    </>
  );
};

/* ================================ A · COLD OPEN ================================ */
export const coldOpenCues = () => {
  const admire = cue('admire the clouds', 5.05);
  const strange = cue('notice something strange', 6.4) + 0.43;
  const tiny = cue('a tiny hole in the window', 8.87) + 0.12;
  const ground = cue('On the ground', 10.9);
  const fixing = cue('usually means something', 13.2);
  const onAir = cue('On an airplane', 15.73);
  const question = cue('interesting question', 18.27);
  const deliberately = cue('deliberately put', 21.08);
  const helps = cue('helps keep cabin', 23.48);
  const insideEnd = cue('pressure inside', 24.45, {edge: 'end'});
  const b1 = cue('something you probably', 28.91) - 0.3;
  return {
    admire,
    strange,
    tiny,
    ground,
    fixing,
    onAir,
    question,
    deliberately,
    helps,
    insideEnd,
    a2: admire + 0.55,
    a4: ground - 0.15,
    a5: onAir - 0.15,
    title: insideEnd - 0.1,
    words: [insideEnd + 0.2, insideEnd + 0.45, insideEnd + 0.7] as [number, number, number],
    b1,
  };
};

const W1Push: React.FC<{T: ReturnType<typeof coldOpenCues>}> = ({T}) => {
  const t = useT();
  const p = Easing.in(Easing.cubic)(clamp01(t / (T.a2 + 0.1)));
  const cam: Cam = {x: mix(1376, W1.win.x, p), y: mix(768, W1.win.y - 20, p), z: 1 + 0.82 * p};
  return <ArtCam art={W1} cam={cam} />;
};

export const ColdOpen: React.FC = () => {
  const T = coldOpenCues();
  const t = useT();
  const camA = camAt(t, [
    [T.a2 - 0.45, {...GLASS}],
    [T.strange, {x: 2800, y: 1900, z: 1.1}],
    [T.tiny - 0.45, {x: 2860, y: 2100, z: 1.25}],
    [T.tiny + 0.5, HOLE_CAM(2.5)],
  ]);
  const camB = camAt(t, [
    [T.a5 - 0.3, HOLE_CAM(2.5)],
    [T.question, HOLE_CAM(2.3)],
    [T.insideEnd, {x: 2850, y: 2150, z: 1.55}],
  ]);
  return (
    <AbsoluteFill>
      <Shot from={0} to={T.a2}>
        <W1Push T={T} />
      </Shot>
      <Shot from={T.a2} to={T.a4} fadeIn={0.45}>
        <W2Shot cam={camA} ring={[T.tiny, T.a4]} glintAt={T.strange}>
          {(hole) => <Pin target={hole} label={[hole[0] + 230, hole[1] - 170]} k="SPOTTED" v="A TINY HOLE" at={T.tiny + 0.15} size={34} />}
        </W2Shot>
      </Shot>
      <Shot from={T.a4} to={T.a5} fadeIn={0.3}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 80% at 40% 50%, ${C.navy800} 0%, ${C.navy900} 70%)`}}>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <HouseWindow x={680} y={540} s={1.05} />
          </svg>
          <Pin label={[1090, 330]} k="ON THE GROUND" v="A HOLE IN YOUR WINDOW…" at={T.ground + 0.35} size={36} tone="white" />
          <div style={{position: 'absolute', left: 1120, top: 470}}>
            <Appear at={T.fixing - 0.25} dir="scale">
              <IconWrench size={140} />
            </Appear>
          </div>
          <Pin label={[1090, 720]} k="USUALLY MEANS" v="SOMETHING NEEDS FIXING" at={T.fixing} size={36} mark="cross" tone="white" />
        </AbsoluteFill>
      </Shot>
      <Shot from={T.a5} to={T.title} fadeIn={0.3}>
        <W2Shot cam={camB} ring={[T.a5 - 0.3, T.title + 1]}>
          {(hole) => {
            const q = pop(Math.round(t * 30), 30, T.question, 9, 0.7);
            return (
              <>
                {t >= T.question && (
                  <div
                    style={{
                      position: 'absolute',
                      left: hole[0] + 150,
                      top: hole[1] - 130,
                      transform: `translate(-50%,-50%) scale(${0.3 + 0.7 * q}) rotate(${(1 - q) * -20}deg)`,
                      opacity: Math.min(1, q * 1.5),
                      width: 120,
                      height: 120,
                      borderRadius: 60,
                      background: C.navy950,
                      border: `5px solid ${C.gold}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: FONT.display,
                      fontWeight: 700,
                      fontSize: 88,
                      color: C.gold,
                      lineHeight: 1,
                      paddingBottom: 6,
                    }}
                  >
                    ?
                  </div>
                )}
                <Pin label={[80, 160]} k="ON AN AIRPLANE" v="A MUCH MORE INTERESTING QUESTION" at={T.onAir + 0.25} size={32} tone="white" />
                <Pin label={[80, 300]} k="WHY WOULD ENGINEERS" v="DELIBERATELY PUT A HOLE…" at={T.deliberately} size={32} />
                <Pin label={[80, 440]} k="…IN SOMETHING THAT" v="HELPS KEEP CABIN PRESSURE INSIDE?" at={T.helps} size={32} />
              </>
            );
          }}
        </W2Shot>
      </Shot>
      <Shot from={T.title} to={1e9} fadeIn={0.3}>
        <TitleCard wordTimes={T.words} taglineAt={T.words[2] + 0.9} tagline="Everyday things. Surprising explanations." />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ B · THE LAYERS ================================ */
export const layersCues = () => {
  const b1 = cue('something you probably', 28.91) - 0.3;
  const b2 = cue('You aren’t looking', 31.88) - 0.25;
  const onePane = cue('just one pane', 33.1);
  const common = cue('common passenger', 34.73);
  const prot = cue('protective panel nearest', 37.44);
  const two = cue('two structural panes', 40.06);
  const tinyHole = cue('The tiny hole is', 41.98) + 0.26;
  const middle = cue('middle layer', 45.08);
  const notThrough = cue('go all the way', 49.44) - 0.35;
  const outside = cue('window assembly to the', 50.82) + 0.35;
  return {b1, b2, onePane, common, prot, two, tinyHole, middle, notThrough, outside, end: line('L12').start - 0.35};
};

export const Layers: React.FC = () => {
  const T = layersCues();
  const t = useT();
  const camB1 = camAt(t, [
    [T.b1 - 0.35, GLASS],
    [T.b2, {...GLASS, z: 1.08}],
  ]);
  const turn = ramp(t, T.onePane - 0.1, T.onePane + 1.3, Easing.inOut(Easing.cubic));
  const v = mixView(V_FRONT, V_34, turn);
  const holeFocus = ramp(t, T.tinyHole - 0.2, T.tinyHole + 0.3);
  const outerFocus = ramp(t, T.outside - 0.2, T.outside + 0.3);
  const layer: Partial<Record<LayerId, LayerStyle>> = {
    protective: {opacity: 1 - 0.6 * holeFocus},
    inner: {glow: holeFocus * (1 - 0.6 * outerFocus)},
    outer: {opacity: 1 - 0.6 * holeFocus * (1 - outerFocus), glow: outerFocus},
  };
  const hole = anchor(V_34, 'hole');
  const outerMid = project(V_34, PANE.a * 0.92, 40, layerZ(V_34, LAYERS[2].k) - LAYERS[2].t / 2);
  return (
    <AbsoluteFill>
      <Shot from={0} to={T.b2}>
        <W2Shot cam={camB1} />
      </Shot>
      <Shot from={T.b2} to={1e9} fadeIn={0.5}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ExplodedWindow v={v} layer={layer} sky={1 - turn} />
          <GoldRing x={hole[0]} y={hole[1]} r={30} at={T.tinyHole} />
        </svg>
        <CommonDesignTag at={T.common} />
        <Orientation at={T.common + 0.5} />
        <LayerLabels v={V_34} at={{protective: T.prot, inner: T.two, outer: T.two + 0.35}} k={{protective: 'NEAREST YOU'}} />
        <Pin target={hole} label={[1240, 955]} k="THE TINY HOLE" v="IN THE INNER STRUCTURAL PANE" at={T.tinyHole + 0.3} size={28} />
        <Pin label={[60, 955]} k="THE MIDDLE LAYER" v="IN OUR ILLUSTRATION" at={T.middle} until={T.notThrough - 0.3} size={28} vAlign="center" />
        <Pin label={[60, 955]} k="IT DOESN’T GO" v="ALL THE WAY THROUGH" at={T.notThrough} size={28} mark="cross" tone="white" />
        <Pin target={outerMid} label={[1420, 680]} k="OUTER STRUCTURAL PANE" v="NO HOLE" at={T.outside} size={30} mark="check" />
        <DiagramTag at={T.b2 + 1.5} y={1062} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ C · REFRAME ================================ */
export const Reframe: React.FC = () => {
  const l12 = line('L12').start;
  const notAsking = cue('We aren’t asking', 55.42);
  const asking = cue('We’re asking why', 60.03);
  const opening = cue('opening while another', 62.08);
  const sealed = cue('another remains sealed', 62.88);
  const inner = {x0: 1406, x1: 1434};
  const outer = {x0: 1626, x1: 1662};
  const top = 300;
  const bot = 860;
  const hy = 790;
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 70, display: 'flex', justifyContent: 'center'}}>
        <Appear at={l12} dir="up">
          <Headline text="That changes the mystery." size={76} align="center" />
        </Appear>
      </div>
      <div style={{position: 'absolute', left: 100, top: 270}}>
        <Card at={notAsking} mark="cross" tone="white" k="WE AREN’T ASKING" text="why someone made a hole straight through the side of an airplane" width={1050} size={46} />
      </div>
      <div style={{position: 'absolute', left: 100, top: 590}}>
        <Card at={asking} mark="check" k="WE’RE ASKING" text="why one layer needs an opening while another remains sealed" width={1050} size={46} />
      </div>
      <AbsoluteFill style={{opacity: ramp(useT(), asking, asking + 0.5)}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <g fill="rgba(174,190,218,0.55)" stroke={C.white} strokeWidth={2.5}>
            <rect x={inner.x0} y={top} width={inner.x1 - inner.x0} height={hy - 9 - top} rx={4} />
            <rect x={inner.x0} y={hy + 9} width={inner.x1 - inner.x0} height={bot - hy - 9} rx={4} />
            <rect x={outer.x0} y={top} width={outer.x1 - outer.x0} height={bot - top} rx={4} fill="rgba(174,190,218,0.62)" />
          </g>
          <GoldRing x={(inner.x0 + inner.x1) / 2} y={hy} r={30} at={opening} />
        </svg>
        <Pin target={[(inner.x0 + inner.x1) / 2, hy]} label={[1420, 960]} side="center" v="OPENING" at={opening + 0.15} size={30} />
        <Pin target={[(outer.x0 + outer.x1) / 2, top + 30]} label={[1644, 215]} side="center" v="SEALED" mark="check" at={sealed} size={30} />
        <DiagramTag x={1240} y={1062} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================ D · PRESSURE ================================ */
export const pressureCues = () => ({
  start: line('L15').start - 0.35,
  pressure: cue('about pressure', 67.36) + 0.28,
  thinner: cue('the air outside becomes', 70.31),
  d2: cue('The cabin is pressurized', 72.67) - 0.3,
  pressurized: cue('is pressurized', 73.28) + 0.2,
  higher: cue('is higher than', 75.74) + 0.17,
  lower: cue('the pressure outside', 76.55) + 0.22,
  pushes: cue('pushes outward', 79.12),
  end: line('L19').start - 0.35,
});

const ThinnerInset: React.FC<{at: number}> = ({at}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.5);
  if (o <= 0) return null;
  const box = (y: number, density: number, label: string, seed: number) => (
    <g>
      <rect x={0} y={y} width={440} height={190} rx={18} fill="rgba(6,15,34,0.55)" stroke={C.navy400} strokeWidth={3} />
      <AirDots rects={[[10, y + 10, 430, y + 180]]} spacing={30} seed={seed} density={density} opacity={0.75} />
      <text x={20} y={y + 36} fill={C.navy200} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.14em'}}>
        {label}
      </text>
    </g>
  );
  return (
    <div style={{position: 'absolute', left: 1330, top: 250, width: 520, opacity: o, padding: 30, background: 'rgba(6,15,34,0.82)', borderRadius: 24, border: `3px solid ${C.gold}`}}>
      <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.16em', color: C.gold}}>AS AN AIRPLANE CLIMBS</div>
      <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: C.white, marginTop: 6, marginBottom: 18}}>the air outside becomes thinner</div>
      <svg width={460} height={430} viewBox="0 0 440 410" style={{display: 'block'}}>
        {box(0, 0.22, 'HIGHER UP', 41)}
        {box(220, 1, 'LOWER DOWN', 43)}
      </svg>
      <div style={{marginTop: 16}}>
        <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.2em', color: C.navy950, background: C.gold, padding: '6px 12px', borderRadius: 8}}>SCHEMATIC</span>
      </div>
    </div>
  );
};

export const Pressure: React.FC = () => {
  const T = pressureCues();
  const t = useT();
  const cam = camAt(t, [
    [T.start - 0.35, {x: 1376, y: 768, z: 1.0}],
    [T.d2, {x: 1560, y: 720, z: 1.14}],
  ]);
  const [lx, ly] = FUS_WIN.left;
  const [rx, ry] = FUS_WIN.right;
  return (
    <AbsoluteFill>
      <Shot from={0} to={T.d2}>
        <ArtCam art={W3} cam={cam} />
        <Pin label={[1590, 130]} side="center" v="PRESSURE" at={T.pressure} size={46} />
        <ThinnerInset at={T.thinner} />
      </Shot>
      <Shot from={T.d2} to={1e9} fadeIn={0.4}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <Fuselage winGlow={ramp(t, T.pushes - 0.2, T.pushes)} />
          <ForceArrow from={[lx + 160, ly]} to={[lx + 26, ly]} at={T.pushes} />
          <ForceArrow from={[rx - 160, ry]} to={[rx - 26, ry]} at={T.pushes + 0.12} />
        </svg>
        <Pin label={[1150, 250]} k="THE CABIN IS" v="PRESSURIZED" at={T.pressurized} size={34} />
        <Pin target={[FUS.cx + 120, FUS.cy - 170]} label={[1150, 400]} k="INSIDE" v="HIGHER PRESSURE" at={T.higher} size={34} />
        <Pin target={[1130, 800]} label={[1150, 560]} k="OUTSIDE" v="LOWER PRESSURE" at={T.lower} size={34} tone="white" />
        <Pin target={[rx - 20, ry + 20]} label={[1150, 730]} k="THAT DIFFERENCE" v="PUSHES OUTWARD ON THE WINDOWS" at={T.pushes + 0.3} size={34} />
        <Legend at={T.pushes} flow={false} />
        <DiagramTag schematic />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ E · CROSS-SECTION ================================ */
export const sectionCues = () => {
  const apart = cue('pulled apart', 84.15);
  return {
    apart,
    cabin: cue('There’s the cabin', 85.54) + 0.5,
    inner: cue('There’s the inner', 87.14) + 0.55,
    space: cue('Then a small space', 89.53) + 0.45,
    outer: cue('Then the outer', 91.36) + 0.5,
    ring: cue('The tiny opening connects', 93.74) + 0.56,
    connects: cue('opening connects', 94.3) + 0.48,
    between: cue('space between the structural', 97.38),
    breather: cue('called a breather hole', 100.27) + 0.42,
    bleed: cue('a bleed hole', 101.69) + 0.12,
    changes: cue('As cabin pressure changes', 102.98) + 1.09,
    adjusts: cue('allows pressure', 105.41),
    innerNormally: cue('inner structural pane normally', 109.12),
    same: cue('roughly the same pressure', 111.27),
    outerCarries: cue('The outer pane carries', 114.35),
    carries: cue('pane carries the normal', 114.95) + 0.3,
    outsideAir: cue('the outside air', 118.83),
    little: cue('this little opening', 120.58) + 0.31,
    everyday: cue('which layer does', 122.71),
  };
};

/** Cross-section labels shared by E, F8/F9 and G. */
export const CSLabels: React.FC<{at: {cabin?: number; prot?: number; inner?: number; space?: number; outer?: number; outside?: number}; until?: number}> = ({at, until}) => (
  <>
    {at.cabin !== undefined && <Region text="CABIN" x={300} y={470} at={at.cabin} until={until} />}
    {at.outside !== undefined && <Region text="OUTSIDE" x={1560} y={600} at={at.outside} until={until} color={C.navy200} />}
    {at.prot !== undefined && <Pin target={[640, CS.prot.y0 + 40]} label={[606, 170]} side="left" v="PROTECTIVE PANEL" at={at.prot} until={until} size={24} tone="white" dim={0.85} />}
    {at.inner !== undefined && <Pin target={[848, CS.top + 40]} label={[848, 92]} side="center" v="INNER STRUCTURAL PANE" at={at.inner} until={until} size={28} />}
    {at.outer !== undefined && <Pin target={[1080, CS.top + 40]} label={[1110, 175]} side="right" v="OUTER STRUCTURAL PANE" at={at.outer} until={until} size={28} />}
    {at.space !== undefined && <Pin target={[962, 560]} label={[962, 965]} side="center" k="A SMALL SPACE" v="BETWEEN THE STRUCTURAL PANES" at={at.space} until={until} size={26} />}
  </>
);

export const CrossSectionScene: React.FC = () => {
  const T = sectionCues();
  const t = useT();
  const turn = ramp(t, T.apart, T.apart + 1.0, Easing.inOut(Easing.cubic));
  const v = mixView(V_34, V_EDGE, turn);
  const csIn = ramp(t, T.apart + 0.7, T.apart + 1.2);
  const tint = ramp(t, T.connects + 0.4, T.connects + 1.6);
  const innerGlow = Math.max(ramp(t, T.inner - 0.1, T.inner + 0.2) * (1 - ramp(t, T.space - 0.1, T.space + 0.2)), ramp(t, T.innerNormally, T.innerNormally + 0.3) * (1 - ramp(t, T.outerCarries, T.outerCarries + 0.3)));
  const outerGlow = Math.max(ramp(t, T.outer - 0.1, T.outer + 0.2) * (1 - ramp(t, T.ring - 0.3, T.ring)), ramp(t, T.outerCarries + 0.2, T.outerCarries + 0.5));
  const spaceGlow = ramp(t, T.space - 0.1, T.space + 0.2) * (1 - ramp(t, T.outer - 0.1, T.outer + 0.2));
  const fy = (k: number) => 380 + k * 160;
  return (
    <AbsoluteFill>
      <GridBg />
      {csIn < 1 && (
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0, opacity: 1 - csIn}}>
          <ExplodedWindow v={v} />
        </svg>
      )}
      <AbsoluteFill style={{opacity: csIn}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <CrossSectionBase tint={tint} glow={{inner: innerGlow, outer: outerGlow, space: spaceGlow}} />
          <GoldRing x={CSP.hole[0]} y={CSP.hole[1]} r={34} at={T.ring} until={T.innerNormally - 0.4} />
          <GoldRing x={CSP.hole[0]} y={CSP.hole[1]} r={34} at={T.little} />
          <FlowPath d={CSP.flowIn} at={T.connects} until={T.changes - 0.15} dir={1} />
          <FlowPath d={CSP.flowIn} at={T.changes} until={T.innerNormally - 0.4} dir={0} heads="both" />
          {/* inner pane: roughly the same pressure on both sides → equal, opposite forces */}
          {[0, 1].map((k) => (
            <g key={k}>
              <ForceArrow from={[740, fy(k)]} to={[828, fy(k)]} at={T.same + k * 0.1} until={T.outerCarries - 0.1} />
              <ForceArrow from={[956, fy(k)]} to={[868, fy(k)]} at={T.same + k * 0.1} until={T.outerCarries - 0.1} />
            </g>
          ))}
          {/* outer pane carries the normal pressure difference: large outward, smaller inward */}
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <ForceArrow from={[952, 340 + k * 170]} to={[1056, 340 + k * 170]} at={T.carries + k * 0.1} w={16} head={38} />
              <ForceArrow from={[1150, 340 + k * 170]} to={[1104, 340 + k * 170]} at={T.outsideAir + k * 0.08} w={9} head={20} />
            </g>
          ))}
        </svg>
        <CSLabels at={{cabin: T.cabin, prot: T.cabin + 0.5, inner: T.inner, space: T.space, outer: T.outer, outside: T.outer + 1.0}} />
        <Pin label={[60, 905]} vAlign="center" k="THE TINY OPENING CONNECTS" v="CABIN AIR PRESSURE ↔ THE SPACE" at={T.between} until={T.breather - 0.35} size={26} />
        <Pin target={CSP.hole} label={[540, 905]} side="left" k="IT’S CALLED A" v="BREATHER HOLE" at={T.breather} until={T.bleed - 0.05} size={30} />
        <Pin target={CSP.hole} label={[540, 905]} side="left" k="IT’S CALLED A" v="BREATHER HOLE · BLEED HOLE" at={T.bleed} until={T.innerNormally - 0.4} size={30} dot={false} />
        <Pin label={[60, 330]} k="AS CABIN PRESSURE CHANGES" v="PRESSURE IN THE SPACE ADJUSTS" at={T.adjusts} until={T.innerNormally - 0.4} size={28} />
        <Pin label={[60, 260]} k="INNER STRUCTURAL PANE" v="ROUGHLY THE SAME PRESSURE ON BOTH SIDES" at={T.same + 0.35} until={T.outerCarries - 0.1} size={26} maxWidth={540} />
        <Pin label={[1180, 330]} k="OUTER STRUCTURAL PANE" v="CARRIES THE NORMAL PRESSURE DIFFERENCE" at={T.carries + 0.4} size={26} maxWidth={700} />
        <Pin label={[1180, 480]} k="IT DOES" v="THE EVERYDAY WORK" at={T.everyday} size={30} />
        <Legend at={T.connects} />
        <DiagramTag schematic />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
