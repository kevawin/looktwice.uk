# Deferred Items — Phase 01

## Pre-existing in holding index.html (resolves in plan 02)

- Root `index.html` (holding page) contains Google Fonts `<link>` tags (Syne + DM Sans). Plan 02 overwrites this file with the V1 shell which uses self-hosted Epilogue only. Out of scope for plan 01 per its own instruction "Do NOT touch the existing root index.html in this task. Plan 02 overwrites it after the shell is ready".

## OFL.txt source substitution

- Plan listed `https://raw.githubusercontent.com/fontsource/font-files/main/fonts/google/epilogue/OFL.txt` as primary; that URL 404s. Used the documented fallback `https://openfontlicense.org/documents/OFL.txt` (SIL canonical OFL 1.1) and prepended the Epilogue copyright header per plan instruction.
