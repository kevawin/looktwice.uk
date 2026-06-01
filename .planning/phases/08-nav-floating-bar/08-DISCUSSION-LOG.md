# Phase 8: Navigation & floating action bar (V1 Refresh P2) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-01
**Phase:** 08-nav-floating-bar
**Areas discussed:** Nav order, Bar layout, Mobile header, Bar behaviour

---

## Nav order (page-order vs locked-pill-order conflict)

| Option | Description | Selected |
|--------|-------------|----------|
| Both follow page order | Header AND floating pills read Approach, Work (matching DOM). Overrides the locked (Work)(Approach) pill order. | ✓ |
| Reorder the page instead | Swap sections so Work precedes Approach in DOM, then both menus read Work, Approach. Bigger change. | |
| Header=page, pills=locked | Header reads Approach, Work; pills keep locked Work, Approach. Two menus disagree. | |

**User's choice:** Both follow page order.
**Notes:** Page DOM is `#approach` (:188) before `#work` (:200). One consistent order (Approach, Work) everywhere; sections not reordered. → CONTEXT D-01.

---

## Bar layout (desktop nav-pill placement)

| Option | Description | Selected |
|--------|-------------|----------|
| One cluster, bottom-left | ( CTA )( Work )( Approach ) single left-anchored row. | |
| CTA left, nav pills right | Gradient CTA bottom-left; nav pills bottom-right (where mobile burger lives). | ✓ |

**User's choice:** CTA left, nav pills right.
**Notes:** Both bottom corners used; nav stays where the mobile burger sits. Pills read ( Approach )( Work ) per D-01. → CONTEXT D-07, D-08.

---

## Mobile header (after de-burger)

| Option | Description | Selected |
|--------|-------------|----------|
| Logo only | Header = wordmark only; no above-the-fold nav on mobile. | |
| Logo + inline links | Keep Work + Approach inline links next to logo on mobile (no burger). | ✓ |

**User's choice:** Logo + inline links.
**Notes:** Nav available above the fold on mobile without a hamburger; floating bar takes over past the hero. → CONTEXT D-06.

---

## Bar behaviour (multi-select: carryover rules, reduced-motion, testing, segues)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep contact-suppress | Reuse rule: hide bar while #contact is in view (D-6.11 carryover). | ✓ |
| Reduced-motion = instant | Fade-in/instant pills/snap-to-X under prefers-reduced-motion. | ✓ |
| Heavy Playwright | Full visual+QA suite across breakpoints, open/close, focus, keyboard. | ✓ |
| Confirm segues covered | Floating CTA answers the two dangling segues (work :235, services :264). | ✓ |

**User's choice:** All four selected.
**Notes:** Burger is two lines → X (lock); focus/keyboard handling is Claude's responsibility. → CONTEXT D-12, D-13, D-14, D-17, D-18, D-15, D-16.

---

## Claude's Discretion

- Extend existing `.sticky-tab` vs build fresh `.floating-bar` component (planner's call).
- Exact gutter value to standardise header + bar offsets on.
- Pill sizing, gap, burger diameter — match in-page button scale + 44px touch target.
- CSS/JS cleanup mechanics for removed hamburger/overlay/scroll-fade; `?v=` cache-bump.
- Mobile slide-up pill stack order set to Approach (top) → Work (bottom) to match page order.

## Deferred Ideas

- Segue copy rewording → refresh Phase 4 (Kris copy); this phase changes structure, not wording.
- Section reordering (Work before Approach) → considered and rejected; D-01 aligns menus to DOM order instead.
