// Short004 — "The 'Colder' Material Melts Ice Faster?!" (1080x1920, standalone narration),
// plus its vertical cover and the EP004 main thumbnail. Ordinary Has Secrets branding.
// Captions sit in the upper-middle band, clear of the Shorts UI at the bottom and right.
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BrandCard, OhsLogo} from '../../brand/ohs';
import {makeTiming} from '../../lib/timing';
import {ramp} from '../../lib/anim';
import {useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import shortJson from '../../data/ep004_short/narration_timing.json';
import shortCaptions from '../../data/ep004_short/captions.json';
import {ArtCam, ForceArrow} from '../ep002/parts';
import {Block, D3, D4, Finger, Ice} from './Ep004Full';

const ST = makeTiming(shortJson);
const sw = (id: string, i: number) => ST.line(id).words[i].start;
const ss = (id: string) => ST.line(id).start;

// D4 cover-fit in 1080x1920: top faces of the blocks (measured on the plate)
const METAL_TOP: [number, number] = [288, 985];
const WOOD_TOP: [number, number] = [789, 985];

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
const Captions: React.FC<{top?: number}> = ({top = 560}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cap = (shortCaptions as Cap[]).find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cap) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 180, top, display: 'flex', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 54, lineHeight: 1.22, color: C.white, background: 'rgba(6,15,34,0.86)', padding: '12px 24px', borderRadius: 18}}>
        {wrapRows(cap.text, 24).map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
};

const Big: React.FC<{text: React.ReactNode; top: number; at: number; until?: number; size?: number}> = ({text, top, at, until = 1e9, size = 92}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.25) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: size, lineHeight: 1.02, color: C.white, opacity: o, transform: `scale(${0.9 + 0.1 * o})`, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>
      {text}
    </div>
  );
};

const Note: React.FC<{y: number}> = ({y}) => (
  <div style={{position: 'absolute', left: 60, top: y, fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, color: C.navy200, background: 'rgba(6,15,34,0.75)', padding: '6px 12px', borderRadius: 8}}>
    Simplified illustration. Qualitative, not a timed result.
  </div>
);

