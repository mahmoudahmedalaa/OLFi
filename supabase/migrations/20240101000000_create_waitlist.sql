CREATE TABLE public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure the waitlist table by restricting access with Row Level Security
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert emails (for the public waitlist endpoint)
CREATE POLICY "Enable insert for anonymous users" ON public.waitlist
    FOR INSERT TO anon
    WITH CHECK (true);
