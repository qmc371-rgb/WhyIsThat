#!/usr/bin/env bash
# Re-render ONLY the audio mix of Ep001Full (e.g. after an SFX timing fix) and remux it with
# the existing master's video stream (copied, not re-encoded), then re-master loudness.
set -euo pipefail
cd "$(dirname "$0")/.."
MASTER=out/final/ep001_why_is_that_microwave_leftovers_1080p.mp4
npx remotion render src/index.ts Ep001Full out/final/_mix.wav --codec=wav --props='{"showDraftBug":false,"showCaptions":false}' --log=warn
ffmpeg -hide_banner -loglevel error -y -i "$MASTER" -i out/final/_mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 320k -shortest out/final/_remux.mp4
bash scripts/master_audio.sh out/final/_remux.mp4 "$MASTER" -14
rm out/final/_mix.wav out/final/_remux.mp4
