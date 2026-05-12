import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useSegments } from 'expo-router';
import type { ComponentProps } from 'react';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatAED } from '@/lib/refinance-calculator';

interface Application {
    id: string;
    status: string;
    monthly_savings: number;
    total_savings: number;
    new_rate: number;
    new_emi: number;
    admin_notes: string | null;
    rejection_reason: string | null;
    created_at: string;
    updated_at: string;
    user_loan: {
        id: string;
        bank_name: string | null;
        loan_type: string;
        remaining_amount: number;
        interest_rate: number;
    } | null;
    bank_product: {
        id: string;
        name: string;
        bank: {
            name: string;
            is_islamic: boolean;
        } | null;
    } | null;
}

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type RelatedOne<T> = T | T[] | null;
type ApplicationRow = Omit<Application, 'user_loan' | 'bank_product'> & {
    user_loan: RelatedOne<NonNullable<Application['user_loan']>>;
    bank_product: RelatedOne<NonNullable<Application['bank_product']>>;
};

function unwrapRelated<T>(value: RelatedOne<T>): T | null {
    if (Array.isArray(value)) return value[0] ?? null;
    return value;
}

function normalizeApplication(row: ApplicationRow): Application {
    return {
        ...row,
        user_loan: unwrapRelated(row.user_loan),
        bank_product: unwrapRelated(row.bank_product),
    };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: IoniconName; bg: string }> = {
    submitted: {
        label: 'Submitted',
        color: '#3B82F6',
        icon: 'paper-plane',
        bg: '#3B82F620',
    },
    under_review: {
        label: 'Under Review',
        color: '#F59E0B',
        icon: 'time',
        bg: '#F59E0B20',
    },
    documents_required: {
        label: 'Docs Required',
        color: '#F97316',
        icon: 'document-text',
        bg: '#F9731620',
    },
    approved: {
        label: 'Approved',
        color: '#10B981',
        icon: 'checkmark-circle',
        bg: '#10B98120',
    },
    rejected: {
        label: 'Rejected',
        color: '#EF4444',
        icon: 'close-circle',
        bg: '#EF444420',
    },
};

export default function MyApplicationsScreen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();
    const { user } = useAuth();
    const segments = useSegments();
    const showBackButton = segments[0] !== '(tabs)';

    const fetchApplications = useCallback(async () => {
        if (!user) {
            setLoading(false);
            setRefreshing(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('refinance_applications')
                .select(`
                    id, status, monthly_savings, total_savings, new_rate, new_emi,
                    admin_notes, rejection_reason, created_at, updated_at,
                    user_loan:user_loans!refinance_applications_user_loan_id_fkey (
                        id, bank_name, loan_type, remaining_amount, interest_rate
                    ),
                    bank_product:bank_products!refinance_applications_bank_product_id_fkey (
                        id, name,
                        bank:banks!bank_products_bank_id_fkey (name, is_islamic)
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            const rows = (data || []) as unknown as ApplicationRow[];
            setApplications(rows.map(normalizeApplication));
        } catch {
            setApplications([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchApplications();
        }, [fetchApplications])
    );

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />

            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                )}
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary }}>
                        Applications
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                        Track your refinance applications
                    </Text>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 20 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchApplications();
                        }}
                        tintColor={Colors.brand.emerald}
                    />
                }
            >
                {applications.length === 0 ? (
                    <View style={{ paddingVertical: 60, alignItems: 'center' }}>
                        <View
                            style={{
                                width: 72,
                                height: 72,
                                borderRadius: 36,
                                backgroundColor: `${Colors.brand.emerald}15`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 16,
                            }}
                        >
                            <Ionicons name="documents-outline" size={36} color={Colors.brand.emerald} />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.textPrimary }}>
                            No Applications Yet
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8, maxWidth: 280 }}>
                            Compare refinance offers and apply to start saving on your loans
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(tabs)/offers')}
                            style={{ marginTop: 24 }}
                        >
                            <LinearGradient
                                colors={['#011819', '#0A2525']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    paddingHorizontal: 28,
                                    paddingVertical: 14,
                                    borderRadius: BorderRadius.md,
                                }}
                            >
                                <Text style={{ fontSize: 15, fontWeight: '600', color: '#fff' }}>
                                    Browse Offers
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ) : (
                    applications.map((app) => {
                        const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                        const bankName = app.bank_product?.bank?.name || 'Bank';
                        const loanBank = app.user_loan?.bank_name || 'Your';
                        const loanType = app.user_loan?.loan_type || 'loan';

                        return (
                            <View
                                key={app.id}
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.lg,
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Status Header */}
                                <View
                                    style={{
                                        backgroundColor: statusConfig.bg,
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Ionicons name={statusConfig.icon} size={16} color={statusConfig.color} />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: statusConfig.color }}>
                                            {statusConfig.label}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                        {formatDate(app.created_at)}
                                    </Text>
                                </View>

                                {/* Body */}
                                <View style={{ padding: 16 }}>
                                    {/* From / To */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                                                Current Loan
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }} numberOfLines={1}>
                                                {loanBank} {loanType}
                                            </Text>
                                        </View>
                                        <View style={{ paddingHorizontal: 8 }}>
                                            <Ionicons name="arrow-forward" size={18} color={Colors.brand.emerald} />
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>
                                                New Offer
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }} numberOfLines={1}>
                                                {bankName}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Savings Row */}
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: `${Colors.brand.emerald}08`,
                                            borderRadius: BorderRadius.md,
                                            padding: 12,
                                            gap: 8,
                                        }}
                                    >
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>
                                                Monthly Savings
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.brand.emerald }}>
                                                {formatAED(app.monthly_savings)}
                                            </Text>
                                        </View>
                                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>
                                                New Rate
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary }}>
                                                {app.new_rate}%
                                            </Text>
                                        </View>
                                        <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                                        <View style={{ flex: 1, alignItems: 'center' }}>
                                            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>
                                                Total Savings
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.brand.emerald }}>
                                                {formatAED(app.total_savings)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Admin notes / rejection */}
                                    {app.status === 'rejected' && app.rejection_reason && (
                                        <View
                                            style={{
                                                backgroundColor: '#EF444410',
                                                borderRadius: BorderRadius.sm,
                                                padding: 12,
                                                marginTop: 12,
                                                flexDirection: 'row',
                                                gap: 8,
                                            }}
                                        >
                                            <Ionicons name="information-circle" size={16} color="#EF4444" style={{ marginTop: 1 }} />
                                            <Text style={{ fontSize: 13, color: '#EF4444', flex: 1 }}>
                                                {app.rejection_reason}
                                            </Text>
                                        </View>
                                    )}

                                    {app.status === 'documents_required' && app.admin_notes && (
                                        <View
                                            style={{
                                                backgroundColor: '#F9731610',
                                                borderRadius: BorderRadius.sm,
                                                padding: 12,
                                                marginTop: 12,
                                                flexDirection: 'row',
                                                gap: 8,
                                            }}
                                        >
                                            <Ionicons name="document-text" size={16} color="#F97316" style={{ marginTop: 1 }} />
                                            <Text style={{ fontSize: 13, color: '#F97316', flex: 1 }}>
                                                {app.admin_notes}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Timeline */}
                                    <View style={{ marginTop: 16 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: statusConfig.color }} />
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                Last updated {formatDate(app.updated_at)} at {formatTime(app.updated_at)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
