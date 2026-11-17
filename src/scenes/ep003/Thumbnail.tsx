// EP003 thumbnail (1280x720): the C1 reaction + "THAT'S MY VOICE?!" (EP001/EP002 layout language, mirrored).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {ArtCam} from '../ep002/parts';
import {C1} from './Ep003Full';

export const Ep003Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: C.navy950}}>
    <ArtCam art={C1} cam={{x: 1180, y: 700, z: 1.35}} />
    <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(6,15,34,0.96) 0%, rgba(6,15,34,0.9) 38%, rgba(6,15,34,0.3) 55%, rgba(6,15,34,0) 66%)'}} />
    <svg width={1280} height={720} style={{position: 'absolute', inset: 0}}>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${560 + k * 34},${300 - k * 30} q${26 + k * 8},${60 + k * 30} 0,${120 + k * 60}`} fill="none" stroke={C.gold} strokeWidth={10} strokeLinecap="round" opacity={1 - k * 0.25} />
      ))}
    </svg>
    <div style={{position: 'absolute', right: 60, top: 52, fontFamily: FONT.display, fontWeight: 700, fontSize: 40, color: C.white}}>
      WHY IS THAT<span style={{color: C.gold}}>?</span>
    </div>
    <div style={{position: 'absolute', right: 50, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
      {['THAT’S', 'MY'].map((x) => (
        <div key={x} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 150, lineHeight: 0.95, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>{x}</div>
      ))}
      <div style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 150, lineHeight: 0.95, color: C.white, textShadow: '0 6px 0 rgba(6,15,34,0.6)'}}>
        VOICE<span style={{color: C.gold}}>?!</span>
      </div>
    </div>
  </AbsoluteFill>
);
