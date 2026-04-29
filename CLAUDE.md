<!-- GSD:project-start source:PROJECT.md -->
## Project

**looktwice.uk**

The website for Look Twice — Kristina (Kris) Evawin's independent brand and CX strategy consultancy for SMEs and scale-ups. V1 is a single-page proof-and-credibility asset for warm referrals: visitors arrive from LinkedIn or word of mouth, recognise their own situation, and contact Kris with no friction.

**Core Value:** A warm referral lands, recognises their own problem in Kris's words within 60 seconds, and emails her — because the site is the demonstration of what she does, not just the description.

### Constraints

- **Tech stack**: Plain HTML + CSS + minimal vanilla JS — no frameworks, no preprocessors, no bundlers, no npm deps for V1.
- **Hosting**: Cloudflare Pages, static deploy from `new-site` branch. Already-registered domain `looktwice.uk` on Cloudflare DNS.
- **Branch policy**: All work on `new-site`. `main` is the live holding page — do not touch until cutover.
- **Typography**: Epilogue only, weights 400 and 700. No 500. No second family. Google Fonts (or self-hosted woff2) with font-display: swap.
- **Accessibility**: WCAG AA minimum on every surface. prefers-reduced-motion respected. One H1 per page (hero).
- **Performance**: LCP < 2.5s, CLS < 0.1, FID < 100ms, page weight < 500KB excluding images. Images in WebP with srcset; lazy-load below the fold.
- **Content**: All copy in `CONTENT-DRAFT.md` is directional — Kris refines in her own voice before launch. Several `[DECIDE]` and `[CONFIRM]` markers still open (hero headline, positioning interrupt option, public client names).
- **Design bans (hard stops)**: no card shadows, no gradient text, no glassmorphism, no mid-tone greys, no decorative card grids, no font-weight 500, no em-dashes in copy.
- **Gradient discipline**: brand gradient appears in exactly one place — the floating sticky tab. Cool accents (Rich Purple, Cool Indigo) are hover/gradient only, never section backgrounds.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
