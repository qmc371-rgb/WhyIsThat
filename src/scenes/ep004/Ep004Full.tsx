// EP004 — "Why Does Metal Feel Colder Than Wood?" — Ordinary Has Secrets.
// Rules: gold arrows always run from warmer to cooler; no "cold" ever flows into a hand; the ice
// melt is qualitative (no timings or temperatures); every diagram says "Simplified illustration."
import React from 'react';
import {AbsoluteFill, Audio, Easing, staticFile, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BrandCard} from '../../brand/ohs';
import {line, timing} from './timing';
import {rand, ramp} from '../../lib/anim';
import {Appear, GridBg, Headline, useT} from '../../kit/kit';
import {Sfx, Shot} from '../../kit/shots';
import {CaptionOverlay, DraftBug} from '../../components/Overlays';
import ep004Captions from '../../data/ep004/captions.json';
import {ArtCam, Cam, Card, ForceArrow, Pin, camAt} from '../ep002/parts';
import {SimpleTag} from '../ep003/Head';

export const ls = (id: string) => line(id).start;
export const w = (id: string, i: number) => line(id).words[i].start;
const art = (n: string, wd = 2752, h = 1536) => ({file: `assets/higgsfield/ep004/${n}.jpg`, w: wd, h});
export const D1 = art('D1_hand_wood_v1');
export const D2 = art('D2_hand_metal_v1');
export const D3 = art('D3_character_blocks_v1');
export const D4 = art('D4_blocks_vertical_v1', 1536, 2752);
const FULL: Cam = {x: 1376, y: 768, z: 1};

/* ------------------------------ code-drawn parts ------------------------------ */
export const Block: React.FC<{x: number; y: number; w: number; h: number; kind: 'metal' | 'wood'; label?: string}> = ({x, y, w: bw, h, kind, label}) => (
  <g>
    <rect x={x} y={y} width={bw} height={h} rx={18} fill={kind === 'metal' ? '#8E9BB4' : '#E9C27A'} stroke={kind === 'metal' ? '#5D6B86' : '#C79A4A'} strokeWidth={4} />
    {kind === 'metal'
      ? Array.from({length: 7}, (_, i) => <line key={i} x1={x + 24} x2={x + bw - 24} y1={y + 24 + i * ((h - 48) / 6)} y2={y + 24 + i * ((h - 48) / 6)} stroke="rgba(255,255,255,0.22)" strokeWidth={3} />)
      : Array.from({length: 5}, (_, i) => <path key={i} d={`M${x + 20},${y + 30 + i * (h / 5)} q${bw * 0.25},${-18} ${bw * 0.5},0 t${bw * 0.5 - 40},0`} fill="none" stroke="#C79A4A" strokeWidth={3} opacity={0.7} />)}
    {label && (
      <text x={x + bw / 2} y={y + h + 46} textAnchor="middle" fill={C.white} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, letterSpacing: '0.14em'}}>
        {label}
      </text>
    )}
  </g>
);

/** A warm fingertip coming down onto a surface at (x, y). */
export const Finger: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-330} width={80} height={170} rx={20} fill={C.gold} />
    <path d="M-30,-170 L-30,-26 C-30,-6 -16,4 0,4 C16,4 30,-6 30,-26 L30,-170 Z" fill="#E9A57E" />
    <path d="M-16,-30 C-16,-14 16,-14 16,-30" fill="none" stroke="#C98863" strokeWidth={3} />
  </g>
);

