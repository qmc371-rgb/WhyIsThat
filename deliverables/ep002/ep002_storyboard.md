# EP002 storyboard — "Why Is There a Tiny Hole in Airplane Windows?"

**Status:** built from the final narration (Kokoro-82M `af_heart`, speed 0.88) · 2026-11-17
**Runtime:** 4:34.8 (274.8 s) = 4:26.8 of narration (61 lines, 635 words, ~143 wpm overall
including pauses) + 8 s end card. The length comes from the recording; nothing was stretched.
**Format:** 1920×1080, 30 fps, BT.709 · same typography, voice, animation kit, caption rules,
loudness (−14 LUFS / −1.5 dBTP target) and export settings as EP001.
**Every time below is a real narration time** from `src/data/ep002/narration_timing.json`
(line start → end, or the word a beat lands on). Scenes anchor to phrases with `cue()`, not frame
numbers, so a re-voice re-times everything.

## Accuracy rules applied in every shot
| Rule (from the brief) | How the video does it |
|---|---|
| Common design, not every aircraft | Tag **COMMON DESIGN · NOT EVERY AIRCRAFT** whenever the layers are first shown (B2); L55 chip **DIFFERENT AIRCRAFT CAN USE DIFFERENT WINDOW DESIGNS** |
| Layer names, always the same | **PROTECTIVE PANEL** / **INNER STRUCTURAL PANE** / **OUTER STRUCTURAL PANE**, identical in every diagram; cabin always left, outside always right |
| Hole in the inner structural pane only | The hole is drawn on that pane alone: in the exploded view it goes only through that pane's thickness; in the cross-section it is a gap in that slab only |
| Never a tunnel through the whole assembly | No line, path or shape ever crosses all three layers, not even crossed out. L13 ("straight through the side") is a **text-only** card |
| Cabin air communicates with the inter-pane space | Dashed airflow arrows + moving air dots go from the cabin side, through the hole, into the space; the cabin and the space share one "cabin air" tint |
| Outer pane carries the normal pressure load | L28: large solid-gold force arrows on the outer pane (outward from the space side, smaller inward from outside); label uses the narration's words |
| Airflow ≠ pressure force | Legend on every cross-section: **AIRFLOW** = dashed white line + dots · **PRESSURE FORCE** = solid gold arrow |
| "Simplified illustration — not to scale." | On every diagram, bottom-left; air-dot patterns also carry **SCHEMATIC** |
| No fog-free claim | The video never mentions fog, condensation or frost |
| No invented numbers / failure animation | No pressures, altitudes, sizes or counts anywhere. L42 is two **static** panels (normally / if the outer pane fails) with no crack, shatter or breaking motion |

## Asset plan
| Asset | Source | Used in |
|---|---|---|
| W1 passenger in a window seat | Higgsfield `c53e05cb` (2 cr) | A1, J1, Short end |
| W2 window close-up (clean glass) | Higgsfield `ffb19cf2` (4 cr, 4K) | A2–A6, B1, J2, thumbnail, Short open |
| W3 generic airliner climbing | Higgsfield `284c69a8` (2 cr) | D1 |
| The hole, all layers, arrows, labels, house window, analogy, fuselage section, legend | Code (Remotion SVG) | everywhere |
| SFX: cabin ambience, glint, whoosh, title chime | Synthesised in `scripts/make_sfx.py` | A, J, transitions, title |

The hole sits at the same relative spot on the pane in every view (lower right of centre,
`HOLE_REL` in `src/scenes/ep002/geom.ts`), so W2, the exploded view and the cross-section agree.

---

