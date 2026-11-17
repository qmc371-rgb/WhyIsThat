// EP002 sections F–J: analogy, backup, a system with different jobs, the naming detail, outro.
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {cue, line} from './timing';
import {clamp01, mix, ramp} from '../../lib/anim';
import {Appear, GridBg, Headline, Mark, useT} from '../../kit/kit';
import {Shot} from '../../kit/shots';
import {TitleCard} from '../../components/TitleCard';
import {LayerId, W1, W2_HOLE, anchor, PANE, LAYERS, layerZ, project} from './geom';
import {ExplodedWindow, LayerStyle} from './Exploded';
import {CrossSectionBase, CSP} from './CrossSection';
import {AN, AnalogyPlan} from './Illustrations';
import {ArtCam, Bracket, Cam, CommonDesignTag, DiagramTag, FlowPath, ForceArrow, GoldRing, IconShield, Legend, Pin, SourceCard, artToScreen, camAt} from './parts';
import {CSLabels, LayerLabels, Orientation, V_34, W2Shot} from './SectionsA';

const CenterHeadline: React.FC<{text: string; at: number; until?: number; y?: number; size?: number; color?: string}> = ({text, at, until, y = 470, size = 84, color = C.white}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center'}}>
    <Appear at={at} until={until} dir="up">
      <Headline text={text} size={size} align="center" color={color} />
    </Appear>
  </div>
);

/* ================================ F · ANALOGY ================================ */
export const Analogy: React.FC = () => {
  const t = useT();
  const l30 = line('L30').start;
  const imagine = cue('Imagine two transparent', 127.87);
  const barriers = cue('two transparent barriers', 128.36);
  const room = cue('a small room between', 130.19) + 0.14;
  const opening = cue('has an opening into', 133.42) + 0.41;
  const airMoves = cue('Air can move', 135.71);
  const approach = cue('to approach the pressure', 139.79) + 0.16;
  const second = cue('The second barrier', 142.34) + 0.22;
  const passage = cue('passage through both', 149.14);
  const distinction = cue('the important distinction', 151.29);
  const connects = cue('The hole connects two', 153.31);
  const noRoute = cue('a clear route into', 158.7);
  const planIn = ramp(t, imagine - 0.2, imagine + 0.4);
  const roomDensity = mix(0.3, 1, ramp(t, airMoves + 0.6, approach + 0.8, Easing.inOut(Easing.quad)));
  const dimPlan = 1 - 0.65 * ramp(t, distinction - 0.4, distinction);
  const back = connects - 0.3;
  return (
    <AbsoluteFill>
      <Shot from={0} to={back}>
        <GridBg />
        <CenterHeadline text="Here’s a way to picture it." at={l30} until={imagine - 0.3} />
        <AbsoluteFill style={{opacity: planIn * dimPlan}}>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <AnalogyPlan opening={ramp(t, opening - 0.25, opening + 0.2)} roomDensity={roomDensity} b2Glow={ramp(t, second - 0.1, second + 0.2)} />
            <GoldRing x={AN.b1 + AN.bw / 2} y={AN.gapY} r={56} at={opening} />
            <FlowPath d={`M520,${AN.gapY} L${AN.b1 + 220},${AN.gapY}`} at={airMoves} until={distinction - 0.4} dir={1} dots={6} speed={0.6} />
          </svg>
          <Region2 text="YOUR SIDE" x={380} y={110} at={barriers} />
          <Region2 text="SMALL ROOM" x={(AN.b1 + AN.b2 + AN.bw) / 2} y={110} at={room} />
          <Region2 text="OUTSIDE" x={1560} y={110} at={barriers} color={C.navy200} />
          <Pin target={[AN.b1 + AN.bw / 2, AN.top + 30]} label={[AN.b1 + AN.bw / 2, 1000]} side="center" k="BARRIER 1" v="TRANSPARENT" at={barriers + 0.2} until={airMoves - 0.3} size={24} tone="white" dot={false} />
          <Pin target={[AN.b2 + AN.bw / 2, AN.top + 30]} label={[AN.b2 + AN.bw / 2, 1000]} side="center" k="BARRIER 2" v="TRANSPARENT" at={barriers + 0.4} until={airMoves - 0.3} size={24} tone="white" dot={false} />
          <Pin target={[AN.b1 + AN.bw / 2, AN.gapY + 40]} label={[560, 780]} side="left" v="OPENING" at={opening + 0.2} size={32} />
          <Pin label={[1150, 1000]} side="center" k="THE PRESSURE IN THE ROOM" v="APPROACHES THE PRESSURE ON YOUR SIDE" at={approach} until={passage - 0.5} size={28} />
          <Pin target={[AN.b2 + AN.bw / 2, 760]} label={[1290, 780]} k="THE SECOND BARRIER" v="STILL SEPARATES IT FROM THE OUTSIDE" at={second + 0.2} size={28} mark="check" maxWidth={600} />
          <Pin label={[1150, 1000]} side="center" v="NO PASSAGE THROUGH BOTH" at={passage} size={36} mark="check" />
          <DiagramTag schematic y={1062} x={40} />
        </AbsoluteFill>
        <CenterHeadline text="That’s the important distinction." at={distinction - 0.2} y={480} />
      </Shot>
      <Shot from={back} to={1e9} fadeIn={0.4}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <CrossSectionBase tint={1} glow={{cabinSide: ramp(t, connects + 0.6, connects + 1.0), space: ramp(t, connects + 1.0, connects + 1.4), outer: ramp(t, noRoute - 0.3, noRoute)}} />
          <GoldRing x={CSP.hole[0]} y={CSP.hole[1]} r={34} at={connects + 0.2} />
          <FlowPath d={CSP.flowIn} at={connects + 0.3} dir={0} heads="both" />
        </svg>
        <CSLabels at={{cabin: back, prot: back, inner: back, outer: back, outside: back}} />
        <Pin label={[60, 905]} k="THE HOLE CONNECTS" v="TWO SPACES INSIDE THE WINDOW SYSTEM" at={connects + 0.6} size={28} />
        <Pin target={[1080, 600]} label={[1180, 400]} k="IT DOESN’T GIVE CABIN AIR" v="A CLEAR ROUTE INTO THE SKY" at={noRoute} size={30} mark="check" />
        <Legend at={back} force={false} />
        <DiagramTag schematic />
      </Shot>
    </AbsoluteFill>
  );
};

