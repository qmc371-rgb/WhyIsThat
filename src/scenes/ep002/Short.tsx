// EP002 Short (1080x1920, ~29 s): the same narration recording cut at line boundaries
// (L03 → L10 → L11 → L24 → L28 → L61), the same diagrams reframed vertically, burned-in captions.
// Times come from the Short's own timing file (src/data/ep002_short), re-based to the cut.
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {makeTiming} from '../../lib/timing';
import {ramp} from '../../lib/anim';
import {useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import {TitleCard} from '../../components/TitleCard';
import shortJson from '../../data/ep002_short/narration_timing.json';
import shortCaptions from '../../data/ep002_short/captions.json';
import {CS, W2, W2_HOLE, XView, anchor} from './geom';
import {ExplodedWindow} from './Exploded';
import {CrossSectionBase, CSP} from './CrossSection';
import {ArtCam, Cam, FlowPath, ForceArrow, GoldRing, HoleMark, Pin, artScale, artToScreen, camMix} from './parts';
import {mixView} from './SectionsA';

const ST = makeTiming(shortJson);
const wd = (id: string, i: number) => ST.line(id).words[i].start;
const ls = (id: string) => ST.line(id).start;

const V_S: XView = {cx: 540, cy: 790, scale: 1.42, phi: 50, sep: 2.1};
const V_S0: XView = {cx: 540, cy: 790, scale: 2.2, phi: 0, sep: 0};
// cross-section framing: CS units x 420–1500, y 60–1060 → screen x 0–1080, y 300–1300
const CSX = (x: number) => x - 420;
const CSY = (y: number) => y + 240;

const GridBgV: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="sg" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke={C.navy800} strokeWidth={2} />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#sg)" />
      </svg>
    </AbsoluteFill>
  );
};

const Header: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 290, background: `linear-gradient(180deg, ${C.navy950} 0%, rgba(6,15,34,0.92) 70%, rgba(6,15,34,0) 100%)`}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.white}}>
      WHY IS THAT<span style={{color: C.gold}}>?</span>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 172, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: C.goldLight}}>Why is there a tiny hole in airplane windows?</div>
  </div>
);

type Cap = {text: string; startMs: number; endMs: number};
/** Balanced 2-row split, identical to scripts/make_captions.py wrap_rows (never splits a word). */
const wrapRows = (text: string, row: number): string[] => {
  const words = text.split(' ');
  if (text.length <= row) return [text];
  let best: string[] | null = null;
  let cost = 1e9;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ');
    const b = words.slice(i).join(' ');
    if (a.length <= row && b.length <= row && Math.abs(a.length - b.length) < cost) {
      best = [a, b];
      cost = Math.abs(a.length - b.length);
    }
  }
  return best ?? [text];
};
const ShortCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cap = (shortCaptions as Cap[]).find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cap) return null;
  const rows = wrapRows(cap.text, 24);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1415, display: 'flex', justifyContent: 'center'}}>
      <div style={{maxWidth: 940, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 58, lineHeight: 1.22, color: C.white, background: 'rgba(6,15,34,0.86)', padding: '14px 26px', borderRadius: 18}}>
        {rows.map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
};

const SmallTag: React.FC<{y: number; schematic?: boolean}> = ({y, schematic}) => (
  <div style={{position: 'absolute', left: 40, top: y, display: 'flex', gap: 12, alignItems: 'center'}}>
    {schematic && <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.2em', color: C.navy950, background: C.gold, padding: '5px 10px', borderRadius: 8}}>SCHEMATIC</span>}
    <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.7)', padding: '5px 10px', borderRadius: 8}}>Simplified illustration — not to scale.</span>
  </div>
);

