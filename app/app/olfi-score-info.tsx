import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';

export default function OlfiScoreInfoScreen() {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    const handleCalculate = async () => {
        setLoading(true);
        // Simulate a tiny delay for calculation
        setTimeout(async () => {
            await AsyncStorage.setItem('olfi_score_taken', 'true');
            setLoading(false);
            router.back();
        }, 2000);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: Spacing.xl,
                    paddingVertical: Spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ ...Typography.body, fontWeight: '600', color: theme.colors.textPrimary }}>
                    OLFi Assessment
                </Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 100 }}>
                {/* Hero Icon */}
                <View style={{ alignItems: 'center', marginVertical: Spacing['2xl'] }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: `${Colors.brand.emerald}15`, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="bar-chart" size={40} color={Colors.brand.emerald} />
                    </View>
                </View>

                <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, textAlign: 'center', marginBottom: Spacing.sm }}>
                    What is an OLFi Score?
                </Text>
                <Text style={{ ...Typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: Spacing['2xl'], lineHeight: 22 }}>
                    The OLFi Score evaluates your total debt load over your income natively inside the app, and matches it with AECB to produce a proprietary health index tailored for immediate buyout refinancing.
                </Text>

                <View style={{ gap: Spacing.lg, marginBottom: Spacing['3xl'] }}>
                    <View style={styles.benefitRow}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Ionicons name="analytics" size={20} color={Colors.brand.emerald} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 2 }}>
                                Precision Modeling
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                Scans existing rates and terms to calculate exactly how much margin is left for a bank buyout.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitRow}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Ionicons name="lock-open" size={20} color={Colors.brand.emerald} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 2 }}>
                                Unlocks Features
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                Upon calculation, flipping the score card reveals your AECB standing concurrently on the dashboard.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.benefitRow}>
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                            <Ionicons name="timer" size={20} color={Colors.brand.emerald} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 2 }}>
                                Instant Results
                            </Text>
                            <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                Generated locally in seconds without pinging heavy third-parties or harming your credit rating.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Calculate */}
                <TouchableOpacity
                    onPress={handleCalculate}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={theme.gradients.brand}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.ctaBtn}
                    >
                        {loading ? (
                            <Text style={styles.ctaBtnText}>Calculating OLFi Score...</Text>
                        ) : (
                            <>
                                <Text style={styles.ctaBtnText}>Calculate Score Now</Text>
                                <Ionicons name="sparkles" size={18} color="#fff" />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                <Text style={{ ...Typography.caption, color: theme.colors.textDisabled, textAlign: 'center', marginTop: Spacing.lg }}>
                    This triggers a local heuristic metric and has absolutely zero impact on your national AECB credit report history.
                </Text>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 16,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    ctaBtn: {
        height: 56,
        borderRadius: BorderRadius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 10,
    },
    ctaBtnText: {
        ...Typography.bodyBold,
        color: '#fff',
        fontSize: 16,
    }
});
