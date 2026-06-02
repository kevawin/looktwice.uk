// build.js — Node build orchestrator for looktwice.uk
// Runs: CSS minify (Lightning CSS) → image encode (sharp) → HTML rewrite → static copy
//
// Output: dist/  (gitignored)
// Usage:  node build.js
//
// Phase 11 extension seam:
//   After buildImages() returns its manifest and before buildHtml(manifest) runs,
//   Phase 11 inserts: manifest = await buildCutout(manifest);
//   That step codegen's SVG cutout masks using the same image manifest and injects
//   them into the dist/ HTML. No other file needs changing.

'use strict';

const fs   = require('node:fs');
const path = require('node:path');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ROOT      = __dirname;
const DIST      = path.join(ROOT, 'dist');
const CACHE_DIR        = path.join(ROOT, '.cache');
const CACHE_FILE       = path.join(CACHE_DIR, 'images.json');
// Encoded image outputs are stored in .cache/images/ so they survive dist/ cleans.
const CACHE_IMAGES_DIR = path.join(CACHE_DIR, 'images');

const CSS_FILES = [
  'tokens.css',
  'base.css',
  'layout.css',
  'components.css',
  'animations.css',
];

// Image widths to encode (px). Applies to every raster in images/.
const IMG_WIDTHS = [480, 960, 1440, 1920];

// ---------------------------------------------------------------------------
// Step 1: cleanDist
// ---------------------------------------------------------------------------

function cleanDist() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  console.log('[build] dist/ cleaned');
}

// ---------------------------------------------------------------------------
// Step 2: buildCss
// ---------------------------------------------------------------------------

async function buildCss() {
  const { transform, browserslistToTargets } = require('lightningcss');

  // browserslist ships as a dep of lightningcss; fall back to hardcoded targets if absent.
  let targets;
  try {
    const browserslist = require('browserslist');
    targets = browserslistToTargets(browserslist('>= 0.5%, last 2 versions, not dead'));
  } catch (_) {
    // Hardcoded fallback covering Chrome 110+, Safari 15+, Firefox 115+.
    targets = { chrome: (110 << 16), safari: (15 << 16), firefox: (115 << 16) };
  }

  const outDir = path.join(DIST, 'css');
  fs.mkdirSync(outDir, { recursive: true });

  for (const file of CSS_FILES) {
    const srcPath = path.join(ROOT, 'css', file);
    const outPath = path.join(outDir, file);
    const code = fs.readFileSync(srcPath);
    const result = transform({
      filename: srcPath,
      code,
      minify: true,
      targets,
    });
    fs.writeFileSync(outPath, result.code);
  }
  console.log(`[build] CSS minified: ${CSS_FILES.length} files → dist/css/`);
}

// ---------------------------------------------------------------------------
// Step 3: buildImages  (returns srcset manifest for buildHtml + Phase 11)
// ---------------------------------------------------------------------------

