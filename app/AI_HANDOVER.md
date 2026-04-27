# AI Handover: OLFi Onboarding, Splash Screen & UI Polish

## Overview
This document summarizes the recent critical fixes and updates applied to the OLFi mobile app primarily focusing on the Onboarding flow overhaul, tab-bar clipping issues (paddingBottom), and Splash Screen native configuration. The project is now clean, tested, and perfectly configured for an Xcode native archive and TestFlight deployment.

## What Has Been Completed

### 1. Onboarding & Authentication Flow Overhaul
*   **Decoupled Auth Navigation:** The initial flow was highly unpredictable because the global `_layout.tsx` router was actively trying to enforce 4 separate `AsyncStorage` states at once (onboarding, KYC, open banking, biometric), resulting in race conditions.
*   **Resolution:** 
    *   `_layout.tsx` has been drastically simplified. It now only routes based on two flags: `onboardingDone` and `user`. 
    *   Instead of relying on the layout, the flow is now strictly **push-based/screen-to-screen sequential** navigation.
    *   The linear path is now: `First Launch` → `Onboarding` (4 premium animated slides) → `Signup/Login` → `OTP` → `KYC` (with a Skip option) → `Biometric Setup` (with a Skip option) → `Dashboard`.
*   **Biometric Separation:** Created a dedicated `(auth)/biometric-setup.tsx` screen so users are not confused by combining Face ID with KYC, replacing `kyc/step3.tsx`.

### 2. Premium Onboarding UI
*   `onboarding.tsx` was completely rewritten using `react-native-reanimated`.
*   Implemented 4 custom, liquid-glass styled slides simulating the marketing prototype: Starburst pattern rays, stacked debt/loan cards, floating interest rate comparisons (14.5% → 8.2%), and animated score progression bars.
*   The header features the wordmark logo and fake language toggle pills (EN / AR) exactly as designed.

### 3. Splash Screen & Native iOS Configuration
*   **The Issue:** The splash screen logo was appearing as a tiny icon upon launching the app on devices/simulators.
*   **The Fix:** 
    *   The original app had hard-coded the root `SplashScreen.storyboard` to force the logo container into a tiny `200x200` square box. The logo is a horizontal wordmark, so a square forced it to scale down aggressively.
    *   We altered `ios/OLFi/SplashScreen.storyboard` directly, changing the image frame constraint to `300x100`. 
    *   We regenerated the native `Images.xcassets/SplashScreenLogo.imageset` properly scaling them (1x, 2x, 3x) off of the `olfi-splash-v2.png` wordmark asset, up to 900x240 for `@3x`.
    *   We updated `app.json` `splash.imageWidth` to `800` to reflect this in future prebuilds.

### 4. UI Clipping / Padding Issues
*   Across `app/(tabs)/index.tsx`, `profile.tsx`, and `loans.tsx`, the bottom-most list items were permanently obscured by the custom bottom tab bar.
*   **Resolution:** Increased the `paddingBottom` of the internal scroll views/flatlists from `32` to `100` system-wide.

### 5. Build Versioning & Archiving
*   `app.json` iOS `buildNumber` has been bumped to **15** (technically the local json might say 15, and `eas.json` generated `16` remotely).
*   The project was verified by executing a clean `npx expo prebuild -p ios` to write all configuration changes explicitly into native iOS code. It is fully ready for a native Xcode `Product > Archive`.

## What Remains / Next Steps (For Future AI)

1.  **KYC Cleanup:** `(auth)/kyc/step2.tsx` and `(auth)/kyc/step3.tsx` are currently unused and disconnected from the router. They have been intentionally left in the file system just in case the user wants to revert or utilize some of their local components later. They should be deleted in the next sprint if explicitly verified as dead code.
2.  **Open Banking Re-integration:** `open-banking.tsx` is disconnected from the mandatory onboarding loop to reduce friction. You will need to implement a clear entry point for it from the settings/profile screen inside the dashboard so users can optionally link their accounts later.
3.  **Arabic Language Support:** The onboarding screen features an `EN / AR` layout pill; it currently does nothing. The entire app does not yet utilize an i18n layer on the frontend (React Native). This needs to be implemented.
4.  **Waitlist/Production Data:** Make sure that when the app goes truly live, the Supabase environments (URLs, Anon keys) match production data, as TestFlight testers might still be hitting testing/development sets.
