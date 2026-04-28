import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, LogBox } from 'react-native';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import { Colors, BorderRadius } from '@/lib/constants';
import '@/global.css';

// Ignore 3rd-party deprecation warnings
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const BIOMETRIC_KEY_PREFIX = '@olfi_biometric_lock_';
const POST_AUTH_SETUP_KEY = '@olfi_post_auth_setup_pending';

// Custom navigation themes
const OLFiDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#011819',
    background: '#011819',
    card: '#1E293B',
    text: '#F8FAFC',
    border: '#334155',
    notification: '#011819',
  },
};

const OLFiLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#059669',
    background: '#FFFFFF',
    card: '#F8FAFC',
    text: '#011819',
    border: '#E2E8F0',
    notification: '#059669',
  },
};

// ─── Auth Gate ────────────────────────────────────────────────────────
// Manages onboarding + auth state + post-auth setup gating.
// The postAuthSetupPending flag prevents premature redirect to dashboard
// while the user is going through KYC → Biometric setup after signup.
function useProtectedRoute(onboardingDone: boolean | null) {
  const { user, loading, postAuthSetupPending } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading || onboardingDone === null) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === ('onboarding' as any);

    const doRouting = async () => {
      if (!onboardingDone && !inOnboarding) {
        // Double-check AsyncStorage to prevent race condition:
        // handleGetStarted writes the flag but the state hasn't re-synced yet
        const freshVal = await AsyncStorage.getItem('buyout_onboarding_completed');
        if (freshVal === 'true') return; // flag was just set, don't redirect back
        router.replace('/onboarding' as any);
      } else if (onboardingDone && !user && !inAuthGroup && !inOnboarding) {
        router.replace('/(auth)/login');
      } else if (onboardingDone && user && (inAuthGroup || inOnboarding)) {
        if (!postAuthSetupPending) {
          router.replace('/(tabs)');
        }
      }
    };

    doRouting();
  }, [user, loading, segments, onboardingDone, postAuthSetupPending, router]);
}

function RootLayoutInner() {
  const { theme } = useTheme();
  const { isRtl } = useLanguage();
  const { loading, user, postAuthSetupPending, setPostAuthSetupPending } = useAuth();
  const segments = useSegments();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const [biometricLocked, setBiometricLocked] = useState<boolean | null>(null);
  const [unlockAttemptInProgress, setUnlockAttemptInProgress] = useState(false);

  // Per-user onboarding key: each user gets their own flag
  const onboardingKey = user
    ? `buyout_onboarding_completed_${user.id}`
    : 'buyout_onboarding_completed';

  useEffect(() => {
    if (loading) return;

    const checkOnboarding = async () => {
      try {
        if (user) {
          // If we have a user, check their specific key first
          let userVal = await AsyncStorage.getItem(onboardingKey);
          if (userVal !== 'true') {
            // Check device fallback — if device is true, user doesn't need to re-onboard
            const deviceVal = await AsyncStorage.getItem('buyout_onboarding_completed');
            if (deviceVal === 'true') {
              userVal = 'true';
              await AsyncStorage.setItem(onboardingKey, 'true');
            }
          }
          setOnboardingDone(userVal === 'true');
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

  // Listen for setup completion (clear flag when navigating away from auth)
  useEffect(() => {
    if (segments[0] === '(tabs)' && postAuthSetupPending) {
      // User reached dashboard — clear the pending flag
      setPostAuthSetupPending(false);
    }
  }, [segments, postAuthSetupPending, setPostAuthSetupPending]);

  // ─── Biometric Lock ────────────────────────────────────────────────
  // Use a ref to ensure biometric check only fires once per user session.
  // We intentionally do NOT include postAuthSetupPending in the dependency array
  // because toggling it (e.g. when open-banking completes) would re-trigger
  // the check and show the lock screen again right after onboarding.
  const biometricCheckedForUser = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setBiometricLocked(false);
      biometricCheckedForUser.current = null;
      return;
    }
    // Skip if we've already run this check for this user
    if (biometricCheckedForUser.current === user.id) return;
    biometricCheckedForUser.current = user.id;

    // Don't lock during post-auth setup — read latest value from storage directly
    AsyncStorage.getItem('@olfi_post_auth_setup_pending').then((pending) => {
      if (pending === 'true') {
        setBiometricLocked(false);
        return;
      }
      const userBiometricKey = `${BIOMETRIC_KEY_PREFIX}${user.id}`;
      return AsyncStorage.getItem(userBiometricKey).then((val) => {
        setBiometricLocked(val === 'true');
      });
    }).catch(() => setBiometricLocked(false));
  }, [loading, user]);

  const attemptBiometricUnlock = useCallback(async () => {
    setUnlockAttemptInProgress(true);
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock OLFi',
      fallbackLabel: 'Use Passcode',
    });
    if (result.success) {
      setBiometricLocked(false);
    }
    setUnlockAttemptInProgress(false);
  }, []);

  useEffect(() => {
    if (biometricLocked === true) {
      attemptBiometricUnlock();
    }
  }, [biometricLocked, attemptBiometricUnlock]);

  useProtectedRoute(onboardingDone);

  useEffect(() => {
    if (!loading && biometricLocked !== null) {
      // Minimum splash display of 1.5s for branding impact
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loading, biometricLocked]);

  return (
    <GluestackUIProvider mode={theme.isDark ? 'dark' : 'light'}>
      <NavThemeProvider
        value={theme.isDark ? OLFiDarkTheme : OLFiLightTheme}
      >
        <View style={{ flex: 1, direction: isRtl ? 'rtl' : 'ltr' }}>
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
        </View>

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
              // While unlock is in progress (Face ID sheet open), stay invisible
              opacity: unlockAttemptInProgress ? 0 : 1,
            }}
            pointerEvents={unlockAttemptInProgress ? 'none' : 'auto'}
          >
            <LinearGradient
              colors={theme.gradients.card}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 40,
              }}
            >
              <Image
                source={require('@/assets/images/olfi-icon.png')}
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
                OLFi is Locked
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
              <View style={{ marginBottom: 32 }} />
              <TouchableOpacity
                onPress={attemptBiometricUnlock}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradients.brand}
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
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <BottomSheetModalProvider>
              <RootLayoutInner />
            </BottomSheetModalProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
