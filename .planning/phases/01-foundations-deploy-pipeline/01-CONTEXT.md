# Phase 1: Foundations & Deploy Pipeline - Context

**Gathered:** 2026-04-29
**Status:** Ready for planning

<domain>
## Phase Boundary

A semantic, token-driven page shell ships from `new-site` to a Cloudflare Pages preview URL on every push, with a working sticky top nav (transparent → Linen on scroll) and mobile hamburger overlay. Foundation only — every later phase populates a section onto this shell.

In scope: file scaffold, design tokens CSS, base reset/typography, self-hosted Epilogue, semantic `<main>`/`<section>`/`<nav>`/`<footer>` shell, sticky nav behaviour, Cloudflare Pages deploy pipeline.

Out of scope: any section's visual content (Phases 2–4), responsive verification (Phase 5), accessibility audit (Phase 5), performance audit (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Holding page handover
- **D-01:** `main` branch is untouched and continues serving the existing holding page (`index.html` with DM Sans + Syne + warm gradient) until cutover. On `new-site`, Phase 1 overwrites `index.html` with the new shell. The holding page is preserved only on `main`. No `holding.html` copy on `new-site`.
- **D-02:** Cutover (DEPLOY-03, Phase 5) is the only moment `main` is touched.

### Font hosting
- **D-03:** Self-host Epilogue 400 and 700 as woff2 in `fonts/`. Use `@font-face` with `font-display: swap`. No Google Fonts request, no `preconnect` to fonts.googleapis.com / fonts.gstatic.com. Removes external DNS lookup, helps PERF budget, keeps domain self-contained.
- **D-04:** Source files: download Epilogue from Google Fonts repo or fontsource. Subset to Latin if straightforward; otherwise ship full character set (still under budget).

### CSS file structure
- **D-05:** Vanilla CSS only. No Tailwind, no preprocessor, no PostCSS, no build step. (Tailwind explicitly rejected — would force npm + bundler or 100KB+ CDN runtime, breaks PERF budget and FOUND-02.)
- **D-06:** Five-file split per ARCHITECTURE.md: `css/tokens.css`, `css/base.css`, `css/layout.css`, `css/components.css`, `css/animations.css`. Loaded via separate `<link>` tags in `index.html` head, in that order (tokens → base → layout → components → animations).

### Cloudflare Pages wiring
- **D-07:** Cloudflare Pages is already connected to the GitHub repo and auto-deploys on push to `new-site`. No CI/CD code needed in the repo for the pipeline itself.
- **D-08:** Commit Pages config files to the repo (source of truth): `_headers` for cache + security headers, `_redirects` if needed. No `wrangler.toml` (not using Workers in V1). Phase 1 task: define minimal `_headers` (font caching, basic security headers) — leave room for Phase 5 to harden.
- **D-09:** Verify the auto-deploy by pushing the Phase 1 shell and confirming the Pages preview URL serves it. Capture the preview URL in STATE.md so later phases reference one stable URL.

### Section anchor list
- **D-10:** **Six** `<section>` blocks, not eight. HOMEPAGE-SPEC is the source of truth on this. Section ids in document order:
  1. `#hero`
  2. `#situation`
  3. `#approach`
  4. `#work`
  5. `#services`
  6. `#contact`
- **D-11:** ROADMAP.md Phase 1 success criterion #2 ("eight empty `<section>` anchors") and REQUIREMENTS.md FOUND-05 ("eight `<section>` blocks") are stale and need correcting to "six" as part of Phase 1 work — small doc-fix subtask included in plan.
- **D-12:** Nav links (per HOMEPAGE-SPEC + NAV-02): three only — WORK / APPROACH / CONTACT — anchoring to `#work`, `#approach`, `#contact`. Situation and Services sections are not in nav (visitor scrolls into them).

### Phase 1 preview content
- **D-13:** Section bodies stay empty in Phase 1. Each `<section id="...">` is a bare anchor only — no placeholder copy, no "PHASE 2 GOES HERE" labels, no h2 stubs. Preview is not reviewed visually until Phase 2 lands the hero.
- **D-14:** Exception: `<nav>` is fully built (sticky behaviour + mobile hamburger overlay) and `<footer>` may carry minimal placeholder so the page has visible bottom edge — leave to planner. Below-the-hero sections collapse to zero height in Phase 1, that's fine.

### Claude's Discretion
- CSS reset choice (modern minimal — Andy Bell style — vs hand-roll). Both fit FOUND-03; planner picks.
- Exact `_headers` rules for Phase 1 (cache-control durations, etc.). Phase 5 hardens.
- Whether to subset Epilogue woff2 to Latin or ship full character set.
- Hamburger icon: SVG inline vs CSS-drawn lines. Trivial.
- Where the favicon comes from in Phase 1 (placeholder ok, real one for Phase 5).

