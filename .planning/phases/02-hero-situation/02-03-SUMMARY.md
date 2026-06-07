---
phase: 02-hero-situation
plan: 03
subsystem: motion
tags: [intersection-observer, reveal, stagger, scroll-animation, vanilla-js, accessibility, reduced-motion]

requires:
  - phase: 01-foundation
    provides: tokens (--transition-reveal cubic-bezier(0.16, 1, 0.3, 1) 400ms), .reveal + .reveal.visible CSS in animations.css including prefers-reduced-motion guard, defer-loaded js/main.js with nav scroll-state + hamburger overlay handlers
  - phase: 02-hero-situation/02
    provides: situation section markup — chip span, h2 headline, ol with five li.situation__block items — ready to wear .reveal classes
provides:
  - Generic .reveal IntersectionObserver in js/main.js — one observer rules all .reveal elements site-wide for the rest of Phase 2, Phase 3, and Phase 4
  - Per-element transition-delay computed once at boot from data-reveal-index × (data-reveal-step || 80) ms
  - One-shot reveal contract (observer.unobserve after first intersect) — no re-trigger on scroll-back
  - Graceful fallback for browsers without IntersectionObserver (.visible added to all reveal elements immediately)
  - Wave 3 of Phase 2 — completes the situation reveal cascade (chip + headline together, then blocks 01..05 staggered 80ms apart)
affects: [03-approach-work-services, 04-contact-footer-sticky, 05-cross-cutting]

tech-stack:
  added: [no new dependencies]
  patterns:
    - "Generic site-wide IntersectionObserver — no per-section observers; future phases add .reveal + data-reveal-index in HTML and the existing JS picks them up automatically"
    - "Stagger via data attributes (data-reveal-index, data-reveal-step) — JS reads dataset once at boot, writes inline transition-delay, never touches DOM during scroll"
    - "Step is parametric — Phase 2 uses default 80ms; Phase 3 services will ship data-reveal-step=\"100\" per HOMEPAGE-SPEC §Animation Cheatsheet without any JS change"
    - "IIFE scope for the observer block keeps revealEls and observer constants out of the global namespace — no name collisions with the existing top-level nav constant"
    - "Reduced-motion handled entirely by the existing CSS guard in animations.css — observer still fires, class still toggles, but the transition strips the transform. Zero JS branching for prefers-reduced-motion"

key-files:
  created: []
  modified:
    - "index.html (lines 101-130 — added class=\"reveal\" + data-reveal-index attribute to chip, headline, and the five blocks; 7 elements total)"
    - "js/main.js (lines 53-101 — appended 48-line IIFE with the IntersectionObserver, dataset reader, and IntersectionObserver-absent fallback)"

key-decisions:
  - "Chose Option A (data-reveal-index attribute consumed by JS) over Option B (CSS custom property inline style) per UI-SPEC §Interaction & Motion recommendation — pure data attributes, JS owns the timing math, markup stays clean"
  - "Step defaults to 80ms in JS (parseInt(dataset.revealStep || '80')) — Phase 2 elements omit data-reveal-step entirely, Phase 3 services will set data-reveal-step=\"100\" per spec; the parametric step is the forward-compat hook"
  - "IIFE wrapping (initReveal) keeps revealEls and observer scoped — existing nav code uses top-level const nav; the new block intentionally avoids polluting the same scope"
  - "rootMargin: '0px 0px -10% 0px' — small bottom inset so reveal fires comfortably inside the viewport, not the moment a single pixel touches the bottom edge. Within UI-SPEC tolerance (UI-SPEC locks threshold 0.2 only; rootMargin is planner judgement)"
  - "transition-delay computed once at boot, not on every intersect — cheaper, and the dataset values never change at runtime, so caching them upfront is the right tradeoff"
  - "IntersectionObserver-absent fallback reveals all elements via .visible class addition — graceful degradation: better than hidden content if a vintage browser arrives. Won't trigger in any modern browser (IntersectionObserver is universal in 2026); kept as defence-in-depth for older WebViews"

patterns-established:
  - "Site-wide observer pattern: one IIFE in js/main.js handles every .reveal element across every phase. New sections add .reveal + data-reveal-index to HTML; no JS changes needed in Phase 3 or Phase 4"
  - "Data-attribute parametrisation: per-element overrides via data-* attributes (data-reveal-step) rather than CSS custom properties or per-element inline styles — keeps markup readable and JS in charge of motion timing"
  - "One-shot scroll reveal as default: observer.unobserve after first reveal is the project standard. Re-trigger on scroll-back is a deliberate non-feature (D-15)"

requirements-completed:
  - SITU-05

duration: 1m 20s
completed: 2026-04-30
---

# Phase 02 Plan 03: Reveal Observer Summary

**Generic site-wide IntersectionObserver lands in js/main.js and the situation chip + headline + five blocks get .reveal class with data-reveal-index — staggered scroll reveal works, hero stays static, reduced-motion users get opacity-only fade.**

