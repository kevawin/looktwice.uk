#!/usr/bin/env bash
# Cloudflare Pages build wrapper — set "Build command" to: bash build.sh
# Output directory: dist/
#
# Cloudflare injects CF_PAGES_BRANCH at build time (read-only env var).
# This gate builds only on new-site; all other branches (including main)
# exit 0 without touching dist/ so the holding page deploys as-is.
#
# Supply-chain note (T-12-SC): uses npm ci against committed package-lock.json.
# Do NOT change to npm install — npm ci enforces the lockfile exactly.
set -euo pipefail

if [ "${CF_PAGES_BRANCH}" = "new-site" ]; then
  echo "Branch 'new-site' — running build."
  npm ci
  npm run build
else
  echo "Branch '${CF_PAGES_BRANCH}' — no build (holding page deploys as-is)."
  # main must ship its own files unchanged.
  # Do NOT create or alter dist/ here — Cloudflare will deploy the branch
  # files from the repo root directly (A1 caveat: see cutover playbook).
fi
