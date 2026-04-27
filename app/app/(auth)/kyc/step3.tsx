import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '@/lib/auth-context';

export default function KYCStep3() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [enableFaceId, setEnableFaceId] = useState(false);

    const completeKYC = async () => {
        if (enableFaceId) {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            if (hasHardware && isEnrolled) {
                await AsyncStorage.setItem('@buyout_biometric_lock', 'true');
            }
        }
        if (user) {
            await AsyncStorage.setItem(`buyout_kyc_completed_${user.id}`, 'true');
        }
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View>
                    <TouchableOpacity onPress={() => router.back()} style={{ alignSelf: 'flex-start', marginBottom: 20 }}>
                        <Ionicons name="arrow-back" size={28} color={theme.colors.textSecondary} />
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', marginVertical: 32 }}>
                        <View style={{
                            width: 80, height: 80, borderRadius: 40, backgroundColor: '#01181920',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 24
                        }}>
                            <Ionicons name="shield-checkmark-outline" size={40} color="#011819" />
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
                            Secure Your Profile
                        </Text>
                        <Text style={{ fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 }}>
                            Review your details and secure your application with biometric authentication.
                        </Text>
                    </View>

                    <View style={{ backgroundColor: theme.colors.card, borderRadius: 16, padding: 20, gap: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>Full Name</Text>
                            <Text style={{ color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' }}>Mahmoud Alaa</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>ID Expiry</Text>
                            <Text style={{ color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600' }}>12 Oct 2028</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 14 }}>Status</Text>
                            <Text style={{ color: '#011819', fontSize: 14, fontWeight: '600' }}>Verified</Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, padding: 16, backgroundColor: theme.colors.card, borderRadius: 16 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: theme.colors.textPrimary, fontSize: 16, fontWeight: '600', marginBottom: 4 }}>Enable Face ID</Text>
                            <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>Lock OLFi for extra security</Text>
                        </View>
                        <Switch
                            value={enableFaceId}
                            onValueChange={setEnableFaceId}
                            trackColor={{ false: theme.colors.border, true: '#011819' }}
                        />
                    </View>
                </View>

                {/* Final Action */}
                <TouchableOpacity onPress={completeKYC} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#011819', '#0A2525']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Complete Profile</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
