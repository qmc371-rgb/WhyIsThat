# EP004 + Short004 QA report (2026-11-20)

| Check | Main `ep004_metal_vs_wood_1080p.mp4` | Short `short004_colder_melts_faster_1080x1920.mp4` |
|---|---|---|
| Format | 1920×1080, 30 fps, H.264 yuv420p, BT.709, AAC 48 kHz stereo | 1080×1920, 30 fps, H.264 yuv420p, AAC 48 kHz stereo |
| Duration | 4:31.3 (narration 4:23 + 8 s end card) | 26.9 s |
| Loudness | −14.0 LUFS integrated, LRA 2.2 LU, peak −1.4 dBFS | −14.0 LUFS, LRA 2.2 LU, peak −1.5 dBFS |
| Black segments | none | none |
| Frozen ≥ 4 s | only the intended end-card hold (4:25.7 →) | none |
| Cue check | 210 cues resolve, 0 unresolved | — |

## Found and fixed during QA
- **Freeze 2:56.8–3:02.0** (end of the ice scene, L44). The push-in stopped after 40 s and the scene runs 48 s.
  Fixed with a push-in across each section's full window, plus an on-screen beat for L44 ("QUALITATIVE ANIMATION ·
  NOT A TIMED LAB RESULT"). Re-rendered; the freeze is gone.
- Earlier still review: hook pin clipped at the right edge, conductivity footnote over the fingertips,
  ice-factor chips over the ice, Short note over the blocks, cover brand line white-on-white, and the thumbnail
  face hidden under the title gradient. All fixed before the final render.
- The QA filmstrip had stale frames from an older, longer episode (showing the old title card); the master itself ends on
  ORDINARY HAS SECRETS. `qa_final.sh` now clears old frames first.

## Frame inspection
- Main: the 5 s filmstrip and end-card frames show no clipped text, nothing off-frame, and no old channel name. Every diagram carries
  "Simplified illustration."; the ice scene also carries the qualitative-animation note.
- Short: frames at 1, 5, 11, 14, 18, 21, 23 and 26 s. Captions sit at y≈560–700 within a 60 px left / 180 px right
  margin, clear of the Shorts UI; headlines, labels and notes are unclipped; the video ends on the logo + ORDINARY HAS SECRETS.
- Audio: a single narration take (Kokoro af_heart 0.88), no clipping (true peak ≤ −1.4 dBFS), soft whooshes and chimes only.

## Accuracy checklist
Materials equilibrated to the same room temperature (and "same room ≠ same temperature" stated) ✓ · gold arrows always warmer →
cooler ✓ · no cold particles entering a hand ✓ · other factors named (heat capacity, density, contact, coatings, shape) ✓ ·
substantial blocks, qualitative melt, no timings or measured temperatures ✓ · the reverse case is an abstract diagram, with no hand on a hot
surface ✓ · no infrared-thermometer proof ✓ · no frost on room-temperature metal (thumbnail or video) ✓
