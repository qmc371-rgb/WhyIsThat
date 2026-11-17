#!/usr/bin/env python3
"""
Scaffold a new episode (no network, no spend):

  python3 scripts/new_episode.py ep002 kettle-whistle "Why do kettles whistle?"

Creates episodes/<ep>-<slug>/{narration,captions,docs}, src/data/<ep>/ (timing stub) and
src/scenes/<ep>/timing.ts, and marks the episode IN PRODUCTION in production/release_schedule.csv.
"""
import csv, json, sys
from datetime import datetime
from zoneinfo import ZoneInfo
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if len(sys.argv) != 4:
    raise SystemExit(__doc__)
ep, slug, title = sys.argv[1].lower(), sys.argv[2], sys.argv[3]
base = ROOT / "episodes" / f"{ep}-{slug}"
if base.exists() or list(ROOT.glob(f"episodes/{ep}-*")):
    raise SystemExit(f"an episodes/{ep}-* folder already exists")

files = {
    base / "narration/editorial_draft_v1.txt": "PASTE THE EDITORIAL DRAFT HERE.\n\nOne narration line per paragraph, with a blank line between paragraphs.\n",
    base / "narration/pauses.json": json.dumps({
        "_note": "section_starts: line IDs that open a new section (they get section_pause). overrides: {'L06': 2.6} etc.",
        "lead_in": 1.2, "default": 0.6, "section_pause": 1.0, "section_starts": [], "overrides": {}, "tail": 8.0}, indent=2) + "\n",
    base / "captions/.gitkeep": "",
    base / "docs/SOURCES.md": f"# {ep.upper()} source list: claim → source\n\nStatus key: ✅ supported · 🔁 re-check live page before publishing.\n\n## Sources\n\n1. \n\n## Claim map\n\n| Line(s) | Claim | Sources | Status |\n|---|---|---|---|\n",
    base / "docs/production_cost_log.csv": "date,category,item,vendor,quantity,unit,unit_cost_usd,total_usd,status,approval,notes\n",
    base / "docs/asset_manifest.json": json.dumps({"episode": ep, "title": title, "reused": [], "assets": []}, indent=2) + "\n",
    base / "docs/HIGGSFIELD_PROMPT_SHEET.md": f"""# {ep.upper()} — Higgsfield prompt sheet ({title})

**Status: DRAFT — not generated.** Approve before any credits are spent. Cap: 6 new assets, ≤ 40 credits
(preflight every request with `get_cost`; ≈ $0.049/credit). Log jobs in `asset_manifest.json`.

## Reuse first (already paid for, 0 credits)
| ID | Asset | File |
|---|---|---|
| H1 | Kitchen plate (4K) | `public/assets/higgsfield/H1_kitchen_plate_v1.jpg` |
| H2 | White bowl + golden curry, ¾ view (cutout) | `public/assets/higgsfield/H2_bowl_side_cut.png` |
| H3 | Same bowl, top-down (cutout) | `public/assets/higgsfield/H3_bowl_top_cut.png` |
| H4 | Hands passing the bowl (cutout) | `public/assets/higgsfield/H4_hands_switch_cut.png` |
| H5 | Heater analogy | `public/assets/higgsfield/H5_heater_analogy_v1.jpg` |
| H6 | Pool analogy | `public/assets/higgsfield/H6_pool_analogy_v1.jpg` |

## STYLE LOCK (paste at the start of every prompt)
See `episodes/ep001-microwave-leftovers/docs/HIGGSFIELD_PROMPT_SHEET.md`.

## New assets (numbered, max 6)
""",
    ROOT / "src/data" / ep / "narration_timing.json": json.dumps({"source": "PLACEHOLDER", "notForPublication": True, "audio": "", "durationSec": 0, "lines": []}, indent=2) + "\n",
    ROOT / "src/scenes" / ep / "timing.ts": f"// {ep.upper()} narration cues (regenerated data: scripts/tts_kokoro.py --episode {ep}).\nimport json from '../../data/{ep}/narration_timing.json';\nimport {{makeTiming}} from '../../lib/timing';\n\nexport const {{timing, cue, line, unresolvedCues}} = makeTiming(json);\n",
}
for path, text in files.items():
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")

sched = ROOT / "production/release_schedule.csv"
rows = list(csv.DictReader(open(sched, encoding="utf-8")))
hit = False
for r in rows:
    if r["id"] == ep.upper():
        r["topic"], r["status"], hit = title, f"IN PRODUCTION — scaffolded {datetime.now(ZoneInfo('America/New_York')).date().isoformat()}", True
if hit:
    with open(sched, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
print(f"scaffolded {base.relative_to(ROOT)}" + ("" if hit else f" (no {ep.upper()} slot in the schedule)"))
