// EP001 sections L29–L56. Every beat is anchored to narration phrases via cue().
import React from 'react';
import {AbsoluteFill, Easing, staticFile} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {cue, line} from '../../lib/timing';
import {keys, ramp} from '../../lib/anim';
import {At, Appear, Chip, FullArt, GridBg, Headline, IconHourglass, IconManual, IconPackage, IconSpoon, IconThermometer, IconTurntable, KitchenBlur, SchematicTag, useT, wavePath, DrawPath} from '../../kit/kit';
import {BowlSide, BowlTop, SIDE} from '../../components/Bowl';
import {Kitchen, COUNTER_Y} from '../../components/Kitchen';
import {Microwave} from '../../components/Microwave';
import {CounterTop, Spoon} from '../../components/Props';
import {Callout} from '../../components/Callout';
import {HeatLines} from '../../components/Effects';
import {BowlCrossSection, XS_POINTS} from '../../components/Diagrams';
import {TitleCard} from '../../components/TitleCard';
import {Shot, World} from './Opening';

const WARMTH_NOTE = 'Brighter = warmer. Simplified, not measured.';

/* =================== L29–L34: the bowl =================== */
export const S09Bowl: React.FC = () => {
  const t = useT();
  const L29 = cue('Now for the bowl', 154.23);
  const L30 = cue('Even microwave-safe containers', 155.89);
  const into = cue('heat moves into them', 158.8);
  const L31 = cue('So a hot bowl can tell you', 161.79);
  const L32 = cue('It cannot tell you', 165.66);
  const L33 = cue('The outside of the container', 170.66);
  const centerFood = cue('the center of the food', 172.6);
  const different = cue('are different places', 173.9);
  const L34 = cue('Judging the whole dinner', 175.6);
  const rim = cue('by the rim', 176.9);
  const pool = cue('entire swimming pool', 178.6);
  const corner = cue('touching one corner', 180.4);
  // pool zoom: drift toward the fingertip (measured: 43% across, 81% down)
  const z = 1 + 0.16 * ramp(t, pool - 0.4, corner + 1.2, Easing.inOut(Easing.cubic));
  const s0 = Math.max(1920 / 2752, 1080 / 1536) * z;
  const tipX = (1920 - 2752 * s0) * 0.43 + 1183 * s0;
  const tipY = (1080 - 1536 * s0) * 0.81 + 1244 * s0;
  return (
    <AbsoluteFill>
      <Shot from={0} to={L33 - 0.05}>
        <AbsoluteFill>
          <GridBg />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={540} y={470} s={1.45} t={t} heat={{heat: 0.85 * ramp(t, L30, into + 0.6)}} />
            <BowlCrossSection x={1360} y={470} s={0.9} band={0.55} core={0.12} intoWall={ramp(t, into - 0.2, into + 1.4)} />
          </svg>
          <At x={80} y={64}>
            <Appear at={L29}>
              <Headline text="Now for the bowl" size={64} />
            </Appear>
          </At>
          <At x={1360} y={130} anchor="tc">
            <Appear at={L30 + 0.2}>
              <SchematicTag note="Cross-section. Brighter = warmer. Simplified." width={560} />
            </Appear>
          </At>
          <At x={1360} y={690} anchor="tc">
            <Appear at={into}>
              <Chip text="HEAT MOVES FROM THE FOOD INTO THE BOWL" size={24} />
            </Appear>
          </At>
          <At x={80} y={820}>
            <Appear at={L31 + 0.1}>
              <Chip k="A HOT BOWL TELLS YOU" text="HEAT HAS REACHED THE CONTAINER" size={30} mark="check" />
            </Appear>
          </At>
          <At x={80} y={950}>
            <Appear at={L32 + 0.1}>
              <Chip k="IT CANNOT TELL YOU" text="EVERY PART HAS REACHED THE SAME TEMPERATURE" size={30} mark="cross" tone="white" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L33 - 0.05} to={L34 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <GridBg />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlCrossSection x={960} y={500} s={1.3} band={0.55} core={0.12} />
          </svg>
          <Callout target={[960 + XS_POINTS.outerWall[0] * 1.3, 500 + XS_POINTS.outerWall[1] * 1.3]} label={[120, 900]} k="THE OUTSIDE OF" v="THE CONTAINER" at={L33 + 0.15} />
          <Callout target={[960 + XS_POINTS.foodCenter[0] * 1.3, 500 + XS_POINTS.foodCenter[1] * 1.3]} label={[1250, 900]} k="THE CENTER OF" v="THE FOOD" tone="cold" at={centerFood} />
          <At x={960} y={70} anchor="tc">
            <Appear at={different}>
              <Headline text="Different places" size={64} align="center" />
            </Appear>
          </At>
          <At x={1480} y={60}>
            <Appear at={L33 + 0.3}>
              <SchematicTag note={WARMTH_NOTE} width={380} />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L34 - 0.05} to={pool - 0.15} fadeIn={0.3}>
        <AbsoluteFill>
          <KitchenBlur cx={700} cy={560} s={2.1} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={900} y={460} s={1.8} t={t} heat={{heat: 0.8}} />
          </svg>
          <Callout target={[900 + SIDE.RX * 1.8 * 0.97, 470]} label={[1420, 260]} k="JUDGING DINNER BY" v="THE RIM" at={rim - 0.1} />
        </AbsoluteFill>
      </Shot>
      <Shot from={pool - 0.15} to={1e9} fadeIn={0.35}>
        <AbsoluteFill>
          <AbsoluteFill style={{transform: `scale(1)`}}>
            <FullArt file="assets/higgsfield/H6_pool_analogy_v1.jpg" w={2752} h={1536} zoom={z} ox={0.43} oy={0.81} />
          </AbsoluteFill>
          <Callout target={[tipX, tipY]} label={[1100, 200]} k="ONE CORNER" v="ISN’T THE WHOLE POOL" tone="cold" at={corner} />
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L35–L39: the inside-out misconception =================== */
export const S10InsideOut: React.FC = () => {
  const t = useT();
  const L35 = cue('And there’s one more misconception', 182.81);
  const L36 = cue('Microwaves don’t simply cook', 186.71);
  const insideOut = cue('from the inside out', 188.9);
  const L37 = cue('Energy heats regions', 191.06);
  const reach = cue('it can reach', 192.3);
  const spreads = cue('while heat also spreads', 194.83);
  const L38 = cue('The middle of a thick portion', 198.37);
  const L39 = cue('Adding more time', 201.95);
  const hotter = cue('regions hotter', 204.2);
  const band = 0.75 * ramp(t, reach - 0.2, reach + 1.6) + 0.25 * ramp(t, hotter - 0.3, hotter + 1.5);
  const core = 0.08 + 0.12 * ramp(t, spreads, L39) + 0.08 * ramp(t, hotter, hotter + 2);
  const XS = {x: 960, y: 560, s: 1.15};
  const outArrows = ramp(t, L36 + 0.3, L36 + 1.1) * (1 - ramp(t, L37 - 0.4, L37));
  return (
    <AbsoluteFill>
      <GridBg />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <BowlCrossSection
          x={XS.x}
          y={XS.y}
          s={XS.s}
          band={band}
          core={core}
          energyIn={ramp(t, L37 - 0.2, reach + 1.2)}
          conduction={ramp(t, spreads, spreads + 1.6)}
          t={t}
        />
        <g opacity={outArrows}>
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const a = (deg * Math.PI) / 180;
            const x0 = XS.x + Math.cos(a) * 30;
            const y0 = XS.y + 40 + Math.sin(a) * 18;
            const x1 = XS.x + Math.cos(a) * 230;
            const y1 = XS.y + 40 + Math.sin(a) * 120;
            return (
              <g key={deg}>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke={C.white} strokeWidth={7} strokeDasharray="14 10" strokeLinecap="round" />
                <path d="M-14,-11 L6,0 L-14,11 Z" fill={C.white} transform={`translate(${x1} ${y1}) rotate(${(Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI})`} />
              </g>
            );
          })}
        </g>
      </svg>
      <At x={80} y={64}>
        <Appear at={L35}>
          <Headline text="One more misconception" size={64} />
        </Appear>
      </At>
      <At x={XS.x} y={XS.y + 40} anchor="cc">
        <Appear at={insideOut + 0.2} until={L37 - 0.3} dir="scale">
          <svg width={150} height={150} viewBox="0 0 44 44">
            <circle cx={22} cy={22} r={20} fill={C.white} />
            <path d="M14 14 L30 30 M30 14 L14 30" stroke={C.navy950} strokeWidth={5} strokeLinecap="round" />
          </svg>
        </Appear>
      </At>
      <At x={80} y={170}>
        <Appear at={L36 + 0.2} until={L37 - 0.3}>
          <Chip k="THICK FOOD" text="NOT SIMPLY COOKED FROM THE INSIDE OUT" size={28} mark="cross" tone="white" />
        </Appear>
      </At>
      <At x={1480} y={60}>
        <Appear at={L37}>
          <SchematicTag note={WARMTH_NOTE} width={380} />
        </Appear>
      </At>
      <At x={60} y={880}>
        <Appear at={reach}>
          <Chip k="ENERGY" text="HEATS REGIONS IT CAN REACH" size={28} maxWidth={560} />
        </Appear>
      </At>
      <At x={1860} y={880}>
        <div style={{transform: 'translateX(-100%)'}}>
          <Appear at={spreads + 0.2}>
            <Chip k="CONDUCTION" text="HEAT SPREADS THROUGH THE FOOD" size={28} tone="white" maxWidth={580} />
          </Appear>
        </div>
      </At>
      <Callout target={[XS.x, XS.y + 42 * XS.s]} label={[1300, 200]} k="THE MIDDLE OF A THICK PORTION" v="MAY STILL BE CATCHING UP" tone="cold" at={L38 + 0.2} until={L39 - 0.2} />
      <At x={80} y={170}>
        <Appear at={L39}>
          <Chip k="ADD MORE TIME" text="ALREADY-HOT REGIONS GET HOTTER" size={28} />
        </Appear>
      </At>
    </AbsoluteFill>
  );
};

