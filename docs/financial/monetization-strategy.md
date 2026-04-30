# OLFi Monetization Strategy

OLFi operates fundamentally as a B2B2C entity. The primary customer creating revenue is the banking partner, not the end user.

## Primary Revenue Stream: B2B Lead Generation (CPA/CPL)
Our core engine calculates the value of an aggregated debt. When a user taps "Apply Now", we generate a highly qualified, pre-vetted lead for the partner bank.

*   **Cost Per Lead (CPL):** A flat fee charged to the bank for an application submission (e.g., 50 - 100 AED per lead), regardless of final approval.
*   **Cost Per Acquisition (CPA):** A percentage-based commission on the total consolidated loan amount *only if* the bank approves and disburses the loan (e.g., 0.5% - 1.0% of loan value).

**Engineering Implication:** The `submit-loan-application` Edge Function MUST tightly track these events and write to a secure `billing_events` table when an application successfully hits the bank's API.

## Secondary Revenue Stream: Premium Subscription (Phase 3)
A direct-to-consumer (D2C) subscription model intended for power users or users with complex financial portfolios.

*   **Pricing:** Estimated 29.99 AED / month or 290.00 AED / year.
*   **Premium Features:**
    *   **Live AECB Credit Score Tracking:** Monthly pulls without requiring manual re-auth.
    *   **Priority Partner Routing:** Guaranteed 24-hour SLA on loan decisions from select premium bank partners.
    *   **Advanced Analytics:** Custom charts, debt payoff snowball calculators, and Apple Wallet integration.

**Engineering Implication:** Requires Stripe / RevenueCat integration. The `profiles` table must support a `subscription_tier: "free" | "premium"` column, evaluated instantly for UI gating.