/** Illustration dots spreading from a contact point into a block (speed = how far per second). */
export const Spread: React.FC<{cx: number; cy: number; box: [number, number, number, number]; at: number; speed: number; n?: number; until?: number}> = ({cx, cy, box, at, speed, n = 40, until = 1e9}) => {
  const t = useT();
  if (t < at || t > until + 0.3) return null;
  const out = 1 - ramp(t, until, until + 0.3);
  const [x0, y0, x1, y1] = box;
  return (
    <g opacity={out}>
      {Array.from({length: n}, (_, i) => {
        const life = 1.6;
        const ph = ((t - at) / life + rand(i * 7.7)) % 1;
        const ang = Math.PI * (0.08 + 0.84 * rand(i * 3.3));
        const r = ph * speed * life * (0.5 + 0.5 * rand(i * 9.1));
        const px = cx + Math.cos(ang) * r * (rand(i) > 0.5 ? 1 : -1);
        const py = cy + Math.sin(ang) * r;
        if (px < x0 + 6 || px > x1 - 6 || py < y0 + 6 || py > y1 - 6) return null;
        return <circle key={i} cx={px} cy={py} r={7} fill={C.goldLight} opacity={(1 - ph) * 0.9} />;
      })}
    </g>
  );
};

/** Liquid-in-glass thermometer with no scale numbers (level 0–1). */
export const Thermo: React.FC<{x: number; y: number; level: number}> = ({x, y, level}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-22} y={-260} width={44} height={260} rx={22} fill={C.paper} stroke={C.navy400} strokeWidth={4} />
    <circle cx={0} cy={22} r={40} fill={C.paper} stroke={C.navy400} strokeWidth={4} />
    <circle cx={0} cy={22} r={28} fill={C.gold} />
    <rect x={-10} y={-240 + 230 * (1 - level)} width={20} height={10 - (-240 + 230 * (1 - level))} rx={10} fill={C.gold} />
    {[0, 1, 2, 3, 4].map((k) => (
      <line key={k} x1={22} x2={40} y1={-220 + k * 50} y2={-220 + k * 50} stroke={C.navy300} strokeWidth={3} />
    ))}
  </g>
);

/** Ice cube sitting on a surface at (x, y = surface). melt 0–1 shrinks it and grows a puddle. */
export const Ice: React.FC<{x: number; y: number; size?: number; melt: number}> = ({x, y, size = 120, melt}) => {
  const s = size * (1 - 0.75 * melt);
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={size * 0.35 + size * 0.75 * melt} ry={10 + 12 * melt} fill="rgba(214,232,255,0.75)" />
      <rect x={x - s / 2} y={y - s} width={s} height={s} rx={s * 0.16} fill="#EEF5FF" stroke="#BFD3EE" strokeWidth={4} />
      <path d={`M${x - s * 0.3},${y - s * 0.75} L${x - s * 0.05},${y - s * 0.75}`} stroke="#FFFFFF" strokeWidth={Math.max(3, s * 0.07)} strokeLinecap="round" />
    </g>
  );
};

export const MeltNote: React.FC<{y?: number; x?: number}> = ({y = 1000, x = 960}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translateX(-50%)', fontFamily: FONT.ui, fontWeight: 700, fontSize: 24, color: C.navy200, background: 'rgba(6,15,34,0.75)', padding: '6px 14px', borderRadius: 8, whiteSpace: 'nowrap'}}>
    Qualitative animation: not a timed result.
  </div>
);

