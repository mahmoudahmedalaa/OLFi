import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { calculateEMI } from '@/lib/refinance-calculator';

export interface Bank {
    id: string;
    name: string;
    is_islamic: boolean;
}

export const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

export function stripCommas(value: string): string {
    return value.replace(/,/g, '');
}

export function formatWithCommas(value: string): string {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${parts[0]}.${parts[1]}` : parts[0];
}

export function useAddLoan() {
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

    // Success modal state
    const [showSuccess, setShowSuccess] = useState(false);
    const [savedLoanSummary, setSavedLoanSummary] = useState<{
        bankName: string;
        loanType: string;
        amount: number;
        rate: number;
        emi: number;
    } | null>(null);

    const fetchBanks = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    // Auto-calculate EMI when principal, rate, and tenure are provided
    useEffect(() => {
        const p = Number(stripCommas(remainingAmount));
        const r = Number(interestRate);
        const t = Number(tenureMonths);

        if (p > 0 && r > 0 && t > 0) {
            const emi = calculateEMI(p, r, t);
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

    const resetForm = useCallback(() => {
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
    }, []);

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
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 42 }, (_, i) => currentYear - 40 + i);

    return {
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
    };
}
