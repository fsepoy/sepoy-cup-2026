# Session Handover

This document captures the current state of the project for continuity between sessions. Stale information is discarded and replaced with the latest relevant state.

## Current Tournament State

- **Stage:** Knockout stage — group stage is complete
- **Group A:** Belgium (1st), Croatia (2nd), Germany (eliminated)
- **Group B:** Argentina (1st), France (2nd), England (eliminated)
- **Semi-Finals:** SF1 = Belgium vs France · SF2 = Argentina vs Croatia (upcoming — no scores yet)
- **3rd Place / Final:** TBD (pending SF results)
- **Champion:** TBD

## What's Built (all phases complete)

- [x] Git repo, GitHub repos created (`fsepoy/sepoy-cup-2026`, `fsepoy/sepoy-cup-data`)
- [x] Vite + vanilla JS scaffold with GSAP and html2canvas
- [x] `CLAUDE.md`, `branding.md`, `tournament-governance.md`, `handover.md`
- [x] Data layer: `src/lib/data.js`, `standings.js`, `knockout.js`, `github.js`, `utils.js`
- [x] 21 unit tests (Vitest) — all passing
- [x] Design system CSS (`src/style.css`) — full token set, navy+gold
- [x] Admin panel (`admin.html`) — PAT input, score entry (incl. knockout rounds), GitHub API write, danger zone
- [x] Public site (`index.html`) — Hero, Group Standings, Fixtures, Knockout Bracket, Champion section
- [x] Certificate generator (html2canvas, PNG download)
- [x] GitHub Actions auto-deploy workflow (`.github/workflows/deploy.yml`)
- [x] GitHub Pages enabled — site live at `https://fsepoy.github.io/sepoy-cup-2026/`
- [x] Security review complete

## Features Added (previous sessions)

- **Score save re-render fix**: Admin re-renders scores section from freshly-written data after each save (bypasses CDN cache).
- **Flag encoding fix**: `getFileMeta` now uses `TextDecoder` to properly decode UTF-8 base64 — asymmetric encoding bug fixed.
- **Knockout auto-population**: Group stage completion triggers automatic bracket seeding:
  - Public fixtures section shows real team names for SF1/SF2 (resolved from standings).
  - 3rd place and Final slots resolve automatically once SF scores are entered in admin.
  - Group standings show "GROUP COMPLETE" banner and "Q" qualified badge for top-2 teams.
  - Admin knockout rows are now unlocked once teams are seeded (no more TBD-disabled buttons).
  - On first save of a knockout score, real team IDs are persisted to `data.json`.

## Known Issues / Accepted Risks

- **Trophy image:** The hero shows `trophy-legacy.png` which is a card-format image. If you want just the trophy sculpture, crop from `Sepoy_Cup_2026_Tournament_Pack/sepoy_cup_2026_tropy_choices.png`.
- **Flag emojis in preview:** Some Chromium builds render flags as 2-letter ISO codes. On real browsers on Windows/Mac they display correctly.
- **innerHTML + JSON data:** Protected by `escapeHtml()` in all public components. Accepted risk: data source is organizer-controlled.
- **PAT localStorage:** Stored under key `sc2026_pat`. Accepted for single-admin private use.

## Next Steps (ordered)

1. **Enter SF scores** — navigate to `https://fsepoy.github.io/sepoy-cup-2026/admin.html`, enter PAT, save SF1 and SF2 scores. The 3rd place and Final teams will auto-populate.
2. **Enter 3PL and FIN scores** — same flow once SF results are in.
3. **Trophy image** (optional) — crop Legacy Cup (#04) from `Sepoy_Cup_2026_Tournament_Pack/sepoy_cup_2026_tropy_choices.png`.
4. **Custom domain** (optional) — configure a CNAME in GitHub Pages settings.

## Environment Notes

- Working directory: `E:\dev\claude\projects\sepoy-cup-2026`
- GitHub account: `fsepoy` (authenticated via gh CLI, keyring)
- Public site URL: `https://fsepoy.github.io/sepoy-cup-2026/`
- Admin URL: `https://fsepoy.github.io/sepoy-cup-2026/admin.html`
- Data URL: `https://raw.githubusercontent.com/fsepoy/sepoy-cup-data/main/2026/fc24/data.json`
- Data repo: `https://github.com/fsepoy/sepoy-cup-data`
- GitHub PAT: **Not stored anywhere in this project.** User enters at runtime in admin panel.
- Node.js: v24.11.1 | gh CLI: v2.89.0 | Vite: 6.4.3 | GSAP: 3.12.7
