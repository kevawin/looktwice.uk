# Phase 10: Contact mechanic — form vs email (V1 Refresh P7) - Context

**Gathered:** 2026-06-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the site's `mailto:`-based contact with a working contact form. This was a decision gate: CLAUDE.md + STATE locked V1 to a `mailto:` link (frictionless, zero-dependency); Jamie's review suggested a form. **Decision: build a form** (form-only — no visible email fallback).

In scope: the contact form (markup, Formspree wiring, vanilla-JS inline submit, validation, spam protection, data-use note), removing all visible `mailto:` links, and updating the CLAUDE.md / STATE mailto rule to match the new decision.

Out of scope: copy rewrites (refresh P4), services/layout redesign (P5), credentials (P6), visual-variety/rectangle-break (P8), a separate privacy-policy page, the cutout primitive (P3).
</domain>

<decisions>
## Implementation Decisions

### Mechanic (the gate)
- **D-01:** Build a contact form. It becomes the single primary contact path. This OVERRIDES the locked CLAUDE.md V1 "mailto only, no form" rule and the STATE.md mailto lock — both must be updated during execute to record the reversal and its rationale (Jamie review + Kris decision 2026-06-01).
- **D-02:** Form-only. Remove ALL visible `mailto:` links and the visible email address. A visitor gets the form as the one route.

### Service
- **D-03:** Use Formspree. Static-site compatible on Cloudflare Pages, no backend code, free tier (~50 submissions/month), built-in spam filtering. Keeps the no-framework / no-npm constraint intact (form action + a small fetch; no build step, no SDK).

### Fields
- **D-04:** Three fields — name (required), email (required), and one message textarea (required). The existing three prompts ("what the business does", "what the problem feels like right now", "what you've already tried") become placeholder/helper text inside the message box, NOT separate fields. Keeps friction low while still capturing everything.

### Submit behaviour
- **D-05:** Inline success/error via vanilla JS `fetch` (AJAX POST to Formspree, `Accept: application/json`). Visitor stays on the page — no reload, no redirect. Show an inline success message on 200 and an inline error message on failure. Respect `prefers-reduced-motion` for any transition.

### Spam protection
- **D-06:** Hidden honeypot field (bots fill it, humans don't — reject on the client and/or rely on Formspree's `_gotcha` field) plus Formspree's built-in spam filter. No visible captcha. No Turnstile for V1.

### Privacy / trust
- **D-07:** One-line data-use reassurance note near the submit button. Direction: "I'll only use this to reply to you. No marketing, no sharing." Final wording is Kris's to confirm in her own voice. No separate privacy-policy page in V1.

### Endpoint ownership
- **D-08:** Kris creates the Formspree account using hello@looktwice.uk so submissions land in her inbox and she owns the dashboard. She provides the form endpoint ID to wire in. **Launch blocker:** the form will not deliver until the real endpoint ID is in place. Build/markup/JS/styling can proceed with a clearly-marked placeholder endpoint; the real ID must be swapped in before launch.

### Accessibility (constraint, not optional — WCAG AA per CLAUDE.md)
- **D-09:** Every field has a real `<label>` (not placeholder-as-label). Required fields use `aria-required`/`required`. Validation errors are announced via an `aria-live="polite"` region and focus moves to the first invalid field. Success message is announced too. Visible focus rings on all inputs and the submit button. Keyboard-only flow is Claude's responsibility to verify, not Kris's.

### Claude's Discretion
- Exact HTML structure of the form and the JS error/success handling, within the decisions above.
- Whether the honeypot is the Formspree `_gotcha` convention or a custom hidden field (pick the more reliable for static + Formspree).
- Field ordering and the precise placeholder/helper-text wording (provisional; Kris confirms copy).
- Whether the contact section's two intro paragraphs and the "Tell me, when you get in touch" list stay as-is or fold into the form's helper text (lean: keep intro paragraphs; the list content moves into the message-box helper text since it now duplicates the placeholder).
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase definition
- `.planning/ROADMAP-REFRESH.md` §"Phase 7: Contact mechanic (form vs email)" (lines ~187-201) — original phase intent, the conflict to resolve, Playwright lean.
- `.planning/ROADMAP.md` §"Phase 10: Contact mechanic — form vs email (V1 Refresh P7)" — registered GSD phase detail + numbering note (GSD 10 = refresh P7).

