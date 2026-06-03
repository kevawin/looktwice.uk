---
quick_id: 260603-x5b
slug: sync-tokens-css-to-phase-13-type-scale
date: 2026-06-03
status: complete
---

# Summary: Sync css/tokens.css to the Phase 13 type scale

Implemented the type-scale follow-up from `13-CONTEXT.md` D-27. `css/tokens.css` now
matches the scale already documented in `DESIGN.md`.

## Changed (`css/tokens.css` `:root`)
- `--text-display` `clamp(3rem,7vw,5.5rem)` → `clamp(2.75rem,6vw,5rem)`
- `--text-headline` `clamp(1.75rem,3.5vw,2.75rem)` → `clamp(2rem,4vw,3rem)`
- `--text-title` `clamp(1.25rem,2vw,1.5rem)` → `clamp(1.5rem,1.5vw+1.1rem,1.875rem)`
- `--text-lead` **added** `clamp(1.25rem,1.2vw+1rem,1.5rem)`
- `--text-body` `clamp(1rem,1.5vw,1.1rem)` → `clamp(1.125rem,1vw+0.9rem,1.25rem)`
- `--text-mega` **removed** (was declared, never referenced)
- `--lh-title` `1.2` → `1.25`; `--lh-lead` **added** `1.5`

Label, spacing, radii unchanged.

## Verification
- **Live preview before/after** (homepage, 700px): body 16px → 20px, hero headline
  49px → 44px (tamed as designed), copy visibly more confident, no overflow/breakage.
- **Computed styles** confirmed: `--text-lead` present, `--text-mega` unset, `--lh-title` 1.25.
- **Build:** `npm run build` clean; `--text-mega` gone from src + `dist/`; `--text-lead` in built CSS.
- **Tests:** `npm test` → 305 passed, 31 skipped, 0 failures.

## Notes
- `dist/` is build output (gitignored, rebuilt on Cloudflare deploy) — only source
  `css/tokens.css` is committed.
- DESIGN.md frontmatter already carried this scale (Phase 13); src and contract now agree.
