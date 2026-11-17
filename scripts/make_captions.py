#!/usr/bin/env python3
"""
Build captions from src/data/narration_timing.json.

  <out>.srt / <out>.vtt      upload-ready caption files (YouTube accepts both)
  src/data/captions.json     Remotion Caption[] for an optional on-screen overlay

Rules: <= 42 characters per row, <= 2 rows per caption, split at phrase
boundaries first, captions never overlap, minimum 1.0 s on screen.
Re-run after final narration is aligned; captions follow the real recording.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROW, ROWS = 42, 2


def wrap_rows(text: str) -> list[str]:
    """Balanced 2-row split when possible; otherwise greedy word wrap (never splits a word)."""
    words = text.split()
    if len(text) <= ROW:
        return [text]
    best, best_cost = None, 1e9
    for i in range(1, len(words)):
        a, b = " ".join(words[:i]), " ".join(words[i:])
        if len(a) <= ROW and len(b) <= ROW:
            cost = abs(len(a) - len(b))
            if cost < best_cost:
                best, best_cost = [a, b], cost
    if best:
        return best
    rows, cur = [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > ROW:
            rows.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    return rows + [cur]


def blocks_for_line(line: dict) -> list[dict]:
    units = []  # phrases; phrases that cannot fit in two rows fall back to words
    for p in line["phrases"]:
        if len(wrap_rows(p["text"])) <= ROWS:
            units.append(dict(p))
        else:
            units += [dict(w) for w in line["words"] if p["start"] - 1e-6 <= w["start"] < p["end"] - 1e-6]
    blocks, cur = [], None
    for u in units:
        if cur and len(wrap_rows(cur["text"] + " " + u["text"])) <= ROWS:
            cur["text"] += " " + u["text"]
            cur["end"] = u["end"]
        else:
            if cur:
                blocks.append(cur)
            cur = {"text": u["text"], "start": u["start"], "end": u["end"]}
    if cur:
        blocks.append(cur)
    return blocks


def ts(t: float, sep: str) -> str:
    ms = int(round(t * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}{sep}{ms:03d}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--timing", default=str(ROOT / "src/data/narration_timing.json"))
    ap.add_argument("--out", default=str(ROOT / "episodes/ep001-microwave-leftovers/captions/ep001_opening_TEMP"))
    args = ap.parse_args()

    timing = json.loads(Path(args.timing).read_text(encoding="utf-8"))
    blocks = [b for line in timing["lines"] for b in blocks_for_line(line)]
    for i, b in enumerate(blocks):  # holds: min 1.0 s, +0.35 s tail, never overlap
        nxt = blocks[i + 1]["start"] if i + 1 < len(blocks) else timing["durationSec"]
        b["end"] = min(max(b["end"] + 0.35, b["start"] + 1.0), nxt - 0.04)

    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    srt, vtt = [], ["WEBVTT", ""]
    for i, b in enumerate(blocks, 1):
        rows = "\n".join(wrap_rows(b["text"]))
        srt += [str(i), f"{ts(b['start'], ',')} --> {ts(b['end'], ',')}", rows, ""]
        vtt += [f"{ts(b['start'], '.')} --> {ts(b['end'], '.')}", rows, ""]
    out.with_suffix(".srt").write_text("\n".join(srt), encoding="utf-8")
    out.with_suffix(".vtt").write_text("\n".join(vtt), encoding="utf-8")

    remotion = [
        {"text": b["text"], "startMs": round(b["start"] * 1000), "endMs": round(b["end"] * 1000),
         "timestampMs": round(b["start"] * 1000), "confidence": None}
        for b in blocks
    ]
    (ROOT / "src/data/captions.json").write_text(json.dumps(remotion, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(blocks)} captions -> {out.with_suffix('.srt')}, .vtt, src/data/captions.json")


if __name__ == "__main__":
    main()
