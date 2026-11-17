#!/usr/bin/env python3
"""
Build the Why Is That? release + production calendar (no publishing, planning only).

Rules
  Main videos : every Tue and Fri, 18:00 America/New_York, from launch (Tue 2026-12-01).
  Shorts      : every Sun, 12:00 America/New_York, from the first Sunday after launch.
                Each Short is cut from that week's Tuesday main (swap to Friday's if better).
  Buffer      : two finished, QA-passed mains in hand at every release. EPn must be finished by
                the release slot of EP(n-2); EP002/EP003 must be finished before launch.
  Milestones  : script due F-6d · review copy F-3d · your notes F-2d · final + QA gate F
                Short finish-by = Thu 12:00 ET before its Sunday. Go/no-go check T-48h.
  Holidays    : deadlines that land on a listed holiday move to the previous day; release
                slots on a holiday are kept but FLAGGED for your decision.
Outputs: production/release_schedule.csv, production/production_milestones.csv,
         production/why_is_that_calendar.ics
"""
from __future__ import annotations

import csv
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "production"
ET = ZoneInfo("America/New_York")
LAUNCH = date(2026, 12, 1)
END = date(2027, 1, 31)
HOLIDAYS = {
    date(2026, 11, 26): "Thanksgiving",
    date(2026, 12, 24): "Christmas Eve",
    date(2026, 12, 25): "Christmas Day",
    date(2026, 12, 31): "New Year's Eve",
    date(2027, 1, 1): "New Year's Day",
    date(2027, 1, 18): "MLK Day",
}
# Pre-launch overrides (spread the load before Thanksgiving; EP001 already finished).
PRELAUNCH_FINISH = {1: datetime(2026, 11, 16, 23, 0, tzinfo=ET), 2: datetime(2026, 11, 25, 12, 0, tzinfo=ET), 3: datetime(2026, 11, 30, 12, 0, tzinfo=ET)}
EP_TOPICS = {1: "Why does reheated dinner heat unevenly? (microwave leftovers)"}
# Owner-confirmed Shorts outside the Sunday-noon rule: id -> (release ET, source episode, finished-on ET, flag).
# (The EP002 Short went into the regular S01 slot instead: Sun Dec 6, 12:00 PM ET.)
EXTRA_SHORTS: dict = {
    "S-EP003": (datetime(2026, 12, 9, 12, 0, tzinfo=ET), "EP003", datetime(2026, 11, 17, 11, 30, tzinfo=ET), ""),  # owner: Wed Dec 9, 12:00 PM ET
}


def et(d: date, hh: int, mm: int = 0) -> datetime:
    return datetime.combine(d, time(hh, mm), tzinfo=ET)


def before_holiday(dt: datetime) -> tuple[datetime, str]:
    note = ""
    while dt.date() in HOLIDAYS:
        note = f"moved off {HOLIDAYS[dt.date()]}"
        dt -= timedelta(days=1)
    return dt, note


def fmt(dt: datetime) -> tuple[str, str, str]:
    return dt.strftime("%a %Y-%m-%d"), dt.strftime("%-I:%M %p ET"), dt.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")


