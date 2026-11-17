# EP002 deliverables: "Why Is There a Tiny Hole in Airplane Windows?"

Small deliverables are versioned here. The videos are not committed (repo rule); they were sent in
the session and can be rebuilt with the commands in the repo README:

| Video | Size | Rebuild |
|---|---|---|
| `ep002_why_is_that_airplane_window_hole_1080p.mp4` (4:34.9) | 60.5 MB | `bash scripts/render_master.sh Ep002Full out/final/…` (~25 min) |
| `ep002_opening30_preview.mp4` (first 30 s of the master) | 12.0 MB | `ffmpeg -i <master> -t 30 -c copy …` |
| `ep002_short_vertical_1080x1920.mp4` (29.1 s) | 5.3 MB | `bash scripts/render_master.sh Ep002Short out/final/… '{}'` |

| File | What |
|---|---|
| `ep002_storyboard.md` | Complete storyboard, every beat on a real narration time; accuracy rules |
| `ep002_QA_report.md` | Format, loudness, captions, accuracy and cost checks |
| `ep002_FINAL.srt` / `.vtt` | Captions for the main video (upload in YouTube Studio) |
| `ep002_short.srt` / `.vtt` | Captions for the Short (also burned in) |
| `ep002_youtube_description.txt` | Ready-to-paste description: summary, chapters, sources, credits |
| `ep002_chapters.txt`, `ep002_description_sources.txt` | The same parts on their own |
| `ep002_short_description.txt` | Description for the Short |
| `ep002_sources.md` | Source list with a claim-by-claim map and 🔁 items |
| `ep002_production_cost_log.csv` | Actual costs (8 credits ≈ $0.39; $0 cash) |
| `ep002_asset_manifest.json`, `ep002_higgsfield_prompt_sheet.md` | Higgsfield job IDs, credits, anchors; the approved prompts |
| `ep002_thumbnail_1280x720.png` / `.jpg` | Thumbnail |
