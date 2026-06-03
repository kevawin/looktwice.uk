# Phase 13: Design contract - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 13-design-contract
**Areas discussed:** Contract file & authorship, Inherited rule rulings, Shape vocabulary, Motion & scroll-reveal

---

## Contract file & authorship

### Where the contract lives
| Option | Description | Selected |
|--------|-------------|----------|
| Overwrite root DESIGN.md | Lift the do-not-modify lock; root DESIGN.md becomes the single living contract | ✓ |
| New file, root kept as archive | Write a fresh contract, old survives as reference | |
| Contract in .planning/ | Keep root untouched; write contract to .planning/ | |

### DESIGN.json twin
| Option | Description | Selected |
|--------|-------------|----------|
| Keep both in sync | Update DESIGN.json alongside DESIGN.md | |
| DESIGN.md only, retire JSON | DESIGN.md sole source; JSON archived/deleted | ✓ |
| Decide later | Leave JSON untouched, flag as follow-up | |

### Authorship
| Option | Description | Selected |
|--------|-------------|----------|
| impeccable proposes, you rule | impeccable drafts; Jamie reviews/edits each | ✓ |
| You dictate, impeccable formalizes | Jamie decides; impeccable only formats | |
| Hybrid — rule contentious now | Rule the six now; impeccable proposes the rest | |

### Authority (DESIGN.md vs tokens)
| Option | Description | Selected |
|--------|-------------|----------|
| DESIGN.md is law, tokens follow | Strict hierarchy, DESIGN.md first | |
| Tokens are truth, DESIGN.md documents | CSS canonical | |
| Contract references tokens | Contract owns rules, points at tokens for values | (basis of final) |
| Other (free text) | "talk me through tokens..." → see notes | ✓ |

**User's choice:** Neither file is law. After a walk-through of what tokens are, Jamie ruled: keep tokens (good plumbing, not law), DESIGN.md captures design intent/theme/brand, both work together and both can change. "build flexibility in."
**Notes:** Jamie wanted to be sure tokens would not "get in the way of refreshing the design." Clarified: the token *mechanism* is plumbing that makes refresh easier; values and rules are the brand decisions being re-ruled. Final: contract references tokens for values (no drift), both mutable, neither frozen.

---

## Inherited rule rulings

### Card-shadow ban
| Option | Description | Selected |
|--------|-------------|----------|
| Override — allow one elevation step | Flat default + one shadow on raised CTA/pricing | |
| Keep the ban | Stay fully flat | |
| Kill — shadows freely available | Drop restriction entirely | ✓ |

### No-card-grids ban
| Option | Description | Selected |
|--------|-------------|----------|
| Override — carve-out for pricing | Ban decorative grids, allow priced comparison | |
| Keep the ban | No grids at all | |
| Kill — grids allowed | Cards/grids normal tools | ✓ |

### No mid-tone greys
| Option | Description | Selected |
|--------|-------------|----------|
| Override — functional greys only | Allow grey for helper/placeholder/disabled | |
| Keep the ban | No greys anywhere | |
| Kill — greys allowed | Mid-tone greys available generally | ✓ |

### Gradient-only-on-the-tab
| Option | Description | Selected |
|--------|-------------|----------|
| Override — gradient on key CTAs too | Pill + recommended tier / primary CTA | |
| Keep — tab only | Gradient stays in one place | |
| Kill — gradient freely available | Drop scarcity rule | ✓ |

### Epilogue-only / no-500
| Option | Description | Selected |
|--------|-------------|----------|
| Keep — Epilogue 400/700 only | One family, two weights | (family kept) |
| Override — add weight 500 | Epilogue-only + a third weight | (weight door left open) |
| Override — allow a second family | Permit a second typeface | ✗ (ruled back out) |

**User's choice:** First selected "allow a second family", then ruled it back out — a second family means two fonts across ALL Look Twice material, not just the website (brand-wide cost). Epilogue stays the only family. A third *weight* (e.g. 500) is **not ruled out** — left open for hierarchy, decided on need.
**Notes:** Likely third-weight trigger is dense pricing tables (Phase 15). CLAUDE.md's hard no-500 ban softens to "revisit when hierarchy demands."

