# BuyOut — Handover Document
> Last updated: 2026-02-16

---

## Project Overview

**BuyOut** is a fintech iOS app for UAE consumers to aggregate their debts, compare refinancing offers effortlessly, and execute switches to save money. The product ecosystem consists of:
1. **iOS App** (React Native / Expo / NativeWind)
2. **Admin Panel** (Next.js / Tailwind)
3. **Backend** (Supabase: Postgres + Auth + Edge Functions)

- **Repo:** https://github.com/mahmoudahmedalaa/buyout
- **Branches:** `main` and `feature/phase-4-advanced` (currently active)
- **Supabase Project ID:** `uivkpqjdoqwgfhvnskaw`
- **Bundle ID:** `com.mahmoudahmedalaa.buyout`

---

## Current State: Phase 4 (Polish & Admin) Complete

The app has grown significantly. **All core user flows are now fully functional and connected to the real database.**

### ✅ Features Done & Fully Integrated

**Mobile App (iOS):**
- **Auth & Profiles:** Signup, Login, Profile editing, push notification settings structure.
- **Theming:** Full Dark/Light mode toggle with persistence via context.
- **Debt Management:** Users can Add, Edit, and Delete their loans.
- **Dashboard:** Dynamic calculation of total debt and potential savings based on real user loans.
- **Refinancing Engine (Edge Functions):** The app securely calls `match-offers` to calculate real-time savings based on actual bank products in the DB.
- **Offer Flow:** Users can browse matched offers, view detailed comparison (Current vs. New EMI), and initiate an application.
- **Application Submission:** Securely handled via `submit-application` Edge Function which writes to the DB and triggers notifications.
- **Analytics:** Custom client-side tracker (`trackEvent`, `trackScreen`) logging events to the `analytics_events` table in Supabase.
- **UX Polish:** "Coming Soon" modals (UAE Pass, AECB), empty states, error handling, haptic feedback on key interactions.

**Admin Panel (Next.js):**
- **Dashboard:** Key metrics, recent applications, and recent loans.
- **Analytics Dashboard:** Event streams, active users counts, conversion funnels (Screen Views → Offer Views → Applications).
- **Application Management:** View applications, update status (Approve, Reject, Request Docs) via modals. Formally notifies the user via Supabase.
- **Loans Management:** Full CRUD. Clickable rows to drill down, edit details inline, or manually change loan status.
- **Bank & Product Management:** Full CRUD system for managing the mock UAE banks and their associated loan products.
- **Notifications system:** Send targeted or broadcast in-app messages to users. User dropdown displays verified emails directly from `auth.users`.
- **User Drill-down:** Inspect a specific user's profile, loans, applications, and activity timeline.

---

### ⏳ In Progress / Needs Polish

- **Notion Architecture Build:** A Notion MCP connection is established with a BuyOut Internal bot (`ntn_...`). The most immediate task is picking up the `implementation_plan.md` from the previous session to fully construct the Engineering, Legal, and Product databases under a single Notion Root Page.
- **Tenure Adjustment Slider:** `refinance-calculator.ts` logic has been mathematically audited and perfected. However, `apply-offer.tsx` needs a UI slider so users can toggle between maximizing monthly cash savings vs. total debt interest savings.
- **Push Notifications:** The database structure for `notifications` exists and is populated via Edge Functions/Admin Panel. Real APNs/FCM push notification delivery requires Expo credentials setup.
- **Khatma/Islamic filtering:** Sharia compliance toggles exist in the UI and DB, but need stricter enforcement during offer matching if requested by the user.

---

### 🔮 Future Features (Phase 5 & Post-MVP)

- **TestFlight Distribution:** Final Xcode archiving, fixing any provisioning profile issues, and pushing to internal testers.
- **AECB Integration:** Replace "Coming Soon" modals with actual API integration or a secure sandbox environment for fetching real credit scores and debt data.
- **UAE Pass:** Native integration for seamless onboarding.
- **Document OCR:** Allow users to upload loan statements and automatically parse the remaining amount, rate, and EMI.
- **Investor Demo Polish:** Scripting the happy path and ensuring the mock data in Supabase perfectly aligns with the pitch narrative.

---

## Next Agent Instructions

Start by reviewing this document to understand the architecture. **The project is currently working from the `feature/phase-4-advanced` branch**, but recent Admin Panel fixes and Legal Documents (`docs/privacy-policy.md` + `docs/terms-of-service.md`) were successfully merged up to `main` for Vercel/GitHub Pages deployment.

**Key Architecture Notes:**
1. **Notion Automation (NEW):** You have access to the Notion MCP. Ask the user for the parent Page ID, and start constructing the detailed business databases outlined in their latest conversations.
2. **Supabase Edge Functions** handle sensitive operations: `match-offers` (business logic for calculating savings) and `submit-application` (saving to DB and triggering notifications).
3. **Admin Panel** uses Server Actions exclusively (`admin/lib/actions.ts`).
4. **App Styling** uses NativeWind and a strictly enforced `theme-context.tsx`.

**Immediate Next Steps:**
1. Focus heavily on executing the Notion Architecture build. Ask the user for the parent page URL/ID to begin scaffolding databases.
2. Once the Notion build is stable, pivot immediately back to implementing the "Tenure Adjustment Slider" in `apply-offer.tsx`.
3. Use `npx expo start` to verify mobile builds during UI modifications.
