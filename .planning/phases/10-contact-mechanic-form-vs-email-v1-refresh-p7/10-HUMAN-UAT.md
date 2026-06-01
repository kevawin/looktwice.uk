---
status: partial
phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7
source: [10-VERIFICATION.md]
started: 2026-06-01T20:26:14Z
updated: 2026-06-01T20:26:14Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Keyboard + screen reader walk of the contact form
expected: Tabbing through name, email, message, and Send shows a visible white focus ring on each. A screen reader announces the aria-live status region when a success or error message appears. Submitting an empty form moves focus to the first empty field and announces the validation message. (Focus-ring CSS and focus-first-invalid logic are already verified in code; this item confirms the live screen-reader announcement, which only a human can hear.)
result: [pending]

### 2. Visual render on the Deep Teal surface
expected: The form sits on the Deep Teal #contact surface with white-fill inputs, Midnight text, the verbatim privacy note, and a Send button. No mid-tone greys, no card shadows, no gradients. Reads as clean and on-brand on a real phone screen.
result: [pending]

### 3. CTA scroll to the form
expected: The hero "Free 30-min chat" CTA and the floating-bar CTA both scroll smoothly to the contact form (#contact). No #hash left in the URL. (The floating-bar scroll is already covered by the nav Playwright spec; this confirms the real-device feel.)
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
