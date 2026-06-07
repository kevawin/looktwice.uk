# Phase 12: Build pipeline & tooling foundation - Research

**Researched:** 2026-06-02
**Domain:** Zero-config Node build pipeline (sharp + Lightning CSS) for a plain static site on Cloudflare Pages
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** A small Node orchestrator `build.js` runs the steps. Two focused deps: **sharp** (image optimization) and **Lightning CSS** (`lightningcss`, CSS minify + autoprefix + nesting — one fast dep, no PostCSS plugin chain). JS minify is **optional/deferred**. No esbuild, no bundler.
- **D-02:** Source files (`index.html`, `css/`, `js/`, `images/`) stay committed and authored as-is. `build.js` writes processed output to **`dist/`** (gitignored). Cloudflare Pages **output directory = `dist/`**. No in-place mutation of committed files. Build-generated content (Phase 11 cutout SVGs) is injected into the `dist/` HTML, not into committed `index.html`.
- **D-03:** sharp emits **AVIF + WebP** at widths **480 / 960 / 1440 / 1920**, with `srcset` wired by the build. Source originals kept as the high-res source of truth. Quality tuned per format. Honour the perf budget (page weight < 500KB excl. images).
- **D-04:** Dev watches source, **rebuilds incrementally**, browser-sync serves **`dist/`** with hot reload. Playwright runs `npm run build` first, then serves `dist/` on 7777. Keep dev on 3000, tests on 7777 (no cross-contamination).

### Claude's Discretion
- Exact `build.js` structure, step order, and incremental-cache strategy.
- sharp quality numbers per format; whether to add a small manifest for srcset wiring.
- Whether dev rebuild uses browser-sync's own watch + a build call, chokidar, or sharp/Lightning watch modes — pick the simplest that stays fast.
- `package.json` script names beyond `build` (e.g. `build:watch`).

### Deferred Ideas (OUT OF SCOPE)
- JS minification / bundling — deferred (344 lines, gzip covers it).
- The cutout `buildCutout(image, shapes)` codegen — Phase 11.
- Any framework adoption — explicitly out.
</user_constraints>

<phase_requirements>
## Phase Requirements (derived from CONTEXT — no formal REQ IDs in this phase)

| ID | Description | Research Support |
|----|-------------|------------------|
| BUILD-01 | `build.js` + `npm run build` orchestrator | Architecture Patterns §build.js, pure-Node sequential pipeline |
| BUILD-02 | sharp AVIF+WebP at 4 widths + srcset wiring | Standard Stack (sharp 0.34.5), Code Examples §sharp, §HTML rewrite |
| BUILD-03 | Lightning CSS minify+autoprefix+nesting | Standard Stack (lightningcss 1.32.0), Code Examples §Lightning CSS |
| BUILD-04 | `dist/` output model + static-asset copy | Architecture §dist layout, Pitfall 1 (_headers), Pitfall 4 (paths) |
| BUILD-05 | browser-sync serves dist/ + watch→rebuild | Code Examples §bs-config, Pattern: build-then-reload |
| BUILD-06 | Playwright builds first, serves dist/ on 7777 | Code Examples §playwright.config, Pitfall 5 (test paths) |
| BUILD-07 | Cloudflare per-branch build (main stays unbuilt) | Architecture §Cloudflare, Pitfall 2, Code Examples §build.sh |
| BUILD-08 | Incremental image cache for fast dev loop | Pattern: mtime/hash skip, Code Examples §cache |
</phase_requirements>

## Summary

This is a small, well-bounded build phase with no architectural ambiguity left to resolve — the stack is locked (`sharp` + `lightningcss`, pure-Node `build.js`, output to `dist/`). Both dependencies are mature, heavily-used native libraries with current, stable APIs. The work is wiring, not research: a sequential `build.js` that (1) runs Lightning CSS over `css/*.css`, (2) runs sharp over raster sources in `images/`, (3) rewrites `<img>` markup with `srcset`, (4) copies static assets (`_headers`, `robots.txt`, `favicon.svg`, `fonts/`, `js/`, SVG logos) verbatim into `dist/`.

The two real landmines are operational, not code. First, **`_headers` must land in `dist/`** or every security header (HSTS, CSP, Permissions-Policy) and cache rule silently disappears in production. Second, **Cloudflare Pages has no per-branch build command in the dashboard** — the build command is a single global field applied to every branch. To keep `main` (the live holding page) an untouched plain static deploy while `new-site` builds, the build command must be a shell script that branches on `CF_PAGES_BRANCH`: build only when the branch is `new-site`, no-op otherwise. This is Cloudflare's officially documented pattern.