/* =================== L40–L46: what helps =================== */
const Cover: React.FC<{x: number; y: number; s: number; drop: number}> = ({x, y, s, drop}) => {
  const {RX, RY} = SIDE;
  return (
    <g transform={`translate(${x} ${y - (1 - drop) * 320}) scale(${s})`} opacity={Math.min(1, drop * 2)}>
      <path d={`M${-RX * 1.05},0 C${-RX * 1.05},${-RY * 2.7} ${RX * 1.05},${-RY * 2.7} ${RX * 1.05},0 Z`} fill={C.paper} opacity={0.55} />
      <path d={`M${-RX * 1.05},0 C${-RX * 1.05},${-RY * 2.7} ${RX * 1.05},${-RY * 2.7} ${RX * 1.05},0`} fill="none" stroke={C.white} strokeWidth={5} />
      <ellipse cx={0} cy={0} rx={RX * 1.05} ry={RY * 0.5} fill="none" stroke={C.white} strokeWidth={4} opacity={0.8} />
      <rect x={-22} y={-RY * 2.08 - 14} width={44} height={20} rx={8} fill={C.gold} />
      <circle cx={RX * 0.55} cy={-RY * 1.35} r={7} fill={C.navy700} />
      <circle cx={RX * 0.72} cy={-RY * 1.0} r={7} fill={C.navy700} />
    </g>
  );
};

