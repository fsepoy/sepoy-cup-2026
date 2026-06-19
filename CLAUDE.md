# Sepoy Cup 2026

Family FC24 tournament webapp — all features shipped. Read `handover.md` for current tournament state before starting work.

## Quick Navigation

| Need | File |
|---|---|
| Current scores / tournament state | `handover.md` |
| CSS tokens + theme vars | `src/style.css` — `:root` and `[data-theme="dark"]` blocks |
| Public site entry | `src/main.js` |
| Admin entry | `src/admin.js` |
| Public components | `src/components/` (hero, groups, fixtures, bracket, champion, certificate) |
| Admin components | `src/components/admin/` |
| Data fetch + validate | `src/lib/data.js` |
| Standings calc (pure) | `src/lib/standings.js` |
| Knockout / bracket seeding | `src/lib/knockout.js` |
| GitHub Contents API wrapper | `src/lib/github.js` |
| XSS guard + flag icon util | `src/lib/utils.js` |

## Key Conventions

- Vanilla JS only — no framework
- User-controlled data: `textContent` / `createElement` only; `escapeHtml()` before any `innerHTML`
- All API functions return `{ ok, data, error }` — never throw across module boundaries
- Theme: `data-theme="light|dark"` on `<html>`; CSS vars flip automatically — never hardcode colours in JS
- `admin.html` must NOT be linked from `index.html`
- PAT lives in `localStorage` under key `sc2026_pat` — never commit, never log
- After completing any planned implementation, replace the plan file with `# No active plan`

## References

- [Tournament Governance](tournament-governance.md)
- [Branding Guide](branding.md)
- [Handover](handover.md)
