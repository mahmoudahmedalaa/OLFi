# BuyOut - AI Agent Handover Document
**Generated:** Feb 23, 2026

## 1. Project Overview & Recent Pivot
BuyOut has fully pivoted to an **Islamic Fintech** application. The app allows users to seamlessly transfer high-interest conventional debt to a **0% interest, Halal, Sharia-compliant BuyOut**.
- **Core Value Prop:** Escaping Riba (Usury), debt consolidation without interest, transparent flat subscription fees (Wakalah framework), profit-sharing (Mudarabah).
- **Tech Stack:** React Native / Expo (development via native builds `npx expo run:ios`, **NEVER** use Expo Go for testing), TypeScript, Gluestack UI, Supabase.

## 2. Work Completed in Last Development Session
### A. Refactoring & Code Quality
- Addressed significant technical debt across the application by resolving React hook exhaustive dependency warnings (`react-hooks/exhaustive-deps`) and removing unused variables/imports.
- Extensively modularized core screens (`app/add-loan.tsx`, `app/apply-offer.tsx`, `app/dashboard.tsx`, `app/offers.tsx`) by separating UI rendering components from state and side-effects.
- Abstracted complex business and fetch logic into dedicated custom hooks (e.g., `useAddLoan`, `useApplyOffer`, `useDashboardData`, `useOffersData`).

### B. Biometric Security Enhancements
- Integrated seamless Face ID/Touch ID login.
- Configured user credentials to save securely in the device's keychain using `expo-secure-store` upon manual authentication.
- Altered `login.tsx` to automatically prompt for bio-auth and refactored the root `_layout.tsx` to properly delay splash screen dismissal to prevent content flashing prior to bio-auth validation.

### C. Limiting MVP Loan Types
- Conducted strategic analysis determining that retaining Mortgages, Credit Cards, Business loans, and "Other" types distorts standard EMI calculations.
- Cleaned the entire application surface area to exclusively support **Personal Finance** and **Auto Finance**. 
- Removed residual references, icons, text, and data structures referencing non-MVP loan types across `add-loan`, `edit-loan`, `loan-detail`, onboarding descriptions, calculator insights, legal privacy policies, and the global application store types.

## 3. Current State
- The codebase is currently being compiled on a native iOS development build (`npx expo run:ios`).
- Biometric flow has been built and works safely inside the native scope.
- `SafeAreaView` warnings have been eradicated at the React Native core level via `patch-package`.
- The user is preparing to **manually archive** the app via Xcode themselves to submit to TestFlight. **Do not run the archive command.**

## 4. Next Steps for Incoming AI (Current Web Vibe Refinement)
1. **Renalta Color Refinement Issue:** The user explicitly requested to replicate Renalta's true brand colors (the "dark green" and "light beige"). Previous AI extracted `#011819` for dark and `#e1ded1` for light from Renalta HTML, but the user insists it is still "a weird green" or "forest green".
    - **Your Goal:** Extract the correct brand identity colors from Renalta, or perhaps sample different sections of their site (there may be a different primary green color they use for backgrounds such as `#0f2923` or similar deep teal greens).
    - **Verify with User:** Please test the color directly, show screenshots or explicitly ask them for confirmation. Do not be random.
    - **Apply globally:** Update `globals.css` (Tailwind `@theme` block or `:root` vars, depending on structure).
2. **Directory Mismatch Warning:** Currently, the active terminal runs `npm run dev` in `BuyOut/web`. However, the user's active IDE document was shown as `BuyOut/marketing-sites/v1-glassmorphism-fintech/src/app/page.tsx`. Be extremely cautious to identify *exactly* which directory's code is strictly rendering in the user's view environment. The previous AI faced issues with caching or directory mismatches when pushing UI changes to Tailwind due to this difference.
3. **No Em-Dashes:** The user specifically prohibited the use of em-dashes (`—`) in all copy/content. Do not use them.
4. **App Store Launch:** Monitor any instructions for the Native mobile app codebase (`npx expo run:ios`). The previous instructions for Native still stand (Do not use Expo Go, test bio-auth accurately, prepare for Phase 2 Open Banking).

Good luck!
