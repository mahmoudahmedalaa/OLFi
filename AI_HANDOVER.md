# AI HANDOVER — OLFi Marketing Site

> **Last Updated**: 2026-04-24  
> **Project**: OLFi (Islamic finance debt consolidation platform)  
> **Site**: Next.js 16 marketing site with `next-intl` localization

---

## 🚨 CRITICAL: CONTENT LOCK

**DO NOT modify any text content in the translation files.** The copy has been carefully written and refined by the founder. All canonical content is documented in `web/CONTENT_LOCK.md`.

- **English**: `web/messages/en.json`
- **Arabic**: `web/messages/ar.json`
- **Lock file**: `web/CONTENT_LOCK.md`

If you must make structural changes (key renaming, format migration), copy content **character-for-character**. Run `git diff` afterwards to verify zero content drift.

---

## Project Structure

```
BuyOut/
├── web/                          # Main marketing site (Next.js 16 + Turbopack)
│   ├── src/
│   │   ├── app/                  # App router (layout.tsx, page.tsx)
│   │   ├── components/           # All page sections
│   │   │   ├── Navigation.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SavingsCalculator.tsx
│   │   │   ├── FeaturesAccordion.tsx
│   │   │   ├── IslamicFinanceQA.tsx
│   │   │   ├── ComparisonTable.tsx
│   │   │   ├── BetaTestersStories.tsx
│   │   │   ├── FAQAccordion.tsx
│   │   │   ├── WaitlistCTA.tsx
│   │   │   └── Footer.tsx
│   │   ├── contexts/
│   │   │   └── LanguageContext.tsx  # Client-side locale state (en/ar toggle)
│   │   ├── i18n/
│   │   │   └── request.ts          # next-intl server config
│   │   └── utils/
│   │       └── supabase.ts         # Supabase client with validation
│   ├── messages/
│   │   ├── en.json                 # 🔒 LOCKED — English translations
│   │   └── ar.json                 # 🔒 LOCKED — Arabic translations
│   ├── public/assets/              # App screenshots, images
│   ├── .env.local                  # Supabase credentials (NOT committed)
│   ├── CONTENT_LOCK.md             # Content policy document
│   └── package.json
└── marketing-sites/                # Legacy/experimental sites (not active)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router, Turbopack) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Localization | `next-intl` (client provider mode, no i18n routing) |
| Fonts | Inter (English) + Cairo (Arabic, via Google Fonts) |
| Database | Supabase (PostgreSQL) |
| Icons | Lucide React |

---

## Localization Architecture

Uses `next-intl` in **"without i18n routing"** mode — single URL structure, client-side language toggle.

- `src/i18n/request.ts` — Loads messages server-side based on cookie/default
- `src/contexts/LanguageContext.tsx` — Client-side state manager for locale persistence
- `layout.tsx` — Wraps app in `NextIntlClientProvider`
- All 10 components use `useTranslations('namespace')` hook

**RTL Support**: Arabic activates `dir="rtl"` on `<html>`, Cairo font, and mirrored layout.

---

## Supabase Configuration

### Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL="https://uivkpqjdoqwgfhvnskaw.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### ⚠️ BLOCKING: Waitlist Table Does Not Exist

The `public.waitlist` table has **not been created yet**. The waitlist form submits to `supabase.from('waitlist').insert(...)` but the table doesn't exist in the database.

**To fix — run this SQL in the Supabase Dashboard SQL Editor:**

```sql
CREATE TABLE public.waitlist (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
  ON public.waitlist FOR INSERT
  TO anon
  WITH CHECK (true);
```

Dashboard URL: https://supabase.com/dashboard/project/uivkpqjdoqwgfhvnskaw/sql/new

### Key Format Notes
- The **anon key** (JWT format, starts with `eyJ...`) is used in `.env.local` for the client
- The `sb_publishable_` / `sb_secret_` keys are Supabase's newer format — **NOT compatible** with PostgREST or the `@supabase/supabase-js` client library
- The **service_role key** (also JWT format) is needed for admin operations but is NOT stored in this project

---

## Waitlist Form Flow

1. User enters email in `WaitlistCTA.tsx`
2. `getSupabase()` creates client from env vars (with validation)
3. Inserts into `public.waitlist` table
4. Handles duplicate emails gracefully (error code `23505`)
5. Shows success state with countdown timer

---

## Running Locally

```bash
cd web
npm install
npm run dev        # → http://localhost:3000
npm run build      # Production build verification
```

---

## Writing Style Rules (Strictly Enforced)

- **No full stops** on headlines/statements
- **No em-dashes** (—) anywhere
- Punchy, direct, premium fintech tone
- UAE-market specific terminology (AECB, AED, DBR)

---

## Git History Context

| Commit | What Changed |
|--------|-------------|
| `068c3f3` | Original hardcoded content — Hero: "Lower your / loan payments / Refinance smarter" |
| `49511fe` | Animation upgrades — Hero changed to "Outsmart your debt" (REVERTED) |
| `fa6a489` | Content extracted into `en.ts` / `ar.ts` translation files |
| `ceef784` | Content refined (4 feature steps, OLFi branding) |
| Current | Content migrated to `en.json` / `ar.json` via `next-intl`, original hero restored |

---

## Known Issues

1. **Waitlist table missing** — Must be created via Supabase SQL Editor (see SQL above)
2. **`ENVIRONMENT_FALLBACK` warning** — Non-blocking `next-intl` timezone warning; can be fixed by adding `timeZone: 'Asia/Dubai'` to `src/i18n/request.ts`
3. **Vercel deployment** — Ensure `.env.local` variables are set in Vercel project settings

---

## What NOT To Do

1. ❌ Do NOT change copy in `en.json` or `ar.json`
2. ❌ Do NOT use `sb_publishable_` or `sb_secret_` keys in `.env.local` — use JWT format keys only
3. ❌ Do NOT delete `CONTENT_LOCK.md`
4. ❌ Do NOT add new translation keys without preserving existing ones character-for-character
5. ❌ Do NOT restructure the component architecture without explicit approval
