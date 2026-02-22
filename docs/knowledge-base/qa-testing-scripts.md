# BuyOut QA & Testing Methodologies

As a financial technology application handling user debt and credit profiles, BuyOut enforces a strict, multi-tiered testing methodology before any Release Candidate (RC) reaches production.

## 1. Static Analysis & Unit Testing
*   **TypeScript Accuracy:** The codebase must compile exactly with zero implicit `any` usage. We enforce strict typing on all database models via generated Supabase types. Command: `npx tsc --noEmit`.
*   **Jest (Business Logic):** Pure mathematical functions (e.g., the `calculateEMI` function inside `refinance-calculator.ts`) MUST have explicit Jest tests. We do not unit test React UI components, we only unit test data-transformation functions.

## 2. End-to-End (E2E) Testing (Maestro)
We utilize **Maestro** (mobile.dev) for black-box UI testing on both iOS Simulators and CI/CD pipelines.

*   **Core Flows Automations:**
    1.  *Auth Flow:* Launch app -> Enter Email -> Enter mock OTP (`123456`) -> Verify push to Home screen.
    2.  *Debt Input Flow:* Navigate to Add Debt -> Fill Out Salary (`25000`) -> Add Personal Loan (`150000`, `4500` EMI) -> Navigate to Offers.
    3.  *Apply Flow:* Select top Offer -> Adjust Tenure Slider -> Tap Apply -> Verify Success screen.

*All E2E flows are stored as YAML files in the `/.maestro` directory.*

## 3. Manual Release Candidate (RC) Verification
Before a build is promoted from TestFlight to the App Store, the Product Owner must perform the following manual checks on a physical device:

1.  **Fresh Install:** Delete the old app, install the new RC from TestFlight.
2.  **Navigation Scrubbing:** Rapidly tap between tabs. Ensure the floating tab bar does not glitch and `z-index` stacking remains correct over ScrollViews.
3.  **Keyboard Avoidance:** Open all forms (Auth, Add Debt). Verify the software keyboard does not obscure the input fields or the primary "Submit" button.
4.  **Network Resilience:** Disconnect from WiFi while fetching Bank Offers. Ensure the app gracefully shows a "Network Error" state rather than crashing silently.

## 4. The "Ralph Loop" Verification
If a developer implements a massive refactor, they must run the `@ralph-loop` workflow:
1.  Run the TS compiler to catch breaks.
2.  If it fails, automatically fix the type mismatches.
3.  Repeat until `npx tsc --noEmit` returns silently. No feature is considered "done" until this verification passes.
