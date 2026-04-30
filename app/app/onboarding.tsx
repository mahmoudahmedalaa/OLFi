import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated as RNAnimated,
    Image,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BorderRadius } from '@/lib/constants';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideInLeft,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    withRepeat,
    Easing,
} from 'react-native-reanimated';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Brand Colors ──────────────────────────────────────────────────
const B = {
    navy: '#0F172A',
    navyMid: '#1E293B',
    navyLt: '#334155',
    emerald: '#10B981',
    teal: '#4FD1C5',
    blue: '#3B82F6',
    text: '#F8FAFC',
    muted: 'rgba(255,255,255,0.65)',
    dim: 'rgba(255,255,255,0.35)',
};

// Slides are now generated inside the component to use the `t` translation function
const getSlides = (t: any) => [
    {
        bg: ['#0a1628', '#0F172A'] as [string, string],
        accent: B.emerald,
        headline: t('onboarding.slide1.title'),
        sub: t('onboarding.slide1.desc'),
    },
    {
        bg: ['#0F172A', '#0f2a1e'] as [string, string],
        accent: B.teal,
        headline: t('onboarding.slide2.title'),
        sub: t('onboarding.slide2.desc'),
    },
    {
        bg: ['#0F172A', '#0a1f17'] as [string, string],
        accent: B.emerald,
        headline: t('onboarding.slide3.title'),
        sub: t('onboarding.slide3.desc'),
    },
    {
        bg: ['#0F172A', '#0f1a2a'] as [string, string],
        accent: B.blue,
        headline: t('onboarding.slide4.title'),
        sub: t('onboarding.slide4.desc'),
    },
];

// ─── Slide Visual Components ───────────────────────────────────────

