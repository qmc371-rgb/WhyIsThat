// EP003 — "Why Does Your Voice Sound Weird on Recordings?" Every beat is timed from the final narration
// (line starts / word starts in src/data/ep003/narration_timing.json via line()).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, staticFile, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {line, timing} from './timing';
import {mix, pop, ramp} from '../../lib/anim';
import {Appear, GridBg, Headline, useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import {TitleCard} from '../../components/TitleCard';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';
import ep003Captions from '../../data/ep003/captions.json';
import {ArtCam, Cam, Card, FlowPath, GoldRing, Pin, artToScreen, camAt} from '../ep002/parts';
import {AIR_TO_PHONE, CYAN, HP, HeadBase, LiveRoutes, PHONE_TO_EAR, PhoneIcon, RouteLegend, SimpleTag, YEL, BONE_1, BONE_2} from './Head';

export const ls = (id: string) => line(id).start;
export const le = (id: string) => line(id).end;
export const w = (id: string, i: number) => line(id).words[i].start;

const art = (n: string) => ({file: `assets/higgsfield/ep003/${n}.jpg`, w: 2752, h: 1536});
export const C1 = {...art('C1_reaction_v1'), mouth: [831, 688], phone: [1520, 774]};
export const C2 = {...art('C2_recording_v1'), mouth: [846, 616], phone: [1233, 745]};
export const C3 = {...art('C3_conversation_v1'), mouthA: [860, 513], earA: [702, 427], earB: [2222, 356], mouthB: [2050, 459]};
export const C4 = {...art('C4_phone_v1'), screen: [1376, 807]};
const FULL: Cam = {x: 1376, y: 768, z: 1};

/** Simple code-drawn playback UI on a phone screen (play button + waveform bars). */
const PlayUI: React.FC<{x: number; y: number; s: number; at: number; playing?: [number, number]}> = ({x, y, s, at, playing}) => {
  const t = useT();
  if (t < at) return null;
  const o = ramp(t, at, at + 0.3);
  const on = playing ? t >= playing[0] && t < playing[1] : false;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cx={0} cy={-40} r={34} fill={C.gold} />
      <path d={on ? 'M-12,-56 L-12,-24 M8,-56 L8,-24' : 'M-10,-58 L16,-40 L-10,-22 Z'} fill={C.navy950} stroke={C.navy950} strokeWidth={on ? 9 : 0} strokeLinecap="round" />
      {Array.from({length: 13}, (_, i) => {
        const h = on ? 10 + Math.abs(Math.sin(t * 9 + i * 1.3)) * 34 : 8 + ((i * 7) % 5) * 4;
        return <rect key={i} x={-78 + i * 12} y={40 - h / 2} width={7} height={h} rx={3} fill={C.white} opacity={0.85} />;
      })}
    </g>
  );
};

