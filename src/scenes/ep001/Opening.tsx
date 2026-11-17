// EP001 opening (draft lines L01–L06): cold open → "Why is that?" title.
// Every beat is anchored to a narration phrase via cue(); fallbacks = temp timings.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand/tokens';
import {cue, line, timing} from '../../lib/timing';
import {clamp01, keys, mix, ramp} from '../../lib/anim';
import {Kitchen, COUNTER_Y} from '../../components/Kitchen';
import {Microwave, INSIDE_BOWL} from '../../components/Microwave';
import {BowlSide, BowlTop, SIDE} from '../../components/Bowl';
import {CounterTop, FridgeIcon, Spoon} from '../../components/Props';
import {HeatLines, SteamWisps} from '../../components/Effects';
import {Callout} from '../../components/Callout';
import {TitleCard} from '../../components/TitleCard';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';

export type OpeningProps = {showDraftBug: boolean; showCaptions: boolean};

const COUNTER_BOWL = {x: 860, y: COUNTER_Y - SIDE.FOOT * 0.5, s: 0.5};

export const computeCues = () => {
  const L1 = cue('You put', 1.2);
  const twoMin = cue('Two minutes later', 4.5);
  const laterEnd = cue('Two minutes later', 5.39, {edge: 'end'});
  const bowlHot = cue('the bowl is hot', 5.71);
  const hotEnough = cue('hot enough', 6.3);
  const switchHands = cue('switch hands', 7.3);
  const theFood = cue('The food', 8.6);
  const middle = cue('the middle', 9.97);
  const fridge = cue('refrigerator', 12.9);
  const putBack = cue('So you put it back', 14.58);
  const nowEdges = cue('Now the edges', 16.71);
  const furious = cue('furious', 17.7);
  const hotter = cue('the bowl is even hotter', 18.69);
  const center = cue('the center', 20.75);
  const why = cue('Why is that', 24.29);
  const w6 = (() => {
    try {
      const w = line('L06').words;
      return [w[0].start, w[1].start, w[2].start] as [number, number, number];
    } catch {
      return [why, why + 0.25, why + 0.45] as [number, number, number];
    }
  })();

  const ding1 = laterEnd - 0.08;
  const B0 = Math.max(bowlHot - 0.12, ding1 + 0.35);
  const C0 = theFood - 0.22;
  const D0 = putBack - 0.28;
  const E0 = nowEdges - 0.18;
  const F0 = why - 0.5;
  const aDoorOpen = L1 + 0.05;
  const aBowlMove = L1 + 0.35;
  const aDoorClose = aBowlMove + 0.85;
  const aBeep = aDoorClose + 0.35;
  const aLight = aBeep + 0.08;
  const dMove = putBack + 0.05;
  const dClose = dMove + 0.65;
  const dLight = dClose + 0.35;
  const ding2 = E0 - 0.3;
  return {
    L1, twoMin, ding1, bowlHot, hotEnough, switchHands, theFood, middle, fridge, putBack, nowEdges,
    furious, hotter, center, why, w6, B0, C0, D0, E0, F0, aDoorOpen, aBowlMove, aDoorClose, aBeep,
    aLight, dMove, dClose, dLight, ding2,
  };
};
type Cues = ReturnType<typeof computeCues>;

const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