const Region2: React.FC<{text: string; x: number; y: number; at: number; color?: string}> = ({text, x, y, at, color = C.white}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}>
    <Appear at={at} dir="up">
      <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, letterSpacing: '0.14em', color}}>{text}</div>
    </Appear>
  </div>
);

/* ================================ G · BACKUP ================================ */
/** One static "state" panel: a scaled cross-section with force arrows on the pane carrying the load. */
const StatePanel: React.FC<{x: number; title: string; failed: boolean; at: number; note: string}> = ({x, title, failed, at, note}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.45);
  const s = 0.6;
  const W = 860;
  const DH = 500; // diagram strip height
  const tx = W / 2 - 860 * s; // centre the window (x≈860)
  const ty = DH / 2 - 540 * s;
  const ys = [400, 560, 720];
  const accent = failed ? C.navy300 : C.gold;
  return (
    <div style={{position: 'absolute', left: x, top: 140, width: W, opacity: o, borderRadius: 26, border: `3px solid ${accent}`, background: 'rgba(6,15,34,0.85)', overflow: 'hidden'}}>
      <div style={{height: 76, display: 'flex', alignItems: 'center', paddingLeft: 30, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.12em', color: failed ? C.white : C.gold, borderBottom: `2px solid ${C.navy700}`}}>{title}</div>
      <svg width={W} height={DH} style={{display: 'block'}}>
        <g transform={`translate(${tx} ${ty}) scale(${s})`}>
          <CrossSectionBase dots={0} ghostOuter={failed ? 1 : 0} glow={failed ? {inner: 1} : {outer: 1}} />
          {ys.map((y, k) =>
            failed ? (
              <ForceArrow key={k} from={[700, y]} to={[826, y]} at={at + 0.3 + k * 0.08} w={18} head={42} />
            ) : (
              <ForceArrow key={k} from={[940, y]} to={[1056, y]} at={at + 0.3 + k * 0.08} w={18} head={42} />
            ),
          )}
        </g>
      </svg>
      <div style={{padding: '22px 30px 26px', minHeight: 120, borderTop: `2px solid ${C.navy700}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, lineHeight: 1.25, color: C.white}}>{note}</div>
    </div>
  );
};

export const Backup: React.FC = () => {
  const t = useT();
  const l39 = line('L39').start;
  const purpose = cue('another purpose', 162.39);
  const l40 = cue('The inner structural pane isn’t', 164.84);
  const thicker = cue('to make the window look', 167.24);
  const airbus = cue('Airbus explains', 169.69);
  const independently = cue('can independently withstand', 173.9) + 0.27;
  const fails = cue('If the outer pane fails', 180.46);
  const designed = cue('designed to take', 183.42);
  const csFrom = l40 - 0.3;
  const panelsFrom = fails - 0.3;
  return (
    <AbsoluteFill>
      <Shot from={0} to={csFrom}>
        <GridBg />
        <div style={{position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center'}}>
          <Appear at={l39 + 0.3} dir="scale">
            <IconShield size={190} />
          </Appear>
        </div>
        <CenterHeadline text="Another purpose: a backup." at={purpose} y={500} />
      </Shot>
      <Shot from={csFrom} to={panelsFrom} fadeIn={0.4}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <CrossSectionBase tint={1} dots={0.8} glow={{inner: ramp(t, l40, l40 + 0.3), outer: ramp(t, independently - 0.2, independently + 0.1)}} />
        </svg>
        <CSLabels at={{cabin: csFrom, outside: csFrom}} />
        <CSLabels at={{inner: csFrom, outer: csFrom}} until={airbus - 0.35} />
        <Pin label={[60, 330]} k="NOT JUST THERE" v="TO MAKE THE WINDOW LOOK THICKER" at={thicker} until={airbus - 0.2} size={28} mark="cross" tone="white" />
        <SourceCard at={airbus} source="AIRBUS (SAFETY FIRST)" quote="Each of its two structural cabin-window panes can independently withstand the maximum pressure difference normally experienced during flight." x={960} y={40} width={1140} />
        {[848, 1080].map((x, i) => (
          <div key={x} style={{position: 'absolute', left: x, top: 900, transform: 'translate(-50%,-50%)'}}>
            <Appear at={independently + i * 0.15} dir="scale">
              <Mark kind="check" size={70} />
            </Appear>
          </div>
        ))}
        <DiagramTag />
      </Shot>
      <Shot from={panelsFrom} to={1e9} fadeIn={0.4}>
        <GridBg />
        <StatePanel x={70} title="NORMALLY" failed={false} at={panelsFrom} note="The outer structural pane carries the pressure load." />
        <StatePanel x={990} title="IF THE OUTER PANE FAILS" failed at={fails + 0.6} note="The inner structural pane is designed to take the pressure load." />
        <Pin label={[960, 70]} side="center" k="SOURCE" v="AIRBUS (SAFETY FIRST)" at={designed} size={26} tone="white" />
        <Legend at={panelsFrom + 0.4} flow={false} x={1880} y={1062} />
        <DiagramTag y={1062} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ H · A SYSTEM WITH DIFFERENT JOBS ================================ */
export const jobsAt = () => ({
  protects: cue('layer protects against', 191.78) + 0.38,
  carries: cue('normally carries the pressure load', 195.11),
  backup: cue('provides structural backup', 198.06),
  manage: cue('tiny opening helps manage', 200.56) + 0.29,
});

/** Job labels on the exploded view (used in H and the outro). */
const JobLabels: React.FC<{v: typeof V_34; at: ReturnType<typeof jobsAt>; size?: number}> = ({v, at, size = 26}) => (
  <>
    <Pin target={anchor(v, 'protective')} label={[anchor(v, 'protective')[0] + 10, 215]} side="left" k="PROTECTIVE PANEL" v="PROTECTS AGAINST EVERYDAY CONTACT" at={at.protects} size={size} tone="white" maxWidth={560} />
    <Pin target={anchor(v, 'outer')} label={[anchor(v, 'outer')[0] - 10, 215]} side="right" k="OUTER STRUCTURAL PANE" v="NORMALLY CARRIES THE PRESSURE LOAD" at={at.carries} size={size} maxWidth={560} />
    <Pin target={anchor(v, 'inner', 'bottom')} label={[anchor(v, 'inner')[0] - 60, 975]} side="left" k="INNER STRUCTURAL PANE" v="PROVIDES STRUCTURAL BACKUP" at={at.backup} size={size} />
    <Pin target={anchor(v, 'hole')} label={[1180, 905]} k="THE TINY OPENING" v="HELPS MANAGE THE PRESSURE BETWEEN THEM" at={at.manage} size={size} maxWidth={640} />
  </>
);

export const SystemJobs: React.FC = () => {
  const t = useT();
  const l43 = line('L43').start;
  const J = jobsAt();
  const on = (a: number, b: number) => ramp(t, a - 0.1, a + 0.2) * (1 - ramp(t, b - 0.1, b + 0.2));
  const layer: Partial<Record<LayerId, LayerStyle>> = {
    protective: {glow: on(J.protects, J.carries)},
    outer: {glow: on(J.carries, J.backup)},
    inner: {glow: on(J.backup, J.manage)},
  };
  const hole = anchor(V_34, 'hole');
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 46, display: 'flex', justifyContent: 'center'}}>
        <Appear at={l43 + 0.2} dir="down">
          <Headline text="A system with different jobs" size={64} align="center" />
        </Appear>
      </div>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <ExplodedWindow v={V_34} layer={layer} />
        <GoldRing x={hole[0]} y={hole[1]} r={30} at={J.manage} />
      </svg>
      <JobLabels v={V_34} at={J} />
      <DiagramTag y={1062} />
    </AbsoluteFill>
  );
};

/* ================================ I · THE NAMING DETAIL ================================ */
export const Naming: React.FC = () => {
  const t = useT();
  const l48 = line('L48').start;
  const confusing = cue('explanations confusing', 207.2) + 0.79;
  const some = cue('Some descriptions call', 209.2);
  const innerQ = cue('hole the “inner pane', 211.41) + 0.5;
  const middleQ = cue('the “middle pane', 213.91) + 0.23;
  const same = cue('describing the same layer', 216.02);
  const innerDist = cue('distinguishes it from', 218.3);
  const middleCounts = cue('counts the protective', 222.15);
  const third = cue('a third layer', 225.52) + 0.15;
  const forOur = cue('For our illustration', 227.04);
  const pProt = cue('them the protective panel', 229.18) + 0.45;
  const pInner = cue('the inner structural pane, and', 230.84) + 0.23;
  const pOuter = cue('and the outer structural pane', 232.6) + 0.23;
  const different = cue('Different aircraft', 234.88);
  const common = cue('common arrangement', 238.97);
  const v = V_34;
  const diagFrom = some - 0.35;
  const protDim = 1 - 0.65 * ramp(t, innerDist - 0.1, innerDist + 0.3) * (1 - ramp(t, middleCounts - 0.1, middleCounts + 0.3));
  const innerGlow = ramp(t, some, some + 0.3) * (1 - ramp(t, forOur - 0.2, forOur + 0.2));
  const ext = (id: LayerId) => {
    const L = LAYERS.find((l) => l.id === id)!;
    const z = layerZ(v, L.k);
    const xs = [-PANE.a, PANE.a].flatMap((x) => [z - L.t / 2, z + L.t / 2].map((zz) => project(v, x, PANE.b, zz)[0]));
    return [Math.min(...xs), Math.max(...xs)];
  };
  const badgeY = 905;
  const badges: Array<[LayerId, string]> = [
    ['protective', '1'],
    ['inner', '2'],
    ['outer', '3'],
  ];
  return (
    <AbsoluteFill>
      <Shot from={0} to={diagFrom}>
        <GridBg />
        <CenterHeadline text="One naming detail" at={l48 + 0.6} until={diagFrom - 0.75} y={400} />
        <Pin label={[960, 600]} side="center" v="CAN MAKE EXPLANATIONS CONFUSING" at={confusing} until={diagFrom - 0.75} size={34} tone="white" />
      </Shot>
      <Shot from={diagFrom} to={1e9} fadeIn={0.4}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ExplodedWindow v={v} layer={{protective: {opacity: protDim}, inner: {glow: innerGlow}}} />
          <Bracket x0={ext('inner')[0]} x1={ext('outer')[1]} y={870} at={innerDist + 0.2} until={middleCounts - 0.2} />
          <Bracket x0={ext('protective')[0]} x1={ext('outer')[1]} y={870} at={middleCounts + 0.2} until={forOur - 0.2} />
        </svg>
        <Pin target={anchor(v, 'inner')} label={[700, 150]} side="left" v="“INNER PANE”" at={innerQ} until={innerDist - 0.2} size={36} />
        <Pin target={anchor(v, 'inner')} label={[1210, 150]} side="right" v="“MIDDLE PANE”" at={middleQ} until={innerDist - 0.2} size={36} />
        <Pin label={[955, 150]} side="center" v="SAME LAYER" mark="check" at={same} until={innerDist - 0.2} size={30} />
        <Pin label={[(ext('inner')[0] + ext('outer')[1]) / 2, 975]} side="center" k="“INNER” DISTINGUISHES IT FROM" v="THE OUTER STRUCTURAL PANE" at={innerDist + 0.4} until={middleCounts - 0.2} size={30} />
        {badges.map(([id, n], i) => {
          const x = anchor(v, id, 'bottom')[0];
          return (
            <div key={id} style={{position: 'absolute', left: x, top: badgeY, transform: 'translate(-50%,-50%)'}}>
              <Appear at={middleCounts + 0.4 + i * 0.25} until={forOur - 0.2} dir="scale">
                <div style={{width: 64, height: 64, borderRadius: 32, background: id === 'inner' ? C.gold : C.navy950, border: `4px solid ${id === 'inner' ? C.gold : C.white}`, color: id === 'inner' ? C.navy950 : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 38}}>
                  {n}
                </div>
              </Appear>
            </div>
          );
        })}
        <Pin label={[960, 1000]} side="center" k="“MIDDLE” ALSO COUNTS THE PROTECTIVE PANEL" v="MIDDLE = LAYER 2 OF 3" at={third} until={forOur - 0.2} size={28} />
        <LayerLabels v={v} at={{protective: pProt, inner: pInner, outer: pOuter}} />
        <Pin label={[60, 975]} k="DIFFERENT AIRCRAFT" v="CAN USE DIFFERENT WINDOW DESIGNS" at={different} size={28} tone="white" />
        <CommonDesignTag at={common} x={1100} y={950} />
        <Orientation at={diagFrom + 0.4} />
        <DiagramTag y={1062} x={40} at={diagFrom} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ J · OUTRO ================================ */
export const Outro: React.FC = () => {
  const t = useT();
  const l56 = line('L56').start;
  const lookFor = cue('look for it', 245.91);
  const l57 = line('L57').start;
  const flaw = cue('initially looks like', 248.03);
  const partOf = cue('part of a carefully', 249.91);
  const l58 = line('L58').start;
  const itsThat = cue('putting a hole in one layer', 257.4);
  const helps = cue('helps the other layers', 259.0);
  const l60 = line('L60').start;
  const surprising = cue('Surprising explanations', 263.32);
  const words = (() => {
    const w = line('L61').words;
    return [w[1].start, w[2].start, w[3].start] as [number, number, number];
  })();
  const lift = 170 * ramp(t, words[2] + 2.2, words[2] + 3.2, Easing.inOut(Easing.cubic));
  const s2 = l57 - 0.3;
  const s3 = l58 - 0.35;
  const s4 = l60 - 0.35;
  const s5 = words[0] - 0.35;
  const pW1 = Easing.in(Easing.cubic)(clamp01((t - (l56 - 0.35)) / (s2 + 0.1 - (l56 - 0.35))));
  const camW1: Cam = {x: mix(1376, W1.win.x, pW1), y: mix(768, W1.win.y - 20, pW1), z: 1 + 0.82 * pW1};
  const camW2 = camAt(t, [
    [s2 - 0.4, {x: 2752, y: 1606, z: 1.0}],
    [flaw, {x: W2_HOLE.x, y: W2_HOLE.y, z: 1.9}],
    [s3, {x: W2_HOLE.x, y: W2_HOLE.y, z: 2.2}],
  ]);
  const jobsNow = {protects: helps + 0.1, carries: helps + 0.25, backup: helps + 0.4, manage: helps + 0.55};
  const hole = anchor(V_34, 'hole');
  const win1: [number, number] = artToScreen(W1, camW1, 1920, 1080, W1.win.x, W1.win.y);
  return (
    <AbsoluteFill>
      <Shot from={0} to={s2}>
        <ArtCam art={W1} cam={camW1} />
        <Pin target={[win1[0], win1[1] + 120]} label={[win1[0] + 420, win1[1] - 150]} v="LOOK FOR IT" at={lookFor} size={40} />
      </Shot>
      <Shot from={s2} to={s3} fadeIn={0.4}>
        <W2Shot cam={camW2} ring={[l57, s3 + 1]}>
          {() => (
            <>
              <Pin label={[80, 170]} k="IT INITIALLY" v="LOOKS LIKE A FLAW" at={flaw} until={partOf - 0.15} size={36} mark="cross" tone="white" />
              <Pin label={[80, 170]} k="IT’S PART OF" v="A CAREFULLY ARRANGED SYSTEM" at={partOf} size={36} mark="check" />
            </>
          )}
        </W2Shot>
      </Shot>
      <Shot from={s3} to={s4} fadeIn={0.4}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <ExplodedWindow v={V_34} />
          <GoldRing x={hole[0]} y={hole[1]} r={30} at={l58 + 0.3} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}>
          <Appear at={l58 + 0.25} until={itsThat - 0.45} dir="down">
            <Headline text="The surprising part isn’t simply that the window has a hole." size={52} align="center" maxWidth={1500} />
          </Appear>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, display: 'flex', justifyContent: 'center'}}>
          <Appear at={itsThat} dir="down">
            <Headline text="A hole in one layer helps the other layers do their jobs" size={52} align="center" maxWidth={1500} />
          </Appear>
        </div>
        <JobLabels v={V_34} at={jobsNow} size={24} />
        <DiagramTag y={1062} />
      </Shot>
      <Shot from={s4} to={s5}>
        <AbsoluteFill style={{background: C.navy950, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 24}}>
          <Appear at={l60}>
            <Headline text="Everyday things." size={92} align="center" />
          </Appear>
          <Appear at={surprising}>
            <Headline text="Surprising explanations." size={92} color={C.gold} align="center" />
          </Appear>
        </AbsoluteFill>
      </Shot>
      <Shot from={s5} to={1e9} fadeIn={0.3}>
        <TitleCard wordTimes={words} tagline="Everyday things. Surprising explanations." taglineAt={words[2] + 0.9} lift={lift} />
      </Shot>
    </AbsoluteFill>
  );
};

