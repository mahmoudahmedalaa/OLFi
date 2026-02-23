import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import {
    calculateRefinanceOffer,
    rankOffers,
    calculateConsolidationOffers,
    type LoanDetails,
    type BankOffer,
    type RefinanceResult,
} from '@/lib/refinance-calculator';

export interface BankProduct {
    id: string;
    name: string;
    product_type: string;
    interest_rate_min: number | null;
    interest_rate_max: number | null;
    min_amount: number | null;
    max_amount: number | null;
    max_tenure_months: number | null;
    processing_fee_pct: number | null;
    early_settlement_fee_pct: number | null;
    features: string[];
    bank: {
        id: string;
        name: string;
        is_islamic: boolean;
    };
}

export interface UserLoan {
    id: string;
    bank_name: string | null;
    loan_type: string;
    remaining_amount: number;
    interest_rate: number;
    monthly_emi: number;
    tenure_months: number;
}

export interface PersonalizedRecommendation {
    loan: UserLoan;
    topOffers: (RefinanceResult & { productData: BankProduct })[];
}

export function useOffersData() {
    const { user } = useAuth();
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [products, setProducts] = useState<BankProduct[]>([]);
    const [userLoans, setUserLoans] = useState<UserLoan[]>([]);
    const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [selectedLoanIds, setSelectedLoanIds] = useState<Set<string>>(new Set());
    const [consolidationOffers, setConsolidationOffers] = useState<(RefinanceResult & { productData?: BankProduct })[]>([]);

    const toggleLoanSelection = useCallback((loanId: string) => {
        setSelectedLoanIds(prev => {
            const next = new Set(prev);
            if (next.has(loanId)) next.delete(loanId);
            else next.add(loanId);
            return next;
        });
    }, []);

    const selectAllLoans = useCallback(() => {
        if (selectedLoanIds.size === userLoans.length) {
            setSelectedLoanIds(new Set());
        } else {
            setSelectedLoanIds(new Set(userLoans.map(l => l.id)));
        }
    }, [selectedLoanIds.size, userLoans]);

    const toggleFilter = useCallback((key: string) => {
        setActiveFilters((prev) =>
            prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
        );
    }, []);

    const fetchProducts = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('bank_products')
                .select(`
                    id, name, product_type,
                    interest_rate_min, interest_rate_max,
                    min_amount, max_amount, max_tenure_months,
                    processing_fee_pct, early_settlement_fee_pct, features,
                    bank:banks!bank_products_bank_id_fkey (id, name, is_islamic)
                `)
                .eq('is_active', true)
                .order('interest_rate_min', { ascending: true });

            if (error) throw error;

            const transformed = (data || []).map((item: any) => ({
                ...item,
                bank: item.bank,
                features: Array.isArray(item.features) ? item.features : [],
            }));

            return transformed as BankProduct[];
        } catch (e) {
            console.error('Failed to fetch products:', e);
            return [];
        }
    }, []);

    const fetchUserLoans = useCallback(async () => {
        if (!user) return [];
        try {
            const { data, error } = await supabase
                .from('user_loans')
                .select('id, bank_name, loan_type, remaining_amount, interest_rate, monthly_emi, tenure_months')
                .eq('user_id', user.id)
                .eq('status', 'active');

            if (error) throw error;
            return (data || []) as UserLoan[];
        } catch (e) {
            console.error('Failed to fetch user loans:', e);
            return [];
        }
    }, [user]);

    const computeRecommendations = useCallback(
        (loans: UserLoan[], prods: BankProduct[]): PersonalizedRecommendation[] => {
            if (loans.length === 0 || prods.length === 0) return [];

            const recs: PersonalizedRecommendation[] = [];

            for (const loan of loans) {
                const loanDetails: LoanDetails = {
                    remainingAmount: loan.remaining_amount,
                    interestRate: loan.interest_rate,
                    monthlyEmi: loan.monthly_emi,
                    remainingMonths: loan.tenure_months,
                };

                const bankOffers: BankOffer[] = prods.map((p) => ({
                    productId: p.id,
                    bankName: p.bank?.name || 'Unknown',
                    productName: p.name,
                    interestRateMin: p.interest_rate_min || 0,
                    interestRateMax: p.interest_rate_max || 0,
                    processingFeePct: p.processing_fee_pct,
                    earlysettlementFeePct: p.early_settlement_fee_pct,
                    maxTenureMonths: p.max_tenure_months,
                    minAmount: p.min_amount,
                    maxAmount: p.max_amount,
                    isIslamic: p.bank?.is_islamic || false,
                    features: p.features?.map((f: any) => (typeof f === 'string' ? f : '')) || [],
                }));

                const results: RefinanceResult[] = [];
                for (const offer of bankOffers) {
                    const result = calculateRefinanceOffer(loanDetails, offer);
                    if (result && result.monthlySavings > 0) {
                        results.push(result);
                    }
                }

                const ranked = rankOffers(results);
                if (ranked.length > 0) {
                    const topOffers = ranked.slice(0, 3).map((r) => ({
                        ...r,
                        productData: prods.find((p) => p.id === r.productId)!,
                    }));
                    recs.push({ loan, topOffers });
                }
            }

            return recs;
        },
        []
    );

    const loadAll = useCallback(async () => {
        try {
            const [prods, loans] = await Promise.all([fetchProducts(), fetchUserLoans()]);
            setProducts(prods);
            setUserLoans(loans);
            setRecommendations(computeRecommendations(loans, prods));
        } catch (e) {
            console.error('Failed to load data:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [fetchProducts, fetchUserLoans, computeRecommendations]);

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    useEffect(() => {
        if (selectedLoanIds.size < 2 || products.length === 0) {
            setConsolidationOffers([]);
            return;
        }

        const selectedLoans = userLoans.filter(l => selectedLoanIds.has(l.id));
        const loanDetails: LoanDetails[] = selectedLoans.map(l => ({
            remainingAmount: l.remaining_amount,
            interestRate: l.interest_rate,
            monthlyEmi: l.monthly_emi,
            remainingMonths: l.tenure_months,
        }));

        const bankOffers: BankOffer[] = products.map(p => ({
            productId: p.id,
            bankName: p.bank?.name || 'Unknown',
            productName: p.name,
            interestRateMin: p.interest_rate_min || 0,
            interestRateMax: p.interest_rate_max || 0,
            processingFeePct: p.processing_fee_pct,
            earlysettlementFeePct: p.early_settlement_fee_pct,
            maxTenureMonths: p.max_tenure_months,
            minAmount: p.min_amount,
            maxAmount: p.max_amount,
            isIslamic: p.bank?.is_islamic || false,
            features: p.features?.map((f: any) => (typeof f === 'string' ? f : '')) || [],
        }));

        const results = calculateConsolidationOffers(loanDetails, bankOffers);
        const enriched = results.slice(0, 5).map(r => ({
            ...r,
            productData: products.find(p => p.id === r.productId),
        }));

        setConsolidationOffers(enriched);
    }, [selectedLoanIds, userLoans, products]);

    const filteredProducts = products.filter((p) => {
        for (const filter of activeFilters) {
            if (filter === 'sharia') {
                if (!p.bank?.is_islamic) return false;
            } else {
                const featureMatch = p.features?.some((f) =>
                    f.toLowerCase().includes(filter.replace(/_/g, ' '))
                );
                if (!featureMatch) return false;
            }
        }
        return true;
    });

    return {
        selectedOffer,
        setSelectedOffer,
        products,
        userLoans,
        recommendations,
        loading,
        refreshing,
        setRefreshing,
        activeFilters,
        selectedLoanIds,
        consolidationOffers,
        filteredProducts,
        toggleLoanSelection,
        selectAllLoans,
        toggleFilter,
        loadAll,
    };
}