/* ================================ A · COLD OPEN (chair) ================================ */
const ColdOpen: React.FC = () => {
  const t = useT();
  const s1 = ls('L02') - 0.2;
  const s2 = ls('L03') - 0.2;
  const s3 = ls('L04') - 0.2;
  const s4 = ls('L05') - 0.25;
  const cam = (a: number, b: number): Cam => camAt(t, [[a, {x: 1250, y: 760, z: 1.08}], [b, {x: 1200, y: 760, z: 1.16}]]);
  return (
    <AbsoluteFill>
      <Shot from={0} to={s1}>
        <ArtCam art={D1} cam={cam(0, s1)} />
      </Shot>
      <Shot from={s1} to={s2} fadeIn={0.2}>
        <ArtCam art={D2} cam={cam(s1, s2)} />
      </Shot>
      <Shot from={s2} to={s3} fadeIn={0.2}>
        <ArtCam art={D1} cam={cam(s2, s3)} />
        <Pin label={[1240, 300]} k="WOOD" v="FEELS NORMAL" at={w('L03', 2)} size={44} tone="white" />
      </Shot>
      <Shot from={s3} to={s4} fadeIn={0.2}>
        <ArtCam art={D2} cam={cam(s3, s4)} />
        <Pin label={[1240, 300]} k="METAL" v="FEELS COLD" at={w('L04', 2)} size={44} />
      </Shot>
      <Shot from={s4} to={ls('L06') + 2.2} fadeIn={0.3}>
        <ArtCam art={D1} cam={camAt(t, [[s4, FULL], [ls('L06') + 2, {x: 1300, y: 760, z: 1.05}]])} />
        <Pin label={[1240, 220]} k="SAME CHAIR" v="SIDE BY SIDE ALL DAY" at={w('L05', 2)} size={34} tone="white" />
        <Pin label={[1240, 360]} v="NO FRIDGE · NO A/C AIMED AT IT" at={w('L05', 8)} size={30} tone="white" />
        <Pin label={[1180, 520]} v="SO WHY DOES ONE FEEL COLDER?" at={ls('L06')} size={36} />
      </Shot>
      <Shot from={ls('L06') + 2.2} to={1e9} fadeIn={0.3}>
        <BrandCard wordTimes={[le('L06') + 0.55, le('L06') + 0.8, le('L06') + 1.05]} />
      </Shot>
    </AbsoluteFill>
  );
};
const le = (id: string) => line(id).end;

