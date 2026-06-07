# Phase 6 — Summary

**Phase:** 06-post-uat-polish
**Status:** code complete; awaiting Kris visual UAT on preview
**Date:** 2026-05-03
**Branch:** `claude/new-site-QGsb8`

## What shipped

### Brand truth
- All six accents + Midnight + Linen swapped from OKLCH approximations to exact brand hex (`tokens.css`).
  - Pink E0006E, Orange E9631A, Amber F59300, Teal 2E7C80, Purple 6C2C8C, Indigo 5556CC, Midnight 26263E, Linen F9F6F1.
- Variable names retained, so component CSS stayed clean.
- Brand gradient automatically picks up the new stops (still painted in exactly one place: the sticky tab).
- Dropped `--color-link-sage` / `--color-link-pine` (off-spec); footer hover now uses Cool Indigo.

### Bugs fixed
- **Nav cascade** (item 17): `.nav-hamburger` visibility now owned entirely by `components.css`, default `display: none`, surfaced inside `@media (max-width: 1024px)`. Hamburger no longer leaks into desktop.
- **Broken supporting cutout** (item 6): the second hero `<picture>` was 404ing on `hero-supporting.webp` and rendering its alt text in the broken-image box. Cutout markup, fallback CSS, and JS error handler all removed.

### Identity
- New logo: Kris's supplied SVG, embedded once as a `<symbol>` and rendered via `<use>` in nav + footer. `fill="currentColor"` so colour follows surface (white over Hot Pink hero / Midnight footer; Midnight when nav fills with Linen on scroll).

### Hero
- Drops "SEE THE WORK" CTA — single CTA path now.
- Layout: 60/40 grid (was 55/45) gives copy more breathing room.
- Copy: kept headline + subhead; added pitch paragraph (Kris's draft, lightly tuned, italicised "experience gap"); single `[Let's talk]` pill (white-on-pink) + "Or read on ↓" link anchored to `#situation`.
- Photo: kept the rounded-rectangle main cutout, dropped the broken supporting circle. Custom shape vocabulary deferred to V1.1 (D-6.13).
- Session length standardised to 30 minutes (was "30 to 45").

### CTA system (D-6.3)
- Pill shape, consistent with the sticky tab.
- On Linen surfaces — accent fill + white text, hover inverts to outlined accent.
  - `.btn--accent-pink`, `.btn--accent-indigo`, `.btn--accent-amber` (mix-and-match per section).
- On colour surfaces — white fill + surface-colour text, hover inverts to outlined white.
  - `.btn--on-pink`, `.btn--on-teal`.
- Focus rings: White on dark surfaces, Midnight on Linen accent buttons. Hot Pink global ring kept everywhere it works.
- Brand gradient stays sticky-tab-only (project rule honoured).

### Animation removal (D-6.5)
- All `.reveal` CSS dropped from `animations.css`.
- IntersectionObserver in `main.js` removed.
- All `.reveal` classes + `data-reveal-index` / `data-reveal-step` attributes stripped from `index.html`.
- Re-enable when content is final (V1.1 carryover).

### Eyebrow chips (D-6.4)
- Dropped from situation, work, services, contact. Section headlines now stand alone.
- `.chip` and `.chip--ghost-on-dark` CSS removed from `components.css`.

### Interrupt (item 11)
- Hierarchy flipped. "If you asked me for three words to capture how I work, I'd say:" is now Body-scale lead; **Dig. Reveal. Sharpen.** is the H2 (Display scale, 700); explainer paragraph drops to Body scale.

### Situation (D-6.8)
- Five columns at desktop (≥1280px), two columns at tablet (641-1279px), single column at mobile.
- Numbers redesigned: oversized Hot Pink Bold glyphs (clamp 2.75-4rem), sit above title, no longer Label-scale decoration.
- Body copy slightly tightened so each block fits the narrower 5-col cells.
- 5-col is a Kris-judgement prototype — easy fallback to 2-col-only if cramped.

