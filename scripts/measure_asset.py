#!/usr/bin/env python3
"""
Measure rig anchors on a keyed (_cut.png) Higgsfield asset and print JSON.
  side bowl: rim centre, rim radii (from the widest row + top of silhouette), foot y
  top bowl:  centre + radius (from the alpha bounding box)
Usage: measure_asset.py <cut.png> side|top
"""
import json
import sys

import numpy as np
from PIL import Image

path, kind = sys.argv[1], sys.argv[2]
a = np.asarray(Image.open(path).convert("RGBA"))[..., 3] > 128
H, W = a.shape
ys, xs = np.where(a)
x0, x1, y0, y1 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
out = {"file": path.split("/public/")[-1], "size": [W, H], "bbox": [x0, y0, x1, y1]}
if kind == "side":
    widths = np.array([(np.ptp(np.where(row)[0]) if row.any() else 0) for row in a])
    wmax = widths.max()
    rows = np.where(widths >= wmax - 2)[0]
    cy = int(np.median(rows))
    row = np.where(a[cy])[0]
    cx = (int(row.min()) + int(row.max())) / 2
    out.update({"rimCx": cx, "rimCy": cy, "rimRx": (int(row.max()) - int(row.min())) / 2, "rimRy": cy - y0, "footY": y1})
else:
    out.update({"cx": (x0 + x1) / 2, "cy": (y0 + y1) / 2, "r": max(x1 - x0, y1 - y0) / 2})
print(json.dumps(out))
