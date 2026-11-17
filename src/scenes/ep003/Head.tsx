// EP003 code diagrams: simplified side-view head (facing right) with the two routes to the inner ear.
// YELLOW = sound through air · CYAN = vibrations through bone and tissue. Anatomy is schematic.
import React from 'react';
import {C, FONT} from '../../brand/tokens';
import {ramp} from '../../lib/anim';
import {useT} from '../../kit/kit';
import {FlowPath} from '../ep002/parts';

export const YEL = C.gold;
export const CYAN = '#56D6EA';

export const HP = {
  mouth: [1160, 548] as [number, number],
  ear: [735, 440] as [number, number],
  inner: [812, 455] as [number, number],
  throat: [930, 690] as [number, number],
  phone: [1500, 600] as [number, number],
};
export const AIR_TO_EAR = 'M1168,548 C1340,560 1380,320 1250,185 C1120,60 760,85 700,250 C680,320 692,385 724,425 L800,452';
export const BONE_1 = 'M1110,570 C1030,560 930,520 822,462';
export const BONE_2 = 'M930,700 C900,620 860,540 818,468';
export const AIR_TO_PHONE = 'M1168,548 C1260,552 1340,566 1440,580';
export const PHONE_TO_EAR = 'M1440,560 C1340,470 1330,300 1240,200 C1110,70 760,90 700,250 C680,320 692,385 724,425 L800,452';

const HEAD =
  'M640,300 C640,170 760,110 900,115 C1040,120 1120,200 1130,300 L1135,360 L1172,428 C1180,442 1170,452 1158,455 L1140,460 L1146,500 C1150,514 1141,520 1131,522 L1141,545 L1133,560 C1141,592 1130,626 1095,640 C1060,652 1020,650 990,640 L962,700 L962,820 L760,820 L760,690 C690,640 640,560 640,460 Z';

export const HeadBase: React.FC<{dim?: number; vib?: number}> = ({dim = 1, vib = 0}) => {
  const t = useT();
  return (
    <g opacity={dim}>
      <path d={HEAD} fill={C.navy700} stroke={C.navy400} strokeWidth={4} strokeLinejoin="round" />
      {vib > 0 &&
        [0, 1, 2].map((k) => {
          const ph = (t * 0.9 + k / 3) % 1;
          return <circle key={k} cx={940} cy={560} r={60 + ph * 260} fill="none" stroke={CYAN} strokeWidth={4} opacity={(1 - ph) * 0.45 * vib} />;
        })}
      <ellipse cx={HP.ear[0]} cy={HP.ear[1]} rx={30} ry={52} fill={C.navy500} stroke={C.navy300} strokeWidth={3} />
      <ellipse cx={HP.ear[0] + 4} cy={HP.ear[1] + 6} rx={11} ry={20} fill={C.navy900} />
      {/* simplified inner ear (spiral) */}
      <path d={`M${HP.inner[0]},${HP.inner[1]} m-4,0 a6,6 0 1,1 12,0 a12,12 0 1,1 -24,0 a18,18 0 1,1 36,0`} fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" />
      <path d="M1112,548 C1124,552 1136,552 1146,548" stroke={C.navy950} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const PhoneIcon: React.FC<{x: number; y: number; s?: number; on?: number; speaker?: boolean}> = ({x, y, s = 1, on = 1, speaker = false}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={on}>
    <rect x={-46} y={-90} width={92} height={180} rx={16} fill={C.navy800} stroke={C.white} strokeWidth={4} />
    <rect x={-36} y={-72} width={72} height={136} rx={8} fill={C.navy950} />
    <circle cx={-60} cy={-20} r={0} />
    {speaker ? (
      <g fill={C.white}>
        <rect x={-14} y={70} width={28} height={6} rx={3} />
      </g>
    ) : (
      <circle cx={-30} cy={-6} r={7} fill={C.white} />
    )}
  </g>
);

/** Legend for the two routes. */
export const RouteLegend: React.FC<{at: number; x?: number; y?: number; bone?: boolean}> = ({at, x = 1880, y = 1040, bone = true}) => {
  const t = useT();
  if (t < at) return null;
  const row = (color: string, text: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <svg width={70} height={22} viewBox="0 0 80 24">
        <path d="M4,12 L58,12" stroke={color} strokeWidth={6} strokeDasharray="12 8" strokeLinecap="round" />
        <path d="M56,3 L76,12 L56,21 Z" fill={color} />
      </svg>
      <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 24, letterSpacing: '0.1em', color, whiteSpace: 'nowrap'}}>{text}</span>
    </div>
  );
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-100%,-100%)', opacity: ramp(t, at, at + 0.4), display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 20px', background: 'rgba(6,15,34,0.88)', border: `2px solid ${C.navy600}`, borderRadius: 14}}>
      {row(YEL, 'SOUND THROUGH AIR')}
      {bone && row(CYAN, 'VIBRATIONS THROUGH BONE AND TISSUE')}
    </div>
  );
};

/** Bottom-left tag the brief asks for on every diagram. */
export const SimpleTag: React.FC<{x?: number; y?: number; text?: string; schematic?: boolean}> = ({x = 40, y = 1040, text = 'Simplified illustration.', schematic}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translateY(-100%)', display: 'flex', gap: 12, alignItems: 'center'}}>
    {schematic && <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 22, letterSpacing: '0.2em', color: C.navy950, background: C.gold, padding: '6px 12px', borderRadius: 8}}>SCHEMATIC</span>}
    <span style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: C.navy200, background: 'rgba(6,15,34,0.7)', padding: '6px 12px', borderRadius: 8}}>{text}</span>
  </div>
);

/** Both live routes as flows. */
export const LiveRoutes: React.FC<{air?: [number, number]; bone?: [number, number]}> = ({air, bone}) => (
  <>
    {air && <FlowPath d={AIR_TO_EAR} at={air[0]} until={air[1]} color={YEL} width={6} dots={6} speed={0.35} />}
    {bone && <FlowPath d={BONE_1} at={bone[0]} until={bone[1]} color={CYAN} width={6} dots={4} speed={0.6} />}
    {bone && <FlowPath d={BONE_2} at={bone[0] + 0.2} until={bone[1]} color={CYAN} width={6} dots={4} speed={0.6} />}
  </>
);
