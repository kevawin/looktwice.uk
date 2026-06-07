---
quick_id: 260602-tm1
status: complete
completed: 2026-06-02
duration_seconds: 180
tasks_completed: 2
files_modified: 2
commits:
  - hash: 3eadeda
    message: "feat(260602-tm1): swap hero cutout to two interlocking triangles"
  - hash: d14f4b1
    message: "test(260602-tm1): update hero CLS guard assertion to new 519.6 height"
---

# Quick Task 260602-tm1 Summary

Hero cutout changed from single rounded-rect to two interlocking triangles (down-triangle + up-triangle) with matching viewBox height of 519.6.

## Tasks

### Task 1 — Swap hero shapes + viewBox (commit 3eadeda)

Updated `CUTOUT_CONFIGS` hero entry in `buildCutout.js`:
- `shapes` changed from `[{ type: 'rounded-rect' }]` to `[{ type: 'down-triangle' }, { type: 'up-triangle' }]`
- `viewBox` changed from `'0 0 1000 1064'` to `'0 0 1000 519.6'`
- `height` changed from `1064` to `519.6`
- `width`, `image`, `loading`, `fetchpriority`, and `alt` unchanged

Build verification passed:
- `[buildCutout] injected cutout: hero` printed
- Zero `CUTOUT:hero` markers in `dist/index.html`
- `viewBox="0 0 1000 519.6"` present
- Exactly one `<image` element
- Both triangle paths present (`M 83.14,0` and `M 658.43,72.04`)

### Task 2 — Update spec hero-dimension assertions (commit d14f4b1)

Updated the "Build output — dist/index.html" CLS guard test in `tests/cutout.spec.js`:
- Line 365: `height="1064"` assertion changed to `height="519.6"`
- Standalone SHAPE_PRESET unit tests left untouched
- Generic `buildSvgString` CLS guard test left untouched (uses its own inline test config)

All 90 tests green across three projects (desktop-1440, tablet-768, mobile-375).

## Deviations

None. Plan executed exactly as written.

## Self-Check

- buildCutout.js modified: FOUND
- tests/cutout.spec.js modified: FOUND
- Commit 3eadeda: FOUND
- Commit d14f4b1: FOUND

## Self-Check: PASSED