### Rules to UPDATE (the decision reverses them)
- `CLAUDE.md` — the V1 "mailto link, no form" contact rule and the design bans. D-01/D-02 reverse the contact rule: update it to "V1 contact = Formspree contact form, no visible mailto". Keep honouring the design bans (no card shadows, no gradient text, no glassmorphism, no font-weight 500, no em-dashes; gradient only on the floating CTA pill) when styling the form.
- `.planning/STATE.md` — the "V1 locked to mailto" note under refresh decisions; record the reversal.

### Code to change
- `index.html` §contact section (lines ~246-271) — current mailto CTA group; this is where the form goes.
- `index.html` line ~285 — footer `mailto:` link (remove per D-02).
- `index.html` line ~257-258 — contact CTA-group `mailto:` button + visible email (remove per D-02).
- `index.html` line ~109 (hero CTA) and ~293 (floating-bar CTA) — these already point at `#contact`, NOT mailto. Leave them; they should keep scrolling to the form. Verify they still land sensibly.

### External (researcher/planner read before implementing)
- Formspree AJAX docs — https://help.formspree.io/hc/en-us/articles/360013470814-Using-the-fetch-API-with-Formspree (fetch + JSON response pattern, `_gotcha` honeypot, `_subject`/`_replyto` fields). Confirm current free-tier limits and the exact endpoint format at implementation time.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.btn` / `.btn--on-teal` button styles (`index.html:257`) — reuse for the form submit button so it matches the standardised button system from refresh P1 (GSD Phase 7). No new button style.
- Contact section scaffold (`.contact`, `.contact__inner`, `.contact__intro`, `.contact__list`) already exists — the form slots into `.contact__inner`, likely replacing the `.contact__cta-group` and absorbing the `.contact__list` content as helper text.

### Established Patterns
- Plain HTML + CSS + vanilla JS, no frameworks/bundlers/npm (CLAUDE.md hard constraint). The fetch handler is a small inline/`<script>` addition — no dependencies.
- Phase 05 already refactored inline `onerror` into a JS listener — follow the same "no inline handlers, attach in JS" pattern for the form submit.
- Epilogue 400/700 only; WCAG AA on every surface; `prefers-reduced-motion` respected.

### Integration Points
- Form POSTs to the Formspree endpoint (D-08 placeholder until Kris supplies the real ID).
- Removing mailto links touches the contact CTA group and footer; the two CTA anchors that scroll to `#contact` (hero + floating bar) stay.

</code_context>

<specifics>
## Specific Ideas

- Message-box helper text should carry the three existing prompts: what the business does / what the problem feels like right now / what you've already tried.
- Data-use note direction (Kris to finalise): "I'll only use this to reply to you. No marketing, no sharing."
- Playwright lean (from roadmap): YES, since a form ships — cover submit happy path, required-field validation, honeypot, and success + error states. Confirm the exact test scope in plan-phase.

</specifics>

<deferred>
## Deferred Ideas

- **Separate privacy-policy page** — considered for D-07, rejected for V1 (no other pages exist). Revisit if the site grows.
- **Cloudflare Turnstile / captcha** — considered for D-06, rejected for V1. Add if honeypot + Formspree filtering proves insufficient.
- **Refresh P3 (Cutout reveal), P4 (Copy pass), P5 (Services redesign), P6 (Credentials), P8 (Visual variety)** — still unstarted; this phase was taken out of refresh order by Kris's choice.

None of the above belong in Phase 10.

</deferred>

---

*Phase: 10-contact-mechanic-form-vs-email-v1-refresh-p7*
*Context gathered: 2026-06-01*