**Primary recommendation:** Write a pure-Node `build.js` (no extra deps beyond sharp + lightningcss — chokidar is unnecessary; browser-sync's own file watcher drives rebuilds). Generate AVIF+WebP at 4 widths with an mtime-based skip cache so the dev loop stays fast. Set the Cloudflare build command to `bash build.sh`, where `build.sh` runs `npm ci && npm run build` only on `new-site` and exits 0 without touching files on `main`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Image optimization (AVIF/WebP/resize) | Build (Node) | — | Done once at build time; shipped output is plain static files |
| CSS minify/autoprefix/nesting | Build (Node) | — | Lightning CSS transforms source `css/*.css` → `dist/css/*.css` |
| srcset/`<picture>` markup generation | Build (Node) | — | Build rewrites `<img>` in HTML so the shipped page is no-JS-safe |
| Static asset delivery + security headers | CDN / Static (Cloudflare Pages) | Build (copies `_headers`) | `_headers` is interpreted by Cloudflare at the edge; build only places it |
| Contact-form host gating | Browser / Client (runtime) | — | `location.hostname` check in `main.js` — unaffected by build, see Pitfall 6 |
| Dev hot-reload | Dev tooling (browser-sync) | Build (rebuild on change) | Dev-only; never shipped |
| Test serving | Dev tooling (Playwright webServer) | Build (build-first) | Dev-only; serves `dist/` on 7777 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `sharp` | 0.34.5 | AVIF + WebP encode, resize to widths | The de-facto Node image library (libvips-backed); 61M downloads/week `[VERIFIED: npm registry]` |
| `lightningcss` | 1.32.0 | CSS minify + autoprefix + nesting | Single fast Rust-backed CSS transformer; 72M downloads/week; replaces the PostCSS+autoprefixer+cssnano chain `[VERIFIED: npm registry]` |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `browser-sync` | ^3.0.4 (installed) | Dev server + watch + hot reload | Already a devDependency; repoint root → `dist/`, drive rebuild from its watcher `[VERIFIED: package.json]` |
| `@playwright/test` | ^1.48.0 (installed) | Test runner + static webServer | Already a devDependency; update `webServer` to build-then-serve `dist/` `[VERIFIED: package.json]` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| browser-sync's own watcher | `chokidar` (direct dep) | Unnecessary — browser-sync bundles chokidar 3.6.0 already (`node_modules/chokidar` present transitively). Adding it as a direct dep is redundant. Only add if you need a watcher *outside* browser-sync (you don't). `[VERIFIED: node_modules/chokidar/package.json = 3.6.0]` |
| pure-Node copy loop | `cpy` / `fs-extra` | Node 24's `fs.cpSync(src, dest, { recursive: true })` is built-in and sufficient. No extra dep. `[VERIFIED: node v24.14.0 installed]` |
| sharp | `@squoosh/lib` | Squoosh is unmaintained/archived. sharp is the correct choice and is locked by D-01. `[ASSUMED]` |

**Installation:**
```bash
npm install --save-dev sharp lightningcss
```
(Both go in `devDependencies` — they are build tooling, not shipped runtime deps, consistent with the existing `package.json` description "Dev tooling … not shipped to the site".)

**Version verification:** `npm view sharp version` → 0.34.5 (modified 2026-04-25). `npm view lightningcss version` → 1.32.0 (modified 2026-03-09). Both confirmed current on the npm registry on 2026-06-02. `[VERIFIED: npm registry]`

## Package Legitimacy Audit

> slopcheck was not available in this environment. Registry metadata, download counts, source repos, and postinstall scripts were verified manually instead.

| Package | Registry | Age / last publish | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|--------------------|-----------|-------------|-----------|-------------|
| `sharp` | npm | published 2026-04-25 (mature, est. 2013) | 61.7M/wk | github.com/lovell/sharp | n/a (manual) | Approved |
| `lightningcss` | npm | published 2026-03-09 (mature) | 72.3M/wk | github.com/parcel-bundler/lightningcss | n/a (manual) | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none.
**Packages flagged as suspicious [SUS]:** none.

**Postinstall note:** `sharp` has an install script `node install/check.js || npm run build`. This is sharp's documented native-binary (libvips) prebuild fetch/compile step — expected and benign, not a network-exfiltration signal. `lightningcss` has no postinstall script; it ships platform-specific native binaries as optional dependencies (e.g. `lightningcss-darwin-arm64`), resolved by npm automatically. Both are top-100 npm packages with first-party GitHub repos — legitimacy is HIGH confidence despite slopcheck being unavailable.

## Architecture Patterns

### System Architecture Diagram

```
  SOURCE (committed, authored by hand)
  ┌───────────────┐  ┌────────────┐  ┌──────────────┐  ┌─────────────────────────┐
  │ index.html    │  │ css/*.css  │  │ images/*.webp│  │ static: _headers,       │
  │ (template)    │  │ (5 files)  │  │ (raster src) │  │ robots.txt, favicon.svg,│
  │               │  │            │  │              │  │ fonts/, js/, *.svg logos│
  └──────┬────────┘  └─────┬──────┘  └──────┬───────┘  └────────────┬────────────┘
         │                 │                │                       │
         ▼                 ▼                ▼                       ▼
  ┌────────────────────────────────────────────────────────────────────────────┐
  │                              build.js  (npm run build)                       │
  │  step 1  Lightning CSS  transform(minify, targets→autoprefix+nesting)        │
  │  step 2  sharp          for each raster: emit AVIF+WebP × [480,960,1440,1920]│
  │                         (skip if cached: source mtime unchanged)             │
  │  step 3  HTML rewrite   inject <picture>/<source srcset=…> for built images  │
  │          (+ Phase 11 seam: buildCutout step plugs in HERE)                   │
  │  step 4  copy static    fs.cpSync(_headers, robots, favicon, fonts, js, svg) │
  └──────────────────────────────────────┬─────────────────────────────────────┘
                                          ▼
                              ┌───────────────────────┐
                              │   dist/  (gitignored)  │  ← single build output
                              │   index.html           │
                              │   css/*.css (minified) │
                              │   images/*-{w}.avif/webp│
                              │   _headers, fonts/, js/ │
                              └───────────┬────────────┘
                        ┌─────────────────┼──────────────────┐
                        ▼                 ▼                  ▼
              browser-sync :3000   Playwright :7777   Cloudflare Pages
              (dev, hot reload,    (build-first,      (output dir = dist/,
               watch src→rebuild)   serve dist/)       build only on new-site)
```

