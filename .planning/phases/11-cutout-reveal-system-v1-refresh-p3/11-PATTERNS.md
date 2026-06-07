# Phase 11: Cutout reveal system (V1 Refresh P3) - Pattern Map

**Mapped:** 2026-06-02
**Files analyzed:** 6 new/modified files
**Analogs found:** 6 / 6

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `buildCutout.js` | build-module | transform (manifest → SVG string → HTML) | `build.js` (buildImages + rewriteHeroImg) | role-match |
| `build.js` (seam + dead-code removal) | build-orchestrator | batch | `build.js` itself | self-match (edit) |
| `index.html` (hero markup, lines 112-122) | template | request-response | `index.html` lines 66-77 (svg-sprite pattern) | partial-match |
| `css/components.css` (hero cutout styles, lines 228-264) | stylesheet | transform | `css/components.css` lines 228-264 (current .hero__cutout rules) | self-match (edit) |
| `tests/cutout.spec.js` | test | batch | `tests/build-smoke.spec.js` | role-match |
| `package.json` (watch WATCH_TARGETS) | config | — | `build.js` WATCH_TARGETS array (lines 327-333) | partial-match |

---

## Pattern Assignments

### `buildCutout.js` (build-module, transform)

**Analog:** `build.js` — specifically `buildImages()` (manifest-reading pattern) and `rewriteHeroImg()` (HTML string-replace pattern).

**Module header pattern** (`build.js` lines 1-18):
```js
// build.js — Node build orchestrator for looktwice.uk
// Runs: CSS minify (Lightning CSS) → image encode (sharp) → HTML rewrite → static copy
//
// Output: dist/  (gitignored)
// Usage:  node build.js
'use strict';

const fs   = require('node:fs');
const path = require('node:path');
```
Copy this header verbatim for `buildCutout.js`, updating the description line.

**Constants pattern** (`build.js` lines 22-27):
```js
const ROOT      = __dirname;
const DIST      = path.join(ROOT, 'dist');
```
`buildCutout.js` uses the same `ROOT`/`DIST` constants. Do not pass them as arguments — derive from `__dirname` the same way.

**Manifest-reading pattern** (`build.js` lines 156-162 — how `buildImages` builds and returns the manifest):
```js
manifest[baseName] = IMG_WIDTHS.map(w => ({
  w,
  avif: `/images/${baseName}-${w}.avif`,
  webp: `/images/${baseName}-${w}.webp`,
}));
```
`buildCutout.js` reads from this manifest. To pick the 960w WebP entry:
```js
const entry = manifest[image].find(e => e.w === 960) || manifest[image][1];
const href  = entry.webp;   // "/images/scene-cafe-960.webp"
```

**HTML string-replace pattern** (`build.js` lines 202-235 — `rewriteHeroImg`):
```js
function rewriteHeroImg(html, manifest) {
  return html.replace(
    /(<picture\s[^>]*class="hero__cutout"[^>]*>)([\s\S]*?)(<\/picture>)/,
    (_, openTag, inner, closeTag) => {
      // ...
      return `${openTag}${newInner}${closeTag}`;
    }
  );
}
```
`buildCutout.js` uses the same approach but targets the literal string `<!-- CUTOUT:hero -->`:
```js
html = html.replace(marker, svg);  // marker = '<!-- CUTOUT:hero -->'
```
`String.replace()` with a literal string (not regex) is correct here — the marker is stable and unambiguous.

**dist/ read-then-write pattern** (`build.js` lines 183-188 — `buildHtml`):
```js
function buildHtml(manifest) {
  const srcHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const html    = rewriteHeroImg(srcHtml, manifest);
  fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');
  console.log('[build] HTML rewritten → dist/index.html');
}
```
`buildCutout.js` reads from `dist/index.html` (not source `index.html`) because it runs after `buildHtml` has already written the dist copy. Pattern:
```js
const htmlPath = path.join(DIST, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');
// ... replace marker ...
fs.writeFileSync(htmlPath, html, 'utf8');
console.log(`[buildCutout] injected cutout: ${config.id}`);
```

