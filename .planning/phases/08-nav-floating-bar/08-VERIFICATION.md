---
phase: 08-nav-floating-bar
verified: 2026-06-01T12:00:00Z
status: passed
score: 7/7 success criteria verified
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 5/7
  gaps_closed:
    - "CR-01: hidden-bar children (CTA, burger, pills) now removed from tab order via inert on the bar root in both the scroll-gate and suppression paths"
    - "CR-02: IntersectionObserver suppression path now syncs aria-hidden='true' + inert via setBarHidden, and calls closeMenu(false) when burger is open, preventing focus trap on invisible pill"
  gaps_remaining: []
  regressions: []
---

# Phase 8: Navigation & Floating Action Bar — Verification Report (Re-verification)

**Phase Goal:** The header stops being persistent and scrolls away; a floating action bar takes over past the hero — a gradient CTA pill plus white/pink burger nav — so navigation never double-menus and the persistent CTA re-answers the two mid-page segues that refresh P1 left dangling.

**Verified:** 2026-06-01T12:00:00Z
**Status:** passed
**Re-verification:** Yes — after gap closure (Plan 08-04)

---

## Re-verification Focus

The prior report (status: gaps_found, score: 5/7) recorded two BLOCKERs:

- CR-01 (WCAG 4.1.2): hidden floating-bar children stayed in the tab order when the bar was invisible — `aria-hidden="true"` was set but no `inert` attribute was added.
- CR-02: the #contact IntersectionObserver left `aria-hidden` stale at "false" during suppression and could trap focus on an invisible pill by never calling `closeMenu()`.

Plan 08-04 addressed both by centralising the bar's hidden/visible state in `setBarHidden()`, merging the two IIFEs, and adding new Playwright assertions. This re-verification checks whether those fixes are live in the codebase.

---

## Goal Achievement

### Observable Truths (Roadmap Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| SC-1 | Header no longer fixed; scrolls away; scroll-driven colour animation removed | VERIFIED | Unchanged from initial verification. `.nav` has no `position:fixed`. `toggleScrolled` absent. |
| SC-2 | Burger + overlay removed; Contact dropped; menu reordered Approach->Work; header padding on shared gutter | VERIFIED | Unchanged from initial verification. |
| SC-3 | Floating bar appears only after hero (scroll-gate); never overlaps header | VERIFIED | Unchanged from initial verification. `threshold = hero.offsetHeight`. |
| SC-4 | Left element is gradient CTA pill (one gradient); right is circular white/pink two-line burger rotating into X | VERIFIED | Unchanged from initial verification. |
| SC-5 | Mobile: burger reveals Approach/Work pills sliding up; desktop: no burger, pills always visible as row | VERIFIED | Unchanged from initial verification. |
| SC-6 | Keyboard/focus correct: aria-expanded, Escape closes, focus returns; reduced-motion collapses to opacity/instant | VERIFIED | CR-01 and CR-02 now closed. `setBarHidden()` adds `inert` on the bar root in both the scroll-gate path (line 61) and the observer path (line 75). `aria-hidden` is set exclusively by `setBarHidden` in both paths — no separate observer-only toggle that could disagree. Observer calls `closeMenu(false)` when `burger.aria-expanded === 'true'` (line 79-81), preventing the focus trap. `returnFocus=false` guard prevents forcing focus onto the inert burger on suppression-driven close (line 108). |
| SC-7 | Persistent CTA covers the two dangling segues from refresh P1 | VERIFIED | Unchanged from initial verification. |

**Score: 7/7 success criteria verified**

---

### CR-01 Gap Closure — Detailed Evidence

Acceptance criteria from 08-04-PLAN.md, checked against `js/main.js` on disk:

- `setBarHidden` function exists: line 46 — VERIFIED
- `setBarHidden` calls `bar.setAttribute('inert', '')` when hiding: line 49 — VERIFIED
- `setBarHidden` calls `bar.removeAttribute('inert')` when showing: line 53 — VERIFIED
- `setBarHidden` sets `aria-hidden='true'` when hiding: line 48 — VERIFIED
- `setBarHidden` sets `aria-hidden='false'` when showing: line 52 — VERIFIED
- `aria-hidden` is set only inside `setBarHidden` — no separate `setAttribute('aria-hidden')` calls anywhere else in the file: VERIFIED (grep confirms two `aria-hidden` setAttribute calls, both inside `setBarHidden`)
- `querySelector('.floating-bar')` appears exactly once (merged IIFE): VERIFIED (count = 1)
- Scroll listener has `{ passive: true }`: line 64 — VERIFIED
- Resize listener has `{ passive: true }`: line 41 — VERIFIED
- `initWordRoller` untouched: line 131 onwards — VERIFIED
- `node --check js/main.js`: PASS

### CR-02 Gap Closure — Detailed Evidence

- Observer sets `suppressed = entry.isIntersecting`: line 73 — VERIFIED
- Observer calls `setBarHidden(!pastHero || suppressed)`: line 75 — VERIFIED (both paths use the same expression, cannot diverge)
- Observer calls `closeMenu(false)` when `burger.getAttribute('aria-expanded') === 'true'`: lines 79-81 — VERIFIED
- `closeMenu` accepts `returnFocus` parameter, defaults true, skips `burger.focus()` when false: lines 103-108 — VERIFIED
- Two shared flags `pastHero` and `suppressed` in scope: lines 36-37 — VERIFIED
- Single `setBarHidden(!pastHero || suppressed)` call in both `onScroll` (line 61) and observer (line 75) — VERIFIED

---

### New Playwright Assertions (Task 2)

