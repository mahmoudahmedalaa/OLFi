# Design Reference — BuyOut (Fintech / UAE Market)

> Fintech-specific design intelligence for loan refinancing in the UAE market.

---

## Color System — Fintech Trust Palette

| Role | Light Mode | Dark Mode | Usage |
|:-----|:-----------|:----------|:------|
| Primary | `#0066FF` | `#4D94FF` | Buttons, links, key actions — blue = trust |
| Success | `#00B67A` | `#00D68F` | Savings indicators, positive comparisons, rate improvements |
| Danger | `#E53935` | `#FF5252` | High-interest warnings, penalty alerts, rate increases |
| Warning | `#FF9800` | `#FFB74D` | Caution indicators, expiring offers |
| Neutral BG | `#F8F9FA` | `#121212` | Clean, professional background |
| Neutral Text | `#1A1A2E` | `#E8E8E8` | Primary text, high contrast |
| Card BG | `#FFFFFF` | `#1E1E1E` | Card surfaces |
| Muted Text | `#6B7280` | `#9CA3AF` | Secondary labels, timestamps |

### Financial Data Colors
| Meaning | Color | When to Use |
|:--------|:------|:-----------|
| Money saved | `#00B67A` (green) | "Save AED 2,400/mo" |
| Money owed | `#E53935` (red) | High interest rate, penalties |
| Neutral comparison | `#6366F1` (indigo) | Side-by-side loan data |
| Gold/Premium | `#C4A35A` | Premium features, top offers |

---

## Typography

### Font Stack
| Role | Font | Weight | Size | Usage |
|:-----|:-----|:-------|:-----|:------|
| Display | Inter | 700 | 32px | Hero savings amount ("Save AED 24,000") |
| H1 | Inter | 600 | 24px | Page titles |
| H2 | Inter | 600 | 20px | Section headers |
| H3 | Inter | 500 | 17px | Card titles |
| Body | Inter | 400 | 15px | Default text |
| Caption | Inter | 400 | 13px | Secondary info, timestamps |
| **Mono** | **JetBrains Mono** | 500 | varies | **Financial figures, rates, EMI amounts** |

> **Critical:** All monetary amounts (AED 45,000, 4.5% APR, 24 months) must use a **monospace font** for visual alignment in tables and comparisons.

### Arabic Support
- Primary Arabic: **Noto Sans Arabic** (Google Fonts)
- Fallback: System Arabic (SF Arabic on iOS)
- Direction: Support RTL layout for Arabic text blocks
- Numbers: Always use Western Arabic numerals (1, 2, 3) not Eastern (١، ٢، ٣) for financial data

---

## Financial UX Patterns

### Loan Card Pattern
```
┌────────────────────────────────────┐
│ 🏦 Bank Logo    Bank Name          │
│────────────────────────────────────│
│ Personal Loan                      │
│ AED 45,000    remaining balance    │
│ 14.5% APR  •  24 months left      │
│────────────────────────────────────│
│ ▓▓▓▓▓▓▓▓░░░░  65% paid           │
│────────────────────────────────────│
│ [View Offers →]          💰 3 offers│
└────────────────────────────────────┘
```

### Comparison Pattern
```
┌───────────────┬──────────────────┐
│ Current Loan  │ Best Offer       │
│───────────────│──────────────────│
│ 14.5% APR     │ 8.99% APR  ↓    │
│ AED 2,450/mo  │ AED 1,890/mo ↓  │
│ 24 mo left    │ 36 mo term      │
│───────────────│──────────────────│
│               │ Save AED 560/mo  │
│               │ [Apply Now →]    │
└───────────────┴──────────────────┘
```

### Savings Highlight Pattern
- Use **green** for positive savings (user saves money)
- Use **red** for costs or increases
- Always show **monthly** and **total** savings
- Animate count-up for savings numbers (800–1200ms)

---

## UX Anti-Patterns (Fintech-Specific)

| ❌ Don't | ✅ Do | Why |
|:---------|:------|:----|
| Show rates without context | Show "X% vs your current Y%" | Context drives decision-making |
| Use only annual totals | Show monthly + total savings | Monthly feels more tangible |
| Hide fees in fine print | Show fees prominently before CTA | Trust is everything in fintech |
| Use vague "Save money" | Show exact amount: "Save AED 2,400/mo" | Precision builds confidence |
| Auto-submit applications | Always require explicit confirmation | Financial actions are irreversible |
| No loading on calculations | Show calculation animation (shimmer) | Implies complex work being done |
| Generic error messages | "Unable to check rates. Tap to retry." | Actionable, specific feedback |
| Round financial numbers | Show exact: AED 2,387.45 not ~AED 2,400 | Precision = trust in fintech |

---

## Animation Timing (Financial Context)

| Type | Duration | When |
|:-----|:---------|:-----|
| Micro (press) | 100ms | Button press, toggle |
| EMI calculation | 300ms shimmer | After input change |
| Rate comparison | 800ms count-up | Showing savings amount |
| Approval celebration | 1500ms | Loan offer accepted |
| Score reveal | 1200ms | Financial health score |

---

## Accessibility (UAE Market)

| Requirement | Implementation |
|:-----------|:---------------|
| Touch targets | 44×44pt minimum (Apple HIG) |
| Text contrast | WCAG AA — 4.5:1 minimum |
| Arabic support | RTL layout support, Noto Sans Arabic |
| Dynamic Type | Support iOS font scaling |
| Currency format | `AED 1,234.56` — comma thousands, dot decimal |
| Date format | `DD/MM/YYYY` — UAE standard |
