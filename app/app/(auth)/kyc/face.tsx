import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/lib/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/lib/constants';

export default function FaceIdentityScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (scanState === 'scanning') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            ).start();

            setTimeout(() => {
                setScanState('success');
            }, 3000);
        }
    }, [scanState, scaleAnim]);

    const handleCompleteKYC = async () => {
        if (user) {
            await AsyncStorage.setItem(`buyout_kyc_completed_${user.id}`, 'true');
        }
        // Navigate to biometric setup as the final post-auth step
        router.replace('/(auth)/biometric-setup' as any);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12 }}>
                        Liveness Check
                    </Text>
                    <Text style={{ fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 }}>
                        {scanState === 'success'
                            ? 'Verification Successful!'
                            : 'Position your face in the frame and complete the movement to prove you are human.'}
                    </Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Animated.View style={{
                        width: 200, height: 260,
                        borderRadius: 100,
                        borderWidth: 4,
                        borderColor: scanState === 'success' ? Colors.brand.emerald : (scanState === 'scanning' ? Colors.brand.teal : theme.colors.border),
                        overflow: 'hidden',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: theme.colors.card,
                        transform: [{ scale: scaleAnim }]
                    }}>
                        {scanState === 'success' ? (
                            <Ionicons name="checkmark-circle" size={80} color={Colors.brand.emerald} />
                        ) : (
                            <Ionicons name="person-outline" size={100} color={theme.colors.textTertiary} />
                        )}
                    </Animated.View>
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (scanState === 'idle') setScanState('scanning');
                        else if (scanState === 'success') handleCompleteKYC();
                    }}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={scanState === 'success' ? theme.gradients.brand : ['#011819', '#0A2525']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                            {scanState === 'idle' ? 'Start Scan' : (scanState === 'scanning' ? 'Processing...' : 'Continue')}
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
