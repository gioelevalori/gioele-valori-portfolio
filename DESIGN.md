---
name: Montaggio — Gioele Valori
description: A cinematic contact sheet for a personal developer portfolio.
colors:
  near-black: "#080808"
  off-white: "#f4f2ed"
  muted: "#a5a39e"
  line: "#343433"
  surface: "#141414"
  light-ink: "#101010"
  light-muted: "#5c5b57"
  light-line: "#cccac4"
  light-surface: "#e7e5df"
  dialog-bg: "#111111"
  dialog-fg: "#e9e9e9"
  dialog-muted: "#a3a3a3"
  dialog-line: "#ffffff24"
  dialog-accent: "#c0c0c0"
  workspace: "#ededed"
  workspace-ink: "#262626"
  workspace-column: "#e3e3e3"
  task-surface: "#fdfdfd"
  task-line: "#d4d4d4"
  workspace-metadata: "#595959"
typography:
  display:
    fontFamily: "Neue Montreal, Arial, sans-serif"
    fontSize: "clamp(96px, min(18vw, 24svh), 320px)"
    fontWeight: 450
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Neue Montreal, Arial, sans-serif"
    fontSize: "clamp(34px, 4.1vw, 68px)"
    fontWeight: 450
    lineHeight: 1.14
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Neue Montreal, Arial, sans-serif"
    fontSize: "clamp(30px, 3.1vw, 49px)"
    fontWeight: 450
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Neue Montreal, Arial, sans-serif"
    fontSize: "14px"
    lineHeight: 1.6
  label:
    fontFamily: "Neue Montreal, Arial, sans-serif"
    fontSize: "10px"
    letterSpacing: "0.06em"
rounded:
  square: "0"
  circle: "50%"
  workspace: "12px"
  column: "8px"
  task: "6px"
  field: "5px"
  pill: "30px"
spacing:
  gutter: "clamp(22px, 4.2vw, 80px)"
  gutter-mobile: "22px"
  gutter-small: "17px"
  section: "80px 0"
  section-tablet: "64px 0"
  section-mobile: "48px 0"
  project-gap: "72px"
  project-gap-tablet: "64px"
  project-gap-stack: "52px"
  project-gap-mobile: "40px"
components:
  gallery-button:
    backgroundColor: "transparent"
    textColor: "{colors.off-white}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  gallery-button-hover:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.near-black}"
  project-frame:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.square}"
    padding: "0"
    width: "100%"
  task-card:
    backgroundColor: "{colors.task-surface}"
    textColor: "{colors.workspace-ink}"
    rounded: "{rounded.task}"
    padding: "16px"
  workspace:
    backgroundColor: "{colors.workspace}"
    textColor: "{colors.workspace-ink}"
    rounded: "{rounded.workspace}"
---

# Design System: Montaggio — Gioele Valori

## Overview

**Creative North Star: “Cinematic contact sheet”**

Montaggio pairs a large two-line personal name with original project logos, staggered frames, and restrained supporting text. The current identity retains the black-and-white palette and custom GV monogram. Neue Montreal brings a regular-weight editorial voice to both the display and body text; choreographed movement supplies emphasis without adding color.

The implemented experience supports Italian and English. Real projects open dedicated case dialogs containing descriptions, features, technology context, original logos, screenshots, and external links. Spazio remains a clearly identified local task demonstration. This document describes the final cascade in `src/styles.css`, `src/demo.css`, `src/main.ts`, and `src/translations.ts`; it does not certify the unfinished numeric pixel-fidelity pipeline.

**Key Characteristics:**

- Near-black/off-white identity and original project branding.
- Regular-weight Neue Montreal with a bold compact mark.
- Non-overlapping frame rhythm and a vertical sequence below 900px.
- Optional spatial motion, visible focus, and bilingual controls.

## Colors

The shell is monochrome. Near-black is the default background, off-white the foreground and accent; muted grey separates supporting text, and darker grey marks rules and surfaces. The light theme reverses the palette using the light-ink, light-muted, light-line, and light-surface primitives. Default theme state is dark.

Project logo assets keep their own colors. CookieMakers uses its cream presentation stage; Cali al Sole uses black. Their existing brand marks are not recolored. Demo dialogs retain the neutral dialog palette in the frontmatter; the task workspace is pale grey with white task cards. Metadata uses the final `#595959` override for dates, empty states, column counts, totals, and footer; placeholder text is `#606060` at full opacity. Deletion hover feedback uses `#9e3729` as a functional state.

## Typography

