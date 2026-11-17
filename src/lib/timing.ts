// Narration-driven cues. Scenes anchor to words in the narration, not to fixed
// frames, so re-aligning to a new recording re-times every scene.
// Each episode builds its own resolver with makeTiming(); EP001's is the default export
// set below (kept for the existing EP001 scenes).
import ep001Json from '../data/ep001/narration_timing.json';

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

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const makeTiming = (json: unknown) => {
  const timing = json as Timing;
  // Hyphenated tokens ("microwave-safe") are split so phrases match word-by-word.
  const flatWords = timing.lines.flatMap((l) =>
    l.words.flatMap((w) => norm(w.text).split(' ').filter(Boolean).map((n) => ({...w, n}))),
  );
  const unresolvedCues: string[] = [];

  /**
   * Seconds at which `phrase` is spoken (start of its first word, or end of its last
   * word with edge:'end'). Falls back to `fallback` and records the miss so the
   * review overlay can flag it.
   */
  const cue = (phrase: string, fallback: number, opts: {edge?: 'start' | 'end'; occurrence?: number} = {}): number => {
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

  const line = (id: string): Line => {
    const l = timing.lines.find((x) => x.id === id);
    if (!l) throw new Error(`Narration line ${id} missing from timing file`);
    return l;
  };

  return {timing, cue, line, unresolvedCues};
};

// EP001 (default for existing imports)
export const {timing, cue, line, unresolvedCues} = makeTiming(ep001Json);
