---
phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7
verified: 2026-06-01T00:00:00Z
status: human_needed
score: 9/9 must-haves verified
overrides_applied: 0
re_verification: false
human_verification:
  - test: "Keyboard walk of the contact form"
    expected: "Tab into the form, fill it, submit — visible white focus ring on every input and the Send button. Success message announced via screen reader. No visible focus loss between fields."
    why_human: "CSS focus ring rendering and screen reader announcement cannot be verified by grep. WCAG AA keyboard flow requires a real browser + keyboard."
  - test: "Form renders correctly on Deep Teal surface"
    expected: "White-fill inputs, white labels, white privacy note at reduced opacity, Send button visually distinct. No mid-tone greys. No shadows."
    why_human: "Visual correctness on the coloured surface requires a browser rendering check. Grep verifies token names, not their resolved colours."
  - test: "Hero CTA and floating-bar CTA scroll to the form"
    expected: "Clicking 'Free 30-min chat' (hero) and 'Free 30-min chat' (floating bar) both scroll to the contact section and the form is visible."
    why_human: "Anchor scroll behaviour requires a live browser. Both href='#contact' values are confirmed in source, but the visual scroll target needs a real page render."
---

# Phase 10: Contact Mechanic — Form vs Email Verification Report

**Phase Goal:** Replace the mailto: contact with a working, accessible Formspree contact form. Build form-only contact (name, email, message), remove ALL visible mailto links and the visible email address (D-02), wire a vanilla-JS fetch submit to the real Formspree endpoint (https://formspree.io/f/xbdbnrkr) with honeypot spam protection and the verbatim data-use note, and reverse the CLAUDE.md + STATE mailto lock.
**Verified:** 2026-06-01
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visitor sees contact form (name, email, message) on Deep Teal surface — no mailto button, no visible email address | VERIFIED | `grep -c 'mailto:' index.html` = 0; form at index.html:261-312 with three labelled fields; `hello@looktwice.uk` absent from source |
| 2 | Submitting valid fields POSTs to Formspree via fetch with inline success, no page reload | VERIFIED | `initContactForm` in js/main.js:231-275; `fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' } })` at line 255-259; `form.hidden = true` + `status.textContent` on res.ok |
| 3 | Failed submit shows inline error message containing NO email address (D-02) | VERIFIED | `grep -c 'hello@looktwice' js/main.js` = 0; error strings at lines 268, 272 contain no `@` or `mailto`; Playwright error-state test asserts `/@/` and `/mailto/i` are absent |
| 4 | Empty required fields block submit, announce via aria-live, focus moves to first invalid field | VERIFIED | `form.querySelector(':invalid')` + `.focus()` + `status.textContent` at js/main.js:245-250; `aria-live="polite"` aria-atomic on `#contact-status` at index.html:255-259 |
| 5 | Every field has a real `<label>`; inputs and submit button show white focus ring on keyboard focus | VERIFIED (automated portion) | Three `<label class="contact__label" for="...">` at index.html:276, 287, 298 matching ids contact-name, contact-email, contact-message; `.contact__input:focus-visible { outline: 2px solid var(--color-true-white); outline-offset: 4px }` at css/components.css:718-722. Visual ring rendering: human check required |
| 6 | CLAUDE.md states V1 contact rule: Formspree form, no visible mailto — mailto lock reversed | VERIFIED | CLAUDE.md line 19: Contact bullet naming endpoint `https://formspree.io/f/xbdbnrkr`, D-01/D-02 reversal, date 2026-06-01 |
| 7 | STATE.md mailto lock reversed and reversal + rationale recorded | VERIFIED | STATE.md line 74: "V1 contact = Formspree form (reversed 2026-06-01: D-01/D-02 in Phase 10 context; mailto removed entirely per D-02)"; old "Email link (mailto:) in V1, no form" line absent |
| 8 | Playwright spec covers happy path, required-field validation, honeypot, success + error states with mocked Formspree | VERIFIED | tests/contact-form.spec.js: 6 tests — happy path (line 59), validation (85), honeypot (115), error state (143), D-02 global guard (171), D-02 source guard (180); `page.route('**/formspree.io/**')` intercepts all traffic at lines 45, 87, 117 |
| 9 | JSON-LD email leak removed (D-02 post-review fix) | VERIFIED | `grep '"email"' index.html` returns only form input attributes (type/name/autocomplete="email") — no schema.org `"email":` key in the ld+json block; D-02 source guard test in spec (line 180) asserts `/"email"\s*:/` absent from page source |

**Score:** 9/9 truths verified

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `index.html` | Form markup in .contact__intro — aria-live status, honeypot, 3 labelled fields, privacy note, submit | VERIFIED | Lines 255-312; action="https://formspree.io/f/xbdbnrkr"; honeypot at line 268 with tabindex="-1" aria-hidden="true" style="display:none" |
| `css/components.css` | Form input/label/status/privacy styling on Deep Teal — white fill, white focus rings, no shadows, no weight 500 | VERIFIED | Rules at lines 680-758: .contact__form, .contact__field, .contact__label, .contact__input, .contact__input--textarea, .contact__privacy, .contact__status, .contact__submit; `font-weight: 500` count = 0; no `box-shadow` in contact__input block; `background: var(--color-true-white)`; reduced-motion at line 754 |
| `js/main.js` | initContactForm IIFE — fetch AJAX submit, validation, honeypot guard, textContent rendering | VERIFIED | IIFE at lines 231-275; early-return guard at line 234; `addEventListener('submit')` at line 236; honeypot null-guard at lines 241-242; `innerHTML` count = 0 |
| `CLAUDE.md` | V1 contact rule citing Formspree endpoint and D-01/D-02 reversal | VERIFIED | Line 19 in Constraints block |
| `.planning/STATE.md` | Decision-reversal entry replacing the old mailto line | VERIFIED | Line 74; old line absent |
| `tests/contact-form.spec.js` | Playwright E2E coverage with page.route mocked Formspree endpoint | VERIFIED | File exists; 6 tests; page.route used at lines 45, 87, 117; no real POST sent |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `js/main.js initContactForm` | Formspree endpoint | `fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' } })` | WIRED | js/main.js line 255-259; `form.action` resolves to the index.html `action="https://formspree.io/f/xbdbnrkr"` attribute |
| `form#contact-form` | `#contact-status` | aria-live region updated via `status.textContent` on submit result | WIRED | `#contact-status` has `role="status" aria-live="polite" aria-atomic="true"`; js/main.js lines 248, 265, 268, 272 all write to `status.textContent` |
| `tests/contact-form.spec.js` | Formspree endpoint (mocked) | `page.route('**/formspree.io/**')` fulfills locally | WIRED | Lines 45, 87, 117; no real POST; three test variants (200, 500, no-call) |

---

### Data-Flow Trace (Level 4)

The contact form does not render dynamic data from a server — it is a submit-only form. Data flows out (user input to Formspree) rather than in. No DB query or store read to trace. Level 4 N/A for this artifact type.

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| No mailto anywhere in index.html | `grep -c 'mailto:' index.html` | 0 | PASS |
| Formspree endpoint in form action | `grep -q 'https://formspree.io/f/xbdbnrkr' index.html` | found | PASS |
| No innerHTML in main.js | `grep -c 'innerHTML' js/main.js` | 0 | PASS |
| No email address in main.js strings | `grep -c 'hello@looktwice' js/main.js` | 0 | PASS |
| No font-weight: 500 in components.css | `grep -c 'font-weight: 500' css/components.css` | 0 | PASS |
| No JSON-LD email field in index.html | `grep '"email"' index.html` (filtered) | only form input attrs remain | PASS |
| STATE.md reversal line present | `grep -qi 'reversed' .planning/STATE.md` | found at line 74 | PASS |
| CLAUDE.md endpoint present | `grep -q 'formspree.io/f/xbdbnrkr' CLAUDE.md` | found at line 19 | PASS |
| Honeypot null-guard in main.js | `grep -n '_gotcha' js/main.js` | `const trap = ...; if (trap && trap.value)` at lines 241-242 | PASS |
| form.hidden set on success | `grep -n 'form.hidden' js/main.js` | `form.hidden = true` at line 263 | PASS |
| Focus on first invalid field | `grep -n ':invalid' js/main.js` | `form.querySelector(':invalid'); invalid.focus()` at lines 245-247 | PASS |
| page.route intercept in spec | `grep -c 'page.route' tests/contact-form.spec.js` | 3 uses | PASS |
| D-02 source guard test exists | `grep -c 'D-02 source guard' tests/contact-form.spec.js` | 1 | PASS |
| Hero + floating-bar CTA = #contact | `grep -n 'href="#contact"' index.html` | lines 108, 336 | PASS |

---

### Probe Execution

Step 7c: No probe scripts declared in either PLAN. The Playwright spec is the automated gate. The note in the prompt confirms the full suite passes (131 passed, 0 failed), which includes this spec's 6 tests across 3 viewport projects = 18 assertions plus the 2 viewport-scoped single-project tests.

---

### Requirements Coverage

Phase 10 carries no formal REQ IDs. The requirements it affects are:

| Area | Original Requirement | Phase 10 Disposition |
|------|---------------------|----------------------|
| CONT-03 | CTA button with `href="mailto:"` | Superseded — D-01/D-02 reversal; form replaces mailto |
| CONT-04 | Static prompts beneath button, no form | Superseded — prompts moved to message textarea placeholder |
| FOOT-03 | Footer right col includes mailto link | Superseded — D-02; mailto `<li>` removed; LinkedIn + Privacy + copyright remain |
| SEO-02 | JSON-LD includes "email" field | Superseded — D-02 post-review fix removed the "email" key from schema.org block |

These four V1 requirements were satisfied by prior phases under their original spec. Phase 10 deliberately overrides CONT-03, CONT-04, FOOT-03, and partially SEO-02. The override is legitimate (D-01/D-02 locked decisions), documented in CLAUDE.md and STATE.md, and covered by the Playwright D-02 source guard test.

---

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| No blockers found | — | — | — | — |

Scanned for: TBD/FIXME/XXX markers, placeholder text, return null/[]/{}, innerHTML, hardcoded empty props, console.log-only implementations. None found in the phase-modified files (index.html, css/components.css, js/main.js, CLAUDE.md, .planning/STATE.md, tests/contact-form.spec.js).

The privacy note on index.html line 308 reads: `I won't add you a newsletter` — this matches the D-07 verbatim locked wording exactly (no "to" before "newsletter"). Not a stub; it is the confirmed decision text.

---

### Human Verification Required

#### 1. Keyboard walk of the contact form

**Test:** On a real browser, Tab through the contact form from the first input to the Send button. Fill all three fields and submit.
**Expected:** White focus ring visible on each input and the Send button while focused. After submit, success message appears in the status region and is announced by a screen reader (or audible with OS accessibility features). No focus lost mid-flow.
**Why human:** CSS `outline` rendering and screen reader announcement require a live browser. grep confirms the CSS rule and `aria-live="polite"` are present, but whether the ring is visually sufficient at the Deep Teal contrast level and whether the announcement fires correctly cannot be verified programmatically.

#### 2. Form renders correctly on Deep Teal surface

**Test:** View the contact section in a browser. Check that inputs are white-fill, labels are white, the privacy note is visible (slightly dimmed), and the Send button is the same style as other on-teal buttons.
**Expected:** No mid-tone grey backgrounds. No card shadows. White fill inputs with Midnight text inside. White labels. Privacy note slightly dimmed (opacity 0.85). No gradient on the form itself.
**Why human:** Token values (`var(--color-true-white)`, `var(--color-midnight)`) are used correctly per source, but whether the computed colours pass WCAG AA at the rendered size, and whether there are any unexpected overrides from inheritance, requires a browser rendering check.

#### 3. Hero CTA and floating-bar CTA scroll to the form

**Test:** Tap or click "Free 30-min chat" in the hero and in the floating bar.
**Expected:** Page scrolls smoothly to the contact section and the form is immediately visible.
**Why human:** Both `href="#contact"` attributes are confirmed in source. The anchor resolves to `<section id="contact">` which contains the form. Whether the scroll target lands with the form visible (not obscured by the floating bar or cropped on mobile) requires a real browser at representative viewports.

---

### Gaps Summary

No gaps. All 9 must-have truths are verified against the actual codebase.

The three human verification items are standard end-of-phase accessibility + visual confirmation checks. They do not indicate missing implementation — they confirm that the implementation works in a real browser at WCAG AA quality.

The note about the post-review fixes is confirmed: the JSON-LD email key is absent from `index.html` (only form input attributes remain with type/name/autocomplete="email"), and the honeypot null-guard `if (trap && trap.value)` is present in `js/main.js` at lines 241-242. Both fixes hold.

---

_Verified: 2026-06-01_
_Verifier: Claude (gsd-verifier)_