/** Visible on [from - fadeIn, to); fades in over the previous shot (crossfade). */
export const Shot: React.FC<{from: number; to: number; fadeIn?: number; children: React.ReactNode}> = ({from, to, fadeIn = 0, children}) => {
  const t = useT();
  if (t < from - fadeIn || t >= to) return null;
  const o = fadeIn > 0 ? clamp01((t - (from - fadeIn)) / fadeIn) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const World: React.FC<{cam: {x: number; y: number; s: number}; blur?: number; children: React.ReactNode}> = ({cam, blur = 0, children}) => (
  <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <g transform={`translate(${960 - cam.x * cam.s} ${540 - cam.y * cam.s}) scale(${cam.s})`}>{children}</g>
    </svg>
  </AbsoluteFill>
);

const fmt = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

/* ---------- Shot A: dinner goes in; two minutes later, ding ---------- */
const ShotA: React.FC<{T: Cues}> = ({T}) => {
  const t = useT();
  const door =
    ramp(t, T.aDoorOpen, T.aDoorOpen + 0.35, Easing.out(Easing.cubic)) -
    ramp(t, T.aDoorClose, T.aDoorClose + 0.32, Easing.in(Easing.cubic)) +
    ramp(t, T.ding1 + 0.08, T.ding1 + 0.5, Easing.out(Easing.back(1.3)));
  const mv = ramp(t, T.aBowlMove, T.aBowlMove + 0.8);
  const inside = t >= T.aDoorClose;
  const light = t >= T.aLight && t < T.ding1 ? ramp(t, T.aLight, T.aLight + 0.15) : 0;
  const countP = ramp(t, T.aLight, T.ding1, Easing.in(Easing.poly(4)));
  const remaining = Math.ceil(120 * (1 - countP));
  const after = t - T.ding1;
  const display = t < T.aBeep ? '' : t < T.ding1 ? fmt(remaining) : after < 0.9 ? (Math.floor(after * 5) % 2 === 0 ? '0:00' : '') : 'END';
  const cam = {
    x: keys(t, [[0, 930], [1.1, 960], [T.twoMin - 0.35, 1000], [T.ding1, INSIDE_BOWL.x]]),
    y: keys(t, [[0, 520], [1.1, 540], [T.twoMin - 0.35, 535], [T.ding1, 492]]),
    s: keys(t, [[0, 1.08], [1.1, 1.0], [T.twoMin - 0.35, 1.04], [T.ding1, 1.62]]),
  };
  const bowl = {
    x: mix(COUNTER_BOWL.x, INSIDE_BOWL.x, mv),
    y: mix(COUNTER_BOWL.y, INSIDE_BOWL.y, mv) - Math.sin(Math.PI * mv) * 80,
    s: mix(COUNTER_BOWL.s, INSIDE_BOWL.s, mv),
  };
  return (
    <AbsoluteFill>
      <World cam={cam}>
        <Kitchen />
        <Microwave
          door={door}
          light={light}
          display={display}
          fastForward={t > T.twoMin - 0.4 && t < T.ding1}
          turntable={t >= T.aLight && t < T.ding1 ? t - T.aLight : 0}
          inside={inside ? <BowlSide x={INSIDE_BOWL.x} y={INSIDE_BOWL.y} s={INSIDE_BOWL.s} t={t} shadow={false} /> : null}
        />
        {!inside && <BowlSide x={bowl.x} y={bowl.y} s={bowl.s} t={t} />}
      </World>
      <AbsoluteFill style={{background: C.navy950, opacity: 1 - ramp(t, 0, 0.6)}} />
    </AbsoluteFill>
  );
};

/* ---------- Shot B: hot enough to switch hands (H4 art + code overlays) ---------- */
const ShotB: React.FC<{T: Cues}> = ({T}) => {
  const t = useT();
  const heat = ramp(t, T.hotEnough - 0.25, T.hotEnough + 0.25) * 0.75;
  const bob = Math.sin(t * 3.2) * 5;
  const dt = t - T.switchHands;
  const jolt = dt > -0.15 ? Math.sin(dt * 30) * 9 * Math.exp(-Math.max(0, dt) * 3) : 0;
  const push = 1 + 0.05 * ramp(t, T.B0, T.C0, Easing.linear);
  const arc = ramp(t, T.switchHands - 0.2, T.switchHands + 0.25, Easing.out(Easing.cubic));
  const sparks = dt > 0 ? ramp(t, T.switchHands, T.switchHands + 0.12) * (1 - ramp(t, T.switchHands + 0.7, T.switchHands + 1.0)) : 0;
  return (
    <AbsoluteFill>
      <World cam={{x: 640, y: 600, s: 2.2}} blur={8}>
        <Kitchen />
      </World>
      <AbsoluteFill style={{background: C.navy950, opacity: 0.35}} />
      <AbsoluteFill style={{transform: `scale(${push}) translate(${jolt}px, ${bob}px)`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <HeatLines x={814} y={470} w={600} h={300} intensity={heat} t={t} />
          <image href={staticFile('assets/higgsfield/H4_hands_switch_cut.png')} x={-7.5} y={0} width={1935} height={1080} />
          <SteamWisps origins={[{x: 585, y: 300}, {x: 650, y: 268}, {x: 975, y: 262}, {x: 1050, y: 290}]} height={240} intensity={0.35} t={t} width={12} />
          <path
            d="M 900 205 Q 1180 110 1335 420"
            fill="none"
            stroke={C.gold}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray="18 16"
            pathLength={1000}
            strokeDashoffset={0}
            opacity={arc * (1 - ramp(t, T.switchHands + 0.9, T.switchHands + 1.2))}
            style={{clipPath: `inset(0 ${(1 - arc) * 100}% 0 0)`}}
          />
          <g opacity={sparks} stroke={C.gold} strokeWidth={6} strokeLinecap="round">
            <line x1={440} y1={650} x2={400} y2={600} />
            <line x1={515} y1={630} x2={515} y2={570} />
            <line x1={590} y1={650} x2={630} y2={600} />
          </g>
        </svg>
      </AbsoluteFill>
      <Callout target={[1112, 470]} label={[1300, 240]} k="BOWL" v="HOT" at={T.hotEnough + 0.05} />
    </AbsoluteFill>
  );
};

/* ---------- Shot C: the middle still tastes like the fridge ---------- */
const ShotC: React.FC<{T: Cues}> = ({T}) => {
  const t = useT();
  const cx = 900;
  const cy = 560;
  const zoom = 1 + 0.05 * ramp(t, T.C0, T.D0, Easing.linear);
  const enter = ramp(t, T.middle - 0.35, T.middle + 0.35, Easing.out(Easing.cubic));
  const dip = ramp(t, T.middle + 0.35, T.middle + 0.55) * (1 - ramp(t, T.middle + 0.6, T.middle + 0.85));
  const lift = ramp(t, T.middle + 0.65, T.middle + 1.3);
  const sx = mix(mix(1700, cx + 6, enter), 1215, lift);
  const sy = mix(mix(1260, cy + 8, enter), 820, lift);
  const ring = ramp(t, T.middle - 0.1, T.middle + 0.25, Easing.out(Easing.back(1.6)));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <CounterTop />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <BowlTop x={cx} y={cy} s={1.25} t={t} steam={0.55}>
            <circle r={46 * ring} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="10 9" opacity={0.9 * ring} />
          </BowlTop>
          <Spoon x={sx} y={sy} s={1.2} rot={-38} dip={dip} dollop={lift} />
        </svg>
      </AbsoluteFill>
      <Callout
        target={[cx, cy]}
        label={[1250, 300]}
        k="MIDDLE"
        v="STILL FRIDGE-COLD"
        tone="cold"
        at={T.fridge - 0.55}
        icon={<FridgeIcon size={50} />}
      />
    </AbsoluteFill>
  );
};

/* ---------- Shot D: so you put it back ---------- */
const ShotD: React.FC<{T: Cues}> = ({T}) => {
  const t = useT();
  const door =
    1 - ramp(t, T.dClose, T.dClose + 0.3, Easing.in(Easing.cubic)) + ramp(t, T.ding2 + 0.06, T.ding2 + 0.4, Easing.out(Easing.back(1.3)));
  const mv = ramp(t, T.dMove, T.dMove + 0.6);
  const inside = t >= T.dClose;
  const cooking = t >= T.dLight && t < T.ding2;
  const progress = cooking ? ramp(t, T.dLight, T.ding2, Easing.linear) : t >= T.ding2 ? 1 : null;
  const cam = {
    x: keys(t, [[T.D0 - 0.3, 1120], [T.ding2, INSIDE_BOWL.x]]),
    y: keys(t, [[T.D0 - 0.3, 520], [T.ding2, 495]]),
    s: keys(t, [[T.D0 - 0.3, 1.3], [T.ding2, 1.55]]),
  };
  const bowl = {
    x: mix(COUNTER_BOWL.x, INSIDE_BOWL.x, mv),
    y: mix(COUNTER_BOWL.y, INSIDE_BOWL.y, mv) - Math.sin(Math.PI * mv) * 80,
    s: mix(COUNTER_BOWL.s, INSIDE_BOWL.s, mv),
  };
  return (
    <World cam={cam}>
      <Kitchen />
      <Microwave
        door={door}
        light={cooking ? ramp(t, T.dLight, T.dLight + 0.12) : 0}
        display={t < T.dClose + 0.3 ? '' : t < T.ding2 ? 'COOK' : 'END'}
        progress={t >= T.dClose + 0.3 ? progress : null}
        turntable={cooking ? t - T.dLight : 0}
        inside={inside ? <BowlSide x={INSIDE_BOWL.x} y={INSIDE_BOWL.y} s={INSIDE_BOWL.s} t={t} shadow={false} heat={{steam: 0.4}} /> : null}
      />
      {!inside && <BowlSide x={bowl.x} y={bowl.y} s={bowl.s} t={t} heat={{steam: 0.3}} />}
    </World>
  );
};

/* ---------- Shot E: furious edges, hotter bowl, disappointing centre ---------- */
const ShotE: React.FC<{T: Cues}> = ({T}) => {
  const t = useT();
  const s = 1.9;
  const bx = 960;
  const by = 440;
  const furious = ramp(t, T.furious - 0.3, T.furious + 0.3);
  const hot = ramp(t, T.hotter - 0.1, T.hotter + 0.5);
  const push = 1 + 0.06 * ramp(t, T.E0, T.F0, Easing.linear);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `scale(${push})`}}>
        <World cam={{x: 650, y: 560, s: 2.3}} blur={9}>
          <Kitchen />
          <Microwave door={0} light={0} display="END" />
        </World>
        <AbsoluteFill style={{background: C.navy950, opacity: 0.32}} />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <BowlSide
            x={bx}
            y={by}
            s={s}
            t={t}
            heat={{steam: 0.55 + 0.35 * furious, bubbles: 0.55 + 0.45 * furious, spatter: 0.8 * furious, heat: 0.6 + 0.4 * hot}}
          />
        </svg>
      </AbsoluteFill>
      <Callout target={[bx + SIDE.RX * s * 0.84, by + 14]} label={[1500, 380]} k="EDGES" v="FURIOUS" at={T.nowEdges + 0.35} />
      <Callout target={[bx - SIDE.RX * s * 0.72, by + SIDE.FOOT * s * 0.5]} label={[500, 800]} side="left" k="BOWL" v="EVEN HOTTER" at={T.hotter + 0.15} />
      <Callout
        target={[bx - 20, by + SIDE.FCY * s]}
        label={[560, 185]}
        k="CENTER"
        v="SLIGHTLY LESS DISAPPOINTING"
        tone="cold"
        at={T.center + 0.1}
      />
    </AbsoluteFill>
  );
};

