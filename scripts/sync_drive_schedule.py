#!/usr/bin/env python3
"""Sync DIGIT.all events from a Google Doc's Published-to-web HTML.

The original Google Doc stays the source of truth. Never scrape a private
document or put Google login credentials in this repository.

Usage: python3 scripts/sync_drive_schedule.py
"""
import datetime as dt
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.request import Request, urlopen
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / "config" / "schedule-source.json"
OUTPUT = ROOT / "data" / "events.json"
DATE_RE = re.compile(r"^\s*(\d{1,2})/(\d{1,2})/(\d{2,4})\s*$")


class TableReader(HTMLParser):
    """Read rendered <table> data, including nested formatting tags in cells."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.rows = []
        self.in_row = False
        self.cell_depth = 0
        self.current = []
        self.cell_parts = []

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.in_row = True
            self.current = []
        elif tag in ("td", "th") and self.in_row:
            self.cell_depth += 1
            if self.cell_depth == 1:
                self.cell_parts = []
        elif tag == "br" and self.cell_depth:
            self.cell_parts.append(" ")

    def handle_data(self, data):
        if self.cell_depth:
            self.cell_parts.append(data)

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.in_row and self.cell_depth:
            self.cell_depth -= 1
            if not self.cell_depth:
                text = " ".join("".join(self.cell_parts).split())
                self.current.append(text)
        elif tag == "tr" and self.in_row:
            if self.current:
                self.rows.append(self.current)
            self.in_row = False


def get_date(value):
    match = DATE_RE.match(value.strip())
    if not match:
        return None
    month, day, year = map(int, match.groups())
    if year < 100:
        year += 2000
    try:
        date = dt.date(year, month, day)
    except ValueError:
        return None
    return date.isoformat() if 2024 <= year <= 2100 else None


def clean_title(text):
    text = " ".join(html.unescape(text).split())
    # Correct a common typo in the Fall 2026 planning schedule.
    text = re.sub(r"\bDistress\b", "De-stress", text, flags=re.I)
    return text


def category(title):
    lowered = title.lower()
    if any(k in lowered for k in ("security", "cyber", "coding", "ai ", "computer", "pc building")):
        return "Tech"
    if any(k in lowered for k in ("competition", "challenge", "jeopardy", "bingo", "guess")):
        return "Challenge"
    return "Community"


def events_from_rows(rows):
    events = []
    seen = set()
    for cells in rows:
        if len(cells) < 2:
            continue
        date = get_date(cells[0])
        title = clean_title(cells[1])
        if not date or not title:
            continue
        if any(word in title.lower() for word in ("cancelled", "canceled", "no meeting", "thanksgiving break")):
            continue
        # Do not publish the planning table's "Debrief" column. It can include
        # internal funding, prizes, and organizer notes not meant as announcements.
        room = " ".join(cells[2].split()) if len(cells) > 2 else ""
        if re.fullmatch(r"STEM\s*102", room, flags=re.I):
            room = "STEM 102"
        status = "Tentative" if "?" in title or "maybe" in title.lower() else "Planned"
        display_title = title.strip(" ?")
        key = (date, display_title.lower())
        if key in seen:
            continue
        seen.add(key)
        events.append({
            "date": date,
            "category": category(display_title),
            "title": display_title,
            "description": "Event details are being finalized." if status == "Tentative" else "Check Instagram for any updates or changes.",
            "status": status,
            "location": (room + " (planned)") if room else "Location TBA",
        })
    return sorted(events, key=lambda x: (x["date"], x["title"]))


def fetch_html(url):
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.hostname != "docs.google.com" or not re.search(r"/document/d/(?:e/)?[^/]+/pub(?:$|[?])", parsed.path + ("?" if parsed.query else "")):
        raise ValueError("Please configure a Google Docs Published-to-web /pub URL, not a private /edit link.")
    req = Request(url, headers={"User-Agent": "DIGIT.all event calendar sync/1.0"})
    with urlopen(req, timeout=35) as resp:
        if resp.status != 200:
            raise ValueError("Google Doc returned HTTP " + str(resp.status))
        document = resp.read(5_000_001)
    if len(document) > 5_000_000:
        raise ValueError("Published document is unexpectedly large.")
    return document.decode("utf-8", errors="replace")


def main():
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    url = cfg.get("published_url", "").strip()
    if not url:
        print("Schedule sync not activated. Publish the existing Google Doc and set published_url in config/schedule-source.json.")
        return 0
    parser = TableReader()
    parser.feed(fetch_html(url))
    events = events_from_rows(parser.rows)
    if not events:
        raise ValueError("No dated events found in published document. Existing data will be preserved.")
    old = {}
    if OUTPUT.exists():
        old = json.loads(OUTPUT.read_text(encoding="utf-8"))
    if old.get("events") == events:
        print("No event changes; synced " + str(len(events)) + " schedule rows.")
        return 0
    result = {
        "source": "2026 Fall Event Schedule — DIGIT.all Drive",
        "source_url": url,
        "synced_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        "events": events,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Updated " + str(len(events)) + " events from the published Google Doc.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as err:
        print("Schedule sync failed; existing event data has not been overwritten: " + str(err), file=sys.stderr)
        sys.exit(1)
