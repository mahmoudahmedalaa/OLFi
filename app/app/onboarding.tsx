import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
    FlatList,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = 'buyout_onboarding_completed';

interface Slide {
    id: string;
    icon: string;
    title: string;
    description: string;
    gradient: [string, string];
}

const slides: Slide[] = [
    {
        id: '1',
        icon: 'wallet-outline',
        title: 'Track All Your Loans',
        description: 'Add your personal, auto, mortgage, and credit card loans in one place. See your total debt and monthly payments at a glance.',
        gradient: ['#10B981', '#059669'],
    },
    {
        id: '2',
        icon: 'trending-down-outline',
        title: 'Find Better Rates',
        description: 'Our refinance engine compares your loans against offers from top UAE banks to find you the best savings.',
        gradient: ['#0D9488', '#0F766E'],
    },
    {
        id: '3',
        icon: 'calculator-outline',
        title: 'See Your Savings',
        description: 'Instantly see how much you can save each month and over the lifetime of your loan with detailed comparisons.',
        gradient: ['#6366F1', '#4F46E5'],
    },
    {
        id: '4',
        icon: 'shield-checkmark-outline',
        title: 'Bank-Grade Security',
        description: 'Your financial data is encrypted and never shared. We only show you offers — you decide when to apply.',
        gradient: ['#8B5CF6', '#7C3AED'],
    },
];

export default function OnboardingScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
    );

    const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(e.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            completeOnboarding();
        }
    };

    const handleSkip = () => {
        completeOnboarding();
    };

    const completeOnboarding = async () => {
        try {
            // Always set device-level flag
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            // Also set per-user flag if user is logged in
            if (user) {
                await AsyncStorage.setItem(`buyout_onboarding_completed_${user.id}`, 'true');
            }
        } catch {
            // Silently fail — user can still proceed
        }
        router.replace('/(auth)/login');
    };

    const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
        });

        return (
            <View style={{ width, paddingHorizontal: 40, justifyContent: 'center', alignItems: 'center' }}>
                <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
                    {/* Icon Circle */}
                    <LinearGradient
                        colors={item.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 40,
                        }}
                    >
                        <Ionicons name={item.icon as any} size={52} color="#fff" />
                    </LinearGradient>

                    <Text style={{
                        fontSize: 28,
                        fontWeight: '800',
                        color: theme.colors.textPrimary,
                        textAlign: 'center',
                        marginBottom: 16,
                        letterSpacing: -0.5,
                    }}>
                        {item.title}
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        color: theme.colors.textSecondary,
                        textAlign: 'center',
                        lineHeight: 24,
                    }}>
                        {item.description}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    const isLast = currentIndex === slides.length - 1;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Skip */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingTop: 8 }}>
                {!isLast && (
                    <TouchableOpacity onPress={handleSkip} style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textTertiary }}>
                            Skip
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Slides */}
            <FlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                renderItem={renderSlide}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={handleScroll}
                onMomentumScrollEnd={onMomentumScrollEnd}
                scrollEventThrottle={16}
                style={{ flex: 1 }}
                contentContainerStyle={{ alignItems: 'center' }}
            />

            {/* Bottom Controls */}
            <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                {/* Dots */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32, gap: 8 }}>
                    {slides.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({
                            inputRange,
                            outputRange: [8, 28, 8],
                            extrapolate: 'clamp',
                        });
                        const dotOpacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: 'clamp',
                        });
                        return (
                            <Animated.View
                                key={i}
                                style={{
                                    height: 8,
                                    width: dotWidth,
                                    borderRadius: 4,
                                    backgroundColor: Colors.brand.emerald,
                                    opacity: dotOpacity,
                                }}
                            />
                        );
                    })}
                </View>

                {/* CTA Button */}
                <TouchableOpacity onPress={handleNext} activeOpacity={0.8}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            height: 56,
                            borderRadius: BorderRadius.md,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                        }}
                    >
                        <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                            {isLast ? 'Get Started' : 'Next'}
                        </Text>
                        <Ionicons
                            name={isLast ? 'checkmark-circle' : 'arrow-forward'}
                            size={20}
                            color="#fff"
                        />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export { ONBOARDING_KEY };
