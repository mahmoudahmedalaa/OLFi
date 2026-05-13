
-- Refinance Applications table for BuyOut Phase 6
CREATE TABLE public.refinance_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_loan_id uuid NOT NULL REFERENCES public.user_loans(id) ON DELETE CASCADE,
    bank_product_id uuid NOT NULL REFERENCES public.bank_products(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'submitted'
        CHECK (status IN ('submitted', 'under_review', 'documents_required', 'approved', 'rejected')),
    monthly_savings numeric NOT NULL DEFAULT 0,
    total_savings numeric NOT NULL DEFAULT 0,
    new_rate numeric NOT NULL DEFAULT 0,
    new_emi numeric NOT NULL DEFAULT 0,
    admin_notes text,
    rejection_reason text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.refinance_applications ENABLE ROW LEVEL SECURITY;

-- Users can read their own applications
CREATE POLICY "Users can view own applications"
    ON public.refinance_applications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can create own applications"
    ON public.refinance_applications
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX idx_refinance_applications_user_id ON public.refinance_applications(user_id);
CREATE INDEX idx_refinance_applications_status ON public.refinance_applications(status);
;
