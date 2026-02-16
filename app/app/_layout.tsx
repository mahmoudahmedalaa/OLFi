import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius } from '@/lib/constants';
import '@/global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const BIOMETRIC_KEY = '@buyout_biometric_lock';

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
      // First time → show onboarding (even if signed in)
      router.replace('/onboarding' as any);
    } else if (onboardingDone && !user && !inAuthGroup && !inOnboarding) {
      // Onboarding done, not signed in → go to Login
      router.replace('/(auth)/login');
    } else if (onboardingDone && user && (inAuthGroup || inOnboarding)) {
      // Onboarding done + signed in but still on auth/onboarding → go to Dashboard
      router.replace('/(tabs)');
    }
  }, [user, loading, segments, onboardingDone]);
}

function RootLayoutInner() {
  const { theme } = useTheme();
  const { loading, user } = useAuth();
  const segments = useSegments();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [biometricLocked, setBiometricLocked] = useState<boolean | null>(null);

  // Per-user onboarding key: each user gets their own flag
  const onboardingKey = user
    ? `buyout_onboarding_completed_${user.id}`
    : 'buyout_onboarding_completed';

  useEffect(() => {
    if (loading) return;

    const checkOnboarding = async () => {
      try {
        // If user is logged in, check their per-user key first
        if (user) {
          const userVal = await AsyncStorage.getItem(onboardingKey);
          if (userVal === 'true') {
            setOnboardingDone(true);
            return;
          }
          // Migrate device-level flag to per-user if it exists
          const deviceVal = await AsyncStorage.getItem('buyout_onboarding_completed');
          if (deviceVal === 'true') {
            await AsyncStorage.setItem(onboardingKey, 'true');
            setOnboardingDone(true);
            return;
          }
          // New user on this device — needs onboarding
          setOnboardingDone(false);
        } else {
          // No user — check device-level flag for pre-login onboarding
          const deviceVal = await AsyncStorage.getItem('buyout_onboarding_completed');
          setOnboardingDone(deviceVal === 'true');
        }
      } catch {
        setOnboardingDone(false);
      }
    };

    checkOnboarding();
  }, [loading, user, onboardingKey]);

  // Re-read onboarding status when returning from onboarding screen
  useEffect(() => {
    if (segments[0] !== 'onboarding') {
      AsyncStorage.getItem(onboardingKey).then((val) => {
        setOnboardingDone(val === 'true');
      }).catch(() => { });
    }
  }, [segments, onboardingKey]);

  // ─── Biometric Lock ────────────────────────────────────────────────
  useEffect(() => {
    if (loading || !user) {
      setBiometricLocked(false);
      return;
    }
    AsyncStorage.getItem(BIOMETRIC_KEY).then((val) => {
      if (val === 'true') {
        setBiometricLocked(true);
      } else {
        setBiometricLocked(false);
      }
    }).catch(() => setBiometricLocked(false));
  }, [loading, user]);

  const attemptBiometricUnlock = useCallback(async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock BuyOut',
      fallbackLabel: 'Use Passcode',
    });
    if (result.success) {
      setBiometricLocked(false);
    }
  }, []);

  // Auto-prompt on lock
  useEffect(() => {
    if (biometricLocked === true) {
      attemptBiometricUnlock();
    }
  }, [biometricLocked, attemptBiometricUnlock]);

  useProtectedRoute(onboardingDone);

  useEffect(() => {
    if (!loading) {
      // Minimum splash display of 1.5s for branding impact
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
      return () => clearTimeout(timer);
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
            name="loan-detail"
            options={{ presentation: 'modal', title: 'Loan Details', headerShown: false }}
          />
          <Stack.Screen
            name="calculator"
            options={{ presentation: 'modal', title: 'Calculator', headerShown: false }}
          />
          <Stack.Screen
            name="edit-profile"
            options={{ presentation: 'modal', title: 'Edit Profile', headerShown: false }}
          />
          <Stack.Screen
            name="notification-settings"
            options={{ presentation: 'modal', title: 'Notifications', headerShown: false }}
          />
          <Stack.Screen
            name="security-settings"
            options={{ presentation: 'modal', title: 'Security', headerShown: false }}
          />
          <Stack.Screen
            name="my-applications"
            options={{ presentation: 'modal', title: 'My Applications', headerShown: false }}
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

        {/* ─── Biometric Lock Overlay ─────────────────────────────── */}
        {biometricLocked && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          >
            <LinearGradient
              colors={theme.isDark ? ['#0F172A', '#1E293B'] : ['#FFFFFF', '#F0FDF4']}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 40,
              }}
            >
              <Image
                source={require('@/assets/images/icon.png')}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  marginBottom: 24,
                }}
              />
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: '700',
                  color: theme.colors.textPrimary,
                  marginBottom: 8,
                }}
              >
                BuyOut is Locked
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                Authenticate with Face ID or Touch ID to access your financial data
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '500',
                  color: Colors.brand.teal,
                  fontStyle: 'italic',
                  letterSpacing: 0.3,
                  marginBottom: 32,
                }}
              >
                your debt, rewritten
              </Text>
              <TouchableOpacity
                onPress={attemptBiometricUnlock}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#14B8A6', '#10B981']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingHorizontal: 28,
                    paddingVertical: 14,
                    borderRadius: BorderRadius.md,
                  }}
                >
                  <Ionicons name="finger-print" size={22} color="#fff" />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                    Unlock
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
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
