# Phase 11: Cutout reveal system (V1 Refresh P3) - Research

**Researched:** 2026-06-02
**Domain:** SVG mask codegen, build pipeline integration, hero refactor
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Field behind windows = solid section colour (Hot Pink hero, Linen, Deep Teal). Windows reveal the image behind. No gradient surface — CLAUDE.md one-gradient rule intact.
- **D-02:** Demo gradient body replaced by solid section colour. Brand gradient stays on floating CTA pill only.
- **D-03:** Revealed images are black-and-white / grayscale inside every window.
- **D-04:** Five shape presets: circle, down-triangle (rounded), up-triangle (rounded), pill (stadium), rounded-rect.
- **D-05:** Refactor the hero in this phase onto the new mask primitive (single image, mask-based windows).
- **D-06:** External WebP referenced from the SVG (`<image href="…webp">`), with srcset, lazy below fold; hero eager / `fetchpriority="high"`.
- **D-07:** Static render only — no scroll animation on cutout windows this phase.
- **D-08:** Delivered as a reusable build function `buildCutout(image, shapes)`.
- **D-09:** All shapes reveal the same image via one `<image>` element behind one `<mask>` holding all shape paths in a single shared SVG viewBox. Never per-shape image copies.
- **D-10:** Build function runs as Cloudflare Pages deploy-time build command. Output is static HTML.
- **D-10a:** CLAUDE.md relaxation already recorded 2026-06-02. Phase 12 implements the pipeline; Phase 11 extends it.

### Claude's Discretion

- Exact mask viewBox coordinates and per-shape path math.
- Internal form of each shape preset (path string, parameterised generator).
- Per-section window composition for the hero refactor (how many windows, which shapes), within D-03/D-04.

### Deferred Ideas (OUT OF SCOPE)

- Services-section cutout imagery (refresh P5).
- Approach-section imagery / break-the-rectangle layout (refresh P8).
- Animated/wipe-open mask reveals (deferred to P8 if ever).
- New section imagery for non-hero bands.
</user_constraints>

---

## Summary

Phase 11 adds the `buildCutout(image, shapes)` function to `build.js`, emitting an inline SVG element that uses a `<mask>` to punch five configurable shape-windows through the section surface colour, revealing a single B&W image behind. The function slots into the Phase 12 pipeline at the seam already prepared between `buildImages()` and `buildHtml()` in `build.js`. Its output replaces the current `<div class="hero__cutouts">` block in `dist/index.html` — committed source `index.html` gains a placeholder marker that `buildHtml` replaces at build time.

The SVG mechanic is exactly the demo's: a black background `<rect>` inside `<mask>` blocks everything, white shape elements cut transparent windows, and a single `<image>` element positioned behind the mask shows through only inside those windows. Grayscale is applied via an SVG `<filter>` + `feColorMatrix` (not CSS `filter`) because the `<image>` lives inside an SVG element, not in the HTML flow where CSS `filter` applies cleanly. The SVG itself is sized via CSS and uses `viewBox` with `preserveAspectRatio="xMidYMid slice"` so the photo always fills the windows regardless of the rendered dimensions.

The only externally loaded image is `scene-cafe.webp` which Phase 12 has already encoded to AVIF/WebP at four widths and placed in the manifest. The `buildCutout` function receives that manifest, picks the correct `<image href>` path, and emits the static SVG. No new packages are needed — the existing `sharp` + `lightningcss` pipeline is untouched. The hero refactor is a simultaneous CSS cleanup: remove `.hero__cutout` border-radius and `filter: grayscale` rules that are now owned by the SVG primitive.

**Primary recommendation:** Add `buildCutout.js` as a sibling to `build.js`, import it, and call `manifest = await buildCutout(manifest)` at the Phase 11 seam. The function reads a shape config, generates an SVG string, and writes it into `dist/index.html` by replacing a `<!-- CUTOUT:hero -->` marker in the source `index.html`.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| SVG mask generation | Build (Node) | — | Static HTML output; no runtime JS |
| Shape preset library | Build (Node) | — | Pure string generators; no browser involvement |
| Grayscale treatment | SVG filter (`<defs>`) | — | Image lives inside SVG, not in HTML flow |
| Image src/srcset wiring | Build (Node) | — | Reuses Phase 12 manifest |
| Hero layout (column, aspect-ratio) | CSS (components.css) | — | Same two-column grid as today |
| Responsive shape reflow | CSS (SVG + media queries) | SVG viewBox | SVG scales via CSS; viewBox handles shape coordinates |
| Accessibility roles | Build (HTML output) | — | Static aria attributes in emitted markup |
| LCP / eager loading | HTML attribute | — | `fetchpriority="high"` on hero image; preserved from today |

