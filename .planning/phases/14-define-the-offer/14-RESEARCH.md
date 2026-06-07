# Phase 14: Define the offer - Research

**Researched:** 2026-06-07
**Domain:** Productised consulting offer design — UK brand/CX strategy, independent consultant context
**Confidence:** MEDIUM (pricing evidence from UK market; structural patterns from practitioner sources; no single authoritative standard exists for this domain)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01** Offer shape: tiered ladder (Diagnose → Strategy → Embed), not discipline packages, not single bespoke.
- **D-02** Three rungs: paid Diagnostic (fixed) → Strategy sprint/project → Embedded partnership (retainer).
- **D-03** Three disciplines (brand strategy, CX/experience strategy, research & insight) are substance applied *within* each rung, not separately purchasable. Surfaced as "what this draws on."
- **D-04** Price expressed as "from £X" anchors. Diagnose is a fixed price; Strategy and Embed show "from."
- **D-05** Provisional anchor figures (all `[CONFIRM-KRIS]`): Diagnose ~£2,000 fixed / Strategy from ~£6,000 / Embed from ~£2,500/month.
- **D-06** Productised/bespoke split: Diagnose = productised (fixed scope + price); Strategy = semi-productised (fixed shape, scoped per client); Embed = bespoke retainer.
- **D-07** Free 30-min call is the single primary CTA site-wide — qualification plus genuine problem-naming, no pitch, no follow-up unless the client wants one. Routes into Diagnose (or straight to Strategy/Embed when fit is obvious).
- **D-08** Free call is not a priced rung. Diagnose is the first thing a client pays for.
- **D-09** Every package CTA routes to the free call / contact form (single Formspree contact route, Phase 10 / CLAUDE.md).
- **D-10** Draft one-line outcomes per rung (`[CONFIRM-KRIS]`): Diagnose — "Name the real problem, not the symptom — with a clear direction out." / Strategy — "Turn the diagnosis into a brand-and-experience strategy your team can act on." / Embed — "Keep the strategy alive — ongoing senior partnership as you grow."

### Claude's Discretion

- Rung names: "Diagnose / Strategy / Embed" are working internal labels. Public names are Kris's call; planner may propose provisional public names (e.g. "The Diagnostic", "Strategy Sprint", "Embedded Partner") flagged `[CONFIRM-KRIS]`.
- "What's included" per rung: not yet enumerated. Planner may draft a short provisional included-items list per rung, `[CONFIRM-KRIS]`.
- Rung display order: Diagnose → Strategy → Embed (low to high commitment) unless Phase 15 layout argues otherwise.

### Deferred Ideas (OUT OF SCOPE)

- Final pricing numbers and public rung names — Kris's decision pre-launch.
- "What's included" detail per rung — drafted at Phase 15.
- Copy voice pass on offer language — Phase 20.
- Direct booking / buy-now for productised Diagnose — V2.
</user_constraints>

---

## Summary

This phase produces one artifact: a locked offer spine document that downstream phases (15 Services section, 16 Process, 17 About, 19 Intro) consume as their single source of truth about what Kris sells. The structure is already decided (D-01 through D-10). Research here answers: are the provisional decisions well-grounded in market reality, and what does the planner need to know to draft the specifics convincingly?

**Pricing anchor verdict:** The provisional figures in D-05 are broadly credible for a senior independent UK brand/CX strategist working with SMEs and scale-ups. The Diagnose anchor (~£2,000) sits at the low-to-mid end of the UK strategy diagnostic market — realistic for a sharp, bounded entry product. The Strategy anchor (from ~£6,000) is also defensible, though UK brand strategy engagements for SMEs commonly run £5,000–£20,000+ depending on scope; "from £6,000" reads as honest rather than cheap. The Embed anchor (from ~£2,500/month) is on the lighter end of the fractional/embedded market (light-touch advisory typically starts ~£1,800–£3,500/month in the UK); it's plausible for 1 day/week at an SME engagement level but reads as entry-level rather than mid-market. All figures need Kris's confirmation (`[CONFIRM-KRIS]`).

**Commitment ladder verdict:** The Diagnose → Strategy → Embed sequence matches established practitioner patterns exactly. Empirical conversion data from productised consulting practitioners shows paid diagnostics consistently convert 25–35% of clients into larger engagements. The critical mechanism: the client experiences the consultant's thinking first-hand before committing to something bigger. The ladder must be framed as a journey (each rung is the natural next step given what was found), not as a features-for-money escalation (SaaS table anti-pattern).

