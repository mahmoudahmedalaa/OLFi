import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';

export function ScoreFlipCard() {
    const { theme } = useTheme();
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [isFlipped, setIsFlipped] = useState(false);
    const [hasTakenScore, setHasTakenScore] = useState(false);

    useEffect(() => {
        const checkScore = async () => {
            const val = await AsyncStorage.getItem('olfi_score_taken');
            if (val === 'true') {
                setHasTakenScore(true);
            }
        };
        // Initial check
        checkScore();
    }, []);

    // A method we can call manually to check again quickly upon gaining focus
    useEffect(() => {
        const interval = setInterval(async () => {
            const val = await AsyncStorage.getItem('olfi_score_taken');
            if (val === 'true' && !hasTakenScore) {
                setHasTakenScore(true);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [hasTakenScore]);

    const flipCard = () => {
        if (!hasTakenScore) return; // Cannot flip if not taken

        if (isFlipped) {
            Animated.spring(animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.spring(animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10,
                useNativeDriver: true,
            }).start();
        }
        setIsFlipped(!isFlipped);
    };

    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate }] };
    const backAnimatedStyle = { transform: [{ rotateY: backInterpolate }] };

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                {/* Front Side: OLFi Score */}
                <Animated.View style={[styles.card, frontAnimatedStyle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.touchableArea}>
                        {hasTakenScore ? (
                            <View style={styles.scoreContent}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Ionicons name="bar-chart" size={18} color={theme.colors.textPrimary} />
                                        <Text style={{ ...Typography.captionBold, color: theme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                            OLFi Score
                                        </Text>
                                    </View>
                                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${Colors.brand.emerald}20`, alignItems: 'center', justifyContent: 'center' }}>
                                        <Ionicons name="sync" size={16} color={Colors.brand.emerald} />
                                    </View>
                                </View>

                                <View style={{ alignItems: 'center', marginVertical: Spacing.sm }}>
                                    <View style={[styles.scoreCircle, { borderColor: Colors.brand.emerald }]}>
                                        <Text style={{ fontSize: 36, fontWeight: '800', color: theme.colors.textPrimary }}>740</Text>
                                        <Text style={{ fontSize: 13, color: Colors.brand.emerald, fontWeight: '700', marginTop: -4 }}>Excellent</Text>
                                    </View>
                                </View>

                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginTop: Spacing.md }}>
                                    Top 10% of users • Tap to flip
                                </Text>
                            </View>
                        ) : (
                            <View style={[styles.scoreContent, { justifyContent: 'center', alignItems: 'center' }]}>
                                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: `${Colors.brand.emerald}15`, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md }}>
                                    <Ionicons name="lock-closed" size={20} color={Colors.brand.emerald} />
                                </View>
                                <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, marginBottom: Spacing.xs }}>
                                    Unlock Your OLFi Score
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg, paddingHorizontal: Spacing.lg }}>
                                    Discover your true borrowing power and unlock exclusive rates.
                                </Text>

                                <TouchableOpacity
                                    onPress={() => router.push('/olfi-score-info' as any)}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={theme.gradients.brand}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.actionBtn}
                                    >
                                        <Text style={styles.actionBtnText}>Take Assessment</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#fff" />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>
                </Animated.View>

                {/* Back Side: AECB Score */}
                <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle, { backgroundColor: '#F8F9FA', borderColor: '#E9ECEF' }]}>
                    <TouchableOpacity activeOpacity={1} onPress={flipCard} style={styles.touchableArea}>
                        <View style={styles.scoreContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <Ionicons name="shield-checkmark" size={18} color="#003087" />
                                    <Text style={{ ...Typography.captionBold, color: '#003087', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                        AECB Credit Score
                                    </Text>
                                </View>
                                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,48,135,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name="sync" size={16} color="#003087" />
                                </View>
                            </View>

                            <View style={{ alignItems: 'center', marginVertical: Spacing.sm }}>
                                <View style={[styles.scoreCircle, { borderColor: '#003087' }]}>
                                    <Text style={{ fontSize: 36, fontWeight: '800', color: '#111' }}>685</Text>
                                    <Text style={{ fontSize: 13, color: '#003087', fontWeight: '700', marginTop: -4 }}>Good</Text>
                                </View>
                            </View>

                            <Text style={{ ...Typography.caption, color: '#495057', textAlign: 'center', marginTop: Spacing.md }}>
                                Updated last month • Tap to flip
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
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
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardBack: {
        backgroundColor: '#F8F9FA',
    },
    touchableArea: {
        flex: 1,
        padding: Spacing.xl,
    },
    scoreContent: {
        flex: 1,
    },
    scoreCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
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
    }
});
