# DIGIT.all — new website

Official website project for **DIGIT.all (Diversity & Inclusion Group In Tech for All)** at The College of New Jersey.

Live preview: https://tcnjdigitall.github.io/digitall-new-website/

**Independent of the original `TCNJDIGITall/TCNJDIGITall.github.io` repository.** Leave the original site alone until the E-Board is ready to replace it.

## Easy updates: one request covers events AND flyers

The source of truth for event cards is **`data/events.json`** (with a fallback in `js/site-data.js`). You can ask ChatGPT, with the club GitHub and school Drive connected:

> Update the DIGIT.all website for the latest events in the DIGIT.ALL Drive schedule. Check the club's Flyers folder for matching promotional images or PDFs, and update the event names, dates, descriptions, room numbers and flyer links together. Commit everything directly to `TCNJDIGITall/digitall-new-website`, without editing the old repository.

The webmaster only needs to **make one request** after the schedule or flyers change. This is a **manual update, not unattended synchronization**.

Each record in `data/events.json` can contain:

```json
{
  "date": "2026-11-04",
  "category": "Tech",
  "title": "Guess the AI Image",
  "description": "Check Instagram for announcements.",
  "status": "Planned",
  "location": "STEM 102 (planned)",
  "flyerUrl": null
}
```

- When a flyer exists and is authorized for public use, upload it to `assets/flyers/` (PDF/PNG/JPG/WebP) and set `flyerUrl` to its relative path, e.g. `assets/flyers/guess-the-ai-image.png`. Alternatively link a **publicly accessible** Google Drive file's `/view` URL.
- **Do not expose private Google Drive files or private meeting notes.** The club's shared flyers are currently access-controlled; an ordinary Drive link can fail for site visitors unless it is shared for public viewing. Copy only approved event flyers to this *public* repository.
- Event cards show an interactive detail dialog. If `flyerUrl` is missing, the dialog honestly states no official flyer is available rather than pretending to open one.
- Past dated events are hidden automatically, but the JSON retains history. Blank/canceled meetings should not be presented as upcoming events.
- Events are planning information until the E-Board confirms them. Check DIGIT.all's Instagram for any last-minute changes.

## Mailing list

The `Join our mailing list` action scrolls to a proper subscription form on the website. It submits directly to the **existing TCNJ Mailchimp endpoint recovered from the original club website**, using the original `FNAME`, `LNAME`, `EMAIL`, `MAJOR`, and `YEAR` fields. A separate tab displays Mailchimp's server response/confirmation; the website does **not** claim the subscription succeeded by itself.

If this legacy Mailchimp list is no longer managed by the club or has been deactivated, ask the current E-Board to supply the replacement form URL. Do **not** collect submitted email addresses in GitHub or in this static site.

## E-Board profiles and photos

Current leadership is listed in `js/site-data.js`. Every E-Board portrait card can be clicked to open a short profile. The current descriptions explain each **role**; they are not invented personal biographies.

To change a role description, edit the person's `bio` field. For actual approved headshots, upload JPG/PNG/WebP to `assets/eboard/` and add `photo: "assets/eboard/example-name.jpg"` to that person's entry. The cards fall back to initials when a photo is not available. Do not reuse pictures of previous-year officers.

## Project structure

- `index.html`: site structure, mailing-list form, accessible E-Board/event dialogs.
- `css/styles.css`: responsive design, text size, contrast, transitions, reduced-motion support.
- `js/site-data.js`: officer names, roles, role descriptions and photo paths; fallback event data.
- `js/app.js`: renders events/E-Board, opens dialogs, reads data, mobile navigation.
- `data/events.json`: main schedule and matching event-flyer links.
- `assets/flyers/`: future public event flyers.
- `assets/eboard/`: current officer headshots (if provided).
- `scripts/sync_drive_schedule.py`: **unused** experimental script from the earlier automatic-sync discussion. No scheduled workflow is enabled.

The website is static and hosted on GitHub Pages from the `main` branch. No paid framework or hosting service is necessary.

## Next-year handoff

The club-owned GitHub account must retain control of the repository. Give incoming webmasters appropriate repository access; keep credentials private. Review club officer names, mailing-list service, event schedule, social links and photos at the start of each school year.

## Source references

- The College of New Jersey club listing: https://computerscience.tcnj.edu/students/student-organizations/
- DIGIT.all Instagram: https://www.instagram.com/tcnjdigit.all/
- Club contact: tcnjdigit.allcs@gmail.com
- Events: club-maintained DIGIT.ALL Drive schedule and promotional flyers.

## Visual design, hover glow, and scrolling background

The vibrant aurora background and hover lighting are intentionally **separate from the main CSS and JavaScript**:

- `css/aurora.css`: blue, teal, violet, and mint gradients; gently drifting light; hover/focus effects; responsive behavior.
- `js/aurora.js`: passive scroll-based parallax and pointer-based card illumination. Uses `requestAnimationFrame` and never sends visitor coordinates anywhere.

To adjust the background, edit `css/aurora.css`. Most of the color tuning is in the `--ambient-*` palette and the section-specific gradient blocks. You can remove the aurora layer without affecting mailing list, events, or E-Board functionality by unlinking these two files from `index.html` and removing the decorative `ambient-scene` element.

Accessibility: users who prefer reduced motion see the same colors without movement. On touchscreen devices, the pointer-following glow is disabled.
