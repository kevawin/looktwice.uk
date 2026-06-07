# Phase 12: Build pipeline & tooling foundation - Context

**Gathered:** 2026-06-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Convert the project from "static files served as-is" to a built artifact, so later phases (starting with the Phase 11 cutout build function) run on a real pipeline. Stand up a Cloudflare Pages build command, build-time image optimization, CSS minify/autoprefix, and wire dev + test to serve the built output. The shipped artifact stays plain static HTML/CSS/JS — no client-side framework runtime, no Tailwind.

**In scope:**
- A Node build orchestrator (`build.js`) + `npm run build`.
- Image optimization (sharp): AVIF + WebP, multiple widths, srcset wiring.
- CSS minify + autoprefix + nesting (Lightning CSS).
- `dist/` output model; Cloudflare Pages build command + output dir.
- Dev (browser-sync) and test (Playwright) served from built `dist/` output.
- Copying static assets (`_headers`, `robots.txt`, `favicon.svg`, `fonts/`) into `dist/`.
- `.gitignore` for `dist/`; `package.json` scripts; `playwright.config.js` + `bs-config.js` updates.

**Out of scope (other phases):**
- The `buildCutout(image, shapes)` cutout codegen itself → Phase 11 (this phase only establishes the `build.js` it plugs into).
- JS bundling / framework adoption (explicitly not doing — see D-01).
- Any visual/markup/copy change to the site (infra only).
</domain>

<decisions>
## Implementation Decisions

### Build tooling
- **D-01:** A small Node orchestrator `build.js` runs the steps. Two focused deps: **sharp** (image optimization) and **Lightning CSS** (CSS minify + autoprefix + nesting — one fast dep, no PostCSS plugin chain). JS minify is **optional/deferred** — `main.js` is 344 lines and Cloudflare serves compressed; revisit only if it matters. No esbuild, no bundler.

### Source → output model
- **D-02:** Source files (`index.html`, `css/`, `js/`, `images/`) stay committed and authored as-is. `build.js` writes processed output to **`dist/`** (gitignored). Cloudflare Pages **output directory = `dist/`**. No in-place mutation of committed files — source vs output is never ambiguous. Build-generated content (the Phase 11 cutout SVGs) is injected into the `dist/` HTML, not into the committed `index.html`.

### Image pipeline
- **D-03:** sharp emits **AVIF + WebP** at widths **480 / 960 / 1440 / 1920**, with `srcset` wired by the build. Source originals (`images/*.webp` and any future high-res) are kept as the high-res source of truth. Quality tuned per format. Honour the perf budget (page weight < 500KB excl. images; images themselves stay reasonable via AVIF).

### Dev / test parity
- **D-04:** Dev watches source, **rebuilds incrementally**, and browser-sync serves **`dist/`** with hot reload — so build-generated features (cutouts) render live during development. Playwright runs `npm run build` first, then serves `dist/` on port 7777. Build must stay fast enough for a snappy reload loop (cache/skip unchanged images; Lightning CSS is fast). Keep dev on 3000, tests on 7777 (no cross-contamination, per CLAUDE.md).

### Claude's Discretion
- Exact `build.js` structure, step order, and incremental-cache strategy.
- sharp quality numbers per format; whether to add a small manifest for srcset wiring.
- Whether dev rebuild uses browser-sync's own watch + a build call, chokidar, or sharp/Lightning watch modes — pick the simplest that stays fast.
- `package.json` script names beyond `build` (e.g. `build:watch`).

### Derived constraints (not gray areas — capture for the planner)
- **Static-asset copy:** `build.js` must copy `_headers`, `robots.txt`, `favicon.svg`, `fonts/` (incl. `OFL.txt`) into `dist/`. Missing `_headers` in `dist/` silently drops the HSTS/CSP/Permissions-Policy + cache rules.
- **Cloudflare per-branch:** set build command `npm run build` + output `dist/` on the `new-site` preview branch. **`main` (holding page) must NOT build** — keep it untouched. Confirm Cloudflare's per-branch build behaviour or scope the build to non-main; document in the cutover notes.
- **Phase 11 prerequisite:** `build.js` is the seam Phase 11 extends with the cutout codegen step. Author it so adding a step is trivial.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Rules + budget
- `CLAUDE.md` — tech-stack relaxation (2026-06-02): build step + npm deps allowed, shipped artifact stays plain static, no Tailwind. Performance budget (LCP < 2.5s, CLS < 0.1, page weight < 500KB excl. images, WebP + srcset, lazy below fold).
- `CLAUDE.md` §"Local preview server" + §"Phone preview handoff" — browser-sync 3000 / Playwright 7777 split; Cloudflare branch-preview deploy model. Both must keep working against `dist/`.

### Files to touch
- `package.json` — add `build` (+ watch) script; make `test` build first.
- `playwright.config.js` — `webServer` must build then serve `dist/` on 7777.
- `bs-config.js` — serve `dist/`, watch source → rebuild, keep hot reload (no auto-open, no UI panel, print LAN ip:port).
- `_headers`, `robots.txt`, `favicon.svg`, `fonts/` — static assets to copy into `dist/`.
- `.gitignore` — add `dist/`.

### Consumers / related
- `.planning/phases/11-cutout-reveal-system-v1-refresh-p3/11-CONTEXT.md` — Phase 11 consumes this pipeline (D-08/D-10).
- `.planning/phases/05-hardening-launch/` CUTOVER-PLAYBOOK — Cloudflare deploy/cutover model; update if build config changes the cutover steps.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `package.json` — already has `dev` (browser-sync) + `test` (playwright) scripts and `devDependencies` (browser-sync, @playwright/test). Extend, don't replace.
- `bs-config.js` — existing browser-sync config (no auto-open, no UI, prints LAN ip:port). Repoint root → `dist/`, add rebuild-on-change.
- `playwright.config.js` — existing port-7777 static server config. Repoint to `dist/` + build-first.
- `_headers` — existing security/cache headers; must land in `dist/`.

### Established Patterns
- Two-server split is a hard rule: dev 3000, tests 7777, never shared (CLAUDE.md). Preserve.
- Contact form only POSTs on `*.looktwice.uk`; localhost + `*.pages.dev` simulate. Building to `dist/` must not change `location.hostname` logic — it's runtime, unaffected.
- `node_modules` gitignored; dev tooling not shipped. `dist/` follows the same gitignore treatment.

### Integration Points
- Cloudflare Pages build config (dashboard / wrangler) — the one piece outside the repo. Needs a manual set + a documented note.
- `build.js` is the extension point for Phase 11's cutout codegen.

</code_context>

<specifics>
## Specific Ideas

- Build stack named explicitly: Node `build.js` + sharp + Lightning CSS. No PostCSS, no esbuild, no bundler, no Tailwind.
- `dist/` as the single build output; Cloudflare output dir points there.
- Image matrix: AVIF + WebP at 480/960/1440/1920.

</specifics>

<deferred>
## Deferred Ideas

- JS minification / bundling — deferred (344 lines, gzip covers it); revisit only if weight matters.
- The cutout `buildCutout(image, shapes)` codegen — Phase 11.
- Any framework adoption — explicitly out; ruled out in CLAUDE.md relaxation.

None of these block this phase.

</deferred>

---

*Phase: 12-build-pipeline-tooling-foundation*
*Context gathered: 2026-06-02*
