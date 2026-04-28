# OLFi Mobile App — AI Handover Document

**Last Updated:** April 2026
**Target Environment:** iOS (TestFlight ready)
**Stack:** React Native (Expo), TypeScript, Supabase

To the next AI agent: Please read this document before making any modifications to the app. It outlines the rigid brand aesthetic, the critical authentication/onboarding flows we just fixed, and established design tokens.

---

## 1. The Brand & Aesthetic (EXTREMELY STRICT)

The client enforces a "Premium, Brutalist-Minimalist" aesthetic. Do not deviate from these rules.

- **No AI-isms in Copy:** Do NOT use em-dashes (`—`). Use commas or split into separate sentences.
- **No Emojis (Unless Directed):** Never randomly insert emojis (like the ☪ icon) to make it "fun". Emojis are only allowed if explicitly defined in the design specs (e.g., standard iOS emojis for certain sections). 
- **Typography & Formatting:** Keep it clean. Avoid random `italic` font styles unless specifically requested. Do not include random "BuyOut" text next to the main Logo. The app is "OLFi". 
- **Design Tokens:** Always use the predefined tokens inside `lib/constants.ts` (e.g., `Colors`, `Spacing`, `Typography`, `BorderRadius`). **Do NOT use hardcoded magic layout numbers** (like `padding: 24`, `fontSize: 16`). Standard uses are `Spacing.md`, `Typography.body`, etc.
- **Header:** We removed the giant, space-consuming "GlassHeader" on the dashboard in favor of a sleek, compact, scrollable greeting row. Keep the layout lightweight. 
- **Spacing:** Tabs and bottom navigation padding should gracefully accommodate the Tab Bar using `useBottomTabBarHeight` or safe area paddings.

---

## 2. Core Flows: Onboarding -> Auth -> KYC -> Dashboard

The routing is complex and highly sensitive. We spent substantial time fixing race conditions and loop bugs inside `_layout.tsx`, `onboarding.tsx`, and `otp.tsx`.

### The Correct Flow Sequence:
1. **First Launch (`onboarding.tsx`)**
   - User goes through the premium slides.
   - User clicks "Get Started". 
   - `AsyncStorage`'s `buyout_onboarding_completed` goes to `'true'`. 
   - `router.replace('/(auth)/signup')` executes.
2. **Signup (`signup.tsx`)**
   - User signs up. Passes credentials explicitly via `router.push({ pathname: '/(auth)/otp', params: ... })`.
3. **OTP Verification & Account Linking (`otp.tsx`)**
   - User inputs standard OTP.
   - **CRITICAL LOGIC:** To prevent Supabase's `onAuthStateChange` listener from instantly ripping the user out of the Auth segment and throwing them into the `/(tabs)` dashboard when the session binds, we manually run `setPostAuthSetupPending(true)` **BEFORE** executing `supabase.auth.signUp()`.
   - After `signUp()` resolves, the script navigates the user successfully to `/kyc/step1`.
4. **KYC Flow (`(auth)/kyc/*`)**
   - User provides ID (step 1), Selfie (step 2), and confirms Biometrics (step 3).
   - Once all is done, `step3.tsx` sends the user to the `/(tabs)` Dashboard.
5. **Finalizing Entry (`_layout.tsx`)**
   - The Root Layout watcher sees the segment flip to `(tabs)` and triggers `setPostAuthSetupPending(false)`. The user is now securely authorized.

**WARNING:** Modifying `_layout.tsx`'s `useProtectedRoute` listener without deep consideration of the asynchronous race condition boundaries WILL break the onboarding flow. 

---

## 3. Marketplace & Filters (`offers.tsx`)

- **EMI Popovers:** Tooltips are anchored to the `BOTTOM` of inputs so they don't clip headers. The EMI calculation uses standard reducing-balance math in `refinance-calculator.ts` and explicitly explains DBR and computation rules.
- **Categories:** We no longer display redundant "Best Rate" headers immediately alongside "Top Picks". The layout is streamlined.
- **Filtering System:** Do not add "Sharia-Compliant" filters; the entire platform is inherently Islamic Finance. The `FilterModal.tsx` handles complex logic (Multi-select Banks, salary transfers, downpayments).

---

## 4. Current State & Immediate Next Steps

- **Current Goal:** The client is taking a clean build of this current state and archiving it for **TestFlight**.
- **Code Health:** `npx tsc --noEmit` returns **0 errors**. Maintain strict typing.
- **Your Job:** If asked to add a new feature, seamlessly mimic the `Spacing` and `Typography` tokens, maintain the strict typography logic (no em-dashes), and preserve the structural integrity of the `_layout.tsx` routes.
