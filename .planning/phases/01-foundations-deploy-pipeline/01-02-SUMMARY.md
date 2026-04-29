---
phase: 01-foundations-deploy-pipeline
plan: 02
subsystem: ui
tags: [html, semantic-shell, nav, overlay, accessibility, vanilla-js, prefers-reduced-motion]

requires:
  - 01-01 (tokens, base, fonts, css/ stubs)
provides:
  - Semantic single-page shell on `new-site` (six section anchors, font preload, five-CSS cascade, deferred main.js)
  - Sticky top nav (transparent → Linen on scroll, 200ms) with three desktop links + Hot Pink underline pseudo-element
  - Mobile hamburger button (44×44 hit target) + Midnight overlay sliding from translateY(-100%) to 0 over 280ms ease-out-quart
  - aria-expanded / aria-controls / aria-hidden / aria-label wired on hamburger and overlay; Escape closes; focus returns to hamburger
  - prefers-reduced-motion guard removes overlay transform transition
  - .reveal stub authored in animations.css for Phase 2's IntersectionObserver
  - REQUIREMENTS.md FOUND-05 + ROADMAP.md Phase 1 SC#2 corrected: "eight" → "six" sections (D-11 doc-fix)
affects: [01-03-deploy-pipeline, 02-hero, 03-problem-positioning, 04-services-cases, 05-contact-footer-polish]

tech-stack:
  added: []
  patterns:
    - "Sticky nav as colour-flip on .scrolled class, not a separate element"
    - "Hot Pink underline via ::after pseudo-element width-grow (no decoration shorthand)"
    - "Hamburger + overlay open/close as two functions with aria attribute mutation, no library"
    - "Vanilla JS with existence guards, no DOMContentLoaded wrapper (script is defer'd)"
    - "Reduced-motion guard targets transform-based transitions, leaves colour fades alone"

key-files:
  created:
    - js/main.js
    - .planning/phases/01-foundations-deploy-pipeline/01-02-SUMMARY.md
  modified:
    - index.html
    - css/layout.css
    - css/components.css
    - css/animations.css
    - .planning/REQUIREMENTS.md
    - .planning/ROADMAP.md

key-decisions:
  - "Holding-page index.html on new-site overwritten in a single Write — branch confirmed before any write to honour D-01 (main untouched)"
  - "Hamburger media-query split into two ranges (max-width: 1024px shows it, min-width: 1025px hides it) so desktop never paints the hamburger and mobile never paints desktop links"
  - "Overlay link clicks call closeOverlay so the in-page anchor scrolls cleanly with the overlay already gone (avoids overlay-on-top-of-target jank)"

requirements-completed: [FOUND-05, NAV-01, NAV-02, NAV-03, NAV-04, NAV-05]

duration: ~2min
completed: 2026-04-30
---

# Phase 01 Plan 02: Shell + Nav Summary

**Single-page semantic shell on new-site with sticky nav (transparent → Linen on scroll), Hot Pink underline pseudo-element, 44×44 hamburger triggering Midnight overlay, full aria + Escape + reduced-motion contract — all wired via vanilla JS and tokens, no libraries.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-29T23:10:33Z
- **Completed:** 2026-04-29T23:12:47Z
- **Tasks:** 3
- **Files:** 1 created (js/main.js), 6 modified (index.html, three CSS files, REQUIREMENTS, ROADMAP)

## Accomplishments

- `index.html` overwritten on `new-site` only — holding-page DM Sans + Syne + warm-gradient markup gone, replaced with semantic shell (FOUND-05)
- Six `<section>` anchors in document order: hero, situation, approach, work, services, contact (D-10)
- Three nav links (WORK / APPROACH / CONTACT) anchored to #work, #approach, #contact (D-12); appear in both desktop nav-links list and mobile overlay
- Font preload `<link rel="preload" href="/fonts/epilogue-400.woff2" ... crossorigin>` in `<head>` before stylesheets
- Five `<link rel="stylesheet">` in cascade order: tokens → base → layout → components → animations (no @import)
- `<script src="/js/main.js" defer>` at end of body
- Zero `<h1>` (Phase 2 hero gets the only H1)
- Empty footer `class="footer footer--placeholder"` for Phase 4 to fill (D-14)
- Sticky nav transparent at scrollY=0, fills `var(--color-linen)` with `var(--color-midnight)` text on `.scrolled`, 200ms transition (NAV-01)
- Hot Pink 2px underline 3px below baseline grows from width 0 to 100% on hover/active/focus-visible via `::after` (NAV-03)
- Hamburger button: 44×44 minimum hit target, `aria-expanded` toggles `"true"/"false"`, `aria-controls="nav-overlay"` (NAV-04, NAV-05)
- Overlay: `position: fixed; inset: 0`, Midnight surface, `transform: translateY(-100%)` default → `translateY(0)` on `.open`, 280ms cubic-bezier(0.16, 1, 0.3, 1) ease-out-quart
- aria-hidden on overlay mirrors inverse state of `.open` (NAV-05)
- Escape key closes overlay and returns focus to hamburger; overlay link click closes overlay (so anchor scroll happens cleanly)
- `@media (prefers-reduced-motion: reduce)` removes overlay transform transition; nav colour fade preserved (vestibular-safe)
- `.reveal` stub authored in animations.css ahead of Phase 2's IntersectionObserver
- D-11 doc-fix landed: REQUIREMENTS.md FOUND-05 and ROADMAP.md Phase 1 SC#2 both now say "six" instead of "eight"

