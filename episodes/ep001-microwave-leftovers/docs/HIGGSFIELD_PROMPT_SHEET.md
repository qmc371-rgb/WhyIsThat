# Why Is That? EP001 — Higgsfield prompt sheet (max 6 assets)

**Status: APPROVED and GENERATED on 2026-11-16.** All six assets passed on the first attempt.
They used **16 credits** of the 40-credit cap, with no retakes (balance 389.47 → 373.47). Assets are
in the Higgsfield project "Why Is That? — EP001 pilot", separate from Beyond the Bulkhead. Job IDs and
measured anchors are in `asset_manifest.json`. H2 variant A was chosen. Paragraph references below
were corrected to the final draft numbering (L01–L56).

## Budget for this sheet

| | Credits | ≈ USD at plan rate* |
|---|---|---|
| First pass (H1 at 4K, 2 variants of H2, 1 each of H3–H6) | ≤ 16 | ≤ $0.78 |
| Retake allowance (≤ 2 retakes per asset) | ≤ 24 | ≤ $1.18 |
| **Hard cap: I stop and ask before going over this** | **40** | **≈ $1.96** |

\* Credit price ≈ $0.049, from Plus = $49 per 1,000 credits or $59 per 1,200 credits (third-party
pricing pages, Nov 2026; check higgsfield.ai/pricing). The 2-credits-per-image figure for **Nano
Banana Pro** comes from your own account's recent transaction history. 4K may cost more: the first
H1 run will show the real charge.

## What stays in code (no Higgsfield)

These stay in code: the microwave (it needs an animated door, display, turntable and a matching
schematic cutaway), the magnetron/chamber cutaway, wave reflections, the **schematic** energy map, water-molecule
dipoles, cross-sections, conduction arrows, the spoon, the cover, standing-time and instruction
icons, every label/arrow/callout, captions, the title card and the thumbnail typography. There are
no thermal-camera looks and no measured-looking numbers anywhere.

## Shared STYLE LOCK — paste at the start of every prompt

