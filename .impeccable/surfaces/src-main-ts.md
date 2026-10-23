---
version: 1
slug: "src-main-ts"
primary_target: "src/main.ts"
related_targets: ["src/styles.css","src/demo.css"]
---

# Portfolio redesign — Montaggio

Mode: Experience. Scope: Angular portfolio home and existing sections, navigation, and frontend demo presentation.

## Direction contract

THESIS: A cinematic contact sheet makes Gioele's identity and real work the page structure. Replace the former spatial gallery and card system; preserve personal introduction before projects.

OWN-WORLD: Near-black #080808, off-white #f4f2ed, neutral grey type; self-hosted Neue Montreal for headings and body, explicitly requested from the Dennis Snellenberg reference, rectangular imagery, fine monochrome controls. No lime accents or ornamental grid.

STORY: Meet Gioele, explore CookieMakers and Cali al Sole, try the Spazio frontend demo, then inspect services, experience, skills and contacts. Keep CV, LinkedIn, email and existing anchors.

FIRST VIEWPORT: Compact GV/Menu masthead; large two-line GIOELE / VALORI name occupying the left, role on the right, a concise personal introduction underneath, then the first oversized project frame. Subsequent work alternates alignment and image angle with reserved motion space; projects stack below 900px and mobile text uses one column.

FORM: User-selected B original, center column of `.impeccable/mocks/decision/montaggio-board.png`. Confirmed in user message “proviamo il primo” after B/B2/B3 comparison. Seed reference seed:90fe2c969d2e2874. Project screenshots are the real supplied assets, replacing illustrative generated project previews; UI labels and data remain semantic HTML.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Verification

Angular production build succeeds. Browser checks at 320, 390, 768, 1280 and 1440 px show no horizontal overflow or failed resources. Menu Escape/focus and links, themes, project selection/details, CV, and Spazio task creation/state/search/persistence/deletion pass. Review screenshots are in `.impeccable/review/screenshots/`.

Automatic pixel-fidelity phase gates have not been completed; no claim of numeric fidelity is made. Independent visual review must distinguish the selected center panel from the two unselected columns.
