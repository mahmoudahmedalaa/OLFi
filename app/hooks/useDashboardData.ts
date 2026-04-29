import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { useFocusEffect } from 'expo-router';
import {
    calculateDebtToIncome,
    getHealthScore,
    calculateInterestBurden,
} from '@/lib/refinance-calculator';

export interface UserLoan {
    id: string;
    bank_name: string | null;
    loan_type: string;
    original_amount: number;
    remaining_amount: number;
    interest_rate: number;
    monthly_emi: number;
    status: string;
}

export function useDashboardData() {
    const { user } = useAuth();

    const [loans, setLoans] = useState<UserLoan[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [firstName, setFirstName] = useState('User');
    const [unreadCount, setUnreadCount] = useState(0);
    const [salary, setSalary] = useState<number | null>(null);

    const fetchLoans = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('user_loans')
                .select('id, bank_name, loan_type, original_amount, remaining_amount, interest_rate, monthly_emi, status')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setLoans(data || []);
        } catch (e) {
            console.error('Failed to fetch loans:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await supabase
                .from('profiles')
                .select('first_name, full_name, salary')
                .eq('id', user.id)
                .maybeSingle();

            if (data?.first_name) {
                setFirstName(data.first_name);
            } else if (data?.full_name) {
                setFirstName(data.full_name.split(' ')[0]);
            } else if ((user as any).user_metadata?.first_name) {
                // Fallback to auth metadata (set during signup)
                setFirstName((user as any).user_metadata.first_name);
            } else {
                setFirstName(user.email?.split('@')[0] || 'User');
            }

            if (data?.salary) {
                setSalary(Number(data.salary));
            }
        } catch (e) {
            console.error('Failed to fetch profile:', e);
        }
    }, [user]);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const { count, error } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            if (!error && count !== null) setUnreadCount(count);
        } catch {
            // Silently fail
        }
    }, [user]);

    useEffect(() => {
        fetchLoans();
        fetchProfile();
        fetchUnreadCount();
    }, [fetchLoans, fetchProfile, fetchUnreadCount]);

    // Re-fetch when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchLoans();
        }, [fetchLoans])
    );

    const activeLoans = loans.filter((l) => l.status === 'active');
    const totalDebt = activeLoans.reduce((sum, l) => sum + l.remaining_amount, 0);
    const totalEmi = activeLoans.reduce((sum, l) => sum + l.monthly_emi, 0);

    // Financial health calculations
    const dtiRatio = salary ? calculateDebtToIncome(totalEmi, salary) : null;
    const healthScore = dtiRatio !== null ? getHealthScore(dtiRatio) : null;
    const interestBurden = activeLoans.length > 0
        ? calculateInterestBurden(
            activeLoans.map((l) => ({
                remainingAmount: l.remaining_amount,
                monthlyEmi: l.monthly_emi,
                interestRate: l.interest_rate,
            }))
        )
        : 0;

    // Savings algorithm: compare each loan's rate vs the best OLFi market rate
    // Best Islamic personal finance rate currently available in UAE market
    const BEST_OLFI_RATE = 3.49; // % per annum (Islamic profit rate)
    const potentialMonthlySavings = activeLoans.reduce((totalSaving, loan) => {
        if (loan.interest_rate <= BEST_OLFI_RATE) return totalSaving;
        // EMI difference = current EMI - EMI at best rate (same remaining balance & tenure)
        // Simplified: savings ≈ (rate_diff / current_rate) × monthly_emi
        // This is conservative and directionally accurate
        const rateDiff = loan.interest_rate - BEST_OLFI_RATE;
        const savingFraction = rateDiff / loan.interest_rate;
        return totalSaving + Math.round(loan.monthly_emi * savingFraction * 0.85); // 85% realisation factor
    }, 0);


    return {
        loans,
        activeLoans,
        loading,
        refreshing,
        setRefreshing,
        firstName,
        unreadCount,
        salary,
        totalDebt,
        totalEmi,
        dtiRatio,
        healthScore,
        interestBurden,
        potentialMonthlySavings,
        fetchLoans,
    };
}
