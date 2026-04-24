import { createClient } from '@supabase/supabase-js'

export const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    if (!supabaseUrl) {
        throw new Error('Supabase URL is missing. Please add NEXT_PUBLIC_SUPABASE_URL to Vercel Environment Variables.')
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}
