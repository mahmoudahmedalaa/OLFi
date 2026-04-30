# Product Requirements Document — OLFi MVP

> **OLFi** — A single digital platform that aggregates, analyzes, and executes consumer debt refinancing end-to-end.

---

## 1. Product Overview

| Field                   | Detail                                      |
| :---------------------- | :------------------------------------------ |
| **Product Name**  | OLFi (working name)                       |
| **Tagline**       | "For every loan"                            |
| **Type**          | Mobile-first fintech app (iOS)              |
| **Target Market** | UAE salaried consumers with 2+ active debts |
| **Scale**         | MVP → 1,000 users                          |
| **Stage**         | Pre-seed MVP                                |

### Problem Statement

Salaried consumers in the UAE manage 3-5 separate liabilities across multiple banks. Each has different rates, tenures, and settlement rules. There is no single platform to see all debts, compare refinancing options, and execute a switch — let alone one that offers Sharia-compliant alternatives.

### Solution

OLFi aggregates all debts into a single dashboard, runs portfolio-level restructuring logic, surfaces pre-qualified offers from partner banks, and orchestrates the refinance execution end-to-end.

---

## 2. Goals & Success Metrics

| Goal             | Metric                                        | Target (6 months)   |
| :--------------- | :-------------------------------------------- | :------------------ |
| User acquisition | Registered users                              | 500                 |
| Engagement       | Debts added per user                          | ≥ 2.5              |
| Conversion       | Users who accept an offer                     | 10% of active users |
| Lead capture     | Contact info submitted after offer acceptance | 80% of acceptors    |
| Retention        | Monthly active users (MAU)                    | 40% of registered   |

---

## 3. Feature Prioritization

### P0 — Must Have (MVP Launch)

| Feature                           | Description                                                                                                       |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Auth**                    | Email + Google + Apple Sign-In + Phone OTP. Email verification required. Biometric for returning users            |
| **UAE Pass**                | Button visible → "Coming Soon" modal with animated preview                                                       |
| **Onboarding**              | Welcome → sign up → verify → add first debt → see dashboard                                                   |
| **Manual Debt Entry**       | Bank picker, debt type, amount, rate, tenure, monthly payment, compliance type (Sharia / Conventional / Not Sure) |
| **Bank Sync (placeholder)** | "Connect Your Bank" → Coming Soon modal with 3-screen animated preview                                           |
| **Dashboard**               | Total debt + potential monthly savings. List of all debts with key metrics                                        |
| **Credit Health Indicator** | Estimated health (Healthy / Needs Attention / At Risk) based on entered data. Not an AECB score                   |
| **Offer Engine**            | Simulated realistic offers from UAE banks. Filter by Sharia-compliant, rate, tenure                               |
| **Offer Comparison**        | Side-by-side: current terms vs. best offer. Highlight savings                                                     |
| **Offer Acceptance**        | Simulated submission → success screen → lead capture form                                                       |
| **Profile**                 | Name, email, phone, nationality, employment type. Optional: salary (with guidance tooltip)                        |
| **Push Notifications**      | New offers, payment reminders, offer status changes                                                               |
| **Settings**                | Notification preferences, about, privacy, logout                                                                  |
| **Application Tracker** | Post-offer status pipeline: Submitted → Under Review → Documents Requested → Approved / Rejected. Progress bar + timeline view. Push notifications on each status change |
| **Document Upload** | When bank requests additional documents (salary certificate, bank statement), user uploads via camera or file picker. Stored in Supabase Storage |

### P0 — The Closing Journey (Post-Offer Acceptance)

> [!IMPORTANT]
> This is the **most critical unresolved flow** in the MVP. After a user accepts an offer, the bank needs to assess the application. For MVP, this is managed semi-manually with clear status tracking.

| Step | What Happens | MVP Implementation |
|:-----|:-------------|:-------------------|
| 1. **Submitted** | User accepts offer, provides contact info | Auto: application record created, notification sent |
| 2. **Under Review** | Bank (or OLFi ops team) reviews application | Manual: ops team updates status in Supabase dashboard |
| 3. **Documents Requested** | Bank needs salary certificate, statements, etc. | Push notification → user uploads docs in-app |
| 4. **Conditional Approval** | Bank pre-approves pending document verification | Manual status update → user sees approval with conditions |
| 5. **Final Approval** | Bank confirms the refinance | Manual status update → celebration screen + next steps |
| 6. **Rejected** | Bank declines the application | Manual status update → show reason + alternative offers |
| 7. **Completed** | Refinance executed, old debt closed | Manual status update → dashboard updates to show new loan |

**MVP approach:** Semi-manual. OLFi operations team uses Supabase dashboard to update statuses. User sees a beautiful progress tracker in-app. Push notifications on every status change. This lets us validate the flow cheaply before automating bank integrations.

**Future (P1):** Direct bank API integration for automated status updates, document submission via bank APIs, and real-time approval webhooks.

### P1 — Should Have (Post-MVP, Pre-Seed Round)

| Feature                      | Description                           |
| :--------------------------- | :------------------------------------ |
| **AECB Credit Score**  | Real credit score via API integration |
| **UAE Pass Auth**      | Full Emirates ID verification         |
| **Bank Account Sync**  | AECB / Open Banking API integration   |
| **Real Lender Offers** | Live offers from partner banks        |
| **Loan Tracking**      | Track active refinance applications   |
| **Arabic / RTL**       | Full Arabic language support          |

### P2 — Nice to Have (Growth Phase)

