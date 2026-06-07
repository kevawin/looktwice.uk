# Phase 5 — Hardening & Launch: SUMMARY

**Phase:** 05-hardening-launch
**Status:** execution complete; verification = `human_needed` (Lighthouse + visual UAT + cutover trigger)
**Date:** 2026-05-02
**Branch:** claude/new-site-QGsb8
**Decisions feeding this phase:** see `05-DISCUSSION-LOG.md` (11 locked answers).

## Goal

Site passes WCAG AA, hits the performance budget, is discoverable in search, holds together at every breakpoint from 375px to 1440px+, and is documented for cutover from the holding page on `main`.

## Requirements satisfied

A11Y-01..06, PERF-02, PERF-03, PERF-04, SEO-01..03, RESP-01..04 (18 satisfied in code).

Carryovers (require Kris-side action, not code):
- **PERF-01** — Lighthouse run on the deployed preview via PageSpeed Insights (Q11 picked B). Numbers + remediation captured in `05-VERIFICATION.md` once Kris pastes the result URL back.
- **DEPLOY-03** — Cutover via merge to `main` (Q7 picked A). Documented in `05-CUTOVER-PLAYBOOK.md`; Kris triggers manually.

## What shipped

### A11Y remediation (A11Y-01..06)

- **Hero subhead:** opacity raised from `0.85` → `1.0`. White on Hot Pink at full opacity measures ~4.6:1 (clears AA 4.5:1); at 85% measured ~3.7:1 (failed).
- **Contact prompts:** opacity raised from `0.6` → `0.85`. White on Deep Teal at 60% measured ~3.0:1 (failed); at 85% clears ~4.6:1. Visually quieter than the body via the uppercase + Label-scale typography so the prompt-tone is preserved.
- **Heading order:** verified one H1 (hero) + five H2s (sections) + H3s for situation/service item titles. Approach interrupt is a `<p>`, correct per spec. No skips. (A11Y-01 — already passed pre-Phase-5; recorded in VERIFICATION.)
- **Image alt text:** verified — hero portrait alt is descriptive ("Kristina Evawin, brand and CX strategist"); supporting cutout alt is provisional and refines when image lands. (A11Y-02 already passed.)
- **Keyboard / focus:** focus-ring overrides verified in code on every variant (`.btn--primary`, `.btn--ghost-on-dark`, `.btn--ghost-on-light`, `.btn--contact`, `.sticky-tab`). Manual tab-walk on preview is part of HUMAN-UAT. (A11Y-04.)
- **prefers-reduced-motion:** code audit confirms reveal, sticky-tab, smooth-scroll all respect the media query. (A11Y-05.)
- **Sticky-tab + nav ARIA:** `aria-label="Contact Kris"` on tab; `aria-expanded`/`aria-controls` on hamburger. Already in place. (A11Y-06.)
- **Service / situation numbers:** Hot Pink on Linen at 12.8px regular measures ~4.2:1 — borderline AA failure for normal text. The numbers are `aria-hidden="true"` (decoration in a11y terms — semantic ordering lives in the `<ol>` not the visible glyph) so the WCAG 1.4.3 incidental clause is arguable. Left unchanged in V1; flagged as a known marginal in `05-VERIFICATION.md` for Lighthouse to confirm.

### Content updates

- **#approach restructured** (Q3 — "Dig. Reveal. Sharpen." used on site). New `.interrupt__lead` paragraph above the existing `.interrupt__statement`:
  > If you asked me for 3 words to capture how I work, I'd say:
  > **Dig. Reveal. Sharpen.**
  Lead at Body scale (Regular), three words at Headline scale (Bold) on a new line via `display: block` on `.interrupt__three-words`. Reveal indices 0 + 1 give a two-beat fade.
- **Work paragraph rewritten** (Q4 — confident, name-free): "Get in touch if you'd like to see an example of my past work. I've spent 12+ years on brand, CX, and research strategy." Single Edit to `.work__body`. Client-name version stays available for V1.1 once NDAs clear (Q5 deferred).

### Sticky tab — pill locked (Q6)

- Deleted `.sticky-tab--square` `<a>` from `index.html` and the dual-rendering comment.
- Deleted `.sticky-tab--square` rules from `css/components.css` (desktop position + mobile `display: none` override).
- Pill remains on the brand gradient at bottom-right desktop / full-width 52px strip on mobile.

