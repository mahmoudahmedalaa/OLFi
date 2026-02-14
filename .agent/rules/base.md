---
description: Core rules for all AI agents working on BuyOut. Read FIRST, follow ALWAYS.
---

# BuyOut — Base Rules

> ⚠️ **Every AI agent must read this file before writing a single line of code.**
> No exceptions. No shortcuts. These are non-negotiable.

---

## Tech Stack (Locked)

| Layer | Technology | Version Constraint |
|:------|:-----------|:-------------------|
| **Framework** | React Native (Native Workflow) | Expo SDK 54+ |
| **Language** | TypeScript | **Strict mode** (`strict: true` in tsconfig) |
| **Backend** | Supabase (PostgreSQL + Auth + Edge Functions) | Free tier |
| **Styling** | NativeWind (Tailwind for RN) | v4+ |
| **UI Library** | gluestack-ui v2 (unstyled components) | Latest stable |
| **State** | Zustand | Latest stable |
| **Navigation** | Expo Router (file-based) | v4+ |
| **Forms** | React Hook Form + Zod | Latest stable |
| **Build** | **Xcode Archive → TestFlight ONLY** | Xcode 16+ |

### What This Means
- **Never use Expo Go.** Ever. Not for testing, not for demos, not for "just checking something."
- **Never use EAS Build.** We build locally with Xcode.
- **Never add a dependency** without checking: maintained? TypeScript types? Expo compatible? <500KB bundle impact?
- **Never use `any` type.** If you can't type it, you don't understand it.
- **Never store monetary values as float/decimal.** Always BIGINT in fils (1 AED = 100 fils).

---

## Design System Rules

### Colors — Psychology-Driven
| Token | Usage | Rationale |
|:------|:------|:----------|
| **Primary Blue** `#1A73E8` | Trust, CTAs, primary actions | Blue = trust in fintech |
| **Success Green** `#34A853` | Savings, gains, positive outcomes | Green = money growth |
| **Warning Amber** `#F9AB00` | Attention needed, pending states | Amber = caution |
| **Error Red** `#EA4335` | Failures, validation errors | Red = stop/danger |
| **Neutral** 50-900 scale | Backgrounds, text, borders | Cool grays for professionalism |

### Typography
- **System font** (SF Pro iOS / Roboto Android) for body text
- **Monospace font** for ALL financial numbers (alignment matters)
- No custom fonts unless explicitly approved

### Interaction Standards
- **Every pressable element**: press feedback (opacity or scale) + haptic
- **Every number reveal**: count-up animation (800-1200ms)
- **Every screen transition**: spring animation (250-300ms)
- **Every loading state**: skeleton shimmer, never a spinner
- **Touch targets**: minimum 44x44pt (Apple HIG)
- **Dark mode**: mandatory for all screens (financial dashboards look premium in dark)

### Figma ≠ Spec
Figma designs are **inspiration, not specification**. The AI must:
1. Study the Figma for layout intent and information hierarchy
2. Then exceed it with better spacing, animations, and polish
3. Reference Revolut, Wise, Cash App, Robinhood for premium benchmarks

---

## The Ralph Mandate

> **No task is finished until it passes external verification.**

A feature is NOT complete until ALL of the following pass with zero errors:

```bash
# 1. TypeScript — zero errors
npx tsc --noEmit

# 2. Lint — zero warnings
npx expo lint

# 3. Build — compiles successfully
# (On significant changes, verify Xcode build succeeds)
```

If any of these fail, **do NOT move on.** Enter the [RalphLoop](.agent/workflows/ralph-loop.md) and fix until clean.

**Acceptance criteria for ANY pull of work:**
- [ ] `npx tsc --noEmit` passes with 0 errors
- [ ] No `any` types introduced
- [ ] No `console.log` in production code (guard with `__DEV__`)
- [ ] All new components have proper TypeScript interfaces
- [ ] Monetary values use BIGINT (fils), display uses `Intl.NumberFormat`
- [ ] RLS policies exist for every new table
- [ ] Dark mode tested

---

## Financial-Grade Rules

These are **non-negotiable** for a fintech app:

1. **Money is BIGINT.** `AED 45,000.00` = stored as `4500000` fils. Display conversion at UI layer only.
2. **RLS on every table.** Users see only their own data. No exceptions.
3. **Zod validation** on all user inputs. Never trust client data.
4. **No mock data in production.** Seed data for dev only, stripped for release.
5. **Secure storage** for tokens/credentials — `expo-secure-store`, never AsyncStorage.
6. **Rate limiting** on auth endpoints (Supabase built-in).

---

## File Organization

```
src/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (tabs)/             # Tab navigator screens
│   ├── auth/               # Auth flow screens
│   └── _layout.tsx         # Root layout
├── components/             # Reusable UI components
│   ├── ui/                 # Primitive components (buttons, inputs, cards)
│   └── domain/             # Business-specific components (DebtCard, OfferCard)
├── lib/                    # Shared utilities
│   ├── supabase.ts         # Supabase client configuration
│   ├── constants.ts        # App-wide constants
│   └── utils.ts            # Helper functions
├── hooks/                  # Custom React hooks
├── stores/                 # Zustand stores
├── types/                  # TypeScript type definitions
│   └── database.ts         # Auto-generated Supabase types
└── services/               # API layer (Supabase queries)
```

**Rules:**
- One component per file
- Components in PascalCase, hooks in camelCase with `use` prefix
- All Supabase queries go through `services/` — never call Supabase directly from components
- Types in `types/` — never inline complex types

---

## Quick Decision Framework

| Question | Answer |
|:---------|:-------|
| Custom component or library? | **Library.** Always check first. |
| Expo Go or Xcode? | **Xcode.** Always. |
| `any` type or figure it out? | **Figure it out.** |
| Float or integer for money? | **Integer (fils).** |
| Skip tests to move faster? | **No.** Run `tsc --noEmit` minimum. |
| Follow Figma exactly? | **No.** Exceed it. |
| AsyncStorage for tokens? | **No.** `expo-secure-store`. |
| `console.log` in production? | **No.** Guard with `__DEV__`. |