/* ---------- SFX (all synthesised in code) ---------- */
export const Sfx: React.FC<{at: number; file: string; vol: number; dur?: number; loop?: boolean}> = ({at, file, vol, dur = 2, loop = false}) => {
  const {fps} = useVideoConfig();
  const frames = Math.max(1, Math.round(dur * fps));
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={frames} layout="none">
      <Audio
        src={staticFile(`sfx/${file}`)}
        loop={loop}
        volume={(f) => interpolate(f, [0, 3, Math.max(4, frames - 6), frames], [0, vol, vol, 0], {extrapolateRight: 'clamp'})}
      />
    </Sequence>
  );
};

export const OpeningSfx: React.FC = () => {
  const T = computeCues();
  const qAt = T.w6[2] + 0.22;
  return (
    <>
      <Sfx at={T.aDoorOpen} file="door_open.wav" vol={0.45} dur={0.4} />
      <Sfx at={T.aDoorClose + 0.24} file="door_close.wav" vol={0.5} dur={0.45} />
      <Sfx at={T.aBeep} file="beep.wav" vol={0.25} dur={0.15} />
      <Sfx at={T.aLight} file="hum_loop.wav" vol={0.14} dur={T.ding1 - T.aLight} loop />
      <Sfx at={T.ding1} file="ding.wav" vol={0.5} dur={1.8} />
      <Sfx at={T.ding1 + 0.1} file="door_open.wav" vol={0.35} dur={0.4} />
      <Sfx at={T.switchHands - 0.12} file="whoosh.wav" vol={0.22} dur={0.7} />
      <Sfx at={T.dClose + 0.24} file="door_close.wav" vol={0.5} dur={0.45} />
      <Sfx at={T.dClose + 0.32} file="beep.wav" vol={0.25} dur={0.15} />
      <Sfx at={T.dLight} file="hum_loop.wav" vol={0.14} dur={T.ding2 - T.dLight} loop />
      <Sfx at={T.ding2} file="ding.wav" vol={0.5} dur={1.8} />
      <Sfx at={T.E0} file="bubbling_loop.wav" vol={0.2} dur={T.F0 - T.E0 + 0.3} loop />
      <Sfx at={T.F0 - 0.15} file="whoosh.wav" vol={0.28} dur={0.7} />
      <Sfx at={qAt} file="title_chime.wav" vol={0.3} dur={2.2} />
    </>
  );
};