/* ================================ B · SAME STARTING TEMPERATURE ================================ */
const SameTemp: React.FC = () => {
  const t = useT();
  const teaser = ls('L10') - 0.3;
  const melt = ramp(t, w('L11', 9), le('L11') + 0.6, Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <Shot from={0} to={teaser}>
        <ArtCam art={D3} cam={camAt(t, [[ls('L07') - 0.4, FULL], [teaser, {x: 1376, y: 820, z: 1.08}]])} />
        <Pin label={[960, 120]} side="center" v="SAME STARTING TEMPERATURE" at={w('L08', 6)} size={52} />
        <Pin label={[960, 250]} side="center" k="BUT THE METAL" v="CAN FEEL COLDER EVEN THOUGH IT ISN’T" at={w('L08', 12)} size={30} tone="white" />
        <Pin label={[960, 380]} side="center" mark="check" v="SETTLED TO THE SAME ROOM TEMPERATURE" at={w('L08', 3)} size={26} tone="white" />
      </Shot>
      <Shot from={teaser} to={1e9} fadeIn={0.35}>
        <GridBg />
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          <Block x={420} y={560} w={420} h={300} kind="wood" label="WOOD BLOCK" />
          <Block x={1080} y={560} w={420} h={300} kind="metal" label="METAL BLOCK" />
          <Ice x={630} y={560} melt={melt * 0.35} />
          <Ice x={1290} y={560} melt={melt * 0.8} />
        </svg>
        <Pin label={[960, 140]} side="center" v="AN ICE CUBE ON EACH" at={w('L10', 1)} size={44} />
        <Pin label={[960, 270]} side="center" k="UNDER SUITABLE CONDITIONS" v="THE METAL’S ICE CAN MELT FASTER" at={w('L11', 9)} size={32} />
        <MeltNote y={960} />
        <SimpleTag />
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ C+D · HAND → MATERIALS (split screen) ================================ */
const Transfer: React.FC = () => {
  const t = useT();
  const touch = w('L14', 2);
  const fast = w('L17', 4);
  const lights = ls('L20');
  const pL = 480;
  const pR = 1440;
  const top = 520;
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: C.navy600}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Block x={pL - 300} y={top} w={600} h={360} kind="wood" />
        <Block x={pR - 300} y={top} w={600} h={360} kind="metal" />
        <Finger x={pL} y={top} s={1.1} />
        <Finger x={pR} y={top} s={1.1} />
        {/* energy flows from the warmer fingertip INTO each cooler block: gold arrows point down */}
        <ForceArrow from={[pL - 70, top - 120]} to={[pL - 70, top + 40]} at={touch + 0.3} w={14} head={34} />
        <ForceArrow from={[pR - 70, top - 120]} to={[pR - 70, top + 40]} at={touch + 0.3} w={14} head={34} />
        <ForceArrow from={[pR + 70, top - 120]} to={[pR + 70, top + 70]} at={fast} w={20} head={42} />
        <Spread cx={pL} cy={top + 8} box={[pL - 300, top, pL + 300, top + 360]} at={lights - 0.2} speed={70} n={26} />
        <Spread cx={pR} cy={top + 8} box={[pR - 300, top, pR + 300, top + 360]} at={lights - 0.2} speed={260} n={40} />
      </svg>
      <div style={{position: 'absolute', left: 0, width: 960, top: 60, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.white}}>WOOD</div>
      <div style={{position: 'absolute', left: 960, width: 960, top: 60, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 56, color: C.white}}>METAL</div>
      <Pin label={[960, 250]} side="center" k="WARMER SKIN → COOLER OBJECT" v="CONDUCTION" at={w('L15', 4)} until={lights - 0.3} size={34} />
      <Pin label={[1440, 920]} side="center" k="METAL" v="CONDUCTS HEAT AWAY MORE READILY" at={fast} until={lights - 0.3} size={26} />
      <Pin label={[1440, 1010]} side="center" v="SKIN COOLS FASTER → FEELS COLDER" at={w('L18', 2)} until={lights - 0.3} size={26} tone="white" />
      <Pin label={[480, 920]} side="center" v="ENERGY SPREADS SLOWLY" at={w('L22', 5)} size={26} tone="white" />
      <Pin label={[1440, 920]} side="center" v="ENERGY SPREADS QUICKLY" at={w('L21', 6)} size={26} />
      <Pin label={[960, 200]} side="center" k="ILLUSTRATION ONLY" v="HEAT ISN’T GLOWING DOTS" at={w('L23', 6)} until={ls('L25') - 0.2} size={30} tone="white" />
      <Pin label={[1440, 200]} side="center" v="GOOD THERMAL CONDUCTOR" at={ls('L25')} size={30} />
      <Pin label={[480, 200]} side="center" v="MUCH POORER CONDUCTOR" at={ls('L26')} size={30} tone="white" />
      <div style={{position: 'absolute', left: 0, right: 0, top: 132, display: 'flex', justifyContent: 'center', opacity: ramp(t, w('L16', 2), w('L16', 2) + 0.4) * (1 - ramp(t, lights - 0.5, lights - 0.2))}}>
        <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.85)', padding: '8px 16px', borderRadius: 10, maxWidth: 1300, textAlign: 'center'}}>
          Touch also depends on heat capacity, density, contact, coatings and shape. Conductivity is our introductory focus.
        </span>
      </div>
      <Pin label={[960, 1010]} side="center" k="YOUR HAND REACTS TO" v="THE EXCHANGE OF ENERGY, NOT A TEMPERATURE READING" at={w('L27', 6)} size={24} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ E · THERMOMETER vs FINGERTIP ================================ */
const Questions: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Block x={260} y={640} w={500} h={260} kind="wood" />
        <Block x={1160} y={640} w={500} h={260} kind="metal" />
        <g opacity={ramp(t, ls('L28'), ls('L28') + 0.4)}>
          <Thermo x={420} y={590} level={0.55} />
          <Thermo x={1320} y={590} level={0.55} />
        </g>
        <g opacity={ramp(t, w('L30', 1), w('L30', 1) + 0.4)}>
          <Finger x={620} y={640} s={0.8} />
          <Finger x={1520} y={640} s={0.8} />
          <ForceArrow from={[1460, 520]} to={[1460, 660]} at={w('L30', 8)} w={18} head={40} />
          <ForceArrow from={[560, 560]} to={[560, 640]} at={w('L30', 8)} w={10} head={26} />
        </g>
      </svg>
      <Pin label={[960, 110]} side="center" k="THERMOMETER" v="“WHAT TEMPERATURE IS THIS OBJECT?”" at={w('L29', 2)} size={32} tone="white" />
      <Pin label={[960, 240]} side="center" k="YOUR FINGERS" v="“HOW QUICKLY IS IT CHANGING MY SKIN?”" at={w('L30', 8)} size={32} />
      <Pin label={[960, 370]} side="center" mark="check" v="SAME READING · DIFFERENT FEEL" at={w('L33', 5)} size={34} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ F · ICE ON SUBSTANTIAL BLOCKS ================================ */
const IceScene: React.FC = () => {
  const t = useT();
  const flow = w('L37', 2);
  const meltW = 0.3 * ramp(t, flow, le('L44'), Easing.linear);
  const meltM = 0.85 * ramp(t, flow, le('L40'), Easing.inOut(Easing.quad));
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <Block x={300} y={600} w={520} h={300} kind="wood" label="SUBSTANTIAL WOOD BLOCK" />
        <Block x={1100} y={600} w={520} h={300} kind="metal" label="SUBSTANTIAL METAL BLOCK" />
        <Ice x={560} y={600} size={140} melt={meltW} />
        <Ice x={1360} y={600} size={140} melt={meltM} />
        {/* now the blocks are warmer than the ice: arrows point UP into the ice */}
        <ForceArrow from={[440, 700]} to={[505, 590]} at={flow} w={10} head={26} />
        <ForceArrow from={[1240, 720]} to={[1305, 590]} at={flow} w={18} head={40} />
        <ForceArrow from={[1480, 720]} to={[1415, 590]} at={w('L38', 2)} w={18} head={40} />
      </svg>
      <Pin label={[960, 110]} side="center" v="SAME ROOM · BOTH WARMER THAN THE ICE" at={w('L35', 3)} until={w('L43', 7) - 0.3} size={34} tone="white" />
      <Pin label={[960, 230]} side="center" k="THIS TIME" v="ENERGY FLOWS FROM THE BLOCKS INTO THE ICE" at={flow} size={30} />
      <Pin label={[1360, 360]} side="center" v="METAL DELIVERS HEAT MORE READILY" at={w('L38', 2)} until={ls('L42') - 0.2} size={26} />
      <Pin label={[960, 360]} side="center" mark="check" k="NO CONTRADICTION" v="DIRECTION DEPENDS ON WHICH IS WARMER" at={ls('L42')} size={30} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 88, display: 'flex', justifyContent: 'center', gap: 16, opacity: ramp(t, w('L43', 7), w('L43', 7) + 0.4)}}>
        {['BLOCKS', 'SIZE', 'STARTING TEMPERATURES', 'CONTACT WITH THE ICE'].map((x) => (
          <span key={x} style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, color: C.white, border: `2px solid ${C.navy400}`, borderRadius: 10, padding: '6px 12px', background: 'rgba(6,15,34,0.85)'}}>
            {x}
          </span>
        ))}
      </div>
      <Pin label={[960, 470]} side="center" tone="white" k="QUALITATIVE ANIMATION" v="NOT A TIMED LAB RESULT" at={ls('L44') + 0.1} size={30} />
      <MeltNote y={990} />
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ G · REVERSE CASE (diagram only, no hand) ================================ */
const Reverse: React.FC = () => {
  const t = useT();
  const hot = w('L47', 7);
  const skinY = 300;
  return (
    <AbsoluteFill>
      <GridBg />
      <Shot from={0} to={ls('L51') - 0.2}>
        <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
          {/* abstract skin layer, not a hand */}
          <rect x={220} y={skinY - 60} width={1480} height={60} rx={14} fill="#E9A57E" opacity={ramp(t, hot, hot + 0.4)} />
          <Block x={300} y={560} w={520} h={300} kind="wood" />
          <Block x={1100} y={560} w={520} h={300} kind="metal" />
          {/* blocks are now HOTTER than skin: arrows point from the blocks up toward the skin */}
          <ForceArrow from={[560, 540]} to={[560, skinY + 20]} at={w('L48', 1)} w={10} head={26} />
          <ForceArrow from={[1300, 540]} to={[1300, skinY + 20]} at={w('L48', 1)} w={20} head={44} />
          <ForceArrow from={[1420, 540]} to={[1420, skinY + 20]} at={w('L49', 3)} w={20} head={44} />
        </svg>
        <div style={{position: 'absolute', left: 230, top: skinY - 52, fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, color: C.navy950, opacity: ramp(t, hot, hot + 0.4)}}>SKIN (DIAGRAM)</div>
        <Pin label={[960, 110]} side="center" k="IMAGINE" v="BOTH BLOCKS HOTTER THAN YOUR SKIN" at={hot} size={32} />
        <Pin label={[1360, 960]} side="center" v="METAL TRANSFERS IT FASTER → FEELS HOTTER" at={w('L49', 3)} size={26} />
        <Pin label={[560, 960]} side="center" v="WOOD: MORE SLOWLY" at={w('L49', 3) + 0.4} size={26} tone="white" />
      </Shot>
      <Shot from={ls('L51') - 0.2} to={1e9} fadeIn={0.3}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
          <Card at={w('L51', 3)} mark="cross" tone="white" k="INCOMPLETE RULE" text="“Metal feels cold.”" width={1100} size={52} />
          <Card at={w('L52', 1)} mark="check" k="BETTER RULE" text="Metal transfers heat readily. The temperature difference sets the direction." width={1100} size={46} />
        </div>
      </Shot>
      <SimpleTag />
    </AbsoluteFill>
  );
};

