import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import '@/global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Custom navigation themes
const BuyOutDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#10B981',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    notification: '#10B981',
  },
};

const BuyOutLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#059669',
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#0F172A',
    border: '#E2E8F0',
    notification: '#059669',
  },
};

// ─── Auth Gate ────────────────────────────────────────────────────────
// Redirects unauthenticated users to login, authenticated users to tabs
// First-time users see onboarding before login
function useProtectedRoute(onboardingDone: boolean | null) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || onboardingDone === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === ('onboarding' as any);

    if (!onboardingDone && !inOnboarding) {
      // First time → show onboarding
      router.replace('/onboarding' as any);
    } else if (!user && !inAuthGroup && !inOnboarding) {
      // Not signed in → go to Login
      router.replace('/(auth)/login');
    } else if (user && (inAuthGroup || inOnboarding)) {
      // Signed in but still on auth/onboarding screen → go to Dashboard
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, onboardingDone]);
}

function RootLayoutInner() {
  const { theme } = useTheme();
  const { loading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('buyout_onboarding_completed').then((val) => {
      setOnboardingDone(val === 'true');
    }).catch(() => setOnboardingDone(true)); // On error, skip onboarding
  }, []);

  useProtectedRoute(onboardingDone);

  useEffect(() => {
    if (!loading) {
      // Hide splash once auth state is resolved
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <GluestackUIProvider mode={theme.isDark ? 'dark' : 'light'}>
      <NavThemeProvider
        value={theme.isDark ? BuyOutDarkTheme : BuyOutLightTheme}
      >
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="add-loan"
            options={{ presentation: 'modal', title: 'Add Loan' }}
          />
          <Stack.Screen
            name="offer-details"
            options={{ presentation: 'modal', title: 'Offer Details' }}
          />
          <Stack.Screen
            name="edit-loan"
            options={{ presentation: 'modal', title: 'Edit Loan' }}
          />
          <Stack.Screen
            name="notifications"
            options={{ presentation: 'modal', title: 'Notifications' }}
          />
          <Stack.Screen
            name="onboarding"
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
        <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      </NavThemeProvider>
    </GluestackUIProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
