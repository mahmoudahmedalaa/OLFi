import { createClient } from '@supabase/supabase-js'

export const getSupabase = () => {
    // Trim whitespace and strip any wrapping quotes from env values
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/^["']|["']$/g, '')
    const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/^["']|["']$/g, '')

    if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
        throw new Error(
            `Invalid supabaseUrl: "${supabaseUrl}". ` +
            'Ensure NEXT_PUBLIC_SUPABASE_URL is set in web/.env.local (not in src/) ' +
            'and restart the dev server after changes.'
        )
    }

    if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_API_KEY_HERE' || supabaseAnonKey.length < 30) {
        throw new Error(
            'Supabase Anon Key is missing or placeholder. ' +
            'Set NEXT_PUBLIC_SUPABASE_ANON_KEY in web/.env.local with your real anon key from: ' +
            'Supabase Dashboard → Settings → API → anon/public key.'
        )
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}
