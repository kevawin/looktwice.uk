---
quick_id: 260510-ZMD
slug: rotating-word-hero-headline
description: Rotating-word animation on hero H1 headline
date: 2026-05-10
status: in-progress
must_haves:
  truths:
    - Hero H1 reads "Improve the return on your investment in [word]"
    - Word cycles through: acquisition, display, social, events, new hires, CRM, PPC, partnerships
    - Slot-machine animation: current word slides/fades up, next slides in from below
    - Rotating word is italic and warm amber coloured
    - Container auto-sizes to widest word (no layout shift between words)
    - prefers-reduced-motion: freezes on first word, no interval started
    - aria-live="polite" on roller span for screen reader announcements
  artifacts:
    - index.html (H1 updated, .word-roller span added)
    - css/animations.css (word-roller CSS added)
    - js/main.js (initWordRoller IIFE added)
---

# Quick Task 260510-ZMD: Rotating-word hero headline

## Task 1 — Update hero H1 in index.html

**Files:** `index.html`
**Action:** Replace hero H1 content with new copy. Static text: "Improve the return on your investment in". Add `<span class="word-roller" aria-live="polite" aria-atomic="true">acquisition</span>` immediately after. "acquisition" is the no-JS fallback visible word.
**Verify:** H1 renders correct text; `.word-roller` span present.
**Done:** index.html saved, H1 matches spec.

## Task 2 — Add word-roller CSS to animations.css

**Files:** `css/animations.css`
**Action:** Append word-roller styles. Container: inline-block, overflow hidden, height 1em, vertical-align bottom. Words: position absolute, translateY(120%) by default, transition to translateY(0%) when active, translateY(-120%) when exiting. Accent colour: var(--color-warm-amber). Sizer: visibility hidden, inline-block, aria-hidden. Reduced-motion: disable transitions.
**Verify:** CSS present in file, no syntax errors.
**Done:** animations.css saved.

## Task 3 — Add initWordRoller to main.js

**Files:** `js/main.js`
**Action:** Append `(function initWordRoller() {...})()` IIFE. Builds word spans from JS array, checks prefers-reduced-motion before starting interval (2200ms). On each tick: remove --active from current, add --exiting; add --active to next; remove --exiting after 700ms. Words: ['acquisition', 'display', 'social', 'events', 'new hires', 'CRM', 'PPC', 'partnerships']. Sizer uses 'partnerships' (longest word).
**Verify:** JS present in file, no syntax errors.
**Done:** main.js saved.
