# Phase 5 — Verification

**Phase:** 05-hardening-launch
**Status:** human_needed (Lighthouse + visual UAT pending)
**Date:** 2026-05-02

## Requirement-by-requirement

### Accessibility

| ID | Description | Status | Evidence |
|----|-------------|--------|----------|
| A11Y-01 | One H1 (hero), H2 sections, H3 children, no skips | ✅ SATISFIED | Audited rendered HTML — one H1 in `#hero`, five H2s (situation, work, services, contact — `#approach` is a `<p>` not heading by spec), H3s for situation/service item titles |
| A11Y-02 | Every image has descriptive alt text | ✅ SATISFIED | `kris-portrait.webp` alt = "Kristina Evawin, brand and CX strategist". Supporting cutout alt is provisional and refines when image lands; not blocking |
| A11Y-03 | WCAG AA contrast verified on every surface | ⚠️ MOSTLY SATISFIED | Hero subhead remediated (opacity 0.85→1.0, ~4.6:1). Contact prompts remediated (opacity 0.6→0.85, ~4.6:1). Contact body at 0.85 measured ~4.6:1 — passes. Service / situation Hot Pink numbers ~4.2:1 — borderline, `aria-hidden` decoration, flagged for Lighthouse confirmation |
| A11Y-04 | Keyboard nav, tab order, visible focus rings | ⚠️ HUMAN-UAT | Code verified: focus-ring overrides on every button variant. Tab-walk on deployed preview is the human verification |
| A11Y-05 | prefers-reduced-motion respected | ✅ SATISFIED | Code audit: reveal animations strip transform under media query, sticky-tab uses opacity fallback, smooth-scroll disabled in `base.css` |
| A11Y-06 | Sticky tab `aria-label`; mobile nav `aria-expanded`/`aria-controls` | ✅ SATISFIED | `<a class="sticky-tab" aria-label="Contact Kris">`; `<button class="nav-hamburger" aria-expanded aria-controls="nav-overlay">` |

### Performance

| ID | Description | Status | Evidence |
|----|-------------|--------|----------|
| PERF-01 | LCP < 2.5s, CLS < 0.1, FID < 100ms (Lighthouse on preview) | ⏳ HUMAN-UAT | Awaiting PageSpeed Insights run (Q11 → Option B). Kris pastes preview URL → forwards result link |
| PERF-02 | Page weight < 500KB excluding images | ✅ SATISFIED | Pre-Phase-5: 78KB. Post-Phase-5 estimate (incl. JSON-LD, expanded `_headers`, robots.txt, favicon.svg, A11Y CSS tweaks): ~83KB / 500KB = 17% of budget |
| PERF-03 | All photos WebP + srcset; below-fold lazy; hero eager | ✅ SATISFIED | `kris-portrait.webp` `loading="eager"` + `fetchpriority="high"`. No below-fold images yet (supporting cutout deferred). srcset deferred unless Lighthouse flags |
| PERF-04 | Hero images dimensions set / aspect-ratio reserved | ✅ SATISFIED | `width=800 height=1000` on portrait img + `aspect-ratio: 1/1` on `.hero__cutouts` reserves layout |

### SEO & Meta

| ID | Description | Status | Evidence |
|----|-------------|--------|----------|
| SEO-01 | `<title>`, meta description, canonical, og: tags | ✅ SATISFIED | All present in `<head>`. og:image points at `/images/og-share-1200x630.jpg` (asset deferred to Kris/Jamie) |
| SEO-02 | `ProfessionalService` JSON-LD validates | ⚠️ HUMAN-UAT | Schema drafted with founder Person, knowsAbout array, areaServed UK, priceRange. Validate at https://validator.schema.org/ before cutover; warning on missing address/phone is acceptable |
| SEO-03 | `robots.txt`, favicon | ✅ SATISFIED | `robots.txt` allows all; `favicon.svg` placeholder lettermark in repo root, linked from `<head>` |

### Responsive

| ID | Description | Status | Evidence |
|----|-------------|--------|----------|
| RESP-01 | Three breakpoints | ✅ SATISFIED | Code audit: <640 / 640-1024 / >1024 cascade in `layout.css` + `components.css` |
| RESP-02 | Section padding `--space-section` → `--space-xl` on mobile | ✅ SATISFIED | `.situation`, `.work`, `.services`, `.contact` all carry `@media (max-width: 640px) { padding-block: var(--space-xl); }` |
| RESP-03 | Legible at 375 / 1440 | ⏳ HUMAN-UAT | Phone screenshots at 375 / DevTools 768 / desktop 1440 — Kris records in HUMAN-UAT |
| RESP-04 | Body max-width relaxes to full column on mobile | ✅ SATISFIED | `--measure: 65ch` already wider than mobile column; on narrow viewports body fills the available padding-bounded column |

### Deploy

| ID | Description | Status | Evidence |
|----|-------------|--------|----------|
| DEPLOY-03 | Documented cutover plan, `main` untouched until trigger | ✅ SATISFIED | `05-CUTOVER-PLAYBOOK.md` documents the merge-to-main path, pre-flight checklist, rollback procedures (Cloudflare per-deploy + git revert), post-cutover smoke test. `main` remains on holding page |

## Open verification items (human_needed)

Before cutover, three items must clear:

1. **Lighthouse run** (PERF-01)
   - Action: Kris opens https://pagespeed.web.dev/, pastes `https://claude-new-site-qgsb8.looktwice-uk.pages.dev`, runs both Mobile + Desktop.
   - Capture: result URL or numbers (LCP, CLS, FID, total weight) appended to this file.
   - Remediation if fails: revisit `D-5.9` image options (lower-quality export, AVIF source, srcset).

2. **Visual UAT at three breakpoints** (RESP-03)
   - 375px (iPhone SE — phone real device), 768px (DevTools or iPad), 1440px (desktop).
   - Look for: typography scale, section padding, sticky tab placement, hero stack order, situation grid layout, services rule stack, footer column behaviour.

3. **Tab-walk** (A11Y-04)
   - Keyboard only, no mouse.
   - Tab order: nav links → hero CTAs → situation blocks (focus only on links if any) → interrupt (no interactives) → work CTA → service CTAs → contact CTA → footer links → sticky tab.
   - Confirm: every interactive shows a visible focus ring on its surface (Hot Pink on Linen, White on hot pink/orange/teal/midnight).

## Notes for Kris

- The Lighthouse run + UAT can happen on any machine you've got. PageSpeed Insights does the heavy lifting remotely.
- If anything in items 1-3 fails, post the issue in DISCUSSION-LOG and Phase 5 reopens to remediate before cutover.
- If everything clears, you're cleared to follow `05-CUTOVER-PLAYBOOK.md`.
