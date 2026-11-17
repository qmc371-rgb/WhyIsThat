// EP003 Short (1080x1920, ~26 s): the same narration recording cut at line boundaries
// (L05 → L16 → L26 → L27 → L69 → L71), the head diagram reframed vertically, burned-in captions.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {makeTiming} from '../../lib/timing';
import {ramp} from '../../lib/anim';
import {useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import {TitleCard} from '../../components/TitleCard';
import shortJson from '../../data/ep003_short/narration_timing.json';
import shortCaptions from '../../data/ep003_short/captions.json';
import {ArtCam, FlowPath, Pin} from '../ep002/parts';
import {AIR_TO_PHONE, BONE_1, BONE_2, CYAN, HeadBase, LiveRoutes, PhoneIcon, HP, YEL} from './Head';
import {C1} from './Ep003Full';

const ST = makeTiming(shortJson);
const wd = (id: string, i: number) => ST.line(id).words[i].start;
const ls = (id: string) => ST.line(id).start;

type Cap = {text: string; startMs: number; endMs: number};
const wrapRows = (text: string, row: number): string[] => {
  if (text.length <= row) return [text];
  const w = text.split(' ');
  let best: string[] | null = null;
  let cost = 1e9;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(' ');
    const b = w.slice(i).join(' ');
    if (a.length <= row && b.length <= row && Math.abs(a.length - b.length) < cost) {
      best = [a, b];
      cost = Math.abs(a.length - b.length);
    }
  }
  return best ?? [text];
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cap = (shortCaptions as Cap[]).find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cap) return null;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1415, display: 'flex', justifyContent: 'center'}}>
      <div style={{maxWidth: 940, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 58, lineHeight: 1.22, color: C.white, background: 'rgba(6,15,34,0.86)', padding: '14px 26px', borderRadius: 18}}>
        {wrapRows(cap.text, 24).map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
};

const Header: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 290, background: `linear-gradient(180deg, ${C.navy950} 0%, rgba(6,15,34,0.92) 70%, rgba(6,15,34,0) 100%)`}}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 118, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.white}}>
      WHY IS THAT<span style={{color: C.gold}}>?</span>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, top: 172, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 40, lineHeight: 1.1, color: C.goldLight}}>Why does your voice sound weird on recordings?</div>
  </div>
);

const Tag: React.FC<{y: number}> = ({y}) => (
  <div style={{position: 'absolute', left: 40, top: y, fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.7)', padding: '5px 10px', borderRadius: 8}}>Simplified illustration.</div>
);

const Legend: React.FC<{y: number; bone?: boolean}> = ({y, bone = true}) => (
  <div style={{position: 'absolute', right: 40, top: y, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT.ui, fontWeight: 800, fontSize: 21, letterSpacing: '0.08em'}}>
    <span style={{color: YEL, whiteSpace: 'nowrap'}}>━ ━ ▶ SOUND THROUGH AIR</span>
    {bone && <span style={{color: CYAN, whiteSpace: 'nowrap'}}>━ ━ ▶ VIBRATIONS THROUGH BONE AND TISSUE</span>}
  </div>
);

export const Ep003Short: React.FC = () => {
  const t = useT();
  const b2 = ls('L16') - 0.25;
  const b3 = ls('L26') - 0.25;
  const b4 = ls('L69') - 0.25;
  const b5 = ls('L71') - 0.3;
  const mic = wd('L26', 2);
  const notCap = wd('L27', 1);
  const head = (children: React.ReactNode) => (
    <svg width={1080} height={970} viewBox="600 90 1000 900" style={{position: 'absolute', left: 0, top: 330}}>
      {children}
    </svg>
  );
  return (
    <AbsoluteFill style={{background: C.navy950}}>
      <Audio src={staticFile(ST.timing.audio)} />
      {[b2, b3, b4, b5].map((x) => (
        <Sfx key={x} at={x - 0.2} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={wd('L71', 3) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />

      <Shot from={0} to={b2}>
        <ArtCam art={C1} cam={{x: 1000, y: 760, z: 1.0 + 0.1 * ramp(t, 0, b2)}} />
      </Shot>

      <Shot from={b2} to={b3} fadeIn={0.35}>
        <AbsoluteFill style={{background: C.navy900}} />
        {head(
          <>
            <HeadBase vib={ramp(t, ls('L16'), ls('L16') + 0.6)} />
            <LiveRoutes air={[b2 + 0.4, 1e9]} bone={[ls('L16') + 0.2, 1e9]} />
          </>,
        )}
        <Pin label={[540, 1180]} side="center" k="WHILE YOU SPEAK" v="VIBRATIONS REACH YOUR INNER EAR TOO" at={wd('L16', 4)} size={30} />
        <Legend y={1265} />
        <Tag y={1360} />
      </Shot>

      <Shot from={b3} to={b4} fadeIn={0.35}>
        <AbsoluteFill style={{background: C.navy900}} />
        {head(
          <>
            <HeadBase />
            <FlowPath d={AIR_TO_PHONE} at={mic} color={YEL} width={6} dots={5} speed={0.6} />
            <FlowPath d={BONE_1} at={notCap} color={CYAN} width={6} dots={4} speed={0.6} />
            <FlowPath d={BONE_2} at={notCap + 0.2} color={CYAN} width={6} dots={4} speed={0.6} />
            <PhoneIcon x={HP.phone[0]} y={HP.phone[1]} on={ramp(t, b3, b3 + 0.4)} />
          </>,
        )}
        <Pin label={[540, 1150]} side="center" k="AN ORDINARY MICROPHONE" v="RECORDS SOUND THROUGH THE AIR" at={mic + 0.2} size={30} />
        <Pin label={[540, 1260]} side="center" mark="cross" tone="white" v="NOT THE VIBRATIONS IN YOUR HEAD" at={notCap + 0.4} size={30} />
        <Legend y={1335} />
      </Shot>

      <Shot from={b4} to={b5} fadeIn={0.35}>
        <ArtCam art={C1} cam={{x: 1000, y: 760, z: 1.05}} />
        <Pin label={[540, 1220]} side="center" k="NOT A STRANGE NEW VOICE" v="A FAMILIAR VOICE, A LESS FAMILIAR POSITION" at={ls('L69')} size={30} maxWidth={940} />
      </Shot>

      <Shot from={b5} to={1e9} fadeIn={0.3}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 3414, transform: 'scale(0.5625)', transformOrigin: 'top left'}}>
          <TitleCard wordTimes={[wd('L71', 1), wd('L71', 2), wd('L71', 3)]} tagline="Everyday things. Surprising explanations." taglineAt={wd('L71', 3) + 0.6} />
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 1210, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 38, color: C.white, opacity: ramp(t, wd('L71', 3) + 0.9, wd('L71', 3) + 1.4)}}>Full explanation on the channel</div>
      </Shot>

      <Header />
      <Captions />
    </AbsoluteFill>
  );
};
