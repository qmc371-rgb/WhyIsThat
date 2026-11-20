// Ordinary Has Secrets — channel brand (formerly "Why Is That?"). Midnight navy, white, golden yellow.
// OhsLogo is a vector redraw of the owner's mug-and-question-mark logo (swap in the original
// artwork at public/brand/ohs_logo.png when it is added to the repo).
import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from './tokens';
import {pop, ramp} from '../lib/anim';

export const BRAND = {name: 'Ordinary Has Secrets', upper: 'ORDINARY HAS SECRETS', midnight: '#04062A'};

/** Mug with a gold question mark rising out of it. viewBox 0 0 200 200. */
export const OhsLogo: React.FC<{size?: number; q?: number; mug?: number}> = ({size = 200, q = 1, mug = 1}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{display: 'block', overflow: 'visible'}}>
    <defs>
      <linearGradient id="ohsMug" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.goldLight} />
        <stop offset="0.45" stopColor={C.gold} />
        <stop offset="1" stopColor={C.goldDeep} />
      </linearGradient>
    </defs>
    <g opacity={mug} transform={`translate(0 ${(1 - mug) * 12})`}>
      <path d="M127,112 C150,108 160,122 157,138 C154,154 140,162 124,163" fill="none" stroke={C.goldDeep} strokeWidth={13} strokeLinecap="round" />
      <path d="M58,104 L130,104 L126,170 C125,180 118,186 108,186 L80,186 C70,186 63,180 62,170 Z" fill="url(#ohsMug)" />
      <ellipse cx={94} cy={104} rx={36} ry={9} fill={C.goldLight} />
      <ellipse cx={94} cy={105} rx={30} ry={6.5} fill="#3A1E0E" />
      <path d="M70,116 L74,168" stroke="rgba(255,255,255,0.55)" strokeWidth={6} strokeLinecap="round" />
    </g>
    <g opacity={q} transform={`translate(0 ${(1 - q) * 30})`}>
      <path d="M74,34 C74,14 90,4 108,5 C128,6 140,20 137,36 C134,49 123,54 115,61 C109,66 106,70 106,74" fill="none" stroke={C.gold} strokeWidth={16} strokeLinecap="round" />
      <circle cx={106} cy={89} r={9} fill={C.gold} />
    </g>
  </svg>
);

/** Brand sting / end card. Words land at the given times (the narrator's own words at the end). */
export const BrandCard: React.FC<{wordTimes: [number, number, number]; lift?: number}> = ({wordTimes, lift = 0}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const logoP = pop(frame, fps, wordTimes[0] - 0.35, 12);
  const qP = ramp(t, wordTimes[0] - 0.15, wordTimes[0] + 0.45, Easing.out(Easing.back(1.6)));
  const words = ['ORDINARY', 'HAS', 'SECRETS'];
  const vertical = height > width;
  const s = vertical ? 0.62 : 1;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 70% at 50% 45%, ${C.navy850} 0%, ${C.navy950} 70%, ${BRAND.midnight} 100%)`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 * s, transform: `translateY(${-lift}px)`}}>
        <div style={{transform: `scale(${0.7 + 0.3 * logoP})`, opacity: Math.min(1, logoP * 1.4)}}>
          <OhsLogo size={260 * s} q={qP} mug={Math.min(1, logoP * 1.3)} />
        </div>
        <div style={{display: 'flex', gap: 30 * s, alignItems: 'baseline', flexWrap: vertical ? 'wrap' : 'nowrap', justifyContent: 'center', maxWidth: vertical ? 900 : undefined}}>
          {words.map((wd, i) => {
            const p = pop(frame, fps, wordTimes[i] - 0.04, 12);
            return (
              <span key={wd} style={{fontFamily: FONT.display, fontWeight: 700, fontSize: 132 * s, lineHeight: 1, color: i === 2 ? C.gold : C.white, opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, display: 'inline-block'}}>
                {wd}
              </span>
            );
          })}
        </div>
        <div style={{width: 260 * s * ramp(t, wordTimes[2] + 0.2, wordTimes[2] + 0.8), height: 6, borderRadius: 3, background: C.gold}} />
      </div>
    </AbsoluteFill>
  );
};