/* ================================ H · SAME ROOM ≠ SAME TEMPERATURE ================================ */
const Caveat: React.FC = () => {
  const t = useT();
  const items: Array<[string, number]> = [
    ['SUNLIGHT', w('L56', 0)],
    ['A NEARBY HEATER', w('L56', 2)],
    ['RECENT USE', w('L56', 5)],
  ];
  return (
    <AbsoluteFill>
      <GridBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, display: 'flex', justifyContent: 'center'}}>
        <Appear at={w('L55', 5)}>
          <Headline text="Same room ≠ same temperature" size={76} align="center" />
        </Appear>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center', gap: 30}}>
        {items.map(([n, at]) => (
          <Appear key={n} at={at} dir="scale">
            <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 38, color: C.white, padding: '20px 32px', border: `3px solid ${C.gold}`, borderRadius: 18, background: 'rgba(6,15,34,0.9)'}}>{n}</div>
          </Appear>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 580, display: 'flex', justifyContent: 'center'}}>
        <Card at={w('L57', 2)} mark="check" k="OUR COMPARISON ASSUMES" text="Both settled to the same temperature, away from those influences" width={1300} size={44} />
      </div>
      <div style={{opacity: ramp(t, 0, 0.1)}} />
    </AbsoluteFill>
  );
};

