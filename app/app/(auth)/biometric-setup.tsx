import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius } from '@/lib/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '@/lib/auth-context';

const BIOMETRIC_KEY_PREFIX = '@olfi_biometric_lock_';

export default function BiometricSetupScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleEnable = useCallback(async () => {
        setLoading(true);
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();

            if (!compatible || !enrolled) {
                Alert.alert(
                    'Not Available',
                    'Biometric authentication is not available on this device. You can enable it later in Settings.'
                );
                setLoading(false);
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Enable Face ID for OLFi',
                fallbackLabel: 'Use Passcode',
            });

            if (result.success) {
                const userBiometricKey = `${BIOMETRIC_KEY_PREFIX}${user?.id}`;
                await AsyncStorage.setItem(userBiometricKey, 'true');

                // Navigate to open banking - postAuthSetupPending cleared there
                router.replace('/(auth)/open-banking' as any);
            }
        } catch (e: unknown) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Failed to enable biometric authentication');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const handleSkip = async () => {
        // Navigate to open banking - postAuthSetupPending cleared there
        router.replace('/(auth)/open-banking' as any);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                {/* Content */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Face ID Icon */}
                    <View style={{
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                        backgroundColor: theme.isDark ? 'rgba(5, 150, 105, 0.1)' : 'rgba(5, 150, 105, 0.08)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 32,
                        borderWidth: 2,
                        borderColor: theme.isDark ? 'rgba(5, 150, 105, 0.2)' : 'rgba(5, 150, 105, 0.15)',
                    }}>
                        <Ionicons
                            name="scan-outline"
                            size={56}
                            color={Colors.brand.emerald}
                        />
                    </View>

                    {/* Title */}
                    <Text style={{
                        fontSize: 28,
                        fontWeight: '800',
                        color: theme.colors.textPrimary,
                        marginBottom: 12,
                        textAlign: 'center',
                        letterSpacing: -0.5,
                    }}>
                        Secure with Face ID
                    </Text>

                    {/* Subtitle */}
                    <Text style={{
                        fontSize: 16,
                        color: theme.colors.textSecondary,
                        textAlign: 'center',
                        lineHeight: 24,
                        paddingHorizontal: 20,
                        marginBottom: 12,
                    }}>
                        Use Face ID to quickly and securely access your financial data every time you open OLFi
                    </Text>

                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '500',
                            color: Colors.brand.teal,
                            fontStyle: 'italic',
                            letterSpacing: 0.3,
                        }}
                    >
                        Your data stays on-device
                    </Text>

                    {/* Features */}
                    <View style={{ marginTop: 40, gap: 16, width: '100%', paddingHorizontal: 8 }}>
                        {[
                            { icon: 'flash-outline' as const, title: 'Instant unlock', desc: 'Open OLFi in less than a second' },
                            { icon: 'shield-checkmark-outline' as const, title: 'Bank-grade security', desc: 'Your biometrics never leave your device' },
                            { icon: 'lock-closed-outline' as const, title: 'Auto-lock protection', desc: 'Automatically locks when you leave the app' },
                        ].map((item, i) => (
                            <View
                                key={i}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 14,
                                    padding: 14,
                                    backgroundColor: theme.colors.card,
                                    borderRadius: 12,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                }}
                            >
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 10,
                                    backgroundColor: theme.isDark ? 'rgba(5, 150, 105, 0.1)' : 'rgba(5, 150, 105, 0.08)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Ionicons name={item.icon} size={20} color={Colors.brand.emerald} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary }}>
                                        {item.title}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                                        {item.desc}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Buttons */}
                <View style={{ gap: 12 }}>
                    <TouchableOpacity
                        onPress={handleEnable}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={theme.gradients.brand}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                height: 56,
                                borderRadius: BorderRadius.md,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                gap: 8,
                            }}
                        >
                            <Ionicons name="scan-outline" size={20} color="#fff" />
                            <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                                {loading ? 'Setting up...' : 'Enable Face ID'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleSkip}
                        activeOpacity={0.8}
                        style={{ alignItems: 'center', paddingVertical: 12 }}
                    >
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textSecondary }}>
                            Skip for now
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
