---
phase: 01-foundations-deploy-pipeline
plan: 03
type: execute
wave: 3
depends_on:
  - "01-01"
  - "01-02"
files_modified:
  - _headers
  - .planning/STATE.md
autonomous: false
requirements:
  - DEPLOY-01
  - DEPLOY-02

must_haves:
  truths:
    - "_headers file at repo root sets Cache-Control: immutable on /fonts/*, day-cache on /css/* and /js/*, basic security headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options) on /*"
    - "After pushing the new-site branch, Cloudflare Pages auto-deploys the shell to a stable preview URL"
    - "The branch-alias preview URL (typically new-site.<project>.pages.dev) is captured in .planning/STATE.md so every later phase references one URL"
    - "main branch on origin remains unchanged — git log origin/main shows no Phase 1 commits"
    - "The deployed preview loads index.html, the five CSS files, both Epilogue woff2 files, and js/main.js without 404s"
  artifacts:
    - path: "_headers"
      provides: "Cloudflare Pages cache + basic security headers"
      contains: "Cache-Control"
      contains_also: "X-Content-Type-Options: nosniff"
      contains_also_2: "/fonts/*"
    - path: ".planning/STATE.md"
      provides: "Captured preview URL plus updated phase progress"
      contains: "pages.dev"
  key_links:
    - from: "_headers /fonts/*"
      to: "fonts/epilogue-{400,700}.woff2 served by Cloudflare Pages"
      via: "Cache-Control: public, max-age=31536000, immutable"
      pattern: "Cache-Control:.*immutable"
    - from: "_headers /*"
      to: "every response from the preview"
      via: "X-Content-Type-Options, Referrer-Policy, X-Frame-Options"
      pattern: "X-Content-Type-Options:[[:space:]]*nosniff"
    - from: "git push origin new-site"
      to: "Cloudflare Pages preview deploy"
      via: "Cloudflare auto-deploy trigger (D-07: already wired)"
---

<objective>
Add the `_headers` file Cloudflare Pages reads on deploy (font caching + basic security headers), push the Phase 1 shell to `new-site`, confirm the auto-deploy triggers, and capture the stable branch-alias preview URL in STATE.md so every later phase references one URL (DEPLOY-01, DEPLOY-02 per CONTEXT.md D-08, D-09).

Purpose: The deploy pipeline is the contract every later phase depends on — push to `new-site`, see the change at the preview URL. Phase 1 verifies the pipeline works end-to-end before any visual content is built.

Output: `_headers` at repo root, a successful Cloudflare Pages deploy of the Phase 1 shell, preview URL recorded in `.planning/STATE.md`, `main` branch confirmed unchanged.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md
@.planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md
@.planning/phases/01-foundations-deploy-pipeline/01-01-SUMMARY.md
@.planning/phases/01-foundations-deploy-pipeline/01-02-SUMMARY.md
@CLAUDE.md
@index.html

<interfaces>
<!-- Cloudflare Pages contract (D-07: already wired). -->

Production branch: main (serves the existing holding page at looktwice.uk — DO NOT TOUCH per D-01)
Preview branches: new-site (and any other branch — auto-deploys on push)

Per-deploy URL pattern: <commit-hash>.<project>.pages.dev (changes every push)
Branch-alias URL pattern: new-site.<project>.pages.dev (stable across pushes — capture this)