Describe block "Hidden-bar accessibility (CR-01)" (lines 429-505):
- Asserts `hasAttribute('inert')` is true at scrollY 0 — PRESENT
- Asserts `aria-hidden="true"` at scrollY 0 — PRESENT
- Attempts `focus()` on `.floating-bar__cta` while inert; asserts `activeElement.href !== '#contact'` — PRESENT
- Attempts `focus()` on first `.floating-bar__pill` while inert; asserts focus not granted — PRESENT
- Mobile-only: attempts `focus()` on `.floating-bar__burger` while inert; asserts focus not granted — PRESENT (guarded with `isDesktop` skip)
- Past-hero: asserts `inert` absent and `aria-hidden="false"` — PRESENT

Describe block "Suppression accessibility (CR-02)" (lines 511-560):
- Scrolls `#contact` into view, waits for `--suppressed`, then asserts `aria-hidden="true"` AND `hasAttribute('inert')` — PRESENT (this was the assertion the old suite was missing)
- Mobile-only: opens burger, scrolls `#contact` into view, waits for `aria-expanded='false'`, asserts pills lose `--open` — PRESENT

`node --check tests/nav-floating-bar.spec.js`: PASS

Existing seven describe blocks (Header nav, Floating bar scroll gate, CTA pill, Mobile burger, Desktop pill row, Focus management, Burger line transition) are all present and unmodified.

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `js/main.js` | `setBarHidden` centralising aria-hidden + inert + --visible; called from onScroll and observer; IIFEs merged | VERIFIED | Lines 46-56: `setBarHidden`. Lines 59-62: `onScroll` routes through it. Lines 70-87: observer routes through it. Single IIFE. |
| `tests/nav-floating-bar.spec.js` | CR-01 and CR-02 describe blocks asserting inert + aria-hidden + focus refusal + menu auto-close | VERIFIED | Describe blocks at lines 429 and 511. 34 test cases total. Both files parse cleanly. |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `js/main.js onScroll` | `bar aria-hidden + inert + --visible` | `setBarHidden(!pastHero \|\| suppressed)` | WIRED | Line 61 |
| `js/main.js IntersectionObserver` | `bar aria-hidden + inert + --visible` | `setBarHidden(!pastHero \|\| suppressed)` | WIRED | Line 75 — CR-02 fix |
| `js/main.js IntersectionObserver` | `closeMenu(false)` | `if suppressed && aria-expanded === 'true'` | WIRED | Lines 79-81 — CR-02 focus-trap fix |
| `closeMenu(returnFocus)` | `burger.focus()` skipped on suppression close | `if (returnFocus)` guard | WIRED | Line 108 |

---

### Requirements Coverage

| Requirement | Plan | Description | Status | Evidence |
|-------------|------|-------------|--------|---------|
| REFRESH-P2-CONTACT-SUPPRESS | 08-04 | Bar hides at #contact; aria-hidden synced; open menu closed | SATISFIED | Observer sets suppressed, calls setBarHidden (syncs aria-hidden + inert), calls closeMenu(false) when menu is open |
| REFRESH-P2-A11Y-FOCUS | 08-04 | Hidden-bar subtree not in tab order; suppression syncs aria + inert | SATISFIED | setBarHidden adds inert in both scroll-gate and observer paths; inert removes subtree from tab order in both motion modes |

All other requirements from the initial verification remain SATISFIED and were not regressed by the 08-04 changes.

---

### Anti-Patterns — Regression Check

The following warnings from the initial verification were carried over (not introduced by 08-04) and remain at Warning/Info severity — none are BLOCKERs:

- WR-01 (from 08-REVIEW.md): resize handler does not re-call `onScroll()` — threshold updates but bar state can go stale until next scroll. Not introduced by 08-04; pre-existing. Not a correctness failure in the accessibility paths this plan fixes.
- WR-02 (from 08-REVIEW.md): observer can read a stale `pastHero` flag before the scroll handler fires on the same gesture — transient glitch, self-corrects on next scroll tick.
- WR-03 (from 08-REVIEW.md): CR-02 test asserts menu closed but not that focus has left the bar subtree. A gap in test completeness, not a gap in the fix.
- IN-01/IN-02/IN-03 (from 08-REVIEW.md): negative assertion vacuous-pass risk in CR-01 tests; duplicate section-7 comment banner; manual default-param pattern. All info-level.

No new debt markers (`TBD`, `FIXME`, `XXX`) in either modified file. No design-ban violations (no gradient surfaces added, no font-weight 500, no em-dashes). No npm dependencies added. `inert` is a native attribute.

---

### Behavioral Spot-Checks

Step 7b: cannot run Playwright (no browser available in this verification context). The phase-level Playwright suite was reported as 75 passed, 27 skipped (viewport-guarded), 0 failed after the 08-04 merge. The new CR-01/CR-02 describe blocks (assertions that would have failed against the pre-fix code) are included in those numbers. The static code analysis above confirms the fix is live and the assertions target the correct conditions.

---

### Human Verification Required

None. The accessibility fix is in vanilla JS (attribute/class toggles on static DOM elements), fully testable by the Playwright harness. The post-merge suite run (75 pass, 0 fail) covers the new CR-01/CR-02 assertions. No visual, real-time, or external-service behaviour introduced.

---

## Gaps Summary

No gaps remain. Both prior BLOCKERs (CR-01, CR-02) are closed in the live codebase. The six non-blocker warnings and info items from the initial report and code review are unchanged in severity and do not block the phase goal.

---

_Verified: 2026-06-01T12:00:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification of 08-VERIFICATION.md — closes CR-01 and CR-02_