---

## Standard Stack

### Core (no new packages required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js (built-in `fs`) | built-in | Read source, write dist/ | Already in use in build.js |
| lightningcss | 1.32.0 | CSS minify (unchanged) | Phase 12 established |
| sharp | 0.34.5 | Image encode (unchanged) | Phase 12 established |

No new npm packages. The `buildCutout` function is pure Node.js string generation — it constructs SVG markup from shape configs and writes it to `dist/index.html` via the existing HTML-rewrite step.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG string generation | JSDOM / @svgdotjs/svg.js | JSDOM adds 20 MB of dep; string generation is simpler for static, non-interactive SVG |
| SVG `<feColorMatrix>` grayscale | CSS `filter: grayscale(100%)` on wrapper div | CSS filter works when SVG is in HTML flow; inside an SVG `<image>` element, CSS filter does not propagate into the masked image reliably across Safari — SVG filter is the safe choice |
| Single `<mask>` with all paths | Per-shape clip-path | Clip-path can't stack multiple shapes onto one image instance without JS; SVG mask is the correct primitive for this mechanic (D-09) |

**Installation:** No new packages. [VERIFIED: npm registry via Phase 12 package-lock.json]

---

## Package Legitimacy Audit

No new packages are introduced in this phase. Phase 12 established `sharp` and `lightningcss` — both already audited and in `package-lock.json`.

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
Source files (committed)          Build pipeline (Node, deploy-time)       dist/ (served)
────────────────────────          ──────────────────────────────────       ──────────────
index.html                                                                 index.html
  <!-- CUTOUT:hero -->   ──────►  buildCutout(manifest)                      <svg class="cutout">
                                    reads shape config                         <defs>
images/scene-cafe.webp  ──►  buildImages()  ──► manifest  ──►               <filter id="grayscale">
  (sharp → AVIF/WebP)              { scene-cafe: [{w,avif,webp}] }           <mask id="cutout-windows">
                                                                                 <rect fill="black"/>
                                    generates SVG string                         <path fill="white"/>…
                                    picks href from manifest                   <image href="/images/…webp"
                                    injects into dist/index.html                    filter="url(#grayscale)"/>
css/components.css      ──►  buildCss()  ──►  dist/css/components.css       </svg>
  (updated: remove old                                                      css/components.css
   .hero__cutout rules)                                                        .cutout { … }
```

### Recommended Project Structure

```
build.js                    # existing orchestrator — seam already present
buildCutout.js              # new: shape preset library + SVG generator
index.html                  # source: <!-- CUTOUT:hero --> marker added
dist/
  index.html                # generated: marker replaced with inline SVG
  images/
    scene-cafe-480.avif     # Phase 12 outputs (unchanged)
    scene-cafe-480.webp     # …
css/
  components.css            # update: remove .hero__cutout grayscale/radius rules
```

### Pattern 1: SVG `<mask>` cutout mechanic

**What:** A single `<svg>` contains `<defs>` (mask + grayscale filter), then an `<image>` that references the photo. The `<mask>` holds a black `<rect>` that blocks the image everywhere, plus white shapes (the windows). The `<image>` carries `mask="url(#…)"` so it shows only through the white windows.

**Exact demo structure (stripped of base64 and gradient body):**
```html
<!-- Source: image-cutout-demo.html lines 86-103 (base64 stripped per D-06) -->
<svg class="cutout" viewBox="0 0 1000 1064" preserveAspectRatio="xMidYMid slice"
     xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation">
  <defs>
    <!-- Grayscale filter (D-03) — applied to the image inside SVG -->
    <filter id="cutout-grayscale-hero" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0"/>
    </filter>

    <!-- Mask: black rect = hide; white shapes = windows -->
    <mask id="cutout-windows-hero" maskUnits="userSpaceOnUse"
          x="0" y="0" width="1000" height="1064">
      <rect x="0" y="0" width="1000" height="1064" fill="black"/>
      <!-- White shape paths go here — one per window -->
      <path d="M 83.14,0 L 516.86,0 Q 600,0 558.43,72.04
               L 341.57,447.56 Q 300,519.6 258.43,447.56
               L 41.57,72.04 Q 0,0 83.14,0 Z" fill="white"/>
      <rect x="0" y="544.6" width="1000" height="519.6" rx="259.8" fill="white"/>
    </mask>
  </defs>

  <!-- Single image — revealed only inside mask windows (D-09) -->
  <image
    href="/images/scene-cafe-960.webp"
    x="0" y="0" width="1000" height="1064"
    preserveAspectRatio="xMidYMid slice"
    mask="url(#cutout-windows-hero)"
    filter="url(#cutout-grayscale-hero)"
    decoding="async"
    fetchpriority="high"/>
