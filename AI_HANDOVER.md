# OLFi Mobile App — AI Handover Document

**Last Updated:** May 11, 2026 (repo stabilization)
**Target Environment:** iOS
**Stack:** React Native (Expo), TypeScript, Supabase, Tailwind, Gluestack

To the next AI agent: read `PROJECT_MAP.md` first, then this document before making mobile app changes. It outlines the rigid brand aesthetic, translation system, terminology standardization, and critical authentication flows.

Canonical mobile app path: `app/`.
Canonical Xcode workspace: `app/ios/OLFi.xcworkspace`.
Latest product line: `fix/auth-and-splash`, with stabilization work on `chore/repo-stabilization`.

---

## 1. The Brand & Aesthetic (EXTREMELY STRICT)

The client enforces a "Premium, Brutalist-Minimalist" aesthetic. Do not deviate from these rules.

- **No AI-isms in Copy:** Do NOT use em-dashes (`—`). Use commas or split into separate sentences.
- **No Emojis (Unless Directed):** Never randomly insert emojis. Emojis are only allowed if explicitly defined in the design specs.
- **Typography & Formatting:** Avoid random `italic` font styles. Do not include random "BuyOut" text next to the main Logo. The app is strictly "OLFi".
- **Design Tokens:** Always use the predefined tokens inside `lib/constants.ts` (e.g., `Colors`, `Spacing`, `Typography`, `BorderRadius`). **Do NOT use hardcoded magic layout numbers** (like `padding: 24`, `fontSize: 16`). Standard uses are `Spacing.md`, `Typography.body`, etc.
- **Header:** The dashboard header is a sleek, compact, scrollable greeting row. Do not revert to heavy glassmorphism headers.
- **Terminology:** All references to "Loan" or "Financing" have been standardized to **"Debt"**. The previous "Active Financing" is now "My Debts". Do not use "Loan" in UI copy.

---

## 2. Translation System (`t()`)

- The app uses a strict dictionary-based translation system located in `lib/translations/en.ts` and `ar.ts`.
- **Do NOT hardcode English strings into the UI.** All dashboard and tabbed content MUST use `t('key.subkey')`.
- Inside functional components, extract the translator using `const { t } = useLanguage();`.
- Language toggles are instant and drive state directly without needing full-app unmount hacks. 

---

## 3. Core Flows: Onboarding -> Auth -> KYC -> Dashboard

The routing is complex and highly sensitive. We resolved race conditions inside `_layout.tsx`, `onboarding.tsx`, and `otp.tsx`.

### The Correct Flow Sequence:
1. **First Launch (`onboarding.tsx`)**
   - User goes through premium slides. `buyout_onboarding_completed` goes to `'true'`.
   - `router.replace('/(auth)/signup')` executes.
2. **Signup (`signup.tsx`)**
   - User signs up. Passes credentials to `/(auth)/otp`.
3. **OTP Verification & Account Linking (`otp.tsx`)**
   - **CRITICAL LOGIC:** To prevent Supabase's `onAuthStateChange` listener from instantly throwing the user into the `/(tabs)` dashboard when the session binds, we manually run `setPostAuthSetupPending(true)` **BEFORE** executing `supabase.auth.signUp()`.
   - Navigates to `/kyc/step1`.
4. **KYC Flow (`(auth)/kyc/*`)**
   - User provides ID, Selfie, and Biometrics.
   - `step3.tsx` routes the user to `/(tabs)`.
5. **Finalizing Entry (`_layout.tsx`)**
   - The Root Layout watcher sees the segment flip to `(tabs)` and triggers `setPostAuthSetupPending(false)`.

**WARNING:** Modifying `_layout.tsx`'s `useProtectedRoute` watcher without deep consideration of asynchronous race conditions WILL break the auth boundaries.

---

## 4. OLFi Score

The fake AsyncStorage assessment flow has been **removed**. The `ScoreFlipCard` now auto-calculates from real dashboard data:
- Uses `useDashboardData()` to get `totalDebt`, `totalEmi`, and `dtiRatio`.
- Score ranges 300–850 dynamically computed based on DTI severity.
- Do NOT bring back the `take_assessment` dummy flow. "Add Debt" is the only CTA to unlock the score.

---

## 5. Current State & Immediate Next Steps

- **Current Status:** Clean Codebase. Archived for **TestFlight**.
- **Code Health:** `npx tsc --noEmit` and `npm run lint` report **0 errors**. Type safety is strictly enforced.
- **Your Job:** If asked to add a new feature, seamlessly mimic the `Spacing` and `Typography` tokens, maintain the strict typography logic (no em-dashes), use `t()` translation keys, use "Debt" terminology, and preserve the structural integrity of the `_layout.tsx` routes.