> Flat 2D vector editorial illustration for an educational science explainer. Clean geometric
> shapes, gentle two-tone shading, softly rounded corners, no outlines, no grain or texture noise,
> not photorealistic. Strict palette: deep navy (#0B1A33, #122849, #18335E, #214175, #2C548F),
> white and off-white (#FFFFFF, #F4F7FC, #D9E2EF), golden yellow (#FFC52E, #E7A400, #FFE184).
> Warm golden-curry food tones allowed (#F2B320, #D48E12, rice #FCFBF5, chicken #EDC58C).
> Calm, friendly, uncluttered. No text, letters, numbers, logos, brand names, watermarks or
> signatures. No steam, no heat shimmer, no glow gradients, no thermal-camera or heat-map
> colours (heat and steam are animated separately in code).

## Generation order and consistency

1. **H1** first. It is the style master.
2. **H2** uses H1 as a style reference. Make 2 variants and pick one. The chosen H2 becomes the
   *identity* reference for the bowl and leftovers.
3. **H3** and **H4** use H2 (identity) + H1 (style).
4. **H5** uses H1 (style). **H6** uses H1 (style) + H4 (hand/sleeve continuity).

Model for all six: **`nano_banana_pro`** (accepts up to 14 reference images; known 2-credit cost).
Fallback for cleaner cutouts: `gpt_image_2_6` with `background: transparent` (credit cost not yet
observed; ask before switching).

Cutouts: H2, H3 and H4 are generated on a flat deep-navy (#0B1A33) background. They are then keyed
locally with `scripts/key_navy.py` ($0). Any edge halo is navy, so it disappears against our navy scenes.

Files go to `public/assets/higgsfield/` as `H#_name_v#.png`. Each one is logged in
`docs/asset_manifest.json` with prompt version, model, generation ID and credits.

---

## H1 — Kitchen background plate (the one consistent kitchen)

- **Used in:** cold open L01–L06 (wide and push-ins), L10 establishing push-in, L47 recap, close-up backdrops. Close-ups are crops of this plate.
- **Settings:** `nano_banana_pro`, aspect `16:9`, resolution `4k`, no references.
- **Prompt:**
  > [STYLE LOCK] A cozy home kitchen seen straight-on at counter height, wide 16:9 composition.
  > Upper navy cabinets with simple inset panels and small golden knobs run across the top edge;
  > below them a navy subway-tile backsplash lit by a soft golden under-cabinet light strip. A long
  > navy countertop with a pale front edge spans the full width at about 60% of the image height.
  > Keep the counter completely EMPTY across the centre-right third of the frame (a microwave will
  > be added there later) and EMPTY in the centre-left (a bowl will be added there). Far left: a
  > floating shelf with three white storage jars with golden lids. Just left of centre: a white
  > utensil crock holding a golden wooden spoon. Lower navy cabinet doors with slim golden handles
  > fill the bottom of the frame. Soft diagonal daylight falls from the upper left. Front view with
  > minimal perspective. No people, no appliances, no window scenery.
- **Accept if:** counter edge is straight and horizontal. The two empty zones are really empty.
  No text or logos. Palette is compliant. Nothing important sits within 5% of the edges (crops).
- **Est.:** 2–4 credits.

## H2 — Hero bowl of leftovers, three-quarter view (cutout)

- **Used in:** L01–L05 cold open, L07–L09 "two questions", L11 cutaway, L13 oven contrast,
  L29–L34 "the bowl", L43 covering, L52–L54 "reporting on the bowl", thumbnail.
- **Settings:** `nano_banana_pro`, aspect `4:3`, resolution `2k`, **2 variants**, reference: H1 (style).
- **Prompt:**
  > [STYLE LOCK] One round white ceramic bowl filled with leftover golden chicken curry and rice,
  > seen from a three-quarter angle about 30 degrees above the rim, centred, the whole bowl visible
  > with generous margin on every side. Smooth glossy white glaze, simple rounded profile, small
  > foot ring. Inside: a mound of white rice on the left half, a glossy pool of golden-yellow curry
  > sauce on the right half, and three or four chunks of chicken and potato, including one clearly
  > thicker chunk just right of centre. The food sits slightly below the rim. Plain flat solid
  > deep-navy background (#0B1A33) with no table, no cast shadow, no utensils and no steam.
- **Accept if:** the rim reads as a clean ellipse, roughly 3.4 : 1 wide-to-tall (this matches the
  code rig, so bubbles and labels line up). The **thick piece, pool of sauce and drier rice section**
  are all distinct (L25 needs them). The bowl is pure white, not cream.
- **Est.:** 4 credits (2 variants).

## H3 — Same bowl, top-down (cutout)

- **Used in:** L03 spoon test ("the middle"), L08 "food heats unevenly", L14, L18–L22 schematic map
  and turntable, L25–L28 regions labelled, L41–L42 stirring, L48 recap.
- **Settings:** `nano_banana_pro`, aspect `1:1`, resolution `2k`, references: chosen H2 (identity) + H1.
- **Prompt:**
  > [STYLE LOCK] The SAME white bowl of leftover golden curry and rice shown in the reference image,
  > now seen from directly above (perfect 90-degree top-down view), centred, whole bowl visible
  > with margin. Keep the same layout: rice mound on the left, glossy curry sauce on the right, the
  > same chicken and potato chunks including the thicker chunk just right of centre. The exact
  > centre of the bowl should be easy to point at. Plain flat solid deep-navy background (#0B1A33),
  > no spoon, no steam, no table texture.
- **Accept if:** it is a perfect circle (not an ellipse), the food layout matches H2, and the bowl is centred.
- **Est.:** 2 credits.

## H4 — Hands passing the hot bowl (cutout)

- **Used in:** L02 "hot enough to make you switch hands" and L46 "the bowl feeling hot isn't a
  substitute".
- **Settings:** `nano_banana_pro`, aspect `16:9`, resolution `2k`, references: chosen H2 + H1.
- **Prompt:**
  > [STYLE LOCK] Two simple stylised hands with golden-yellow sweater sleeves enter from the bottom
  > left and bottom right corners, palms up. The SAME white bowl of curry and rice from the
  > reference image is lifted just above the left palm, mid-pass toward the right hand, as if it
  > is too hot to keep holding. Friendly cartoon proportions, warm neutral skin tone, forearms
  > only: no faces, no bodies, no jewellery, no motion lines. Plain flat solid deep-navy background
  > (#0B1A33), no steam, no glow.
- **Accept if:** both hands have exactly five fingers and look natural, and the bowl matches H2. Motion
  lines and "ouch" sparks stay in code.
- **Est.:** 2 credits (hands are the likeliest retake).

## H5 — Analogy: taking turns near a heater

- **Used in:** L23–L24 ("Think of people taking turns standing near a heater…"). Code adds rotation
  arrows showing people swapping places and the qualitative "warmer / cooler" labels.
- **Settings:** `nano_banana_pro`, aspect `16:9`, resolution `2k`, reference: H1 (style).
- **Prompt:**
  > [STYLE LOCK] Four simple, friendly stylised people with no facial features (rounded shapes,
  > navy and white clothing with golden accents, varied heights and silhouettes) stand in a loose
  > circle at a safe distance around a small portable electric space heater in the centre of a
  > cozy navy living room. Only the heater's front grille glows softly golden. The two people
  > nearest the heater face it with hands held out; the two further away hug their arms as if a
  > little chilly. Side-on view, full bodies visible, clear empty space above everyone for labels.
  > No flames, no fireplace, no text, no thermal colours.
- **Accept if:** people are clearly at a safe distance from the heater, the image is readable at
  thumbnail size, and nobody looks like a real person.
- **Est.:** 2 credits.

## H6 — Analogy: judging a whole pool by touching one corner

- **Used in:** L34 ("…like judging an entire swimming pool by touching one corner").
- **Settings:** `nano_banana_pro`, aspect `16:9`, resolution `2k`, references: H1 (style) + chosen H4 (sleeve/hand).
- **Prompt:**
  > [STYLE LOCK] A large rectangular outdoor swimming pool seen from a high three-quarter angle,
  > filling most of the frame. Water in deep navy-blue tones with simple white ripple shapes, white
  > pool edging, golden-yellow ladder. In the bottom-left corner a single stylised forearm with a
  > golden-yellow sleeve and warm neutral skin tone reaches down and touches the water at the very
  > corner of the pool with one fingertip. Nobody in the pool, no faces, no text, no thermometers,
  > no colour gradients that suggest temperature.
- **Accept if:** the corner touch is unmistakable at thumbnail size, and the sleeve matches H4.
- **Est.:** 2 credits.

---

## After generation (all $0, local)

1. `tools/.venv/bin/python scripts/key_navy.py public/assets/higgsfield/H2_bowl_side_v1.png` makes the alpha cutouts.
2. I measure anchor points (rim ellipse, food centre, palm positions) into `asset_manifest.json`.
   The code rig then places bubbles, labels and arrows exactly on the art.
3. The code placeholders are swapped for the assets, and the opening is re-rendered for your review.
4. Commercial-use check: confirm Higgsfield's current terms grant commercial rights to outputs on
   your plan. I can't reach higgsfield.ai from this container to read them.
