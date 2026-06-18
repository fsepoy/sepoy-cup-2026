# Sepoy Cup 2026

A family FC24 gaming tournament webapp — single-page static site backed by a GitHub-hosted JSON data store. No backend, no database, zero hosting cost.

## Project Purpose

Track and display the Sepoy Cup 2026 tournament: group standings, fixtures, knockout bracket, and champion certificate. Built to be extended for future years and formats via a structured data path (`YEAR/GAME/data.json`).

## Architecture

- **App repo:** `fsepoy/sepoy-cup-2026` → Vite build → GitHub Pages at `https://fsepoy.github.io/sepoy-cup-2026`
- **Data repo:** `fsepoy/sepoy-cup-data` → `2026/fc24/data.json` (public, readable by anyone)
- Admin panel writes back via GitHub Contents API using a Personal Access Token stored in the browser's localStorage
- All standings, bracket seeding, and knockout advancement are computed client-side from the data

## Superpowers Methodology

Use the `superpowers` Claude Code plugin for all of the following:

- Brainstorming sessions
- Writing plans
- Writing skills
- Implementing plans
- Code reviews
- PR creation and closure

**Install once (interactive terminal only):**

```
/plugin install superpowers@claude-plugins-official
```

## Prerequisites

- Node.js 20+
- GitHub CLI (`gh`) authenticated as `fsepoy`
- A GitHub Personal Access Token with `repo` scope (for admin writes — stored in browser localStorage only, never committed)
- Claude Code with the superpowers plugin installed

## Installation

```bash
npm install
```

## Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173/sepoy-cup-2026/`

## Build

```bash
npm run build
```

Output in `dist/`

## Deploy

```bash
npm run deploy
```

Builds and pushes `dist/` to the `gh-pages` branch. GitHub Pages serves from there automatically.

## Testing

```bash
npm run test        # Vitest unit tests (one-shot)
npm run test:watch  # Watch mode
```

Manual smoke test procedure: see [Handover](handover.md) for the current state and next steps.

## File Naming

- Markdown files: `kebab-case-with-hyphens.md`
- Exceptions: `CLAUDE.md`, `README.md` (fixed naming conventions)
- JS files: `camelCase.js`
- CSS classes: BEM-inspired (`.group-table__row--winner`)
- JSON keys: `camelCase`

## Code Standards

- Vanilla JS (ES modules, no framework)
- All user-controlled data rendered via `textContent` or `createElement` — never `innerHTML`
- All lib functions are pure and side-effect-free where possible
- All API calls return `{ ok, data, error }` — no throwing across module boundaries
- Latest ECMAScript features (top-level await, optional chaining, nullish coalescing)

## Security

- GitHub PAT: stored in `localStorage` only, passed as parameter to API functions, never committed or logged
- See [Security Assessment in the plan](https://github.com/fsepoy/sepoy-cup-2026) for the full threat model
- Security checkpoints run at: data layer complete, admin panel complete, pre-deploy

## References

- [Tournament Governance](tournament-governance.md)
- [Branding Guide](branding.md)
- [Handover](handover.md)
