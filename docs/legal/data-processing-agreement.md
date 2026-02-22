# BuyOut Data Processing Agreement (DPA)

This document outlines the internal policies and technical guardrails enforcing BuyOut's compliance with the UAE Federal Decree-Law No. 45 of 2021 regarding the Protection of Personal Data.

## 1. Principles of Data Processing
*   **Lawfulness & Transparency:** Data is only collected with explicit user consent via the UI prior to AECB checks or loan submissions.
*   **Purpose Limitation:** Financial data is collected *strictly* for the purpose of calculating consolidation savings and submitting applications.
*   **Data Minimization:** We only request the exact fields required by partner banks. No arbitrary data gathering.

## 2. Technical Safeguards (Supabase)
*   **Data at Rest:** All data stored in our PostgreSQL database on Supabase is encrypted at rest using AES-256.
*   **Data in Transit:** TLS 1.2+ is enforced for all connections between the mobile app, Edge Functions, and the database.
*   **Row Level Security (RLS):** Policies are enforced at the database kernel level ensuring that `user_id A` can never query `user_id B`'s records.

## 3. Data Residency
To comply with UAE banking regulations regarding financial data, our primary database instance must be hosted in a Middle East region (e.g., AWS `me-central-1` UAE or `me-south-1` Bahrain) if available, or strictly adhere to cross-border transfer requirements governed by the UAE Data Office.

## 4. User Rights Management
*   **Right to Access:** Users can view all their active data within the `profile.tsx` screen.
*   **Right to be Forgotten (Deletion):** A "Delete Account" button exists in the app. This triggers a cascading hard-delete across `auth.users`, wiping `profiles`, `user_debts`, and `applications`.
    *   *Exception:* Anonymized aggregated data (e.g., total volume of savings generated) may be retained for business analytics, stripped of all PII.
