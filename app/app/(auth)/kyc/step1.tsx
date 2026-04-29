import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function KYCStep1() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <View style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
                <View>
                    <View style={{ height: 32 }} />

                    <View style={{ alignItems: 'center', marginVertical: 32 }}>
                        <View style={{
                            width: 80, height: 80, borderRadius: 40, backgroundColor: '#01181920',
                            alignItems: 'center', justifyContent: 'center', marginBottom: 24
                        }}>
                            <Ionicons name="card-outline" size={40} color="#011819" />
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
                            Verify Your Identity
                        </Text>
                        <Text style={{ fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 }}>
                            To create your personalized OLFi profile and analyze your DBR, we need to scan your Emirates ID.
                        </Text>
                    </View>

                    <View style={{ gap: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: theme.colors.card, borderRadius: 12 }}>
                            <Ionicons name="scan-outline" size={24} color="#011819" />
                            <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '600' }}>Front of Emirates ID</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, backgroundColor: theme.colors.card, borderRadius: 12 }}>
                            <Ionicons name="scan-outline" size={24} color="#011819" />
                            <Text style={{ flex: 1, color: theme.colors.textPrimary, fontSize: 15, fontWeight: '600' }}>Back of Emirates ID</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => router.push('/(auth)/kyc/face' as any)} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#011819', '#0A2525']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Scan ID Now</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
