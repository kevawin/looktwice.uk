---
phase: 08-nav-floating-bar
reviewed: 2026-06-01T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - index.html
  - css/components.css
  - css/layout.css
  - css/animations.css
  - js/main.js
  - playwright.config.js
  - tests/nav-floating-bar.spec.js
  - package.json
  - .gitignore
findings:
  critical: 2
  warning: 5
  info: 4
  total: 11
status: issues_found
---

# Phase 8: Code Review Report

**Reviewed:** 2026-06-01T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Phase 8 reworked the header to scroll away, removed the old hamburger/overlay, and added a
floating action bar (gradient CTA pill + nav cluster with mobile burger and desktop pills).
The JS is small and the happy paths work. The Playwright suite is thorough on layout and the
open/close happy path.

The review focuses on the four things the brief flagged: WCAG AA, keyboard/focus correctness,
reduced-motion handling, and test tooling not leaking into the shipped bundle. Two blockers
surfaced, both accessibility correctness bugs that the test suite does not catch:

1. The hidden floating bar keeps its CTA, burger, and pills in the keyboard tab order and the
   accessibility tree while the bar is visually hidden and non-interactive. Keyboard and screen
   reader users hit "ghost" controls.
2. Suppression at `#contact` does not close an open mobile menu and does not update
   `aria-hidden`, so focus can land on or stay on invisible pills.

The "never shipped" claim for the test harness is also not enforced: the spec, config,
`package.json` and `package-lock.json` are git-tracked with no Cloudflare Pages route exclusion,
so they are publicly reachable on the deployed static site.

## Critical Issues

### CR-01: Hidden floating bar leaves focusable controls in the tab order and a11y tree

**File:** `js/main.js:27-34`, `index.html:292-308`, `css/components.css:806-828`
**Issue:**
While the page is over the hero, `.floating-bar` has `aria-hidden="true"` (set in `onScroll`)
and the container has `pointer-events:none`. But the CTA, burger, and pills inside each
re-enable `pointer-events:auto` and remain in the DOM with no `tabindex="-1"` and no `inert`.

Two concrete defects:
- The bar's children are focusable via keyboard even when the bar is hidden. A keyboard user
  tabbing through the page lands on the gradient CTA and burger that are translated off-screen
  (`transform: translateY(...)`), producing focus on an invisible control.
- A focusable element inside an `aria-hidden="true"` subtree is a WCAG 4.1.2 violation. Screen
  readers are told the subtree is hidden, yet the focus order still reaches it, producing a
  "focus moved to nothing" state.

The same problem applies in reduced-motion mode, where the bar is hidden with `opacity:0`
(not transformed off-screen) — the controls sit on top of page content, invisible but
clickable/focusable.

**Fix:** Drive visibility with `inert` (and keep `aria-hidden` in sync) instead of relying on
`pointer-events`/`transform` alone. Toggle it in the same place the class is toggled:

```js
const onScroll = () => {
  const past = window.scrollY > threshold;
  bar.classList.toggle('floating-bar--visible', past);
  bar.setAttribute('aria-hidden', past ? 'false' : 'true');
  // Remove children from tab order + a11y tree when hidden.
  if (past) bar.removeAttribute('inert');
  else bar.setAttribute('inert', '');
};
```

`inert` removes the subtree from focus order and the accessibility tree in one attribute and is
supported in all current evergreen browsers. Verify it is also applied in the suppressed state
(see CR-02).

### CR-02: `#contact` suppression hides the bar visually but not from keyboard or screen readers, and leaves the mobile menu open

**File:** `js/main.js:36-47`, `css/components.css:824-828`
**Issue:**
The IntersectionObserver toggles only the `floating-bar--suppressed` class. That class sets
`opacity:0` and `pointer-events:none`, but the JS never sets `aria-hidden="true"` for the
suppressed state, never applies `inert`, and never closes an open menu.

Results:
- When `#contact` is in view, the bar is invisible and not clickable, yet `aria-hidden` is still
  `"false"` (it was set to `false` when the user scrolled past the hero). Screen readers still
  announce the CTA and pills; keyboard users still tab into invisible controls.
- On mobile, if the menu is open (`aria-expanded="true"`, focus on a pill) when the user scrolls
  `#contact` into view, the menu stays "open" but invisible. Focus is now sitting on a pill the
  user cannot see, with no way to perceive the menu state.

The suppressed `transform` only takes effect when reduced-motion is off; under reduced-motion the
suppressed rule is `opacity:0` with the controls still in normal flow position — same focusable-
ghost problem as CR-01.

**Fix:** Make suppression a real "hidden" state: sync `aria-hidden`/`inert`, and close any open
menu when suppression turns on.

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const suppressed = entry.isIntersecting;
    bar.classList.toggle('floating-bar--suppressed', suppressed);
    bar.setAttribute('aria-hidden', suppressed ? 'true' : String(window.scrollY <= threshold));
    if (suppressed) {
      bar.setAttribute('inert', '');
      // close menu if open so focus does not stay on an invisible pill
      const burger = bar.querySelector('.floating-bar__burger');
      if (burger?.getAttribute('aria-expanded') === 'true') burger.click();
    }
  });
}, { threshold: 0.15 });
```

If you adopt the `inert` approach from CR-01, centralise the hidden/visible decision in one
function so scroll-gate and suppression cannot disagree about `aria-hidden`.

## Warnings

### WR-01: Test harness is git-tracked and publicly reachable on the deployed site

**File:** `tests/nav-floating-bar.spec.js`, `playwright.config.js`, `package.json`, `package-lock.json`, `.gitignore:36-39`
**Issue:**
The brief states Playwright is "dev-only, gitignored, never shipped." `.gitignore` only excludes
`node_modules/` and Playwright *artifacts* (`test-results/`, `playwright-report/`). The spec, the
config, `package.json`, and `package-lock.json` are all committed (`git ls-files` confirms). There
is no `_routes.json` excluding them from the Cloudflare Pages deploy, and Pages serves the repo
root statically. So `https://looktwice.uk/tests/nav-floating-bar.spec.js`, `/playwright.config.js`,
`/package.json`, and `/package-lock.json` are publicly fetchable.

