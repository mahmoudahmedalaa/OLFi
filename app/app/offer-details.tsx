import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { trackOfferViewed } from '@/lib/analytics';
import SavingsChart from '@/components/SavingsChart';
import ShariaBadge from '@/components/ui/ShariaBadge';
import InfoBottomSheet from '@/components/ui/InfoBottomSheet';
import {
    calculateRefinanceOffer,
    generateSavingsTimeline,
    estimateRemainingMonths,
    formatAED,
    type LoanDetails,
    type BankOffer,
    type RefinanceResult,
} from '@/lib/refinance-calculator';

export default function OfferDetailsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const params = useLocalSearchParams<{
        productId: string;
        loanId?: string;
    }>();

    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState<any>(null);
    const [userLoans, setUserLoans] = useState<any[]>([]);
    const [refinanceResults, setRefinanceResults] = useState<RefinanceResult[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
    const submitting = false;
    const fadeAnim = useState(new Animated.Value(0))[0];

    const profitRateSheetRef = React.useRef<any>(null);
    const feeSheetRef = React.useRef<any>(null);

    const fetchData = useCallback(async () => {
        if (!user || !params.productId) return;
        try {
            // Fetch product with bank details
            const { data: productData, error: prodErr } = await supabase
                .from('bank_products')
                .select(`
                    *,
                    bank:banks!bank_products_bank_id_fkey (id, name, is_islamic, website_url, logo_url, min_salary)
                `)
                .eq('id', params.productId)
                .single();

            if (prodErr) throw prodErr;
            setProduct(productData);
            trackOfferViewed(productData.id, productData.bank?.name || '');

            // Fetch user loans for comparison
            const { data: loanData, error: loanErr } = await supabase
                .from('user_loans')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'active')
                .order('remaining_amount', { ascending: false });

            if (loanErr) throw loanErr;
            setUserLoans(loanData || []);

            // Calculate refinance results for each loan
            if (productData && loanData) {
                const offer: BankOffer = {
                    productId: productData.id,
                    bankName: productData.bank?.name || '',
                    productName: productData.name,
                    interestRateMin: productData.interest_rate_min || 0,
                    interestRateMax: productData.interest_rate_max || 0,
                    processingFeePct: productData.processing_fee_pct,
                    earlysettlementFeePct: productData.early_settlement_fee_pct,
                    maxTenureMonths: productData.max_tenure_months,
                    minAmount: productData.min_amount,
                    maxAmount: productData.max_amount,
                    isIslamic: productData.bank?.is_islamic || false,
                    features: Array.isArray(productData.features) ? productData.features : [],
                };

                const results: RefinanceResult[] = [];
                for (const loan of loanData) {
                    // Only compare same loan type
                    if (loan.loan_type !== productData.product_type && productData.product_type !== 'personal') continue;

                    const remaining = estimateRemainingMonths(
                        loan.remaining_amount,
                        loan.monthly_emi,
                        loan.interest_rate
                    );

                    const loanDetails: LoanDetails = {
                        remainingAmount: loan.remaining_amount,
                        interestRate: loan.interest_rate,
                        monthlyEmi: loan.monthly_emi,
                        remainingMonths: remaining,
                    };

                    const result = calculateRefinanceOffer(loanDetails, offer);
                    if (result) {
                        results.push({ ...result, productId: loan.id }); // Re-use productId field for loanId
                    }
                }
                setRefinanceResults(results);

                // Auto-select best result or passed loanId
                if (params.loanId) {
                    setSelectedLoanId(params.loanId);
                } else if (results.length > 0) {
                    setSelectedLoanId(results[0].productId);
                }
            }
        } catch (e) {
            console.error('Failed to fetch offer details:', e);
        } finally {
            setLoading(false);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [user, params.productId, params.loanId, fadeAnim]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const selectedResult = refinanceResults.find((r) => r.productId === selectedLoanId);
    const selectedLoan = userLoans.find((l) => l.id === selectedLoanId);

    const savingsTimeline = selectedResult
        ? generateSavingsTimeline(
            selectedResult.monthlySavings,
            selectedResult.processingFee,
            selectedResult.newTenureMonths
        )
        : [];

    const handleApply = () => {
        if (!selectedResult || !selectedLoan || !product || !user) {
            Alert.alert(
                'Select a Facility',
                'Please add and select a facility to compare savings before applying.'
            );
            return;
        }

        router.push({
            pathname: '/apply-offer' as any,
            params: {
                productId: product.id,
                productName: product.name,
                bankName: product.bank?.name || '',
                loanId: selectedLoan.id,
                monthlySavings: String(selectedResult.monthlySavings),
                totalSavings: String(selectedResult.netSavings),
                newRate: String(selectedResult.newRate),
                newEmi: String(selectedResult.newEmi),
                loanRemainingAmount: String(selectedLoan.remaining_amount),
                loanMonthlyEmi: String(selectedLoan.monthly_emi),
                processingFee: String(selectedResult.processingFee),
                maxTenureMonths: String(product.max_tenure_months || 48),
                defaultTenure: String(selectedResult.newTenureMonths),
            },
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Colors.brand.emerald} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 12, letterSpacing: 0.3 }}>your debt, rewritten</Text>
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Ionicons name="alert-circle-outline" size={48} color={theme.colors.textTertiary} />
                <Text style={{ fontSize: 17, fontWeight: '600', color: theme.colors.textPrimary, marginTop: 16 }}>
                    Offer Not Found
                </Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 15, color: Colors.brand.emerald, fontWeight: '600' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary }}>
                        {product.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginRight: 8 }}>
                            {product.bank?.name}
                        </Text>
                        {product.bank?.is_islamic && <ShariaBadge size="small" variant="glass" />}
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <Animated.View style={{ opacity: fadeAnim }}>
                    {/* Rate Header Card */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <LinearGradient
                            colors={product.bank?.is_islamic
                                ? [Colors.brand.teal, '#0D9488']
                                : theme.gradients.premium
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderRadius: BorderRadius.lg,
                                padding: 24,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                        Starting Profit Rate
                                    </Text>
                                    <TouchableOpacity onPress={() => profitRateSheetRef.current?.present()} style={{ marginLeft: 6 }}>
                                        <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
                                    </TouchableOpacity>
                                </View>
                                {product.bank?.is_islamic && (
                                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase' }}>Islamic Finance</Text>
                                    </View>
                                )}
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 8 }}>
                                <Text style={{ fontSize: 42, fontWeight: '800', color: '#fff', letterSpacing: -1 }}>
                                    {product.interest_rate_min}%
                                </Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'rgba(255,255,255,0.8)', marginLeft: 4 }}>
                                    Profit Rate
                                </Text>
                            </View>
                            {product.interest_rate_max && product.interest_rate_max !== product.interest_rate_min && (
                                <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                                    Up to {product.interest_rate_max}% Profit Rate
                                </Text>
                            )}
                        </LinearGradient>
                    </View>

                    {/* Product Details */}
                    <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                        <View style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                                Product Details
                            </Text>

                            <DetailRow label="Financing Type" value={product.product_type?.replace(/_/g, ' ').replace(/^\w/, (c: string) => c.toUpperCase())} theme={theme} icon="document-text-outline" />
                            {product.min_amount && (
                                <DetailRow label="Min Amount" value={formatAED(product.min_amount)} theme={theme} icon="remove-circle-outline" />
                            )}
                            {product.max_amount && (
                                <DetailRow label="Max Amount" value={formatAED(product.max_amount)} theme={theme} icon="add-circle-outline" />
                            )}
                            {product.max_tenure_months && (
                                <DetailRow label="Max Tenure" value={`${product.max_tenure_months} months`} theme={theme} icon="calendar-outline" />
                            )}
                            {product.processing_fee_pct != null && (
                                <DetailRow label="Processing Fee" value={`${product.processing_fee_pct}%`} theme={theme} icon="receipt-outline" onInfoPress={() => feeSheetRef.current?.present()} />
                            )}
                            {product.early_settlement_fee_pct != null && (
                                <DetailRow label="Early Settlement" value={`${product.early_settlement_fee_pct}%`} theme={theme} icon="flash-outline" onInfoPress={() => feeSheetRef.current?.present()} />
                            )}
                            {product.bank?.min_salary && (
                                <DetailRow label="Min Salary" value={formatAED(product.bank.min_salary)} theme={theme} icon="wallet-outline" isLast />
                            )}
                        </View>
                    </View>

                    {/* Features */}
                    {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <View style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 20,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>
                                    Features
                                </Text>
                                {product.features.map((feature: string, i: number) => (
                                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                                        <Ionicons name="checkmark-circle" size={18} color={Colors.brand.emerald} />
                                        <Text style={{ fontSize: 14, color: theme.colors.textPrimary, flex: 1 }}>
                                            {feature}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* ── Savings Comparison Section ── */}
                    {refinanceResults.length > 0 && (
                        <>
                            {/* Loan Selector (if multiple loans) */}
                            {userLoans.length > 1 && (
                                <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
                                        Compare Against
                                    </Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
                                        {userLoans.filter(l => refinanceResults.some(r => r.productId === l.id)).map((loan) => {
                                            const isSelected = selectedLoanId === loan.id;
                                            return (
                                                <TouchableOpacity
                                                    key={loan.id}
                                                    onPress={() => setSelectedLoanId(loan.id)}
                                                    style={{
                                                        paddingHorizontal: 14,
                                                        paddingVertical: 8,
                                                        borderRadius: 20,
                                                        backgroundColor: isSelected ? Colors.brand.emerald : theme.colors.card,
                                                        borderWidth: isSelected ? 0 : 1,
                                                        borderColor: theme.colors.border,
                                                        marginHorizontal: 4,
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 13,
                                                        fontWeight: '600',
                                                        color: isSelected ? '#fff' : theme.colors.textSecondary,
                                                    }}>
                                                        {loan.bank_name || 'Facility'} • {formatAED(loan.remaining_amount)}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Savings Summary */}
                            {selectedResult && (
                                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                    <View style={{
                                        backgroundColor: theme.colors.card,
                                        borderRadius: BorderRadius.lg,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: Colors.brand.emerald + '40',
                                    }}>
                                        <LinearGradient
                                            colors={['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.04)']}
                                            style={{ padding: 20 }}
                                        >
                                            <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                                                💰 Your Potential Savings
                                            </Text>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginBottom: 4 }}>Monthly Savings</Text>
                                                    <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.brand.emerald }}>
                                                        {formatAED(selectedResult.monthlySavings)}
                                                    </Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginBottom: 4 }}>Total Net Savings</Text>
                                                    <Text style={{ fontSize: 24, fontWeight: '700', color: Colors.brand.emerald }}>
                                                        {formatAED(selectedResult.netSavings)}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                                <SavingsPill label="New EMI" value={formatAED(selectedResult.newEmi)} theme={theme} />
                                                <SavingsPill label="New Profit Rate" value={`${selectedResult.newRate}%`} theme={theme} />
                                                {selectedResult.breakEvenMonths > 0 && (
                                                    <SavingsPill label="Break-Even" value={`${selectedResult.breakEvenMonths}mo`} theme={theme} />
                                                )}
                                            </View>

                                            {selectedResult.processingFee > 0 && (
                                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary, marginTop: 12 }}>
                                                    * Processing fee of {formatAED(selectedResult.processingFee)} already deducted from net savings
                                                </Text>
                                            )}
                                        </LinearGradient>
                                    </View>
                                </View>
                            )}

                            {/* Savings Chart */}
                            {savingsTimeline.length >= 2 && (
                                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                    <SavingsChart
                                        data={savingsTimeline}
                                        processingFee={selectedResult?.processingFee || 0}
                                    />
                                </View>
                            )}

                            {/* Before vs After comparison */}
                            {selectedResult && selectedLoan && (
                                <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                                    <View style={{
                                        backgroundColor: theme.colors.card,
                                        borderRadius: BorderRadius.lg,
                                        padding: 20,
                                        borderWidth: 1,
                                        borderColor: theme.colors.border,
                                    }}>
                                        <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                                            Current vs New
                                        </Text>

                                        <CompareRow label="Profit Rate" current={`${selectedLoan.interest_rate}%`} newVal={`${selectedResult.newRate}%`} theme={theme} improved />
                                        <CompareRow label="Monthly EMI" current={formatAED(selectedLoan.monthly_emi)} newVal={formatAED(selectedResult.newEmi)} theme={theme} improved />
                                        <CompareRow label="Remaining" current={`${estimateRemainingMonths(selectedLoan.remaining_amount, selectedLoan.monthly_emi, selectedLoan.interest_rate)}mo`} newVal={`${selectedResult.newTenureMonths}mo`} theme={theme} isLast />
                                    </View>
                                </View>
                            )}
                        </>
                    )}

                    {/* No loans message */}
                    {userLoans.length === 0 && (
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <View style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 24,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}>
                                <Ionicons name="calculator-outline" size={40} color={theme.colors.textTertiary} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary, marginTop: 12 }}>
                                    Add a facility to see savings
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 4 }}>
                                    Track your current facility to see how much you could save by switching to this offer
                                </Text>
                                <TouchableOpacity
                                    onPress={() => router.push('/add-loan')}
                                    style={{ marginTop: 16 }}
                                >
                                    <LinearGradient
                                        colors={['#011819', '#0A2525']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{
                                            paddingHorizontal: 24,
                                            paddingVertical: 12,
                                            borderRadius: BorderRadius.md,
                                        }}
                                    >
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                                            Add Your Facility
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    {/* No refinance possible */}
                    {userLoans.length > 0 && refinanceResults.length === 0 && (
                        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
                            <View style={{
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 24,
                                alignItems: 'center',
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                            }}>
                                <Ionicons name="information-circle-outline" size={40} color={theme.colors.textTertiary} />
                                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary, marginTop: 12 }}>
                                    No savings available
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 4 }}>
                                    Your current rates are already competitive! This offer doesn&apos;t provide meaningful savings for your loans.
                                </Text>
                            </View>
                        </View>
                    )}
                </Animated.View>
            </ScrollView>

            {/* Apply Button (Fixed Bottom) */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
            }}>
                <BlurView
                    tint={theme.isDark ? "dark" : "light"}
                    intensity={80}
                    style={{
                        paddingHorizontal: 20,
                        paddingBottom: 34,
                        paddingTop: 12,
                        backgroundColor: theme.isDark ? 'rgba(26, 29, 33, 0.7)' : 'rgba(255, 255, 255, 0.7)',
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.border,
                    }}
                >
                    <TouchableOpacity onPress={handleApply} activeOpacity={0.8} disabled={submitting}>
                        <LinearGradient
                            colors={submitting ? ['#94A3B8', '#64748B'] : ['#011819', '#0A2525']}
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
                                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                                        Apply for Finance
                                    </Text>
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>
                </BlurView>
            </View>

            {/* Bottom Sheets */}
            <InfoBottomSheet
                bottomSheetRef={profitRateSheetRef}
                title="What is a Profit Rate?"
                description="Unlike conventional interest, a Profit Rate is a fixed, pre-agreed markup based on an underlying asset transaction."
                insightTitle="Islamic Finance Framework"
                insightText="Under the Murabaha or Wakalah structure, financing is provided through the sale and purchase of tangible assets. The profit is fixed upfront and cannot jump unexpectedly."
                footerText="This ensures full transparency and compliance with ethical Sharia principles."
            />
            <InfoBottomSheet
                bottomSheetRef={feeSheetRef}
                title="Understanding Fees"
                description="Banks charge administrative fees to cover the actual cost of processing your application and structuring the Sharia-compliant contracts."
                insightTitle="Ethical Fee Structure"
                insightText="Processing and settlement fees are permissible as long as they represent the actual operational cost of the service provided by the institution, rather than a hidden cost of borrowing."
            />
        </SafeAreaView>
    );
}