**Error + warning pattern** (`build.js` lines 206-211):
```js
if (!imgMatch) return _;       // nothing to rewrite — leave intact
if (!srcMatch) return _;
if (!entries)  return _;       // no encoded variants — leave as-is
```
`buildCutout.js` follows the same defensive pattern:
```js
if (!html.includes(marker)) {
  console.warn(`[buildCutout] marker not found for ${config.id}: ${marker}`);
  continue;
}
if (!entry) throw new Error(`[buildCutout] no manifest entry for image: ${image}`);
```
Use `console.warn` for missing markers (recoverable — the HTML is left unchanged). Use `throw new Error` for missing manifest entries (unrecoverable — the build should fail).

**Async export pattern** (`build.js` lines 292-307):
```js
async function build() {
  // ...
  const manifest = await buildImages();
  // PHASE 11 SEAM
  buildHtml(manifest);
}
```
`buildCutout.js` must export an async function even if the body is synchronous, to match the await at the seam:
```js
async function buildCutout(manifest) {
  // ...
  return manifest;
}
module.exports = { buildCutout };
```

---

### `build.js` — seam integration + `rewriteHeroImg` removal (build-orchestrator, batch)

**Seam location** (`build.js` lines 296-304):
```js
async function build() {
  const t0 = Date.now();
  cleanDist();
  await buildCss();
  const manifest = await buildImages();

  // ---- PHASE 11 SEAM -------------------------------------------------------
  // Insert:  manifest = await buildCutout(manifest);
  // --------------------------------------------------------------------------

  buildHtml(manifest);
  copyStatic();
}
```
Phase 11 inserts the `require` at the top and the call at the seam:
```js
// top of file, with other requires:
const { buildCutout } = require('./buildCutout');

// at the seam (replace the comment block):
manifest = await buildCutout(manifest);
```

**Dead-code removal target** (`build.js` lines 190-236 — `rewriteHeroImg` function and its call at line 185):
```js
// Line 185 — remove:
const html = rewriteHeroImg(srcHtml, manifest);
// Replace with:
const html = srcHtml;   // buildCutout handles hero image injection

// Lines 202-236 — remove entirely:
function rewriteHeroImg(html, manifest) { … }
```
After removal, `buildHtml` becomes:
```js
function buildHtml(manifest) {
  const srcHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  fs.writeFileSync(path.join(DIST, 'index.html'), srcHtml, 'utf8');
  console.log('[build] HTML written → dist/index.html');
}
```
The `manifest` parameter can stay (no harm) or be removed — remove it for cleanliness.

**Watch targets pattern** (`build.js` lines 327-333):
```js
const WATCH_TARGETS = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'css'),
  path.join(ROOT, 'js'),
  path.join(ROOT, 'images'),
  path.join(ROOT, '_headers'),
];
```
Add `buildCutout.js` so edits to shape configs trigger a rebuild:
```js
const WATCH_TARGETS = [
  path.join(ROOT, 'index.html'),
  path.join(ROOT, 'css'),
  path.join(ROOT, 'js'),
  path.join(ROOT, 'images'),
  path.join(ROOT, '_headers'),
  path.join(ROOT, 'buildCutout.js'),  // Phase 11: shape config changes rebuild
];
```

---

### `index.html` — hero markup (lines 112-122) + `<head>` preload (template)

**Current hero block to replace** (`index.html` lines 112-122):
```html
<div class="hero__cutouts">
  <picture class="hero__cutout">
    <img src="/images/scene-cafe.webp"
         alt="Coffee shop scene"
         width="1600"
         height="2400"
         loading="eager"
         decoding="async"
         fetchpriority="high">
  </picture>
</div>
```
Replace the inner `<picture>` block with the marker comment. Keep `.hero__cutouts` as the wrapper (renamed to `.hero__media` is optional — keep the name to avoid broader CSS churn):
```html
<div class="hero__cutouts">
  <!-- CUTOUT:hero -->
</div>
```
`buildCutout` replaces `<!-- CUTOUT:hero -->` with the generated `<svg>` at build time.

**`<head>` preload pattern** (`index.html` lines 26-32 — existing preloads):
```html
<link rel="preload" href="/fonts/epilogue-400.woff2" as="font" type="font/woff2" crossorigin>
```
Add the hero image preload immediately after this line (or `buildCutout` injects it — see Open Question 2 in RESEARCH.md). Pattern:
```html
<link rel="preload" href="/images/scene-cafe-960.webp" as="image" fetchpriority="high">
```
This is the safe cross-browser signal for the hero LCP image when the `<img>` is replaced by an SVG `<image>` element (Pitfall 4). Either commit it directly in source `index.html` or have `buildCutout` inject it via a `<!-- PRELOAD:hero -->` marker — committing directly is simpler.