def main() -> None:
    OUT.mkdir(exist_ok=True)
    slots, d = [], LAUNCH
    while d <= END:
        if d.weekday() in (1, 4):  # Tue, Fri
            slots.append(et(d, 18))
        d += timedelta(days=1)
    shorts, d = [], LAUNCH
    while d <= END:
        if d.weekday() == 6:  # Sun
            shorts.append(et(d, 12))
        d += timedelta(days=1)

    schedule, milestones = [], []
    for n, slot in enumerate(slots, 1):
        ep = f"EP{n:03d}"
        if n in PRELAUNCH_FINISH:
            F = PRELAUNCH_FINISH[n]
        else:
            F = slots[n - 3]  # release slot of EP(n-2)
        F, fnote = before_holiday(F)
        flag = f"HOLIDAY SLOT ({HOLIDAYS[slot.date()]}) — KEEP: upload + schedule in advance (decided 2026-11-16)" if slot.date() in HOLIDAYS else ""
        status = "READY — awaiting your upload + scheduling" if n == 1 else "PLANNED — needs your editorial draft"
        schedule.append({"slot": fmt(slot)[0], "time": fmt(slot)[1], "utc": fmt(slot)[2], "type": "MAIN", "id": ep,
                         "topic": EP_TOPICS.get(n, "TBD (your editorial draft)"), "finish_by": f"{fmt(F)[0]} {fmt(F)[1]}",
                         "status": status, "flag": flag})
        if n == 1:
            milestones.append({"date": fmt(F)[0], "time": fmt(F)[1], "id": ep, "milestone": "Final + QA gate (done)", "owner": "Claude", "note": ""})
        else:
            for label, delta, owner in [("Editorial draft (narration) due", 6, "You"), ("Review copy delivered", 3, "Claude"),
                                        ("Your review notes due", 2, "You"), ("Final + QA gate (finish-by)", 0, "Claude")]:
                when, note = before_holiday(F - timedelta(days=delta))
                if delta == 6:
                    when = et(when.date(), 18)
                milestones.append({"date": fmt(when)[0], "time": fmt(when)[1], "id": ep, "milestone": label, "owner": owner,
                                   "note": "; ".join(x for x in (note, fnote if delta == 0 else "") if x)})
        gonogo = slot - timedelta(hours=48)
        milestones.append({"date": fmt(gonogo)[0], "time": fmt(gonogo)[1], "id": ep, "milestone": "Go/no-go: upload scheduled + complete?", "owner": "You + Claude", "note": flag})
        milestones.append({"date": fmt(slot)[0], "time": fmt(slot)[1], "id": ep, "milestone": "RELEASE (YouTube schedule, by you)", "owner": "You", "note": flag})

    for k, sun in enumerate(shorts, 1):
        sid = f"S{k:02d}"
        tue = sun - timedelta(days=5)
        src = next((s for s in schedule if s["slot"] == tue.strftime("%a %Y-%m-%d")), None)
        fin, note = before_holiday(et(sun.date() - timedelta(days=3), 12))
        flag = f"HOLIDAY WEEKEND ({HOLIDAYS[sun.date() - timedelta(days=2)]}) — keep; schedule in advance" if (sun.date() - timedelta(days=2)) in HOLIDAYS else ""
        schedule.append({"slot": fmt(sun)[0], "time": fmt(sun)[1], "utc": fmt(sun)[2], "type": "SHORT", "id": sid,
                         "topic": f"Vertical cut from {src['id'] if src else 'that week’s main'}", "finish_by": f"{fmt(fin)[0]} {fmt(fin)[1]}",
                         "status": "PLANNED", "flag": flag})
        milestones.append({"date": fmt(fin)[0], "time": fmt(fin)[1], "id": sid, "milestone": "Short final + QA gate", "owner": "Claude", "note": note})
        milestones.append({"date": fmt(sun)[0], "time": fmt(sun)[1], "id": sid, "milestone": "RELEASE Short (by you)", "owner": "You", "note": flag})

    for sid, (rel, src_id, fin, flag) in EXTRA_SHORTS.items():  # decided by the owner (e.g. same day as its main)
        schedule.append({"slot": fmt(rel)[0], "time": fmt(rel)[1], "utc": fmt(rel)[2], "type": "SHORT", "id": sid,
                         "topic": f"Vertical Short from {src_id} (owner-set date)", "finish_by": f"{fmt(fin)[0]} {fmt(fin)[1]}",
                         "status": "PLANNED", "flag": flag})
        milestones.append({"date": fmt(fin)[0], "time": fmt(fin)[1], "id": sid, "milestone": "Short final + QA gate", "owner": "Claude", "note": ""})
        gonogo = rel - timedelta(hours=48)
        milestones.append({"date": fmt(gonogo)[0], "time": fmt(gonogo)[1], "id": sid, "milestone": "Go/no-go: upload scheduled + complete?", "owner": "You + Claude", "note": flag})
        milestones.append({"date": fmt(rel)[0], "time": fmt(rel)[1], "id": sid, "milestone": "RELEASE Short (by you)", "owner": "You", "note": flag})

    prev = {}
    if (OUT / "production_milestones.csv").exists():
        with open(OUT / "production_milestones.csv", encoding="utf-8") as f:
            prev = {(r["id"], r["milestone"]): r.get("done", "") for r in csv.DictReader(f)}
    for m in milestones:
        m["done"] = prev.get((m["id"], m["milestone"])) or ("yes" if m["milestone"].startswith("Final + QA gate (done)") else "")
    prev_status, prev_rows = {}, {}
    if (OUT / "release_schedule.csv").exists():
        with open(OUT / "release_schedule.csv", encoding="utf-8") as f:
            prev_rows = {r["id"]: r for r in csv.DictReader(f)}
        prev_status = {k: v["status"] for k, v in prev_rows.items()}
        for r in schedule:  # keep topics set by new_episode.py
            old = prev_rows.get(r["id"], {}).get("topic", "")
            if old and not old.startswith("TBD"):
                r["topic"] = old
    for r in schedule:
        r["status"] = prev_status.get(r["id"], r["status"])
        old_flag = prev_rows.get(r["id"], {}).get("flag", "")
        if not r["flag"] and old_flag and not old_flag.startswith("HOLIDAY"):
            r["flag"] = old_flag  # manual flags (unconfirmed slot, before-upload checks) survive regeneration; clear them by hand
    schedule.sort(key=lambda r: r["utc"])
    milestones.sort(key=lambda r: datetime.strptime(r["date"][4:] + " " + r["time"].replace(" ET", ""), "%Y-%m-%d %I:%M %p"))
    with open(OUT / "release_schedule.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(schedule[0]))
        w.writeheader()
        w.writerows(schedule)
    with open(OUT / "production_milestones.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(milestones[0]))
        w.writeheader()
        w.writerows(milestones)

    # iCalendar (UTC times; summaries carry ET). Imports into Google/Apple/Outlook.
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    ev = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Why Is That//Production calendar//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Why Is That? production"]
    for i, m in enumerate(milestones):
        start = datetime.strptime(m["date"][4:] + " " + m["time"].replace(" ET", ""), "%Y-%m-%d %I:%M %p").replace(tzinfo=ET)
        dur = 30 if "RELEASE" in m["milestone"] else 15
        summary = f"{m['id']} · {m['milestone']} ({m['time']})"
        ev += ["BEGIN:VEVENT", f"UID:wit-{m['id']}-{i}@why-is-that.local", f"DTSTAMP:{stamp}",
               f"DTSTART:{start.astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}",
               f"DTEND:{(start + timedelta(minutes=dur)).astimezone(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}",
               f"SUMMARY:{summary}", f"DESCRIPTION:Owner: {m['owner']}. {m['note']}".rstrip(), "END:VEVENT"]
    ev.append("END:VCALENDAR")
    def fold(line: str) -> str:  # RFC 5545: lines <= 75 octets, continuation starts with a space
        out, cur, limit = [], "", 75
        for ch in line:
            if len((cur + ch).encode("utf-8")) > limit:
                out.append(cur)
                cur, limit = " " + ch, 75
            else:
                cur += ch
        return "\r\n".join(out + [cur])
    (OUT / "why_is_that_calendar.ics").write_text("\r\n".join(fold(x) for x in ev) + "\r\n", encoding="utf-8")
    print(f"{sum(1 for s in schedule if s['type']=='MAIN')} main slots, {sum(1 for s in schedule if s['type']=='SHORT')} Shorts, {len(milestones)} milestones -> production/")


if __name__ == "__main__":
    main()
