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
                    applications.map((app) => {
                        const statusConfig = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                        const bankName = app.bank_product?.bank?.name || 'Bank';
                        const loanBank = app.user_loan?.bank_name || 'Your';
                        const loanType = app.user_loan?.loan_type || 'loan';
                        const progressIndex = STATUS_PROGRESS[app.status] ?? 0;
                        const bankMessage = getBankMessage(app.status, bankName, app.admin_notes, app.rejection_reason);
                        const needsDocuments = app.status === 'documents_required';
                        const latestDocument = app.documents[0];

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

                                    {/* Bank message */}
                                    <View
                                        style={{
                                            backgroundColor: app.status === 'rejected' ? '#EF444410' : needsDocuments ? '#F9731610' : `${Colors.brand.emerald}08`,
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
                                            {bankMessage}
                                        </Text>
                                    </View>

                                    {/* Document request */}
                                    <View
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
                                                width: 38,
                                                height: 38,
                                                borderRadius: 19,
                                                backgroundColor: needsDocuments ? '#F9731620' : `${Colors.brand.emerald}15`,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Ionicons name="folder-open" size={18} color={needsDocuments ? '#F97316' : Colors.brand.emerald} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary }}>
                                                {app.documents.length > 0 ? `${app.documents.length} document${app.documents.length === 1 ? '' : 's'} uploaded` : 'Documents'}
                                            </Text>
                                            <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 2 }} numberOfLines={1}>
                                                {latestDocument ? `${formatDocumentType(latestDocument.document_type)} • ${latestDocument.status}` : needsDocuments ? 'Upload requested files for this bank.' : 'No files requested yet.'}
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => router.push({
                                                pathname: '/application-documents' as any,
                                                params: { applicationId: app.id, bankName },
                                            })}
                                            style={{
                                                paddingHorizontal: 12,
                                                paddingVertical: 8,
                                                borderRadius: BorderRadius.sm,
                                                backgroundColor: needsDocuments ? '#F97316' : `${Colors.brand.emerald}20`,
                                            }}
                                        >
                                            <Text style={{ fontSize: 12, fontWeight: '700', color: needsDocuments ? '#fff' : Colors.brand.emerald }}>
                                                {app.documents.length > 0 ? 'View' : 'Upload'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Timeline */}
                                    <View style={{ marginTop: 16 }}>
                                        {TIMELINE_STEPS.map((step, index) => {
                                            const isRejectedDecision = app.status === 'rejected' && step.key === 'approved';
                                            const isComplete = index < progressIndex || app.status === 'approved';
                                            const isActive = index === progressIndex && app.status !== 'approved';
                                            const dotColor = isRejectedDecision ? Colors.error : isComplete ? Colors.brand.emerald : isActive ? statusConfig.color : theme.colors.border;
                                            return (
                                                <View key={step.key} style={{ flexDirection: 'row', gap: 10 }}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <View
                                                            style={{
                                                                width: 18,
                                                                height: 18,
                                                                borderRadius: 9,
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
                                                            <View style={{ width: 1, height: 24, backgroundColor: index < progressIndex ? `${Colors.brand.emerald}80` : theme.colors.border }} />
                                                        )}
                                                    </View>
                                                    <View style={{ flex: 1, paddingBottom: index < TIMELINE_STEPS.length - 1 ? 10 : 0 }}>
                                                        <Text style={{ fontSize: 12, fontWeight: '700', color: isActive || isComplete || isRejectedDecision ? theme.colors.textPrimary : theme.colors.textTertiary }}>
                                                            {isRejectedDecision ? 'Decision posted' : step.label}
                                                        </Text>
                                                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 1 }}>
                                                            {isRejectedDecision ? 'Bank could not proceed with this application.' : step.description}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
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
