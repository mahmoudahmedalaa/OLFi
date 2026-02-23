import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { Theme } from '@/lib/theme-context';
import CircularProgress from '@/components/ui/CircularProgress';

export function LoanPreviewCard({
    bankName,
    type,
    amount,
    rate,
    remaining,
    emi,
    progress,
    theme,
    onPress,
    savingsEstimate,
}: {
    bankName: string;
    type: string;
    amount: number;
    rate: number;
    remaining: number;
    emi: number;
    progress: number;
    theme: Theme;
    onPress?: () => void;
    savingsEstimate?: number;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 20,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
            activeOpacity={0.8}
        >
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 16,
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        {bankName}
                    </Text>
                    <Text
                        style={{
                            fontSize: 13,
                            color: theme.colors.textTertiary,
                            marginTop: 2,
                        }}
                    >
                        {type} • {rate}% APR
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: `${Colors.brand.emerald}15`,
                        paddingHorizontal: 10,
                        paddingVertical: 4,
                        borderRadius: 8,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 11,
                            fontWeight: '600',
                            color: Colors.brand.emerald,
                        }}
                    >
                        ACTIVE
                    </Text>
                </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <View>
                    <Text
                        style={{
                            fontSize: 11,
                            color: theme.colors.textTertiary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Remaining
                    </Text>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                            marginTop: 2,
                        }}
                    >
                        AED {remaining.toLocaleString()}
                    </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <Text
                        style={{
                            fontSize: 11,
                            color: theme.colors.textTertiary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Monthly EMI
                    </Text>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                            marginTop: 2,
                        }}
                    >
                        AED {emi.toLocaleString()}
                    </Text>
                </View>
            </View>

            {/* Progress */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
                <CircularProgress
                    progress={progress}
                    size={48}
                    strokeWidth={5}
                    color={Colors.brand.emerald}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 }}>
                        {Math.round(progress * 100)}% Repaid
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>
                        of AED {amount.toLocaleString()} original financing
                    </Text>
                </View>
            </View>

            {/* Savings badge */}
            {savingsEstimate != null && savingsEstimate > 0 && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: `${Colors.brand.emerald}10`,
                        borderRadius: 8,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        marginTop: 10,
                        gap: 6,
                    }}
                >
                    <Ionicons name="trending-down" size={14} color={Colors.brand.emerald} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.brand.emerald }}>
                        Potential savings: ~AED {savingsEstimate.toLocaleString()}/mo
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