function Slide1Visual() {
    // Abstract modern Fintech dashboard card
    return (
        <View style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.55,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {/* Background floating elements */}
            <Animated.View
                entering={FadeIn.delay(100).duration(800)}
                style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    backgroundColor: `${B.teal}11`,
                    top: '20%',
                    right: '10%'
                }}
            />
            <Animated.View
                entering={FadeIn.delay(300).duration(800)}
                style={{
                    position: 'absolute',
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    backgroundColor: `${B.emerald}11`,
                    bottom: '10%',
                    left: '-10%'
                }}
            />

            {/* Central Card */}
            <Animated.View
                entering={SlideInRight.delay(200).duration(600).springify()}
                style={{
                    width: '75%',
                    backgroundColor: B.navyMid,
                    borderRadius: 20,
                    padding: 24,
                    borderWidth: 1,
                    borderColor: 'rgba(16, 185, 129, 0.3)', // Emerald border
                    shadowColor: B.emerald,
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.15,
                    shadowRadius: 20,
                    zIndex: 2,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${B.emerald}20`, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="pie-chart" size={20} color={B.emerald} />
                    </View>
                    <View style={{ backgroundColor: `${B.emerald}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: B.emerald }}>+24% Savings</Text>
                    </View>
                </View>

                <Text style={{ fontSize: 13, color: B.muted, marginBottom: 8, fontWeight: '500' }}>Total Debt Portfolio</Text>
                <Text style={{ fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 24, letterSpacing: -0.5 }}>AED 125,400</Text>

                {/* Mock Bar Chart */}
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 60, gap: 10 }}>
                    {[0.4, 0.7, 0.5, 0.9, 0.6, 1.0].map((val, i) => (
                        <Animated.View key={i} entering={FadeIn.delay(400 + (i * 100)).duration(500)} style={{ flex: 1, height: `${val * 100}%`, backgroundColor: i === 5 ? B.emerald : B.navyLt, borderRadius: 4 }} />
                    ))}
                </View>
            </Animated.View>

            {/* Floating overlay card */}
            <Animated.View
                entering={SlideInLeft.delay(500).duration(600).springify()}
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    right: '8%',
                    backgroundColor: B.navy,
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: B.navyLt,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    zIndex: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.3,
                    shadowRadius: 15,
                }}
            >
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${B.teal}20`, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="trending-up" size={16} color={B.teal} />
                </View>
                <View>
                    <Text style={{ fontSize: 12, color: B.muted, fontWeight: '500' }}>Credit Score</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: '#fff' }}>742 <Text style={{ color: B.teal, fontSize: 12, fontWeight: '600' }}>↑</Text></Text>
                </View>
            </Animated.View>
        </View>
    );
}

function Slide2Visual() {
    // Stacked debt cards
    const debts = [
        { label: 'Personal Loan · FAB', val: 'AED 85,000', rate: '14.5%', color: '#C8102E' },
        { label: 'Credit Card · ENBD', val: 'AED 23,400', rate: '22.8%', color: '#E5A000' },
        { label: 'Auto Loan · ADCB', val: 'AED 42,000', rate: '8.9%', color: '#E31837' },
    ];

    return (
        <View style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.55,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
        }}>
            {debts.map((item, i) => (
                <Animated.View
                    key={i}
                    entering={SlideInRight.delay(i * 200).duration(500).springify()}
                    style={{
                        backgroundColor: B.navyMid,
                        borderRadius: 14,
                        padding: 14,
                        marginBottom: 10,
                        borderWidth: 1,
                        borderColor: B.navyLt,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        alignSelf: 'stretch',
                        opacity: 1 - i * 0.1,
                        transform: [{ scale: 1 - i * 0.03 }],
                    }}
                >
                    <View style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: item.color,
                    }} />
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 12, color: B.muted, fontWeight: '500' }}>
                            {item.label}
                        </Text>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '800', color: B.text }}>
                        {item.val}
                    </Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#EF4444' }}>
                        {item.rate}
                    </Text>
                </Animated.View>
            ))}
        </View>
    );
}

function Slide3Visual() {
    // Rate comparison
    return (
        <View style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.55,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                {/* High rate */}
                <View style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: 16,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <Text style={{ fontSize: 12, color: '#EF4444', fontWeight: '600', marginBottom: 6 }}>
                        Interest
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: '#EF4444' }}>
                        14.5%
                    </Text>
                </View>

                {/* Arrow */}
                <Ionicons name="arrow-forward" size={24} color={B.emerald} />

                {/* Low rate */}
                <View style={{
                    backgroundColor: `${B.emerald}12`,
                    borderRadius: 16,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: `${B.emerald}33`,
                    alignItems: 'center',
                    flex: 1,
                }}>
                    <Text style={{ fontSize: 12, color: B.emerald, fontWeight: '600', marginBottom: 6 }}>
                        Murābaḥa
                    </Text>
                    <Text style={{ fontSize: 28, fontWeight: '900', color: B.emerald }}>
                        8.2%
                    </Text>
                </View>
            </View>

            {/* Certification badge */}
            <View style={{
                backgroundColor: `${B.emerald}12`,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: `${B.emerald}25`,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6
            }}>
                <Ionicons name="shield-checkmark" size={14} color={B.emerald} />
                <Text style={{ fontSize: 12, color: B.emerald, fontWeight: '700', textAlign: 'center' }}>
                    AAOIFI Certified Sharia-Compliant
                </Text>
            </View>
        </View>
    );
}

function Slide4Visual() {
    // Score progress bars
    const scores = [
        { label: 'OLFi Score', val: 724, max: 850, color: B.emerald, sub: 'AI + Open Banking' },
        { label: 'CBUAE Score', val: 718, max: 900, color: B.blue, sub: 'Via AECB Bureau' },
    ];

    return (
        <View style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.55,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
        }}>
            {scores.map((s, i) => (
                <Animated.View
                    key={s.label}
                    entering={FadeIn.delay(i * 300).duration(600)}
                    style={{
                        backgroundColor: B.navyMid,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 14,
                        borderWidth: 1,
                        borderColor: B.navyLt,
                        alignSelf: 'stretch',
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text style={{ fontSize: 13, color: B.muted, fontWeight: '500' }}>
                            {s.label}
                        </Text>
                        <Text style={{ fontSize: 18, fontWeight: '900', color: s.color }}>
                            {s.val}
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: B.navyLt,
                        borderRadius: 99,
                        height: 6,
                        overflow: 'hidden',
                    }}>
                        <View style={{
                            width: `${(s.val / s.max) * 100}%`,
                            backgroundColor: s.color,
                            height: '100%',
                            borderRadius: 99,
                        }} />
                    </View>
                    <Text style={{ fontSize: 11, color: B.dim, marginTop: 6 }}>
                        {s.sub}
                    </Text>
                </Animated.View>
            ))}
        </View>
    );
}

const SLIDE_VISUALS = [Slide1Visual, Slide2Visual, Slide3Visual, Slide4Visual];

// ─── Main Screen ───────────────────────────────────────────────────

export default function OnboardingScreen() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { user } = useAuth();
    const { t, isRtl } = useLanguage();

    const SLIDES = React.useMemo(() => getSlides(t), [t]);
    const slide = SLIDES[currentSlide];
    const SlideVisual = SLIDE_VISUALS[currentSlide];

    // Navigation
    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const handleTap = (e: any) => {
        const x = e.nativeEvent.locationX;
        if (x < SCREEN_WIDTH * 0.3) {
            goToSlide(Math.max(currentSlide - 1, 0));
        } else if (x > SCREEN_WIDTH * 0.7) {
            goToSlide(Math.min(currentSlide + 1, SLIDES.length - 1));
        }
    };

    const handleGetStarted = async () => {
        try {
            await AsyncStorage.setItem('buyout_onboarding_completed', 'true');
            if (user) {
                await AsyncStorage.setItem(`buyout_onboarding_completed_${user.id}`, 'true');
            }
        } catch { }
        router.replace('/(auth)/signup' as any);
    };

    const handleLogin = () => {
        AsyncStorage.setItem('buyout_onboarding_completed', 'true').catch(() => { });
        router.replace('/(auth)/login');
    };

    const isLastSlide = currentSlide === SLIDES.length - 1;

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={handleTap}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={slide.bg}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.8, y: 1 }}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
                    {/* ── Header: Logo & Language Toggle ───────────────────────── */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingTop: 16,
                    }}>
                        <Image
                            source={require('@/assets/images/olfi-icon.png')}
                            style={{ width: 52, height: 52, borderRadius: 14 }}
                        />
                        <LanguageToggle />
                    </View>

                    {/* ── Dot Indicators ──────────────────────────────── */}
                    <View style={{
                        flexDirection: 'row',
                        gap: 6,
                        alignSelf: 'center',
                        marginTop: 12,
                    }}>
                        {SLIDES.map((_, i) => (
                            <TouchableOpacity
                                key={i}
                                onPress={() => goToSlide(i)}
                                style={{
                                    width: i === currentSlide ? 20 : 6,
                                    height: 6,
                                    borderRadius: 3,
                                    backgroundColor: i === currentSlide ? slide.accent : 'rgba(255,255,255,0.25)',
                                }}
                            />
                        ))}
                    </View>

                    {/* ── Slide Visual ────────────────────────────────── */}
                    <View style={{ flex: 1, position: 'relative' }}>
                        <SlideVisual key={currentSlide} />
                    </View>

                    {/* ── Content ─────────────────────────────────────── */}
                    <View style={{ paddingHorizontal: 28, paddingBottom: Platform.OS === 'ios' ? 16 : 24, direction: isRtl ? 'rtl' : 'ltr' }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: '900',
                            lineHeight: 38,
                            letterSpacing: -0.5,
                            marginBottom: 12,
                            textAlign: isRtl ? 'right' : 'left',
                            writingDirection: isRtl ? 'rtl' : 'ltr',
                        }}>
                            {slide.headline}
                        </Text>
                        <Text style={{
                            color: B.muted,
                            fontSize: 14,
                            lineHeight: 22,
                            marginBottom: 28,
                            textAlign: isRtl ? 'right' : 'left',
                            writingDirection: isRtl ? 'rtl' : 'ltr',
                        }}>
                            {slide.sub}
                        </Text>

                        {/* CTA Button */}
                        <TouchableOpacity
                            onPress={isLastSlide ? handleGetStarted : () => goToSlide(currentSlide + 1)}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={[B.emerald, B.teal]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    height: 56,
                                    borderRadius: 14,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    shadowColor: B.emerald,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 20,
                                    elevation: 8,
                                }}
                            >
                                <Text style={{
                                    fontSize: 17,
                                    fontWeight: '800',
                                    color: '#fff',
                                }}>
                                    {isLastSlide ? t('onboarding.getStarted') : t('onboarding.next')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <TouchableOpacity
                            onPress={handleLogin}
                            style={{
                                marginTop: 16,
                                alignItems: 'center',
                                paddingVertical: 8,
                            }}
                        >
                            <Text style={{ fontSize: 14, color: B.muted }}>
                                {t('auth.haveAccount')}{' '}
                                <Text style={{ color: B.emerald, fontWeight: '700' }}>
                                    {t('auth.signIn')}
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </TouchableOpacity>
    );
}
