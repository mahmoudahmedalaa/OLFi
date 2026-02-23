import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { router } from 'expo-router';
import { formatAED } from '@/lib/refinance-calculator';
import type { RefinanceResult } from '@/lib/refinance-calculator';
import type { BankProduct } from '@/hooks/useOffersData';
import { LinearGradient } from 'expo-linear-gradient';

interface ConsolidationOffersProps {
    consolidationOffers: (RefinanceResult & { productData?: BankProduct })[];
}

export default function ConsolidationOffers({ consolidationOffers }: ConsolidationOffersProps) {
    const { theme } = useTheme();

    if (consolidationOffers.length === 0) return null;

    return (
        <View style={{ marginBottom: 24 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ionicons name="git-merge" size={18} color={Colors.brand.emerald} />
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Debt Consolidation Offers
                    </Text>
                </View>
                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
                    Combine your selected financing into one easy payment
                </Text>
            </View>

            {consolidationOffers.map((offer, idx) => (
                <View key={offer.productId} style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() =>
                            router.push({
                                pathname: '/offer-details' as any,
                                params: {
                                    productId: offer.productId,
                                    isConsolidation: 'true'
                                },
                            })
                        }
                    >
                        <LinearGradient
                            colors={
                                idx === 0
                                    ? theme.gradients.premium
                                    : [theme.colors.card, theme.colors.card]
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.lg,
                                padding: 20,
                                borderWidth: idx === 0 ? 0 : 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                <View style={{ flex: 1 }}>
                                    {idx === 0 && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <Ionicons name="star" size={14} color="#FFD700" />
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: 0.5 }}>
                                                BEST CONSOLIDATION
                                            </Text>
                                        </View>
                                    )}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <View style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            backgroundColor: idx === 0 ? 'rgba(255,255,255,0.2)' : theme.colors.cardElevated,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Ionicons
                                                name={offer.isIslamic ? 'moon' : 'business'}
                                                size={16}
                                                color={idx === 0 ? '#fff' : (offer.isIslamic ? Colors.brand.teal : Colors.brand.emerald)}
                                            />
                                        </View>
                                        <View>
                                            <Text style={{
                                                fontSize: 17,
                                                fontWeight: '600',
                                                color: idx === 0 ? '#fff' : theme.colors.textPrimary
                                            }}>
                                                {offer.bankName}
                                            </Text>
                                            <Text style={{
                                                fontSize: 13,
                                                color: idx === 0 ? 'rgba(255,255,255,0.8)' : theme.colors.textSecondary
                                            }}>
                                                {offer.productName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{
                                        fontSize: 24,
                                        fontWeight: '700',
                                        color: idx === 0 ? '#fff' : Colors.brand.emerald
                                    }}>
                                        {offer.newRate}%
                                    </Text>
                                    <Text style={{
                                        fontSize: 11,
                                        color: idx === 0 ? 'rgba(255,255,255,0.8)' : theme.colors.textTertiary
                                    }}>
                                        Profit Rate
                                    </Text>
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: idx === 0 ? 'rgba(255,255,255,0.1)' : theme.colors.bg,
                                borderRadius: BorderRadius.md,
                                padding: 12,
                                justifyContent: 'space-between'
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 11,
                                        color: idx === 0 ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary,
                                        marginBottom: 2
                                    }}>
                                        Monthly Savings
                                    </Text>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: idx === 0 ? '#fff' : Colors.brand.emerald
                                    }}>
                                        {formatAED(offer.monthlySavings)}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={{
                                        fontSize: 11,
                                        color: idx === 0 ? 'rgba(255,255,255,0.7)' : theme.colors.textTertiary,
                                        marginBottom: 2
                                    }}>
                                        Total Savings
                                    </Text>
                                    <Text style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: idx === 0 ? '#fff' : theme.colors.textPrimary
                                    }}>
                                        {formatAED(offer.totalSavings)}
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}
