import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius } from '@/lib/constants';
import { Theme } from '@/lib/theme-context';
import Skeleton from '@/components/ui/Skeleton';
import { Colors } from '@/lib/constants';

interface Props {
    theme: Theme;
    loading: boolean;
    totalDebt: number;
    totalEmi: number;
    potentialMonthlySavings: number;
}

export function DebtSummaryCard({
    theme,
    loading,
    totalDebt,
    totalEmi,
    potentialMonthlySavings,
}: Props) {
    return (
        <LinearGradient
            colors={theme.gradients.card}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                borderRadius: BorderRadius.xl,
                padding: 24,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            {loading ? (
                <View style={{ gap: 8 }}>
                    <Skeleton width={120} height={14} />
                    <Skeleton width={200} height={40} style={{ marginVertical: 4 }} />
                    <Skeleton width={150} height={14} />
                </View>
            ) : (
                <>
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '500',
                            color: theme.colors.textSecondary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                        }}
                    >
                        Total Outstanding
                    </Text>
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                            marginTop: 8,
                            letterSpacing: -1,
                        }}
                    >
                        {totalDebt > 0 ? `AED ${totalDebt.toLocaleString()}` : 'No debts yet'}
                    </Text>
                    {totalDebt > 0 && (
                        <View style={{ flexDirection: 'row', marginTop: 20, gap: 24 }}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: theme.colors.textTertiary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        marginBottom: 4,
                                    }}
                                >
                                    Monthly EMI
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: '600',
                                        color: theme.colors.textPrimary,
                                    }}
                                >
                                    AED {totalEmi.toLocaleString()}
                                </Text>
                            </View>
                            <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                            <View>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: theme.colors.textTertiary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                        marginBottom: 4,
                                    }}
                                >
                                    Potential Savings
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: '600',
                                        color: Colors.brand.emerald,
                                    }}
                                >
                                    AED {potentialMonthlySavings.toLocaleString()}/mo
                                </Text>
                            </View>
                        </View>
                    )}
                </>
            )}
        </LinearGradient>
    );
}
