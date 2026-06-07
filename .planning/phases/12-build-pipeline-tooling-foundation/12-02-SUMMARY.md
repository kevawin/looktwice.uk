---
phase: 12-build-pipeline-tooling-foundation
plan: "02"
subsystem: build-pipeline
tags: [build, playwright, browser-sync, dev-server, watch-mode, hot-reload]
dependency_graph:
  requires:
    - build.js orchestrator (12-01)
    - dist/ output model (12-01)
  provides:
    - Playwright builds then serves dist/ on 7777 (BUILD-06)
    - browser-sync serves dist/ on 3000 with source-watch rebuild (BUILD-05)
    - build.js --watch flag with fs.watch + 200ms debounce
    - Dev-3000 / test-7777 split preserved (CLAUDE.md hard rule)
  affects:
    - playwright.config.js
    - bs-config.js
    - build.js
    - package.json
tech_stack:
  added: []
  patterns:
    - build.js --watch: initial build + fs.watch source dirs with 200ms debounce, writes to dist/
    - browser-sync watches dist/** and reloads after rebuild lands
    - Playwright webServer builds first (npm run build) then serves --directory dist on 7777
key_files:
  created: []
  modified:
    - playwright.config.js
    - bs-config.js
    - build.js
    - package.json
decisions:
  - build:watch uses --config bs-config.js (not inline CLI flags) to preserve lanIp() + phone URL print
  - fs.watch with 200ms debounce instead of chokidar (no extra dep; chokidar already in tree transitively but not needed here)
  - browser-sync watches dist/** (not source dirs) — decouples rebuild from reload; build.js owns rebuild, browser-sync owns reload
  - webServer.timeout raised to 60_000 (first build includes image encode which can take several seconds)
metrics:
  duration: "~10 minutes"
  completed: "2026-06-02"
  tasks: 2
  files: 4
requirements_met: [BUILD-05, BUILD-06]
---

# Phase 12 Plan 02: Dev and Test Tooling Wired to dist/ Summary

Playwright builds first then serves dist/ on 7777; browser-sync serves dist/ on 3000 with fs.watch source-rebuild and hot reload. Full suite (194 tests) passes against built output. Dev-3000 / test-7777 split preserved.

## What Was Built

**playwright.config.js** — single change: `webServer.command` updated from `python3 -m http.server 7777` to `npm run build && python3 -m http.server 7777 --directory dist`. Timeout raised from 15_000 to 60_000 to accommodate the first build's image encode step. All other config (port 7777, reuseExistingServer, three viewport projects) unchanged.

**bs-config.js** — two changes only (everything else preserved verbatim):
- `server: '.'` → `server: 'dist'` (serve built output, not source root)
- `files: ['index.html', 'css/*.css', 'js/*.js', 'images/*']` → `files: ['dist/**']` (reload after rebuild lands in dist/, not on source change directly)
The `lanIp()` helper, `ready()` phone-URL print, port 3000, `open/notify/ui: false` all unchanged.

**build.js** — `--watch` flag added at the bottom. When `process.argv.includes('--watch')`:
1. Runs a full initial build (same `build()` call as normal mode)
2. Registers `fs.watch` on five source targets: `index.html`, `css/`, `js/`, `images/`, `_headers`
3. Any change triggers a 200ms debounce, then calls `build()` again
4. Outputs land in `dist/`, which browser-sync (watching `dist/**`) detects and reloads

No extra dependency — `fs.watch` is built-in. The watch targets match exactly the source inputs to all five build steps.

**package.json** — `build:watch` updated from inline CLI args to `node build.js --watch & browser-sync start --config bs-config.js` so the LAN-IP-aware phone URL print from `bs-config.js` is preserved. `dev` already aliases `npm run build:watch`. `test` and `test:ui` already run `npm run build &&` first (set in 12-01).

## Commits

- `1ea7cae` — feat(12-02): repoint Playwright to build-first, serve dist/ on 7777
- `dfffa22` — feat(12-02): browser-sync serves dist/ with source-watch rebuild + hot reload

## Verification Results

All acceptance criteria passed:

- `playwright.config.js` webServer.command contains `npm run build` and `--directory dist`; timeout is 60_000. Confirmed.
- `npm test` exits 0 — build runs (cache hit in 0.0s), then 194 tests pass across 3 viewport projects (31 skipped as expected for build-smoke desktop-only assertions).
- `contact-form.spec.js` and `nav-floating-bar.spec.js` pass against dist/ output. Confirmed — no selector or content regressions from build rewrite.
- `build-smoke.spec.js` (from 12-01) also passes in the same run. Confirmed.
- `bs-config.js` loads without error, serves `dist`, watches `dist/**`, port 3000, phone LAN URL printed via `ready()`. Confirmed via `node -e "require('./bs-config.js')"`.
- `build.js --watch` runs initial build then enters watch loop printing `[build:watch] Watching source files…`. Confirmed.
- Dev port (3000) and test port (7777) remain distinct. Confirmed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing critical functionality] build:watch was using inline CLI args, losing phone URL print**

- Found during: Task 2 implementation review
- Issue: The pre-existing `build:watch` script (`node build.js --watch & browser-sync start --server dist --files 'dist/**' --port 3000 --no-open --no-ui`) bypassed `bs-config.js` entirely. This meant `lanIp()` and the `ready()` phone-URL print were silently dropped — a CLAUDE.md requirement ("prints an External LAN URL for phone testing").
- Fix: Changed `build:watch` to `node build.js --watch & browser-sync start --config bs-config.js`, restoring the phone URL print while keeping `bs-config.js` as the single source of browser-sync config.
- Files modified: package.json
- Commit: dfffa22

## Known Stubs

None. All wired to real dist/ output. No placeholder data.

## Threat Flags

None. This plan only modifies dev/test tooling config. No new network endpoints, auth paths, or trust-boundary changes.

Threat mitigations from the plan's threat model are implemented:
- T-12-03: playwright webServer builds first then serves `--directory dist`; existing specs re-run against dist/ confirm parity. Confirmed: 194 passed.
- T-12-04: Dev (3000) and test (7777) remain on separate ports. Confirmed.

## Self-Check: PASSED
