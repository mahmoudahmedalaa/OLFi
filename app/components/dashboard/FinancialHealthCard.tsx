import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { Theme } from '@/lib/theme-context';
import { formatAED, type HealthScore } from '@/lib/refinance-calculator';

interface Props {
    theme: Theme;
    healthScore: HealthScore | null;
    dtiRatio: number | null;
    totalEmi: number;
    interestBurden: number;
    potentialMonthlySavings: number;
    router: any;
}

export function FinancialHealthCard({
    theme,
    healthScore,
    dtiRatio,
    totalEmi,
    interestBurden,
    potentialMonthlySavings,
    router,
}: Props) {
    return (
        <View
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 20,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            {/* Health Score Badge */}
            {healthScore ? (
                <View style={{ marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <View
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: `${healthScore.color}20`,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons
                                name={
                                    healthScore.score === 'excellent' ? 'shield-checkmark' :
                                        healthScore.score === 'good' ? 'thumbs-up' :
                                            healthScore.score === 'fair' ? 'alert-circle' : 'warning'
                                }
                                size={24}
                                color={healthScore.color}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: healthScore.color }}>
                                {healthScore.label}
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                                Debt-to-Income: {dtiRatio}%
                            </Text>
                        </View>
                    </View>

                    {/* Health Bar */}
                    <View style={{ height: 6, backgroundColor: theme.colors.border, borderRadius: 3, overflow: 'hidden' }}>
                        <View
                            style={{
                                width: `${healthScore.percentage}%`,
                                height: '100%',
                                backgroundColor: healthScore.color,
                                borderRadius: 3,
                            }}
                        />
                    </View>
                    <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 8 }}>
                        {healthScore.description}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={() => router.push('/edit-profile' as any)}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: `${Colors.info}15`,
                        padding: 14,
                        borderRadius: BorderRadius.md,
                        marginBottom: 20,
                    }}
                >
                    <Ionicons name="information-circle" size={20} color={Colors.info} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.info }}>
                            Add your salary to see your health score
                        </Text>
                        <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                            Tap to update your profile
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.info} />
                </TouchableOpacity>
            )}

            {/* Stats Row */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, backgroundColor: `${Colors.brand.emerald}10`, borderRadius: BorderRadius.md, padding: 14, alignItems: 'center' }}>
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                        Monthly Debt
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>
                        AED {totalEmi.toLocaleString()}
                    </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: `${theme.colors.cardElevated}`, borderRadius: BorderRadius.md, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border }}>
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                        Financing Cost
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>
                        {formatAED(interestBurden)}
                    </Text>
                </View>
            </View>

            {/* Savings Teaser */}
            {potentialMonthlySavings > 0 && (
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/offers')}
                    activeOpacity={0.8}
                    style={{ marginTop: 16 }}
                >
                    <LinearGradient
                        colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                        style={{
                            borderRadius: BorderRadius.md,
                            padding: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: `${Colors.brand.emerald}30`,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                <Ionicons name="shield-checkmark" size={14} color={Colors.brand.emerald} />
                                <Text style={{ fontSize: 11, fontWeight: '600', color: Colors.brand.emerald, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    100% Sharia-Compliant
                                </Text>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.brand.emerald }}>
                                💰 You could save ~AED {potentialMonthlySavings.toLocaleString()}/month
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                                Check personalized BuyOut offers →
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );
}
