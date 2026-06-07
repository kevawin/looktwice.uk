---
phase: 11-cutout-reveal-system-v1-refresh-p3
plan: "02"
subsystem: build-pipeline
tags: [svg-mask, cutout, build-wiring, css-refactor, lcp-guard]
dependency_graph:
  requires: [buildCutout.js (Plan 01)]
  provides: [wired build.js, hero marker in index.html, .cutout CSS primitive]
  affects: [tests/cutout.spec.js (Plan 03 — browser-render test now passes), dist/index.html]
tech_stack:
  added: []
  patterns: [build-seam-integration, css-primitive-class, svg-intrinsic-cls-guard]
key_files:
  created: []
  modified:
    - build.js
    - index.html
    - css/components.css
    - tests/build-smoke.spec.js
decisions:
  - "buildCutout called AFTER buildHtml (not before) — buildCutout reads dist/index.html which buildHtml must write first"
  - "const manifest changed to let manifest in build() to allow seam reassignment"
  - "build-smoke test updated from rewriteHeroImg assertions to Phase 11 SVG cutout assertions (Rule 1 fix)"
metrics:
  duration: "300s"
  completed: "2026-06-02T19:45:36Z"
  tasks: 3
  files: 4
---

# Phase 11 Plan 02: Build Wiring + Hero Markup Swap + CSS Refactor Summary

One-liner: buildCutout wired at Phase 11 seam in build.js, hero replaced with injection marker and LCP preload, .cutout primitive added and stale grayscale/aspect-ratio rules removed.

## What Was Built

**build.js:**
- Added `const { buildCutout } = require('./buildCutout')` at the top
- Changed `const manifest` to `let manifest` in `build()` to allow seam reassignment
- Removed `rewriteHeroImg` function (35 lines) and its call site in `buildHtml`
- `buildHtml()` now writes source HTML straight through (no manifest param needed)
- Inserted `manifest = await buildCutout(manifest)` after `buildHtml()` — order is `buildHtml → buildCutout → copyStatic` so buildCutout can read the already-written dist/index.html
- Added `path.join(ROOT, 'buildCutout.js')` to `WATCH_TARGETS`

**index.html:**
- Replaced `<picture class="hero__cutout"><img ...></picture>` block with `<!-- CUTOUT:hero -->`
- Added `<link rel="preload" href="/images/scene-cafe-960.webp" as="image" fetchpriority="high">` after the font preload (LCP guard — D-06; fetchpriority on SVG `<image>` is not reliably honoured cross-browser)

**css/components.css:**
- Added `.cutout` primitive class (`display: block; width: 100%; height: auto`) under `/* === Cutout primitive (.cutout) === */` fence
- Thinned `.hero__cutouts` to a positioning wrapper (`width: 100%; max-width: 460px; justify-self: end`)
- Removed `position: relative` and `aspect-ratio: 4/5` from `.hero__cutouts` (CLS now from SVG intrinsic dims per Pitfall 3)
- Removed `.hero__cutout` and `.hero__cutout img` rules entirely (grayscale in `feColorMatrix`, radius in rounded-rect shape path)
- Removed `aspect-ratio: 4/5` from `@media (max-width: 768px)` `.hero__cutouts` block

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | c42bec2 | feat(11-02): wire buildCutout at Phase 11 seam; remove dead rewriteHeroImg |
| Task 2 | a0b4b46 | feat(11-02): swap hero markup to cutout marker; add hero image preload |
| Task 3 | 9fe52d1 | feat(11-02): refactor hero CSS onto .cutout primitive; remove stale rules |

## Verification Results

All acceptance criteria passed:

- `node build.js` exits 0, prints `[buildCutout] injected cutout: hero`
- `grep -c "rewriteHeroImg" build.js` = 0
- `grep -c "await buildCutout(manifest)" build.js` = 1
- `grep "buildCutout.js" build.js` shows it in WATCH_TARGETS
- `grep -c "data:image" dist/index.html` = 0
- Source `index.html` has `<!-- CUTOUT:hero -->` and hero image preload
- `dist/index.html` has `<svg class="cutout"`, `feColorMatrix`, no `<!-- CUTOUT:hero -->`
- `grep -c ".cutout" css/components.css` >= 1
- `grep -c "filter: grayscale" css/components.css` = 0
- `grep -c "aspect-ratio" css/components.css` = 0
- `grep -c ".hero__cutout " css/components.css` = 0
- Build-smoke spec: 18/18 passing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] const → let manifest in build()**
- **Found during:** Task 1 (build error on first run)
- **Issue:** `const manifest = await buildImages()` can't be reassigned; `manifest = await buildCutout(manifest)` at the seam threw `TypeError: Assignment to constant variable`
- **Fix:** Changed `const manifest` to `let manifest` in `build()`
- **Files modified:** build.js
- **Commit:** c42bec2

**2. [Rule 1 - Bug] build-smoke test asserted dead rewriteHeroImg behaviour**
- **Found during:** Task 3 (build-smoke run)
- **Issue:** Test "srcset and type=image/avif (build rewrite applied)" checked for `srcset`, `type="image/avif"`, `type="image/webp"` — outputs of `rewriteHeroImg` which was removed. Test was blocked from passing by the legitimate behaviour change.
- **Fix:** Updated test to assert Phase 11 SVG cutout output: `<svg class="cutout"`, `feColorMatrix`, no unconsumed `<!-- CUTOUT:hero -->` marker, `fetchpriority="high"` on preload
- **Files modified:** tests/build-smoke.spec.js
- **Commit:** 9fe52d1

## Known Stubs

None. The build produces a fully wired hero SVG cutout with no placeholder values.

## Threat Flags

None. No new network endpoints, auth paths, or file access patterns introduced. The `<!-- CUTOUT:hero -->` marker is consumed by the build (T-11-04 mitigated: build-smoke asserts marker not present in dist output).

## Self-Check: PASSED

- `build.js` exists and contains `await buildCutout(manifest)` (1 occurrence) ✓
- `index.html` contains `<!-- CUTOUT:hero -->` ✓
- `css/components.css` contains `.cutout` primitive ✓
- `tests/build-smoke.spec.js` updated ✓
- Commit c42bec2 exists (Task 1) ✓
- Commit a0b4b46 exists (Task 2) ✓
- Commit 9fe52d1 exists (Task 3) ✓
- `dist/index.html` has `<svg class="cutout"` and no `<!-- CUTOUT:hero -->` ✓
