// EP002 thumbnail (1280x720): W2 window close-up, a golden arrow to the code-drawn hole, "WHY A HOLE?".
// Same layout language as EP001 (brand line top-left, Fredoka hook text, art on the right).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {W2, W2_HOLE} from './geom';
import {ArtCam, HoleMark, artToScreen} from './parts';

export const Ep002Thumbnail: React.FC = () => {
  const cam = {x: 2470, y: 2232, z: 2.3};
  const [hx, hy] = artToScreen(W2, cam, 1280, 720, W2_HOLE.x, W2_HOLE.y);
  // arrow: from beside the text, arcing down onto the ring
  const sx = 606;
  const sy = 300;
  const ex = hx - 46;
  const ey = hy - 38;
  const cx1 = sx + 170;
  const cy1 = sy - 64;
  const ang = Math.atan2(ey - (cy1 + 120), ex - (cx1 + 30));
  const head = (len: number, w: number) => {
    const bx = ex - Math.cos(ang) * len;
    const by = ey - Math.sin(ang) * len;
    const nx = -Math.sin(ang) * w;
    const ny = Math.cos(ang) * w;
    return `M${ex},${ey} L${bx + nx},${by + ny} L${bx - nx},${by - ny} Z`;
  };
  const shaftEnd = [ex - Math.cos(ang) * 40, ey - Math.sin(ang) * 40];
  const d = `M${sx},${sy} C${cx1},${cy1} ${cx1 + 30},${cy1 + 120} ${shaftEnd[0]},${shaftEnd[1]}`;
  return (
    <AbsoluteFill style={{background: C.navy950}}>
      <ArtCam art={W2} cam={cam}>
        <HoleMark x={W2_HOLE.x} y={W2_HOLE.y} r={19} />
      </ArtCam>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,15,34,0.96) 0%, rgba(6,15,34,0.9) 36%, rgba(6,15,34,0.35) 52%, rgba(6,15,34,0) 64%)'}} />
      <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
        <circle cx={hx} cy={hy} r={44} fill="none" stroke={C.navy950} strokeWidth={15} opacity={0.55} />
        <circle cx={hx} cy={hy} r={44} fill="none" stroke={C.gold} strokeWidth={8} />
        <path d={d} fill="none" stroke={C.navy950} strokeWidth={34} strokeLinecap="round" opacity={0.55} />
        <path d={d} fill="none" stroke={C.gold} strokeWidth={22} strokeLinecap="round" />
        <path d={head(70, 44)} fill={C.gold} stroke={C.navy950} strokeWidth={5} strokeLinejoin="round" />
      </svg>
      <div style={{position: 'absolute', left: 60, top: 52, fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.white}}>
        WHY IS THAT<span style={{color: C.gold}}>?</span>
      </div>
      <div style={{position: 'absolute', left: 52, top: 190, display: 'flex', flexDirection: 'column'}}>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 168, lineHeight: 0.95, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>WHY A</div>
        <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 168, lineHeight: 0.95, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>
          HOLE<span style={{color: C.gold}}>?</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
