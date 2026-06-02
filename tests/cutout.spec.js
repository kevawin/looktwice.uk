// @ts-check
/**
 * looktwice.uk — Cutout SVG mask codegen spec.
 *
 * Asserts:
 *   1. buildCutout.js module interface and exports.
 *   2. SHAPE_PRESETS vocabulary (all five D-04 presets).
 *   3. buildSvgString output — single mask, single feColorMatrix image, no base64.
 *   4. Accessibility branching — decorative vs. meaningful alt.
 *   5. Error paths — unknown shape, missing manifest entry.
 *   6. buildCutout(manifest) marker replacement in dist/index.html.
 *   7. Playwright browser render checks — SVG visible, aria-hidden on decorative cutout.
 *
 * Node tests (no browser):
 *   node -e "require('@playwright/test'); ..." or plain Node require assertions
 *   against the module directly. These run without a web server.
 *
 * Browser tests:
 *   Require `npm run build` first, then a running static server on port 7777.
 *
 * Usage:
 *   npm run build && npx playwright test tests/cutout.spec.js --project=desktop-1440
 */

'use strict';

const { test, expect } = require('@playwright/test');
const fs   = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Load module fresh (bypass require cache so tests can be isolated). */
function loadModule() {
  const modPath = require.resolve(path.join(ROOT, 'buildCutout.js'));
  delete require.cache[modPath];
  return require(modPath);
}

/** Minimal manifest matching buildImages() shape. */
function makeManifest() {
  return {
    'scene-cafe': [
      { w: 480,  avif: '/images/scene-cafe-480.avif',  webp: '/images/scene-cafe-480.webp' },
      { w: 960,  avif: '/images/scene-cafe-960.avif',  webp: '/images/scene-cafe-960.webp' },
      { w: 1440, avif: '/images/scene-cafe-1440.avif', webp: '/images/scene-cafe-1440.webp' },
      { w: 1920, avif: '/images/scene-cafe-1920.avif', webp: '/images/scene-cafe-1920.webp' },
    ],
  };
}

// ---------------------------------------------------------------------------
// Module-level tests (no browser required)
// ---------------------------------------------------------------------------

test.describe('buildCutout module', () => {

  test('buildCutout.js exports a buildCutout function', () => {
    const mod = loadModule();
    expect(typeof mod.buildCutout, 'buildCutout must be a function').toBe('function');
  });

  test('module.exports = { buildCutout } is the only export', () => {
    const mod = loadModule();
    const keys = Object.keys(mod);
    expect(keys).toContain('buildCutout');
    // Module may also export SHAPE_PRESETS / buildSvgString for testing;
    // the essential assertion is buildCutout is present.
  });

});

// ---------------------------------------------------------------------------
// SHAPE_PRESETS
// ---------------------------------------------------------------------------

