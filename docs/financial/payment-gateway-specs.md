# BuyOut Payment Gateway Specifications

When we roll out the Phase 3 Premium Subscription tier, we will use **RevenueCat** to handle all Apple App Store integrations, rather than building custom IAP (In-App Purchase) logic.

## Why RevenueCat?
React Native apps face immense complexity when managing Apple's receipt validation, trial periods, and family sharing. RevenueCat abstracts this entirely.

## Technical Implementation Plan

1.  **SDK Dependency:** `react-native-purchases`.
2.  **Product Entitlements:** Within the RevenueCat dashboard, we define a single entitlement: `buyout_premium`.
3.  **Supabase Integration (Crucial):**
    *   We do NOT rely purely on the local app state to check if a user is premium.
    *   We configure a RevenueCat Webhook to hit a dedicated Supabase Edge Function (`revenuecat-webhook-handler`).
    *   When a user subscribes, RevenueCat pings this webhook, which securely updates `profiles.subscription_tier = 'premium'` in the database.
4.  **Client-Side Check:**
    The UI reads the database profile (or the JWT if we inject custom claims) to unlock premium routes dynamically in Expo Router.

## API Setup (Phase 3)
*   **RevenueCat Public API Key:** Stored in `.env` (Safe for client).
*   **RevenueCat Webhook Secret:** Stored purely in Supabase Edge Secrets (Never exposed to client).
