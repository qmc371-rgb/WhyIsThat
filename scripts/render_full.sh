#!/usr/bin/env bash
# Render the full EP001 master (1920x1080, 30 fps), then master the audio to -14 LUFS / -1 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
python3 scripts/check_cues.py
npx tsc --noEmit
npx remotion render src/index.ts Ep001Full out/final/_ep001_raw.mp4 --props='{"showDraftBug":false,"showCaptions":false}' --crf=18 --log=warn
bash scripts/master_audio.sh out/final/_ep001_raw.mp4 out/final/ep001_why_is_that_microwave_leftovers_1080p.mp4 -14
rm out/final/_ep001_raw.mp4
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate -of compact out/final/ep001_why_is_that_microwave_leftovers_1080p.mp4
