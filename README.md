# OLFi

**Smart debt management & refinancing for the UAE.**

OLFi helps users track their existing debts, compare refinance offers from UAE banks, and find better rates from one app.

Start with [PROJECT_MAP.md](PROJECT_MAP.md) before making changes. It defines the canonical app surfaces and the historical/reference areas so future work lands in the right place.

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Mobile Framework | Expo / React Native |
| Routing | Expo Router |
| UI | Gluestack-UI + NativeWind |
| Backend | Supabase (Auth, Postgres, RLS) |
| Language | TypeScript |
| Platform | iOS (iPhone) |
| Web | Next.js on Vercel |

## Getting Started

### Mobile App

```bash
# Install dependencies
cd app && npm install

# Start dev server
npx expo start

# Generate iOS project for Xcode
npx expo prebuild --platform ios --clean

# Open in Xcode
open ios/OLFi.xcworkspace
```

For release testing, use local Xcode Archive and TestFlight. Do not use Expo Go or EAS Build for production verification.

### Marketing Site

```bash
cd web && npm install
npm run dev
```

### Admin Dashboard

```bash
cd admin && npm install
npm run dev
```

## Project Structure

```
OLFi/
├── app/                 # Expo app (source code)
│   ├── app/             # Screens & routing
│   │   ├── (auth)/      # Login, Signup, KYC
│   │   ├── (tabs)/      # Dashboard, Debts, Offers, Profile
│   │   └── _layout.tsx  # Root layout
│   ├── components/      # Reusable components
│   └── lib/             # Supabase client, auth context, constants
├── web/                 # Next.js marketing site
├── docs/                # All project documentation
│   ├── product/         # PRD, app flow, user stories
│   ├── engineering/     # Tech stack, architecture, setup guide
│   ├── design/          # Brand identity, frontend guidelines
│   ├── deployment/      # TestFlight, App Store, git flow
│   ├── financial/       # Monetisation, cost projections
│   ├── legal/           # DPA, security audit, integrations policy
│   ├── calculations/    # Financial logic & edge cases
│   ├── analytics/       # Event tracking dictionary
│   └── knowledge-base/  # Bug templates, QA scripts, troubleshooting
├── assets/              # Shared brand assets (logos, icons, splash)
├── research/            # Market research & competitor analysis
├── reference/           # Pitch deck, business plan, KYC docs
├── shared/              # Files shared with external collaborators
├── agent-config/        # Agent rules, skills, scripts
├── workflows/           # Dev, deployment, Xcode guides
├── checklists/          # App Store launch checklist
├── admin/               # Admin dashboard (internal)
├── archive/             # Local/historical artifacts, read-only by default
└── supabase/            # Supabase migrations & config
```

## Canonical Surfaces

| Surface | Location | Source of Truth |
|:--|:--|:--|
| Mobile app | `app/` | Yes |
| Marketing site | `web/` | Yes |
| Admin dashboard | `admin/` | Yes |
| Backend | `supabase/` | Yes |
| Prototype | Vercel project `olfi-prototype` | Yes for prototype only |
| Historical shared assets | `shared/` | Reference only unless explicitly promoted |

## Git Flow

See [.agent/workflows/git-flow.md](.agent/workflows/git-flow.md) for full branching & commit conventions.

```
main     ← production (TestFlight / App Store)
chore/*  ← maintenance and cleanup
feature/*, fix/*, docs/*
develop  ← historical integration branch, keep until branch strategy is finalized
  └── feature/*, fix/*, chore/*
```

Current stabilization branch: `chore/repo-stabilization`.
Safety snapshot branch: `archive/pre-cleanup-20260511`.

## Database

Supabase (ap-south-1) with 7 tables:
- `profiles` — Extended user data, KYC status
- `banks` — 8 UAE banks (Emirates NBD, ADCB, FAB, DIB, ADIB, Mashreq, RAKBANK, CBD)
- `bank_products` — Loan products with rates, fees, features
- `user_loans` — User's existing loans
- `refinance_offers` — Generated refinance comparisons
- `user_documents` — KYC document uploads
- `notifications` — In-app notifications

All tables have Row Level Security (RLS) enabled.

## Technical Identifier Note

Some internal identifiers still contain `buyout`, including the bundle ID, Expo slug, app scheme, Android package, and Supabase project name. These are retained intentionally for continuity and should only be migrated in a dedicated release task.

## License

Private — All rights reserved.