## A · Cold open (0.00–25.35)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| A1 | 0.00–5.40 | L01 1.20 "You're sitting by the airplane window." · L02 3.75 "You look past the wing…" | **W1**: passenger at the window seat; slow push toward their window. Cabin ambience fades in | — |
| A2 | 5.40–8.40 | L02 "…admire the clouds… and notice something strange." | Match-zoom through W1's window into **W2**; drift toward the lower glass. At "something" (6.83) a faint glint where the hole is | — |
| A3 | 8.40–10.80 | L03 8.50 "There's a tiny hole in the window." | Push in on the hole. At "tiny" (8.99) gold ring pulse + glint SFX | Callout **SPOTTED · A TINY HOLE** (9.14) |
| A4 | 10.80–15.60 | L04 10.90 "On the ground, a hole in your window usually means something needs fixing." | Code-drawn house window (day sky) with a small hole; wrench icon. No cracking | **ON THE GROUND · A HOLE IN YOUR WINDOW…** (11.25) · at "usually" (13.20) chip ✕ **USUALLY MEANS SOMETHING NEEDS FIXING** (wrench) |
| A5 | 15.60–19.80 | L05 15.73 "On an airplane, it raises a much more interesting question." | Back to the W2 hole close-up; at "interesting" (18.27) a gold **?** pops beside the hole | chip **ON AN AIRPLANE** |
| A6 | 19.80–25.20 | L06 19.95 "Why would engineers deliberately put a hole in something that helps keep cabin pressure inside?" | Slow pull back on W2 | at "deliberately" (21.08) **A DELIBERATE HOLE?** · at "helps keep" (23.48) **IN A WINDOW THAT HELPS KEEP CABIN PRESSURE INSIDE** |
| T | 25.20–28.55 | (pause) → L07 27.75 "The answer starts…" | **WHY IS THAT?** title card (EP001 component); words land 25.55 / 25.80 / 26.05, gold ? + chime 26.27 | tagline *Everyday things. Surprising explanations.* |

