import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Typography, Spacing } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Feature Configs ────────────────────────────────────────────────────────
interface FeatureSlide {
    icon: string;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
}

interface FeatureConfig {
    key: string;
    headerGradient: [string, string];
    headerIcon: string;
    headerTitle: string;
    headerSubtitle: string;
    slides: FeatureSlide[];
}

const FEATURES: Record<string, FeatureConfig> = {
    uae_pass: {
        key: 'uae_pass',
        headerGradient: ['#1E40AF', '#3B82F6'],
        headerIcon: 'finger-print-outline',
        headerTitle: 'UAE Pass',
        headerSubtitle: 'Instant Digital Identity',
        slides: [
            {
                icon: 'scan-outline',
                iconColor: '#3B82F6',
                iconBg: '#3B82F620',
                title: 'Scan Your Emirates ID',
                description: 'Point your camera at your Emirates ID. Our OCR instantly reads your name, ID number, and nationality. No typing needed.',
            },
            {
                icon: 'shield-checkmark-outline',
                iconColor: '#8B5CF6',
                iconBg: '#8B5CF620',
                title: 'Facial Verification',
                description: 'A quick selfie matches your face to your Emirates ID photo. Liveness detection ensures it\'s really you. Takes just 5 seconds.',
            },
            {
                icon: 'flash-outline',
                iconColor: '#011819',
                iconBg: '#01181920',
                title: 'Instant Identity',
                description: 'Your verified identity is securely stored. Apply to any bank with a single tap, no more uploading documents repeatedly.',
            },
        ],
    },
    aecb_sync: {
        key: 'aecb_sync',
        headerGradient: ['#0A2525', '#011819'],
        headerIcon: 'sync-outline',
        headerTitle: 'Bank Sync',
        headerSubtitle: 'Auto-Import Your Loans',
        slides: [
            {
                icon: 'link-outline',
                iconColor: '#011819',
                iconBg: '#01181920',
                title: 'Connect Your Accounts',
                description: 'Securely link your UAE bank accounts using Open Banking APIs. Your credentials are never stored. We use read-only access.',
            },
            {
                icon: 'download-outline',
                iconColor: '#3B82F6',
                iconBg: '#3B82F620',
                title: 'Auto-Import Loans',
                description: 'All your active personal loans, auto loans, and EMI commitments are automatically imported. Say goodbye to manual data entry.',
            },
            {
                icon: 'pulse-outline',
                iconColor: '#F59E0B',
                iconBg: '#F59E0B20',
                title: 'Real-Time Sync',
                description: 'Your loan balances update automatically. Get instant alerts when a better refinancing deal becomes available.',
            },
        ],
    },
    aecb_score: {
        key: 'aecb_score',
        headerGradient: ['#7C3AED', '#A855F7'],
        headerIcon: 'analytics-outline',
        headerTitle: 'Credit Score',
        headerSubtitle: 'Know Your AECB Score',
        slides: [
            {
                icon: 'speedometer-outline',
                iconColor: '#A855F7',
                iconBg: '#A855F720',
                title: 'Your Credit Score',
                description: 'Check your official AECB credit score right inside the app. Understand where you stand and what affects your score.',
            },
            {
                icon: 'document-text-outline',
                iconColor: '#3B82F6',
                iconBg: '#3B82F620',
                title: 'Full Credit Report',
                description: 'View your complete credit history: active accounts, payment history, credit utilization, and enquiries, all in one place.',
            },
            {
                icon: 'rocket-outline',
                iconColor: '#011819',
                iconBg: '#01181920',
                title: 'Instant Pre-Approval',
                description: 'With your verified score, banks can pre-approve you instantly. Know your maximum loan amount and best rate before you apply.',
            },
        ],
    },
};