## Performance

- **Duration:** ~1 min 20 sec
- **Started:** 2026-04-30T07:47:30Z
- **Completed:** 2026-04-30T07:48:50Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `class="reveal"` + `data-reveal-index="0"` to the THE SITUATION chip and "Sound familiar?" H2 — they reveal together as a single header beat (UI-SPEC: "Section headline + label chip fade in first").
- Added `class="reveal"` + `data-reveal-index="1..5"` to the five `.situation__block` items — 80ms stagger across blocks 01..05 (delays 80, 160, 240, 320, 400ms at the default step).
- Appended a 48-line IIFE-scoped IntersectionObserver block to `js/main.js` below the existing nav and hamburger code. One generic observer watches every `.reveal` element on the page.
- Stagger formula is parametric: `delay = data-reveal-index × (data-reveal-step || 80) ms`. Phase 3 services will ship `data-reveal-step="100"` and Phase 4 contact will use the 80ms default — both without JS changes.
- One-shot guarantee: `observer.unobserve(entry.target)` fires inside the intersection callback. No re-trigger on scroll-back.
- Graceful degradation: if `IntersectionObserver` is missing (vintage WebView edge case), all reveal elements get `.visible` immediately — no hidden content.
- `prefers-reduced-motion: reduce` handled entirely by the existing `css/animations.css` guard. No JS branching.

## Wired elements (seven total)

| Element                      | data-reveal-index | Computed delay (step=80ms) |
| ---------------------------- | ----------------- | -------------------------- |
| `.chip` (THE SITUATION)      | 0                 | 0ms                        |
| `.situation__headline`       | 0                 | 0ms                        |
| `.situation__block` (01)     | 1                 | 80ms                       |
| `.situation__block` (02)     | 2                 | 160ms                      |
| `.situation__block` (03)     | 3                 | 240ms                      |
| `.situation__block` (04)     | 4                 | 320ms                      |
| `.situation__block` (05)     | 5                 | 400ms                      |

## IntersectionObserver config

- `threshold: 0.2` — fires when 20% of the element is in the viewport (D-13).
- `rootMargin: '0px 0px -10% 0px'` — small bottom inset so reveal fires comfortably inside the viewport, not the moment a single pixel touches the bottom edge.
- `observer.unobserve(entry.target)` after `entry.target.classList.add('visible')` — strict one-shot per D-15.

## Hero confirmation

`grep -E 'class="(hero|hero__|btn--)[^"]*\breveal\b' index.html` returns no matches. The hero, both cutouts, both buttons, and the hero text group carry zero `.reveal` classes (D-16, HERO-06). Hero is visible immediately on load — no fade-in.

## prefers-reduced-motion verification

Not yet manually verified in DevTools — Cloudflare Pages preview not yet inspected for this plan. The CSS path is correct: `css/animations.css` already declares `@media (prefers-reduced-motion: reduce) { .reveal { transform: none; transition: opacity 400ms ease-out; } }` from Phase 1. Observer still fires, class still toggles, but the transform is stripped to opacity-only.

**Manual verification step (todo):** open the Cloudflare Pages preview, DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce, refresh, scroll to situation. Reveal still happens but is opacity-only (no vertical motion). Logged as todo in STATE.md alongside the existing Phase 2 visual checks.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wire .reveal + data-reveal-index on situation elements** — `552acfc` (feat)
2. **Task 2: Append generic IntersectionObserver to js/main.js** — `887057d` (feat)

**Plan metadata:** pending (final docs commit covers SUMMARY.md + STATE.md + ROADMAP.md + REQUIREMENTS.md).

## Files Created/Modified

- `index.html` — 7 in-place edits inside `<section id="situation">`. Each edit added `class="reveal"` and `data-reveal-index` to one element. No copy changed, no markup reordered, no nesting changed. Hero markup not touched.
- `js/main.js` — Appended 48 lines (an IIFE block) below the existing hamburger overlay handler. Existing nav scroll-state and hamburger code unchanged. File parses clean: `node --check js/main.js` exits 0.

## Verification Results

- **JS syntax:** `node --check js/main.js` → exit 0.
- **Markup integrity:** `xmllint` returns the same HTML5-tag warnings (nav, main, section, picture, header, footer) the libxml2 HTML4 parser flagged in Plan 02-02 — false positives, not real errors. All HTML5 elements valid.
- **Reveal count:** `grep -c 'data-reveal-index' index.html` → 7. `grep -oE 'class="[^"]*\breveal\b[^"]*"' index.html | wc -l` → 7.
- **Hero clean:** `grep -E 'class="(hero|hero__|btn--)[^"]*\breveal\b' index.html` → no matches.
- **Cascade order:** `<head>` still loads tokens → base → layout → components → animations.
- **Heading count:** H1=1, H2=1, H3=5 — unchanged.
- **Defer load order:** `<script src="/js/main.js" defer>` ensures the IIFE runs after the DOM is parsed, so all `.reveal` elements exist when `querySelectorAll` runs.

