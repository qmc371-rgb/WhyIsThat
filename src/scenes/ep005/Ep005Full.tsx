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
export const NameTag: React.FC<{name: string; x: number; y: number; at: number; until?: number; size?: number; note?: string}> = ({name, x, y, at, until = 1e9, size = 40, note}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 11);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${(1 - p) * -12}deg) scale(${0.8 + 0.2 * p})`, transformOrigin: '50% 0%', opacity: o, padding: '12px 26px', borderRadius: 14, background: C.gold, color: C.navy950, fontFamily: FONT.display, fontWeight: 700, fontSize: size, whiteSpace: 'nowrap', boxShadow: '0 10px 0 rgba(6,15,34,0.35)'}}>
      {name}
      {note && <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: size * 0.45, letterSpacing: '0.04em', color: C.navy800, marginTop: 2, textAlign: 'center'}}>{note}</div>}
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
  const zoomAt = w('L06', 19);
  const z = 1 + 1.6 * ramp(t, zoomAt, ls('L07') + 0.1, Easing.in(Easing.cubic));
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
  const s0 = ls('L07') - 0.35;
  // stage 1: sandwich + giant letters R and B (L08–L12)
  const drop = (at: number) => ramp(t, at, at + 0.45, Easing.out(Easing.back(1.5)));
  const dR = drop(w('L07', 4));
  const dB = drop(w('L07', 5));
  const together = ramp(t, w('L09', 0), w('L09', 2) + 0.3);
  const arby = ramp(t, w('L10', 0) - 0.1, w('L10', 0) + 0.3);
  // stage 2: reveal (L13)
  const unA = ramp(t, w('L11', 0), w('L11', 0) + 0.35); // ARBY collapses back to R B
  const raffel = ramp(t, w('L11', 11), w('L11', 11) + 0.4);
  const brothers = ramp(t, w('L11', 12), w('L11', 12) + 0.45);
  const toR3 = w('L11', 13) - 0.05; // "Leroy"
  const rise = ramp(t, w('L11', 12) + 0.1, toR3 - 0.32);
  const backAt = ls('L13') - 0.25;
  // stage 3: collapse RAFFEL BROTHERS → R. B. → ARBY'S (L15–L17) and land on the sign
  const col = ramp(t, w('L14', 0) - 0.1, w('L14', 0) + 0.3);
  const dots = ramp(t, w('L14', 0), w('L14', 0) + 0.25) * (1 - ramp(t, w('L15', 0) - 0.1, w('L15', 0) + 0.2));
  const arbys = ramp(t, w('L15', 0) - 0.1, w('L15', 0) + 0.3);
  const signAt = w('L15', 0) - 0.2;
  const onSign = ramp(t, signAt, signAt + 0.6);

  const stage1 = t < w('L11', 0);
  const lettersX = 1300;
  return (
    <AbsoluteFill>
      {/* stage 1 + reveal letters over the sandwich */}
      <Shot from={s0} to={toR3}>
        <ArtCam art={R1} cam={camAt(t, [[s0, {x: 1376, y: 768, z: 1.0}], [w('L11', 0), {x: 1250, y: 820, z: 1.08}], [toR3, {x: 1250, y: 820, z: 1.1}]])} />
        <AbsoluteFill style={{background: `rgba(6,15,34,${0.55 * ramp(t, w('L11', 0), w('L11', 0) + 0.5)})`}} />
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
                {t: 'R', color: t > w('L08', 0) - 0.05 && t < w('L08', 2) ? C.gold : undefined},
                {t: '  ', p: (1 - together) * Math.min(1, dB), em: 0.9},
                {t: 'B', p: dB > 0.02 ? 1 : 0, color: t > w('L08', 2) - 0.05 && t < w('L09', 0) ? C.gold : undefined},
                {t: 'Y', p: arby},
                {t: '”', p: arby, em: 0.45, color: C.goldLight},
              ]}
            />
            </div>
            <Chip text="SAY THEM TOGETHER" x={1300} y={780} at={w('L09', 0)} until={w('L10', 0) - 0.1} tone="white" size={42} />
            <Chip text="THE OBVIOUS ANSWER: ROAST BEEF" x={1300} y={780} at={le('L10') + 0.15} rot={-2 + Math.sin(t * 5) * 1.2} mark="check" size={42} />
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
            <div style={{opacity: 1 - ramp(t, w('L11', 0), w('L11', 0) + 0.3), transform: `rotate(${-2 + 14 * ramp(t, w('L11', 0), w('L11', 0) + 0.4)}deg) translateY(${120 * ramp(t, w('L11', 0), w('L11', 0) + 0.4)}px)`}}>
              <Chip text="THE OBVIOUS ANSWER: ROAST BEEF" x={1300} y={780} at={le('L10') + 0.15} mark="check" size={42} />
            </div>
            <Chip text="BUT…" x={960} y={250} at={w('L11', 0)} until={w('L11', 11) - 0.2} tone="white" size={48} />
          </>
        )}
        <SourceChip text="Inspire Brands (Arby’s parent company)" at={w('L11', 3)} />
      </Shot>

      {/* the brothers (illustrated, from behind) */}
      <Shot from={toR3} to={backAt} fadeIn={0.3}>
        <ArtCam art={R3} cam={{x: 1376, y: 800, z: 1.0 + 0.04 * ramp(t, toR3, backAt, Easing.linear)}} />
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,15,34,0.9) 0%, rgba(6,15,34,0.6) 16%, rgba(6,15,34,0) 30%)'}} />
        <div style={{opacity: ramp(t, toR3 - 0.03, toR3, Easing.linear)}}>
          <Morph x={960} y={92} size={92} segs={[{t: 'R', color: C.gold}, {t: 'AFFEL'}, {t: ' '}, {t: 'B', color: C.gold}, {t: 'ROTHERS'}]} />
        </div>
        <NameTag name="Leroy Raffel" note="Illustrative recreation" x={600} y={560} at={w('L11', 13)} size={44} />
        <NameTag name="Forrest Raffel" note="Illustrative recreation" x={1320} y={560} at={w('L11', 15)} size={44} />
        <Stamp lines={['BOARDMAN, OHIO', '1964']} x={960} y={850} at={w('L12', 5)} at2={w('L12', 8)} />
        <IllusTag text="Illustrative recreation" />
        <SourceChip text="Inspire Brands" at={toR3} />
      </Shot>

      {/* collapse back to the name and land it on the sign */}
      <Shot from={backAt} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <AbsoluteFill style={{opacity: onSign}}>
          <ArtCam art={R4} cam={{...SIGN_CAM, z: SIGN_CAM.z - 0.05 * ramp(t, signAt, ls('L17'), Easing.linear)}} />
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
        <div style={{position: 'absolute', left: 960, top: 560, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 50, color: C.navy800, opacity: ramp(t, w('L16', 1), w('L16', 1) + 0.4), whiteSpace: 'nowrap'}}>
          <span style={{color: C.goldDeep}}>R</span>AFFEL <span style={{color: C.goldDeep}}>B</span>ROTHERS
        </div>
        <Chip text="THE INITIALS BELONG TO THE FOUNDERS" x={960} y={880} at={w('L16', 1)} mark="check" size={44} />
        <Inset src={R1} x={1600} y={640} w={420} h={260} at={w('L16', 7)} />
        <Chip text="ROAST BEEF? A COINCIDENCE" x={1600} y={800} at={w('L16', 9)} tone="white" size={30} />
        <SourceChip text="Inspire Brands" at={backAt} />
      </Shot>
    </AbsoluteFill>
  );
};


/* ================================ shared game pieces ================================ */
const XS = [300, 740, 1180, 1620];
type CardS = {name?: string; nameAt?: number; stamp?: string; stampAt?: number};

/** The game board: four name cards, each can reveal its name and collect an ORIGIN stamp. */
const Board: React.FC<{cards: CardS[]; focus?: {i: number; at: number; dur?: number}; glow?: number}> = ({cards, focus, glow = -1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const z = focus ? 1 + 1.6 * ramp(t, focus.at, focus.at + (focus.dur ?? 0.7), Easing.in(Easing.cubic)) : 1;
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <GridBg />
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${focus ? XS[focus.i] : 960}px 470px`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.white}}>
          4 NAMES · <span style={{color: C.gold}}>4 SECRETS</span>
        </div>
        {XS.map((x, i) => {
          const c = cards[i] ?? {};
          const pn = c.name && c.nameAt !== undefined ? pop(frame, fps, c.nameAt, 12) : c.name ? 1 : 0;
          const ps = c.stamp && c.stampAt !== undefined ? pop(frame, fps, c.stampAt, 10) : c.stamp ? 1 : 0;
          const lit = glow === i || (focus && focus.i === i && t > focus.at - 0.4);
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: x, top: 470, transform: 'translate(-50%, -50%)'}}>
                <div style={{position: 'absolute', left: '50%', top: 110, width: 26, height: 230, marginLeft: -13, background: C.navy500, borderRadius: 6}} />
                <div style={{position: 'relative', width: 380, height: 220, borderRadius: 22, background: C.paper, border: `8px solid ${lit ? C.gold : C.navy400}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 0 rgba(6,15,34,0.4)', overflow: 'hidden'}}>
                  <span style={{position: 'absolute', fontFamily: FONT.display, fontWeight: 700, fontSize: 130, color: C.navy700, opacity: 1 - pn}}>?</span>
                  {c.name && (
                    <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: c.name.length > 7 ? 54 : 66, color: C.navy900, opacity: pn, transform: `scale(${0.7 + 0.3 * pn})`, whiteSpace: 'nowrap'}}>{c.name}</span>
                  )}
                </div>
              </div>
              {c.stamp && ps > 0 && (
                <div style={{position: 'absolute', left: x, top: 760, transform: `translate(-50%, -50%) rotate(-4deg) scale(${1.3 - 0.3 * ps})`, opacity: Math.min(1, ps * 1.5), border: `5px solid ${C.gold}`, borderRadius: 14, padding: '8px 18px', background: C.navy950, textAlign: 'center', whiteSpace: 'nowrap', boxShadow: '0 8px 0 rgba(6,15,34,0.4)'}}>
                  <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.2em', color: C.gold}}>ORIGIN</div>
                  <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: c.stamp.length > 14 ? 30 : 36, color: C.white}}>{c.stamp}</div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Guess cards: flip in one by one; at flipAt the correct one turns gold, the others dim. */
const Guess: React.FC<{cards: Array<{text: string; at: number}>; correct: number; flipAt: number; x: number; y0: number; gap?: number; size?: number}> = ({cards, correct, flipAt, x, y0, gap = 104, size = 38}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const flip = ramp(t, flipAt, flipAt + 0.3);
  return (
    <>
      {cards.map((c, i) => {
        const p = pop(frame, fps, c.at, 12);
        const ok = i === correct;
        const dim = ok ? 1 : 1 - 0.55 * flip;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y0 + i * gap, transform: `translate(-50%, -50%) rotateX(${(1 - p) * 90}deg) scale(${ok ? 1 + 0.08 * flip : 1})`, opacity: Math.min(1, p * 1.5) * dim, display: 'flex', alignItems: 'center', gap: 14, padding: '12px 26px', borderRadius: 16, minWidth: 560, background: ok && flip > 0.5 ? C.gold : 'rgba(6,15,34,0.92)', border: `3px solid ${ok && flip > 0.5 ? C.gold : C.navy400}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: size, color: ok && flip > 0.5 ? C.navy950 : C.white, whiteSpace: 'nowrap'}}>
            <span style={{display: 'inline-flex', width: size * 1.2, height: size * 1.2, borderRadius: '50%', alignItems: 'center', justifyContent: 'center', background: ok && flip > 0.5 ? C.navy900 : C.navy600, color: ok && flip > 0.5 ? C.gold : C.white, fontSize: size * 0.8}}>
              {ok && flip > 0.5 ? '✓' : '?'}
            </span>
            {c.text}
          </div>
        );
      })}
    </>
  );
};