File-to-step mapping is the table above; the diagram shows data flow.

### Recommended Project Structure
```
build.js              # the orchestrator (new)
build.sh              # Cloudflare branch-gated wrapper (new)
bs-config.js          # repoint to dist/, add rebuild-on-change
playwright.config.js  # webServer: build then serve dist/
package.json          # add build, build:watch; make test build-first
.cache/               # optional: image build cache manifest (gitignored)
dist/                 # build output (already gitignored)
src is the repo root  # index.html, css/, js/, images/, fonts/, _headers, etc.
```
Note: no `src/` move. Source stays at repo root as today (D-02 — "authored as-is"). Only the *output* is new (`dist/`).

### Pattern 1: Sequential pure-Node build
**What:** `build.js` is a plain async script: clean `dist/`, run CSS step, run image step, run HTML rewrite, copy static assets. No build framework, no plugin system.
**When to use:** Small static sites with a fixed, known set of inputs. Exactly this project.
**Example:**
```js
// build.js — Source: composed from sharp + lightningcss official APIs (see Code Examples)
const fs = require('node:fs');
const path = require('node:path');

async function build() {
  fs.rmSync('dist', { recursive: true, force: true });
  fs.mkdirSync('dist', { recursive: true });
  await buildCss();        // step 1
  const manifest = await buildImages();  // step 2 → {srcKey: [{w, avif, webp}]}
  buildHtml(manifest);     // step 3  (Phase 11 buildCutout slots in here)
  copyStatic();            // step 4
}
build().catch(e => { console.error(e); process.exit(1); });
```

### Pattern 2: mtime-based incremental image cache
**What:** Before encoding an image, compare source file mtime against a stored manifest. Skip encode if unchanged and outputs exist. Keeps the dev rebuild loop fast (image encode is the slow step; CSS transform is sub-10ms).
**When to use:** Every dev rebuild. The two current rasters (scene-cafe 260KB, kris-portrait 360KB) × 4 widths × 2 formats = 16 encodes — cheap once, but the cache matters as imagery grows.
**Example:**
```js
// Skip if source unchanged since last build
const cachePath = '.cache/images.json';
const cache = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath)) : {};
const mtime = fs.statSync(src).mtimeMs;
if (cache[src] === mtime && outputsExist(src)) return cached(src); // skip encode
// …encode…
cache[src] = mtime;
```

### Anti-Patterns to Avoid
- **Mutating committed source in place:** Never write minified CSS or generated images back over `css/` or `images/`. Output only to `dist/` (D-02). Source vs output must stay unambiguous.
- **Bundling/concatenating the 5 CSS files into one:** The `<link>` chain in `index.html` (tokens → base → layout → components → animations, all with `?v=17` cache-busters) is intentional and ordered. Lightning CSS `transform()` each file *separately* and keep the same filenames so the existing `<link>` structure resolves unchanged. Do NOT use `bundle()` to inline `@import` (there are no `@import`s; the files are linked individually). See Pitfall 3.
- **Adding chokidar as a direct dependency:** browser-sync already watches files; a second watcher is redundant complexity.
- **Letting `main` run the build:** Cloudflare's build command is global — gate it on `CF_PAGES_BRANCH` (Pitfall 2).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AVIF/WebP encode + resize | Custom libvips/ffmpeg wrapper | `sharp` | Native, battle-tested, handles colour profiles, orientation, downscale quality |
| CSS minify + vendor prefix + nesting flatten | Regex CSS minifier / hand-picked prefixes | `lightningcss` | Correct prefixing from real browserslist data; nesting transpile; sub-10ms |
| Recursive directory copy | Manual readdir/copyFile recursion | `fs.cpSync(src, dest, {recursive:true})` | Built into Node 24 — no dep, handles nested dirs |
| File watching | `fs.watch` loop with debounce | browser-sync's `files` + a callback | browser-sync already debounces and reloads the page |

**Key insight:** Every capability this phase needs already exists as a stable primitive. The only bespoke code is the ~100-line orchestrator that sequences them and the ~30-line HTML `<img>`→`<picture>` rewriter.

## Common Pitfalls

