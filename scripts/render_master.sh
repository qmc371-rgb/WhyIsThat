#!/usr/bin/env bash
# Render any composition at 1920x1080/30 fps (or its own size), then master the audio to -14 LUFS / -1 dBTP.
# Usage: scripts/render_master.sh <CompositionId> <out.mp4> [props-json]
#   e.g. scripts/render_master.sh Ep002Full out/final/ep002_….mp4
set -euo pipefail
cd "$(dirname "$0")/.."
ID=$1; OUT=$2; PROPS=${3:-'{"showDraftBug":false,"showCaptions":false}'}
mkdir -p "$(dirname "$OUT")"
RAW="$(dirname "$OUT")/_raw_$(basename "$OUT")"
python3 scripts/check_cues.py
npx tsc --noEmit
npx remotion render src/index.ts "$ID" "$RAW" --props="$PROPS" --crf=18 --log=warn
bash scripts/master_audio.sh "$RAW" "$OUT" -14
rm -f "$RAW"
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate,sample_rate,pix_fmt,color_space -of compact "$OUT"