| Feature                        | Description                                             |
| :----------------------------- | :------------------------------------------------------ |
| **BNPL Aggregation**     | Import BNPL obligations from Tabby, Tamara, etc.        |
| **Payment Calendar**     | Unified payment schedule across all debts               |
| **Debt-Free Calculator** | Projections for payoff dates under different strategies |
| **Referral Program**     | Invite friends → rewards                               |
| **Financial Education**  | Articles, videos on debt management and Sharia finance  |

### Out of Scope (MVP)

- Direct lending / origination (we are NOT a lender)
- Cross-border / GCC markets
- Mortgage refinancing
- Investment products
- Web app (iOS first)

---

## 4. User Scenarios

### Scenario 1: New User — Salaried Expat

> Raj (32, Indian expat, AED 15K/mo) has a personal loan at 14.5% and 2 credit cards. He downloads OLFi, signs up with Google, enters his 3 debts manually. The dashboard shows AED 85,000 total debt with potential savings of AED 650/month. He taps "See Offers" on his personal loan, compares 3 bank offers, accepts the best one. He enters his phone number for a OLFi advisor to follow up.

### Scenario 2: Sharia-Conscious User

> Fatima (40, Emirati, AED 35K/mo) has a conventional car loan she wants to convert to Sharia-compliant. She enters her loan, marks compliance as "Conventional," and enables the "Sharia-Compliant Only" filter. OLFi shows her Murābaḥa-based alternatives from Emirates Islamic and ADIB. She accepts and provides contact info.

### Scenario 3: Investor Demo

> During a pitch meeting, the founder opens OLFi, taps "Connect Your Bank" to show the animated preview of the future auto-sync experience. Then manually adds sample debts. The dashboard calculates savings. The investor sees the full intended flow including AECB integration and UAE Pass — all clearly labeled as "Coming Soon" with polished previews.

---

## 5. Technical Constraints

| Constraint             | Detail                                             |
| :--------------------- | :------------------------------------------------- |
| **Budget**       | ~$8/month (free tiers only)                        |
| **Platform**     | iOS first (React Native / Expo)                    |
| **Backend**      | Supabase free tier (500MB DB, 500K function calls) |
| **Auth**         | Supabase Auth (50K MAU free)                       |
| **Builds**       | Xcode local builds → TestFlight                   |
| **Data**         | Simulated offers, not real bank APIs               |
| **Credit Score** | Estimated health indicator, not real AECB score    |
| **Builds**       | Xcode Archive → TestFlight ONLY. Never use Expo Go |
| **Post-offer**   | Semi-manual ops via Supabase dashboard              |

---

## 6. Launch Strategy

| Phase                   | Timeline     | Action                                                  |
| :---------------------- | :----------- | :------------------------------------------------------ |
| **Alpha**         | Weeks 1-6    | Build core MVP, internal testing                        |
| **Beta**          | Weeks 7-10   | TestFlight with 20-50 users (friends, colleagues)       |
| **Investor Demo** | Week 10+     | Polish "Coming Soon" features, prep pitch with live app |
| **Public MVP**    | Post-funding | App Store submission with real lender integrations      |

---

## 7. Mock Data: UAE Banks & Offers

### Banks Available in Simulator

| Bank                             | Type                   | Logo Needed |
| :------------------------------- | :--------------------- | :---------- |
| First Abu Dhabi Bank (FAB)       | Conventional + Islamic | ✅          |
| Emirates NBD                     | Conventional           | ✅          |
| Abu Dhabi Commercial Bank (ADCB) | Conventional           | ✅          |
| Mashreq Bank                     | Conventional           | ✅          |
| Dubai Islamic Bank (DIB)         | Islamic                | ✅          |
| Abu Dhabi Islamic Bank (ADIB)    | Islamic                | ✅          |
| Emirates Islamic                 | Islamic                | ✅          |
| RAK Bank                         | Conventional           | ✅          |
| Commercial Bank of Dubai (CBD)   | Conventional           | ✅          |
| Sharjah Islamic Bank (SIB)       | Islamic                | ✅          |

### Sample Offers (Realistic UAE Market Rates)

**Personal Loan Buyout:**

| Offering Bank | Type                | Rate         | Tenure | EMI (on AED 50K) |
| :------------ | :------------------ | :----------- | :----- | :--------------- |
| FAB           | Conventional        | 5.99%        | 48 mo  | AED 1,177        |
| Emirates NBD  | Conventional        | 6.49%        | 36 mo  | AED 1,531        |
| DIB           | Sharia (Murābaḥa) | 6.25% profit | 48 mo  | AED 1,191        |
| ADIB          | Sharia (Tawarruq)   | 5.75% profit | 48 mo  | AED 1,165        |
| Mashreq       | Conventional        | 7.99%        | 36 mo  | AED 1,566        |

**Credit Card Balance Transfer:**

| Offering Bank    | Type         | Rate        | Period | Fee  |
| :--------------- | :----------- | :---------- | :----- | :--- |
| ADCB             | Conventional | 0% intro    | 6 mo   | 2%   |
| FAB              | Conventional | 0% intro    | 12 mo  | 3.5% |
| RAK Bank         | Conventional | 1.99%       | 24 mo  | 1%   |
| Emirates Islamic | Sharia       | 2.5% profit | 12 mo  | 2%   |

**Auto Loan Refinance:**

| Offering Bank | Type            | Rate         | Tenure | Note                |
| :------------ | :-------------- | :----------- | :----- | :------------------ |
| ENBD Auto     | Conventional    | 3.99%        | 60 mo  | Min AED 30K         |
| DIB Auto      | Sharia (Ijāra) | 4.25% profit | 60 mo  | Min AED 25K         |
| FAB Auto      | Conventional    | 4.49%        | 48 mo  | Salary transfer req |
