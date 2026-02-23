import React from 'react';
import { View, Text, ScrollView, TextInput, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { ApplicationData } from '@/hooks/useApplyOffer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    theme: any;
    formData: ApplicationData;
    setFormData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export function OptionalRichDataStep({
    theme,
    formData,
    setFormData,
}: Props) {
    return (
        <ScrollView
            style={{ width: SCREEN_WIDTH }}
            contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                Boost Your Application
            </Text>
            <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                Optional — but dramatically improves your approval odds
            </Text>

            {/* Why Card */}
            <View style={{
                backgroundColor: Colors.info + '10',
                borderRadius: BorderRadius.lg,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: Colors.info + '20',
                flexDirection: 'row',
                gap: 12,
            }}>
                <Ionicons name="bulb-outline" size={22} color={Colors.info} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 4 }}>
                        Why provide this?
                    </Text>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, lineHeight: 19 }}>
                        Institutions process pre-qualified applications{' '}
                        <Text style={{ fontWeight: '700', color: Colors.brand.emerald }}>3x faster</Text>
                        . Providing salary and employer info lets them make instant pre-approval decisions.
                    </Text>
                </View>
            </View>

            {/* Salary */}
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                Monthly Salary (AED)
            </Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
                marginBottom: 6,
            }}>
                <Text style={{ ...Typography.body, color: theme.colors.textTertiary, marginRight: 8 }}>
                    AED
                </Text>
                <TextInput
                    value={formData.salary}
                    onChangeText={t => setFormData(p => ({ ...p, salary: t.replace(/[^0-9]/g, '') }))}
                    placeholder="e.g. 15000"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="numeric"
                    style={{
                        flex: 1,
                        height: 52,
                        ...Typography.body,
                        color: theme.colors.textPrimary,
                    }}
                />
            </View>
            <Text style={{
                ...Typography.caption,
                color: theme.colors.textTertiary,
                marginBottom: 20,
                fontStyle: 'italic',
            }}>
                Helps the institution calculate your eligibility instantly
            </Text>

            {/* Employer */}
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                Employer Name
            </Text>
            <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
                marginBottom: 6,
            }}>
                <TextInput
                    value={formData.employer}
                    onChangeText={t => setFormData(p => ({ ...p, employer: t }))}
                    placeholder="e.g. Emirates Airlines"
                    placeholderTextColor={theme.colors.textTertiary}
                    style={{
                        height: 52,
                        ...Typography.body,
                        color: theme.colors.textPrimary,
                    }}
                />
            </View>
            <Text style={{
                ...Typography.caption,
                color: theme.colors.textTertiary,
                marginBottom: 20,
                fontStyle: 'italic',
            }}>
                Institutions verify employment to fast-track applications
            </Text>

            {/* Skip Info */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 12,
            }}>
                <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.textTertiary} />
                <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                    All data is encrypted and only shared with the financial institution you apply to
                </Text>
            </View>
        </ScrollView>
    );
}
