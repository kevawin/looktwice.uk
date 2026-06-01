---
phase: 08-nav-floating-bar
verified: 2026-06-01T00:00:00Z
status: gaps_found
score: 5/7 success criteria verified
overrides_applied: 0
gaps:
  - truth: "aria-hidden subtree with focusable children when bar is hidden (CR-01: WCAG 4.1.2 violation)"
    status: failed
    reason: >
      When floating-bar is not yet visible (or suppressed), aria-hidden=\"true\" is set on the
      root but the CTA anchor, burger button, and pill anchors have no inert attribute and no
      tabindex=\"-1\". Children re-enable pointer-events:auto in CSS. A keyboard user can tab
      into these invisible controls. Under reduced-motion the bar is opacity:0 in-flow (no
      translate), so the controls are literally on top of page content — invisible and
      focusable. This is a WCAG 4.1.2 failure. Phase success criterion 6 explicitly requires
      correct keyboard/focus management.
    artifacts:
      - path: "js/main.js"
        issue: "onScroll toggles aria-hidden but never adds/removes inert or tabindex=-1 on the bar"
      - path: "css/components.css"
        issue: "children re-enable pointer-events:auto; under reduced-motion bar is opacity:0 in-flow, not translated off-screen"
    missing:
      - "bar.setAttribute('inert', '') when hidden; bar.removeAttribute('inert') when visible"
      - "sync inert in both onScroll (scroll-gate) and the IntersectionObserver (suppression)"

  - truth: "Suppression at #contact syncs aria-hidden and closes any open mobile menu (CR-02)"
    status: failed
    reason: >
      The IntersectionObserver toggles only floating-bar--suppressed. It never sets
      aria-hidden=\"true\" for the suppressed state (aria-hidden was set to \"false\" when the
      bar became visible, and the observer never corrects it). It also never calls closeMenu()
      when a mobile menu is open. If a user opens the burger then scrolls #contact into view,
      focus stays on an invisible pill. Phase success criterion 6 explicitly requires Escape
      closes and focus returns to the burger — that correctness is undermined when suppression
      can trap focus on an invisible control with no escape path.
    artifacts:
      - path: "js/main.js"
        issue: "IntersectionObserver callback (lines 38-47) only toggles --suppressed class; no aria-hidden sync, no closeMenu() call"
    missing:
      - "In observer callback: bar.setAttribute('aria-hidden', 'true') when suppressed"
      - "In observer callback: call closeMenu() if burger aria-expanded === 'true' when suppressing"
---

# Phase 8: Navigation & Floating Action Bar — Verification Report

**Phase Goal:** The header stops being persistent and scrolls away; a floating action bar takes over past the hero — a gradient CTA pill plus white/pink burger nav — so navigation never double-menus and the persistent CTA re-answers the two mid-page segues that refresh P1 left dangling.

**Verified:** 2026-06-01T00:00:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC-1 | Header no longer fixed; scrolls away; scroll-driven colour animation removed | VERIFIED | `.nav` has no `position:fixed` in components.css (only `position:fixed` in file is on `.floating-bar` at line 807). `.nav.scrolled` rule absent. `toggleScrolled` absent from js/main.js. `transition: var(--transition-nav)` absent from animations.css. |
| SC-2 | Burger + overlay removed entirely; Contact dropped; menu reordered Approach→Work; header padding on shared gutter | VERIFIED | index.html:84-88 has only nav-wordmark + nav-links with APPROACH then WORK, no hamburger, no overlay. `display:none` rule on nav-links absent from layout.css. Nav padding is `calc(var(--space-lg) * 0.75)` in layout.css:18. No `nav-hamburger` or `nav-overlay` in any source file. |
| SC-3 | Floating bar appears only after hero (scroll-gate); never overlaps header — no double-menu | VERIFIED | js/main.js initFloatingBar: threshold = `hero.offsetHeight`, bar gets `--visible` only when `scrollY > threshold`. Bar is `transform: translateY(...)` hidden by default. Header is in-flow (scrolls off); bar appears after. |
| SC-4 | Left element is gradient CTA pill (one gradient); right is circular white/pink two-line burger rotating into X | VERIFIED | `var(--gradient-brand)` appears exactly once in components.css (line 836, `.floating-bar__cta`). Burger: `border-radius: 50%`, `width/height: 48px`, two `.floating-bar__burger-line` spans in index.html. `[aria-expanded="true"]` rules rotate lines ±45deg with translateY(3.5px/-3.5px). |
| SC-5 | Mobile: burger reveals Approach/Work pills sliding up; desktop: no burger, pills always visible as row | VERIFIED | CSS: `@media (min-width:641px)` hides burger (`display:none`) and shows pills as flex-row with `opacity:1 transform:none`. Mobile default: pills `opacity:0 transform:translateY(12px)`, revealed by `.floating-bar__pills--open`. Approach before Work in both markup and desktop test assertions. Note: ROADMAP SC-5 says "( Work )( Approach )" for desktop row but D-01 explicitly supersedes this — Approach first is the locked decision. |
| SC-6 | Keyboard/focus correct: aria-expanded, Escape closes, focus returns; reduced-motion collapses to opacity/instant | FAILED | aria-expanded, Escape, and focus-return on close are wired (lines 65-92 of main.js). BUT: CR-01 — bar has `aria-hidden="true"` with focusable children and no `inert`; keyboard users reach invisible controls. CR-02 — suppression at #contact never syncs `aria-hidden` and never closes open menu. These are direct failures of "keyboard/focus management is correct" and WCAG 4.1.2. |
| SC-7 | Persistent CTA covers the two dangling segues from refresh P1 | VERIFIED | index.html:292-308 floating-bar markup present with CTA `href="#contact"`. Segue copy at lines 213 ("Want to see an example...") and 253 ("the first 30 minutes are on me") is unchanged. The always-present CTA pill structurally answers both. |

