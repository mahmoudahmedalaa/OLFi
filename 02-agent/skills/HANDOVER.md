# BuyOut — Handover Document
> Last updated: 2026-02-14 by Session 6a3131f4

---

## Project Overview

**BuyOut** — A fintech iOS app for UAE consumers to aggregate debts, compare refinancing offers, and execute switches. Built with Expo (React Native) + Supabase.

- **Repo:** https://github.com/mahmoudahmedalaa/buyout
- **Branches:** `main` and `develop` (in sync)
- **Supabase Project ID:** `uivkpqjdoqwgfhvnskaw`
- **Bundle ID:** `com.mahmoudahmedalaa.buyout`
- **TestFlight:** Build 1.0.0 (2) live, internal testing group set up

---

## Current State: Phase 1 ~70% Complete

### ✅ Done
- **Expo + TypeScript project** — builds and runs on TestFlight
- **Design system** — dark theme tokens in `app/lib/constants.ts` (Colors, Spacing, Typography, BorderRadius)
- **Tab navigation** — Home, Loans, Offers, Profile
- **Auth stack** — Login + Signup screens wired to Supabase Auth (email only)
- **Supabase database** — 7 tables with RLS:
  - `profiles` (0 rows) — user profiles linked to auth.users
  - `banks` (8 rows) — UAE banks seeded
  - `bank_products` (8 rows) — loan products seeded
  - `user_loans` (0 rows) — user's debts
  - `refinance_offers` (0 rows) — generated offers
  - `user_documents` (0 rows) — doc uploads
  - `notifications` (0 rows) — in-app notifications
- **App icon** — "B" lettermark (geometric white B on dark navy)
- **Git** — clean repo, `.gitignore` set up, git-flow workflow in `.agent/workflows/git-flow.md`

### 🟡 Exists But Not Connected
All 4 tab screens render with **hardcoded mock data** — nothing queries Supabase:
- `app/(tabs)/index.tsx` — Dashboard with mock total debt, savings, loan cards
- `app/(tabs)/loans.tsx` — Loan list with filters, mock loans
- `app/(tabs)/offers.tsx` — Offer cards with mock bank offers
- `app/(tabs)/profile.tsx` — Menu items (all `onPress` are no-ops or alerts)

### ❌ Not Started
- Phase 2: Add Debt CRUD, Dashboard ↔ Supabase, Credit Health, Onboarding, **Dark/Light mode toggle**
- Phase 3: Offer comparison, savings calculator, lead capture, application tracker
- Phase 4: Coming Soon modals, animations, haptics
- Phase 5: Beta testing, App Store metadata

---

## Next Session Should Start With: Phase 2

### Priority order:
1. **Dark/Light mode toggle** — Theme context wrapping the app, AsyncStorage persistence, toggle in Profile screen (Light/Dark/System). Update all screens to use dynamic `theme.colors.*` instead of hardcoded `Colors.dark.*`. This is first because every subsequent screen change benefits from it.
2. **Add Debt form** — New screen with bank picker, debt type, amount, rate, tenure, EMI, compliance type. Insert into `user_loans` table.
3. **Dashboard ↔ Supabase** — Fetch real `user_loans`, calculate real totals and savings.
4. **Loans screen ↔ Supabase** — Real CRUD (edit, delete), real filter/status.
5. **Offers screen ↔ Supabase** — Fetch from `bank_products` + `refinance_offers`, wire Sharia filter.
6. **Profile screen** — Fetch/update `profiles` table, wire menu items.
7. **Onboarding flow** — 3-step animated welcome.
8. **Credit Health Indicator** — Calculate from entered data.

---

## Key Files

| File | Purpose |
|:-----|:--------|
| `app/app.json` | Expo config (buildNumber: "2", bundleId, icon path) |
| `app/lib/supabase.ts` | Supabase client (URL + anon key) |
| `app/lib/auth-context.tsx` | Auth context provider |
| `app/lib/constants.ts` | Design tokens (Colors, Spacing, Typography) |
| `app/app/_layout.tsx` | Root layout (auth check, routing) |
| `app/app/(auth)/login.tsx` | Login screen |
| `app/app/(auth)/signup.tsx` | Signup screen |
| `app/app/(tabs)/index.tsx` | Dashboard (mock data) |
| `app/app/(tabs)/loans.tsx` | Loans list (mock data) |
| `app/app/(tabs)/offers.tsx` | Offers list (mock data) |
| `app/app/(tabs)/profile.tsx` | Profile menu |
| `01-docs/PRD.md` | Full product requirements |
| `01-docs/IMPLEMENTATION_PLAN.md` | 5-phase build plan |
| `01-docs/TECH_STACK.md` | Technology decisions |
| `01-docs/FRONTEND_GUIDELINES.md` | Design standards |
| `.agent/workflows/git-flow.md` | Git branching workflow |

---

## Build & Deploy

```bash
# Dev server
cd app && npx expo start

# iOS prebuild (must do before Xcode archive)
cd app && rm -rf ios && npx expo prebuild --platform ios
cd app/ios && pod install  # IMPORTANT: run in same shell session

# Open Xcode
open app/ios/BuyOutapp.xcworkspace

# Archive: Xcode → Product → Archive → Distribute → App Store Connect
# Build number must be bumped in app.json before each upload
```

### Known quirks:
- `pod install` sometimes silently fails when run via separate shell commands. Always chain it: `cd app/ios && pod install 2>&1`
- `expo prebuild --clean` with the `--no-install` flag skips CocoaPods — always run `pod install` after
- TestFlight requires clearing Export Compliance for new apps (one-time)
- Internal testers must be App Store Connect team members

---

## Design Standards

- **Dark-first** design (Revolut/Wise inspired), light mode to be added in Phase 2
- Colors: Emerald green (#10B981) brand accent on Slate 900 (#0F172A) backgrounds
- Typography: System fonts with defined scale (display/h1/h2/h3/body/caption)
- Cards: Gradient backgrounds (`Colors.gradients.card`), 14px border radius
- No placeholder images — generate real assets
- Premium feel: gradients, subtle shadows, proper spacing