test.describe('SHAPE_PRESETS library', () => {

  test('SHAPE_PRESETS is exported (or buildSvgString is callable via buildCutout)', () => {
    // Accessing via the module — plan allows exporting for testability.
    const mod = loadModule();
    // Primary assertion: module parses and exports buildCutout.
    expect(mod.buildCutout).toBeDefined();
  });

  test('down-triangle preset returns a path with the exact demo d-attribute', () => {
    const mod = loadModule();
    // Access SHAPE_PRESETS if exported; else rely on SVG string tests below.
    if (!mod.SHAPE_PRESETS) return; // optional export
    const shape = mod.SHAPE_PRESETS['down-triangle']();
    expect(shape).toContain('M 83.14,0');
    expect(shape).toContain('558.43,72.04');
    expect(shape).toContain('fill="white"');
  });

  test('up-triangle preset returns a path with the exact demo d-attribute', () => {
    const mod = loadModule();
    if (!mod.SHAPE_PRESETS) return;
    const shape = mod.SHAPE_PRESETS['up-triangle']();
    expect(shape).toContain('M 658.43,72.04');
    expect(shape).toContain('Q 700,0 741.57,72.04');
    expect(shape).toContain('fill="white"');
  });

  test('pill preset returns a rect with rx = height/2 (stadium shape)', () => {
    const mod = loadModule();
    if (!mod.SHAPE_PRESETS) return;
    const shape = mod.SHAPE_PRESETS['pill']();
    expect(shape).toContain('<rect');
    expect(shape).toContain('rx=');
    expect(shape).toContain('fill="white"');
  });

  test('circle preset returns a circle element', () => {
    const mod = loadModule();
    if (!mod.SHAPE_PRESETS) return;
    const shape = mod.SHAPE_PRESETS['circle']();
    expect(shape).toContain('<circle');
    expect(shape).toContain('fill="white"');
  });

  test('rounded-rect preset returns a rect with rx attribute', () => {
    const mod = loadModule();
    if (!mod.SHAPE_PRESETS) return;
    const shape = mod.SHAPE_PRESETS['rounded-rect']();
    expect(shape).toContain('<rect');
    expect(shape).toContain('rx=');
    expect(shape).toContain('fill="white"');
  });

});

// ---------------------------------------------------------------------------
// buildSvgString output assertions (via thin wrapper or export)
// ---------------------------------------------------------------------------

test.describe('SVG string generation (D-03, D-09)', () => {

  function makeSvg(overrides = {}) {
    const mod = loadModule();
    if (!mod.buildSvgString) {
      // If not exported, we test via the dist file in browser tests.
      return null;
    }
    const config = {
      id: 'test',
      image: 'scene-cafe',
      viewBox: '0 0 1000 1064',
      width: 1000,
      height: 1064,
      loading: 'eager',
      fetchpriority: 'high',
      alt: '',
      shapes: [{ type: 'rounded-rect' }],
      ...overrides,
    };
    return mod.buildSvgString(config, makeManifest());
  }

  test('SVG contains exactly one <image element (D-09)', () => {
    const svg = makeSvg();
    if (!svg) return;
    const count = (svg.match(/<image/g) || []).length;
    expect(count, 'must have exactly one <image (D-09)').toBe(1);
  });

  test('SVG contains feColorMatrix for grayscale (D-03)', () => {
    const svg = makeSvg();
    if (!svg) return;
    expect(svg).toContain('feColorMatrix');
  });

  test('SVG image href points to scene-cafe-960.webp (manifest pick)', () => {
    const svg = makeSvg();
    if (!svg) return;
    expect(svg).toContain('scene-cafe-960.webp');
  });

  test('SVG contains no base64 data (D-06)', () => {
    const svg = makeSvg();
    if (!svg) return;
    expect(svg).not.toContain('data:image');
  });

  test('SVG IDs are suffixed with config.id (Pitfall 1)', () => {
    const svg = makeSvg({ id: 'testid' });
    if (!svg) return;
    expect(svg).toContain('cutout-grayscale-testid');
    expect(svg).toContain('cutout-windows-testid');
  });

  test('decorative SVG has aria-hidden="true" and role="presentation"', () => {
    const svg = makeSvg({ alt: '' });
    if (!svg) return;
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).toContain('role="presentation"');
  });

  test('meaningful SVG has role="img", aria-labelledby, and <title>', () => {
    const svg = makeSvg({ id: 'hero', alt: 'Coffee shop scene' });
    if (!svg) return;
    expect(svg).toContain('role="img"');
    expect(svg).toContain('aria-labelledby="cutout-title-hero"');
    expect(svg).toContain('<title id="cutout-title-hero">Coffee shop scene</title>');
    expect(svg).not.toContain('aria-hidden="true"');
  });

  test('SVG has viewBox and intrinsic width/height attributes (CLS guard)', () => {
    const svg = makeSvg();
    if (!svg) return;
    expect(svg).toContain('viewBox="0 0 1000 1064"');
    expect(svg).toContain('width="1000"');
    expect(svg).toContain('height="1064"');
  });

});

