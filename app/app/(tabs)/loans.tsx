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
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
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

const filters: { key: 'all' | LoanStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
];

export default function LoansScreen() {
    const [activeFilter, setActiveFilter] = useState<'all' | LoanStatus>('all');
    const [loans, setLoans] = useState<UserLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();
    const { user } = useAuth();

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

    const handleDelete = (loan: UserLoan) => {
        Alert.alert(
            'Delete Loan',
            `Remove "${loan.bank_name || 'Unknown'} - ${formatType(loan.loan_type)}"?`,
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
                                .eq('id', loan.id);
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
                        fontSize: 24,
                        fontWeight: '700',
                        color: theme.colors.textPrimary,
                    }}
                >
                    My Loans
                </Text>
            </GlassHeader>

            {/* Summary strip */}
            {!loading && activeLoans.length > 0 && (
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 24,
                        marginTop: 16,
                        marginBottom: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
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
                            Total Debt
                        </Text>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: theme.colors.textPrimary,
                                marginTop: 4,
                            }}
                        >
                            AED {totalDebt.toLocaleString()}
                        </Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 11,
                                color: theme.colors.textTertiary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Monthly EMIs
                        </Text>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: theme.colors.textPrimary,
                                marginTop: 4,
                            }}
                        >
                            AED {totalEmi.toLocaleString()}
                        </Text>
                    </View>
                </View>
            )}

            {/* Filter Pills */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            onPress={() => setActiveFilter(filter.key)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
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
                                    fontSize: 13,
                                    fontWeight: '600',
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
                            paddingBottom: 100,
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
                                    {activeFilter === 'all' ? 'No loans yet' : `No ${activeFilter} loans`}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.textSecondary,
                                        marginTop: 4,
                                        textAlign: 'center',
                                    }}
                                >
                                    {activeFilter === 'all' ? 'Tap + to add your first loan' : 'Try changing the filter'}
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
                                                    {formatType(item.loan_type)} • {item.interest_rate}% Profit Rate
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
                                                    Remaining
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
                                                    Monthly EMI
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
                                                        {Math.round(progress * 100)}% Repaid
                                                    </Text>
                                                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                                        of AED {item.original_amount.toLocaleString()}
                                                    </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                        {item.start_date?.substring(0, 7) || '—'}
                                                    </Text>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                        {item.end_date?.substring(0, 7) || '—'}
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
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>Edit</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                                        <TouchableOpacity
                                            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 }}
                                            onPress={() => handleDelete(item)}
                                            activeOpacity={0.7}
                                        >
                                            <Ionicons name="trash-outline" size={16} color={Colors.error} />
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.error }}>Delete</Text>
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
