# OLFi Brand Identity — Quick Reference

> Full brand guidelines: See `OLFi_Brand_Identity.md` (the comprehensive version).
> This file is the developer quick-reference for day-to-day work.

## Color Palette

| Token              | Hex       | Usage                                           |
|--------------------|-----------|-------------------------------------------------|
| `base-dark`        | `#011819` | Primary background (dark sections, splash)      |
| `base-beige`       | `#E1DED1` | Primary text on dark, light section backgrounds  |
| `brand-emerald`    | `#10B981` | Primary CTA, success states, interactive accent  |
| `brand-teal`       | `#14B8A6` | Secondary accent, clover motif, data viz         |
| `brand-teal-web`   | `#4FD1C5` | Website-specific interactive highlights          |

### Extended Dark Backgrounds
| Token | Hex |
|---|---|
| `dark.secondary` | `#0A2525` |
| `dark.tertiary` | `#133030` |
| `dark.surface` | `#1B3B3B` |

### Extended Light Backgrounds
| Token | Hex |
|---|---|
| `light.primary` | `#E1DED1` |
| `light.secondary` | `#EDE9DD` |
| `light.tertiary` | `#D5D0C4` |
| `light.surface` | `#C8C3B7` |

### Supplementary Colors
| Hex       | Context                    |
|-----------|----------------------------|
| `#031f20` | Subtle dark variant        |
| `#CFCAB7` | Muted beige variant        |
| `#F0EFEF` | Near-white (light cards)   |

### Semantic Colors
| Token | Hex | Purpose |
|---|---|---|
| `success` | `#10B981` | Positive actions |
| `warning` | `#F59E0B` | Caution states |
| `error` | `#EF4444` | Errors |
| `info` | `#3B82F6` | Informational |

### Text Color Rules
- **Dark backgrounds** (`base-dark`): text is `base-beige` or white
- **Light backgrounds** (`base-beige`): text is `base-dark` (never white)
- **Buttons on Emerald/Teal background**: text is white

## Typography
- **Font Family (Latin):** Inter (via `--font-inter`)
- **Font Family (Arabic):** Cairo (via `--font-cairo`)
- **Headings:** Bold, tight tracking (`tracking-tighter`)
- **Body:** Regular weight, relaxed leading
- **Labels/Badges:** Uppercase, wide tracking, bold small

## Terminology Standards
| Avoid | Use Instead |
|---|---|
| "Interest rate" | "Interest rate" (for existing debt), "Profit rate" (for new refinancing) |
| "Loan" (standalone) | "Financing" or "Debt" |
| "Financing Cost" | "Total Profit Paid" |
| "Credit Score" (generic) | "AECB Score" or "OLFi Score" |

## Design Principles
1. **No glow effects** — no `blur`, no `shadow-glow`, no `animate-ping`. Stay flat and minimalist
2. **No em-dashes** (`—`) in any copy
3. **No float animations** on buttons (no `hover:-translate-y`)
4. **Clean hover transitions** — use `hover:opacity-90` or color shifts
5. **Brutalist-minimalist** fintech aesthetic — every element is intentional
