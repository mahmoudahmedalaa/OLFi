import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function KYCStep2() {
    const { theme } = useTheme();

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
                            <Ionicons name="scan-circle-outline" size={44} color="#011819" />
                        </View>
                        <Text style={{ fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 12, textAlign: 'center' }}>
                            Liveness Check
                        </Text>
                        <Text style={{ fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 24 }}>
                            Take a quick selfie to verify your identity matches your Emirates ID.
                        </Text>
                    </View>

                    <View style={{
                        marginTop: 20, height: 280, borderRadius: 24, backgroundColor: theme.colors.card,
                        alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#01181940',
                        borderStyle: 'dashed'
                    }}>
                        <Ionicons name="camera-outline" size={64} color={theme.colors.textTertiary} />
                    </View>
                </View>

                {/* Dummy Action */}
                <TouchableOpacity onPress={() => router.push('/(auth)/kyc/step3' as any)} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#011819', '#0A2525']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>Take Selfie</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