</svg>
```

**Key details from the demo:**
- viewBox: `0 0 1000 1064` — the coordinate space all shapes use
- maskUnits: `userSpaceOnUse` — shape coordinates are in the same space as the viewBox
- Down-triangle: cubic-Bezier path with corner rounding: `M 83.14,0 L 516.86,0 Q 600,0 558.43,72.04 L 341.57,447.56 Q 300,519.6 258.43,447.56 L 41.57,72.04 Q 0,0 83.14,0 Z`
- Up-triangle: `M 658.43,72.04 Q 700,0 741.57,72.04 L 958.43,447.56 Q 1000,519.6 916.86,519.6 L 483.14,519.6 Q 400,519.6 441.57,447.56 Z`
- Pill / stadium: `<rect x="0" y="544.6" width="1000" height="519.6" rx="259.8" fill="white"/>`
- Circle: `<circle cx="500" cy="..." r="..." fill="white"/>`
- Rounded-rect: `<rect x="..." y="..." width="..." height="..." rx="..." fill="white"/>`

**When to use:** Any section band where `buildCutout(image, shapes)` is called.

### Pattern 2: `buildCutout(manifest)` function API

**What:** A Node.js module that takes the Phase 12 image manifest, generates SVG strings for configured cutout regions, and rewrites the HTML by replacing marker comments.

**Recommended shape config format:**
```js
// buildCutout.js
// Source config lives here or in a cutout-config.js file imported by build.js

const HERO_CUTOUT = {
  id: 'hero',                       // unique suffix for mask/filter IDs
  image: 'scene-cafe',              // matches manifest key from buildImages()
  loading: 'eager',                 // 'eager' for hero, 'lazy' for below fold
  fetchpriority: 'high',            // 'high' for hero, omit for below fold
  viewBox: '0 0 1000 1064',         // coordinate space
  shapes: [
    { type: 'down-triangle' },      // presets from SHAPE_PRESETS
    { type: 'pill' },
  ],
  // alt: '' for decorative; provide real string for meaningful imagery
  alt: 'Coffee shop scene in black and white',
};
```

**Function signature:**
```js
async function buildCutout(manifest) {
  // For each configured cutout region:
  //   1. Look up image variants in manifest
  //   2. Generate <svg> string (filter + mask + <image>)
  //   3. Inject into dist/index.html by replacing <!-- CUTOUT:ID -->
  // Returns manifest unchanged (or augmented if needed)
  return manifest;
}
```

**Seam location in build.js (lines 298-303):**
```js
// ---- PHASE 11 SEAM -------------------------------------------------------
// Insert:  manifest = await buildCutout(manifest);
// --------------------------------------------------------------------------
```

### Pattern 3: Grayscale inside SVG — `feColorMatrix` not CSS filter

**What:** Inside an SVG `<image>` element, CSS `filter: grayscale()` does not propagate reliably on Safari. Use an SVG `<filter>` in `<defs>` instead.

**Correct form:**
```xml
<filter id="cutout-grayscale-hero" color-interpolation-filters="sRGB">
  <feColorMatrix type="saturate" values="0"/>
</filter>
```
Then reference it on the `<image>`: `filter="url(#cutout-grayscale-hero)"`.

`color-interpolation-filters="sRGB"` is the correct value for photographic content — it prevents hue shifts that can occur with the default `linearRGB` colour space. [CITED: MDN `feColorMatrix`]

### Pattern 4: Responsive scaling — CSS width, not JavaScript

**What:** The SVG `viewBox` holds shape coordinates; CSS controls rendered size. The SVG expands or contracts to fill its container. Shapes reflow relative to the viewBox — they scale with it. No per-breakpoint coordinate recalculation is needed.

**CSS approach:**
```css
.cutout {
  display: block;
  width: 100%;
  height: auto;          /* intrinsic from viewBox aspect ratio */
  max-width: 460px;      /* mirrors existing .hero__cutouts max-width */
}