### Folded Todos
None — no pending todos matched Phase 1.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project specs (root, source of truth — do NOT modify)
- `PRODUCT.md` — audience, voice, brand personality
- `DESIGN.md` — full design system reference
- `DESIGN.json` — design system in machine-readable form
- `DESIGN_NOTES.md` — supplementary design rationale

### Phase-1 implementation specs
- `.planning/seeds/ARCHITECTURE.md` — file structure, hosting, JS spec, V1 vs V2 boundary, accessibility checklist, "what GSD should NOT do" list
- `.planning/seeds/DESIGN-TOKENS.md` — every CSS custom property (OKLCH colours, type scale, spacing, radii, shadows, transitions), nav + sticky-tab + scroll-reveal component CSS, design bans
- `.planning/seeds/HOMEPAGE-SPEC.md` §1 (Navigation) — sticky behaviour, mobile overlay spec, exact nav link list (WORK/APPROACH/CONTACT)
- `.planning/seeds/HOMEPAGE-SPEC.md` Page Structure — authoritative six-section anchor list

### Requirements + roadmap
- `.planning/REQUIREMENTS.md` — FOUND-01 through FOUND-05, NAV-01 through NAV-05, DEPLOY-01, DEPLOY-02 (Phase 1 scope)
- `.planning/ROADMAP.md` Phase 1 — success criteria (note: SC#2 says "eight sections" — Phase 1 corrects to six per D-11)

### Existing artefacts to be aware of
- `index.html` (current, on `new-site`) — holding page; will be overwritten by Phase 1 shell. Same file on `main` stays untouched.
- `inspo/temp headshot.jpeg` — temp Kris portrait (for Phase 2, not Phase 1)

### CLAUDE.md
- `CLAUDE.md` (root) — project constraints, design bans, GSD workflow enforcement

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None. Repo is bare except for the holding `index.html`. Phase 1 creates the entire `css/`, `js/`, `fonts/`, `images/` tree from scratch.

### Established Patterns
- None yet. Phase 1 establishes the patterns every later phase follows:
  - CSS organisation (5-file split)
  - Token consumption (`var(--token-name)`, never hard-coded values)
  - Component-class naming (BEM-ish, lowercase-hyphen — `.nav`, `.nav-link`, `.nav-link--active`)
  - JS pattern: classList toggles + IntersectionObserver, `{ passive: true }` listeners

### Integration Points
- `index.html` `<head>`: link order is `tokens → base → layout → components → animations` so cascade resolves correctly.
- `index.html` `<body>`: `<nav>` (Phase 1), `<main>` containing six anchored `<section>` (Phase 1 shell, populated Phases 2–4), `<footer>` (Phase 1 minimal, populated Phase 4), `.sticky-tab` placeholder (Phase 4 wires).
- `js/main.js`: Phase 1 ships only the nav scroll-state toggle (NAV-01). Sticky-tab entrance + scroll-reveal observers land in Phases 4 + 2 respectively, but the file exists from Phase 1 so later phases append.

### Constraints the existing setup imposes
- Holding `index.html` on `main` cannot be touched. Cloudflare Pages must continue serving it from `main` until cutover.
- Cloudflare Pages auto-deploys both branches: `main` → production domain, `new-site` → preview URL. Confirm preview is wired separately from production before pushing the shell.

</code_context>

<specifics>
## Specific Ideas

- Self-hosted Epilogue is a deliberate PERF win, not just a preference — saves the fonts.googleapis.com + fonts.gstatic.com handshakes (two DNS + two TLS) on cold load. Worth the ~50KB of woff2 in the bundle.
- The five-CSS-file split is kept (despite single-page scope) because each later phase touches a predictable file: Phase 2 → `components.css` + `animations.css`, Phase 4 → `components.css` (sticky tab + buttons), Phase 5 → all of them for hardening. Single-file would mean every phase edits the same 1000-line file.
- Six sections, not eight — confirmed against HOMEPAGE-SPEC. Doc-fix to ROADMAP + REQUIREMENTS is part of Phase 1's deliverable so downstream phases don't trip over it.
- "Empty sections, no labels" matches the constraint that nothing visual is reviewed until Phase 2. Avoids labelled stubs becoming accidental design fixtures.

</specifics>

<deferred>
## Deferred Ideas

- `_headers` hardening (HSTS, CSP, etc.) — Phase 5 scope (security pass alongside SEO + a11y).
- Favicon + apple-touch-icon — Phase 5 (SEO-03).
- `robots.txt`, JSON-LD ProfessionalService schema, og: meta — Phase 5 (SEO-01..03).
- Performance + Lighthouse verification — Phase 5 (PERF-01..04).
- Sticky tab CSS + JS — Phase 4 (TAB-01..07, JS-03). File `js/main.js` exists from Phase 1 but tab logic is appended in Phase 4.

### Reviewed Todos (not folded)
None — `gsd-tools todo match-phase 1` returned no matches.

</deferred>

---

*Phase: 01-foundations-deploy-pipeline*
*Context gathered: 2026-04-29*