/** Thought bubble beside the character: "?" that turns into "✓". */
const Bubble: React.FC<{x: number; y: number; at: number; doneAt: number; until?: number}> = ({x, y, at, doneAt, until = 1e9}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 12);
  const d = ramp(t, doneAt, doneAt + 0.25);
  const bob = Math.sin(t * 3.2) * 6;
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y + bob, transform: `translate(-50%, -50%) scale(${0.6 + 0.4 * p})`, opacity: o}}>
      <div style={{width: 120, height: 120, borderRadius: '50%', background: d > 0.5 ? C.gold : C.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 80, color: C.navy900, boxShadow: '0 10px 0 rgba(6,15,34,0.35)'}}>{d > 0.5 ? '✓' : '?'}</div>
      <div style={{position: 'absolute', left: -14, top: 118, width: 28, height: 28, borderRadius: '50%', background: d > 0.5 ? C.gold : C.white}} />
      <div style={{position: 'absolute', left: -38, top: 150, width: 16, height: 16, borderRadius: '50%', background: d > 0.5 ? C.gold : C.white}} />
    </div>
  );
};

/** A generic bell, drawn in code (not any company's mark). swing in degrees. */
const BellIcon: React.FC<{x: number; y: number; size: number; swing?: number; opacity?: number}> = ({x, y, size, swing = 0, opacity = 1}) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110" style={{position: 'absolute', left: x - size / 2, top: y - size * 0.55, opacity, transform: `rotate(${swing}deg)`, transformOrigin: '50% 8%', overflow: 'visible'}}>
    <circle cx={50} cy={10} r={7} fill="none" stroke={C.goldDeep} strokeWidth={5} />
    <path d="M22,82 C22,44 32,20 50,20 C68,20 78,44 78,82 L88,92 L12,92 Z" fill={C.gold} />
    <path d="M30,80 C30,50 36,30 46,26" fill="none" stroke={C.goldLight} strokeWidth={6} strokeLinecap="round" />
    <circle cx={50} cy={99} r={8} fill={C.goldDeep} />
  </svg>
);

