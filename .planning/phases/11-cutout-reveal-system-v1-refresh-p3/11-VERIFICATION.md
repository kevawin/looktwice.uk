---
phase: 11-cutout-reveal-system-v1-refresh-p3
verified: 2026-06-02T21:05:00Z
status: passed
score: 9/9 must-haves verified
overrides_applied: 0
---

# Phase 11: Cutout Reveal System Verification Report

**Phase Goal:** Build the cutout-reveal technique from image-cutout-demo.html once, as a reusable `.cutout` component, so later refresh phases and a hero refactor all consume the same SVG-mask primitive. Realizes the locked "cutout/drenched aesthetic — colour on surface, B&W in apertures." After this phase, `node build.js` emits a dist/index.html whose hero is a B&W image revealed through a window in the solid Hot Pink field, built from a reusable buildCutout primitive, locked behind a Playwright spec and documented in CLAUDE.md.
**Verified:** 2026-06-02T21:05:00Z
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A reusable buildCutout(manifest) function exists and can be required from build.js | VERIFIED | `buildCutout.js` exports `module.exports = { buildCutout, buildSvgString, SHAPE_PRESETS, CUTOUT_CONFIGS }`; `build.js:16` requires it |
| 2 | Five shape presets are authored: circle, down-triangle, up-triangle, pill, rounded-rect (D-04) | VERIFIED | All five keyed in `SHAPE_PRESETS` at `buildCutout.js:29-53`; `grep` count = 6 (one definition each + one CUTOUT_CONFIGS reference) |
| 3 | All shapes in one cutout share a single `<image>` behind a single `<mask>` in one viewBox (D-09) | VERIFIED | `buildSvgString` emits exactly one `<image>` per config; confirmed by `grep -c '<image' dist/index.html` = 2 (one in SVG, one in preload) and the cutout.spec.js single-image count assertion passing |
| 4 | Revealed image is desaturated via an SVG feColorMatrix filter, not CSS filter (D-03) | VERIFIED | `feColorMatrix type="saturate" values="0"` present in `buildCutout.js:142`; `grep -c "feColorMatrix" dist/index.html` = 1; `grep -c "filter: grayscale" css/components.css` = 0 |
| 5 | `node build.js` produces dist/index.html with the hero SVG cutout injected — no CUTOUT marker left (D-10) | VERIFIED | Build exits 0, prints `[buildCutout] injected cutout: hero`; `grep -c "CUTOUT:hero" dist/index.html` = 0; `grep -c '<svg class="cutout' dist/index.html` = 1 |
| 6 | The hero shows a B&W image revealed through a window in the solid Hot Pink section colour (D-01/D-02) | VERIFIED | Hero CSS: `background: var(--color-hot-pink)` (`components.css:135`); SVG uses `feColorMatrix` grayscale (D-03); no gradient in generated SVG; gradient scan on dist/index.html returns zero results |
| 7 | The hero `<head>` preloads the hero image so LCP is preserved (D-06) | VERIFIED | `index.html:27` — `<link rel="preload" href="/images/scene-cafe-960.webp" as="image" fetchpriority="high">`; present in dist output at line 27 |
| 8 | A Playwright spec proves the hero cutout renders, is decorative, carries no base64, and the CUTOUT marker is consumed (D-09) | VERIFIED | `tests/cutout.spec.js` — 90 passed, 0 failed across all three viewport projects; covers build-output + browser-render sides |
| 9 | CLAUDE.md records the cutout primitive as build-time codegen emitting static SVG (D-10a) | VERIFIED | `CLAUDE.md:102-113` — section "Cutout primitive (build-time SVG codegen)" present; `grep -c "buildCutout" CLAUDE.md` = 2; describes marker model, solid-colour field, feColorMatrix, single image, five presets |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `buildCutout.js` | Shape preset library + SVG string generator + buildCutout(manifest) export | VERIFIED | 199 lines; exports `{ buildCutout, buildSvgString, SHAPE_PRESETS, CUTOUT_CONFIGS }`; no base64; no hardcoded paths |
| `build.js` | buildCutout wired at Phase 11 seam; rewriteHeroImg removed; buildCutout.js watched | VERIFIED | `require('./buildCutout')` at line 16; `await buildCutout(manifest)` at line 252 after `buildHtml()`; `rewriteHeroImg` fully absent (grep = 0); `buildCutout.js` in `WATCH_TARGETS` at line 281 |
| `index.html` | Hero marker + preload link replacing the old `<picture class=hero__cutout>` block | VERIFIED | Line 113: `<div class="hero__cutouts"><!-- CUTOUT:hero --></div>`; line 27: preload link; no `<picture class="hero__cutout">` |
| `css/components.css` | `.cutout` primitive class; `.hero__cutout` grayscale/radius rules removed | VERIFIED | `.cutout` at line 230; no `.hero__cutout ` rules (grep = 0); no `filter: grayscale` (grep = 0); no `aspect-ratio` on hero cutout block (grep = 0) |
| `tests/cutout.spec.js` | Build-output + browser-render assertions for the cutout primitive | VERIFIED | 8 describe blocks; 90 tests passing; covers mask IDs, feColorMatrix, scene-cafe-960.webp, marker absence, no-base64, intrinsic width/height, preload link, single `<image>`, aria-hidden |
| `CLAUDE.md` | Cutout primitive note: build-time SVG codegen, source→output marker model | VERIFIED | Section present at line 102; covers all D-10a requirements |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `build.js` | `buildCutout` | `require('./buildCutout')` + `await buildCutout(manifest)` after `buildHtml()` | VERIFIED | Lines 16 + 252; order is buildHtml → buildCutout → copyStatic |
| `index.html <head>` | hero image | `<link rel="preload" as="image">` | VERIFIED | Line 27; present in both source and dist |
| `dist/index.html hero` | scene-cafe webp | generated SVG `<image href>` | VERIFIED | `grep -c "scene-cafe-960.webp" dist/index.html` = 2 (preload + SVG href) |
| `tests/cutout.spec.js` | `dist/index.html` | `fs.readFileSync` assertions on generated SVG | VERIFIED | Asserts `cutout-windows-hero`, `feColorMatrix`, `scene-cafe-960.webp`, marker absence |
| `tests/cutout.spec.js` | rendered page | `page.goto('/') + locator on svg.cutout` | VERIFIED | Browser render tests pass; SVG visible, aria-hidden="true" confirmed |

