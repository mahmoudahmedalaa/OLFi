import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { formatAED } from '@/lib/refinance-calculator';
import { ApplicationData, CALLBACK_TIMES } from '@/hooks/useApplyOffer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function ReviewRow({
    label, value, theme, icon, highlight = false, isLast = false,
}: {
    label: string; value: string; theme: any; icon: string;
    highlight?: boolean; isLast?: boolean;
}) {
    if (!label && !value) return null;
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.colors.border,
        }}>
            <Ionicons name={icon as any} size={18} color={highlight ? Colors.brand.emerald : theme.colors.textTertiary} style={{ marginRight: 12 }} />
            <Text style={{
                ...Typography.caption,
                color: theme.colors.textSecondary,
                flex: 1,
            }}>
                {label}
            </Text>
            <Text style={{
                ...Typography.bodyBold,
                color: highlight ? Colors.brand.emerald : theme.colors.textPrimary,
            }}>
                {value}
            </Text>
        </View>
    );
}

interface Props {
    theme: any;
    user: any;
    params: {
        bankName?: string;
        productName?: string;
        newRate?: string;
        processingFee?: string;
    };
    selectedTenure: number;
    dynamicMonthlySavings: number;
    dynamicGrossTotalSavings: number;
    dynamicTotalSavings: number;
    formData: ApplicationData;
    setFormData: React.Dispatch<React.SetStateAction<ApplicationData>>;
}

export function ReviewSubmitStep({
    theme,
    user,
    params,
    selectedTenure,
    dynamicMonthlySavings,
    dynamicGrossTotalSavings,
    dynamicTotalSavings,
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
                Review & Submit
            </Text>
            <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                Check your details before submitting
            </Text>

            {/* Review Card */}
            <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                overflow: 'hidden',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}>
                <LinearGradient
                    colors={[Colors.brand.emerald + '15', 'transparent']}
                    style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
                >
                    <Text style={{ ...Typography.captionBold, color: Colors.brand.emerald, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Application Summary
                    </Text>
                </LinearGradient>

                <ReviewRow label="Institution" value={params.bankName || ''} theme={theme} icon="business-outline" />
                <ReviewRow label="Product" value={params.productName || ''} theme={theme} icon="card-outline" />
                <ReviewRow label="New Rate" value={`${params.newRate || '0'}%`} theme={theme} icon="trending-down-outline" />
                <ReviewRow label="Target Tenure" value={`${selectedTenure} months`} theme={theme} icon="calendar-outline" />
                <ReviewRow label="Monthly Savings" value={formatAED(dynamicMonthlySavings)} theme={theme} icon="cash-outline" highlight />
                <ReviewRow label="Gross Savings" value={formatAED(dynamicGrossTotalSavings)} theme={theme} icon="wallet-outline" />
                <ReviewRow label="Processing Fee" value={`- ${formatAED(parseFloat(params.processingFee || '0'))}`} theme={theme} icon="calculator-outline" />
                <ReviewRow label="Net Savings" value={formatAED(dynamicTotalSavings)} theme={theme} icon="trophy-outline" highlight isLast />
            </View>

            {/* Contact Details Card */}
            <View style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                overflow: 'hidden',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}>
                <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                    <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Your Details
                    </Text>
                </View>

                <ReviewRow label="Email" value={user?.email || ''} theme={theme} icon="mail-outline" />
                <ReviewRow label="Phone" value={`+971 ${formData.phone}`} theme={theme} icon="call-outline" />
                {formData.callbackTime ? (
                    <ReviewRow label="Callback" value={CALLBACK_TIMES.find(c => c.key === formData.callbackTime)?.label || ''} theme={theme} icon="time-outline" />
                ) : null}
                {formData.salary ? (
                    <ReviewRow label="Salary" value={`AED ${parseInt(formData.salary).toLocaleString()}`} theme={theme} icon="cash-outline" />
                ) : null}
                {formData.employer ? (
                    <ReviewRow label="Employer" value={formData.employer} theme={theme} icon="briefcase-outline" isLast />
                ) : (
                    <ReviewRow label="" value="" theme={theme} icon="" isLast />
                )}
            </View>

            {/* Consent */}
            <TouchableOpacity
                onPress={() => setFormData(p => ({ ...p, consent: !p.consent }))}
                activeOpacity={0.7}
                style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: 16,
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    borderWidth: 1,
                    borderColor: formData.consent ? Colors.brand.emerald + '40' : theme.colors.border,
                }}
            >
                <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: formData.consent ? Colors.brand.emerald : theme.colors.border,
                    backgroundColor: formData.consent ? Colors.brand.emerald : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 1,
                }}>
                    {formData.consent && (
                        <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                </View>
                <Text style={{
                    flex: 1,
                    ...Typography.caption,
                    color: theme.colors.textSecondary,
                    lineHeight: 20,
                }}>
                    I agree to share my contact details with{' '}
                    <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                        {params.bankName}
                    </Text>
                    {' '}for the purpose of processing my refinance application. I have read and accept the{' '}
                    <Text style={{ color: Colors.brand.emerald, fontWeight: '600' }}>
                        Terms & Conditions
                    </Text>
                    {' '}and{' '}
                    <Text style={{ color: Colors.brand.emerald, fontWeight: '600' }}>
                        Privacy Policy
                    </Text>.
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
