import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import {
    calculateRefinanceOffer,
    rankOffers,
    formatAED,
    consolidateLoans,
    calculateConsolidationOffers,
    type LoanDetails,
    type BankOffer,
    type RefinanceResult,
} from '@/lib/refinance-calculator';

interface BankProduct {
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

interface UserLoan {
    id: string;
    bank_name: string | null;
    loan_type: string;
    remaining_amount: number;
    interest_rate: number;
    monthly_emi: number;
    tenure_months: number;
}

interface PersonalizedRecommendation {
    loan: UserLoan;
    topOffers: (RefinanceResult & { productData: BankProduct })[];
}

export default function OffersScreen() {
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
    const [products, setProducts] = useState<BankProduct[]>([]);
    const [userLoans, setUserLoans] = useState<UserLoan[]>([]);
    const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [selectedLoanIds, setSelectedLoanIds] = useState<Set<string>>(new Set());
    const [consolidationOffers, setConsolidationOffers] = useState<(RefinanceResult & { productData?: BankProduct })[]>([]);

    const toggleLoanSelection = (loanId: string) => {
        setSelectedLoanIds(prev => {
            const next = new Set(prev);
            if (next.has(loanId)) next.delete(loanId);
            else next.add(loanId);
            return next;
        });
    };

    const selectAllLoans = () => {
        if (selectedLoanIds.size === userLoans.length) {
            setSelectedLoanIds(new Set());
        } else {
            setSelectedLoanIds(new Set(userLoans.map(l => l.id)));
        }
    };

    // Recalculate consolidation whenever selection changes
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
    const { theme } = useTheme();
    const { user } = useAuth();

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
                // Map to calculator types
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

                // Calculate refinance for each product
                const results: RefinanceResult[] = [];
                for (const offer of bankOffers) {
                    const result = calculateRefinanceOffer(loanDetails, offer);
                    if (result && result.monthlySavings > 0) {
                        results.push(result);
                    }
                }

                const ranked = rankOffers(results);
                if (ranked.length > 0) {
                    // Attach product data for navigation
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

    const FILTER_CHIPS = [
        { key: 'sharia', label: 'Sharia Compliant', icon: 'shield-checkmark' as const },
        { key: 'no_salary_transfer', label: 'No Salary Transfer', icon: 'wallet-outline' as const },
        { key: 'early_settlement', label: 'Early Settlement', icon: 'flash-outline' as const },
        { key: 'rate_lock', label: 'Rate Lock', icon: 'lock-closed-outline' as const },
        { key: 'debt_consolidation', label: 'Debt Consolidation', icon: 'git-merge-outline' as const },
        { key: 'no_guarantor', label: 'No Guarantor', icon: 'person-remove-outline' as const },
        { key: 'top_up', label: 'Top-Up Available', icon: 'add-circle-outline' as const },
        { key: 'fixed_rate', label: 'Fixed Rate', icon: 'trending-up-outline' as const },
    ];

    const toggleFilter = (key: string) => {
        setActiveFilters((prev) =>
            prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
        );
    };

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

    const bestRate = filteredProducts.length > 0
        ? Math.min(...filteredProducts.map((p) => p.interest_rate_min || 99))
        : null;

    const bestProduct = filteredProducts.find((p) => p.interest_rate_min === bestRate);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            loadAll();
                        }}
                        tintColor={Colors.brand.emerald}
                    />
                }
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Refinance Offers
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            color: theme.colors.textSecondary,
                            marginTop: 4,
                        }}
                    >
                        {recommendations.length > 0
                            ? 'Personalized savings based on your loans'
                            : 'Compare rates from UAE banks and save'}
                    </Text>
                </View>

                {/* ═══ LOAN SELECTOR FOR CONSOLIDATION ═══ */}
                {!loading && userLoans.length >= 2 && (
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Ionicons name="git-merge" size={18} color={Colors.brand.teal} />
                                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>Consolidate Loans</Text>
                            </View>
                            <TouchableOpacity onPress={selectAllLoans}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>
                                    {selectedLoanIds.size === userLoans.length ? 'Deselect All' : 'Select All'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginBottom: 12 }}>
                            Select 2+ loans to see consolidation offers
                        </Text>

                        {userLoans.map(loan => {
                            const isSelected = selectedLoanIds.has(loan.id);
                            return (
                                <TouchableOpacity
                                    key={loan.id}
                                    onPress={() => toggleLoanSelection(loan.id)}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: isSelected ? `${Colors.brand.emerald}08` : theme.colors.card,
                                        borderRadius: BorderRadius.md,
                                        padding: 14,
                                        marginBottom: 8,
                                        borderWidth: 1.5,
                                        borderColor: isSelected ? Colors.brand.emerald : theme.colors.border,
                                    }}
                                >
                                    <View style={{
                                        width: 22,
                                        height: 22,
                                        borderRadius: 6,
                                        borderWidth: 2,
                                        borderColor: isSelected ? Colors.brand.emerald : theme.colors.border,
                                        backgroundColor: isSelected ? Colors.brand.emerald : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 12,
                                    }}>
                                        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
                                            {loan.bank_name || 'Unknown'} — {loan.loan_type.replace(/_/g, ' ')}
                                        </Text>
                                        <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                                            {formatAED(loan.remaining_amount)} at {loan.interest_rate}% • EMI {formatAED(loan.monthly_emi)}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Consolidation Summary */}
                        {selectedLoanIds.size >= 2 && (
                            <View style={{
                                backgroundColor: `${Colors.brand.teal}10`,
                                borderRadius: BorderRadius.lg,
                                padding: 16,
                                marginTop: 4,
                                borderWidth: 1,
                                borderColor: `${Colors.brand.teal}30`,
                            }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: Colors.brand.teal, marginBottom: 8 }}>
                                    📊 Consolidated Summary ({selectedLoanIds.size} loans)
                                </Text>
                                {(() => {
                                    const sel = userLoans.filter(l => selectedLoanIds.has(l.id));
                                    const totalAmt = sel.reduce((s, l) => s + l.remaining_amount, 0);
                                    const totalEmi = sel.reduce((s, l) => s + l.monthly_emi, 0);
                                    const avgRate = sel.reduce((s, l) => s + l.interest_rate * (l.remaining_amount / totalAmt), 0);
                                    return (
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <View>
                                                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Combined Debt</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAED(totalAmt)}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Combined EMI</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAED(totalEmi)}</Text>
                                            </View>
                                            <View>
                                                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Avg. Rate</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{avgRate.toFixed(2)}%</Text>
                                            </View>
                                        </View>
                                    );
                                })()}
                            </View>
                        )}

                        {/* Consolidation Offers */}
                        {consolidationOffers.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Ionicons name="sparkles" size={16} color={Colors.brand.emerald} />
                                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>Consolidation Offers</Text>
                                </View>
                                {consolidationOffers.map((offer, idx) => (
                                    <TouchableOpacity
                                        key={offer.productId}
                                        activeOpacity={0.8}
                                        onPress={() => router.push({
                                            pathname: '/offer-details' as any,
                                            params: { productId: offer.productId },
                                        })}
                                        style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 16,
                                            marginBottom: 8,
                                            borderWidth: idx === 0 ? 1.5 : 1,
                                            borderColor: idx === 0 ? Colors.brand.emerald : theme.colors.border,
                                        }}
                                    >
                                        {idx === 0 && (
                                            <View style={{
                                                position: 'absolute',
                                                top: -8,
                                                right: 12,
                                                backgroundColor: Colors.brand.emerald,
                                                paddingHorizontal: 8,
                                                paddingVertical: 2,
                                                borderRadius: 6,
                                            }}>
                                                <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>BEST DEAL</Text>
                                            </View>
                                        )}
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                                                    {offer.bankName}
                                                </Text>
                                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                                                    {offer.productName} • {offer.newRate}%
                                                </Text>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.brand.emerald }}>
                                                    Save {formatAED(offer.monthlySavings)}/mo
                                                </Text>
                                                <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>
                                                    {formatAED(offer.netSavings)} total
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', gap: 16, marginTop: 10 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <Ionicons name="cash-outline" size={12} color={theme.colors.textTertiary} />
                                                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>New EMI: {formatAED(offer.newEmi)}</Text>
                                            </View>
                                            {offer.processingFee > 0 && (
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                    <Ionicons name="receipt-outline" size={12} color={theme.colors.textTertiary} />
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Fee: {formatAED(offer.processingFee)}</Text>
                                                </View>
                                            )}
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                                <Ionicons name="time-outline" size={12} color={theme.colors.textTertiary} />
                                                <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Break-even: {offer.breakEvenMonths}mo</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {selectedLoanIds.size >= 2 && consolidationOffers.length === 0 && (
                            <View style={{
                                backgroundColor: `${Colors.warning}10`,
                                borderRadius: BorderRadius.md,
                                padding: 14,
                                marginTop: 8,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 10,
                            }}>
                                <Ionicons name="information-circle" size={20} color={Colors.warning} />
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, flex: 1 }}>
                                    No consolidation offers found for the selected combination. Try different loans or check individual recommendations below.
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {loading ? (
                    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                        <ActivityIndicator color={Colors.brand.emerald} size="large" />
                        <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 12, letterSpacing: 0.3 }}>your debt, rewritten</Text>
                    </View>
                ) : (
                    <>
                        {/* ═══ PERSONALIZED RECOMMENDATIONS ═══ */}
                        {recommendations.length > 0 && (
                            <View style={{ marginBottom: 24 }}>
                                <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Ionicons name="sparkles" size={18} color={Colors.brand.emerald} />
                                        <Text
                                            style={{
                                                fontSize: 17,
                                                fontWeight: '600',
                                                color: theme.colors.textPrimary,
                                            }}
                                        >
                                            Recommended for You
                                        </Text>
                                    </View>
                                </View>

                                {recommendations.map((rec) => (
                                    <View key={rec.loan.id} style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                        {/* Loan header */}
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 8,
                                                marginBottom: 12,
                                            }}
                                        >
                                            <Ionicons
                                                name="card-outline"
                                                size={14}
                                                color={theme.colors.textTertiary}
                                            />
                                            <Text
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: '600',
                                                    color: theme.colors.textSecondary,
                                                }}
                                            >
                                                {rec.loan.bank_name || 'Your'} {rec.loan.loan_type} loan
                                                ({formatAED(rec.loan.remaining_amount)} at {rec.loan.interest_rate}%)
                                            </Text>
                                        </View>

                                        {/* Recommendation cards */}
                                        {rec.topOffers.map((offer, idx) => (
                                            <TouchableOpacity
                                                key={offer.productId}
                                                activeOpacity={0.8}
                                                onPress={() =>
                                                    router.push({
                                                        pathname: '/offer-details' as any,
                                                        params: {
                                                            productId: offer.productId,
                                                            loanId: rec.loan.id,
                                                        },
                                                    })
                                                }
                                                style={{
                                                    backgroundColor: theme.colors.card,
                                                    borderRadius: BorderRadius.lg,
                                                    padding: 16,
                                                    marginBottom: 8,
                                                    borderWidth: idx === 0 ? 1.5 : 1,
                                                    borderColor:
                                                        idx === 0
                                                            ? Colors.brand.emerald
                                                            : theme.colors.border,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                                    {idx === 0 && (
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                top: -24,
                                                                left: 0,
                                                                backgroundColor: Colors.brand.emerald,
                                                                paddingHorizontal: 8,
                                                                paddingVertical: 2,
                                                                borderRadius: 4,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 9,
                                                                    fontWeight: '700',
                                                                    color: '#fff',
                                                                    letterSpacing: 0.5,
                                                                }}
                                                            >
                                                                TOP PICK
                                                            </Text>
                                                        </View>
                                                    )}
                                                    <View
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 10,
                                                            backgroundColor: theme.colors.cardElevated,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name={offer.isIslamic ? 'moon' : 'business'}
                                                            size={18}
                                                            color={
                                                                offer.isIslamic
                                                                    ? Colors.brand.teal
                                                                    : Colors.brand.emerald
                                                            }
                                                        />
                                                    </View>
                                                    <View style={{ flex: 1 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                fontWeight: '600',
                                                                color: theme.colors.textPrimary,
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {offer.bankName}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 12,
                                                                color: theme.colors.textTertiary,
                                                            }}
                                                            numberOfLines={1}
                                                        >
                                                            {offer.productName} · {offer.newRate}%
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={{ alignItems: 'flex-end', marginLeft: 8 }}>
                                                    <Text
                                                        style={{
                                                            fontSize: 16,
                                                            fontWeight: '700',
                                                            color: Colors.brand.emerald,
                                                        }}
                                                    >
                                                        Save {formatAED(offer.monthlySavings)}
                                                    </Text>
                                                    <Text
                                                        style={{
                                                            fontSize: 11,
                                                            color: theme.colors.textTertiary,
                                                        }}
                                                    >
                                                        /month
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Add Loan Banner (no loans) */}
                        {userLoans.length === 0 && !loading && (
                            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                <TouchableOpacity
                                    onPress={() => router.push('/(tabs)/loans')}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                                        style={{
                                            borderRadius: BorderRadius.lg,
                                            padding: 20,
                                            borderWidth: 1,
                                            borderColor: `${Colors.brand.emerald}30`,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 14,
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 22,
                                                backgroundColor: `${Colors.brand.emerald}20`,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Ionicons name="add-circle" size={24} color={Colors.brand.emerald} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    fontSize: 15,
                                                    fontWeight: '600',
                                                    color: Colors.brand.emerald,
                                                }}
                                            >
                                                Add a loan to see personalized offers
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    color: theme.colors.textTertiary,
                                                    marginTop: 2,
                                                }}
                                            >
                                                We'll find the best refinance deals for you
                                            </Text>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color={Colors.brand.emerald} />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* ═══ FILTER CHIPS ═══ */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                gap: 8,
                                paddingBottom: 16,
                            }}
                            style={{ marginBottom: 4 }}
                        >
                            {FILTER_CHIPS.map((chip) => {
                                const isActive = activeFilters.includes(chip.key);
                                return (
                                    <TouchableOpacity
                                        key={chip.key}
                                        onPress={() => toggleFilter(chip.key)}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 6,
                                            paddingHorizontal: 14,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor: isActive
                                                ? chip.key === 'sharia' ? Colors.brand.teal : Colors.brand.emerald
                                                : theme.colors.card,
                                            borderWidth: isActive ? 0 : 1,
                                            borderColor: theme.colors.border,
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={chip.icon}
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
                                            {chip.label}
                                        </Text>
                                        {isActive && (
                                            <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.7)" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>

                        {/* ═══ ALL PRODUCTS ═══ */}
                        {filteredProducts.length === 0 ? (
                            <View style={{ paddingVertical: 40, alignItems: 'center', paddingHorizontal: 40 }}>
                                <Ionicons name="search-outline" size={48} color={theme.colors.textTertiary} />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: theme.colors.textPrimary,
                                        marginTop: 16,
                                    }}
                                >
                                    No products found
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: theme.colors.textSecondary,
                                        marginTop: 4,
                                        textAlign: 'center',
                                    }}
                                >
                                    {activeFilters.length > 0 ? 'Try removing some filters' : 'Check back later for new offers'}
                                </Text>
                            </View>
                        ) : (
                            <>
                                {/* Best Rate Banner */}
                                {bestProduct && (
                                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                        <LinearGradient
                                            colors={theme.gradients.premium}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{
                                                borderRadius: BorderRadius.lg,
                                                padding: 20,
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                <Ionicons name="star" size={16} color="#FFD700" />
                                                <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>
                                                    BEST RATE FOUND
                                                </Text>
                                            </View>
                                            <Text style={{ fontSize: 36, fontWeight: '700', color: '#fff', letterSpacing: -1 }}>
                                                {bestRate}% APR
                                            </Text>
                                            <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                                                {bestProduct.name} from {bestProduct.bank?.name}
                                            </Text>
                                        </LinearGradient>
                                    </View>
                                )}

                                {/* Offer Cards */}
                                <View style={{ paddingHorizontal: 20 }}>
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            fontWeight: '600',
                                            color: theme.colors.textPrimary,
                                            marginBottom: 16,
                                        }}
                                    >
                                        All Products ({filteredProducts.length})
                                    </Text>

                                    {filteredProducts.map((product, index) => {
                                        const isBest = product.interest_rate_min === bestRate && index === 0;
                                        return (
                                            <TouchableOpacity
                                                key={product.id}
                                                style={{
                                                    backgroundColor: theme.colors.card,
                                                    borderRadius: BorderRadius.lg,
                                                    padding: 20,
                                                    marginBottom: 12,
                                                    borderWidth: isBest ? 1.5 : 1,
                                                    borderColor: isBest
                                                        ? Colors.brand.emerald
                                                        : theme.colors.border,
                                                }}
                                                activeOpacity={0.8}
                                                onPress={() =>
                                                    setSelectedOffer(
                                                        selectedOffer === product.id ? null : product.id
                                                    )
                                                }
                                            >
                                                {isBest && (
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            top: -10,
                                                            right: 16,
                                                            backgroundColor: Colors.brand.emerald,
                                                            paddingHorizontal: 10,
                                                            paddingVertical: 4,
                                                            borderRadius: 6,
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                fontSize: 10,
                                                                fontWeight: '700',
                                                                color: '#fff',
                                                                letterSpacing: 0.5,
                                                            }}
                                                        >
                                                            BEST RATE
                                                        </Text>
                                                    </View>
                                                )}

                                                {/* Bank + Rate */}
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: 16,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                                                        <View
                                                            style={{
                                                                width: 44,
                                                                height: 44,
                                                                borderRadius: 12,
                                                                backgroundColor: theme.colors.cardElevated,
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            <Ionicons
                                                                name={product.bank?.is_islamic ? 'moon' : 'business'}
                                                                size={20}
                                                                color={product.bank?.is_islamic ? Colors.brand.teal : Colors.brand.emerald}
                                                            />
                                                        </View>
                                                        <View style={{ flex: 1 }}>
                                                            <Text
                                                                style={{
                                                                    fontSize: 17,
                                                                    fontWeight: '600',
                                                                    color: theme.colors.textPrimary,
                                                                }}
                                                                numberOfLines={1}
                                                            >
                                                                {product.bank?.name || 'Unknown'}
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    fontSize: 13,
                                                                    color: theme.colors.textTertiary,
                                                                }}
                                                                numberOfLines={1}
                                                            >
                                                                {product.name}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ alignItems: 'flex-end', marginLeft: 12 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 24,
                                                                fontWeight: '700',
                                                                color: Colors.brand.emerald,
                                                            }}
                                                        >
                                                            {product.interest_rate_min || '—'}%
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: theme.colors.textTertiary,
                                                            }}
                                                        >
                                                            {product.interest_rate_max
                                                                ? `to ${product.interest_rate_max}%`
                                                                : 'APR'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* Details row */}
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: `${Colors.brand.emerald}10`,
                                                        borderRadius: BorderRadius.md,
                                                        padding: 12,
                                                        marginBottom: selectedOffer === product.id ? 16 : 0,
                                                    }}
                                                >
                                                    <View style={{ flex: 1 }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: theme.colors.textTertiary,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: 0.5,
                                                            }}
                                                        >
                                                            Max Tenure
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                fontWeight: '600',
                                                                color: theme.colors.textPrimary,
                                                                marginTop: 2,
                                                            }}
                                                        >
                                                            {product.max_tenure_months || '—'} months
                                                        </Text>
                                                    </View>
                                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                        <Text
                                                            style={{
                                                                fontSize: 11,
                                                                color: theme.colors.textTertiary,
                                                                textTransform: 'uppercase',
                                                                letterSpacing: 0.5,
                                                            }}
                                                        >
                                                            Max Amount
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                fontSize: 15,
                                                                fontWeight: '600',
                                                                color: theme.colors.textPrimary,
                                                                marginTop: 2,
                                                            }}
                                                        >
                                                            {product.max_amount
                                                                ? `AED ${Number(product.max_amount).toLocaleString()}`
                                                                : '—'}
                                                        </Text>
                                                    </View>
                                                </View>

                                                {/* Expanded Details */}
                                                {selectedOffer === product.id && (
                                                    <View>
                                                        {product.features.length > 0 && (
                                                            <>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 13,
                                                                        fontWeight: '600',
                                                                        color: theme.colors.textSecondary,
                                                                        marginBottom: 8,
                                                                    }}
                                                                >
                                                                    Features
                                                                </Text>
                                                                {product.features.map((feature: any, i: number) => (
                                                                    <View
                                                                        key={i}
                                                                        style={{
                                                                            flexDirection: 'row',
                                                                            alignItems: 'center',
                                                                            gap: 8,
                                                                            marginBottom: 6,
                                                                        }}
                                                                    >
                                                                        <Ionicons
                                                                            name="checkmark-circle"
                                                                            size={16}
                                                                            color={Colors.brand.emerald}
                                                                        />
                                                                        <Text
                                                                            style={{
                                                                                fontSize: 13,
                                                                                color: theme.colors.textSecondary,
                                                                            }}
                                                                        >
                                                                            {typeof feature === 'string' ? feature : JSON.stringify(feature)}
                                                                        </Text>
                                                                    </View>
                                                                ))}
                                                            </>
                                                        )}

                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                marginTop: 12,
                                                                paddingTop: 12,
                                                                borderTopWidth: 1,
                                                                borderTopColor: theme.colors.border,
                                                            }}
                                                        >
                                                            <Text style={{ fontSize: 13, color: theme.colors.textTertiary }}>
                                                                Processing Fee
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    fontSize: 13,
                                                                    fontWeight: '600',
                                                                    color: theme.colors.textPrimary,
                                                                }}
                                                            >
                                                                {product.processing_fee_pct
                                                                    ? `${product.processing_fee_pct}%`
                                                                    : 'N/A'}
                                                            </Text>
                                                        </View>

                                                        {product.bank?.is_islamic && (
                                                            <View
                                                                style={{
                                                                    flexDirection: 'row',
                                                                    alignItems: 'center',
                                                                    gap: 6,
                                                                    marginTop: 12,
                                                                    backgroundColor: `${Colors.brand.teal}15`,
                                                                    paddingHorizontal: 12,
                                                                    paddingVertical: 8,
                                                                    borderRadius: BorderRadius.sm,
                                                                }}
                                                            >
                                                                <Ionicons name="shield-checkmark" size={14} color={Colors.brand.teal} />
                                                                <Text style={{ fontSize: 12, fontWeight: '600', color: Colors.brand.teal }}>
                                                                    Sharia Compliant
                                                                </Text>
                                                            </View>
                                                        )}

                                                        <TouchableOpacity
                                                            style={{
                                                                marginTop: 16,
                                                                backgroundColor: Colors.brand.emerald,
                                                                borderRadius: BorderRadius.md,
                                                                paddingVertical: 14,
                                                                alignItems: 'center',
                                                                flexDirection: 'row',
                                                                justifyContent: 'center',
                                                                gap: 8,
                                                            }}
                                                            activeOpacity={0.8}
                                                            onPress={() => router.push({ pathname: '/offer-details' as any, params: { productId: product.id } })}
                                                        >
                                                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                                                            <Text
                                                                style={{
                                                                    fontSize: 15,
                                                                    fontWeight: '600',
                                                                    color: '#fff',
                                                                }}
                                                            >
                                                                View Details & Savings
                                                            </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
