# Design inputs — V1 restructure

Captured 2026-06-03 (Jamie). These are **inputs**, not rules yet. They feed the
design-contract phase (impeccable setup → `DESIGN.md`) and the phases noted below.
Jamie rules on each during the design-contract phase.

## Signature interaction: scroll-reveal B&W → colour → B&W

As a cutout/section image scrolls into view it animates from black-and-white to
full colour, then fades back to B&W as it leaves the viewport.

- **Why:** literal expression of the brand. "Look Twice" / reveal — the image
  rewards a second look. On-brand, not decoration.
- **Technical hook:** cutouts already desaturate via SVG `feColorMatrix
  type="saturate" values="0"` in `buildCutout.js`. Drive the saturate value from
  scroll progress (IntersectionObserver, or CSS scroll-driven animation) instead
  of baking it at 0. Keep shipped JS lean.
- **Guardrails:** `prefers-reduced-motion` → static, no scroll animation (pick the
  static state — B&W or colour — in the contract). Never gate content visibility
  on the animation (impeccable motion rule: reveals enhance an already-visible
  default).
- **Lands:** principle set in the design-contract phase; implemented in the
  visual-variety / motion phase.

## Motion philosophy: subtle, on-brand

Many reference sites overdo scroll feedback and animation. Aim for restraint —
few, intentional interactions that reinforce the brand, not decorate it. Set as a
principle in `DESIGN.md`; every per-phase animation justified against it.

## Features to steal

- **Pip Decks** — text-light, scannable "here's exactly what you get" productised
  clarity. → services / packages phase.
- **bgn.agency** process section — 5 plain steps, images throughout, short
  paragraphs. Steal the structure, drop the JS-takeover / mouse hijack. → process
  phase.
- **Koto** — one shape vocabulary repeated with discipline across sections. →
  shape system in the contract (cures the current shape inconsistency).

## Inherited rules to re-rule (not auto-kept)

Identity-preservation is OFF. Jamie (CRO/UX) decides keep / override / kill per
rule in the design-contract phase. Candidates flagged for challenge:

- Total card-shadow ban — vs disciplined elevation on CTA / pricing.
- "No decorative card grids" — needs a carve-out for priced-package comparison.
- Gradient only on the sticky tab — may want it on the recommended tier / primary CTA.
- No font-weight 500 / Epilogue-only — hierarchy cost; is it Kris brand law or guardrail?
- B&W cutout desaturation — warmth for a human-experience brand (now partly
  answered by the scroll-reveal idea above).
- No mid-tone greys — form helper / placeholder / disabled legibility.
