import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Modal,
    ScrollView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useDashboardData } from '@/hooks/useDashboardData';

/**
 * Auto-calculated OLFi Score based on real user data.
 * Score formula: starts at 850, deducted by DTI severity and total debt load.
 */
function calculateOlfiScore(
    totalDebt: number,
    totalEmi: number,
    dtiRatio: number | null,
): { score: number; label: 'excellent' | 'good' | 'fair' | 'poor'; color: string } {
    if (totalDebt === 0) {
        return { score: 0, label: 'good', color: Colors.brand.emerald };
    }

    let score = 850;

    // DTI penalty (0-200 pts)
    const dti = dtiRatio ?? 50; // assume 50% if unknown
    if (dti > 60) score -= 200;
    else if (dti > 45) score -= 130;
    else if (dti > 35) score -= 80;
    else if (dti > 25) score -= 40;

    // Debt load penalty (0-150 pts)
    if (totalDebt > 500000) score -= 150;
    else if (totalDebt > 200000) score -= 100;
    else if (totalDebt > 100000) score -= 60;
    else if (totalDebt > 50000) score -= 30;

    // EMI burden penalty (0-100 pts)
    if (totalEmi > 15000) score -= 100;
    else if (totalEmi > 8000) score -= 60;
    else if (totalEmi > 4000) score -= 30;

    score = Math.max(300, Math.min(850, score));

    let label: 'excellent' | 'good' | 'fair' | 'poor';
    let color: string;
    if (score >= 750) { label = 'excellent'; color = Colors.brand.emerald; }
    else if (score >= 650) { label = 'good'; color = '#22C55E'; }
    else if (score >= 550) { label = 'fair'; color = Colors.warning; }
    else { label = 'poor'; color = Colors.error; }

    return { score, label, color };
}

