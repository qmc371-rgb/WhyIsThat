#!/usr/bin/env bash
# QA for the final master: format, loudness, true-black/frozen segments, filmstrip.
set -euo pipefail
F=${1:-out/final/ep001_why_is_that_microwave_leftovers_1080p.mp4}
OUT=${2:-out/qa}
mkdir -p "$OUT"
echo "== format"; ffprobe -v error -show_entries format=duration,size,bit_rate:stream=codec_name,width,height,r_frame_rate,pix_fmt,sample_rate,channels -of compact "$F"
echo "== loudness"; ffmpeg -hide_banner -nostats -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary | grep -E " I:|LRA:|Peak:" | tr -s ' '
echo "== true-black segments (pix_th 0.03, >=0.3 s)"; ffmpeg -hide_banner -nostats -i "$F" -vf "blackdetect=d=0.3:pix_th=0.03" -an -f null - 2>&1 | grep -o "black_start.*" || echo "none"
echo "== frozen segments (>= 4 s)"; ffmpeg -hide_banner -nostats -i "$F" -vf "freezedetect=n=0.0005:d=4" -an -f null - 2>&1 | grep -o "lavfi.freezedetect.freeze_[a-z]*: [0-9.]*" | paste - - - 2>/dev/null || echo "none"
echo "== filmstrip"; ffmpeg -hide_banner -loglevel error -y -i "$F" -vf "fps=1/5,scale=384:216" "$OUT/f%03d.png" && montage "$OUT"/f*.png -tile 8x7 -geometry 384x216+2+2 -background '#000' "$OUT/filmstrip_every5s.jpg" && echo "$OUT/filmstrip_every5s.jpg"
