# OLFi Database Entity-Relationship Diagram (ERD) & Schema

OLFi uses PostgreSQL hosted on Supabase. Our architecture prioritizes strict Row Level Security (RLS) to ensure users can *only* ever see or manipulate their own financial data.

## Core Tables Overview

### 1. `users` (Managed by Supabase Auth - `auth.users`)
We don't structure this table manually. Supabase handles standard JWT auth, email mapping, and secure ID generation (UUID). We use the `auth.uid()` function extensively in RLS policies.

### 2. `profiles`
The public/application-facing extension of the user. Automatically created via Postgres Triggers when a new row is added to `auth.users`.

*   **`id`** (UUID, Primary Key, References `auth.users.id` cascade delete)
*   **`full_name`** (Text, nullable)
*   **`phone_number`** (Text, nullable)
*   **`created_at`** (Timestamp, default now())
*   **`updated_at`** (Timestamp, default now())

### 3. `user_debts`
Stores individual debt items (loans, credit cards) input by the user.

*   **`id`** (UUID, Primary Key)
*   **`user_id`** (UUID, References `profiles.id`)
*   **`debt_type`** (Enum: `'personal_loan' | 'auto_loan' | 'credit_card'`)
*   **`outstanding_balance_fils`** (Integer, NOT NULL) - *Stored in fils (AED x 100) to avoid float precision errors.*
*   **`current_emi_fils`** (Integer, NOT NULL)
*   **`interest_rate_bps`** (Integer, nullable) - *Basis points (e.g., 5.5% = 550)*
*   **`remaining_tenure_months`** (Integer, NOT NULL)
*   **`created_at`** (Timestamp)

### 4. `bank_products`
The core offerings sourced from our banking partners. This table is read-only for standard users.

*   **`id`** (UUID, Primary Key)
*   **`bank_name`** (Text, NOT NULL)
*   **`product_name`** (Text, NOT NULL)
*   **`base_interest_rate_bps`** (Integer, NOT NULL)
*   **`max_tenure_months`** (Integer, NOT NULL, usually 48)
*   **`processing_fee_percentage_bps`** (Integer, NOT NULL, usually 100 for 1%)
*   **`is_active`** (Boolean, default true)

### 5. `applications`
The historical record of a user submitting their consolidated debt for a specific bank product.

*   **`id`** (UUID, Primary Key)
*   **`user_id`** (UUID, References `profiles.id`)
*   **`bank_product_id`** (UUID, References `bank_products.id`)
*   **`total_requested_amount_fils`** (Integer, NOT NULL)
*   **`requested_tenure_months`** (Integer, NOT NULL)
*   **`calculated_new_emi_fils`** (Integer, NOT NULL)
*   **`status`** (Enum: `'pending' | 'reviewed' | 'approved' | 'rejected'`)
*   **`created_at`** (Timestamp)

---

## Row Level Security (RLS) Policies

Security is non-negotiable. Every table (except `bank_products`) must be locked down.

**Example RLS Policy on `user_debts`:**

```sql
-- Enable RLS on the table
ALTER TABLE user_debts ENABLE ROW LEVEL SECURITY;

-- 1. Users can view their own debts
CREATE POLICY "Users can view their own debts"
ON user_debts FOR SELECT
USING (auth.uid() = user_id);

-- 2. Users can insert their own debts
CREATE POLICY "Users can insert their own debts"
ON user_debts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Users can update their own debts
CREATE POLICY "Users can update their own debts"
ON user_debts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Users can delete their own debts
CREATE POLICY "Users can delete their own debts"
ON user_debts FOR DELETE
USING (auth.uid() = user_id);
```

**`bank_products` RLS:**
*   **SELECT:** `true` (Anonymous or authenticated users can view offers).
*   **INSERT/UPDATE/DELETE:** `false` (Only service role / admin dashboard can modify these).

## Data Types Strategy
*   **Currency:** We NEVER use `FLOAT` or `DECIMAL` for AED currency values due to floating-point binary rounding errors. All monetary values are stored as integers representing **Fils** (1 AED = 100 Fils).
    *   *Example:* 15,000.50 AED is stored as `1500050`.
*   **Percentages:** Stored as Basis Points (BPS). 1 BPS = 0.01%.
    *   *Example:* 4.99% is stored as `499`.
    *   *Example:* 1.2% processing fee is stored as `120`.