### Pitfall 1: `_headers` (and other root static files) not copied to `dist/`
**What goes wrong:** Cloudflare Pages serves `dist/` as the site root. `_headers` lives at the repo root, not in `dist/`. If `build.js` doesn't copy it, the file is absent from the deploy and **all security headers + cache rules silently vanish** — no error, the site just ships without HSTS/CSP/Permissions-Policy.
**Why it happens:** `_headers` and `_redirects` are Cloudflare meta-files that must sit in the build output directory root.
**How to avoid:** `build.js` step 4 must copy, at minimum: `_headers`, `robots.txt`, `favicon.svg`, `fonts/` (incl. `OFL.txt`), `js/main.js`, and the SVG logo files referenced by `<use href="#logo">` / `index.html` (`images/*.svg`). Add a Playwright assertion or a post-build check that `dist/_headers` exists and is byte-identical to source.
**Warning signs:** `curl -I` on the preview shows no `Strict-Transport-Security` / `Content-Security-Policy` headers.

### Pitfall 2: Cloudflare builds `main` (the holding page) and breaks it
**What goes wrong:** Cloudflare Pages has **one global build command** applied to every branch — there is no per-branch command field in the dashboard. If you set the build command to `npm run build` with output `dist/`, then a push to `main` will try to build the holding page (which has no `build.js`/`dist/`), failing the deploy or shipping an empty/wrong `dist/`. `main` must stay an untouched plain-static deploy.
**Why it happens:** Assuming "preview branch settings" exist separately. They don't for the build *command*.
**How to avoid:** Cloudflare's documented pattern is a shell wrapper gated on `CF_PAGES_BRANCH`. Set the dashboard **Build command** to `bash build.sh` and **Output directory** to `dist/`. `build.sh` builds only on `new-site`; on any other branch it exits 0 without producing `dist/` (Cloudflare then deploys the branch's files as-is). Two reinforcing safety options also exist:
  1. **Branch deployment controls** — set "Custom branches" to only auto-deploy `new-site` for previews, excluding others. `[CITED: developers.cloudflare.com/pages/configuration/branch-build-controls]`
  2. **`[CF-Pages-Skip]`** commit-message prefix skips an ad-hoc build. `[CITED: Cloudflare community]`
  The `CF_PAGES_BRANCH` wrapper is the robust answer. `[CITED: developers.cloudflare.com/pages/how-to/build-commands-branches]`
**Warning signs:** `main` deploy log shows it running `npm run build`; live `looktwice.uk` holding page changes or 404s.
**Important caveat for the planner:** The exact `main`-output behaviour when `build.sh` exits without creating `dist/` is **not explicitly documented by Cloudflare** `[ASSUMED]`. Safest interpretation: on `main`, `build.sh` should leave the output directory equal to the holding page's own structure. Since `main`'s output dir is also configured as `dist/` globally, the cleanest robust setup is to **keep `main` and `new-site` as separate Cloudflare Pages projects** OR confirm via a throwaway test push that the `CF_PAGES_BRANCH` gate leaves `main` untouched before relying on it. Flag this as a checkpoint:human-verify in the plan — it is the one step that touches the live domain.

### Pitfall 3: Concatenating/renaming CSS breaks the `<link>` chain and cache-busters
**What goes wrong:** `index.html` links five CSS files in a specific cascade order, each with `?v=17`. If the build bundles them into one file or renames them, the links 404 and the page renders unstyled.
**Why it happens:** Treating "minify CSS" as "bundle CSS."
**How to avoid:** Run Lightning CSS `transform()` on each of the 5 files independently, writing `dist/css/<same-name>.css`. Preserve filenames. The `?v=17` query string is part of the `<link href>` and is harmless on static files — leave the HTML links as-is, or have the build bump the version (optional, discretion).
**Warning signs:** Unstyled page on the preview; 404s on `/css/*.css?v=17`.

### Pitfall 4: Asset paths don't resolve from `dist/` root
**What goes wrong:** All asset references are **root-relative** (`/css/...`, `/fonts/...`, `/images/...`, `/js/...`, `/favicon.svg`). They resolve correctly only if `dist/` mirrors the same directory layout as the source root.
**Why it happens:** Flattening or re-nesting output directories.
**How to avoid:** Mirror the layout exactly: `dist/css/`, `dist/fonts/`, `dist/images/`, `dist/js/`, `dist/favicon.svg`, `dist/_headers`. `@font-face` in `css/base.css` uses `url('/fonts/epilogue-400.woff2')` — keep `dist/fonts/` populated. `[VERIFIED: grep css/base.css:98,106]`
**Warning signs:** Missing fonts (FOUT/no Epilogue), broken logo, 404s in the network panel.

### Pitfall 5: Playwright specs assume source paths / source content
**What goes wrong:** Tests run against `dist/` instead of the source root. Two checked risks:
  - All `page.goto('/')` and asset paths are root-relative, so serving `dist/` as root is fine. `[VERIFIED: grep tests/*.spec.js — only goto('/') used]`
  - `contact-form.spec.js` asserts the served HTML does **not** contain `hello@looktwice.uk` (no visible mailto). The build must not reintroduce an email address. Since the build only rewrites `<img>` and minifies CSS, this holds — but verify the HTML rewrite step doesn't touch contact markup. `[VERIFIED: grep tests/contact-form.spec.js:210]`
**How to avoid:** Update `playwright.config.js` `webServer.command` to build first, then serve `dist/` on 7777 (see Code Examples). Run the full suite against built output before declaring the phase done. If the HTML `<img>`→`<picture>` rewrite changes the hero markup, confirm `nav-floating-bar.spec.js` selectors still match (it keys off nav/floating-bar elements, not the hero image — low risk).
**Warning signs:** Tests pass against source but fail against `dist/`, or vice versa.