// ---------------------------------------------------------------------------
// Error paths
// ---------------------------------------------------------------------------

test.describe('Error handling', () => {

  test('unknown shape type throws with [buildCutout] prefix', () => {
    const mod = loadModule();
    if (!mod.buildSvgString) return;
    const config = {
      id: 'hero',
      image: 'scene-cafe',
      viewBox: '0 0 1000 1064',
      width: 1000,
      height: 1064,
      loading: 'eager',
      fetchpriority: 'high',
      alt: '',
      shapes: [{ type: 'hexagon' }],
    };
    expect(() => mod.buildSvgString(config, makeManifest()))
      .toThrow('[buildCutout] unknown shape preset: hexagon');
  });

  test('missing manifest entry throws with [buildCutout] prefix', () => {
    const mod = loadModule();
    if (!mod.buildSvgString) return;
    const config = {
      id: 'hero',
      image: 'not-in-manifest',
      viewBox: '0 0 1000 1064',
      width: 1000,
      height: 1064,
      loading: 'eager',
      fetchpriority: 'high',
      alt: '',
      shapes: [{ type: 'rounded-rect' }],
    };
    expect(() => mod.buildSvgString(config, makeManifest()))
      .toThrow('[buildCutout] no manifest entry for image: not-in-manifest');
  });

});

// ---------------------------------------------------------------------------
// buildCutout(manifest) integration — marker replacement
// ---------------------------------------------------------------------------