## B · The layers (28.55–53.02)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| B1 | 28.55–31.70 | L07 "…something you probably can't see from your seat." | W2 full window, gentle push | — |
| B2 | 31.70–41.90 | L08 31.88 "You aren't looking through just one pane." · L09 34.37 "In a common passenger-window design, there's a protective panel nearest you, followed by two structural panes." | Crossfade to the code window (front view, same size and spot as W2's glass). At "just one pane" (33.10) it turns to a 3/4 view and separates into three layers | 34.73 tag **COMMON DESIGN · NOT EVERY AIRCRAFT** · **CABIN** ← / → **OUTSIDE** · 37.44 **PROTECTIVE PANEL** (nearest you) · 40.06 **INNER STRUCTURAL PANE** + **OUTER STRUCTURAL PANE** · *Simplified illustration — not to scale.* |
| B3 | 41.90–47.60 | L10 41.98 "The tiny hole is in the inner structural pane—the middle layer in our illustration." | At "tiny hole" (42.24) the hole on the inner structural pane gets a gold ring; other layers dim | callout **THE TINY HOLE · INNER STRUCTURAL PANE** · 45.08 **MIDDLE LAYER IN OUR ILLUSTRATION** |
| B4 | 47.60–53.02 | L11 47.74 "And crucially, it doesn't go all the way through the window assembly to the outside." | At "go all the way" (49.09) chip; at "window assembly" (51.17) the outer pane lights up | ✕ **IT DOESN'T GO ALL THE WAY THROUGH** · ✓ **OUTER STRUCTURAL PANE: NO HOLE** |

## C · Reframe the mystery (53.02–64.84)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| C1 | 53.02–55.10 | L12 53.37 "That changes the mystery." | Navy blueprint grid | headline **That changes the mystery.** |
| C2 | 55.10–59.90 | L13 55.42 "We aren't asking why someone made a hole straight through the side of an airplane." | **Text-only** card (no drawing of a through-hole) | ✕ **NOT THE QUESTION: a hole straight through the side of an airplane** |
| C3 | 59.90–64.84 | L14 60.03 "We're asking why one layer needs an opening while another remains sealed." | Mini diagram of the two structural panes (same styling as B) | ✓ **THE REAL QUESTION** · at "opening" (62.08) **OPENING** on the inner pane · at "another" (62.88) **SEALED** on the outer pane |

## D · Pressure (64.84–81.98)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| D1 | 64.84–72.30 | L15 65.19 "To understand that, we need to talk about pressure." · L16 68.64 "As an airplane climbs, the air outside becomes thinner." | **W3** airliner climbing; slow push. At "thinner" (71.64) an inset: two boxes of air dots, denser near the ground, sparser at altitude | 67.64 chip **PRESSURE** · inset **THE AIR OUTSIDE GETS THINNER** + **SCHEMATIC** |
| D2 | 72.30–81.98 | L17 72.67 "The cabin is pressurized, so the pressure inside is higher than the pressure outside." · L18 78.25 "That difference pushes outward on the aircraft's windows." | Code fuselage cross-section: denser dots inside, sparser outside, a window on each side. At "pushes outward" (79.12) solid-gold force arrows push outward at both windows | **CABIN: PRESSURIZED** (73.48) · **INSIDE: HIGHER PRESSURE** (75.91) · **OUTSIDE: LOWER PRESSURE** (76.77) · **THE DIFFERENCE PUSHES OUTWARD ON THE WINDOWS** (79.51) · legend **PRESSURE FORCE** · SCHEMATIC + *not to scale* |

## E · Inside the window: cross-section (81.98–125.46)
Side view, cabin on the left and outside on the right. The protective panel is shown faintly on the
cabin side, so the layer names stay consistent. The two structural panes are held by a simplified
frame and seal, so the space between them is enclosed except for the hole.

| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| E1 | 81.98–85.40 | L19 82.33 "Now imagine our window layers pulled apart." | The 3/4 exploded view returns; at "pulled apart" (84.15) it turns edge-on and becomes the cross-section | — |
| E2 | 85.54 | L20 "There's the cabin." | Cabin region + air dots | **CABIN** |
| E3 | 87.14 | L21 "There's the inner structural pane." | Inner pane highlights | **INNER STRUCTURAL PANE** (+ faint **PROTECTIVE PANEL**) |
| E4 | 89.53 | L22 "Then a small space." | Gap highlights | **SPACE BETWEEN THE STRUCTURAL PANES** |
| E5 | 91.36 | L23 "Then the outer structural pane." | Outer pane highlights; sparse dots outside | **OUTER STRUCTURAL PANE** · **OUTSIDE** |
| E6 | 93.74–99.48 | L24 "The tiny opening connects the cabin's air pressure with that space between the structural panes." | At "opening" (94.30) gold ring on the hole; at "connects" (94.78) dashed airflow arrow + moving dots from the cabin side through the hole into the space; the cabin and the space take the same "cabin air" tint | legend **AIRFLOW** / **PRESSURE FORCE** · **CONNECTED TO THE CABIN'S AIR PRESSURE** |
| E7 | 100.08 | L25 "It's called a breather hole, or a bleed hole." | — | callout **BREATHER HOLE** (100.69) **· BLEED HOLE** (101.81) |
| E8 | 102.98–107.21 | L26 "As cabin pressure changes, the hole allows pressure in that space to adjust." | Two-way dashed arrow; dots drift in, then out (equalising). No values | **PRESSURE IN THE SPACE ADJUSTS** |
| E9 | 108.18–113.38 | L27 "That means the inner structural pane normally has roughly the same pressure on both sides." | Equal solid-gold force arrows on both faces of the inner pane | **ROUGHLY THE SAME PRESSURE ON BOTH SIDES** |
| E10 | 114.35–119.54 | L28 "The outer pane carries the normal pressure difference between the cabin and the outside air." | Outer pane highlights; large outward force arrows from the space side, small inward ones from outside | **OUTER PANE: CARRIES THE NORMAL PRESSURE DIFFERENCE** |
| E11 | 120.39–124.51 | L29 "So this little opening helps determine which layer does the everyday work." | Hole ring pulses; outer pane glows gold | **IT DOES THE EVERYDAY WORK** (from "which layer", 122.71) |

## F · Analogy (125.46–160.84)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| F1 | 125.81 | L30 "Here's a way to picture it." | Grid | headline **Here's a way to picture it.** |
| F2 | 127.87 | L31 "Imagine two transparent barriers with a small room between them." | Top-down plan: **YOUR SIDE** (person icon) · glass barrier 1 · **SMALL ROOM** · glass barrier 2 · **OUTSIDE** | labels at 128.36 / 130.33 |
| F3 | 132.42 | L32 "The first barrier has an opening into that room." | Opening appears in barrier 1 (gold ring) | **OPENING** |
| F4 | 135.71–141.48 | L33 "Air can move through the opening, allowing the pressure in the room to approach the pressure on your side." | Dashed airflow + dots move through the opening; the room's dots fill toward your side's density | **ROOM PRESSURE APPROACHES YOUR SIDE'S** (139.95) |
| F5 | 142.34 | L34 "The second barrier still separates that air from the outside." | Barrier 2 lights; dots stop at it | ✓ **STILL SEPARATES IT FROM THE OUTSIDE** |
| F6 | 146.23–150.06 | L35 "The opening in the first barrier hasn't created a passage through both." | Same plan, static | ✓ **NO PASSAGE THROUGH BOTH** (149.14) |
| F7 | 150.96 | L36 "That's the important distinction." | Plan dims | headline **That's the important distinction.** |
| F8 | 153.31 | L37 "The hole connects two spaces inside the window system." | Back to the cross-section: the cabin-side space and the inter-pane space outlined, linked by the hole | **CONNECTS TWO SPACES INSIDE THE WINDOW SYSTEM** |
| F9 | 157.33 | L38 "It doesn't give cabin air a clear route into the sky." | Outer pane highlights | ✓ **NO CLEAR ROUTE INTO THE SKY** |

## G · A backup (160.84–187.60)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| G1 | 161.19 | L39 "And the arrangement has another purpose: a backup." | Grid + shield icon | headline **Another purpose: a backup.** |
| G2 | 164.84 | L40 "The inner structural pane isn't just there to make the window look thicker." | Cross-section, inner pane highlighted (no flow) | ✕ **NOT JUST THERE TO MAKE THE WINDOW LOOK THICKER** (167.24) |
| G3 | 169.69–179.41 | L41 "Airbus explains that each of its two structural cabin-window panes can independently withstand the maximum pressure difference normally experienced during flight." | Both structural panes get a gold ✓ badge | source card **AIRBUS · SAFETY FIRST**: "Each of its two structural panes can independently withstand the maximum pressure difference normally experienced during flight." |
| G4 | 180.46–186.46 | L42 "If the outer pane fails, the inner pane is designed to take the pressure load and maintain cabin pressure." | Two **static** panels: **NORMALLY** (force arrows on the outer pane) · **IF THE OUTER PANE FAILS** (outer pane as a dashed ghost outline, force arrows on the inner pane). No failure motion | **DESIGNED TO TAKE THE PRESSURE LOAD** · source chip **AIRBUS** |

## H · A system with different jobs (187.60–204.23)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| H1 | 187.95 | L43 "That makes the window a system with different jobs." | Exploded 3/4 view again | headline **A system with different jobs** |
| H2 | 191.51 | L44 "One layer protects against everyday contact." | Protective panel lights | **PROTECTS AGAINST EVERYDAY CONTACT** |
| H3 | 194.88 | L45 "One normally carries the pressure load." | Outer structural pane lights | **NORMALLY CARRIES THE PRESSURE LOAD** |
| H4 | 197.61 | L46 "Another provides structural backup." | Inner structural pane lights | **PROVIDES STRUCTURAL BACKUP** |
| H5 | 200.18 | L47 "And a tiny opening helps manage the pressure between them." | Hole ring | **HELPS MANAGE THE PRESSURE BETWEEN THEM** |

## I · A naming detail (204.23–243.80)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| I1 | 204.58 | L48 "There is one naming detail that can make explanations confusing." | Grid | headline **One naming detail** |
| I2 | 209.20 | L49 "Some descriptions call the pane with the hole the 'inner pane.'" | Exploded view; pane with the hole highlighted | quote tag **"INNER PANE"** (211.91) |
| I3 | 213.10 | L50 "Others call it the 'middle pane.'" | Second tag points at the **same** pane | **"MIDDLE PANE"** (214.14) |
| I4 | 215.38 | L51 "They may be describing the same layer." | Both leaders meet on one layer | ✓ **SAME LAYER** (216.02) |
| I5 | 217.95 | L52 "'Inner' distinguishes it from the outer structural pane." | Bracket over the two structural panes; protective panel dims | **INNER · OUTER** |
| I6 | 221.71 | L53 "'Middle' counts the protective panel nearest the passenger as a third layer." | Bracket over all three, numbered 1 · 2 · 3 | **MIDDLE = 2 OF 3** (225.67) |
| I7 | 227.04 | L54 "For our illustration, we're calling them the protective panel, the inner structural pane, and the outer structural pane." | Final labels one by one | **PROTECTIVE PANEL** (229.63) · **INNER STRUCTURAL PANE** (231.07) · **OUTER STRUCTURAL PANE** (232.83) |
| I8 | 234.88 | L55 "Different aircraft can use different window designs, but that common arrangement explains the little hole many passengers notice." | Same view | **DIFFERENT AIRCRAFT CAN USE DIFFERENT WINDOW DESIGNS** · **A COMMON ARRANGEMENT** (238.97) |

## J · Outro (243.80–274.80)
| # | Time | Narration | Picture | On screen |
|---|---|---|---|---|
| J1 | 243.80–246.90 | L56 "Next time you get the window seat, look for it." | **W1** again, push toward the window; cabin ambience | **LOOK FOR IT** (245.91) |
| J2 | 246.90–252.40 | L57 "Something that initially looks like a flaw is part of a carefully arranged system." | **W2** hole close-up with ring | ✕ **LOOKS LIKE A FLAW** (248.03) → ✓ **PART OF A CAREFULLY ARRANGED SYSTEM** (249.91) |
| J3 | 252.40–261.74 | L58 "The surprising part isn't simply that the window has a hole." · L59 "It's that putting a hole in one layer helps the other layers do their jobs." | Exploded view with every layer's job | headline **One hole helps the other layers do their jobs** (259.00) |
| J4 | 261.74–265.27 | L60 "Everyday things. Surprising explanations." | Navy card (as EP001) | the two lines, word-timed |
| J5 | 265.27–274.80 | L61 "That's Why Is That?" | **WHY IS THAT?** title (words 266.00 / 266.26 / 266.47, chime 266.69); lifts at +2.2 s to leave room for YouTube end-screen elements | tagline |

---

## Opening 30-second preview (`Ep002Opening30`)
The first 30 s of the final edit: A1–A6, the title card and the start of B1. Rendered from the same
composition as the full episode, so the preview and the master can't drift apart.

## Vertical Short (`Ep002Short`, 1080×1920)
29.0 s of the same narration recording (no new voice), cut in the pauses between lines:
L03 → L10 → L11 → L24 → L28 → L61. Burned-in captions (same 42-character rule), the same
diagrams re-framed vertically, and the **Simplified illustration — not to scale.** tag kept.

| Beat | Line | Picture |
|---|---|---|
| 1 | L03 "There's a tiny hole in the window." | W2 vertical crop, gold ring on the hole |
| 2 | L10 "The tiny hole is in the inner structural pane—the middle layer in our illustration." | Exploded view (vertical), hole on the inner structural pane |
| 3 | L11 "And crucially, it doesn't go all the way through the window assembly to the outside." | Outer pane ✓ NO HOLE |
| 4 | L24 "The tiny opening connects the cabin's air pressure with that space between the structural panes." | Cross-section with airflow arrows |
| 5 | L28 "The outer pane carries the normal pressure difference between the cabin and the outside air." | Force arrows on the outer pane |
| 6 | L61 "That's Why Is That?" | Title + "Full video on the channel" |

## Thumbnail (`Ep002Thumbnail`, 1280×720)
W2 close-up framed on the lower glass, the code-drawn hole, a thick golden-yellow arrow pointing at
it, and **WHY A HOLE?** in Fredoka (white, gold "?").
