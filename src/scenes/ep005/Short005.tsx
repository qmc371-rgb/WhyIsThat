// Short005 (1080x1920, ~39 s): the Arby's reveal, cut from EP005's final recording
// (L01–L05 → L11–L16 → L75–L76). Fresh vertical layout; captions stay clear of the Shorts UI
// (no text in the bottom band or under the right-hand buttons).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BrandCard} from '../../brand/ohs';
import {makeTiming} from '../../lib/timing';
import {ramp} from '../../lib/anim';
import {GridBg, useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import shortJson from '../../data/ep005_short/narration_timing.json';
import shortCaptions from '../../data/ep005_short/captions.json';
import {ArtCam} from '../ep002/parts';
import {Chip, Morph, NameTag, R1, R3, R4, Stamp} from './Ep005Full';

const ST = makeTiming(shortJson);
const w = (id: string, i: number) => ST.line(id).words[i].start;
const ls = (id: string) => ST.line(id).start;
const le = (id: string) => ST.line(id).end;

/** R4 framed vertically: top panel centre ≈ (540, 458), bottom panel ≈ (540, 844), panels ≈ 800 px wide. */
const SIGN_V = {x: 1063, y: 700, z: 1.088};

type Cap = {text: string; startMs: number; endMs: number};
const wrapRows = (text: string, row: number): string[] => {
  if (text.length <= row) return [text];
  const ws = text.split(' ');
  let best: string[] | null = null;
  let cost = 1e9;
  for (let i = 1; i < ws.length; i++) {
    const a = ws.slice(0, i).join(' ');
    const b = ws.slice(i).join(' ');
    if (a.length <= row && b.length <= row && Math.abs(a.length - b.length) < cost) {
      best = [a, b];
      cost = Math.abs(a.length - b.length);
    }
  }
  return best ?? [text];
};
const Captions: React.FC<{top: number}> = ({top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (frame / fps) * 1000;
  const cap = (shortCaptions as Cap[]).find((c) => ms >= c.startMs && ms < c.endMs);
  if (!cap) return null;
  return (
    <div style={{position: 'absolute', left: 60, right: 180, top, display: 'flex', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 52, lineHeight: 1.22, color: C.white, background: 'rgba(6,15,34,0.88)', padding: '12px 24px', borderRadius: 18}}>
        {wrapRows(cap.text, 24).map((r, i) => (
          <div key={i}>{r}</div>
        ))}
      </div>
    </div>
  );
};

const SourceTag: React.FC<{text: string; at: number}> = ({text, at}) => {
  const t = useT();
  return (
    <div style={{position: 'absolute', left: 40, top: 60, opacity: ramp(t, at, at + 0.3), fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, color: C.navy200, background: 'rgba(6,15,34,0.8)', padding: '6px 12px', borderRadius: 8}}>Source: {text}</div>
  );
};

export const Short005: React.FC = () => {
  const t = useT();
  const s2 = ls('L11') - 0.25;
  const sR3 = w('L11', 13) - 0.1; // "Leroy"
  const s3 = ls('L13') - 0.25;
  const s5 = ls('L75') - 0.3;
  // cold open lettering (same transformations as the main video)
  const shrink = 1 - ramp(t, w('L02', 0) - 0.15, w('L02', 0) + 0.2);
  const dotR = ramp(t, w('L02', 0), w('L02', 0) + 0.25) * (1 - ramp(t, w('L03', 0) - 0.1, w('L03', 0) + 0.15)) + ramp(t, w('L05', 0), w('L05', 0) + 0.3);
  const dotB = ramp(t, w('L02', 1), w('L02', 1) + 0.25) * (1 - ramp(t, w('L03', 0) - 0.1, w('L03', 0) + 0.15)) + ramp(t, w('L05', 0) + 0.1, w('L05', 0) + 0.4);
  const gap = ramp(t, w('L02', 0) - 0.1, w('L02', 0) + 0.3);
  const roast = ramp(t, w('L03', 0), w('L03', 0) + 0.35) * (1 - ramp(t, w('L05', 0), w('L05', 0) + 0.35));
  const beef = ramp(t, w('L03', 1), w('L03', 1) + 0.35) * (1 - ramp(t, w('L05', 0), w('L05', 0) + 0.35));
  const hi = t >= w('L05', 2) ? C.gold : undefined;
  const crack = ramp(t, w('L05', 0) - 0.05, w('L05', 0) + 0.35);
  // reveal
  const raffel = ramp(t, w('L11', 11), w('L11', 11) + 0.4);
  const brothers = ramp(t, w('L11', 12), w('L11', 12) + 0.45);
  // collapse + sign
  const col = ramp(t, w('L14', 0) - 0.1, w('L14', 0) + 0.3);
  const dots = ramp(t, w('L14', 0), w('L14', 0) + 0.25) * (1 - ramp(t, w('L15', 0) - 0.1, w('L15', 0) + 0.2));
  const arbys = ramp(t, w('L15', 0) - 0.1, w('L15', 0) + 0.3);
  const signAt = w('L15', 0) - 0.2;
  const onSign = ramp(t, signAt, signAt + 0.6);
  const capTop = t < s2 ? 470 : t < s3 ? 470 : t < signAt ? 1000 : 1130;
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(ST.timing.audio)} />
      {[s2, sR3, s3, s5].map((x) => (
        <Sfx key={x} at={x - 0.2} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={w('L11', 11) - 0.05} file="glint.wav" vol={0.16} dur={1.0} />
      <Sfx at={w('L15', 0) - 0.1} file="ding.wav" vol={0.12} dur={1.0} />
      <Sfx at={w('L76', 2) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />

      {/* 1 · cold open over the sandwich */}
      <Shot from={0} to={s2}>
        <ArtCam art={R1} cam={{x: 758, y: 768, z: 1 + 0.04 * ramp(t, 0, s2, Easing.linear)}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,34,0.85) 0%, rgba(6,15,34,0.4) 30%, rgba(6,15,34,0) 42%)'}} />
        <Morph
          x={540}
          y={250}
          size={t < w('L03', 0) ? 190 : 120}
          segs={[
            {t: 'A', p: shrink},
            {t: 'R', color: hi},
            {t: 'OAST', p: roast},
            {t: '.', p: Math.min(1, dotR), em: 0.4},
            {t: ' ', p: gap, em: 0.45},
            {t: 'B', color: hi},
            {t: 'EEF', p: beef},
            {t: '.', p: Math.min(1, dotB), em: 0.4},
            {t: 'Y’S', p: shrink},
          ]}
        />
        <div style={{opacity: 1 - crack, transform: `rotate(${crack * 8}deg) translateY(${crack * 40}px)`}}>
          <Chip text="MYSTERY SOLVED?" x={540} y={400} at={w('L04', 0)} mark="check" size={44} />
        </div>
        <Chip text="SOMETHING ELSE…" x={540} y={400} at={w('L05', 2)} tone="white" mark="q" size={44} />
      </Shot>

      {/* 2 · the reveal: R → RAFFEL, B → BROTHERS, then the brothers (illustrative) */}
      <Shot from={s2} to={s3} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Chip text="BUT…" x={540} y={110} at={w('L11', 0)} until={w('L11', 11) - 0.2} tone="white" size={44} />
        <Morph x={540} y={230} size={150} segs={[{t: 'R', color: C.gold}, {t: 'AFFEL', p: raffel}]} />
        <Morph x={540} y={385} size={150} segs={[{t: 'B', color: C.gold}, {t: 'ROTHERS', p: brothers}]} />
        <div style={{position: 'absolute', left: 40, top: 600, width: 1000, height: 558, borderRadius: 28, overflow: 'hidden', border: `6px solid ${C.gold}`, opacity: ramp(t, sR3, sR3 + 0.35), transform: `scale(${0.94 + 0.06 * ramp(t, sR3, sR3 + 0.35)})`}}>
          <Img src={staticFile(R3.file)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <NameTag name="Leroy Raffel" note="Illustrative recreation" x={340} y={900} at={w('L11', 13)} size={36} />
        <NameTag name="Forrest Raffel" note="Illustrative recreation" x={740} y={900} at={w('L11', 15)} size={36} />
        <Stamp lines={['BOARDMAN, OHIO', '1964']} x={540} y={1300} at={w('L12', 5)} at2={w('L12', 8)} />
        <SourceTag text="Inspire Brands (Arby’s parent company)" at={w('L11', 11)} />
      </Shot>

      {/* 3 · RAFFEL BROTHERS → R. B. → ARBY'S, landing on the sign */}
      <Shot from={s3} to={s5} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: onSign}}>
          <ArtCam art={R4} cam={{...SIGN_V, z: SIGN_V.z - 0.04 * ramp(t, signAt, s5, Easing.linear)}} />
        </AbsoluteFill>
        {t < signAt ? (
          <>
            <Morph x={540} y={330 + 120 * col} size={150} segs={[{t: 'R', color: C.gold}, {t: 'AFFEL', p: 1 - col}, {t: '.', p: dots, em: 0.4}, {t: ' ', p: col, em: 0.45}, {t: 'B', p: col, color: C.gold}, {t: '.', p: dots, em: 0.4}]} />
            <div style={{opacity: 1 - col}}>
              <Morph x={540} y={485} size={150} segs={[{t: 'B', color: C.gold}, {t: 'ROTHERS'}]} />
            </div>
          </>
        ) : (
          <Morph
            x={540}
            y={450 + (458 - 450) * onSign}
            size={150 - 30 * onSign}
            color={onSign > 0.5 ? C.navy900 : C.white}
            shadow={onSign < 0.5}
            segs={[{t: 'A', p: arbys}, {t: 'R', color: onSign > 0.5 ? undefined : C.gold}, {t: '.', p: dots, em: 0.4}, {t: ' ', p: 1 - arbys, em: 0.45}, {t: 'B', color: onSign > 0.5 ? undefined : C.gold}, {t: '.', p: dots, em: 0.4}, {t: 'Y’S', p: arbys}]}
          />
        )}
        <div style={{position: 'absolute', left: 540, top: 844, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.navy800, opacity: ramp(t, w('L16', 1), w('L16', 1) + 0.4), whiteSpace: 'nowrap'}}>
          <span style={{color: C.goldDeep}}>R</span>AFFEL <span style={{color: C.goldDeep}}>B</span>ROTHERS
        </div>
        <Chip text="THE INITIALS BELONG TO THE FOUNDERS" x={500} y={1060} at={w('L16', 1)} until={w('L16', 7) - 0.15} mark="check" size={34} />
        <Chip text="ROAST BEEF? A COINCIDENCE" x={480} y={1060} at={w('L16', 7)} tone="white" size={38} />
        <SourceTag text="Inspire Brands" at={s3} />
      </Shot>

      {/* 4 · brand end card */}
      <Shot from={s5} to={1e9} fadeIn={0.3}>
        <BrandCard wordTimes={[w('L76', 0), w('L76', 1), w('L76', 2)]} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 72, color: C.white, opacity: ramp(t, ls('L75'), ls('L75') + 0.3) * (1 - ramp(t, w('L76', 0) - 0.3, w('L76', 0)))}}>
          Now you know.
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 1200, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 40, color: C.white, opacity: ramp(t, w('L76', 2) + 0.9, w('L76', 2) + 1.4)}}>
          3 more name stories in the full video
        </div>
      </Shot>

      {t < s5 && <Captions top={capTop} />}
    </AbsoluteFill>
  );
};

/** Short cover / first frame idea (1080x1920 still). */
export const Short005Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.navy950}}>
    <ArtCam art={R1} cam={{x: 758, y: 768, z: 1}} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,34,0.92) 0%, rgba(6,15,34,0.5) 32%, rgba(6,15,34,0) 44%)'}} />
    <div style={{position: 'absolute', left: 40, right: 40, top: 170, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 150, lineHeight: 1, color: C.white, textShadow: '0 8px 0 rgba(6,15,34,0.6)'}}>
      <span style={{color: C.gold}}>R</span>.<span style={{color: C.gold}}>B</span>. =
      <br />
      ROAST BEEF<span style={{color: C.gold}}>?</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 40, letterSpacing: '0.08em', color: C.goldLight}}>THE REAL STORY BEHIND ARBY’S</div>
  </AbsoluteFill>
);

export const short005Ends = () => ({end: le('L76')});
