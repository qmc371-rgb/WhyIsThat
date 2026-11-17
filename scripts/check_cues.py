#!/usr/bin/env python3
"""Static check: every cue('phrase', ...) in src/ must resolve against the timing file."""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
norm = lambda s: re.sub(r"\s+", " ", re.sub(r"[^a-z0-9' ]+", " ", s.lower().replace("’", "'").replace("‘", "'"))).strip()
timing = json.loads((ROOT / "src/data/narration_timing.json").read_text())
words = [(n, w["start"]) for l in timing["lines"] for w in l["words"] for n in norm(w["text"]).split(" ") if n]
seq = [n for n, _ in words]
bad, ok = [], 0
for f in sorted((ROOT / "src").rglob("*.tsx")):
    for m in re.finditer(r"cue\(\s*'([^']+)'\s*,\s*([0-9.]+)", f.read_text()):
        tgt = norm(m.group(1)).split(" ")
        hit = next((i for i in range(len(seq) - len(tgt) + 1) if seq[i:i + len(tgt)] == tgt), None)
        if hit is None:
            bad.append(f"{f.relative_to(ROOT)}: '{m.group(1)}'")
        else:
            ok += 1
            drift = abs(words[hit][1] - float(m.group(2)))
            if drift > 1.0:
                print(f"note: '{m.group(1)}' resolves at {words[hit][1]:.2f}s (fallback {m.group(2)})")
print(f"{ok} cues resolve; {len(bad)} unresolved")
for b in bad:
    print("  UNRESOLVED", b)
sys.exit(1 if bad else 0)
