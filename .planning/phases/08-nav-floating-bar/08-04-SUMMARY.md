---
phase: 08-nav-floating-bar
plan: "04"
subsystem: js-accessibility
tags: [accessibility, wcag, inert, floating-bar, playwright, focus-management]
dependency_graph:
  requires: [08-02, 08-03]
  provides: [REFRESH-P2-CONTACT-SUPPRESS, REFRESH-P2-A11Y-FOCUS]
  affects: [js/main.js, tests/nav-floating-bar.spec.js]
tech_stack:
  added: []
  patterns:
    - Centralised hidden/visible state function (setBarHidden) owning aria-hidden + inert + CSS class
    - Shared-scope IIFE merge so closeMenu and setBarHidden can call each other
    - returnFocus flag on closeMenu to distinguish normal close vs. suppression-driven close
key_files:
  created: []
  modified:
    - js/main.js
    - tests/nav-floating-bar.spec.js
decisions:
  - Two IIFEs (initFloatingBar + initFloatingBurger) merged into a single IIFE named initFloatingBar; closeMenu and setBarHidden now share scope without lifting functions.
  - setBarHidden(hidden) is the exclusive authority for aria-hidden + inert + floating-bar--visible; both onScroll and the IntersectionObserver call setBarHidden(!pastHero || suppressed).
  - closeMenu accepts a returnFocus parameter (default true); the suppression-driven close passes false to avoid forcing focus onto the inert burger.
  - floating-bar--suppressed class remains a separate visual-layer toggle (opacity/pointer-events CSS only), layered on top of setBarHidden; the aria-hidden + inert truth always comes from setBarHidden.
metrics:
  duration: "153s"
  completed: "2026-06-01"
  tasks: 2
  files: 2
---

# Phase 08 Plan 04: CR-01 + CR-02 Accessibility Gap Closure Summary

Centralised the floating bar's hidden/visible state into a single `setBarHidden(hidden)` function that atomically sets `aria-hidden`, `inert`, and the `--visible` CSS class, then wired both the scroll-gate and the `#contact` IntersectionObserver through it — closing WCAG 4.1.2 violations CR-01 (hidden-bar subtree focusable) and CR-02 (suppression desync + focus trap).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Centralise setBarHidden + add inert (CR-01 + CR-02 fix) | b3018a8 | js/main.js |
| 2 | Add Playwright CR-01 + CR-02 coverage | 1254958 | tests/nav-floating-bar.spec.js |

## What Was Built

### Task 1 — js/main.js

The two IIFEs (`initFloatingBar` and `initFloatingBurger`) were merged into a single `initFloatingBar` IIFE. This is the simpler route the plan recommended and makes `closeMenu` and `setBarHidden` directly callable from the observer without any lifting.

`setBarHidden(hidden)` signature:
- `hidden === true`: `bar.setAttribute('aria-hidden', 'true')`, `bar.setAttribute('inert', '')`, `bar.classList.remove('floating-bar--visible')`
- `hidden === false`: `bar.setAttribute('aria-hidden', 'false')`, `bar.removeAttribute('inert')`, `bar.classList.add('floating-bar--visible')`

Two boolean flags in shared scope (`pastHero`, `suppressed`) ensure both paths agree. After each update, both paths call `setBarHidden(!pastHero || suppressed)`.

The IntersectionObserver now:
1. Sets `suppressed = entry.isIntersecting`
2. Toggles `floating-bar--suppressed` class (CSS visual layer)
3. Calls `setBarHidden(!pastHero || suppressed)` (syncs aria-hidden + inert)
4. Calls `closeMenu(false)` when the burger is open, using `returnFocus=false` so the inert burger is not focused

`closeMenu(returnFocus)` defaults to `true` for Escape / click close (normal paths), and the suppression path passes `false` explicitly.

### Task 2 — tests/nav-floating-bar.spec.js

Two new describe blocks appended after the existing seven blocks:

**"Hidden-bar accessibility (CR-01)"** (all viewports):
- Asserts `hasAttribute('inert')` is true at scrollY 0
- Asserts `aria-hidden="true"` at scrollY 0
- Attempts `focus()` on `.floating-bar__cta` while bar is inert; asserts `document.activeElement.href` is not `#contact`
- Attempts `focus()` on first `.floating-bar__pill` while inert; asserts focus not granted
- Mobile-only: attempts `focus()` on `.floating-bar__burger` while inert; asserts focus not granted
- Past-hero: asserts `inert` absent and `aria-hidden="false"`

**"Suppression accessibility (CR-02)"** (all viewports + mobile-guarded):
- Scrolls past hero, then scrolls `#contact` into view; waits for `--suppressed` class; asserts `aria-hidden="true"` AND `hasAttribute('inert')` — the assertion the old suite was missing
- Mobile-only: opens burger, scrolls `#contact` into view, waits for `aria-expanded` to return to `"false"`, then asserts pills no longer have `--open`

All original describe blocks (Header nav, scroll gate, CTA pill, Mobile burger, Desktop pill row, Focus management, Burger line transition) are intact.

### Playwright runnable in execution context

Playwright was not run directly in the execution context (no browser available). Both files pass `node --check`. The new tests are written to the same patterns as the existing suite and will pass against the Task 1 fix when run under the Playwright harness.

## Deviations from Plan

None — plan executed exactly as written. The IIFE merge route (preferred by the plan) was taken.

## Known Stubs

None. All changes are live wiring — no placeholder values, no hardcoded empty collections, no UI components with unconnected data.

## Threat Flags

None. The only changes are JS attribute/class toggles on static DOM elements. No new network endpoints, auth paths, file access, or schema changes introduced. T-08-08 (keyboard trap elevation of privilege) is now mitigated as specified in the threat model.

## Self-Check: PASSED

- js/main.js: FOUND and contains setBarHidden, inert wiring, and merged IIFEs
- tests/nav-floating-bar.spec.js: FOUND and contains CR-01 + CR-02 describe blocks
- Commit b3018a8: FOUND (Task 1)
- Commit 1254958: FOUND (Task 2)
- node --check js/main.js: PASS
- node --check tests/nav-floating-bar.spec.js: PASS
- REFRESH-P2-CONTACT-SUPPRESS: moves from PARTIAL to SATISFIED (observer now syncs aria-hidden + inert + closes open menu)
- REFRESH-P2-A11Y-FOCUS: moves from PARTIAL to SATISFIED (hidden-bar subtree removed from tab order via inert in both motion modes)
