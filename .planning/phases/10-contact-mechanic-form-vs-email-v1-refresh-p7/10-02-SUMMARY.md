---
phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7
plan: "02"
subsystem: testing
tags: [playwright, contact-form, formspree, mocking, e2e]
one_liner: "Playwright E2E coverage for the Formspree contact form using page.route mocks — no real POST reaches Kris's inbox"
dependency_graph:
  requires: [10-01]
  provides: [contact-form-playwright-spec]
  affects: [tests/contact-form.spec.js]
tech_stack:
  added: []
  patterns: [playwright-page-route-stub, commonjs-spec-style]
key_files:
  created: [tests/contact-form.spec.js]
  modified: []
decisions:
  - "task1-skip: Task 1 (CLAUDE.md + STATE.md update) was already complete from wave 1 (10-01 executor). Acceptance checks passed without any file changes; no commit made."
  - "scroll-to-form: scrollIntoView added as a helper before all interactions — the contact form is at the bottom of the page and button.contact__submit is outside the initial viewport. Without scrolling, page.click registers but the async fetch resolves to an empty status because the click races with the layout paint."
  - "not-to-be-empty: used await expect(locator).not.toBeEmpty() instead of reading textContent() directly, to correctly wait for the async status update after form submission."
metrics:
  duration: "~10 min"
  completed_date: "2026-06-01"
  tasks_completed: 2
  files_changed: 1
---

# Phase 10 Plan 02: Documentation Reconciliation + Playwright Contact Form Spec Summary

Playwright E2E coverage for the Formspree contact form using page.route mocks — no real POST reaches Kris's inbox.

## Tasks Completed

| # | Name | Status | Commit |
|---|------|--------|--------|
| 1 | Record the mailto→form reversal in CLAUDE.md and STATE.md | Skipped (already done in wave 1) | — |
| 2 | Add Playwright E2E spec for the contact form (mocked Formspree) | Complete | 7ef2e6a |

## Task 1: Already complete from wave 1

The deviation notice was accurate. Running the Task 1 automated verify:

```
grep -qi 'Formspree' CLAUDE.md && grep -q 'formspree.io/f/xbdbnrkr' CLAUDE.md && grep -qi 'reversed' .planning/STATE.md && ! grep -q 'mailto.*in V1, no form' .planning/STATE.md && ! grep -qP '\xe2\x80\x94' CLAUDE.md && echo PASS
```

Returned `PASS` with no changes needed. Task 1 commit skipped.

## Task 2: Playwright spec created

`tests/contact-form.spec.js` covers five scenarios:

1. Happy path — 200 stub, form hides, success text shows, URL stays at `/`
2. Validation — empty required field blocks fetch, status shows message, focus on first invalid field
3. Honeypot — populated `_gotcha` prevents any Formspree call
4. Error state — 500 stub, retry copy shown, asserts no `@` or `mailto` in status text (T-10-03b)
5. D-02 global guard — asserts `a[href^="mailto:"]` count is 0 on the page

All 15 assertions pass (5 tests x 3 viewport projects).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] scrollIntoView required before form interactions**
- Found during: Task 2 verification
- Issue: `button.contact__submit` is below the initial viewport. The click fired but the async fetch resolved before Playwright checked `#contact-status`, producing an empty string. The `toBeGreaterThan(0)` on a string value threw a Matcher type error.
- Fix: added `scrollToForm()` helper that calls `scrollIntoView({ behavior: 'instant' })` on `#contact-form` before any interactions. Also replaced `expect(statusText && statusText.trim().length).toBeGreaterThan(0)` with `await expect(page.locator('#contact-status')).not.toBeEmpty()` to correctly wait for the async aria-live update.
- Files modified: tests/contact-form.spec.js
- Commit: 7ef2e6a (included in same commit — fix was part of the initial authoring cycle before the final commit)

## Threat Surface Scan

No new network endpoints, auth paths, or schema changes introduced. The spec is dev-only; it adds test coverage of the existing form, not new application surface.

## Self-Check: PASSED

- tests/contact-form.spec.js exists: FOUND
- Commit 7ef2e6a exists: FOUND
- `npx playwright test contact-form`: 15 passed, 0 failed
