ALTER TABLE public.refinance_applications
    ADD COLUMN IF NOT EXISTS selected_tenure_months integer;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'notifications'
          AND policyname = 'Users can create own notifications'
    ) THEN
        CREATE POLICY "Users can create own notifications"
            ON public.notifications
            FOR INSERT
            TO authenticated
            WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;