No secrets leak, so this is not a security blocker, but it contradicts the stated "never shipped"
goal and adds dead weight to the deployed surface.

**Fix:** Add a Cloudflare Pages `_routes.json` (or move dev files under a directory excluded from
deploy) so test tooling is not served. Example `_routes.json`:

```json
{ "version": 1, "include": ["/*"], "exclude": ["/tests/*", "/playwright.config.js", "/package.json", "/package-lock.json"] }
```

### WR-02: Resize updates the threshold but never re-evaluates the bar's visible state

**File:** `js/main.js:23-25`
**Issue:**
On resize, `threshold` is recomputed but `onScroll()` is not called. If the viewport resizes (or
the on-screen keyboard / address bar changes `hero.offsetHeight`) such that the current `scrollY`
crosses the new threshold without a scroll event firing, the bar's `--visible` class and
`aria-hidden` go stale until the next scroll. On mobile, rotating the device past the hero is a
realistic trigger.

**Fix:**
```js
window.addEventListener('resize', () => {
  threshold = getThreshold();
  onScroll();
}, { passive: true });
```

### WR-03: Open mobile menu has no outside-click or scroll dismissal

**File:** `js/main.js:79-92`
**Issue:**
The menu closes on burger click, pill click, and Escape. It does not close when the user taps
outside the menu or scrolls the page. A mobile user who opens the burger then taps the page body
or scrolls is left with an open menu and (per CR-01/CR-02) focus potentially on an off-screen
pill. This is a usability and focus-management gap, not just polish.

**Fix:** Add a `pointerdown` listener on `document` that closes the menu when the target is
outside `.floating-bar__nav`, and optionally close on scroll:

```js
document.addEventListener('pointerdown', (e) => {
  if (burger.getAttribute('aria-expanded') === 'true' && !bar.contains(e.target)) closeMenu();
});
```

### WR-04: `closeMenu()` always steals focus to the burger, even on programmatic/auto-close

**File:** `js/main.js:72-77, 84-86`
**Issue:**
`closeMenu()` unconditionally calls `burger.focus()`. That is correct for Escape (return focus to
the trigger). But it also runs on pill click: the user activates a pill (an in-page `#approach`
anchor), and on the same click `closeMenu()` yanks focus back to the burger. The intended jump
target receives navigation but focus lands on the burger, so a keyboard user's next Tab continues
from the burger, not the destination section. If suppression/outside-click later call `closeMenu`
(see CR-02/WR-03), focus is also forced to a possibly-hidden burger.

**Fix:** Only return focus to the burger when the close was triggered by Escape (or by the burger
itself). Pass an intent flag:

```js
function closeMenu(returnFocus = false) {
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open menu');
  pills.classList.remove('floating-bar__pills--open');
  if (returnFocus) burger.focus();
}
// Escape: closeMenu(true).  Pill click / outside / suppression: closeMenu(false).
```

### WR-05: Reduced-motion `--visible` does not restore the bar's interactivity intent

**File:** `css/components.css:983-998`
**Issue:**
Under reduced motion the base `.floating-bar` is `opacity:0` and (from line 815) `pointer-events:
none`. The reduced-motion `--visible` rule (lines 990-993) restores `opacity:1` and `transform:
none` but says nothing about pointer-events. It works today only because each child re-enables
`pointer-events:auto`. That is a fragile coupling: any future child that forgets to opt back in is
dead under reduced motion but live under normal motion, an inconsistency that is easy to miss.
Combined with CR-01/CR-02, the reduced-motion path is where the focusable-ghost problem is worst,
because hidden controls sit in normal flow (no off-screen transform) rather than translated away.

**Fix:** Make the hidden/visible contract explicit on the bar itself rather than depending on every
child. If you adopt `inert` (CR-01), this resolves; otherwise set `pointer-events` on
`.floating-bar` per state instead of per child.

## Info

### IN-01: Dead CSS rule `.hero__readon` has no markup

**File:** `css/components.css:206-226`
**Issue:** `.hero__readon` is fully styled (including focus-visible) but no element with that class
exists in `index.html`. Dead rule left over from an earlier hero variant.
**Fix:** Remove the `.hero__readon` block.

### IN-02: Dead CSS rule `.work__close` has no markup

**File:** `css/components.css:457-465`
**Issue:** `.work__close` is styled but unused in the markup (the work section uses `.work__body`
and `.work__segue`). Dead rule.
**Fix:** Remove the `.work__close` block.

### IN-03: `.nav-link.active` styling has no code that applies the class

**File:** `css/components.css:51-55`, `js/main.js`
**Issue:** `.nav-link.active::after` is styled for an active/scroll-spy state, but no JS adds the
`active` class to nav links (the old scroll-state toggle was removed this phase per the file
header). The selector is harmless but misleading — it implies a scroll-spy that no longer exists.
**Fix:** Drop `.nav-link.active::after` from the selector list, or document that `active` is
reserved for future use.

### IN-04: Stale layout comment references removed `.nav-hamburger`

**File:** `css/layout.css:7-11`
**Issue:** The nav layout comment still describes owning `.nav-hamburger` visibility and a
"layout.css/components.css cascade fight." The hamburger was removed this phase, so the comment now
documents code that no longer exists and can mislead the next reader.
**Fix:** Update or remove the comment to reflect the Phase 8 in-flow nav.

---

_Reviewed: 2026-06-01T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
