---
phase: 08-nav-floating-bar
plan: "02"
subsystem: navigation
tags: [floating-bar, cta-pill, burger, nav, responsive, a11y, reduced-motion]
dependency_graph:
  requires: [08-01]
  provides: [floating-bar, gradient-cta-pill, circular-burger, slide-up-pills, scroll-gate, contact-suppress]
  affects: [index.html, css/components.css, css/animations.css, js/main.js]
tech_stack:
  added: []
  patterns: [one-gradient-surface, per-surface-focus-ring, reduced-motion-guard, shared-gutter-expression, passive-scroll-listener, intersection-observer, aria-expanded-toggle, focus-return-on-close]
key_files:
  modified:
    - index.html
    - css/components.css
    - css/animations.css
    - js/main.js
decisions:
  - "Floating-bar replaces .sticky-tab entirely — markup, CSS, JS; old sticky-tab has no orphans"
  - "Desktop/mobile breakpoint for burger vs always-visible pills: 641px (consistent with old sticky-tab's 640px mobile strip)"
  - "Bar offsets use calc(var(--space-lg)*0.75) — shared gutter expression, not hardcoded px (D-05/D-07)"
  - "Transitions live inline in components.css alongside the component rules — consistent with the sticky-tab pattern; animations.css is comment-only update"
  - "Burger line->X transform: translateY(3.5px) rotate(45deg) on line 1 / translateY(-3.5px) rotate(-45deg) on line 2 (gap=5px, so half=2.5px + 1px half-line)"
  - "--gradient-brand appears exactly once in active CSS: .floating-bar__cta (D-11 satisfied)"
  - "Cache-bust bumped from v=5 to v=6 across all five CSS links and the JS script tag"
  - "initStickyTab renamed initFloatingBar; selector changed from .sticky-tab to .floating-bar"
  - "initWordRoller left completely untouched"
metrics:
  duration: ~8min
  completed: "2026-06-01"
  tasks: 3
  files: 4
---

# Phase 8 Plan 2: Floating Action Bar Summary

Floating action bar built from scratch replacing the sticky-tab: gradient CTA pill "Free 30-min chat" bottom-left, circular white/pink burger bottom-right on mobile, always-visible Approach/Work pill row on desktop (641px breakpoint); full scroll-gate, contact-suppress, Escape/focus-return, and reduced-motion fallback wired.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Replace sticky-tab markup with floating-bar + cache-bust to v=6 | bedd362 | index.html |
| 2 | Build floating-bar CSS — CTA pill, burger, pills, states, responsive, reduced-motion | 4036a92 | css/components.css, css/animations.css |
| 3 | Wire JS — extend scroll-gate to bar + burger open/close with focus + Escape | d34d02d | js/main.js |

## Key Implementation Details

### Cache-bust version
All five CSS `<link>` tags and the `<script src="/js/main.js">` tag bumped from `?v=5` to `?v=6`. This covers all files touched in both Plan 01 and Plan 02 in a single bump.

### Desktop/mobile breakpoint
`641px` (`min-width: 641px` shows the pill row, hides the burger). Consistent with the old `.sticky-tab` mobile strip breakpoint at `max-width: 640px`.

### Transition placement
Transition declarations live in `css/components.css` alongside the component rules. This mirrors the `.sticky-tab` pattern (which also kept `transition:` inline). `css/animations.css` received only a comment update — no transition rules added there.

### Burger line -> X transform values
- Line 1: `translateY(3.5px) rotate(45deg)`
- Line 2: `translateY(-3.5px) rotate(-45deg)`
- Lines are 2px tall, gap between them is 5px; translate of 3.5px centres the lines to form a clean X.

### Gradient discipline
`grep 'var(--gradient-brand)' css/components.css` returns exactly one rule: `.floating-bar__cta { background: var(--gradient-brand) }`. D-11 satisfied.

### Scroll-gate
`initFloatingBar` IIFE: threshold = `hero.offsetHeight` (fallback: `window.innerHeight`), recomputed on resize. Both scroll and resize listeners use `{ passive: true }`. `aria-hidden` toggled on the bar root in sync with `floating-bar--visible`.

### Contact-suppress
`IntersectionObserver` on `#contact` with `{ threshold: 0.15 }` adds/removes `floating-bar--suppressed` — bar hides while the contact section is in view (D-13).

### Burger focus management (D-15)
- `openMenu()`: sets `aria-expanded="true"`, `aria-label="Close menu"`, adds `floating-bar__pills--open`, focuses first pill link.
- `closeMenu()`: sets `aria-expanded="false"`, `aria-label="Open menu"`, removes `floating-bar__pills--open`, returns focus to burger.
- Escape key listener on document closes when burger is open.
- Pill click closes menu and returns focus to burger.

### Desktop pill visibility
Desktop pills are shown via `@media (min-width: 641px)` CSS rules (`opacity:1`, `transform:none`, `pointer-events:auto`) independent of the `floating-bar__pills--open` class. The `initFloatingBurger` IIFE is harmless on desktop — burger is `display:none` so it is never clicked.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — all elements are structurally complete and wired. Copy ("Free 30-min chat", "Approach", "Work") is final per D-09/D-01.

## Threat Flags

None — all threat mitigations from the plan's threat register are in place:
- T-08-04: JS only uses `classList`, `setAttribute` on static elements. No `innerHTML`, no eval, no template strings into DOM.
- T-08-05: CTA pill `href="#contact"` (in-page anchor). Pills link to `#approach` / `#work`. No external URLs.
- T-08-06: Scroll/resize listeners use `{ passive: true }`.
- T-08-07: Escape closes and returns focus to burger; opening moves focus to first pill; pill click closes correctly.

## Self-Check: PASSED

- index.html modified: confirmed (bedd362)
- css/components.css modified: confirmed (4036a92)
- css/animations.css modified: confirmed (4036a92)
- js/main.js modified: confirmed (d34d02d)
- All three commits present: bedd362, 4036a92, d34d02d
- `grep -c 'var(--gradient-brand)' css/components.css` = 1 (CTA pill only)
- `grep '?v=' index.html` all return v=6
- `.sticky-tab` absent from index.html, components.css, and js/main.js
