import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatAED, estimateRemainingMonths } from '@/lib/refinance-calculator';
import CircularProgress from '@/components/ui/CircularProgress';
import Skeleton from '@/components/ui/Skeleton';
import { TermTooltip } from '@/components/ui/TermTooltip';

interface LoanDetail {
    id: string;
    bank_name: string | null;
    loan_type: string;
    original_amount: number;
    remaining_amount: number;
    interest_rate: number;
    monthly_emi: number;
    tenure_months: number;
    status: string;
    start_date: string | null;
    created_at: string;
    updated_at: string | null;
}

const LOAN_TYPE_ICONS: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    personal: { icon: 'person', color: '#8B5CF6' },
    auto: { icon: 'car', color: '#3B82F6' },
};

export default function LoanDetailScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams<{ loanId: string }>();
    const [loan, setLoan] = useState<LoanDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLoan = useCallback(async () => {
        if (!user || !params.loanId) return;
        try {
            const { data, error } = await supabase
                .from('user_loans')
                .select('*')
                .eq('id', params.loanId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            setLoan(data);
        } catch (e) {
            console.error('Error fetching loan:', e);
            Alert.alert('Error', 'Could not load loan details.');
            router.back();
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, params.loanId]);

    useFocusEffect(
        useCallback(() => {
            fetchLoan();
        }, [fetchLoan])
    );

    const handleDelete = () => {
        Alert.alert(
            'Delete Financing',
            'Are you sure you want to delete this financing? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('user_loans')
                                .delete()
                                .eq('id', params.loanId)
                                .eq('user_id', user?.id);
                            if (error) throw error;
                            router.back();
                        } catch (e: any) {
                            Alert.alert('Error', e.message || 'Failed to delete financing.');
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
                <View style={{ padding: 20 }}>
                    <Skeleton height={200} borderRadius={16} style={{ marginBottom: 20 }} />
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                        <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
                        <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                        <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
                        <Skeleton height={80} style={{ flex: 1 }} borderRadius={12} />
                    </View>
                    <Skeleton height={200} borderRadius={12} />
                    <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 32, textAlign: 'center', letterSpacing: 0.3 }}>Fetching facility details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!loan) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textSecondary }}>Financing not found</Text>
            </SafeAreaView>
        );
    }

    const progress = loan.original_amount > 0
        ? 1 - loan.remaining_amount / loan.original_amount
        : 0;
    const paidAmount = loan.original_amount - loan.remaining_amount;
    const totalInterest = (loan.monthly_emi * loan.tenure_months) - loan.original_amount;
    const remainingMonths = estimateRemainingMonths(
        loan.remaining_amount,
        loan.monthly_emi,
        loan.interest_rate,
    );
    const typeInfo = LOAN_TYPE_ICONS[loan.loan_type] || LOAN_TYPE_ICONS.other;
    const formatType = (t: string) => t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 12,
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary }}>
                    Financing Details
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/edit-loan' as any, params: { loanId: loan.id } })}
                        style={{ padding: 4 }}
                    >
                        <Ionicons name="create-outline" size={22} color={Colors.brand.emerald} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleDelete} style={{ padding: 4 }}>
                        <Ionicons name="trash-outline" size={22} color={Colors.error} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchLoan(); }}
                        tintColor={Colors.brand.emerald}
                    />
                }
            >
                {/* Loan Type & Bank Card */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <LinearGradient
                        colors={theme.gradients.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: BorderRadius.xl,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 14,
                                backgroundColor: `${typeInfo.color}20`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14,
                            }}>
                                <Ionicons name={typeInfo.icon} size={24} color={typeInfo.color} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary }}>
                                    {loan.bank_name || 'Unknown Bank'}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2, flexWrap: 'wrap' }}>
                                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                                        {formatType(loan.loan_type)} Finance •
                                    </Text>
                                    <TermTooltip
                                        term="Profit Rate"
                                        definition="The annual profit rate on your Islamic finance facility. It is the agreed cost of financing, not compound interest."
                                        labelStyle={{ fontSize: 14, color: theme.colors.textSecondary }}
                                    />
                                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                                        {loan.interest_rate}%
                                    </Text>
                                </View>
                            </View>
                            <View style={{
                                backgroundColor: loan.status === 'active' ? `${Colors.brand.emerald}15` : `${Colors.warning}15`,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 8,
                            }}>
                                <Text style={{
                                    fontSize: 11,
                                    fontWeight: '600',
                                    color: loan.status === 'active' ? Colors.brand.emerald : Colors.warning,
                                    textTransform: 'uppercase',
                                }}>
                                    {loan.status}
                                </Text>
                            </View>
                        </View>

                        {/* Main amount display & Progress */}
                        <View style={{ alignItems: 'center', marginBottom: 16, flexDirection: 'row', justifyContent: 'center', gap: 24 }}>
                            <CircularProgress
                                progress={progress}
                                size={96}
                                strokeWidth={8}
                                color={Colors.brand.emerald}
                            />
                            <View>
                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                    Remaining Balance
                                </Text>
                                <Text style={{ fontSize: 28, fontWeight: '800', color: theme.colors.textPrimary, marginTop: 4 }}>
                                    {formatAED(loan.remaining_amount)}
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
                                    of {formatAED(loan.original_amount)} total
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Grid */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <StatCard
                            icon="cash-outline"
                            label="Monthly EMI"
                            tooltip="Equated Monthly Instalment - your fixed monthly repayment covering both the original amount and the profit portion of your facility."
                            value={formatAED(loan.monthly_emi)}
                            color="#011819"
                            theme={theme}
                        />
                        <StatCard
                            icon="calendar-outline"
                            label="Remaining"
                            value={`${remainingMonths} months`}
                            color="#3B82F6"
                            theme={theme}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                        <StatCard
                            icon="trending-up-outline"
                            label="Profit Rate"
                            tooltip="The annual profit rate agreed with your lender. Refinancing to a lower rate with OLFi can meaningfully reduce your total repayment."
                            value={`${loan.interest_rate}%`}
                            color="#F59E0B"
                            theme={theme}
                        />
                        <StatCard
                            icon="wallet-outline"
                            label="Total Paid"
                            value={formatAED(paidAmount)}
                            color="#8B5CF6"
                            theme={theme}
                        />
                    </View>
                </View>

                {/* Loan Details Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: theme.colors.textPrimary,
                        marginBottom: 12,
                    }}>
                        Financing Breakdown
                    </Text>
                    <View style={{
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.lg,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        overflow: 'hidden',
                    }}>
                        <DetailRow label="Original Amount" value={formatAED(loan.original_amount)} theme={theme} />
                        <DetailRow label="Amount Paid" value={formatAED(paidAmount)} theme={theme} />
                        <DetailRow label="Remaining Balance" value={formatAED(loan.remaining_amount)} theme={theme} />
                        <DetailRow label="Total Profit" value={totalInterest > 0 ? formatAED(totalInterest) : '-'} theme={theme} />
                        <DetailRow label="Tenure" value={`${loan.tenure_months} months`} theme={theme} />
                        <DetailRow label="Added" value={new Date(loan.created_at).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })} theme={theme} last />
                    </View>
                </View>

                {/* Refinance CTA */}
                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/offers')}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={theme.gradients.brand}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.lg,
                                padding: 20,
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 14,
                            }}>
                                <Ionicons name="swap-horizontal" size={22} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                                    Find Better Rates
                                </Text>
                                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                                    Compare transfer offers for this facility
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Sub-components ──────────────────────────────────────────────────

function StatCard({
    icon,
    label,
    value,
    color,
    theme,
    tooltip,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    color: string;
    theme: any;
    tooltip?: string;
}) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: theme.colors.card,
            borderRadius: BorderRadius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
        }}>
            <View style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: `${color}15`,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
            }}>
                <Ionicons name={icon} size={16} color={color} />
            </View>
            {tooltip ? (
                <TermTooltip
                    term={label}
                    definition={tooltip}
                    labelStyle={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5 }}
                />
            ) : (
                <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                </Text>
            )}
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 2 }}>
                {value}
            </Text>
        </View>
    );
}

function DetailRow({
    label,
    value,
    theme,
    last,
}: {
    label: string;
    value: string;
    theme: any;
    last?: boolean;
}) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderBottomWidth: last ? 0 : 1,
            borderBottomColor: theme.colors.border,
        }}>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
                {label}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
                {value}
            </Text>
        </View>
    );
}