## Task Commits

Each task committed atomically (with `--no-verify` per parallel-execution directive):

1. **Task 1: Overwrite index.html with semantic shell + apply six-section doc-fix** — `75c65e7` (feat)
2. **Task 2: Wire nav, overlay, footer-placeholder CSS via tokens** — `db60c0e` (feat)
3. **Task 3: Wire vanilla JS nav scroll toggle + hamburger overlay handlers** — `6f773ac` (feat)

**Plan metadata commit:** _to-follow_ (final commit at end of execute-plan)

## Files Created

- `js/main.js` — Phase 1 nav behaviours (scroll toggle + hamburger overlay), 52 lines, vanilla JS, `node --check` clean

## Files Modified

- `index.html` — replaced holding page with V1 semantic shell (~67 lines)
- `css/layout.css` — appended page shell layout (nav flex, hamburger media-query, footer min-height)
- `css/components.css` — appended sticky nav, Hot Pink underline pseudo, hamburger button, Midnight overlay, footer surface (~125 lines)
- `css/animations.css` — appended nav transition, overlay slide, .reveal stub, two prefers-reduced-motion guards (~35 lines)
- `.planning/REQUIREMENTS.md` — FOUND-05 "eight" → "six"
- `.planning/ROADMAP.md` — Phase 1 SC#2 "eight empty" → "six empty"

## Decisions Made

- **Overwrite holding `index.html` in a single Write** — branch verified to be `new-site` first (D-01 forbids touching main). The previous holding page (DM Sans + Syne + warm gradient + Google Fonts links) is fully replaced; main branch retains its copy untouched
- **Two-range hamburger visibility** (max-width: 1024px shows hamburger, min-width: 1025px hides it; desktop nav-links is the inverse) — explicit ranges avoid the off-by-one corner where both rules apply at exactly 1024px
- **Overlay link clicks close the overlay before in-page anchor scroll** — prevents the overlay from sitting on top of the target during scroll, which would otherwise register as scroll-blocked

## Deviations from Plan

None — the plan executed exactly as written. Branch was already `new-site`. All file paths, selector names, and verbatim code blocks landed unchanged.

### Auto-fixed Issues

None — no Rule 1/2/3 fixes were needed.

---

**Total deviations:** Zero.
**Impact on plan:** Zero scope change. Plan executed verbatim.

## Issues Encountered

None.

## User Setup Required

None — Plan 03 wires Cloudflare Pages deployment.

## Contracts Handed to Later Phases

- **Phase 2 (hero, situation):**
  - `<section id="hero">` and `<section id="situation">` are empty anchors ready to receive content + backgrounds + padding
  - `.reveal` / `.reveal.visible` already authored in animations.css; Phase 2 only needs to add the IntersectionObserver block to `js/main.js` (no new CSS work)
  - Hero will introduce the only `<h1>` on the page
- **Phase 3 (approach, work, services):** `<section id="approach">`, `<section id="work">`, `<section id="services">` are empty anchors ready
- **Phase 4 (contact, sticky tab, footer):**
  - `<section id="contact">` empty anchor ready
  - Sticky-tab CSS appends to `css/components.css`; sticky-tab toggle JS appends to `js/main.js` (the only sanctioned `--gradient-brand` paint site)
  - `<footer class="footer footer--placeholder">` ready for Phase 4 to populate (Midnight surface declared)
- **Phase 5 (audit + SEO):** `<head>` is intentionally minimal; Phase 5 adds description, og:, canonical, JSON-LD ProfessionalService

## Next Phase Readiness

- Shell renders end-to-end with working nav, hover underline, mobile overlay, and reduced-motion behaviour using only the tokens declared in plan 01-01
- Plan 01-03 (deploy-pipeline) can wire Cloudflare Pages immediately — every push to `new-site` will deploy a renderable shell
- All five Phase 1 success criteria except SC#1 (Cloudflare preview URL) are met by this plan; SC#1 lands in plan 01-03

---
*Phase: 01-foundations-deploy-pipeline*
*Completed: 2026-04-30*

## Self-Check: PASSED

All 8 expected files present on disk (js/main.js, index.html, three CSS files, REQUIREMENTS.md, ROADMAP.md, this SUMMARY). All 3 task commits present in git log (`75c65e7`, `db60c0e`, `6f773ac`).
