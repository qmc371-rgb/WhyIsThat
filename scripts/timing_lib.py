"""
Shared narration-timing helpers (no network, no paid services).

Timing JSON schema (src/data/narration_timing.json):
  lines[]: {id, text, start, end,
            phrases[]: {text, start, end},
            words[]:   {text, start, end}}   # seconds, absolute in the track

Phrase boundaries are anchored to pauses detected in the audio; word times inside
a phrase are proportional to character count. Good enough for scene cues and
sentence-level captions; swap in a forced aligner later if word-exact karaoke
captions are wanted.
"""
from __future__ import annotations

import re
from pathlib import Path

import numpy as np

PHRASE_SPLIT = re.compile(r"(?<=[,;:?!.—])\s+")
WORD = re.compile(r"[A-Za-z0-9’'\-]+[^\sA-Za-z0-9]*")


def read_draft_lines(path: Path) -> list[tuple[str, str]]:
    text = Path(path).read_text(encoding="utf-8")
    paras = [" ".join(p.split()) for p in text.split("\n\n") if p.strip()]
    return [(f"L{i:02d}", p) for i, p in enumerate(paras, 1)]


def frame_rms(audio: np.ndarray, sr: int, hop_s: float = 0.010, win_s: float = 0.025) -> np.ndarray:
    hop, win = max(1, int(sr * hop_s)), max(1, int(sr * win_s))
    if len(audio) < win:
        return np.array([float(np.sqrt(np.mean(audio**2)))]) if len(audio) else np.zeros(1)
    n = 1 + (len(audio) - win) // hop
    idx = np.arange(win)[None, :] + hop * np.arange(n)[:, None]
    return np.sqrt(np.mean(audio[idx] ** 2, axis=1))


def silence_threshold(rms: np.ndarray, rel_db: float = -32.0) -> float:
    peak = float(np.percentile(rms, 99)) if rms.size else 0.0
    floor = float(np.percentile(rms, 10)) if rms.size else 0.0
    return max(peak * 10 ** (rel_db / 20), floor * 2.5, 1e-5)


def trim_silence(audio: np.ndarray, sr: int, pad_s: float = 0.04) -> np.ndarray:
    rms = frame_rms(audio, sr)
    loud = np.where(rms > silence_threshold(rms))[0]
    if loud.size == 0:
        return audio
    hop = int(sr * 0.010)
    a = max(0, loud[0] * hop - int(pad_s * sr))
    b = min(len(audio), (loud[-1] + 3) * hop + int(pad_s * sr))
    return audio[a:b]


def find_pauses(audio: np.ndarray, sr: int, min_pause_s: float = 0.08) -> list[tuple[float, float]]:
    """Internal silent stretches (start, end) in seconds, excluding the clip edges."""
    rms = frame_rms(audio, sr)
    quiet = rms <= silence_threshold(rms)
    hop_s = 0.010
    pauses, run_start = [], None
    for i, q in enumerate(quiet):
        if q and run_start is None:
            run_start = i
        elif not q and run_start is not None:
            if (i - run_start) * hop_s >= min_pause_s and run_start > 0:
                pauses.append((run_start * hop_s, i * hop_s))
            run_start = None
    return pauses


def _weight(s: str) -> float:
    return len(re.sub(r"[^A-Za-z0-9]", "", s)) + 1.5


def split_phrases(text: str) -> list[str]:
    return [p for p in PHRASE_SPLIT.split(text.strip()) if p]


def _match_boundaries(expected: list[float], pauses: list[tuple[float, float]]):
    """Monotonic DP: assign each expected boundary a distinct pause (or None)."""
    mids = [(a + b) / 2 for a, b in pauses]
    nb, npz = len(expected), len(mids)
    MISS = 0.35 ** 2  # cost of leaving a boundary unmatched
    INF = float("inf")
    cost = [[INF] * (npz + 1) for _ in range(nb + 1)]
    back = [[None] * (npz + 1) for _ in range(nb + 1)]
    for j in range(npz + 1):
        cost[0][j] = 0.0
    for i in range(1, nb + 1):
        for j in range(npz + 1):
            # boundary i unmatched
            if cost[i - 1][j] + MISS < cost[i][j]:
                cost[i][j], back[i][j] = cost[i - 1][j] + MISS, (i - 1, j, None)
            # boundary i matched to pause k < j (pauses used in order)
            for k in range(j):
                c = cost[i - 1][k] + (mids[k] - expected[i - 1]) ** 2
                if c < cost[i][j]:
                    cost[i][j], back[i][j] = c, (i - 1, k, k)
    j = min(range(npz + 1), key=lambda jj: cost[nb][jj])
    out, i = [None] * nb, nb
    while i > 0:
        pi, pj, k = back[i][j]
        out[i - 1] = k
        i, j = pi, pj
    return out


def build_line_timing(line_id: str, text: str, audio: np.ndarray, sr: int, start: float) -> dict:
    dur = len(audio) / sr
    phrases = split_phrases(text)
    weights = [sum(_weight(w) for w in p.split()) for p in phrases]
    total_w = sum(weights) or 1.0
    pauses = find_pauses(audio, sr)
    pause_total = sum(b - a for a, b in pauses)
    speech = max(dur - pause_total, 1e-3)

    # expected boundary times (proportional speech + pauses assumed evenly placed)
    expected, acc = [], 0.0
    for w in weights[:-1]:
        acc += w / total_w
        expected.append(acc * speech + pause_total * acc)
    match = _match_boundaries(expected, pauses) if phrases[:-1] else []

    edges: list[tuple[float, float] | None] = [(0.0, 0.0)]  # (end of prev phrase, start of next)
    for m in match:
        edges.append(None if m is None else pauses[m])
    edges.append((dur, dur))
    # Unmatched boundaries (comma spoken without a pause): interpolate by text
    # weight between the nearest real anchors on either side.
    cumw = [0.0]
    for w in weights:
        cumw.append(cumw[-1] + w)
    for i, e in enumerate(edges):
        if e is not None:
            continue
        lo = max(k for k in range(i) if edges[k] is not None)
        hi = min(k for k in range(i + 1, len(edges)) if edges[k] is not None)
        t0, t1 = edges[lo][1], edges[hi][0]
        frac = (cumw[i] - cumw[lo]) / ((cumw[hi] - cumw[lo]) or 1.0)
        t = t0 + (t1 - t0) * frac
        edges[i] = (t, t)

    phr_out, words_out = [], []
    for p_i, ptext in enumerate(phrases):
        p_start, p_end = edges[p_i][1], edges[p_i + 1][0]
        if p_end <= p_start:
            p_end = p_start + 0.05
        phr_out.append({"text": ptext, "start": round(start + p_start, 3), "end": round(start + p_end, 3)})
        toks = ptext.split()
        tw = [_weight(t) for t in toks]
        s, cum = sum(tw) or 1.0, 0.0
        for tok, w in zip(toks, tw):
            a = p_start + (p_end - p_start) * cum / s
            cum += w
            b = p_start + (p_end - p_start) * cum / s
            words_out.append({"text": tok, "start": round(start + a, 3), "end": round(start + b, 3)})

    return {
        "id": line_id,
        "text": text,
        "start": round(start, 3),
        "end": round(start + dur, 3),
        "phrases": phr_out,
        "words": words_out,
    }