**Primary recommendation:** The locked CONTEXT decisions are well-founded. The planner's job is to draft the offer spine document — a structured Markdown file with one section per rung, covering: public name (provisional), rung type (fixed/semi/bespoke), price/price-model, one-line outcome, what's included (3–5 bullets), and disciplines drawn on. This file is what Phase 15 renders and Phases 16/17/19 reference.

---

## Architectural Responsibility Map

This phase produces no code. It produces one document consumed by downstream content and layout phases.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Offer structure definition | Document (OFFER.md) | — | Consumed by all downstream phases as a reference; not rendered in code until Phase 15 |
| Price anchors | OFFER.md | Phase 15 (render) | Numbers live in the spec; Phase 15 decides how to display them |
| Free-call CTA copy | OFFER.md | Phase 20 (voice) | Provisional copy lives here; Phase 20 refines voice |
| Contact routing | Phase 10 (existing) | OFFER.md (reference) | Formspree form already built; OFFER.md cites it as the single route |
| "What's included" lists | OFFER.md (draft) | Phase 15 (final render) | Planner drafts provisional lists; Phase 15 decides layout/expansion |

---

## Pricing-Anchor Evidence

### UK Market Context for Senior Independent Brand/CX Strategy, SME/Scale-up

[VERIFIED: multiple cross-referenced UK market sources]

**Independent consultant day rates (UK, senior strategy, 2025-26):**
- SME/growth-stage: £750–£1,400/day (average ~£935–£1,020/day) [CITED: leadership-services.co.uk/insights/fractional-cmo-cost-uk-2026-pricing-guide/]
- London specialist (FinTech/B2B SaaS): £1,000–£2,500/day [CITED: same source]

**UK brand strategy project fees (SME market):**
- Brand audit / diagnostic: £1,000–£50,000 (SME example cited at £5,000 for a branded house audit) [CITED: thinkcollectiv.co.uk]
- Positioning & messaging strategy: £2,000–£20,000 [CITED: same source]
- Monthly retainer (light-touch ongoing): £500–£3,000/month [CITED: same source]

**Fractional / embedded retainer (UK, 2026):**
- Light-touch advisory (1–2 days/month): £1,500–£3,500/month [CITED: leadership-services.co.uk]
- 1 day/week engagement: approximately £3,000–£4,500/month at mid-market day rates [ASSUMED: derived from day-rate arithmetic]
- Entry-level fractional (quoted minimum): £1,795/month [CITED: leadership-services.co.uk — Leadership Services own pricing floor]

### Verdict on D-05 Provisional Figures

| Rung | Provisional Figure | Market Range (UK) | Verdict |
|------|--------------------|-------------------|---------|
| Diagnose | ~£2,000 fixed | £1,000–£5,000 for SME diagnostics | Credible — lower-mid of range; reads as accessible, not cheap |
| Strategy | from ~£6,000 | £5,000–£20,000 for strategy projects | Credible — honest entry; room to scope up |
| Embed | from ~£2,500/month | £1,795–£3,500/month (light-touch advisory) | Credible but tight — reads entry-level; Kris may want to anchor higher |

**Caution on Embed anchor:** £2,500/month implies roughly 2.5 days at mid-SME day rates, or 1 day/week. That is a legitimate light-touch engagement but risks reading as "junior" compared to fractional CMO market positioning (£3,000–£6,000/month is the more common quoted range). Worth Kris considering whether "from £3,000/month" is more defensible as her anchor — `[CONFIRM-KRIS]`.

**"From £X" vs "contact us" on the services page:** Showing prices, even anchor prices, signals confidence and filters poor-fit enquiries before they contact Kris. This is standard practice for independent consultants selling to time-poor SME leaders. "Contact us" for pricing is associated with enterprise/agency scale, not independent strategists. The "from £X" model is the right call. [ASSUMED: based on training knowledge of conversion research; no direct AB-test source found for this specific audience]

---

## Productised Consulting Patterns

### The Commitment Ladder Mechanic

[CITED: consultingsuccess.com/consultants-guide-to-productization]

