// Narration-driven cues. Scenes anchor to words in the narration, not to fixed
// frames, so re-aligning to the final recording re-times every scene.
import timingJson from '../data/narration_timing.json';

export type Span = {text: string; start: number; end: number};
export type Line = Span & {id: string; phrases: Span[]; words: Span[]};
export type Timing = {
  source: string;
  notForPublication?: boolean;
  engine?: string;
  audio: string;
  durationSec: number;
  lines: Line[];
};

export const timing = timingJson as Timing;

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Hyphenated tokens ("microwave-safe") are split so phrases match word-by-word.
const flatWords = timing.lines.flatMap((l) =>
  l.words.flatMap((w) => norm(w.text).split(' ').filter(Boolean).map((n) => ({...w, n}))),
);

export const unresolvedCues: string[] = [];

/**
 * Seconds at which `phrase` is spoken (start of its first word, or end of its last
 * word with edge:'end'). Falls back to `fallback` and records the miss so the
 * draft overlay can flag it.
 */
export const cue = (
  phrase: string,
  fallback: number,
  opts: {edge?: 'start' | 'end'; occurrence?: number} = {},
): number => {
  const target = norm(phrase).split(' ');
  let seen = 0;
  for (let i = 0; i + target.length <= flatWords.length; i++) {
    let ok = true;
    for (let j = 0; j < target.length; j++) {
      if (flatWords[i + j].n !== target[j]) {
        ok = false;
        break;
      }
    }
    if (ok && ++seen === (opts.occurrence ?? 1)) {
      return opts.edge === 'end' ? flatWords[i + target.length - 1].end : flatWords[i].start;
    }
  }
  if (!unresolvedCues.includes(phrase)) unresolvedCues.push(phrase);
  return fallback;
};

export const line = (id: string): Line => {
  const l = timing.lines.find((x) => x.id === id);
  if (!l) throw new Error(`Narration line ${id} missing from timing file`);
  return l;
};
