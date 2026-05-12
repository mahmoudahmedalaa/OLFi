# OLFi Mobile App Handover

> Last updated: 2026-05-11

This file is mobile-specific. For repo-level orientation, read `../PROJECT_MAP.md` first.

## Canonical Mobile App

`app/` is the source of truth for the iOS mobile app. The Xcode workspace is:

`app/ios/OLFi.xcworkspace`

Use local Xcode builds and TestFlight for release verification. Do not use Expo Go or EAS Build for production validation.

## Current Flow

The app uses Expo Router and Supabase Auth. The sensitive routing logic lives in:

- `app/app/_layout.tsx`
- `app/lib/auth-context.tsx`

The auth/onboarding guard uses onboarding state, authenticated user state, biometric lock state, and `postAuthSetupPending` to avoid redirect races during signup/KYC/setup. Do not simplify this flow without testing signup, OTP, KYC/setup, dashboard entry, returning-user launch, and logout.

## Key Mobile Areas

- Tabs: `app/app/(tabs)/`
- Auth: `app/app/(auth)/`
- Dashboard data: `app/hooks/useDashboardData.ts`
- Offers and consolidation recommendations: `app/hooks/useOffersData.ts`
- Financial calculations: `app/lib/refinance-calculator.ts`
- Theme/design tokens: `app/lib/constants.ts`
- Translations: `app/lib/translations/`

## Product Rules

- User-facing brand is OLFi.
- Prefer "Debt" in user-facing app copy unless the local context specifically needs "Interest Rate", "Profit Rate", or another regulated finance term.
- Do not hardcode UI strings where translation keys already exist.
- Use design tokens from `app/lib/constants.ts`.
- Preserve Arabic/RTL and dark/light theme behavior when modifying screens.

## Technical Identifier Safety

These identifiers still contain `buyout` and should be kept until a dedicated migration is planned:

- Expo slug: `buyout`
- URL scheme: `buyout`
- iOS bundle ID: `com.mahmoudahmedalaa.buyout`
- Android package: `com.mahmoudahmedalaa.buyout`

Renaming them can affect TestFlight continuity, deep links, OAuth redirects, Supabase settings, and installed app upgrades.

## Verification For Mobile Changes

Minimum checks:

```bash
cd app
npx tsc --noEmit
npm run lint
```

For release readiness:

1. Open `app/ios/OLFi.xcworkspace`.
2. Select the `OLFi` scheme.
3. Select a generic iOS device or connected iPhone.
4. Run Product > Archive.
5. Upload to TestFlight and test on a physical iPhone.
