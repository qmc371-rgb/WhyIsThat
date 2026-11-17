# EP001 runbook — after the final narration arrives

> **2026-11-16:** Kokoro was approved as the final voice. `scripts/tts_kokoro_final.py` voices each
> paragraph separately, so line boundaries are exact and step 1 (alignment) is not needed. Steps 2,
> 4 and 5 have been run (`scripts/render_full.sh`). For a future recorded voice, follow this runbook
> unchanged.

Goal: re-time every scene and caption to the real recording, then export the deliverables.
Nothing here publishes anything; you upload to YouTube yourself.

## 0. Deliver the narration
Put the commercially licensed recording (48 kHz WAV preferred) in
`episodes/ep001-microwave-leftovers/narration/final/`, in one of two forms:
- **Per paragraph (most reliable):** `L01.wav … L56.wav`, matching the paragraphs of
  `narration/editorial_draft_v1.txt`. If the read changes wording, update the draft text first.
- **One edited file:** `ep001_narration_FINAL.wav`, retakes removed, natural pauses between paragraphs.

## 1. Align (offline, $0)
```bash
tools/.venv/bin/python scripts/align_narration.py --dir episodes/ep001-microwave-leftovers/narration/final --label FINAL_v1
# or: --audio episodes/ep001-microwave-leftovers/narration/final/ep001_narration_FINAL.wav
```
Check the printed table. Any line marked `<-- check` read much faster or slower than its text
suggests, which usually means a retake or a missed pause. Fix it and re-run.
The output `src/data/narration_timing.json` has `notForPublication: false`, so the NOT FOR
PUBLICATION bug switches off automatically. Temp timing can never produce a clean export.

## 2. Captions
```bash
python3 scripts/make_captions.py --out episodes/ep001-microwave-leftovers/captions/ep001_FINAL
```
This writes `.srt` and `.vtt` (≤ 42 characters per row, ≤ 2 rows) plus `src/data/captions.json`.

## 3. Review cues
`REMOTION_BROWSER=<chrome path> npm run studio`. Scrub each shot. Any narration phrase that a scene
cue can no longer find is listed under **UNRESOLVED CUES** in the review overlay. Update that cue's
phrase in `src/scenes/ep001/*.tsx`.

## 4. Export
```bash
npx remotion render src/index.ts Ep001Full out/final/ep001_master_raw.mp4 --props='{"showDraftBug":false,"showCaptions":false}'
bash scripts/master_audio.sh out/final/ep001_master_raw.mp4 out/final/ep001_master.mp4 -14
npx remotion still src/index.ts Ep001Thumbnail out/final/ep001_thumbnail.png
```
(`Ep001Full` and `Ep001Thumbnail` are built in the next phase.)

## 5. Package
- `out/final/ep001_master.mp4`: 1920×1080, −14 LUFS integrated, −1 dBTP
- `out/final/ep001_thumbnail.png`: 1280×720, under 2 MB
- `captions/ep001_FINAL.srt` and `.vtt`
- `docs/SOURCES.md`: re-verify the 🔁 items, then paste the source list into the description
- `docs/production_cost_log.csv`: update with actual credits and $ spent

## 6. QA checklist
- [ ] No TEMP or PREVIEW bug in the final video
- [ ] Every energy pattern carries its **SCHEMATIC** label; no thermal-camera look; no numbers on screen beyond the narration
- [ ] Captions spot-checked at 5 points; none overlapping
- [ ] Loudness −14 LUFS ±1, true peak ≤ −1 dBTP
- [ ] Thumbnail text readable at 160 px wide
- [x] Narration licence and Higgsfield output terms recorded in the cost log notes (terms confirmed by the owner 2026-11-17)
