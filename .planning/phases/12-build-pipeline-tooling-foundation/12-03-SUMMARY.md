---
phase: 12-build-pipeline-tooling-foundation
plan: 03
subsystem: infra
tags: [cloudflare-pages, build-pipeline, branch-gate, security-headers, CF_PAGES_BRANCH]

# Dependency graph
requires:
  - phase: 12-build-pipeline-tooling-foundation
    provides: "12-01 built AVIF/WebP images + _headers into dist/; 12-02 wired browser-sync + Playwright to serve dist/"
provides:
  - "Cloudflare branch-gated build.sh: builds on new-site, no-ops on all other branches"
  - "Cloudflare Pages config: Build command = bash build.sh, Output directory = dist/"
  - "Preview-verified: new-site deploy serves built dist/ with HSTS/CSP/Permissions-Policy headers"
  - "Cutover playbook updated with build model, A1 caveat, and two-projects fallback"
affects:
  - 05-hardening-launch
  - future cutover of new-site to main

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CF_PAGES_BRANCH gate: single Cloudflare Pages project; build.sh gates on CF_PAGES_BRANCH=new-site, exits 0 on all other branches without touching dist/"
    - "npm ci in CI for supply-chain pin against committed package-lock.json"

key-files:
  created:
    - build.sh
  modified:
    - .planning/phases/05-hardening-launch/05-CUTOVER-PLAYBOOK.md

key-decisions:
  - "Task 3 (live-main no-op verification) deferred to cutover by explicit owner decision — no one will commit to main until the new design is built and cut over, so forcing a trivial commit now is unnecessary risk with no production benefit"
  - "Two-projects fallback remains documented in cutover playbook as contingency if single-project gate proves unreliable at cutover"
  - "npm ci used in build.sh (not npm install) to pin against package-lock.json — supply-chain mitigation T-12-SC"

patterns-established:
  - "Branch-gated build wrapper: build.sh checks CF_PAGES_BRANCH, builds only the target branch, no-ops cleanly on others"

requirements-completed: [BUILD-07]

# Metrics
duration: multi-session (Tasks 1-2 complete; Task 3 deferred by owner decision)
completed: 2026-06-02
---

# Phase 12 Plan 03: Cloudflare Branch-Gated Build Summary

**Branch-gated build.sh + Cloudflare Pages config verified on preview: new-site builds into dist/ with HSTS/CSP/Permissions-Policy headers present; live-main no-op check deferred to cutover by owner decision.**

## Performance

- **Duration:** Multi-session (Tasks 1-2 automated; Task 3 human-verify deferred)
- **Completed:** 2026-06-02
- **Tasks:** 2/3 complete (Task 3 deferred — see Open Verification Items below)
- **Files modified:** 2

## Accomplishments

- build.sh created at repo root: gates on `CF_PAGES_BRANCH=new-site`, runs `npm ci + npm run build` only on that branch, exits 0 cleanly on all other branches without creating or altering dist/.
- Cloudflare Pages build config set by operator: Build command = `bash build.sh`, Output directory = `dist/`.
- new-site preview https://new-site.looktwice-uk.pages.dev verified live: styled page renders, hero `<picture>` serves AVIF+WebP responsive sources at 480/960/1440/1920w, and `curl -sI` returns Strict-Transport-Security, Content-Security-Policy, and Permissions-Policy headers — confirming dist/_headers landed (T-12-01 mitigated).
- 05-CUTOVER-PLAYBOOK.md updated: documents the build command, output dir, CF_PAGES_BRANCH gate, Research A1 caveat (Cloudflare does not document single-project no-op behaviour), and two-projects fallback.

## Task Commits

1. **Task 1: Author build.sh branch gate + update cutover playbook** - `21097e2` (feat)
2. **Task 2: Set Cloudflare Pages build config + confirm preview serves built dist/** - `21097e2` (included in same commit; Cloudflare config set via operator dashboard action)
3. **Task 3: Confirm main commit leaves live holding page untouched** - DEFERRED (see Open Verification Items)

## Files Created/Modified

- `build.sh` — Cloudflare branch-gated build wrapper; gates `npm ci + npm run build` on `CF_PAGES_BRANCH=new-site`, no-ops with exit 0 on all other branches
- `.planning/phases/05-hardening-launch/05-CUTOVER-PLAYBOOK.md` — Added section documenting new build model: build command, output dir, CF_PAGES_BRANCH gate, A1 caveat, two-projects fallback, and note that the gate condition must be revisited at cutover

## Decisions Made

- **Task 3 deferred by owner.** Cloudflare does not auto-rebuild main when the global build config changes — it only applies on the next main deploy. No one will commit to main until the new design is cut over. Forcing a trivial main commit now is unnecessary risk with no benefit. The live-main no-op behaviour (Research A1) remains unverified-by-design until cutover. The two-projects fallback is documented in the cutover playbook as the contingency if the single-project gate proves unreliable.
- At cutover (new-site → main): the gate condition must be revisited. The cutover playbook records this.

## Open Verification Items

**[DEFERRED — owner decision] must_have: "A trivial commit to main leaves the live looktwice.uk holding page unchanged"**

- Status: NOT VERIFIED. Explicitly deferred by technical owner (Jamie) before cutover.
- Reason: No main commit is planned until cutover. Triggering one now adds unnecessary live-domain risk for a gate that will need to be revisited anyway when new-site becomes main.
- Risk: Research A1 flags that Cloudflare's single-project no-op behaviour when build.sh exits 0 without producing dist/ is not documented. If main rebuilds incorrectly after a future commit, the holding page could be affected.
- Contingency: Two-projects fallback documented in 05-CUTOVER-PLAYBOOK.md (one Pages project watches main with no build, one watches new-site with `bash build.sh` + `dist/`). Apply at cutover if the single-project gate is unreliable.
- Gate must be closed: at cutover, before or immediately after merging new-site to main.

## Deviations from Plan

None for Tasks 1 and 2 — executed as specified. Task 3 not executed by owner decision (not a deviation from plan execution; a deliberate deferral of the blocking human-verify gate).

## Issues Encountered

None for Tasks 1 and 2. Preview verification confirmed all must_have truths covered by those tasks.

## User Setup Required

None beyond the Cloudflare dashboard config already applied by the operator (Build command = `bash build.sh`, Output directory = `dist/`).

## Threat Surface Scan

No new runtime attack surface introduced. T-12-01 (security headers dropped on preview) mitigated — headers confirmed present on new-site preview. T-12-SC (supply-chain in CI build) mitigated — `npm ci` used. T-12-05 (live holding page tampered by global Cloudflare build command) partially mitigated: build.sh gate exists and is deployed, but the live-main no-op behaviour remains unverified until Task 3 is closed at cutover.

## Next Phase Readiness

- build.sh and Cloudflare config are live and working on new-site. Phase 12 tooling foundation is complete for active development.
- The one open item (Task 3 / T-12-05 partial) does not block new-site development — it only needs to be closed before or at cutover.
- Phase 13 (or continued new-site build work) can proceed.

---
*Phase: 12-build-pipeline-tooling-foundation*
*Completed: 2026-06-02*

## Self-Check: PASSED (with noted deferred item)

- `build.sh` exists and is committed: confirmed (21097e2).
- Cloudflare new-site preview serves built dist/ with security headers: confirmed live at https://new-site.looktwice-uk.pages.dev.
- 05-CUTOVER-PLAYBOOK.md updated: confirmed (21097e2).
- Task 3 / live-main verification: explicitly marked DEFERRED — not claimed as passed.
