# Phase 11: Cutout reveal system (V1 Refresh P3) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-02
**Phase:** 11-cutout-reveal-system-v1-refresh-p3
**Areas discussed:** Surface mechanic, Shape presets, Hero scope, Image loading, Aperture treatment, Motion

---

## Surface (gradient conflict)

| Option | Description | Selected |
|--------|-------------|----------|
| Solid section colour | Windows over existing solid surfaces; keeps one-gradient rule | ✓ (refined) |
| Relax rule, allow gradient | Gradient behind windows like the demo; needs CLAUDE.md edit | |
| Per-band mix | Some solid, some gradient | |

**User's choice:** Free-text refinement — "images, they're cutouts in the colour of the section revealing an image behind." The field is the solid section colour; the windows reveal a B&W image behind. Same mask mechanic as the demo, gradient body swapped for solid colour.
**Notes:** Resolves the hard CLAUDE.md conflict with no rule change — gradient stays exclusive to the floating CTA pill. (D-01, D-02)

---

## Shape presets

| Option | Description | Selected |
|--------|-------------|----------|
| Down-triangle | Rounded inverted triangle (demo) | ✓ |
| Up-triangle | Rounded upward triangle (demo) | ✓ |
| Pill | Stadium / full rounded-rect (demo) | ✓ |
| Rounded-rect | Soft-cornered rectangle (current hero) | ✓ |
| Circle | Added by user | ✓ |

**User's choice:** All five — circle, down-triangle, up-triangle, pill, rounded-rect.
**Notes:** Circle added beyond the offered four. (D-04)

---

## Hero scope

| Option | Description | Selected |
|--------|-------------|----------|
| Refactor hero now | Move current hero onto the new mask primitive this phase | ✓ |
| Build primitive only, defer hero | Ship component, leave hero until P8 | |

**User's choice:** Refactor hero now.
**Notes:** Proves the component on a real surface immediately; hero imagery already exists. (D-05)

---

## Image loading

| Option | Description | Selected |
|--------|-------------|----------|
| External WebP + srcset, lazy below fold | Real WebP via SVG `<image href>`, no base64 | ✓ |
| Decide per-band in plan | Defer strategy, lock no-base64 + budget only | |

**User's choice:** External WebP + srcset, lazy below fold.
**Notes:** Demo's inline base64 (~112KB) stripped. Hero stays eager / high priority. (D-06)

---

## Aperture treatment

| Option | Description | Selected |
|--------|-------------|----------|
| B&W / grayscale | Desaturated inside every window; matches locked aesthetic | ✓ |
| Full colour | Deviates from B&W-aperture rule | |
| Per-band choice | Modifier per section | |

**User's choice:** B&W / grayscale.
**Notes:** Matches locked "B&W in apertures" + current hero grayscale(100%). (D-03)

---

## Motion

| Option | Description | Selected |
|--------|-------------|----------|
| Static (no animation) | Windows render in place | ✓ |
| Reuse existing scroll reveal | Fade/stagger via existing IntersectionObserver | |
| Custom mask reveal | Windows wipe/grow open on scroll | |

**User's choice:** Static — no animation.
**Notes:** Keeps the primitive simple; no new reduced-motion branch. Animated reveal deferred to P8. (D-07)

---

## Claude's Discretion

- Mask viewBox coordinates, per-shape path math, window-layout token names.
- Whether shape presets are CSS classes, SVG sprite symbols, or templated SVG.
- Per-section window composition for the hero refactor, within D-03/D-04.

## Deferred Ideas

- Services-section cutout imagery → refresh P5.
- Approach imagery / break-the-rectangle layout → refresh P8.
- Animated mask reveal → P8 if ever.
- New non-hero section imagery from Kris/Jamie → still pending.
