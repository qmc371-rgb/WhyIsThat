# EP001 source list: claim → source

Status key: ✅ supported by the source as found · 🔁 re-check the live page before publishing (the
host is blocked from this container; checked via search results and archived copies).
Line numbers refer to paragraphs of `narration/editorial_draft_v1.txt` (L01–L56).

## Sources

1. **U.S. FDA — "Microwave Ovens"** (Radiation-Emitting Products). 🔁
   https://www.fda.gov/radiation-emitting-products/resources-you-radiation-emitting-products/microwave-ovens
   (legacy URL: https://www.fda.gov/Radiation-EmittingProducts/ResourcesforYouRadiationEmittingProducts/ucm252762.htm)
2. **U.S. FDA Consumer Update (2007), archived:** https://webarchive.library.unt.edu/eot2008/20080923231839/http:/www.fda.gov/consumer/updates/microwave112107.html
   and FDA "Microwave Oven Radiation" snapshot: https://public4.pagefreezer.com/content/FDA/02-11-2021T10:11/https://www.fda.gov/node/361839
3. **USDA FSIS — "Cooking with Microwave Ovens".** 🔁
   https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/cooking-microwave-ovens
   Archived fact sheet: https://webarchive.library.unt.edu/web/20120915114427/http:/www.fsis.usda.gov/PDF/Microwave_Ovens_and_Food_Safety.pdf
4. **TU Delft, "Show the Physics" demo 15.15 — Hot spots in the microwave.**
   https://interactivetextbooks.tudelft.nl/showthephysics/demos/demo49/demo49.html
5. **Yale National Initiative curriculum unit (standing waves / microwave hot spots).**
   https://teachersinstitute.yale.edu/curriculum/units/2020/2/20.02.04/12
6. **Vadivambal, R. & Jayas, D. S. (2010).** Non-uniform temperature distribution during microwave
   heating of food materials — a review. *Food and Bioprocess Technology* 3, 161–171.
   https://doi.org/10.1007/s11947-008-0136-0 (full text not read here; summary-level support only 🔁)
7. **Virginia Tech Extension, FST-324 (microwave cooking).**
   https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/FST/FST-324/FST-324.html
8. **Health Physics Society, "Microwave Ovens"** (quotes FDA on "inside out").
   https://hps.org/hpspublications/articles/microwaveovens.html

## Claim map (narration line → source)

| Line(s) | Claim in the draft | Sources | Status |
|---|---|---|---|
| L01–L05 | Scenario (two minutes, hot bowl, cold middle) | Everyday scenario, not a factual claim. FSIS (3) confirms uneven heating and cold spots happen | ✅ |
| L11 | A magnetron produces the microwaves | FDA (1, 2); VT (7) | ✅ |
| L11 | Waves reflect off the metal walls and interact with the food | FDA (2): reflected within the metal interior, absorbed by food | ✅ |
| L12 | Water molecules respond to the changing electric field; energy is absorbed and becomes heat | FDA (2): waves make water molecules vibrate, producing heat. Review (6) on dielectric heating | ✅ |
| L13–L14 | Not hot air; not heating every part equally | FSIS (3): uneven heating and cold spots | ✅ |
| L15–L17 | Uneven map; reflected waves overlap to help create the pattern | TU Delft (4); Yale (5); review (6) | ✅ |
| L18 | "Our animation makes stronger regions bright… Real patterns are more complicated, and the food itself changes them" | Review (6): load and geometry affect field and heating. **Shown on screen with the SCHEMATIC tag** | ✅ 🔁 |
| L20–L22 | Turntable moves food through regions; helps but doesn't guarantee uniformity | TU Delft (4) (turntable leaves hot/cold bands); FSIS (3) (stir even with a turntable) | ✅ |
| L23–L24 | Heater analogy | Analogy, no source needed | — |
| L26–L28 | Thick piece / sauce / drier section respond differently; composition, shape and heat conduction matter; bite-to-bite differences | Review (6); VT (7) (food components affect evenness) | ✅ 🔁 |
| L30 | Microwave-safe containers can become hot as heat moves into them from the food | FDA (1): containers "can become hot from the heat of the food cooking inside" | ✅ |
| L31–L34 | A hot bowl shows heat reached the container, not that the whole meal is evenly hot; pool analogy | Follows from L30 + FSIS (3) (use a food thermometer, standing time) | ✅ |
| L36 | Microwaves don't simply cook thick food from the inside out | FDA (2); HPS (8) | ✅ |
| L37–L39 | Energy heats regions it reaches; heat spreads by conduction; middle catching up | FDA (1): thick foods' outer layers heated mainly by microwaves, inside mainly by conduction | ✅ |
| L41–L46 | Stir when instructed; covering and standing time; follow package and manual incl. temperature checks | FSIS (3) | ✅ 🔁 |

### Editorial notes (no changes required)

- **L30:** some dishes (certain glazes or paints) can also absorb microwave energy directly. The line
  says "can become hot as heat moves into them from the food", which is accurate as written.
- **L36:** "simply" is doing useful work. Foods with a wetter centre (e.g., pie filling) can appear to
  cook inside-out, so keep the hedge.
- The video states **no specific temperatures, depths or times** beyond the "two minutes" scenario.
  Every energy pattern and warmth shading is labelled **SCHEMATIC**, and nothing imitates
  thermal-camera footage.

## Production and licensing references

- Narration: Kokoro-82M (Apache-2.0), approved by the channel owner as final narration on 2026-11-16.
  https://huggingface.co/hexgrad/Kokoro-82M · kokoro-onnx (MIT): https://github.com/thewh1teagle/kokoro-onnx
- Illustrations H1–H6: Higgsfield (Nano Banana Pro), see `asset_manifest.json`. Commercial terms confirmed by the owner (2026-11-17).
- Remotion licence: `node_modules/remotion/LICENSE.md` (4.0.539). Free Licence applies (individual creator).
- Fonts: Fredoka, Inter (SIL OFL 1.1): licence files in `public/fonts/`
- Sound effects: synthesised in code (`scripts/make_sfx.py`)
