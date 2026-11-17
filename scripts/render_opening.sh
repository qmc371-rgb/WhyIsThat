#!/usr/bin/env bash
# Render the EP001 opening preview (1920x1080, 30 fps, H.264 + AAC).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=${1:-out/preview/ep001_opening30_PREVIEW_TEMPVOICE.mp4}
PROPS=${2:-'{"showDraftBug":true,"showCaptions":false}'}
npx tsc --noEmit
npx remotion render src/index.ts Ep001Opening30 "$OUT" --props="$PROPS" --crf=18 --log=warn
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,sample_rate -of compact "$OUT"
