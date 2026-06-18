# Session Handover

This document captures the current state of the project for continuity between sessions. It is a living document — stale information is discarded and replaced with the latest relevant state.

## Current Tournament State

- **Stage:** Group stage in progress
- **Scores entered:** None yet (admin panel not yet built)
- **Group A:** Croatia, Belgium, Germany
- **Group B:** England, France, Argentina
- **Champion:** TBD

## What's Built

- [x] Project scaffolded (Vite + vanilla JS)
- [x] `CLAUDE.md` — project docs
- [x] `branding.md` — design system
- [x] `tournament-governance.md` — rules
- [x] `handover.md` — this file
- [x] `.gitignore`, `package.json`, `vite.config.js`

## In Progress

- Phase 0 bootstrap (creating GitHub repos, installing deps, creating stub HTML/src files)

## Known Issues / Blockers

- **Superpowers plugin:** Cannot be installed via this session (requires interactive Claude Code terminal). Run `/plugin install superpowers@claude-plugins-official` in a fresh `claude` terminal session before the next development session.
- **Trophy images:** The `public/assets/` images (trophy-legacy.png, certificate-bg.png) need to be copied from the tournament pack folder manually or via script.

## Next Steps (ordered)

1. Complete Phase 0: install npm deps, create stub index.html / admin.html / src files, create GitHub repos, push initial commit
2. Create `fsepoy/sepoy-cup-data` repo and push `2026/fc24/data.json` with the team/fixture schema
3. Phase 1: Build data layer (`src/lib/`) and Vitest unit tests
4. Phase 2: Design system CSS
5. Phase 3: Admin panel (priority — needed to enter existing match scores)
6. Phase 4–7: Public site, certificate, deploy, security review

## Environment Notes

- Working directory: `E:\dev\claude\projects\sepoy-cup-2026`
- GitHub account: `fsepoy` (authenticated via gh CLI, keyring)
- App URL (once deployed): `https://fsepoy.github.io/sepoy-cup-2026`
- Data URL: `https://raw.githubusercontent.com/fsepoy/sepoy-cup-data/main/2026/fc24/data.json`
- GitHub PAT: **Not stored here.** User must enter it in the admin panel at runtime. Stored in browser localStorage only.
- Node.js: v24.11.1
- gh CLI: v2.89.0