### Work (item 12)
- Headline changed to "Twelve years finding the gap." (was "The proof is in the diagnosis." — mismatched the new bio content).
- Bio paragraph + agency mentions (TBWA\MCR, Havas Lynx, Mediacom).
- Sector list as inline Indigo Bold tags: Retail / FMCG / Healthcare / Leisure / Finance / Hospitality.
- Discipline-spanning paragraph.
- Segue line: "Want to see an example of my work and how I think?" (Indigo, Title scale).
- CTA: `[Get in touch]` Indigo-fill pill anchoring to `#contact`.

### How-I-work (D-6.9)
- Three-column grid at desktop (≥768px), single column at mobile.
- Geometric SVG icons per service (square+circle / two offset rounded rects / magnifying glass), Hot Pink stroke.
- Drop rule lines that previously separated items.
- Segue line above CTA: "If something here is your problem, the first 30 minutes are on me."
- CTA: `[Let's talk]` Hot Pink-fill pill.

### Contact / free session (D-6.10)
- Title: "What happens at our free session?" (sentence case, not all caps).
- Split layout: left = title + intro paragraphs + CTA group; right = "Tell me, when you get in touch:" + 3-item dash-bullet list.
- CTA at the bottom of the left column: `[Let's talk]` white-on-Teal pill, mailto.
- Email shown in plain underlined text below the CTA so it's still copy-paste accessible.
- Sticky tab hides while contact is in viewport (D-6.11) — IntersectionObserver in `main.js`, `--suppressed` class.

### Footer (item 16)
- Logo (currentColor → Linen on Midnight surface).
- Tagline: "Independent brand & CX strategy" (kept).
- Location added: "UK-wide, based in Manchester".
- Privacy policy link (placeholder href `#privacy`).
- LinkedIn / mailto / copyright kept.

## Files touched

- `css/tokens.css` — colour values (hex), gradient unchanged, dropped link-sage / link-pine, simplified shadow refs.
- `css/animations.css` — stripped `.reveal` + reduced-motion rules for it.
- `css/layout.css` — nav cascade fix, hero column 60/40, situation 5-col grid, services 3-col, contact split.
- `css/components.css` — full rewrite: dropped chips / ghost buttons / supporting cutout fallback; new pill CTA system + accent variants; situation decorative numbers; work bio + sector tags; services icons; contact split; footer location/privacy; sticky tab `--suppressed`.
- `js/main.js` — dropped reveal observer + supporting cutout fallback; added contact-section IntersectionObserver for sticky-tab suppression.
- `index.html` — embedded logo `<symbol>`; new nav/footer logo refs; full hero copy rewrite; dropped chips throughout; interrupt hierarchy flip; situation copy tightened; work expanded; services icons + segue; contact split layout.
- `images/logo-looktwice.svg` — new. Asset for `<img>`/`<use>` with `currentColor`.
- `.planning/phases/06-post-uat-polish/06-CONTEXT.md` — phase boundary, scope.
- `.planning/phases/06-post-uat-polish/06-DISCUSSION-LOG.md` — Kris's UAT feedback, Q&A, locked decisions.
- `.planning/STATE.md` — phase counter, status `in_progress`.
- `.planning/ROADMAP.md` — Phase 6 line added.

## Carryovers (V1.1 candidates)

- **Custom photo shape vocabulary** (deferred per Kris). Once she supplies shape refs, swap the rounded-rect main cutout for an SVG-masked composition with a "peeking through Hot Pink" effect for the portrait, plus shape variants for future image slots.
- **Real Privacy policy page** — link is a placeholder anchor.
- **Re-enable reveal animations** once final content lands; rebuild observer with the same one-shot pattern.
- **og:image asset** — markup wired, asset pending.
- **Final favicon** — placeholder lettermark in repo root.
- **Tighten CSP** — hash inline JSON-LD, drop `'unsafe-inline'` from `script-src`.
- **Phase 5 verification gate** still pending (Lighthouse + tab-walk + 375/768/1440 visual UAT) — re-run on the polished site before cutover.

## What Kris should do next

1. Once Cloudflare auto-deploys this push, open the branch preview on phone + desktop.
2. Look at the items in this Phase 6 list (esp. 5-col situation — that's the prototype to judge).
3. Reply with what works / doesn't.
4. Send shape refs for the photo cut-through whenever ready.
5. After this round, we hit the Phase 5 verification gate (Lighthouse + tab-walk) and cut over per `05-CUTOVER-PLAYBOOK.md`.
