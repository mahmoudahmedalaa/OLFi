import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { formatAED } from '@/lib/refinance-calculator';

interface Props {
    theme: any;
    router: any;
    params: {
        bankName?: string;
        processingFee?: string;
    };
    formData: {
        callbackTime: string;
    };
    successAnim: Animated.Value;
    checkmarkScale: Animated.Value;
    dynamicMonthlySavings: number;
    dynamicGrossTotalSavings: number;
    dynamicTotalSavings: number;
}

export function SuccessScreen({
    theme,
    router,
    params,
    formData,
    successAnim,
    checkmarkScale,
    dynamicMonthlySavings,
    dynamicGrossTotalSavings,
    dynamicTotalSavings,
}: Props) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <Animated.View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 32,
                opacity: successAnim,
                transform: [{ scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
            }}>
                <Animated.View style={{
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: Colors.brand.emerald + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24,
                    transform: [{ scale: checkmarkScale }],
                }}>
                    <Ionicons name="checkmark-circle" size={64} color={Colors.brand.emerald} />
                </Animated.View>

                <Text style={{
                    ...Typography.h1,
                    color: theme.colors.textPrimary,
                    textAlign: 'center',
                    marginBottom: 8,
                }}>
                    Application Submitted!
                </Text>

                <Text style={{
                    ...Typography.body,
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                    marginBottom: 32,
                    lineHeight: 24,
                }}>
                    Your refinance application for{' '}
                    <Text style={{ fontWeight: '600', color: Colors.brand.emerald }}>
                        {params.bankName}
                    </Text>
                    {' '}has been submitted. We'll review it and get back to you
                    {formData.callbackTime ? ` in the ${formData.callbackTime}` : ' shortly'}.
                </Text>

                {/* Savings Summary */}
                <View style={{
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    padding: 20,
                    width: '100%',
                    marginBottom: 32,
                    borderWidth: 1,
                    borderColor: Colors.brand.emerald + '30',
                }}>
                    <Text style={{
                        ...Typography.caption,
                        color: Colors.brand.emerald,
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        marginBottom: 12,
                    }}>
                        Projected Savings
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                        <View>
                            <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                                {formatAED(dynamicMonthlySavings)}
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                per month
                            </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                                {formatAED(dynamicGrossTotalSavings)}
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                gross savings
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                        <View>
                            <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                                Processing Fee
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                                (Deducted)
                            </Text>
                        </View>
                        <Text style={{ ...Typography.bodyBold, color: Colors.error }}>
                            - {formatAED(parseFloat(params.processingFee || '0'))}
                        </Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                            Net Savings
                        </Text>
                        <Text style={{ ...Typography.h2, color: Colors.brand.emerald }}>
                            {formatAED(dynamicTotalSavings)}
                        </Text>
                    </View>
                </View>

                {/* Action Buttons */}
                <TouchableOpacity
                    onPress={() => router.replace('/my-applications' as any)}
                    activeOpacity={0.8}
                    style={{ width: '100%', marginBottom: 12 }}
                >
                    <LinearGradient
                        colors={[Colors.brand.emerald, Colors.brand.emeraldDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: BorderRadius.md,
                            height: 52,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                        }}
                    >
                        <Ionicons name="documents-outline" size={18} color="#fff" />
                        <Text style={{ ...Typography.bodyBold, color: '#fff' }}>
                            View My Applications
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{
                        width: '100%',
                        height: 52,
                        borderRadius: BorderRadius.md,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <Text style={{ ...Typography.bodyBold, color: theme.colors.textSecondary }}>
                        Back to Offer
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
}
