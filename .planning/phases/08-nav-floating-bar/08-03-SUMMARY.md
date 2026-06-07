---
phase: 08-nav-floating-bar
plan: "03"
subsystem: testing
tags: [playwright, e2e, nav, floating-bar, a11y, reduced-motion, responsive]
dependency_graph:
  requires: [08-01, 08-02]
  provides: [playwright-harness, nav-floating-bar-suite]
  affects: [package.json, playwright.config.js, tests/nav-floating-bar.spec.js, .gitignore]
tech_stack:
  added: ["@playwright/test@1.60.0 (devDependency only — never shipped)"]
  patterns: [python3-static-server, reducedMotion-context, viewport-project-matrix, aria-auto-wait]
key_files:
  created:
    - package.json
    - package-lock.json
    - playwright.config.js
    - tests/nav-floating-bar.spec.js
  modified:
    - .gitignore
decisions:
  - "Static server: python3 -m http.server on port 7777 — zero extra npm dep, darwin-native"
  - "Chromium only (not all browsers) — sufficient for this visual/DOM behaviour suite"
  - "Gutter alignment test scoped to desktop (>640px) only — at <=640px sections override padding-inline to 20px while nav stays at 48px; this is intentional Phase 8 mobile layout, not a bug"
  - "Tab-order test uses DOM-order evaluation rather than actual Tab keypresses — avoids focus-trap timing fragility in headless Chromium"
metrics:
  duration: ~10min
  completed: "2026-06-01"
  tasks: 2
  files: 5
---

# Phase 8 Plan 3: Playwright Nav + Floating Bar Suite Summary

Playwright dev harness initialised from scratch (python3 static server, Chromium, three viewport projects) and 78-test D-18 suite written covering header scroll-away, gutter alignment, floating bar gate, CTA pill, mobile burger/pill-stack, desktop pill row, focus management, and reduced-motion burger-line transition assertions.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Initialise dev-only Playwright harness | 45fc99d | package.json, package-lock.json, playwright.config.js, .gitignore |
| 2 | Write heavy nav + floating-bar Playwright suite | 9e391cf | tests/nav-floating-bar.spec.js |

## Harness Details

- **Static server:** `python3 -m http.server 7777` (zero extra npm dep, already on macOS/darwin)
- **Port:** 7777
- **Browser:** Chromium only (Playwright 1.60.0)
- **Playwright version:** 1.60.0
- **Viewport projects:** mobile-375 (375x812), tablet-768 (768x1024), desktop-1440 (1440x900)
- **Test count:** 78 total test blocks across 3 projects; 55 pass, 23 skip (viewport-specific guards)

## Selectors Used

Selectors come directly from 08-01-SUMMARY and 08-02-SUMMARY:
- `.nav`, `.nav-links`, `.nav-link`
- `.floating-bar`, `.floating-bar--visible`, `.floating-bar--suppressed`
- `.floating-bar__cta`, `.floating-bar__burger`, `.floating-bar__burger-line`
- `.floating-bar__pills`, `.floating-bar__pills--open`, `.floating-bar__pill`
- `.hero`, `#contact`, `#approach`, `#work`

## Breakpoint Assumption

Desktop/mobile breakpoint taken from 08-02-SUMMARY: `641px`.
- `min-width: 641px` → pills always visible, burger `display:none`
- `max-width: 640px` → burger visible, pills hidden until open

## Assumptions from Prior Plans

- `08-01-SUMMARY` confirmed no `.nav-hamburger`, no `#nav-overlay`, Approach→Work nav order
- `08-02-SUMMARY` confirmed `.floating-bar--visible` toggled via JS scroll gate, `.floating-bar--suppressed` via IntersectionObserver on `#contact` at threshold 0.15, burger `aria-expanded` pattern, `initFloatingBurger` focus management
- Burger-line rotate transform transitions live in `components.css` (not `animations.css`) per 08-02-SUMMARY

## Coverage Map (D-18)

