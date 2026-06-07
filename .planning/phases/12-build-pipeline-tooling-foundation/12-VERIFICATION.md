---
phase: 12-build-pipeline-tooling-foundation
verified: 2026-06-02T21:00:00Z
status: passed
score: 9/10 must-haves verified (1 owner-deferred to cutover)
overrides_applied: 0
deferred:
  - truth: "A trivial commit to main leaves the live looktwice.uk holding page unchanged"
    addressed_in: "Phase 5 cutover"
    evidence: "05-CUTOVER-PLAYBOOK.md §'A1 caveat — main no-op behaviour' records this as a required cutover step; 12-03-SUMMARY.md §'Open Verification Items' explicitly marks it DEFERRED by owner (Jamie) decision — no main commit until cutover, gate revisited at that point; two-projects fallback documented as contingency"
resolved_human_items:
  - test: "Reconcile 05-CUTOVER-PLAYBOOK.md A1 caveat wording against the deferred state"
    resolution: "Playbook text corrected after verification: the stale 'This was human-verified' sentence (authored in 21097e2 before the deferral decision) is replaced with an explicit 'NOT YET VERIFIED — deferred to cutover' note matching 12-03-SUMMARY. No contradiction remains."
---

# Phase 12: Build Pipeline Tooling Foundation — Verification Report

**Phase Goal:** Convert the project from "static files served as-is" to a built artifact, so later phases have a real pipeline. Set the Cloudflare Pages build command, add build-time image optimization (responsive srcset + AVIF/WebP + compression), CSS/JS minify + autoprefix (Lightning CSS chosen), and point browser-sync (3000) + Playwright (7777) at the built output. Records the CLAUDE.md tech-stack relaxation (2026-06-02): build step + npm deps now allowed; shipped artifact stays plain static HTML/CSS/JS, no client-side framework, no Tailwind.
**Verified:** 2026-06-02T21:00:00Z
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | npm run build exits 0 and produces dist/index.html | VERIFIED | Build ran cleanly: `[build] done in 0.0s` (cache hit); dist/index.html confirmed present |
| 2 | dist/css holds 5 minified files with the same names as source | VERIFIED | All 5 present (tokens, base, layout, components, animations); components.css 29450→18915 bytes, tokens.css 3616→1461 bytes |
| 3 | dist/images holds AVIF + WebP for scene-cafe at widths 480/960/1440/1920 | VERIFIED | All 8 variants confirmed: scene-cafe-{480,960,1440,1920}.avif and .webp present and non-empty |
| 4 | dist/_headers is byte-identical to source _headers | VERIFIED | `diff _headers dist/_headers` empty; build-smoke spec asserts this |
| 5 | dist/js/main.js is byte-identical to source js/main.js (no minify, D-01) | VERIFIED | `diff js/main.js dist/js/main.js` empty |
| 6 | A second consecutive build skips unchanged image encodes via mtime cache | VERIFIED | Build output shows `[build] images: skipped scene-cafe.webp (cache hit)` and `[build] done in 0.0s` on second run |
| 7 | npm test builds first, then runs Playwright against dist/ on port 7777 | VERIFIED | playwright.config.js webServer.command = `npm run build && python3 -m http.server 7777 --directory dist`; timeout 60_000; reuseExistingServer: !process.env.CI |
| 8 | npm run dev builds, serves dist/ on 3000, and rebuilds on source change with hot reload | VERIFIED | bs-config.js: server='dist', files=['dist/**']; package.json build:watch: `node build.js --watch & WATCH_PID=$!; trap 'kill $WATCH_PID 2>/dev/null' EXIT INT TERM; browser-sync start --config bs-config.js` |
| 9 | build.sh runs npm ci + npm run build only on the new-site branch; exits 0 on all other branches without producing dist/ | VERIFIED | `CF_PAGES_BRANCH=main bash build.sh` exits 0, prints "Branch 'main' — no build"; gate uses `${CF_PAGES_BRANCH:-}` (WR-02 fixed); `bash -n build.sh` passes |
| 10 | A trivial commit to main leaves the live looktwice.uk holding page unchanged | DEFERRED | See deferred section — explicitly deferred by owner (Jamie) to cutover. Note: playbook text claims this was verified (documentation inconsistency — see human verification item) |

**Score:** 9/10 truths verified (1 deferred by owner decision)

---

### Deferred Items

