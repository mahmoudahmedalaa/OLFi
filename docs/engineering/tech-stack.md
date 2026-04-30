# Technology Stack — OLFi MVP

> Every technology decision locked down with exact versions. No "latest" — pin everything.
> **Philosophy: Free/cheap for MVP, scalable architecture for production.**

## 1. Stack Overview

| Dimension | Decision | Justification |
|:----------|:---------|:--------------|
| **Architecture** | Modular Monolith (Feature-Based) | Simple to build, test, deploy. Easy to extract into microservices later |
| **Platform** | iOS-first (React Native / Expo) | User's primary target. Xcode archive + TestFlight for testing |
| **Backend** | Supabase (BaaS) | Free tier: PostgreSQL, Auth, Edge Functions, Realtime, Storage — all-in-one |
| **Deployment** | Xcode local builds → TestFlight | Free, no EAS Build costs. Full native feature access |
| **Scale Target** | MVP → 1K users | Free tiers cover this. Upgrade path clear |

---

## 2. Supabase vs Firebase — Full Comparison

### The Decision Matrix

| Dimension | Supabase | Firebase | Winner for OLFi |
|:----------|:---------|:---------|:------------------|
| **Database Model** | PostgreSQL (relational) — SQL joins, CTEs, views, transactions | Firestore (NoSQL document) — denormalized, no joins | **Supabase** — financial data is inherently relational (users → loans → offers → payments) |
| **Data Integrity** | Full ACID transactions, foreign keys, constraints | Eventual consistency, no foreign keys | **Supabase** — money demands strict consistency |
| **Query Power** | Full SQL — `SELECT loans JOIN offers WHERE rate < current_rate` | Limited to single-collection queries, no server-side joins | **Supabase** — debt aggregation requires complex multi-table queries |
| **Security Model** | Row Level Security (RLS) — PostgreSQL policies per row, per user | Firestore Security Rules — JSON-based, can get complex | **Supabase** — RLS is more natural for "user can only see their own loans" |
| **Auth** | GoTrue: email/pass, OTP, OAuth, MFA, SSO. Free for 50K MAU | Firebase Auth: same features. Free for 50K MAU | **Tie** — Both excellent and free |
| **Serverless Functions** | Edge Functions (Deno/TypeScript). Free: 500K invocations/mo | Cloud Functions (Node.js). Free: 125K invocations/mo BUT no outbound network on free tier (Spark plan) | **Supabase** — Firebase requires paid Blaze plan to call external APIs (Open Banking, AECB, etc.) |
| **Real-time** | PostgreSQL WAL-based subscriptions. Built-in | Firestore listeners. Built-in, excellent | **Tie** — Both great. Firebase slightly more mature |
| **Storage** | 1GB free (S3-compatible). Direct URL access | 5GB free (GCS-backed). Firebase Storage rules | **Firebase** has more free storage, but both sufficient for MVP |
| **Offline Support** | Basic (community solutions) | Excellent — Firestore caches locally, syncs automatically | **Firebase** — but offline is not critical for debt refinancing (users need live bank data) |
| **Pricing Predictability** | Based on storage + compute. Predictable monthly cost | Based on reads/writes/bandwidth. Can spike unpredictably | **Supabase** — fintech apps need cost predictability |
| **Vendor Lock-in** | Open source. Can `pg_dump` → self-host or AWS RDS anytime | Proprietary. Migration to any other DB = rewrite entire data layer | **Supabase** — zero-cost exit strategy |
| **AI/ML Ready** | pgvector for embeddings, PostgreSQL ML extensions | Vertex AI integration, Firebase AI Logic | **Tie** — Both have paths, Supabase more DIY |

### Free Tier Comparison

| Resource | Supabase Free | Firebase Spark (Free) |
|:---------|:--------------|:----------------------|
| Database | 500MB PostgreSQL | 1GB Firestore |
| Auth Users | 50,000 MAU | 50,000 MAU |
| Storage | 1GB | 5GB |
| Functions | 500K invocations | 125K invocations |
| Outbound API calls | ✅ Included | ❌ Requires Blaze (pay-as-you-go) |
| Bandwidth | 5GB | 10GB |
| Realtime | ✅ Included | ✅ Included |
| Daily Backups | ❌ (Pro plan) | ❌ (Blaze plan) |

### 🏆 My Recommendation: Supabase

> [!IMPORTANT]
> **For OLFi specifically, Supabase wins decisively.** Here's why:

1. **Financial data is relational.** A user has loans across banks → each loan has offers → each offer has terms → decisions affect credit score. This is a textbook relational problem. Trying to model this in Firestore's NoSQL would mean denormalizing data everywhere, leading to bugs in financial calculations.