async function buildImages() {
  const sharp = require('sharp');

  const srcImagesDir = path.join(ROOT, 'images');
  const outImagesDir = path.join(DIST, 'images');
  fs.mkdirSync(outImagesDir, { recursive: true });

  // Encoded outputs are kept in .cache/images/ so they survive dist/ cleans.
  // The mtime cache maps source filename → mtimeMs; if it matches and all cached
  // outputs exist, we skip re-encoding and just copy from .cache/images/ to dist/images/.
  fs.mkdirSync(CACHE_IMAGES_DIR, { recursive: true });
  const cache = fs.existsSync(CACHE_FILE)
    ? JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'))
    : {};

  // Collect all raster sources (webp/jpg/jpeg/png).
  const RASTER_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png']);
  const rasters = fs.readdirSync(srcImagesDir)
    .filter(f => RASTER_EXTS.has(path.extname(f).toLowerCase()));

  // Manifest: { baseName → [{w, avif, webp}] }
  const manifest = {};

  for (const rasterFile of rasters) {
    const srcPath  = path.join(srcImagesDir, rasterFile);
    const baseName = path.basename(rasterFile, path.extname(rasterFile));
    const mtime    = fs.statSync(srcPath).mtimeMs;

    // Check cached outputs exist in .cache/images/ (persists across dist/ cleans).
    const cachedOutputs = IMG_WIDTHS.flatMap(w => [
      path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.avif`),
      path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.webp`),
    ]);
    const allCached = cachedOutputs.every(p => fs.existsSync(p));

    if (cache[rasterFile] === mtime && allCached) {
      console.log(`[build] images: skipped ${rasterFile} (cache hit)`);
      // Copy cached outputs directly to dist/images/ — no re-encode needed.
      for (const w of IMG_WIDTHS) {
        for (const ext of ['avif', 'webp']) {
          const cached = path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.${ext}`);
          const out    = path.join(outImagesDir, `${baseName}-${w}.${ext}`);
          fs.copyFileSync(cached, out);
        }
      }
    } else {
      console.log(`[build] images: encoding ${rasterFile} at ${IMG_WIDTHS.join('/')}px…`);
      for (const w of IMG_WIDTHS) {
        const pipeline = sharp(srcPath).resize({ width: w, withoutEnlargement: true });
        await pipeline.clone()
          .avif({ quality: 50, effort: 4 })
          .toFile(path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.avif`));
        await pipeline.clone()
          .webp({ quality: 78, effort: 4 })
          .toFile(path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.webp`));
      }
      // Copy fresh encodes to dist/images/.
      for (const w of IMG_WIDTHS) {
        for (const ext of ['avif', 'webp']) {
          const cached = path.join(CACHE_IMAGES_DIR, `${baseName}-${w}.${ext}`);
          const out    = path.join(outImagesDir, `${baseName}-${w}.${ext}`);
          fs.copyFileSync(cached, out);
        }
      }
      cache[rasterFile] = mtime;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
    }

    manifest[baseName] = IMG_WIDTHS.map(w => ({
      w,
      avif: `/images/${baseName}-${w}.avif`,
      webp: `/images/${baseName}-${w}.webp`,
    }));
  }

  // Copy the original rasters through verbatim (JSON-LD / og:image references).
  for (const rasterFile of rasters) {
    fs.copyFileSync(
      path.join(srcImagesDir, rasterFile),
      path.join(outImagesDir, rasterFile),
    );
  }

  console.log(`[build] images: manifest built for ${Object.keys(manifest).length} source(s)`);
  return manifest;
}

// ---------------------------------------------------------------------------
// Step 4: buildHtml  — rewrite hero <img> with AVIF/WebP <source srcset>
//
// PHASE 11 SEAM — insert buildCutout step between buildImages and buildHtml:
//   manifest = await buildCutout(manifest);  // Phase 11 adds SVG cutout codegen here
// ---------------------------------------------------------------------------

function buildHtml(manifest) {
  const srcHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const html    = rewriteHeroImg(srcHtml, manifest);
  fs.writeFileSync(path.join(DIST, 'index.html'), html, 'utf8');
  console.log('[build] HTML rewritten → dist/index.html');
}

/**
 * Rewrite the hero <picture class="hero__cutout"> block.
 * Injects <source type="image/avif"> and <source type="image/webp"> before the
 * existing <img>, keeping the <img> as a fallback with all its attributes intact.
 *
 * Targets the pattern:
 *   <picture class="hero__cutout">
 *     <img src="/images/scene-cafe.webp" …>
 *   </picture>
 *
 * Only rewrites the hero__cutout picture; leaves all other markup untouched.
 */
function rewriteHeroImg(html, manifest) {
  // Match the hero__cutout <picture> block — content between opening and closing tag.
  // The regex is intentionally non-greedy and scoped to picture.hero__cutout.
  return html.replace(
    /(<picture\s[^>]*class="hero__cutout"[^>]*>)([\s\S]*?)(<\/picture>)/,
    (_, openTag, inner, closeTag) => {
      // Extract the <img> element from the current inner content.
      const imgMatch = inner.match(/<img\b[\s\S]*?>/);
      if (!imgMatch) return _; // nothing to rewrite — leave intact

      // Extract src to find the source image basename (e.g. "scene-cafe").
      const srcMatch = imgMatch[0].match(/\bsrc="\/images\/([^"]+)"/);
      if (!srcMatch) return _;

      const srcFile  = srcMatch[1]; // e.g. "scene-cafe.webp"
      const baseName = path.basename(srcFile, path.extname(srcFile)); // "scene-cafe"
      const entries  = manifest[baseName];
      if (!entries) return _; // no encoded variants — leave as-is

      const sizes = '(max-width: 768px) 85vw, 40vw';

      const avifSrcset = entries.map(e => `${e.avif} ${e.w}w`).join(', ');
      const webpSrcset = entries.map(e => `${e.webp} ${e.w}w`).join(', ');

      const avifSource = `  <source type="image/avif"\n          srcset="${avifSrcset}"\n          sizes="${sizes}">`;
      const webpSource = `  <source type="image/webp"\n          srcset="${webpSrcset}"\n          sizes="${sizes}">`;

      // Preserve the original <img> exactly — only add <source> elements before it.
      const imgEl = imgMatch[0].replace(/^\s+/, '  '); // normalise leading whitespace
      const newInner = `\n${avifSource}\n${webpSource}\n  ${imgEl}\n`;

      return `${openTag}${newInner}${closeTag}`;
    }
  );
}

// ---------------------------------------------------------------------------
// Step 5: copyStatic  — verbatim copy of all static assets into dist/
// ---------------------------------------------------------------------------

function copyStatic() {
  const copies = [
    // Root meta/config files
    { src: '_headers',    dest: '_headers' },
    { src: 'robots.txt',  dest: 'robots.txt' },
    { src: 'favicon.svg', dest: 'favicon.svg' },
    // Fonts directory (includes OFL.txt + all woff2 files)
    { src: 'fonts',       dest: 'fonts',  dir: true },
    // JS — main.js copied verbatim, NO minify (D-01)
    { src: 'js',          dest: 'js',     dir: true },
    // SVG logos in images/ (referenced in <use href> / JSON-LD)
    // (rasters already copied in buildImages; only SVGs remain)
    ...svgLogos(),
  ];

  for (const { src, dest, dir } of copies) {
    const srcPath  = path.join(ROOT, src);
    const destPath = path.join(DIST, dest);
    if (!fs.existsSync(srcPath)) {
      console.warn(`[build] copyStatic: source not found, skipping: ${src}`);
      continue;
    }
    if (dir) {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
    }
  }
  console.log('[build] static assets copied → dist/');
}

/** Return copy entries for every SVG in images/. */
function svgLogos() {
  const imagesDir = path.join(ROOT, 'images');
  if (!fs.existsSync(imagesDir)) return [];
  return fs.readdirSync(imagesDir)
    .filter(f => f.endsWith('.svg'))
    .map(f => ({
      src:  path.join('images', f),
      dest: path.join('images', f),
      dir:  false,
    }));
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

async function build() {
  const t0 = Date.now();
  cleanDist();
  await buildCss();
  const manifest = await buildImages();

  // ---- PHASE 11 SEAM -------------------------------------------------------
  // Insert:  manifest = await buildCutout(manifest);
  // Phase 11's buildCutout(manifest) generates SVG cutout masks from the image
  // manifest, writes them to dist/, and returns an augmented manifest.
  // --------------------------------------------------------------------------

  buildHtml(manifest);
  copyStatic();
  console.log(`[build] done in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

// ---------------------------------------------------------------------------
// Watch mode  (node build.js --watch)
// ---------------------------------------------------------------------------

/**
 * Watch mode: run an initial full build, then watch source dirs for changes.
 * On change, rebuild into dist/ so browser-sync (watching dist/**) hot-reloads.
 *
 * Uses built-in fs.watch — no extra dependency. Debounced at 200ms to coalesce
 * rapid saves (e.g. editor auto-save on each keystroke) into a single rebuild.
 *
 * Source dirs watched:
 *   index.html, css/, js/, images/, _headers
 * These match the source inputs to build.js steps 1–5.
 */
async function watch() {
  await build();

  const WATCH_TARGETS = [
    path.join(ROOT, 'index.html'),
    path.join(ROOT, 'css'),
    path.join(ROOT, 'js'),
    path.join(ROOT, 'images'),
    path.join(ROOT, '_headers'),
  ];

  console.log('[build:watch] Watching source files… (Ctrl-C to stop)');

  let rebuildTimer = null;

  function scheduleRebuild(filename) {
    if (rebuildTimer) clearTimeout(rebuildTimer);
    rebuildTimer = setTimeout(async () => {
      rebuildTimer = null;
      console.log(`[build:watch] Change detected${filename ? ': ' + filename : ''} — rebuilding…`);
      await build();
    }, 200);
  }

  for (const target of WATCH_TARGETS) {
    if (!fs.existsSync(target)) continue;
    fs.watch(target, { recursive: true }, (_event, filename) => {
      scheduleRebuild(filename || target);
    });
  }
}

const isWatch = process.argv.includes('--watch');
if (isWatch) {
  watch().catch(e => { console.error(e); process.exit(1); });
} else {
  build().catch(e => { console.error(e); process.exit(1); });
}
