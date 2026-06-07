---
phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7
reviewed: 2026-06-01T00:00:00Z
depth: standard
files_reviewed: 4
files_reviewed_list:
  - index.html
  - css/components.css
  - js/main.js
  - tests/contact-form.spec.js
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-06-01T00:00:00Z
**Depth:** standard
**Files Reviewed:** 4
**Status:** issues_found

## Summary

This phase adds a Formspree contact form: markup in `index.html`, styling in `css/components.css`, a vanilla-JS fetch handler in `js/main.js`, and a Playwright spec in `tests/contact-form.spec.js`.

The core security target is met. The status region is written with `textContent` only (never `innerHTML`), so the XSS/DOM-injection vector is closed. The honeypot guard works, validation focuses the first invalid field, and all three status strings (success, error, network) are static literals with no email address. Good work on those.

The review found one Critical issue and four Warnings. The Critical is a real D-02 violation that the test suite does not catch: Kris's email address is published in clear text in the JSON-LD block in the page head. The D-02 spec test only scans `mailto:` links and the status region, so it passes while the address ships in the page source. Warnings cover a brittle honeypot lookup that can throw, a dead `#privacy` anchor, a missing email-format guard, and an `aria-hidden` focusable input.

## Critical Issues

### CR-01: Email address published in clear text in JSON-LD (D-02 violation, not caught by tests)

**File:** `index.html:44`
**Issue:** The page rule D-02 is "no email address leaks anywhere on the page," and the form was built specifically to avoid exposing Kris's inbox. But the JSON-LD `ProfessionalService` block hardcodes `"email": "hello@looktwice.uk"` in the document head. This ships the address in plain page source, where scrapers and address-harvesting bots read structured data first. The form-based contact mechanic exists to prevent exactly this exposure.

The spec's D-02 guards do not catch it. `tests/contact-form.spec.js:171-175` only counts `a[href^="mailto:"]` elements, and `:159-165` only scans `#contact-status` text. Neither inspects the JSON-LD payload, so the suite is green while the address leaks.

**Fix:** Remove the `email` property from the JSON-LD object. `ProfessionalService` does not require it, and the contact form is the intended channel.
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Look Twice",
  ...
  "url": "https://looktwice.uk",
  "image": "https://looktwice.uk/images/kris-portrait.webp",
  "logo": "https://looktwice.uk/images/logo-looktwice.svg",
  "founder": { ... }
}
```
Then extend the D-02 guard test to fail on any address in page source, e.g. assert `(await page.content()).match(/@looktwice\.uk/)` is null, so a regression cannot slip through structured data again.

## Warnings

### WR-01: Honeypot lookup can throw and abort submission silently

**File:** `js/main.js:240`
**Issue:** `if (form.querySelector('[name="_gotcha"]').value) return;` dereferences `.value` on the query result with no null check. If the `_gotcha` input is ever removed, renamed, or stripped (ad blockers and privacy extensions do remove hidden honeypot fields), `querySelector` returns `null` and `.value` throws a TypeError. The throw happens after `e.preventDefault()` (line 237), so the form neither submits nor shows any status. The user clicks Send and nothing happens, with no feedback. This is a real failure mode, not theoretical: honeypot-stripping is common extension behaviour.

**Fix:** Read the field defensively and treat a missing field as "not a bot."
```js
const trap = form.querySelector('[name="_gotcha"]');
if (trap && trap.value) return;
```

### WR-02: `#privacy` link is a dead anchor with no target

**File:** `index.html:330`
**Issue:** The footer "Privacy policy" link is `href="#privacy"`, but no element with `id="privacy"` exists anywhere in the page (confirmed by grep). The smooth-anchor handler in `js/main.js:160-161` finds no target and falls through to default browser behaviour, which for a missing fragment does nothing. A visitor who clicks "Privacy policy" gets no response. Given the form collects name, email, and free-text business detail, a non-functioning privacy link is both a UX defect and a data-protection concern.

**Fix:** Either point the link at a real privacy section/page, or remove the link until the privacy content exists. Do not ship a contact form that gathers personal data behind a broken privacy link.

### WR-03: No email-format validation before submit

**File:** `js/main.js:243-248`
**Issue:** Validation relies solely on the `:invalid` CSS pseudo-class via `form.querySelector(':invalid')`. For `type="email"`, browsers do flag malformed input as `:invalid`, so a truly empty or clearly broken value is caught. But the handler then sends whatever passed to Formspree without confirming the email is plausibly deliverable. More importantly, the success message ("I'll be in touch within one working day") is shown on any `res.ok`, even if the visitor mistyped their address and Kris can never reply. The user believes contact succeeded when it may not have.

**Fix:** This is acceptable for V1 if intentional, but at minimum confirm the `type="email"` constraint is the only gate you intend. Consider trimming whitespace from the email before submit, since a leading/trailing space can pass `:invalid` in some engines yet break delivery. If V1 accepts browser-native email validation only, document that decision so it is not mistaken for a gap.

### WR-04: Honeypot input is `aria-hidden` yet remains focusable and submittable

**File:** `index.html:269-274`
**Issue:** The `_gotcha` field sets `aria-hidden="true"` and `tabindex="-1"` with `style="display:none"`. The `display:none` removes it from both the layout and the tab order, so `tabindex="-1"` and `aria-hidden` are belt-and-braces and harmless here. The real concern is consistency with the guard: the field is a text input with no `autocomplete` issue, but it is still part of `FormData` and is sent to Formspree on a real (non-bot) submit as an empty `_gotcha=` pair. That is the intended Formspree `_gotcha` convention, so it is fine, but pair it with the WR-01 fix so the guard never throws. No separate code change required beyond WR-01; flagged so the reviewer confirms the `aria-hidden`/`display:none` combination is deliberate and not a leftover from an earlier visually-hidden approach.

**Fix:** Keep `display:none` (it fully hides and de-focuses the field). Confirm the field is intentionally included in the POST payload per Formspree's `_gotcha` spec. No markup change needed if so.

## Info

### IN-01: Success state hides the form with no way back

**File:** `js/main.js:260-263`
**Issue:** On success the handler calls `form.reset()` then `form.hidden = true` and shows the thank-you text. If the visitor wants to send a second message (or realises they mistyped), there is no path to restore the form without a full page reload. For a single-contact V1 this is likely intended, but worth a deliberate decision.
**Fix:** Acceptable for V1. If a "send another" affordance is wanted later, re-show the form on a button click.

### IN-02: Resize handler calls `onScroll` before it may feel intuitive, but ordering is fine

**File:** `js/main.js:39-45`
**Issue:** `onScroll` is referenced inside the resize listener (line 44) before its `const` declaration at line 70. This works because the resize callback runs at event time, after the whole IIFE has executed and `onScroll` is initialised. No bug, but the forward reference reads as a hoisting hazard to future maintainers.
**Fix:** Optional. A short comment noting the callback fires post-init, or moving `onScroll`'s definition above the resize listener, removes the double-take.

### IN-03: Test asserts only non-empty status, not the expected copy

**File:** `tests/contact-form.spec.js:76,105,157`
**Issue:** The happy-path, validation, and error tests assert `not.toBeEmpty()` on `#contact-status` rather than checking the actual message. A regression that swaps the success string for the error string (or vice versa) would still pass. The error test does add `@`/`mailto` negative guards, which is good, but the positive content is unverified.
**Fix:** Assert the expected substring, e.g. `await expect(page.locator('#contact-status')).toContainText('be in touch')` for the happy path and `toContainText('required fields')` for validation. Keeps the D-02 negative guards as-is.

---

_Reviewed: 2026-06-01T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
