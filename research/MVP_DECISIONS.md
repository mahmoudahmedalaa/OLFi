# BuyOut — MVP Decisions Log

> Living document capturing all product decisions from the research interview.

---

## Q1: Debt Types in MVP
**Decision:** All four — personal loans, auto loans, credit cards, BNPL
**Rationale:** Full coverage from day 1 shows platform breadth to investors and early users.

## Q2: Sharia Positioning
**Decision:** Sharia-compliant is a **filter option**, not the default.
**Source confirms:** Pitch deck appendix says "Islamic finance as optional vertical, not core." Solution slides position BuyOut as "neutral execution and decision layer."
**UI approach:** Users can toggle a "Sharia-Compliant Only" filter on offers. Both conventional and Islamic offers shown by default.

## Q3: Onboarding — Manual vs Connected
**Decision:** Manual entry for MVP. 
- Users type in their loan details (bank, amount, rate, tenure, type)
- UI shows "Connect Your Bank" option with a premium badge
- Tapping it shows a modal: "Coming soon — Automated bank sync via AECB & Open Banking. For now, enter your details manually."
- Architecture is designed so AECB/Open Banking can replace manual entry later without UI changes

## Q4: Offer Sourcing
**Decision:** Simulated with realistic UAE bank data.
- Use real UAE bank names (Mashreq, FAB, ADCB, DIB, Emirates Islamic, ADIB, RAK Bank, etc.)
- Realistic profit rates / interest rates based on current UAE market
- Different offers per debt type (personal loan buyout, card balance transfer, auto refinance)
- Clearly labeled as "Illustrative offers" in settings/about for compliance

## Q5: Authentication
**Decision:** 
- **MVP auth methods:** Email + Google Sign-In + Apple Sign-In
- **Phone OTP:** Included (standard for UAE fintech)
- **UAE Pass:** Show button → "Coming Soon" modal (same pattern as AECB)
- **Email verification:** Required after signup
- **Biometric:** Face ID / Touch ID for returning users (via expo-local-authentication)

## Q6: "Coming Soon" Pattern
**Decision:** Include a short animated mockup flow inside the modal.
- UAE Pass → 3-screen preview: "Verify Identity → Select Bank → Auto-Sync"
- AECB Bank Sync → Preview: "Connect → Select Accounts → Import Debts"
- Keep it lightweight — Lottie animation or static screens with auto-advance
- Must not disrupt core platform development

## Q7: Loan Entry Fields
**Decision:** Collect:
- Bank name (picker from UAE bank list)
- Debt type (personal loan / auto / credit card / BNPL)
- Outstanding amount (AED)
- Monthly payment (AED)
- Interest/profit rate (%)
- Remaining tenure (months)
- Compliance type: `Sharia-Compliant` / `Conventional` / `Not Sure`

**"Not Sure" option rationale:** Many users (especially expats) don't know if their existing loan is Sharia-compliant. "Not Sure" shows ALL offers (both types). If marked conventional, we highlight Sharia alternatives as upsell.

## Q8: Debt Limit
**Decision:** No cap. Unlimited debts.
**Rationale:** Aggregation is the product's core value. Rare for someone to have 10+ but the app should handle it. Soft UI guidance with "Add another debt" button.

## Q9: Offer Acceptance Flow
**Decision:** Option C — Both simulated + lead capture.
- Step 1: Show offer details + "Accept Offer" CTA
- Step 2: Success screen → "Application submitted to [Bank]" (simulated)
- Step 3: Collect contact info → "A BuyOut advisor will reach out within 24 hours"
- This captures real leads even during MVP while showing the full intended flow

## Q10: Language
**Decision:** English only for MVP.
- Arabic/RTL architecture built-in (using `I18nManager`) but not activated
- Localization-ready strings from day 1 (all text in translation files, never hardcoded)

## Q11: Dashboard Hero Metric
**Decision:** Option C — Show both.
- Top: "Total Debt: AED 175,000" (the problem)
- Below: "Potential Monthly Savings: AED 1,200" in green (the solution)
- Savings calculates dynamically based on best available offers vs current rates

## Q12: Credit Score
**Decision:** Build a **Credit Health Indicator** (not an AECB score).
- Uses data the user already entered: number of debts, total debt, DBR (if salary provided), self-reported payment history
- Shows directional categories: `Healthy` / `Needs Attention` / `At Risk`
- Disclaimer: "This is an estimate based on your inputs. For your official credit score, visit aecb.gov.ae"
- "Connect AECB" button → Coming Soon modal
- **Why not real score:** AECB API requires fintech license + per-pull fees (AED 10-30/check). Not feasible on free MVP.

## Q13: Push Notifications
**Decision:** All of the above.
- New offers available for user's debts
- Payment reminders
- Offer status changes (pending → approved → completed)
- Implementation: expo-notifications (free) → OneSignal later for segmentation

## Q14: User Profile
**Decision:** Collect everything useful, salary optional with explanation.
- Required: Name, email, phone, nationality, employment type (public/private/self-employed)
- Optional (with guidance): Monthly salary → tooltip: "Helps us calculate your Debt Burden Ratio and show more accurate offers"
- Optional: Emirates ID (for future UAE Pass integration)
- Privacy-first: Clear messaging about data usage

## Q15: App Name & Branding
**Decision:** "BuyOut" is working name. Tagline: "For every loan"
- Both are usable but not final
- **Alternative name suggestions:**
  - **DebtFree** — aspirational, clear outcome
  - **Sakan** (سكن) — Arabic for "peace/tranquility" — emotional positioning
  - **Mubadala** — "exchange" in Arabic — financial relevance
  - **ClearPath** — journey metaphor, debt-free destination
  - **Rafid** (رافد) — Arabic for "supporter/tributary" — helping hand
  - **Buyout** (as one word, lowercase) — more modern/app-like
- Decision deferred to pre-launch branding phase
