---
quick_id: 260602-vg6
status: complete
description: Harden buildCutout (escape alt, fail-closed manifest) + fix watch-mode require cache
date: 2026-06-02
---

# Quick Task 260602-vg6 — Summary

Closed the two open follow-ups from the cutout work.

## Changes

- **WR-01 (buildCutout.js):** added `escapeXml()` and applied it to `alt` before it enters
  the `<title>`. Markup-injection vector closed for any future non-empty `alt`.
- **WR-02 (buildCutout.js):** image lookup now uses an explicit `CUTOUT_IMAGE_WIDTH = 960`
  and throws (`no 960px manifest entry for image: …`) when absent — no silent positional
  fallback to an arbitrary resolution.
- **Watch fix (build.js):** `loadBuildCutout()` busts the require cache each build, so
  `node build.js --watch` picks up edits to `buildCutout.js` without restarting the dev
  server (the earlier iteration papercut).

## Tests

`tests/cutout.spec.js`: updated the missing-manifest message assertion; added a fail-closed
test (image present but no 960px width → throws) and an alt-escaping test (`<script>` etc.
do not survive raw). Full suite: **305 passed, 31 skipped, 0 failed**.

## Notes

- Self-Check: PASSED.
- Remaining code-review items were Info-only (dead `loading` field, pill preset overshoot,
  a backwards smoke-test message) — not addressed; cosmetic, non-blocking.