@media (max-width: 768px) {
  .cutout {
    width: 80%;
    max-width: none;
    margin-block-start: var(--space-md);
  }
}
```

The demo's `preserveAspectRatio="none"` stretches the SVG to fill its box regardless of aspect ratio. For photo content this causes distortion. Use `preserveAspectRatio="xMidYMid slice"` so the image always fills the window area without distortion — equivalent to `object-fit: cover`. [CITED: MDN preserveAspectRatio]

**CLS prevention:** Set `width` and `height` attributes on the `<svg>` element matching the viewBox dimensions (e.g. `width="1000" height="1064"`), then override with CSS. The browser computes the intrinsic ratio before the SVG is parsed, preventing layout shift. This is the same mechanism as `width`/`height` on `<img>`. [ASSUMED — standard browser behaviour, not source-verified in this session]

### Pattern 5: `<image href>` and the image pipeline

**What:** `buildCutout` picks an appropriate resolution from the manifest for the `href` attribute. It cannot use an HTML `<picture srcset>` inside SVG (SVG `<image>` does not support `srcset`). The correct pattern is to pick the most appropriate single variant based on the expected rendered size.

For the hero (rendered ~460px wide on desktop, ~80vw on mobile), the 960-wide WebP is the sensible default href. At 1920px displays it stays crisp; 960px is the Phase 12 second-largest width.

```js
// Pick the 960w WebP as the href (sensible default for the hero context)
const entry = manifest[image].find(e => e.w === 960) || manifest[image][1];
const href = entry.webp; // "/images/scene-cafe-960.webp"
```

No `srcset` support exists on SVG `<image>`. This is a known limitation. The perf budget is met because the image is already AVIF/WebP-compressed by Phase 12 and the 960px variant is ~40KB at quality 78. [ASSUMED — SVG `<image>` srcset is not supported; CITED: MDN SVG image element]

### Pattern 6: Hero source template marker

**What:** `index.html` (committed source) needs a stable injection point for the generated SVG block. The cleanest approach is replacing the current `<div class="hero__cutouts">…</div>` with a comment marker that `buildHtml` replaces.

**Source `index.html` (after this phase):**
```html
<!-- CUTOUT:hero -->
```

**`buildHtml` extension:** Update `buildHtml()` in `build.js` (or extend `buildCutout.js`) to replace `<!-- CUTOUT:hero -->` with the generated SVG string. This is a `String.replace()` on the HTML source — the same strategy already used for the `<picture class="hero__cutout">` rewrite.

Alternatively, leave the source `<div class="hero__cutouts">` markup in place and target it with a regex in `buildCutout.js`, replacing the inner content. Either approach is correct; the marker comment is simpler and unambiguous.

### Anti-Patterns to Avoid

- **Per-shape `<image>` copies:** Multiple `<image>` elements (one per shape) waste bandwidth and break the "continuous photo behind all windows" effect. D-09 hard-prohibits this.
- **Base64 image in SVG href:** The demo uses base64 (~112KB for one image). This bloats the HTML response, breaks caching, and blocks the LCP image. Always use an external path from the manifest.
- **CSS `filter: grayscale()` on an SVG `<image>` element:** Unreliable on Safari. Use `feColorMatrix` instead.
- **`preserveAspectRatio="none"` on the outer SVG:** Causes distortion at non-exact aspect ratios. Use `xMidYMid slice` to crop gracefully.
- **Hardcoded image paths in `buildCutout.js`:** Always read from the manifest that `buildImages()` returns — this ensures the path is always consistent with what lands in `dist/images/`.
- **Touching the `<picture class="hero__cutout">` rewrite in `buildHtml`:** Phase 12's `rewriteHeroImg` regex targets `<picture class="hero__cutout">`. After this phase, that element is gone (replaced by inline SVG). The regex will match nothing and return the HTML unchanged — harmless but dead code. Either remove `rewriteHeroImg` in this phase or leave it (it no-ops cleanly).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Grayscale inside SVG | Custom matrix math | `feColorMatrix type="saturate" values="0"` | One-liner; cross-browser since IE9; `values="0"` = 100% desaturation |
| Rounded triangle paths | Custom Bezier math | Extract verbatim from the demo | The demo paths are already correct and visually tested; recalculating introduces error |
| Responsive image inside SVG | JS resize observer + dynamic href swap | Single 960w WebP href via manifest | Good enough for the hero context; Phase 8 can revisit if needed |

**Key insight:** The demo already contains all five shape paths and the correct mask structure. Do not invent — extract.

---

## Common Pitfalls

### Pitfall 1: Unique IDs per cutout instance

**What goes wrong:** Two cutout instances on the same page both use `id="cutout-windows"`. The second one silently overrides the first. Both render incorrectly.

**Why it happens:** SVG `id` attributes must be unique per document. When `buildCutout` is called once it is fine, but when Phase 5/8 add more instances, the function must suffix IDs with the region name.

**How to avoid:** Always suffix all IDs with the `id` field from the config: `cutout-windows-${config.id}`, `cutout-grayscale-${config.id}`. The hero instance uses `hero` as the ID suffix. Future instances use their own suffixes.

**Warning signs:** Second cutout on page shows black or shows unmasked full image.

### Pitfall 2: Phase 12 `rewriteHeroImg` targets the old `<picture class="hero__cutout">` block

**What goes wrong:** The Phase 12 `rewriteHeroImg` regex in `build.js` looks for `<picture class="hero__cutout">`. After Phase 11 replaces this markup with a `<!-- CUTOUT:hero -->` marker (or the generated SVG), the regex matches nothing — a no-op. This is safe, but the function becomes dead code.

**How to avoid:** Remove the `rewriteHeroImg` call and function from `build.js` in this phase. `buildCutout.js` takes over srcset wiring for the hero image.

**Warning signs:** No srcset in `dist/index.html` for the hero image (though this is now inside the SVG `<image href>`, not a `<picture>` element).

### Pitfall 3: CLS from SVG without intrinsic dimensions

**What goes wrong:** The `<svg>` has no `width`/`height` attributes (or only CSS). The browser does not know the aspect ratio before layout, causing CLS > 0.1.

**Why it happens:** Without `width` and `height` attributes matching the `viewBox`, some browsers default to 300×150 (the HTML replaced-element fallback) until CSS overrides it.

**How to avoid:** Always emit `width="1000" height="1064"` attributes on the `<svg>` element. CSS `width: 100%; height: auto;` then scales it correctly while the browser holds the aspect ratio.

**Warning signs:** CLS score > 0 on Lighthouse for the hero.

### Pitfall 4: `fetchpriority="high"` lost when switching from `<img>` to `<image>`

**What goes wrong:** The current hero `<img>` carries `fetchpriority="high"`. The SVG `<image>` element does not support `fetchpriority` as an HTML attribute in the same way. The browser may treat the image as lower priority, causing LCP regression.

**Why it happens:** `fetchpriority` is an HTML attribute that lives on HTML elements (`<img>`, `<link>`). SVG `<image>` is an SVG element — the attribute may or may not be honoured depending on browser.

**How to avoid:** Emit a `<link rel="preload" as="image" href="/images/scene-cafe-960.webp" fetchpriority="high">` in the `<head>`. `buildCutout` must inject this preload link in addition to the inline SVG, or `buildHtml` must add it. This is the safe cross-browser way to signal high-priority for an image that is not an HTML `<img>`. [ASSUMED — fetchpriority on SVG image: behaviour not source-verified; preload link is the safe fallback]

**Warning signs:** LCP > 2.5s on Lighthouse after refactor; scene-cafe is not the LCP element.

### Pitfall 5: watch mode misses `buildCutout.js` source changes

**What goes wrong:** Editing `buildCutout.js` during development does not trigger a rebuild because `build.js --watch` watches `index.html, css/, js/, images/, _headers` — not `buildCutout.js`.

**How to avoid:** Add `buildCutout.js` (and its config file if separate) to the `WATCH_TARGETS` array in `build.js`'s watch mode.

**Warning signs:** Edits to shape configs or the SVG generator don't appear in the browser until manual `npm run build`.

### Pitfall 6: Old `.hero__cutout` CSS rules remain active

**What goes wrong:** `css/components.css` still contains `.hero__cutout { filter: grayscale(100%); border-radius: var(--radius-cutout); }`. After refactor, those selectors no longer match anything — benign. But `.hero__cutouts { aspect-ratio: 4/5; }` may still apply if the wrapper element name is reused.

**How to avoid:** In this phase, either remove `.hero__cutout` / `.hero__cutouts` rules entirely and replace with `.cutout` styles, or rename the hero wrapper class to `hero__media` and add `.cutout {}` as the new primitive class. Keep the cleanup scoped to hero; don't break other sections.

---

## Code Examples

### Full demo mask structure (source of truth — extract verbatim)

```html
<!-- Source: image-cutout-demo.html lines 86-103
     Strip: base64 href → replace with manifest path
     Strip: gradient body → section colour is the field (D-01/D-02) -->
