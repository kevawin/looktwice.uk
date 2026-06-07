# Phase 4 — Conversion & Persistent Surfaces: SUMMARY

**Phase:** 04-conversion-persistent
**Status:** execution complete, verification = `human_needed`
**Date:** 2026-05-01
**Branch:** claude/new-site-QGsb8

## Goal

The visitor reaches a low-friction Deep Teal contact moment, can email Kris in one click, sees a minimal Midnight footer, and a brand-gradient sticky tab follows them after the hero.

## Requirements satisfied

CONT-01..06, FOOT-01..04, TAB-01..07, JS-01..06 (23 / 23).

## What shipped

### Section: Contact (#contact) — CONT-01..06

- Deep Teal full-bleed surface, `--space-section` vertical padding (collapses to `--space-xl` at <640px).
- Ghost-on-dark "FREE SESSION" chip (new `.chip--ghost-on-dark` modifier — White border, transparent fill, padding compensated for the 1.5px border so visual height matches the Midnight pill).
- Headline (Epilogue 700, White) + body (White at 85%) + CTA + static prompts (White at 60%, Label typography).
- CTA button — White fill / Deep Teal text, flips to Midnight fill / Linen text on hover. `href="mailto:hello@looktwice.uk"`. Focus ring overridden to White on Deep Teal.
- Left-aligned, max content 680px (CONT-05).
- Reveal stagger 80ms — chip → headline → body → button → prompts (CONT-06).

### Footer — FOOT-01..04

- Midnight surface, `--space-lg` vertical padding.
- Two-column desktop: left = wordmark + tagline (Linen at 60%); right = LinkedIn / mailto / © 2026 in Label typography, Linen text, Link Sage hover.
- Stacks left-aligned at <640px (FOOT-04).
- Replaced the Phase 1 `.footer--placeholder` class — old styling removed.

### Sticky tab — TAB-01..07

- Two variants both rendered at build (TAB-04): pill (`--radius-pill`, bottom-right 24/24) + 4px square (`--radius-sm`, stacked above the pill at 88px from bottom on desktop).
- Pill is keyboard / SR accessible; square is `aria-hidden="true" tabindex="-1"` so SR users hear one CTA, not two during the design pick.
- Brand gradient background — the only place `--gradient-brand` paints on the site.
- White text "LET'S TALK →", Label typography, `--shadow-float`.
- Hidden on load (`transform: translateX(120%)`); slides in via `transform: translateX(0)` + 300ms `--transition-tab` once `scrollY > hero.offsetHeight`.
- Hover `transform: scale(1.03)` 180ms ease-out, no colour change (TAB-05).
- Mobile (<640px): pill becomes a full-width 52px bottom strip sliding up from `translateY(100%)`; square hides entirely (avoids stacked strips).
- Reduced motion: transform stripped, opacity-only fade in/out via `.sticky-tab--visible`.

### JS — JS-01..06

- `js/main.js` already covered JS-01 (vanilla), JS-02 (nav scroll toggle), JS-04 (reveal observer), JS-06 (passive scroll). Phase 4 appended JS-03 (sticky tab entrance).
- JS-05 (smooth anchor scroll) covered by `scroll-behavior: smooth` in `base.css` with the existing `prefers-reduced-motion` guard.
- New sticky-tab IIFE: queries hero height once, recomputes on resize, toggles `.sticky-tab--visible` on every scroll. Single `{ passive: true }` listener handles both variants. Runs once on boot to handle mid-page reloads.

## Files touched

| File | Change |
|------|--------|
| `index.html` | Filled `#contact` section, replaced `<footer class="footer footer--placeholder">` with full footer markup, appended two `.sticky-tab` anchors before `<script>` |
| `css/components.css` | Removed `.footer--placeholder` rule. Appended `.chip--ghost-on-dark`, `.contact` + descendants + `.btn--contact`, `.footer` + descendants, `.sticky-tab` + variants + reduced-motion + mobile strip |
| `js/main.js` | Appended sticky-tab scroll-toggle IIFE |
| `.planning/STATE.md` | Phase 4 entry, decisions, todos |
| `.planning/ROADMAP.md` | `[x]` Phase 4, plan note |
| `.planning/REQUIREMENTS.md` | CONT, FOOT, TAB, JS marked `[x]` |

