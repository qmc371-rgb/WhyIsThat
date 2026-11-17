// EP001 sections L07–L28. Every beat is anchored to narration phrases via cue().
import React from 'react';
import {AbsoluteFill, Easing} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {cue} from '../../lib/timing';
import {clamp01, keys, ramp, rand} from '../../lib/anim';
import {At, Appear, Chip, DrawPath, FullArt, GridBg, Headline, KitchenBlur, SchematicTag, useT, wavePath, IconTurntable} from '../../kit/kit';
import {BowlSide, BowlTop, SIDE, TOP_SPOTS} from '../../components/Bowl';
import {Kitchen} from '../../components/Kitchen';
import {Microwave, INSIDE_BOWL} from '../../components/Microwave';
import {CounterTop, Spoon} from '../../components/Props';
import {Callout} from '../../components/Callout';
import {SteamWisps} from '../../components/Effects';
import {CH, ChamberMap, CUT, EnergyLegend, MicrowaveCutaway, REFLECT_PATHS, SPOTS, SPOTS_B, Sparkles, WaterMolecule, mapI} from '../../components/Diagrams';
import {Shot, World} from './Opening';

/* =================== L07–L09: two questions =================== */
const QCard: React.FC<{n: number; title: string; at: number; x: number; children: React.ReactNode}> = ({n, title, at, x, children}) => (
  <At x={x} y={200}>
    <Appear at={at} dir="up" dist={60}>
      <div style={{width: 780, height: 700, background: C.navy800, border: `3px solid ${C.navy600}`, borderRadius: 32, position: 'relative', overflow: 'visible'}}>
        <div
          style={{
            position: 'absolute',
            left: -26,
            top: -26,
            width: 84,
            height: 84,
            borderRadius: 42,
            background: C.gold,
            color: C.navy950,
            fontFamily: FONT.display,
            fontWeight: 700,
            fontSize: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {n}
        </div>
        <svg width={780} height={430} style={{display: 'block'}}>
          {children}
        </svg>
        <div style={{padding: '0 48px', fontFamily: FONT.display, fontWeight: 600, fontSize: 44, lineHeight: 1.15, color: C.white}}>{title}</div>
      </div>
    </Appear>
  </At>
);

export const S02TwoQuestions: React.FC = () => {
  const t = useT();
  const L07 = cue('There are two questions', 27.81);
  const two = cue('two questions', 28.3);
  const L08 = cue('Why does the food heat unevenly', 32.23);
  const L09 = cue('And why doesn’t the temperature', 34.71);
  return (
    <AbsoluteFill>
      <GridBg />
      <Shot from={0} to={L08 - 0.05}>
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={960} y={500} s={1.5 + 0.04 * ramp(t, L07, L08, Easing.linear)} t={t} heat={{steam: 0.4, heat: 0.5}} />
          </svg>
          {[
            [560, 300, two],
            [1360, 300, two + 0.35],
          ].map(([x, y, at], i) => (
            <At key={i} x={x} y={y} anchor="cc">
              <Appear at={at} dir="scale">
                <div style={{width: 130, height: 130, borderRadius: 65, background: C.gold, color: C.navy950, fontFamily: FONT.display, fontWeight: 700, fontSize: 96, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${(i ? 1 : -1) * 10}deg)`}}>
                  ?
                </div>
              </Appear>
            </At>
          ))}
        </AbsoluteFill>
      </Shot>
      <Shot from={L08 - 0.05} to={1e9} fadeIn={0.25}>
        <AbsoluteFill>
          <QCard n={1} x={150} at={L08 - 0.05} title="Why does the food heat unevenly?">
            <BowlTop x={390} y={225} s={0.8} t={t} steam={0.55}>
              <circle r={42} fill="none" stroke={C.white} strokeWidth={5} strokeDasharray="10 9" />
            </BowlTop>
          </QCard>
          <QCard n={2} x={990} at={L09} title="Why doesn’t the bowl’s temperature tell you whether dinner is ready?">
            <BowlSide x={390} y={175} s={1.15} t={t} heat={{heat: 0.85}} />
          </QCard>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L10–L12: what the microwave does =================== */
export const S03WhatItDoes: React.FC = () => {
  const t = useT();
  const L10 = cue('Start with what the microwave', 39.32);
  const inside = cue('Inside the appliance', 42.49);
  const magnetron = cue('magnetron', 45.0);
  const produces = cue('produces microwaves', 45.6);
  const carry = cue('carry energy', 47.9);
  const chamber = cue('cooking chamber', 48.8);
  const reflect = cue('reflect off the metal walls', 51.0);
  const food = cue('interact with the food', 53.3);
  const L12 = cue('Water molecules respond', 55.7);
  const field = cue('changing electric field', 57.3);
  const absorbed = cue('Energy is absorbed', 59.69);
  const cam = {
    x: keys(t, [[L10 - 0.4, 980], [inside, INSIDE_BOWL.x]]),
    y: keys(t, [[L10 - 0.4, 540], [inside, 520]]),
    s: keys(t, [[L10 - 0.4, 1.0], [inside, 1.5]]),
  };
  const bowlY = CUT.turntableY - SIDE.FOOT * 0.95;
  const flash = Math.max(0, Math.sin(Math.PI * clamp01((t - reflect) / 1.4)));
  // molecules
  const dir = Math.tanh(2.6 * Math.sin(2 * Math.PI * 0.55 * (t - L12)));
  const heatLvl = ramp(t, absorbed, absorbed + 1.2);
  const molecules = Array.from({length: 9}, (_, i) => {
    const gx = (i % 3) - 1;
    const gy = Math.floor(i / 3) - 1;
    const jx = Math.sin(t * (9 + i) + i) * (2 + 9 * heatLvl);
    const jy = Math.cos(t * (8 + i) + i * 2) * (2 + 9 * heatLvl);
    const ang = 90 - 90 * dir + (rand(i * 5) - 0.5) * 50 + Math.sin(t * (11 + i)) * (6 + 24 * heatLvl);
    return {x: 700 + gx * 210 + (rand(i) - 0.5) * 50 + jx, y: 580 + gy * 190 + (rand(i + 20) - 0.5) * 40 + jy, ang};
  });
  return (
    <AbsoluteFill>
      <Shot from={0} to={inside - 0.05}>
        <World cam={cam}>
          <Kitchen />
          <Microwave
            door={0}
            light={1}
            display="COOK"
            progress={ramp(t, L10, inside + 1, Easing.linear)}
            turntable={t}
            inside={<BowlSide x={INSIDE_BOWL.x} y={INSIDE_BOWL.y} s={INSIDE_BOWL.s} t={t} shadow={false} />}
          />
        </World>
      </Shot>
      <Shot from={inside - 0.05} to={L12 - 0.05} fadeIn={0.35}>
        <AbsoluteFill>
          <GridBg />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <MicrowaveCutaway wallFlash={flash}>
              <BowlSide x={770} y={bowlY} s={0.95} t={t} shadow={false} />
              <Sparkles x={780} y={bowlY + 8} r={120} t={t} o={ramp(t, food + 0.4, food + 1)} />
            </MicrowaveCutaway>
            <DrawPath d={wavePath(CUT.guide, 9, 44, -t * 9)} at={produces} dur={1.3} width={5} />
            <DrawPath
              d={wavePath([[1195, 330], [930, 772], [620, 288], [352, 560], [700, 600]], 10, 56, -t * 9)}
              at={carry}
              dur={food + 0.9 - carry}
              width={5}
            />
            <DrawPath
              d={wavePath([[1195, 330], [500, 288], [352, 430], [860, 610]], 10, 56, -t * 9)}
              at={carry + 0.4}
              dur={food + 0.9 - carry - 0.4}
              width={5}
              stroke={C.goldLight}
            />
          </svg>
          <At x={60} y={52}>
            <Appear at={inside + 0.2}>
              <SchematicTag note="Simplified cutaway, not to scale." width={480} />
            </Appear>
          </At>
          <Callout target={[1405, 650]} label={[1460, 950]} k="COMPONENT" v="MAGNETRON" at={magnetron} />
          <Callout target={[600, 330]} label={[620, 150]} k="ENERGY GOES INTO THE" v="COOKING CHAMBER" at={chamber} />
          <Callout target={[344, 470]} label={[90, 950]} k="WAVES REFLECT OFF THE" v="METAL WALLS" tone="cold" at={reflect + 0.2} />
          <Callout target={[790, bowlY + 10]} label={[760, 950]} k="AND INTERACT WITH THE" v="FOOD" at={food + 0.2} />
        </AbsoluteFill>
      </Shot>
      <Shot from={L12 - 0.05} to={1e9} fadeIn={0.35}>
        <AbsoluteFill>
          <GridBg />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <clipPath id="lens">
                <circle cx={700} cy={580} r={390} />
              </clipPath>
            </defs>
            <circle cx={700} cy={580} r={390} fill={C.curryDeep} opacity={0.22} />
            <g clipPath="url(#lens)">
              {molecules.map((m, i) => (
                <WaterMolecule key={i} x={m.x} y={m.y} angle={m.ang} s={1.25} />
              ))}
              <Sparkles x={700} y={580} r={340} n={16} t={t} o={heatLvl} />
            </g>
            <circle cx={700} cy={580} r={390} fill="none" stroke={C.white} strokeWidth={8} />
            {/* alternating field arrow */}
            <g opacity={ramp(t, field - 0.6, field)}>
              <line x1={420} y1={104} x2={980} y2={104} stroke={C.gold} strokeWidth={8} strokeLinecap="round" />
              <path d="M0,-20 L30,0 L0,20 Z" fill={C.gold} transform={`translate(${700 + 290 * dir} 104) rotate(${dir >= 0 ? 0 : 180}) scale(${0.4 + 0.6 * Math.abs(dir)})`} />
            </g>
          </svg>
          <At x={700} y={128} anchor="tc">
            <Appear at={field - 0.5}>
              <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', color: C.gold}}>CHANGING ELECTRIC FIELD</div>
            </Appear>
          </At>
          <At x={1200} y={230}>
            <Appear at={L12}>
              <Headline text="Water molecules respond" size={70} maxWidth={640} />
            </Appear>
          </At>
          <At x={1200} y={430}>
            <Appear at={L12 + 0.4}>
              <SchematicTag note="Zoomed-in, simplified view. Not to scale." width={560} />
            </Appear>
          </At>
          <At x={1200} y={620}>
            <Appear at={absorbed}>
              <Chip k="ENERGY IS ABSORBED" text="AND BECOMES HEAT" mark="check" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L13–L14: not hot air =================== */
export const S04NotHotAir: React.FC = () => {
  const t = useT();
  const L13 = cue('But this isn’t a little oven', 63.32);
  const leftovers = cue('over your leftovers', 67.4);
  const L14 = cue('And it isn’t heating every part', 68.87);
  const flows = [300, 380, 460, 540];
  return (
    <AbsoluteFill>
      <Shot from={0} to={L14 - 0.05}>
        <AbsoluteFill>
          <KitchenBlur cx={700} cy={560} s={2.1} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={960} y={560} s={1.6} t={t} />
            <g opacity={ramp(t, L13 + 0.3, L13 + 1.0) * (1 - 0.6 * ramp(t, leftovers + 0.6, leftovers + 0.9))}>
              {flows.map((y, i) => (
                <DrawPath key={i} d={wavePath([[220, y], [1700, y]], 14, 160, -t * 4 + i)} at={L13 + 0.3 + i * 0.15} dur={1.4} stroke={C.white} width={6} />
              ))}
            </g>
          </svg>
          <At x={960} y={90} anchor="tc">
            <Appear at={L13 + 0.3}>
              <Chip k="NOT THIS" text="AN EVEN BLANKET OF HOT AIR" tone="white" />
            </Appear>
          </At>
          <At x={960} y={440} anchor="cc">
            <Appear at={leftovers + 0.6} dir="scale">
              <svg width={260} height={260} viewBox="0 0 44 44">
                <circle cx={22} cy={22} r={20} fill={C.gold} />
                <path d="M14 14 L30 30 M30 14 L14 30" stroke={C.navy950} strokeWidth={5} strokeLinecap="round" />
              </svg>
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L14 - 0.05} to={1e9} fadeIn={0.3}>
        <AbsoluteFill>
          <CounterTop />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <defs>
              <clipPath id="foodc">
                <circle cx={960} cy={560} r={262} />
              </clipPath>
              <filter id="unevenBlur">
                <feGaussianBlur stdDeviation={14} />
              </filter>
            </defs>
            <BowlTop x={960} y={560} s={1.45} t={t} />
            <g clipPath="url(#foodc)" opacity={ramp(t, L14 + 0.2, L14 + 1.2)}>
              <rect x={600} y={200} width={720} height={720} fill={C.navy950} opacity={0.8} />
              <g filter="url(#unevenBlur)">
                {Array.from({length: 18 * 18}, (_, k) => {
                  const i = k % 18;
                  const j = Math.floor(k / 18);
                  const I = mapI(0.2 + (i / 18) * 0.6, 0.15 + (j / 18) * 0.6, 0.5);
                  return <rect key={k} x={698 + i * 29.2} y={298 + j * 29.2} width={30} height={30} fill={C.gold} opacity={0.06 + 0.94 * Math.pow(I, 0.85)} />;
                })}
              </g>
            </g>
          </svg>
          <At x={90} y={80}>
            <Appear at={L14 + 0.2}>
              <Chip k="NOT EVERY PART" text="HEATED EQUALLY" tone="white" mark="cross" />
            </Appear>
          </At>
          <At x={1420} y={80}>
            <Appear at={L14 + 0.6}>
              <SchematicTag note="Illustrative pattern, not measured." width={420} />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L15–L22: the invisible map + the turntable =================== */
const TT = {x: CH.x + CH.w / 2, y: CH.y + CH.h / 2, r: 250, s: 0.85}; // s = bowl scale (radius ≈ 196)

export const S05MapAndTurntable: React.FC = () => {
  const t = useT();
  const L15 = cue('Imagine an invisible map', 72.53);
  const map = cue('invisible map', 73.6);
  const more = cue('more microwave energy', 78.2);
  const less = cue('Others deliver less', 79.79);
  const L17 = cue('Waves reflecting around', 81.72);
  const pattern = cue('uneven pattern', 85.6);
  const L18 = cue('Our animation makes', 87.42);
  const real = cue('Real patterns', 92.23);
  const changes = cue('the food itself changes them', 94.64);
  const L19 = cue('But the important idea', 96.98);
  const different = cue('different places can receive', 99.63);
  const L20 = cue('That explains why the plate spins', 103.76);
  const spins = cue('plate spins', 104.9);
  const through = cue('through different regions', 108.5);
  const spread = cue('helping spread out the energy', 110.15);
  const L22 = cue('It improves the situation', 113.18);
  const promise = cue('It doesn’t promise identical', 115.55);

  const reveal = ramp(t, map - 0.3, map + 1.8, Easing.inOut(Easing.quad));
  const morph = ramp(t, changes, changes + 1.4);
  const bump = (at: number, dur = 1.4) => Math.sin(Math.PI * clamp01((t - at) / dur));
  const brightAt = cue('stronger regions bright', 88.9);
  const darkAt = cue('weaker ones dark', 90.4);
  const pulse = Math.max(bump(pattern, 1.2), bump(brightAt));
  const dimDark = 0.4 * bump(darkAt);
  const push = 1 + 0.025 * ramp(t, L15, cue('It doesn’t promise identical', 115.55) + 3, Easing.linear);
  const bowlIn = ramp(t, changes - 0.2, changes + 0.5, Easing.out(Easing.back(1.2)));
  const spinT = Math.max(0, t - spins);
  const rot = spinT * 42 * ramp(t, spins, spins + 0.8);
  // marker on the thick chunk, rotating with the plate
  const markerAt = (time: number) => {
    const r = Math.max(0, time - spins) * 42;
    const a = (r * Math.PI) / 180;
    const [lx, ly] = TOP_SPOTS.thick;
    const x = lx * TT.s;
    const y = ly * TT.s;
    return [TT.x + x * Math.cos(a) - y * Math.sin(a), TT.y + x * Math.sin(a) + y * Math.cos(a)];
  };
  const trail = Array.from({length: 40}, (_, i) => markerAt(t - i * 0.06));
  const markerOn = ramp(t, cue('The turntable carries', 106.33), cue('The turntable carries', 106.33) + 0.5);
  const panelHead = t < L20 - 0.2 ? 'An invisible map' : 'Why the plate spins';
  const headSwap = t < L20 - 0.2 ? L15 + 0.2 : L20;

  return (
    <AbsoluteFill>
      <GridBg />
      <AbsoluteFill style={{transform: `scale(${push})`}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <ChamberMap reveal={reveal} morph={morph} pulse={pulse} dim={dimDark}>
          <g opacity={bowlIn} transform={`translate(0 ${(1 - bowlIn) * -60})`}>
            <circle cx={TT.x} cy={TT.y} r={TT.r} fill="none" stroke={C.white} strokeWidth={4} strokeDasharray="14 12" opacity={ramp(t, L20, L20 + 0.6)} transform={`rotate(${rot} ${TT.x} ${TT.y})`} />
            <g transform={`rotate(${rot} ${TT.x} ${TT.y})`}>
              <BowlTop x={TT.x} y={TT.y} s={TT.s} t={t} />
            </g>
          </g>
          {markerOn > 0 && (
            <g opacity={markerOn}>
              <polyline points={trail.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.white} strokeWidth={6} strokeLinecap="round" opacity={0.75} />
              <circle cx={trail[0][0]} cy={trail[0][1]} r={13} fill={C.gold} stroke={C.white} strokeWidth={5} />
            </g>
          )}
        </ChamberMap>
        {REFLECT_PATHS.map((pts, i) => (
          <DrawPath key={i} d={wavePath(pts, 9, 52, -t * 8)} at={L17 + 0.15 + i * 0.5} dur={2.6} until={L18 - 0.3} width={5} stroke={i ? C.goldLight : C.gold} />
        ))}
        {t > different && (
          <g>
            {[SPOTS_B.bright, SPOTS_B.dark].map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={46 + 6 * Math.sin(t * 5)} fill="none" stroke={i ? C.white : C.gold} strokeWidth={6} opacity={ramp(t, different, different + 0.4) * (1 - ramp(t, L20 - 0.4, L20))} />
            ))}
          </g>
        )}
      </svg>
      <Callout target={[SPOTS.bright.x, SPOTS.bright.y]} label={[SPOTS.bright.x - 30, 165]} side="left" k="MORE" v="MICROWAVE ENERGY" at={more} until={L17 - 0.3} />
      <Callout target={[SPOTS.dark.x, SPOTS.dark.y]} label={[300, 950]} k="LESS" v="MICROWAVE ENERGY" tone="cold" at={less} until={L17 - 0.3} />
      <Callout target={[SPOTS_B.bright.x, SPOTS_B.bright.y]} label={[SPOTS_B.bright.x - 30, 165]} side="left" k="THIS PLACE" v="MORE ENERGY" at={different + 0.1} until={L20 - 0.4} />
      <Callout target={[SPOTS_B.dark.x, SPOTS_B.dark.y]} label={[300, 950]} k="THIS PLACE" v="LESS ENERGY" tone="cold" at={different + 0.5} until={L20 - 0.4} />

      <At x={1180} y={200}>
        <Appear at={headSwap} key={panelHead}>
          <Headline text={panelHead} size={70} maxWidth={660} />
        </Appear>
      </At>
      <At x={1180} y={330}>
        <Appear at={L17 + 0.4} until={L18 - 0.3}>
          <Chip text="OVERLAPPING REFLECTIONS" k="WAVES BOUNCE AROUND" size={30} />
        </Appear>
      </At>
      <At x={1180} y={330}>
        <Appear at={L18 + 0.2} until={L20 - 0.3}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 28}}>
            <SchematicTag width={620} />
            <EnergyLegend width={600} left="WEAKER · DARK" right="STRONGER · BRIGHT" />
          </div>
        </Appear>
      </At>
      <At x={1180} y={580}>
        <Appear at={real} until={L20 - 0.3}>
          <div style={{width: 640, fontFamily: FONT.ui, fontWeight: 500, fontSize: 30, lineHeight: 1.45, color: C.navy200}}>
            Real patterns are more complicated
            <span style={{color: C.white, opacity: ramp(t, changes, changes + 0.4)}}>, and the food itself changes them.</span>
          </div>
        </Appear>
      </At>
      <At x={1180} y={760}>
        <Appear at={different} until={L20 - 0.3}>
          <Chip text="DIFFERENT PLACES, DIFFERENT AMOUNTS OF ENERGY" size={28} maxWidth={660} />
        </Appear>
      </At>
      <At x={1180} y={360}>
        <Appear at={through} until={1e9}>
          <Chip k="THE TURNTABLE" text="CARRIES FOOD THROUGH DIFFERENT REGIONS" size={28} maxWidth={660} icon={<IconTurntable size={70} spin={rot} />} />
        </Appear>
      </At>
      <At x={1180} y={520}>
        <Appear at={spread}>
          <Chip text="SPREADING OUT THE ENERGY IT RECEIVES" size={28} maxWidth={660} />
        </Appear>
      </At>
      <At x={1180} y={680}>
        <Appear at={L22}>
          <Chip text="IT IMPROVES THE SITUATION" size={28} mark="check" maxWidth={660} />
        </Appear>
      </At>
      <At x={1180} y={800}>
        <Appear at={promise}>
          <Chip text="NOT IDENTICAL TEMPERATURES EVERYWHERE" size={28} mark="cross" tone="white" maxWidth={660} />
        </Appear>
      </At>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* =================== L23–L24: heater analogy =================== */
export const S07Heater: React.FC = () => {
  const t = useT();
  const L23 = cue('Think of people taking turns', 119.49);
  const moving = cue('Moving everyone around helps', 123.15);
  const notEqual = cue('It doesn’t make everyone', 125.57);
  const zoom = 1 + 0.06 * ramp(t, L23 - 0.4, L23 + 11, Easing.linear);
  const orbit = ramp(t, moving - 0.2, moving + 0.6);
  const arrows = [0, 1, 2].map((k) => {
    const a = ((t - moving) * 0.9 + (k * 2 * Math.PI) / 3) % (2 * Math.PI);
    return {x: 960 + Math.cos(a) * 560, y: 640 + Math.sin(a) * 120, ang: (Math.atan2(Math.cos(a) * 120, -Math.sin(a) * 560) * 180) / Math.PI};
  });
  return (
    <AbsoluteFill>
      <FullArt file="assets/higgsfield/H5_heater_analogy_v1.jpg" w={2752} h={1536} zoom={zoom} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <g opacity={orbit}>
          <ellipse cx={960} cy={640} rx={560} ry={120} fill="none" stroke={C.gold} strokeWidth={6} strokeDasharray="20 16" />
          {arrows.map((a, i) => (
            <path key={i} d="M-18,-14 L10,0 L-18,14 Z" fill={C.gold} transform={`translate(${a.x} ${a.y}) rotate(${a.ang})`} />
          ))}
        </g>
      </svg>
      <At x={960} y={50} anchor="tc">
        <Appear at={L23 + 0.2}>
          <Chip k="ANALOGY" text="TAKING TURNS NEAR A HEATER" />
        </Appear>
      </At>
      <At x={70} y={190}>
        <Appear at={moving + 0.1}>
          <Chip text="MOVING EVERYONE AROUND HELPS" size={28} mark="check" />
        </Appear>
      </At>
      <At x={1850} y={190} anchor="tl">
        <div style={{transform: 'translateX(-100%)'}}>
          <Appear at={notEqual + 0.1}>
            <Chip text="NOT EQUALLY WARM AT THE SAME MOMENT" size={28} mark="cross" tone="white" />
          </Appear>
        </div>
      </At>
    </AbsoluteFill>
  );
};

/* =================== L25–L28: dinner isn't uniform =================== */
export const S08Dinner: React.FC = () => {
  const t = useT();
  const L25 = cue('And dinner has another complication', 130.41);
  const L26 = cue('It isn’t one uniform material', 133.31);
  const thick = cue('A thick piece of food', 135.85);
  const sauce = cue('a pool of sauce', 137.28);
  const drier = cue('a drier section', 138.9);
  const composition = cue('Their composition', 141.83);
  const shape = cue('shape and ability', 142.63);
  const pass = cue('ability to pass heat along', 143.12);
  const L28 = cue('That’s why a spinning plate', 146.71);
  const bite = cue('from one bite to the next', 151.4);
  const B = {x: 960, y: 580, s: 1.4};
  const at = (k: keyof typeof TOP_SPOTS): [number, number] => [B.x + TOP_SPOTS[k][0] * B.s, B.y + TOP_SPOTS[k][1] * B.s];
  return (
    <AbsoluteFill>
      <CounterTop />
      <Shot from={0} to={L28 - 0.05}>
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlTop x={B.x} y={B.y} s={B.s} t={t} steam={0.25} />
          </svg>
          <At x={80} y={64}>
            <Appear at={L25 + 0.1}>
              <Headline text="Another complication" size={64} />
            </Appear>
          </At>
          <At x={80} y={160}>
            <Appear at={L26}>
              <Chip text="NOT ONE UNIFORM MATERIAL" size={28} tone="white" />
            </Appear>
          </At>
          <Callout target={at('thick')} label={[1450, 690]} k="A THICK" v="PIECE OF FOOD" at={thick + 0.1} />
          <Callout target={at('sauce')} label={[1450, 400]} k="A POOL" v="OF SAUCE" at={sauce + 0.05} />
          <Callout target={at('rice')} label={[470, 560]} side="left" k="A DRIER" v="SECTION" tone="cold" at={drier + 0.1} />
          <At x={960} y={1000} anchor="cc">
            <div style={{display: 'flex', gap: 22}}>
              <Appear at={composition}>
                <Chip text="COMPOSITION" size={26} />
              </Appear>
              <Appear at={shape}>
                <Chip text="SHAPE" size={26} />
              </Appear>
              <Appear at={pass}>
                <Chip text="HOW WELL IT PASSES HEAT ALONG" size={26} />
              </Appear>
            </div>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L28 - 0.05} to={1e9} fadeIn={0.3}>
        <AbsoluteFill>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <Spoon x={640} y={560} s={2.1} rot={28} dollop={1} />
            <Spoon x={1280} y={560} s={2.1} rot={-28} dollop={1} />
            <SteamWisps origins={[{x: 610, y: 470}, {x: 650, y: 450}, {x: 690, y: 470}]} height={300} intensity={0.9} t={t} width={14} />
          </svg>
          <At x={960} y={70} anchor="tc">
            <Appear at={L28 + 0.1}>
              <Chip k="EVEN WITH A SPINNING PLATE" text="VERY DIFFERENT TEMPERATURES" icon={<IconTurntable size={64} spin={t * 40} />} />
            </Appear>
          </At>
          <At x={640} y={820} anchor="tc">
            <Appear at={bite - 0.4}>
              <Chip text="ONE BITE" size={30} />
            </Appear>
          </At>
          <At x={1280} y={820} anchor="tc">
            <Appear at={bite + 0.2}>
              <Chip text="THE NEXT" size={30} tone="white" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