/** Generic person icon (no likeness). */
const PersonIcon: React.FC<{x: number; y: number; size: number; color?: string; opacity?: number}> = ({x, y, size, color = C.navy200, opacity = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, opacity}}>
    <circle cx={50} cy={30} r={20} fill={color} />
    <path d="M14,96 C14,66 30,56 50,56 C70,56 86,66 86,96 Z" fill={color} />
  </svg>
);

/** Simple house icon with a window that can hold a name tag. */
const HouseIcon: React.FC<{x: number; y: number; size: number; opacity?: number}> = ({x, y, size, opacity = 1}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', left: x - size / 2, top: y - size / 2, opacity}}>
    <path d="M8,48 L50,12 L92,48" fill="none" stroke={C.gold} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={18} y={44} width={64} height={50} rx={6} fill={C.navy600} />
    <rect x={30} y={56} width={40} height={22} rx={4} fill={C.goldLight} />
  </svg>
);

/** Little sign icon (pole + panel) with a name. */
const SignIcon: React.FC<{x: number; y: number; name: string; p?: number}> = ({x, y, name, p = 1}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.8 + 0.2 * p})`, opacity: p}}>
    <div style={{position: 'absolute', left: '50%', top: 90, width: 20, height: 200, marginLeft: -10, background: C.navy500, borderRadius: 5}} />
    <div style={{position: 'relative', padding: '22px 40px', borderRadius: 18, background: C.paper, border: `7px solid ${C.gold}`, fontFamily: FONT.display, fontWeight: 700, fontSize: 64, color: C.navy900, whiteSpace: 'nowrap', boxShadow: '0 0 40px rgba(255,197,46,0.35)'}}>{name}</div>
  </div>
);

/** Order tickets that stream across the screen. */
const Tickets: React.FC<{name: string; at: number; until?: number; y?: number; n?: number}> = ({name, at, until = 1e9, y = 860, n = 14}) => {
  const t = useT();
  if (t < at) return null;
  const o = 1 - ramp(t, until, until + 0.3);
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const st = at + i * 0.22;
        if (t < st) return null;
        const x = 2050 - (t - st) * 420;
        const yy = y + ((i * 53) % 150) - 75;
        const rot = ((i * 37) % 14) - 7;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: yy, transform: `translate(-50%, -50%) rotate(${rot}deg)`, opacity: o, padding: '10px 18px 14px', background: C.white, borderRadius: 6, boxShadow: '0 8px 0 rgba(6,15,34,0.3)', fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, color: C.navy900, whiteSpace: 'nowrap', borderBottom: `4px dashed ${C.paperDeep}`}}>
            <div style={{fontSize: 13, letterSpacing: '0.2em', color: C.navy400}}>ORDER</div>
            {name}
          </div>
        );
      })}
    </>
  );
};

/** R4 sign with our own lettering on the panels. */
const SignShot: React.FC<{top: React.ReactNode; bottom?: React.ReactNode; bottomAt?: number; from: number; to: number}> = ({top, bottom, bottomAt = 0, from, to}) => {
  const t = useT();
  return (
    <AbsoluteFill>
      <ArtCam art={R4} cam={{...SIGN_CAM, z: SIGN_CAM.z - 0.06 * ramp(t, from, to, Easing.linear)}} />
      <div style={{position: 'absolute', left: 960, top: 240, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: typeof top === 'string' && top.length > 7 ? 92 : 118, color: C.navy900, whiteSpace: 'nowrap'}}>{top}</div>
      {bottom && (
        <div style={{position: 'absolute', left: 960, top: 560, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.navy800, whiteSpace: 'nowrap', opacity: ramp(t, bottomAt, bottomAt + 0.4)}}>{bottom}</div>
      )}
    </AbsoluteFill>
  );
};

/** Typeset name on the character's blank menu board (R2). */
const BoardName: React.FC<{name: React.ReactNode; at: number; size?: number}> = ({name, at, size = 104}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 12);
  return (
    <div style={{position: 'absolute', left: 1198, top: 257, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * p})`, opacity: Math.min(1, p * 1.5), fontFamily: FONT.display, fontWeight: 700, fontSize: size, color: C.navy900, whiteSpace: 'nowrap'}}>{name}</div>
  );
};