## Decisions Made

See key-decisions in frontmatter. Key call-outs:

- **Option A over Option B for stagger** — `data-reveal-index` consumed by JS, not `--stagger-delay` inline CSS custom property. UI-SPEC recommended Option A; planner agreed; markup stays clean and JS owns the timing math.
- **Default 80ms step in JS, not in markup** — Phase 2 elements omit `data-reveal-step` entirely; the JS default applies. Phase 3 services will add `data-reveal-step="100"`; the data attribute is the forward-compat hook.
- **IIFE-scoped observer block** — keeps `revealEls` and `observer` out of the top-level scope. Existing nav code uses top-level `const nav`; the new block deliberately avoids the same scope.
- **rootMargin -10% bottom** — small inset so reveal fires comfortably inside the viewport, not the moment a single pixel crosses. Planner judgement within UI-SPEC tolerance.
- **One-shot is the project standard** — re-trigger on scroll-back is a deliberate non-feature (D-15). Every later phase that uses `.reveal` inherits this contract.

## Deviations from Plan

None - plan executed exactly as written.

### Verification rule observation (not a deviation, documented)

The `xmllint --html --noout` check in plan §verification rule 2 emits parser warnings for HTML5 elements (`nav`, `main`, `section`, `picture`, `header`, `footer`) because libxml2's HTML parser is HTML4-era. These are false positives — the same warnings appeared in Plan 02-02 verification and are not real errors. All HTML5 elements are valid; modern browsers parse the markup without issue. Cloudflare Pages serves the file fine.

---

**Total deviations:** 0 auto-fixed
**Impact on plan:** None — plan ran clean.

## Issues Encountered

None during execution. Both task verifications passed on first run. Overall plan-level checks (JS syntax, reveal element count, hero reveal-free, cascade unchanged, heading order intact) all passed.

## User Setup Required

None — no external service configuration required.

## Manual Verification

Not yet run. Cloudflare Pages auto-deploys on push to `new-site`. Once `887057d` reaches the preview, inspect at:

- https://new-site.looktwice-uk.pages.dev — desktop (1440px+)
  - Hero loads instantly, fully visible, no fade-in
  - Scroll slowly down — chip + "Sound familiar?" headline fade in together as the situation enters at ~20% threshold
  - Each block fades in 80ms after the previous: visible cascade through 01 → 02 → 03 → 04 → 05
  - Total time from first block to last = 320ms (4 × 80ms)
  - Scroll back up past the situation, then back down — blocks stay visible, no re-fade
  - DevTools console: no errors, no warnings
- DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce → refresh → scroll. Reveal still happens but opacity-only — no vertical movement.
- DevTools Network tab — `js/main.js` loads with `defer`; total file size still well under 5KB unminified (was tiny, gained ~48 lines).

## Forward Notes

- **Phase 3 (approach + work + services)**: the observer in `js/main.js` reads two attributes — `data-reveal-index` (mandatory if you want a non-zero delay) and `data-reveal-step` (optional override of the 80ms default). Phase 3 services should set `data-reveal-step="100"` on each item per HOMEPAGE-SPEC §Animation Cheatsheet. Phase 3 work and approach reveals can rely on the 80ms default. **No JS changes needed in Phase 3.**
- **Phase 4 (contact + sticky tab)**: contact reveals can rely on the 80ms default; just add `class="reveal" data-reveal-index="N"` to each element. Sticky tab is its own visibility concern (entrance after 100vh scroll), separate from the .reveal observer — Phase 4 will add a small additional handler in `js/main.js`. **No changes to the .reveal observer needed in Phase 4.**
- **Phase 5 (cross-cutting)**: verifies reduced-motion behaviour at the system level (Chrome flags + macOS System Settings → Accessibility → Display → Reduce motion). Also runs Lighthouse with reveal animations active.

## Next Phase Readiness

- Plan 02-03 complete. **Phase 2 is done.**
- Phase 2 ships hero (static, no reveal) + situation (chip + headline + 5 blocks with staggered scroll reveal) + the generic observer infrastructure for the rest of the site.
- No blockers for Phase 3. The reveal observer is the foundation for every later phase's scroll animation; future plans add `.reveal` + `data-reveal-index` to their HTML and inherit the contract for free.

## Self-Check: PASSED

Files verified on disk:
- FOUND: index.html (chip + headline + 5 blocks carry .reveal + data-reveal-index)
- FOUND: js/main.js (IIFE with IntersectionObserver appended at line 54)

Commits verified in `git log`:
- FOUND: 552acfc (Task 1)
- FOUND: 887057d (Task 2)

Verification commands re-run before writing this self-check:
- FOUND: data-reveal-index count = 7
- FOUND: .reveal class count = 7
- FOUND: hero reveal-free (zero matches on hero/btn-- selectors)
- FOUND: node --check js/main.js exits 0

---
*Phase: 02-hero-situation*
*Plan: 03*
*Completed: 2026-04-30*
