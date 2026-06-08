/* Export each banner variant as a layered SVG for Figma editing.
   Output structure (each element a separate Figma-editable layer):
     1. Background rect (hot-pink)
     2. Amber TL overlay rect (linear-gradient → transparent)
     3. Purple BR overlay rect (transparent → linear-gradient)
     4. Top white bar rect
     5. Bottom white bar rect
     6. Line 1 text
     7. Line 2 text (with italic tspan for "customer's eyes") */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const http = require('http');

const W = 1128;
const H = 191;
const PORT = 4812;
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(__dirname, 'exports');

// Gradient intensity per variant — must match banner.css.
const VARIANT_GRADIENTS = {
  v1: { tlAlpha: 0.55, brAlpha: 0.25 },
  v2: { tlAlpha: 0.75, brAlpha: 0.42 },
  v3: { tlAlpha: 0.90, brAlpha: 0.58 },
  v4: { tlAlpha: 1.00, brAlpha: 0.78 },
};

const PALETTE = {
  pink:   '#E0006E',
  amber:  '#F59300',
  purple: '#6C2C8C',
  white:  '#FFFFFF',
};

function startStaticServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.join(ROOT, url === '/' ? '/linkedin-banner/preview.html' : url);
      if (!filePath.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404).end(String(err)); return; }
        const type = {
          '.html': 'text/html; charset=utf-8',
          '.css':  'text/css; charset=utf-8',
          '.js':   'application/javascript; charset=utf-8',
          '.woff2':'font/woff2',
        }[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
        res.end(data);
      });
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

/* Measure the layout in the browser so the SVG bar/text positions
   exactly mirror the CSS-rendered banner. Returns positions in
   banner-local coordinates (banner top-left = 0,0). */
async function measureVariant(page, variant) {
  const url = `http://127.0.0.1:${PORT}/linkedin-banner/preview.html`;
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(120);

  return await page.evaluate((v) => {
    const banner = document.querySelector(`[data-variant="${v}"]`);
    const bRect = banner.getBoundingClientRect();
    const lines = banner.querySelectorAll('.banner__line');
    const bars  = banner.querySelectorAll('.bar');
    const em    = banner.querySelector('.banner__line em');

    const rel = (el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        x: r.left - bRect.left,
        y: r.top - bRect.top,
        w: r.width,
        h: r.height,
        // baseline-y for text approximation: top + (h * 0.78) is close
        // to where the alphabetic baseline sits for line-height 1.18.
        baselineY: (r.top - bRect.top) + r.height * 0.78,
        fontSize: parseFloat(cs.fontSize),
        text: el.textContent.trim(),
      };
    };

    const emRel = (() => {
      const r = em.getBoundingClientRect();
      return {
        x: r.left - bRect.left,
        w: r.width,
        text: em.textContent,
      };
    })();

    return {
      line1: rel(lines[0]),
      line2: rel(lines[1]),
      topBar: rel(bars[0]),
      botBar: rel(bars[1]),
      em: emRel,
    };
  }, variant);
}

function buildSvg(variant, m) {
  const g = VARIANT_GRADIENTS[variant];
  // Round to 1 decimal for cleanliness in the SVG.
  const round = (n) => Math.round(n * 10) / 10;

  // Bar positions (banner-local x/y, w/h).
  const tb = { x: round(m.topBar.x), y: round(m.topBar.y), w: round(m.topBar.w), h: round(m.topBar.h) };
  const bb = { x: round(m.botBar.x), y: round(m.botBar.y), w: round(m.botBar.w), h: round(m.botBar.h) };

  // Text baselines.
  const line1BaselineY = round(m.line1.baselineY);
  const line2BaselineY = round(m.line2.baselineY);
  const line1X = round(m.line1.x);
  const line2RightX = round(m.line2.x + m.line2.w);

  // Split Line 2 text into "this time through your " and "customer's eyes".
  const line2Full = m.line2.text;
  const emText = m.em.text;                // "customer's eyes" (no trailing space)
  const line2Lead = line2Full.replace(emText, '').replace(/ /g, ' '); // before italic
  // Normalize NBSP back into emText so the SVG renders the same.
  const emTextOut = emText;

  const fontSize = round(m.line1.fontSize);
  const letterSpacing = Math.round(-0.01 * fontSize * 100) / 100; // -0.01em in px, 2dp

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="grad-amber-${variant}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="${PALETTE.amber}" stop-opacity="${g.tlAlpha}"/>
      <stop offset="18%" stop-color="${PALETTE.amber}" stop-opacity="${round(g.tlAlpha * 0.4)}"/>
      <stop offset="32%" stop-color="${PALETTE.amber}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="grad-purple-${variant}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="60%"  stop-color="${PALETTE.purple}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${PALETTE.purple}" stop-opacity="${g.brAlpha}"/>
    </linearGradient>
  </defs>

  <!-- Layer 1: Background (hot-pink) -->
  <rect id="bg" x="0" y="0" width="${W}" height="${H}" fill="${PALETTE.pink}"/>

  <!-- Layer 2: Amber gradient overlay (top-left → transparent) -->
  <rect id="amber-overlay" x="0" y="0" width="${W}" height="${H}" fill="url(#grad-amber-${variant})"/>

  <!-- Layer 3: Purple gradient overlay (transparent → bottom-right) -->
  <rect id="purple-overlay" x="0" y="0" width="${W}" height="${H}" fill="url(#grad-purple-${variant})"/>

  <!-- Layer 4: Top bar (under Line 1, extends right into overlap zone) -->
  <rect id="top-bar" x="${tb.x}" y="${tb.y}" width="${tb.w}" height="${tb.h}" fill="${PALETTE.white}"/>

  <!-- Layer 5: Bottom bar (over Line 2, extends left into overlap zone) -->
  <rect id="bottom-bar" x="${bb.x}" y="${bb.y}" width="${bb.w}" height="${bb.h}" fill="${PALETTE.white}"/>

  <!-- Layer 6: Line 1 — left-aligned -->
  <text id="line-1" x="${line1X}" y="${line1BaselineY}"
        font-family="Epilogue, system-ui, sans-serif"
        font-weight="700"
        font-size="${fontSize}"
        letter-spacing="${letterSpacing}"
        fill="${PALETTE.white}">${escapeXml(m.line1.text)}</text>

  <!-- Layer 7: Line 2 — right-aligned, italic tspan for "customer's eyes" -->
  <text id="line-2" x="${line2RightX}" y="${line2BaselineY}"
        font-family="Epilogue, system-ui, sans-serif"
        font-weight="700"
        font-size="${fontSize}"
        letter-spacing="${letterSpacing}"
        fill="${PALETTE.white}"
        text-anchor="end">${escapeXml(line2Lead)}<tspan id="italic-word" font-style="italic" fill="${PALETTE.amber}">${escapeXml(emTextOut)}</tspan></text>
</svg>
`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const server = await startStaticServer();
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  for (const v of Object.keys(VARIANT_GRADIENTS)) {
    const m = await measureVariant(page, v);
    const svg = buildSvg(v, m);
    const out = path.join(OUT_DIR, `look-twice-linkedin-${v}.svg`);
    fs.writeFileSync(out, svg);
    console.log(`✓ ${v}: ${out}`);
  }

  await ctx.close();
  await browser.close();
  server.close();
})().catch(err => { console.error(err); process.exit(1); });
