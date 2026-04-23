# OLFi / BuyOut Brand Identity

## Color Palette

| Token              | Hex       | Usage                                          |
|--------------------|-----------|-------------------------------------------------|
| `base-dark`        | `#011819` | Primary background (dark sections)              |
| `base-beige`       | `#E1DED1` | Primary text on dark, light section backgrounds |
| `brand-teal`       | `#074A4C` | Accent, buttons, badges, interactive highlights |

### Text Color Rules
- **Dark backgrounds** (`base-dark`): text is **white** or `base-beige`
- **Light backgrounds** (`base-beige`): text is **`base-dark`** (never white)
- Buttons on `brand-teal` background: text is **white**

### Supplementary Colors (from Renalta source)
| Hex       | Context                    |
|-----------|----------------------------|
| `#031f20` | Subtle dark variant        |
| `#CFCAB7` | Muted beige variant        |
| `#F0EFEF` | Near-white (light cards)   |

## Typography
- **Font Family:** Inter (via `--font-inter`)
- **Headings:** Bold, tight tracking (`tracking-tighter`)
- **Body:** Regular weight, relaxed leading
- **Labels/Badges:** Uppercase, wide tracking, mono or bold small

## Design Principles
1. **No glow effects** - no `blur`, no `shadow-glow`, no `animate-ping`. Stay flat and minimalist
2. **No em-dashes** (`—`) in any copy
3. **No float animations** on buttons (no `hover:-translate-y`)
4. **Clean hover transitions** - use `hover:opacity-90` or color shifts (`hover:bg-brand-teal hover:text-white`)
5. **Inspired by Renalta** - brutalist-minimalist fintech aesthetic
