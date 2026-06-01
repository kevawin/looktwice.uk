# Phase 10: Contact mechanic — form vs email (V1 Refresh P7) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-01
**Phase:** 10-contact-mechanic-form-vs-email-v1-refresh-p7
**Areas discussed:** Mechanic (gate), Service, Fields, Submit UX, Email-link retention, Spam protection, Privacy note, Endpoint ownership

---

## Mechanic (the decision gate)

| Option | Description | Selected |
|--------|-------------|----------|
| Keep mailto (recommended) | Stay with mailto links; frictionless, zero-dep, honours locked V1 rule; phase becomes a no-op | |
| Add a contact form | Formspree/Netlify form capturing the 3 prompts; works without a mail client; overrides the CLAUDE.md mailto rule | ✓ |
| Both — form + mailto fallback | Form primary with visible email fallback | |

**User's choice:** Add a contact form
**Notes:** Reverses the CLAUDE.md + STATE mailto lock. Jamie's review raised the form; Kris chose it.

---

## Service

| Option | Description | Selected |
|--------|-------------|----------|
| Formspree (recommended) | No backend, free tier ~50/mo, built-in spam filter, static-compatible | ✓ |
| Web3Forms | Similar, access-key based, generous free limits | |
| Cloudflare Pages Function | Serverless on same host, most control, needs an email provider + more code | |

**User's choice:** Formspree
**Notes:** Netlify Forms excluded — site hosts on Cloudflare Pages, not Netlify.

---

## Fields

| Option | Description | Selected |
|--------|-------------|----------|
| Name + email + 1 message box (recommended) | 3 prompts become placeholder/helper text; low friction | ✓ |
| Name + email + 3 separate boxes | Each prompt its own field; most structured, more friction | |
| Email + 1 message box only | Minimum; loses name up front | |

**User's choice:** Name + email + 1 message box

---

## Submit UX

| Option | Description | Selected |
|--------|-------------|----------|
| Inline success/error (recommended) | Vanilla JS fetch, stay on page, no reload | ✓ |
| Redirect to thank-you | Native POST then redirect | |
| Service default page | Formspree's own confirmation page | |

**User's choice:** Inline success/error

---

## Email-link retention

| Option | Description | Selected |
|--------|-------------|----------|
| Keep in footer only (recommended) | Form primary; quiet mailto courtesy in footer | |
| Remove all mailto links | Form-only, no visible email anywhere | ✓ |
| Keep email in both contact + footer | Maximum reach, blurs form-primary intent | |

**User's choice:** Remove all mailto links
**Notes:** Hero CTA + floating-bar CTA already point at #contact (not mailto) — they stay.

---

## Spam protection

| Option | Description | Selected |
|--------|-------------|----------|
| Honeypot + Formspree filter (recommended) | Hidden field + built-in filtering, invisible, no friction | ✓ |
| Add Cloudflare Turnstile | Stronger, adds a script + friction | |
| Formspree filter only | Simplest, no honeypot backstop | |

**User's choice:** Honeypot + Formspree filter

---

## Privacy note

| Option | Description | Selected |
|--------|-------------|----------|
| One-line reassurance note (recommended) | "I'll only use this to reply. No marketing, no sharing." | ✓ |
| Link to a privacy policy page | Fuller, adds a page + scope | |
| No note | Lowest friction, weaker on trust/GDPR | |

**User's choice:** One-line reassurance note
**Notes:** Final wording Kris's to confirm in her own voice.

---

## Endpoint ownership

| Option | Description | Selected |
|--------|-------------|----------|
| Kris creates the account (recommended) | hello@looktwice.uk; submissions to her inbox; she owns the dashboard; provides endpoint ID | ✓ |
| Jamie sets it up | Faster, but account not in Kris's control | |
| Wire a placeholder now | Build now, swap real ID before launch | |

**User's choice:** Kris creates the account
**Notes:** Launch blocker — form won't deliver until the real endpoint ID is supplied. Build can proceed with a placeholder; swap before launch.

## Claude's Discretion

- Exact form HTML and JS error/success handling within the locked decisions.
- Honeypot mechanism (`_gotcha` vs custom hidden field).
- Field ordering and provisional placeholder/helper wording.
- Whether the contact intro paragraphs + "tell me" list stay or fold into helper text.

## Deferred Ideas

- Separate privacy-policy page (rejected for V1).
- Cloudflare Turnstile / captcha (rejected for V1; add if spam appears).
- Refresh P3–P6 + P8 still unstarted; P7 taken out of order by Kris's choice.