const Imagine: React.FC<{at: number}> = ({at}) => {
  const t = useT();
  const o = ramp(t, at, at + 0.4);
  return (
    <>
      <div style={{position: 'absolute', left: 70, top: 70, right: 70, bottom: 70, border: `5px dashed ${C.navy400}`, borderRadius: 40, opacity: o}} />
      <div style={{position: 'absolute', left: 110, top: 46, padding: '4px 18px', background: C.navy900, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.2em', color: C.goldLight, opacity: o}}>IMAGINE</div>
    </>
  );
};

/* ================================ D · ARBY'S LESSON (L17–L21) ================================ */
const ArbysLesson: React.FC = () => {
  const t = useT();
  const s0 = ls('L17') - 0.35;
  const a = ls('L18') - 0.25;
  const b = ls('L19') - 0.25;
  const c = ls('L20') - 0.25;
  const d = ls('L21') - 0.25;
  const name = ramp(t, w('L20', 6) - 0.1, w('L20', 6) + 0.3);
  return (
    <AbsoluteFill>
      <Shot from={s0} to={a}>
        <Board cards={[{name: 'ARBY’S', nameAt: w('L17', 0), stamp: 'TWO BROTHERS', stampAt: w('L17', 6)}]} glow={0} />
      </Shot>
      <Shot from={a} to={b} fadeIn={0.3}>
        <ArtCam art={R2} cam={{x: 1376, y: 768, z: 1 + 0.04 * ramp(t, a, b, Easing.linear)}} />
        <BoardName name={<>ROAST <span style={{color: C.goldDeep}}>BEEF</span></>} at={w('L18', 1)} />
        <Chip text="THE ANSWER ON THE MENU?" x={1200} y={520} at={w('L18', 6)} tone="white" mark="q" size={38} />
        <Bubble x={720} y={330} at={a + 0.2} doneAt={1e9} />
      </Shot>
      <Shot from={b} to={c} fadeIn={0.3}>
        <ArtCam art={R3} cam={{x: 1376, y: 800, z: 1.04 - 0.04 * ramp(t, b, c, Easing.linear)}} />
        <NameTag name="Leroy Raffel" note="Illustrative recreation" x={600} y={560} at={w('L19', 5)} size={44} />
        <NameTag name="Forrest Raffel" note="Illustrative recreation" x={1320} y={560} at={w('L19', 6)} size={44} />
        <Chip text="THE REAL EXPLANATION" x={960} y={120} at={w('L19', 2)} mark="check" size={44} />
        <IllusTag text="Illustrative recreation" />
      </Shot>
      <Shot from={c} to={d} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Morph x={960} y={380} size={190} segs={[{t: 'A', p: name}, {t: 'R', color: name > 0.5 ? undefined : C.gold}, {t: '.', p: 1 - name, em: 0.4}, {t: ' ', p: 1 - name, em: 0.45}, {t: 'B', color: name > 0.5 ? undefined : C.gold}, {t: '.', p: 1 - name, em: 0.4}, {t: 'Y’S', p: name}]} />
        <Chip text="INITIALS → A NAME" x={960} y={580} at={w('L20', 3)} size={40} />
        <Tickets name="ARBY’S" at={w('L20', 7)} />
      </Shot>
      <Shot from={d} to={1e9} fadeIn={0.3}>
        <Board cards={[{name: 'ARBY’S', stamp: 'TWO BROTHERS'}]} focus={{i: 1, at: w('L21', 7) - 0.1, dur: 0.8}} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ E–G · WENDY'S (L22–L36) ================================ */
const Wendys: React.FC = () => {
  const t = useT();
  const s0 = ls('L22') - 0.35;
  const s1 = ls('L24') - 0.2;
  const s2 = ls('L28') - 0.2;
  const s3 = ls('L29') - 0.2;
  const s4 = ls('L34') - 0.2;
  // MELINDA → WENDA → WENDY
  const toWenda = ramp(t, w('L27', 12) - 0.1, w('L27', 12) + 0.35);
  const toWendy = ramp(t, w('L27', 15) - 0.1, w('L27', 15) + 0.3);
  const wobble = t > w('L27', 7) && t < w('L27', 12) ? Math.sin(t * 22) * 4 : 0;
  const forward = ramp(t, w('L26', 8) - 0.1, w('L26', 8) + 0.4);
  // imagine: tag moves from home to sign
  const travel = ramp(t, w('L31', 0), w('L31', 4) + 0.2);
  return (
    <AbsoluteFill>
      <Shot from={s0} to={s1}>
        <ArtCam art={R2} cam={{x: 1376, y: 768, z: 1 + 0.04 * ramp(t, s0, s1, Easing.linear)}} />
        <BoardName name="WENDY’S" at={w('L22', 2)} />
        <Bubble x={720} y={330} at={w('L22', 0)} doneAt={w('L23', 10)} />
        <Guess
          x={1260}
          y0={540}
          correct={1}
          flipAt={w('L23', 5)}
          cards={[
            {text: 'A MASCOT?', at: le('L22') + 0.1},
            {text: 'THE FOUNDER’S DAUGHTER?', at: le('L22') + 0.55},
            {text: 'JUST A FRIENDLY WORD?', at: le('L22') + 1.0},
          ]}
        />
        <Chip text="ON THE RIGHT TRACK" x={1260} y={890} at={w('L23', 10)} mark="check" size={40} />
      </Shot>

      <Shot from={s1} to={s2} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Chip text="ONE MORE DETAIL" x={960} y={110} at={w('L24', 2)} until={w('L26', 0) - 0.2} tone="white" size={40} />
        <div style={{transform: `translateX(${wobble}px)`}}>
          <Morph
            x={960}
            y={400}
            size={200}
            segs={[
              {t: 'M', p: 1 - toWenda},
              {t: 'W', p: toWenda, color: C.gold},
              {t: 'E'},
              {t: 'LI', p: 1 - toWenda},
              {t: 'ND'},
              {t: 'A', p: 1 - toWendy},
              {t: 'Y', p: toWendy, color: C.gold},
            ]}
          />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.16em', color: C.goldLight, opacity: ramp(t, w('L25', 3), w('L25', 3) + 0.3) * (1 - ramp(t, w('L27', 12) - 0.3, w('L27', 12)))}}>HER NAME</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.16em', color: C.goldLight, opacity: ramp(t, w('L27', 12), w('L27', 12) + 0.3)}}>
          MELINDA → WENDA → <span style={{opacity: toWendy}}>WENDY</span>
        </div>
        {/* five blank name tags: the five children's names (not listed by the source) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const p = ramp(t, w('L26', 4) + 0.12 * i, w('L26', 4) + 0.12 * i + 0.3);
          const me = i === 2;
          const up = me ? forward : 0;
          const away = ramp(t, w('L27', 0) - 0.3, w('L27', 0));
          return (
            <div key={i} style={{position: 'absolute', left: 560 + i * 200, top: 720 - up * 60, transform: `translate(-50%, -50%) rotateY(${(1 - p) * 90}deg) scale(${1 + 0.15 * up})`, opacity: p * (1 - away), width: 160, height: 100, borderRadius: 14, background: me && forward > 0.5 ? C.gold : C.paper, border: `4px solid ${C.navy400}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 30, color: C.navy900}}>
              {me && forward > 0.5 ? 'NICKNAME' : ''}
            </div>
          );
        })}
        <Chip text="ALL FIVE CHILDREN’S NAMES WERE TRIED" x={960} y={870} at={w('L26', 4)} until={w('L27', 0) - 0.3} tone="white" size={34} />
        <Chip text="HER SIBLINGS COULDN’T PRONOUNCE IT" x={960} y={720} at={w('L27', 6)} tone="white" size={38} />
        <SourceChip text="Wendy’s official history" at={w('L26', 0)} />
      </Shot>

      <Shot from={s2} to={s3} fadeIn={0.3}>
        <SignShot
          from={s2}
          to={s3}
          top={<Morph x={0} y={0} size={118} color={C.navy900} shadow={false} segs={[{t: 'WENDY'}, {t: '’S', p: ramp(t, w('L28', 5) - 0.1, w('L28', 5) + 0.3)}]} />}
          bottom={<span>MELINDA’S NICKNAME</span>}
          bottomAt={w('L28', 1)}
        />
        <OriginStamp text="A FAMILY NICKNAME" x={960} y={880} at={w('L28', 6)} />
        <SourceChip text="Wendy’s official history" at={s2} />
      </Shot>

      <Shot from={s3} to={s4} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Imagine at={w('L29', 0)} />
        <HouseIcon x={480} y={520} size={300} opacity={ramp(t, w('L30', 0), w('L30', 0) + 0.4)} />
        <SignIcon x={1440} y={430} name="WENDY’S" p={ramp(t, w('L31', 4), w('L31', 4) + 0.4)} />
        {/* the travelling name tag: home window → sign */}
        <div style={{position: 'absolute', left: 480 + (1440 - 480) * travel, top: 560 - 230 * travel - Math.sin(travel * Math.PI) * 120, transform: `translate(-50%, -50%) scale(${1 - 0.3 * travel})`, opacity: ramp(t, w('L30', 4), w('L30', 4) + 0.3) * (1 - ramp(t, w('L31', 4) + 0.2, w('L31', 4) + 0.5)), padding: '8px 20px', borderRadius: 12, background: C.gold, fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.navy950}}>WENDY</div>
        <Chip text="AT HOME: A NICKNAME" x={480} y={760} at={w('L30', 1)} tone="white" size={34} />
        <Chip text="OUTSIDE: A SIGN" x={1440} y={760} at={w('L31', 0)} tone="white" size={34} />
        <Tickets name="WENDY’S" at={w('L32', 1)} until={ls('L33') + 0.3} y={900} n={12} />
        <PersonIcon x={1760} y={300} size={150} color={C.goldLight} opacity={ramp(t, w('L33', 5), w('L33', 5) + 0.3)} />
        <Chip text="IT CAME FROM A PERSON" x={1440} y={150} at={w('L33', 5)} mark="check" size={34} />
      </Shot>

      <Shot from={s4} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        {/* three layers: the sign, the nickname, her name. Stacked, then fanned out. */}
        {[
          {k: 'HER NAME', v: 'MELINDA', y: 760, hi: ramp(t, w('L35', 0), w('L35', 0) + 0.3)},
          {k: 'THE NICKNAME', v: 'WENDY', y: 520, hi: ramp(t, w('L36', 0), w('L36', 0) + 0.3)},
          {k: 'THE SIGN', v: 'WENDY’S', y: 280, hi: 0},
        ].map((l, i) => {
          const fan = ramp(t, w('L34', 4) - (2 - i) * 0.12, w('L34', 6) + 0.3 - (2 - i) * 0.12, Easing.inOut(Easing.cubic));
          const y = 520 + (l.y - 520) * fan + (1 - fan) * (2 - i) * -14;
          return (
            <div key={i} style={{position: 'absolute', left: 960, top: y, transform: `translate(-50%, -50%) rotate(${(1 - fan) * (i - 1) * 3}deg) scale(${1 + 0.06 * l.hi})`, width: 720, height: 190, borderRadius: 24, background: l.hi > 0.5 ? C.gold : C.paper, border: `6px solid ${l.hi > 0.5 || i === 2 ? C.gold : C.navy400}`, boxShadow: '0 16px 0 rgba(6,15,34,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, letterSpacing: '0.18em', color: C.navy500}}>{l.k}</div>
              <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 96, color: C.navy900, lineHeight: 1}}>{l.v}</div>
            </div>
          );
        })}
        <Chip text="ONE LAYER BENEATH" x={1540} y={520} at={w('L34', 4)} tone="white" size={34} />
        <Chip text="WENDY WAS REAL" x={1540} y={760} at={w('L35', 2)} mark="check" size={36} />
        <Chip text="ALSO A NICKNAME" x={380} y={520} at={w('L36', 4)} mark="check" size={36} />
      </Shot>
    </AbsoluteFill>
  );
};

/** Rubber-stamp ORIGIN label. */
const OriginStamp: React.FC<{text: string; x: number; y: number; at: number; until?: number}> = ({text, x, y, at, until = 1e9}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const p = pop(frame, fps, at, 10);
  const o = Math.min(1, p * 1.5) * (1 - ramp(t, until, until + 0.25));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(-4deg) scale(${1.35 - 0.35 * p})`, opacity: o, border: `5px solid ${C.gold}`, borderRadius: 16, padding: '8px 26px', background: 'rgba(6,15,34,0.92)', textAlign: 'center', whiteSpace: 'nowrap'}}>
      <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.22em', color: C.gold}}>ORIGIN</div>
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: C.white}}>{text}</div>
    </div>
  );
};

/* ================================ H–J · TACO BELL (L37–L49) ================================ */
const TacoBell: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s0 = ls('L37') - 0.35;
  const s1 = ls('L38') - 0.3;
  const s2 = ls('L41') - 0.2;
  const s3 = ls('L44') - 0.2;
  const s4 = ls('L49') - 0.2;
  const ring = (at: number) => (t > at && t < at + 1.6 ? Math.sin((t - at) * 14) * 22 * (1 - (t - at) / 1.6) : 0);
  const beat = t > le('L40') && t < ls('L41') ? Math.sin((t - le('L40')) * 9) * 10 : 0;
  const glen = ramp(t, w('L42', 0) - 0.1, w('L42', 0) + 0.35);
  const backTaco = ramp(t, w('L43', 0) - 0.2, w('L43', 0) + 0.2);
  const flipToPerson = ramp(t, w('L41', 5), w('L41', 6) + 0.2);
  const eq2 = ramp(t, ls('L47') - 0.3, ls('L47'));
  return (
    <AbsoluteFill>
      <Shot from={s0} to={s1}>
        <Board cards={[{name: 'ARBY’S', stamp: 'TWO BROTHERS'}, {name: 'WENDY’S', stamp: 'A FAMILY NICKNAME', stampAt: s0 + 0.2}]} focus={{i: 2, at: w('L37', 9) - 0.3, dur: 0.8}} />
      </Shot>

      <Shot from={s1} to={s2} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Morph x={960} y={300} size={180} segs={[{t: 'TACO', color: t > ls('L39') && t < ls('L40') ? C.gold : undefined}, {t: ' '}, {t: 'BELL', color: t > ls('L40') ? C.gold : undefined}]} />
        <BellIcon x={960} y={700} size={260} swing={ring(w('L38', 12)) + ring(w('L40', 1)) + beat} opacity={ramp(t, w('L38', 2), w('L38', 2) + 0.4)} />
        <Chip text="A TACO RESTAURANT" x={520} y={700} at={w('L39', 1)} tone="white" size={38} />
        <Chip text="A BELL" x={1400} y={700} at={w('L40', 1)} tone="white" size={38} />
        <Chip text="?" x={1130} y={560} at={le('L40') + 0.15} until={ls('L41')} tone="gold" size={60} />
      </Shot>

      <Shot from={s2} to={s3} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Morph
          x={960}
          y={250}
          size={170}
          segs={[
            {t: 'TACO ', p: Math.max(1 - glen, backTaco), em: 3.6},
            {t: 'GLEN ', p: glen * (1 - backTaco), em: 3.6, color: C.white},
            {t: 'BELL', color: C.gold},
          ]}
        />
        <div style={{transform: `scaleX(${Math.abs(1 - 2 * flipToPerson)})`, position: 'absolute', inset: 0, transformOrigin: '520px 640px'}}>
          {flipToPerson < 0.5 ? <BellIcon x={520} y={640} size={240} /> : <PersonIcon x={520} y={640} size={260} color={C.goldLight} />}
        </div>
        <Chip text="ALSO A PERSON" x={520} y={860} at={w('L41', 6)} until={w('L42', 0) + 0.1} mark="check" size={36} />
        <NameTag name="Glen Bell" note="Founder" x={520} y={860} at={w('L42', 1)} size={48} />
        <Stamp lines={['DOWNEY, CALIFORNIA', '1962']} x={1310} y={600} at={w('L42', 10)} at2={w('L42', 13)} />
        <Chip text="FIRST TACO BELL" x={1310} y={800} at={w('L42', 7)} mark="check" size={36} />
        <Chip text="HIS SURNAME" x={1240} y={400} at={w('L43', 1)} size={40} />
        <SourceChip text="Taco Bell newsroom (2022); Taco Bell “Glen Bell” story" at={w('L42', 2)} />
      </Shot>

      <Shot from={s3} to={s4} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Morph x={960} y={170} size={130} segs={[{t: 'TACO'}, {t: ' '}, {t: 'BELL', color: C.gold}]} />
        <Chip text="THE NAME READS DIFFERENTLY" x={960} y={300} at={w('L44', 6)} until={ls('L45') + 1.5} tone="white" size={34} />
        {/* equation rows (L45–L46) */}
        <div style={{opacity: 1 - eq2}}>
          <div style={{position: 'absolute', left: 560, top: 520, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 90, color: C.white, opacity: ramp(t, w('L45', 4), w('L45', 4) + 0.3)}}>TACO +</div>
          <BellIcon x={860} y={520} size={150} opacity={ramp(t, w('L45', 8), w('L45', 8) + 0.3)} />
          <Chip text="FOOD + OBJECT" x={1350} y={520} at={w('L45', 5)} mark={t > w('L45', 9) ? 'cross' : undefined} tone="white" size={38} />
          <div style={{position: 'absolute', left: 560, top: 760, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 90, color: C.white, opacity: ramp(t, w('L46', 2), w('L46', 2) + 0.3)}}>TACO +</div>
          <NameTag name="Glen Bell" x={900} y={760} at={w('L46', 6)} size={48} />
          <Chip text="FOOD + FOUNDER" x={1350} y={760} at={w('L46', 6)} mark="check" size={38} />
        </div>
        {/* two meanings (L47–L48) */}
        <div style={{opacity: eq2}}>
          <div style={{position: 'absolute', left: 960, top: 600, transform: 'translate(-50%, -50%)', fontFamily: FONT.display, fontWeight: 700, fontSize: 200, color: C.gold}}>BELL</div>
          <BellIcon x={450} y={600} size={220} swing={ring(w('L47', 1))} opacity={ramp(t, w('L47', 1), w('L47', 1) + 0.3)} />
          <Chip text="A SYMBOL" x={450} y={830} at={w('L47', 2)} tone="white" size={36} />
          <NameTag name="Glen Bell" x={1470} y={600} at={w('L48', 2)} size={50} />
          <Chip text="A FAMILY NAME" x={1470} y={830} at={w('L48', 3)} mark="check" size={36} />
        </div>
      </Shot>

      <Shot from={s4} to={1e9} fadeIn={0.3}>
        <Board
          cards={[
            {name: 'ARBY’S', stamp: 'TWO BROTHERS', stampAt: w('L49', 3) - 0.1},
            {name: 'WENDY’S', stamp: 'A FAMILY NICKNAME', stampAt: w('L49', 6) - 0.1},
            {name: 'TACO BELL', nameAt: s4 + 0.1, stamp: 'A FOUNDER’S SURNAME', stampAt: w('L49', 9) - 0.1},
          ]}
          glow={t < w('L49', 6) ? 0 : t < w('L49', 9) ? 1 : 2}
        />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ K–M · STARBUCKS (L50–L63) ================================ */
const Starbucks: React.FC = () => {
  const t = useT();
  const s0 = ls('L50') - 0.35;
  const s1 = ls('L51') - 0.2;
  const s2 = ls('L52') - 0.3;
  const s3 = ls('L57') - 0.25;
  const s4 = ls('L59') - 0.25;
  const s5 = ls('L62') - 0.2;
  const cover = ramp(t, w('L60', 1), w('L60', 2) + 0.4, Easing.inOut(Easing.cubic));
  const sGrow = ramp(t, w('L62', 4) - 0.15, w('L62', 4) + 0.25);
  return (
    <AbsoluteFill>
      <Shot from={s0} to={s1}>
        <Board cards={[{name: 'ARBY’S', stamp: 'TWO BROTHERS'}, {name: 'WENDY’S', stamp: 'A FAMILY NICKNAME'}, {name: 'TACO BELL', stamp: 'A FOUNDER’S SURNAME'}]} focus={{i: 3, at: w('L50', 7) - 0.3, dur: 0.8}} />
      </Shot>
      <Shot from={s1} to={s2} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Morph x={960} y={380} size={170} segs={[{t: 'STARBUCKS'}]} />
        <Chip text="A COFFEE SHOP NAME…" x={960} y={560} at={w('L51', 1)} tone="white" size={38} />
        <Chip text="…THAT LEADS TO A NOVEL" x={960} y={680} at={w('L51', 8)} mark="q" size={38} />
      </Shot>
      <Shot from={s2} to={s3} fadeIn={0.3}>
        <ArtCam art={R2} cam={{x: 1376, y: 768, z: 1 + 0.05 * ramp(t, s2, s3, Easing.linear)}} />
        <BoardName name="STARBUCKS" at={w('L52', 0)} size={92} />
        <Bubble x={720} y={330} at={w('L52', 5)} doneAt={w('L56', 1)} />
        <Guess
          x={1260}
          y0={540}
          correct={2}
          flipAt={w('L56', 1)}
          cards={[
            {text: 'A FOUNDER?', at: w('L53', 5) - 0.1},
            {text: 'A TYPE OF COFFEE?', at: w('L54', 1)},
            {text: 'A CHARACTER IN A BOOK?', at: w('L55', 2)},
          ]}
        />
        <Chip text="THE BOOK HOLDS THE ANSWER" x={1260} y={890} at={w('L56', 3)} mark="check" size={38} />
      </Shot>
      <Shot from={s3} to={s4} fadeIn={0.3}>
        <ArtCam art={R6} cam={{x: 1376, y: 768, z: 1 + 0.05 * ramp(t, s3, s4, Easing.linear)}} />
        {/* labels: STARBUCK = a character (first mate); the PEQUOD = the ship */}
        <div style={{position: 'absolute', left: 1265, top: 420, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: ramp(t, w('L57', 8), w('L57', 8) + 0.4)}}>
          <PersonIcon x={0} y={-150} size={130} color={C.navy500} />
          <div style={{position: 'relative', left: 0, top: 0, fontFamily: FONT.display, fontWeight: 700, fontSize: 96, color: C.navy900}}>STARBUCK</div>
          <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 32, letterSpacing: '0.1em', color: C.goldDeep}}>A CHARACTER · FIRST MATE</div>
        </div>
        <div style={{position: 'absolute', left: 646, top: 640, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: ramp(t, w('L57', 13), w('L57', 13) + 0.4), padding: '8px 20px', borderRadius: 14, background: 'rgba(6,15,34,0.9)', border: `3px solid ${C.navy400}`}}>
          <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 46, color: C.white}}>THE PEQUOD</div>
          <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.12em', color: C.goldLight}}>THE SHIP</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 28, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 60, color: C.white, opacity: ramp(t, w('L57', 15), w('L57', 15) + 0.4)}}>
          <span style={{fontStyle: 'italic'}}>MOBY-DICK</span> <span style={{fontFamily: FONT.ui, fontSize: 32, color: C.goldLight}}>· HERMAN MELVILLE</span>
        </div>
        <Chip text="LITERARY" x={760} y={920} at={w('L58', 8)} mark="check" size={38} />
        <Chip text="SEAFARING" x={1160} y={920} at={w('L58', 10)} mark="check" size={38} />
        <SourceChip text="Starbucks company profile" at={w('L57', 0)} />
      </Shot>
      <Shot from={s4} to={s5} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Imagine at={w('L59', 0)} />
        {/* a code-drawn book that opens */}
        <div style={{position: 'absolute', left: 960, top: 560, transform: 'translate(-50%, -50%)', width: 900, height: 560, perspective: 1600}}>
          <div style={{position: 'absolute', left: 450, top: 0, width: 450, height: 560, background: C.paper, borderRadius: '0 18px 18px 0', boxShadow: '0 16px 0 rgba(6,15,34,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Morph x={225} y={280} size={78} color={C.navy900} shadow={false} segs={[{t: 'STARBUCK', p: ramp(t, w('L61', 0) - 0.1, w('L61', 0) + 0.45)}]} />
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: 450, height: 560, background: C.paperShade, borderRadius: '18px 0 0 18px', opacity: cover > 0.5 ? 1 : 0}} />
          <div style={{position: 'absolute', left: 450, top: 0, width: 450, height: 560, transformOrigin: '0% 50%', transform: `rotateY(${-180 * cover}deg)`, background: cover < 0.5 ? C.navy600 : C.paperShade, border: `6px solid ${C.gold}`, borderRadius: '0 18px 18px 0', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.gold, opacity: cover < 0.5 ? 1 : 0}}>
            MOBY-DICK
          </div>
        </div>
        <Chip text="A BOOK OPENING" x={960} y={180} at={w('L60', 1)} tone="white" size={36} />
      </Shot>
      <Shot from={s5} to={1e9} fadeIn={0.3}>
        <SignShot
          from={s5}
          to={ls('L64')}
          top={<Morph x={0} y={0} size={90} color={C.navy900} shadow={false} segs={[{t: 'STARBUCK'}, {t: 'S', p: sGrow, color: C.goldDeep}]} />}
          bottom={<span>MOBY-DICK’S FIRST MATE</span>}
          bottomAt={w('L62', 4) + 0.3}
        />
        <OriginStamp text="A CHARACTER IN A NOVEL" x={960} y={880} at={w('L63', 2)} />
        <SourceChip text="Starbucks company profile" at={s5} />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ N · CLOSING RECAP (L64–L74) ================================ */
const RECAP = [
  {name: 'ARBY’S', mid: 'R.B.', origin: 'RAFFEL BROTHERS', note: 'Leroy & Forrest'},
  {name: 'WENDY’S', mid: 'WENDY', origin: 'MELINDA’S NICKNAME', note: 'a family nickname'},
  {name: 'TACO BELL', mid: 'BELL', origin: 'GLEN BELL', note: 'the founder’s surname'},
  {name: 'STARBUCKS', mid: 'STARBUCK', origin: 'FIRST MATE', note: 'a character in Moby-Dick'},
];
const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const s0 = ls('L64') - 0.35;
  const s1 = ls('L69') - 0.25;
  const s2 = ls('L71') - 0.25;
  const s3 = ls('L73') - 0.25;
  const lightAt = [w('L65', 1), w('L66', 1), w('L67', 1), w('L68', 2)];
  const cols = [240, 720, 1200, 1680];
  // the sign cycles through the four names on L71
  const cyc = [w('L71', 3), w('L71', 6), w('L71', 9), w('L71', 13)];
  let ci = 0;
  cyc.forEach((c, i) => {
    if (t >= c) ci = i;
  });
  return (
    <AbsoluteFill>
      <Shot from={s0} to={s1}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        {RECAP.map((r, i) => {
          const pn = pop(frame, fps, w('L64', 0) + 0.18 * i, 12);
          const lit = ramp(t, lightAt[i] - 0.1, lightAt[i] + 0.3);
          return (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: cols[i], top: 230, transform: `translate(-50%, -50%) scale(${0.7 + 0.3 * pn})`, opacity: Math.min(1, pn * 1.5), width: 420, padding: '22px 0', borderRadius: 20, background: C.paper, border: `6px solid ${lit > 0.5 ? C.gold : C.navy400}`, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: r.name.length > 7 ? 50 : 60, color: C.navy900}}>{r.name}</div>
              <div style={{position: 'absolute', left: cols[i], top: 360, transform: 'translate(-50%, -50%)', opacity: lit, fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.gold}}>↑</div>
              <div style={{position: 'absolute', left: cols[i], top: 450, transform: 'translate(-50%, -50%)', opacity: lit, fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.white, whiteSpace: 'nowrap'}}>{r.mid}</div>
              <div style={{position: 'absolute', left: cols[i], top: 540, transform: 'translate(-50%, -50%)', opacity: lit, fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.gold}}>↑</div>
              <div style={{position: 'absolute', left: cols[i], top: 650, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * lit})`, opacity: lit, width: 420, padding: '18px 0', borderRadius: 18, background: C.gold, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: r.origin.length > 14 ? 32 : 40, color: C.navy950}}>{r.origin}</div>
              <div style={{position: 'absolute', left: cols[i], top: 740, transform: 'translate(-50%, -50%)', opacity: lit, fontFamily: FONT.ui, fontWeight: 700, fontSize: 26, color: C.navy200, whiteSpace: 'nowrap'}}>{r.note}</div>
            </React.Fragment>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 58, color: C.white, opacity: ramp(t, w('L64', 0), w('L64', 0) + 0.4)}}>
          4 FAMILIAR NAMES · <span style={{color: C.gold}}>4 ORIGINS</span>
        </div>
      </Shot>
      <Shot from={s1} to={s2} fadeIn={0.3}>
        <ArtCam art={R2} cam={{x: 1376, y: 768, z: 1 + 0.04 * ramp(t, s1, s2, Easing.linear)}} />
        {RECAP.map((r, i) => (
          <div key={i} style={{position: 'absolute', left: 1010 + (i % 2) * 380, top: 180 + Math.floor(i / 2) * 140, transform: 'translate(-50%, -50%)', textAlign: 'center', opacity: ramp(t, w('L69', 0) + 0.15 * i, w('L69', 0) + 0.15 * i + 0.3)}}>
            <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 52, color: C.navy900, whiteSpace: 'nowrap'}}>{r.name}</div>
            <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, color: C.goldDeep, opacity: ramp(t, w('L70', 1) + 0.15 * i, w('L70', 1) + 0.15 * i + 0.3), whiteSpace: 'nowrap'}}>{r.origin}</div>
          </div>
        ))}
        <Chip text="NO STORY NEEDED TO ORDER LUNCH" x={1200} y={540} at={w('L69', 10)} tone="white" size={34} />
        <Chip text="BUT NOW YOU’LL NOTICE" x={1200} y={650} at={w('L70', 3)} mark="check" size={36} />
      </Shot>
      <Shot from={s2} to={s3} fadeIn={0.3}>
        <SignShot from={s2} to={s3} top={RECAP[ci].name} bottom={RECAP[ci].origin} bottomAt={t > w('L72', 6) ? 0 : cyc[ci] + 0.2} />
        <Chip text="A LITTLE PIECE OF HOW IT BEGAN" x={960} y={880} at={w('L72', 4)} mark="check" size={40} />
      </Shot>
      <Shot from={s3} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy900}}>
          <GridBg />
        </AbsoluteFill>
        <Chip text="WHICH STORY SURPRISED YOU MOST?" x={960} y={260} at={w('L73', 1)} mark="q" size={50} />
        {RECAP.map((r, i) => (
          <Chip key={i} text={r.name} x={cols[i]} y={460} at={w('L73', 2) + 0.12 * i} tone="white" size={38} />
        ))}
        <Chip text="WHAT NAME SHOULD WE INVESTIGATE NEXT?" x={960} y={700} at={w('L74', 2)} size={46} />
        <div style={{position: 'absolute', left: 960, top: 860, transform: 'translate(-50%, -50%)', fontFamily: FONT.ui, fontWeight: 700, fontSize: 32, color: C.navy200, opacity: ramp(t, w('L74', 6), w('L74', 6) + 0.4)}}>Tell us in the comments</div>
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ END (L75–L76) ================================ */
const EndCard: React.FC = () => {
  const t = useT();
  const words: [number, number, number] = [w('L76', 0), w('L76', 1), w('L76', 2)];
  const lift = 150 * ramp(t, words[2] + 2.2, words[2] + 3.2, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <BrandCard wordTimes={words} lift={lift} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 64, color: C.white, opacity: ramp(t, ls('L75'), ls('L75') + 0.3) * (1 - ramp(t, words[0] - 0.3, words[0]))}}>
        Now you know.
      </div>
    </AbsoluteFill>
  );
};

