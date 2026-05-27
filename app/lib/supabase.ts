import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = 'https://uivkpqjdoqwgfhvnskaw.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdmtwcWpkb3F3Z2Zodm5za2F3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwNzY4MTMsImV4cCI6MjA4NjY1MjgxM30.9v6_69UawDhf4VUhRqPGHh5x13msXDX5ywfg5y_ESCY';

const supabaseSessionStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') return AsyncStorage.getItem(key);

    let secureValue: string | null = null;
    try {
      secureValue = await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('SecureStore get failed, falling back to AsyncStorage:', error);
    }
    if (secureValue) return secureValue;

    const legacyValue = await AsyncStorage.getItem(key);
    if (legacyValue) {
      try {
        await SecureStore.setItemAsync(key, legacyValue);
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.warn('SecureStore migration failed, keeping AsyncStorage session:', error);
      }
    }

    return legacyValue;
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') return AsyncStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value).catch((error) => {
      console.warn('SecureStore set failed, falling back to AsyncStorage:', error);
      return AsyncStorage.setItem(key, value);
    });
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') return AsyncStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key).catch((error) => {
      console.warn('SecureStore remove failed, falling back to AsyncStorage:', error);
      return AsyncStorage.removeItem(key);
    });
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseSessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