`_headers` file syntax (verified Cloudflare docs 2026-04-29):
  Plain text at repo root.
  Path patterns at column 0 (e.g., `/fonts/*`).
  Header rules indented two spaces (e.g., `  Cache-Control: ...`).
  Blank line between path blocks.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write _headers file with cache rules + basic security headers</name>
  <files>_headers</files>
  <read_first>
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Pitfall 8 cache-control on woff2, Code Examples — `_headers` file verified Cloudflare syntax)
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-08 — minimal _headers, leave room for Phase 5 hardening; deferred section — HSTS/CSP/COOP/COEP are Phase 5)
  </read_first>
  <action>
    Create `_headers` at the repo root (NOT inside any subdirectory). Verbatim content (Cloudflare reads this on deploy — syntax is whitespace-sensitive):

    ```
    /fonts/*
      Cache-Control: public, max-age=31536000, immutable
      Access-Control-Allow-Origin: *

    /css/*
      Cache-Control: public, max-age=86400

    /js/*
      Cache-Control: public, max-age=86400

    /*
      X-Content-Type-Options: nosniff
      Referrer-Policy: strict-origin-when-cross-origin
      X-Frame-Options: DENY
    ```

    Format rules (Cloudflare `_headers` spec):
    - Path patterns (`/fonts/*`, `/css/*`, `/js/*`, `/*`) start at column 0.
    - Header rules under each path are indented exactly two spaces.
    - One blank line between path blocks.
    - No trailing whitespace.
    - File ends with a newline.

    Why these values:
    - `immutable` on `/fonts/*` is safe because woff2 binaries change only by deliberate file replacement (which busts cache via path/deploy).
    - `Access-Control-Allow-Origin: *` on fonts is conventional defensive — same-origin doesn't need it for V1, but future-proofs subdomain fetches.
    - `max-age=86400` (24h) on `/css/*` and `/js/*` is conservative for a phase still under active development. Phase 5 may lengthen.
    - `X-Content-Type-Options: nosniff` blocks MIME-sniffing attacks.
    - `Referrer-Policy: strict-origin-when-cross-origin` is the modern default — sends origin (no path) on cross-origin requests, full referrer same-origin.
    - `X-Frame-Options: DENY` prevents clickjacking.

    Out of scope for Phase 1 (deferred to Phase 5 per CONTEXT.md):
    - HSTS (Strict-Transport-Security)
    - Content-Security-Policy
    - Cross-Origin-Opener-Policy / Cross-Origin-Embedder-Policy
    - Permissions-Policy

    Do NOT add any of those in this task — Phase 5 hardens.

    Do NOT create `_redirects` — single-page V1 has no rewrites (CONTEXT.md D-08). Phase 1 is no-redirects.

    Do NOT create a `wrangler.toml` — V1 uses no Workers (CONTEXT.md D-08).
  </action>
  <verify>
    <automated>test -f _headers && grep -q "^/fonts/\\*" _headers && grep -q "^/css/\\*" _headers && grep -q "^/js/\\*" _headers && grep -q "^/\\*" _headers && grep -q "^  Cache-Control: public, max-age=31536000, immutable" _headers && grep -q "^  Access-Control-Allow-Origin: \\*" _headers && grep -q "^  Cache-Control: public, max-age=86400" _headers && grep -q "^  X-Content-Type-Options: nosniff" _headers && grep -q "^  Referrer-Policy: strict-origin-when-cross-origin" _headers && grep -q "^  X-Frame-Options: DENY" _headers && ! grep -q "Strict-Transport-Security" _headers && ! grep -q "Content-Security-Policy" _headers && ! test -f _redirects && ! test -f wrangler.toml</automated>
  </verify>
  <acceptance_criteria>
    - `_headers` exists at repo root (not in a subdirectory)
    - Contains four path blocks: `/fonts/*`, `/css/*`, `/js/*`, `/*`
    - `/fonts/*` block has `Cache-Control: public, max-age=31536000, immutable` and `Access-Control-Allow-Origin: *`
    - `/css/*` and `/js/*` blocks have `Cache-Control: public, max-age=86400`
    - `/*` block has the three security headers (X-Content-Type-Options, Referrer-Policy, X-Frame-Options) with the values above
    - Each header rule indented exactly two spaces
    - No HSTS, no CSP, no COOP/COEP (Phase 5 hardens)
    - No `_redirects` file, no `wrangler.toml` (out of scope)
  </acceptance_criteria>
  <done>_headers committed at repo root with cache + basic security; ready for Cloudflare to read on next deploy.</done>
</task>

