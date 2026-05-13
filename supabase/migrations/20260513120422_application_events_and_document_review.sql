CREATE TABLE IF NOT EXISTS public.application_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid NOT NULL REFERENCES public.refinance_applications(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type text NOT NULL CHECK (event_type IN ('status_update', 'document_request', 'document_received', 'document_verified', 'document_rejected', 'admin_note')),
    status text CHECK (status IN ('submitted', 'under_review', 'documents_required', 'approved', 'rejected')),
    title text NOT NULL,
    body text,
    actor_type text NOT NULL DEFAULT 'admin' CHECK (actor_type IN ('system', 'admin', 'user', 'bank')),
    metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_application_events_application_id
    ON public.application_events(application_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_application_events_user_id
    ON public.application_events(user_id, created_at DESC);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'application_events'
          AND policyname = 'Users can view own application events'
    ) THEN
        CREATE POLICY "Users can view own application events"
            ON public.application_events
            FOR SELECT
            TO authenticated
            USING (auth.uid() = user_id);
    END IF;
END
$$;

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.refinance_applications(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_notifications_application_id
    ON public.notifications(application_id);