/** Shots A–F of the cold open; the title card holds until `titleUntil`. */
export const OpeningShots: React.FC<{titleUntil: number}> = ({titleUntil}) => {
  const T = computeCues();
  return (
    <>
      <Shot from={0} to={T.B0}>
        <ShotA T={T} />
      </Shot>
      <Shot from={T.B0} to={T.C0} fadeIn={0.12}>
        <ShotB T={T} />
      </Shot>
      <Shot from={T.C0} to={T.D0} fadeIn={0.2}>
        <ShotC T={T} />
      </Shot>
      <Shot from={T.D0} to={T.E0} fadeIn={0.2}>
        <ShotD T={T} />
      </Shot>
      <Shot from={T.E0} to={T.F0} fadeIn={0.15}>
        <ShotE T={T} />
      </Shot>
      <Shot from={T.F0} to={titleUntil} fadeIn={0.3}>
        <TitleCard wordTimes={T.w6} taglineAt={T.why + 1.9} tagline="Everyday things. Surprising explanations." />
      </Shot>
    </>
  );
};

export const openingShotAt = (t: number) => {
  const T = computeCues();
  return t < T.B0 ? 'A' : t < T.C0 ? 'B' : t < T.D0 ? 'C' : t < T.E0 ? 'D' : t < T.F0 ? 'E' : 'F';
};

export const Opening: React.FC<OpeningProps> = ({showDraftBug, showCaptions}) => (
  <AbsoluteFill style={{background: C.navy900}}>
    <Audio src={staticFile(timing.audio)} />
    <OpeningSfx />
    <OpeningShots titleUntil={1e9} />
    {showCaptions && <CaptionOverlay />}
    <DraftBug shotAt={openingShotAt} show={showDraftBug} />
  </AbsoluteFill>
);
