// "WHY IS THAT?" channel title. Words land on the narrator's own word timings.
import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand/tokens';
import {pop, ramp} from '../lib/anim';

export const TitleCard: React.FC<{wordTimes: [number, number, number]; tagline?: string; taglineAt: number; lift?: number}> = ({
  wordTimes,
  tagline,
  taglineAt,
  lift = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const words = ['WHY', 'IS', 'THAT'];
  const qAt = wordTimes[2] + 0.22;
  const q = pop(frame, fps, qAt, 9, 0.7);
  const tag = ramp(t, taglineAt, taglineAt + 0.6, Easing.out(Easing.cubic));
  const drift = 1 + 0.02 * ramp(t, wordTimes[0] - 0.4, wordTimes[0] + 5, Easing.linear);
  return (
    <AbsoluteFill style={{background: C.navy950, alignItems: 'center', justifyContent: 'center'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 48%, rgba(255,197,46,0.08) 0%, rgba(255,197,46,0.03) 45%, rgba(255,197,46,0) 100%), radial-gradient(ellipse 95% 90% at 50% 50%, ${C.navy850} 0%, ${C.navy900} 45%, ${C.navy950} 100%)`,
        }}
      />
      <div style={{transform: `translateY(${-lift}px) scale(${drift * (1 - lift / 1400)})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 38}}>
          {words.map((w, i) => {
            const p = pop(frame, fps, wordTimes[i] - 0.04, 12);
            return (
              <span
                key={w}
                style={{
                  fontFamily: FONT.display,
                  fontWeight: 700,
                  fontSize: 210,
                  lineHeight: 1,
                  color: C.white,
                  opacity: Math.min(1, p * 1.5),
                  transform: `translateY(${(1 - p) * 60}px) scale(${0.85 + 0.15 * p})`,
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            );
          })}
          <span style={{position: 'relative', display: 'inline-block', marginLeft: -24}}>
            <svg width={520} height={520} viewBox="-260 -260 520 520" style={{position: 'absolute', left: '50%', top: '83%', transform: 'translate(-50%,-50%)', overflow: 'visible'}}>
              {t >= qAt &&
                [0, 1, 2].map((k) => {
                  const ph = ((t - qAt) / 1.8 + k / 3) % 1;
                  return <circle key={k} r={20 + ph * 230} fill="none" stroke={C.gold} strokeWidth={5} opacity={(1 - ph) * 0.45} />;
                })}
            </svg>
            <span
              style={{
                position: 'relative',
                fontFamily: FONT.display,
                fontWeight: 700,
                fontSize: 210,
                lineHeight: 1,
                color: C.gold,
                display: 'inline-block',
                opacity: Math.min(1, q * 1.5),
                transform: `rotate(${(1 - q) * -25}deg) scale(${0.4 + 0.6 * q})`,
              }}
            >
              ?
            </span>
          </span>
        </div>
        <div style={{width: 260 * tag, height: 6, borderRadius: 3, background: C.gold}} />
        {tagline && (
          <div
            style={{
              fontFamily: FONT.ui,
              fontWeight: 600,
              fontSize: 38,
              letterSpacing: '0.02em',
              color: C.navy200,
              opacity: tag,
              transform: `translateY(${(1 - tag) * 16}px)`,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