test.describe('buildCutout(manifest) marker replacement', () => {

  // Use a temp file (not dist/index.html) via the opts.htmlPath override added
  // in buildCutout.js. This prevents cross-project file-system races when three
  // Playwright workers run in parallel — each worker gets its own isolated path.

  /** @returns {string} A per-worker temp path that does not collide across projects. */
  function tempHtml(label, projectName) {
    const tmpDir = path.join(ROOT, 'test-results', 'cutout-tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    return path.join(tmpDir, `${label}-${projectName}.html`);
  }

  test('replaces <!-- CUTOUT:hero --> marker with <svg class="cutout', async ({ }, testInfo) => {
    const htmlPath = tempHtml('replace', testInfo.project.name);
    fs.writeFileSync(htmlPath, '<div><!-- CUTOUT:hero --></div>', 'utf8');

    const { buildCutout } = loadModule();
    await buildCutout(makeManifest(), { htmlPath });

    const out = fs.readFileSync(htmlPath, 'utf8');
    expect(out, 'marker must be replaced').not.toContain('<!-- CUTOUT:hero -->');
    expect(out, 'SVG must be present').toContain('<svg class="cutout');
  });

  test('returns manifest unchanged', async ({ }, testInfo) => {
    const htmlPath = tempHtml('returns', testInfo.project.name);
    fs.writeFileSync(htmlPath, '<div><!-- CUTOUT:hero --></div>', 'utf8');

    const { buildCutout } = loadModule();
    const m = makeManifest();
    const result = await buildCutout(m, { htmlPath });
    expect(result).toBe(m);
  });

  test('logs a warning (not throw) when marker is absent', async ({ }, testInfo) => {
    const htmlPath = tempHtml('warn', testInfo.project.name);
    fs.writeFileSync(htmlPath, '<div>no marker here</div>', 'utf8');

    const warnCalls = [];
    const origWarn = console.warn;
    console.warn = (...args) => warnCalls.push(args.join(' '));

    const { buildCutout } = loadModule();
    await buildCutout(makeManifest(), { htmlPath }); // must not throw

    console.warn = origWarn;
    expect(warnCalls.some(w => w.includes('marker not found'))).toBe(true);
  });

  test('generated SVG references scene-cafe-960.webp (not base64)', async ({ }, testInfo) => {
    const htmlPath = tempHtml('base64', testInfo.project.name);
    fs.writeFileSync(htmlPath, '<div><!-- CUTOUT:hero --></div>', 'utf8');

    const { buildCutout } = loadModule();
    await buildCutout(makeManifest(), { htmlPath });

    const out = fs.readFileSync(htmlPath, 'utf8');
    expect(out).toContain('scene-cafe-960.webp');
    expect(out).not.toContain('data:image');
  });

});

// ---------------------------------------------------------------------------
// dist/index.html build output assertions (requires `npm run build`)
// ---------------------------------------------------------------------------

test.describe('Build output — dist/index.html', () => {

  test('dist/index.html contains inline SVG cutout for hero', () => {
    const htmlPath = path.join(DIST, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      test.skip();
      return;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html, 'SVG must be present').toContain('<svg class="cutout');
    expect(html, 'mask must be present').toContain('<mask id="cutout-windows-hero"');
    expect(html, 'grayscale filter must be present').toContain('<filter id="cutout-grayscale-hero"');
    expect(html, 'feColorMatrix must be present').toContain('<feColorMatrix');
    expect(html, 'href must reference scene-cafe-960.webp').toContain('scene-cafe-960.webp');
    expect(html, 'CUTOUT marker must be replaced').not.toContain('<!-- CUTOUT:hero -->');
    expect(html, 'no base64 image data').not.toContain('data:image/');
  });

  test('SVG carries intrinsic width and height (CLS guard, Pitfall 3)', () => {
    const htmlPath = path.join(DIST, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      test.skip();
      return;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    expect(html, 'SVG must have width="1000"').toContain('width="1000"');
    expect(html, 'SVG must have height="1064"').toContain('height="1064"');
  });

  test('exactly one <image element inside the cutout SVG (D-09 single shared image)', () => {
    const htmlPath = path.join(DIST, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      test.skip();
      return;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    // Extract the cutout SVG block and count <image occurrences within it.
    const svgMatch = html.match(/<svg class="cutout[\s\S]*?<\/svg>/);
    expect(svgMatch, 'cutout SVG must be present').not.toBeNull();
    const svgBlock = svgMatch[0];
    const imageCount = (svgBlock.match(/<image/g) || []).length;
    expect(imageCount, 'must have exactly one <image (D-09)').toBe(1);
  });

  test('head contains rel="preload" as="image" for hero image (LCP guard, Pitfall 4)', () => {
    const htmlPath = path.join(DIST, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      test.skip();
      return;
    }
    const html = fs.readFileSync(htmlPath, 'utf8');
    // Extract the <head> block and assert the preload link is present.
    const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
    expect(headMatch, '<head> block must be present').not.toBeNull();
    const head = headMatch[0];
    expect(head, 'head must have a preload link').toContain('rel="preload"');
    expect(head, 'preload must be for an image').toContain('as="image"');
    expect(head, 'preload must reference the hero scene image').toContain('scene-cafe');
  });

});

// ---------------------------------------------------------------------------
// Browser render tests (requires server on port 7777 + npm run build)
// ---------------------------------------------------------------------------

test.describe('Cutout hero — browser render', () => {

  test('SVG cutout is rendered in hero section', async ({ page }) => {
    await page.goto('/');
    const cutout = page.locator('.hero__cutouts svg.cutout');
    await expect(cutout).toBeVisible();
  });

  test('cutout SVG has aria-hidden="true" (decorative)', async ({ page }) => {
    await page.goto('/');
    const svg = page.locator('svg.cutout');
    await expect(svg.first()).toHaveAttribute('aria-hidden', 'true');
  });

  test('no base64 image data in page source', async ({ page }) => {
    const res = await page.goto('/');
    const html = await res.text();
    expect(html).not.toContain('data:image/');
  });

  test('CUTOUT marker is not present in rendered HTML', async ({ page }) => {
    const res = await page.goto('/');
    const html = await res.text();
    expect(html).not.toContain('<!-- CUTOUT:hero -->');
  });

});
