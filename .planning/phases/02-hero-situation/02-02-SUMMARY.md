---
phase: 02-hero-situation
plan: 02
subsystem: ui
tags: [situation, linen, chip, css-grid, staggered-grid, ordered-list, responsive, vanilla-css]

requires:
  - phase: 01-foundation
    provides: tokens (--color-linen, --color-midnight, --color-hot-pink, --text-headline/title/body/label, --space-section/lg/md, --radius-pill, --measure), base reset including ol[role='list'] { list-style: none }, semantic shell with empty <section id="situation">
  - phase: 02-hero-situation/01
    provides: Phase 2 hero block already appended to css/components.css and css/layout.css; this plan appends below
provides:
  - Linen Situation section (#situation) with --space-section vertical padding (collapses to --space-xl <=640px)
  - Reusable .chip component class (Midnight bg, Linen text, --radius-pill, 5px 14px padding) — Phase 3 reuses on WORK / HOW I WORK chips
  - "THE SITUATION" chip + "Sound familiar?" H2 inside .situation__header
  - Five .situation__block items in <ol role="list"> rendering verbatim D-05 copy (Hot Pink number 01-05 / bold H3 title / body paragraph capped at --measure)
  - CSS Grid staggered layout: 1-col mobile (<=640px), 2-col alternating (641-1024px), 2-col staggered with col 2 offset down 1 row at >=1025px (D-12)
  - Forward-compatible mobile padding collapse (--space-xl) ahead of RESP-02 in Phase 5
affects: [02-03-reveal-observer, 03-approach-work-services, 05-cross-cutting]

tech-stack:
  added: [no new dependencies]
  patterns:
    - ".chip is a generic, reusable component class (not scoped to .situation) so Phase 3 can apply it to WORK / HOW I WORK chips without redefining"
    - "Staggered grid via explicit grid-row placement (block 04 starts at row 2, skipping row 1 in column 2) — no padding hacks, no absolute positioning"
    - "Layered media queries: mobile baseline → tablet alternation (641px) → desktop stagger (1025px) override"
    - "Flat block markup: <li> with span + h3 + p, zero box-card styling — restraint via absence of border/shadow/background"

key-files:
  created: []
  modified:
    - "index.html (lines 98-138 — replaced empty `<section id=\"situation\">` with .situation surface, .situation__header, and <ol> of five blocks)"
    - "css/components.css (lines 329-425 — appended .chip + .situation* component rules, 97 insertions)"
    - "css/layout.css (lines 81-130 — appended situation grid layout with mobile/tablet/desktop breakpoints, 50 insertions)"

key-decisions:
  - "Chose generic .chip class (not .situation__chip) per UI-SPEC §Component Inventory recommendation — Phase 3 reuses without renaming or duplicating"
  - "Number 01..05 marked aria-hidden inside <ol> so screen readers don't double-announce ('one... one...') — <ol> already conveys order semantically"
  - "Staggered desktop offset implemented via grid-row: 2 on block 04 (skipping row 1 in column 2) — cleanest CSS Grid expression of D-12, no padding hacks"
  - "Tablet baseline (641-1024px) ships its own alternating grid (01,03,05 left / 02,04 right) so the layout is intentional at every breakpoint, not just mobile and desktop"
  - "Mobile padding collapse (--space-xl) shipped in Phase 2 rather than deferred to Phase 5 RESP-02 — already token-driven, costs nothing now"

patterns-established:
  - "Reusable component naming: use unscoped class names (.chip, .btn) when the visual treatment will appear in multiple sections; reserve BEM-scoped names (.situation__title) for layout-and-typography that lives only inside one section"
  - "Three breakpoints in this codebase now: 1024px (nav density, Phase 1), 768px (hero stack, Plan 02-01), 640px+641px (situation collapse). Each responds to a different content concern; that's intentional"
  - "Plans that only land markup + CSS leave .reveal wiring to a separate plan — keeps the section verifiable on its own before motion is layered on"

requirements-completed:
  - SITU-01
  - SITU-02
  - SITU-03
  - SITU-04

duration: 2min
completed: 2026-04-30
---

# Phase 02 Plan 02: Situation Summary

**Linen "Sound familiar?" self-recognition section with five staggered blocks (01-05) plus reusable .chip class — visitors see their own situation before any pitch, no scroll reveal yet.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-30T07:42:34Z
- **Completed:** 2026-04-30T07:44:19Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Filled the empty `<section id="situation">` with the chip, H2 headline, and an `<ol role="list">` of five `<li>` blocks carrying verbatim D-05 copy.
- Shipped the reusable `.chip` component class — Midnight surface, Linen text, `--radius-pill`, padding `5px 14px`, Label typography uppercase. Phase 3 will reuse it on `WORK` and `HOW I WORK` without redeclaring.
- Appended 97 lines of token-driven situation CSS to `css/components.css` (no hex, no font-weight 500, no box-shadow, no border on blocks).
- Appended 50 lines of CSS Grid layout to `css/layout.css`: 1-col mobile, 2-col alternating tablet, 2-col staggered desktop with block 04 offset down one row to create the D-12 visual rhythm.
- Forward-compatible mobile padding collapse (`--space-xl` at `<=640px`) shipped now rather than deferred to Phase 5 RESP-02.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fill situation markup in index.html** — `5c36b7f` (feat)
2. **Task 2: Append .chip + situation component CSS to components.css** — `f8f7109` (feat)
3. **Task 3: Append situation grid layout to layout.css** — `c5e8938` (feat)

**Plan metadata:** pending (final docs commit covers SUMMARY.md + STATE.md + ROADMAP.md + REQUIREMENTS.md).

## Files Created/Modified

- `index.html` — Replaced empty `<section id="situation">` (line 98) with full markup: `.situation > .situation__inner > (.situation__header[chip + h2] + ol.situation__grid > 5× li.situation__block[span.number + h3.title + p.body])`. Numbers 01..05 are visible content with `aria-hidden="true"` so SR announcement isn't doubled with the `<ol>`.
- `css/components.css` — Appended at line 329 with two clearly-fenced blocks: `.chip` (reusable) then `.situation*` (scoped). Mobile padding collapse at the bottom.
- `css/layout.css` — Appended at line 81 with `.situation__inner` max-width container plus the mobile/tablet/desktop grid cascade. Block 04 placement (col 2, row 2) is the load-bearing rule for the staggered desktop look.

## Token Usage Audit

Tokens consumed by Phase 2 situation surfaces (all read from `css/tokens.css` via `var()`):

- **Colour:** `--color-linen` (situation surface, chip text), `--color-midnight` (chip fill, headline + title + body text), `--color-hot-pink` (block numbers 01–05), no other colours
- **Type:** `--font-primary`, `--text-headline`, `--text-title`, `--text-body`, `--text-label`, `--lh-headline`, `--lh-title`, `--lh-body`, `--lh-label`, `--ls-headline`, `--ls-label`
- **Spacing:** `--space-xs` (block internal gap, body top-margin), `--space-sm` (header chip→headline gap), `--space-md` (mobile grid gap), `--space-lg` (header→grid gap, desktop grid gap), `--space-xl` (mobile section padding-block), `--space-section` (desktop section padding-block)
- **Radius:** `--radius-pill` (chip)
- **Measure:** `--measure` (body max-width 65ch)

No new tokens introduced. No hex / rgb / hsl values. No font-weight 500.

## Reusable .chip Forward Note

`.chip` lands in this plan as a generic, unscoped component. Phase 3 sections (`WORK` and `HOW I WORK`) reuse the same class verbatim — no rewrite, no override, no per-section copy. If a future variant is needed (e.g. inverted on a Hot Pink surface), use a modifier class (`.chip--inverted`) rather than redeclaring. The class lives in `css/components.css` immediately above the `.situation*` block so the cascade order is clean.

## Decisions Made

See key-decisions in frontmatter. Key call-outs:

- **`.chip` is generic, not `.situation__chip`** — UI-SPEC explicitly recommended this; planner agreed; Phase 3 reuse is the payoff.
- **`aria-hidden="true"` on the visible 01..05 spans** — the `<ol>` already conveys order semantically, so the visual numbers are decoration. Hiding them from the AT prevents double-announcement ("one… one…").
- **Stagger via `grid-row: 2` on block 04, not padding-top hack** — pure CSS Grid expression of D-12. Block 04 in column 2 starts at row 2, leaving row 1 of column 2 empty, which produces the visual offset down by one item-height.
- **Three-breakpoint cascade (mobile baseline → 641px tablet → 1025px desktop)** — gives the section an intentional shape at every viewport, not just the two extremes.

## Deviations from Plan

None - plan executed exactly as written.

### Verification rule observation (not a deviation, documented)

Plan §verification rule 4 says "no `::before { content: '✓' }` or similar decorative icon insertion on situation classes". Result: no `::before` rules exist on any `.situation*` selector — confirmed by `grep '\.situation.*::before' css/components.css` returning zero matches. The block is icon-free as required.

The same rule about em-dashes from Plan 02-01's summary applies here: `index.html` has zero em-dashes in copy. CSS comments in `css/components.css` and `css/layout.css` use em-dashes for readability per the convention Phase 1 established. Neither file's appended Phase 2 block introduces em-dashes in any user-visible string. CLAUDE.md's hard ban is on em-dashes in copy; the comment convention is conformant.

---

**Total deviations:** 0 auto-fixed
**Impact on plan:** None — plan ran clean.

## Issues Encountered

None during execution. All three task verifications passed on first run. Overall plan-level checks (heading order, copy presence, no icons, no em-dashes, no `.reveal` yet, no hex in components.css) all passed.

## User Setup Required

None — no external service configuration required.

## Manual Verification

Not yet run. Cloudflare Pages auto-deploys on push to `new-site`. Once `c5e8938` reaches the preview, inspect at:

- https://new-site.looktwice-uk.pages.dev — desktop (1440px+)
- DevTools responsive at 1024px (tablet) — blocks alternate without offset
- DevTools responsive at 640px (mobile) — single column, --space-md gap
- Verify the staggered offset is visible: at >=1025px, block 04 starts visibly below block 01 (one item-height down) in the right column. Block 05 sits below block 04 in the same column.

Manual checks to confirm:
- Linen surface fills the section, padding-block ~120px desktop / ~96px mobile
- "THE SITUATION" pill is Midnight with Linen text, uppercase, ~5px/14px padding
- "Sound familiar?" headline in Midnight Epilogue 700, Headline scale
- Five blocks: small Hot Pink "01"/"02"/"03"/"04"/"05", bold black title, body paragraph capped at ~65ch
- No card boxes, no borders, no shadows around any block (flat layout)
- No icons anywhere in the section
- Tab through page — focus order remains hero CTAs → next focusable element (situation has no interactive children yet); section announces as ordered list of 5 items in screen-reader

## Forward Notes

- **Plan 02-03 (reveal observer)** will add `class="reveal"` and `data-reveal-index` attributes to the chip, headline, and the five blocks. This plan deliberately ships the section WITHOUT reveal so it's verifiable on its own. Plan 02-03's sole job is the IntersectionObserver wiring + stagger delays.
- **Phase 3** reuses `.chip` for WORK and HOW I WORK section labels — no renaming, no override. If Phase 3 needs a chip variant on a non-Linen surface, add a modifier rather than touching the base.
- **Phase 5 (cross-cutting)** verifies WCAG AA contrast on Midnight-on-Linen body copy (passes AAA — no concern) and Hot Pink-on-Linen number labels (passes AA at Label size). Also verifies mobile padding collapse satisfies RESP-02.

## Next Phase Readiness

- Plan 02-02 complete. Plan 02-03 (reveal observer) is the final plan in Phase 2.
- Component patterns ready for downstream reuse: `.chip` (Phase 3), `.situation__grid` staggered placement pattern (Phase 3 services if it ships an asymmetric layout).
- No blockers for plan 02-03. The reveal observer wires existing markup; this plan's job is done.

## Self-Check: PASSED

Files verified on disk:
- FOUND: index.html (line 98 `<section id="situation" class="situation">`)
- FOUND: css/components.css (`.chip` and `.situation*` rules appended)
- FOUND: css/layout.css (`.situation__inner` and grid rules appended)

Commits verified in `git log`:
- FOUND: 5c36b7f (Task 1)
- FOUND: f8f7109 (Task 2)
- FOUND: c5e8938 (Task 3)

---
*Phase: 02-hero-situation*
*Plan: 02*
*Completed: 2026-04-30*
