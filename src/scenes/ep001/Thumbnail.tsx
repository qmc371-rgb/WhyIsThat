// EP001 thumbnail (1280x720). Approved H2 bowl art + code type and cues.
// Hook text is taken from the narration's own claim (hot bowl, cold middle).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {BowlSide, SIDE} from '../../components/Bowl';

export const Ep001Thumbnail: React.FC = () => {
  const bx = 955;
  const by = 335;
  const s = 1.48;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 80% at 72% 55%, ${C.navy700} 0%, ${C.navy900} 55%, ${C.navy950} 100%)`}}>
      <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
        <BowlSide x={bx} y={by} s={s} t={0.9} heat={{steam: 1, heat: 1}} />
        <circle cx={bx - 8} cy={by + SIDE.FCY * s + 4} r={46} fill="none" stroke={C.white} strokeWidth={7} strokeDasharray="13 10" />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: bx - 92,
          top: by + 96,
          fontFamily: FONT.ui,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: '0.08em',
          color: C.navy950,
          background: C.white,
          padding: '6px 14px',
          borderRadius: 10,
        }}
      >
        STILL COLD
      </div>
      <div style={{position: 'absolute', left: 56, top: 150, display: 'flex', flexDirection: 'column', gap: 4}}>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 0.98, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>HOT BOWL.</div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 0.98, color: C.gold, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>COLD</div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 118, lineHeight: 0.98, color: C.gold, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>MIDDLE?</div>
      </div>
      <div style={{position: 'absolute', left: 60, top: 52, fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.white}}>
        WHY IS THAT<span style={{color: C.gold}}>?</span>
      </div>
    </AbsoluteFill>
  );
};
