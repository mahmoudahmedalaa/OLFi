# BuyOut

**Smart loan management & refinancing for the UAE.**

BuyOut helps users track their existing loans, compare refinance offers from UAE banks, and find better rates — all from one app.

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| Framework | Expo (React Native) |
| Routing | Expo Router v4 |
| UI | Gluestack-UI v3 + NativeWind |
| Backend | Supabase (Auth, Postgres, RLS) |
| Language | TypeScript |
| Platform | iOS (iPhone) |

## Getting Started

```bash
# Install dependencies
cd app && npm install

# Start dev server
npx expo start

# Generate iOS project for Xcode
npx expo prebuild --platform ios --clean

# Open in Xcode
open ios/BuyOutapp.xcworkspace
```

## Project Structure

```
BuyOut/
├── app/                    # Expo app (source code)
│   ├── app/                # Screens & routing
│   │   ├── (auth)/         # Login, Signup
│   │   ├── (tabs)/         # Dashboard, Loans, Offers, Profile
│   │   └── _layout.tsx     # Root layout
│   ├── components/         # Reusable components
│   ├── lib/                # Supabase client, auth context, constants
│   └── assets/             # Images, fonts
├── 00-research/            # Market research & competitor analysis
├── 01-docs/                # PRD, tech stack, app flow, design guidelines
├── 02-agent/               # Agent config, rules, skills
├── 03-workflows/           # Dev, deployment, Xcode guides
├── 05-checklists/          # App Store launch checklist
└── reference-docs/         # Brand assets, pitch deck, business plan
```

## Git Flow

See [.agent/workflows/git-flow.md](.agent/workflows/git-flow.md) for full branching & commit conventions.

```
main     ← production (TestFlight / App Store)
develop  ← integration (features merge here)
  └── feature/*, fix/*, chore/*
```

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

## License

Private — All rights reserved.
