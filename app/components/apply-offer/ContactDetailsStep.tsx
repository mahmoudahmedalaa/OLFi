import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { formatAED } from '@/lib/refinance-calculator';
import { hapticSelection } from '@/lib/haptics';
import { ApplicationData, CALLBACK_TIMES } from '@/hooks/useApplyOffer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    theme: any;
    user: any;
    params: {
        bankName?: string;
        productName?: string;
        monthlySavings?: string;
    };
    edgeOfferData: any;
    formData: ApplicationData;
    setFormData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export function ContactDetailsStep({
    theme,
    user,
    params,
    edgeOfferData,
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
                Contact Details
            </Text>
            <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                How should the financial institution reach you?
            </Text>

            {/* Apply Summary Card */}
            <View style={{
                backgroundColor: Colors.brand.emerald + '10',
                borderRadius: BorderRadius.lg,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: Colors.brand.emerald + '20',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
            }}>
                <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.brand.emerald + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Ionicons name="business-outline" size={20} color={Colors.brand.emerald} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                        {params.bankName}
                    </Text>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                        {params.productName} · Save {formatAED(edgeOfferData?.monthly_savings || parseFloat(params.monthlySavings || '0'))}/mo
                    </Text>
                </View>
            </View>

            {/* Phone */}
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                Phone Number *
            </Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: formData.phone.length >= 9 ? Colors.brand.emerald + '40' : theme.colors.border,
                paddingHorizontal: 14,
                marginBottom: 20,
            }}>
                <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginRight: 8 }}>
                    +971
                </Text>
                <View style={{ width: 1, height: 24, backgroundColor: theme.colors.border, marginRight: 8 }} />
                <TextInput
                    value={formData.phone}
                    onChangeText={t => setFormData(p => ({ ...p, phone: t.replace(/[^0-9]/g, '') }))}
                    placeholder="50 123 4567"
                    placeholderTextColor={theme.colors.textTertiary}
                    keyboardType="phone-pad"
                    maxLength={10}
                    style={{
                        flex: 1,
                        height: 52,
                        ...Typography.body,
                        color: theme.colors.textPrimary,
                    }}
                />
                {formData.phone.length >= 9 && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.brand.emerald} />
                )}
            </View>

            {/* Callback Time */}
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                Preferred Callback Time
            </Text>
            <View style={{ gap: 8, marginBottom: 20 }}>
                {CALLBACK_TIMES.map(ct => (
                    <TouchableOpacity
                        key={ct.key}
                        onPress={() => { hapticSelection(); setFormData(p => ({ ...p, callbackTime: ct.key })); }}
                        activeOpacity={0.7}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            padding: 14,
                            backgroundColor: formData.callbackTime === ct.key
                                ? Colors.brand.emerald + '10'
                                : theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: formData.callbackTime === ct.key
                                ? Colors.brand.emerald + '40'
                                : theme.colors.border,
                        }}
                    >
                        <Ionicons
                            name={ct.icon as any}
                            size={22}
                            color={formData.callbackTime === ct.key
                                ? Colors.brand.emerald
                                : theme.colors.textTertiary}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                ...Typography.bodyBold,
                                color: formData.callbackTime === ct.key
                                    ? Colors.brand.emerald
                                    : theme.colors.textPrimary,
                            }}>
                                {ct.label}
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                {ct.sublabel}
                            </Text>
                        </View>
                        <View style={{
                            width: 22,
                            height: 22,
                            borderRadius: 11,
                            borderWidth: 2,
                            borderColor: formData.callbackTime === ct.key
                                ? Colors.brand.emerald
                                : theme.colors.border,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {formData.callbackTime === ct.key && (
                                <View style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: 6,
                                    backgroundColor: Colors.brand.emerald,
                                }} />
                            )}
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Email (pre-filled, read-only) */}
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                Email
            </Text>
            <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
                height: 52,
                justifyContent: 'center',
                opacity: 0.7,
            }}>
                <Text style={{ ...Typography.body, color: theme.colors.textSecondary }}>
                    {user?.email || 'Not available'}
                </Text>
            </View>
        </ScrollView>
    );
}
