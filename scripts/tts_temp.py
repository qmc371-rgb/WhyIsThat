#!/usr/bin/env python3
"""
TEMP scratch narration for Why Is That? — NOT FOR PUBLICATION.

Synthesises the opening lines of the editorial draft with Kokoro-82M (Apache-2.0
weights, run locally via kokoro-onnx, $0 variable cost). This track exists only so
the animation can be timed and reviewed; it is replaced by the commercially
licensed final narration before anything is published.

Outputs
  public/audio/temp/ep001_opening_TEMP_kokoro.wav   48 kHz mono
  src/data/narration_timing.json                    line / phrase / word timings

Word timings inside a line are ESTIMATES (pause-anchored, proportional to
character count). Final narration is re-timed with scripts/align_narration.py.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from timing_lib import build_line_timing, read_draft_lines, trim_silence  # noqa: E402

MODEL = ROOT / "tools/models/kokoro-v1.0.int8.onnx"
VOICES = ROOT / "tools/models/voices-v1.0.bin"
DRAFT = ROOT / "episodes/ep001-microwave-leftovers/narration/editorial_draft_v1.txt"
OUT_WAV = ROOT / "public/audio/temp/ep001_opening_TEMP_kokoro.wav"
OUT_JSON = ROOT / "src/data/narration_timing.json"

# Silence (seconds) inserted BEFORE each line; index 0 is the lead-in that leaves
# room for the establishing shot. A longer beat precedes the title question.
PAUSES_BEFORE = [1.20, 0.75, 0.60, 0.85, 0.95, 1.00]


def kokoro_say(kokoro, text: str, voice: str, speed: float) -> tuple[np.ndarray, int]:
    # Kokoro's phonemiser prefers straight apostrophes.
    clean = text.replace("’", "'").replace("“", '"').replace("”", '"')
    samples, sr = kokoro.create(clean, voice=voice, speed=speed, lang="en-us")
    return np.asarray(samples, dtype=np.float32), sr


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--lines", type=int, default=6, help="how many draft lines to voice")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=0.88)
    ap.add_argument("--total", type=float, default=30.0, help="pad track to this length (s)")
    args = ap.parse_args()

    from kokoro_onnx import Kokoro

    kokoro = Kokoro(str(MODEL), str(VOICES))
    lines = read_draft_lines(DRAFT)[: args.lines]

    sr_out = None
    pieces: list[np.ndarray] = []
    timing_lines = []
    cursor = 0.0
    for i, (line_id, text) in enumerate(lines):
        audio, sr = kokoro_say(kokoro, text, args.voice, args.speed)
        sr_out = sr_out or sr
        audio = trim_silence(audio, sr)
        pause = PAUSES_BEFORE[i] if i < len(PAUSES_BEFORE) else 0.6
        pieces.append(np.zeros(int(round(pause * sr)), dtype=np.float32))
        cursor += pause
        start = cursor
        pieces.append(audio)
        cursor += len(audio) / sr
        timing_lines.append(build_line_timing(line_id, text, audio, sr, start))
        print(f"{line_id} {start:6.2f}-{cursor:6.2f}s  {text}")

    if cursor < args.total:
        pieces.append(np.zeros(int(round((args.total - cursor) * sr_out)), dtype=np.float32))
    track = np.concatenate(pieces)
    peak = float(np.max(np.abs(track))) or 1.0
    track = track / peak * 0.80  # ~-2 dBFS peak headroom

    OUT_WAV.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT_WAV.with_suffix(".24k.wav")
    sf.write(tmp, track, sr_out, subtype="PCM_16")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ar", "48000", "-ac", "1", str(OUT_WAV)],
        check=True,
    )
    tmp.unlink()

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "source": "TEMP_kokoro",
        "notForPublication": True,
        "engine": f"Kokoro-82M int8 via kokoro-onnx, voice={args.voice}, speed={args.speed}",
        "audio": "audio/temp/ep001_opening_TEMP_kokoro.wav",
        "durationSec": round(len(track) / sr_out, 3),
        "wordTimingMethod": "estimated: pause-anchored, proportional to characters",
        "lines": timing_lines,
    }
    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"wrote {OUT_WAV.relative_to(ROOT)} ({payload['durationSec']} s) and {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