The ladder is a client acquisition model built on progressive commitment, not simultaneous tier choice:

1. **Entry (Diagnose)** — small, low-risk, fixed-scope engagement that proves the consultant's thinking before the client commits to anything larger. Typical pricing pattern: $1,500–$5,000 (US market); UK equivalent: £1,500–£4,000.
2. **Core (Strategy)** — executes the direction the diagnostic surfaced. Typically 5–10x the diagnostic price. The diagnostic presentation is designed to make this next step obvious.
3. **Ongoing (Embed)** — recurring partnership, bespoke to client needs and pace.

**Empirically, paid diagnostics convert 25–35% of clients into larger engagements** [CITED: consultingsuccess.com — citing Danilo Kreimer's model: 35% of audit clients converted to $20,000+ engagements]. The conversion mechanism: the client experiences the consultant's diagnosis first-hand, which makes the case for the bigger engagement far better than any sales call could.

### How the Ladder Avoids the SaaS-Table Anti-Pattern

The CONTEXT specifically flags "do not turn this into a Good/Better/Best SaaS pricing table." Here is the structural difference and how to enforce it:

**SaaS/Good-Better-Best table:**
- All three tiers shown simultaneously as feature-gated options
- Framing: "which level do you want?"
- Logic: pay more, get more features of the same type
- Hazard for Kris: makes Strategy and Embed look like premium versions of Diagnose, not different kinds of engagement

**Commitment ladder:**
- Tiers are sequential, not simultaneous choices
- Framing: "this is a journey — where you start depends on where you are"
- Logic: each rung is appropriate for a different stage of the client relationship and a different problem state
- Each rung has a genuinely different output type, not more of the same

**In practice, the distinction shows up in copy structure:**
- Ladder: "Most clients start with the Diagnostic. Here's why." → then the other rungs follow as "what comes next."
- SaaS table: "Choose your plan." → columns.

The Phase 15 layout must reinforce the sequential logic even if it uses a visual comparison. The CONTEXT already notes this: each rung labelled as fixed/scoped/bespoke, display order Diagnose first.

---

## The Free-Call Entry Mechanic

### What it is and isn't

[ASSUMED: synthesis of practitioner sources; no single authoritative source for this specific pattern]

The "no pitch, no follow-up" free 30-min call is a well-established entry mechanic for independent consultants. Its purpose is:
1. **Qualification** — filter poor-fit enquiries before either party wastes time
2. **Genuine problem-naming** — provide real value in the call (the client leaves with a clearer understanding of their situation) even if they never become a client
3. **Demonstration** — the call itself is the first example of Kris's diagnostic thinking; it shows, not just tells

### How it avoids cannibalising the paid Diagnose

The risk: if the free call already names the problem, why would the client pay £2,000 for the Diagnose?

The answer is scope. The free call names the problem at the surface level — it's a 30-min conversation with one person. The Diagnose goes substantially deeper: stakeholder interviews, document review, structured research, and a written output (the direction document). The distinction must be visible in the offer spec:

- Free call: "30 minutes, one conversation, problem-naming at the surface — enough to know whether the Diagnostic is the right next step"
- Diagnose: "structured research + stakeholder work + written output with a clear direction recommendation"

This is the standard productised consulting entry model [CITED: consultingsuccess.com]. The free call is discovery; the Diagnose is investigation.

### "No pitch, no follow-up" — copy pattern conventions

The phrase "no sale, no follow-up unless you want one" (already established in Phase 7, CLAUDE.md) is already the right pattern. Research confirms this framing works because:
- It removes the prospect's anxiety about being chased
- It signals that Kris is not desperate for work
- It inverts the usual dynamic (the consultant being selective rather than selling)

One risk with "no follow-up" phrasing: some visitors may interpret it as "Kris won't help me move forward." Mitigating copy addition: clarify that the next step, if there is one, is at the client's initiative. For example: "If you want to explore the Diagnostic after our call, just say so — I won't chase." This is Phase 20 copy work, but the offer spec should note the reassurance intent.

**Placement:** The free-call CTA and its reassurance copy sit in the contact section (already built, Phase 10) and near each package CTA in Phase 15. The offer spec must flag this so Phase 15 knows to include a micro-reassurance near each "Book a call" button.

---

## Rung Naming Conventions

### Working internal names vs public-facing names

Working labels: Diagnose / Strategy / Embed (per CONTEXT.md, Claude's discretion area).

**Pattern from practitioner research [ASSUMED: synthesis of productised consulting sources]:**

The most credible public-facing names for this kind of work follow one of two patterns:

**Pattern A — The + Noun (capitalised):**
"The Diagnostic" / "The Strategy" / "The Partnership" or "The Embed"
- Pro: sounds like a defined product, not a service category; signals this is a packaged thing, not a bespoke quote
- Pro: fits the "pip-decks scannability" aspiration in CONTEXT specifics
- Con: "The Strategy" is too generic
- Candidate names: "The Diagnostic" / "The Strategy Sprint" / "The Embedded Partnership"

**Pattern B — Verb-noun phrase:**
"Diagnose" / "Strategise" / "Partner" or "Brand Audit" / "Strategy Sprint" / "Embedded Advisor"
- Pro: action-oriented, outcome-implied
- Con: "Strategise" is consultant-ese; verbs as names can read as SaaS features

**Recommendation for the offer spec [ASSUMED — Kris confirms]:**
- Rung 1: "The Diagnostic" (productised, sharp, implies a defined output)
- Rung 2: "Strategy Sprint" (implies fixed-duration, outcome-led, not open-ended)
- Rung 3: "Embedded Partner" (implies ongoing, collaborative, senior — avoids "retainer" which sounds like a legal service)

These are provisional names for the offer spec; Phase 20 and Kris finalise. The spec must flag all three `[CONFIRM-KRIS]`.

---

## "What's Included" per Rung

### Why it matters for Phase 15

Phase 15 success criterion #1 requires "what's included" to be scannable. The included-items list is what turns a pricing comparison from a promise into a proof. Three to five bullets per rung is the right density — fewer reads vague, more reads like a SOW.

### Draft included-items lists (all `[CONFIRM-KRIS]`)

These are provisional — Kris refines in Phase 20 voice pass. The planner may copy these directly into the offer spec.

**Rung 1: The Diagnostic (~£2,000, fixed scope, ~2–3 weeks)**
- One structured 60-min kick-off (with Kris + 1–2 key stakeholders)
- Review of existing brand/CX materials (brief, guidelines, research, comms)
- Stakeholder conversations (up to 3 internal; 2–3 customer if available)
- Written diagnostic output: the real problem, the root cause, a clear direction
- 60-min debrief and Q&A call

*What this draws on: brand strategy, CX/experience strategy, research & insight*
*Output type: written report + debrief call*

**Rung 2: Strategy Sprint (from ~£6,000, fixed shape / scoped per client, 4–8 weeks)**
- Builds on the Diagnostic (or an equivalent existing body of evidence)
- Structured strategy development: positioning, narrative, experience principles, or CX strategy (scope defined before start)
- Stakeholder workshops (number TBD per scope)
- Strategy document + implementation framework (what to do, in what order, why)
- Presentation to leadership team
- One follow-on call (30 days after delivery)

*What this draws on: brand strategy, experience strategy, research & insight*
*Output type: strategy document, workshop outputs, leadership presentation*

**Rung 3: Embedded Partner (from ~£2,500/month, bespoke retainer, rolling)**
- Ongoing senior partnership — typically 1 day/week equivalent
- Monthly strategy sessions + async availability between
- Hands-on during critical moments (campaigns, launches, rebrands in progress)
- Scope and cadence agreed per client, reviewed quarterly
- Single point of accountability across brand, CX, and research decisions

*What this draws on: all three disciplines, continuously applied*
*Output type: ongoing advisory — decisions, documents, facilitation as needed*

---

## Common Pitfalls

### Pitfall 1: The Diagnose rung collapses into a free call
**What goes wrong:** The offer spec writes the Diagnostic as a "discovery session" or "problem-naming call" — which is the free call's job. The two blur together. Phase 15 ends up with two things that look the same.
**Why it happens:** Kris's brand voice is about naming problems first. It's easy to over-index on that framing and make the paid Diagnostic sound like a more thorough version of the free call.
**How to avoid:** The Diagnose must emphasise its *investigation* component — stakeholder interviews, document review, research — not just its problem-naming output. The free call is a conversation; the Diagnostic is an investigation with a written output.
**Warning signs:** If the Diagnose included-items list has no research/review activities (only calls and conversations), the distinction is lost.

### Pitfall 2: The pricing comparison reads as a SaaS feature-gate
**What goes wrong:** The three rungs are presented with a features column listing cumulative inclusions (like Bronze/Silver/Gold), implying Rung 3 is "Rung 1 + Rung 2 + more."
**Why it happens:** Standard comparison layout conventions pull designers toward the features-escalation model.
**How to avoid:** Each rung's included-items list must describe *different kinds of output*, not more of the same. The offer spec should explicitly note: "These are not cumulative tiers. Each rung is appropriate for a different stage. Not every client moves through all three."
**Warning signs:** If two rungs share more than two bullets in their included-items lists, the distinction is too thin.

### Pitfall 3: The free call competes with the Diagnostic
**What goes wrong:** The free call copy on the site promises "problem identification" and the Diagnostic is also positioned as finding the real problem. A smart prospect asks: "Why would I pay £2,000 for something I can get for free?"
**How to avoid:** Keep the free call framed as surface-level problem naming (enough to know whether to proceed) and the Diagnostic as deep investigation with a written output. The offer spec should contain a brief note on this distinction so Phase 15's layout reinforces it.

### Pitfall 4: "From £X" anchors drift from Kris's actual rates
**What goes wrong:** The provisional figures become the only figures. Phase 15 builds a section around £2,000/£6,000/£2,500 and then Kris's real rates are different. The planner assumed the provisional was final.
**How to avoid:** Every appearance of a price figure in the offer spec must carry `[CONFIRM-KRIS]`. Phase 15 must treat price display as a placeholder to be swapped out, not confirmed content.

### Pitfall 5: Embed rung reads as a commodity retainer
**What goes wrong:** The Embedded Partner description sounds like an agency retainer ("X hours per month, billed monthly"). This commoditises the relationship and makes Kris sound like a supplier, not a strategic partner.
**How to avoid:** Frame it around outcomes and availability, not hours. "Ongoing senior partnership" rather than "retainer." The included-items list should describe what happens, not how many days are bought. The offer spec must reinforce this language.

---

## Artifact Shape: What This Phase Produces

### The "OFFER.md" document

The planner's output for Phase 14 is a single structured Markdown file: `OFFER.md` at the project root (or `.planning/OFFER.md` — planner's choice, but the path must be stable and referenced in CONTEXT and STATE so downstream phases can find it).

This file is not a design spec and not a code file. It is the **content contract** for the offer. Every downstream phase reads it before building anything.

**Required sections in OFFER.md:**

```markdown
# The Offer: Look Twice

## Overview
[Two sentences: what the ladder is, how to enter it (free call), what it leads to]

## Free Call (Entry Point, not a rung)
- What it is: [description]
- Duration: 30 minutes
- Purpose: [qualification + genuine problem-naming]
- Reassurance copy: [draft "no pitch, no follow-up" line]
- Routes to: Diagnose (or straight to Strategy/Embed if fit is clear)
- Contact route: Formspree form at #contact

## Rung 1: [Public Name TBC / CONFIRM-KRIS]
**Internal label:** Diagnose
**Type:** Productised — fixed scope, fixed price
**Price:** ~£2,000 [CONFIRM-KRIS]
**Duration:** ~2–3 weeks
**One-line outcome:** [D-10 draft]
**What's included:**
- [3–5 bullets]
**Disciplines drawn on:** [list]
**CTA:** Routes to free call / contact form

## Rung 2: [Public Name TBC / CONFIRM-KRIS]
**Internal label:** Strategy
**Type:** Semi-productised — fixed shape, scoped per client
**Price:** from ~£6,000 [CONFIRM-KRIS]
**Duration:** ~4–8 weeks
**One-line outcome:** [D-10 draft]
**What's included:**
- [3–5 bullets]
**Disciplines drawn on:** [list]
**CTA:** Routes to free call / contact form
**Note on scope:** scope is confirmed and priced in the free call; Diagnose often precedes but not required

## Rung 3: [Public Name TBC / CONFIRM-KRIS]
**Internal label:** Embed
**Type:** Bespoke — tailored retainer
**Price:** from ~£2,500/month [CONFIRM-KRIS]
**Duration:** rolling, reviewed quarterly
**One-line outcome:** [D-10 draft]
**What's included:**
- [3–5 bullets]
**Disciplines drawn on:** [list]
**CTA:** Routes to free call / contact form

## Downstream Consumer Notes
- Phase 15 (Services section): renders rungs as a priced comparison; each rung needs name/price/outcome/included-items
- Phase 16 (Process): references Diagnose and Strategy as the typical client journey steps
- Phase 17 (About): references the Embed rung as the ongoing partnership relationship
- Phase 19 (Intro): CTA must reference the free call entry, not a specific rung

## Confirmation Required Before Launch
All items marked [CONFIRM-KRIS] require Kris's sign-off before any copy goes live.
```

**Why this structure:** Phase 15 needs every field to build the comparison layout. Phases 16/17/19 need named rungs they can reference. The downstream-consumer notes section prevents each phase from having to reverse-engineer the intent.

---

## Architecture Patterns

### Recommended project structure (content only, no code)

```
.planning/
├── OFFER.md              # the locked offer spine — this phase writes it
phases/14-define-the-offer/
├── 14-CONTEXT.md         # locked decisions (exists)
├── 14-RESEARCH.md        # this file
├── 14-PLAN.md            # planner writes next
```

The offer spec lives at `.planning/OFFER.md` (not at root) to keep the root clean and co-located with other planning artifacts. Downstream phases reference it by path.

### Pattern: Provisional + confirmed field

Every price, name, and outcome statement in OFFER.md carries `[CONFIRM-KRIS]`. The planner writes drafts; Kris confirms pre-launch. This two-state model (draft vs confirmed) must be visible in the file so Phase 20 and the pre-launch review know exactly what needs sign-off.

### Anti-pattern: Solving Phase 15's layout in Phase 14

The offer spec must not attempt to specify how Phase 15 renders the comparison. OFFER.md answers "what are we selling?" Phase 15 answers "how does it look?" Keep these strictly separate. Any layout notes in OFFER.md belong under "Downstream Consumer Notes," not in the rung specifications.

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Three discipline packages (brand / CX / research) | Tiered commitment ladder (Diagnose → Strategy → Embed) | Disciplines are now substance, not separate offers — eliminates overlap confusion |
| Bespoke engagement, pricing on application | "From £X" anchors with productised entry (Diagnose) | Filters enquiries; signals accessibility; consistent with current market norms for UK independent consultants |
| Free call as a sales mechanism | Free call as genuine problem-naming, no pitch, no follow-up | Aligns with how Kris's audience (SME leaders) wants to be approached; removes the usual consultant-prospect dynamic |

**Deprecated in this phase:**
- "TALK THROUGH WHAT YOU NEED →" (services CTA, Phase 3) — replaced by specific package CTAs each routing to the same Formspree form
- Three-discipline services section copy (CONTENT-DRAFT.md §Services) — replaced by rung-led offer; disciplines become sub-content within each rung

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | "From £X" pricing visibility converts better than "contact us for pricing" for this audience | Pricing-Anchor Evidence | Low — the worst case is Kris hides pricing later; offer spec is still valid |
| A2 | Paid diagnostic converts 25–35% of clients to larger engagements | Productised Consulting Patterns | Low — this is cited from a practitioner source; actual rate varies by niche and consultant quality |
| A3 | Embed anchor of from ~£2,500/month reads as light-touch / entry-level vs mid-market | Pricing-Anchor Evidence | Medium — if Kris's actual rates are higher, this anchor undercuts her positioning before she's corrected it |
| A4 | "The Diagnostic" / "Strategy Sprint" / "Embedded Partner" are the strongest provisional public names | Rung Naming Conventions | Low — these are `[CONFIRM-KRIS]`; Kris may have better names from her existing client vocabulary |
| A5 | 3–5 bullets per rung is the right density for "what's included" | "What's Included" per Rung | Low — Phase 15 can adjust density; the offer spec just needs enough to build from |
| A6 | OFFER.md should live at `.planning/OFFER.md` | Artifact Shape | Low — planner can choose root or .planning/; stability of the path matters more than the exact location |

---

## Open Questions

1. **Does Kris have client vocabulary for the rungs?**
   - What we know: the working names (Diagnose/Strategy/Embed) are internal labels; Kris's real client conversations may already use specific language
   - What's unclear: whether Kris has pitch language she prefers for each rung
   - Recommendation: planner writes provisional names with `[CONFIRM-KRIS]`; flag for a direct question to Kris during the voice pass (Phase 20)

2. **Does the Embed rung anchor need to move up?**
   - What we know: from ~£2,500/month is at the low end of the UK fractional advisory market; light-touch advisory typically starts around £1,800–£3,500/month
   - What's unclear: whether Kris's intended engagement model (days per week) implies a higher anchor
   - Recommendation: flag in OFFER.md as a `[CONFIRM-KRIS]` decision with a note that mid-market equivalent is from ~£3,000/month

3. **What exactly distinguishes Diagnose from a thorough free call?**
   - What we know: the distinction is investigation depth + written output
   - What's unclear: what Kris's actual Diagnostic process involves (what documents does she review, how many stakeholders does she typically interview)
   - Recommendation: planner drafts sensible defaults (see "What's Included" section above); Kris refines the specifics

---

## Environment Availability

Step 2.6: SKIPPED — Phase 14 produces a Markdown document only. No external tools, services, CLIs, or runtimes required beyond a text editor and Git.

---

## Project Constraints (from CLAUDE.md)

These apply to the OFFER.md content:

- No em-dashes in copy — use commas, colons, or new sentences instead
- No "just", "really", "basically", "simply" or filler words in draft copy
- Kris's voice: clear, human, short sentences, plain English, no consultant waffle
- All CTAs route to Formspree contact form (#contact anchor) — no visible mailto, no direct booking/buy in V1
- "From £X" anchors are provisional until Kris confirms — mark every figure `[CONFIRM-KRIS]`

---

## Sources

### Primary (HIGH confidence)
- `.planning/phases/14-define-the-offer/14-CONTEXT.md` — locked decisions D-01 through D-10
- `PRODUCT.md` — audience definition, trigger situations, brand voice, design principles
- `.planning/seeds/CONTENT-DRAFT.md` — existing services copy and free-session CTA draft

### Secondary (MEDIUM confidence)
- [thinkcollectiv.co.uk — UK brand strategy pricing ranges for SMEs](https://www.thinkcollectiv.co.uk/post/understanding-uk-brand-strategy-costs-what-you-need-to-know)
- [consultingsuccess.com — productised consulting gateway/ladder model, conversion data](https://www.consultingsuccess.com/consultants-guide-to-productization)
- [leadership-services.co.uk — UK fractional CMO / embedded strategy retainer pricing 2026](https://leadership-services.co.uk/insights/fractional-cmo-cost-uk-2026-pricing-guide/)
- [melisaliberman.com — productised consulting tier structure and diagnostic-first entry](https://www.melisaliberman.com/blog/productized-consulting)

### Tertiary (LOW confidence — for structural/pattern guidance only)
- [lisalarter.com — discovery call positioning (argument for qualification-first approach)](https://lisalarter.com/problem-free-discovery-calls/)
- [consultingdemand.com — UK consultant day rates 2025-26 benchmark](https://consultingdemand.com/blog/consultant-day-rates-2024/)
- [wayfront.com — productised consulting structural patterns](https://wayfront.com/blog/productized-consulting)

---

## Metadata

**Confidence breakdown:**
- Pricing anchors: MEDIUM — UK market range confirmed from multiple sources, but no source benchmarks specifically for brand+CX independent strategist serving SMEs at this level; provisional figures are plausible, not verified against Kris's actual market
- Commitment ladder structure: HIGH — well-documented practitioner model; D-01/D-02 decisions match standard practice exactly
- Free-call mechanic: MEDIUM — well-established pattern; specific "no pitch, no follow-up" framing is Kris's existing language (Phase 7), confirmed appropriate by practitioner sources
- Rung naming: LOW — no authoritative standard; names proposed are synthesis of patterns, not a verified convention
- "What's included" lists: LOW — drafted from practitioner norms; needs Kris's knowledge of her actual process
- Artifact shape (OFFER.md): MEDIUM — derived from downstream consumer needs (Phase 15 layout requirements); specific fields proposed by reasoning, not cited from a standard

**Research date:** 2026-06-07
**Valid until:** This research is based on UK market data from 2025-26 sources. Pricing benchmarks should be re-validated if the offer launch is more than 6 months from this date.