/* ================================ A · COLD OPEN ================================ */
const ColdOpen: React.FC = () => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const play = w('L03', 3);
  const a2 = ls('L03') - 0.3;
  const a3 = ls('L07') - 0.25;
  const a4 = ls('L08') - 0.25;
  const camC2 = camAt(t, [[0, {x: 1300, y: 760, z: 1.0}], [a2, {x: 1100, y: 700, z: 1.12}]]);
  const camC1 = camAt(t, [[a2 - 0.3, {x: 1250, y: 760, z: 1.05}], [ls('L05'), {x: 1150, y: 720, z: 1.25}], [a3, {x: 1100, y: 700, z: 1.3}]]);
  const phone1 = artToScreen(C1, camC1, width, height, C1.phone[0], C1.phone[1]);
  const camC4 = camAt(t, [[a3 - 0.3, {x: 1376, y: 800, z: 1.0}], [a4, {x: 1376, y: 800, z: 1.12}]]);
  const camB = camAt(t, [[a4 - 0.3, {x: 1150, y: 720, z: 1.3}], [ls('L10'), {x: 1250, y: 760, z: 1.08}]]);
  return (
    <AbsoluteFill>
      <Shot from={0} to={a2}>
        <ArtCam art={C2} cam={camC2} />
        <Pin label={[1180, 260]} k="REC" v="A QUICK MESSAGE" at={w('L01', 3)} size={34} tone="white" />
      </Shot>
      <Shot from={a2} to={a3} fadeIn={0.35}>
        <ArtCam art={C1} cam={camC1} />
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <PlayUI x={phone1[0]} y={phone1[1]} s={0.8} at={play - 0.3} playing={[play + 0.1, ls('L07')]} />
        </svg>
        <Pin label={[1180, 300]} v="“WAIT. THAT’S MY VOICE?”" at={ls('L05')} size={44} />
        <Pin label={[1180, 460]} k="IT SOUNDS" v="THINNER · MAYBE HIGHER" at={w('L06', 2)} size={34} tone="white" />
        <Pin label={[1180, 600]} k="SOMEHOW" v="LESS LIKE YOU" at={w('L06', 6)} size={34} tone="white" />
      </Shot>
      <Shot from={a3} to={a4} fadeIn={0.3}>
        <ArtCam art={C4} cam={camC4} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}>
          <Appear at={w('L07', 2)} dir="down">
            <Headline text="Suspect #1: the phone?" size={72} align="center" color={C.navy950} />
          </Appear>
        </div>
      </Shot>
      <Shot from={a4} to={ls('L10') - 0.2} fadeIn={0.3}>
        <ArtCam art={C1} cam={camB} />
        <Pin label={[1180, 330]} k="BUT" v="SOMETHING ELSE IS INVOLVED" at={w('L08', 2)} size={34} />
        <Pin label={[1180, 500]} k="WHILE YOU SPEAK" v="YOU HEAR A VERSION OTHERS DON’T" at={w('L09', 4)} size={34} tone="white" maxWidth={700} />
      </Shot>
      <Shot from={ls('L10') - 0.2} to={1e9} fadeIn={0.3}>
        <TitleCard wordTimes={[w('L10', 0), w('L10', 1), w('L10', 2)]} taglineAt={w('L10', 2) + 0.9} tagline="Everyday things. Surprising explanations." />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ B · AIR CONDUCTION (C3) ================================ */
