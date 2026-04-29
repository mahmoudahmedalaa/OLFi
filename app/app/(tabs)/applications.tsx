import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    LayoutAnimation,
    UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ApplicationStatus = 'pending_review' | 'bank_processing' | 'approved' | 'offer_accepted' | 'funds_disbursed';

interface Communication {
    id: string;
    sender: 'olfi_team' | 'bank' | 'system';
    message: string;
    timestamp: string;
}

interface Application {
    id: string;
    bankName: string;
    amount: number;
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
    communications: Communication[];
}

const MOCK_APPLICATIONS: Application[] = [
    {
        id: 'APP-8924',
        bankName: 'Abu Dhabi Islamic Bank (ADIB)',
        amount: 250000,
        status: 'bank_processing',
        createdAt: '2023-10-15T09:00:00Z',
        updatedAt: '2023-10-16T14:30:00Z',
        communications: [
            {
                id: 'msg1',
                sender: 'system',
                message: 'Application submitted successfully. Our team is reviewing your documents.',
                timestamp: 'Oct 15, 09:00 AM',
            },
            {
                id: 'msg2',
                sender: 'olfi_team',
                message: 'All documents verified! We have forwarded your application to ADIB.',
                timestamp: 'Oct 15, 11:45 AM',
            },
            {
                id: 'msg3',
                sender: 'bank',
                message: 'Application received. We are currently processing your request.',
                timestamp: 'Oct 16, 02:30 PM',
            }
        ],
    },
    {
        id: 'APP-6112',
        bankName: 'Dubai Islamic Bank (DIB)',
        amount: 120000,
        status: 'approved',
        createdAt: '2023-10-10T10:15:00Z',
        updatedAt: '2023-10-14T09:00:00Z',
        communications: [
            {
                id: 'msg4',
                sender: 'system',
                message: 'Application submitted successfully.',
                timestamp: 'Oct 10, 10:15 AM',
            },
            {
                id: 'msg5',
                sender: 'bank',
                message: 'Initial screening passed. Final credit approval pending.',
                timestamp: 'Oct 11, 01:20 PM',
            },
            {
                id: 'msg6',
                sender: 'bank',
                message: 'Congratulations! Your refinancing application has been approved. Please review the final offer document.',
                timestamp: 'Oct 14, 09:00 AM',
            }
        ],
    }
];

const STATUS_STAGES = [
    { key: 'pending_review', label: 'Pending Review' },
    { key: 'bank_processing', label: 'Bank Processing' },
    { key: 'approved', label: 'Approved' },
    { key: 'offer_accepted', label: 'Offer Accepted' },
    { key: 'funds_disbursed', label: 'Funds Disbursed' },
];

