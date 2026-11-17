# Why Is That? — instructions for Claude

YouTube explainer channel. A separate project from Beyond the Bulkhead: never mix their files,
Higgsfield projects or brand assets.

## Non-negotiables
- **Never upload, schedule, publish or buy anything.** The owner uploads and schedules in YouTube Studio.
- **Costs:** total incremental spend ≤ $100/month (warn at $50, stop and ask at $80). Higgsfield
  ≤ 40 credits per episode, always preflight with `get_cost`, never top up. Log every spend in the
  episode's `docs/production_cost_log.csv`; check `python3 scripts/plan_status.py`.
- **Higgsfield:** at most six reusable illustrative assets per episode, generated only from an
  approved prompt sheet; record job IDs, credits and anchors in `docs/asset_manifest.json`.
  Reuse the existing kitchen/bowl assets when the topic allows.
- **Science:** diagrams, labels, arrows and energy patterns are made in code. Every pattern is
  labelled **SCHEMATIC**. No invented measurements, no thermal-camera looks. Every claim maps to a
  source in the episode's `docs/SOURCES.md`.
- **Narration:** Kokoro-82M (voice `af_heart`, speed 0.88) is the approved final voice.
  ElevenLabs free-tier speech is not approved for this commercial channel.
- **Schedule:** mains Tue + Fri 6 p.m. ET, one Short Sun noon ET, a two-video buffer
  (`production/PRODUCTION_PLAN.md`). **Flag delays; never ship unfinished work to keep a slot.**
  A read-only daily status check already runs at 5:39 p.m. ET (scheduled task "Why Is That daily
  status"); don't create a duplicate. Push status/`done` updates so it sees them.
- Never display credentials.

## Brand
Deep navy / white / golden yellow (`src/brand/tokens.ts`), Fredoka display + Inter UI (OFL),
1920×1080 at 30 fps, BT.709. One consistent kitchen, white bowl and leftovers (golden curry + rice).

## Setup (fresh container)
```bash
npm ci
python3 -m venv tools/.venv && tools/.venv/bin/pip install -r tools/requirements.txt
mkdir -p tools/models && for f in kokoro-v1.0.int8.onnx voices-v1.0.bin; do
  [ -s tools/models/$f ] || curl -sSL -o tools/models/$f https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f; done
```
Remotion renders with the preinstalled headless shell (`remotion.config.ts`; override with `REMOTION_BROWSER`).

## Pipeline
| Step | Command |
|---|---|
| Voice (EP001 script; copy and adapt per episode) | `tools/.venv/bin/python scripts/tts_kokoro_final.py` |
| Captions | `python3 scripts/make_captions.py --out episodes/<ep>/captions/<ep>_FINAL` |
| Cue check (must be 0 unresolved) | `python3 scripts/check_cues.py` |
| Review stills | `node scripts/stills.mjs Ep001Full 0.5 <seconds…>` |
| Render + loudness master | `bash scripts/render_full.sh` |
| QA (format, loudness, black/frozen, filmstrip) | `bash scripts/qa_final.sh` |
| Status / flags / spend | `python3 scripts/plan_status.py` |
| Calendar regeneration | `python3 scripts/build_calendar.py` |

## Repo hygiene
Don't commit `out/` renders, `node_modules/`, `tools/.venv/`, `tools/models/` or Higgsfield
originals (they stay in the Higgsfield project). Small deliverables go in `deliverables/<ep>/`.
