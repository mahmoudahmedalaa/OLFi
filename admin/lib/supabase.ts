import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-only Supabase client with service role key (bypasses RLS)
// This file should ONLY be imported from server components or server actions
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
