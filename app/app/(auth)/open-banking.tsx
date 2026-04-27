import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/lib/constants';

export default function OpenBankingScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [status, setStatus] = useState<'idle' | 'connecting' | 'success'>('idle');
    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (status === 'connecting') {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                })
            ).start();

            setTimeout(() => {
                setStatus('success');
            }, 3000);
        }
    }, [status]);

    const handleComplete = async () => {
        if (user) {
            await AsyncStorage.setItem(`buyout_ob_completed_${user.id}`, 'true');
        }
        // Redirect to tabs
        router.replace('/(tabs)');
    };

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View>
                    <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 40 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                            <Image source={require('@/assets/images/olfi-icon.png')} style={{ width: 48, height: 48, borderRadius: 12 }} />
                            <Ionicons name="swap-horizontal" size={24} color={theme.colors.textSecondary} />
                            <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="library" size={24} color="#000" />
                            </View>
                        </View>
                    </View>

                    <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
                        Connect your bank safely
                    </Text>
                    <Text style={{ fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 }}>
                        By connecting your bank account, you permit OLFi to analyze your finances via official open banking (Lean API) to source the best Sharia-compliant buyout quotes.
                    </Text>

                    {/* Features list */}
                    <View style={{ gap: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="lock-closed" size={20} color={Colors.brand.emerald} />
                            </View>
                            <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '500' }}>Bank-grade 256-bit encryption</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="eye-off" size={20} color={Colors.brand.emerald} />
                            </View>
                            <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '500' }}>We cannot see your credentials</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="shield-checkmark" size={20} color={Colors.brand.emerald} />
                            </View>
                            <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '500' }}>Read-only access to statements</Text>
                        </View>
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        onPress={() => {
                            if (status === 'idle') setStatus('connecting');
                            else if (status === 'success') handleComplete();
                        }}
                        activeOpacity={0.8}
                        disabled={status === 'connecting'}
                        style={{ marginBottom: 16 }}
                    >
                        <LinearGradient
                            colors={status === 'success' ? theme.gradients.brand : ['#011819', '#0A2525']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{ height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                        >
                            {status === 'connecting' ? (
                                <>
                                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                                        <Ionicons name="sync" size={20} color="#fff" />
                                    </Animated.View>
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Connecting...</Text>
                                </>
                            ) : status === 'success' ? (
                                <>
                                    <Ionicons name="checkmark-circle" size={20} color="#000" />
                                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>Bank Connected</Text>
                                </>
                            ) : (
                                <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Connect Bank Account</Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleComplete} activeOpacity={0.8} style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textSecondary }}>
                            Skip for now (Early Adopter)
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