/* ================================ composition ================================ */
const Drift: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const t = useT();
  const s = 1 + 0.025 * ramp(t, from, to, Easing.linear);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

const ORDER: Array<[string, string]> = [
  ['arbys', 'B ARBY’S'],
  ['lesson', 'D ARBY’S LESSON'],
  ['wendy', 'E WENDY’S'],
  ['taco', 'H TACO BELL'],
  ['star', 'K STARBUCKS'],
  ['recap', 'N CLOSING'],
  ['end', 'END'],
];
export const ep005Windows = (): Record<string, number> => ({
  arbys: ls('L07') - 0.35,
  lesson: ls('L17') - 0.35,
  wendy: ls('L22') - 0.35,
  taco: ls('L37') - 0.35,
  star: ls('L50') - 0.35,
  recap: ls('L64') - 0.35,
  end: ls('L75') - 0.35,
});

export const Ep005Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = ep005Windows();
  const scenes: Record<string, React.ReactNode> = {arbys: <Arbys />, lesson: <ArbysLesson />, wendy: <Wendys />, taco: <TacoBell />, star: <Starbucks />, recap: <Closing />, end: <EndCard />};
  const next = (i: number) => (i + 1 < ORDER.length ? W[ORDER[i + 1][0]] : 1e9);
  const sectionAt = (t: number) => {
    let n = 'A COLD OPEN';
    for (const [k, name] of ORDER) if (t >= W[k]) n = name;
    return n;
  };
  // internal cuts that get a soft whoosh (scene changes inside sections)
  const cuts = [ls('L06'), ls('L11') + 4.0, ls('L13') - 0.25, ls('L18'), ls('L19'), ls('L20'), ls('L21'), ls('L24'), ls('L28'), ls('L29'), ls('L34'), ls('L38'), ls('L41'), ls('L44'), ls('L49'), ls('L51'), ls('L52'), ls('L57'), ls('L59'), ls('L62'), ls('L69'), ls('L71'), ls('L73')];
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      {cuts.map((c) => (
        <Sfx key={c} at={c - 0.45} file="whoosh.wav" vol={0.12} dur={0.7} />
      ))}
      <Sfx at={w('L11', 11) - 0.05} file="glint.wav" vol={0.16} dur={1.0} />
      <Sfx at={w('L15', 0) - 0.1} file="ding.wav" vol={0.12} dur={1.0} />
      <Sfx at={w('L28', 5) - 0.1} file="ding.wav" vol={0.12} dur={1.0} />
      <Sfx at={w('L62', 4) - 0.1} file="ding.wav" vol={0.12} dur={1.0} />
      <Sfx at={w('L76', 2) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
      {ORDER.map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Shot from={0} to={W.arbys}>
        <ColdOpen />
      </Shot>
      {ORDER.map(([k], i) => (
        <Shot key={k} from={W[k]} to={next(i)} fadeIn={0.35}>
          {k === 'end' ? scenes[k] : <Drift from={W[k] - 0.35} to={next(i)}>{scenes[k]}</Drift>}
        </Shot>
      ))}
      {showCaptions && <CaptionOverlay captions={ep005Captions} />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP005 · REVIEW COPY" notForPublication={timing.notForPublication === true} unresolved={[]} />
    </AbsoluteFill>
  );
};

// kept for later use (thumbnail)
export {OhsLogo, FULL};
