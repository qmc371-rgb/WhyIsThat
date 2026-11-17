// Shared timeline helpers (same behaviour as EP001's Shot/Sfx, kept here for later episodes).
import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {clamp01} from '../lib/anim';

/** Visible on [from - fadeIn, to); fades in over the previous shot (crossfade). */
export const Shot: React.FC<{from: number; to: number; fadeIn?: number; children: React.ReactNode}> = ({from, to, fadeIn = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  if (t < from - fadeIn || t >= to) return null;
  const o = fadeIn > 0 ? clamp01((t - (from - fadeIn)) / fadeIn) : 1;
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** A synthesised sound effect at `at` seconds, with short fades so nothing clicks. */
export const Sfx: React.FC<{at: number; file: string; vol: number; dur?: number; loop?: boolean; fade?: number}> = ({at, file, vol, dur = 2, loop = false, fade = 0.1}) => {
  const {fps} = useVideoConfig();
  const frames = Math.max(1, Math.round(dur * fps));
  const f = Math.max(2, Math.round(fade * fps));
  return (
    <Sequence from={Math.round(at * fps)} durationInFrames={frames} layout="none">
      <Audio
        src={staticFile(`sfx/${file}`)}
        loop={loop}
        volume={(x) => interpolate(x, [0, Math.min(f, frames / 2), Math.max(frames / 2, frames - f), frames], [0, vol, vol, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
    </Sequence>
  );
};
