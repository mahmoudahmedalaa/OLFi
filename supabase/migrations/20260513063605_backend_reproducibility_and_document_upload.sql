-- Baseline the live-only waitlist object and add the production pieces needed
-- for the app document upload flow. Everything here is additive/idempotent so
-- it is safe against objects that already exist in the linked project.

CREATE TABLE IF NOT EXISTS public.waitlist (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'waitlist'
          AND policyname = 'Enable insert for anonymous users'
    ) THEN
        CREATE POLICY "Enable insert for anonymous users"
            ON public.waitlist
            FOR INSERT
            TO anon
            WITH CHECK (true);
    END IF;
END
$$;

ALTER TABLE public.user_documents
    ADD COLUMN IF NOT EXISTS application_id uuid REFERENCES public.refinance_applications(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS storage_bucket text NOT NULL DEFAULT 'user-documents',
    ADD COLUMN IF NOT EXISTS storage_path text,
    ADD COLUMN IF NOT EXISTS mime_type text,
    ADD COLUMN IF NOT EXISTS file_size bigint,
    ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_user_documents_application_id
    ON public.user_documents(application_id);

CREATE INDEX IF NOT EXISTS idx_user_documents_user_application
    ON public.user_documents(user_id, application_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_trigger
        WHERE tgname = 'set_user_documents_updated_at'
    ) THEN
        CREATE TRIGGER set_user_documents_updated_at
            BEFORE UPDATE ON public.user_documents
            FOR EACH ROW
            EXECUTE FUNCTION public.handle_updated_at();
    END IF;
END
$$;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-documents',
    'user-documents',
    false,
    10485760,
    ARRAY[
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/heic',
        'image/heif'
    ]
)
ON CONFLICT (id) DO UPDATE
SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Users can view own document files'
    ) THEN
        CREATE POLICY "Users can view own document files"
            ON storage.objects
            FOR SELECT
            TO authenticated
            USING (
                bucket_id = 'user-documents'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Users can upload own document files'
    ) THEN
        CREATE POLICY "Users can upload own document files"
            ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (
                bucket_id = 'user-documents'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Users can update own document files'
    ) THEN
        CREATE POLICY "Users can update own document files"
            ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (
                bucket_id = 'user-documents'
                AND (storage.foldername(name))[1] = auth.uid()::text
            )
            WITH CHECK (
                bucket_id = 'user-documents'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'storage'
          AND tablename = 'objects'
          AND policyname = 'Users can delete own document files'
    ) THEN
        CREATE POLICY "Users can delete own document files"
            ON storage.objects
            FOR DELETE
            TO authenticated
            USING (
                bucket_id = 'user-documents'
                AND (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;
END
$$;