export default function ApplicationsScreen() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const getStatusIndex = (status: string) => {
        return STATUS_STAGES.findIndex(s => s.key === status);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.bg }]} edges={['top']}>
            <View style={[styles.header, { backgroundColor: theme.colors.bg }]}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>
                        Track your progress
                    </Text>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        Applications
                    </Text>
                </View>
            </View>

            <Animated.ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                entering={FadeInUp.duration(600).springify()}
            >
                {MOCK_APPLICATIONS.map((app) => {
                    const isExpanded = expandedId === app.id;
                    const currentIndex = getStatusIndex(app.status);

                    return (
                        <TouchableOpacity
                            key={app.id}
                            activeOpacity={0.9}
                            onPress={() => toggleExpand(app.id)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: isExpanded ? Colors.brand.emerald : theme.colors.border,
                                }
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.appId, { color: theme.colors.textTertiary }]}>{app.id}</Text>
                                    <Text style={[styles.bankName, { color: theme.colors.textPrimary }]}>{app.bankName}</Text>
                                    <Text style={[styles.amount, { color: Colors.brand.emerald }]}>
                                        {t('common.aed')} {app.amount.toLocaleString()}
                                    </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <View style={[styles.statusBadge, { backgroundColor: `${Colors.brand.emerald}15` }]}>
                                        <Text style={[styles.statusText, { color: Colors.brand.emerald }]}>
                                            {STATUS_STAGES[currentIndex].label}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={20}
                                        color={theme.colors.textTertiary}
                                        style={{ marginTop: 8 }}
                                    />
                                </View>
                            </View>

                            {isExpanded && (
                                <View style={[styles.expandedContent, { borderTopColor: theme.colors.border }]}>

                                    {/* Timeline */}
                                    <View style={styles.timelineContainer}>
                                        {STATUS_STAGES.map((stage, idx) => {
                                            const isActive = idx <= currentIndex;
                                            const isCurrent = idx === currentIndex;
                                            return (
                                                <View key={stage.key} style={styles.timelineStep}>
                                                    <View style={[
                                                        styles.timelineDot,
                                                        { backgroundColor: isActive ? Colors.brand.emerald : theme.colors.border },
                                                        isCurrent && { transform: [{ scale: 1.2 }], borderWidth: 2, borderColor: '#fff' }
                                                    ]} />
                                                    {idx < STATUS_STAGES.length - 1 && (
                                                        <View style={[
                                                            styles.timelineLine,
                                                            { backgroundColor: isActive ? Colors.brand.emerald : theme.colors.border }
                                                        ]} />
                                                    )}
                                                    <Text style={[
                                                        styles.timelineLabel,
                                                        { color: isActive ? theme.colors.textPrimary : theme.colors.textTertiary },
                                                        isCurrent && { fontWeight: '700' }
                                                    ]}>
                                                        {stage.label}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                    </View>

                                    {/* Communication Logs */}
                                    <Text style={[styles.commTitle, { color: theme.colors.textPrimary }]}>Updates & Messages</Text>
                                    <View style={styles.commContainer}>
                                        {app.communications.map((comm) => (
                                            <View key={comm.id} style={styles.commBubbleWrapper}>
                                                <View style={[
                                                    styles.commBubble,
                                                    { backgroundColor: theme.colors.bg },
                                                    comm.sender === 'olfi_team' && { borderLeftColor: Colors.brand.emerald, borderLeftWidth: 3 },
                                                    comm.sender === 'bank' && { borderLeftColor: Colors.brand.blue, borderLeftWidth: 3 },
                                                ]}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                                                        <Text style={[styles.commSender, { color: theme.colors.textSecondary }]}>
                                                            {comm.sender === 'olfi_team' ? 'OLFi Support' : comm.sender === 'bank' ? app.bankName : 'System'}
                                                        </Text>
                                                        <Text style={[styles.commTime, { color: theme.colors.textTertiary }]}>{comm.timestamp}</Text>
                                                    </View>
                                                    <Text style={[styles.commMessage, { color: theme.colors.textPrimary }]}>{comm.message}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingTop: Platform.OS === 'android' ? Spacing.xl : 10,
        paddingBottom: Spacing.xl,
    },
    greeting: {
        ...Typography.body,
        fontWeight: '500',
        marginBottom: Spacing.xs,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    scrollView: { flex: 1 },
    scrollContent: { padding: Spacing.xl, paddingBottom: 120 },
    card: {
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-between',
    },
    appId: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
    bankName: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    amount: { fontSize: 14, fontWeight: '600' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.sm,
    },
    statusText: { fontSize: 12, fontWeight: '700' },
    expandedContent: {
        padding: 20,
        paddingTop: 0,
        borderTopWidth: 1,
    },
    timelineContainer: {
        marginTop: 20,
        marginBottom: 30,
        paddingLeft: 10,
    },
    timelineStep: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        height: 24,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 16,
        zIndex: 2,
    },
    timelineLine: {
        position: 'absolute',
        top: 24, // below the dot
        left: 5,
        width: 2,
        height: 24,
        zIndex: 1,
    },
    timelineLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    commTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    commContainer: {
        gap: 12,
    },
    commBubbleWrapper: {},
    commBubble: {
        padding: 12,
        borderRadius: BorderRadius.md,
    },
    commSender: { fontSize: 12, fontWeight: '600' },
    commTime: { fontSize: 11 },
    commMessage: { fontSize: 14, marginTop: 4, lineHeight: 20 },
});
