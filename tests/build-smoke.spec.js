// @ts-check
/**
 * looktwice.uk — Build smoke spec.
 *
 * Asserts dist/ output integrity after `npm run build`. Runs via the filesystem
 * directly — no browser navigation required. Covers BUILD-01/02/03/04 gaps from
 * the Phase 12 validation architecture (Wave 0 gaps).
 *
 * What it checks:
 *   1. dist/index.html exists.
 *   2. dist/_headers byte-identical to source _headers (Pitfall 1 / T-12-01).
 *   3. dist/js/main.js byte-identical to source js/main.js (D-01 / no minify).
 *   4. All 5 CSS files present in dist/css/ AND each smaller than its source.
 *   5. 4-width AVIF + WebP variants for scene-cafe exist in dist/images/.
 *   6. dist/index.html contains srcset and type="image/avif" (build rewrite applied).
 *   7. dist/index.html does NOT contain hello@looktwice.uk (Pitfall 5 / T-12-02).
 *
 * Usage:
 *   npm run build && npx playwright test tests/build-smoke.spec.js --project=desktop-1440
 *
 * This spec does NOT need the 7777 web server — it reads dist/ directly via Node fs.
 * It is safe to run before plan 12-02 wires the build-first Playwright webServer config.
 */

'use strict';

const { test, expect } = require('@playwright/test');
const fs   = require('node:fs');
const path = require('node:path');

// Resolve paths relative to the repo root (one level up from tests/).
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// ---------------------------------------------------------------------------
// 1. dist/index.html exists
// ---------------------------------------------------------------------------
test('dist/index.html exists', () => {
  const htmlPath = path.join(DIST, 'index.html');
  expect(fs.existsSync(htmlPath), `expected ${htmlPath} to exist`).toBe(true);
  const size = fs.statSync(htmlPath).size;
  expect(size, 'dist/index.html should not be empty').toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// 2. dist/_headers byte-identical to source _headers (Pitfall 1 / T-12-01)
// ---------------------------------------------------------------------------
test('dist/_headers byte-identical to source _headers', () => {
  const srcPath  = path.join(ROOT, '_headers');
  const distPath = path.join(DIST, '_headers');

  expect(fs.existsSync(distPath), `expected ${distPath} to exist`).toBe(true);

  const srcBuf  = fs.readFileSync(srcPath);
  const distBuf = fs.readFileSync(distPath);

  expect(
    distBuf.equals(srcBuf),
    '_headers in dist/ must be byte-identical to source _headers (security headers must not be altered)',
  ).toBe(true);
});

// ---------------------------------------------------------------------------
// 3. dist/js/main.js byte-identical to source (D-01 — no minify)
// ---------------------------------------------------------------------------
test('dist/js/main.js byte-identical to source (not minified)', () => {
  const srcPath  = path.join(ROOT, 'js', 'main.js');
  const distPath = path.join(DIST, 'js', 'main.js');

  expect(fs.existsSync(distPath), `expected ${distPath} to exist`).toBe(true);

  const srcBuf  = fs.readFileSync(srcPath);
  const distBuf = fs.readFileSync(distPath);

  expect(
    distBuf.equals(srcBuf),
    'dist/js/main.js must be byte-identical to source (D-01: JS not minified)',
  ).toBe(true);
});

// ---------------------------------------------------------------------------
// 4. All 5 CSS files present in dist/css/ and each smaller than its source
// ---------------------------------------------------------------------------
const CSS_FILES = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'animations.css'];

for (const file of CSS_FILES) {
  test(`dist/css/${file} exists and is minified (smaller than source)`, () => {
    const srcPath  = path.join(ROOT, 'css', file);
    const distPath = path.join(DIST, 'css', file);

    expect(fs.existsSync(distPath), `expected ${distPath} to exist`).toBe(true);

    const srcSize  = fs.statSync(srcPath).size;
    const distSize = fs.statSync(distPath).size;

    expect(
      distSize,
      `dist/css/${file} (${distSize}B) must be smaller than source (${srcSize}B) — CSS not minified`,
    ).toBeLessThan(srcSize);
  });
}

// ---------------------------------------------------------------------------
// 5. 4-width AVIF + WebP variants for scene-cafe exist in dist/images/
// ---------------------------------------------------------------------------
const IMAGE_WIDTHS = [480, 960, 1440, 1920];

for (const w of IMAGE_WIDTHS) {
  test(`dist/images/scene-cafe-${w}.avif exists`, () => {
    const p = path.join(DIST, 'images', `scene-cafe-${w}.avif`);
    expect(fs.existsSync(p), `expected ${p} to exist`).toBe(true);
    expect(fs.statSync(p).size).toBeGreaterThan(0);
  });

  test(`dist/images/scene-cafe-${w}.webp exists`, () => {
    const p = path.join(DIST, 'images', `scene-cafe-${w}.webp`);
    expect(fs.existsSync(p), `expected ${p} to exist`).toBe(true);
    expect(fs.statSync(p).size).toBeGreaterThan(0);
  });
}

// ---------------------------------------------------------------------------
// 6. dist/index.html contains Phase 11 SVG cutout (build rewrite applied)
// ---------------------------------------------------------------------------
test('dist/index.html contains SVG cutout and no CUTOUT marker (Phase 11 build applied)', () => {
  const htmlPath = path.join(DIST, 'index.html');
  expect(fs.existsSync(htmlPath)).toBe(true);

  const html = fs.readFileSync(htmlPath, 'utf8');

  expect(html, 'dist/index.html must contain injected <svg class="cutout"').toContain('<svg class="cutout');
  expect(html, 'dist/index.html must contain feColorMatrix (grayscale filter)').toContain('feColorMatrix');
  expect(html, 'dist/index.html must NOT contain unconsumed CUTOUT marker').not.toContain('<!-- CUTOUT:hero -->');
  expect(html, 'dist/index.html must preserve fetchpriority="high" on hero preload').toContain('fetchpriority="high"');
});

// ---------------------------------------------------------------------------
// 7. No mailto leak (Pitfall 5 / T-12-02 — contact markup untouched by build)
// ---------------------------------------------------------------------------
test('dist/index.html does not contain hello@looktwice.uk (no mailto leak)', () => {
  const htmlPath = path.join(DIST, 'index.html');
  expect(fs.existsSync(htmlPath)).toBe(true);

  const html = fs.readFileSync(htmlPath, 'utf8');

  expect(
    html,
    'dist/index.html must NOT contain hello@looktwice.uk — build must not reintroduce the mailto address',
  ).not.toContain('hello@looktwice.uk');
});
