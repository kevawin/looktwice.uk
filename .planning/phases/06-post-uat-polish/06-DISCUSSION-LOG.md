# Phase 6 — Discussion Log

**Date:** 2026-05-03
**Format:** Kris's UAT feedback (17 items + brand colour spec) + Claude's clarifying questions + locked answers.

---

## Original feedback (paraphrased)

1. Replace logo with supplied SVG. White on dark/colour, black on light.
2. Add space between logo / banner / headline line.
3. Stretch headline + subhead to a wider column.
4. Add lead-in line above hero CTAs.
5. Rename "BOOK A SESSION" → "Let's talk". Make the button a pill consistent with sticky tab. Decide: gradient or solid?
6. Dark circle over photo has weird text in it.
7. Photo shape — closer to portfolio shape; "peeking through cut-out of pink" effect.
8. Are the eyebrow pills (THE SITUATION / WORK / HOW I WORK) needed?
9. Five situations on one line at desktop, possible? More interesting numbers/headings?
10. Remove orange-banner fade-in.
11. Interrupt hierarchy wrong — "Dig. Reveal. Sharpen." should be the big header.
12. Work section sparse — add more, restyle CTA consistent with sticky.
13. How-I-work — drop rule line, more interesting layout, drop fade-in.
14. CTA consistency + segue line.
15. Free session — more interesting layout/style.
16. Footer additions?
17. Hide hamburger on desktop.

Plus: brand colour spec (exact hex) supplied separately — Pink E0006E, Orange E9631A, Amber F59300, Teal 2E7C80, Purple 6C2C8C, Indigo 5556CC, Midnight 26263E, Linen F9F6F1.

---

## Bugs Claude found while triaging

- **Item 6 root cause**: The supporting hero cutout's `<picture>` 404s (`hero-supporting.webp` was never shipped). Browser renders the alt text inside the broken-image box before the JS error handler hides it. Decision: drop the broken cutout entirely.
- **Item 17 root cause**: `layout.css` hides `.nav-hamburger` at `min-width:1025px`, but `components.css` (loaded later) declares `.nav-hamburger { display: inline-flex }` unconditionally. Equal specificity, later rule wins → hamburger visible on desktop. Decision: scope `inline-flex` inside the mobile media query.

---

## Q&A — round 1

**Q1 — Logo colour logic**: single SVG with `currentColor`, surface-driven? → **Yes**. Single asset.

**Q4 — Hero lead-in copy**: → Kris supplied:
> *"If you think your business might be at the mercy of the dreaded **experience gap**, or you're battling with a problem you can't fully see yet, I can help. I offer a free 30-min session that can help identify the underlying problem you're up against. No commitment. No pitch. Just a useful conversation."* `[Let's talk]`
> *"Or if you'd like to find out a bit more about how I can help your business, read on..."*
- "Remove the 2nd CTA button (SEE THE WORK)."
- "Split / tweak as you see fit."

**Q5 — CTA system**:
- Gradient stays sticky-tab only.
- All other CTAs = pill, consistent shape.
- On Linen surface → accent fill, white text. Mix accents per CTA.
- On colour surface → white fill, surface-colour text ("transparent" font reading as the surface colour through the white pill).
- Hover: invert to outlined-pill with matching accent outline + text.

**Q7 — Photo shapes**: → "Skip this — do all else and remind me about this later." Kris will supply shape refs post-Phase 6. For Phase 6: keep main portrait as rounded-rect, drop broken supporting cutout.

**Q8 — Eyebrow chips**: → "Drop them. Confusing on a single-page site. Will be repetitive on a multi-page version (which would have a menu)."

**Q9 — Situation 5-column**: → "Show me 5 columns so I can assess properly." → Ship 5-col on the preview, no commitment.

**Q11 — Animation policy**: → "Remove all for now. Can bring back later when all content is in."

**Q12 — Work section copy**: → Kris supplied long bio. Claude to shorten + tweak. Pull-quote: "I've worked across retail, FMCG, healthcare, leisure, finance, and hospitality." Closer: "Get in touch if you'd like to see an example of my work."

**Q13 — How-I-work layout**: → **A** (3 columns + geometric icons).

**Q14 — How-I-work CTA segue line**: → "Suggest." Claude to draft 3 options once layout is built.

**Q15 — Free session layout**: → **A**. Title: "What happens at our free session?" + intro paragraph (left). Checklist of what to bring / what you get (right). CTA at bottom. Normal copy, not all caps. Hide sticky tab when this section is on screen.

**Q16 — Footer additions**: → Privacy policy link (placeholder href). Add location. Not LTD, no Companies House. No sitemap (single page).

---

## Q&A — round 2

**Hero structure (item 4)**: → "Split / tweak as you see fit." Confirmed = pitch paragraph(s) → `[Let's talk]` pill → soft "Or read on..." line as scroll prompt.

**Hero / contact overlap**: → "Hero pitches. Contact section expands on it with more info & repitches in case reader didn't go for it on first look, and is now convinced after seeing more info." → Two-pitch funnel, contact is the second pitch with mechanics.

**Session length**: → "Do 30mins — more confident & clearer." Standardise everywhere.

**Q7 shapes**: → Skip for now. Phase 6 ships without custom photo cut-through. Reminder logged in 06-SUMMARY.

**Location**: → Manchester. ("UK-wide, based in Manchester.")

**Privacy link copy**: → "Privacy policy". Placeholder href `#privacy` until real page exists.

---

## CTA accent rotation (Claude pick)

To "mix up the accents" per Q5 while honouring AA contrast on Linen:

- **Hero CTA** (on Hot Pink hero, white pill): white fill + Hot Pink text.
- **Work CTA** (on Linen): Indigo fill + white text. Indigo on white meets AA (~5.4:1 against white text reversed).
- **How-I-work CTA** (on Linen): Hot Pink fill + white text.
- **Contact CTA** (on Deep Teal): white fill + Deep Teal text.

Hover inverts each: transparent fill, outlined in the same accent, accent text.

Why these choices: Pink (warmth, primary brand colour) closes both hero and how-I-work — bookend; Indigo offers cool tonal contrast in the middle of the page (Work); Teal stays the conversion section. Amber and Purple sit out V1 — too close visually to Pink/Orange and Indigo respectively to read as distinct CTAs.

---

## Out of scope (logged for V1.1)

- Custom photo shape vocabulary
- Real Privacy policy page
- Re-enable reveal animations with final content
- og:image asset
- Final favicon
- CSP tightening (hash JSON-LD)
