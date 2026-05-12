# OLFi — Handover Document

> Last updated: 2026-05-11

This file orients future agents. Read `PROJECT_MAP.md` first, then this file, before editing code.

## Project Overview

OLFi is an iOS-first fintech product for UAE consumers to track debts, compare refinancing/consolidation offers, and submit applications for better terms.

Canonical surfaces:

1. **Mobile app:** `app/`, Expo React Native, iOS-first, Xcode Archive to TestFlight.
2. **Marketing site:** `web/`, Next.js, deployed through Vercel project `olfi`.
3. **Admin dashboard:** `admin/`, Next.js, deployed through legacy Vercel project `buyout-admin`.
4. **Prototype:** Vercel project `olfi-prototype`, separate from canonical app work.
5. **Backend:** `supabase/`, migrations and Edge Functions.

Repository:

- GitHub: `https://github.com/mahmoudahmedalaa/OLFi`
- Default branch: `main`
- Current latest product line: `fix/auth-and-splash`
- Current cleanup branch: `chore/repo-stabilization`
- Safety snapshot: `archive/pre-cleanup-20260511`

## Technical Identifiers

User-facing brand is OLFi. These legacy technical identifiers are intentionally retained for now:

- Bundle ID: `com.mahmoudahmedalaa.buyout`
- Android package: `com.mahmoudahmedalaa.buyout`
- Expo slug: `buyout`
- URL scheme: `buyout`
- Supabase project name: `buyout`
- Supabase Project ID: `uivkpqjdoqwgfhvnskaw`
- Apple Team ID: `2S42RLH67Y`

Do not rename these casually. Migration requires App Store, Supabase, OAuth, deep-link, and installed-app continuity planning.

## Branch Notes

- `fix/auth-and-splash` contains the latest app state and should be treated as the current product line until merged.
- `feature/kyc-open-finance` is a historical divergent branch with an older alternate structure and large deletes. Preserve it. Do not merge it into the current app without focused review.
- `feature/phase-4-advanced` is already merged into `develop` and effectively historical.
- `archive/pre-cleanup-20260511` preserves the exact pre-cleanup working tree, including generated pitch files and local edits.

## Current Product State

Mobile app:

- Auth, onboarding, KYC/open-banking-style flow, tabs, dashboard, debts, offers, profile, application screens, and notification/settings surfaces exist.
- The app uses Supabase Auth and Supabase tables such as `profiles`, `user_loans`, `bank_products`, `banks`, and `notifications`.
- Financial calculations live in `app/lib/refinance-calculator.ts`.
- Dashboard aggregation lives in `app/hooks/useDashboardData.ts`.
- Offer/recommendation logic lives in `app/hooks/useOffersData.ts`.
- Xcode workspace: `app/ios/OLFi.xcworkspace`.

Web:

- `web/` is the public OLFi marketing site.
- Vercel project: `olfi`.
- Future elevation should happen here, not in the mobile prototype, unless explicitly requested.

Admin:

- `admin/` is the internal dashboard.
- Vercel project still named `buyout-admin`.
- Latest deployment was observed in an error state during the May 2026 cleanup audit. Verify separately before relying on it.

Prototype:

- `https://olfi-prototype.vercel.app/onboarding` responds with an Expo web/static app.
- Treat this as a separate prototype surface.

## First Steps For Future Agents

1. Read `PROJECT_MAP.md`.
2. Check `git status --short --branch`.
3. State the target surface before editing.
4. Read `.agent/rules/base.md` and `.agent/rules/design-reference.md`.
5. For mobile work, preserve the auth/routing race-condition protections in `app/app/_layout.tsx` and `app/lib/auth-context.tsx`.
6. For production verification, run TypeScript/lint checks, then use Xcode Archive and TestFlight on a physical iPhone.
