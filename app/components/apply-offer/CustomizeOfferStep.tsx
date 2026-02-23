import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { TenureSlider } from '@/components/ui/tenure-slider';
import { formatAED } from '@/lib/refinance-calculator';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    theme: any;
    dynamicEmi: number;
    dynamicMonthlySavings: number;
    dynamicGrossTotalSavings: number;
    dynamicTotalSavings: number;
    processingFee: string;
    selectedTenure: number;
    setSelectedTenure: (val: number) => void;
    maxTenureMonths: string;
}

export function CustomizeOfferStep({
    theme,
    dynamicEmi,
    dynamicMonthlySavings,
    dynamicGrossTotalSavings,
    dynamicTotalSavings,
    processingFee,
    selectedTenure,
    setSelectedTenure,
    maxTenureMonths,
}: Props) {
    return (
        <ScrollView
            style={{ width: SCREEN_WIDTH }}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                Customize Your Plan
            </Text>
            <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                Adjust the tenure to find the perfect monthly payment for you.
            </Text>

            <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 24,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: Colors.brand.emerald + '40',
                alignItems: 'center',
            }}>
                <Text style={{ ...Typography.captionBold, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                    New Monthly EMI
                </Text>
                <Text style={{ fontSize: 48, fontWeight: '800', color: Colors.brand.emerald, letterSpacing: -1 }}>
                    {formatAED(Math.round(dynamicEmi))}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 24, paddingTop: 24, paddingBottom: 16, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>{formatAED(Math.round(dynamicMonthlySavings))}</Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textTertiary, marginTop: 4 }}>/mo savings</Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                    <View style={{ alignItems: 'center', flex: 1 }}>
                        <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>{formatAED(Math.round(dynamicGrossTotalSavings))}</Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textTertiary, marginTop: 4 }}>Gross savings</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.bg, borderRadius: BorderRadius.md }}>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>Net Savings (After {formatAED(parseFloat(processingFee || '0'))} Fee)</Text>
                    <Text style={{ ...Typography.captionBold, color: Colors.brand.emerald }}>{formatAED(Math.round(dynamicTotalSavings))}</Text>
                </View>
            </View>

            <TenureSlider
                tenure={selectedTenure}
                onTenureChange={setSelectedTenure}
                maxTenureMonths={maxTenureMonths ? parseInt(maxTenureMonths) : 48}
            />
        </ScrollView>
    );
}
