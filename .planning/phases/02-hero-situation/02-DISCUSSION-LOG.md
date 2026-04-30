# Phase 2: Hero & Situation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-30
**Phase:** 02-hero-situation
**Areas discussed:** Hero copy choices, Hero photography strategy, Situation copy strategy, Reveal observer architecture

---

## Hero copy choices

### Hero headline

| Option | Description | Selected |
|--------|-------------|----------|
| A: Promise / Experience (Recommended) | "Your brand makes a promise. Your experience breaks it." — Gap framing, CONTENT-DRAFT recommendation. | (basis) |
| B: Something's off | "Something's off. You just can't name it yet." — Symptom framing. | |
| C: Rebrand done, nothing changed | "The rebrand's done. Nothing's changed." — Direct problem framing. | |
| Hold for Kris | TODO marker, decided on the live preview. | |

**User's choice:** Free text — "A, but tweaked: Your brand makes a promise. But is your experience breaking it?"
**Notes:** Took Option A as basis but reframed the second sentence as a question. Softer accusation, invites the reader in. Voice shift worth flagging back to Kris.

### Hero subhead

| Option | Description | Selected |
|--------|-------------|----------|
| Primary (Recommended) | "I find where brand promise and experience are out of step — and close the gap." First-person, voice-led. | ✓ (with em-dash fix) |
| Alternative | "Independent strategy for the businesses where brand and experience aren't telling the same story." Third-person, more scannable. | |
| Hold for Kris | TODO marker. | |

**User's choice:** Primary — but the em-dash hit the CLAUDE.md design ban, so a follow-up question landed the punctuation.

#### Subhead em-dash fix

| Option | Description | Selected |
|--------|-------------|----------|
| Comma (Recommended) | "I find where brand promise and experience are out of step, and close the gap." | |
| Period (two sentences) | "I find where brand promise and experience are out of step. Then close the gap." | ✓ |
| Switch to alternative | Drop primary, use the third-person alternative. | |

**User's choice:** Period split.
**Notes:** Final hero subhead — "I find where brand promise and experience are out of step. Then close the gap."

### Situation section headline

| Option | Description | Selected |
|--------|-------------|----------|
| Sound familiar? (Recommended) | Softer invitation, matches the recognise-your-own-situation purpose. | ✓ |
| Which one's yours? | Edgier, forces a pick. | |
| Hold for Kris | TODO marker. | |

**User's choice:** "Sound familiar?"

---

## Hero photography strategy

### Hero main cutout (Kris portrait)

| Option | Description | Selected |
|--------|-------------|----------|
| Solid Midnight placeholder shape (Recommended) | Token-block at exact size/position, no image asset. Layout verifiable, image swap is one commit. | |
| You provide a temp Kris headshot now | Real .jpg/.webp committed to images/, rendered with grayscale filter. | ✓ |
| Greyscale stock placeholder | Generic stock portrait — risk of fake-Kris sticking around. | |

**User's choice:** User will provide a temp Kris headshot before plan-phase / Wave 2 commit.

### Hero supporting cutout

| Option | Description | Selected |
|--------|-------------|----------|
| Solid Linen-on-Pink shape (Recommended) | Token-coloured block, no image asset. | |
| Stock greyscale (workshop / hands) | Generic B&W contextual image, manually selected. | ✓ |
| Skip supporting cutout for Phase 2 | Render only main; weaker asymmetry. | |

**User's choice:** Stock greyscale (workshop / hands), user-selected per PROJECT.md (no automated picks).

### Image format and paths

| Option | Description | Selected |
|--------|-------------|----------|
| WebP at fixed paths (Recommended) | images/kris-portrait.webp + images/hero-supporting.webp, single source per slot. | ✓ |
| JPG at fixed paths | Heavier, may pinch the 500KB budget. | |
| WebP + responsive srcset | Two sizes per slot, more correct for retina but Phase 5 territory. | |

**User's choice:** WebP at fixed paths. Free-text follow-up: user has JPGs on desktop and asked how to convert. Provided two paths — Squoosh (browser, drag-drop) and macOS `sips -s format webp <src>.jpg --out images/<name>.webp`.

### Missing-image fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Plan ships, hero falls back to Midnight placeholder shapes (Recommended) | Phase 2 plan executes against agreed paths; if file is missing at execute time, render Midnight token-block. | ✓ |
| Block plan-phase until images land | Don't run plan-phase until images committed. | |

**User's choice:** Ship plan, fall back to Midnight blocks if files are absent.

---

## Situation copy strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Ship CONTENT-DRAFT as-is (Recommended) | Render verbatim; Kris reviews on live preview. | ✓ |
| Ship with [DRAFT] markers | Prefix titles with [DRAFT] for visual obviousness. | |
| Hold body copy, ship structure only | Render titles + TODO placeholders for bodies. | |

**User's choice:** Ship CONTENT-DRAFT as-is.

---

## Reveal observer architecture

### Observer scope

| Option | Description | Selected |
|--------|-------------|----------|
| Generic .reveal observer (Recommended) | One reusable observer; Phases 3/4 add .reveal + index. | ✓ |
| Section-specific handler | Phase 2 writes situation-only function. | |

**User's choice:** Generic `.reveal` observer.

### Re-trigger behaviour

| Option | Description | Selected |
|--------|-------------|----------|
| One-shot per element (Recommended) | Reveal once, unobserve. | ✓ |
| Re-trigger on re-entry | Fade out on scroll-away, fade in on scroll-back. | |

**User's choice:** One-shot per element.

---

## Claude's Discretion

- Exact CSS class names within the BEM-ish convention.
- `<picture>` vs `<img>` for cutouts.
- Stagger-delay implementation (`data-reveal-index` vs CSS custom property).
- Hero responsive breakpoint pixel value (~768px recommended, planner confirms).
- Alt text wording per CONTENT-DRAFT §Photography Direction guidance.
- Cutout shape exact dimensions within the asymmetric-tension brief.

## Deferred Ideas

- Responsive `srcset` for hero images → Phase 5.
- Image LCP optimisation (`fetchpriority`, preload) → Phase 5 (PERF-01).
- Final Kris portrait + final supporting cutout → late-cycle, single-file swap.
- Situation block copy refinement in Kris's voice → live-preview pass.
- `[DECIDE]` markers in CONTENT-DRAFT for positioning interrupt + work names → Phase 3.
- Hero supporting cutout shape (circle vs rounded-rect) → planner picks.