/* ================================ I · BACK TO THE CHAIR ================================ */
const ChairReturn: React.FC = () => {
  const t = useT();
  const s2 = ls('L62') - 0.25;
  return (
    <AbsoluteFill>
      <Shot from={0} to={s2}>
        <ArtCam art={D2} cam={camAt(t, [[ls('L59') - 0.4, FULL], [s2, {x: 1200, y: 760, z: 1.15}]])} />
        <Pin label={[1180, 260]} k="THE METAL MAY NOT HAVE STARTED COLDER" v="IT’S CARRYING YOUR HEAT AWAY FASTER" at={w('L61', 2)} size={34} maxWidth={640} />
      </Shot>
      <Shot from={s2} to={1e9} fadeIn={0.3}>
        <AbsoluteFill style={{background: C.navy950, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 18}}>
          <Appear at={ls('L62')}>
            <Headline text="Same room." size={88} align="center" />
          </Appear>
          <Appear at={ls('L63')}>
            <Headline text="Same starting temperature." size={88} align="center" />
          </Appear>
          <Appear at={ls('L64')}>
            <Headline text="Different experience." size={88} align="center" color={C.gold} />
          </Appear>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* ================================ J · END CARD ================================ */
const EndCard: React.FC = () => {
  const t = useT();
  const words: [number, number, number] = [w('L66', 0), w('L66', 1), w('L66', 2)];
  const lift = 150 * ramp(t, words[2] + 2.2, words[2] + 3.2, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <BrandCard wordTimes={words} lift={lift} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: FONT.display, fontWeight: 600, fontSize: 64, color: C.white, opacity: ramp(t, ls('L65'), ls('L65') + 0.3) * (1 - ramp(t, words[0] - 0.3, words[0]))}}>
        Now you know.
      </div>
    </AbsoluteFill>
  );
};

