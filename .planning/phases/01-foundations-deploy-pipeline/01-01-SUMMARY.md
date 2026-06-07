---
phase: 01-foundations-deploy-pipeline
plan: 01
subsystem: ui
tags: [css, design-tokens, oklch, epilogue, fonts, accessibility, woff2]

requires: []
provides:
  - Flat project tree at repo root (css/, js/, fonts/, images/)
  - Full design-token surface in css/tokens.css (12 OKLCH colours, gradient, type scale, spacing, radius, shadow, transitions)
  - Self-hosted Epilogue 400 + 700 woff2 binaries with OFL licence
  - css/base.css with Andy Bell modern reset, two @font-face blocks, smooth-scroll with reduced-motion guard, body defaults consuming tokens, --measure cap, hot-pink :focus-visible ring
  - Three CSS stub files (layout, components, animations) ready for plan 02 to append
affects: [01-02-shell-nav, 01-03-deploy-pipeline, 02-hero, 03-problem-positioning, 04-services-cases, 05-contact-footer-polish]

tech-stack:
  added:
    - Epilogue typeface (Latin subset, 400 + 700 weights, woff2)
    - Andy Bell modern minimal CSS reset
  patterns:
    - "OKLCH colour tokens only — zero hex/rgb/hsl in source"
    - "Cascade order enforced via <link> tag order, never @import"
    - "Absolute /fonts/ paths so Cloudflare Pages serves correctly across previews and deeplinks"
    - "Reduced-motion guard wraps every animation/scroll behaviour"
    - "Body and section defaults reference var(--token-name) — no hard-coded values"

key-files:
  created:
    - css/tokens.css
    - css/base.css
    - css/layout.css
    - css/components.css
    - css/animations.css
    - fonts/epilogue-400.woff2
    - fonts/epilogue-700.woff2
    - fonts/OFL.txt
    - js/.gitkeep
    - images/.gitkeep
  modified: []

key-decisions:
  - "Latin subset of Epilogue (~14KB per weight) chosen over full charset; Kris's content is Latin-only (resolves 01-RESEARCH.md Open Question 3)"
  - "OFL licence pulled from openfontlicense.org canonical (fontsource path 404'd); Epilogue copyright header prepended"
  - "Brand gradient declared in tokens but unpainted; Phase 4 sticky tab is the sole paint site"
  - "css/.gitkeep removed once real CSS files landed; fonts/ tracked via binaries; js/ and images/ kept by .gitkeep until plan 02 / Phase 2 populate"

patterns-established:
  - "OKLCH-only colour tokens with semantic names (no abstract scales)"
  - "Single :root block in tokens.css — no other selectors"
  - "@font-face with font-display: swap and absolute /fonts/ paths"
  - "scroll-behavior: smooth always paired with prefers-reduced-motion: reduce override"
  - ":focus-visible global ring at 2px solid hot-pink with 3px offset"
  - "65ch measure cap on running text (p, .measure)"

requirements-completed: [FOUND-01, FOUND-02, FOUND-03, FOUND-04]

duration: ~6min
completed: 2026-04-30
---

# Phase 01 Plan 01: Tokens, Base, Fonts Summary

**OKLCH design-token surface, Andy Bell reset, and self-hosted Epilogue 400/700 wired through `css/base.css` — every later phase consumes via `var(--name)` from a working cascade root.**

## Performance

- **Duration:** ~6 min
- **Started:** 2026-04-29T23:01:30Z
- **Completed:** 2026-04-29T23:07:43Z
- **Tasks:** 3
- **Files modified:** 10 created, 0 modified

## Accomplishments

- Flat project tree (`css/`, `js/`, `fonts/`, `images/`) created at repo root, holding `index.html` untouched (plan 02 overwrites)
- Full token set declared in `css/tokens.css`: 12 OKLCH colours + brand gradient + 5 type sizes + 5 line heights + 3 letter spacings + measure + 6 spacings + 5 radii + 1 shadow + 4 transitions (~42 declarations)
- Epilogue Latin subset 400 + 700 self-hosted (~14KB each), OFL licence committed
- `css/base.css` with Andy Bell modern reset, two `@font-face` blocks (font-display: swap, absolute paths), smooth scroll with reduced-motion guard, token-driven body defaults, 65ch measure cap, hot-pink `:focus-visible` ring
- Three CSS stubs (`layout.css`, `components.css`, `animations.css`) ready for plan 02 to append

