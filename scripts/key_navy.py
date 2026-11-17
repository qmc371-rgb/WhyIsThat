#!/usr/bin/env python3
"""
Cut out a Higgsfield asset generated on a flat deep-navy (#0B1A33) background.
Writes <name>_cut.png with alpha. Soft edge + navy de-spill; $0, local.
Usage: key_navy.py in.png [--key 0B1A33] [--lo 22] [--hi 60]
"""
import argparse
from pathlib import Path

import numpy as np
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("--key", default="0B1A33")
ap.add_argument("--lo", type=float, default=22.0, help="distance treated as fully background")
ap.add_argument("--hi", type=float, default=60.0, help="distance treated as fully foreground")
a = ap.parse_args()

img = np.asarray(Image.open(a.src).convert("RGB")).astype(np.float32)
key = np.array([int(a.key[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)
dist = np.sqrt(((img - key) ** 2).sum(axis=2))
alpha = np.clip((dist - a.lo) / (a.hi - a.lo), 0, 1)
# un-mix the navy from semi-transparent edge pixels: c = a*fg + (1-a)*key
safe = np.maximum(alpha, 1e-3)[..., None]
fg = np.clip((img - (1 - alpha[..., None]) * key) / safe, 0, 255)
rgba = np.dstack([fg, alpha * 255]).astype(np.uint8)
out = Path(a.src).with_name(Path(a.src).stem + "_cut.png")
Image.fromarray(rgba, "RGBA").save(out)
print(f"wrote {out}  (opaque {np.mean(alpha > 0.99):.0%}, transparent {np.mean(alpha < 0.01):.0%})")