**Display and body:** Neue Montreal, Arial, sans-serif. Local faces are `public/fonts/NeueMontreal-Regular.otf` (CSS weight 450), `NeueMontreal-Light.otf` (300 available), and `NeueMontreal-Bold.otf` (800). All load with `font-display: swap`. The main mark retains weight 800; headings and inherited body text use 450. Headings use natural sentence case, without uppercase transformation; proper names and technology acronyms retain their spelling.

The user-selected reference's `Dennis Sans` CSS alias identifies Neue Montreal. `public/fonts/NeueMontreal-SOURCE.txt` records the reference and asset sources; it is a provenance record, not a font license. The older Barlow asset remains in the directory but does not define the current display system.

- Hero: `clamp(96px,min(18vw,24svh),320px)`, line-height `.96`, tracking `-.04em`, second-line margin `.02em`. At 480px and below: `clamp(64px,19.5vw,100px)`, line-height `1`, tracking `-.035em`.
- Section heading: `clamp(34px,4.1vw,68px)/1.14`, tracking `-.035em`; at 600px and below `clamp(32px,7vw,45px)/1.16`.
- Project heading: `clamp(30px,3.1vw,49px)/1.12`, tracking `-.035em`; 36px at 1100px and below, 40px at 900px and below, 36px at 600px and below.
- Case heading: `clamp(46px,7.5vw,112px)/1.08`, tracking `-.035em`; at 600px and below `clamp(34px,9.5vw,54px)`.
- Contact display: `clamp(54px,9vw,140px)/1.02`, tracking `-.04em`; mobile `clamp(46px,11vw,75px)`.
- Project summary: 14px/1.7, 30ch on desktop, up to 60ch in the stacked layout, 42ch at 600px and below. Supporting project metadata is 10–11px; mobile disclosure/action labels reach 12px. Text-heavy descriptions use pretty wrapping.

## Layout

A fluid gutter surrounds the page, with a compact masthead and a name/role hero grid. Desktop projects alternate text and oversized original-logo stages. Preserve the later cascade's reserved motion space: all project top margins are zero, with 20px top/bottom row padding and 24px body padding. The project-list gap is 72px, then 64px at 1100px, 52px at 900px, and 40px at 600px. These values replace the earlier negative-margin overlap layout. Main sections use 80px vertical padding, reducing to 64px at 1100px and 48px at 600px.

Responsive thresholds are implementation-specific:

- **1700px minimum:** gutter becomes `max(70px,calc((100vw - 1600px)/2))`; the final hero clamp still governs its font size.
- **1100px maximum:** compact masthead, adjusted desktop project proportions, and reduced section spacing.
- **900px maximum:** project rows become image-first vertical stacks, 28px internal gap, 12px vertical row padding, no offsets, frame width 94%, and ratio 1.8. Body text becomes block layout with 3% inset.
- **800px maximum:** demo heading stacks, task form becomes two columns, and filters wrap.
- **700px maximum:** gutter 22px, masthead 78px, full-width menu, stacked section labels; mobile frame angle is ±2°. Hero scroll translation is zero.
- **600px maximum:** project body inset becomes zero, frame ratio 1.65, explicit action/disclosure targets are 48px high, and case stage ratio is 1.8 with a 160px minimum height.
- **550px maximum:** kanban, form, and case-study grid become single-column; search spans a row and demo footer stacks.
- **480px maximum:** hero role moves below the name with a 24px grid gap; role text is 16px, metadata 10px. Header location hides and language controls take the available space.
- **360px maximum:** gutter reduces to 17px; final 480px hero rules take precedence over older small-screen font declarations.

## Elevation & Depth

Fine rules and staggered frames establish structure. Project frames use `0 20px 60px #0003`; the demo workspace uses `0 25px 100px #0004`; tasks use `0 3px 5px #2a2a2a04`. The dialog backdrop uses `#080808dd` and a 12px blur. Keep ordinary text sections flat.

Motion follows the contact-sheet metaphor. Letters enter over 850ms with 38ms per-letter stagger (650ms duration at 700px and below); role and introduction enter over 700ms after 300ms and 500ms. On scroll the name lines separate by up to ±65px above the mobile threshold. Project scroll shift is bounded to ±36px and rotation to ±2°, updated through requestAnimationFrame only near the viewport; it is zero below 900px. Pointer tilt runs for mouse input at widths of at least 800px, with centered formula ranges approximately ±3° X and ±3.5° Y. Frames transition over 600ms; menu reveal clips over 450ms and links stagger up to 160ms. Shared project-identity view transitions last 750ms when supported.

Reduced-motion mode disables spatial animations, transitions, smooth scrolling, frame rotation/translation, title separation, and shared view transitions. Content remains visible without animation.

## Shapes

