---
phase: 11-cutout-reveal-system-v1-refresh-p3
reviewed: 2026-06-02T00:00:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - buildCutout.js
  - build.js
  - index.html
  - css/components.css
  - tests/cutout.spec.js
  - tests/build-smoke.spec.js
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: resolved
resolved: 2026-06-02
resolved_count: 9
---

# Phase 11: Code Review Report

**Reviewed:** 2026-06-02
**Depth:** standard
**Files Reviewed:** 6
**Status:** resolved (all 9 findings fixed 2026-06-02 — see Resolution)

## Resolution (2026-06-02)

All 9 findings were fixed after review (post-phase, on `new-site`). The original
findings are preserved below as the record. Per-finding status:

| Finding | Status | Fixed in |
|---------|--------|----------|
| WR-01 unescaped `alt` | ✅ resolved | `ad326c4` — `escapeXml(alt)` in `<title>` |
| WR-02 manifest fallback | ✅ resolved | `ad326c4` — explicit `CUTOUT_IMAGE_WIDTH`, fail-closed throw |
| WR-03 zero-byte cache hit | ✅ resolved | `8155c24` — `allCached` also checks `size > 0` |
| WR-04 silent `if(!x) return` test skips | ✅ resolved | `91e90c1` — assert exports, removed all silent skips |
| IN-01 dead `loading` field | ✅ resolved | `7a537aa` — removed from config + destructure |
| IN-02 magic numbers | ✅ resolved | `ad326c4` — named `CUTOUT_IMAGE_WIDTH`, positional fallback removed |
| IN-03 pill default overshoot | ✅ resolved | `7a537aa` — pill default `h` 519.6 → 519.4 |
| IN-04 backwards smoke message | ✅ resolved | `91e90c1` — reworded for failure clarity |
| IN-05 no-op `await`/reassignment | ✅ resolved | `8155c24` — dropped the reassignment |

Full suite green after fixes: 305 passed, 31 skipped, 0 failed.

---

## Summary

Reviewed the build-time SVG cutout codegen primitive (`buildCutout.js`), its wiring into `build.js`, the hero markup swap in `index.html`, the `.cutout` CSS refactor in `css/components.css`, and the Playwright coverage.

No Critical defects. The security invariant holds for the current closed input set: all SVG-interpolated values come from hardcoded `CUTOUT_CONFIGS` and the build-generated manifest, with no untrusted string reaching the template today. The shipped artifact stays plain static HTML/CSS/JS — the SVG is generated at build time and injected as static markup, no client runtime.

The findings below are robustness and quality issues. The strongest concerns: an unescaped `alt` interpolation that becomes an injection vector the moment config inputs stop being trusted, a fragile manifest-entry fallback that can silently pick the wrong image, a dead `loading` config field that misleads readers, and tests so heavily guarded by `if (!x) return` that they can pass while asserting nothing.

## Warnings

### WR-01: `alt` text interpolated into `<title>` without escaping

**File:** `buildCutout.js:130`
**Issue:** `alt` is injected raw into the SVG title element: `` `<title id="cutout-title-${id}">${alt}</title>` ``. The header comment (lines 8-11) asserts a security invariant that all inputs are controlled, and that is true today (`alt: ''` for the only config). But the function is exported and reusable, and the moment any `alt` value contains `<`, `>`, or `&` it breaks the SVG, and any value sourced from outside the hardcoded config becomes markup injection. The invariant is enforced only by convention, not by code — fragile for a primitive meant to be reused.
**Fix:** Escape on the way in so the safety does not depend on caller discipline:
```js
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const titleEl = isDecorative ? '' : `\n  <title id="cutout-title-${id}">${esc(alt)}</title>`;
```

### WR-02: Manifest entry fallback can silently select the wrong resolution

**File:** `buildCutout.js:104`
**Issue:** `const entry = (entries && entries.find(e => e.w === 960)) || (entries && entries[1]);`. If the 960px width is ever dropped from `IMG_WIDTHS` (currently `[480, 960, 1440, 1920]`), the code silently falls back to `entries[1]` — index 1, which is positional, not width-based. With the current widths that is the 960 entry, but if the array order or contents change, this picks an arbitrary resolution with no warning. The hero preload (`index.html:27`) is hardcoded to `scene-cafe-960.webp`, so a mismatch between the preloaded image and the one the SVG actually references would waste the preload and hurt LCP — the exact metric this phase guards.
**Fix:** Make the desired width explicit in config and fail closed when it is missing:
```js
const wantW = config.hrefWidth || 960;
const entry = entries && entries.find(e => e.w === wantW);
if (!entry) throw new Error(`[buildCutout] no ${wantW}px entry for image: ${image}`);
```

