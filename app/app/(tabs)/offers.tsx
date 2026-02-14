import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';

interface BankOffer {
    id: string;
    bankName: string;
    logo: string;
    interestRate: number;
    maxTenure: number;
    processingFee: string;
    monthlySavings: number;
    totalSavings: number;
    features: string[];
    recommended: boolean;
}

const mockOffers: BankOffer[] = [
    {
        id: '1',
        bankName: 'Emirates NBD',
        logo: '🏦',
        interestRate: 3.49,
        maxTenure: 48,
        processingFee: '1%',
        monthlySavings: 450,
        totalSavings: 21600,
        features: ['Salary Transfer', 'Balance Transfer', 'No Early Settlement Fee'],
        recommended: true,
    },
    {
        id: '2',
        bankName: 'FAB',
        logo: '🏛️',
        interestRate: 3.75,
        maxTenure: 48,
        processingFee: '1.05%',
        monthlySavings: 380,
        totalSavings: 18240,
        features: ['Flexible Tenure', 'Online Application', 'Quick Approval'],
        recommended: false,
    },
    {
        id: '3',
        bankName: 'ADIB',
        logo: '🕌',
        interestRate: 3.99,
        maxTenure: 60,
        processingFee: '0.75%',
        monthlySavings: 320,
        totalSavings: 19200,
        features: ['Sharia Compliant', 'No Hidden Fees', 'Flexible Payment'],
        recommended: false,
    },
    {
        id: '4',
        bankName: 'Mashreq',
        logo: '🏢',
        interestRate: 4.25,
        maxTenure: 48,
        processingFee: '1.25%',
        monthlySavings: 250,
        totalSavings: 12000,
        features: ['Instant Approval', 'Mobile Banking', 'Cash Back'],
        recommended: false,
    },
];

export default function OffersScreen() {
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.primary }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: Colors.text.dark.primary,
                        }}
                    >
                        Refinance Offers
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            color: Colors.text.dark.secondary,
                            marginTop: 4,
                        }}
                    >
                        Compare rates from UAE banks and save
                    </Text>
                </View>

                {/* Best Rate Banner */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <LinearGradient
                        colors={Colors.gradients.premium as unknown as [string, string]}
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
                            3.49% APR
                        </Text>
                        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                            Save up to AED 21,600 with Emirates NBD
                        </Text>
                    </LinearGradient>
                </View>

                {/* Offer Cards */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: Colors.text.dark.primary,
                            marginBottom: 16,
                        }}
                    >
                        Available Offers ({mockOffers.length})
                    </Text>

                    {mockOffers.map((offer) => (
                        <TouchableOpacity
                            key={offer.id}
                            style={{
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: BorderRadius.lg,
                                padding: 20,
                                marginBottom: 12,
                                borderWidth: offer.recommended ? 1.5 : 1,
                                borderColor: offer.recommended
                                    ? Colors.brand.emerald
                                    : Colors.dark.tertiary,
                            }}
                            activeOpacity={0.8}
                            onPress={() =>
                                setSelectedOffer(
                                    selectedOffer === offer.id ? null : offer.id
                                )
                            }
                        >
                            {offer.recommended && (
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
                                        RECOMMENDED
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            backgroundColor: Colors.dark.tertiary,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: 22 }}>{offer.logo}</Text>
                                    </View>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 17,
                                                fontWeight: '600',
                                                color: Colors.text.dark.primary,
                                            }}
                                        >
                                            {offer.bankName}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                color: Colors.text.dark.tertiary,
                                            }}
                                        >
                                            Up to {offer.maxTenure} months
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text
                                        style={{
                                            fontSize: 24,
                                            fontWeight: '700',
                                            color: Colors.brand.emerald,
                                        }}
                                    >
                                        {offer.interestRate}%
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: Colors.text.dark.tertiary,
                                        }}
                                    >
                                        APR
                                    </Text>
                                </View>
                            </View>

                            {/* Savings */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    backgroundColor: `${Colors.brand.emerald}10`,
                                    borderRadius: BorderRadius.md,
                                    padding: 12,
                                    marginBottom: selectedOffer === offer.id ? 16 : 0,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: Colors.text.dark.tertiary,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Monthly Savings
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: Colors.brand.emerald,
                                            marginTop: 2,
                                        }}
                                    >
                                        AED {offer.monthlySavings}
                                    </Text>
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: Colors.text.dark.tertiary,
                                            textTransform: 'uppercase',
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Total Savings
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: Colors.brand.emerald,
                                            marginTop: 2,
                                        }}
                                    >
                                        AED {offer.totalSavings.toLocaleString()}
                                    </Text>
                                </View>
                            </View>

                            {/* Expanded Details */}
                            {selectedOffer === offer.id && (
                                <View>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: Colors.text.dark.secondary,
                                            marginBottom: 8,
                                        }}
                                    >
                                        Features
                                    </Text>
                                    {offer.features.map((feature, i) => (
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
                                                    color: Colors.text.dark.secondary,
                                                }}
                                            >
                                                {feature}
                                            </Text>
                                        </View>
                                    ))}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginTop: 12,
                                            paddingTop: 12,
                                            borderTopWidth: 1,
                                            borderTopColor: Colors.dark.tertiary,
                                        }}
                                    >
                                        <Text style={{ fontSize: 13, color: Colors.text.dark.tertiary }}>
                                            Processing Fee
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 13,
                                                fontWeight: '600',
                                                color: Colors.text.dark.primary,
                                            }}
                                        >
                                            {offer.processingFee}
                                        </Text>
                                    </View>

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
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
