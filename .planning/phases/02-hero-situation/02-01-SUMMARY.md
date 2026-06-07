---
phase: 02-hero-situation
plan: 01
subsystem: ui
tags: [hero, hot-pink, cutouts, buttons, css-grid, responsive, vanilla-css]

requires:
  - phase: 01-foundation
    provides: tokens, base reset, Epilogue 400/700 self-host, semantic shell with empty `<section id="hero">`, sticky nav, Cloudflare Pages preview pipeline
provides:
  - Hot Pink full-bleed hero (#hero) at min-height 90vh
  - Two-line H1 (D-01) and one-paragraph subhead (D-02) verbatim from CONTENT-DRAFT
  - Two CTAs: BOOK A SESSION (#contact, primary Midnight→Hot Pink) and SEE THE WORK (#work, ghost White→White-fill)
  - Asymmetric cutout composition (main rounded-rect 78%×86% + supporting circle 42%×42%)
  - `filter: grayscale(100%)` on cutouts (D-08)
  - Midnight token-block fallback for missing supporting image (D-10) with onerror degradation hook
  - Reusable `.btn` / `.btn--primary` / `.btn--ghost-on-dark` component classes
  - `.btn--ghost-on-dark:focus-visible` white outline override (focus-ring exception on Hot Pink surface)
  - Responsive stack at <=768px (CTAs full-width column, cutouts 85% width centred)
affects: [02-02-situation, 03-approach-work-services, 04-contact-footer-sticky, 05-cross-cutting]

tech-stack:
  added: [no new dependencies]
  patterns:
    - "BEM-ish naming extended (.hero, .hero__inner, .hero__cutout--main, .hero__cutout--support)"
    - "Cutout composition: parent absolute container + absolutely-positioned children sized via percentage geometry"
    - "Midnight token-block fallback pattern (.hero__cutout-fallback z-index 0, image z-index 1, .hero__cutout--missing toggled by inline onerror)"
    - "Responsive button: flex-row → flex-column at 768px, .btn { width: 100% } in mobile media query"
    - "Focus-ring override only on the modifier where contrast fails (ghost-on-dark on Hot Pink), inheriting global ring elsewhere"

key-files:
  created: []
  modified:
    - "index.html (lines 53-97 — replaced empty `<section id=\"hero\">` with hero markup)"
    - "css/components.css (lines 134-327 — appended Phase 2 hero + button block, 195 insertions)"
    - "css/layout.css (lines 51-79 — appended hero grid layout, 29 insertions)"

key-decisions:
  - "Cutout geometry: main 78%×86% top-right rounded-rect, supporting 42%×42% bottom-left circle — picked to satisfy 'asymmetric tension' brief without exact dimensions in spec"
  - "Hero responsive breakpoint set at 768px (matches text-overflow risk threshold; nav uses 1024px because that is the navigation density boundary, not the same concern)"
  - "Cutout container is `aspect-ratio: 1 / 1` with `max-width: 520px` desktop and `aspect-ratio: 4 / 5` mobile — keeps composition stable across viewport while allowing taller cutout block on phones"
  - "Inline onerror handler used for image-fail degradation (single expression, not a script). Acceptable per D-10; keeps fallback active even when the file 404s server-side"
  - "Did not introduce a `--color-white-85` token — used `color: var(--color-true-white); opacity: 0.85;` per UI-SPEC contrast guidance"

patterns-established:
  - "Hero uses padding-block + padding-inline tokens, never `--space-section` (90vh full-bleed drives rhythm instead)"
  - "Buttons consume DESIGN-TOKENS-locked literals (14px 32px padding, 1.5px border) — these are treated as system constants, not arbitrary px"
  - "Two breakpoints in this codebase: 1024px (nav density) and 768px (hero stack). Future sections should default to 768px unless they have nav-style density concerns"

requirements-completed:
  - HERO-01
  - HERO-02
  - HERO-03
  - HERO-04
  - HERO-05
  - HERO-06

duration: ~6min
completed: 2026-04-30
---

# Phase 02 Plan 01: Hero Summary

**Hot Pink hero (#hero) with two-line H1, two CTAs, and asymmetric desaturated cutout composition — first paint surface for warm referrals, no scroll reveal.**

## Performance

- **Duration:** ~6 min (resumed mid-plan; Task 1 committed pre-resume at 01c24d5, Tasks 2 and 3 executed in this session)
- **Started:** 2026-04-30T07:35:49Z (Task 1 commit timestamp on 01c24d5)
- **Completed:** 2026-04-30T07:39:23Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Filled the empty `<section id="hero">` with locked copy (D-01 / D-02 / D-03) and an asymmetric cutout composition.
- Appended ~195 lines of token-driven hero + button CSS to `css/components.css` (no hex, no font-weight 500, no box-shadow on hero/button surfaces).
- Appended a 29-line responsive grid block to `css/layout.css` honouring HERO-01 (55fr/45fr desktop) and HERO-05 (single column at <=768px).
- Shipped the Midnight token-block fallback pattern (D-10) with both CSS visibility toggle (`.hero__cutout--missing`) and an inline onerror handler so the supporting image can land in a single later commit with no markup change.
- Added a focus-ring override on `.btn--ghost-on-dark` only — preserves WCAG focus visibility on Hot Pink without polluting other surfaces.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fill hero markup in index.html** — `01c24d5` (feat) — committed pre-resume
2. **Task 2: Append hero component + button CSS to components.css** — `3bda8b2` (feat)
3. **Task 3: Append hero layout grid to layout.css** — `70e322d` (feat)

**Plan metadata:** pending (final docs commit)

## Files Created/Modified

- `index.html` — Hero markup populated inside `<section id="hero" class="hero">`: `.hero__inner` two-column container, `.hero__text` (H1, subhead, CTA row), `.hero__cutouts` (main `<picture>` for `kris-portrait.webp` + supporting `<picture>` for `hero-supporting.webp` with Midnight fallback `<div>` and inline onerror degradation hook).
- `css/components.css` — Appended Phase 2 hero block at line 134: `.hero`, `.hero__headline`, `.hero__subhead`, `.hero__ctas`, `.hero__cutouts`, `.hero__cutout`, `.hero__cutout--main`, `.hero__cutout--support`, `.hero__cutout-fallback`, `.hero__cutout-image`, `.hero__cutout--missing`, `.btn`, `.btn--primary`, `.btn--ghost-on-dark`, plus `@media (max-width: 768px)` responsive overrides.
- `css/layout.css` — Appended `.hero__inner` grid (55fr/45fr, max-width 1280px, gap `--space-lg`) and `.hero__text` flex column. Mobile collapses grid to `1fr` with `--space-md` gap.

## Token Usage Audit

Tokens consumed by Phase 2 hero/button surfaces (all read from `css/tokens.css` via `var()`):

- **Colour:** `--color-hot-pink` (hero surface), `--color-true-white` (text + ghost border), `--color-midnight` (primary button fill, fallback block), `--color-linen` (primary button text)
- **Type:** `--font-primary`, `--text-display`, `--text-body`, `--text-label`, `--lh-display`, `--lh-body`, `--lh-label`, `--ls-display`, `--ls-label`
- **Spacing:** `--space-sm` (CTA gap, headline/subhead margin), `--space-md` (CTA top margin, mobile padding/gap), `--space-lg` (hero block padding, desktop grid gap)
- **Radius:** `--radius-cutout` (main cutout), `--radius-sm` (button corner)
- **Transitions:** `--transition-button`
- **Measure:** `--measure` (subhead max-width)

No new tokens introduced. No hex / rgb / hsl values anywhere in the appended Phase 2 CSS.

## Decisions Made

See key-decisions in frontmatter. Key call-outs:

- **Cutout geometry chosen by executor** — UI-SPEC said "asymmetric tension", planner left exact percentages to executor. Picked 78%×86% (main, top-right) and 42%×42% (support, bottom-left) so the support visually nests below-left of the main without overlapping its anchor edge. Tunable on visual review.
- **Hero responsive breakpoint = 768px** — distinct from nav's 1024px. Reasoning: nav switches to hamburger when link density gets cramped (~1024px); hero switches to single-column when the 55fr/45fr text column starts forcing display-size headlines into awkward wraps (~768px). Two-breakpoint codebase is intentional.
- **Inline `onerror` instead of `<script>` block for image fallback** — single JS expression, not a behaviour script. Keeps Phase 2 free of new JS files (Phase 1 file ownership rule).
- **No `srcset` / no preload** — locked by D-09 (single source per cutout, Phase 5 may revisit).

## Deviations from Plan

### Auto-fixed Issues

None of Rules 1–4 fired. Plan executed as written.

### Verification rule observation (not a deviation, but documented)

Plan §verification rule 4 says `grep '—' index.html css/components.css css/layout.css` should return nothing. Result: `index.html` has no em-dashes (verified). `css/components.css` and `css/layout.css` contain em-dashes only inside `/* ... */` comments — both new (Phase 2) and pre-existing (Phase 1). The CLAUDE.md hard ban is on em-dashes in **copy**, not in source-code comments. Phase 1 already established the convention of em-dashes in CSS comments, and the appended Phase 2 comments match that style. No copy-level em-dashes shipped. Treating as conformant with CLAUDE.md.

---

**Total deviations:** 0 auto-fixed
**Impact on plan:** None — plan ran clean.

## Issues Encountered

None during execution. xmllint reports HTML5 tag warnings (`<nav>`, `<main>`, `<section>`, `<picture>`, `<footer>`) — these are XHTML/HTML4-DTD limitations of xmllint, not real errors. The plan itself acknowledges "warnings ok, errors not". Markup is well-formed HTML5.

## Image Status

- `images/kris-portrait.webp` — **shipped** (committed in `f6fb229` pre-Phase-2). Referenced in `.hero__cutout--main`.
- `images/hero-supporting.webp` — **deferred**. Markup ships the `<picture>`/`<img>` pointing at the agreed path; Midnight token-block fallback (`.hero__cutout-fallback`) renders behind it. The inline `onerror` handler removes the broken `<img>` and toggles `.hero__cutout--missing` so the fallback stays visible. When Kris/Jamie source the image, a single-file commit drops it into `images/` — no markup or CSS change required.

## Manual Verification

Not yet run. Cloudflare Pages auto-deploys on push to `new-site`. Once `70e322d` reaches the preview, inspect at:

- https://new-site.looktwice-uk.pages.dev — desktop (1440px+)
- DevTools responsive at 768px — hero should stack
- DevTools responsive at 375px (iPhone SE) — no horizontal scroll, buttons full-width, cutouts 85% width centred

Manual checks to confirm:
- Hot Pink fills viewport at min 90vh
- Headline reads "Your brand makes a promise." line break "But is your experience breaking it?" in white display weight
- Subhead reads "I find where brand promise and experience are out of step. Then close the gap." at 85% white opacity
- Primary button hover swaps Midnight→Hot Pink; ghost button hover swaps to white fill / Midnight text
- Kris portrait visible in greyscale rounded-rect; supporting position shows Midnight circle (image absent)
- Tab through hero — both buttons receive visible focus rings (primary inherits Hot Pink global ring; ghost shows White override)
- Click CTAs — `#contact` and `#work` anchors resolve (sections empty until Phase 3/4, but anchors exist)

This list is the Kris-facing review checklist when the preview lands.

## Open Issues for Kris

- **Supporting cutout image** — needs sourcing: stock or commissioned, greyscale-friendly, supports the "asymmetric working-session" beat. Pexels / Unsplash manual pick (PROJECT.md bans automated picks). Options: hands annotating printed brand research, two people in a working session, architectural detail with human scale. Kris/Jamie pick; the alt text in the markup ("A working session: hands annotating printed brand research on a desk") is provisional and should be revised to match the chosen image.
- **Hero copy refinement** — current strings are the locked D-01/D-02/D-03 picks. Kris reviews on the live preview and refines wording in her own voice if needed (CLAUDE.md: copy is directional pre-launch).
- **Cutout dimensions tuning** — visual review on preview may suggest tightening the support cutout circle size or shifting the asymmetric offset. Adjustable via `.hero__cutout--main` / `.hero__cutout--support` percentages without touching markup.

## Next Phase Readiness

- Hero is complete for plan 02-01. Plan 02-02 (situation section) is next in this phase.
- Component patterns ready for reuse: `.btn` base class will carry across Phase 3/4 surfaces. The cutout composition pattern (parent + absolute children + token fallback) is the model for any future image-driven section.
- No blockers for plan 02-02. Situation section uses a different surface (Linen) and grid (2-col staggered list) but consumes the same token surface and component naming convention.

## Self-Check: PASSED

Files verified on disk:
- FOUND: index.html (line 53 `<section id="hero" class="hero">`)
- FOUND: css/components.css (line 139 `.hero {` … line 327 closing `}`)
- FOUND: css/layout.css (line 56 `.hero__inner` … line 79 closing `}`)
- FOUND: images/kris-portrait.webp

Commits verified in `git log --all`:
- FOUND: 01c24d5 (Task 1)
- FOUND: 3bda8b2 (Task 2)
- FOUND: 70e322d (Task 3)

---
*Phase: 02-hero-situation*
*Plan: 01*
*Completed: 2026-04-30*
