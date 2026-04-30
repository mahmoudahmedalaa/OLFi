# OLFi Event Tracking Dictionary

To understand user behavior and conversion funnels, OLFi utilizes product analytics (e.g., PostHog / Mixpanel). This document defines the exact schema for custom events fired from the React Native client.

## Global Properties
Every event dispatched MUST automatically attach these super properties:
*   `$user_id`: The Supabase Auth UID (if logged in).
*   `$device_os`: 'iOS' (Currently we are iOS exclusive).
*   `$app_version`: e.g., '1.0.5'.
*   `subscription_tier`: 'free' | 'premium'.

## Event Dictionary

### 1. Auth & Onboarding
*   **Event:** `onboarding_started`
    *   *Trigger:* User launches the app for the very first time.
*   **Event:** `onboarding_completed`
    *   *Trigger:* User swipes through the final tutorial card.
*   **Event:** `auth_otp_requested`
    *   *Properties:* `{ auth_method: "email" | "magic_link" }`
*   **Event:** `auth_login_success`
    *   *Trigger:* Supabase successfully returns an active session.

### 2. Core Conversion Funnel
These are the most critical events for measuring OLFi's core business KPI (Lead Generation).

*   **Event:** `debt_added`
    *   *Trigger:* User successfully adds a new liability.
    *   *Properties:* `{ debt_type: "credit_card" | "personal_loan" | "auto_loan", balance_aed: number }`
*   **Event:** `savings_engine_run`
    *   *Trigger:* User hits "Calculate Savings" and the Edge Function is invoked.
    *   *Properties:* `{ input_total_debt: number, input_total_emi: number }`
*   **Event:** `offers_viewed`
    *   *Trigger:* The UI successfully renders the list of `OfferCard` components.
    *   *Properties:* `{ offer_count_returned: number, max_savings_offered: number }`
*   **Event:** `application_submitted` (Business KPI)
    *   *Trigger:* User taps "Apply Now" on a specific bank offer.
    *   *Properties:* `{ bank_id: string, product_name: string, requested_tenure: number, cpa_value_estimate: number }`

## Implementation Rules
1.  **Do NOT track PII:** Never send emails, phone numbers, or exact raw salaries as event properties. Use ranges (e.g., `salary_band: "10k-15k"`) if demographic data is needed.
2.  **Centralized Hook:** Always use the custom `useAnalytics()` hook to fire events. Do not import the raw SDK directly into UI components, as this allows us to hot-swap providers (e.g., from Amplitude to PostHog) in the future without refactoring 50 screens.