**Score: 5/7 success criteria verified**

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Floating-bar markup; no hamburger/overlay; APPROACH then WORK nav; v=6 cache-bust | VERIFIED | Lines 80-88: nav with two links. Lines 292-308: floating-bar with CTA + burger + pills. All CSS/JS links at `?v=6`. No `?v=5` anywhere. |
| `css/components.css` | `.floating-bar` block; no `.sticky-tab`; one gradient surface; reduced-motion guard | VERIFIED | Lines 806-1012: full floating-bar component. `--gradient-brand` once (line 836). No `.sticky-tab`. `@media (prefers-reduced-motion:reduce)` block at line 983. |
| `css/layout.css` | `.nav` on shared gutter; no `display:none` on nav-links | VERIFIED | Line 18: `padding: var(--space-sm) calc(var(--space-lg) * 0.75)`. No `display:none` rule for nav-links. |
| `css/animations.css` | No nav transition; no overlay transition; word-roller intact | VERIFIED | Only content is word-roller block. Nav and overlay transitions absent. |
| `js/main.js` | `initFloatingBar` + `initFloatingBurger` IIEFs; no `toggleScrolled`/`openOverlay`/`closeOverlay` | VERIFIED | Both IIEFs present. Old identifiers absent. `initWordRoller` untouched. |
| `tests/nav-floating-bar.spec.js` | Playwright suite covering all D-18 behaviours | VERIFIED | 78 test blocks across 3 viewport projects. All D-18 coverage present (header, bar gate, CTA, mobile burger, desktop row, focus, reduced-motion). |
| `playwright.config.js` | Harness with webServer + three viewport projects | VERIFIED | python3 http.server on port 7777; projects for 375/768/1440. |
| `package.json` | `@playwright/test` devDependency; `private:true` | VERIFIED | Created with `@playwright/test@1.60.0` devDependency. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `js/main.js` scroll-gate | `.floating-bar--visible` / `.floating-bar--suppressed` | scrollY > hero.offsetHeight + IntersectionObserver on #contact | WIRED | Lines 27-47: `floating-bar--visible` toggled by scroll; `floating-bar--suppressed` by observer |
| `.floating-bar__cta` | `#contact` | anchor href | WIRED | index.html:293: `href="#contact"` |
| `.floating-bar__pill` anchors | `#approach` / `#work` | anchor href | WIRED | index.html:304-305: href="#approach" then "#work" |
| `bar.setAttribute('aria-hidden')` | scroll-gate | onScroll() | WIRED (partial) | Only wired in `onScroll`; IntersectionObserver suppression path never syncs `aria-hidden` — see CR-02 gap |

---

### Data-Flow Trace (Level 4)

Not applicable — static site with no server-rendered data. All content is authored HTML. The floating bar's interactive state (open/visible/suppressed) is driven by browser events, not a data source.

---

### Behavioral Spot-Checks

Step 7b deferred: cannot run Playwright or start the python3 server in this verification context. The suite was declared passing (55 pass, 23 skip, 2 consecutive runs per 08-03-SUMMARY) but that is a SUMMARY claim. Key gap: the Playwright suite does not assert the CR-01/CR-02 failure conditions (it does not test whether hidden-bar children are in the tab order, and does not test aria-hidden sync during suppression). The suite passing is consistent with these bugs existing undetected.

