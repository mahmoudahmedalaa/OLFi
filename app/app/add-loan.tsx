import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateEMI } from '@/lib/refinance-calculator';
import SuccessModal from '@/components/SuccessModal';

const LOAN_TYPES = [
    { key: 'personal', label: 'Personal Loan', icon: 'person' as const },
    { key: 'auto', label: 'Auto Loan', icon: 'car' as const },
    { key: 'mortgage', label: 'Mortgage', icon: 'home' as const },
    { key: 'credit_card', label: 'Credit Card', icon: 'card' as const },
    { key: 'business', label: 'Business', icon: 'briefcase' as const },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' as const },
];

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface Bank {
    id: string;
    name: string;
    is_islamic: boolean;
}

// ─── Number formatting helpers ───────────────────────────────────────
function formatWithCommas(value: string): string {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

function stripCommas(value: string): string {
    return value.replace(/,/g, '');
}

export default function AddLoanScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();

    const [banks, setBanks] = useState<Bank[]>([]);
    const [loadingBanks, setLoadingBanks] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [showBankPicker, setShowBankPicker] = useState(false);
    const [customBankName, setCustomBankName] = useState('');
    const [loanType, setLoanType] = useState('personal');
    const [originalAmount, setOriginalAmount] = useState('');
    const [remainingAmount, setRemainingAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyEmi, setMonthlyEmi] = useState('');
    const [tenureMonths, setTenureMonths] = useState('');

    // Date picker state
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // EMI popover
    const [showEmiPopover, setShowEmiPopover] = useState(false);
    const emiInfoRef = useRef<any>(null);

    // Success modal
    const [showSuccess, setShowSuccess] = useState(false);
    const [savedLoanSummary, setSavedLoanSummary] = useState<{
        bankName: string;
        loanType: string;
        amount: number;
        rate: number;
        emi: number;
    } | null>(null);

    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = async () => {
        try {
            const { data, error } = await supabase
                .from('banks')
                .select('id, name, is_islamic')
                .order('name');
            if (error) throw error;
            setBanks(data || []);
        } catch (e) {
            console.error('Failed to fetch banks:', e);
        } finally {
            setLoadingBanks(false);
        }
    };

    // Auto-calculate EMI when principal, rate, and tenure are provided
    useEffect(() => {
        const p = Number(stripCommas(remainingAmount));
        const r = Number(interestRate);
        const t = Number(tenureMonths);

        if (p > 0 && r > 0 && t > 0) {
            const emi = calculateEMI(p, r, t);
            // Don't overwrite if the user is currently typing something that matches closely, 
            // but setting it directly overrides manual entry to ensure mathematical accuracy.
            setMonthlyEmi(Math.round(emi).toString());
        }
    }, [remainingAmount, interestRate, tenureMonths]);

    const validate = (): string | null => {
        if (!selectedBank && !customBankName.trim()) return 'Please select or enter a bank name';
        const origRaw = stripCommas(originalAmount);
        const remRaw = stripCommas(remainingAmount);
        const emiRaw = stripCommas(monthlyEmi);
        if (!origRaw || Number(origRaw) <= 0) return 'Please enter the original loan amount';
        if (!remRaw || Number(remRaw) < 0) return 'Please enter the remaining amount';
        if (!interestRate || Number(interestRate) <= 0) return 'Please enter the interest rate';
        if (!emiRaw || Number(emiRaw) <= 0) return 'Please enter the monthly EMI';
        if (!tenureMonths || Number(tenureMonths) <= 0) return 'Please enter the loan tenure';
        return null;
    };

    const resetForm = () => {
        setSelectedBank(null);
        setCustomBankName('');
        setLoanType('personal');
        setOriginalAmount('');
        setRemainingAmount('');
        setInterestRate('');
        setMonthlyEmi('');
        setTenureMonths('');
        setSelectedYear(new Date().getFullYear());
        setSelectedMonth(new Date().getMonth());
    };

    const handleSave = async () => {
        const err = validate();
        if (err) {
            Alert.alert('Validation Error', err);
            return;
        }
        if (!user) {
            Alert.alert('Error', 'You must be logged in');
            return;
        }

        setSaving(true);
        try {
            const tenure = Number(tenureMonths);
            const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
            const endDate = new Date(selectedYear, selectedMonth + tenure, 1);
            const endStr = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-01`;

            const bankName = selectedBank?.name || customBankName.trim();
            const origAmt = Number(stripCommas(originalAmount));
            const emiAmt = Number(stripCommas(monthlyEmi));
            const rate = Number(interestRate);

            const { error } = await supabase.from('user_loans').insert({
                user_id: user.id,
                bank_id: selectedBank?.id || null,
                bank_name: bankName,
                loan_type: loanType,
                original_amount: origAmt,
                remaining_amount: Number(stripCommas(remainingAmount)),
                interest_rate: rate,
                monthly_emi: emiAmt,
                tenure_months: tenure,
                start_date: startDate,
                end_date: endStr,
                status: 'active',
            });

            if (error) throw error;

            // Show premium success modal instead of Alert
            setSavedLoanSummary({
                bankName,
                loanType,
                amount: origAmt,
                rate,
                emi: emiAmt,
            });
            setShowSuccess(true);
        } catch (e: any) {
            Alert.alert('Error', e.message || 'Failed to save loan');
        } finally {
            setSaving(false);
        }
    };

    const formattedDate = `${MONTHS[selectedMonth]} ${selectedYear}`;

    // Generate year options — 40 years back, 1 year forward (covers loans from 1987+)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 42 }, (_, i) => currentYear - 40 + i);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border,
                    }}
                >
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Add Loan
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bank Picker */}
                    <Text style={labelStyle(theme)}>Bank</Text>
                    <TouchableOpacity
                        onPress={() => setShowBankPicker(!showBankPicker)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            paddingHorizontal: 16,
                            height: 52,
                            marginBottom: showBankPicker ? 8 : 16,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 15,
                                color: selectedBank
                                    ? theme.colors.textPrimary
                                    : theme.colors.textDisabled,
                            }}
                        >
                            {selectedBank?.name || 'Select a bank'}
                        </Text>
                        <Ionicons
                            name={showBankPicker ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color={theme.colors.textTertiary}
                        />
                    </TouchableOpacity>

                    {showBankPicker && (
                        <View
                            style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.md,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                marginBottom: 16,
                                overflow: 'hidden',
                                maxHeight: 250,
                            }}
                        >
                            <ScrollView nestedScrollEnabled>
                                {loadingBanks ? (
                                    <ActivityIndicator
                                        style={{ padding: 20 }}
                                        color={Colors.brand.emerald}
                                    />
                                ) : (
                                    <>
                                        {banks.map((bank) => (
                                            <TouchableOpacity
                                                key={bank.id}
                                                onPress={() => {
                                                    setSelectedBank(bank);
                                                    setCustomBankName('');
                                                    setShowBankPicker(false);
                                                }}
                                                style={{
                                                    padding: 14,
                                                    paddingHorizontal: 16,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: theme.colors.border,
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    backgroundColor:
                                                        selectedBank?.id === bank.id
                                                            ? `${Colors.brand.emerald}10`
                                                            : 'transparent',
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                    <Text style={{ fontSize: 15, color: theme.colors.textPrimary }}>
                                                        {bank.name}
                                                    </Text>
                                                    {bank.is_islamic && (
                                                        <View
                                                            style={{
                                                                backgroundColor: `${Colors.brand.teal}20`,
                                                                paddingHorizontal: 6,
                                                                paddingVertical: 2,
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 10,
                                                                    fontWeight: '600',
                                                                    color: Colors.brand.teal,
                                                                }}
                                                            >
                                                                Islamic
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                {selectedBank?.id === bank.id && (
                                                    <Ionicons
                                                        name="checkmark"
                                                        size={18}
                                                        color={Colors.brand.emerald}
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                        <TouchableOpacity
                                            onPress={() => {
                                                setSelectedBank(null);
                                                setShowBankPicker(false);
                                            }}
                                            style={{
                                                padding: 14,
                                                paddingHorizontal: 16,
                                            }}
                                        >
                                            <Text style={{ fontSize: 15, color: theme.colors.textSecondary }}>
                                                Other (type below)
                                            </Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </ScrollView>
                        </View>
                    )}

                    {!selectedBank && (
                        <>
                            <Text style={labelStyle(theme)}>Bank Name (custom)</Text>
                            <FormInput
                                theme={theme}
                                placeholder="Enter bank name"
                                value={customBankName}
                                onChangeText={setCustomBankName}
                            />
                        </>
                    )}

                    {/* Loan Type */}
                    <Text style={labelStyle(theme)}>Loan Type</Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 8,
                            marginBottom: 16,
                        }}
                    >
                        {LOAN_TYPES.map((lt) => {
                            const isActive = loanType === lt.key;
                            return (
                                <TouchableOpacity
                                    key={lt.key}
                                    onPress={() => setLoanType(lt.key)}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 20,
                                        backgroundColor: isActive
                                            ? Colors.brand.emerald
                                            : theme.colors.card,
                                        borderWidth: isActive ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={lt.icon}
                                        size={14}
                                        color={isActive ? '#fff' : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: isActive ? '#fff' : theme.colors.textSecondary,
                                        }}
                                    >
                                        {lt.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Amount fields with comma formatting */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle(theme)}>Original Amount (AED)</Text>
                            <FormInput
                                theme={theme}
                                placeholder="150,000"
                                value={formatWithCommas(originalAmount)}
                                onChangeText={(t) => setOriginalAmount(stripCommas(t))}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle(theme)}>Remaining (AED)</Text>
                            <FormInput
                                theme={theme}
                                placeholder="120,000"
                                value={formatWithCommas(remainingAmount)}
                                onChangeText={(t) => setRemainingAmount(stripCommas(t))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Rate + EMI with popover */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle(theme)}>Interest Rate</Text>
                            {/* Input with % suffix */}
                            <View
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.md,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        color: theme.colors.textPrimary,
                                    }}
                                    placeholder="5.49"
                                    placeholderTextColor={theme.colors.textDisabled}
                                    value={interestRate}
                                    onChangeText={setInterestRate}
                                    keyboardType="numeric"
                                />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: interestRate
                                            ? Colors.brand.emerald
                                            : theme.colors.textDisabled,
                                        marginLeft: 4,
                                    }}
                                >
                                    %
                                </Text>
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        fontWeight: '600',
                                        color: theme.colors.textSecondary,
                                    }}
                                >
                                    Monthly EMI (AED)
                                </Text>
                                <Popover
                                    isVisible={showEmiPopover}
                                    onRequestClose={() => setShowEmiPopover(false)}
                                    from={emiInfoRef}
                                    placement={PopoverPlacement.TOP}
                                    popoverStyle={{
                                        backgroundColor: theme.colors.cardElevated,
                                        borderRadius: BorderRadius.md,
                                        padding: 16,
                                        maxWidth: 260,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                    }}
                                    backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                                    arrowSize={{ width: 16, height: 8 }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '700',
                                            color: theme.colors.textPrimary,
                                            marginBottom: 6,
                                        }}
                                    >
                                        EMI (Equated Monthly Instalment)
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.textSecondary,
                                            lineHeight: 18,
                                        }}
                                    >
                                        The fixed amount you pay every month to your bank. You can find this on your bank statement or mobile banking app.
                                    </Text>
                                </Popover>
                                <TouchableOpacity
                                    ref={emiInfoRef}
                                    onPress={() => setShowEmiPopover(true)}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons
                                        name="help-circle"
                                        size={16}
                                        color={Colors.brand.emerald}
                                    />
                                </TouchableOpacity>
                            </View>
                            <FormInput
                                theme={theme}
                                placeholder="2,800"
                                value={formatWithCommas(monthlyEmi)}
                                onChangeText={(t) => setMonthlyEmi(stripCommas(t))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    {/* Tenure + Start Date with picker */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle(theme)}>Tenure (months)</Text>
                            <FormInput
                                theme={theme}
                                placeholder="60"
                                value={tenureMonths}
                                onChangeText={setTenureMonths}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={labelStyle(theme)}>Start Date</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={{
                                    backgroundColor: theme.colors.card,
                                    borderRadius: BorderRadius.md,
                                    paddingHorizontal: 16,
                                    height: 52,
                                    justifyContent: 'center',
                                    marginBottom: 16,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons
                                    name="calendar-outline"
                                    size={18}
                                    color={theme.colors.textTertiary}
                                    style={{ marginRight: 10 }}
                                />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        color: theme.colors.textPrimary,
                                        flex: 1,
                                    }}
                                >
                                    {formattedDate}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        disabled={saving}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: Colors.brand.emerald,
                            borderRadius: BorderRadius.md,
                            height: 52,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 8,
                        }}
                    >
                        {saving ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '600',
                                    color: '#fff',
                                }}
                            >
                                Add Loan
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ─── Month/Year Date Picker Modal ───────────────────────────── */}
            <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
                    activeOpacity={1}
                    onPress={() => setShowDatePicker(false)}
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View
                            style={{
                                backgroundColor: theme.colors.bg,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                                paddingBottom: 40,
                            }}
                        >
                            {/* Handle */}
                            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                                <View
                                    style={{
                                        width: 36,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: theme.colors.border,
                                    }}
                                />
                            </View>

                            {/* Header */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: 20,
                                    paddingBottom: 16,
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: theme.colors.textPrimary,
                                    }}
                                >
                                    Select Start Date
                                </Text>
                                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: '600',
                                            color: Colors.brand.emerald,
                                        }}
                                    >
                                        Done
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Year selector */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{
                                    paddingHorizontal: 16,
                                    gap: 8,
                                    paddingBottom: 16,
                                }}
                            >
                                {years.map((y) => (
                                    <TouchableOpacity
                                        key={y}
                                        onPress={() => setSelectedYear(y)}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor:
                                                selectedYear === y
                                                    ? Colors.brand.emerald
                                                    : theme.colors.card,
                                            borderWidth: selectedYear === y ? 0 : 1,
                                            borderColor: theme.colors.border,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '600',
                                                color: selectedYear === y ? '#fff' : theme.colors.textSecondary,
                                            }}
                                        >
                                            {y}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Month grid */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    paddingHorizontal: 16,
                                    gap: 8,
                                }}
                            >
                                {MONTHS.map((m, i) => (
                                    <TouchableOpacity
                                        key={m}
                                        onPress={() => setSelectedMonth(i)}
                                        style={{
                                            width: '30%',
                                            paddingVertical: 12,
                                            borderRadius: BorderRadius.md,
                                            alignItems: 'center',
                                            backgroundColor:
                                                selectedMonth === i
                                                    ? Colors.brand.emerald
                                                    : theme.colors.card,
                                            borderWidth: selectedMonth === i ? 0 : 1,
                                            borderColor: theme.colors.border,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '500',
                                                color:
                                                    selectedMonth === i
                                                        ? '#fff'
                                                        : theme.colors.textPrimary,
                                            }}
                                        >
                                            {m.slice(0, 3)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            {/* ─── Success Modal ─────────────────────────────────────────── */}
            <SuccessModal
                visible={showSuccess}
                loanSummary={savedLoanSummary}
                onViewDashboard={() => {
                    setShowSuccess(false);
                    router.back();
                }}
                onAddAnother={() => {
                    setShowSuccess(false);
                    resetForm();
                }}
            />
        </SafeAreaView>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function labelStyle(theme: ReturnType<typeof useTheme>['theme']) {
    return {
        fontSize: 13,
        fontWeight: '600' as const,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    };
}

function FormInput({
    theme,
    placeholder,
    value,
    onChangeText,
    keyboardType,
}: {
    theme: ReturnType<typeof useTheme>['theme'];
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'numeric' | 'default';
}) {
    return (
        <View
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                paddingHorizontal: 16,
                height: 52,
                justifyContent: 'center',
                marginBottom: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <TextInput
                style={{
                    fontSize: 15,
                    color: theme.colors.textPrimary,
                }}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textDisabled}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType || 'default'}
            />
        </View>
    );
}