const MiniLegend: React.FC<{y: number; flow?: boolean; force?: boolean}> = ({y, flow = true, force = true}) => (
  <div style={{position: 'absolute', right: 40, top: y, display: 'flex', gap: 22, alignItems: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.1em', color: C.white}}>
    {flow && (
      <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <svg width={56} height={20} viewBox="0 0 80 32">
          <path d="M4,16 L60,16" stroke={C.white} strokeWidth={5} strokeDasharray="12 9" />
          <path d="M58,7 L74,16 L58,25 Z" fill={C.white} />
        </svg>
        AIRFLOW
      </span>
    )}
    {force && (
      <span style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <svg width={56} height={20} viewBox="0 0 80 32">
          <path d="M4,10 L52,10 L52,3 L76,16 L52,29 L52,22 L4,22 Z" fill={C.gold} />
        </svg>
        PRESSURE FORCE
      </span>
    )}
  </div>
);

export const Ep002Short: React.FC = () => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const b2 = ls('L10') - 0.25;
  const b3 = ls('L24') + 0.15; // hold the layers until L24 starts, so ✓ NO HOLE stays readable
  const b4 = ls('L61') - 0.3;
  // beat 1: W2 close-up, vertical
  const cam: Cam = camMix({x: W2_HOLE.x, y: W2_HOLE.y, z: 1.6}, {x: W2_HOLE.x, y: W2_HOLE.y, z: 1.95}, Easing.inOut(Easing.cubic)(Math.min(1, t / b2)));
  const holeS = artToScreen(W2, cam, width, height, W2_HOLE.x, W2_HOLE.y);
  const sArt = artScale(W2, cam, width, height);
  // beat 2: exploded view
  const v = mixView(V_S0, V_S, ramp(t, b2 + 0.1, b2 + 0.9, Easing.inOut(Easing.cubic)));
  const tinyL10 = wd('L10', 1);
  const outsideL11 = wd('L11', 12); // "…to the outside"
  const holeFocus = ramp(t, tinyL10 - 0.2, tinyL10 + 0.3);
  const outerFocus = ramp(t, outsideL11 - 0.2, outsideL11 + 0.2);
  const hole = anchor(V_S, 'hole');
  // beat 3: cross-section
  const connects = wd('L24', 3);
  const carries = wd('L28', 3);
  const tint = ramp(t, connects + 0.3, connects + 1.3);
  return (
    <AbsoluteFill style={{background: C.navy950}}>
      <Audio src={staticFile(ST.timing.audio)} />
      <Sfx at={0} file="cabin_loop.wav" vol={0.08} dur={b2 + 0.3} loop fade={0.4} />
      <Sfx at={wd('L03', 2)} file="glint.wav" vol={0.2} dur={0.6} />
      {[b2, b3, b4].map((x) => (
        <Sfx key={x} at={x - 0.2} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={wd('L61', 3) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />

      <Shot from={0} to={b2}>
        <ArtCam art={W2} cam={cam}>
          <HoleMark x={W2_HOLE.x} y={W2_HOLE.y} r={13} />
          <GoldRing x={W2_HOLE.x} y={W2_HOLE.y} r={48 / sArt} width={6 / sArt} at={wd('L03', 2)} />
        </ArtCam>
        <Pin target={holeS} label={[540, holeS[1] - 230]} side="center" k="SPOTTED" v="A TINY HOLE" at={wd('L03', 2) + 0.3} size={40} />
      </Shot>

      <Shot from={b2} to={b3} fadeIn={0.35}>
        <GridBgV />
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <ExplodedWindow
            v={v}
            sky={1 - ramp(t, b2 + 0.1, b2 + 0.9)}
            layer={{protective: {opacity: 1 - 0.55 * holeFocus}, inner: {glow: holeFocus * (1 - 0.6 * outerFocus)}, outer: {opacity: 1 - 0.55 * holeFocus * (1 - outerFocus), glow: outerFocus}}}
          />
          <GoldRing x={hole[0]} y={hole[1]} r={28} at={tinyL10} />
        </svg>
        <Pin target={anchor(V_S, 'inner')} label={[532, 360]} side="center" v="INNER STRUCTURAL PANE" at={wd('L10', 6)} size={30} />
        <Pin target={anchor(V_S, 'protective')} label={[236, 445]} side="center" v="PROTECTIVE PANEL" at={wd('L10', 6) + 0.3} size={22} tone="white" />
        <Pin target={anchor(V_S, 'outer')} label={[786, 445]} side="center" v="OUTER STRUCTURAL PANE" at={wd('L10', 6) + 0.5} size={22} />
        <Pin target={hole} label={[540, 1180]} side="center" k="THE TINY HOLE" v="MIDDLE LAYER IN OUR ILLUSTRATION" at={wd('L10', 9)} until={wd('L11', 3) - 0.2} size={28} />
        <Pin label={[430, 1180]} side="center" v="NOT ALL THE WAY THROUGH" mark="cross" tone="white" at={wd('L11', 3)} size={32} />
        <Pin target={anchor(V_S, 'outer', 'bottom')} label={[772, 1292]} side="center" k="OUTER STRUCTURAL PANE" v="NO HOLE" mark="check" at={outsideL11} size={30} />
        <SmallTag y={1368} />
      </Shot>

      <Shot from={b3} to={b4} fadeIn={0.35}>
        <GridBgV />
        <svg width={width} height={1000} viewBox="420 60 1080 1000" style={{position: 'absolute', left: 0, top: 300}}>
          <CrossSectionBase tint={tint} glow={{outer: ramp(t, wd('L28', 1) - 0.1, wd('L28', 1) + 0.2)}} />
          <GoldRing x={CSP.hole[0]} y={CSP.hole[1]} r={34} at={wd('L24', 2)} until={ls('L28') - 0.2} />
          <FlowPath d={CSP.flowIn} at={connects} until={ls('L28') - 0.2} />
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <ForceArrow from={[952, 340 + k * 170]} to={[1056, 340 + k * 170]} at={carries + k * 0.1} w={16} head={38} />
              <ForceArrow from={[1150, 340 + k * 170]} to={[1104, 340 + k * 170]} at={wd('L28', 13) + k * 0.08} w={9} head={20} />
            </g>
          ))}
        </svg>
        <div style={{position: 'absolute', left: 30, top: CSY(560), fontFamily: FONT.display, fontWeight: 700, fontSize: 44, color: C.white, opacity: ramp(t, b3, b3 + 0.4)}}>CABIN</div>
        <div style={{position: 'absolute', right: 26, top: CSY(560), fontFamily: FONT.display, fontWeight: 700, fontSize: 44, color: C.navy200, opacity: ramp(t, b3, b3 + 0.4)}}>OUTSIDE</div>
        <Pin target={[CSX(848), CSY(CS.top + 40)]} label={[CSX(848), 350]} side="center" v="INNER STRUCTURAL PANE" at={b3} until={ls('L28') - 0.3} size={24} />
        <Pin target={[CSX(1080), CSY(CS.top + 40)]} label={[CSX(1080) + 60, 432]} side="center" v="OUTER STRUCTURAL PANE" at={b3 + 0.2} until={ls('L28') - 0.3} size={24} />
        <Pin target={[CSX(962), CSY(560)]} label={[CSX(962), 1170]} side="center" k="A SMALL SPACE" v="BETWEEN THE STRUCTURAL PANES" at={wd('L24', 10)} size={24} />
        <Pin label={[540, 380]} side="center" k="OUTER STRUCTURAL PANE" v="CARRIES THE NORMAL PRESSURE DIFFERENCE" at={carries + 0.3} size={26} maxWidth={940} />
        <SmallTag y={1318} schematic />
        <MiniLegend y={1360} />
      </Shot>

      <Shot from={b4} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy950}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 3414, transform: 'scale(0.5625)', transformOrigin: 'top left'}}>
          <TitleCard wordTimes={[wd('L61', 1), wd('L61', 2), wd('L61', 3)]} tagline="Everyday things. Surprising explanations." taglineAt={wd('L61', 3) + 0.6} />
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 1210, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 38, lineHeight: 1.3, color: C.white, opacity: ramp(t, wd('L61', 3) + 0.9, wd('L61', 3) + 1.4)}}>
          Full explanation on the channel
        </div>
      </Shot>

      <Header />
      <ShortCaptions />
    </AbsoluteFill>
  );
};
