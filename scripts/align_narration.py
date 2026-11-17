#!/usr/bin/env python3
"""
Align the FINAL narration recording to the editorial draft (offline, $0).

Two input modes:
  --audio narration.wav     one edited file (no retakes), paragraphs separated by natural pauses
  --dir takes/              one file per paragraph: L01.wav, L02.wav, ... (most reliable)

Writes src/data/narration_timing.json (same schema as the temp track), so every
scene cue and caption in the Remotion project re-times to the real recording.
Then run: python scripts/make_captions.py --out episodes/.../captions/ep001_FINAL

Line boundaries: dynamic programming over detected pauses, penalising each line's
duration against its text length (no cumulative drift) and preferring longer
pauses. Phrase/word timings inside a line come from timing_lib.
"""
from __future__ import annotations

import argparse
import json
import math
import shutil
import subprocess
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from timing_lib import _weight, build_line_timing, find_pauses, frame_rms, read_draft_lines, silence_threshold, trim_silence  # noqa: E402

SR = 24000


def load(path: Path) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def speech_bounds(audio: np.ndarray) -> tuple[float, float]:
    rms = frame_rms(audio, SR)
    loud = np.where(rms > silence_threshold(rms))[0]
    return loud[0] * 0.010, (loud[-1] + 2) * 0.010


def align_single(audio: np.ndarray, lines: list[tuple[str, str]], min_gap: float) -> list[tuple[float, float]]:
    s0, s1 = speech_bounds(audio)
    pauses = [p for p in find_pauses(audio, SR, min_pause_s=min_gap) if s0 < p[0] and p[1] < s1]
    n, P = len(lines), len(pauses)
    if P < n - 1:
        raise SystemExit(f"Only {P} pauses >= {min_gap}s for {n} lines; lower --min-gap or use --dir takes.")
    w = [sum(_weight(t) for t in text.split()) for _, text in lines]
    rate = max(s1 - s0 - (n - 1) * 0.5, 1.0) / sum(w)

    def line_cost(k: int, start: float, end: float) -> float:
        exp = w[k] * rate
        dev = (end - start - exp) / (0.35 * exp + 0.3)
        return dev * dev

    bonus = [math.log1p((b - a) / 0.15) for a, b in pauses]
    INF = float("inf")
    # cost[k][p]: lines 0..k placed, line k ends at pause p
    cost = np.full((n - 1, P), INF)
    back = np.full((n - 1, P), -1, dtype=int)
    for p in range(P):
        cost[0][p] = line_cost(0, s0, pauses[p][0]) - bonus[p]
    for k in range(1, n - 1):
        for p in range(k, P):
            best, arg = INF, -1
            for q in range(k - 1, p):
                if cost[k - 1][q] == INF:
                    continue
                c = cost[k - 1][q] + line_cost(k, pauses[q][1], pauses[p][0])
                if c < best:
                    best, arg = c, q
            cost[k][p] = best - bonus[p]
            back[k][p] = arg
    last = min(range(P), key=lambda p: cost[n - 2][p] + line_cost(n - 1, pauses[p][1], s1))
    chosen = [last]
    for k in range(n - 2, 0, -1):
        chosen.append(back[k][chosen[-1]])
    chosen.reverse()
    starts = [s0] + [pauses[p][1] for p in chosen]
    ends = [pauses[p][0] for p in chosen] + [s1]
    return list(zip(starts, ends))


def main() -> None:
    ap = argparse.ArgumentParser()
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--audio", type=Path)
    src.add_argument("--dir", type=Path)
    ap.add_argument("--draft", type=Path, default=ROOT / "episodes/ep001-microwave-leftovers/narration/editorial_draft_v1.txt")
    ap.add_argument("--first", type=int, default=1)
    ap.add_argument("--last", type=int, default=0, help="0 = last paragraph")
    ap.add_argument("--label", default="FINAL")
    ap.add_argument("--temp", action="store_true", help="mark NOT FOR PUBLICATION (forces the draft bug on)")
    ap.add_argument("--min-gap", type=float, default=0.18)
    ap.add_argument("--gap", type=float, default=0.55, help="--dir mode: silence between takes (s)")
    ap.add_argument("--lead", type=float, default=1.2, help="--dir mode: lead-in silence (s)")
    ap.add_argument("--out", type=Path, default=ROOT / "src/data/ep001/narration_timing.json", help="src/data/<ep>/narration_timing.json")
    ap.add_argument("--audio-out", default="audio/final/ep001_narration_FINAL.wav", help="path under public/")
    a = ap.parse_args()

    all_lines = read_draft_lines(a.draft)
    lines = all_lines[a.first - 1 : (a.last or len(all_lines))]

    if a.dir:
        pieces, spans, t = [np.zeros(int(a.lead * SR), np.float32)], [], a.lead
        for lid, _ in lines:
            f = next((p for p in sorted(a.dir.glob(f"{lid}.*"))), None)
            if f is None:
                raise SystemExit(f"Missing take for {lid} in {a.dir}")
            clip = trim_silence(load(f), SR)
            spans.append((t, t + len(clip) / SR))
            pieces += [clip, np.zeros(int(a.gap * SR), np.float32)]
            t += len(clip) / SR + a.gap
        audio = np.concatenate(pieces)
    else:
        audio = load(a.audio)
        spans = align_single(audio, lines, a.min_gap)

    out_lines, flags = [], []
    print(f"{'line':5} {'start':>7} {'end':>7} {'dur':>6} {'vs text':>8}")
    total_w = sum(sum(_weight(x) for x in t.split()) for _, t in lines)
    rate = sum(e - s for s, e in spans) / total_w
    for (lid, text), (s, e) in zip(lines, spans):
        seg = audio[int(s * SR) : int(e * SR)]
        out_lines.append(build_line_timing(lid, text, seg, SR, s))
        ratio = (e - s) / (sum(_weight(x) for x in text.split()) * rate)
        flag = "  <-- check" if not 0.6 <= ratio <= 1.6 else ""
        if flag:
            flags.append(lid)
        print(f"{lid:5} {s:7.2f} {e:7.2f} {e - s:6.2f} {ratio:8.2f}{flag}")

    dest = (ROOT / "public" / a.audio_out).resolve()
    if not dest.is_relative_to((ROOT / "public").resolve()):
        raise SystemExit("--audio-out must stay inside public/")
    dest.parent.mkdir(parents=True, exist_ok=True)
    if a.audio and not a.dir:
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(a.audio), "-ac", "1", "-ar", "48000", str(dest)], check=True)
    else:
        tmp = dest.with_suffix(".tmp.f32")
        tmp.write_bytes(audio.astype(np.float32).tobytes())
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", str(tmp), "-ar", "48000", str(dest)], check=True)
        tmp.unlink()
    payload = {
        "source": a.label,
        "notForPublication": bool(a.temp),
        "audio": a.audio_out,
        "durationSec": round(len(audio) / SR, 3),
        "wordTimingMethod": "pause-anchored lines/phrases; words proportional to characters",
        "lines": out_lines,
    }
    a.out.parent.mkdir(parents=True, exist_ok=True)
    a.out.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {a.out}; audio -> {dest}" + (f"; CHECK {flags}" if flags else ""))


if __name__ == "__main__":
    main()