### Pitfall 6: Worrying the build changes the contact-form host gate (it doesn't)
**What goes wrong:** False alarm to pre-empt. The contact form only POSTs to Formspree when `/(^|\.)looktwice\.uk$/i.test(window.location.hostname)` is true (or `__LT_FORCE_SUBMIT`).
**Why it's fine:** This is a **runtime** check on `location.hostname`, evaluated in the browser. Building to `dist/` changes nothing about the served hostname — localhost stays localhost, `*.pages.dev` stays `*.pages.dev`, production stays `looktwice.uk`. The build must simply copy `js/main.js` verbatim (no minify per D-01). `[VERIFIED: grep js/main.js:260-261]`
**Action required:** None — just don't transform `main.js`. Copy it as-is.

## Runtime State Inventory

> This is an infra-only phase (no rename, no data migration). Inventory included for completeness.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no datastore touched. | None — verified: phase only adds build tooling. |
| Live service config | **Cloudflare Pages build settings** (build command + output dir) live in the dashboard, NOT in git. This is the one out-of-repo change. | Manual dashboard set (or `wrangler pages` config) + documented note. Plan must include a human checkpoint. |
| OS-registered state | None — no scheduled tasks, no daemons. | None — verified: dev tooling is npm scripts only. |
| Secrets/env vars | `CF_PAGES_BRANCH` is injected by Cloudflare at build time (read-only, not a secret we set). No new secrets. | None. |
| Build artifacts | New: `dist/` (gitignored — already in `.gitignore`), optional `.cache/` (must add to `.gitignore`). `node_modules` adds `sharp` native binary + `lightningcss` native binary. | Add `.cache/` to `.gitignore` if used. `dist/` already ignored. `[VERIFIED: cat .gitignore — dist/ present]` |

**The canonical question** (after every repo file is updated, what runtime systems still hold old state?): Only the **Cloudflare Pages dashboard build config** — it is the single piece outside the repo and the single thing that can break the live `main` deploy. Treat it as the highest-risk step.

## Code Examples

Verified patterns from official sources.

### sharp — AVIF + WebP at 4 widths
```js
// Source: https://sharp.pixelplumbing.com/api-output (avif/webp/resize signatures)
const sharp = require('sharp');
const WIDTHS = [480, 960, 1440, 1920];

async function encodeImage(srcPath, outDir, baseName) {
  const outputs = [];
  for (const w of WIDTHS) {
    const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
    // AVIF: best compression. quality ~50-55 is visually clean for photos; effort 4 (default) balances speed.
    await pipeline.clone().avif({ quality: 50, effort: 4 })
      .toFile(`${outDir}/${baseName}-${w}.avif`);
    // WebP fallback: quality ~75-80 default is the well-trodden sweet spot.
    await pipeline.clone().webp({ quality: 78, effort: 4 })
      .toFile(`${outDir}/${baseName}-${w}.webp`);
    outputs.push({ w, avif: `/images/${baseName}-${w}.avif`, webp: `/images/${baseName}-${w}.webp` });
  }
  return outputs;
}
```
Quality guidance `[CITED: sharp.pixelplumbing.com/api-output]`: AVIF default quality 50 / effort 4; WebP default quality 80 / effort 4. Numbers above are the documented defaults nudged for photographic content; final values are Claude's discretion (D-03). `withoutEnlargement: true` stops upscaling a source smaller than a target width.

### sharp — `<picture>` markup the build injects (consumable by Phase 11)
```html
<!-- Build rewrites the hero <img> into this. Phase 11's <image href> can point at the same -480/-960/... outputs. -->
<picture class="hero__cutout">
  <source type="image/avif"
          srcset="/images/scene-cafe-480.avif 480w, /images/scene-cafe-960.avif 960w,
                  /images/scene-cafe-1440.avif 1440w, /images/scene-cafe-1920.avif 1920w"
          sizes="(max-width: 768px) 85vw, 40vw">
  <source type="image/webp"
          srcset="/images/scene-cafe-480.webp 480w, /images/scene-cafe-960.webp 960w,
                  /images/scene-cafe-1440.webp 1440w, /images/scene-cafe-1920.webp 1920w"
          sizes="(max-width: 768px) 85vw, 40vw">
  <img src="/images/scene-cafe-960.webp" alt="Coffee shop scene"
       width="1600" height="2400" loading="eager" decoding="async" fetchpriority="high">
</picture>
```
For Phase 11's SVG cutout: an SVG `<image>` element takes a single `href`. The simplest interop is for `buildCutout` to receive the build's image manifest (the `outputs` array above) and pick the appropriate width's `.webp` for the SVG `href`, or use `<image>` with a media-query-selected source. **Recommendation for the planner:** have `buildImages()` return a manifest object keyed by source filename, written to `dist/` or held in memory, so both step 3 (HTML rewrite) and Phase 11's `buildCutout` step consume one source of truth for srcset URLs. The hero stays eager / `fetchpriority="high"` (it is the LCP element); below-fold cutouts use `loading="lazy"`.