## Decisions

- **D-4.1 Both sticky-tab variants render simultaneously** rather than via build-time toggle — the variants stack vertically (pill at 24px from bottom, square at 88px) so Kris sees both shapes during the design pick. The square variant is marked `aria-hidden` + `tabindex="-1"` so screen readers and keyboard users only hit one CTA. After Kris picks, the unused variant comes out (single Edit + this dual rendering note removed).
- **D-4.2 Mobile sticky tab shows pill only.** Two stacked full-width 52px strips would consume ~104px of viewport bottom and cover content. Square hides at <640px until the desktop pick.
- **D-4.3 `.chip--ghost-on-dark` padding compensates for the border.** Default `.chip` has `padding: 5px 14px` with no border; the ghost variant adds a 1.5px border, so padding shifts to `3.5px 12.5px` to keep visual height + width identical to the Midnight pill.
- **D-4.4 Em-dashes substituted with commas** in contact body and prompts (project ban). "30 to 45 minute session" not "30-45". "not the symptom, the actual problem" not "— not the symptom, the actual problem".
- **D-4.5 Footer link hover = Link Sage** per FOOT-03; copyright stays static (not a link, no hover).
- **D-4.6 Sticky-tab threshold = `hero.offsetHeight`** rather than the spec's `100vh`. The hero is `min-height: 90vh` but can grow taller with content + cutout, so measuring the actual hero is more accurate than a fixed viewport unit. Resize listener recomputes on rotation. Falls back to `window.innerHeight` if `.hero` is missing (defensive only — markup contract guarantees it).
- **D-4.7 Sticky-tab z-index = 150** sits between `.nav` (100) and `.nav-overlay` (200). The mobile overlay opens above the tab so the menu doesn't fight the strip for the bottom edge.
- **D-4.8 `.btn--contact` is its own variant** rather than a re-skin of `.btn--ghost-on-dark`. Different inversion (White fill / Deep Teal text), different hover target (Midnight fill / Linen text), needs the focus-ring override too. Clearer to keep it as a standalone button class.

## Carryover items into Phase 5

- WCAG AA contrast verification on Hot Pink, Signal Orange, Deep Teal surfaces — including the contact CTA (White on Deep Teal at 700 weight) and the static prompts (White at 60% on Deep Teal). Phase 5 confirms with axe / Lighthouse.
- Lighthouse run on the deployed preview for LCP / CLS / FID / page weight (PERF-01..04).
- Sticky-tab keyboard focus ring verification under prefers-reduced-motion: the opacity-fallback shouldn't strip the focus outline. Already coded; Phase 5 verifies.
- Sticky-tab variant decision (pill vs 4px) — Kris picks before launch, then drop the unused variant + the dual-rendering comment in `index.html`.

## Verification status

`human_needed` — Kris to inspect Phase 04 surfaces on Cloudflare Pages preview at `https://claude-new-site-qgsb8.looktwice-uk.pages.dev`:

1. **Contact**: Deep Teal full-bleed, "FREE SESSION" ghost chip (not stretched, hugs text), headline + 2-sentence body left-aligned, CTA button reads `hello@looktwice.uk` and opens mail client on click, prompts in small uppercase grey-white below.
2. **Footer**: Midnight strip with wordmark + tagline left, three meta links right; LinkedIn opens new tab; mailto opens mail; on phone the meta stack collapses to left-aligned.
3. **Sticky tab**: nothing visible while scrolling through the hero. After hero exits the viewport, the pill (bottom-right) and 4px square (above pill) both slide in. Hover scales 1.03. Tap → smooth scroll to `#contact`. On phone, full-width strip slides up from the bottom instead.
4. **Reduced motion**: with `prefers-reduced-motion: reduce`, the tab fades in via opacity (no slide) and reveals are opacity-only.
5. **Keyboard**: tabbing reaches the pill tab once visible (not the square — `tabindex="-1"`). Focus ring is White on the gradient and visible.
