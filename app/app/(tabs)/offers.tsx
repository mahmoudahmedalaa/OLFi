import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';

interface BankProduct {
    id: string;
    name: string;
    product_type: string;
    interest_rate_min: number | null;
    interest_rate_max: number | null;
    min_amount: number | null;
    max_amount: number | null;
    max_tenure_months: number | null;
    processing_fee_pct: number | null;
    features: string[];
    bank: {
        id: string;
        name: string;
        is_islamic: boolean;
    };
}

export default function OffersScreen() {
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [products, setProducts] = useState<BankProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const { theme } = useTheme();

    const fetchProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bank_products')
                .select(`
                    id, name, product_type,
                    interest_rate_min, interest_rate_max,
                    min_amount, max_amount, max_tenure_months,
                    processing_fee_pct, features,
                    bank:banks!bank_products_bank_id_fkey (id, name, is_islamic)
                `)
                .eq('is_active', true)
                .order('interest_rate_min', { ascending: true });
            if (error) throw error;

            // Transform data to flatten the bank relation
            const transformed = (data || []).map((item: any) => ({
                ...item,
                bank: item.bank,
                features: Array.isArray(item.features) ? item.features : [],
            }));
            setProducts(transformed);
        } catch (e) {
            console.error('Failed to fetch products:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const FILTER_CHIPS = [
        { key: 'sharia', label: 'Sharia Compliant', icon: 'shield-checkmark' as const },
        { key: 'no_salary_transfer', label: 'No Salary Transfer', icon: 'wallet-outline' as const },
        { key: 'early_settlement', label: 'Early Settlement', icon: 'flash-outline' as const },
        { key: 'rate_lock', label: 'Rate Lock', icon: 'lock-closed-outline' as const },
        { key: 'debt_consolidation', label: 'Debt Consolidation', icon: 'git-merge-outline' as const },
        { key: 'no_guarantor', label: 'No Guarantor', icon: 'person-remove-outline' as const },
        { key: 'top_up', label: 'Top-Up Available', icon: 'add-circle-outline' as const },
        { key: 'fixed_rate', label: 'Fixed Rate', icon: 'trending-up-outline' as const },
    ];

    const toggleFilter = (key: string) => {
        setActiveFilters((prev) =>
            prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
        );
    };

    const filteredProducts = products.filter((p) => {
        for (const filter of activeFilters) {
            if (filter === 'sharia') {
                if (!p.bank?.is_islamic) return false;
            } else {
                // Match against features array (case-insensitive)
                const featureMatch = p.features?.some((f) =>
                    f.toLowerCase().includes(filter.replace(/_/g, ' '))
                );
                if (!featureMatch) return false;
            }
        }
        return true;
    });

    const bestRate = filteredProducts.length > 0
        ? Math.min(...filteredProducts.map((p) => p.interest_rate_min || 99))
        : null;

    const bestProduct = filteredProducts.find((p) => p.interest_rate_min === bestRate);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchProducts();
                        }}
                        tintColor={Colors.brand.emerald}
                    />
                }
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Refinance Offers
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.colors.textSecondary,
                            marginTop: 4,
                        }}
                    >
                        Compare rates from UAE banks and save
                    </Text>
                </View>

                {/* Multi-Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 20,
                        gap: 8,
                        paddingBottom: 16,
                    }}
                    style={{ marginBottom: 4 }}
                >
                    {FILTER_CHIPS.map((chip) => {
                        const isActive = activeFilters.includes(chip.key);
                        return (
                            <TouchableOpacity
                                key={chip.key}
                                onPress={() => toggleFilter(chip.key)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingHorizontal: 14,
                                    paddingVertical: 8,
                                    borderRadius: 20,
                                    backgroundColor: isActive
                                        ? chip.key === 'sharia' ? Colors.brand.teal : Colors.brand.emerald
                                        : theme.colors.card,
                                    borderWidth: isActive ? 0 : 1,
                                    borderColor: theme.colors.border,
                                }}
                                activeOpacity={0.7}
                            >
                                <Ionicons
                                    name={chip.icon}
                                    size={14}
                                    color={isActive ? '#fff' : theme.colors.textSecondary}
                                />
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: isActive ? '#fff' : theme.colors.textSecondary,
                                    }}
                                >
                                    {chip.label}
                                </Text>
                                {isActive && (
                                    <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.7)" />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {loading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator color={Colors.brand.emerald} size="large" />
                    </View>
                ) : filteredProducts.length === 0 ? (
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
                ) : (
                    <>
                        {/* Best Rate Banner */}
                        {bestProduct && (
                            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                <LinearGradient
                                    colors={theme.gradients.premium}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={{
                                        borderRadius: BorderRadius.lg,
                                        padding: 20,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                        <Ionicons name="star" size={16} color="#FFD700" />
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                                            BEST RATE FOUND
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1 }}>
                                        {bestRate}% APR
                                    </Text>
                                    <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                                        {bestProduct.name} from {bestProduct.bank?.name}
                                    </Text>
                                </LinearGradient>
                            </View>
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
                                Available Offers ({filteredProducts.length})
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
                                                        : 'APR'}
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
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            gap: 6,
                                                            marginTop: 12,
                                                            backgroundColor: `${Colors.brand.teal}15`,
                                                            paddingHorizontal: 12,
                                                            paddingVertical: 8,
                                                            borderRadius: BorderRadius.sm,
                                                        }}
                                                    >
                                                        <Ionicons name="shield-checkmark" size={14} color={Colors.brand.teal} />
                                                        <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.brand.teal }}>
                                                            Sharia Compliant
                                                        </Text>
                                                    </View>
                                                )}

                                                <TouchableOpacity
                                                    style={{
                                                        marginTop: 16,
                                                        backgroundColor: Colors.brand.emerald,
                                                        borderRadius: BorderRadius.md,
                                                        paddingVertical: 14,
                                                        alignItems: 'center',
                                                    }}
                                                    activeOpacity={0.8}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 15,
                                                            fontWeight: '600',
                                                            color: '#fff',
                                                        }}
                                                    >
                                                        Apply Now
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
