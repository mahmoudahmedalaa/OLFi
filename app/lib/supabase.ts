import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uivkpqjdoqwgfhvnskaw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmtwcWpkb3F3Z2Zodm5za2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzY4MTMsImV4cCI6MjA4NjY1MjgxM30.9v6_69UawDhf4VUhRqPGHh5x13msXDX5ywfg5y_ESCY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