---

### Probe Execution

No probe scripts declared in PLAN frontmatter. No `scripts/*/tests/probe-*.sh` files found. Step 7c: not applicable.

---

### Requirements Coverage

REQUIREMENTS.md uses the original V1 ID scheme (NAV-01 through NAV-05, A11Y-01 through A11Y-06, etc.). The REFRESH-P2 requirement IDs declared in the three PLAN files (`REFRESH-P2-HEADER-SCROLLAWAY`, `REFRESH-P2-DEBURGER`, `REFRESH-P2-DROP-CONTACT`, `REFRESH-P2-NAV-ORDER`, `REFRESH-P2-GUTTER-ALIGN`, `REFRESH-P2-FLOATING-BAR`, `REFRESH-P2-CTA-PILL`, `REFRESH-P2-BURGER-NAV`, `REFRESH-P2-MOBILE-SLIDEUP`, `REFRESH-P2-DESKTOP-ROW`, `REFRESH-P2-SCROLL-GATE`, `REFRESH-P2-CONTACT-SUPPRESS`, `REFRESH-P2-REDUCED-MOTION`, `REFRESH-P2-A11Y-FOCUS`, `REFRESH-P2-SEGUE-CARRYOVER`, `REFRESH-P2-PLAYWRIGHT-SUITE`) are defined in ROADMAP-REFRESH.md Phase 2, not in REQUIREMENTS.md. None of these IDs appear in REQUIREMENTS.md — they are a parallel refresh-milestone tracking system, not the V1 requirements. No orphaned IDs.

The phase supersedes several V1 requirements from prior phases. The original NAV-01 through NAV-05 and JS-02/JS-03 are intentionally replaced by the new nav model; this is the purpose of the refresh milestone. No V1 requirement is left in a broken state by this phase that a later phase owns.

| Requirement | Plan | Description | Status | Evidence |
|-------------|------|-------------|--------|---------|
| REFRESH-P2-HEADER-SCROLLAWAY | 08-01 | Header scrolls away, no fixed | SATISFIED | .nav has no position:fixed |
| REFRESH-P2-DEBURGER | 08-01 | Hamburger + overlay removed | SATISFIED | Absent from all source files |
| REFRESH-P2-DROP-CONTACT | 08-01 | Contact removed from menu | SATISFIED | nav-links has APPROACH + WORK only |
| REFRESH-P2-NAV-ORDER | 08-01 | Approach then Work (D-01) | SATISFIED | index.html:85-86 |
| REFRESH-P2-GUTTER-ALIGN | 08-01 | Nav padding on shared gutter | SATISFIED | calc(var(--space-lg)*0.75) in layout.css |
| REFRESH-P2-FLOATING-BAR | 08-02 | Floating bar markup present | SATISFIED | index.html:292-308 |
| REFRESH-P2-CTA-PILL | 08-02 | Gradient CTA pill, one gradient | SATISFIED | One --gradient-brand in components.css |
| REFRESH-P2-BURGER-NAV | 08-02 | Two-line burger, white/pink | SATISFIED | CSS + markup confirmed |
| REFRESH-P2-MOBILE-SLIDEUP | 08-02 | Pills slide up on mobile | SATISFIED | CSS transition + --open class |
| REFRESH-P2-DESKTOP-ROW | 08-02 | Desktop always-visible pill row | SATISFIED | @media min-width:641px |
| REFRESH-P2-SCROLL-GATE | 08-02 | Bar hidden over hero | SATISFIED | threshold = hero.offsetHeight |
| REFRESH-P2-CONTACT-SUPPRESS | 08-02 | Bar hides at #contact | PARTIAL | Visual CSS works; aria-hidden not synced; open menu not closed |
| REFRESH-P2-REDUCED-MOTION | 08-02 | prefers-reduced-motion guard | SATISFIED | @media guard strips transforms |
| REFRESH-P2-A11Y-FOCUS | 08-02 | aria-expanded, Escape, focus return | PARTIAL | Happy path wired; CR-01 + CR-02 break WCAG 4.1.2 for hidden state |
| REFRESH-P2-SEGUE-CARRYOVER | 08-02 | Persistent CTA answers dangling segues | SATISFIED | CTA always present past hero |
| REFRESH-P2-PLAYWRIGHT-SUITE | 08-03 | Playwright D-18 suite | SATISFIED | 78 tests present and declared passing |

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `js/main.js:23-25` | `resize` listener updates threshold but does not call `onScroll()` | Warning (WR-02) | If viewport resize crosses threshold without a scroll event, bar state goes stale. Realistic on mobile orientation change. |
| `js/main.js:76,85` | `closeMenu()` unconditionally calls `burger.focus()` including on pill-click | Warning (WR-04) | After pill navigation, focus snaps back to burger instead of the anchor destination. Keyboard users' next Tab continues from burger, not the jumped-to section. |
| `css/layout.css:7-11` | Comment still references removed `.nav-hamburger` | Info (IN-04) | Misleading documentation only; no functional impact. |
| `css/components.css:51-55` | `.nav-link.active::after` — no JS sets `active` class | Info (IN-03) | Dead CSS; no JS scroll-spy exists post-Phase 8. Harmless but misleading. |
| `tests/nav-floating-bar.spec.js` | Test tooling (spec, config, package.json, package-lock.json) committed and publicly reachable on Cloudflare Pages | Warning (WR-01) | No `_routes.json` excludes these paths. Not a security blocker — no secrets. Contradicts "never shipped" intent. |
| `css/components.css:206-226` | `.hero__readon` — no matching markup | Info (IN-01) | Dead CSS rule. |
| `css/components.css:457-465` | `.work__close` — no matching markup | Info (IN-02) | Dead CSS rule. |

