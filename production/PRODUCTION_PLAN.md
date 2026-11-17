# Why Is That? — release & production plan (v1 · 2026-11-16)

**Cadence:** main videos **Tue + Fri at 6:00 p.m. ET** · one related **Short every Sun at 12:00 p.m. ET**
**Launch:** **Tue Dec 1, 2026, 6:00 p.m. ET** with EP001, *only if* EP002 and EP003 are finished first
(two-video buffer). If either slips, launch moves to the first slot where two finished mains are banked.
**Never:** I don't upload, schedule, publish or buy anything. You schedule each finished video in
YouTube Studio. In the scheduling dialog set Eastern Time: 6:00 p.m. ET = 23:00 UTC until DST starts
Mar 14, 2027 (22:00 UTC after).

Files: `release_schedule.csv` (slots + status), `production_milestones.csv` (every dated gate, `done`
column), `why_is_that_calendar.ics` (import into any calendar), `budget_tracker.csv`, `status_report.md`.
Run `python3 scripts/plan_status.py` for buffer health, overdue gates (FLAGS) and month-to-date spend.
**Daily status check:** the scheduled task "Why Is That daily status" (`trig_01FdEWnoUziFRQpZrtD9Ciwp`)
runs `plan_status.py` read-only every day at **5:39 p.m. ET** in a fresh session on the WhyIsThat
environment. It sends a push notification that leads with **ALL CLEAR** or **ACTION NEEDED**.
It reads what's on GitHub, so push status and `done` updates for it to see them.
Regenerate dates with `python3 scripts/build_calendar.py` (keeps your `done` and `status` marks).

## 1. Buffer rule

- At every release there must be **two finished, QA-passed mains** beyond the one going out.
- Therefore EPn must pass QA by the release slot of EP(n−2). Before launch: **EP002 by Wed Nov 25,
  12:00 p.m. ET** and **EP003 by Mon Nov 30, 12:00 p.m. ET** (EP001 is done).
- Health: **GREEN** = 2+ · **AMBER** = 1 (rebuild before the next slot) · **RED** = 0 → recommend
  holding the next slot rather than rushing an unfinished video.

## 2. Main-video pipeline (F = finish-by from the calendar)

| When | Step | Owner |
|---|---|---|
| F−6 d, 6 p.m. ET | Editorial draft (narration) delivered | You |
| F−5 d | Fact-check + claim→source map, scene plan, Higgsfield prompt sheet (reuse library first) with credit preflight | Claude |
| within 24 h | Approve wording fixes + prompts | You |
| F−4 d | Assets generated (≤ 40 credits/episode), Kokoro narration voiced, cues checked | Claude |
| F−3 d | Review copy (watermarked REVIEW COPY) | Claude |
| F−2 d | Review notes | You |
| F−1 d | Revisions, final render, captions, thumbnail, description + chapters + sources, cost log | Claude |
| **F** | **QA gate → READY** (definition of done below) | Claude |
| after F | Upload + schedule in YouTube Studio for its slot | You |
| T−48 h | Go/no-go: upload complete and scheduled? | You + Claude |
| T | Release (YouTube publishes on schedule) | — |

**Definition of done:** final narration (Kokoro, approved voice) · all scenes built, no placeholder
art, no review/temp bug · `check_cues.py` clean · captions match the script word-for-word (≤ 42 chars
× 2 rows, no overlaps) · −14 LUFS ±1, true peak ≤ −1 dBTP · 1920×1080, 30 fps, BT.709 · thumbnail
1280×720 under 2 MB · every claim sourced, 🔁 items re-checked on the live page · patterns labelled
SCHEMATIC, no invented numbers, no thermal-camera look · cost logged · **your sign-off**.

## 3. Sunday Short pipeline

- Source: that week's **Tuesday** main (swap to Friday's if a stronger 60-second moment exists).
- Format: 1080×1920, ≤ 60 s, burned-in captions, SCHEMATIC tags kept, link the source video as the
  related video. Built from the same Remotion components and assets.
- **Finish-by Thu 12:00 p.m. ET**, so there's a 3-day cushion. If a Short misses its gate, skip
  that Sunday rather than post a rough cut.
- EP002 exception (owner, 2026-11-17): the EP002 Short publishes **Fri Dec 4 at 12:00 p.m. ET**, six hours before EP002, not on a Sunday.
- Cost: $0 per Short (reuses assets). One-time vertical version of the kitchen plate, ≈ 4 credits
  (≈ $0.20), before S01.

## 4. Delay policy: flag, never ship unfinished

`plan_status.py` raises these, and I report them the moment I see them:

1. **Draft late:** an editorial draft is past due. The episode's slot is filled from the buffer
   (buffer −1), or the slot is held.
