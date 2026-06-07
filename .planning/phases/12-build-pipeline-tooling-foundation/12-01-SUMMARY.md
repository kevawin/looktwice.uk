---
phase: 12-build-pipeline-tooling-foundation
plan: "01"
subsystem: build-pipeline
tags: [build, sharp, lightningcss, image-optimization, css-minify, static-site]
dependency_graph:
  requires: []
  provides:
    - build.js orchestrator with Phase 11 seam
    - dist/ output model with CSS minify + image AVIF/WebP + srcset rewrite
    - mtime image cache in .cache/
    - build-smoke Playwright spec (BUILD-01/02/03/04)
  affects:
    - package.json (build/dev/test scripts)
    - playwright.config.js (will be updated in plan 12-02)
    - bs-config.js (will be updated in plan 12-02)
tech_stack:
  added:
    - sharp@0.34.5 (AVIF+WebP image encoding, devDependency)
    - lightningcss@1.32.0 (CSS minify+autoprefix+nesting, devDependency)
  patterns:
    - Sequential pure-Node async build orchestrator (no build framework)
    - mtime skip-cache in .cache/images/ persisting across dist/ cleans
    - HTML rewrite via regex targeting hero__cutout picture block only
key_files:
  created:
    - build.js
    - tests/build-smoke.spec.js
  modified:
    - package.json
    - package-lock.json
decisions:
  - Used .cache/images/ as persistent encoded-output store so mtime cache survives dist/ cleans (cleanDist wipes dist/ on every build)
  - browserslist fallback to hardcoded targets object if browserslist module unavailable
  - kris-portrait.webp encoded to AVIF/WebP variants but not rewritten in HTML (JSON-LD only reference, copied verbatim)
  - Original rasters copied verbatim to dist/images/ alongside encoded variants for og:image/JSON-LD references
metrics:
  duration: "~5 minutes"
  completed: "2026-06-02"
  tasks: 3
  files: 4
requirements_met: [BUILD-01, BUILD-02, BUILD-03, BUILD-04, BUILD-08]
---

# Phase 12 Plan 01: Build Orchestrator + Image Pipeline Summary

Sequential pure-Node build.js with Lightning CSS minify, sharp AVIF/WebP at 4 widths, hero srcset rewrite, mtime cache, static copy, and 18-assertion build-smoke spec.

## What Was Built

`build.js` is a ~200-line CommonJS async orchestrator with five named steps:

1. `cleanDist()` — wipes and recreates dist/.
2. `buildCss()` — Lightning CSS `transform()` per file (minify, autoprefix, nesting from browserslist targets). Each of 5 CSS files written to dist/css/ preserving filename.
3. `buildImages()` — sharp encodes every raster in images/ to AVIF+WebP at 480/960/1440/1920px. Outputs land in `.cache/images/` (persists across dist/ cleans). mtime skip-cache in `.cache/images.json` copies cached outputs to dist/images/ on unchanged sources. Returns a srcset manifest keyed by basename.
4. `buildHtml(manifest)` — regex-rewrites the hero `<picture class="hero__cutout">` block to inject AVIF then WebP `<source srcset>` elements before the fallback `<img>`, which keeps all its original attributes (alt, width, height, loading, decoding, fetchpriority). Contact markup untouched.
5. `copyStatic()` — fs.cpSync/copyFileSync for fonts/, js/ (main.js verbatim per D-01), _headers, robots.txt, favicon.svg, and all SVG logos in images/.

Phase 11 extension seam is a clearly marked comment between buildImages and buildHtml where `manifest = await buildCutout(manifest)` slots in.

`tests/build-smoke.spec.js` — 18 fs-only assertions covering BUILD-01/02/03/04: index.html present, _headers + main.js byte-identical, 5 CSS files minified, 4-width AVIF+WebP present, srcset injected, no mailto leak. Does not need the 7777 web server.

## Commits

- `76c72a0` — feat(12-01): install sharp+lightningcss, scaffold build.js with CSS minify + static copy
- `556a666` — feat(12-01): add sharp image pipeline, HTML srcset rewrite, and mtime cache
- `9c7d252` — test(12-01): add build-smoke Playwright spec for dist/ integrity (BUILD-01/02/03/04)

## Verification Results

All acceptance criteria passed:

- `npm run build` exits 0, produces dist/ in 3.3s (first build) / 0.0s (cached)
- `diff _headers dist/_headers` empty (byte-identical)
- `diff js/main.js dist/js/main.js` empty (verbatim)
- All 5 CSS files present in dist/css/, each smaller than source (e.g. components.css: 29450 → 18915 bytes)
- scene-cafe-{480,960,1440,1920}.avif and .webp all present in dist/images/
- dist/index.html contains `type="image/avif"`, `type="image/webp"`, `srcset`, `fetchpriority="high"`
- dist/index.html does NOT contain `hello@looktwice.uk`
- Second consecutive build skips image encodes ("cache hit" log lines), completes in 0.0s
- `npx playwright test tests/build-smoke.spec.js --project=desktop-1440` — 18 passed
- Spec proven to fail (1 failure) when dist/_headers deleted — genuine assertion

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] mtime cache did not skip encodes on second build**

- Found during: Task 2 verification
- Issue: Plan Pattern 2 checks `allExist` against dist/images/ outputs. But `cleanDist()` wipes dist/ before image encoding runs, so `allExist` is always false after a clean — the cache never fires.
- Fix: Encode outputs land in `.cache/images/` (a directory that survives dist/ cleans). On a cache hit, the build copies files from `.cache/images/` to `dist/images/` — fast copy, no re-encode. Cache existence check now targets `.cache/images/` instead of `dist/images/`.
- Files modified: build.js (CACHE_IMAGES_DIR constant, buildImages logic)
- Commit: 556a666 (included in Task 2 commit)

## Known Stubs

None. build.js emits real encoded files from real sources. No placeholder data flows to any output.

## Threat Flags

None. This plan only adds build tooling writing to dist/ (gitignored). No new network endpoints, auth paths, or trust-boundary changes. Threat mitigations from the plan's threat model are implemented:

- T-12-01: dist/_headers copied verbatim; build-smoke spec asserts byte-identical.
- T-12-02: Build rewrite only injects source srcset elements — no inline script/style added; spec asserts no mailto reintroduced.
- T-12-SC: sharp + lightningcss pinned via package-lock.json; both approved in Package Legitimacy Audit.

## Self-Check: PASSED