Items not yet met but explicitly deferred to a later milestone event.

| # | Item | Addressed At | Evidence |
|---|------|-------------|----------|
| 1 | A trivial commit to main leaves the live looktwice.uk holding page unchanged | Phase 5 cutover | 12-03-SUMMARY §'Open Verification Items': "NOT VERIFIED. Explicitly deferred by technical owner (Jamie) before cutover." 05-CUTOVER-PLAYBOOK.md §'Cutover impact on the gate' records the required gate-update steps. Two-projects fallback documented as contingency if single-project gate is unreliable. |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `build.js` | Sequential pure-Node build orchestrator (CSS, images, HTML rewrite, static copy) | VERIFIED | 362 lines; all 5 steps present (cleanDist, buildCss, buildImages, buildHtml, copyStatic); Phase 11 seam comment at line 298; --watch mode at line 324 |
| `tests/build-smoke.spec.js` | Build-integrity assertions against dist/ | VERIFIED | 151 lines; 18 assertions covering all 7 categories; asserts dist/_headers, main.js byte-identical, CSS minified, AVIF/WebP variants, srcset, no mailto |
| `package.json` | build script + sharp/lightningcss devDependencies + build:watch | VERIFIED | `"build": "node build.js"`, `"test": "npm run build && playwright test"`, `"build:watch"` present; sharp@^0.34.5 and lightningcss@^1.32.0 in devDependencies |
| `playwright.config.js` | webServer that builds then serves dist/ on 7777 | VERIFIED | command = `npm run build && python3 -m http.server 7777 --directory dist`; timeout 60_000; reuseExistingServer: !process.env.CI |
| `bs-config.js` | browser-sync serving dist/ with source-watch rebuild | VERIFIED | server: 'dist'; files: ['dist/**']; port 3000; lanIp() + ready() phone URL print preserved |
| `build.sh` | Cloudflare branch-gated build wrapper keyed on CF_PAGES_BRANCH | VERIFIED | Gates on `${CF_PAGES_BRANCH:-}=new-site`; uses npm ci; exits 0 cleanly on all other branches; executable; passes bash -n |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| build.js | dist/index.html | `<img>` rewrite injecting `<source srcset>` | VERIFIED | rewriteHeroImg() confirmed; dist/index.html contains `type="image/avif"`, `type="image/webp"`, `srcset` with all 4 widths, `fetchpriority="high"` on fallback img |
| build.js | dist/_headers | fs.copyFileSync in copyStatic() | VERIFIED | `{ src: '_headers', dest: '_headers' }` in copies array; diff confirms byte-identical |
| build.sh | npm run build | gated on CF_PAGES_BRANCH = new-site | VERIFIED | `if [ "${CF_PAGES_BRANCH:-}" = "new-site" ]; then npm ci && npm run build` |
| playwright.config.js | dist/ | webServer command builds then http.server --directory dist | VERIFIED | `--directory dist` present in webServer.command |
| bs-config.js | dist/ | server: 'dist' | VERIFIED | `server: 'dist'` confirmed at line 20 |

---

### Data-Flow Trace (Level 4)

Not applicable — this phase produces build tooling, not components that render dynamic data. The built artifacts (dist/) are static outputs, not runtime data flows.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Build exits 0 and produces dist/ | `node build.js` | `[build] done in 0.0s` — dist/ populated | PASS |
| AVIF/WebP 8 variants present at 4 widths | `ls dist/images/scene-cafe-{480,960,1440,1920}.{avif,webp}` | All 8 files listed | PASS |
| _headers byte-identical | `diff _headers dist/_headers` | Empty diff | PASS |
| main.js not minified | `diff js/main.js dist/js/main.js` | Empty diff | PASS |
| CSS minified (components.css) | `wc -c css/components.css dist/css/components.css` | 29450 → 18915 bytes | PASS |
| Hero srcset injected with AVIF + WebP sources | `grep 'type="image/avif"' dist/index.html` | Line found with 4-width srcset | PASS |
| No mailto leak | `grep 'hello@looktwice.uk' dist/index.html` | No match | PASS |
| build.sh no-ops on main | `CF_PAGES_BRANCH=main bash build.sh` | Exits 0, prints "no build" | PASS |
| build.sh unset CF_PAGES_BRANCH | `bash build.sh` (no env var) | Exits 0 via `:-` default expansion | PASS |
| Mtime cache hit on second build | Second `node build.js` run | "cache hit" log lines, 0.0s completion | PASS |