**SVG sprite analog** (`index.html` lines 66-77 — existing pattern for reusable SVG defs):
```html
<svg class="svg-sprite" aria-hidden="true">
  <symbol id="logo" viewBox="0 0 691 321">
    <!-- paths -->
  </symbol>
</svg>
```
The cutout SVG does NOT go into the sprite. Each cutout is a standalone inline `<svg>` emitted by `buildCutout` — it is self-contained with its own `<defs>`, `<mask>`, and `<image>`. The sprite pattern is the analog only for the concept of inline SVG defs; the structure diverges because the cutout `<image>` element must live inside its own SVG (not referenced via `<use>`).

---

### `css/components.css` — hero cutout styles (lines 228-264, stylesheet, transform)

**Current rules to replace** (`css/components.css` lines 228-264):
```css
.hero__cutouts {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  max-width: 460px;
  justify-self: end;
}

.hero__cutout {
  position: absolute;
  inset: 0;
  display: block;
  filter: grayscale(100%);
  border-radius: var(--radius-cutout);
  overflow: hidden;
}

.hero__cutout img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  /* hero reset */
  .hero__cutouts {
    width: 80%;
    margin-block-start: var(--space-md);
    aspect-ratio: 4 / 5;
    max-width: none;
    justify-self: center;
  }
}
```

**Replacement pattern** — keep `.hero__cutouts` as a thin wrapper; add `.cutout` as the new primitive class; drop `.hero__cutout` and `.hero__cutout img` entirely:
```css
/* ============================================================
   Cutout primitive (.cutout)
   SVG mask component — field = section colour, windows = B&W image.
   Grayscale and border-radius live in the SVG (feColorMatrix + shape paths).
   ============================================================ */

.cutout {
  display: block;
  width: 100%;
  height: auto;       /* intrinsic ratio from viewBox width/height attributes */
}

/* Hero wrapper — positions the cutout SVG in the two-column grid */
.hero__cutouts {
  width: 100%;
  max-width: 460px;
  justify-self: end;
}

@media (max-width: 768px) {
  .hero__cutouts {
    width: 80%;
    margin-block-start: var(--space-md);
    max-width: none;
    justify-self: center;
  }
}
```
Remove the `aspect-ratio: 4 / 5` rule from `.hero__cutouts` — aspect ratio is now intrinsic from the SVG `width`/`height` attributes (prevents CLS, Pitfall 3).

**Section comment pattern** (`css/components.css` lines 4-6):
```css
/* ============================================================
   Nav (in-flow, scrolls away with the page)
   ============================================================ */
```
Use the same `/* === ... === */` fence for the new `.cutout` section.

---

### `tests/cutout.spec.js` (test, batch)

**Primary analog:** `tests/build-smoke.spec.js`

**File header pattern** (`tests/build-smoke.spec.js` lines 1-33):
```js
// @ts-check
/**
 * looktwice.uk — Build smoke spec.
 *
 * Asserts dist/ output integrity after `npm run build`.
 * …
 * Usage:
 *   npm run build && npx playwright test tests/build-smoke.spec.js --project=desktop-1440
 *
 * This spec does NOT need the 7777 web server — it reads dist/ directly via Node fs.
 */

'use strict';

const { test, expect } = require('@playwright/test');
const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
```
Copy this header for `cutout.spec.js`. Two spec categories needed:
1. **Build output checks** (no browser, read `dist/index.html` directly via `fs`) — same pattern as `build-smoke.spec.js`.
2. **Browser render checks** (with browser, assert SVG is visible, no CLS regression) — same pattern as `nav-floating-bar.spec.js`.

