import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import type { Theme } from '@/lib/theme-context';
import SuccessModal from '@/components/SuccessModal';

import { useAddLoan, formatWithCommas, stripCommas } from '@/hooks/useAddLoan';
import BankPicker from '@/components/add-loan/BankPicker';
import LoanTypeSelector from '@/components/add-loan/LoanTypeSelector';
import FormInput from '@/components/add-loan/FormInput';
import DatePickerModal from '@/components/add-loan/DatePickerModal';

function labelStyle(theme: Theme) {
    return {
        fontSize: 13,
        fontWeight: '600' as const,
        color: theme.colors.textSecondary,
        marginBottom: 8,
    };
}

export default function AddLoanScreen() {
    const { theme } = useTheme();
    const emiInfoRef = useRef<any>(null);
    const [showEmiPopover, setShowEmiPopover] = useState(false);

    const {
        banks,
        loadingBanks,
        saving,
        selectedBank,
        setSelectedBank,
        showBankPicker,
        setShowBankPicker,
        customBankName,
        setCustomBankName,
        loanType,
        setLoanType,
        originalAmount,
        setOriginalAmount,
        remainingAmount,
        setRemainingAmount,
        interestRate,
        setInterestRate,
        monthlyEmi,
        setMonthlyEmi,
        tenureMonths,
        setTenureMonths,
        selectedYear,
        setSelectedYear,
        selectedMonth,
        setSelectedMonth,
        showDatePicker,
        setShowDatePicker,
        showSuccess,
        setShowSuccess,
        savedLoanSummary,
        handleSave,
        resetForm,
        formattedDate,
        years,
    } = useAddLoan();

    // Wizard of Oz Prefill Logic
    const { prefill } = useLocalSearchParams<{ prefill?: string }>();
    useEffect(() => {
        if (prefill === 'true' && banks.length > 0) {
            setLoanType('personal');
            setOriginalAmount('200000');
            setRemainingAmount('150000');
            setInterestRate('8.49');
            setTenureMonths('48');
            const enbd = banks.find(b => b.name.includes('Emirates NBD'));
            if (enbd) {
                setSelectedBank(enbd);
            } else {
                setCustomBankName('Emirates NBD');
            }
        }
    }, [prefill, banks, setCustomBankName, setInterestRate, setLoanType, setOriginalAmount, setRemainingAmount, setSelectedBank, setTenureMonths]);

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
                        Add Debt
                    </Text>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView
                    contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <BankPicker
                        theme={theme}
                        banks={banks}
                        loadingBanks={loadingBanks}
                        selectedBank={selectedBank}
                        setSelectedBank={setSelectedBank}
                        showBankPicker={showBankPicker}
                        setShowBankPicker={setShowBankPicker}
                        customBankName={customBankName}
                        setCustomBankName={setCustomBankName}
                        labelStyle={labelStyle(theme)}
                    />

                    <LoanTypeSelector
                        theme={theme}
                        loanType={loanType}
                        setLoanType={setLoanType}
                        labelStyle={labelStyle(theme)}
                    />

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
                                    placement={PopoverPlacement.BOTTOM}
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
                                        Auto-calculated
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: theme.colors.textSecondary,
                                            lineHeight: 18,
                                        }}
                                    >
                                        Based on your remaining balance, rate, and tenure using the standard banking formula
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
                            <View style={{ opacity: 0.7 }}>
                                <FormInput
                                    theme={theme}
                                    placeholder="2,800"
                                    value={formatWithCommas(monthlyEmi)}
                                    onChangeText={(t) => setMonthlyEmi(stripCommas(t))}
                                    keyboardType="numeric"
                                    editable={false}
                                />
                            </View>
                            {monthlyEmi ? (
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: Colors.brand.emerald,
                                        fontWeight: '500',
                                        marginTop: -12,
                                        marginBottom: 4,
                                    }}
                                >
                                    ✓ Auto-calculated
                                </Text>
                            ) : null}
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
                                Add Debt
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <DatePickerModal
                theme={theme}
                showDatePicker={showDatePicker}
                setShowDatePicker={setShowDatePicker}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                years={years}
            />

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
