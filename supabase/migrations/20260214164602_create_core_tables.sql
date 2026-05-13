
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- PROFILES: Extended user info
-- ========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  emirates_id TEXT,
  salary NUMERIC(12,2),
  employer TEXT,
  nationality TEXT,
  date_of_birth DATE,
  kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
  avatar_url TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- BANKS: UAE banks with product info
-- ========================================
CREATE TABLE public.banks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  name_ar TEXT,
  logo_url TEXT,
  website_url TEXT,
  is_islamic BOOLEAN DEFAULT FALSE,
  min_salary NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- BANK_PRODUCTS: Loan products each bank offers
-- ========================================
CREATE TABLE public.bank_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_id UUID NOT NULL REFERENCES public.banks(id) ON DELETE CASCADE,
  product_type TEXT NOT NULL CHECK (product_type IN ('personal', 'auto', 'mortgage', 'credit_card', 'business')),
  name TEXT NOT NULL,
  interest_rate_min NUMERIC(5,2),
  interest_rate_max NUMERIC(5,2),
  min_amount NUMERIC(12,2),
  max_amount NUMERIC(12,2),
  min_tenure_months INT,
  max_tenure_months INT,
  processing_fee_pct NUMERIC(5,2),
  early_settlement_fee_pct NUMERIC(5,2),
  requires_salary_transfer BOOLEAN DEFAULT FALSE,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- USER_LOANS: User's existing loans
-- ========================================
CREATE TABLE public.user_loans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_id UUID REFERENCES public.banks(id),
  loan_type TEXT NOT NULL CHECK (loan_type IN ('personal', 'auto', 'mortgage', 'credit_card', 'business', 'other')),
  original_amount NUMERIC(12,2) NOT NULL,
  remaining_amount NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  monthly_emi NUMERIC(10,2) NOT NULL,
  tenure_months INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted', 'refinanced')),
  bank_name TEXT, -- Fallback if bank not in banks table
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- REFINANCE_OFFERS: Generated offers for users
-- ========================================
CREATE TABLE public.refinance_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_loan_id UUID NOT NULL REFERENCES public.user_loans(id) ON DELETE CASCADE,
  bank_product_id UUID NOT NULL REFERENCES public.bank_products(id) ON DELETE CASCADE,
  new_interest_rate NUMERIC(5,2) NOT NULL,
  new_monthly_emi NUMERIC(10,2) NOT NULL,
  new_tenure_months INT NOT NULL,
  monthly_savings NUMERIC(10,2) NOT NULL,
  total_savings NUMERIC(12,2) NOT NULL,
  processing_fee NUMERIC(10,2),
  is_recommended BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'applied', 'approved', 'rejected', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days')
);

-- ========================================
-- USER_DOCUMENTS: KYC and supporting docs
-- ========================================
CREATE TABLE public.user_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('emirates_id', 'passport', 'salary_slip', 'bank_statement', 'noc', 'other')),
  file_url TEXT NOT NULL,
  file_name TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- NOTIFICATIONS
-- ========================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'offer', 'payment', 'document', 'system')),
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_user_loans_user_id ON public.user_loans(user_id);
CREATE INDEX idx_user_loans_status ON public.user_loans(status);
CREATE INDEX idx_refinance_offers_loan_id ON public.refinance_offers(user_loan_id);
CREATE INDEX idx_bank_products_bank_id ON public.bank_products(bank_id);
CREATE INDEX idx_bank_products_type ON public.bank_products(product_type);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_user_documents_user_id ON public.user_documents(user_id);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_user_loans_updated_at
  BEFORE UPDATE ON public.user_loans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_bank_products_updated_at
  BEFORE UPDATE ON public.bank_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ========================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
;