Page sections and project stages have square corners. Circular gallery arrows provide compact controls. Functional demo rounding is 12px for the workspace, 8px for columns, 6px for tasks/add buttons, 5px for fields, and pill shapes for view/close controls. Thin rules, dashed empty states, and explicit drop-target treatments communicate structure and state.

## Components

### Masthead, navigation, and language

The header keeps `gv.`, theme control, compact Menu, and IT/EN buttons. The menu is an absolute surface up to 520px wide; closed navigation is inert, its trigger exposes expanded state, and Escape closes it and returns focus. Gallery arrows are 44px square and announce selection politely.

Language buttons have a 44px minimum height, active underline, and `aria-pressed`; widths are at least 34px, or 30px below 480px. The choice persists in `gv-portfolio-language`. Interface copy, accessible labels, project descriptions, and demo status messages translate; page language, title, description, and date formatting follow the selection. Stored task-state values remain canonical Italian keys; user-entered titles remain unchanged. The CV remains Italian and is explicitly identified as such in English.

### Project stages and dialogs

Native buttons display `public/projects/cookiemakers-logo.png` and `public/projects/cali-al-sole-logo.png` without altering their original designs. Spazio uses its wordmark. Buttons open a named case dialog or the functional demo; public projects expose their external site link inside the case. Cases contain the logo, description, features, technology information, and real `cookiemakers.webp` / `cali-al-sole.webp` screenshots with descriptive alternative text. Native details/summary disclosures provide inline context.

Dialogs autofocus the close control, support Escape, lock page scrolling while open, and restore the opener's focus and prior scrolling on close. Preserve the visible close action and the screen-reader notice for external links.

### Task demo and accessibility

The demo supports adding, searching, filtering, deleting, resetting, and changing task state. Drag-and-drop has a select-based keyboard/touch alternative. Visible local-only persistence explains the session fallback; no backend is implemented. View controls expose `aria-pressed`; status feedback uses a polite live region; search, filters, state controls, and deletion actions have labels.

Preserve the skip link and 2px current-color focus outlines offset 5px. Workspace controls use a `#5c5c5c` outline offset 3px. Disabled buttons use `.45` opacity and a not-allowed cursor. Interactive meaning must remain available without hover, pointer tilt, or motion.

## Do's and Don'ts

### Do:

- **Do** retain the monochrome `gv.` identity and original project logos.
- **Do** use the final Neue Montreal cascade, regular headings, and explicit mobile font rules.
- **Do** reserve gaps for animated frames and keep stacked project margins nonnegative.
- **Do** keep both language paths, focus handling, local-demo disclosure, and reduced-motion behavior complete.

### Don't:

- **Don't** reinstate rejected ivory/cobalt/coral branding or obsolete condensed headline rules.
- **Don't** restore negative project margins that collide during motion.
- **Don't** translate stored state keys or overwrite user-entered task titles when switching language.
- **Don't** treat the source record as a font license or certify unfinished numeric fidelity gates.
### Personal monogram
An original, open-stroke GV monogram replaces the text gv. mark in the header, footer and SVG favicon. The hero uses two original folded, extruded code chevrons instead of the monogram. Opposite-phase vertical movement animates the faceted shape; reduced motion preserves a static composition. All on-page marks inherit the foreground color in either theme. Neue Montreal body and sentence-case headings remain unchanged.

### Scroll chapters
Services, profile, experience and skills pair a sticky left title with a flowing right narrative above 900px. Mobile stacks each chapter naturally. One-shot heading cuts introduce chapters; service and job entries arrive laterally, while profile paragraphs and skill groups enter quietly. Content is visible by default; reduced motion suppresses all arrivals. A thin fixed reading indicator tracks native document scroll. No scroll interception, extra scroll distance or motion dependency.

### Refresh behavior
A real browser reload clears the section fragment and starts at the introduction, before Angular initializes. Fresh direct section links and browser back/forward navigation retain native behavior. Scroll restoration is disabled only during reload initialization, then restored.

### Motion pacing refinement
Scroll arrivals use 1.25–1.5-second deceleration with small vertical movement. Text remains visible throughout, without clipping or sideways entry. Hero letters enter over 1.5 seconds without rotation, equally on mobile. Project arrival animates independent scale rather than translate, avoiding a jump when the scroll-driven offset resumes. Name parallax is bounded to 24px and code geometry floats on a 10-second cycle. Controls retain prompt feedback.

Scroll rendering avoids per-frame geometry queries across projects and no longer offsets the name or frames while scrolling. The reading indicator uses a native CSS scroll timeline where supported, with a single-style rAF fallback. Frame hover tilt and one-shot scale arrivals remain independent.
