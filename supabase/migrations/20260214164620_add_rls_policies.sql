
-- ========================================
-- ENABLE RLS ON ALL TABLES
-- ========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refinance_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ========================================
-- PROFILES: Users can read/update their own profile
-- ========================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ========================================
-- BANKS: Public read access (no write from client)
-- ========================================
CREATE POLICY "Banks are publicly readable"
  ON public.banks FOR SELECT
  USING (true);

-- ========================================
-- BANK_PRODUCTS: Public read access
-- ========================================
CREATE POLICY "Bank products are publicly readable"
  ON public.bank_products FOR SELECT
  USING (true);

-- ========================================
-- USER_LOANS: Full CRUD for own loans
-- ========================================
CREATE POLICY "Users can view own loans"
  ON public.user_loans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own loans"
  ON public.user_loans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own loans"
  ON public.user_loans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own loans"
  ON public.user_loans FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- REFINANCE_OFFERS: Read own offers
-- ========================================
CREATE POLICY "Users can view offers for own loans"
  ON public.refinance_offers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_loans
      WHERE user_loans.id = refinance_offers.user_loan_id
      AND user_loans.user_id = auth.uid()
    )
  );

-- ========================================
-- USER_DOCUMENTS: CRUD for own documents
-- ========================================
CREATE POLICY "Users can view own documents"
  ON public.user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload own documents"
  ON public.user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON public.user_documents FOR DELETE
  USING (auth.uid() = user_id);

-- ========================================
-- NOTIFICATIONS: Read/update own notifications
-- ========================================
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark own notifications as read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);
;
