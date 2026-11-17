#!/usr/bin/env python3
"""Synthesise all pilot sound effects in code (no samples, nothing to license)."""
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 48000
OUT = Path(__file__).resolve().parents[1] / "public/sfx"
rng = np.random.default_rng(7)


def t_axis(sec):
    return np.arange(int(sec * SR)) / SR


def band(x, lo, hi, order=4):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def low(x, hi, order=4):
    return sosfilt(butter(order, hi, btype="low", fs=SR, output="sos"), x)


def norm(x, peak=0.9):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def fade(x, a=0.005, b=0.02):
    n = len(x)
    env = np.ones(n)
    na, nb = int(a * SR), int(b * SR)
    env[:na] = np.linspace(0, 1, na)
    env[n - nb:] = np.linspace(1, 0, nb)
    return x * env


def save(name, x):
    OUT.mkdir(parents=True, exist_ok=True)
    sf.write(OUT / name, norm(fade(x)).astype(np.float32), SR, subtype="PCM_16")


# Microwave "ding": inharmonic bell partials with exponential decay
t = t_axis(1.8)
f0 = 1318.5
ding = sum(a * np.sin(2 * np.pi * f0 * r * t) * np.exp(-t / d)
           for a, r, d in [(1.0, 1.0, 0.70), (0.45, 2.01, 0.35), (0.25, 2.76, 0.22), (0.12, 5.40, 0.10)])
save("ding.wav", ding)

# Keypad beep
t = t_axis(0.12)
save("beep.wav", np.sign(np.sin(2 * np.pi * 2000 * t)) * 0.4 + np.sin(2 * np.pi * 2000 * t) * 0.6)

# Running hum, seamless 2 s loop: transformer harmonics + fan noise
t = t_axis(2.0)
hum = (np.sin(2 * np.pi * 120 * t) + 0.5 * np.sin(2 * np.pi * 240 * t) + 0.22 * np.sin(2 * np.pi * 360 * t))
fan = low(rng.standard_normal(len(t) + SR), 900)[SR // 2: SR // 2 + len(t)]
x = hum * 0.6 + fan * 0.35
xf = int(0.05 * SR)  # crossfade loop seam
x[:xf] = x[:xf] * np.linspace(0, 1, xf) + x[-xf:] * np.linspace(1, 0, xf)
sf.write(OUT / "hum_loop.wav", norm(x[:-xf], 0.8).astype(np.float32), SR, subtype="PCM_16")

# Door open (latch click + light thump) and close (heavier thump + click)
def thump(freq, dur, decay):
    tt = t_axis(dur)
    return np.sin(2 * np.pi * freq * tt * (1 - 0.3 * tt / dur)) * np.exp(-tt / decay)


def click(dur=0.03, lo=1800, hi=5000):
    return band(rng.standard_normal(int(dur * SR)), lo, hi) * np.exp(-t_axis(dur) / (dur / 4))


op = np.zeros(int(0.35 * SR))
c = click(0.03); op[: len(c)] += c * 0.9
th = thump(110, 0.25, 0.05); op[int(0.02 * SR): int(0.02 * SR) + len(th)] += th * 0.6
save("door_open.wav", op)

cl = np.zeros(int(0.4 * SR))
th = thump(80, 0.3, 0.07); cl[: len(th)] += th
c = click(0.025, 1500, 4000); cl[int(0.012 * SR): int(0.012 * SR) + len(c)] += c * 0.7
save("door_close.wav", cl)

# Bubbling loop for the "furious edges": random small chirped blips over a simmer bed
dur = 3.0
x = low(rng.standard_normal(int(dur * SR)), 2500) * 0.08
for _ in range(70):
    st = rng.uniform(0, dur - 0.08)
    d = rng.uniform(0.02, 0.06)
    f = rng.uniform(250, 900)
    tt = t_axis(d)
    blip = np.sin(2 * np.pi * (f * tt + f * 2.5 * tt**2 / d)) * np.exp(-tt / (d / 3))
    i0 = int(st * SR)
    x[i0: i0 + len(blip)] += blip * rng.uniform(0.25, 0.7)
xf = int(0.05 * SR)
x[:xf] = x[:xf] * np.linspace(0, 1, xf) + x[-xf:] * np.linspace(1, 0, xf)
sf.write(OUT / "bubbling_loop.wav", norm(x[:-xf], 0.8).astype(np.float32), SR, subtype="PCM_16")

# Whoosh: band-passed noise with rising centre frequency
dur = 0.7
n = rng.standard_normal(int(dur * SR))
segs, out = 28, np.zeros(int(dur * SR))
L = len(out) // segs
for i in range(segs):
    fc = 300 * (12 ** (i / segs))
    seg = band(n, fc * 0.7, min(fc * 1.4, 20000))[i * L:(i + 1) * L]
    out[i * L:(i + 1) * L] = seg
env = np.sin(np.pi * np.linspace(0, 1, len(out))) ** 2
save("whoosh.wav", out * env)

# Title chime: two soft bell notes (E6 then B6)
t = t_axis(2.2)
def bell(f, delay):
    tt = np.clip(t - delay, 0, None)
    on = (t >= delay).astype(float)
    return on * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt / 0.6)
save("title_chime.wav", bell(1318.5, 0.0) * 0.8 + bell(1975.5, 0.16))

print("wrote", sorted(p.name for p in OUT.glob("*.wav")))