<task type="auto">
  <name>Task 2: Stage, commit, and push the Phase 1 shell to origin/new-site</name>
  <files>(commits and pushes — no file modifications in this task)</files>
  <read_first>
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-01 main untouched; D-09 capture preview URL after push)
    - CLAUDE.md (branch policy — all work on new-site)
  </read_first>
  <action>
    Step A — branch safety:
      Run `git rev-parse --abbrev-ref HEAD`. Confirm output is `new-site`. If anything else, abort.

    Step B — review staged + unstaged state:
      Run `git status` and `git diff --stat` to confirm the changeset includes only Phase 1 files:
        - index.html (overwritten in plan 02)
        - css/tokens.css, css/base.css, css/layout.css, css/components.css, css/animations.css (created in plans 01/02)
        - js/main.js (created in plan 02)
        - fonts/epilogue-400.woff2, fonts/epilogue-700.woff2, fonts/OFL.txt (created in plan 01)
        - _headers (created in this plan task 1)
        - .planning/REQUIREMENTS.md (doc-fix in plan 02)
        - .planning/ROADMAP.md (doc-fix in plan 02)
        - .planning/phases/01-foundations-deploy-pipeline/*-PLAN.md (plan files)
        - .planning/phases/01-foundations-deploy-pipeline/01-01-SUMMARY.md, 01-02-SUMMARY.md (summaries)
        - .planning/STATE.md (will update in task 3)
        - css/.gitkeep, js/.gitkeep, images/.gitkeep (markers)

      Reject the push if any unrelated files appear (don't accidentally `git add -A` over an unrelated change).

    Step C — stage and commit:
      Use `gsd-tools commit` (per workflow conventions) to stage these files explicitly and commit:

        node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" commit "feat(phase-1): foundations + deploy pipeline" \
          --files index.html _headers \
                  css/tokens.css css/base.css css/layout.css css/components.css css/animations.css \
                  js/main.js \
                  fonts/epilogue-400.woff2 fonts/epilogue-700.woff2 fonts/OFL.txt \
                  css/.gitkeep js/.gitkeep images/.gitkeep \
                  .planning/REQUIREMENTS.md .planning/ROADMAP.md \
                  .planning/phases/01-foundations-deploy-pipeline/01-01-tokens-base-fonts-PLAN.md \
                  .planning/phases/01-foundations-deploy-pipeline/01-02-shell-nav-PLAN.md \
                  .planning/phases/01-foundations-deploy-pipeline/01-03-deploy-pipeline-PLAN.md \
                  .planning/phases/01-foundations-deploy-pipeline/01-01-SUMMARY.md \
                  .planning/phases/01-foundations-deploy-pipeline/01-02-SUMMARY.md

      If `gsd-tools commit` is unavailable, fall back to:
        git add <each-file>
        git commit -m "feat(phase-1): foundations + deploy pipeline"

      NEVER use `git add -A` or `git add .` (CLAUDE.md / Bash safety: avoid blanket adds).

    Step D — sanity check before push:
      git log -1 --oneline                # confirm commit landed on new-site
      git rev-parse --abbrev-ref HEAD     # confirm still on new-site
      git status                          # confirm working tree clean (or only STATE.md unstaged for task 3)
      git log origin/main..HEAD --oneline # should show only the new commit (and any prior new-site commits) — never any commit on main side

    Step E — push to origin/new-site:
      git push origin new-site

      If the push errors with "rejected" or "non-fast-forward":
        git fetch origin new-site
        git status
      Diagnose before retrying. Do NOT use `git push --force` to override (CLAUDE.md / git safety).

    Step F — confirm main untouched on remote:
      git fetch origin main
      git log origin/main -1 --oneline   # should still be the holding-page commit, NOT this Phase 1 commit
      git diff origin/main HEAD -- index.html | head -20  # should show a substantive diff (holding page vs new shell)

    Do NOT merge new-site into main. Do NOT delete the holding page on main. Do NOT change the Cloudflare Pages production-branch setting (it stays `main` until Phase 5 cutover).
  </action>
  <verify>
    <automated>[ "$(git rev-parse --abbrev-ref HEAD)" = "new-site" ] && git log -1 --oneline | grep -qE "phase[ -]?1|foundations" && git status --porcelain | grep -vE "^\\?\\? " | grep -vE "STATE\\.md" | wc -l | grep -q "^[[:space:]]*0$" && git fetch origin main 2>/dev/null && [ "$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')" != "0" ] && git ls-remote origin new-site | grep -q "$(git rev-parse HEAD)"</automated>
  </verify>
  <acceptance_criteria>
    - HEAD is on `new-site` branch
    - Latest commit message references "phase 1" or "foundations"
    - Working tree clean except for `.planning/STATE.md` (updated in task 3)
    - `git log origin/main..HEAD` shows at least one commit (this push is ahead of main)
    - `git ls-remote origin new-site` returns a SHA matching local HEAD (push succeeded)
    - origin/main is unchanged — `git log origin/main -1` still shows the pre-Phase-1 holding-page commit
    - No `git push --force` was used
  </acceptance_criteria>
  <done>Phase 1 shell pushed to origin/new-site; main untouched; Cloudflare auto-deploy is now triggered.</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Verify Cloudflare Pages preview deploy + capture URL in STATE.md</name>
  <files>.planning/STATE.md</files>
  <read_first>
    - .planning/phases/01-foundations-deploy-pipeline/01-CONTEXT.md (D-09 capture preview URL)
    - .planning/phases/01-foundations-deploy-pipeline/01-RESEARCH.md (Pitfall 2 prod-vs-preview branch confusion, Open Question 4 branch-alias URL preferred over per-commit hash URL)
    - .planning/STATE.md (current contents — find the right place to add the preview URL; "Configuration" or "Current Position" section)
  </read_first>
  <what-built>
    Phase 1 shell pushed to `new-site`. Cloudflare Pages should now have auto-deployed it. We need a human to confirm the deploy succeeded, capture the stable branch-alias preview URL, and write it into STATE.md.
  </what-built>
  <how-to-verify>
    Hand-off to the user (Kris or Jamie). Provide these exact instructions:

    1. Open the Cloudflare dashboard: https://dash.cloudflare.com/ → Workers & Pages → the `looktwice` (or however it's named) project.

    2. Confirm in the **Deployments** tab that there is a successful deployment (green check) for branch `new-site` with the SHA matching the commit just pushed. Status should read "Success" (not "Failed", not "In progress" — wait if still building).

    3. Confirm in **Settings → Builds & deployments** that:
       - Production branch is `main` (do NOT change this).
       - Preview branches include `new-site` (or `*` for all).

    4. Find the **branch alias** URL — usually shown next to the deployment. Format is typically:
         https://new-site.<project-name>.pages.dev
       (Per RESEARCH.md Open Question 4 — capture the branch alias, NOT the per-commit hash URL. Branch alias stays stable across pushes; per-commit hash changes every deploy.)

    5. Open the branch-alias URL in a browser. Confirm:
       - The page loads (not 404).
       - The browser tab title says "Look Twice" (DEPLOY-02).
       - DevTools Network tab shows: `index.html` 200, `tokens.css` 200, `base.css` 200, `layout.css` 200, `components.css` 200, `animations.css` 200, `epilogue-400.woff2` 200, `epilogue-700.woff2` 200, `main.js` 200. Zero 404s on the five CSS files, two woff2 files, or main.js.
       - The nav shows "Look Twice" wordmark (white, since the page background is Linen and the empty hero section sits at scroll-top with transparent nav over Linen — text appears white-on-Linen which will look low-contrast in Phase 1 only; this is expected because the nav assumes a Hot Pink hero behind it that lands in Phase 2). Don't fix this — Phase 2 fixes it implicitly by painting the hero.
       - On a viewport ≤1024px (or DevTools mobile preview), hamburger button is visible. Click it; Midnight overlay slides down. Click a link or close button or press Escape; overlay closes.

    6. Confirm `looktwice.uk` (production domain on `main`) STILL serves the old holding page (DM Sans + Syne + warm gradient). Browse to it in a separate tab. Per D-01, main must be untouched.

    7. Reply with the captured branch-alias URL and "approved" — or describe any issue.

    Once approved, the assistant performs the STATE.md update:

    Edit `.planning/STATE.md` to add the preview URL. Insert a new line under the "Current Position" section after `**Status:** Roadmap approved, awaiting first phase plan` (which itself should be updated to reflect Phase 1 in progress):

    ```markdown
    - **Preview URL:** https://new-site.<project>.pages.dev (Cloudflare Pages branch alias — stable across pushes)
    ```

    Also append a line under "Decisions" section:
    ```markdown
    - Phase 1 deployed to Cloudflare Pages preview at <URL captured above>
    ```

    Update the progress fields in the YAML frontmatter:
    ```yaml
    progress:
      total_phases: 5
      completed_phases: 0          # leave at 0 — Phase 1 isn't complete until verifier signs off
      total_plans: 3               # Phase 1 added 3 plans
      completed_plans: 3           # if all three plans verified complete; otherwise leave at 2 and update on final verify
    ```

    And update `last_updated` to the current date and `status` to "Phase 1 plans 01–03 executed; preview live; awaiting verifier".

    Use the `Edit` tool — do not rewrite the whole STATE.md.
  </how-to-verify>
  <resume-signal>Type "approved &lt;branch-alias-URL&gt;" with the captured URL, or describe any blockers (deploy failed, 404s, main accidentally changed).</resume-signal>
  <action>
    See <how-to-verify> above for full handoff instructions. Summary: open Cloudflare dashboard, confirm green deploy on new-site branch, capture the branch-alias preview URL, open it in a browser, confirm index.html + 5 CSS files + 2 woff2 + main.js return 200 OK, confirm production looktwice.uk still serves the holding page, then update .planning/STATE.md with the captured URL, update status to "Phase 1 plans 01–03 executed; preview live; awaiting verifier", update last_updated to today, and update progress.total_plans to 3.
  </action>
  <verify>
    <automated>grep -qE "Preview URL.*new-site\\..+\\.pages\\.dev" .planning/STATE.md && grep -q "pages.dev" .planning/STATE.md && grep -q "Phase 1 plans 01" .planning/STATE.md</automated>
  </verify>
  <acceptance_criteria>
    - User confirms the Cloudflare deploy succeeded for the new-site branch with matching SHA
    - User captures the branch-alias preview URL (https://new-site.&lt;project&gt;.pages.dev format)
    - User confirms the preview loads index.html, all five CSS files, both woff2 files, main.js — zero 404s on those nine assets
    - User confirms hamburger overlay opens and closes correctly on mobile viewport
    - User confirms `looktwice.uk` (production on main) still serves the holding page — main untouched
    - .planning/STATE.md is updated with the captured URL, status moved to "Phase 1 plans 01–03 executed; preview live; awaiting verifier", `last_updated` to today, progress fields updated
  </acceptance_criteria>
  <done>Preview URL is captured, recorded in STATE.md as the single source of truth for every later phase to reference, and main remains the holding page.</done>
</task>

</tasks>

<verification>
End-of-plan checks (sequential):

```bash
# 1. _headers in shape
test -f _headers
grep -q "Cache-Control: public, max-age=31536000, immutable" _headers
grep -q "X-Content-Type-Options: nosniff" _headers

# 2. Push landed on new-site, main untouched
[ "$(git rev-parse --abbrev-ref HEAD)" = "new-site" ]
git fetch origin main
[ "$(git log origin/main..HEAD --oneline | wc -l | tr -d ' ')" -gt "0" ]
git ls-remote origin new-site | grep -q "$(git rev-parse HEAD)"

# 3. Preview URL captured in STATE.md
grep -q "pages.dev" .planning/STATE.md
grep -qE "Preview URL.*new-site\\..+\\.pages\\.dev" .planning/STATE.md

# 4. STATE.md status updated
grep -q "Phase 1 plans 01–03 executed" .planning/STATE.md
```

Cloudflare side (human-verified in Task 3 checkpoint):
- New-site preview shows green deployment
- Branch-alias URL serves index.html with all assets 200 OK
- Production main URL (looktwice.uk) still serves the holding page
</verification>

<success_criteria>
- _headers committed with cache + basic security headers (DEPLOY-01 setup contract)
- Phase 1 shell pushed to origin/new-site without forcing or rewriting history
- Cloudflare Pages auto-deploy succeeded for new-site (DEPLOY-01 verified)
- Branch-alias preview URL is reachable and serves the shell with all assets 200 OK (DEPLOY-02)
- Preview URL recorded in STATE.md as the canonical reference for every later phase
- main branch on origin is unchanged — production site continues to serve the holding page (D-01, D-02)
- No `git push --force`, no merge of new-site into main, no Cloudflare production-branch change
</success_criteria>

<output>
After completion, create `.planning/phases/01-foundations-deploy-pipeline/01-03-SUMMARY.md` documenting: _headers rules added, commit SHA pushed, captured preview URL, Cloudflare deploy status, confirmation that main remained on its prior commit. Note any deferred work for Phase 5 (HSTS, CSP, COOP/COEP, longer cache durations on /css/* and /js/*).
</output>