---

### Probe Execution

No probe scripts exist for this phase. Step 7c: SKIPPED (no probe-*.sh files in scripts/).

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|---------|
| BUILD-01 | 12-01 | dist/index.html produced | SATISFIED | File present, non-empty |
| BUILD-02 | 12-01 | _headers + main.js byte-identical in dist/ | SATISFIED | diff confirms |
| BUILD-03 | 12-01 | CSS minified at 5 files | SATISFIED | All 5 present, each smaller than source |
| BUILD-04 | 12-01 | 4-width AVIF+WebP variants present | SATISFIED | All 8 variants confirmed |
| BUILD-05 | 12-02 | browser-sync serves dist/ with hot reload | SATISFIED | bs-config.js wired to dist/ |
| BUILD-06 | 12-02 | Playwright builds first, serves dist/ on 7777 | SATISFIED | playwright.config.js webServer command verified |
| BUILD-07 | 12-03 | Cloudflare branch-gated build | SATISFIED | build.sh gate verified locally; Cloudflare config set; new-site preview confirmed serving built dist/ with HSTS/CSP/Permissions-Policy per SUMMARY (curl -sI verified live) |
| BUILD-08 | 12-01 | mtime skip-cache for fast dev rebuilds | SATISFIED | Cache-hit log lines confirmed on second build |

---

### Anti-Patterns Found

No TBD, FIXME, or XXX debt markers in any phase file. No placeholder implementations.

The code review (12-REVIEW.md) documented 4 warnings. Two were fixed before this verification:

- WR-01 (stale-server Playwright): FIXED — `reuseExistingServer: !process.env.CI` confirmed at playwright.config.js:32
- WR-02 (build.sh set -u crash when CF_PAGES_BRANCH unset): FIXED — `${CF_PAGES_BRANCH:-}` confirmed at build.sh:13

Two warnings remain open (carried forward from the review, not phase blockers):

| File | Warning | Severity | Impact |
|------|---------|----------|--------|
| `package.json:7` | WR-04: build:watch uses `&` to background watcher; partial mitigation via trap, but browser-sync start doesn't wait for initial build — stale/empty dist/ may be served if build fails | Warning | Dev UX only; does not affect CI or shipped output |
| `build.js:100-170` | WR-03: mtime cache key is filename+mtime only; quality/width changes do not invalidate the cache | Info | Latent; only triggers if IMG_WIDTHS or quality constants change without a source file touch |

Note: WR-04 is partially mitigated. The `package.json:7` script now uses `WATCH_PID=$!; trap 'kill $WATCH_PID 2>/dev/null' EXIT INT TERM` which handles cleanup on browser-sync exit. The "start serving before initial build completes" problem (surfaced in the review) is structurally present but low impact in practice — browser-sync starts fast; the initial build completes in < 1s on cache hit.

---

### Human Verification Required

#### 1. Cutover Playbook A1 Caveat — Documentation Accuracy

**Test:** Read 05-CUTOVER-PLAYBOOK.md §'A1 caveat — main no-op behaviour' (around line 197). It currently reads: *"This was human-verified: a trivial commit was pushed to `main` and the live `looktwice.uk` holding page confirmed unchanged (Task 3, checkpoint:human-verify, Plan 12-03)."*

**Expected:** This sentence is either accurate (Jamie ran the main-commit check and it was recorded verbally, just not as a separate commit) or it is a documentation error and should instead read: *"As of Phase 12, this has not yet been verified — the check is required before or at cutover (see Cutover impact on the gate below)."*

**Why human:** Commit 21097e2 authored the playbook text claiming the check was done. The 12-03-SUMMARY.md from the same session records Task 3 as explicitly DEFERRED. These cannot both be correct. Only Jamie can confirm whether the main-commit test was actually run. If it was not run, the playbook text must be corrected to avoid false confidence that the A1 risk has been closed.

---

### Gaps Summary

No hard gaps. All 9 verifiable must-haves are confirmed in the codebase. The one deferred item (live-main no-op check) is correctly recorded as out-of-scope until cutover, with contingency documented.

The single human verification item is a documentation inconsistency, not a missing implementation. It does not block new-site development.

---

_Verified: 2026-06-02T21:00:00Z_
_Verifier: Claude (gsd-verifier)_