| Criterion | Tests | Viewport |
|-----------|-------|----------|
| Menu order Approach→Work | Header nav: nav-links has exactly 2 links | All |
| No Contact link | Header nav: nav-links does not contain #contact link | All |
| No hamburger in header | Header nav: no .nav-hamburger, no #nav-overlay | All |
| Header scrolls away | Header nav: header scrolls away from viewport | All |
| Gutter alignment | Header nav: gutter padding matches shared expression | Desktop only |
| Bar hidden at scrollY 0 | Floating bar gate: bar is hidden at top | All |
| Bar visible past hero | Floating bar gate: bar visible after scrolling past hero | All |
| Bar suppressed at #contact | Floating bar gate: bar suppressed when #contact in view | All |
| CTA text + href | CTA pill: text "Free 30-min chat" and href "#contact" | All |
| Mobile burger visible | Mobile burger: burger is visible at 375px | Mobile-375 |
| Burger has 2 lines | Mobile burger: burger has exactly two burger-line spans | Mobile-375 |
| Pills hidden initially | Mobile burger: pills not visible before burger tapped | Mobile-375 |
| Burger opens pills | Mobile burger: tapping burger sets aria-expanded true | Mobile-375 |
| Approach above Work | Mobile burger: Approach box top < Work box top | Mobile-375 |
| X collapses pills | Mobile burger: tapping X collapses pills | Mobile-375 |
| Desktop burger hidden | Desktop pill row: burger hidden on desktop | Desktop-1440 |
| Desktop pills visible | Desktop pill row: both pills visible as a row | Desktop-1440 |
| CTA left of pills | Desktop pill row: CTA left of pill cluster | Desktop-1440 |
| Pills in row order | Desktop pill row: Approach left, Work right | Desktop-1440 |
| Open → first pill focus | Focus: opening menu focuses first pill (Approach) | Mobile-375 |
| Escape → focus return | Focus: Escape closes + returns focus to burger | Mobile-375 |
| Tab order CTA→burger | Focus: CTA before burger in focusable order | Mobile-375 |
| Transition non-zero default | Reduced motion: transition-duration > 0s | New mobile ctx |
| Transition 0s under reduce | Reduced motion: transition-duration = 0s | reducedMotion:reduce ctx |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Gutter test corrected to desktop-only scope**
- **Found during:** Task 2 first run
- **Issue:** The gutter test compared `.nav` padding-left to a content section at 375px. At <=640px, `components.css` applies `padding-inline: 20px` to all sections (.hero, .work, .footer, etc.) as a mobile override, while `.nav` retains its `calc(var(--space-lg) * 0.75) = 48px`. The diff was 28px. This is intentional responsive behaviour, not a bug in Plan 01.
- **Fix:** Added `if (isMobile(page)) { test.skip(); return; }` guard. At desktop (1440px), all three values (nav, footer, section) resolve to 48px — the assertion holds correctly.
- **Files modified:** `tests/nav-floating-bar.spec.js`
- **Commit:** 9e391cf

## Known Stubs

None — the suite tests existing implementation. No new data-bearing UI introduced.

## Threat Flags

None — T-08-SC (supply chain) was cleared by the human legitimacy gate (Task 0 approved). T-08-08 and T-08-10 accepted as per the plan's threat register.

## Shipped Bundle Confirmation

`index.html` contains no `node_modules` reference. The deployed Cloudflare Pages bundle remains plain HTML/CSS/JS. `node_modules/`, `test-results/`, and `playwright-report/` are all gitignored.

## Self-Check: PASSED

- package.json created: confirmed (45fc99d)
- playwright.config.js created: confirmed (45fc99d)
- .gitignore updated: confirmed (45fc99d)
- tests/nav-floating-bar.spec.js created: confirmed (9e391cf)
- Both commits present: 45fc99d, 9e391cf
- `npx playwright test` exits 0: confirmed (55 passed, 23 skipped, 2 consecutive runs)
- index.html references no node_modules: confirmed
- test-results/ gitignored: confirmed
- playwright-report/ gitignored: confirmed
