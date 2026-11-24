// EP005 — "The Stories Behind 4 Famous Restaurant Names" — Ordinary Has Secrets.
// Rules: brand names are typeset in our own fonts (no logos, no lookalike marks); founders appear only
// as generic illustrated figures (no faces, no quotes); every name, date and label is drawn in code.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BrandCard, OhsLogo} from '../../brand/ohs';
import {line, timing} from './timing';
import {pop, ramp} from '../../lib/anim';
import {GridBg, useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';
import ep005Captions from '../../data/ep005/captions.json';
import {ArtCam, Cam, camAt} from '../ep002/parts';

export const ls = (id: string) => line(id).start;
export const le = (id: string) => line(id).end;
export const w = (id: string, i: number) => line(id).words[i].start;
const art = (n: string, wd = 2752, h = 1536) => ({file: `assets/higgsfield/ep005/${n}.jpg`, w: wd, h});
export const R1 = art('R1_sandwich_v1');
export const R2 = art('R2_character_board_v1');
export const R3 = art('R3_brothers_counter_v1');
export const R4 = art('R4_blank_sign_v1');
export const R5 = art('R5_old_map_v1');
export const R6 = art('R6_open_book_v1');
const FULL: Cam = {x: 1376, y: 768, z: 1};
/** R4 camera that frames the two sign panels; top panel centre lands at about (960, 240). */
export const SIGN_CAM: Cam = {x: 1063, y: 600, z: 1.6};

/* ------------------------------ lettering ------------------------------ */
export type Seg = {t: string; p?: number; color?: string; em?: number};
/** A row of letter groups. Groups with p<1 shrink to nothing (width and opacity), so words can
 *  grow out of single letters (R → RAFFEL) and collapse back again, all centred. */
export const Morph: React.FC<{segs: Seg[]; size: number; x: number; y: number; color?: string; shadow?: boolean; tracking?: number}> = ({
  segs, size, x, y, color = C.white, shadow = true, tracking = 0.02,
}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap', fontFamily: FONT.display, fontWeight: 700, fontSize: size, lineHeight: 1, letterSpacing: `${tracking}em`, color, textShadow: shadow ? '0 8px 0 rgba(6,15,34,0.55)' : undefined}}>
    {segs.map((s, i) => {
      const p = s.p ?? 1;
      if (p <= 0.001) return null;
      const em = s.em ?? Math.max(0.35, s.t.length * 0.7);
      return (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden', maxWidth: p >= 0.999 ? undefined : `${p * em}em`, opacity: Math.min(1, p * 1.6), color: s.color, verticalAlign: 'baseline'}}>
          {s.t}
        </span>
      );
    })}
  </div>
);

/** Rounded chip label. */
export const Chip: React.FC<{text: React.ReactNode; x: number; y: number; at: number; until?: number; size?: number; tone?: 'gold' | 'white' | 'navy'; mark?: 'check' | 'cross' | 'q'; rot?: number}> = ({
  text, x, y, at, until = 1e9, size = 40, tone = 'gold', mark, rot = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 14);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  if (o <= 0) return null;
  const border = tone === 'gold' ? C.gold : tone === 'white' ? C.white : C.navy400;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p}) rotate(${rot}deg)`, opacity: o, display: 'flex', alignItems: 'center', gap: 12, padding: '10px 22px', borderRadius: 16, background: 'rgba(6,15,34,0.92)', border: `3px solid ${border}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: size, color: C.white, letterSpacing: '0.04em', whiteSpace: 'nowrap'}}>
      {mark && (
        <span style={{display: 'inline-flex', width: size * 1.2, height: size * 1.2, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', background: mark === 'cross' ? C.navy500 : C.gold, color: C.navy950, fontSize: size * 0.85}}>
          {mark === 'check' ? '✓' : mark === 'cross' ? '✕' : '?'}
        </span>
      )}
      {text}
    </div>
  );
};

