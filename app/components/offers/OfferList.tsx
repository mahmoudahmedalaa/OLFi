import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { router } from 'expo-router';
import { formatAED } from '@/lib/refinance-calculator';
import ShariaBadge from '@/components/ui/ShariaBadge';
import type { BankProduct } from '@/hooks/useOffersData';
import { LinearGradient } from 'expo-linear-gradient';

interface OfferListProps {
    filteredProducts: BankProduct[];
    activeFilters: string[];
    bestRate: number | null;
    bestProduct: BankProduct | undefined;
    selectedOffer: string | null;
    setSelectedOffer: (id: string | null) => void;
}

export default function OfferList({
    filteredProducts,
    activeFilters,
    bestRate,
    bestProduct,
    selectedOffer,
    setSelectedOffer,
}: OfferListProps) {
    const { theme } = useTheme();

    if (filteredProducts.length === 0) {
        return (
            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 40 }}>
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
                    {activeFilters.length > 0 ? 'Try removing some filters' : 'Check back later for new offers'}
                </Text>
            </View>
        );
    }

    return (
        <>
            {/* Best Rate Banner */}
            {bestProduct && (
                <TouchableOpacity
                    style={{ paddingHorizontal: 20, marginBottom: 20 }}
                    activeOpacity={0.9}
                    onPress={() => router.push({ pathname: '/offer-details' as any, params: { productId: bestProduct.id } })}
                >
                    <LinearGradient
                        colors={theme.gradients.premium}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: BorderRadius.lg,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: `${Colors.brand.emerald}40`,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                                BEST RATE FOUND
                            </Text>
                        </View>
                        <Text style={{ fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1 }}>
                            {bestRate}% Profit Rate
                        </Text>
                        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                            {bestProduct.name} from {bestProduct.bank?.name}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' }}>
                            <Text style={{ fontSize: 14, color: Colors.brand.emeraldLight, fontWeight: '600' }}>
                                View Deal
                            </Text>
                            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="arrow-forward" size={14} color="#fff" />
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* Offer Cards */}
            <View style={{ paddingHorizontal: 20 }}>
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
                    return (
                        <TouchableOpacity
                            key={product.id}
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 20,
                                marginBottom: 12,
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
                                            {product.bank?.is_islamic && <ShariaBadge size="small" variant="glass" />}
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

                                    {product.bank?.is_islamic && (
                                        <View style={{ marginTop: 12 }}>
                                            <ShariaBadge size="medium" variant="default" />
                                        </View>
                                    )}

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
