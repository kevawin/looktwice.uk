/* Render LinkedIn banner variants to exact 1128 × 191 PNGs.
   Strategy: render at 2x via Playwright for crisp glyphs, downscale
   to 1128 × 191 with sharp (Lanczos3 by default → sharp on text). */

const { chromium } = require('@playwright/test');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const http = require('http');

const W = 1128;
const H = 191;
const SCALE = 2;

const PORT = 4811;
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(__dirname, 'exports');

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(ROOT, url === '/' ? '/linkedin-banner/preview.html' : url);
      if (!filePath.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404).end(String(err)); return; }
        const ext = path.extname(filePath).toLowerCase();
        const type = {
          '.html': 'text/html; charset=utf-8',
          '.css':  'text/css; charset=utf-8',
          '.js':   'application/javascript; charset=utf-8',
          '.woff2':'font/woff2',
          '.svg':  'image/svg+xml',
          '.png':  'image/png',
          '.webp': 'image/webp',
        }[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
        res.end(data);
      });
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startStaticServer();
  const browser = await chromium.launch();
  const variants = ['v1', 'v2', 'v3'];

  for (const v of variants) {
    const ctx = await browser.newContext({
      viewport: { width: W, height: H },
      deviceScaleFactor: SCALE,
    });
    const page = await ctx.newPage();
    // Render just one banner per page so the screenshot clip is exact.
    const url = `http://127.0.0.1:${PORT}/linkedin-banner/preview.html?only=${v}`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    // Hide everything except the target variant; strip page chrome.
    await page.addStyleTag({
      content: `
        body { padding: 0 !important; background: #000 !important; gap: 0 !important; }
        body > label { display: none !important; }
        body > div { display: none; }
        body > div:has([data-variant="${v}"]) { display: block; }
        body > div .preview-label { display: none; }
      `,
    });
    await page.evaluate(() => document.fonts.ready);
    // Tiny settle to let layout reflow after fonts.
    await page.waitForTimeout(120);
    const target = await page.locator(`[data-variant="${v}"]`);
    const box = await target.boundingBox();
    const buffer = await page.screenshot({
      clip: { x: box.x, y: box.y, width: W, height: H },
      omitBackground: false,
      type: 'png',
    });
    // Downscale 2x → 1x with sharp.
    const outPath = path.join(OUT_DIR, `look-twice-linkedin-${v}.png`);
    await sharp(buffer)
      .resize(W, H, { kernel: sharp.kernel.lanczos3, fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(outPath);
    const meta = await sharp(outPath).metadata();
    console.log(`✓ ${v}: ${outPath} — ${meta.width}×${meta.height}`);
    await ctx.close();
  }

  await browser.close();
  server.close();
})().catch(err => { console.error(err); process.exit(1); });
