# OLFi Epic Breakdown & Scope

In OLFi, "Epics" are large bodies of work that span multiple sprints and deliver significant, recognizable value to the user or the business. We use this breakdown to ensure our development efforts are strongly aligned with our strategic goals.

## Epic 1: Core Consolidation Engine (Completed - Phase 1)
**Goal:** Prove the core value proposition. Allow users to input debts, calculate savings against hardcoded/dummy bank offers, and see the interactive UI.
*   **Status:** Complete.
*   **Key Deliverables:**
    *   Supabase Auth & basic profiles.
    *   UI components (Slider, InputFields, Savings Widget).
    *   Algorithmic edge function (`calculate-savings-engine`).

## Epic 2: AECB Integration & Credit Checking (Phase 2)
**Goal:** Move away from user-input debts towards accurate, legally verified data via the Al Etihad Credit Bureau (AECB).
*   **Status:** Pending.
*   **Key Deliverables:**
    *   UAE Pass integration for identity verification (KYC).
    *   Server-side integration with AECB API.
    *   Auto-population of the `useApplicationStore` preventing user manual entry errors.
    *   Legal consent UI flows for credit checks.

## Epic 3: Partner Bank APIs & Real-Time Offers (Phase 2)
**Goal:** Replace static `bank_products` in our database with real-time API polling from partner banks to get exact, pre-approved interest rates.
*   **Status:** Pending.
*   **Key Deliverables:**
    *   Standardized Bank Integration Interface (Edge Function wrapper).
    *   Webhooks for async loan approval notifications from banks.
    *   Dynamic processing fee calculations based on live bank data.

## Epic 4: Admin & Business Operations Dashboard (Phase 3)
**Goal:** Give internal OLFi staff (Operations, Sales) a web-based dashboard to track application flow and manage bank relationships.
*   **Status:** Backlog.
*   **Key Deliverables:**
    *   Next.js/React web dashboard built on the same Supabase instance.
    *   Admin Role definitions in Supabase RBAC.
    *   Analytics charts (Conversion rates, Drop-offs).

## Epic 5: Premium User Tier & Monetization (Phase 3)
**Goal:** Introduce Direct-to-Consumer monetization via premium features (e.g., advanced tracking, priority partner routing).
*   **Status:** Backlog.
*   **Key Deliverables:**
    *   Stripe / RevenueCat Integration.
    *   Paywalled UI features.
    *   Subscription management logic.
