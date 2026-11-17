#!/usr/bin/env python3
"""
Cut a vertical Short's narration from an episode's FINAL recording (no new voice, $0).

  tools/.venv/bin/python scripts/make_short_audio.py --episode ep002 --lines L03,L10,L11,L24,L28,L61 --name ep002_short

Writes public/audio/<ep>/<name>.wav and src/data/<name>/narration_timing.json, with every line,
phrase and word time re-based to the cut, so captions and scenes align to the Short's own audio.
Cuts land in the pauses between lines (asserted), so no word is ever clipped.
"""
from __future__ import annotations

import argparse
import copy
import json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--episode", required=True)
    ap.add_argument("--lines", required=True, help="comma-separated line ids in playback order")
    ap.add_argument("--name", required=True)
    ap.add_argument("--lead", type=float, default=0.35)
    ap.add_argument("--gap", type=float, default=0.4)
    ap.add_argument("--tail", type=float, default=1.6)
    ap.add_argument("--pad-in", type=float, default=0.04)
    ap.add_argument("--pad-out", type=float, default=0.15)
    a = ap.parse_args()

    timing = json.loads((ROOT / "src/data" / a.episode / "narration_timing.json").read_text(encoding="utf-8"))
    audio, sr = sf.read(ROOT / "public" / timing["audio"], always_2d=False)
    by_id = {l["id"]: (i, l) for i, l in enumerate(timing["lines"])}
    parts = [np.zeros(int(a.lead * sr))]
    cursor = a.lead
    out_lines = []
    for k, lid in enumerate(a.lines.split(",")):
        i, line = by_id[lid]
        t0, t1 = line["start"] - a.pad_in, line["end"] + a.pad_out
        prev_end = timing["lines"][i - 1]["end"] if i > 0 else 0.0
        next_start = timing["lines"][i + 1]["start"] if i + 1 < len(timing["lines"]) else timing["durationSec"]
        assert prev_end < t0 and t1 < next_start, f"{lid}: cut would clip a neighbouring line"
        seg = audio[int(round(t0 * sr)): int(round(t1 * sr))]
        fade = min(len(seg) // 2, int(0.01 * sr))  # 10 ms fades: no clicks at the cut
        seg = seg.copy()
        seg[:fade] *= np.linspace(0, 1, fade)
        seg[-fade:] *= np.linspace(1, 0, fade)
        off = cursor - t0
        nl = copy.deepcopy(line)
        for span in [nl, *nl["phrases"], *nl["words"]]:
            span["start"] = round(span["start"] + off, 3)
            span["end"] = round(span["end"] + off, 3)
        out_lines.append(nl)
        parts.append(seg)
        cursor += len(seg) / sr
        gap = a.gap if k + 1 < len(a.lines.split(",")) else a.tail
        parts.append(np.zeros(int(gap * sr)))
        cursor += int(gap * sr) / sr
    out = np.concatenate(parts)
    wav = ROOT / "public/audio" / a.episode / f"{a.name}.wav"
    sf.write(wav, out.astype(np.float32), sr, subtype="PCM_16")
    data_dir = ROOT / "src/data" / a.name
    data_dir.mkdir(parents=True, exist_ok=True)
    res = {
        "source": f"{a.episode} FINAL narration (same recording), cut for the Short: {a.lines}",
        "notForPublication": bool(timing.get("notForPublication", False)),
        "engine": timing.get("engine", ""),
        "audio": f"audio/{a.episode}/{a.name}.wav",
        "durationSec": round(len(out) / sr, 3),
        "lines": out_lines,
    }
    (data_dir / "narration_timing.json").write_text(json.dumps(res, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{wav.relative_to(ROOT)}  {res['durationSec']:.2f} s  ({len(out_lines)} lines) -> {(data_dir / 'narration_timing.json').relative_to(ROOT)}")


if __name__ == "__main__":
    main()