**fs-based assertion pattern** (`tests/build-smoke.spec.js` lines 38-43, 125-135):
```js
test('dist/index.html exists', () => {
  const htmlPath = path.join(DIST, 'index.html');
  expect(fs.existsSync(htmlPath), `expected ${htmlPath} to exist`).toBe(true);
});

test('dist/index.html contains srcset and type="image/avif"', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  expect(html).toContain('srcset');
  expect(html).toContain('type="image/avif"');
});
```
Apply the same pattern for cutout assertions:
```js
test('dist/index.html contains inline SVG cutout for hero', () => {
  const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  expect(html, 'generated SVG must be present').toContain('<svg class="cutout');
  expect(html, 'mask must be present').toContain('<mask id="cutout-windows-hero"');
  expect(html, 'grayscale filter must be present').toContain('<filter id="cutout-grayscale-hero"');
  expect(html, 'feColorMatrix must be present').toContain('<feColorMatrix');
  expect(html, 'image href must reference scene-cafe-960.webp').toContain('scene-cafe-960.webp');
  expect(html, 'CUTOUT marker must be replaced (not left in output)').not.toContain('<!-- CUTOUT:hero -->');
  expect(html, 'no base64 image data in output').not.toContain('data:image/');
});
```

**Browser render pattern** (`tests/nav-floating-bar.spec.js` lines 32-56):
```js
async function scrollTo(page, y) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(100);
}

test.describe('Nav', () => {
  test('floating bar is hidden over hero', async ({ page }) => {
    await page.goto('/');
    // ...
  });
});
```
Cutout browser tests follow the same `page.goto('/')` + `page.locator` structure:
```js
test.describe('Cutout hero', () => {
  test('SVG cutout is rendered in hero section', async ({ page }) => {
    await page.goto('/');
    const cutout = page.locator('.hero__cutouts .cutout');
    await expect(cutout).toBeVisible();
  });

  test('cutout SVG has aria-hidden="true" (decorative)', async ({ page }) => {
    await page.goto('/');
    const svg = page.locator('svg.cutout');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  test('no base64 image data in page source', async ({ page }) => {
    const res = await page.goto('/');
    const html = await res.text();
    expect(html).not.toContain('data:image/');
  });
});
```

**Secondary analog:** `tests/contact-form.spec.js` — `test.describe()` grouping, helper functions. Use `test.describe('Cutout hero', …)` to group related assertions.

---

## Shared Patterns

### Module structure (`build.js` lines 1-18, 292-361)

All build modules in this project share:
- `'use strict';` at top
- `require('node:fs')` and `require('node:path')` (Node built-ins, node: prefix)
- `const ROOT = __dirname;` / `const DIST = path.join(ROOT, 'dist');`
- `console.log('[tag] message')` for progress, `console.warn('[tag] …')` for recoverable issues
- `throw new Error('[tag] …')` for unrecoverable failures
- Async function exported as `module.exports = { fn }`
- Function returns input unchanged or augmented (no mutation of caller state)

**Apply to:** `buildCutout.js`

### CSS section fencing (`css/components.css` lines 4-6)

```css
/* ============================================================
   Section name
   ============================================================ */
```
All CSS sections use this exact fence style.

**Apply to:** New `.cutout` section in `css/components.css`

### Test file structure (`tests/build-smoke.spec.js` lines 1-33)

```js
// @ts-check
/**
 * looktwice.uk — [Spec name].
 * …
 * Usage: npm run build && npx playwright test tests/[name].spec.js --project=desktop-1440
 */
'use strict';
const { test, expect } = require('@playwright/test');
const fs   = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
```

**Apply to:** `tests/cutout.spec.js`

### Accessibility on inline SVG

All decorative SVG in the codebase uses `aria-hidden="true"` (svg-sprite at `index.html` line 66, nav logo at line 81 with `role="img"` + `aria-label` as an exception for meaningful SVG).

Pattern for decorative cutout SVG:
```html
<svg aria-hidden="true" role="presentation" …>
```

Pattern for meaningful cutout SVG (if alt text is not empty):
```html
<svg role="img" aria-labelledby="cutout-title-hero" …>
  <title id="cutout-title-hero">Coffee shop scene in black and white</title>
```

**Apply to:** SVG strings generated in `buildCutout.js` — `buildSvgString` must branch on whether `config.alt` is empty.

---

## No Analog Found

All files have analogs in the codebase. No files require falling back to RESEARCH.md patterns exclusively — though the SVG mask structure itself (the `<defs>`/`<mask>`/`<image>` tree) has no existing codebase analog and must be taken verbatim from RESEARCH.md Pattern 1 (sourced from `image-cutout-demo.html`).

---

## Metadata

**Analog search scope:** `build.js`, `tests/`, `css/components.css`, `index.html`, `playwright.config.js`, `package.json`
**Files scanned:** 9
**Pattern extraction date:** 2026-06-02