### Lightning CSS — minify + autoprefix + nesting, per file
```js
// Source: https://lightningcss.dev/docs.html + transpilation.html
const { transform, browserslistToTargets } = require('lightningcss');
const browserslist = require('browserslist'); // ships as a dep of lightningcss; or hardcode targets
const fs = require('node:fs');

const targets = browserslistToTargets(browserslist('>= 0.5%, last 2 versions, not dead'));

function transformCss(file) {
  const { code } = transform({
    filename: file,
    code: fs.readFileSync(file),
    minify: true,
    targets,            // drives BOTH autoprefixing AND nesting transpile automatically
    // NOTE: standard CSS nesting is stable — NO drafts.nesting needed in current lightningcss.
  });
  return code; // Buffer → write to dist/css/<same-name>.css
}
```
Key facts `[CITED: lightningcss.dev/transpilation.html]`: autoprefixing is automatic from `targets` (and unnecessary prefixes are stripped); standard CSS nesting is compiled automatically based on `targets` and does **not** require `drafts.nesting: true` (that flag is only for not-yet-shipped draft specs). Transform each of the 5 files separately; preserve filenames (Pitfall 3). If you prefer no `browserslist` dependency, hardcode a `targets` object (e.g. `{ chrome: (110<<16), safari: (15<<16) }`) — but `browserslistToTargets` is cleaner and `browserslist` is already in the tree.

