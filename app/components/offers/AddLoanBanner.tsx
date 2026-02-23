import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import type { UserLoan } from '@/hooks/useOffersData';

interface AddLoanBannerProps {
    userLoans: UserLoan[];
    loading: boolean;
}

export default function AddLoanBanner({ userLoans, loading }: AddLoanBannerProps) {
    const { theme } = useTheme();

    if (userLoans.length > 0 || loading) return null;

    return (
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TouchableOpacity
                onPress={() => router.push('/(tabs)/loans')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                    style={{
                        borderRadius: BorderRadius.lg,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: `${Colors.brand.emerald}30`,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 14,
                    }}
                >
                    <View
                        style={{
                            width: 44,
                            height: 44,
                            borderRadius: 22,
                            backgroundColor: `${Colors.brand.emerald}20`,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name="add-circle" size={24} color={Colors.brand.emerald} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: Colors.brand.emerald,
                            }}
                        >
                            Add financing to see personalized offers
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                color: theme.colors.textTertiary,
                                marginTop: 2,
                            }}
                        >
                            We&apos;ll find the best refinance deals for you
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.brand.emerald} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}
