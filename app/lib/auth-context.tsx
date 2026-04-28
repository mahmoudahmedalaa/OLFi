import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { initAnalytics, clearAnalytics } from './analytics';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    postAuthSetupPending: boolean;
    setPostAuthSetupPending: (val: boolean) => void;
    signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    session: null,
    loading: true,
    postAuthSetupPending: false,
    setPostAuthSetupPending: () => { },
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [postAuthSetupState, setPostAuthSetupState] = useState(false);

    useEffect(() => {
        let mounted = true;

        // Init postAuthSetupPending from AsyncStorage
        AsyncStorage.getItem('@olfi_post_auth_setup_pending').then((val) => {
            if (mounted) setPostAuthSetupState(val === 'true');
        }).catch(() => { });

        // Subscribe first — guarantees no session events are missed
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!mounted) return;
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    initAnalytics(session.user.id);
                } else {
                    clearAnalytics();
                }
                setLoading(false);
            }
        );

        // getSession() hydrates from the stored token on first mount.
        // onAuthStateChange will also fire SIGNED_IN so we don't set loading:false here
        // — we let the listener do it to avoid a double-state-update race.
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!mounted) return;
            // Only set state if the listener hasn't fired yet (loading still true)
            setSession((prev) => prev ?? session);
            setUser((prev) => prev ?? (session?.user ?? null));
            // Fallback: ensure loading is cleared even if listener doesn't fire
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const setPostAuthSetupPending = (val: boolean) => {
        setPostAuthSetupState(val);
        if (val) {
            AsyncStorage.setItem('@olfi_post_auth_setup_pending', 'true').catch(() => { });
        } else {
            AsyncStorage.removeItem('@olfi_post_auth_setup_pending').catch(() => { });
        }
    };

    const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName || '',
                    last_name: lastName || '',
                    full_name: [firstName, lastName].filter(Boolean).join(' '),
                },
            },
        });
        return { error: error as Error | null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (!error) {
            try {
                await SecureStore.setItemAsync('saved_email', email);
                await SecureStore.setItemAsync('saved_password', password);
            } catch (e) {
                console.warn('Failed to save credentials for biometric auto-login', e);
            }
        }

        return { error: error as Error | null };
    };

    const signOut = async () => {
        clearAnalytics();
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider
            value={{ user, session, loading, postAuthSetupPending: postAuthSetupState, setPostAuthSetupPending, signUp, signIn, signOut }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
