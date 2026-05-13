import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://uivkpqjdoqwgfhvnskaw.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
let adminClient: SupabaseClient | null = null;

// Server-only Supabase client with service role key (bypasses RLS)
// This file should ONLY be imported from server components or server actions
function getSupabase() {
    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for the admin dashboard.');
    }

    adminClient ??= createClient(supabaseUrl, supabaseServiceKey);
    return adminClient;
}

export const supabase = new Proxy({} as SupabaseClient, {
    get(_target, property, receiver) {
        return Reflect.get(getSupabase(), property, receiver);
    },
});
