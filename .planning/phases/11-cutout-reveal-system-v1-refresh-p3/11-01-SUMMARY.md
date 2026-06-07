---
phase: 11-cutout-reveal-system-v1-refresh-p3
plan: "01"
subsystem: build-codegen
tags: [svg-mask, cutout, build, shape-presets, accessibility]
dependency_graph:
  requires: []
  provides: [buildCutout.js]
  affects: [build.js (Plan 02), index.html (Plan 02), css/components.css (Plan 02)]
tech_stack:
  added: []
  patterns: [svg-feColorMatrix-grayscale, svg-mask-single-image, build-time-codegen, tdd]
key_files:
  created:
    - buildCutout.js
    - tests/cutout.spec.js
  modified: []
decisions:
  - "Hero cutout defaults to single rounded-rect window (D-05 discretion note — lowest LCP/CLS risk, matches current hero shape)"
  - "buildSvgString and SHAPE_PRESETS exported alongside buildCutout for direct test access"
  - "CUTOUT_CONFIGS exported for test introspection of hero config shape"
metrics:
  duration: "187s"
  completed: "2026-06-02T19:39:26Z"
  tasks: 2
  files: 2
---

# Phase 11 Plan 01: buildCutout.js — Shape Preset Library + SVG Generator Summary

One-liner: Standalone Node module with five D-04 shape presets and buildSvgString/buildCutout exports producing a single-mask, feColorMatrix-grayscaled inline SVG from the build manifest.

## What Was Built

`buildCutout.js` at repo root — a standalone Node build module that:

- Holds `SHAPE_PRESETS`: five generators keyed by D-04 names (`down-triangle`, `up-triangle`, `pill`, `circle`, `rounded-rect`). Triangle paths and pill rect extracted verbatim from `image-cutout-demo.html` per the "Don't Hand-Roll" rule.
- Exposes `buildSvgString(config, manifest)`: generates one `<svg>` with one `<defs>` (feColorMatrix filter + mask holding black rect + white shapes) and one `<image>` carrying mask + filter (D-09, D-03). IDs suffixed with `config.id` (Pitfall 1). CLS guard via `width`/`height` attributes on `<svg>` (Pitfall 3).
- Exposes `buildCutout(manifest)` (async): reads `dist/index.html`, replaces `<!-- CUTOUT:{id} -->` markers with generated SVGs, writes back. Warns (not throws) on missing markers; throws on missing manifest entry (T-11-03 fail-closed).
- Defines `CUTOUT_CONFIGS` with one hero entry: single `rounded-rect` window, `scene-cafe` image, `loading: 'eager'`, `fetchpriority: 'high'`, `alt: ''` (decorative).

`tests/cutout.spec.js` — 27-test Playwright spec covering:
- Module export interface
- All five SHAPE_PRESETS
- buildSvgString SVG structure (single `<image>`, feColorMatrix, no base64, unique IDs)
- Accessibility branch (decorative vs. meaningful)
- Error paths (unknown shape, missing manifest)
- buildCutout marker replacement, warn-not-throw, manifest passthrough
- Browser render checks (requires Plan 02 build wiring to pass fully)

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| RED (tests) | 1e41ea9 | test(11-01): add failing tests for buildCutout module |
| GREEN (Task 1) | a34a6c8 | feat(11-01): author SHAPE_PRESETS library and buildSvgString generator |

## Verification Results

All acceptance criteria passed:

- `node -e "require('./buildCutout')"` exits 0.
- `grep -c "module.exports = { buildCutout"` returns 1.
- `feColorMatrix` present (SVG filter grayscale, not CSS — D-03).
- All five D-04 preset names present.
- Exactly one `<image` in template literal (D-09).
- No base64 anywhere (D-06).
- Smoke harness (marker replace, SVG present, 960.webp href): OK.
- CUTOUT_CONFIGS hero entry: shapes.length === 1, type === 'rounded-rect'.
- 26/27 tests pass; the one failing browser test requires Plan 02 build wiring (index.html marker + build.js seam) — expected.

## Deviations from Plan

None — plan executed exactly as written. Task 2's CUTOUT_CONFIGS and buildCutout(manifest) were authored in the same pass as Task 1 since they are part of the same module, producing one cohesive file rather than two separate commits to the same file. The commit message covers both tasks.

## Known Stubs

None. The module does not contain placeholder values, hardcoded paths, or TODO markers. Image href is always read from the manifest.

## Threat Flags

None. No new network endpoints, auth paths, file access patterns, or schema changes beyond what the plan's threat model already covers (T-11-01 through T-11-SC).

## Self-Check: PASSED

- `buildCutout.js` exists at `/Users/jamiepersonal/Developer/looktwice.uk/buildCutout.js` ✓
- `tests/cutout.spec.js` exists at `/Users/jamiepersonal/Developer/looktwice.uk/tests/cutout.spec.js` ✓
- Commit `1e41ea9` exists (RED) ✓
- Commit `a34a6c8` exists (GREEN) ✓
