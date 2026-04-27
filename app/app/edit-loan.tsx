import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateEMI } from '@/lib/refinance-calculator';

const LOAN_TYPES = [
    { key: 'personal', label: 'Personal', icon: 'person-outline' },
    { key: 'auto', label: 'Auto', icon: 'car-outline' },
];

export default function EditLoanScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams<{ loanId: string }>();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loanType, setLoanType] = useState('personal');
    const [bankName, setBankName] = useState('');
    const [originalAmount, setOriginalAmount] = useState('');
    const [remainingAmount, setRemainingAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyEmi, setMonthlyEmi] = useState('');
    const [tenureMonths, setTenureMonths] = useState('');

    const fetchLoan = useCallback(async () => {
        if (!user || !params.loanId) return;
        try {
            const { data, error } = await supabase
                .from('user_loans')
                .select('*')
                .eq('id', params.loanId)
                .eq('user_id', user.id)
                .single();

            if (error) throw error;
            if (data) {
                setLoanType(data.loan_type);
                setBankName(data.bank_name || '');
                setOriginalAmount(String(data.original_amount));
                setRemainingAmount(String(data.remaining_amount));
                setInterestRate(String(data.interest_rate));
                setMonthlyEmi(String(data.monthly_emi));
                setTenureMonths(String(data.tenure_months));
            }
        } catch (e) {
            console.error('Failed to fetch loan:', e);
            Alert.alert('Error', 'Could not load loan details.');
            router.back();
        } finally {
            setLoading(false);
        }
    }, [user, params.loanId]);

    useEffect(() => {
        fetchLoan();
    }, [fetchLoan]);

    // Auto-calculate EMI when principal, rate, and tenure change
    useEffect(() => {
        const p = Number(remainingAmount.replace(/,/g, ''));
        const r = Number(interestRate);
        const t = Number(tenureMonths);

        if (p > 0 && r > 0 && t > 0) {
            const emi = calculateEMI(p, r, t);
            setMonthlyEmi(Math.round(emi).toString());
        }
    }, [remainingAmount, interestRate, tenureMonths]);

    const handleSave = async () => {
        if (!originalAmount || !remainingAmount || !interestRate || !monthlyEmi || !tenureMonths) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase
                .from('user_loans')
                .update({
                    loan_type: loanType,
                    bank_name: bankName || null,
                    original_amount: parseFloat(originalAmount),
                    remaining_amount: parseFloat(remainingAmount),
                    interest_rate: parseFloat(interestRate),
                    monthly_emi: parseFloat(monthlyEmi),
                    tenure_months: parseInt(tenureMonths),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', params.loanId)
                .eq('user_id', user?.id);

            if (error) throw error;
            router.back();
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to update loan.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 12, letterSpacing: 0.3 }}>your debt, rewritten</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                        Edit Loan
                    </Text>
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
                >
                    {/* Loan Type */}
                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                        Loan Type
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24, marginHorizontal: -4 }}>
                        {LOAN_TYPES.map((type) => {
                            const isSelected = loanType === type.key;
                            return (
                                <TouchableOpacity
                                    key={type.key}
                                    onPress={() => setLoanType(type.key)}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        backgroundColor: isSelected ? Colors.brand.emerald : theme.colors.card,
                                        borderWidth: isSelected ? 0 : 1,
                                        borderColor: theme.colors.border,
                                        marginHorizontal: 4,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                    }}
                                >
                                    <Ionicons name={type.icon as any} size={16} color={isSelected ? '#fff' : theme.colors.textSecondary} />
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: isSelected ? '#fff' : theme.colors.textSecondary }}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Form Fields */}
                    <FormField label="Bank Name" value={bankName} onChangeText={setBankName} placeholder="e.g. Emirates NBD" theme={theme} icon="business-outline" />
                    <FormField label="Original Amount (AED)" value={originalAmount} onChangeText={setOriginalAmount} placeholder="500000" theme={theme} icon="wallet-outline" keyboardType="numeric" />
                    <FormField label="Remaining Amount (AED)" value={remainingAmount} onChangeText={setRemainingAmount} placeholder="350000" theme={theme} icon="trending-down-outline" keyboardType="numeric" />

                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <FormField
                                label="Profit Rate"
                                value={interestRate}
                                onChangeText={setInterestRate}
                                placeholder="5.99"
                                theme={theme}
                                icon="analytics-outline"
                                keyboardType="numeric"
                                suffix="%"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <FormField
                                label="Monthly EMI (AED)"
                                value={monthlyEmi}
                                onChangeText={setMonthlyEmi}
                                placeholder="4500"
                                theme={theme}
                                icon="cash-outline"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <FormField label="Tenure (Months)" value={tenureMonths} onChangeText={setTenureMonths} placeholder="48" theme={theme} icon="calendar-outline" keyboardType="numeric" />
                </ScrollView>

                {/* Save Button */}
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    paddingHorizontal: 20,
                    paddingBottom: 34,
                    paddingTop: 12,
                    backgroundColor: theme.colors.bg,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                }}>
                    <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#011819', '#0A2525']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                borderRadius: BorderRadius.md,
                                height: 56,
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                                    Save Changes
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

function FormField({
    label,
    value,
    onChangeText,
    placeholder,
    theme,
    icon,
    keyboardType = 'default',
    suffix,
}: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    theme: any;
    icon: string;
    keyboardType?: 'default' | 'numeric' | 'email-address';
    suffix?: string;
}) {
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary, marginBottom: 8 }}>
                {label}
            </Text>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
            }}>
                <Ionicons name={icon as any} size={18} color={theme.colors.textTertiary} style={{ marginRight: 10 }} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.textDisabled}
                    keyboardType={keyboardType}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        color: theme.colors.textPrimary,
                        paddingVertical: 14,
                    }}
                />
                {suffix && (
                    <Text style={{
                        fontSize: 17,
                        fontWeight: '600',
                        color: value ? Colors.brand.emerald : theme.colors.textDisabled,
                        marginLeft: 4,
                    }}>
                        {suffix}
                    </Text>
                )}
            </View>
        </View>
    );
}
