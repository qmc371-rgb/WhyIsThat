// Label + leader line + target dot. Wording comes from the narration itself:
// qualitative only, never invented numbers.
import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../brand/tokens';
import {pop, ramp} from '../lib/anim';

type Props = {
  target: [number, number];
  label: [number, number];
  k: string;
  v: string;
  tone?: 'hot' | 'cold';
  at: number;
  until?: number;
  side?: 'left' | 'right'; // which side of the label point the pill extends to
  icon?: React.ReactNode;
};

export const Callout: React.FC<Props> = ({target, label, k, v, tone = 'hot', at, until = 1e9, side = 'right', icon}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < at) return null;
  const accent = tone === 'hot' ? C.gold : C.white;
  const dot = pop(frame, fps, at, 11);
  const draw = ramp(t, at + 0.05, at + 0.35, Easing.out(Easing.cubic));
  const pill = pop(frame, fps, at + 0.18, 14);
  const fadeOut = 1 - ramp(t, until, until + 0.25);
  const [tx, ty] = target;
  const [lx, ly] = label;
  const ex = tx + (lx - tx) * draw;
  const ey = ty + (ly - ty) * draw;
  return (
    <AbsoluteFill style={{opacity: fadeOut}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={tx} y1={ty} x2={ex} y2={ey} stroke={accent} strokeWidth={4} strokeLinecap="round" />
        <circle cx={tx} cy={ty} r={16 * dot} fill="none" stroke={accent} strokeWidth={4} opacity={0.6} />
        <circle cx={tx} cy={ty} r={8 * dot} fill={accent} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: lx,
          top: ly,
          transform: `translate(${side === 'right' ? '0' : '-100%'}, -50%) scale(${0.6 + 0.4 * pill})`,
          transformOrigin: side === 'right' ? 'left center' : 'right center',
          opacity: Math.min(1, pill * 1.4),
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 24px 14px 22px',
          background: 'rgba(6,15,34,0.9)',
          border: `3px solid ${accent}`,
          borderRadius: 18,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
          whiteSpace: 'nowrap',
        }}
      >
        {icon}
        <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
          <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 20, letterSpacing: '0.16em', color: accent}}>{k}</span>
          <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 36, letterSpacing: '0.01em', color: C.white}}>{v}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
