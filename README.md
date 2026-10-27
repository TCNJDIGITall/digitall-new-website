# DIGIT.all — new website (2026)

A brand-new, responsive, static website for DIGIT.all, Diversity & Inclusion Group In Tech for All, at The College of New Jersey.

**This project is independent of the current `TCNJDIGITall.github.io` repository.** Do not delete or replace the old site during development.

## Preview locally

You can open `index.html` in a browser. For a more reliable local preview, run this in the project folder:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Edit the website

- `index.html`: all main page sections, mission copy, navigation, links, and layout.
- `css/styles.css`: colors, fonts, animations, mobile layouts.
- `js/site-data.js`: **events and leadership names**. This is what future webmasters should edit each semester.
- `js/app.js`: renders the event and leadership lists and handles mobile navigation.
- `assets/favicon.svg`: simplified site icon.

When updating `js/site-data.js`, keep each event inside the `events` array and each officer inside `leadership`. Date format is `YYYY-MM-DD`. Set `status` to `Planned`, `Tentative`, or another clear, accurate status. Check that events are actually approved and announced before describing them as confirmed.

## Publish safely under the club's GitHub account

1. Sign into GitHub as `TCNJDIGITall`.
2. Create a **new public repository**, suggested name: `digitall-new-website`.
3. Upload these files and folders, preserving the directory structure. Or connect the new repository to ChatGPT's GitHub integration so edits can be committed directly.
4. In the **new** repository, select Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save. GitHub will provide a preview site, typically on a URL like `https://tcnjdigitall.github.io/digitall-new-website/`.
5. Review everything on desktop and mobile before deciding whether to replace the existing live website. **Do not change the old repo or its GitHub Pages settings during review.**

## Ownership and next-year handoff

Keep the repository under `TCNJDIGITall`, not a graduating student's account. Incoming webmaster should have appropriate GitHub repository access, verify officer names and event dates, update `js/site-data.js`, and publish changes by committing. Maintain recovery methods on the club-controlled account; don't put passwords, tokens, or private member information in the repo.

## Content notes / sources

- Mission and 2026–27 board names: https://computerscience.tcnj.edu/students/student-organizations/
- Meeting time and location: https://science.tcnj.edu/school-information/student-clubs-organizations/ (reconfirm for the current term).
- Planned Fall 2026 events: internal DIGIT.ALL Drive, `2026 Fall Event Schedule` and `2026 Fall Event Schedule.docx`. Several entries differ between drafts. **Events are labeled planned/tentative until verified.**
- Instagram: https://www.instagram.com/tcnjdigit.all/
- Contact email: `tcnjdigit.allcs@gmail.com`, supplied by club webmaster.
- Webmaster name from club webmaster; confirm the final roster before publishing.

No npm, frameworks, build process, paid services, or API keys required. Google Fonts are optional: the design uses local system font fallbacks if unavailable.
## Current E-Board photos

The site currently shows large portrait cards for all 2026–27 officers, with their names and roles. The old website has headshots of **previous** E-Board members, so those photos have deliberately not been mislabeled as the current officers.

To add official current headshots without editing page layout:

1. Collect each member's photo with their approval.
2. Upload a JPG, PNG, or WebP under `assets/eboard/` in this new repository.
3. In `js/site-data.js`, add `photo: "assets/eboard/name.jpg"` to that member's data object.
4. Commit and let GitHub Pages deploy. Failed images gracefully revert to an initials card.

The refreshed site increases small text sizes, adds hover and scroll animations, and respects `prefers-reduced-motion`.