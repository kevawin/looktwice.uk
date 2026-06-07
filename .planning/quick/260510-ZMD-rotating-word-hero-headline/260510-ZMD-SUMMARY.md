---
quick_id: 260510-ZMD
slug: rotating-word-hero-headline
status: complete
date: 2026-05-10
---

# Summary: Rotating-word hero headline

## What was done

Three-file change to replace the static hero H1 with a slot-machine rotating-word headline.

**index.html** — H1 text replaced with "Improve the return on your investment in [word]". A `.word-roller` span wraps the rotating word, with `aria-live="polite"` and `aria-atomic="true"`. "acquisition" is the no-JS fallback text node.

**css/animations.css** — Word-roller CSS appended. Container: `inline-block`, `overflow: hidden`, `height: 1em`, `vertical-align: bottom`. Words: `position: absolute`, default `translateY(120%)` (below), transition to `translateY(0%)` when `--active`, `translateY(-120%)` when `--exiting`. Accent colour: `var(--color-warm-amber)`. Sizer span: `visibility: hidden`, `inline-block`, `aria-hidden`. Reduced-motion guard disables transitions.

**js/main.js** — `initWordRoller` IIFE appended. Builds 8 word spans + 1 sizer from JS array. Checks `prefers-reduced-motion` before starting the 2200ms interval — frozen on first word if true. Tick handler: remove `--active`/add `--exiting` on current, add `--active` on next, remove `--exiting` after 700ms.

## Verified

- Animation running in preview: warm amber italic word cycling correctly
- Container sizing to widest word (no layout shift)
- 9 DOM children (8 words + sizer) confirmed via eval
- `rgb(245, 147, 0)` colour confirmed on active word
- `inline-block` display confirmed on container
- No JS errors in console
