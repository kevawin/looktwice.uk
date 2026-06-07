---
status: partial
phase: 02-hero-situation
source: [02-VERIFICATION.md]
started: 2026-04-30T00:00:00Z
updated: 2026-04-30T00:00:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Visual check on Cloudflare Pages preview
expected: Hot Pink hero fills viewport at min 90vh; headline + subhead + two CTAs visible immediately on load with no fade; Kris portrait renders desaturated; Midnight fallback block visible at bottom-left where supporting cutout will go.
result: [pending]

### 2. Scroll into situation, then scroll back up and back down
expected: Chip and "Sound familiar?" headline fade in together as section enters; blocks 01–05 stagger in 80ms apart; once revealed they stay visible (no re-trigger on scroll-back).
result: [pending]

### 3. Toggle DevTools 'Emulate prefers-reduced-motion: reduce' and refresh
expected: Reveal still happens but is opacity-only — no vertical translateY motion.
result: [pending]

### 4. Tab through hero with keyboard
expected: BOOK A SESSION shows Hot-Pink-on-Midnight focus state; SEE THE WORK shows White outline ring (focus-ring exception per UI-SPEC) — both visibly distinct from non-focus.
result: [pending]

### 5. Resize from 1440px down through 1024, 768, 640, 375
expected: Hero stacks at ≤768px (cutout below text, buttons full-width). Situation grid shifts: ≥1025px staggered (04/05 offset down one row in col 2), 641–1024px alternating 2-column, ≤640px single column. No horizontal scroll at 375px.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