## Task Commits

Each task committed atomically:

1. **Task 1: Flat project tree + Epilogue woff2 + OFL** — `3717c5e` (feat)
2. **Task 2: css/tokens.css full token surface** — `824e9ce` (feat)
3. **Task 3: css/base.css + three stubs** — `87418db` (feat)

**Plan metadata commit:** _to-follow_ (final commit at end of execute-plan)

## Files Created

- `css/tokens.css` — :root design-token block (92 lines, OKLCH-only)
- `css/base.css` — reset + @font-face + scroll + body defaults + measure + focus ring (143 lines)
- `css/layout.css` — header-comment stub (1 line)
- `css/components.css` — header-comment stub (1 line)
- `css/animations.css` — header-comment stub (1 line)
- `fonts/epilogue-400.woff2` — Latin subset Regular (~14KB, wOF2 magic bytes verified)
- `fonts/epilogue-700.woff2` — Latin subset Bold (~14KB, wOF2 magic bytes verified)
- `fonts/OFL.txt` — SIL OFL 1.1 with Epilogue copyright header
- `js/.gitkeep` — directory marker (plan 02 / Phase 2 populate)
- `images/.gitkeep` — directory marker (Phase 2 populates)

## Decisions Made

- **Latin subset over full charset** for Epilogue weights — keeps each weight to ~14KB (28KB total versus 100–160KB for full Epilogue), matches Latin-only English content, resolves 01-RESEARCH.md Open Question 3 in favour of subset
- **OFL source substitution** — primary `raw.githubusercontent.com/fontsource/font-files/.../OFL.txt` returned 404 at execution time. Used the documented fallback `https://openfontlicense.org/documents/OFL.txt` (canonical SIL OFL 1.1) and prepended `Copyright 2020 The Epilogue Project Authors` header per plan instruction
- **Removed `css/.gitkeep`** once real CSS files (tokens, base, three stubs) landed — `.gitkeep` was scaffolding-only; tracked in Task 3 commit
- **Holding index.html on `new-site` left untouched** — contains pre-existing Google Fonts `<link>` to Syne + DM Sans; plan 02 overwrites with V1 shell that uses self-hosted Epilogue only. Logged in `deferred-items.md`

## Deviations from Plan

### Adjustments (no rule violations)

**1. Comment wording in `css/base.css` adjusted to satisfy strict acceptance test**

- **Found during:** Task 3 verification
- **Issue:** Plan acceptance criterion was `grep -cE "@font-face" css/base.css | grep -q "^2$"` — exactly 2 matches required. Comments using the literal token "@font-face" pushed the count to 4, failing the check
- **Fix:** Rewrote two header comments to say "font face" / "font faces" instead of "@font-face" — semantics preserved, only the two real `@font-face` rules now match
- **Files modified:** `css/base.css`
- **Committed in:** `87418db` (Task 3 commit)

### Auto-fixed Issues

None — no Rule 1/2/3 fixes were needed. The plan was directly executable.

---

**Total deviations:** 1 minor adjustment (comment wording for grep precision)
**Impact on plan:** Zero scope change. Plan executed essentially as written.

## Issues Encountered

- **OFL.txt source 404** at the primary URL specified in the plan. Resolved via the documented fallback path. Logged in `deferred-items.md`.
- **Holding `index.html` contains Google Fonts links** — pre-existing in the committed holding page. Out of scope for plan 01 (plan explicitly says "do not touch index.html — plan 02 overwrites"). Logged in `deferred-items.md`.

## User Setup Required

None — no external service configuration needed for this plan. Plan 03 handles Cloudflare Pages.

## Next Phase Readiness

- Token surface and font face are live at the cascade root — every later plan can consume via `var(--name)` and `font-family: 'Epilogue'`
- Three stub CSS files exist for plan 02 to append nav layout, components, and transitions
- Plan 02 (`01-02-shell-nav`) can now overwrite `index.html` with the V1 shell, link the five CSS files in cascade order, build the nav, and remove the holding page's Google Fonts dependency in the same overwrite

---
*Phase: 01-foundations-deploy-pipeline*
*Completed: 2026-04-30*

## Self-Check: PASSED

All 12 expected files present on disk. All 3 task commits present in git log (`3717c5e`, `824e9ce`, `87418db`).
