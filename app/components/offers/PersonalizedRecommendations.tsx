import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { router } from 'expo-router';
import { formatAED } from '@/lib/refinance-calculator';
import type { PersonalizedRecommendation } from '@/hooks/useOffersData';

interface PersonalizedRecommendationsProps {
    recommendations: PersonalizedRecommendation[];
}

export default function PersonalizedRecommendations({ recommendations }: PersonalizedRecommendationsProps) {
    const { theme } = useTheme();

    if (recommendations.length === 0) return null;

    return (
        <View style={{ marginBottom: 24 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="sparkles" size={18} color={Colors.brand.emerald} />
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Recommended for You
                    </Text>
                </View>
            </View>

            {recommendations.map((rec) => (
                <View key={rec.loan.id} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    {/* Loan header */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 12,
                        }}
                    >
                        <Ionicons
                            name="card-outline"
                            size={14}
                            color={theme.colors.textTertiary}
                        />
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: theme.colors.textSecondary,
                            }}
                        >
                            {rec.loan.bank_name || 'Your'} {rec.loan.loan_type.replace(/_/g, ' ')} finance
                            ({formatAED(rec.loan.remaining_amount)} at {rec.loan.interest_rate}%)
                        </Text>
                    </View>

                    {/* Recommendation cards */}
                    {rec.topOffers.map((offer, idx) => (
                        <TouchableOpacity
                            key={offer.productId}
                            activeOpacity={0.8}
                            onPress={() =>
                                router.push({
                                    pathname: '/offer-details' as any,
                                    params: {
                                        productId: offer.productId,
                                        loanId: rec.loan.id,
                                    },
                                })
                            }
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 16,
                                marginBottom: 8,
                                borderWidth: idx === 0 ? 1.5 : 1,
                                borderColor:
                                    idx === 0
                                        ? Colors.brand.emerald
                                        : theme.colors.border,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                {idx === 0 && (
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: -24,
                                            left: 0,
                                            backgroundColor: Colors.brand.emerald,
                                            paddingHorizontal: 8,
                                            paddingVertical: 2,
                                            borderRadius: 4,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 9,
                                                fontWeight: '700',
                                                color: '#fff',
                                                letterSpacing: 0.5,
                                            }}
                                        >
                                            TOP PICK
                                        </Text>
                                    </View>
                                )}
                                <View
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 10,
                                        backgroundColor: theme.colors.cardElevated,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name={offer.isIslamic ? 'moon' : 'business'}
                                        size={18}
                                        color={
                                            offer.isIslamic
                                                ? Colors.brand.teal
                                                : Colors.brand.emerald
                                        }
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: theme.colors.textPrimary,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {offer.bankName}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.textTertiary,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {offer.productName} · {offer.newRate}%
                                    </Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '700',
                                        color: Colors.brand.emerald,
                                    }}
                                >
                                    Save {formatAED(offer.monthlySavings)}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: theme.colors.textTertiary,
                                    }}
                                >
                                    /month
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}