// ─── Helper Components ─────────────────────────────────────────────────────

function DetailRow({ label, value, theme, icon, isLast = false, onInfoPress }: {
    label: string;
    value: string;
    theme: any;
    icon: string;
    isLast?: boolean;
    onInfoPress?: () => void;
}) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.colors.border,
        }}>
            <Ionicons name={icon as any} size={18} color={theme.colors.textTertiary} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary, flex: 1 }}>
                {label}
            </Text>
            {onInfoPress && (
                <TouchableOpacity onPress={onInfoPress} style={{ marginRight: 8, padding: 2 }}>
                    <Ionicons name="information-circle-outline" size={16} color={theme.colors.textTertiary} />
                </TouchableOpacity>
            )}
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}>
                {value}
            </Text>
        </View>
    );
}

function SavingsPill({ label, value, theme }: { label: string; value: string; theme: any }) {
    return (
        <View style={{
            flex: 1,
            backgroundColor: 'rgba(16,185,129,0.08)',
            borderRadius: BorderRadius.md,
            paddingVertical: 10,
            paddingHorizontal: 12,
            alignItems: 'center',
        }}>
            <Text style={{ fontSize: 10, color: theme.colors.textTertiary, marginBottom: 2 }}>{label}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: Colors.brand.emerald }}>{value}</Text>
        </View>
    );
}

function CompareRow({ label, current, newVal, theme, improved = false, isLast = false }: {
    label: string;
    current: string;
    newVal: string;
    theme: any;
    improved?: boolean;
    isLast?: boolean;
}) {
    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: theme.colors.border,
        }}>
            <Text style={{ flex: 1, fontSize: 13, color: theme.colors.textTertiary }}>{label}</Text>
            <Text style={{
                fontSize: 14,
                color: theme.colors.textSecondary,
                textDecorationLine: improved ? 'line-through' : 'none',
                marginRight: 12,
            }}>
                {current}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: improved ? Colors.brand.emerald : theme.colors.textPrimary }}>
                {newVal}
            </Text>
        </View>
    );
}