### bs-config.js — serve dist/, rebuild on source change
```js
// Repoint root to dist/ and rebuild before browser-sync reloads.
const { execSync } = require('node:child_process');
// ...existing lanIp() helper unchanged...
module.exports = {
  server: 'dist',                              // was '.', now serve built output
  port: 3000,
  host: lanIp(),
  open: false, notify: false, ui: false,
  // Watch SOURCE; on change rebuild, then let browser-sync reload from dist/.
  files: ['index.html', 'css/*.css', 'js/*.js', 'images/*', '_headers'],
  watchEvents: ['change', 'add'],
  // Rebuild synchronously before the reload fires:
  plugins: [],
  // Use a watcher callback to run the build, then reload dist/:
  // simplest: a small middleware/cb that runs `node build.js` on change.
  callbacks: { /* keep existing ready() phone-URL print */ },
};
```
**Watcher recommendation (resolves the D-04 discretion point):** browser-sync watches `files` and reloads the page when they change, but it does not run a build between detecting the change and reloading. Two clean options:
  1. **Run an initial build, then a `chokidar`-free wrapper:** Start with `npm run build`, then `browser-sync` serving `dist/` while a tiny watch in the same script (or browser-sync's `watch` event) shells out to `node build.js`. Because the rebuild writes into `dist/`, and browser-sync *also* watches `dist/**`, you get a reload after the rebuild lands.
  2. **Simplest robust pattern:** a `build:watch` npm script that runs `node build.js --watch` (build.js gets a `--watch` flag using `fs.watch` on source dirs, rebuilds into `dist/`) **and** `browser-sync start --server dist --files 'dist/**'`. browser-sync reloads whenever `dist/` changes. This decouples "rebuild" (build.js owns it) from "reload" (browser-sync owns it) and needs no extra dep.
  **Pick option 2** — it keeps build logic in `build.js` (one place), keeps browser-sync purely a static-server-with-reload, and stays snappy because CSS transform is sub-10ms and the image cache skips unchanged files.

### playwright.config.js — build then serve dist/ on 7777
```js
// Source: existing config; only webServer changes.
webServer: {
  command: 'npm run build && python3 -m http.server 7777 --directory dist',
  port: 7777,
  reuseExistingServer: true,
  timeout: 60_000,   // raised from 15_000 — first build (image encode) can take a few seconds
},
```
`python3 -m http.server` supports `--directory dist` (Python 3.7+) so you keep the zero-extra-server-dep approach already in the repo. Alternatively serve `dist/` via a one-line Node static server, but `--directory` is simplest and matches the current pattern. `[CITED: Python http.server --directory flag]`

### build.sh — Cloudflare branch gate (main stays unbuilt)
```bash
#!/usr/bin/env bash
# Cloudflare Pages "Build command" field = `bash build.sh`. Output directory = `dist/`.
set -euo pipefail
if [ "$CF_PAGES_BRANCH" = "new-site" ]; then
  npm ci
  npm run build           # produces dist/
else
  echo "Branch '$CF_PAGES_BRANCH' — no build (holding page deploys as-is)."
  # main must ship its own files unchanged; do NOT create/alter dist/ here.
fi
```
**Planner caveat (repeat of Pitfall 2):** Whether Cloudflare deploys `main` correctly when `build.sh` no-ops depends on the global output-directory setting. The safest, unambiguous setup is **two separate Cloudflare Pages projects** (one watching `main` with no build, one watching `new-site` with `npm run build` + `dist/`) — but that is a larger account change. If staying single-project, the plan MUST include a `checkpoint:human-verify` that pushes a trivial commit to `main` and confirms the live holding page is unchanged before trusting the gate. `[ASSUMED — Cloudflare does not document the no-op-build output behaviour explicitly]`

### package.json scripts
```json
{
  "scripts": {
    "build": "node build.js",
    "build:watch": "node build.js --watch & browser-sync start --server dist --files 'dist/**' --port 3000 --no-open --no-ui",
    "dev": "npm run build:watch",
    "test": "npm run build && playwright test",
    "test:ui": "npm run build && playwright test --ui"
  }
}
```
(`dev` keeps invoking the LAN-IP-aware `bs-config.js` if you prefer — adapt to use `--config bs-config.js` with the option-2 watch wrapper. Keep the phone-URL print from `bs-config.js`.) `test` now builds first so Playwright always runs against fresh `dist/`.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| PostCSS + autoprefixer + cssnano + postcss-nesting | Single `lightningcss` (Rust) | ~2022-2024 adoption | One dep instead of four; ~10-50× faster; D-01 reflects this |
| `<img srcset>` WebP only | AVIF first, WebP fallback via `<picture><source>` | AVIF broadly supported 2023+ | Smaller files; D-03 mandates AVIF+WebP |
| Manual `cpy`/`fs-extra` copy | `fs.cpSync(recursive)` native | Node 16.7+ (stable 18+) | No copy dependency on Node 24 |
| browserslist `drafts.nesting` for CSS nesting | Automatic from `targets` (nesting now stable CSS) | lightningcss ~1.22+ | No `drafts` flag needed; cleaner config |

**Deprecated/outdated:**
- `drafts.nesting: true` for *standard* CSS nesting — no longer required; nesting transpiles from `targets`. `drafts` is only for genuinely draft specs (e.g. custom-media). `[CITED: lightningcss.dev/transpilation.html]`
- `@squoosh/lib` — archived/unmaintained; not a sharp alternative.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | On `main`, a no-op `build.sh` leaves Cloudflare's deploy serving the holding page unchanged | Pitfall 2, build.sh | HIGH — could alter or break the live `looktwice.uk` holding page. MUST be human-verified with a throwaway `main` push before trust. Cloudflare does not document this exact behaviour. |
| A2 | sharp AVIF q50 / WebP q78 are visually acceptable for this site's photos | Code Examples §sharp | LOW — purely visual; tune by eye. Final numbers are D-03 discretion. |
| A3 | `nav-floating-bar.spec.js` selectors don't depend on hero `<img>` markup | Pitfall 5 | LOW — spec keys off nav/floating-bar; confirm by running suite against dist/. |
| A4 | `browserslist` is resolvable (ships in tree or installable) for `browserslistToTargets` | Code Examples §Lightning CSS | LOW — fallback is a hardcoded `targets` object, no dep. |
| A5 | `@squoosh/lib` is unmaintained | Alternatives Considered | NONE — not recommended anyway; sharp is locked. |

## Open Questions (RESOLVED)

1. **Single Cloudflare Pages project vs. two projects for the main/new-site split** — RESOLVED: single project with the `CF_PAGES_BRANCH` gate; Plan 12-03 Task 3 is a blocking human-verify checkpoint (push trivial commit to `main`, confirm holding page unchanged), with the two-projects split documented as the fallback in the cutover playbook.
   - What we know: Cloudflare has one global build command; the `CF_PAGES_BRANCH` gate is the documented per-branch mechanism.
   - What's unclear: exact deploy behaviour of `main` when its build no-ops under a single project configured with output `dist/`.
   - Recommendation: Plan a human-verify checkpoint (push trivial commit to `main`, confirm holding page unchanged). If risk-averse, split into two Pages projects. Flag in the cutover notes per CONTEXT derived-constraint.

2. **Should the build bump CSS `?v=` cache-busters automatically?** — RESOLVED: no, leave `?v=17` static this phase (discretion item D, recorded in 12-01 Task 2 action).
   - What we know: links use `?v=17`; static files ignore the query.
   - What's unclear: whether Kris/Jamie want automated bumping.
   - Recommendation: Leave `?v=17` static for this phase (discretion D); revisit only if cache staleness appears. Out of scope to over-engineer.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build.js, sharp, lightningcss | ✓ | v24.14.0 | — |
| npm | install deps, scripts | ✓ | 11.9.0 | — |
| python3 | Playwright static server (`--directory dist`) | ✓ (assumed, current config uses it) | 3.7+ needed for `--directory` | one-line Node static server |
| sharp | image step | ✗ (not yet installed) | install 0.34.5 | none — required, npm install |
| lightningcss | CSS step | ✗ (not yet installed) | install 1.32.0 | none — required, npm install |
| browser-sync | dev server | ✓ | ^3.0.4 | — |
| @playwright/test | tests | ✓ | ^1.48.0 | — |
| chokidar | (NOT needed as direct dep) | ✓ transitive | 3.6.0 | n/a |

**Missing dependencies with no fallback:** `sharp`, `lightningcss` — install via `npm install --save-dev sharp lightningcss`. These are the only two adds (D-01).
**Missing dependencies with fallback:** python3 for the test server (Node static server is the fallback if python3 `--directory` is unavailable).

## Validation Architecture

> nyquist_validation status not found in config; treat as enabled. Existing Playwright suite is the harness.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `@playwright/test` ^1.48.0 |
| Config file | `playwright.config.js` (update `webServer` to build-first, serve `dist/`) |
| Quick run command | `npx playwright test --project=desktop-1440` |
| Full suite command | `npm test` (now builds first, runs 3 viewport projects) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BUILD-01 | `npm run build` exits 0, produces `dist/index.html` | smoke | `npm run build && test -f dist/index.html` | ❌ Wave 0 (add build smoke check) |
| BUILD-02 | dist has `*-480/960/1440/1920.avif` + `.webp` | smoke | `ls dist/images/*-960.avif` | ❌ Wave 0 |
| BUILD-03 | `dist/css/*.css` minified, 5 files present, links resolve | integration | existing nav/contact specs render styled page against dist/ | ✅ (existing specs catch unstyled) |
| BUILD-04 | `dist/_headers` byte-identical to source | smoke | `diff _headers dist/_headers` | ❌ Wave 0 |
| BUILD-05 | dev serves dist/ on 3000 with reload | manual | open localhost:3000, edit css, see reload | manual-only |
| BUILD-06 | Playwright passes against dist/ | e2e | `npm test` (existing 2 specs) | ✅ existing suite |
| BUILD-07 | main holding page unchanged after build config | manual / human-verify | push trivial commit to main, check live | manual-only (checkpoint:human-verify) |
| BUILD-08 | second build skips unchanged images (cache) | smoke | time two consecutive `npm run build`; 2nd faster | ❌ Wave 0 (optional) |

### Sampling Rate
- **Per task commit:** `npm run build && test -f dist/_headers && test -f dist/index.html` (fast build-integrity gate)
- **Per wave merge:** `npm test` (full suite against built `dist/`)
- **Phase gate:** Full suite green against `dist/` + human-verify `main` untouched before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `tests/build-smoke.spec.js` (or a shell check) — asserts `dist/` exists, `_headers` copied byte-identical, 4-width AVIF+WebP present, `main.js` copied unmodified, 5 CSS files present. Covers BUILD-01/02/04.
- [ ] Confirm existing `contact-form.spec.js` + `nav-floating-bar.spec.js` pass against `dist/` (Pitfall 5) — no new file, just run.
- [ ] No framework install needed — Playwright already present.

## Security Domain

> security_enforcement assumed enabled. This is an infra phase; the security surface is "don't drop the existing controls."

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | yes | Source→output separation (D-02); no secrets in build |
| V5 Input Validation | no | No user input in build pipeline |
| V12/V14 Config & Build | yes | **Preserve `_headers`** (HSTS, CSP, Permissions-Policy) into `dist/`; pin deps via `package-lock.json` + `npm ci` in CI build |
| V6 Cryptography | no | No crypto introduced |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Security headers silently dropped (no `_headers` in dist/) | Tampering / Info disclosure | build copies `_headers`; post-build assertion `diff _headers dist/_headers`; `curl -I` preview |
| Supply-chain (malicious dep update) | Tampering | `npm ci` against committed `package-lock.json`; only sharp + lightningcss added, both top-100 first-party packages |
| sharp native-binary build in CI | Tampering | sharp's install script is its documented libvips prebuild — expected; lockfile pins it |
| CSP regression from build-injected markup | Tampering | build only adds `<picture>/<source>` (no inline script/style); existing CSP `script-src 'self' 'unsafe-inline'` unchanged; verify no new inline styles introduced |

**Key control:** The CSP in `_headers` allows `img-src 'self' data:`. The build emits real image files (not data URIs) to `/images/`, so `'self'` covers them. AVIF/WebP from same-origin need no CSP change. `[VERIFIED: cat _headers — img-src 'self' data:]`

## Sources

### Primary (HIGH confidence)
- npm registry — `sharp@0.34.5`, `lightningcss@1.32.0`, `chokidar@3.6.0` (installed) verified via `npm view` / `node_modules` on 2026-06-02
- https://sharp.pixelplumbing.com/api-output — `.avif()`, `.webp()`, `.resize()` signatures + default quality/effort
- https://lightningcss.dev/docs.html + https://lightningcss.dev/transpilation.html — `transform()`, `browserslistToTargets()`, automatic autoprefix + nesting from `targets`, `drafts` only for draft specs
- https://developers.cloudflare.com/pages/how-to/build-commands-branches/ — `CF_PAGES_BRANCH` conditional build pattern (`bash build.sh`)
- Local codebase — `package.json`, `playwright.config.js`, `bs-config.js`, `_headers`, `index.html`, `css/base.css`, `js/main.js`, `.gitignore`, `tests/*.spec.js`

### Secondary (MEDIUM confidence)
- https://developers.cloudflare.com/pages/configuration/branch-build-controls/ — custom-branch include/exclude, `[CF-Pages-Skip]` commit flag
- https://developers.cloudflare.com/pages/configuration/build-configuration/ — global build command + output directory model

### Tertiary (LOW confidence)
- Cloudflare community threads on skip-build — corroborate `[CF-Pages-Skip]` and ignored-build patterns; not used for load-bearing claims

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — both deps verified on npm registry with current versions, official API docs read
- Architecture: HIGH — sequential pure-Node build is unambiguous; D-01–D-04 lock the shape
- Pitfalls: HIGH for `_headers`/paths/CSS/runtime-gate (verified against actual files); MEDIUM-with-flag for the Cloudflare `main`-untouched behaviour (A1 — needs human verify)

**Research date:** 2026-06-02
**Valid until:** 2026-07-02 (stable tooling; Cloudflare dashboard UI can shift — re-confirm the per-branch mechanism if more than a month passes)
