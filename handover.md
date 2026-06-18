# Session Handover

This document captures the current state of the project for continuity between sessions. Stale information is discarded and replaced with the latest relevant state.

## Current Tournament State

- **Stage:** Group stage in progress
- **Scores entered:** None yet — admin panel is ready; use it to enter existing scores
- **Group A:** Croatia, Belgium, Germany
- **Group B:** England, France, Argentina
- **Champion:** TBD

## What's Built (all phases complete)

- [x] Git repo, GitHub repos created (`fsepoy/sepoy-cup-2026`, `fsepoy/sepoy-cup-data`)
- [x] Vite + vanilla JS scaffold with GSAP and html2canvas
- [x] `CLAUDE.md`, `branding.md`, `tournament-governance.md`, `handover.md`
- [x] Data layer: `src/lib/data.js`, `standings.js`, `knockout.js`, `github.js`, `utils.js`
- [x] 20 unit tests (Vitest) — all passing
- [x] Design system CSS (`src/style.css`) — full token set, navy+gold
- [x] Admin panel (`admin.html`) — PAT input, score entry, GitHub API write, danger zone
- [x] Public site (`index.html`) — Hero, Group Standings, Fixtures, Knockout Bracket, Champion section
- [x] Certificate generator (html2canvas, PNG download)
- [x] GitHub Actions auto-deploy workflow (`.github/workflows/deploy.yml`)
- [x] GitHub Pages enabled — site live at `https://fsepoy.github.io/sepoy-cup-2026/`
- [x] Security review complete

## In Progress

Nothing — all planned phases delivered.

## Known Issues / Accepted Risks

- **Trophy image:** The hero shows `trophy-legacy.png` which is a card-format image (showing the 04 badge and description). If you want just the trophy sculpture without the card, you'd need to crop the image from `sepoy_cup_2026_tropy_choices.png` (row of 4 trophies) to extract just #04.
- **Flag emojis in preview:** Some environments (Chromium in preview panel) render flag emojis as 2-letter ISO codes (HR, BE, DE). On real browsers on Windows/Mac with emoji fonts, they display as proper flags. No fix needed.
- **innerHTML + JSON data:** Team names/flags are rendered via `innerHTML` template literals. Protected by `escapeHtml()` in all public components. Accepted risk: data source (`fsepoy/sepoy-cup-data`) is organizer-controlled, making XSS exploitation require repo compromise first.
- **PAT localStorage:** PAT is stored in browser `localStorage` under key `sc2026_pat`. Accepted risk for single-admin private use case; documented in admin UI.
- **Superpowers plugin:** Must be installed in an interactive Claude Code terminal session: `/plugin install superpowers@claude-plugins-official`

## Next Steps (ordered)

1. **Enter existing match scores** — navigate to `https://fsepoy.github.io/sepoy-cup-2026/admin.html`, enter your GitHub PAT (with `repo` scope), then save scores for any matches already played
2. **Install superpowers plugin** — run `/plugin install superpowers@claude-plugins-official` in an interactive `claude` terminal
3. **Trophy image** (optional) — crop Legacy Cup (#04) from `Sepoy_Cup_2026_Tournament_Pack/sepoy_cup_2026_tropy_choices.png` and replace `public/assets/trophy-legacy.png`
4. **Custom domain** (optional) — configure a CNAME in GitHub Pages settings if you want a custom domain

## Environment Notes

- Working directory: `E:\dev\claude\projects\sepoy-cup-2026`
- GitHub account: `fsepoy` (authenticated via gh CLI, keyring)
- Public site URL: `https://fsepoy.github.io/sepoy-cup-2026/`
- Admin URL: `https://fsepoy.github.io/sepoy-cup-2026/admin.html`
- Data URL: `https://raw.githubusercontent.com/fsepoy/sepoy-cup-data/main/2026/fc24/data.json`
- Data repo: `https://github.com/fsepoy/sepoy-cup-data`
- GitHub PAT: **Not stored anywhere in this project.** User enters at runtime in admin panel.
- Node.js: v24.11.1 | gh CLI: v2.89.0 | Vite: 6.4.3 | GSAP: 3.12.7
- Last deploy: commit `d21209d` — security review pass
