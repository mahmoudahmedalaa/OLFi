import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert,
    RefreshControl,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import { debtLockedMessage, getActiveDebtApplication } from '@/lib/debt-lifecycle';
import CircularProgress from '@/components/ui/CircularProgress';
import Skeleton from '@/components/ui/Skeleton';
import GlassHeader from '@/components/ui/GlassHeader';
import { BlurView } from 'expo-blur';

type LoanStatus = 'active' | 'completed' | 'defaulted' | 'refinanced';

interface UserLoan {
    id: string;
    bank_name: string | null;
    loan_type: string;
    original_amount: number;
    remaining_amount: number;
    interest_rate: number;
    monthly_emi: number;
    start_date: string;
    end_date: string | null;
    status: LoanStatus;
}

// Filter labels are resolved dynamically in the component via t()

export default function LoansScreen() {
    const [activeFilter, setActiveFilter] = useState<'all' | LoanStatus>('all');
    const [loans, setLoans] = useState<UserLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();
    const { user } = useAuth();
    const { t } = useLanguage();

    const fetchLoans = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('user_loans')
                .select('id, bank_name, loan_type, original_amount, remaining_amount, interest_rate, monthly_emi, start_date, end_date, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setLoans(data || []);
        } catch (e) {
            console.error('Failed to fetch loans:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchLoans();
        }, [fetchLoans])
    );

    const handleDelete = async (loan: UserLoan) => {
        if (!user) return;
        try {
            const activeApplication = await getActiveDebtApplication(loan.id, user.id);
            if (activeApplication) {
                Alert.alert('Debt used in application', debtLockedMessage(activeApplication.status));
                return;
            }
        } catch (e) {
            console.error('Failed to check debt application status:', e);
            Alert.alert('Could not verify debt status', 'Please try again before deleting this debt.');
            return;
        }

        Alert.alert(
            t('debts.deleteTitle'),
            `${t('debts.deleteMessage')} "${loan.bank_name || 'Unknown'} - ${formatType(loan.loan_type)}"?`,
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('common.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase
                                .from('user_loans')
                                .delete()
                                .eq('id', loan.id)
                                .eq('user_id', user.id);
                            if (error) throw error;
                            setLoans((prev) => prev.filter((l) => l.id !== loan.id));
                        } catch (e: any) {
                            Alert.alert('Error', e.message);
                        }
                    },
                },
            ]
        );
    };

    const filteredLoans =
        activeFilter === 'all'
            ? loans
            : loans.filter((l) => l.status === activeFilter);

    const activeLoans = loans.filter((l) => l.status === 'active');
    const totalDebt = activeLoans.reduce((sum, l) => sum + l.remaining_amount, 0);
    const totalEmi = activeLoans.reduce((sum, l) => sum + l.monthly_emi, 0);
    const originalDebt = activeLoans.reduce((sum, l) => sum + l.original_amount, 0);
    const repaymentProgress = originalDebt > 0 ? Math.round((1 - totalDebt / originalDebt) * 100) : 0;
    const highestRateLoan = activeLoans.reduce<UserLoan | null>(
        (highest, loan) => (!highest || loan.interest_rate > highest.interest_rate ? loan : highest),
        null
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Glass Header */}
            <GlassHeader
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        ...Typography.h1,
                        color: theme.colors.textPrimary,
                    }}
                >
                    {t('debts.title')}
                </Text>
            </GlassHeader>

            {/* Summary strip */}
            {!loading && activeLoans.length > 0 && (
                <View
                    style={{
                        gap: Spacing.md,
                        marginTop: Spacing.lg,
                        marginBottom: Spacing.lg,
                        marginHorizontal: Spacing.xl,
                        paddingVertical: Spacing.md,
                        paddingHorizontal: Spacing.lg,
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                    }}
                >
                    <View style={{ flexDirection: 'row', gap: Spacing.md }}>
                        <SummaryMetric label="Outstanding" value={`AED ${totalDebt.toLocaleString()}`} />
                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                        <SummaryMetric label="Monthly" value={`AED ${totalEmi.toLocaleString()}`} />
                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                        <SummaryMetric label="Repaid" value={`${repaymentProgress}%`} />
                    </View>
                    {highestRateLoan && (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => router.push('/(tabs)/offers')}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 8,
                                backgroundColor: `${Colors.brand.emerald}10`,
                                borderRadius: BorderRadius.sm,
                                padding: 10,
                            }}
                        >
                            <Ionicons name="trending-down" size={16} color={Colors.brand.emerald} />
                            <Text style={{ flex: 1, fontSize: 12, lineHeight: 17, color: theme.colors.textSecondary }}>
                                Highest rate: <Text style={{ fontWeight: '700', color: theme.colors.textPrimary }}>{highestRateLoan.bank_name || 'Loan'}</Text> at {highestRateLoan.interest_rate}%. Compare offers to lower it.
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.brand.emerald} />
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Filter Pills */}
            <View style={{ paddingHorizontal: Spacing.xl, marginTop: Spacing.lg, marginBottom: Spacing.lg }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: Spacing.sm }}
                >
                    {([{ key: 'all' as const, label: t('common.all') }, { key: 'active' as const, label: t('common.active') }, { key: 'completed' as const, label: t('common.completed') }]).map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            onPress={() => setActiveFilter(filter.key)}
                            style={{
                                paddingHorizontal: Spacing.lg,
                                paddingVertical: Spacing.sm,
                                borderRadius: 20,
                                backgroundColor:
                                    activeFilter === filter.key
                                        ? Colors.brand.emerald
                                        : theme.colors.card,
                                borderWidth: activeFilter === filter.key ? 0 : 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Text
                                style={{
                                    ...Typography.captionBold,
                                    color:
                                        activeFilter === filter.key
                                            ? '#fff'
                                            : theme.colors.textSecondary,
                                }}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Loan List */}
            {
                loading ? (
                    <View style={{ paddingHorizontal: 20 }}>
                        {[1, 2, 3].map((i) => (
                            <View key={i} style={{ backgroundColor: theme.colors.card, borderRadius: BorderRadius.lg, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <View>
                                        <Skeleton width={120} height={20} style={{ marginBottom: 6 }} />
                                        <Skeleton width={80} height={14} />
                                    </View>
                                    <Skeleton width={60} height={24} borderRadius={8} />
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <View>
                                        <Skeleton width={60} height={12} style={{ marginBottom: 6 }} />
                                        <Skeleton width={90} height={20} />
                                    </View>
                                    <View style={{ alignItems: 'flex-end' }}>
                                        <Skeleton width={60} height={12} style={{ marginBottom: 6 }} />
                                        <Skeleton width={70} height={20} />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
                                    <Skeleton width={48} height={48} borderRadius={24} />
                                    <View style={{ flex: 1 }}>
                                        <Skeleton width="40%" height={16} style={{ marginBottom: 6 }} />
                                        <Skeleton width="60%" height={14} />
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ) : (
                    <FlatList
                        data={filteredLoans}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 120,
                            flexGrow: 1,
                        }}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={() => {
                                    setRefreshing(true);
                                    fetchLoans();
                                }}
                                tintColor={Colors.brand.emerald}
                            />
                        }
                        ListEmptyComponent={
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                                <Ionicons name="wallet-outline" size={48} color={theme.colors.textTertiary} />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: theme.colors.textPrimary,
                                        marginTop: 16,
                                    }}
                                >
                                    {activeFilter === 'all'
                                        ? t('debts.noDebts')
                                        : t('debts.noFiltered')}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.textSecondary,
                                        marginTop: 4,
                                        textAlign: 'center',
                                    }}
                                >
                                    {activeFilter === 'all' ? t('debts.noDebtsDesc') : t('debts.tryFilter')}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => {
                            const progress =
                                item.original_amount > 0
                                    ? 1 - item.remaining_amount / item.original_amount
                                    : 0;
                            return (
                                <View
                                    style={{
                                        backgroundColor: theme.colors.card,
                                        borderRadius: BorderRadius.lg,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{ padding: 20 }}
                                        activeOpacity={0.8}
                                        onPress={() => router.push({ pathname: '/edit-loan' as any, params: { loanId: item.id } })}
                                    >
                                        {/* Header row */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-start',
                                                marginBottom: 16,
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: '600',
                                                        color: theme.colors.textPrimary,
                                                    }}
                                                >
                                                    {item.bank_name || 'Unknown Bank'}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 13,
                                                        color: theme.colors.textTertiary,
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    {formatType(item.loan_type)} • {item.interest_rate}%
                                                </Text>
                                            </View>
                                            <StatusBadge status={item.status} />
                                        </View>

                                        {/* Details */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                marginBottom: 16,
                                            }}
                                        >
                                            <View>
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        color: theme.colors.textTertiary,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    {t('debts.balance')}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: '600',
                                                        color: theme.colors.textPrimary,
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    AED {item.remaining_amount.toLocaleString()}
                                                </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text
                                                    style={{
                                                        fontSize: 11,
                                                        color: theme.colors.textTertiary,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    {t('debts.monthly')}
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: 17,
                                                        fontWeight: '600',
                                                        color: theme.colors.textPrimary,
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    AED {item.monthly_emi.toLocaleString()}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Progress */}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 16 }}>
                                            <CircularProgress
                                                progress={progress}
                                                size={48}
                                                strokeWidth={5}
                                                color={item.status === 'completed' ? Colors.success : Colors.brand.emerald}
                                            />
                                            <View style={{ flex: 1 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>
                                                        {Math.round(progress * 100)}%
                                                    </Text>
                                                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                                        of AED {item.original_amount.toLocaleString()}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                        {item.start_date?.substring(0, 7) || '-'}
                                                    </Text>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                        {item.end_date?.substring(0, 7) || '-'}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    {/* Action bar */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            borderTopWidth: 1,
                                            borderTopColor: theme.colors.border,
                                        }}
                                    >
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 }}
                                            onPress={() => router.push({ pathname: '/edit-loan' as any, params: { loanId: item.id } })}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="create-outline" size={16} color={Colors.brand.emerald} />
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>{t('common.edit')}</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 }}
                                            onPress={() => handleDelete(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="trash-outline" size={16} color={Colors.error} />
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.error }}>{t('common.delete')}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        }}
                    />
                )
            }

            {/* Floating Action Button */}
            <View style={{
                position: 'absolute',
                bottom: Platform.OS === 'ios' ? 110 : 80,
                right: 20,
                borderRadius: 28,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
            }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.push('/add-loan' as any)}
                >
                    {Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={80}
                            tint={theme.isDark ? "dark" : "light"}
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.2)',
                                backgroundColor: 'rgba(16, 185, 129, 0.4)', // tint with brand color
                            }}
                        >
                            <Ionicons name="add" size={32} color={theme.isDark ? '#fff' : Colors.brand.emerald} />
                        </BlurView>
                    ) : (
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: Colors.brand.emerald,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Ionicons name="add" size={32} color="#fff" />
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        </View >
    );
}

function formatType(type: string) {
    return type.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1 }}>
            <Text
                style={{
                    ...Typography.overline,
                    color: theme.colors.textTertiary,
                    textTransform: 'uppercase',
                }}
                numberOfLines={1}
            >
                {label}
            </Text>
            <Text
                style={{
                    fontSize: 15,
                    fontWeight: '800',
                    color: theme.colors.textPrimary,
                    marginTop: Spacing.xs,
                }}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.78}
            >
                {value}
            </Text>
        </View>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string; color: string }> = {
        active: { label: 'ACTIVE', color: Colors.brand.emerald },
        completed: { label: 'PAID OFF', color: Colors.success },
        defaulted: { label: 'DEFAULT', color: Colors.error },
        refinanced: { label: 'REFINANCED', color: Colors.info },
    };
    const c = config[status] || { label: status.toUpperCase(), color: Colors.warning };
    return (
        <View
            style={{
                backgroundColor: `${c.color}15`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
            }}
        >
            <Text style={{ fontSize: 11, fontWeight: '600', color: c.color }}>
                {c.label}
            </Text>
        </View>
    );
}
