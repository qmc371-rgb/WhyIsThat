# EP002 — Higgsfield prompt sheet (Why Is There a Tiny Hole in Airplane Windows?)

**Status: AWAITING APPROVAL — nothing generated.** The brief allows at most **4 new** assets, for
illustrative cabin/window imagery only. Every diagram (layers, hole, arrows, labels) is drawn in
code. Cost preflight on Nano Banana Pro: 2 credits per 2K image, 4 credits per 4K image
(≈ $0.049/credit). Balance before EP002: 373.47 credits.

| | Asset | Settings | Credits | ≈ USD | Used in |
|---|---|---|---|---|---|
| W1 | Passenger in a window seat | 16:9, 2K, refs: EP001 H1 (style) + H4 (sleeve) | 2 | $0.10 | L01–L02, L56, Short |
| W2 | Window close-up from the seat (no hole: the hole is drawn in code) | 16:9, **4K**, ref: H1 | 4 | $0.20 | L02–L06, L56–L57, thumbnail, Short |
| W3 | Generic airliner climbing above clouds, window row visible | 16:9, 2K, ref: H1 | 2 | $0.10 | L13, L16–L18, Short |
| (W4) | *Reserve:* vertical window close-up, only if W2 crops badly for the Short | 9:16, 2K | (2) | ($0.10) | Short |
| | **Planned total** | | **8** | **≈ $0.39** | EP002 cap: $10 |

Retakes are allowed only within EP002's $10 cap, and I stop and ask before passing 40 credits.

## STYLE LOCK (same as EP001, pasted at the start of every prompt)
> Flat 2D vector editorial illustration for an educational science explainer. Clean geometric
> shapes, gentle two-tone shading, softly rounded corners, no outlines, no grain, not
> photorealistic. Strict palette: deep navy (#0B1A33, #122849, #18335E, #214175, #2C548F), white
> and off-white (#FFFFFF, #F4F7FC, #D9E2EF), golden yellow (#FFC52E, #E7A400, #FFE184). Calm,
> friendly, uncluttered. No text, letters, numbers, logos, airline liveries, brand names,
> watermarks or signatures.

## W1 — Passenger in a window seat
> [STYLE LOCK] Inside a modern passenger airplane cabin, side view of one window seat. A friendly
> stylised passenger with no facial features, wearing a golden-yellow sweater (same style as the
> reference hands), leans slightly toward the oval cabin window, curious. Through the window:
> part of a wing and soft clouds in a navy-and-gold dusk sky. Simple navy seats and white cabin
> sidewall. Generous empty space on the right for labels. No text, no logos, no other passengers'
> faces.

## W2 — Window close-up from the seat
> [STYLE LOCK] Close-up of a single oval airplane cabin window seen straight-on from the
> passenger's seat, filling most of the frame: white sidewall trim around a rounded window
> reveal, a clear window with soft reflections suggesting more than one layer of glass. Through
> it: a wing tip and clouds in a navy-and-gold sky. The window glass is completely clean and
> unmarked: **no holes, dots, scratches, frost or droplets** (details are added later in code).
> Centred, with margin on all sides. No text, no logos.

## W3 — Airliner climbing above clouds
> [STYLE LOCK] A generic twin-engine passenger airliner climbing gently above a sea of clouds,
> side three-quarter view, a neat row of oval cabin windows clearly visible along the white
> fuselage, navy sky fading to soft gold near the horizon. Plain white aircraft with no livery,
> no markings, no logos and no registration letters. Aircraft on the left two-thirds, open sky
> on the right for labels.

## After generation (local, $0)
Download into `public/assets/higgsfield/ep002/`, log job IDs and credits in `asset_manifest.json`
and `production_cost_log.csv`, and measure the window centre/size in W2 so the code-drawn hole
and arrow land on the correct layer.
