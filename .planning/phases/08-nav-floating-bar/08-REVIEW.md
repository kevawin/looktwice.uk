---
phase: 08-nav-floating-bar
reviewed: 2026-06-01T08:56:16Z
depth: standard
files_reviewed: 2
files_reviewed_list:
  - js/main.js
  - tests/nav-floating-bar.spec.js
findings:
  critical: 0
  warning: 3
  info: 3
  total: 6
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-06-01T08:56:16Z
**Depth:** standard
**Files Reviewed:** 2
**Status:** issues_found

## Summary

This review covers the 08-04 gap-closure changes: the `setBarHidden()` centralisation
in `js/main.js` and the matching CR-01/CR-02 Playwright assertions in
`tests/nav-floating-bar.spec.js`. It overwrites the earlier wave's 08-REVIEW.md.

The core fix is sound. `setBarHidden(hidden)` is now the single authority for
`aria-hidden`, `inert`, and the `--visible` class, and both the scroll-gate and the
`#contact` observer route through it, so the two paths can no longer set conflicting
states. The two IIFEs were correctly merged so `setBarHidden` and `closeMenu` share
scope; `closeMenu` is a hoisted function declaration, so the observer's `closeMenu(false)`
call resolves even though the burger-wiring guard (`if (!burger || !pills) return`) sits
after it. The `returnFocus` guard prevents forcing focus onto the inert burger on a
suppression-driven close. No design-ban or vanilla-JS-constraint violations: `inert` is a
native HTML attribute (no framework, no npm dep shipped), the single gradient stays on the
CTA, and no font-weight 500 or em-dashes were introduced.

No BLOCKERs. The findings below are robustness gaps and test-strength gaps, not
correctness failures in the happy path.

## Warnings

### WR-01: Resize does not re-evaluate the bar's hidden state — stale visibility after a resize

**File:** `js/main.js:39-41`
**Issue:** The resize handler recomputes `threshold` but never re-runs `onScroll()`. If the
hero's `offsetHeight` changes on resize (orientation change, mobile URL-bar collapse,
responsive reflow), `pastHero` and the bar's visible/`inert`/`aria-hidden` state stay
stale until the next scroll event. A user who is past the new threshold but does not scroll
sees an out-of-date bar — including the accessibility-relevant `inert`/`aria-hidden` pair
the CR-01 fix is supposed to keep in sync. The bar can be visually shown while still `inert`,
or hidden while still focusable, between a resize and the next scroll tick.
**Fix:** Re-evaluate state inside the resize handler so the new threshold takes effect
immediately:
```js
window.addEventListener('resize', () => {
  threshold = getThreshold();
  onScroll(); // re-sync pastHero + setBarHidden against the new threshold
}, { passive: true });
```

### WR-02: Scroll/observer ordering can leave `pastHero` stale inside the observer callback

**File:** `js/main.js:73-75`
**Issue:** The observer callback recomputes the hidden state from the shared `pastHero`
flag (`setBarHidden(!pastHero || suppressed)`), but `pastHero` is only updated by
`onScroll`. The scroll and IntersectionObserver callbacks fire independently and their
ordering on a given scroll frame is not guaranteed. When the observer fires before the
scroll handler on the same gesture, it reads a stale `pastHero` and can momentarily set the
wrong hidden/visible state (e.g. re-hide the bar one frame after it should have stayed
visible while leaving `#contact` upward). Self-corrects on the next scroll tick, so it is a
transient glitch rather than a stuck state.
**Fix:** Read scroll position fresh inside the observer instead of trusting the cached flag,
or recompute `pastHero` at the top of the observer callback:
```js
entries.forEach((entry) => {
  suppressed = entry.isIntersecting;
  pastHero = window.scrollY > threshold; // recompute, don't trust cached flag
  bar.classList.toggle('floating-bar--suppressed', suppressed);
  setBarHidden(!pastHero || suppressed);
  ...
});
```

### WR-03: CR-02 test asserts the menu closed but not the actual focus-trap condition

**File:** `tests/nav-floating-bar.spec.js:537-559`
**Issue:** The CR-02 bug is a focus trap on an invisible pill. The test opens the menu,
scrolls `#contact` into view, and asserts `aria-expanded === 'false'` plus pills no longer
`--open`. That verifies the proximate fix (menu auto-closes) but never asserts the outcome
the fix exists to guarantee: that focus is not left on a control inside the now-inert bar.
A future regression that closes the menu but leaves `document.activeElement` on the inert
burger/pill would still pass this test. The CR-01 inert-focus tests cover the scrollY-0
hidden state but not the suppression state, so the suppressed-bar focus outcome is untested.
**Fix:** After the wait for `aria-expanded === 'false'`, assert focus has left the bar
subtree:
```js
const focusInsideBar = await page.evaluate(() => {
  const bar = document.querySelector('.floating-bar');
  return bar ? bar.contains(document.activeElement) : false;
});
expect(focusInsideBar).toBe(false);
```

## Info

### IN-01: CR-01 "not focusable" tests are vacuously-passable negative assertions

**File:** `tests/nav-floating-bar.spec.js:449-490`
**Issue:** The three "not focusable" tests return `null` early when the target element is
missing and then assert `activeHref !== '#contact'` (or `!== pillHref`, `not.toContain`).
If the CTA/pill/burger were absent from the DOM, the assertions would pass without proving
anything about `inert`. The elements exist today, so these pass for the right reason now,
but the assertions do not pin the precondition that the element is present and would have
been focusable absent `inert`.
**Fix:** First assert the element exists and is otherwise focusable (e.g. not `display:none`),
then assert focus was refused — so the test fails loudly if the element disappears rather
than passing vacuously.

### IN-02: Two identical "Section 7" header banners; one block is misnumbered

**File:** `tests/nav-floating-bar.spec.js:421-423, 562-564`
**Issue:** The "7. Burger line -> X" comment banner appears twice (lines 421-423 and
562-564), and the CR-01/CR-02 blocks are numbered 8 and 9 while sitting between the two
"7" banners. The banner at 421-423 is an empty, dead-documentation duplicate and the
numbering is inconsistent, which makes the suite harder to scan.
**Fix:** Delete the orphan banner at lines 421-423 and renumber so each describe block has a
unique heading.

### IN-03: `closeMenu` default-parameter pattern is more verbose than needed

**File:** `js/main.js:103-104`
**Issue:** `function closeMenu(returnFocus) { if (returnFocus === undefined) returnFocus = true; ... }`
reimplements a default by hand. A standard default parameter is clearer and conveys intent
at the signature.
**Fix:** `function closeMenu(returnFocus = true) { ... }` — behaviour is identical (the only
explicit caller passes `false`; all others pass nothing).

---

_Reviewed: 2026-06-01T08:56:16Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
