#!/usr/bin/env python3
"""
Production status for Why Is That? (planning only: never uploads, schedules or buys).

  python3 scripts/plan_status.py [--as-of "2026-11-20 09:00"]   (times are US Eastern)

Reports buffer health, overdue gates (FLAGS), the next 7 days, and month-to-date spend vs the
$100 cap. Writes production/status_report.md. Mark progress by editing:
  production/release_schedule.csv     status: PLANNED | DRAFT RECEIVED | IN PRODUCTION | REVIEW | READY | SCHEDULED | RELEASED | HELD
  production/production_milestones.csv done: yes
"""
import argparse, csv, glob
from datetime import datetime, timedelta
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
ET = ZoneInfo("America/New_York")
CAP, WARN, STOP = 100.0, 50.0, 80.0
FINISHED = {"READY", "SCHEDULED"}

def parse_et(date_s, time_s):
    return datetime.strptime(date_s[4:] + " " + time_s.replace(" ET", ""), "%Y-%m-%d %I:%M %p").replace(tzinfo=ET)

ap = argparse.ArgumentParser()
ap.add_argument("--as-of")
a = ap.parse_args()
now = datetime.strptime(a.as_of, "%Y-%m-%d %H:%M").replace(tzinfo=ET) if a.as_of else datetime.now(ET)

sched = list(csv.DictReader(open(ROOT / "production/release_schedule.csv", encoding="utf-8")))
miles = list(csv.DictReader(open(ROOT / "production/production_milestones.csv", encoding="utf-8")))
mains = [r for r in sched if r["type"] == "MAIN"]
for r in sched:
    r["when"] = parse_et(r["slot"], r["time"])
    r["state"] = r["status"].split(" —")[0].strip().upper()

upcoming = [r for r in mains if r["when"] > now and r["state"] != "RELEASED"]
nxt = upcoming[0] if upcoming else None
finished_unreleased = [r for r in upcoming if r["state"] in FINISHED]
buffer = max(0, len(finished_unreleased) - (1 if nxt and nxt["state"] in FINISHED else 0))
health = "GREEN" if buffer >= 2 else "AMBER" if buffer == 1 else "RED"

flags = []
for m in miles:
    due = parse_et(m["date"], m["time"])
    if due < now and m.get("done", "").lower() != "yes" and "RELEASE" not in m["milestone"]:
        flags.append(f"FLAG {m['id']}: '{m['milestone']}' was due {m['date']} {m['time']} (owner: {m['owner']}) — not done")
if nxt and nxt["when"] - now <= timedelta(hours=48) and nxt["state"] != "SCHEDULED":
    flags.append(f"FLAG {nxt['id']}: go/no-go window open and status is {nxt['state']} — do NOT publish unfinished work; hold the slot or swap in a finished episode")
launch = mains[0]["when"]
if now < launch and buffer < 2:
    need = [r for r in mains[1:3] if r["state"] not in FINISHED]
    flags.append("LAUNCH GATE: launch needs a two-video buffer — " + ", ".join(f"{r['id']} READY by {r['finish_by']}" for r in need) + f"; launch {mains[0]['slot']} {mains[0]['time']} holds until then")
for r in sched:
    if r["flag"] and r["when"] > now and r["when"] - now <= timedelta(days=21):
        flags.append(f"{'NOTE' if 'KEEP' in r['flag'] or 'keep' in r['flag'] else 'DECISION'} {r['id']} {r['slot']}: {r['flag']}")

month = now.strftime("%Y-%m")
spend, credits = 0.0, 0.0
for f in glob.glob(str(ROOT / "episodes/*/docs/production_cost_log.csv")):
    for row in csv.DictReader(open(f, encoding="utf-8")):
        if row["date"].startswith(month) and row.get("status") == "spent":
            spend += float(row["total_usd"] or 0)
            if row["unit"] == "credits":
                credits += float(row["quantity"] or 0)
budget = "OK" if spend < WARN else "WARN (>=50% of cap)" if spend < STOP else "STOP — ask before any further spend (>=80% of cap)"

week = [m for m in miles if now <= parse_et(m["date"], m["time"]) <= now + timedelta(days=7)]
lines = [
    f"# Why Is That? — production status ({now.strftime('%a %Y-%m-%d %-I:%M %p ET')})",
    "",
    f"- **Next release:** {nxt['id']} {nxt['slot']} {nxt['time']} — status {nxt['state']}" if nxt else "- **Next release:** none scheduled",
    f"- **Buffer (finished mains beyond the next release):** {buffer} of 2 → **{health}**",
    f"- **Month-to-date ({month}):** ${spend:.2f} of ${CAP:.0f} cap ({credits:.0f} Higgsfield credits) → **{budget}**",
    "",
    "## Flags" if flags else "## Flags\n- none",
    *[f"- {x}" for x in flags],
    "",
    "## Next 7 days",
    *[f"- {m['date']} {m['time']} · {m['id']} · {m['milestone']} · {m['owner']}" for m in week],
]
report = "\n".join(lines) + "\n"
(ROOT / "production/status_report.md").write_text(report, encoding="utf-8")
print(report)