const AirScene: React.FC = () => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const cam: Cam = camAt(t, [[ls('L11') - 0.4, FULL], [ls('L15'), {x: 1450, y: 720, z: 1.06}]]);
  const P = (p: number[]) => artToScreen(C3, cam, width, height, p[0], p[1]);
  const mA = P(C3.mouthA);
  const eB = P(C3.earB);
  const eA = P(C3.earA);
  const toFriend = `M${mA[0] + 20},${mA[1]} C${mix(mA[0], eB[0], 0.35)},${mA[1] - 80} ${mix(mA[0], eB[0], 0.7)},${eB[1] - 70} ${eB[0] - 30},${eB[1]}`;
  const toSelf = `M${mA[0] + 20},${mA[1] + 6} C${mA[0] + 140},${mA[1] - 30} ${mA[0] + 60},${eA[1] - 150} ${eA[0] - 10},${eA[1] - 40}`;
  return (
    <AbsoluteFill>
      <ArtCam art={C3} cam={cam} />
      <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
        <FlowPath d={toFriend} at={w('L12', 3)} color={YEL} width={6} dots={6} speed={0.5} />
        <FlowPath d={toSelf} at={w('L13', 11)} color={YEL} width={6} dots={4} speed={0.6} />
      </svg>
      <Pin label={[1180, 160]} side="center" k="THE ROUTE THROUGH THE AIR" v="AIR CONDUCTION" at={w('L14', 4)} size={40} />
      <RouteLegend at={w('L12', 3)} bone={false} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ C · BONE CONDUCTION (head diagram) ================================ */
const HeadScene: React.FC<{from: number}> = ({from}) => {
  const t = useT();
  const bone = w('L16', 0);
  const combo = w('L18', 8);
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <HeadBase vib={ramp(t, bone, bone + 0.6)} />
        <LiveRoutes air={[from + 0.6, 1e9]} bone={[bone + 0.3, 1e9]} />
        <GoldRing x={HP.inner[0]} y={HP.inner[1]} r={44} at={w('L16', 12)} />
      </svg>
      <Pin target={[1250, 186]} label={[1330, 120]} k="ROUTE 1" v="THROUGH THE AIR" at={from + 0.8} size={30} />
      <Pin target={[930, 520]} label={[60, 860]} k="ROUTE 2" v="THROUGH BONE AND TISSUE" at={bone + 0.4} size={30} tone="white" />
      <Pin target={HP.inner} label={[60, 300]} v="INNER EAR" at={w('L16', 12)} size={32} />
      <Pin label={[1360, 640]} k="PART OF WHAT’S CALLED" v="BONE CONDUCTION" at={w('L17', 5)} size={34} />
      <Pin label={[1360, 780]} side="right" k="WHAT YOU HEAR WHILE TALKING" v="AIR + BONE, COMBINED" at={combo} size={34} />
      <RouteLegend at={bone} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ D · TWO PATHS ON A MAP ================================ */
const MapScene: React.FC = () => {
  const t = useT();
  const start: [number, number] = [520, 600];
  const end: [number, number] = [1400, 600];
  const outer = `M${start[0]},${start[1]} C560,180 1360,180 ${end[0]},${end[1]}`;
  const inner = `M${start[0]},${start[1]} C760,680 1160,680 ${end[0]},${end[1]}`;
  const pin = (p: [number, number], label: string, at: number) => (
    <g opacity={ramp(t, at, at + 0.3)}>
      <circle cx={p[0]} cy={p[1]} r={20} fill={C.white} />
      <circle cx={p[0]} cy={p[1]} r={9} fill={C.navy950} />
      <text x={p[0]} y={p[1] + 62} textAnchor="middle" fill={C.white} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 28, letterSpacing: '0.12em'}}>
        {label}
      </text>
    </g>
  );
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <rect x={430} y={430} width={1060} height={360} rx={180} fill="rgba(86,214,234,0.06)" stroke={CYAN} strokeDasharray="10 10" strokeWidth={3} opacity={ramp(t, w('L23', 2), w('L23', 2) + 0.4)} />
        <text x={960} y={770} textAnchor="middle" fill={CYAN} opacity={ramp(t, w('L23', 2), w('L23', 2) + 0.4)} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em'}}>
          INSIDE YOUR HEAD
        </text>
        <FlowPath d={outer} at={w('L22', 1)} color={YEL} width={7} dots={7} speed={0.3} />
        <FlowPath d={inner} at={w('L23', 2)} color={CYAN} width={7} dots={5} speed={0.45} />
        {pin(start, 'MOUTH', ls('L21'))}
        {pin(end, 'INNER EAR', ls('L21') + 0.3)}
      </svg>
      <Pin label={[960, 170]} side="center" v="THROUGH THE ROOM" at={w('L22', 5)} size={30} />
      <Pin label={[960, 920]} side="center" k="BOTH CONTRIBUTE TO" v="THE VOICE YOU RECOGNIZE AS YOURS" at={w('L24', 1)} size={32} />
      <RouteLegend at={ls('L21')} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ E · THE PHONE ================================ */
const PhoneScene: React.FC = () => {
  const t = useT();
  const mic = w('L26', 2);
  const notCap = w('L27', 1);
  const play = w('L28', 2);
  const playing = play > 0 && t >= play;
  const changed = ls('L31');
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <HeadBase />
        {!playing && <FlowPath d={AIR_TO_PHONE} at={mic} until={play - 0.2} color={YEL} width={6} dots={5} speed={0.6} />}
        {!playing && <FlowPath d={BONE_1} at={notCap} until={play - 0.2} color={CYAN} width={6} dots={4} speed={0.6} />}
        {!playing && <FlowPath d={BONE_2} at={notCap + 0.2} until={play - 0.2} color={CYAN} width={6} dots={4} speed={0.6} />}
        {playing && <FlowPath d={PHONE_TO_EAR} at={play} color={YEL} width={6} dots={6} speed={0.35} />}
        {playing && (
          <g opacity={0.35 * ramp(t, play, play + 0.4)}>
            <path d={BONE_1} stroke={C.navy300} strokeWidth={4} strokeDasharray="6 10" fill="none" />
            <path d={BONE_2} stroke={C.navy300} strokeWidth={4} strokeDasharray="6 10" fill="none" />
          </g>
        )}
        <PhoneIcon x={HP.phone[0]} y={HP.phone[1]} on={ramp(t, ls('L25'), ls('L25') + 0.4)} speaker={playing} />
      </svg>
      <Pin target={[1470, 594]} label={[1560, 340]} side="center" k="AN ORDINARY MICROPHONE" v="RECORDS SOUND THROUGH THE AIR" at={mic + 0.3} until={play - 0.3} size={26} maxWidth={520} />
      <Pin target={[930, 560]} label={[60, 860]} k="NOT CAPTURED OR RECREATED" v="VIBRATIONS THROUGH YOUR HEAD" mark="cross" tone="white" at={notCap + 0.6} until={play - 0.3} size={26} />
      <Pin target={[1470, 600]} label={[1560, 340]} side="center" k="PLAYBACK" v="NOW YOU’RE THE LISTENER" at={w('L29', 10)} size={28} />
      <Pin target={[930, 560]} label={[60, 860]} v="NO INTERNAL ROUTE ON PLAYBACK" tone="white" at={play + 0.4} size={26} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 26, display: 'flex', justifyContent: 'center', gap: 40}}>
        <Appear at={ls('L30')}>
          <Headline text="The voice is yours." size={56} />
        </Appear>
        <Appear at={changed}>
          <Headline text="The route has changed." size={56} color={C.gold} />
        </Appear>
      </div>
      <RouteLegend at={ls('L25')} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ F · TONAL BALANCE + SAME-TAKE DEMO ================================ */
