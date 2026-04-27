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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SLIDE_DURATION = 5000; // 5s per slide

// ─── Brand Colors ──────────────────────────────────────────────────
const B = {
    navy: '#0F172A',
    navyMid: '#1E293B',
    navyLt: '#334155',
    emerald: '#10B981',
    teal: '#14B8A6',
    blue: '#3B82F6',
    text: '#F8FAFC',
    muted: 'rgba(255,255,255,0.65)',
    dim: 'rgba(255,255,255,0.35)',
};

// ─── Slide Data ────────────────────────────────────────────────────
const SLIDES = [
    {
        bg: ['#0a1628', '#0F172A'] as [string, string],
        accent: B.emerald,
        headline: 'Take Control of\nYour Finances',
        sub: 'OLFi analyzes your debt portfolio and finds you better deals — saving you thousands in interest',
    },
    {
        bg: ['#0F172A', '#0f2a1e'] as [string, string],
        accent: B.teal,
        headline: 'See All Your\nDebt in One Place',
        sub: 'Connect your accounts to get a complete picture of your loans, credit cards, and payment obligations',
    },
    {
        bg: ['#0F172A', '#0a1f17'] as [string, string],
        accent: B.emerald,
        headline: 'Switch to Smarter\nRefinancing',
        sub: 'We compare conventional rates against Sharia-compliant Murābaḥa alternatives — you choose what\'s best',
    },
    {
        bg: ['#0F172A', '#0f1a2a'] as [string, string],
        accent: B.blue,
        headline: 'Your OLFi Score\nUnlocks Better Offers',
        sub: 'Our AI-powered scoring system goes beyond credit bureaus — using Open Banking data for a fairer financial profile',
    },
];

// ─── Slide Visual Components ───────────────────────────────────────

function Slide1Visual() {
    // Radial starburst pattern
    const rays = Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * 360;
        const len = 100 + Math.random() * 100;
        const colors = [B.emerald, B.teal, B.blue];
        return { angle, len, color: colors[i % 3] };
    });

    return (
        <View style={{
            position: 'absolute',
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT * 0.55,
            top: 0,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            {rays.map((ray, i) => (
                <View
                    key={i}
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: 1.5,
                        height: ray.len,
                        backgroundColor: `${ray.color}44`,
                        transform: [
                            { translateX: -0.75 },
                            { rotate: `${ray.angle}deg` },
                        ],
                        transformOrigin: 'top center',
                        opacity: 0.6,
                    }}
                />
            ))}
            {/* Center glow */}
            <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: `${B.emerald}15`,
            }} />
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
            }}>
                <Text style={{ fontSize: 12, color: B.emerald, fontWeight: '700', textAlign: 'center' }}>
                    ☪️  AAOIFI Certified Sharia-Compliant
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
    const progressAnim = useRef(new RNAnimated.Value(0)).current;
    const intervalRef = useRef<number | null>(null);
    const { user } = useAuth();

    const slide = SLIDES[currentSlide];
    const SlideVisual = SLIDE_VISUALS[currentSlide];

    // Progress bar animation
    useEffect(() => {
        progressAnim.setValue(0);
        const start = Date.now();

        const tick = () => {
            const elapsed = Date.now() - start;
            const pct = Math.min(elapsed / SLIDE_DURATION, 1);
            progressAnim.setValue(pct);
            if (pct < 1) {
                intervalRef.current = requestAnimationFrame(tick);
            } else {
                setCurrentSlide((s) => (s + 1) % SLIDES.length);
            }
        };

        intervalRef.current = requestAnimationFrame(tick);
        return () => {
            if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
        };
    }, [currentSlide]);

    // Navigation
    const goToSlide = (index: number) => {
        if (intervalRef.current) cancelAnimationFrame(intervalRef.current);
        setCurrentSlide(index);
    };

    const handleTap = (e: any) => {
        const x = e.nativeEvent.locationX;
        if (x < SCREEN_WIDTH * 0.3) {
            goToSlide(Math.max(currentSlide - 1, 0));
        } else if (x > SCREEN_WIDTH * 0.7) {
            goToSlide((currentSlide + 1) % SLIDES.length);
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
                    {/* ── Story Progress Bars ────────────────────────── */}
                    <View style={{
                        flexDirection: 'row',
                        gap: 4,
                        paddingHorizontal: 16,
                        marginTop: 8,
                    }}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={{
                                    flex: 1,
                                    height: 2.5,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    overflow: 'hidden',
                                }}
                            >
                                {i < currentSlide ? (
                                    <View style={{
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: '#fff',
                                        borderRadius: 2,
                                    }} />
                                ) : i === currentSlide ? (
                                    <RNAnimated.View style={{
                                        height: '100%',
                                        backgroundColor: '#fff',
                                        borderRadius: 2,
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                    }} />
                                ) : null}
                            </View>
                        ))}
                    </View>

                    {/* ── Header: Logo + Brand ───────────────────────── */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingTop: 16,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                source={require('@/assets/images/olfi-icon.png')}
                                style={{ width: 36, height: 36, borderRadius: 10 }}
                            />
                            <Text style={{
                                color: '#fff',
                                fontSize: 22,
                                fontWeight: '900',
                                letterSpacing: -0.5,
                            }}>
                                OLFi
                            </Text>
                        </View>
                        {/* Language pills (visual only) */}
                        <View style={{ flexDirection: 'row', gap: 4 }}>
                            {[['EN', true], ['عر', false]].map(([label, active]) => (
                                <View
                                    key={label as string}
                                    style={{
                                        paddingHorizontal: 10,
                                        paddingVertical: 5,
                                        borderRadius: 8,
                                        backgroundColor: active ? B.emerald : 'rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 11,
                                        fontWeight: '700',
                                        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                                    }}>
                                        {label as string}
                                    </Text>
                                </View>
                            ))}
                        </View>
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
                    <View style={{ paddingHorizontal: 28, paddingBottom: Platform.OS === 'ios' ? 16 : 24 }}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 30,
                            fontWeight: '900',
                            lineHeight: 38,
                            letterSpacing: -0.5,
                            marginBottom: 12,
                        }}>
                            {slide.headline}
                        </Text>
                        <Text style={{
                            color: B.muted,
                            fontSize: 14,
                            lineHeight: 22,
                            marginBottom: 28,
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
                                    {isLastSlide ? 'Get Started' : 'Next'}
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
                                Already have an account?{' '}
                                <Text style={{ color: B.emerald, fontWeight: '700' }}>
                                    Sign In
                                </Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </TouchableOpacity>
    );
}
