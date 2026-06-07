# Phase 5: Open Content + Design Decisions

**For:** Kris
**Compiled:** 2026-05-02
**Resolved:** 2026-05-02 — all six decisions landed in a single Q&A pass. See `05-DISCUSSION-LOG.md` for the full session.
**Status:** RESOLVED. Each section below carries its locked answer in **bold** at the top.

---

## 1. Hero headline

**RESOLVED — Option A.** Already shipping. No code change.

**Where it lands:** `index.html` lines 56–59 (`.hero__headline`)

**Currently shipping (Option A):**
> Your brand makes a promise.
> But is your experience breaking it?

**Other options:**

**Option B (symptom framing):**
> Something's off.
> You just can't name it yet.

**Option C (direct problem):**
> The rebrand's done.
> Nothing's changed.

**Recommendation:** Option A. States the core proposition, uses client language, sets up the situation section cleanly. Option B is more curious / open; good if the primary audience is less sure they have a brand problem.

**Your call:** A / B / C / write a fourth.

---

## 2. Positioning interrupt copy

**RESOLVED — Option A (diagnostic framing).** Already shipping. No code change.

**Where it lands:** `index.html` lines 145–147 (`.interrupt__statement`)
**Surface:** Signal Orange. White text. 40–50 words max.

**Currently shipping (Option A — diagnostic framing):**
> Most briefs describe a symptom, not the problem. I dig until I find it. Then I show what was already there but missed, the thing that's been normalised, taken for granted, or seen too narrowly.

**Option B (gap framing):**
> Strategy that stops at the slide deck isn't strategy. The gap between what a brand promises and what people actually experience is where the real work lives. That's where I start.

**Recommendation:** No strong steer. A is more about the diagnostic act ("how I work"), B is more about the philosophical stance ("what I believe"). Both fit. Option A pairs better with the existing situation section (which is itself a diagnostic exercise).

**Your call:** A / B / write a third.

---

## 3. "Dig. Reveal. Sharpen."

**RESOLVED — use on site, with conversational lead-in.** Final copy:

> If you asked me for 3 words to capture how I work, I'd say: Dig. Reveal. Sharpen.

Lands inside `#approach` section, **above** the existing Option A interrupt paragraph. Typographic treatment (Option 2 of 3 surfaced):
- Lead sentence at **Body scale**, regular weight
- Line break before "Dig. Reveal. Sharpen."
- Three words at **Headline scale**, **Bold**

Section 4 becomes a two-beat moment: quiet intro → loud three-word hit → existing paragraph. Implementation in Phase 5 plan 05-01.

---

**Question:** Use this three-word diagnostic statement on the site, or keep it for decks only?

If used, it lands above the interrupt paragraph at display scale (Epilogue Bold, ~3rem) — turns Section 4 (#approach) from a single paragraph into a two-line beat: the punchline + the explanation.

**Recommendation:** Keep for decks in V1. The interrupt is already opinionated enough; adding a slogan above it risks reading more "tagline-y" than the rest of the page tone. Easy to add later.

**Your call:** Use on site / decks only / undecided (defer to V2).

---

## 4. Case study holding statement

**RESOLVED — confident, name-free.** Final copy (gated on Q5 = defer):

> Get in touch if you'd like to see an example of my past work. I've spent 12+ years on brand, CX, and research strategy.

Single Edit on `.work__body` in Phase 5 plan 05-01. When client names clear post-launch, single Edit re-adds them.

---

**Where it lands:** `index.html` lines 156–158 (`.work__body`)

**Currently shipping (apologetic version):**
> Case studies are being written for this site. In the meantime, get in touch and I'll share relevant examples from my portfolio, spanning retail, FMCG, healthcare, finance, hospitality, and entertainment.

**Confident alternative:**
> Work examples available on request. Twelve years of strategy across brand, CX, and research, for brands including Toolstation, Goodfella's, Merlin Entertainments, and Sanofi.

**Recommendation:** Confident version, conditional on #5 below (named clients). It's more in voice with the rest of the page. The apologetic version reads slightly defensive on a site that otherwise refuses to apologise for anything.

**Your call:** Apologetic / confident / write a third.

---

## 5. Public client names

**RESOLVED — defer to V1.1.** Kris checks NDA / engagement-letter clearance post-launch. None of Toolstation, Goodfella's, Merlin Entertainments, or Sanofi appear in V1 copy. Knock-on: JSON-LD `knowsAbout` stays at the three service categories; no `clientele` or named-organisation references.

When clearances land, single Edit re-introduces them in the work paragraph + (optionally) a `clientele` array in the JSON-LD block.

---

**Question:** Which of these can be named publicly on the site?

- Toolstation
- Goodfella's
- Merlin Entertainments
- Sanofi
- (Any others from the portfolio deck)

**Why this matters:** Picks the final shape of #4. If none can be named, the confident version of #4 doesn't work; the apologetic version stays. If some can, the confident statement uses the named ones.

**Recommendation:** Check NDAs / engagement letters and confirm which names can be used. If unclear, default to the apologetic version of #4 — never name a client without explicit clearance.

**Your call:** List the names you can confirm public.

---

## 6. Sticky tab shape (pill or 4px)

**RESOLVED — pill.** Drop the 4px square variant at Phase 5 cutover.

Implementation (lands in plan 05-03 cutover): delete `.sticky-tab--square` rules from `css/components.css`, delete the second `<a class="sticky-tab sticky-tab--square">` anchor from `index.html`, drop the dual-rendering comment.

Tonal reasoning preferred over system-consistency: pill reads friendlier / more conversational and fits the "let's talk" CTA better than the architectural square.

---

**Where it lands:** `index.html` lines 200–212 (two `.sticky-tab` anchors); `css/components.css` `.sticky-tab--pill` and `.sticky-tab--square` blocks.

**Both are currently rendering on the deployed preview** so you can see them side-by-side once you scroll past the hero. Pill sits at the bottom-right corner; the 4px square sits above it.

**Pill:** Soft, conversational, friendlier shape. Feels more like a chat / "let's talk" prompt.

**4px square:** Sharper, more architectural, matches the other 4px buttons on the page (CTAs use 4px radius). More consistent with the rest of the design system.

**Recommendation:** **4px square** for system consistency. The pill is the only place in the design that uses the full pill radius outside of `.chip` labels — adding it here introduces a second pill surface that doesn't appear elsewhere. The 4px variant matches the buttons and reads as "of a piece" with the rest of the page.

**Your call:** Pill / 4px.

After your pick, Phase 5 cutover plan deletes the unused variant from `index.html` + `components.css` and removes the dual-rendering note.

---

## Status

All six decisions resolved on 2026-05-02 in a single Q&A session — see `05-DISCUSSION-LOG.md`. Phase 5 plans (05-01 a11y/SEO/resp, 05-02 perf/hardening, 05-03 cutover) draft against these locked answers.

The five additional technical questions (cutover plan, og:image, inline onerror, JSON-LD shape, Lighthouse mechanics) also resolved in the same session and are recorded in the discussion log.
