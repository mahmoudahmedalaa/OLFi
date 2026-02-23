# BuyOut - AI Agent Handover Document
**Generated:** Feb 23, 2026

## 1. Project Overview & Recent Pivot
BuyOut has fully pivoted to an **Islamic Fintech** application. The app allows users to seamlessly transfer high-interest conventional debt to a **0% interest, Halal, Sharia-compliant BuyOut**.
- **Core Value Prop:** Escaping Riba (Usury), debt consolidation without interest, transparent flat subscription fees (Wakalah framework), profit-sharing (Mudarabah).
- **Tech Stack:** React Native / Expo (development via native builds `npx expo run:ios`, **NEVER** use Expo Go for testing), TypeScript, Gluestack UI, Supabase.

## 2. Work Completed in Last Session
### A. Product & Copy Refinement
- Transitioned all UI terminology from conventional finance terms to Islamic finance terms.
  - "Interest-Free" -> "0% Interest / Halal"
  - "Lending/Loans" -> "Financing / BuyOuts"
  - "Subscription" -> "Wakalah (Service Fee)"
  - "Investments" -> "Mudarabah (Profit Sharing)"
- Implemented and polished the **Tenure Adjustment Slider** on the Manual Offers screen, allowing users to customize their repayment schedule before accepting a BuyOut offer.

### B. Documentation (Notion Integration)
- Completely rebuilt the Notion engineering wiki via the MCP server to reflect the Islamic Finance pivot and the **TestFlight-only** launch strategy.
- Created/Updated: Developer Setup, App Store Connect SOP, Copy & Tone of Voice, Design System, Database ERD, App Flow & Navigation, and Legal & Compliance.

### C. Critical UI/UX Pre-Flight Fixes
- **App Icon & Splash Screen:** Fixed a critical bug where iOS rendered the transparent PNGs as black squares. Wrote custom Node.js scripts (`pngjs`) to perfectly map the App Icon (`icon-solid.png`) and Splash Screen (`logo-solid.png`) to a solid, 100% opaque `#0F172A` background to bypass strict Apple transparency bans.
- **SafeAreaView Deprecation:** The user had a strict requirement to eliminate a yellow LogBox warning about `SafeAreaView` being deprecated. It originated from internal `node_modules`. 
  - Patched `moti` dependency via `patch-package`.
  - Surgically removed the warning trigger from `node_modules/react-native/index.js` via `patch-package`.

## 3. Current State
- The codebase is currently being compiled on a native iOS development build (`npx expo run:ios`).
- All `SafeAreaView` warnings have been eradicated at the React Native core level.
- The user is preparing to **manually archive** the app via Xcode themselves to submit to TestFlight. **Do not run the archive command.**

## 4. Next Steps for Incoming AI
1. **Monitor Launch:** Wait for the user to complete the Xcode archive and TestFlight submission. Stand by to troubleshoot any App Store Connect Rejections or missing metadata (e.g., Privacy Policy URLs, Export Compliance, Screenshot dimensions).
2. **Phase 2 Features:** Depending on the user's direction, prepare to begin work on Phase 2, which involves integrating live Open Banking sync hooks to process real user debt over API rather than manual document uploads.
3. **No Expo Go:** The user explicitly stated "do not use expo!!". This means you must rely entirely on native iOS simulator builds (`prebuild --clean`, `run:ios`, `patch-package`, native linked frameworks). Expo Go is fundamentally incompatible with the custom native scripts we've injected.

Good luck!