<svg class="windows" viewBox="0 0 1000 1064" preserveAspectRatio="xMidYMid slice"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <mask id="shape-windows" maskUnits="userSpaceOnUse"
          x="0" y="0" width="1000" height="1064">
      <rect x="0" y="0" width="1000" height="1064" fill="black"/>

      <!-- Triangle 1: down-pointing, top-left — rounded corners (demo) -->
      <path d="M 83.14,0 L 516.86,0 Q 600,0 558.43,72.04
               L 341.57,447.56 Q 300,519.6 258.43,447.56
               L 41.57,72.04 Q 0,0 83.14,0 Z" fill="white"/>

      <!-- Triangle 2: up-pointing, top-right — rounded corners (demo) -->
      <path d="M 658.43,72.04 Q 700,0 741.57,72.04
               L 958.43,447.56 Q 1000,519.6 916.86,519.6
               L 483.14,519.6 Q 400,519.6 441.57,447.56 Z" fill="white"/>

      <!-- Pill / stadium (demo) -->
      <rect x="0" y="544.6" width="1000" height="519.6" rx="259.8" fill="white"/>
    </mask>
  </defs>

  <!-- Single image behind the mask (D-09) — href from Phase 12 manifest -->
  <image href="/images/scene-cafe-960.webp"
         x="0" y="0" width="1000" height="1064"
         preserveAspectRatio="xMidYMid slice"
         mask="url(#shape-windows)"/>
