/* Render LinkedIn banner variants to two output sizes:
   - 1× (1128 × 191) for in-repo preview comparison
   - 2× (2256 × 382) for LinkedIn upload — LinkedIn downscales for
     display so the 2× upload renders sharper on retina screens. */

const { chromium } = require('@playwright/test');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const http = require('http');

const W = 1128;
const H = 191;
const SCALE = 2;            // Playwright deviceScaleFactor

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
  const variants = ['v1', 'v2', 'v3', 'v4'];

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
    // 1× — preview-comparison size (downscale 2× source via lanczos3).
    const out1xPath = path.join(OUT_DIR, `look-twice-linkedin-${v}.png`);
    await sharp(buffer)
      .resize(W, H, { kernel: sharp.kernel.lanczos3, fit: 'fill' })
      .png({ compressionLevel: 9 })
      .toFile(out1xPath);
    // 2× — LinkedIn-upload size (keep native 2× pixels, no resize).
    const out2xPath = path.join(OUT_DIR, `look-twice-linkedin-${v}@2x.png`);
    await sharp(buffer)
      .png({ compressionLevel: 9 })
      .toFile(out2xPath);
    const m1 = await sharp(out1xPath).metadata();
    const m2 = await sharp(out2xPath).metadata();
    console.log(`✓ ${v}: 1× ${m1.width}×${m1.height} · 2× ${m2.width}×${m2.height}`);
    await ctx.close();
  }

  await browser.close();
  server.close();
})().catch(err => { console.error(err); process.exit(1); });
