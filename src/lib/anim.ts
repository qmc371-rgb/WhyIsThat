import {Easing, interpolate, spring} from 'remotion';

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 0→1 ramp between two times (seconds) with easing. */
export const ramp = (t: number, a: number, b: number, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Interpolate through keyframes [time, value] with easing between each pair. */
export const keys = (t: number, kf: Array<[number, number]>, ease = Easing.inOut(Easing.cubic)) =>
  interpolate(
    t,
    kf.map((k) => k[0]),
    kf.map((k) => k[1]),
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease},
  );

/** Spring pop starting at time `at` (seconds). */
export const pop = (frame: number, fps: number, at: number, damping = 13, mass = 0.6) =>
  spring({frame: frame - Math.round(at * fps), fps, config: {damping, mass, stiffness: 140}});

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Deterministic pseudo-random in [0,1) from an integer seed. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
