# Phase 1: Foundations & Deploy Pipeline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-29
**Phase:** 01-foundations-deploy-pipeline
**Areas discussed:** Holding page handover, Font hosting, CSS file structure, Cloudflare Pages wiring, Section anchor list, Phase 1 preview content

---

## Holding page handover

| Option | Description | Selected |
|--------|-------------|----------|
| Replace immediately on new-site | Phase 1 overwrites `index.html` on `new-site`; `main` keeps holding page untouched until cutover | ✓ |
| Keep as `holding.html` on new-site | Rename existing file, ship shell as new `index.html` alongside | |
| Branch-protect existing index.html until cutover | Defer overwrite until Phase 5 | |

**User's choice:** Replace immediately on `new-site`; `main` keeps the holding page until cutover.
**Notes:** "branch until cutover" — interpreted as: leave `main` alone with the holding page, work freely on `new-site`. Standard branch-cutover model.

---

## Font hosting

| Option | Description | Selected |
|--------|-------------|----------|
| Google Fonts via CDN | Per ARCHITECTURE default; preconnect + display=swap | |
| Self-host Epilogue woff2 | Download 400 + 700, serve from `/fonts/`, @font-face with font-display: swap | ✓ |

**User's choice:** Self-host.
**Notes:** Removes external DNS + TLS handshakes, helps PERF budget. Phase 1 deliverable includes obtaining the woff2 files.

---

## CSS file structure

| Option | Description | Selected |
|--------|-------------|----------|
| Vanilla CSS, 5-file split | tokens / base / layout / components / animations per ARCHITECTURE | ✓ |
| Vanilla CSS, single styles.css | Collapse to one file, fewer requests | |
| Tailwind CDN | Runtime utility classes via cdn.tailwindcss.com | |
| Tailwind CLI build | npm + Tailwind compile step | |

**User's choice:** Vanilla CSS, 5-file split (option A).
**Notes:** User initially asked for Tailwind. Pushed back: Tailwind conflicts with locked constraints (PROJECT.md: "no frameworks, no preprocessors, no bundlers, no npm deps"; FOUND-02: vanilla `tokens.css` with OKLCH custom properties; PERF budget incompatible with CDN runtime). User accepted vanilla CSS path.

---

## Cloudflare Pages wiring

| Option | Description | Selected |
|--------|-------------|----------|
| Manual dashboard config (no repo files) | Kris configures everything in CF console one-time | |
| Commit config files to repo | `_headers`, `_redirects` checked into repo as source of truth | ✓ |

**User's choice:** Commit config to repo; CF Pages already connected via GitHub and auto-deploys.
**Notes:** Pipeline is already running — Phase 1 confirms `new-site` preview URL works and adds `_headers` (minimal in P1, hardened in P5). No `wrangler.toml` (no Workers in V1).

---

## Section anchor list

| Option | Description | Selected |
|--------|-------------|----------|
| Eight sections (per ROADMAP SC#2 and FOUND-05) | Need to identify two extra sections | |
| Six sections (per HOMEPAGE-SPEC) | hero, situation, approach, work, services, contact | ✓ |

**User's choice:** Six per HOMEPAGE-SPEC.
**Notes:** Resolves real doc inconsistency. Phase 1 includes a small subtask to correct ROADMAP.md SC#2 and REQUIREMENTS.md FOUND-05 from "eight" → "six" so downstream phases (and the verifier) read consistent numbers.

---

## Phase 1 preview content

| Option | Description | Selected |
|--------|-------------|----------|
| Empty section tags only | `<section id="hero"></section>` etc., no body | ✓ |
| Labelled placeholder stubs | "PHASE 2: HERO" inside each empty section | |
| Skeletal placeholder copy | Lorem-style fillers | |

**User's choice:** Empty.
**Notes:** "not bothered about preview until visual changes" — visual review starts at Phase 2 when hero lands. Phase 1 preview just confirms the pipeline serves the shell.

## Claude's Discretion

- CSS reset choice (modern minimal vs hand-roll) — planner picks
- `_headers` rule details for Phase 1 (Phase 5 hardens)
- Epilogue woff2 subsetting (Latin vs full)
- Hamburger icon implementation (inline SVG vs CSS lines)
- Phase 1 favicon (placeholder, real one in Phase 5)

## Deferred Ideas

- `_headers` hardening (HSTS, CSP) → Phase 5
- Favicon + apple-touch-icon, robots.txt, JSON-LD, og: meta → Phase 5 (SEO-01..03)
- Lighthouse + perf audit → Phase 5 (PERF-01..04)
- Sticky-tab CSS + JS → Phase 4 (TAB-01..07, JS-03)

## Notable Pushback

- **Tailwind rejected.** User asked for Tailwind in CSS-structure question. All three delivery options (CDN, CLI build, v4 native) conflict with locked v1 constraints (no frameworks, no bundlers, no npm, PERF budget < 500KB excl images, FOUND-02 mandates vanilla `tokens.css`). Presented three real paths (vanilla CSS, Tailwind+amend-constraints-CDN, Tailwind+amend-constraints-build); user chose vanilla CSS.
