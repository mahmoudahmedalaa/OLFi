# Implementation Plan — BuyOut MVP

> Build sequence: what to build, in what order, and why.

---

## 1. Build Phases

### Phase 1: Foundation (Week 1-2)
> Set up the project, auth, and basic navigation. Nothing custom yet — all library setup.

| Task | Deliverable | Dependencies |
|:-----|:------------|:-------------|
| Init Expo project with TypeScript | Working `npx expo start` | None |
| Configure NativeWind + React Native Paper | Theme system, dark/light mode | Expo project |
| Set up Expo Router (file-based navigation) | Tab bar + stack navigation | Expo project |
| Supabase project creation | Database, auth, API keys | Supabase account |
| Apply database migrations | All 5 tables + RLS policies | Supabase project |
| Seed mock offer data | 15-20 realistic UAE bank offers | Database schema |
| Wire Supabase Auth (email, Google, Apple, OTP) | Working sign up / login / verify | Supabase Auth config |
| Welcome + Auth screens | Functional auth flow | Navigation + Auth |
| Biometric auth (Face ID / Touch ID) | Returning user fast-login | Auth working |

### Phase 2: Core Features (Week 3-4)
> The main product loop: add debt → see dashboard → browse offers.

| Task | Deliverable | Dependencies |
|:-----|:------------|:-------------|
| Onboarding flow (3 steps) | Animated welcome screens | Navigation |
| Add Debt form | Working form with all 7 fields + validation | Database + Auth |
| Edit / Delete Debt | Full CRUD on debts | Add Debt |
| Dashboard screen | Total debt + savings hero, debt card list | Debts table |
| Credit Health Indicator | Health calculation from entered data | Debts + Profile |
| Debt Detail screen | Full debt view with "See Offers" link | Dashboard |
| Offers list with filters | Browse offers, Sharia toggle, sort by rate | Offers table |

### Phase 3: Offer Flow + Polish (Week 5-6)
> The monetization loop: compare → accept → lead capture.

| Task | Deliverable | Dependencies |
|:-----|:------------|:-------------|
| Offer Detail + Comparison view | Side-by-side current vs. offer | Debts + Offers |
| Savings calculator (Edge Function) | Monthly & total savings calculation | Debts + Offers |
| Offer Acceptance flow | Success screen + lead capture form | Offer Detail |
| Profile screen + Personal Details | View/edit user info, salary optional | Auth + Profiles table |
| Notification Settings screen | Toggle preferences | Profile |
| Push Notifications setup | expo-notifications + triggers | Edge Functions |

### Phase 4: Premium Polish (Week 7-8)
> "Coming Soon" features, animations, investor-readiness.

| Task | Deliverable | Dependencies |
|:-----|:------------|:-------------|
| UAE Pass "Coming Soon" modal | 3-screen animated preview | Auth screens |
| AECB Bank Sync "Coming Soon" modal | 3-screen animated preview | Debt screens |
| AECB Credit Score "Coming Soon" modal | Preview of real score | Credit Health |
| Micro-animations | Card press, number count-up, skeleton loading | All screens |
| Haptic feedback | On key actions (accept offer, add debt) | Core flows |
| Dark mode dashboard polish | Premium dark theme for data screens | Theme system |
| Error states + empty states | Illustrations, retry buttons | All screens |
| App icon + splash screen | Branded assets | Design |

### Phase 5: Ship (Week 9-10)
> TestFlight, bug fixes, investor demo prep.

| Task | Deliverable | Dependencies |
|:-----|:------------|:-------------|
| Xcode build + TestFlight upload | Working IPA on TestFlight | All features |
| Beta testing (20-50 users) | Bug reports, UX feedback | TestFlight |
| Bug fix sprint | Resolution of beta issues | Beta feedback |
| App Store metadata prep | Screenshots, description, privacy policy | Working app |
| Investor demo script | Guided walkthrough of the app | All features |

---

## 2. Risk Mitigation

| Risk | Likelihood | Mitigation |
|:-----|:-----------|:-----------|
| Supabase free tier limits hit | Low (MVP) | Monitor usage, upgrade path documented |
| Complex form validation edge cases | Medium | Zod schemas for strict validation |
| Offer calculation bugs (money) | Medium | BIGINT fils everywhere, unit tests for calculations |
| TestFlight build failures | Medium | Build script documented, Xcode config pinned |
| UAE bank data accuracy | Low | Disclaimer: "Illustrative offers," rates verified against public data |

---

## 3. Definition of Done (MVP)

- [ ] User can sign up, verify email, and login
- [ ] User can add, edit, delete debts (all 4 types)
- [ ] Dashboard shows total debt + potential savings
- [ ] Credit Health Indicator works based on entered data
- [ ] User can browse offers filtered by Sharia compliance
- [ ] Offer comparison view shows current vs. best offer with savings
- [ ] Offer acceptance captures lead (name, phone, preferred time)
- [ ] Push notifications work for all 3 trigger types
- [ ] "Coming Soon" modals work for UAE Pass, AECB Sync, AECB Score
- [ ] Dark mode works across all screens
- [ ] App builds and runs on TestFlight successfully
- [ ] No crashes on iPhone 13+ running iOS 16+