export const Short004: React.FC = () => {
  const t = useT();
  const s2 = ss('L02');
  const s3 = ss('L03') - 0.2;
  const s4 = ss('L04') - 0.2;
  const s5 = ss('L05') - 0.2;
  const s6 = ss('L06') - 0.3;
  const meltM = ramp(t, s2 + 0.2, s2 + 2.6, Easing.inOut(Easing.quad));
  const meltW = 0.25 * ramp(t, s2 + 0.2, s3, Easing.linear);
  return (
    <AbsoluteFill style={{background: C.navy950}}>
      <Audio src={staticFile(ST.timing.audio)} />
      {[s3, s4, s5, s6].map((x) => (
        <Sfx key={x} at={x - 0.2} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={sw('L06', 2) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />

      <Shot from={0} to={s3}>
        <ArtCam art={D4} cam={{x: 768, y: 1376, z: 1}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <Ice x={METAL_TOP[0]} y={METAL_TOP[1]} size={130} melt={0.85 * meltM} />
          <Ice x={WOOD_TOP[0]} y={WOOD_TOP[1]} size={130} melt={meltW} />
        </svg>
        <Big text={<>WHICH MELTS <span style={{color: C.gold}}>FIRST?</span></>} top={190} at={0} until={s2 - 0.1} />
        <Big text={<>“COLDER” METAL<br /><span style={{color: C.gold}}>MELTS IT FASTER</span></>} top={170} at={s2} size={80} />
        <div style={{position: 'absolute', left: METAL_TOP[0], top: 1300, transform: 'translateX(-50%)', fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: C.white, letterSpacing: '0.12em'}}>METAL</div>
        <div style={{position: 'absolute', left: WOOD_TOP[0], top: 1300, transform: 'translateX(-50%)', fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: C.navy950, letterSpacing: '0.12em'}}>WOOD</div>
        <Note y={1500} />
      </Shot>

      <Shot from={s3} to={s5} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <Block x={240} y={1150} w={600} h={260} kind="metal" />
          {t < s4 ? (
            <>
              <Finger x={540} y={1150} s={1.05} />
              <ForceArrow from={[440, 990]} to={[440, 1190]} at={sw('L03', 6)} w={20} head={44} />
              <ForceArrow from={[640, 990]} to={[640, 1190]} at={sw('L03', 8)} w={20} head={44} />
            </>
          ) : (
            <>
              <Ice x={540} y={1150} size={170} melt={0.6 * ramp(t, sw('L04', 6), s5, Easing.inOut(Easing.quad))} />
              <ForceArrow from={[400, 1300]} to={[470, 1150]} at={sw('L04', 6)} w={20} head={44} />
              <ForceArrow from={[680, 1300]} to={[610, 1150]} at={sw('L04', 6) + 0.1} w={20} head={44} />
            </>
          )}
        </svg>
        <Big text={<>YOUR HAND IS <span style={{color: C.gold}}>WARMER</span></>} top={190} at={sw('L03', 2)} until={s4 - 0.1} size={78} />
        <Big text={<>ICE IS <span style={{color: '#BFD3EE'}}>COLDER</span></>} top={190} at={s4 + 0.2} size={78} />
        <div style={{position: 'absolute', left: 60, right: 60, top: 1440, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: C.goldLight}}>
          {t < s4 ? 'HEAT FLOWS FROM YOUR SKIN INTO THE METAL' : 'NOW HEAT FLOWS FROM THE METAL INTO THE ICE'}
        </div>
        <Note y={1500} />
      </Shot>

      <Shot from={s5} to={s6} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}} />
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <Block x={70} y={1150} w={420} h={220} kind="metal" />
          <Finger x={280} y={1150} s={0.8} />
          <ForceArrow from={[200, 1010]} to={[200, 1180]} at={s5} w={16} head={36} />
          <Block x={590} y={1150} w={420} h={220} kind="metal" />
          <Ice x={800} y={1150} size={130} melt={0.3} />
          <ForceArrow from={[700, 1290]} to={[760, 1150]} at={s5} w={16} head={36} />
        </svg>
        <Big text={<>SAME MATERIAL.<br /><span style={{color: C.gold}}>OPPOSITE DIRECTION.</span></>} top={180} at={ss('L05')} size={76} />
        <Note y={1450} />
      </Shot>

      <Shot from={s6} to={1e9} fadeIn={0.3}>
        <BrandCard wordTimes={[sw('L06', 0), sw('L06', 1), sw('L06', 2)]} />
      </Shot>

      {t < s6 && <Captions />}
    </AbsoluteFill>
  );
};

/** Vertical Short cover (1080x1920 still). */
export const Short004Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.navy950}}>
    <ArtCam art={D4} cam={{x: 768, y: 1376, z: 1}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <Ice x={METAL_TOP[0]} y={METAL_TOP[1]} size={130} melt={0.7} />
      <Ice x={WOOD_TOP[0]} y={WOOD_TOP[1]} size={130} melt={0.1} />
    </svg>
    <div style={{position: 'absolute', left: METAL_TOP[0], top: 1300, transform: 'translateX(-50%)', fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: C.white, letterSpacing: '0.12em'}}>METAL</div>
    <div style={{position: 'absolute', left: WOOD_TOP[0], top: 1300, transform: 'translateX(-50%)', fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: C.navy950, letterSpacing: '0.12em'}}>WOOD</div>
    <div style={{position: 'absolute', left: 40, right: 40, top: 190, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 128, lineHeight: 1.0, color: C.white, textShadow: '0 8px 0 rgba(6,15,34,0.6)'}}>
      COLDER…
      <br />
      <span style={{color: C.gold}}>MELTS FASTER?!</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1500, display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, background: 'rgba(6,15,34,0.9)', padding: '12px 26px', borderRadius: 20}}>
      <OhsLogo size={80} />
      <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 44, color: C.white}}>
        ORDINARY HAS <span style={{color: C.gold}}>SECRETS</span>
      </span>
      </div>
    </div>
  </AbsoluteFill>
);

/** Main thumbnail (1280x720): character, metal vs wood, fingertips touching, "SAME TEMPERATURE?!". */
export const Ep004Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: C.navy950}}>
    <ArtCam art={D3} cam={{x: 1376, y: 768, z: 1.0}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,34,0.92) 0%, rgba(6,15,34,0.7) 14%, rgba(6,15,34,0) 24%)'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 18, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 104, lineHeight: 1, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>
      SAME TEMPERATURE<span style={{color: C.gold}}>?!</span>
    </div>
    <div style={{position: 'absolute', left: 30, bottom: 26, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(6,15,34,0.85)', padding: '8px 14px', borderRadius: 14}}>
      <OhsLogo size={48} />
      <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 26, color: C.white}}>
        ORDINARY HAS <span style={{color: C.gold}}>SECRETS</span>
      </span>
    </div>
  </AbsoluteFill>
);
