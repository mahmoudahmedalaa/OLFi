import { useState, useRef, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateEMI } from '@/lib/refinance-calculator';
import { hapticMedium, hapticSuccess } from '@/lib/haptics';
import { trackApplicationSubmitted } from '@/lib/analytics';
import { useApplicationStore } from '@/store/useApplicationStore';

export interface ApplicationData {
    phone: string;
    salary: string;
    employer: string;
    callbackTime: 'morning' | 'afternoon' | 'evening' | '';
    consent: boolean;
}

export const CALLBACK_TIMES = [
    { key: 'morning' as const, label: 'Morning', sublabel: '9AM - 12PM', icon: 'sunny-outline' },
    { key: 'afternoon' as const, label: 'Afternoon', sublabel: '12PM - 5PM', icon: 'partly-sunny-outline' },
    { key: 'evening' as const, label: 'Evening', sublabel: '5PM - 9PM', icon: 'moon-outline' },
];

export function useApplyOffer() {
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

    const totalSteps = 4;

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

    useEffect(() => {
        let isMounted = true;
        const initData = async () => {
            if (!user) return;
            try {
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
                        }
                    }
                }
            } catch (err) {
                console.error('Init error:', err);
            } finally {
                if (isMounted) setVerifyingOffer(false);
            }
        };

        if (verifyingOffer) {
            initData();
        }
        return () => { isMounted = false; };
    }, [user, params, verifyingOffer]);

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
            const applicationPayload = {
                user_id: user.id,
                user_loan_id: params.loanId,
                bank_product_id: params.productId,
                status: 'submitted',
                monthly_savings: dynamicMonthlySavings,
                total_savings: dynamicTotalSavings,
                new_rate: parseFloat(params.newRate || '0'),
                new_emi: dynamicEmi,
                selected_tenure_months: selectedTenure,
            };

            const { error } = await supabase
                .from('refinance_applications')
                .insert(applicationPayload);

            if (error) {
                const message = `${error.message || ''} ${error.details || ''}`;
                if (message.includes('selected_tenure_months')) {
                    const fallbackPayload: Record<string, unknown> = { ...applicationPayload };
                    delete fallbackPayload.selected_tenure_months;
                    const { error: fallbackError } = await supabase
                        .from('refinance_applications')
                        .insert(fallbackPayload);
                    if (fallbackError) throw fallbackError;
                } else {
                    throw error;
                }
            }

            const profileUpdates: any = {};
            if (formData.phone) profileUpdates.phone = formData.phone;
            if (formData.salary) profileUpdates.salary = parseInt(formData.salary.replace(/,/g, ''));
            if (formData.employer) profileUpdates.employer = formData.employer;

            if (Object.keys(profileUpdates).length > 0) {
                const { error: profileError } = await supabase.from('profiles').upsert({
                    id: user.id,
                    ...profileUpdates,
                    updated_at: new Date().toISOString(),
                });
                if (profileError) {
                    console.warn('Application submitted, but profile update failed:', profileError);
                }
            }

            const { error: notificationError } = await supabase.from('notifications').insert({
                user_id: user.id,
                title: 'Application Submitted! 🎉',
                body: `Your refinance application for ${params.bankName} has been submitted. We'll review it shortly.`,
                type: 'offer',
                data: { screen: 'my-applications' },
            });
            if (notificationError) {
                console.warn('Application submitted, but notification insert failed:', notificationError);
            }

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
    const canProceedStep2 = formData.consent;

    return {
        user,
        router,
        params,
        step,
        totalSteps,
        submitting,
        submitted,
        slideAnim,
        successAnim,
        checkmarkScale,
        verifyingOffer,
        edgeOfferData,
        formData,
        setFormData,
        selectedTenure,
        setSelectedTenure,
        dynamicEmi,
        dynamicMonthlySavings,
        dynamicTotalSavings,
        dynamicGrossTotalSavings,
        animateToStep,
        handleSubmit,
        canProceedStep0,
        canProceedStep2,
    };
}