// ── OLFi Score Explanation Modal ────────────────────────────────────────────
function OlfiExplainModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const { theme } = useTheme();
    const { t } = useLanguage();

    const bands = [
        {
            label: t('scoreCard.explainExcellent'),
            desc: t('scoreCard.explainExcellentDesc'),
            color: Colors.brand.emerald,
            icon: 'trophy' as const,
        },
        {
            label: t('scoreCard.explainGood'),
            desc: t('scoreCard.explainGoodDesc'),
            color: '#22C55E',
            icon: 'checkmark-circle' as const,
        },
        {
            label: t('scoreCard.explainFair'),
            desc: t('scoreCard.explainFairDesc'),
            color: Colors.warning,
            icon: 'alert-circle' as const,
        },
        {
            label: t('scoreCard.explainPoor'),
            desc: t('scoreCard.explainPoorDesc'),
            color: Colors.error,
            icon: 'warning' as const,
        },
    ];

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={explainStyles.overlay}>
                <View style={[explainStyles.sheet, { backgroundColor: theme.colors.bg }]}>
                    {/* Handle */}
                    <View style={[explainStyles.handle, { backgroundColor: theme.colors.border }]} />

                    {/* Header */}
                    <View style={explainStyles.header}>
                        <Text style={[explainStyles.title, { color: theme.colors.textPrimary }]}>
                            {t('scoreCard.explainTitle')}
                        </Text>
                        <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {bands.map((band) => (
                            <View key={band.label} style={[explainStyles.bandRow, { borderColor: theme.colors.border }]}>
                                <View style={[explainStyles.bandIcon, { backgroundColor: `${band.color}18` }]}>
                                    <Ionicons name={band.icon} size={20} color={band.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[explainStyles.bandLabel, { color: band.color }]}>
                                        {band.label}
                                    </Text>
                                    <Text style={[explainStyles.bandDesc, { color: theme.colors.textSecondary }]}>
                                        {band.desc}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* Formula note */}
                        <View style={[explainStyles.formulaBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Ionicons name="information-circle-outline" size={16} color={Colors.brand.emerald} style={{ marginRight: 8, marginTop: 1 }} />
                            <Text style={[explainStyles.formulaText, { color: theme.colors.textSecondary }]}>
                                {t('scoreCard.explainFormula')}
                            </Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

// ── AECB States ──────────────────────────────────────────────────────────────
type AecbStatus = 'locked' | 'pending' | 'available';

function AecbContent({ onFlip }: { onFlip: () => void }) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    // In a real app this would come from the user's profile / Supabase
    const [aecbStatus, setAecbStatus] = useState<AecbStatus>('locked');

    const brandGreen = Colors.brand.emerald;
    const borderColor = theme.colors.border;

    const handleRequest = () => {
        Alert.alert(
            t('scoreCard.aecbUnlock'),
            t('scoreCard.aecbUnlockDesc'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('scoreCard.aecbUnlock'),
                    onPress: () => setAecbStatus('pending'),
                },
            ],
        );
    };

    return (
        <View style={styles.scoreContent} pointerEvents="box-none">
            {/* Header row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }} pointerEvents="box-none">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="shield-checkmark" size={18} color={brandGreen} />
                    <Text style={{ ...Typography.captionBold, color: theme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        {t('scoreCard.aecbCreditScore')}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={onFlip}
                    style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${brandGreen}18`, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="sync" size={16} color={brandGreen} />
                </TouchableOpacity>
            </View>

            {/* Center content based on state */}
            {aecbStatus === 'available' ? (
                /* Score revealed */
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} pointerEvents="box-none">
                    <View style={[styles.scoreCircle, { borderColor: brandGreen, backgroundColor: `${brandGreen}10` }]}>
                        <Text style={{ fontSize: 36, fontWeight: '800', color: theme.colors.textPrimary }}>685</Text>
                        <Text style={{ fontSize: 13, color: brandGreen, fontWeight: '700', marginTop: -4 }}>
                            {t('scoreCard.good')}
                        </Text>
                    </View>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginTop: Spacing.md }}>
                        {t('scoreCard.updatedLastMonth')} • {t('scoreCard.tapToFlip')}
                    </Text>
                </View>
            ) : aecbStatus === 'pending' ? (
                /* Pending state */
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} pointerEvents="box-none">
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${Colors.warning}15`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md }}>
                        <Ionicons name="time-outline" size={28} color={Colors.warning} />
                    </View>
                    <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.xs, textAlign: 'center' }}>
                        {t('scoreCard.aecbPending')}
                    </Text>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', paddingHorizontal: Spacing.lg }}>
                        {t('scoreCard.aecbPendingDesc')}
                    </Text>
                </View>
            ) : (
                /* Locked state */
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }} pointerEvents="box-none">
                    <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: `${brandGreen}15`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md }}>
                        <Ionicons name="lock-closed" size={28} color={brandGreen} />
                    </View>
                    <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.xs, textAlign: 'center' }}>
                        {t('scoreCard.aecbLocked')}
                    </Text>
                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg, paddingHorizontal: Spacing.md }}>
                        {t('scoreCard.aecbLockedDesc')}
                    </Text>
                    <TouchableOpacity
                        onPress={handleRequest}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: brandGreen,
                            borderRadius: 24,
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                        }}
                    >
                        <Ionicons name="document-text-outline" size={16} color="#fff" />
                        <Text style={{ ...Typography.captionBold, color: '#fff' }}>
                            {t('scoreCard.aecbUnlock')}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ScoreFlipCard() {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [isFlipped, setIsFlipped] = useState(false);
    const [showExplain, setShowExplain] = useState(false);
    const { totalDebt, totalEmi, dtiRatio, activeLoans } = useDashboardData();

    const hasDebts = activeLoans.length > 0;
    const olfiData = calculateOlfiScore(totalDebt, totalEmi, dtiRatio);

    // Dynamic footer text based on score label
    const footerTextKey = hasDebts
        ? (`scoreCard.${olfiData.label}Footer` as any)
        : null;
    const footerText = footerTextKey ? t(footerTextKey) : '';

    const flipCard = () => {
        if (isFlipped) {
            Animated.spring(animatedValue, { toValue: 0, friction: 8, tension: 10, useNativeDriver: true }).start();
        } else {
            Animated.spring(animatedValue, { toValue: 180, friction: 8, tension: 10, useNativeDriver: true }).start();
        }
        setIsFlipped(!isFlipped);
    };

    const frontInterpolate = animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['0deg', '180deg'] });
    const backInterpolate = animatedValue.interpolate({ inputRange: [0, 180], outputRange: ['180deg', '360deg'] });

    const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
    const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.cardContainer}>
                    {/* Front Side: OLFi Score */}
                    <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        {/* Background Pressable to catch empty space taps */}
                        <TouchableOpacity activeOpacity={1} style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]} onPress={flipCard} />
                        <View style={[styles.touchableArea, { pointerEvents: 'box-none', zIndex: 1 }]}>
                            {hasDebts ? (
                                <View style={styles.scoreContent} pointerEvents="box-none">
                                    {/* Header row */}
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }} pointerEvents="box-none">
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Ionicons name="bar-chart" size={18} color={theme.colors.textPrimary} />
                                            <Text style={{ ...Typography.captionBold, color: theme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                                {t('scoreCard.olfiScore')}
                                            </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 8, zIndex: 10 }}>
                                            {/* Info icon to explain score */}
                                            <TouchableOpacity
                                                onPress={() => setShowExplain(true)}
                                                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${Colors.brand.emerald}18`, alignItems: 'center', justifyContent: 'center' }}
                                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                            >
                                                <Ionicons name="information-circle-outline" size={18} color={Colors.brand.emerald} />
                                            </TouchableOpacity>
                                            {/* Flip icon */}
                                            <TouchableOpacity
                                                onPress={flipCard}
                                                style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${olfiData.color}18`, alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                <Ionicons name="sync" size={16} color={olfiData.color} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Score circle — always dark bg to avoid light-on-light */}
                                    <View style={{ alignItems: 'center', marginVertical: Spacing.xs }} pointerEvents="box-none">
                                        <View style={[styles.scoreCircle, { borderColor: olfiData.color, backgroundColor: `${olfiData.color}12` }]}>
                                            <Text style={{ fontSize: 36, fontWeight: '800', color: theme.colors.textPrimary }}>
                                                {olfiData.score}
                                            </Text>
                                            <Text style={{ fontSize: 13, color: olfiData.color, fontWeight: '700', marginTop: -4 }}>
                                                {t(`scoreCard.${olfiData.label}`)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Dynamic bottom footer based on current score label */}
                                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm }}>
                                        {footerText} {hasDebts ? `• ${t('scoreCard.tapToFlip')}` : ''}
                                    </Text>
                                </View>
                            ) : (
                                <View style={[styles.scoreContent, { justifyContent: 'center', alignItems: 'center' }]} pointerEvents="box-none">
                                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${Colors.brand.emerald}15`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md }}>
                                        <Ionicons name="lock-closed" size={20} color={Colors.brand.emerald} />
                                    </View>
                                    <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.xs }}>
                                        {t('scoreCard.unlockTitle')}
                                    </Text>
                                    <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg, paddingHorizontal: Spacing.lg }}>
                                        {t('scoreCard.unlockDesc')}
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => router.push('/add-loan' as any)}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={theme.gradients.brand}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.actionBtn}
                                        >
                                            <Text style={styles.actionBtnText}>{t('scoreCard.calculateScore')}</Text>
                                            <Ionicons name="arrow-forward" size={16} color="#fff" />
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </Animated.View>

                    {/* Back Side: AECB Score — on-brand, themed */}
                    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        <TouchableOpacity activeOpacity={1} style={[StyleSheet.absoluteFillObject, { zIndex: 0 }]} onPress={flipCard} />
                        <View style={[styles.touchableArea, { pointerEvents: 'box-none', zIndex: 1 }]}>
                            <AecbContent onFlip={flipCard} />
                        </View>
                    </Animated.View>
                </View>
            </View>

            {/* OLFi Score Explanation Modal */}
            <OlfiExplainModal visible={showExplain} onClose={() => setShowExplain(false)} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    cardContainer: {
        width: '100%',
        height: 240,
    },
    card: {
        width: '100%',
        height: '100%',
        borderRadius: BorderRadius.xl,
        borderWidth: 1,
        position: 'absolute',
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardBack: {
        // background set inline via theme
    },
    touchableArea: {
        flex: 1,
        padding: Spacing.xl,
    },
    scoreContent: {
        flex: 1,
    },
    scoreCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    actionBtnText: {
        ...Typography.bodyBold,
        color: '#fff',
    },
});

const explainStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: Spacing.xl,
        paddingBottom: 40,
        paddingTop: Spacing.md,
        maxHeight: '85%',
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        ...Typography.h2,
        flex: 1,
    },
    bandRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
    },
    bandIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    bandLabel: {
        ...Typography.bodyBold,
        marginBottom: 4,
    },
    bandDesc: {
        ...Typography.caption,
        lineHeight: 18,
    },
    formulaBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: BorderRadius.md,
        padding: Spacing.lg,
        marginTop: Spacing.xl,
        borderWidth: 1,
    },
    formulaText: {
        ...Typography.caption,
        flex: 1,
        lineHeight: 18,
    },
});