2. **You need to call external APIs for free.** OLFi's core value is connecting to banks, credit bureaus, and lender APIs. Firebase's free Spark plan blocks ALL outbound network calls from Cloud Functions — you'd be forced onto the Blaze plan immediately.

3. **Exit strategy matters.** If OLFi grows and you need to move to AWS RDS or self-host for regulatory reasons (Central Bank compliance, data sovereignty), Supabase → PostgreSQL migration is a `pg_dump` command. Firebase → anything else is a complete rewrite.

4. **Complex queries are the product.** "Show me all my loans, ranked by how much I'd save by refinancing each one, factoring in early settlement fees" — this is one SQL query in Supabase, but would require multiple Firestore reads + client-side computation in Firebase.

### When Firebase Would Be Better (Not This Project)
- Chat apps (real-time document sync is unmatched)
- Simple CRUD apps without relational data
- Apps needing robust offline-first support
- Rapid prototypes where you don't care about data portability

---

## 3. Frontend Stack

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Framework** | React Native 0.76.9 (Expo SDK 52) | Cross-platform with native iOS access | [expo.dev](https://docs.expo.dev) | Flutter — Dart ecosystem smaller for fintech |
| **Language** | TypeScript 5.6.3 | Type safety for financial calculations | [typescriptlang.org](https://www.typescriptlang.org) | JavaScript — too error-prone for money |
| **Styling** | React Native StyleSheet + NativeWind 4.1 | Tailwind-style utility classes, fast iteration | [nativewind.dev](https://www.nativewind.dev) | styled-components — heavier bundle |
| **State Mgmt** | Zustand 5.0.3 | Lightweight, TypeScript-first, no boilerplate | [zustand](https://github.com/pmndrs/zustand) | Redux Toolkit — overkill for MVP |
| **Navigation** | Expo Router 4.0 (file-based) | File-system routing, deep links built-in | [expo.dev/router](https://docs.expo.dev/router) | React Navigation — more manual config |
| **Forms** | React Hook Form 7.54.2 + Zod 3.24.2 | Performant forms + schema validation | [react-hook-form.com](https://react-hook-form.com) | Formik — heavier, slower re-renders |
| **UI Library** | gluestack-ui v2 | Unstyled, accessible, NativeWind-native, full component set | [gluestack.io](https://gluestack.io) | React Native Paper — Material Design feels Android-ish on iOS; Tamagui — complex setup; react-native-reusables — smaller community |
| **Charts** | Victory Native 41.6 | Financial data visualization (debt breakdown, savings) | [formidable.com/open-source/victory](https://formidable.com/open-source/victory) | react-native-chart-kit — less customizable |
| **Animations** | React Native Reanimated 3.16 | Smooth 60fps animations for premium feel | [docs.swmansion.com](https://docs.swmansion.com/react-native-reanimated) | Animated API — limited, jank on complex |

---

## 4. Backend Stack (Supabase)

| Technology | Version | Purpose | Docs | Alternative Considered |
|:-----------|:--------|:--------|:-----|:-----------------------|
| **Platform** | Supabase (Free Tier) | All-in-one BaaS: DB, Auth, Functions, Storage | [supabase.com/docs](https://supabase.com/docs) | AWS — requires setup, costs from day 1 |
| **Database** | PostgreSQL 15 (Supabase-managed) | Relational DB for financial data, RLS, full SQL | Included | Firebase Firestore — NoSQL bad for finance |
| **Auth** | Supabase Auth (GoTrue) | Email/pass, OTP, OAuth, MFA-ready | [supabase.com/docs/auth](https://supabase.com/docs/guides/auth) | Firebase Auth — vendor lock-in |
| **Edge Functions** | Supabase Edge Functions (Deno) | Serverless logic: loan calculations, offer matching | [supabase.com/docs/functions](https://supabase.com/docs/guides/functions) | AWS Lambda — needs setup + billing |
| **File Storage** | Supabase Storage | KYC documents, user uploads (future) | [supabase.com/docs/storage](https://supabase.com/docs/guides/storage) | S3 — cost, complexity |
| **Real-time** | Supabase Realtime | Live updates: offer status, processing state | [supabase.com/docs/realtime](https://supabase.com/docs/guides/realtime) | Pusher — additional cost |
| **Email** | Supabase Auth emails (MVP) → Resend (later) | Transactional auth emails | Built-in | SendGrid — overkill for MVP |
| **Payments** | Stripe 16.x (future Phase 2) | Payment processing when ready | [stripe.com/docs](https://stripe.com/docs) | Deferred until post-MVP |

---

## 5. Development Tools

| Tool | Version | Purpose |
|:-----|:--------|:--------|
| **Package Manager** | npm 10.x | Dependency management |
| **Linter** | ESLint 9.x + @typescript-eslint | Code quality |
| **Formatter** | Prettier 3.4.x | Consistent formatting |
| **Git Hooks** | Husky 9.x + lint-staged | Pre-commit checks |
| **Testing** | Jest 29.x + @testing-library/react-native | Unit + component tests |
| **E2E Testing** | Maestro 1.39.x | Mobile E2E testing (free, YAML-based) |
| **IDE** | Cursor / VS Code | AI-assisted development |
| **iOS Build** | Xcode 16.x → `build-ios.sh` → Transporter | Local builds, TestFlight distribution |
| **Figma** | Figma API + Framelink MCP | Design-to-code pipeline |

---

## 6. Environment Variables

```bash
# Application
APP_NAME="buyout"
APP_ENV="development"  # development | staging | production

# Supabase
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Feature Flags
EXPO_PUBLIC_ENABLE_SHARIA_MODE=true
EXPO_PUBLIC_ENABLE_BNPL=false
EXPO_PUBLIC_ENABLE_CREDIT_SCORE=false

# Future (not needed for MVP)
# STRIPE_SECRET_KEY="sk_..."
# AECB_API_KEY="..."
# OPEN_BANKING_CLIENT_ID="..."
```

> ⚠️ Never commit `.env` files. Use `.env.example` as a template.
> Only `EXPO_PUBLIC_` prefixed vars are exposed to the client.

---

## 7. Dependencies Lock

### Core
```json
{
  "expo": "~52.0.0",
  "react": "18.3.1",
  "react-native": "0.76.9",
  "typescript": "~5.6.3",
  "expo-router": "~4.0.0",
  "@supabase/supabase-js": "^2.47.12",
  "zustand": "^5.0.3",
  "react-hook-form": "^7.54.2",
  "zod": "^3.24.2",
  "@hookform/resolvers": "^3.9.1",
  "@gluestack-ui/themed": "^2.0.0",
  "@gluestack-ui/config": "^2.0.0",
  "react-native-reanimated": "~3.16.0",
  "nativewind": "^4.1.0",
  "victory-native": "^41.6.0",
  "react-native-svg": "^15.8.0"
}
```

### Dev
```json
{
  "eslint": "^9.0.0",
  "prettier": "^3.4.0",
  "husky": "^9.0.0",
  "jest": "^29.7.0",
  "@testing-library/react-native": "^12.9.0",
  "@types/react": "~18.3.0"
}
```

> Pin exact versions. Run `npm audit` monthly.

---

## 8. Security Considerations

| Area | Approach |
|:-----|:---------|
| **Authentication** | Supabase Auth with JWT (1hr access, 7d refresh). MFA-ready |
| **Passwords** | bcrypt via Supabase Auth (managed) |
| **API Security** | Supabase RLS — every table has row-level policies. Anon key = read-only |
| **Rate Limiting** | Supabase built-in + Edge Function rate limiting |
| **Data Protection** | Supabase encrypts at rest (AES-256). SSL in transit |
| **Secrets** | Never in code — `.env` only, `EXPO_PUBLIC_` prefix for client-safe vars |
| **Financial Data** | All monetary values stored as integers (fils/cents) to avoid floating point |
| **KYC/PII** | Stored in separate schema with stricter RLS. Future: encrypted columns |

---

## 9. Version Upgrade Policy

| Type | Frequency | Process |
|:-----|:----------|:--------|
| **Major** | Quarterly review | Test in dev → compatibility check → rollback plan |
| **Minor/Patch** | Monthly | Automated via Dependabot → review weekly |
| **Security** | ASAP | Emergency patch process |
| **Expo SDK** | Per release (~quarterly) | Follow Expo upgrade guide, test on device |

---

## 10. Cost Summary (MVP Phase)

| Service | Free Tier | Limit | When to Upgrade |
|:--------|:----------|:------|:----------------|
| **Supabase** | ✅ Free | 500MB DB, 1GB storage, 50K auth users, 500K Edge Function invocations | >500MB data or need backups |
| **Xcode + TestFlight** | ✅ Free | Unlimited builds | Never — always free |
| **Apple Developer** | $99/year | Required for TestFlight/App Store | Already have or need to get |
| **Figma** | ✅ Free (Starter) | 3 projects | Need Dev Mode features |
| **Vercel** (web landing) | ✅ Free | 100GB bandwidth | Production web app |
| **GitHub** | ✅ Free | Unlimited private repos | Need advanced CI/CD |
| **Total MVP Cost** | **~$0–$8/month** | + $99/yr Apple Dev | |