export const DEMO = {a: () => le('L35') + 0.57, b: () => le('L35') + 2.97, dur: 1.66};

const Bars: React.FC<{x: number; title: string; color: string; levels: number[]; at: number}> = ({x, title, color, levels, at}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.4);
  return (
    <g opacity={o} transform={`translate(${x} 0)`}>
      <text x={150} y={300} textAnchor="middle" fill={C.white} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 26, letterSpacing: '0.1em'}}>
        {title}
      </text>
      {['LOWS', 'MIDS', 'HIGHS'].map((n, i) => {
        const h = 300 * levels[i] * ramp(t, at + 0.2 + i * 0.1, at + 0.7 + i * 0.1);
        return (
          <g key={n}>
            <rect x={20 + i * 95} y={720 - h} width={70} height={h} rx={10} fill={color} opacity={0.9} />
            <text x={55 + i * 95} y={760} textAnchor="middle" fill={C.navy200} style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 20, letterSpacing: '0.1em'}}>
              {n}
            </text>
          </g>
        );
      })}
    </g>
  );
};

const BalanceScene: React.FC = () => {
  const t = useT();
  const dA = DEMO.a();
  const dB = DEMO.b();
  const demoOn = t >= le('L35') + 0.1 && t < ls('L36') - 0.1;
  const prod = w('L39', 1);
  return (
    <AbsoluteFill>
      <GridBg />
      <Shot from={0} to={le('L35') + 0.1}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <Bars x={520} title="WHILE SPEAKING" color={C.gold} levels={[0.95, 0.8, 0.6]} at={w('L34', 0)} />
          <Bars x={1080} title="ON A RECORDING" color={C.paper} levels={[0.6, 0.8, 0.62]} at={w('L35', 5)} />
        </svg>
        <Pin label={[960, 150]} side="center" k="BONE AND TISSUE CHANGE" v="THE BALANCE OF FREQUENCIES" at={w('L34', 3)} size={34} />
        <Pin label={[960, 880]} side="center" k="ONE REASON A RECORDING CAN SEEM" v="THINNER · LESS FULL" at={w('L35', 7)} size={32} tone="white" />
        <SimpleTag schematic text="Simplified illustration. Tonal balance shown qualitatively, not measured." />
      </Shot>
      <Shot from={le('L35') + 0.1} to={ls('L36') + 4.6} fadeIn={0.3}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          <Headline text="Same take, two tonal balances" size={64} align="center" />
          <span style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 28, color: C.goldLight}}>Same words · same pitch · matched loudness</span>
        </div>
        {[
          ['A', 'AS RECORDED', dA],
          ['B', 'SUBTLE EQ CHANGE: FULLER LOWS', dB],
        ].map(([k, label, at], i) => {
          const start = at as number;
          const on = t >= start && t < start + DEMO.dur;
          const p = pop(Math.round(t * 30), 30, start - 0.3, 14);
          return (
            <div key={k as string} style={{position: 'absolute', left: 300 + i * 700, top: 420, width: 620, opacity: Math.min(1, p * 1.4), padding: '30px 34px', borderRadius: 22, background: 'rgba(6,15,34,0.92)', border: `4px solid ${on ? C.gold : C.navy500}`}}>
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: on ? C.gold : C.white}}>{k as string}</div>
              <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 28, color: C.white, marginTop: 6}}>{label as string}</div>
              <div style={{display: 'flex', gap: 8, marginTop: 24, height: 70, alignItems: 'center'}}>
                {Array.from({length: 20}, (_, j) => (
                  <div key={j} style={{width: 14, borderRadius: 4, background: on ? C.gold : C.navy400, height: on ? 14 + Math.abs(Math.sin(t * 11 + j * 1.7)) * 52 : 12}} />
                ))}
              </div>
              <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 24, color: C.navy200, marginTop: 18}}>“Wait. That’s my voice?”</div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, display: 'flex', justifyContent: 'center', opacity: demoOn ? 1 : ramp(t, ls('L36'), ls('L36') + 0.3)}}>
          <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.06em', color: C.navy950, background: C.gold, padding: '10px 22px', borderRadius: 10}}>Illustration — not an exact simulation.</span>
        </div>
        <Pin label={[960, 960]} side="center" mark="cross" tone="white" v="NOT A UNIVERSAL BASS SETTING" at={w('L36', 5)} size={30} />
      </Shot>
      <Shot from={ls('L36') + 4.6} to={1e9} fadeIn={0.3}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <HeadBase vib={ramp(t, ls('L37'), ls('L37') + 0.6)} />
          <LiveRoutes air={[ls('L37'), 1e9]} bone={[ls('L37') + 0.2, 1e9]} />
        </svg>
        <Pin label={[1360, 260]} k="SELF-VOICE RESEARCH POINTS TO" v="THE PHYSICAL SENSATIONS" at={w('L37', 7)} size={30} />
        <Pin label={[1360, 420]} k="SPEAKING MEANS" v="PRODUCING THE SOUND" at={prod} size={30} tone="white" />
        <Pin label={[1360, 560]} k="AND AT THE SAME TIME" v="FEELING ITS VIBRATIONS" at={w('L39', 4)} size={30} />
        <Pin label={[720, 1010]} side="center" k="SOURCE" v="ROYAL SOCIETY OPEN SCIENCE (2023)" at={w('L37', 2)} size={22} tone="white" />
        <RouteLegend at={ls('L37')} x={1880} y={1040} />
        <SimpleTag />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ G · THE ACT OF SPEAKING (split) ================================ */