---

### Data-Flow Trace (Level 4)

Not applicable — `buildCutout.js` is a build-time codegen module, not a component rendering dynamic runtime data. The data flow is: `buildImages()` manifest → `buildCutout(manifest)` → static SVG string → written to `dist/index.html`. This is a build-time pipeline, not a runtime data path.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `node build.js` produces dist/index.html with injected SVG | `node build.js 2>&1 \| tail -3` | `[buildCutout] injected cutout: hero`, `[build] done in 0.0s`, exit 0 | PASS |
| Marker consumed in dist output | `grep -c "CUTOUT:hero" dist/index.html` | 0 | PASS |
| SVG present in dist | `grep -c '<svg class="cutout' dist/index.html` | 1 | PASS |
| No base64 in dist | `grep -c "data:image" dist/index.html` | 0 | PASS |
| cutout.spec.js passes | `npx playwright test tests/cutout.spec.js` | 90 passed, 0 failed | PASS |
| Full suite state | `npx playwright test` | 283 passed, 1 pre-existing nav flake, 31 skipped | PASS |

---

### Probe Execution

No phase-declared probes. Behavioral spot-checks above cover the equivalent ground.

---

### Requirements Coverage

Phase 11 uses decision IDs (D-01 through D-10a) rather than formal REQ IDs.

| Decision | Plan(s) | Status | Evidence |
|----------|---------|--------|----------|
| D-01/D-02 — solid section colour field, no gradient | 02 | SATISFIED | `background: var(--color-hot-pink)` in CSS; no gradient in SVG |
| D-03 — B&W via feColorMatrix, not CSS filter | 01, 03 | SATISFIED | `feColorMatrix type="saturate" values="0"` in generated SVG; `filter: grayscale` removed from CSS |
| D-04 — five shape presets | 01 | SATISFIED | circle, down-triangle, up-triangle, pill, rounded-rect all present in `SHAPE_PRESETS` |
| D-05 — hero refactored onto the new primitive | 02 | SATISFIED | Old `<picture class="hero__cutout">` replaced with `<!-- CUTOUT:hero -->` marker + generated SVG |
| D-06 — external WebP from manifest, no base64, preload | 01, 02 | SATISFIED | href from manifest; no base64; preload link in head |
| D-07 — static render, no scroll animation | 02, 03 | SATISFIED | No animation attributes on cutout; no animation CSS rules; no reveal classes |
| D-08 — reusable build function API `buildCutout(image, shapes)` | 01 | SATISFIED | `async function buildCutout(manifest, opts)` exported; CUTOUT_CONFIGS holds shape composition |
| D-09 — single shared image behind single mask | 01, 03 | SATISFIED | One `<image>` per config; spec asserts this |
| D-10 — deploy-time build command | 02 | SATISFIED | `node build.js` orchestrates the full pipeline; `buildCutout` wired at Phase 11 seam |
| D-10a — CLAUDE.md updated with build model | 03 | SATISFIED | "Cutout primitive (build-time SVG codegen)" section at CLAUDE.md:102 |

---

### Anti-Patterns Found

Scan covered: `buildCutout.js`, `build.js`, `index.html`, `css/components.css`, `tests/cutout.spec.js`.

No TBD, FIXME, XXX, TODO, HACK, or PLACEHOLDER markers found in any phase-modified file. No empty implementations, no hardcoded empty returns, no base64. One intentional code comment in `buildCutout.js` defers the multi-window arrangement to a future iteration — this is a design note, not a stub (the single-window hero is the deliberate D-05 choice).

---

### Human Verification Required

None. All must-haves are mechanically verifiable. Visual quality of the rendered cutout (proportions, Hot Pink field appearance, B&W image through the rounded-rect window) is a natural review item for Kris/Jamie during normal preview use, but it does not gate phase completion.

---

## Gaps Summary

No gaps. All 9 must-haves are verified against the actual codebase. The build produces correct output, the spec passes across all three viewport projects, and CLAUDE.md documents the model accurately.

---

_Verified: 2026-06-02T21:05:00Z_
_Verifier: Claude (gsd-verifier)_