// ─── Main Component ─────────────────────────────────────────────────────────
export function ComingSoonModal({
    visible,
    featureKey,
    onClose,
}: {
    visible: boolean;
    featureKey: string;
    onClose: () => void;
}) {
    const { theme } = useTheme();
    const { user } = useAuth();
    const feature = FEATURES[featureKey];
    const [currentSlide, setCurrentSlide] = useState(0);
    const [notified, setNotified] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    if (!feature) return null;

    const goToSlide = (index: number) => {
        // Fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setCurrentSlide(index);
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleNotify = async () => {
        if (!user) return;
        try {
            await supabase.from('coming_soon_notifications').upsert({
                user_id: user.id,
                feature: feature.key,
            });
            setNotified(true);
        } catch {
            // Silently fail — not critical
            setNotified(true);
        }
    };

    const handleClose = () => {
        setCurrentSlide(0);
        setNotified(false);
        fadeAnim.setValue(1);
        onClose();
    };

    const slide = feature.slides[currentSlide];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={handleClose}
        >
            <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
                {/* Header Gradient */}
                <LinearGradient
                    colors={feature.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingTop: 60,
                        paddingBottom: 40,
                        paddingHorizontal: 24,
                        alignItems: 'center',
                    }}
                >
                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={handleClose}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}
                    >
                        <View style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Ionicons name="close" size={18} color="#fff" />
                        </View>
                    </TouchableOpacity>

                    {/* Coming Soon Badge */}
                    <View style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: BorderRadius.full,
                        paddingHorizontal: 14,
                        paddingVertical: 5,
                        marginBottom: 16,
                    }}>
                        <Text style={{
                            ...Typography.overline,
                            color: '#fff',
                            textTransform: 'uppercase',
                        }}>
                            Coming Soon
                        </Text>
                    </View>

                    <View style={{
                        width: 72,
                        height: 72,
                        borderRadius: 36,
                        backgroundColor: 'rgba(255,255,255,0.15)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                    }}>
                        <Ionicons name={feature.headerIcon as any} size={36} color="#fff" />
                    </View>

                    <Text style={{
                        ...Typography.h1,
                        color: '#fff',
                        textAlign: 'center',
                        marginBottom: 4,
                    }}>
                        {feature.headerTitle}
                    </Text>
                    <Text style={{
                        ...Typography.body,
                        color: 'rgba(255,255,255,0.8)',
                        textAlign: 'center',
                    }}>
                        {feature.headerSubtitle}
                    </Text>
                </LinearGradient>

                {/* Slide Content */}
                <View style={{ flex: 1, padding: 24 }}>
                    <Animated.View style={{
                        flex: 1,
                        opacity: fadeAnim,
                        transform: [{
                            translateY: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [10, 0],
                            }),
                        }],
                    }}>
                        {/* Slide Icon */}
                        <View style={{
                            width: 64,
                            height: 64,
                            borderRadius: 20,
                            backgroundColor: slide.iconBg,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 20,
                        }}>
                            <Ionicons name={slide.icon as any} size={32} color={slide.iconColor} />
                        </View>

                        {/* Step indicator */}
                        <Text style={{
                            ...Typography.overline,
                            color: theme.colors.textTertiary,
                            marginBottom: 8,
                        }}>
                            STEP {currentSlide + 1} OF {feature.slides.length}
                        </Text>

                        <Text style={{
                            ...Typography.h2,
                            color: theme.colors.textPrimary,
                            marginBottom: 12,
                        }}>
                            {slide.title}
                        </Text>

                        <Text style={{
                            ...Typography.body,
                            color: theme.colors.textSecondary,
                            lineHeight: 24,
                        }}>
                            {slide.description}
                        </Text>
                    </Animated.View>

                    {/* Dot Indicators */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                        marginBottom: 24,
                    }}>
                        {feature.slides.map((_, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => goToSlide(i)}
                                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                            >
                                <View
                                    style={{
                                        width: currentSlide === i ? 24 : 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: currentSlide === i
                                            ? feature.headerGradient[1]
                                            : theme.colors.border,
                                    }}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Action Buttons */}
                    {currentSlide < feature.slides.length - 1 ? (
                        <TouchableOpacity
                            onPress={() => goToSlide(currentSlide + 1)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={feature.headerGradient}
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
                                <Text style={{ ...Typography.bodyBold, color: '#fff' }}>
                                    Next
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : notified ? (
                        <View style={{
                            borderRadius: BorderRadius.md,
                            height: 52,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                            backgroundColor: Colors.brand.emerald + '15',
                            borderWidth: 1,
                            borderColor: Colors.brand.emerald + '30',
                        }}>
                            <Ionicons name="checkmark-circle" size={20} color={Colors.brand.emerald} />
                            <Text style={{ ...Typography.bodyBold, color: Colors.brand.emerald }}>
                                We&apos;ll notify you when it&apos;s ready!
                            </Text>
                        </View>
                    ) : (
                        <View style={{ gap: 10 }}>
                            <TouchableOpacity
                                onPress={handleNotify}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={feature.headerGradient}
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
                                    <Ionicons name="notifications-outline" size={18} color="#fff" />
                                    <Text style={{ ...Typography.bodyBold, color: '#fff' }}>
                                        Notify Me When Available
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleClose}
                                style={{
                                    height: 44,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                                    Maybe Later
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

// ─── Profile Section Cards ──────────────────────────────────────────────────
export function ComingSoonCards() {
    const { theme } = useTheme();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const cards = [
        {
            key: 'uae_pass',
            icon: 'finger-print-outline',
            gradient: ['#1E40AF', '#3B82F6'] as [string, string],
            title: 'UAE Pass',
            subtitle: 'Verify identity instantly',
        },
        {
            key: 'aecb_sync',
            icon: 'sync-outline',
            gradient: ['#0A2525', '#011819'] as [string, string],
            title: 'Bank Sync',
            subtitle: 'Auto-import your loans',
        },
        {
            key: 'aecb_score',
            icon: 'analytics-outline',
            gradient: ['#7C3AED', '#A855F7'] as [string, string],
            title: 'Credit Score',
            subtitle: 'Check your AECB score',
        },
    ];

    return (
        <>
            <View style={{ gap: 10 }}>
                {cards.map(card => (
                    <TouchableOpacity
                        key={card.key}
                        onPress={() => setActiveModal(card.key)}
                        activeOpacity={0.7}
                    >
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 14,
                            padding: 16,
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}>
                            <LinearGradient
                                colors={card.gradient}
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 14,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons name={card.icon as any} size={22} color="#fff" />
                            </LinearGradient>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                                    {card.title}
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                    {card.subtitle}
                                </Text>
                            </View>
                            <View style={{
                                backgroundColor: card.gradient[1] + '15',
                                borderRadius: BorderRadius.full,
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                            }}>
                                <Text style={{
                                    ...Typography.overline,
                                    color: card.gradient[1],
                                    textTransform: 'uppercase',
                                }}>
                                    Soon
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <ComingSoonModal
                visible={activeModal !== null}
                featureKey={activeModal || 'uae_pass'}
                onClose={() => setActiveModal(null)}
            />
        </>
    );
}
