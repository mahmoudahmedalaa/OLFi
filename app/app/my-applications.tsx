import React, { useState, useCallback, useMemo } from 'react';
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
    documents: ApplicationDocument[];
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

interface ApplicationDocument {
    id: string;
    application_id: string | null;
    document_type: string;
    file_name: string | null;
    status: string;
    created_at: string;
}

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type ApplicationFilter = 'all' | 'action_needed' | 'reviewing' | 'completed';
type RelatedOne<T> = T | T[] | null;
type ApplicationRow = Omit<Application, 'user_loan' | 'bank_product' | 'documents'> & {
    user_loan: RelatedOne<NonNullable<Application['user_loan']>>;
    bank_product: RelatedOne<NonNullable<Application['bank_product']>>;
};

function unwrapRelated<T>(value: RelatedOne<T>): T | null {
    if (Array.isArray(value)) return value[0] ?? null;
    return value;
}

function normalizeApplication(row: ApplicationRow, documents: ApplicationDocument[] = []): Application {
    return {
        ...row,
        documents,
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

const TIMELINE_STEPS = [
    { key: 'submitted', label: 'Submitted', description: 'Application received by OLFi.' },
    { key: 'under_review', label: 'Review', description: 'Bank eligibility checks are in progress.' },
    { key: 'documents_required', label: 'Documents', description: 'Supporting documents may be requested.' },
    { key: 'approved', label: 'Decision', description: 'Final bank decision is posted here.' },
] as const;

const STATUS_PROGRESS: Record<string, number> = {
    submitted: 0,
    under_review: 1,
    documents_required: 2,
    approved: 3,
    rejected: 3,
};

const FILTERS: { key: ApplicationFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'action_needed', label: 'Action' },
    { key: 'reviewing', label: 'Reviewing' },
    { key: 'completed', label: 'Done' },
];

function getBankMessage(status: string, bankName: string, adminNotes: string | null, rejectionReason: string | null) {
    if (status === 'documents_required') {
        return adminNotes || `${bankName} needs supporting documents before continuing the review. Upload them here and OLFi will keep the application moving.`;
    }
    if (status === 'under_review') {
        return adminNotes || `${bankName} is reviewing your refinance profile. We will update this tracker as soon as the bank responds.`;
    }
    if (status === 'approved') {
        return adminNotes || `${bankName} has approved this offer. OLFi will help coordinate the next steps.`;
    }
    if (status === 'rejected') {
        return rejectionReason || `${bankName} could not proceed with this application. You can compare other offers from the offers tab.`;
    }
    return adminNotes || `OLFi has submitted your details to ${bankName}. The next update will appear here.`;
}

function formatDocumentType(type: string) {
    return type
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function MyApplicationsScreen() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [activeFilter, setActiveFilter] = useState<ApplicationFilter>('all');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { theme } = useTheme();
    const { user } = useAuth();
    const segments = useSegments();
    const showBackButton = segments[0] !== '(tabs)';

    const applicationStats = useMemo(() => {
        const actionNeeded = applications.filter((app) => app.status === 'documents_required').length;
        const reviewing = applications.filter((app) => app.status === 'submitted' || app.status === 'under_review').length;
        const completed = applications.filter((app) => app.status === 'approved' || app.status === 'rejected').length;
        return {
            all: applications.length,
            action_needed: actionNeeded,
            reviewing,
            completed,
        };
    }, [applications]);

    const visibleApplications = useMemo(() => {
        if (activeFilter === 'action_needed') {
            return applications.filter((app) => app.status === 'documents_required');
        }
        if (activeFilter === 'reviewing') {
            return applications.filter((app) => app.status === 'submitted' || app.status === 'under_review');
        }
        if (activeFilter === 'completed') {
            return applications.filter((app) => app.status === 'approved' || app.status === 'rejected');
        }
        return applications;
    }, [activeFilter, applications]);

    const summaryCopy = useMemo(() => {
        if (applicationStats.action_needed > 0) {
            return `${applicationStats.action_needed} application${applicationStats.action_needed === 1 ? '' : 's'} need documents`;
        }
        if (applicationStats.reviewing > 0) {
            return `${applicationStats.reviewing} application${applicationStats.reviewing === 1 ? '' : 's'} under review`;
        }
        if (applicationStats.completed > 0) {
            return 'All applications are up to date';
        }
        return 'Apply for an offer to start tracking progress';
    }, [applicationStats]);

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
            const applicationIds = rows.map((row) => row.id);
            let documentsByApplication = new Map<string, ApplicationDocument[]>();

            if (applicationIds.length > 0) {
                const { data: documentRows, error: documentsError } = await supabase
                    .from('user_documents')
                    .select('id, application_id, document_type, file_name, status, created_at')
                    .eq('user_id', user.id)
                    .in('application_id', applicationIds)
                    .order('created_at', { ascending: false });

                if (!documentsError && documentRows) {
                    documentsByApplication = documentRows.reduce((map, document) => {
                        if (!document.application_id) return map;
                        const current = map.get(document.application_id) || [];
                        current.push(document as ApplicationDocument);
                        map.set(document.application_id, current);
                        return map;
                    }, new Map<string, ApplicationDocument[]>());
                }
            }

            setApplications(rows.map((row) => normalizeApplication(row, documentsByApplication.get(row.id) || [])));
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
                    <>
                        <View
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: 14,
                                marginBottom: 14,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: applicationStats.action_needed > 0 ? '#F9731620' : `${Colors.brand.emerald}18`,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Ionicons
                                        name={applicationStats.action_needed > 0 ? 'alert-circle' : 'checkmark-circle'}
                                        size={19}
                                        color={applicationStats.action_needed > 0 ? '#F97316' : Colors.brand.emerald}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary }}>
                                        {summaryCopy}
                                    </Text>
                                    <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }}>
                                        {applications.length} total • {applicationStats.reviewing} reviewing • {applicationStats.completed} done
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 8, paddingBottom: 14 }}
                        >
                            {FILTERS.map((filter) => {
                                const selected = activeFilter === filter.key;
                                return (
                                    <TouchableOpacity
                                        key={filter.key}
                                        onPress={() => setActiveFilter(filter.key)}
                                        activeOpacity={0.8}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 7,
                                            paddingHorizontal: 13,
                                            paddingVertical: 8,
                                            borderRadius: 18,
                                            backgroundColor: selected ? Colors.brand.emerald : theme.colors.card,
                                            borderWidth: 1,
                                            borderColor: selected ? Colors.brand.emerald : theme.colors.border,
                                        }}
                                    >
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: selected ? '#fff' : theme.colors.textSecondary }}>
                                            {filter.label}
                                        </Text>
                                        <View
                                            style={{
                                                minWidth: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                paddingHorizontal: 6,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: selected ? 'rgba(255,255,255,0.18)' : theme.colors.cardElevated,
                                            }}
                                        >
                                            <Text style={{ fontSize: 11, fontWeight: '700', color: selected ? '#fff' : theme.colors.textTertiary }}>
                                                {applicationStats[filter.key]}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {visibleApplications.length === 0 ? (
                            <View style={{ paddingVertical: 42, alignItems: 'center' }}>
                                <Ionicons name="file-tray-outline" size={36} color={theme.colors.textTertiary} />
                                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginTop: 12 }}>
                                    Nothing here right now
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
                                    Try another status filter.
                                </Text>
                            </View>
                        ) : visibleApplications.map((app) => {
                        const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                        const bankName = app.bank_product?.bank?.name || 'Bank';
                        const loanBank = app.user_loan?.bank_name || 'Your';
                        const loanType = app.user_loan?.loan_type || 'loan';
                        const progressIndex = STATUS_PROGRESS[app.status] ?? 0;
                        const bankMessage = getBankMessage(app.status, bankName, app.admin_notes, app.rejection_reason);
                        const needsDocuments = app.status === 'documents_required';
                        const latestDocument = app.documents[0];
                        const compactMessage = bankMessage.length > 115 ? `${bankMessage.slice(0, 112)}...` : bankMessage;

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
                                <View style={{ padding: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 7,
                                                backgroundColor: statusConfig.bg,
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                borderRadius: BorderRadius.sm,
                                            }}
                                        >
                                            <Ionicons name={statusConfig.icon} size={15} color={statusConfig.color} />
                                            <Text style={{ fontSize: 12, fontWeight: '800', color: statusConfig.color }}>
                                                {statusConfig.label}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                            Updated {formatDate(app.updated_at)}
                                        </Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginBottom: 3 }}>
                                                Current
                                            </Text>
                                            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }} numberOfLines={1}>
                                                {loanBank} {loanType}
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                width: 28,
                                                height: 28,
                                                borderRadius: 14,
                                                backgroundColor: `${Colors.brand.emerald}15`,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Ionicons name="arrow-forward" size={16} color={Colors.brand.emerald} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginBottom: 3 }}>
                                                Offer
                                            </Text>
                                            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }} numberOfLines={1}>
                                                {bankName}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            backgroundColor: `${Colors.brand.emerald}08`,
                                            borderRadius: BorderRadius.md,
                                            paddingVertical: 12,
                                            paddingHorizontal: 10,
                                            gap: 6,
                                        }}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>
                                                Save Monthly
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
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>
                                                Total Savings
                                            </Text>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: Colors.brand.emerald }}>
                                                {formatAED(app.total_savings)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            backgroundColor: needsDocuments ? '#F9731610' : theme.colors.cardElevated,
                                            borderRadius: BorderRadius.md,
                                            padding: 12,
                                            marginTop: 12,
                                            flexDirection: 'row',
                                            gap: 8,
                                        }}
                                    >
                                        <Ionicons
                                            name={app.status === 'rejected' ? 'information-circle' : needsDocuments ? 'document-text' : 'chatbubble-ellipses'}
                                            size={17}
                                            color={statusConfig.color}
                                            style={{ marginTop: 1 }}
                                        />
                                        <Text style={{ fontSize: 13, lineHeight: 19, color: theme.colors.textSecondary, flex: 1 }}>
                                            {compactMessage}
                                        </Text>
                                    </View>

                                    {(needsDocuments || app.documents.length > 0) && (
                                        <TouchableOpacity
                                            activeOpacity={0.85}
                                            onPress={() => router.push({
                                                pathname: '/application-documents' as any,
                                                params: { applicationId: app.id, bankName },
                                            })}
                                            style={{
                                                marginTop: 12,
                                                borderRadius: BorderRadius.md,
                                                borderWidth: 1,
                                                borderColor: needsDocuments ? '#F9731640' : theme.colors.border,
                                                padding: 12,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 12,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 18,
                                                    backgroundColor: needsDocuments ? '#F9731620' : `${Colors.brand.emerald}15`,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Ionicons name={needsDocuments ? 'cloud-upload-outline' : 'folder-open'} size={18} color={needsDocuments ? '#F97316' : Colors.brand.emerald} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '800', color: theme.colors.textPrimary }}>
                                                    {needsDocuments ? 'Documents requested' : `${app.documents.length} document${app.documents.length === 1 ? '' : 's'} uploaded`}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }} numberOfLines={1}>
                                                    {latestDocument ? `Latest: ${formatDocumentType(latestDocument.document_type)} is ${latestDocument.status}` : 'Upload salary proof and bank statements.'}
                                                </Text>
                                            </View>
                                            <View
                                                style={{
                                                    paddingHorizontal: 11,
                                                    paddingVertical: 7,
                                                    borderRadius: BorderRadius.sm,
                                                    backgroundColor: needsDocuments ? '#F97316' : `${Colors.brand.emerald}20`,
                                                }}
                                            >
                                                <Text style={{ fontSize: 12, fontWeight: '800', color: needsDocuments ? '#fff' : Colors.brand.emerald }}>
                                                    {needsDocuments ? 'Upload' : 'View'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}

                                    <View style={{ marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {TIMELINE_STEPS.map((step, index) => {
                                            const isRejectedDecision = app.status === 'rejected' && step.key === 'approved';
                                            const isComplete = index < progressIndex || app.status === 'approved';
                                            const isActive = index === progressIndex && app.status !== 'approved';
                                            const dotColor = isRejectedDecision ? Colors.error : isComplete ? Colors.brand.emerald : isActive ? statusConfig.color : theme.colors.border;
                                            return (
                                                <View key={step.key} style={{ flex: 1, alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                        {index > 0 && (
                                                            <View style={{ flex: 1, height: 2, backgroundColor: index <= progressIndex ? `${Colors.brand.emerald}80` : theme.colors.border }} />
                                                        )}
                                                        <View
                                                            style={{
                                                                width: 22,
                                                                height: 22,
                                                                borderRadius: 11,
                                                                backgroundColor: dotColor,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            {(isComplete || isRejectedDecision) && (
                                                                <Ionicons name={isRejectedDecision ? 'close' : 'checkmark'} size={12} color="#fff" />
                                                            )}
                                                        </View>
                                                        {index < TIMELINE_STEPS.length - 1 && (
                                                            <View style={{ flex: 1, height: 2, backgroundColor: index < progressIndex ? `${Colors.brand.emerald}80` : theme.colors.border }} />
                                                        )}
                                                    </View>
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: isActive || isComplete || isRejectedDecision ? '700' : '600',
                                                            color: isActive || isComplete || isRejectedDecision ? theme.colors.textPrimary : theme.colors.textTertiary,
                                                            marginTop: 6,
                                                        }}
                                                        numberOfLines={1}
                                                    >
                                                        {isRejectedDecision ? 'Decision' : step.label}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
                                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                                Last update {formatTime(app.updated_at)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