export const S11WhatHelps: React.FC = () => {
  const t = useT();
  const L40 = cue('So what helps', 208.3);
  const L41 = cue('When the instructions call for stirring', 209.88);
  const stir = cue('stir', 211.89);
  const L42 = cue('You’re moving warmer and cooler', 212.99);
  const cold = cue('the same cold center', 217.3);
  const L43 = cue('Follow the recommended covering', 219.49);
  const covering = cue('covering and standing', 220.9);
  const standing = cue('standing instructions', 221.5);
  const L44 = cue('Standing time gives heat', 223.68);
  const stops = cue('after the microwave stops', 226.9);
  const L45 = cue('Follow the food’s package instructions', 229.2);
  const manual = cue('appliance manual', 231.9);
  const checks = cue('temperature checks', 234.5);
  const L46 = cue('The bowl feeling hot', 236.66);
  const substitute = cue('substitute', 238.9);
  // stirring
  const stirP = ramp(t, stir - 0.3, L43, Easing.inOut(Easing.quad));
  const bowlRot = stirP * 160;
  const spoonA = (t - stir + 0.3) * 2.6;
  const spoon = t > stir - 0.4 ? {x: 960 + Math.cos(spoonA) * 150, y: 600 + Math.sin(spoonA) * 150, rot: (spoonA * 180) / Math.PI - 20} : {x: 1500, y: 1250, rot: -30};
  const mixP = ramp(t, L42 + 0.4, cold + 0.6);
  const warm = {r: 200 * (1 - 0.55 * mixP), a: -0.4 + mixP * 3.2};
  const cool = {r: 30 + 90 * mixP, a: 2.6 + mixP * 3.2};
  return (
    <AbsoluteFill>
      <Shot from={0} to={L41 - 0.05}>
        <AbsoluteFill>
          <GridBg />
          <At x={960} y={540} anchor="cc">
            <Appear at={L40} dir="scale">
              <Headline text="So what helps?" size={130} align="center" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L41 - 0.05} to={L43 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <CounterTop />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlTop x={960} y={600} s={1.4} t={t} rot={bowlRot} steam={0.2} />
            <g opacity={ramp(t, L42 + 0.3, L42 + 0.8)}>
              <circle cx={960 + Math.cos(warm.a) * warm.r} cy={600 + Math.sin(warm.a) * warm.r} r={22} fill={C.gold} stroke={C.white} strokeWidth={5} />
              <circle cx={960 + Math.cos(cool.a) * cool.r} cy={600 + Math.sin(cool.a) * cool.r} r={22} fill={C.white} stroke={C.navy700} strokeWidth={5} />
            </g>
            <DrawPath d="M 690 380 A 330 330 0 0 1 1230 380" at={stir} dur={0.8} width={8} />
            <DrawPath d="M 1230 820 A 330 330 0 0 1 690 820" at={stir + 0.3} dur={0.8} width={8} />
            <Spoon x={spoon.x} y={spoon.y} s={1.35} rot={spoon.rot} />
          </svg>
          <At x={80} y={64}>
            <Appear at={L41 + 0.1}>
              <Chip k="1 · WHEN THE INSTRUCTIONS CALL FOR IT" text="STIR" size={40} />
            </Appear>
          </At>
          <At x={1860} y={64}>
            <div style={{transform: 'translateX(-100%)'}}>
              <Appear at={L42 + 0.3}>
                <div style={{display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end'}}>
                  <Chip text="WARMER" size={26} />
                  <Chip text="COOLER" size={26} tone="white" />
                </div>
              </Appear>
            </div>
          </At>
          <At x={960} y={1000} anchor="cc">
            <Appear at={cold - 0.2}>
              <Chip text="NOT LEAVING THE SAME COLD CENTER IN PLACE" size={28} mark="check" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L43 - 0.05} to={L44 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <KitchenBlur cx={700} cy={560} s={2.1} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={760} y={560} s={1.6} t={t} />
            <Cover x={760} y={560} s={1.6} drop={ramp(t, covering - 0.3, covering + 0.4, Easing.out(Easing.cubic))} />
          </svg>
          <At x={1250} y={330}>
            <Appear at={covering - 0.2}>
              <Chip k="2 · AS RECOMMENDED" text="COVER" size={40} />
            </Appear>
          </At>
          <At x={1250} y={520}>
            <Appear at={standing}>
              <Chip k="3 · AS RECOMMENDED" text="STANDING TIME" size={40} icon={<IconHourglass size={84} t={t - standing} />} />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L44 - 0.05} to={L45 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <GridBg />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlCrossSection
              x={760}
              y={560}
              s={1.15}
              band={0.85 - 0.3 * ramp(t, L44, L45)}
              core={0.1 + 0.42 * ramp(t, L44 + 0.3, L45)}
              conduction={ramp(t, L44 + 0.2, L44 + 1.6)}
            />
          </svg>
          <At x={1300} y={240}>
            <Appear at={L44}>
              <IconHourglass size={200} t={t - L44} />
            </Appear>
          </At>
          <At x={1300} y={500}>
            <Appear at={L44 + 0.4}>
              <Chip k="STANDING TIME" text="HEAT KEEPS SPREADING" size={34} />
            </Appear>
          </At>
          <At x={1300} y={650}>
            <Appear at={stops}>
              <Chip text="AFTER THE MICROWAVE STOPS" size={28} tone="white" />
            </Appear>
          </At>
          <At x={60} y={60}>
            <Appear at={L44 + 0.2}>
              <SchematicTag note={WARMTH_NOTE} width={420} />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L45 - 0.05} to={L46 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <GridBg />
          <At x={960} y={110} anchor="tc">
            <Appear at={L45}>
              <Chip k="4" text="FOLLOW THE INSTRUCTIONS" size={44} />
            </Appear>
          </At>
          {[
            {x: 420, at: L45 + 0.3, icon: <IconPackage size={230} />, k: 'THE FOOD’S', v: 'PACKAGE INSTRUCTIONS'},
            {x: 960, at: manual, icon: <IconManual size={230} />, k: 'YOUR', v: 'APPLIANCE MANUAL'},
            {x: 1500, at: checks, icon: <IconThermometer size={230} />, k: 'ANY', v: 'TEMPERATURE CHECKS THEY REQUIRE'},
          ].map((c) => (
            <At key={c.x} x={c.x} y={330} anchor="tc">
              <Appear at={c.at}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, width: 460}}>
                  {c.icon}
                  <div style={{textAlign: 'center'}}>
                    <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.16em', color: C.gold}}>{c.k}</div>
                    <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, lineHeight: 1.2, color: C.white, marginTop: 6}}>{c.v}</div>
                  </div>
                </div>
              </Appear>
            </At>
          ))}
        </AbsoluteFill>
      </Shot>
      <Shot from={L46 - 0.05} to={1e9} fadeIn={0.3}>
        <AbsoluteFill>
          <KitchenBlur cx={640} cy={600} s={2.2} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <HeatLines x={814} y={470} w={600} h={300} intensity={0.85} t={t} />
            <image href={staticFile('assets/higgsfield/H4_hands_switch_cut.png')} x={-7.5} y={0} width={1935} height={1080} />
          </svg>
          <At x={1250} y={160}>
            <Appear at={substitute - 0.5}>
              <Chip k="A HOT BOWL" text="ISN’T A SUBSTITUTE" size={38} mark="cross" tone="white" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L47–L54: recap =================== */