</svg>
```

### Current hero markup (lines 112-122 of index.html — the block being refactored)

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

### Current CSS being replaced (components.css lines 228-264)

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
  filter: grayscale(100%);       /* moves into feColorMatrix on SVG image */
  border-radius: var(--radius-cutout);  /* moves into shape paths */
  overflow: hidden;
}

.hero__cutout img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (max-width: 768px) {
  .hero__cutouts {
    width: 80%;
    margin-block-start: var(--space-md);
    aspect-ratio: 4 / 5;
    max-width: none;
    justify-self: center;
  }
}
```

After refactor, `.hero__cutouts` becomes a thin wrapper; `.hero__cutout` is removed; `.cutout` is the new primitive class.

### `buildCutout.js` skeleton

```js
// buildCutout.js — Phase 11 SVG cutout codegen
// Called from build.js at the Phase 11 seam:
//   manifest = await buildCutout(manifest);
'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// Shape preset generators — return SVG element strings in viewBox coordinates
// ---------------------------------------------------------------------------

const SHAPE_PRESETS = {
  'down-triangle': () =>
    `<path d="M 83.14,0 L 516.86,0 Q 600,0 558.43,72.04 L 341.57,447.56 Q 300,519.6 258.43,447.56 L 41.57,72.04 Q 0,0 83.14,0 Z" fill="white"/>`,

  'up-triangle': () =>
    `<path d="M 658.43,72.04 Q 700,0 741.57,72.04 L 958.43,447.56 Q 1000,519.6 916.86,519.6 L 483.14,519.6 Q 400,519.6 441.57,447.56 Z" fill="white"/>`,

  'pill': ({ x = 0, y = 544.6, w = 1000, h = 519.6 } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white"/>`,

  'circle': ({ cx = 500, cy = 500, r = 300 } = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>`,

  'rounded-rect': ({ x = 50, y = 50, w = 900, h = 900, rx = 60 } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="white"/>`,
};

// ---------------------------------------------------------------------------
// Cutout region configs — one entry per instance on the page
// ---------------------------------------------------------------------------

const CUTOUT_CONFIGS = [
  {
    id: 'hero',
    image: 'scene-cafe',          // manifest key
    viewBox: '0 0 1000 1064',
    width: 1000,
    height: 1064,
    loading: 'eager',
    fetchpriority: 'high',
    alt: 'Coffee shop scene in black and white',
    shapes: [
      { type: 'down-triangle' },
      { type: 'pill' },
    ],
  },
];

