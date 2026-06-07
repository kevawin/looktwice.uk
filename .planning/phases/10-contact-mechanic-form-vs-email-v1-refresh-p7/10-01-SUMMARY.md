---
phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7
plan: "01"
subsystem: contact-form
tags: [form, formspree, a11y, vanilla-js, accessibility, spam-protection]
dependency_graph:
  requires: []
  provides:
    - contact-form-markup
    - contact-form-css
    - contact-form-js-handler
  affects:
    - index.html
    - css/components.css
    - js/main.js
    - CLAUDE.md
    - .planning/STATE.md
tech_stack:
  added: []
  patterns:
    - Formspree AJAX fetch (Accept: application/json) with inline success/error via textContent
    - aria-live polite region for form status announcements
    - Formspree _gotcha honeypot convention
    - IIFE module pattern (matching codebase IIFE style in js/main.js)
key_files:
  created: []
  modified:
    - index.html
    - css/components.css
    - js/main.js
    - CLAUDE.md
    - .planning/STATE.md
decisions:
  - "D-01/D-02 reversal recorded in CLAUDE.md and STATE.md — V1 contact is now a Formspree form, not a mailto link"
  - "Privacy note D-07 used verbatim: no 'to' before 'newsletter'"
  - "Error fallback copy contains no email address (overrides PATTERNS.md example that included hello@looktwice.uk)"
  - "Status messages use textContent only — no innerHTML anywhere in initContactForm (T-10-01)"
metrics:
  duration: "~12 minutes"
  completed_date: "2026-06-01"
  tasks_completed: 3
  files_modified: 5
---

# Phase 10 Plan 01: Contact Form (Formspree, Vanilla JS, WCAG AA) Summary

Formspree contact form replacing the mailto mechanic — white-fill inputs on Deep Teal, AJAX fetch submit, aria-live status, honeypot, verbatim privacy note, no visible email address anywhere.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Replace mailto CTA group with form markup; remove footer email | 78712c3 | index.html |
| 2 | Style the form on the Deep Teal surface | 0142859 | css/components.css |
| 3 | Add initContactForm IIFE — fetch submit, validation, honeypot, a11y | 0ad793c | js/main.js |

## What Was Built

- `index.html` — `.contact__cta-group` (mailto button + visible email link) replaced with `form#contact-form` POSTing to `https://formspree.io/f/xbdbnrkr`. The `.contact__list-wrap` removed; its three bullet-point prompts moved into the message textarea `placeholder`. Footer mailto `<li>` removed. Hero CTA (line 109) and floating-bar CTA (line 293) untouched — both already `href="#contact"`.
- `css/components.css` — `.contact__form`, `.contact__field`, `.contact__label`, `.contact__input`, `.contact__input--textarea`, `.contact__privacy`, `.contact__status`, `.contact__submit` rules inserted after the existing `.contact__list li::before` block. White-fill inputs (`background: var(--color-true-white)`), Midnight text, no `box-shadow`, no `font-weight: 500`, white focus ring (`outline: 2px solid var(--color-true-white); outline-offset: 4px`) matching the existing teal-surface ring pattern. `@media (prefers-reduced-motion: reduce)` strips `transition` on `.contact__status`.
- `js/main.js` — `initContactForm` IIFE appended. Attaches `addEventListener('submit')` — no inline `onsubmit`. Guards: honeypot check, `:invalid` focus + aria-live announce. `fetch(form.action, { method: 'POST', headers: { 'Accept': 'application/json' } })`. On success: `form.reset()`, `form.hidden = true`, `status.textContent` set. On error/catch: generic retry copy with no email address. All status messages via `textContent` only — no `innerHTML`, no user input echoed (T-10-01).

## Decisions Made

- D-01/D-02 reversal (Jamie review + Kris decision 2026-06-01): form replaces mailto as the single contact route. CLAUDE.md Constraints updated; STATE.md decision updated.
- Error copy explicitly excludes email address — PATTERNS.md example that included `hello@looktwice.uk` as an error fallback was overridden. The plan's D-02 takes precedence.
- Privacy note used exactly as locked in D-07: "I'll only use this to arrange our free 30-minute chat. I won't add you a newsletter or sell your email address to the devil." (no "to" before "newsletter").

## Deviations from Plan

None — plan executed exactly as written. The PATTERNS.md error fallback email was pre-flagged in the plan as an override; the correct (no-email) copy was used.

## Known Stubs

None. The form POSTs to the real Formspree endpoint (`https://formspree.io/f/xbdbnrkr`, D-08). No placeholder endpoints or mock data.

## Threat Flags

None beyond the plan's documented STRIDE register (T-10-01 through T-10-SC). All `mitigate` dispositions implemented: `textContent`-only rendering (T-10-01), honeypot (T-10-02), no email in error strings (T-10-03).

## Self-Check: PASSED

- index.html modified and committed at 78712c3 — confirmed present
- css/components.css modified and committed at 0142859 — confirmed present
- js/main.js modified and committed at 0ad793c — confirmed present
- `grep -c 'mailto:' index.html` = 0
- `grep -q 'https://formspree.io/f/xbdbnrkr' index.html` — FOUND
- `grep -c 'innerHTML' js/main.js` = 0
- `grep -c 'hello@looktwice' js/main.js` = 0
- `grep -c 'font-weight: 500' css/components.css` = 0
