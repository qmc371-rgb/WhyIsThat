#!/usr/bin/env python3
"""
Voice an episode's editorial draft with the approved channel voice (Kokoro-82M, local, $0).

  tools/.venv/bin/python scripts/tts_kokoro.py --episode ep002

Reads   episodes/<ep>-*/narration/editorial_draft_v1.txt   one paragraph per narration line (L01, L02, ...)
        episodes/<ep>-*/narration/pauses.json              optional pause plan (see new_episode.py)
Writes  public/audio/<ep>/<ep>_narration_kokoro.wav        48 kHz mono
        src/data/<ep>/narration_timing.json                line / phrase / word timings for cue()
Next:   python3 scripts/make_captions.py --timing src/data/<ep>/narration_timing.json --out episodes/<ep>-*/captions/<ep>_FINAL
"""
import argparse, json, subprocess, sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from timing_lib import build_line_timing, read_draft_lines, trim_silence  # noqa: E402

DEFAULTS = {"lead_in": 1.2, "default": 0.6, "section_pause": 1.0, "section_starts": [], "overrides": {}, "tail": 8.0}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True, help="e.g. ep002")
    ap.add_argument("--draft")
    ap.add_argument("--name", help="output name (default: the episode id), e.g. ep004_short for a standalone Short")
    ap.add_argument("--pauses")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=0.88)
    a = ap.parse_args()
    dirs = sorted(ROOT.glob(f"episodes/{a.episode}-*"))
    if len(dirs) != 1:
        raise SystemExit(f"expected exactly one episodes/{a.episode}-* folder, found {len(dirs)}")
    epdir = dirs[0]
    draft = Path(a.draft) if a.draft else epdir / "narration/editorial_draft_v1.txt"
    pfile = Path(a.pauses) if a.pauses else epdir / "narration/pauses.json"
    cfg = {**DEFAULTS, **{k: v for k, v in (json.loads(pfile.read_text()) if pfile.exists() else {}).items() if not k.startswith("_")}}
    lines = read_draft_lines(draft)
    # Optional narration/spoken.json: {"written": "spoken"} substitutions sent to the voice only
    # (e.g. "1962" -> "nineteen sixty-two"); captions and timing keep the written text.
    sfile = epdir / "narration/spoken.json"
    spoken = {k: v for k, v in json.loads(sfile.read_text()).items() if not k.startswith("_")} if sfile.exists() and not a.name else {}
    if not lines or lines[0][1].startswith("PASTE"):
        raise SystemExit(f"{draft} is empty or still the placeholder")

    from kokoro_onnx import Kokoro

    kokoro = Kokoro(str(ROOT / "tools/models/kokoro-v1.0.int8.onnx"), str(ROOT / "tools/models/voices-v1.0.bin"))
    pieces, out_lines, cursor, sr0 = [], [], 0.0, None
    for i, (lid, text) in enumerate(lines):
        clean = text.replace("’", "'").replace("“", '"').replace("”", '"')
        for k, v in spoken.items():
            clean = clean.replace(k, v)
        samples, sr = kokoro.create(clean, voice=a.voice, speed=a.speed, lang="en-us")
        sr0 = sr0 or sr
        audio = trim_silence(np.asarray(samples, dtype=np.float32), sr)
        pause = cfg["overrides"].get(lid, cfg["lead_in"] if i == 0 else cfg["section_pause"] if lid in cfg["section_starts"] else cfg["default"])
        pieces.append(np.zeros(int(round(pause * sr)), np.float32))
        cursor += pause
        out_lines.append(build_line_timing(lid, text, audio, sr, cursor))
        pieces.append(audio)
        cursor += len(audio) / sr
    pieces.append(np.zeros(int(round(cfg["tail"] * sr0)), np.float32))
    track = np.concatenate(pieces)
    track = track / (float(np.max(np.abs(track))) or 1.0) * 0.8

    name = a.name or a.episode
    rel = f"audio/{a.episode}/{name}_narration_kokoro.wav"
    wav = ROOT / "public" / rel
    wav.parent.mkdir(parents=True, exist_ok=True)
    tmp = wav.with_suffix(".24k.wav")
    sf.write(tmp, track, sr0, subtype="PCM_16")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-ar", "48000", "-ac", "1", str(wav)], check=True)
    tmp.unlink()
    out = ROOT / "src/data" / name / "narration_timing.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({
        "source": "FINAL_kokoro", "notForPublication": False,
        "engine": f"Kokoro-82M int8 via kokoro-onnx, voice={a.voice}, speed={a.speed} (Apache-2.0; approved channel voice)",
        "audio": rel, "durationSec": round(len(track) / sr0, 3),
        "wordTimingMethod": "exact line boundaries (per-paragraph synthesis); phrases pause-anchored; words proportional",
        "sections": cfg["section_starts"], "lines": out_lines,
    }, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{name}: {len(lines)} lines, {len(track) / sr0:.1f} s -> public/{rel}, {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
