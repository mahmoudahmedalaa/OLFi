-- Tighten user-created application/document writes so cross-user UUIDs cannot
-- link an applicant to another user's saved debt or review queue.

DROP POLICY IF EXISTS "Users can create own applications"
    ON public.refinance_applications;

CREATE POLICY "Users can create own applications"
    ON public.refinance_applications
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1
            FROM public.user_loans
            WHERE user_loans.id = refinance_applications.user_loan_id
              AND user_loans.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can upload own documents"
    ON public.user_documents;

CREATE POLICY "Users can upload own documents"
    ON public.user_documents
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id
        AND (
            application_id IS NULL
            OR EXISTS (
                SELECT 1
                FROM public.refinance_applications
                WHERE refinance_applications.id = user_documents.application_id
                  AND refinance_applications.user_id = auth.uid()
            )
        )
    );
