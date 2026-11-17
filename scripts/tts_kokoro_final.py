#!/usr/bin/env python3
"""
FINAL narration for EP001 (approved by the channel owner on 2026-11-16):
Kokoro-82M (Apache-2.0 weights) via kokoro-onnx, voice af_heart, speed 0.88.
Same voice/pace/pauses as the approved opening preview, so L01–L06 are identical.

Outputs
  public/audio/final/ep001_narration_FINAL_kokoro.wav   48 kHz mono
  src/data/narration_timing.json                        notForPublication: false
"""
from __future__ import annotations

import json
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
AUDIO_REL = "audio/final/ep001_narration_FINAL_kokoro.wav"
OUT_WAV = ROOT / "public" / AUDIO_REL
OUT_JSON = ROOT / "src/data/narration_timing.json"
VOICE, SPEED = "af_heart", 0.88

# Silence before each line (s). Opening values match the approved preview exactly.
PAUSE = {"L01": 1.20, "L02": 0.75, "L03": 0.60, "L04": 0.85, "L05": 0.95, "L06": 1.00,
         "L07": 2.60, "L08": 0.70, "L09": 0.55, "L53": 0.45, "L56": 0.60}
SECTION_STARTS = ["L10", "L13", "L15", "L20", "L23", "L25", "L29", "L35", "L40", "L47", "L55"]
for sid in SECTION_STARTS:
    PAUSE[sid] = 1.00
DEFAULT_PAUSE = 0.60
TAIL = 8.0  # end-card hold after the last word


def main() -> None:
    from kokoro_onnx import Kokoro

    kokoro = Kokoro(str(MODEL), str(VOICES))
    lines = read_draft_lines(DRAFT)
    pieces, timing_lines, cursor, sr_out = [], [], 0.0, None
    for line_id, text in lines:
        clean = text.replace("’", "'").replace("“", '"').replace("”", '"')
        samples, sr = kokoro.create(clean, voice=VOICE, speed=SPEED, lang="en-us")
        sr_out = sr_out or sr
        audio = trim_silence(np.asarray(samples, dtype=np.float32), sr)
        pause = PAUSE.get(line_id, DEFAULT_PAUSE)
        pieces.append(np.zeros(int(round(pause * sr)), dtype=np.float32))
        cursor += pause
        timing_lines.append(build_line_timing(line_id, text, audio, sr, cursor))
        pieces.append(audio)
        cursor += len(audio) / sr
    pieces.append(np.zeros(int(round(TAIL * sr_out)), dtype=np.float32))
    track = np.concatenate(pieces)
    track = track / (float(np.max(np.abs(track))) or 1.0) * 0.80

    OUT_WAV.parent.mkdir(parents=True, exist_ok=True)
    tmp = OUT_WAV.with_suffix(".24k.wav")
    sf.write(tmp, track, sr_out, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ar", "48000", "-ac", "1", str(OUT_WAV)], check=True)
    tmp.unlink()

    payload = {
        "source": "FINAL_kokoro",
        "notForPublication": False,
        "engine": f"Kokoro-82M int8 via kokoro-onnx, voice={VOICE}, speed={SPEED} (Apache-2.0; approved as final 2026-11-16)",
        "audio": AUDIO_REL,
        "durationSec": round(len(track) / sr_out, 3),
        "wordTimingMethod": "exact line boundaries (per-paragraph synthesis); phrases pause-anchored; words proportional",
        "sections": SECTION_STARTS,
        "lines": timing_lines,
    }
    OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(lines)} lines, {payload['durationSec']:.1f} s -> {OUT_WAV.relative_to(ROOT)}")
    for l in timing_lines:
        if l["id"] in ["L01", "L06", "L07"] + SECTION_STARTS + ["L56"]:
            print(f"  {l['id']} {l['start']:7.2f}  {l['text'][:60]}")


if __name__ == "__main__":
    main()