### B&W cutout desaturation
| Option | Description | Selected |
|--------|-------------|----------|
| Override — B&W default, colour on reveal | B&W resting, scroll-reveal to colour | |
| Keep — always B&W | Cutouts stay desaturated | |
| Kill — full colour imagery | Drop desaturation | |
| Other (free text) | Kill → neutral/no rule | ✓ |

**User's choice:** Kill the rule, settle to **neutral / no rule** (not "full colour imagery"). The B&W→colour→B&W scroll-reveal idea is dropped — Kristina's point that coloured section + coloured image = colour overkill is accepted. Kris likes a subtle parallax on the B&W images behind the cutout (Jamie is fine with it). Colour-on-white is left open, not baked in.
**Notes:** This is the signature-interaction pivot: from colour-reveal to subtle parallax, both explored in Phase 21 not baked here. Fed the motion area's framing.

---

## Shape vocabulary

### Basis
| Option | Description | Selected |
|--------|-------------|----------|
| Build on existing presets | Seed from the five cutout presets + radii | ✓ |
| Fresh discipline-first set | impeccable proposes from scratch | |
| Existing as floor, expand boldly | Five as baseline, push for richer set | |

### Binding
| Option | Description | Selected |
|--------|-------------|----------|
| Strict — reuse only, no new shapes | New shape requires a contract update first | ✓ |
| Default set + justified exceptions | Reuse by default, add if justified + logged | |
| Recommended palette only | Guidance, not a gate | |

### Scope
| Option | Description | Selected |
|--------|-------------|----------|
| Everything shaped, one radius set | Cutouts + corners + buttons + dividers, consolidated radii | ✓ |
| Feature shapes only | Cutouts + signature shapes; everyday corners untouched | |
| Shapes now, radii later | Lock shapes, defer radius consolidation | |

**User's choice:** Build on the five presets; strict reuse, no new shapes without a contract update; governs everything shaped under one consolidated fixed-radius set.
**Notes:** Deliberate discipline on the shape system even though the inherited bans were loosened — the bans were guardrails, the vocabulary is the positive system that cures the current inconsistency (Koto reference).

---

## Motion & scroll-reveal

### Reduced-motion fallback
| Option | Description | Selected |
|--------|-------------|----------|
| Everything static, content fully visible | No parallax/reveals/movement; content immediate | ✓ |
| Opacity-only fades kept | Drop transforms, keep gentle fade-ins | |
| Let impeccable propose | Set "must have a path", impeccable specifies | |

### Existing scroll-reveal
| Option | Description | Selected |
|--------|-------------|----------|
| Keep as baseline, evolve in Phase 21 | Current reveal stays, evolve on top | |
| Fold into one motion system now | Unify reveals + look-twice now | |
| Leave entirely to Phase 21 | Contract sets only principle + reduced-motion | |
| Other (free text) | "lose it" — already removed | ✓ |

**User's choice:** Lose the old reveal — Jamie believes it's not wired up and took it out; wants fresh patterns. Confirmed by code check (only floating-bar gate + #contact suppression use IntersectionObserver; animations.css has only the word-roller). Reduced-motion = everything static, content fully visible.
**Notes:** Motion north star is the "look twice" feel — subtle interactions that make the user literally look twice ("did that image move?"). Candidate interactions (parallax, colour-on-white, micro-reveals) explored per-phase (mostly Phase 21), none baked in.

---

## Claude's Discretion

- Exact shape names, the consolidated radius values, and the precise wording of the motion/rule sections — impeccable proposes, Jamie rules (D-03).
- How hard to push the "judgement" framing on the killed bans so the contract still steers away from the generic-consultant look.

## Deferred Ideas

- Parallax behind cutouts, colour-on-white imagery, specific micro-reveals → Phase 21.
- Third Epilogue weight (likely 500) → decided on need, likely Phase 15 pricing tables.
- Priced-package comparison card-grid layout → Phase 15 (enabled by D-06).
- WCAG-AA contrast re-check after killing the bans / adding a weight → verify per-surface as those phases build.