const Half: React.FC<{left: number; a: typeof C1; shift: number; children?: React.ReactNode}> = ({left, a, shift, children}) => (
  <div style={{position: 'absolute', left, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: shift, top: 0, width: 1920, height: 1080}}>
      <ArtCam art={a} cam={{x: 1376, y: 768, z: 1.0}} />
    </div>
    {children}
  </div>
);

const SpeakScene: React.FC = () => (
  <AbsoluteFill style={{background: C.navy900}}>
    <Half left={0} a={C2} shift={-110} />
    <Half left={960} a={C1} shift={-260} />
    <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: C.gold}} />
    <Pin label={[480, 120]} side="center" k="SPEAKING" v="YOU MAKE THE WORDS" at={w('L41', 7)} size={32} />
    <Pin label={[1440, 120]} side="center" k="PLAYBACK" v="A RECORDING REMOVES THAT ACT" at={w('L42', 2)} size={32} tone="white" />
    <Pin label={[1440, 640]} side="center" v="WORDS, WITHOUT MAKING THEM" at={ls('L43')} size={28} tone="white" />
    <Pin label={[1440, 760]} side="center" v="TIMING, WITHOUT CONTROLLING IT" at={ls('L44')} size={28} tone="white" />
    <Pin label={[1440, 880]} side="center" v="YOUR VOICE, FROM SOMEWHERE ELSE" at={ls('L45')} size={28} tone="white" />
  </AbsoluteFill>
);

