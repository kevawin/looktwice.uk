// buildCutout.js — Phase 11 SVG cutout codegen for looktwice.uk
// Generates inline SVG mask markup (five shape presets, feColorMatrix grayscale)
// and injects it into dist/index.html by replacing <!-- CUTOUT:ID --> markers.
//
// Output: dist/index.html (modified in-place after buildHtml writes it)
// Usage:  manifest = await buildCutout(manifest);  // at Phase 11 seam in build.js
//
// Security invariant (T-11-01): All values interpolated into the SVG string
// (image href, viewBox, shape coords, alt text) originate from controlled build
// inputs — the hardcoded CUTOUT_CONFIGS and the manifest produced by buildImages().
// No untrusted/external string ever reaches the SVG template.

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// Shape preset generators — return SVG element strings in viewBox coordinates.
// Five presets per D-04: circle, down-triangle, up-triangle, pill, rounded-rect.
//
// Triangle paths and pill rect are extracted VERBATIM from image-cutout-demo.html
// (do not recompute Bezier math — see RESEARCH.md "Don't Hand-Roll").
// ---------------------------------------------------------------------------

const SHAPE_PRESETS = {

  // Rounded down-pointing triangle (top-left position in demo).
  // d-attribute extracted verbatim from image-cutout-demo.html.
  'down-triangle': () =>
    `<path d="M 83.14,0 L 516.86,0 Q 600,0 558.43,72.04 L 341.57,447.56 Q 300,519.6 258.43,447.56 L 41.57,72.04 Q 0,0 83.14,0 Z" fill="white"/>`,

  // Rounded up-pointing triangle (top-right position in demo).
  // d-attribute extracted verbatim from image-cutout-demo.html.
  'up-triangle': () =>
    `<path d="M 658.43,72.04 Q 700,0 741.57,72.04 L 958.43,447.56 Q 1000,519.6 916.86,519.6 L 483.14,519.6 Q 400,519.6 441.57,447.56 Z" fill="white"/>`,

  // Pill / stadium shape (bottom band in demo).
  // x/y/w/h extracted verbatim from image-cutout-demo.html; rx = h/2 produces the stadium.
  'pill': ({ x = 0, y = 544.6, w = 1000, h = 519.6 } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white"/>`,

  // Circle with parameterised centre and radius.
  'circle': ({ cx = 500, cy = 500, r = 300 } = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/>`,

  // Rounded rectangle with parameterised position, dimensions, and corner radius.
  'rounded-rect': ({ x = 50, y = 50, w = 900, h = 964, rx = 80 } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="white"/>`,
};

// ---------------------------------------------------------------------------
// Cutout region configs — one entry per instance rendered on the page.
//
// Hero uses the demo's two interlocking triangles (down-triangle top-left +
// up-triangle top-right). The triangle paths span y 0→519.6, so the viewBox
// height is set to 519.6 — no empty Hot Pink band below the shapes.
// ---------------------------------------------------------------------------

const CUTOUT_CONFIGS = [
  {
    id:           'hero',
    image:        'scene-cafe',     // manifest key from buildImages()
    viewBox:      '0 0 1000 519.6',
    width:        1000,
    height:       519.6,
    loading:      'eager',
    fetchpriority: 'high',
    alt:          '',               // decorative — hero <h1> carries the meaning
    shapes: [
      { type: 'down-triangle' },
      { type: 'up-triangle' },
    ],
  },
];

// ---------------------------------------------------------------------------
// SVG string generator
// ---------------------------------------------------------------------------

/**
 * Build a self-contained inline SVG string for one cutout region.
 *
 * D-09: ONE <image> behind ONE <mask> holding all shape paths.
 * D-03: Grayscale via feColorMatrix, not CSS filter (unreliable on Safari SVG <image>).
 * D-06: href from manifest — never a hardcoded path, never base64.
 * Pitfall 1: All IDs suffixed with config.id so multiple instances don't collide.
 * Pitfall 3: width/height attributes on <svg> lock in the intrinsic ratio (CLS guard).
 *
 * @param {object} config  - Entry from CUTOUT_CONFIGS
 * @param {object} manifest - buildImages() manifest: { baseName: [{w, avif, webp}] }
 * @returns {string} Inline SVG markup string
 */
function buildSvgString(config, manifest) {
  const { id, image, viewBox, width, height, loading, fetchpriority, alt, shapes } = config;

  const entries = manifest[image];
  const entry   = (entries && entries.find(e => e.w === 960)) || (entries && entries[1]);
  if (!entry) throw new Error(`[buildCutout] no manifest entry for image: ${image}`);

  const href = entry.webp; // single-resolution href; SVG <image> does not support srcset

  // Build shape markup — each shape must be a known preset (T-11-03 fail-closed).
  const shapesMarkup = shapes
    .map(s => {
      const gen = SHAPE_PRESETS[s.type];
      if (!gen) throw new Error(`[buildCutout] unknown shape preset: ${s.type}`);
      return '      ' + gen(s.opts || {});
    })
    .join('\n');

  const filterId = `cutout-grayscale-${id}`;
  const maskId   = `cutout-windows-${id}`;

  // Accessibility branch (11-PATTERNS.md accessibility-on-inline-SVG):
  //   - Empty/falsy alt  → decorative (aria-hidden="true" role="presentation")
  //   - Non-empty alt    → meaningful (role="img" + aria-labelledby + <title>)
  const isDecorative = !alt;
  const a11yAttrs = isDecorative
    ? `aria-hidden="true" role="presentation"`
    : `role="img" aria-labelledby="cutout-title-${id}"`;
  const titleEl = isDecorative
    ? ''
    : `\n  <title id="cutout-title-${id}">${alt}</title>`;

  const fetchpriorityAttr = fetchpriority
    ? `\n         fetchpriority="${fetchpriority}"`
    : '';

  return `<svg class="cutout cutout--${id}" viewBox="${viewBox}" width="${width}" height="${height}"
     preserveAspectRatio="xMidYMid slice"
     xmlns="http://www.w3.org/2000/svg"
     ${a11yAttrs}>${titleEl}
  <defs>
    <filter id="${filterId}" color-interpolation-filters="sRGB">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <mask id="${maskId}" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
${shapesMarkup}
    </mask>
  </defs>
  <image href="${href}"
         x="0" y="0" width="${width}" height="${height}"
         preserveAspectRatio="xMidYMid slice"
         mask="url(#${maskId})"
         filter="url(#${filterId})"
         decoding="async"${fetchpriorityAttr}/>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main export — called at the Phase 11 seam in build.js:
//   manifest = await buildCutout(manifest);
// ---------------------------------------------------------------------------

/**
 * Inject SVG cutout markup into dist/index.html.
 *
 * Reads dist/index.html, replaces each <!-- CUTOUT:{id} --> marker with the
 * generated SVG string, writes the file back. Returns manifest unchanged.
 *
 * Recoverable: missing marker logs a console.warn and continues (T-11-03).
 * Unrecoverable: missing manifest entry throws (build fails cleanly).
 *
 * @param {object} manifest - buildImages() manifest
 * @returns {Promise<object>} The manifest, unchanged
 */
/**
 * @param {object} manifest - buildImages() manifest
 * @param {{ htmlPath?: string }} [opts] - optional overrides (htmlPath for testing)
 * @returns {Promise<object>} The manifest, unchanged
 */
async function buildCutout(manifest, opts = {}) {
  const htmlPath = opts.htmlPath || path.join(DIST, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');

  for (const config of CUTOUT_CONFIGS) {
    const marker = `<!-- CUTOUT:${config.id} -->`;
    if (!html.includes(marker)) {
      console.warn(`[buildCutout] marker not found for ${config.id}: ${marker}`);
      continue;
    }
    const svg = buildSvgString(config, manifest);
    html = html.replace(marker, svg);
    console.log(`[buildCutout] injected cutout: ${config.id}`);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
  return manifest;
}

module.exports = { buildCutout, buildSvgString, SHAPE_PRESETS, CUTOUT_CONFIGS };
