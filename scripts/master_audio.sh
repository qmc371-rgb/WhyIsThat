#!/usr/bin/env bash
# Two-pass EBU R128 loudness normalisation; video stream copied untouched.
# Usage: scripts/master_audio.sh in.mp4 out.mp4 [target LUFS, default -14]
set -euo pipefail
IN=$1; OUT=$2; I=${3:--14}; TP=-1.5; LRA=11  # -1.5 target keeps measured true peak <= -1 dBTP
J=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=$I:TP=$TP:LRA=$LRA:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -loglevel error -y -i "$IN" -c:v copy \
  -af "loudnorm=I=$I:TP=$TP:LRA=$LRA:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 192k -movflags +faststart "$OUT"
ffmpeg -hide_banner -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -A20 Summary | grep -E " I:|Peak:" | tr -s ' '
