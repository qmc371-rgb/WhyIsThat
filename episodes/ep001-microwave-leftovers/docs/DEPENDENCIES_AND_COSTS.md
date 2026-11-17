# Why Is That? EP001 — remaining dependencies and estimated incremental costs

## Status update — 2026-11-16 (after your approval)

| # | Item | Outcome |
|---|---|---|
| D1 | Final narration | **Kokoro-82M chosen** (Apache-2.0, $0). All 56 paragraphs voiced, same voice and pace as the approved preview |
| D2 | Higgsfield prompt sheet | **Approved and generated:** 6 assets, **16 credits** (≈ $0.78 at plan rate), 0 retakes |
| D3 | Leftovers dish | Golden curry + rice (approved with the sheet) |
| D4 | Remotion licence | **Free Licence**: you are an individual |
| D5 | Full ~4.5-min build | **Done**: `Ep001Full`, all scenes timed to the final narration |
| D6 | Durable storage | **Open**: download `out/why-is-that_ep001_final.zip`, or approve a private GitHub push |
| D7 | Re-verify FDA/USDA live pages | **Open**: marked 🔁 in SOURCES.md (hosts blocked from this container) |
| D8 | Word-level captions via Whisper | Optional; sentence-level SRT/VTT delivered |
| D9 | Higgsfield output terms for your plan | **Open**: confirm before publishing |
| D10 | YouTube synthetic-content disclosure | Check in YouTube Studio at upload. The description credits disclose the synthetic voice |

**Final cost: $0 cash, 16 Higgsfield credits (≈ $0.78) for the pilot; $0 new recurring.**
Both caps met ($10 per pilot, $100 per month). Nothing was bought or published.

---

## Original estimate (before approval)

Caps: **≤ $10 variable cost for this pilot** · **≤ $100 incremental per month**.
**Spent so far: $0.00 and 0 Higgsfield credits.** Nothing has been bought or published.

## 1. What I found (tool and integration inventory, 16 Nov 2026)

| Area | Finding | Used for the pilot? |
|---|---|---|
| Local tooling | Node 22, Remotion 4.0.539 (installed), ffmpeg 6.1, Python 3.13, ImageMagick 6, preinstalled Chrome headless shell | Yes: render, audio, QA |
| Higgsfield | Connected via MCP on your **Plus** plan, **389.47 credits**. Generation spends plan credits; **no API key or separate API credits are needed** for this route. No Higgsfield projects exist yet (nothing from Beyond the Bulkhead to collide with). | Prompt sheet only; **nothing generated** |
| Claude | This session runs under your Claude subscription. **No Anthropic API key is present, and nothing in the pipeline calls a paid AI API.** | No API use |
| vidIQ | Connected; 2,080 credits (2,000 renewable + 80 add-on). Has voiceover, thumbnail and music tools. Commercial terms not checked. | Not used |
| Picsart Media Studio | Connected (render/scene/transcribe toolkit). Credit cost not checked. | Not used |
| Composio | Connected app gateway; no connections inspected | Not used |
| Canva, Figma, Notion, Slack, other plugins | Failed to connect (proxy refused) | Not needed |
| Network from this container | npm, PyPI, apt, GitHub: **OK**. Hugging Face, remotion.dev, elevenlabs.io, higgsfield.ai, fda.gov, fsis.usda.gov: **blocked** | Worked around (see §4) |
| Credentials | Only variable *names* were listed; no values were displayed or stored | — |

Temp narration was made with **Kokoro‑82M** (Apache‑2.0 weights, run locally via kokoro‑onnx, $0).
It is not ElevenLabs. It is marked **NOT FOR PUBLICATION**, and the review bug cannot be switched off
while the timing file is flagged temporary.

## 2. Remaining dependencies

