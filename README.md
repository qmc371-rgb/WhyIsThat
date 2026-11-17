# Why Is That? — channel production project

**Repository:** `github.com/qmc371-rgb/WhyIsThat` (private). Setup steps are in `CLAUDE.md`.

A standalone project for the **Why Is That?** YouTube channel, kept **separate from Beyond the
Bulkhead** (no shared folders, assets, Higgsfield projects or brand files).

**Brand:** deep navy · white · golden yellow (`src/brand/tokens.ts`). Display type is Fredoka; UI and
labels use Inter (both OFL). Episodes are 1920×1080 at 30 fps, rendered with Remotion.

## Pilot: EP001 "Why does reheated dinner heat unevenly?" (working title)
| Path | What |
|---|---|
| `episodes/ep001-microwave-leftovers/narration/editorial_draft_v1.txt` | Your supplied narration, verbatim (56 paragraphs, 622 words) |
| `out/final/ep001_why_is_that_microwave_leftovers_1080p.mp4` | **Final master**, 1920×1080, 30 fps, −14 LUFS |
| `out/final/ep001_thumbnail_1280x720.png` / `.jpg` | Thumbnail |
| `out/final/ep001_FINAL.srt` / `.vtt` | Captions aligned to the final narration |
| `out/final/ep001_sources.md`, `ep001_description_sources.txt` | Source list (claim map) + description-ready text |
| `out/final/ep001_production_cost_log.csv` | Production cost log |
| `out/preview/ep001_opening30_PREVIEW_TEMPVOICE.mp4` | Earlier opening preview (temp voice, code placeholder art) |
| `episodes/…/docs/HIGGSFIELD_PROMPT_SHEET.md` | Numbered prompts H1–H6, generated 2026-11-16 (16 credits) |
| `episodes/…/docs/DEPENDENCIES_AND_COSTS.md` | Tool inventory, remaining dependencies, cost estimates |
| `episodes/…/docs/asset_manifest.json` | Higgsfield job IDs, credits and measured anchors |
| `episodes/…/docs/SOURCES.md` | Source list with a claim-by-claim map |
| `episodes/…/docs/RUNBOOK_FINAL_NARRATION.md` | Alignment → captions → export steps |
| `episodes/…/captions/ep001_FINAL.srt/.vtt` | Final captions (source copies) |

## EP002 "Why Is There a Tiny Hole in Airplane Windows?"
Same production reference as EP001 (typography, Kokoro `af_heart` 0.88 narrator, animation kit,
caption rules, −14 LUFS mastering, H.264 CRF 18 BT.709). Release slot **not confirmed**: Fri Dec 4
is only the proposed slot, and no publication date is assigned until the owner confirms.

| Path | What |
|---|---|
| `episodes/ep002-airplane-window-hole/narration/` | Owner's draft (verbatim + cleaned, 61 paragraphs, 635 words) and the inline citations |
| `deliverables/ep002/` | Storyboard, captions (main + Short), description, chapters, sources, cost log, manifest, thumbnail, QA report |
| `out/final/ep002_why_is_that_airplane_window_hole_1080p.mp4` | **Final master** (not committed; rebuild below) |
| `out/final/ep002_short_vertical_1080x1920.mp4` | Vertical Short, 29 s (not committed) |
| `out/preview/ep002_opening30_preview.mp4` | Opening 30-second preview (not committed) |
| `src/scenes/ep002/` | Scenes: `geom.ts` (anchors, hole position, projection), `Exploded.tsx`, `CrossSection.tsx`, `Illustrations.tsx`, `SectionsA/B.tsx`, `Ep002Full.tsx`, `Short.tsx`, `Thumbnail.tsx` |

```bash
bash scripts/render_master.sh Ep002Full out/final/ep002_why_is_that_airplane_window_hole_1080p.mp4   # ~25 min
bash scripts/render_master.sh Ep002Opening30 out/preview/ep002_opening30_preview.mp4
bash scripts/render_master.sh Ep002Short out/final/ep002_short_vertical_1080x1920.mp4 '{}'
npx remotion still src/index.ts Ep002Thumbnail out/final/ep002_thumbnail_1280x720.png
tools/.venv/bin/python scripts/make_short_audio.py --episode ep002 --lines L03,L10,L11,L24,L28,L61 --name ep002_short
python3 scripts/make_captions.py --timing src/data/ep002_short/narration_timing.json --out episodes/ep002-airplane-window-hole/captions/ep002_short --row 24
```

## Release operations (`production/`)
| Path | What |
|---|---|
| `production/PRODUCTION_PLAN.md` | Cadence (Tue/Fri 6 p.m. ET mains, Sun noon ET Shorts), two-video buffer, gates, delay policy, cost rules |
| `production/release_schedule.csv` | Every slot through Jan 2027 with finish-by deadlines, status and holiday flags |
| `production/production_milestones.csv` | Every dated gate (drafts, review copies, QA, go/no-go) with a `done` column |
| `production/why_is_that_calendar.ics` | The same milestones for Google/Apple/Outlook calendars |
| `production/budget_tracker.csv` | Monthly projections vs the $100 cap (typical and ceiling) |
| `production/status_report.md` | Latest output of `scripts/plan_status.py` (buffer health, FLAGS, spend) |

```bash
python3 scripts/plan_status.py            # buffer health, overdue gates, month-to-date spend vs $100
python3 scripts/build_calendar.py         # regenerate dates (keeps status + done marks)
```

## How it fits together
- `src/data/narration_timing.json` holds line, phrase and word timings for the current narration.
  Scenes anchor to **phrases** (`cue('switch hands')`), not frame numbers, so new narration re-times everything.
- `scripts/tts_temp.py` makes the temp scratch voice (Kokoro-82M, local, $0). **NOT FOR PUBLICATION.**
- `scripts/align_narration.py` aligns the final recording offline (tested: max 70 ms line error).
- `scripts/make_captions.py` writes SRT/VTT from the timing file (`--row 24` for vertical Shorts; no orphan one-word captions).
- `scripts/make_short_audio.py` cuts a Short's narration from the final recording at line boundaries and re-bases its timing.
- `scripts/render_master.sh <CompositionId> <out.mp4>` renders any composition and masters it to −14 LUFS.
- `scripts/make_sfx.py` synthesises every sound effect in code.
- `scripts/key_navy.py` makes cutouts from Higgsfield images on a flat navy background.
- `scripts/master_audio.sh` does two-pass loudness normalisation (−14 LUFS / −1 dBTP).

## Commands
```bash
npm install                                    # Remotion 4.0.539, React 19, fonts
python3 -m venv tools/.venv && tools/.venv/bin/pip install -r tools/requirements.txt
bash scripts/render_full.sh                    # -> out/final/…1080p.mp4 (about 30 min on 4 cores)
bash scripts/render_opening.sh                 # -> out/preview/…mp4 (about 2 min on 4 cores)
node scripts/stills.mjs Ep001Opening30 0.5 6.8 13.2 22.0   # review stills
```
Kokoro model files (not committed) go in `tools/models/`, from the kokoro-onnx GitHub release
`model-files-v1.0`: `kokoro-v1.0.int8.onnx` and `voices-v1.0.bin`.