/** Small corner tag for illustrated (non-archival) history scenes. */
export const IllusTag: React.FC<{text?: string}> = ({text = 'Illustration'}) => (
  <div style={{position: 'absolute', left: 40, bottom: 34, fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.75)', padding: '5px 12px', borderRadius: 8}}>{text}</div>
);

/** Source chip (bottom-right). */
export const SourceChip: React.FC<{text: string; at: number; until?: number}> = ({text, at, until = 1e9}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.3) * (1 - ramp(t, until, until + 0.3));
  return (
    <div style={{position: 'absolute', right: 40, bottom: 34, opacity: o, fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.8)', padding: '5px 12px', borderRadius: 8}}>
      Source: {text}
    </div>
  );
};

/** Gold name tag (e.g. "Leroy Raffel"), swings in. */
export const NameTag: React.FC<{name: string; x: number; y: number; at: number; until?: number; size?: number}> = ({name, x, y, at, until = 1e9, size = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 11);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${(1 - p) * -12}deg) scale(${0.8 + 0.2 * p})`, transformOrigin: '50% 0%', opacity: o, padding: '12px 26px', borderRadius: 14, background: C.gold, color: C.navy950, fontFamily: FONT.display, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: '0 10px 0 rgba(6,15,34,0.35)'}}>
      {name}
    </div>
  );
};

/** Place-and-date stamp. */
export const Stamp: React.FC<{lines: [string, string]; x: number; y: number; at: number; at2?: number; until?: number}> = ({lines: [a, b], x, y, at, at2, until = 1e9}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 10);
  const p2 = at2 === undefined ? 1 : pop(frame, fps, at2, 10);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${1.25 - 0.25 * p}) rotate(-3deg)`, opacity: o, border: `5px solid ${C.gold}`, borderRadius: 18, padding: '14px 34px', background: 'rgba(6,15,34,0.9)', textAlign: 'center'}}>
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.white, lineHeight: 1.05}}>{a}</div>
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.gold, lineHeight: 1.05, opacity: Math.min(1, p2 * 1.5), transform: `scale(${0.8 + 0.2 * p2})`}}>{b}</div>
    </div>
  );
};