| # | Dependency | Blocks | Owner | Est. incremental cost |
|---|---|---|---|---|
| D1 | **Commercially licensed final narration.** 48 kHz WAV, either one edited file (no retakes, natural paragraph pauses) or one file per paragraph `L01.wav … L56.wav` (most reliable) | Final timing, captions, export | You | **$0–$6** (options below) |
| D2 | **Approve or edit the Higgsfield prompt sheet** (H1–H6) | Final illustrated look; thumbnail art | You → me | **16–40 credits ≈ $0.78–$1.96** at plan rate, from the existing balance, no purchase |
| D3 | **Confirm the leftovers dish.** I chose golden curry + rice: it stays on-palette and has the thick piece, pool of sauce and drier section your L25 line needs | H2/H3 prompts | You | $0 |
| D4 | **Remotion licence eligibility.** Free for individuals, for-profits with ≤ 3 employees, and non-profits. Otherwise a Company Licence is required | Commercial use of the render pipeline | You | $0, or **$25/mo per seat** if 4+ people |
| D5 | **Build the remaining ~4 min** (sections L07–L56: schematic map, turntable, molecules, cross-sections, analogies, tips, recap, outro) | Full episode | Me | $0 (code) |
| D6 | **Durable storage.** This container is ephemeral. Approve a *private* GitHub repo push, or download the folder | Losing work | You | $0 |
| D7 | Re-verify FDA/USDA wording on the live pages (blocked here; verified via search results and archived copies) | Publication | You/me | $0 |
| D8 | Optional word-level (karaoke) captions via Whisper. Needs huggingface.co allowed in this environment's network settings, or running on your machine. Sentence-level captions already work offline | Nothing (optional) | You | $0 |
| D9 | Commercial-use terms for Higgsfield outputs on your plan (couldn't fetch higgsfield.ai from here) | Publication | You | $0 |
| D10 | YouTube altered/synthetic-content disclosure. Stylised animation is likely not covered, but confirm in YouTube Studio at upload, especially if the final voice is synthetic | Upload | You | $0 |

### D1 options for final narration

| Option | Licence | Incremental cost | Notes |
|---|---|---|---|
| **A. Record it yourself** | Yours | **$0** | Any decent mic in a quiet room; per-paragraph takes make alignment trivial |
| **B. ElevenLabs Starter (paid)** | Commercial licence included on paid tiers | **≈ $6** for one month (≈ $5/mo if billed yearly) | Script is ~3,600 characters, far inside the monthly allowance. The free tier is excluded, as you specified. Needs your purchase approval |
| **C. Kokoro‑82M (the temp voice)** | Apache‑2.0 weights permit commercial use | **$0** | Your quality call. The model card says some training audio was synthetic, so decide whether you're comfortable |
| D. Human VO marketplace | Per contract | Usually > $10 for ~4.5 min | Over the pilot target |

## 3. Cost roll-up

| Scenario | Pilot variable cost | Recurring per month |
|---|---|---|
| A or C narration + Higgsfield assets | **≈ $0.78–$1.96** in plan credits (≈ $0 cash) | **$0** |
| B (ElevenLabs Starter) + Higgsfield assets | **≈ $6.78–$7.96** | **$6** (or $5 annual), or $0 if cancelled |
| Worst case: B + one Remotion seat | ≈ $7.96 + $25 seat | **≈ $31** |

All scenarios are under the **$10 pilot** and **$100/month** caps. Higgsfield credits are valued at
≈ $0.049/credit (Plus: $49 per 1,000 or $59 per 1,200 credits, per third-party pricing pages). This is
conservative accounting, because they come from your existing subscription allowance. Re-check
vendor prices before any purchase; they were sourced from third-party pages dated Aug–Nov 2026.

## 4. Workarounds already in place (all $0)

- Remotion can't download its own Chrome here, so it renders with the preinstalled headless shell (`remotion.config.ts`).
- Hugging Face is blocked, so Kokoro model files were fetched from the kokoro-onnx GitHub release.
- Alignment uses an offline pause-anchored aligner (`scripts/align_narration.py`), tested on the temp
  track: max line-boundary error **70 ms**, mean **42 ms**.
- Sound effects are synthesised in code (`scripts/make_sfx.py`), so there is nothing to license.
- Fonts: Fredoka and Inter under SIL OFL 1.1, bundled locally (licences in `public/fonts/`).