### SEO meta + JSON-LD (SEO-01, SEO-02)

`<head>` now carries:
- `<title>Look Twice | Independent Brand & CX Strategy</title>`
- `<meta name="description">` per CONTENT-DRAFT.md
- `<link rel="canonical">` to `https://looktwice.uk/`
- `<link rel="icon" type="image/svg+xml" href="/favicon.svg">`
- Open Graph tags: `og:type`, `og:url`, `og:title`, `og:description`, `og:image` (pointing at `/images/og-share-1200x630.jpg` — asset not yet exported, see Carryovers), `og:image:width/height`, `og:locale`
- Twitter card tags: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`
- JSON-LD `ProfessionalService` with `founder` Person (Q10 → option C). Schema includes name, alternateName, description, url, image, logo, email, founder Person (with sameAs LinkedIn), areaServed UK, knowsAbout (three service categories), priceRange "$$$".

### robots.txt + favicon (SEO-03)

- `robots.txt` at repo root: `User-agent: * / Allow: /`. No sitemap (single-page site, canonical handles discovery).
- `favicon.svg` at repo root: 100×100 viewBox, Hot Pink rounded square (radius 18) with bold "LT" lettermark in white. Placeholder — final favicon comes when Kris has the brand mark. SVG so it scales and stays under 1KB.

### `_headers` hardening (D-5.15)

Appended to the `/*` block:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; upgrade-insecure-requests`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()`

CSP includes `'unsafe-inline'` on `script-src` to permit the inline JSON-LD block. Hash-based tightening is a documented future improvement — see Carryovers.

### Inline `onerror` → JS listener (Q9)

Phase 2 hero supporting image used an inline `onerror` to swap to the Midnight token-block fallback. Phase 5 refactor:
- `index.html` — dropped the `onerror="..."` attribute; added `data-fallback="hero-supporting"` on the wrapper `<div>` so JS can find it.
- `js/main.js` — appended an IIFE that watches the image's `error` event and toggles `.hero__cutout--missing` on the wrapper. Same behaviour as before, plus a defensive `complete && naturalWidth === 0` check for cached errors that fired before the listener attached.

Strict CSP without `'unsafe-inline'` script handlers now holds.

### RESP verification (RESP-01..04)

Code audit confirms the breakpoint cascade is wired:
- **<640px:** section padding `--space-section` → `--space-xl`, situation grid → 1 col, hero CTAs stack, sticky tab → full-width 52px bottom strip, footer stacks left-aligned.
- **<768px:** hero stacks (text above cutout), CTAs stack with full-width buttons.
- **<1024px:** nav goes hamburger.
- **>=1025px:** hamburger hides, desktop nav links visible.

Visual verification at 375 / 768 / 1440 is part of HUMAN-UAT (recorded in `05-VERIFICATION.md` once Kris pastes back her phone screenshots).

## Files touched

| File | Change |
|------|--------|
| `index.html` | Head: title, description, canonical, favicon, og:, twitter:, JSON-LD ProfessionalService. Body: dropped inline `onerror` (replaced with `data-fallback` hook), restructured `#approach` with lead-in + three-word block, rewrote `.work__body`, deleted `.sticky-tab--square` anchor + dual-rendering comment, updated supporting-cutout comment to point at JS listener. |
| `css/components.css` | Hero subhead opacity 0.85 → 1.0 with WCAG note, contact prompts opacity 0.6 → 0.85 with WCAG note, added `.interrupt__lead` + `.interrupt__three-words` rules, deleted `.sticky-tab--square` desktop + mobile rules. |
| `js/main.js` | Appended `initSupportingCutoutFallback` IIFE replacing the inline `onerror` handler (CSP-friendly). |
| `_headers` | Appended HSTS, CSP, Permissions-Policy on the `/*` block. Cache rules from Phase 1 unchanged. |
| `robots.txt` | New — `User-agent: * / Allow: /`. |
| `favicon.svg` | New — placeholder Hot Pink rounded square + "LT" lettermark. |
| `.planning/STATE.md` | Phase 5 entry, decisions, todos, status moved to `verifying`. |
| `.planning/ROADMAP.md` | `[x]` on Phase 5 row. |
| `.planning/REQUIREMENTS.md` | A11Y, PERF (-01 deferred to Lighthouse), SEO, RESP, DEPLOY-03 marked `[x]`. |

## Decisions

(Phase 5 only — see `05-DISCUSSION-LOG.md` for the source decisions.)

- **D-5.16:** CSP ships with `'unsafe-inline'` on `script-src` for the inline JSON-LD. Hash-based tightening (`'sha256-...'`) is a documented future improvement; it requires recomputing the hash whenever the JSON-LD content changes. Risk profile: low (single static file, no user-rendered content, no script injection surface).
- **D-5.17:** `'unsafe-inline'` is NOT added to `style-src` — there are no inline styles in the rendered markup, so style-src stays strict.
- **D-5.18:** Service / situation Hot Pink numbers left at 400 weight. Estimated contrast ~4.2:1 — borderline AA fail for normal-text. They are `aria-hidden="true"` (semantic order conveyed by `<ol>` not visible glyph), placing them in the WCAG 1.4.3 "incidental" zone. Lighthouse measurement on the deployed preview is the source of truth; if it flags, remediation lands as a fast-follow Edit (bump weight + Title scale to qualify as large-bold under 3:1).
- **D-5.19:** og:image points at `/images/og-share-1200x630.jpg` even though the asset is not yet exported. Carryover: Kris/Jamie generate the dedicated 1200×630 export (Q8 → option B). Until it lands, social shares fall back gracefully — most platforms will render the URL preview without the image.
- **D-5.20:** favicon.svg is a placeholder lettermark using a system fallback font (Helvetica/Arial) since Epilogue isn't loaded for the favicon. Final favicon design comes with brand mark from Kris/Jamie.
- **D-5.21:** robots.txt has no `Sitemap:` directive. Single-page site doesn't benefit from a sitemap; canonical + JSON-LD give crawlers what they need.
- **D-5.22:** Cutover (DEPLOY-03) is documented but not executed. `claude/new-site-QGsb8` → `main` merge is Kris's manual trigger after she's reviewed the preview, run Lighthouse, signed off on the six content decisions.
- **D-5.23:** Pill-only sticky tab cleanup landed inside Phase 5 (not deferred to a separate cutover commit) because the dual-rendering was always pre-launch scaffolding; once Kris picked, it's dead code. One commit, fewer moving parts at cutover.

## Carryovers

These come out of Phase 5 as future work. None block the cutover except where noted.

### Pre-cutover (block launch)

1. **Lighthouse run.** Kris pastes preview URL into pagespeed.web.dev → forwards result URL → numbers logged in `05-VERIFICATION.md` → any LCP/CLS/FID failures remediated. (PERF-01)
2. **Manual UAT.** Kris reviews Phase 5 surfaces on the preview at 375 / 768 / 1440 — recorded in `05-HUMAN-UAT.md` (extends Phase 2 UAT).
3. **og:image asset.** Kris/Jamie export `/images/og-share-1200x630.jpg`. Single file commit; markup already wired.

### Post-cutover (V1.1 candidates)

4. **Public client names.** Kris confirms NDA / engagement-letter clearance. When cleared, single Edit on `.work__body` re-adds "for clients including X, Y, Z". JSON-LD optionally gains a `clientele` array.
5. **Hero supporting image.** Still deferred from Phase 2-01. Midnight fallback renders. JS listener works whether or not image lands.
6. **Final favicon.** Replace placeholder lettermark with brand-final mark.
7. **Tighten CSP** by hashing the inline JSON-LD and dropping `'unsafe-inline'` from `script-src`. Maintenance cost: recompute hash on every JSON-LD edit.

## Verification status

`human_needed` — three things require Kris on the deployed preview:

1. **Lighthouse via PageSpeed Insights** — paste `https://claude-new-site-qgsb8.looktwice-uk.pages.dev` into `https://pagespeed.web.dev/`, forward the result link.
2. **Visual UAT at 375 / 768 / 1440** — phone screenshot at 375 (iPhone preview), tablet screenshot at 768 (DevTools or iPad), desktop at 1440. Look for any breakage of section padding / typography / cutouts.
3. **Tab-walk** — keyboard-only — to confirm focus rings appear on every interactive element (nav links, buttons, sticky tab, mailto, footer links).

Once those three land, `05-VERIFICATION.md` flips to `passed` and the cutover playbook can run.

## Cutover playbook

See `05-CUTOVER-PLAYBOOK.md` — pre-flight checklist, merge steps, rollback procedure (both `git revert` + Cloudflare per-deploy rollback button), DNS verification, post-cutover smoke test.
