---
phase: 08-nav-floating-bar
plan: "01"
subsystem: navigation
tags: [nav, header, hamburger, overlay, refactor, deletion]
dependency_graph:
  requires: []
  provides: [non-fixed-header, no-hamburger, no-overlay, approach-work-nav-order]
  affects: [index.html, css/components.css, css/layout.css, css/animations.css, js/main.js]
tech_stack:
  added: []
  patterns: [per-surface-focus-ring-override, shared-gutter-expression]
key_files:
  modified:
    - index.html
    - css/components.css
    - css/layout.css
    - css/animations.css
    - js/main.js
decisions:
  - "Header made non-fixed (in-flow), scrolls away with the page (D-03)"
  - "Hamburger + overlay removed entirely from markup, CSS, and JS (D-04)"
  - "Nav reordered to Approach then Work, Contact dropped (D-01, D-02)"
  - "Mobile nav-links display:none media query removed — links visible at all widths (D-06)"
  - "Nav padding stays at calc(var(--space-lg) * 0.75) — already matched section gutter, no change needed (D-05)"
  - "initStickyTab and initWordRoller left completely untouched (Plan 02 depends on both)"
metrics:
  duration: ~10min
  completed: "2026-06-01"
  tasks: 3
  files: 5
---

# Phase 8 Plan 1: Header Refactor (Non-Fixed, No Hamburger) Summary

Header made non-fixed and stripped of all mobile-nav machinery — removes scroll-driven colour fade, three-line hamburger, full-screen overlay, and Contact menu item; reorders remaining links to Approach then Work matching page DOM order.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Make header non-fixed, delete scroll-fade CSS + JS | 9334b93 | css/components.css, css/animations.css, js/main.js |
| 2 | Delete hamburger + overlay (markup, CSS, JS) | 61ac3c8 | index.html, css/components.css, js/main.js |
| 3 | Reorder menu Approach→Work, drop Contact, keep mobile links | 9602a72 | index.html, css/layout.css |

## What Was Removed

### CSS selectors deleted
- `.nav { position: fixed; top/left/right; z-index: 100; background: transparent; color: white }` — from `components.css`
- `.nav.scrolled { background: linen; color: midnight }` — from `components.css`
- `.nav.scrolled .nav-link:focus-visible / .nav.scrolled .nav-wordmark:focus-visible` — from `components.css`
- `.nav-hamburger`, `.nav-hamburger-line`, `@media (max-width:1024px) { .nav-hamburger }` — from `components.css`
- `.nav-overlay`, `.nav-overlay.open`, `.nav-overlay-close`, `.nav-overlay nav`, `.nav-overlay-link` — from `components.css`
- `.nav { transition: var(--transition-nav) }` — from `animations.css`
- `.nav-overlay { transition: ... }` + `@media (prefers-reduced-motion) { .nav-overlay }` — from `animations.css`
- `@media (max-width: 1024px) { .nav-links { display: none } }` — from `layout.css`

### JS blocks deleted
- `if ('scrollRestoration' in history) history.scrollRestoration = 'manual'` — from `js/main.js`
- `const nav` + `toggleScrolled` + `scroll` listener — from `js/main.js`
- `const hamburger / overlay / closeBtn` + `openOverlay` + `closeOverlay` + all event listeners — from `js/main.js`

### HTML markup deleted
- `<button class="nav-hamburger">` block (3 spans) — from `index.html`
- `<div id="nav-overlay">` block (close button + mobile nav + 3 links) — from `index.html`
- `<li><a href="#contact">CONTACT</a></li>` — from nav-links in `index.html`

## Final State

### .nav padding expression
`padding: var(--space-sm) calc(var(--space-lg) * 0.75)` — unchanged from before. The nav already used the same shared gutter expression as all sections. No reconciliation needed. No hardcoded `48px` anywhere.

### Nav-links order
```html
<ul class="nav-links" role="list">
  <li><a class="nav-link" href="#approach">APPROACH</a></li>
  <li><a class="nav-link" href="#work">WORK</a></li>
</ul>
```
Approach (line 85) before Work (line 86) — matches page DOM order (`#approach` at `index.html:188`, `#work` at `index.html:200`).

### initStickyTab — UNTOUCHED
`initStickyTab` at `js/main.js:68-100` was not modified. Plan 02 extends it for the floating bar. Current selector is `.sticky-tab`; Plan 02 will rename/extend.

### initWordRoller — UNTOUCHED
`initWordRoller` at `js/main.js:106-164` was not modified.

### word-roller block in animations.css — UNTOUCHED
`.word-roller` block remains in `css/animations.css`.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — this plan is pure deletion/refactor with no new data-bearing UI.

## Threat Flags

None — static markup/CSS/JS deletion with no new network endpoints, auth paths, or trust boundary changes.

## Self-Check: PASSED

- index.html modified: confirmed
- css/components.css modified: confirmed
- css/layout.css modified: confirmed
- css/animations.css modified: confirmed
- js/main.js modified: confirmed
- All three commits present: 9334b93, 61ac3c8, 9602a72
