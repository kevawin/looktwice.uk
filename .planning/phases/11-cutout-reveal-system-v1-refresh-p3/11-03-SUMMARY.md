---
phase: 11-cutout-reveal-system-v1-refresh-p3
plan: "03"
subsystem: testing + documentation
tags: [playwright, svg-mask, cutout, build-time-codegen, cls-guard, lcp-guard, d-03, d-06, d-09, d-10a]
dependency_graph:
  requires: [buildCutout.js (Plan 01), build.js wiring (Plan 02)]
  provides: [tests/cutout.spec.js (full regression suite), CLAUDE.md cutout build model note]
  affects: [dist/index.html (indirectly — spec proves the build output contract)]
tech_stack:
  added: []
  patterns: [playwright-fs-assertions, per-worker-temp-file-isolation, opts-override-for-testability]
key_files:
  created:
    - .planning/phases/11-cutout-reveal-system-v1-refresh-p3/11-03-SUMMARY.md
  modified:
    - tests/cutout.spec.js
    - CLAUDE.md
    - buildCutout.js
decisions:
  - "buildCutout accepts optional opts.htmlPath to redirect output during tests — avoids the shared dist/index.html race without requiring a temp-dir build shim"
  - "Marker replacement tests use per-worker temp paths (test-results/cutout-tmp/<label>-<project>.html) — all 3 viewport projects run them without filesystem conflicts"
  - "Build output and browser-render tests remain in shared dist/index.html (the real build output) — they need the full-fidelity file"
metrics:
  duration: "420s"
  completed: "2026-06-02T20:57:00Z"
  tasks: 2
  files: 3
---

# Phase 11 Plan 03: Cutout Spec Finalization + CLAUDE.md Build Model Note

One-liner: cutout.spec.js finalized with CLS/LCP guards and single-image count; cross-project fs race fixed via opts.htmlPath override; CLAUDE.md records the build-time SVG codegen model (D-10a).

## What Was Built

**tests/cutout.spec.js:**
- Extended `Build output — dist/index.html` describe with three new assertions:
  - `SVG carries intrinsic width and height (CLS guard)` — asserts `width="1000"` and `height="1064"` on the emitted SVG
  - `exactly one <image element inside the cutout SVG (D-09)` — extracts the cutout SVG block and counts `<image` occurrences
  - `head contains rel="preload" as="image" for hero image (LCP guard)` — extracts `<head>` and asserts the preload link is present
- Fixed cross-project filesystem race in `buildCutout(manifest) marker replacement` describe: replaced the shared `dist/index.html` write with per-worker temp files under `test-results/cutout-tmp/` via the new `opts.htmlPath` override in `buildCutout.js`
- Removed the serial/desktop-only skip workaround — all 4 marker replacement tests now run in all 3 viewport projects cleanly (90 tests, 0 failures)

**buildCutout.js:**
- Added optional `opts.htmlPath` parameter to `buildCutout(manifest, opts)` — defaults to `dist/index.html` for production; allows tests to redirect to an isolated temp file
- No change to the module's default production behaviour

**CLAUDE.md:**
- Added `## Cutout primitive (build-time SVG codegen)` section documenting:
  - Source `<!-- CUTOUT:hero -->` marker → `dist/index.html` `<svg>` replacement at build time
  - Solid section colour field rule (D-01/D-02 — gradient only on floating CTA pill)
  - B&W via `feColorMatrix type="saturate" values="0"` (D-03; CSS filter unreliable on SVG `<image>` in Safari)
  - Single `<image>` behind one `<mask>` (D-09); no base64, manifest-resolved href (D-06)
  - CLS guard via intrinsic `width`/`height` on the `<svg>`
  - Five shape presets in `SHAPE_PRESETS`; future sections add to `CUTOUT_CONFIGS`

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 (initial) | b0d544a | test(11-03): finalize cutout.spec.js — CLS/LCP guards, single-image count, fix parallel contamination |
| Task 1 (rule 1 fix) | bf5ecbf | fix(11-03): prevent dist/index.html cross-project race in cutout spec |
| Task 2 | dcf5fe5 | docs(11-03): document cutout primitive build model in CLAUDE.md (D-10a) |

## Verification Results

All acceptance criteria passed:

- `npx playwright test tests/cutout.spec.js` → 90 passed, 0 failed across all three viewport projects
- `grep -c "test.describe" tests/cutout.spec.js` = 8 (>= 2)
- Spec asserts: `cutout-windows-hero`, `feColorMatrix`, `scene-cafe-960.webp`, marker-absence, no-base64, intrinsic width/height, preload link, and single `<image` count (D-09)
- `grep -c "buildCutout" CLAUDE.md` = 2
- `grep -c "CUTOUT:hero" CLAUDE.md` = 1
- `grep -c "build-time SVG" CLAUDE.md` = 1
- `grep -c "no card shadows\|no gradient text\|Epilogue" CLAUDE.md` = 2 (unchanged)
- Full suite: `npx playwright test` → 284 passed, 31 skipped, 0 failed

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Cross-project filesystem race in marker replacement tests**
- **Found during:** Task 1 (running the full spec across all three viewport projects)
- **Issue:** The 4 `buildCutout(manifest) marker replacement` tests all wrote directly to `dist/index.html`. With 3 Playwright workers running in parallel (one per project), the file was clobbered mid-run. The `Build output` and `Cutout hero — browser render` test groups then read a corrupted short HTML file instead of the real build output, causing 23 failures.
- **Fix (step 1):** Added `opts.htmlPath` optional override to `buildCutout(manifest, opts)` in `buildCutout.js`. No change to default production behaviour.
- **Fix (step 2):** Updated the marker replacement tests to use per-worker temp paths under `test-results/cutout-tmp/<label>-<project>.html`. All 3 projects write to separate paths — no race.
- **Files modified:** `buildCutout.js`, `tests/cutout.spec.js`
- **Commits:** b0d544a (initial), bf5ecbf (race fix)

## Known Stubs

None. The spec exercises the full build output contract and the browser render. No placeholder values.

## Threat Flags

None. This plan adds tests and a CLAUDE.md note — no new network endpoints, auth paths, or file access patterns.

## Self-Check: PASSED

- `tests/cutout.spec.js` exists ✓
- `CLAUDE.md` contains `buildCutout` (2 occurrences) ✓
- Commit b0d544a exists (Task 1 initial) ✓
- Commit dcf5fe5 exists (Task 2) ✓
- Commit bf5ecbf exists (Rule 1 fix) ✓
- `npx playwright test tests/cutout.spec.js` → 90 passed, 0 failed ✓
- `npx playwright test` (full suite) → 284 passed, 31 skipped, 0 failed ✓
