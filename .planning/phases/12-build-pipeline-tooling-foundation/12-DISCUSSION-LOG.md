# Phase 12: Build pipeline & tooling foundation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-02
**Phase:** 12-build-pipeline-tooling-foundation
**Areas discussed:** Build tooling, Source→output model, Image pipeline, Dev/test parity

---

## Build tooling

| Option | Description | Selected |
|--------|-------------|----------|
| Node orchestrator + sharp + lightningcss | Small build.js; sharp images, Lightning CSS minify/autoprefix; JS minify optional | ✓ |
| PostCSS instead of Lightning CSS | autoprefixer + cssnano plugin chain | |
| esbuild as bundler | esbuild JS+CSS minify/bundle | |

**User's choice:** Node orchestrator + sharp + Lightning CSS.
**Notes:** Minimal dep tree; no PostCSS plugin zoo, no bundler. JS minify deferred (344 lines). (D-01)

---

## Source → output model

| Option | Description | Selected |
|--------|-------------|----------|
| Source stays, build emits to dist/ | Committed source untouched; dist/ gitignored; Cloudflare output = dist/ | ✓ |
| Token-replace committed index.html in place | Build rewrites index.html; output dir root | |

**User's choice:** Source stays, build emits to dist/.
**Notes:** No source/output ambiguity; cutout SVGs injected into dist HTML, not committed file. (D-02)

---

## Image pipeline

| Option | Description | Selected |
|--------|-------------|----------|
| AVIF+WebP, 480/960/1440/1920 | Four widths, two formats, srcset by build | ✓ |
| WebP only, 3 widths | Smaller matrix, no AVIF | |
| Let me specify | Custom | |

**User's choice:** AVIF+WebP at 480/960/1440/1920.
**Notes:** Originals kept as high-res source. (D-03)

---

## Dev/test parity

| Option | Description | Selected |
|--------|-------------|----------|
| Watch-build to dist/, serve dist/ | Dev rebuilds incrementally, browser-sync serves dist/; Playwright builds then serves dist/ | ✓ |
| Dev serves source, build only for deploy/test | Faster dev loop, cutouts invisible in dev | |

**User's choice:** Watch-build to dist/, serve dist/.
**Notes:** Full parity — build-generated cutouts render live. Build must stay fast. Dev 3000 / tests 7777 split preserved. (D-04)

---

## Claude's Discretion

- build.js structure, step order, incremental-cache strategy.
- sharp quality per format; srcset manifest approach.
- Dev rebuild mechanism (browser-sync watch + build call vs chokidar vs tool watch modes).
- Extra package.json script names.

## Deferred Ideas

- JS minify/bundle — deferred (gzip covers 344 lines).
- buildCutout codegen — Phase 11.
- Framework adoption — ruled out.
