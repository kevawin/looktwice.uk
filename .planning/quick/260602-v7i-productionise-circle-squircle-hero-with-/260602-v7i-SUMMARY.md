---
quick_id: 260602-v7i
status: complete
description: Productionise circle+squircle hero with focal-point + multi-shape cutout support
date: 2026-06-02
---

# Quick Task 260602-v7i — Summary

Promoted the experimental focal-point cutout work to the real hero.

## What changed

- **Hero shapes (buildCutout.js):** two triangles → a circle (left, over the barista) + a
  squircle (right, over the centre woman + seated customers). Squircle `rx = 83` = the
  triangles' corner-curve setback, so the rounding matches. Position unchanged (right of
  text on desktop, below on mobile — same `.hero__cutouts` container, same `0 0 1000 519.6`
  viewBox).
- **Focal point (buildCutout.js):** `buildSvgString` now supports `config.focus = {x, y}`
  (CSS `object-position`-style fractions). It scales the image to cover the viewBox and
  offsets it by `(box − image) × focus`, falling back to centred `xMidYMid slice` when
  `focus` is absent. The hero uses `focus: {x:0.5, y:0.66}` to lift the people up out of
  the portrait photo into the wide hero band.
- **Manifest aspect (build.js):** each manifest entry now carries `h` (intrinsic height,
  from sharp metadata) so the focal-point cover maths knows the image aspect.
- **Multi-shape:** already supported (shapes array maps into one mask); now documented and
  tested. N shapes share one `<image>` (D-09 preserved).
- **Cleanup:** throwaway proof sections removed from index.html; temp Unsplash images deleted.

## Tests

`tests/cutout.spec.js` (+ fixture `h`): unit tests for focus cover geometry, the no-focus
slice fallback, focus.y offset, and multi-shape masks; build-output assertion that the hero
is a circle + `rx="83"` squircle with a focus-positioned image. Cutout spec 105 passed.
Full suite: **299 passed, 31 skipped, 0 failed**.

## Docs

CLAUDE.md "Cutout primitive" section gained a "Composing a cutout (multi-shape + focus)"
subsection: the shapes array, `focus: {x,y}`, the per-cutout (not per-shape) focus rule,
and the "ask Claude to read the image for coordinates" workflow.

## Notes

- Self-Check: PASSED.
- The earlier code-review warnings (WR-01 unescaped `alt`, WR-02 manifest fallback) remain
  open as a separate flagged task — not in scope here.