const BigCard: React.FC<{at: number; icon: React.ReactNode; k: string; v: string}> = ({at, icon, k, v}) => (
  <Appear at={at}>
    <div style={{width: 500, height: 560, background: C.navy800, border: `3px solid ${C.navy600}`, borderRadius: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
      {icon}
      <div style={{textAlign: 'center', padding: '0 30px'}}>
        <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, letterSpacing: '0.16em', color: C.gold}}>{k}</div>
        <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 46, lineHeight: 1.1, color: C.white, marginTop: 10}}>{v}</div>
      </div>
    </div>
  </Appear>
);

export const S12Recap: React.FC = () => {
  const t = useT();
  const L47 = cue('So your microwave doesn’t have', 241.6);
  const L48 = cue('Heating depends on where', 246.06);
  const goes = cue('where the energy goes', 246.9);
  const meets = cue('what it meets', 248.62);
  const after = cue('how heat moves afterward', 249.65);
  const L49 = cue('The spinning plate helps', 251.92);
  const L50 = cue('Stirring moves the food', 254.7);
  const L51 = cue('Standing time helps heat spread', 257.06);
  const L52 = cue('And that hot bowl', 259.52);
  const L53 = cue('It’s reporting on the bowl', 261.21);
  const complete = cue('complete report on dinner', 264.5);
  const cam = {x: keys(t, [[L47 - 0.4, 1080], [L48, 1180]]), y: 520, s: keys(t, [[L47 - 0.4, 1.2], [L48, 1.32]])};
  return (
    <AbsoluteFill>
      <Shot from={0} to={L48 - 0.05}>
        <World cam={cam}>
          <Kitchen />
          <Microwave door={0} light={0} display=":)" />
          <BowlSide x={860} y={COUNTER_Y - SIDE.FOOT * 0.5} s={0.5} t={t} heat={{steam: 0.5}} />
        </World>
      </Shot>
      <Shot from={L48 - 0.05} to={L49 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <GridBg />
          <At x={960} y={110} anchor="tc">
            <Appear at={L48}>
              <Headline text="Heating depends on…" size={70} align="center" />
            </Appear>
          </At>
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <DrawPath d={wavePath([[230, 470], [580, 470]], 14, 60, -t * 8)} at={goes} dur={0.8} width={7} />
            <g opacity={ramp(t, meets, meets + 0.3)}>
              <BowlTop x={960} y={470} s={0.6} t={t} />
            </g>
            <g opacity={ramp(t, after, after + 0.3)} stroke={C.white} strokeWidth={8} strokeLinecap="round">
              <line x1={1360} y1={470} x2={1450} y2={470} />
              <line x1={1640} y1={470} x2={1550} y2={470} />
              <line x1={1500} y1={360} x2={1500} y2={430} />
              <line x1={1500} y1={580} x2={1500} y2={510} />
            </g>
          </svg>
          {[
            {x: 405, at: goes, v: 'WHERE THE ENERGY GOES'},
            {x: 960, at: meets, v: 'WHAT IT MEETS'},
            {x: 1500, at: after, v: 'HOW HEAT MOVES AFTERWARD'},
          ].map((c) => (
            <At key={c.x} x={c.x} y={720} anchor="tc">
              <Appear at={c.at}>
                <Chip text={c.v} size={30} />
              </Appear>
            </At>
          ))}
        </AbsoluteFill>
      </Shot>
      <Shot from={L49 - 0.05} to={L52 - 0.05} fadeIn={0.3}>
        <AbsoluteFill>
          <GridBg />
          <At x={960} y={250} anchor="tc">
            <div style={{display: 'flex', gap: 50}}>
              <BigCard at={L49} icon={<IconTurntable size={220} spin={t * 50} />} k="SPINNING PLATE" v="Helps with location" />
              <BigCard at={L50} icon={<IconSpoon size={220} />} k="STIRRING" v="Moves the food around" />
              <BigCard at={L51} icon={<IconHourglass size={220} t={t - L51} />} k="STANDING TIME" v="Helps heat spread" />
            </div>
          </At>
        </AbsoluteFill>
      </Shot>
      <Shot from={L52 - 0.05} to={1e9} fadeIn={0.3}>
        <AbsoluteFill>
          <KitchenBlur cx={700} cy={560} s={2.1} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <BowlSide x={700} y={470} s={1.7} t={t} heat={{heat: 0.85}} />
          </svg>
          <At x={1180} y={250}>
            <Appear at={L52}>
              <Headline text="And that hot bowl?" size={64} />
            </Appear>
          </At>
          <At x={1180} y={420}>
            <Appear at={L53}>
              <Chip k="IT’S REPORTING ON" text="THE BOWL" size={40} mark="check" />
            </Appear>
          </At>
          <At x={1180} y={600}>
            <Appear at={complete - 0.5}>
              <Chip k="NOT A COMPLETE REPORT ON" text="DINNER" size={40} mark="cross" tone="white" />
            </Appear>
          </At>
        </AbsoluteFill>
      </Shot>
    </AbsoluteFill>
  );
};

/* =================== L55–L56: outro =================== */
export const S13Outro: React.FC = () => {
  const t = useT();
  const L55 = cue('Everyday things', 266.8);
  const surprising = cue('Surprising explanations', 268.03);
  const words = (() => {
    try {
      const w = line('L56').words;
      return [w[1].start, w[2].start, w[3].start] as [number, number, number];
    } catch {
      return [270.6, 270.85, 271.05] as [number, number, number];
    }
  })();
  const lift = 170 * ramp(t, words[2] + 2.2, words[2] + 3.2, Easing.inOut(Easing.cubic));
  return (
    <AbsoluteFill>
      <Shot from={0} to={words[0] - 0.35}>
        <AbsoluteFill style={{background: C.navy950, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column', gap: 24}}>
          <Appear at={L55}>
            <Headline text="Everyday things." size={92} align="center" />
          </Appear>
          <Appear at={surprising}>
            <Headline text="Surprising explanations." size={92} color={C.gold} align="center" />
          </Appear>
        </AbsoluteFill>
      </Shot>
      <Shot from={words[0] - 0.35} to={1e9} fadeIn={0.3}>
        <TitleCard wordTimes={words} tagline="Everyday things. Surprising explanations." taglineAt={words[2] + 0.9} lift={lift} />
      </Shot>
    </AbsoluteFill>
  );
};
