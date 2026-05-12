# Backend Structure — OLFi MVP

> Supabase-powered backend with PostgreSQL, Edge Functions, Auth, and Realtime.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 React Native App                 │
│          (Expo + Supabase JS Client)            │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS
┌──────────────────────▼──────────────────────────┐
│              Supabase Platform                   │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │   Auth    │  │ Storage  │  │ Edge Functions│  │
│  │ (GoTrue) │  │  (S3)    │  │   (Deno)     │  │
│  └────┬─────┘  └──────────┘  └──────┬───────┘  │
│       │                              │          │
│  ┌────▼──────────────────────────────▼───────┐  │
│  │           PostgreSQL Database              │  │
│  │  + Row Level Security (RLS)                │  │
│  │  + Realtime (WAL subscriptions)            │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### Core Tables

#### `profiles` — Extended user info
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  nationality TEXT,
  employment_type TEXT CHECK (employment_type IN ('public', 'private', 'self_employed')),
  monthly_salary_fils BIGINT,  -- Optional, stored in fils (1 AED = 100 fils)
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `debts` — User's liabilities
```sql
CREATE TABLE debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  debt_type TEXT NOT NULL CHECK (debt_type IN ('personal_loan', 'auto_loan', 'credit_card', 'bnpl')),
  outstanding_amount_fils BIGINT NOT NULL,  -- Stored in fils
  monthly_payment_fils BIGINT NOT NULL,
  interest_rate DECIMAL(5,2) NOT NULL,  -- e.g., 14.50
  remaining_tenure_months INTEGER NOT NULL,
  compliance_type TEXT NOT NULL CHECK (compliance_type IN ('sharia', 'conventional', 'not_sure')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `offers` — Simulated bank offers
```sql
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name TEXT NOT NULL,
  bank_logo_url TEXT,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('personal_loan', 'auto_loan', 'credit_card', 'bnpl')),
  compliance_type TEXT NOT NULL CHECK (compliance_type IN ('sharia', 'conventional')),
  interest_rate DECIMAL(5,2) NOT NULL,
  min_amount_fils BIGINT,
  max_amount_fils BIGINT,
  min_tenure_months INTEGER,
  max_tenure_months INTEGER,
  processing_fee_percent DECIMAL(4,2),
  early_settlement_fee_percent DECIMAL(4,2),
  salary_transfer_required BOOLEAN DEFAULT false,
  special_terms TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `offer_applications` — When user accepts an offer (lead capture)
```sql
CREATE TABLE offer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  debt_id UUID NOT NULL REFERENCES debts(id),
  offer_id UUID NOT NULL REFERENCES offers(id),
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'documents_requested', 'conditional_approval', 'approved', 'rejected', 'completed')),
  rejection_reason TEXT,
  approval_conditions TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  preferred_contact_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `application_status_history` — Timeline of status changes
```sql
CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES offer_applications(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL DEFAULT 'system',  -- 'system', 'ops_team', 'bank_api' (future)
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `application_documents` — Documents uploaded by user
```sql
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES offer_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  document_type TEXT NOT NULL CHECK (document_type IN ('salary_certificate', 'bank_statement', 'emirates_id', 'trade_license', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);
```

#### `notifications` — Push notification records
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_offer', 'payment_reminder', 'status_change', 'system')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  data JSONB,  -- Extra payload (offer_id, debt_id, etc.)
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Row Level Security (RLS) Policies

> Every table must have RLS enabled. Users see only their own data.

```sql
-- Profiles: users see/edit only their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Debts: users see/manage only their own
ALTER TABLE debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own debts" ON debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own debts" ON debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own debts" ON debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own debts" ON debts FOR DELETE USING (auth.uid() = user_id);

-- Offers: public read (simulated offers visible to all authenticated users)
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users read offers" ON offers FOR SELECT USING (auth.role() = 'authenticated');

-- Offer Applications: users see only their own
ALTER TABLE offer_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own applications" ON offer_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create applications" ON offer_applications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications: users see only their own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
```

---

## 4. Edge Functions

| Function | Trigger | Purpose |
|:---------|:--------|:--------|
| `calculate-savings` | On debt creation/update | Matches user debt against offers, calculates potential savings |
| `generate-credit-health` | On debt creation/update | Estimates credit health based on total debt, DBR, debt count |
| `submit-application` | On offer acceptance | Creates application record, triggers notification |
| `send-notification` | On application status change / new offer match | Sends push notification to device |

---

## 5. Supabase Auth Configuration

| Provider | Status | Config |
|:---------|:-------|:-------|
| Email + Password | ✅ Active | Email verification required |
| Google OAuth | ✅ Active | Google Cloud Console OAuth credentials |
| Apple Sign-In | ✅ Active | Apple Developer account |
| Phone OTP | ✅ Active | Twilio integration (Supabase built-in) |
| UAE Pass | 🟡 Coming Soon | Placeholder only |

---

## 6. Realtime Subscriptions

| Subscription | What It Does |
|:-------------|:-------------|
| `notifications` table changes | Badge count on profile tab, in-app notification list |
| `offer_applications` status changes | Offer status updates pushed to UI |
| `offers` new inserts | "New offers available" notification trigger |

---

## 7. API Patterns

### Client-Side (supabase-js)
```typescript
// Fetch user's debts
const { data: debts } = await supabase
  .from('debts')
  .select('*')
  .order('created_at', { ascending: false })

// RLS automatically filters to current user's debts
```

### Edge Function (Deno)
```typescript
// calculate-savings function
Deno.serve(async (req) => {
  const { debt_id } = await req.json()
  
  // Fetch debt + matching offers
  // Calculate monthly savings per offer
  // Return ranked offers with savings
})
```

---

## 8. Storage Buckets

| Bucket | Purpose | Access |
|:-------|:--------|:-------|
| `avatars` | User profile photos | Private (user's own only) |
| `bank-logos` | Bank logo images | Public (read-only) |
| `application-documents` | Salary certs, bank statements uploaded during closing flow | Private (user's own only, max 10MB per file) |

---

## 9. Monetary Values — Critical Rule

> [!CAUTION]
> **ALL monetary values stored as BIGINT in fils (1 AED = 100 fils).** Never use FLOAT or DECIMAL for money.

```
AED 45,000.00 → stored as 4500000 (fils)
AED 1,234.56 → stored as 123456 (fils)
```

Display conversion happens at the UI layer:
```typescript
const displayAmount = (fils: number) => 
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' })
    .format(fils / 100)
```
