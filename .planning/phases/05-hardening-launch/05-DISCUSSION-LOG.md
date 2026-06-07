# Phase 5: Discussion Log

**Phase:** 05-hardening-launch
**Session:** 2026-05-02
**Participants:** Kris, Claude
**Format:** Q&A — 11 decisions surfaced from RESEARCH.md and OPEN-DECISIONS.md, walked one-by-one with picks recorded.

---

## Decisions (11)

### 1. Hero headline — Option A

> Your brand makes a promise.
> But is your experience breaking it?

Already shipping. No code change. Recorded as "locked, no further action."

### 2. Positioning interrupt copy — Option A (diagnostic framing)

> Most briefs describe a symptom, not the problem. I dig until I find it. Then I show what was already there but missed, the thing that's been normalised, taken for granted, or seen too narrowly.

Already shipping. No code change. Pairs better with the situation section's diagnostic register than Option B (gap framing).

### 3. "Dig. Reveal. Sharpen." — use on site

Kris reframed the original objection by proposing a conversational lead-in:

> If you asked me for 3 words to capture how I work, I'd say: Dig. Reveal. Sharpen.

This solves the slogan-y problem — reads as Kris explaining herself, not a brand declaring a mantra. Three options for typographic treatment offered; Kris picked **Option 2**:

- Lead sentence at **Body scale**, regular weight
- Line break before "Dig. Reveal. Sharpen."
- Three words at **Headline scale**, **Bold**

Lands inside `#approach` section, **above** the existing Option A interrupt paragraph. Section 4 becomes a two-beat moment: quiet intro → loud three-word hit → paragraph.

Implementation note for Phase 5: this is a markup change in `index.html` (`.interrupt__inner` gains a wrapper div with two text blocks) plus a CSS tweak (`.interrupt__lead` Body scale + `.interrupt__three-words` Headline scale Bold). The existing `.reveal` mechanism wraps the whole block as a single fade-in.

### 4. Case study holding statement — confident, name-free

Kris drafted in a more conversational voice. Final copy:

> Get in touch if you'd like to see an example of my past work. I've spent 12+ years on brand, CX, and research strategy.

No client names in V1 (gated on Q5).

Implementation note: replace current `.work__body` text in `index.html`. Single Edit.

### 5. Public client names — defer

Kris will check NDAs / engagement-letter clearance post-launch. None of Toolstation, Goodfella's, Merlin Entertainments, or Sanofi appear in V1 copy.

Knock-on effect: JSON-LD `knowsAbout` field stays at the three service categories; no `clientele` or named-organisation references.

Carryover: when names clear post-launch, single Edit on the work paragraph adds "for clients including X, Y, Z." back in. Tracked as a V1.1 candidate.

### 6. Sticky tab shape — pill

(Initial pick was 4px square; Kris reversed to pill on reflection.)

Pill reads as friendlier / more conversational, which fits the "let's talk" CTA better than the architectural square. The 4px-everywhere consistency argument lost to the tonal argument.

Implementation note for Phase 5 cutover plan: delete `.sticky-tab--square` rules from `css/components.css`, delete the second `<a class="sticky-tab sticky-tab--square">` block from `index.html`, drop the dual-rendering comment. Single commit, one file each.

### 7. Cutover plan — Option A (merge to main)

Standard PR: `claude/new-site-QGsb8` → `main`. Cloudflare Pages production stays pointed at `main`; merge triggers production deploy. Rollback options:

- `git revert` + push (slow but explicit)
- Cloudflare Pages dashboard → Deployments → "Rollback to this deployment" on the previous main deploy (fast, click-driven)

Phase 5 cutover plan documents both rollback paths. The Cloudflare per-deploy rollback button is the practical safety net — it's why we accepted that `main`'s holding-page history gets superseded.

### 8. og:image — Option B (dedicated 1200×630)

Kris/Jamie generate a one-time 1200×630 hero composition export (Hot Pink + portrait + headline). Phase 5 markup wires `<meta property="og:image">` to the asset path; until the asset lands, the meta tag points to a `TODO` path or stays out.

Phase 5 plan flags this as an **asset task** (not code) — Claude can't generate the image. Suggested filename: `images/og-share-1200x630.jpg` (JPG over WebP because some social validators still don't probe WebP correctly).

### 9. Inline `onerror` handler — Option A (refactor to JS listener)

The Phase 2 hero supporting image markup currently runs an inline `onerror="..."` handler that swaps to the Midnight token-block fallback. A strict CSP without `'unsafe-inline'` on `script-src` would block it.

Refactor:
- Drop `onerror="..."` from the `<img>` in `index.html` (one attribute removed).
- Add an event listener in `js/main.js` that watches the supporting image's `error` event and toggles the same `.hero__cutout--missing` class on the parent.
- Behaviour identical; defence-in-depth fallback still works; CSP stays strict.

Three-line change in `main.js`. Lands in Phase 5 plan 05-02 (perf + hardening).

### 10. JSON-LD schema — Option C (`ProfessionalService` with `founder` Person)

Composite schema captures both the consultancy and Kris-as-individual:

- Top-level: `@type: "ProfessionalService"`
- `founder`: `@type: "Person"` with name, jobTitle, sameAs (LinkedIn URL)
- `address` and `telephone` omitted (no public contact at those granularities)
- `priceRange: "$$$"` to satisfy the LocalBusiness validator weakly
- `areaServed: "United Kingdom"`
- `knowsAbout`: ["Brand strategy", "Customer experience strategy", "Research and insight"]

Validator warning on missing address is acceptable; doesn't block Google rich results.

### 11. Lighthouse run — Option B (PageSpeed Insights)

Kris doesn't run Lighthouse manually. Workflow:

1. Phase 5 plan 05-02 lands a11y/SEO/perf code changes on the preview.
2. Claude sends Kris the preview URL + paste-into-PageSpeed instructions.
3. Kris pastes preview URL into pagespeed.web.dev, gets a shareable result URL.
4. Kris sends Claude the result URL.
5. Claude reads numbers, captures in `05-VERIFICATION.md`, remediates anything failing.

Lower friction than DevTools, runs on Google's clean network, shareable results.

---

## Carryovers from this session

These come out of the discussion as future work (post-Phase-5 or V1.1):

- **Public client names** — recheck NDA/clearance status when ready; single Edit re-adds them to the work paragraph and JSON-LD.
- **og:image asset** — needs Kris/Jamie to export. Phase 5 plan flags it; Phase 5 ships with the meta tag prepared but the asset path may follow.
- **Hero supporting image** — still deferred from Phase 2-01. Midnight fallback renders. The `onerror` refactor in Q9 makes the JS listener work whether the image lands or not.

## Decisions deliberately not surfaced

These were considered as candidate questions but not asked, because they're either Claude's discretion per CONTEXT.md or low-stakes:

- Exact CSP directive list — derives from Q9 (refactor) and the meta/JSON-LD wiring; no Kris input needed.
- Favicon design — defer to Kris when she's ready; SVG placeholder ships in Phase 5.
- Cache-control durations — Phase 1 baseline holds; no review needed unless Lighthouse flags.
- Andy Bell reset retention — already shipping, not in scope.

---

*Discussion logged: 2026-05-02. Phase 5 plans (05-01, 05-02, 05-03) draft against these locked decisions.*
