---
phase: 12-build-pipeline-tooling-foundation
reviewed: 2026-06-02T00:00:00Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - build.js
  - build.sh
  - bs-config.js
  - playwright.config.js
  - package.json
  - tests/build-smoke.spec.js
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 12: Code Review Report

**Reviewed:** 2026-06-02
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Reviewed the Phase 12 build pipeline: `build.js` orchestrator, `build.sh` Cloudflare gate, dev/test tooling config, and the build-smoke spec. No Critical defects — there is no path traversal, no secret leak, `cleanDist` cannot escape `dist/`, and the branch gate fails safe (it errors rather than builds on the wrong branch). But four Warnings affect correctness and CI reliability, the most important being a stale-server bug in the Playwright config and a `set -u` crash in `build.sh` when `CF_PAGES_BRANCH` is unset.

## Warnings

### WR-01: `reuseExistingServer: true` lets Playwright skip the build and test stale dist/

**File:** `playwright.config.js:30`
**Issue:** `webServer.command` is `npm run build && python3 -m http.server 7777 --directory dist`. With `reuseExistingServer: true`, Playwright runs the command only when port 7777 is free. If any server already holds 7777 — a leftover python server, a re-run after a crash, or a parallel job — Playwright reuses it and **skips the build entirely**. Tests then assert against whatever stale `dist/` happens to be on disk. A green run no longer proves the current source builds correctly. This silently defeats BUILD-06 ("build first, then serve").
**Fix:** Gate reuse on local dev only, so CI always rebuilds:
```js
webServer: {
  command: 'npm run build && python3 -m http.server 7777 --directory dist',
  port: 7777,
  reuseExistingServer: !process.env.CI,
  timeout: 60_000,
},
```

### WR-02: `build.sh` aborts under `set -u` when `CF_PAGES_BRANCH` is unset

**File:** `build.sh:11,13`
**Issue:** `set -euo pipefail` plus the bare `[ "${CF_PAGES_BRANCH}" = "new-site" ]` means that if `CF_PAGES_BRANCH` is ever unset, the script exits non-zero on the unbound-variable error before the gate decides anything. Cloudflare normally injects the var, but: (a) running `bash build.sh` locally for testing crashes immediately; (b) Cloudflare's "Deploy Hooks" and some preview contexts have historically left branch env vars empty; (c) a non-zero exit reads to Cloudflare as a build failure, not a clean no-op. The gate's safety story ("exit 0 on all other branches") does not hold for the unset case.
**Fix:** Default the variable so the gate evaluates deterministically and the no-op branch is reachable:
```bash
if [ "${CF_PAGES_BRANCH:-}" = "new-site" ]; then
```

### WR-03: Deleted source images leave stale encodes that ship forever

**File:** `build.js:100-170`
**Issue:** The mtime cache (`.cache/images.json`) and the encoded-output store (`.cache/images/`) are only ever added to. If a raster is removed from `images/` (e.g. `scene-cafe.webp` renamed), its old `.cache/images/<name>-*.avif|webp` files remain and the loop over `rasters` no longer references them — so they stop reaching `dist/`. That part is fine. The real defect: stale `cache[rasterFile]` entries and orphaned cache files accumulate and are never pruned, and if a file is renamed back later the cache may match an outdated mtime mapping. More concretely, there is no invalidation when `IMG_WIDTHS`, sharp quality, or sharp version changes — the cache key is filename+mtime only, so a quality/encoder change silently serves old encodes from cache until the source mtime changes.
**Fix:** Include encoder-affecting inputs in the cache key, e.g. hash `{mtimeMs, IMG_WIDTHS, avifQ, webpQ, sharpVersion}` into the stored value, and treat any mismatch as a miss. Optionally prune `.cache/images/` entries whose basename is no longer in `rasters`.

### WR-04: `build:watch` orphans the build watcher and ignores initial-build failure

**File:** `package.json:7`
**Issue:** `node build.js --watch & browser-sync start --config bs-config.js` backgrounds the watcher with `&` and never `wait`s. Two problems: (1) if `browser-sync` exits (or the user Ctrl-Cs it), the backgrounded `node build.js --watch` keeps running orphaned, still holding fs watches; (2) browser-sync starts serving `dist/` regardless of whether the watcher's initial `build()` succeeded — on a build error you get a served-but-stale or empty `dist/` with no signal. The `&` also means the npm script's exit code reflects only browser-sync, masking watcher crashes.
**Fix:** Use a small process manager (`concurrently` / `npm-run-all -p`) so both processes share lifecycle and a failure in either tears down both, e.g. `concurrently -k "node build.js --watch" "browser-sync start --config bs-config.js"`. At minimum, document that Ctrl-C may leave the watcher running.

## Info

### IN-01: `lightningcss` `result.code` is a Buffer written without confirming success

**File:** `build.js:74-80`
**Issue:** `transform()` returns warnings in `result.warnings` which are silently discarded. Genuine CSS errors throw (handled by the top-level catch), but parse warnings that may indicate dropped rules go unreported.
**Fix:** If `result.warnings?.length`, log them so silent rule-dropping is visible.

### IN-02: Hero `<img>` regex truncates on `>` inside an attribute value

**File:** `build.js:209`
**Issue:** `inner.match(/<img\b[\s\S]*?>/)` is non-greedy and stops at the first `>`. If any attribute value on the hero `<img>` ever contains a literal `>` (rare but legal in HTML), the captured tag is truncated and the rewrite produces malformed markup. Current source has no such attribute, so this is latent.
**Fix:** Match to the closing `>` more defensively, or parse attributes explicitly. Low priority while the hero img stays simple.

### IN-03: `IMG_WIDTHS` and `CSS_FILES` are duplicated across build.js and the spec

**File:** `build.js:29-38`, `tests/build-smoke.spec.js:84,106`
**Issue:** The width list and CSS file list are hardcoded in both files. They can drift — a new CSS file or width added to `build.js` won't be asserted, and the spec gives false confidence.
**Fix:** Export the constants from `build.js` (or a shared `build.config.js`) and import them in the spec.

### IN-04: CSS "minified" assertion is size-based and brittle

**File:** `tests/build-smoke.spec.js:96-100`
**Issue:** `distSize < srcSize` proves only that output is smaller, not that it is valid minified CSS. A truncated/partial write would also pass. A tiny already-dense CSS file could legitimately fail.
**Fix:** Assert on a minification signature (no double-newlines, no leading indentation) rather than raw size, or additionally parse the output.

### IN-05: `cleanDist` wipes `dist/` with no guard that `DIST` resolves under `ROOT`

**File:** `build.js:44-48`
**Issue:** `DIST` is derived from `__dirname` so it is safe today. But `fs.rmSync(DIST, { recursive: true, force: true })` is an unguarded recursive delete; any future refactor that lets `DIST` be overridden (env var, CLI arg) would make this a foot-gun.
**Fix:** Add a one-line assertion before the rm: `if (!DIST.startsWith(ROOT) || DIST === ROOT) throw new Error('unsafe DIST')`.

---

_Reviewed: 2026-06-02_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