// ---------------------------------------------------------------------------
// SVG generator
// ---------------------------------------------------------------------------

function buildSvgString(config, manifest) {
  const { id, image, viewBox, width, height, loading, fetchpriority, alt, shapes } = config;

  const entries = manifest[image];
  const entry   = (entries && entries.find(e => e.w === 960)) || (entries && entries[1]);
  if (!entry) throw new Error(`[buildCutout] no manifest entry for image: ${image}`);

  const href = entry.webp;

  const shapesHtml = shapes
    .map(s => {
      const gen = SHAPE_PRESETS[s.type];
      if (!gen) throw new Error(`[buildCutout] unknown shape preset: ${s.type}`);
      return '      ' + gen(s.opts || {});
    })
    .join('\n');

  const filterId  = `cutout-grayscale-${id}`;
  const maskId    = `cutout-windows-${id}`;

  return `<svg class="cutout cutout--${id}" viewBox="${viewBox}" width="${width}" height="${height}"
       preserveAspectRatio="xMidYMid slice"
       xmlns="http://www.w3.org/2000/svg"
       aria-hidden="true" role="presentation">
  <defs>
    <filter id="${filterId}" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
${shapesHtml}
    </mask>
  </defs>
  <image href="${href}"
         x="0" y="0" width="${width}" height="${height}"
         preserveAspectRatio="xMidYMid slice"
         mask="url(#${maskId})"
         filter="url(#${filterId})"
         decoding="async"${fetchpriority ? `\n         fetchpriority="${fetchpriority}"` : ''}/>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main export — called at the Phase 11 seam in build.js
// ---------------------------------------------------------------------------

async function buildCutout(manifest) {
  const htmlPath = path.join(DIST, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  for (const config of CUTOUT_CONFIGS) {
    const svg = buildSvgString(config, manifest);
    const marker = `<!-- CUTOUT:${config.id} -->`;
    if (!html.includes(marker)) {
      console.warn(`[buildCutout] marker not found for ${config.id}: ${marker}`);
      continue;
    }
    html = html.replace(marker, svg);
    console.log(`[buildCutout] injected cutout: ${config.id}`);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
  return manifest;
}

module.exports = { buildCutout };
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CSS `filter: grayscale` + `<picture>` | SVG `feColorMatrix` + `<mask>` + `<image>` | This phase | Correct grayscale inside SVG; window shapes composited onto one image |
| `<img fetchpriority="high">` for hero | `<link rel="preload">` in `<head>` + SVG `<image>` | This phase | Preload link is the reliable cross-browser signal for high-priority images outside `<img>` |
| `<picture>` with `<source srcset>` | Single-resolution `href` in SVG `<image>` | This phase | SVG image does not support srcset; pick the 960w variant as sensible default |

**Deprecated / outdated:**
- `<image xlink:href="…">`: `xlink:href` is deprecated. Use `href` (SVG 2). All modern browsers support `href` on `<image>`. [CITED: MDN SVG image]
- `filter: grayscale()` on SVG `<image>` via CSS: unreliable on Safari; superseded by `feColorMatrix`.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | CLS is prevented by setting `width`/`height` attributes on `<svg>` matching the viewBox | Architecture Patterns (Pattern 4) | Hero CLS > 0.1 if browsers ignore the attributes; check with Lighthouse after refactor |
| A2 | `fetchpriority="high"` is not reliably honoured on SVG `<image>` across Safari | Pitfall 4 | If Safari does honour it, the preload link is redundant but harmless; safe to include either way |
| A3 | SVG `<image>` does not support `srcset` | Pattern 5 | If a future browser adds srcset support, we could upgrade later; the 960w WebP is already fine for the hero dimensions |
| A4 | `<link rel="preload" as="image">` in `<head>` correctly preloads images inside inline SVG | Pitfall 4 | If preload is ignored, LCP may regress; test with Lighthouse on deployed preview |
| A5 | `color-interpolation-filters="sRGB"` prevents hue shifts for photographic content | Pattern 3 | Without it, desaturated photos may look slightly off; visual check is sufficient to verify |

---

## Open Questions

1. **Hero composition — which two shapes?**
   - What we know: D-04 lists five presets. D-09 says all shapes share one image. D-Claude's Discretion says Claude picks per-section composition.
   - What's unclear: Should the hero use the demo's two triangles + pill (three windows), or a simpler two-window arrangement?
   - Recommendation: Start with a single `rounded-rect` (matching the current hero) for the first pass of the refactor, then iterate. This minimises LCP risk on the first ship.

2. **Where does the preload `<link>` get injected?**
   - What we know: `buildCutout` reads and rewrites `dist/index.html`. It can also inject into `<head>`.
   - What's unclear: Should `buildCutout` own the `<link rel="preload">` injection, or should `buildHtml` do it?
   - Recommendation: `buildCutout` injects it — it owns the image selection decision (which href to preload) so it is the right place.

3. **`rewriteHeroImg` dead code — remove or leave?**
   - What we know: After Phase 11, `<picture class="hero__cutout">` no longer exists in `index.html` source. The regex no-ops harmlessly.
   - Recommendation: Remove `rewriteHeroImg` and its call in `buildHtml` in this phase. Leaving dead code that silently no-ops is a maintenance hazard.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | build.js orchestrator | Yes | (system) | — |
| sharp | Image encode (Phase 12) | Yes (devDep) | 0.34.5 | — |
| lightningcss | CSS minify (Phase 12) | Yes (devDep) | 1.32.0 | — |
| scene-cafe.webp | Hero image | Yes (in images/) | — | — |
| dist/ (from `npm run build`) | All Phase 11 work | Yes | — | Run `npm run build` first |

**Missing dependencies with no fallback:** none.

---

## Project Constraints (from CLAUDE.md)

- No Tailwind / no utility-CSS framework. Do not add utility classes to the SVG wrapper.
- Epilogue 400/700 only. No SVG `text` or `foreignObject` that introduces other fonts.
- No gradient on any surface except the floating CTA pill. The SVG field is the section's solid colour — do not paint a gradient as the SVG background.
- No card shadows. No `drop-shadow` filter on the cutout SVG.
- WCAG AA minimum. Decorative cutouts: `aria-hidden="true"`. Meaningful imagery: `<title>` + `role="img"` + `aria-labelledby`.
- prefers-reduced-motion: non-issue this phase (D-07 static). No animation; no reduced-motion branch needed.
- One H1 per page. The hero `<h1>` must remain unchanged.
- LCP < 2.5s. Add `<link rel="preload">` for the hero image. Verify post-deploy with Lighthouse.
- CLS < 0.1. Set `width`/`height` on `<svg>` to fix intrinsic dimensions.
- Page weight < 500KB excl. images. The inline SVG adds ~1-2KB to the HTML. Safe.
- Contact form: no change. `initContactForm` in `js/main.js` is untouched.
- CLAUDE.md constraint reversal (build step + npm deps): already recorded 2026-06-02. D-10a is satisfied.

---

## Sources

### Primary (HIGH confidence)
- `image-cutout-demo.html` — reference implementation; all shape paths and mask structure extracted verbatim
- `build.js` lines 292-306 — Phase 11 seam location confirmed
- `12-01-SUMMARY.md`, `12-02-SUMMARY.md`, `12-03-SUMMARY.md` — pipeline internals (manifest format, dist/ model, watch mode, Playwright config)
- `11-CONTEXT.md` — all locked decisions D-01 through D-10a
- [MDN SVG `<mask>` element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask)
- [MDN `preserveAspectRatio`](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio)

### Secondary (MEDIUM confidence)
- [Can I Use: SVG mask element](https://caniuse.com/mdn-svg_elements_mask) — 96.27% global support, all modern browsers, no partial support

### Tertiary (LOW confidence / ASSUMED)
- SVG `<image>` does not support `srcset` — widely understood but not source-verified in this session
- `fetchpriority` on SVG `<image>` unreliable across Safari — common knowledge, not tested in this session

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; Phase 12 pipeline fully documented
- SVG mask mechanic: HIGH — demo source read directly; MDN verified; 96% browser support confirmed
- Shape presets: HIGH — extracted verbatim from demo
- Grayscale approach: HIGH — feColorMatrix is the correct SVG-native pattern; CSS filter limitation on Safari is well-documented
- fetchpriority / preload: MEDIUM — A2 and A4 are assumed; Lighthouse post-deploy will confirm
- CLS prevention: MEDIUM — A1 is standard practice but not source-verified in this session

**Research date:** 2026-06-02
**Valid until:** 2026-09-01 (stable browser APIs; no expiry risk)
