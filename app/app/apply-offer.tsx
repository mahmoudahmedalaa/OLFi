import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { formatAED, calculateEMI } from '@/lib/refinance-calculator';
import { hapticLight, hapticMedium, hapticSuccess, hapticSelection } from '@/lib/haptics';
import { trackApplicationStarted, trackApplicationSubmitted } from '@/lib/analytics';
import { TenureSlider } from '@/components/ui/tenure-slider';
import { useApplicationStore } from '@/store/useApplicationStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ──────────────────────────────────────────────────────────────────
interface ApplicationData {
    phone: string;
    salary: string;
    employer: string;
    callbackTime: 'morning' | 'afternoon' | 'evening' | '';
    consent: boolean;
}

const CALLBACK_TIMES = [
    { key: 'morning' as const, label: 'Morning', sublabel: '9AM — 12PM', icon: 'sunny-outline' },
    { key: 'afternoon' as const, label: 'Afternoon', sublabel: '12PM — 5PM', icon: 'partly-sunny-outline' },
    { key: 'evening' as const, label: 'Evening', sublabel: '5PM — 9PM', icon: 'moon-outline' },
];

// ─── Main Screen ────────────────────────────────────────────────────────────
export default function ApplyOfferScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const params = useLocalSearchParams<{
        productId: string;
        productName: string;
        bankName: string;
        loanId: string;
        monthlySavings: string;
        totalSavings: string;
        newRate: string;
        newEmi: string;
        loanRemainingAmount: string;
        loanMonthlyEmi: string;
        processingFee: string;
        maxTenureMonths: string;
        defaultTenure: string;
    }>();

    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const successAnim = useRef(new Animated.Value(0)).current;
    const checkmarkScale = useRef(new Animated.Value(0)).current;

    const [verifyingOffer, setVerifyingOffer] = useState(true);
    const [edgeOfferData, setEdgeOfferData] = useState<any>(null);

    const [formData, setFormData] = useState<ApplicationData>({
        phone: '',
        salary: '',
        employer: '',
        callbackTime: '',
        consent: false,
    });

    // Dynamic offer calculations
    const selectedTenure = useApplicationStore((state) => state.selectedTenure);
    const setSelectedTenure = useApplicationStore((state) => state.setSelectedTenure);

    const [dynamicEmi, setDynamicEmi] = useState(
        params.newEmi ? parseFloat(params.newEmi) : 0
    );
    const [dynamicMonthlySavings, setDynamicMonthlySavings] = useState(
        params.monthlySavings ? parseFloat(params.monthlySavings) : 0
    );
    const [dynamicTotalSavings, setDynamicTotalSavings] = useState(
        params.totalSavings ? parseFloat(params.totalSavings) : 0
    );

    const [dynamicGrossTotalSavings, setDynamicGrossTotalSavings] = useState(0);

    // Recalculate on tenure change
    useEffect(() => {
        if (!params.loanRemainingAmount || !params.newRate || !params.loanMonthlyEmi || !params.processingFee) return;

        const principal = parseFloat(params.loanRemainingAmount);
        const rate = parseFloat(params.newRate);
        const oldEmi = parseFloat(params.loanMonthlyEmi);
        const fee = parseFloat(params.processingFee);

        const newCalculatedEmi = calculateEMI(principal, rate, selectedTenure);
        const mSavings = oldEmi - newCalculatedEmi;
        const grossSavings = mSavings * selectedTenure;
        const netSavings = grossSavings - fee;

        setDynamicEmi(newCalculatedEmi);
        setDynamicMonthlySavings(mSavings);
        setDynamicGrossTotalSavings(grossSavings);
        setDynamicTotalSavings(Math.max(0, netSavings));
    }, [selectedTenure, params.loanRemainingAmount, params.newRate, params.loanMonthlyEmi, params.processingFee]);

    // Pre-fill from profile and verify offer with Edge Function
    useEffect(() => {
        let isMounted = true;
        const initData = async () => {
            if (!user) return;
            try {
                // 1. Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('phone, salary, employer')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profile && isMounted) {
                    setFormData(prev => ({
                        ...prev,
                        phone: profile.phone || '',
                        salary: profile.salary ? String(profile.salary) : '',
                        employer: profile.employer || '',
                    }));
                }

                // 2. Invoke Edge Function to verify & cache the offer
                const salaryVal = profile?.salary || 0;
                if (params.loanId && params.loanRemainingAmount && salaryVal > 0) {
                    const { data: edgeData, error: edgeErr } = await supabase.functions.invoke('fetch-bank-offers', {
                        body: {
                            user_id: user.id,
                            user_loan_id: params.loanId,
                            salary: salaryVal,
                            requested_amount: parseFloat(params.loanRemainingAmount)
                        }
                    });

                    if (edgeErr) {
                        console.error('Edge Function Error:', edgeErr);
                    } else if (edgeData && Array.isArray(edgeData)) {
                        const verifiedOffer = edgeData.find(o => o.provider_id === params.productId);
                        if (verifiedOffer && isMounted) {
                            setEdgeOfferData(verifiedOffer);
                            // We could override local dynamic states here with verified data, 
                            // but local calculator manages custom tenure which the Edge Function doesn't.
                        }
                    }
                }
            } catch (err) {
                console.error('Init error:', err);
            } finally {
                if (isMounted) setVerifyingOffer(false);
            }
        };

        initData();
        return () => { isMounted = false; };
    }, [user, params.loanId, params.loanRemainingAmount, params.productId]);

    const totalSteps = 4; // Added Customize Offer step

    const animateToStep = (nextStep: number) => {
        hapticMedium();
        Animated.spring(slideAnim, {
            toValue: nextStep,
            useNativeDriver: true,
            tension: 50,
            friction: 12,
        }).start();
        setStep(nextStep);
    };

    const handleSubmit = async () => {
        if (!user || !params.productId || !params.loanId) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('refinance_applications')
                .insert({
                    user_id: user.id,
                    user_loan_id: params.loanId,
                    bank_product_id: params.productId,
                    status: 'submitted',
                    monthly_savings: dynamicMonthlySavings,
                    total_savings: dynamicTotalSavings,
                    new_rate: parseFloat(params.newRate || '0'),
                    new_emi: dynamicEmi,
                    selected_tenure_months: selectedTenure,
                });

            if (error) throw error;

            // Update profile with any new data
            const profileUpdates: any = {};
            if (formData.phone) profileUpdates.phone = formData.phone;
            if (formData.salary) profileUpdates.salary = parseInt(formData.salary.replace(/,/g, ''));
            if (formData.employer) profileUpdates.employer = formData.employer;

            if (Object.keys(profileUpdates).length > 0) {
                await supabase.from('profiles').upsert({
                    id: user.id,
                    ...profileUpdates,
                    updated_at: new Date().toISOString(),
                });
            }

            // Send notification
            await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Application Submitted! 🎉',
                body: `Your refinance application for ${params.bankName} has been submitted. We'll review it shortly.`,
                type: 'offer',
                data: { screen: 'my-applications' },
            });

            // Show success animation
            setSubmitted(true);
            trackApplicationSubmitted(params.productId as string, Number(params.monthlySavings) || 0);
            hapticSuccess();
            Animated.sequence([
                Animated.timing(successAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(checkmarkScale, {
                    toValue: 1,
                    tension: 100,
                    friction: 6,
                    useNativeDriver: true,
                }),
            ]).start();
        } catch (e) {
            console.error('Failed to submit application:', e);
            Alert.alert('Error', 'Failed to submit your application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const canProceedStep0 = formData.phone.length >= 9;
    const canProceedStep1 = true; // Optional fields
    const canProceedStep2 = formData.consent;

    // ─── Success Screen ─────────────────────────────────────────────────────
    if (submitted) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
                <Animated.View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 32,
                    opacity: successAnim,
                    transform: [{ scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }],
                }}>
                    <Animated.View style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: Colors.brand.emerald + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 24,
                        transform: [{ scale: checkmarkScale }],
                    }}>
                        <Ionicons name="checkmark-circle" size={64} color={Colors.brand.emerald} />
                    </Animated.View>

                    <Text style={{
                        ...Typography.h1,
                        color: theme.colors.textPrimary,
                        textAlign: 'center',
                        marginBottom: 8,
                    }}>
                        Application Submitted!
                    </Text>

                    <Text style={{
                        ...Typography.body,
                        color: theme.colors.textSecondary,
                        textAlign: 'center',
                        marginBottom: 32,
                        lineHeight: 24,
                    }}>
                        Your refinance application for{' '}
                        <Text style={{ fontWeight: '600', color: Colors.brand.emerald }}>
                            {params.bankName}
                        </Text>
                        {' '}has been submitted. We'll review it and get back to you
                        {formData.callbackTime ? ` in the ${formData.callbackTime}` : ' shortly'}.
                    </Text>

                    {/* Savings Summary */}
                    <View style={{
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.lg,
                        padding: 20,
                        width: '100%',
                        marginBottom: 32,
                        borderWidth: 1,
                        borderColor: Colors.brand.emerald + '30',
                    }}>
                        <Text style={{
                            ...Typography.caption,
                            color: Colors.brand.emerald,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            marginBottom: 12,
                        }}>
                            Projected Savings
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                            <View>
                                <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                                    {formatAED(dynamicMonthlySavings)}
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                    per month
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                                    {formatAED(dynamicGrossTotalSavings)}
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                    gross savings
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                            <View>
                                <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                                    Processing Fee
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                                    (Deducted)
                                </Text>
                            </View>
                            <Text style={{ ...Typography.bodyBold, color: Colors.error }}>
                                - {formatAED(parseFloat(params.processingFee || '0'))}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>
                                Net Savings
                            </Text>
                            <Text style={{ ...Typography.h2, color: Colors.brand.emerald }}>
                                {formatAED(dynamicTotalSavings)}
                            </Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        onPress={() => router.replace('/my-applications' as any)}
                        activeOpacity={0.8}
                        style={{ width: '100%', marginBottom: 12 }}
                    >
                        <LinearGradient
                            colors={[Colors.brand.emerald, Colors.brand.emeraldDark]}
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
                            <Ionicons name="documents-outline" size={18} color="#fff" />
                            <Text style={{ ...Typography.bodyBold, color: '#fff' }}>
                                View My Applications
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{
                            width: '100%',
                            height: 52,
                            borderRadius: BorderRadius.md,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text style={{ ...Typography.bodyBold, color: theme.colors.textSecondary }}>
                            Back to Offer
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        );
    }

    // ─── Main Form ──────────────────────────────────────────────────────────
    if (verifyingOffer) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />
                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, marginTop: 12 }}>
                    Verifying offer details securely...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <TouchableOpacity
                    onPress={() => step > 0 ? animateToStep(step - 1) : router.back()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Ionicons
                        name={step > 0 ? 'arrow-back' : 'close'}
                        size={24}
                        color={theme.colors.textPrimary}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary }}>
                        Step {step + 1} of {totalSteps}
                    </Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Progress Bar */}
            <View style={{
                flexDirection: 'row',
                gap: 4,
                paddingHorizontal: 20,
                paddingVertical: 8,
            }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= step ? Colors.brand.emerald : theme.colors.border,
                        }}
                    />
                ))}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Step Content */}
                <Animated.View style={{
                    flex: 1,
                    flexDirection: 'row',
                    width: SCREEN_WIDTH * totalSteps,
                    transform: [{
                        translateX: slideAnim.interpolate({
                            inputRange: [0, 1, 2, 3],
                            outputRange: [0, -SCREEN_WIDTH, -SCREEN_WIDTH * 2, -SCREEN_WIDTH * 3],
                        }),
                    }],
                }}>
                    {/* Step 0: Customize Offer */}
                    <ScrollView
                        style={{ width: SCREEN_WIDTH }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                            Customize Your Plan
                        </Text>
                        <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                            Adjust the tenure to find the perfect monthly payment for you.
                        </Text>

                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            padding: 24,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: Colors.brand.emerald + '40',
                            alignItems: 'center',
                        }}>
                            <Text style={{ ...Typography.captionBold, color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
                                New Monthly EMI
                            </Text>
                            <Text style={{ fontSize: 48, fontWeight: '800', color: Colors.brand.emerald, letterSpacing: -1 }}>
                                {formatAED(Math.round(dynamicEmi))}
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 24, paddingTop: 24, paddingBottom: 16, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>{formatAED(Math.round(dynamicMonthlySavings))}</Text>
                                    <Text style={{ ...Typography.caption, color: theme.colors.textTertiary, marginTop: 4 }}>/mo savings</Text>
                                </View>
                                <View style={{ width: 1, backgroundColor: theme.colors.border }} />
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={{ ...Typography.h3, color: theme.colors.textPrimary }}>{formatAED(Math.round(dynamicGrossTotalSavings))}</Text>
                                    <Text style={{ ...Typography.caption, color: theme.colors.textTertiary, marginTop: 4 }}>Gross savings</Text>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: theme.colors.bg, borderRadius: BorderRadius.md }}>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>Net Savings (After {formatAED(parseFloat(params.processingFee || '0'))} Fee)</Text>
                                <Text style={{ ...Typography.captionBold, color: Colors.brand.emerald }}>{formatAED(Math.round(dynamicTotalSavings))}</Text>
                            </View>
                        </View>

                        <TenureSlider
                            tenure={selectedTenure}
                            onTenureChange={setSelectedTenure}
                            maxTenureMonths={params.maxTenureMonths ? parseInt(params.maxTenureMonths) : 48}
                        />
                    </ScrollView>

                    {/* Step 1: Contact Info */}
                    <ScrollView
                        style={{ width: SCREEN_WIDTH }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                            Contact Details
                        </Text>
                        <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                            How should the bank reach you?
                        </Text>

                        {/* Apply Summary Card */}
                        <View style={{
                            backgroundColor: Colors.brand.emerald + '10',
                            borderRadius: BorderRadius.lg,
                            padding: 16,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: Colors.brand.emerald + '20',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                        }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: Colors.brand.emerald + '20',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Ionicons name="business-outline" size={20} color={Colors.brand.emerald} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                                    {params.bankName}
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                    {params.productName} · Save {formatAED(edgeOfferData?.monthly_savings || parseFloat(params.monthlySavings || '0'))}/mo
                                </Text>
                            </View>
                        </View>

                        {/* Phone */}
                        <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                            Phone Number *
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: formData.phone.length >= 9 ? Colors.brand.emerald + '40' : theme.colors.border,
                            paddingHorizontal: 14,
                            marginBottom: 20,
                        }}>
                            <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginRight: 8 }}>
                                +971
                            </Text>
                            <View style={{ width: 1, height: 24, backgroundColor: theme.colors.border, marginRight: 8 }} />
                            <TextInput
                                value={formData.phone}
                                onChangeText={t => setFormData(p => ({ ...p, phone: t.replace(/[^0-9]/g, '') }))}
                                placeholder="50 123 4567"
                                placeholderTextColor={theme.colors.textTertiary}
                                keyboardType="phone-pad"
                                maxLength={10}
                                style={{
                                    flex: 1,
                                    height: 52,
                                    ...Typography.body,
                                    color: theme.colors.textPrimary,
                                }}
                            />
                            {formData.phone.length >= 9 && (
                                <Ionicons name="checkmark-circle" size={20} color={Colors.brand.emerald} />
                            )}
                        </View>

                        {/* Callback Time */}
                        <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                            Preferred Callback Time
                        </Text>
                        <View style={{ gap: 8, marginBottom: 20 }}>
                            {CALLBACK_TIMES.map(ct => (
                                <TouchableOpacity
                                    key={ct.key}
                                    onPress={() => { hapticSelection(); setFormData(p => ({ ...p, callbackTime: ct.key })); }}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 12,
                                        padding: 14,
                                        backgroundColor: formData.callbackTime === ct.key
                                            ? Colors.brand.emerald + '10'
                                            : theme.colors.card,
                                        borderRadius: BorderRadius.md,
                                        borderWidth: 1,
                                        borderColor: formData.callbackTime === ct.key
                                            ? Colors.brand.emerald + '40'
                                            : theme.colors.border,
                                    }}
                                >
                                    <Ionicons
                                        name={ct.icon as any}
                                        size={22}
                                        color={formData.callbackTime === ct.key
                                            ? Colors.brand.emerald
                                            : theme.colors.textTertiary}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{
                                            ...Typography.bodyBold,
                                            color: formData.callbackTime === ct.key
                                                ? Colors.brand.emerald
                                                : theme.colors.textPrimary,
                                        }}>
                                            {ct.label}
                                        </Text>
                                        <Text style={{ ...Typography.caption, color: theme.colors.textSecondary }}>
                                            {ct.sublabel}
                                        </Text>
                                    </View>
                                    <View style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 11,
                                        borderWidth: 2,
                                        borderColor: formData.callbackTime === ct.key
                                            ? Colors.brand.emerald
                                            : theme.colors.border,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        {formData.callbackTime === ct.key && (
                                            <View style={{
                                                width: 12,
                                                height: 12,
                                                borderRadius: 6,
                                                backgroundColor: Colors.brand.emerald,
                                            }} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Email (pre-filled, read-only) */}
                        <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                            Email
                        </Text>
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            paddingHorizontal: 14,
                            height: 52,
                            justifyContent: 'center',
                            opacity: 0.7,
                        }}>
                            <Text style={{ ...Typography.body, color: theme.colors.textSecondary }}>
                                {user?.email || 'Not available'}
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Step 2: Optional Rich Data */}
                    <ScrollView
                        style={{ width: SCREEN_WIDTH }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                            Boost Your Application
                        </Text>
                        <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                            Optional — but dramatically improves your approval odds
                        </Text>

                        {/* Why Card */}
                        <View style={{
                            backgroundColor: Colors.info + '10',
                            borderRadius: BorderRadius.lg,
                            padding: 16,
                            marginBottom: 24,
                            borderWidth: 1,
                            borderColor: Colors.info + '20',
                            flexDirection: 'row',
                            gap: 12,
                        }}>
                            <Ionicons name="bulb-outline" size={22} color={Colors.info} style={{ marginTop: 2 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 4 }}>
                                    Why provide this?
                                </Text>
                                <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, lineHeight: 19 }}>
                                    Banks process pre-qualified applications{' '}
                                    <Text style={{ fontWeight: '700', color: Colors.brand.emerald }}>3x faster</Text>
                                    . Providing salary and employer info lets them make instant pre-approval decisions.
                                </Text>
                            </View>
                        </View>

                        {/* Salary */}
                        <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                            Monthly Salary (AED)
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            paddingHorizontal: 14,
                            marginBottom: 6,
                        }}>
                            <Text style={{ ...Typography.body, color: theme.colors.textTertiary, marginRight: 8 }}>
                                AED
                            </Text>
                            <TextInput
                                value={formData.salary}
                                onChangeText={t => setFormData(p => ({ ...p, salary: t.replace(/[^0-9]/g, '') }))}
                                placeholder="e.g. 15000"
                                placeholderTextColor={theme.colors.textTertiary}
                                keyboardType="numeric"
                                style={{
                                    flex: 1,
                                    height: 52,
                                    ...Typography.body,
                                    color: theme.colors.textPrimary,
                                }}
                            />
                        </View>
                        <Text style={{
                            ...Typography.caption,
                            color: theme.colors.textTertiary,
                            marginBottom: 20,
                            fontStyle: 'italic',
                        }}>
                            Helps bank calculate your eligibility instantly
                        </Text>

                        {/* Employer */}
                        <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 6 }}>
                            Employer Name
                        </Text>
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                            paddingHorizontal: 14,
                            marginBottom: 6,
                        }}>
                            <TextInput
                                value={formData.employer}
                                onChangeText={t => setFormData(p => ({ ...p, employer: t }))}
                                placeholder="e.g. Emirates Airlines"
                                placeholderTextColor={theme.colors.textTertiary}
                                style={{
                                    height: 52,
                                    ...Typography.body,
                                    color: theme.colors.textPrimary,
                                }}
                            />
                        </View>
                        <Text style={{
                            ...Typography.caption,
                            color: theme.colors.textTertiary,
                            marginBottom: 20,
                            fontStyle: 'italic',
                        }}>
                            Banks verify employment to fast-track applications
                        </Text>

                        {/* Skip Info */}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            marginTop: 12,
                        }}>
                            <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.textTertiary} />
                            <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                                All data is encrypted and only shared with the bank you apply to
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Step 3: Review & Consent */}
                    <ScrollView
                        style={{ width: SCREEN_WIDTH }}
                        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ ...Typography.h1, color: theme.colors.textPrimary, marginBottom: 4 }}>
                            Review & Submit
                        </Text>
                        <Text style={{ ...Typography.body, color: theme.colors.textSecondary, marginBottom: 24 }}>
                            Check your details before submitting
                        </Text>

                        {/* Review Card */}
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            overflow: 'hidden',
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}>
                            <LinearGradient
                                colors={[Colors.brand.emerald + '15', 'transparent']}
                                style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
                            >
                                <Text style={{ ...Typography.captionBold, color: Colors.brand.emerald, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Application Summary
                                </Text>
                            </LinearGradient>

                            <ReviewRow label="Bank" value={params.bankName || ''} theme={theme} icon="business-outline" />
                            <ReviewRow label="Product" value={params.productName || ''} theme={theme} icon="card-outline" />
                            <ReviewRow label="New Rate" value={`${params.newRate || '0'}%`} theme={theme} icon="trending-down-outline" />
                            <ReviewRow label="Target Tenure" value={`${selectedTenure} months`} theme={theme} icon="calendar-outline" />
                            <ReviewRow label="Monthly Savings" value={formatAED(dynamicMonthlySavings)} theme={theme} icon="cash-outline" highlight />
                            <ReviewRow label="Gross Savings" value={formatAED(dynamicGrossTotalSavings)} theme={theme} icon="wallet-outline" />
                            <ReviewRow label="Processing Fee" value={`- ${formatAED(parseFloat(params.processingFee || '0'))}`} theme={theme} icon="calculator-outline" />
                            <ReviewRow label="Net Savings" value={formatAED(dynamicTotalSavings)} theme={theme} icon="trophy-outline" highlight isLast />
                        </View>

                        {/* Contact Details Card */}
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            overflow: 'hidden',
                            marginBottom: 16,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}>
                            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
                                <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Your Details
                                </Text>
                            </View>

                            <ReviewRow label="Email" value={user?.email || ''} theme={theme} icon="mail-outline" />
                            <ReviewRow label="Phone" value={`+971 ${formData.phone}`} theme={theme} icon="call-outline" />
                            {formData.callbackTime ? (
                                <ReviewRow label="Callback" value={CALLBACK_TIMES.find(c => c.key === formData.callbackTime)?.label || ''} theme={theme} icon="time-outline" />
                            ) : null}
                            {formData.salary ? (
                                <ReviewRow label="Salary" value={`AED ${parseInt(formData.salary).toLocaleString()}`} theme={theme} icon="cash-outline" />
                            ) : null}
                            {formData.employer ? (
                                <ReviewRow label="Employer" value={formData.employer} theme={theme} icon="briefcase-outline" isLast />
                            ) : (
                                <ReviewRow label="" value="" theme={theme} icon="" isLast />
                            )}
                        </View>

                        {/* Consent */}
                        <TouchableOpacity
                            onPress={() => setFormData(p => ({ ...p, consent: !p.consent }))}
                            activeOpacity={0.7}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: 16,
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                borderWidth: 1,
                                borderColor: formData.consent ? Colors.brand.emerald + '40' : theme.colors.border,
                            }}
                        >
                            <View style={{
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                borderWidth: 2,
                                borderColor: formData.consent ? Colors.brand.emerald : theme.colors.border,
                                backgroundColor: formData.consent ? Colors.brand.emerald : 'transparent',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 1,
                            }}>
                                {formData.consent && (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                )}
                            </View>
                            <Text style={{
                                flex: 1,
                                ...Typography.caption,
                                color: theme.colors.textSecondary,
                                lineHeight: 20,
                            }}>
                                I agree to share my contact details with{' '}
                                <Text style={{ fontWeight: '600', color: theme.colors.textPrimary }}>
                                    {params.bankName}
                                </Text>
                                {' '}for the purpose of processing my refinance application. I have read and accept the{' '}
                                <Text style={{ color: Colors.brand.emerald, fontWeight: '600' }}>
                                    Terms & Conditions
                                </Text>
                                {' '}and{' '}
                                <Text style={{ color: Colors.brand.emerald, fontWeight: '600' }}>
                                    Privacy Policy
                                </Text>.
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Animated.View>
            </KeyboardAvoidingView>

            {/* Bottom Action Button */}
            <View style={{
                paddingHorizontal: 20,
                paddingBottom: 34,
                paddingTop: 12,
                backgroundColor: theme.colors.bg,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (step === 0) animateToStep(1);
                        else if (step === 1 && canProceedStep0) animateToStep(2);
                        else if (step === 2) animateToStep(3);
                        else if (step === 3 && canProceedStep2) handleSubmit();
                    }}
                    activeOpacity={0.8}
                    disabled={
                        (step === 1 && !canProceedStep0) ||
                        (step === 3 && !canProceedStep2) ||
                        submitting
                    }
                >
                    <LinearGradient
                        colors={
                            (step === 1 && !canProceedStep0) || (step === 3 && !canProceedStep2)
                                ? ['#94A3B8', '#64748B']
                                : [Colors.brand.emerald, Colors.brand.emeraldDark]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            borderRadius: BorderRadius.md,
                            height: 56,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                        }}
                    >
                        {submitting ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <>
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                                    {step === 3 ? 'Submit Application' : 'Continue'}
                                </Text>
                                <Ionicons
                                    name={step === 3 ? 'checkmark-circle' : 'arrow-forward'}
                                    size={20}
                                    color="#fff"
                                />
                            </>
                        )}
                    </LinearGradient>
                </TouchableOpacity>

                {step === 2 && (
                    <TouchableOpacity
                        onPress={() => animateToStep(3)}
                        style={{ alignItems: 'center', marginTop: 12 }}
                    >
                        <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                            Skip for now →
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

// ─── Helper Components ──────────────────────────────────────────────────────
function ReviewRow({
    label, value, theme, icon, highlight = false, isLast = false,
}: {
    label: string; value: string; theme: any; icon: string;
    highlight?: boolean; isLast?: boolean;
}) {
    if (!label && !value) return null;
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.colors.border,
        }}>
            <Ionicons name={icon as any} size={18} color={highlight ? Colors.brand.emerald : theme.colors.textTertiary} style={{ marginRight: 12 }} />
            <Text style={{
                ...Typography.caption,
                color: theme.colors.textSecondary,
                flex: 1,
            }}>
                {label}
            </Text>
            <Text style={{
                ...Typography.bodyBold,
                color: highlight ? Colors.brand.emerald : theme.colors.textPrimary,
            }}>
                {value}
            </Text>
        </View>
    );
}
