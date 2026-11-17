#!/usr/bin/env python3
"""Static check: every cue('phrase', ...) in src/scenes/<ep>/ must resolve against src/data/<ep>/narration_timing.json."""
import json, re, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
norm = lambda s: re.sub(r"\s+", " ", re.sub(r"[^a-z0-9' ]+", " ", s.lower().replace("’", "'").replace("‘", "'"))).strip()
cache, bad, ok = {}, [], 0
def words_for(ep):
    if ep not in cache:
        f = ROOT / "src/data" / ep / "narration_timing.json"
        t = json.loads(f.read_text()) if f.exists() else {"lines": []}
        cache[ep] = [(n, w["start"]) for l in t["lines"] for w in l["words"] for n in norm(w["text"]).split(" ") if n]
    return cache[ep]
for f in sorted((ROOT / "src/scenes").rglob("*.tsx")):
    ep = f.relative_to(ROOT / "src/scenes").parts[0]
    words = words_for(ep); seq = [n for n, _ in words]
    for m in re.finditer(r"cue\(\s*'([^']+)'\s*,\s*([0-9.]+)", f.read_text()):
        tgt = norm(m.group(1)).split(" ")
        hit = next((i for i in range(len(seq) - len(tgt) + 1) if seq[i:i + len(tgt)] == tgt), None)
        if hit is None:
            bad.append(f"{f.relative_to(ROOT)}: '{m.group(1)}'")
        else:
            ok += 1
            if abs(words[hit][1] - float(m.group(2))) > 1.0:
                print(f"note [{ep}]: '{m.group(1)}' resolves at {words[hit][1]:.2f}s (fallback {m.group(2)})")
print(f"{ok} cues resolve; {len(bad)} unresolved")
for b in bad:
    print("  UNRESOLVED", b)
sys.exit(1 if bad else 0)