/* ================================ composition ================================ */
const Drift: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const t = useT();
  const s = 1 + 0.03 * ramp(t, from, to, Easing.linear);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};

export const ep004Windows = () => ({
  same: ls('L07') - 0.35,
  transfer: ls('L12') - 0.35,
  questions: ls('L28') - 0.35,
  ice: ls('L34') - 0.35,
  reverse: ls('L45') - 0.35,
  caveat: ls('L54') - 0.35,
  chair: ls('L59') - 0.35,
  end: ls('L65') - 0.35,
});
const ORDER: Array<[keyof ReturnType<typeof ep004Windows>, string]> = [
  ['same', 'B SAME TEMP'],
  ['transfer', 'C/D TRANSFER'],
  ['questions', 'E THERMOMETER'],
  ['ice', 'F ICE'],
  ['reverse', 'G REVERSE'],
  ['caveat', 'H CAVEAT'],
  ['chair', 'I CHAIR'],
  ['end', 'J END'],
];

export const Ep004Full: React.FC<{showDraftBug: boolean; showCaptions: boolean}> = ({showDraftBug, showCaptions}) => {
  const W = ep004Windows();
  const scenes: Record<string, React.ReactNode> = {same: <SameTemp />, transfer: <Transfer />, questions: <Questions />, ice: <IceScene />, reverse: <Reverse />, caveat: <Caveat />, chair: <ChairReturn />, end: <EndCard />};
  const next = (i: number) => (i + 1 < ORDER.length ? W[ORDER[i + 1][0]] : 1e9);
  const sectionAt = (t: number) => {
    let n = 'A COLD OPEN';
    for (const [k, name] of ORDER) if (t >= W[k]) n = name;
    return n;
  };
  return (
    <AbsoluteFill style={{background: C.navy900}}>
      <Audio src={staticFile(timing.audio)} />
      <Sfx at={ls('L06') + 2.0} file="whoosh.wav" vol={0.28} dur={0.7} />
      <Sfx at={le('L06') + 1.27} file="title_chime.wav" vol={0.3} dur={2.2} />
      {ORDER.map(([k]) => (
        <Sfx key={k} at={W[k] - 0.25} file="whoosh.wav" vol={0.14} dur={0.7} />
      ))}
      <Sfx at={w('L66', 2) + 0.22} file="title_chime.wav" vol={0.3} dur={2.2} />
      <Shot from={0} to={W.same}>
        <ColdOpen />
      </Shot>
      {ORDER.map(([k], i) => (
        <Shot key={k} from={W[k]} to={next(i)} fadeIn={0.35}>
          {k === 'end' ? scenes[k] : <Drift from={W[k] - 0.35} to={next(i)}>{scenes[k]}</Drift>}
        </Shot>
      ))}
      {showCaptions && <CaptionOverlay captions={ep004Captions} />}
      <DraftBug shotAt={sectionAt} show={showDraftBug} label="EP004 FULL · REVIEW COPY" notForPublication={timing.notForPublication === true} unresolved={[]} />
    </AbsoluteFill>
  );
};

