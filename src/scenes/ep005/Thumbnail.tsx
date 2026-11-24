// EP005 thumbnail draft (1280x720): the sandwich, a big typeset ARBY'S sign treatment (our own lettering,
// not the company's logo) and "ROAST BEEF?". Deliberately does not reveal the Raffel brothers.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from '../../brand/tokens';
import {OhsLogo} from '../../brand/ohs';
import {ArtCam} from '../ep002/parts';
import {R1} from './Ep005Full';

export const Ep005Thumbnail: React.FC = () => (
  <AbsoluteFill style={{background: C.navy950}}>
    <ArtCam art={R1} cam={{x: 1180, y: 900, z: 1.18}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,15,34,0) 40%, rgba(6,15,34,0.75) 62%, rgba(6,15,34,0.92) 100%)'}} />
    {/* sign treatment */}
    <div style={{position: 'absolute', right: 40, top: 34, width: 520, height: 190, borderRadius: 30, background: C.paper, border: `10px solid ${C.gold}`, boxShadow: '0 0 60px rgba(255,197,46,0.55), 0 14px 0 rgba(6,15,34,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 132, color: C.navy900, letterSpacing: '0.02em'}}>
      A<span style={{color: C.goldDeep}}>R</span>
      <span style={{color: C.goldDeep}}>B</span>Y’S
    </div>
    <div style={{position: 'absolute', right: 286, top: 224, width: 26, height: 60, background: C.navy500, borderRadius: 6}} />
    <div style={{position: 'absolute', right: 30, top: 300, width: 560, textAlign: 'center', fontFamily: FONT.display, fontWeight: 700, fontSize: 150, lineHeight: 0.95, color: C.white, textShadow: '0 8px 0 rgba(6,15,34,0.7)'}}>
      ROAST
      <br />
      BEEF<span style={{color: C.gold}}>?</span>
    </div>
    <div style={{position: 'absolute', left: 28, top: 24, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(6,15,34,0.85)', padding: '8px 14px', borderRadius: 14}}>
      <OhsLogo size={46} />
      <span style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 24, color: C.white}}>
        ORDINARY HAS <span style={{color: C.gold}}>SECRETS</span>
      </span>
    </div>
  </AbsoluteFill>
);
