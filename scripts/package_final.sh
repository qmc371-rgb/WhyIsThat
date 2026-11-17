#!/usr/bin/env bash
# Zip the deliverables + full project source (no node_modules / venv / models / scratch renders).
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=why-is-that/out/why-is-that_ep001_final.zip
rm -f "$OUT"
zip -qr "$OUT" why-is-that \
  -x 'why-is-that/node_modules/*' 'why-is-that/tools/.venv/*' 'why-is-that/tools/models/*' \
     'why-is-that/out/*.zip' 'why-is-that/out/stills/*' 'why-is-that/out/qa/f*.png' \
     'why-is-that/public/assets/higgsfield/*_v1.png' 'why-is-that/public/assets/higgsfield/H2_bowl_side_v1b.png' \
     'why-is-that/public/assets/higgsfield/H2_bowl_side.png' 'why-is-that/public/assets/higgsfield/H3_bowl_top.png' 'why-is-that/public/assets/higgsfield/H4_hands_switch.png'
ls -la "$OUT"
