import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { router } from 'expo-router';
import { formatAED } from '@/lib/refinance-calculator';

import type { BankProduct, PersonalizedRecommendation } from '@/hooks/useOffersData';


interface OfferListProps {
    filteredProducts: BankProduct[];
    activeFilters: string[];
    selectedBanks: string[];
    selectedOffer: string | null;
    setSelectedOffer: (id: string | null) => void;
    recommendations?: PersonalizedRecommendation[];
}

export default function OfferList({
    filteredProducts,
    activeFilters,
    selectedBanks,
    selectedOffer,
    setSelectedOffer,
    recommendations = [],
}: OfferListProps) {
    const { theme } = useTheme();

    // Compute best rate locally for the chip badge on the first card
    const bestRate = React.useMemo(() => {
        if (filteredProducts.length === 0) return null;
        return Math.min(
            ...filteredProducts
                .map((p) => p.interest_rate_min)
                .filter((r): r is number => r !== null)
        );
    }, [filteredProducts]);

    if (filteredProducts.length === 0) {
        return (
            <View style={{ paddingVertical: Spacing['4xl'], alignItems: 'center', paddingHorizontal: Spacing['4xl'] }}>
                <Ionicons name="search-outline" size={48} color={theme.colors.textTertiary} />
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: theme.colors.textPrimary,
                        marginTop: 16,
                    }}
                >
                    No products found
                </Text>
                <Text
                    style={{
                        fontSize: 13,
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                        textAlign: 'center',
                    }}
                >
                    {activeFilters.length > 0 || selectedBanks.length > 0
                        ? 'Try removing some filters'
                        : 'Check back later for new offers'}
                </Text>
            </View>
        );
    }

    return (
        <>
            <View style={{ paddingHorizontal: Spacing.xl }}>
                <Text
                    style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: theme.colors.textPrimary,
                        marginBottom: 16,
                    }}
                >
                    All Products ({filteredProducts.length})
                </Text>

                {filteredProducts.map((product, index) => {
                    const isBest = product.interest_rate_min === bestRate && index === 0;

                    // Extract best personalized savings insight for this product, if any
                    const productInsights = recommendations
                        .map((rec) => {
                            const matchingOffer = rec.topOffers.find((o) => o.productId === product.id);
                            if (matchingOffer && matchingOffer.monthlySavings > 0) {
                                return {
                                    loanName: rec.loan.bank_name
                                        ? `${rec.loan.bank_name}`
                                        : 'existing',
                                    loanType: rec.loan.loan_type.replace(/_/g, ' '),
                                    savings: matchingOffer.monthlySavings,
                                };
                            }
                            return null;
                        })
                        .filter((insight): insight is { loanName: string; loanType: string; savings: number } => insight !== null)
                        .sort((a, b) => b.savings - a.savings);

                    const bestInsight = productInsights[0];

                    return (
                        <TouchableOpacity
                            key={product.id}
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: Spacing.xl,
                                marginBottom: Spacing.md,
                                borderWidth: isBest ? 1.5 : 1,
                                borderColor: isBest
                                    ? Colors.brand.emerald
                                    : theme.colors.border,
                            }}
                            activeOpacity={0.8}
                            onPress={() =>
                                setSelectedOffer(
                                    selectedOffer === product.id ? null : product.id
                                )
                            }
                        >
                            {isBest && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -10,
                                        right: 16,
                                        backgroundColor: Colors.brand.emerald,
                                        paddingHorizontal: 10,
                                        paddingVertical: 4,
                                        borderRadius: 6,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            fontWeight: '700',
                                            color: '#fff',
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        BEST RATE
                                    </Text>
                                </View>
                            )}

                            {/* Personalized Insight Inline */}
                            {bestInsight && (
                                <View
                                    style={{
                                        backgroundColor: `${Colors.brand.emerald}15`,
                                        paddingHorizontal: 12,
                                        paddingVertical: 10,
                                        borderRadius: BorderRadius.md,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                    }}
                                >
                                    <Ionicons name="sparkles" size={16} color={Colors.brand.emerald} />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: Colors.brand.emerald,
                                                fontWeight: '600',
                                            }}
                                        >
                                            Save {formatAED(bestInsight.savings)}/mo
                                        </Text>
                                        <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>
                                            if you refinance your {bestInsight.loanName} {bestInsight.loanType}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Bank + Rate */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 16,
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            backgroundColor: theme.colors.cardElevated,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name={product.bank?.is_islamic ? 'moon' : 'business'}
                                            size={20}
                                            color={product.bank?.is_islamic ? Colors.brand.teal : Colors.brand.emerald}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                            <Text
                                                style={{
                                                    fontSize: 17,
                                                    fontWeight: '600',
                                                    color: theme.colors.textPrimary,
                                                }}
                                                numberOfLines={1}
                                            >
                                                {product.bank?.name || 'Unknown'}
                                            </Text>

                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: theme.colors.textTertiary,
                                            }}
                                            numberOfLines={1}
                                        >
                                            {product.name}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: '700',
                                            color: Colors.brand.emerald,
                                        }}
                                    >
                                        {product.interest_rate_min || '—'}%
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.textTertiary,
                                        }}
                                    >
                                        {product.interest_rate_max
                                            ? `to ${product.interest_rate_max}%`
                                            : 'Profit Rate'}
                                    </Text>
                                </View>
                            </View>

                            {/* Details row */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: `${Colors.brand.emerald}10`,
                                    borderRadius: BorderRadius.md,
                                    padding: 12,
                                    marginBottom: selectedOffer === product.id ? 16 : 0,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.textTertiary,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Max Tenure
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: theme.colors.textPrimary,
                                            marginTop: 2,
                                        }}
                                    >
                                        {product.max_tenure_months || '—'} months
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: theme.colors.textTertiary,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Max Amount
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: theme.colors.textPrimary,
                                            marginTop: 2,
                                        }}
                                    >
                                        {product.max_amount
                                            ? `AED ${Number(product.max_amount).toLocaleString()}`
                                            : '—'}
                                    </Text>
                                </View>
                            </View>

                            {/* Expanded Details */}
                            {selectedOffer === product.id && (
                                <View>
                                    {product.features.length > 0 && (
                                        <>
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                    color: theme.colors.textSecondary,
                                                    marginBottom: 8,
                                                }}
                                            >
                                                Features
                                            </Text>
                                            {product.features.map((feature: any, i: number) => (
                                                <View
                                                    key={i}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: 8,
                                                        marginBottom: 6,
                                                    }}
                                                >
                                                    <Ionicons
                                                        name="checkmark-circle"
                                                        size={16}
                                                        color={Colors.brand.emerald}
                                                    />
                                                    <Text
                                                        style={{
                                                            fontSize: 13,
                                                            color: theme.colors.textSecondary,
                                                        }}
                                                    >
                                                        {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                                                    </Text>
                                                </View>
                                            ))}
                                        </>
                                    )}

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 12,
                                            paddingTop: 12,
                                            borderTopWidth: 1,
                                            borderTopColor: theme.colors.border,
                                        }}
                                    >
                                        <Text style={{ fontSize: 13, color: theme.colors.textTertiary }}>
                                            Processing Fee
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: '600',
                                                color: theme.colors.textPrimary,
                                            }}
                                        >
                                            {product.processing_fee_pct
                                                ? `${product.processing_fee_pct}%`
                                                : 'N/A'}
                                        </Text>
                                    </View>



                                    <TouchableOpacity
                                        style={{
                                            marginTop: 16,
                                            backgroundColor: Colors.brand.emerald,
                                            borderRadius: BorderRadius.md,
                                            paddingVertical: 14,
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            gap: 8,
                                        }}
                                        activeOpacity={0.8}
                                        onPress={() => router.push({ pathname: '/offer-details' as any, params: { productId: product.id } })}
                                    >
                                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: '600',
                                                color: '#fff',
                                            }}
                                        >
                                            View Details & Savings
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
}