No `TBD`, `FIXME`, or `XXX` debt markers found in phase-modified files.

---

## CR-01 and CR-02: Verdict Against Phase Success Criteria

The question posed is whether CR-01 and CR-02 undermine success criteria D-14/D-15/D-16 or are out-of-scope polish.

**Verdict: Both are BLOCKERS against SC-6 (D-15/D-16). Neither is out-of-scope polish.**

SC-6 in ROADMAP.md reads: "Keyboard + focus management is correct: `aria-expanded` on the burger, logical pill tab order, Escape closes, focus returns to the burger on close; line→X and slide animations collapse to opacity/instant under `prefers-reduced-motion: reduce`."

D-15 in 08-CONTEXT.md reads: "on mobile, opening moves focus into the revealed pills; Escape closes and returns focus to the burger; tab order is logical (CTA → burger/pills)."

These are not aspirational; they are the stated correctness contract.

CR-01 breaks that contract in two ways: (1) keyboard users tab into a bar that is invisible and non-interactive because there is no `inert` attribute and no `tabindex="-1"` on children while `aria-hidden="true"` is set — this is a direct WCAG 4.1.2 failure, not a polish item; (2) under reduced-motion the bar is `opacity:0` in normal flow (no translate), making it worse — the controls are literally on top of content, invisible but accepting focus and clicks.

CR-02 breaks the focus-safety guarantee: when suppression fires while the mobile menu is open, focus stays on a pill that has visually disappeared. The Escape / focus-return path does not save you here — the IntersectionObserver fired outside the menu state machine, there is no residual input to trigger Escape, and the user is left on an invisible interactive element with no clear way to perceive it.

The Playwright suite does not catch either bug because it does not test focusability of the hidden bar, and does not test aria-hidden state during suppression. The suite passing is not contradictory evidence.

These are correctness failures in the phase's own accessibility success criterion.

---

### Gaps Summary

Two gaps blocking full goal achievement, both rooted in the same root cause: the floating-bar's hidden state (both pre-visible and suppressed) uses CSS-only opacity/transform with `pointer-events:none` but leaves the subtree in the accessibility tree and tab order.

**Gap 1 (CR-01):** The bar has `aria-hidden="true"` set by JS when hidden but no `inert`. Children with `pointer-events:auto` remain keyboard-focusable. Under reduced-motion the problem is worse (in-flow, no transform offset). Fix: add/remove `inert` on the bar root in `onScroll`, co-located with the `aria-hidden` toggle.

**Gap 2 (CR-02):** The `IntersectionObserver` suppression path only toggles the CSS class. It never sets `aria-hidden="true"` and never closes an open mobile menu. Fix: in the observer callback, set `aria-hidden="true"` when suppressing, and call `closeMenu()` if the burger is open. If `inert` is adopted from Gap 1, centralise the hidden/visible decision in one function so the two code paths cannot disagree.

Both gaps are ~10 lines of JS each. They share the same function-based fix pattern.

---

_Verified: 2026-06-01T00:00:00Z_
_Verifier: Claude (gsd-verifier)_
