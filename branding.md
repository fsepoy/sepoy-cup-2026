# Sepoy Cup 2026 — Branding Guide

Extracted from the official Sepoy Cup 2026 Tournament Pack images.

## Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-navy` | `#1a2e5a` | Primary navy — headlines, borders, text on light bg |
| `--color-navy-dark` | `#0d1b35` | Dark navy — hero background, section dividers |
| `--color-navy-mid` | `#1a3a6a` | Mid navy — cards, table row fills |
| `--color-gold` | `#d4a574` | Warm gold — borders, ornamental accents |
| `--color-gold-bright` | `#f0c060` | Bright gold — primary headings, highlights, stars |
| `--color-gold-dark` | `#c9a340` | Dark gold — secondary accents, hover states |
| `--color-cream` | `#f5f1e8` | Cream — page background, light section fills |
| `--color-text-dark` | `#1a2e5a` | Body text on cream background |
| `--color-text-light` | `#e8e0d0` | Body text on navy background |
| `--color-text-muted` | `#8a9bb5` | Secondary / muted text on dark bg |
| `--color-success` | `#3a8a5a` | Win result indicator |
| `--color-draw` | `#8a7a3a` | Draw result indicator |
| `--color-danger` | `#8a2a2a` | Loss result indicator |

## Typography

### Fonts

- **Display:** `'Bebas Neue'` (Google Fonts) — fallback: `'Anton', sans-serif`
  - Used for: tournament title, section headers, score displays, bracket team names
  - Characteristics: all-caps condensed, high impact, sports aesthetic
- **Body:** `'Inter'` (Google Fonts) — fallback: `system-ui, sans-serif`
  - Used for: table data, match details, admin forms, body copy

### Type Scale

| Role | Size | Weight | Font | Case |
|---|---|---|---|---|
| Tournament title (hero) | 64–80px | 400 | Bebas Neue | UPPERCASE |
| Section header | 36–48px | 400 | Bebas Neue | UPPERCASE |
| Sub-header | 20–24px | 700 | Inter | Title Case |
| Table header | 12px | 700 | Inter | UPPERCASE, 1px letter-spacing |
| Body | 14–16px | 400 | Inter | Sentence case |
| Caption / badge | 11–12px | 600 | Inter | UPPERCASE |
| Score display | 32–48px | 400 | Bebas Neue | — |

## Decorative Elements

### Double Border Frame
The primary decorative motif — two concentric rectangular borders:
```css
.double-border {
  border: 2px solid var(--color-gold);
  outline: 1px solid var(--color-gold-dark);
  outline-offset: 4px;
}
```

### Star Separator
Used between section titles and content:
```
★ ─────────────── ★
```
HTML: `<span class="divider-star">★</span>` with flex row and pseudo-element lines.

### Laurel / Wheat Ornament
Appears on certificates and section headers. Rendered as a Unicode/SVG motif:
- Symbol: `❧` or custom SVG wheat sprigs flanking text

### Seal Badge
Circular badge with dark navy fill, gold ring, gold text:
```css
.seal-badge {
  width: 80px; height: 80px;
  border-radius: 50%;
  background: var(--color-navy-dark);
  border: 3px solid var(--color-gold);
  /* inner ring */
  box-shadow: inset 0 0 0 6px var(--color-navy-dark),
              inset 0 0 0 8px var(--color-gold-dark);
}
```

## Trophy

**Official Trophy:** The Legacy Cup (Design #04)

> "A timeless design representing legacy, honor and the enduring spirit of football for generations to come."

- Image file: `public/assets/trophy-legacy.png`
- Appears on: Hero section, Champion section, Certificate
- Colour: Gold/bronze arms holding a dark globe on black pedestal base

## Certificate Layout

Portrait orientation (A4 proportions):

1. **Outer frame:** Double gold border (full bleed with 8px padding)
2. **Background:** Cream (`#f5f1e8`)
3. **Header:** "SEPOY CUP 2026" in Bebas Neue 48px, `--color-navy`, centered
4. **Sub-header:** "CERTIFICATE OF CHAMPIONSHIP" in Inter 14px, spaced, `--color-navy`
5. **Ornament:** Gold laurel wreath (SVG or image), centered
6. **Body text** (Inter, 14px, navy, centered):
   - "THIS CERTIFIES THAT"
   - `[Champion Team Name]` — larger, bold
   - "REPRESENTING"
   - `[Nation]`
   - "HAS BEEN CROWNED"
   - **"SEPOY CUP 2026 CHAMPION"** — Bebas Neue 28px
7. **Edition / game tag:** "Edition I · FC24 · 2026"
8. **Bottom ornaments:** Gold wheat sprigs flanking champion label
9. **Seal badge:** Bottom-right, navy circle, gold text "SEPOY CUP 2026 CHAMPION"
10. **Trophy image:** Small Legacy Cup, bottom-left or centered above body

## Logo Treatment

Title: `SEPOY CUP 2026`
- Font: Bebas Neue
- Colour: `--color-gold-bright` on dark bg, `--color-navy` on cream bg
- Letter-spacing: 2–4px
- Trophy icon (🏆 or SVG) centred above the title in hero

## Tone

Ceremonial, prestigious, energetic. The visual language bridges formal sports tournament (World Cup aesthetic) with approachable family celebration. Gold + navy = premium feel without being corporate.