2. **Approval/notes late:** I don't proceed past a gate without your sign-off.
3. **QA miss:** not READY by finish-by. The episode is LATE; the buffer shrinks, and a later finished
   episode can be swapped in.
4. **T−48 h go/no-go:** the slot's upload isn't complete and scheduled → **hold the slot**.
5. **Buffer RED at go/no-go:** recommend skipping the slot rather than rushing.
6. **Holiday slots:** Christmas Day and New Year's Day are kept; both must be uploaded and scheduled
   before the holiday (their finish-by deadlines already sit before the break).

## 5. Costs vs the $100 monthly cap

- Running costs: **$0 cash** (Kokoro, Remotion free licence for individuals, OFL fonts, code-made SFX).
- Variable cost: **Higgsfield credits** from your existing Plus allowance, valued at ≈ $0.049/credit.
  EP001 used 16 credits ($0.78). Hard cap: 40 credits per episode, and I ask before going over.
- Thresholds per month: **warn at $50 · stop and ask at $80 · never exceed $100** without approval.

| Month | Mains finishing | Shorts | Projected (typical) | Projected (ceiling) | Cash |
|---|---|---|---|---|---|
| Nov 2026 | 3 (EP001 done) | 0 | $2.35 (48 cr) | $4.70 (96 cr) | $0 |
| Dec 2026 | 9 | 4 | $7.25 (148 cr) | $17.84 (364 cr) | $0 |
| Jan 2027 | 6 (horizon) | 5 | $4.70 (96 cr) | $11.76 (240 cr) | $0 |

**Credit watch:** balance is 373.47 credits. At the ceiling, December alone would need ~364
credits. Unless the plan renews first, I'll stop and ask before the balance drops below **100
credits**. I won't top up without your approval.

## 6. Key dates (full list in the CSV / .ics)

| Date (ET) | What |
|---|---|
| Thu Nov 19, 6 p.m. | ~~EP002 editorial draft due~~ **received Nov 16 (early)** |
| Sun Nov 22 / Mon Nov 23 | ~~EP002 review copy / your notes~~ done Nov 17 (approved, no notes) |
| Tue Nov 24, 6 p.m. | **EP003 editorial draft due** (you) |
| Wed Nov 25, noon | ~~EP002 READY~~ **done Nov 17** (buffer 1) |
| Fri Nov 27 / Sat Nov 28 | EP003 review copy / your notes · EP004 draft due Sat 6 p.m. |
| Sun Nov 29, 6 p.m. | ~~EP001 go/no-go (uploaded + scheduled?)~~ done: EP001 scheduled Nov 17 |
| Mon Nov 30, noon | **EP003 READY** (buffer 2 → launch confirmed) |
| **Tue Dec 1, 6 p.m.** | **LAUNCH: EP001** |
| Thu Dec 3, noon | S01 Short READY (from EP001) |
| Fri Dec 4, noon | **EP002 Short releases** (scheduled) |
| Fri Dec 4, 6 p.m. | **EP002 releases** (scheduled) · EP004 must be READY (buffer stays 2) |
| Sun Dec 6, noon | S01 releases |
| Fri Dec 25, 6 p.m. | EP008 on **Christmas Day**: **KEEP** (decided). Upload + schedule ahead; no one works that day |
| Sun Dec 27, noon | S04 on Christmas weekend: keep; finish-by moved to Wed Dec 23 |
| Fri Jan 1, 6 p.m. | EP010 on **New Year's Day**: **KEEP** (decided). EP010 finish-by is Wed Dec 23 |

Deadlines that fell on holidays were moved to the previous day (e.g., EP010 finish-by is Wed
Dec 23).

## 7. What I need from you

1. ~~EP002 draft~~ (received) and **EP003 by Tue Nov 24, 6 p.m. ET**. Those two drafts
   gate the Dec 1 launch.
2. ~~Somewhere permanent for the project~~: done. Private repo `qmc371-rgb/WhyIsThat`.
3. ~~Confirm the EP002 upload slot~~ **confirmed: Fri Dec 4, 6 p.m. ET**; its Short publishes Dec 4 at 12:00 p.m. ET. ~~Higgsfield commercial terms~~ confirmed.
4. **Higgsfield renewal date**, for the credit watch.
5. **Upload + schedule** each READY episode in YouTube Studio before its go/no-go time.
   Done for EP001 (Dec 1, 6 p.m.), EP002 (Dec 4, 6 p.m.) and the EP002 Short (Dec 4, 12:00 p.m.), all scheduled 2026-11-17.
   Holiday episodes (EP008, EP010) should be scheduled before Wed Dec 23.
