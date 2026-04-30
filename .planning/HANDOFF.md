---
purpose: Cloud-session handoff — context for any Claude instance picking up this project without local GSD installed.
last_updated: 2026-04-30
---

# Handoff: looktwice.uk V1

## TL;DR for cloud Claude

This project uses GSD (a planning framework) on the original author's local machine. **You don't have GSD slash commands.** That is fine. The state machine is plain markdown in `.planning/`. Read those files, continue the work in plain English. Mimic the patterns established in Phases 1 and 2.

## Where state lives

| File | Purpose |
|---|---|
| `.planning/PROJECT.md` | Project context, core value, evolution rules |
| `.planning/ROADMAP.md` | All 5 phases, goals, success criteria, plan lists |
| `.planning/STATE.md` | Current phase, position, last-completed plan |
| `.planning/REQUIREMENTS.md` | All requirement IDs (HERO-01, SITU-03 etc.) and traceability |
| `.planning/phases/<N>-<slug>/` | Per-phase: PLAN files, SUMMARY files, VERIFICATION.md, HUMAN-UAT.md |
| `CLAUDE.md` | Hard project rules (tech stack, design bans, performance budget) |

When you start a session: read STATE.md first, then ROADMAP.md, then the active phase folder.

## Current status (as of 2026-04-30)

**Phase 2 (Hero & Situation): execution complete, verification = `human_needed`.**

Open items:

1. **Phase 2 visual bug — chip stretches full width.** `.situation__header` is flex-column with default `align-items: stretch` so the `.chip` span stretches instead of hugging text. Fix: add `align-self: flex-start` to `.chip` in `css/components.css` (preserves reusability for Phase 3+ chips). Test by opening the situation section on the Cloudflare preview after pushing.

2. **Phase 2 focus state — `.btn--primary:focus-visible` flips bg→Hot Pink, color→white.** [css/components.css:274](css/components.css:274). Conflicts with UI-SPEC line 299 (should inherit global Hot Pink outline). On the Hot Pink hero this makes the button vanish on focus. Decision pending: either separate focus from hover and let global outline apply (it'll be invisible on Hot Pink — UI-SPEC has this gap), or override to a Midnight outline for primary buttons. Ask the user before changing.

3. **Phase 1 carryover bug uncovered by Phase 2 — nav illegible at top.** Nav is `position: sticky` with white text at scroll=0. It pushes the hero down instead of overlaying, so white text sits over the Linen body bg above the hero. Fix path: switch nav to `position: fixed` so the hero starts at y=0 with nav floating over Hot Pink. This is Phase 1 scope, but only became visible once Phase 2 landed. Either patch in Phase 2 verification gap-closure or add a separate gap plan.

4. **Phase 1 carryover — hamburger + nav links both visible at desktop ≥1025px.** Nav CSS isn't hiding the hamburger on desktop. Phase 1 scope.

5. **Phase 2 HUMAN-UAT items still pending** in `.planning/phases/02-hero-situation/02-HUMAN-UAT.md`:
   - Hero visual paint check
   - Scroll-reveal stagger feel
   - prefers-reduced-motion behaviour
   - Keyboard focus rings
   - Responsive 1440 → 375

The user verifies these by opening the Cloudflare Pages preview URL on their phone after each push.

## How to continue (plain-English playbook)

### Resuming Phase 2 (close out gaps)

1. Read `.planning/phases/02-hero-situation/02-VERIFICATION.md`.
2. Apply the chip-stretch fix in `css/components.css`. Commit with message `fix(02): chip hugs text via align-self`.
3. Discuss the focus-state ambiguity with the user — don't pick blindly.
4. Decide if nav illegibility lands as Phase 2 gap closure or a Phase 1 gap plan. Either way: open a new plan file at `.planning/phases/02-hero-situation/02-04-...-PLAN.md` (or new phase folder) using Phase 1's plan files as a template.
5. Once gaps close, update VERIFICATION.md `status:` from `human_needed` to `passed` (after user confirms HUMAN-UAT), then mark phase complete in ROADMAP.md and advance STATE.md.

### Starting Phase 3 (Mid-page Story)

ROADMAP.md Phase 3 is fully scoped: goal, requirements (INTR/WORK/SERV), success criteria. Plans don't exist yet.

1. Read [ROADMAP.md:56-67](.planning/ROADMAP.md) for Phase 3 goal and success criteria.
2. Read Phase 2's plans as templates: `.planning/phases/02-hero-situation/02-01-hero-PLAN.md` etc.
3. Draft 2-3 plans for Phase 3. Suggested split:
   - `03-01-interrupt-PLAN.md` — Signal Orange positioning interrupt (INTR-01..04)
   - `03-02-work-PLAN.md` — Linen work-placeholder section (WORK-01..04)
   - `03-03-services-PLAN.md` — three problem-first services (SERV-01..05)
4. Each plan needs frontmatter (copy from Phase 2 plans), a `<objective>`, and 2-3 atomic tasks.
5. Execute each plan: read it, implement, commit each task atomically, write SUMMARY.md.
6. After all plans land, write VERIFICATION.md (mimic [02-VERIFICATION.md](.planning/phases/02-hero-situation/02-VERIFICATION.md)).
7. Update ROADMAP.md (`[ ]` → `[x]` on Phase 3 row) and STATE.md.

Same pattern for Phases 4 and 5.

### Commit conventions

Match the existing log:
- `feat(<phase-plan>): <what>` — implementation
- `fix(<phase-plan>): <what>` — bug fix
- `docs(<phase-plan>): complete <plan> plan` — when SUMMARY.md lands
- `docs(state): <what>` — STATE.md or ROADMAP.md updates
- `test(<phase>): <what>` — UAT or VERIFICATION updates

Don't use em-dashes in commit messages (project ban).

### Hard rules from CLAUDE.md (non-negotiable)

- Plain HTML + CSS + vanilla JS only. No frameworks, no preprocessors, no npm deps for V1.
- Epilogue 400 + 700 only. No 500 weight. No second font family.
- WCAG AA on every surface. Respect prefers-reduced-motion.
- No card shadows, no gradient text, no glassmorphism, no mid-tone greys, no decorative card grids, no em-dashes in copy.
- Brand gradient appears in exactly one place — the floating sticky tab (Phase 4).
- Page weight < 500KB excluding images. LCP < 2.5s.
- All work on `new-site` branch. `main` is the live holding page — never touch until cutover.

### Visual verification on phone

1. Push to `new-site`.
2. Wait ~30 seconds for Cloudflare Pages to deploy.
3. Open the preview URL on your phone (the original author had this URL — likely `https://new-site.looktwice-uk.pages.dev` or similar — confirm in Cloudflare Pages dashboard).
4. Eyeball the change. Tell Claude what's wrong. Iterate.

## What's NOT in this repo

- The local GSD installation (`~/.claude/get-shit-done/`, `~/.claude/agents/gsd-*.md`, `~/.claude/commands/gsd/`) — user-machine only.
- The `.claude/` config directory — gitignored except for `launch.json`.
- The `inspo/` reference images — gitignored.
- Hero supporting image (`images/hero-supporting.webp`) — deferred per Phase 2 plan D-10. Midnight token-block fallback renders until it ships. Single-file commit lands it later, no markup change needed.

## Local preview (Mac only)

`.claude/launch.json` configures a Python http.server on port 4173 for local Claude Preview MCP. This only works on the Mac with the Claude Preview plugin installed. Cloud and phone can't use it — go via Cloudflare Pages preview instead.