### WR-03: Cache-hit path never refreshes a stale `dist/images/` if a cached output is corrupt

**File:** `build.js:122-133`
**Issue:** `allCached` only checks `fs.existsSync` for each cached output. A zero-byte or truncated cache file (interrupted encode, disk-full) passes `existsSync` and is copied straight to `dist/images/` as a cache hit, shipping a broken image with no re-encode. The build-smoke test guards `dist/` outputs with `.toBeGreaterThan(0)`, but the build itself will happily produce the broken file. The mtime cache trusts existence as a proxy for validity.
**Fix:** At minimum check non-zero size in `allCached`, or invalidate on a size of 0:
```js
const allCached = cachedOutputs.every(p => fs.existsSync(p) && fs.statSync(p).size > 0);
```

### WR-04: Many spec assertions are skipped silently by `if (!x) return` guards

**File:** `tests/cutout.spec.js:94, 103, 113, 122, 131, 147-148, 167, 175, 181, 187, 193, 199, 206, 215, 230-231, 249`
**Issue:** Nearly every module-level test begins `if (!mod.SHAPE_PRESETS) return;` or `if (!svg) return;` and returns as a *passing* test when the export is absent. `SHAPE_PRESETS`, `buildSvgString`, `buildCutout`, and `CUTOUT_CONFIGS` are all exported (`buildCutout.js:199`), so today the guards do not trigger. But if a refactor stops exporting `buildSvgString`, roughly a dozen "passing" tests would quietly assert nothing — green CI with zero coverage of the SVG generator. A test that can pass without running its assertions is not a guard.
**Fix:** Since the exports are part of the contract, assert they exist instead of skipping:
```js
expect(mod.buildSvgString, 'buildSvgString must be exported for unit testing').toBeDefined();
```
Replace the `if (!svg) return;` early-returns with a one-time hard assertion that the export is present.

## Info

### IN-01: Dead `loading` config field

**File:** `buildCutout.js:74, 101`
**Issue:** `loading: 'eager'` is set in `CUTOUT_CONFIGS` and destructured at line 101, but never emitted into the SVG. SVG `<image>` does not honour the HTML `loading` attribute anyway, so the field is misleading dead config — a reader assumes lazy/eager behaviour is wired when it is not.
**Fix:** Remove `loading` from the config and the destructure, or add a comment that it is intentionally unused (LCP is handled by the `<head>` preload + `fetchpriority`).

### IN-02: `entries[1]` fallback and other magic numbers

**File:** `buildCutout.js:104`
**Issue:** The positional index `1` and width `960` are magic numbers with no named constant. Covered functionally by WR-02; flagging the readability cost separately.
**Fix:** Name the intended href width as a config field or module constant.

### IN-03: Pill preset default bottom edge exceeds the hero viewBox

**File:** `buildCutout.js:43`
**Issue:** Pill default is `y = 544.6, h = 519.6` → bottom edge 1064.2, just past the hero viewBox height of 1064 (`CUTOUT_CONFIGS` line 71). Harmless today because the hero uses `rounded-rect`, not `pill`, but if a future config drops the pill into the hero viewBox it clips by 0.2 units. The presets carry demo-era defaults that do not match the hero viewBox.
**Fix:** Document that preset defaults assume the demo's `0 0 1000 1064` framing, or recompute pill `y`/`h` to sit inside the box.

### IN-04: Smoke-test assertion message contradicts the test name

**File:** `tests/build-smoke.spec.js:98-100`
**Issue:** The test is titled "exists and is minified (smaller than source)" but the failure message reads "must be smaller than source ... — CSS not minified". The message negates the intent; on failure it reads as if the expectation is *not* minified. Confusing for whoever debugs a red build.
**Fix:** Reword the message to "CSS appears not minified (dist not smaller than source)".

### IN-05: `buildCutout` returns the manifest unchanged but is `await`ed and reassigned

**File:** `build.js:252`, `buildCutout.js:196`
**Issue:** `manifest = await buildCutout(manifest);` — `buildCutout` does only synchronous `fs` reads/writes and returns the same manifest reference unmodified (verified by the spec at `cutout.spec.js:296-304`). The `async`/`await` and the reassignment imply the manifest may change; it never does. Minor readability/honesty issue in the seam.
**Fix:** Either keep the signature for future-proofing (fine) but drop the reassignment to `manifest = ...` since the return is the same object, or document that the return is identity for pipeline-chaining symmetry.

---

_Reviewed: 2026-06-02_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
