# BuyOut — Project Overview for Partners

> **One-liner:** A single digital platform that aggregates, analyzes, and executes consumer debt refinancing end-to-end.

---

## What BuyOut Does

A person in the UAE has a personal loan at 14.5%, a car loan at 12%, and credit card debt at 24%. Today, they'd have to visit each bank separately, fill out paperwork, and hope for a better rate — with zero visibility on their total position.

**BuyOut shows them everything in one dashboard, finds better offers across banks, and executes the switch — all from their phone.**

Four steps:
1. **See** — All debts in one place (loans, cards, BNPL, auto)
2. **Decide** — AI recommends the best restructuring plan across all liabilities
3. **Switch** — Apply to better offers, BuyOut handles settlement between banks
4. **Track** — Monitor new payments, credit score, and future optimization opportunities

---

## Who It's For

| Persona | Profile | Why They Need BuyOut |
|:--------|:--------|:---------------------|
| **Salaried Expat** (core) | AED 8K-25K salary, 2-4 debts | Cash flow stress, no visibility, afraid of credit score damage |
| **Emirati Government Employee** | AED 20K-50K, high job security | Overbanked, fragmented relationships, wants Sharia compliance |
| **BNPL User** | Age 22-35, digital-native | Small balances compounding fast, no central view |
| **Credit Score Repair** | Missed payments, declining score | Needs soft-check eligibility and step-by-step recovery |
| **Ethically Conscious Muslim** | Conflicted about interest-based loans | Wants transparent Sharia-compliant refinancing options |

---

## How We Make Money

**We are NOT a lender.** No balance sheet risk. We're a marketplace.

| Revenue Stream | How It Works |
|:---------------|:-------------|
| **Lender referral fee** | Banks pay us 1% for each loan originated through BuyOut |
| **Processing fees** | Small fee per completed refinance (Phase 2) |
| **Premium features** | Credit monitoring, advanced analytics (future) |

**Projections:** Year 1: AED 15.5M → Year 2: AED 31.6M → Year 3: AED 75.2M

---

## Market Opportunity

- **Total household debt in UAE:** ~$149 billion
- **Refinanceable stressed debt:** ~$31.5 billion (salaried, multi-debt users)
- **Our Year 1 target:** 1% = ~$315 million flowing through the platform

---

## Tech Stack — Simple Breakdown

We chose every tool to be **free or near-free** for MVP, but enterprise-grade when we scale.

| What | Tool | Why | Cost |
|:-----|:-----|:----|:-----|
| **App** | React Native + Expo | One codebase → iOS first, Android later | Free |
| **Database** | Supabase (PostgreSQL) | Relational DB for financial data, bank-grade security | Free (up to 500MB) |
| **Auth** | Supabase Auth | Login, OTP, social auth, MFA-ready | Free |
| **Server logic** | Supabase Edge Functions | Loan calculations, offer matching, API calls | Free (500K calls/mo) |
| **iOS builds** | Xcode → TestFlight | Build locally, test on our phones | Free + $99/yr Apple Dev |
| **Design** | Figma | UI design and prototyping | Free tier |

**Total MVP cost: ~$8/month + $99/year Apple Developer**

### Why Supabase Over Firebase?

| | Supabase ✅ | Firebase ❌ |
|:--|:-----------|:-----------|
| **Data model** | Relational (SQL) — perfect for loans, offers, payments | NoSQL — bad for financial relationships |
| **External API calls** | Free | Blocked on free tier — we'd pay from day 1 |
| **If we outgrow it** | Export database, move anywhere | Complete rewrite required |
| **Cost** | Predictable monthly | Pay-per-read, can spike |
| **Security** | Row-level policies — each user sees only their data | Less mature security model |

---

## Design Philosophy

### Colors
- **Blue** = Trust & Stability (used by every major bank for a reason)
- **Green** = Savings & Growth (shows what the user gains)
- **Dark Mode** = Premium feel for dashboards (like Revolut, Bloomberg)

### Design Inspirations
| App | What We Take From It |
|:----|:--------------------|
| **Revolut** | Premium dark mode, smooth animations |
| **Wise** | Clean financial dashboards, clear savings display |
| **Cash App** | Bold simplicity, clear money flow |
| **Robinhood** | Beautiful data visualization |

### Principles
1. **Trust first** — Every screen should feel like a bank, not a startup
2. **Show the gain** — Always highlight "You save AED X" in green
3. **Use existing libraries** — Don't build what's already been built well
4. **Premium feel** — No generic UI, no placeholders, no basic styling
5. **Arabic/RTL ready** — First-class citizen for UAE market

---

## MVP Screens (from Figma)

1. **Dashboard** — All debts at a glance with total exposure
2. **Loan Management** — Individual loan details with refinance potential
3. **Offer Management** — Browse available refinancing offers
4. **Offers Comparison** — Side-by-side: current bank vs. best offer
5. **Pending** — Track submitted applications
6. **Processing** — Active refinance in progress
7. **Profile** — Settings, notifications, partners

---

## Scaling Roadmap

| Phase | When | What Changes | Monthly Cost |
|:------|:-----|:-------------|:-------------|
| **MVP** | Now | Free everything, test with real users | ~$8 |
| **Growth** | 500+ users | Supabase Pro, error tracking, analytics | ~$100 |
| **Scale** | 5K+ users | Add AWS for AI/ML, connect bank APIs, Stripe | ~$500-1K |
| **Enterprise** | 50K+ users | Multi-region, compliance infrastructure | $5K+ |

Key insight: **PostgreSQL stays forever.** Whether on Supabase's free tier or AWS's enterprise servers — same database, zero migration.

---

## Competitive Edge

No one else sits in the "Digital + Sharia-Compliant + Executes Refinancing" space:

- **Banks** can't do it — they only sell their own products
- **Comparison sites** (souqalmal, yallacompare) — show rates but don't execute
- **Brokers** — offline, conventional, can't scale
- **BuyOut** — digital, Sharia-compliant, lender-agnostic, end-to-end execution

---

## Regulatory Position

- Licensed under UAE Central Bank Fintech Sandbox
- Sharia Advisory Board (AAOIFI-certified scholars)
- We never hold money — funds flow directly between banks
- Compliant with UAE Personal Data Protection Law

---

## Funding

- **Pre-seed:** AED 5M (USD 1.36M)
- **Use:** 40% tech, 25% marketing, 20% talent, 10% compliance, 5% reserve
- **Runway:** 18-20 months
- **Next raise:** USD 12-15M Seed for GCC expansion