/* ================================ H · OTHER PEOPLE ================================ */
const OthersScene: React.FC = () => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const cam: Cam = {x: 1450, y: 720, z: 1.06};
  const P = (p: number[]) => artToScreen(C3, cam, width, height, p[0], p[1]);
  const mA = P(C3.mouthA);
  const eB = P(C3.earB);
  const toFriend = `M${mA[0] + 20},${mA[1]} C${mix(mA[0], eB[0], 0.35)},${mA[1] - 80} ${mix(mA[0], eB[0], 0.7)},${eB[1] - 70} ${eB[0] - 30},${eB[1]}`;
  const f = ls('L52');
  const factors = [
    ['THE MICROPHONE', w('L52', 1)],
    ['ITS POSITION', w('L52', 3)],
    ['THE ROOM', w('L52', 5)],
    ['AUDIO PROCESSING', w('L52', 8)],
    ['THE PLAYBACK SPEAKER', w('L52', 11)],
  ] as Array<[string, number]>;
  return (
    <AbsoluteFill>
      <Shot from={0} to={ls('L51') - 0.2}>
        <ArtCam art={C3} cam={cam} />
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <FlowPath d={toFriend} at={w('L49', 3)} color={YEL} width={6} dots={6} speed={0.5} />
        </svg>
        <Pin label={[960, 120]} side="center" v="“IS THE RECORDING WHAT I REALLY SOUND LIKE?”" at={ls('L48')} size={36} />
        <Pin label={[1180, 900]} k="A RECORDING CAPTURES" v="THE AIRBORNE SOUND OTHERS RECEIVE" at={w('L49', 3)} size={30} />
        <Pin label={[180, 900]} k="NOT INCLUDED" v="YOUR INTERNAL VIBRATIONS" at={w('L49', 15)} size={26} tone="white" mark="cross" />
        <RouteLegend at={w('L49', 3)} bone={false} x={1880} y={110} />
      </Shot>
      <Shot from={ls('L51') - 0.2} to={1e9} fadeIn={0.35}>
        <GridBg />
        <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}>
          <Appear at={ls('L51')}>
            <Headline text="Not a perfect copy of another person’s experience" size={54} align="center" maxWidth={1500} />
          </Appear>
        </div>
        <div style={{position: 'absolute', left: 160, right: 160, top: 330, display: 'flex', flexWrap: 'wrap', gap: 26, justifyContent: 'center'}}>
          {factors.map(([n, at]) => (
            <Appear key={n} at={Math.max(at, f)} dir="scale">
              <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: C.white, padding: '18px 30px', border: `3px solid ${C.gold}`, borderRadius: 16, background: 'rgba(6,15,34,0.9)'}}>{n}</div>
            </Appear>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 660, display: 'flex', justifyContent: 'center', gap: 40}}>
          <Card at={ls('L53')} mark="check" text="A useful perspective" width={680} size={44} />
          <Card at={ls('L54')} mark="cross" tone="white" text="Not a final verdict" width={680} size={44} />
        </div>
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ I · UNFAMILIAR ≠ BAD ================================ */
const UnfamiliarScene: React.FC = () => {
  const t = useT();
  const cam = camAt(t, [[ls('L55') - 0.4, {x: 1376, y: 768, z: 1.0}], [ls('L59'), {x: 1500, y: 720, z: 1.08}]]);
  return (
    <AbsoluteFill>
      <ArtCam art={C3} cam={cam} />
      <Pin label={[960, 130]} side="center" v="UNFAMILIAR ≠ BAD" at={w('L55', 2)} size={48} />
      <Pin label={[1250, 880]} k="THEY KNOW YOU FROM" v="THE VOICE THAT REACHES THEM" at={ls('L57')} size={30} />
      <Pin label={[120, 880]} k="YOU’RE THE ONE WITH" v="A DIFFERENT LISTENING PERSPECTIVE" at={w('L58', 2)} size={30} tone="white" />
    </AbsoluteFill>
  );
};

