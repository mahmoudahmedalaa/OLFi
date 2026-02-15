import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!;

// Use service role key for admin panel (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