/** Inset illustration in a rounded frame (e.g. the sandwich returning as a reminder). */
const Inset: React.FC<{src: {file: string}; x: number; y: number; w: number; h: number; at: number; until?: number; ox?: string}> = ({src, x, y, w: iw, h, at, until = 1e9, ox = '25% 70%'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 13);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y, width: iw, height: h, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * p})`, opacity: o, borderRadius: 24, overflow: 'hidden', border: `5px solid ${C.gold}`, boxShadow: '0 14px 0 rgba(6,15,34,0.4)'}}>
      <Img src={staticFile(src.file)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: ox}} />
    </div>
  );
};

/* ================================ A · COLD OPEN (L01–L06) ================================ */
const ColdOpen: React.FC = () => {
  const t = useT();
  const board = ls('L06');
  // letter-group progress (see Morph)
  const shrinkArbys = 1 - ramp(t, w('L02', 0) - 0.15, w('L02', 0) + 0.2);
  const dotR = ramp(t, w('L02', 0), w('L02', 0) + 0.25) * (1 - ramp(t, w('L03', 0) - 0.1, w('L03', 0) + 0.15)) + ramp(t, w('L05', 0), w('L05', 0) + 0.3);
  const dotB = ramp(t, w('L02', 1), w('L02', 1) + 0.25) * (1 - ramp(t, w('L03', 0) - 0.1, w('L03', 0) + 0.15)) + ramp(t, w('L05', 0) + 0.1, w('L05', 0) + 0.4);
  const gap = ramp(t, w('L02', 0) - 0.1, w('L02', 0) + 0.3);
  const roast = ramp(t, w('L03', 0), w('L03', 0) + 0.35) * (1 - ramp(t, w('L05', 0), w('L05', 0) + 0.35));
  const beef = ramp(t, w('L03', 1), w('L03', 1) + 0.35) * (1 - ramp(t, w('L05', 0), w('L05', 0) + 0.35));
  const hiR = t >= w('L02', 0) && t < w('L02', 1) ? C.gold : t >= w('L05', 2) && t < board ? C.gold : undefined;
  const hiB = t >= w('L02', 1) && t < w('L03', 0) ? C.gold : t >= w('L05', 2) && t < board ? C.gold : undefined;
  const size = t < w('L02', 0) ? 220 : t < w('L03', 0) ? 240 : 150;
  const sizeS = size + (t >= w('L05', 0) ? ramp(t, w('L05', 0), w('L05', 0) + 0.4) * 90 : 0);
  const crack = ramp(t, w('L05', 0) - 0.05, w('L05', 0) + 0.35);
  return (
    <AbsoluteFill>
      <Shot from={0} to={board}>
        <ArtCam art={R1} cam={{x: 1376 + 40 * ramp(t, 0, board, Easing.linear), y: 768, z: 1 + 0.05 * ramp(t, 0, board, Easing.linear)}} />
        <Morph
          x={1330}
          y={420}
          size={sizeS}
          segs={[
            {t: 'A', p: shrinkArbys},
            {t: 'R', color: hiR},
            {t: 'OAST', p: roast},
            {t: '.', p: Math.min(1, dotR), em: 0.4},
            {t: ' ', p: gap, em: 0.45},
            {t: 'B', color: hiB},
            {t: 'EEF', p: beef},
            {t: '.', p: Math.min(1, dotB), em: 0.4},
            {t: 'Y’S', p: shrinkArbys},
          ]}
        />
        <div style={{opacity: 1 - crack, transform: `rotate(${crack * 8}deg) translateY(${crack * 40}px)`}}>
          <Chip text="MYSTERY SOLVED?" x={1330} y={680} at={w('L04', 0)} mark="check" size={48} />
        </div>
        <Chip text="THOSE LETTERS STAND FOR SOMETHING ELSE" x={1270} y={680} at={w('L05', 2)} tone="white" mark="q" size={38} />
      </Shot>
      <Shot from={board} to={1e9} fadeIn={0.3}>
        <GameBoard from={board} />
      </Shot>
    </AbsoluteFill>
  );
};

/** The four blank name boards of the guessing game (L06–L07). */
const GameBoard: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const four = w('L06', 8);
  const signs = w('L06', 15);
  const zoomAt = w('L07', 2);
  const z = 1 + 1.6 * ramp(t, zoomAt, ls('L08') + 0.1, Easing.in(Easing.cubic));
  const xs = [300, 740, 1180, 1620];
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <GridBg />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${xs[0]}px 520px`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 70, color: C.white, opacity: ramp(t, w('L06', 5), w('L06', 5) + 0.4)}}>
          4 NAMES · <span style={{color: C.gold}}>4 SECRETS</span>
        </div>
        {xs.map((x, i) => {
          const p = pop(frame, fps, four + 0.14 * i, 12);
          const pole = ramp(t, signs + 0.1 * i, signs + 0.1 * i + 0.4);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 520, transform: `translate(-50%, -50%) rotateY(${(1 - p) * 90}deg)`, opacity: Math.min(1, p * 1.5)}}>
              <div style={{position: 'absolute', left: '50%', top: 110, width: 26, height: 260 * pole, marginLeft: -13, background: C.navy500, borderRadius: 6}} />
              <div style={{position: 'relative', width: 360, height: 220, borderRadius: 22, background: C.paper, border: `8px solid ${i === 0 && t > zoomAt ? C.gold : C.navy400}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 0 rgba(6,15,34,0.4)'}}>
                <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 130, color: C.navy700}}>?</span>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================ B/C · ARBY'S (L08–L18) ================================ */
const Arbys: React.FC = () => {
  const t = useT();
  const s0 = ls('L08') - 0.35;
  // stage 1: sandwich + giant letters R and B (L08–L12)
  const drop = (at: number) => ramp(t, at, at + 0.45, Easing.out(Easing.back(1.5)));
  const dR = drop(w('L08', 4));
  const dB = drop(w('L08', 5));
  const together = ramp(t, w('L10', 0), w('L10', 2) + 0.3);
  const arby = ramp(t, w('L11', 0) - 0.1, w('L11', 0) + 0.3);
  // stage 2: reveal (L13)
  const unA = ramp(t, w('L13', 0), w('L13', 0) + 0.35); // ARBY collapses back to R B
  const raffel = ramp(t, w('L13', 11), w('L13', 11) + 0.4);
  const brothers = ramp(t, w('L13', 12), w('L13', 12) + 0.45);
  const toR3 = w('L13', 13) - 0.05; // "Leroy"
  const rise = ramp(t, w('L13', 12) + 0.1, toR3 - 0.32);
  const backAt = ls('L15') - 0.25;
  // stage 3: collapse RAFFEL BROTHERS → R. B. → ARBY'S (L15–L17) and land on the sign
  const col = ramp(t, w('L16', 0) - 0.1, w('L16', 0) + 0.3);
  const dots = ramp(t, w('L16', 0), w('L16', 0) + 0.25) * (1 - ramp(t, w('L17', 0) - 0.1, w('L17', 0) + 0.2));
  const arbys = ramp(t, w('L17', 0) - 0.1, w('L17', 0) + 0.3);
  const signAt = w('L17', 0) - 0.2;
  const onSign = ramp(t, signAt, signAt + 0.6);

  const stage1 = t < w('L13', 0);
  const lettersX = 1300;
  return (
    <AbsoluteFill>
      {/* stage 1 + reveal letters over the sandwich */}
      <Shot from={s0} to={toR3}>
        <ArtCam art={R1} cam={camAt(t, [[s0, {x: 1376, y: 768, z: 1.0}], [w('L13', 0), {x: 1250, y: 820, z: 1.08}], [toR3, {x: 1250, y: 820, z: 1.1}]])} />
        <AbsoluteFill style={{background: `rgba(6,15,34,${0.55 * ramp(t, w('L13', 0), w('L13', 0) + 0.5)})`}} />
        {stage1 ? (
          <>
            <div style={{opacity: Math.min(1, dR * 1.5), transform: `translateY(${(1 - dR) * -260}px)`}}>
            <Morph
              x={lettersX}
              y={470 - 60 * arby}
              size={330 - 60 * arby}
              segs={[
                {t: '“', p: arby, em: 0.45, color: C.goldLight},
                {t: 'A', p: arby},
                {t: 'R', color: t > w('L09', 0) - 0.05 && t < w('L09', 2) ? C.gold : undefined},
                {t: '  ', p: (1 - together) * Math.min(1, dB), em: 0.9},
                {t: 'B', p: dB > 0.02 ? 1 : 0, color: t > w('L09', 2) - 0.05 && t < w('L10', 0) ? C.gold : undefined},
                {t: 'Y', p: arby},
                {t: '”', p: arby, em: 0.45, color: C.goldLight},
              ]}
            />
            </div>
            <Chip text="SAY THEM TOGETHER" x={1300} y={780} at={w('L10', 0)} until={w('L11', 0) - 0.1} tone="white" size={42} />
            <Chip text="THE OBVIOUS ANSWER: ROAST BEEF" x={1300} y={780} at={w('L12', 0)} rot={-2 + Math.sin(t * 5) * 1.2} mark="check" size={42} />
          </>
        ) : (
          <>
            <Morph
              x={960}
              y={470 - 378 * rise}
              size={(180 - 0 * unA) - 88 * rise}
              segs={[
                {t: 'A', p: 1 - unA},
                {t: 'R', color: C.gold},
                {t: 'AFFEL', p: raffel},
                {t: ' ', p: Math.max(unA * 0.6, raffel), em: 0.45},
                {t: 'B', color: C.gold},
                {t: 'ROTHERS', p: brothers},
                {t: 'Y', p: 1 - unA},
              ]}
            />
            <div style={{opacity: 1 - ramp(t, w('L13', 0), w('L13', 0) + 0.3), transform: `rotate(${-2 + 14 * ramp(t, w('L13', 0), w('L13', 0) + 0.4)}deg) translateY(${120 * ramp(t, w('L13', 0), w('L13', 0) + 0.4)}px)`}}>
              <Chip text="THE OBVIOUS ANSWER: ROAST BEEF" x={1300} y={780} at={w('L12', 0)} mark="check" size={42} />
            </div>
            <Chip text="BUT…" x={960} y={250} at={w('L13', 0)} until={w('L13', 11) - 0.2} tone="white" size={48} />
          </>
        )}
        <SourceChip text="Inspire Brands (Arby’s parent company)" at={w('L13', 3)} />
      </Shot>

      {/* the brothers (illustrated, from behind) */}
      <Shot from={toR3} to={backAt} fadeIn={0.3}>
        <ArtCam art={R3} cam={{x: 1376, y: 800, z: 1.0 + 0.04 * ramp(t, toR3, backAt, Easing.linear)}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,34,0.9) 0%, rgba(6,15,34,0.6) 16%, rgba(6,15,34,0) 30%)'}} />
        <div style={{opacity: ramp(t, toR3 - 0.03, toR3, Easing.linear)}}>
          <Morph x={960} y={92} size={92} segs={[{t: 'R', color: C.gold}, {t: 'AFFEL'}, {t: ' '}, {t: 'B', color: C.gold}, {t: 'ROTHERS'}]} />
        </div>
        <NameTag name="Leroy Raffel" x={600} y={560} at={w('L13', 13)} size={44} />
        <NameTag name="Forrest Raffel" x={1320} y={560} at={w('L13', 15)} size={44} />
        <Stamp lines={['BOARDMAN, OHIO', '1964']} x={960} y={850} at={w('L14', 5)} at2={w('L14', 8)} />
        <IllusTag text="Illustration (not the actual founders)" />
        <SourceChip text="Inspire Brands" at={toR3} />
      </Shot>

      {/* collapse back to the name and land it on the sign */}
      <Shot from={backAt} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: onSign}}>
          <ArtCam art={R4} cam={{...SIGN_CAM, z: SIGN_CAM.z - 0.05 * ramp(t, signAt, ls('L19'), Easing.linear)}} />
        </AbsoluteFill>
        <Morph
          x={960}
          y={470 - 230 * onSign}
          size={180 - 55 * onSign}
          color={onSign > 0.5 ? C.navy900 : C.white}
          shadow={onSign < 0.5}
          segs={[
            {t: 'A', p: arbys},
            {t: 'R', color: onSign > 0.5 ? undefined : C.gold},
            {t: 'AFFEL', p: 1 - col},
            {t: '.', p: dots, em: 0.4},
            {t: ' ', p: Math.max(0, 1 - col - 0.0) + dots * 0.6, em: 0.45},
            {t: 'B', color: onSign > 0.5 ? undefined : C.gold},
            {t: 'ROTHERS', p: 1 - col},
            {t: '.', p: dots, em: 0.4},
            {t: 'Y’S', p: arbys},
          ]}
        />
        <div style={{position: 'absolute', left: 960, top: 560, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 50, color: C.navy800, opacity: ramp(t, w('L18', 1), w('L18', 1) + 0.4), whiteSpace: 'nowrap'}}>
          <span style={{color: C.goldDeep}}>R</span>AFFEL <span style={{color: C.goldDeep}}>B</span>ROTHERS
        </div>
        <Chip text="THE INITIALS BELONG TO THE FOUNDERS" x={960} y={880} at={w('L18', 1)} mark="check" size={44} />
        <Inset src={R1} x={1600} y={640} w={420} h={260} at={w('L18', 7)} />
        <Chip text="ROAST BEEF? A CONVINCING COINCIDENCE" x={1540} y={800} at={w('L18', 9)} tone="white" size={32} />
        <SourceChip text="Inspire Brands" at={backAt} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ composition ================================ */
const ORDER: Array<[string, string]> = [['arbys', 'B ARBY’S']];
export const ep005Windows = (): Record<string, number> => ({
  arbys: ls('L08') - 0.35,
});

export const Ep005Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = ep005Windows();
  const scenes: Record<string, React.ReactNode> = {arbys: <Arbys />};
  const next = (i: number) => (i + 1 < ORDER.length ? W[ORDER[i + 1][0]] : 1e9);
  const sectionAt = (t: number) => {
    let n = 'A COLD OPEN';
    for (const [k, name] of ORDER) if (t >= W[k]) n = name;
    return n;
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      <Sfx at={ls('L06') - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      <Sfx at={w('L13', 11) - 0.05} file="glint.wav" vol={0.16} dur={1.0} />
      <Sfx at={w('L13', 13) - 0.4} file="whoosh.wav" vol={0.14} dur={0.7} />
      <Sfx at={ls('L15') - 0.45} file="whoosh.wav" vol={0.14} dur={0.7} />
      <Sfx at={w('L17', 0) - 0.1} file="ding.wav" vol={0.12} dur={1.0} />
      {ORDER.map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Shot from={0} to={W.arbys}>
        <ColdOpen />
      </Shot>
      {ORDER.map(([k], i) => (
        <Shot key={k} from={W[k]} to={next(i)} fadeIn={0.35}>
          {scenes[k]}
        </Shot>
      ))}
      {showCaptions && <CaptionOverlay captions={ep005Captions} />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP005 · REVIEW COPY" notForPublication={timing.notForPublication === true} unresolved={[]} />
    </AbsoluteFill>
  );
};

// referenced later in the episode
export {BrandCard, OhsLogo, FULL};