/* ================================ J · HEARING: TWO ROUTES ================================ */
const HearingScene: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <HeadBase vib={ramp(t, w('L62', 0), w('L62', 0) + 0.5)} />
        <LiveRoutes air={[w('L61', 0), 1e9]} bone={[w('L62', 0), 1e9]} />
        <GoldRing x={HP.inner[0]} y={HP.inner[1]} r={44} at={w('L60', 7)} />
      </svg>
      <Pin target={HP.inner} label={[60, 300]} k="HEARING DEPENDS ON HOW VIBRATIONS" v="REACH THE INNER EAR" at={w('L60', 4)} size={28} />
      <Pin target={[1250, 186]} label={[1330, 120]} v="AIR IS ONE ROUTE" at={w('L61', 0)} size={32} />
      <Pin target={[930, 520]} label={[60, 860]} v="BONE IS ANOTHER" at={w('L62', 0)} size={32} tone="white" />
      <Pin label={[720, 1010]} side="center" k="SOURCE" v="IMPERIAL COLLEGE LONDON" at={w('L63', 2)} size={22} tone="white" />
      <RouteLegend at={w('L61', 0)} x={1880} y={1040} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ K · OUTRO ================================ */
const Outro: React.FC = () => {
  const t = useT();
  const {width, height} = useVideoConfig();
  const s2 = ls('L65') - 0.3;
  const s3 = ls('L70') - 0.35;
  const words: [number, number, number] = [w('L71', 1), w('L71', 2), w('L71', 3)];
  const s4 = words[0] - 0.35;
  const lift = 170 * ramp(t, words[2] + 2.2, words[2] + 3.2, Easing.inOut(Easing.cubic));
  const cam = camAt(t, [[ls('L64') - 0.4, {x: 1250, y: 760, z: 1.05}], [s2, {x: 1150, y: 720, z: 1.25}]]);
  const phone = artToScreen(C1, cam, width, height, C1.phone[0], C1.phone[1]);
  return (
    <AbsoluteFill>
      <Shot from={0} to={s2}>
        <ArtCam art={C1} cam={cam} />
        <svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
          <PlayUI x={phone[0]} y={phone[1]} s={0.8} at={ls('L64')} playing={[w('L64', 4), s2]} />
        </svg>
        <Pin label={[1180, 320]} v="“THAT CAN’T BE ME”" at={w('L64', 8)} size={42} />
      </Shot>
      <Shot from={s2} to={s3} fadeIn={0.35}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <HeadBase vib={ramp(t, w('L66', 9), w('L66', 9) + 0.5)} />
          <LiveRoutes air={[w('L66', 4), 1e9]} bone={[w('L66', 9), 1e9]} />
        </svg>
        <Pin label={[1360, 300]} k="REMEMBER" v="THE TWO PATHS" at={ls('L65')} size={34} />
        <Pin label={[1360, 470]} k="AN ORDINARY RECORDING" v="DOESN’T RECREATE THAT COMBINATION" at={ls('L67')} size={28} tone="white" maxWidth={520} />
        <Pin label={[1360, 650]} k="NOT A STRANGE NEW VOICE" v="A FAMILIAR VOICE, FROM A LESS FAMILIAR POSITION" at={ls('L69')} size={28} maxWidth={520} />
        <RouteLegend at={w('L66', 4)} x={1880} y={1040} />
        <SimpleTag />
      </Shot>
      <Shot from={s3} to={s4}>
        <AbsoluteFill style={{background: C.navy950, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 24}}>
          <Appear at={ls('L70')}>
            <Headline text="Everyday things." size={92} align="center" />
          </Appear>
          <Appear at={w('L70', 2)}>
            <Headline text="Surprising explanations." size={92} color={C.gold} align="center" />
          </Appear>
        </AbsoluteFill>
      </Shot>
      <Shot from={s4} to={1e9} fadeIn={0.3}>
        <TitleCard wordTimes={words} tagline="Everyday things. Surprising explanations." taglineAt={words[2] + 0.9} lift={lift} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ composition ================================ */
export const ep003Windows = () => ({
  air: ls('L11') - 0.35,
  bone: ls('L15') - 0.35,
  map: ls('L21') - 0.35,
  phone: ls('L25') - 0.35,
  balance: ls('L32') - 0.35,
  speak: ls('L40') - 0.35,
  others: ls('L47') - 0.35,
  unfamiliar: ls('L55') - 0.35,
  hearing: ls('L59') - 0.35,
  outro: ls('L64') - 0.35,
});

const ORDER: Array<[keyof ReturnType<typeof ep003Windows>, string]> = [
  ['air', 'B AIR'],
  ['bone', 'C BONE'],
  ['map', 'D MAP'],
  ['phone', 'E PHONE'],
  ['balance', 'F BALANCE + DEMO'],
  ['speak', 'G SPEAKING'],
  ['others', 'H OTHERS'],
  ['unfamiliar', 'I UNFAMILIAR'],
  ['hearing', 'J HEARING'],
  ['outro', 'K OUTRO'],
];

export const Ep003Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = ep003Windows();
  const {fps} = useVideoConfig();
  const scenes: Record<string, React.ReactNode> = {
    air: <AirScene />,
    bone: <HeadScene from={W.bone} />,
    map: <MapScene />,
    phone: <PhoneScene />,
    balance: <BalanceScene />,
    speak: <SpeakScene />,
    others: <OthersScene />,
    unfamiliar: <UnfamiliarScene />,
    hearing: <HearingScene />,
    outro: <Outro />,
  };
  const next = (i: number) => (i + 1 < ORDER.length ? W[ORDER[i + 1][0]] : 1e9);
  const sectionAt = (t: number) => {
    let n = 'A COLD OPEN';
    for (const [k, name] of ORDER) if (t >= W[k]) n = name;
    return n;
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      {/* same-take demo: identical clip, B differs only by a gentle EQ, loudness-matched (-22.1 LUFS each) */}
      <Sequence from={Math.round(DEMO.a() * fps)} durationInFrames={Math.round(DEMO.dur * fps) + 2} layout="none">
        <Audio src={staticFile('audio/ep003/demo_A_as_recorded.wav')} />
      </Sequence>
      <Sequence from={Math.round(DEMO.b() * fps)} durationInFrames={Math.round(DEMO.dur * fps) + 2} layout="none">
        <Audio src={staticFile('audio/ep003/demo_B_eq_illustration.wav')} />
      </Sequence>
      <Sfx at={ls('L10') - 0.35} file="whoosh.wav" vol={0.28} dur={0.7} />
      <Sfx at={w('L10', 2) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
      {ORDER.map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={w('L71', 3) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
      <Shot from={0} to={W.air}>
        <ColdOpen />
      </Shot>
      {ORDER.map(([k], i) => (
        <Shot key={k} from={W[k]} to={next(i)} fadeIn={0.35}>
          {scenes[k]}
        </Shot>
      ))}
      {showCaptions && <CaptionOverlay captions={ep003Captions} />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP003 FULL · REVIEW COPY" notForPublication={timing.notForPublication === true} unresolved={[]} />
    </AbsoluteFill>
  );
};
