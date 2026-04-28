import React, { useState, useMemo, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { calculateEMI, totalLoanCost } from '@/lib/refinance-calculator';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import InfoBottomSheet from '@/components/ui/InfoBottomSheet';

type CalcMode = 'emi' | 'affordability' | 'comparison';

// ─── Formatting helpers ──────────────────────────────────────────────

/** Format AED with full thousands separators, no abbreviation, whole numbers */
function formatAEDFull(amount: number): string {
    return `AED ${Math.round(amount).toLocaleString('en-US')}`;
}

/** Add thousands separators to a numeric string for display in inputs */
function addThousandSeparators(val: string): string {
    // Strip non-numeric except decimal
    const clean = val.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

/** Strip formatting from display value to get raw number */
function stripFormatting(val: string): string {
    return val.replace(/,/g, '');
}

// ─── Tab guidance descriptions ───────────────────────────────────────

const TAB_GUIDANCE: Record<CalcMode, { title: string; description: string }> = {
    emi: {
        title: '💰 EMI Calculator',
        description: 'Enter your current loan details to see your exact monthly payment, total cost, and how much goes to interest. Use this to understand what you are paying right now.',
    },
    affordability: {
        title: '🏦 Affordability Check',
        description: 'Find out the maximum financing you can qualify for based on your salary. UAE banks cap your total monthly debt payments at 50% of your salary — this is called the Debt Burden Ratio (DBR).',
    },
    comparison: {
        title: '⚖️ Current Loan vs New Offer',
        description: 'Enter your existing loan details alongside a new buyout offer. See the true difference in monthly payments, total interest paid, and how long before the switch pays off — including restructuring costs.',
    },
};

export default function CalculatorScreen() {
    const { theme } = useTheme();
    const [mode, setMode] = useState<CalcMode>('emi');

    const dbrSheetRef = useRef<BottomSheetModal>(null);
    const interestRateSheetRef = useRef<BottomSheetModal>(null);

    // EMI Calculator state
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [tenure, setTenure] = useState('');

    // Affordability state
    const [salary, setSalary] = useState('');
    const [existingEmi, setExistingEmi] = useState('');
    const [desiredRate, setDesiredRate] = useState('');
    const [desiredTenure, setDesiredTenure] = useState('');

    // ─── Comparison state ─── Current Loan vs Buyout Offer
    const [compPrincipal, setCompPrincipal] = useState('');
    const [compCurrentRate, setCompCurrentRate] = useState('');
    const [compCurrentTenure, setCompCurrentTenure] = useState('');
    const [compNewRate, setCompNewRate] = useState('');
    const [compNewTenure, setCompNewTenure] = useState('');

    // ─── EMI Results ──────────────────────────────────────────────
    const emiResult = useMemo(() => {
        const p = parseFloat(stripFormatting(principal));
        const r = parseFloat(rate);
        const t = parseInt(tenure);
        if (!p || !r || !t || p <= 0 || r <= 0 || t <= 0) return null;

        const emi = calculateEMI(p, r, t);
        const total = totalLoanCost(emi, t);
        const interest = total - p;
        return { emi, total, interest, interestPct: (interest / total) * 100 };
    }, [principal, rate, tenure]);

    // ─── Affordability Results ────────────────────────────────────
    const affordResult = useMemo(() => {
        const s = parseFloat(stripFormatting(salary));
        const e = parseFloat(stripFormatting(existingEmi)) || 0;
        const r = parseFloat(desiredRate);
        const t = parseInt(desiredTenure);
        if (!s || !r || !t || s <= 0 || r <= 0 || t <= 0) return null;

        // UAE DBR rule: max 50% of salary for all debts
        const maxDebt = s * 0.5;
        const availableEmi = Math.max(maxDebt - e, 0);
        if (availableEmi <= 0) return { maxLoan: 0, availableEmi: 0, dbrUsed: (e / s) * 100, totalInterest: 0, totalPayable: 0 };

        // Reverse-calculate max principal from EMI
        const monthlyRate = r / 100 / 12;
        const factor = Math.pow(1 + monthlyRate, t);
        const maxLoan = availableEmi * (factor - 1) / (monthlyRate * factor);
        const dbrUsed = ((e + availableEmi) / s) * 100;
        const totalPayable = availableEmi * t;
        const totalInterest = totalPayable - maxLoan;

        return { maxLoan, availableEmi, dbrUsed, totalInterest, totalPayable };
    }, [salary, existingEmi, desiredRate, desiredTenure]);

    // ─── Comparison Results ── Current Loan vs Buyout Offer ─────────
    const compResult = useMemo(() => {
        const p = parseFloat(stripFormatting(compPrincipal));
        const rCur = parseFloat(compCurrentRate);
        const tCur = parseInt(compCurrentTenure);
        const rNew = parseFloat(compNewRate);
        const tNew = parseInt(compNewTenure);
        if (!p || !rCur || !tCur || !rNew || !tNew) return null;
        if (p <= 0 || rCur <= 0 || tCur <= 0 || rNew <= 0 || tNew <= 0) return null;

        const emiCur = calculateEMI(p, rCur, tCur);
        const emiNew = calculateEMI(p, rNew, tNew);
        const totalCur = totalLoanCost(emiCur, tCur);
        const totalNew = totalLoanCost(emiNew, tNew);
        const interestCur = totalCur - p;
        const interestNew = totalNew - p;
        const interestSaved = interestCur - interestNew;
        const monthlyDiff = emiCur - emiNew; // positive = new is cheaper per month
        // Breakeven: months until cumulative monthly savings offset any upfront restructuring cost (assume AED 1500 standard fee)
        const RESTRUCTURING_FEE = 1500;
        const breakevenMonths = monthlyDiff > 0 ? Math.ceil(RESTRUCTURING_FEE / monthlyDiff) : null;

        return {
            emiCur, emiNew, totalCur, totalNew,
            interestCur, interestNew, interestSaved,
            monthlyDiff, breakevenMonths,
            newCheaper: interestNew < interestCur,
        };
    }, [compPrincipal, compCurrentRate, compCurrentTenure, compNewRate, compNewTenure]);

    const MODES: { key: CalcMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { key: 'emi', label: 'EMI', icon: 'calculator' },
        { key: 'affordability', label: 'Affordability', icon: 'wallet' },
        { key: 'comparison', label: 'Compare', icon: 'git-compare' },
    ];

    const guidance = TAB_GUIDANCE[mode];

    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 4, marginRight: 12 }}>
                        <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                        Calculator
                    </Text>
                </View>

                {/* Mode Tabs */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8 }}>
                    {MODES.map((m) => (
                        <TouchableOpacity
                            key={m.key}
                            onPress={() => setMode(m.key)}
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                paddingVertical: 10,
                                borderRadius: BorderRadius.md,
                                backgroundColor: mode === m.key ? Colors.brand.emerald : theme.colors.card,
                                borderWidth: mode === m.key ? 0 : 1,
                                borderColor: theme.colors.border,
                            }}
                        >
                            <Ionicons name={m.icon} size={16} color={mode === m.key ? '#fff' : theme.colors.textSecondary} />
                            <Text style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: mode === m.key ? '#fff' : theme.colors.textSecondary,
                            }}>
                                {m.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                    >
                        {/* ─── Guidance Banner ─── */}
                        <View style={{
                            backgroundColor: `${Colors.brand.teal}08`,
                            borderRadius: BorderRadius.lg,
                            padding: 14,
                            marginBottom: 16,
                            borderLeftWidth: 3,
                            borderLeftColor: Colors.brand.teal,
                        }}>
                            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 4 }}>
                                {guidance.title}
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 }}>
                                {guidance.description}
                            </Text>
                        </View>

                        {/* ─── EMI Calculator ─── */}
                        {mode === 'emi' && (
                            <>
                                <CalcInput
                                    label="Financing Amount (AED)"
                                    value={addThousandSeparators(principal)}
                                    onChangeText={(t) => setPrincipal(stripFormatting(t))}
                                    icon="cash-outline"
                                    theme={theme}
                                    prefix="AED"
                                />
                                <CalcInput
                                    label="Interest Rate"
                                    value={rate}
                                    onChangeText={setRate}
                                    icon="trending-up-outline"
                                    theme={theme}
                                    suffix="%"
                                    onInfoPress={() => interestRateSheetRef.current?.present()}
                                />
                                <CalcInput
                                    label="Tenure"
                                    value={tenure}
                                    onChangeText={setTenure}
                                    icon="calendar-outline"
                                    theme={theme}
                                    suffix="months"
                                />

                                {emiResult && (
                                    <View style={{ marginTop: 20 }}>
                                        <LinearGradient
                                            colors={theme.gradients.brand}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ borderRadius: BorderRadius.xl, padding: 24 }}
                                        >
                                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Monthly EMI
                                            </Text>
                                            <Text style={{ fontSize: 34, fontWeight: '800', color: '#fff', marginTop: 4 }}>
                                                {formatAEDFull(emiResult.emi)}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
                                                <ResultItem label="Total Payable" value={formatAEDFull(emiResult.total)} />
                                                <ResultItem label="Total Interest" value={formatAEDFull(emiResult.interest)} />
                                                <ResultItem label="Interest Share" value={`${emiResult.interestPct.toFixed(1)}%`} />
                                            </View>
                                        </LinearGradient>

                                        {/* Explanation */}
                                        <View style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 14,
                                            marginTop: 12,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}>
                                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, lineHeight: 18 }}>
                                                💡 <Text style={{ fontWeight: '600' }}>Interest Share</Text> means {emiResult.interestPct.toFixed(1)}% of every payment goes to interest — only {(100 - emiResult.interestPct).toFixed(1)}% reduces your actual loan balance.
                                            </Text>
                                        </View>

                                        {/* Interest vs Principal bar */}
                                        <View style={{ marginTop: 12 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Principal ({(100 - emiResult.interestPct).toFixed(0)}%)</Text>
                                                <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Interest ({emiResult.interestPct.toFixed(0)}%)</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden' }}>
                                                <View style={{ flex: 100 - emiResult.interestPct, backgroundColor: Colors.brand.emerald }} />
                                                <View style={{ flex: emiResult.interestPct, backgroundColor: Colors.brand.teal }} />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

                        {/* ─── Affordability Calculator ─── */}
                        {mode === 'affordability' && (
                            <>
                                <CalcInput
                                    label="Monthly Salary (AED)"
                                    value={addThousandSeparators(salary)}
                                    onChangeText={(t) => setSalary(stripFormatting(t))}
                                    icon="wallet-outline"
                                    theme={theme}
                                    prefix="AED"
                                />
                                <CalcInput
                                    label="Existing Monthly Payments (AED)"
                                    value={addThousandSeparators(existingEmi)}
                                    onChangeText={(t) => setExistingEmi(stripFormatting(t))}
                                    icon="remove-circle-outline"
                                    theme={theme}
                                    prefix="AED"
                                    placeholder="0 if no existing financing"
                                />
                                <CalcInput
                                    label="Expected Interest Rate"
                                    value={desiredRate}
                                    onChangeText={setDesiredRate}
                                    icon="trending-up-outline"
                                    theme={theme}
                                    suffix="%"
                                    onInfoPress={() => interestRateSheetRef.current?.present()}
                                />
                                <CalcInput
                                    label="Desired Financing Term"
                                    value={desiredTenure}
                                    onChangeText={setDesiredTenure}
                                    icon="calendar-outline"
                                    theme={theme}
                                    suffix="months"
                                />

                                {affordResult && (
                                    <View style={{ marginTop: 20 }}>
                                        <LinearGradient
                                            colors={['#3B82F6', '#1D4ED8']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ borderRadius: BorderRadius.xl, padding: 24 }}
                                        >
                                            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                Maximum Financing You Can Get
                                            </Text>
                                            <Text style={{ fontSize: 34, fontWeight: '800', color: '#fff', marginTop: 4 }}>
                                                {formatAEDFull(affordResult.maxLoan)}
                                            </Text>
                                            <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
                                                <ResultItem label="Max Monthly Payment" value={formatAEDFull(affordResult.availableEmi)} />
                                                <ResultItem label="Your DBR" value={`${affordResult.dbrUsed.toFixed(1)}%`} />
                                            </View>
                                        </LinearGradient>

                                        {/* Explanation */}
                                        <View style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 14,
                                            marginTop: 12,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}>
                                            <Text style={{ fontSize: 13, color: theme.colors.textPrimary, marginBottom: 8 }}>
                                                What is <Text style={{ fontWeight: '700' }}>DBR (Debt Burden Ratio)?</Text>
                                            </Text>
                                            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 19 }}>
                                                UAE Central Bank regulations require that your total monthly loan installments do not exceed 50% of your regular income.
                                            </Text>
                                            <TouchableOpacity
                                                style={{ marginTop: 10, alignSelf: 'flex-start' }}
                                                onPress={() => dbrSheetRef.current?.present()}
                                            >
                                                <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>
                                                    Learn more about DBR
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        {/* Breakdown explanation */}
                                        <View style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 14,
                                            marginTop: 12,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}>
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 8 }}>
                                                📊 How we calculated this
                                            </Text>
                                            <View style={{ gap: 6 }}>
                                                <ExplainRow
                                                    label="Your salary"
                                                    value={formatAEDFull(parseFloat(stripFormatting(salary)) || 0)}
                                                    theme={theme}
                                                />
                                                <ExplainRow
                                                    label="Max total debt allowed (50%)"
                                                    value={formatAEDFull((parseFloat(stripFormatting(salary)) || 0) * 0.5)}
                                                    theme={theme}
                                                />
                                                <ExplainRow
                                                    label="Your existing payments"
                                                    value={`- ${formatAEDFull(parseFloat(stripFormatting(existingEmi)) || 0)}`}
                                                    theme={theme}
                                                    negative
                                                />
                                                <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: 4 }} />
                                                <ExplainRow
                                                    label="Available for new financing"
                                                    value={`${formatAEDFull(affordResult.availableEmi)}/mo`}
                                                    theme={theme}
                                                    bold
                                                />
                                            </View>
                                        </View>

                                        {/* Cost breakdown */}
                                        {affordResult.maxLoan > 0 && (
                                            <View style={{
                                                backgroundColor: theme.colors.card,
                                                borderRadius: BorderRadius.lg,
                                                padding: 14,
                                                marginTop: 12,
                                                borderWidth: 1,
                                                borderColor: theme.colors.border,
                                            }}>
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 8 }}>
                                                    💰 Financing Cost Breakdown
                                                </Text>
                                                <View style={{ gap: 6 }}>
                                                    <ExplainRow label="Total you'd repay" value={formatAEDFull(affordResult.totalPayable)} theme={theme} />
                                                    <ExplainRow label="Of which is interest" value={formatAEDFull(affordResult.totalInterest)} theme={theme} />
                                                </View>
                                            </View>
                                        )}

                                        {/* DBR meter */}
                                        <View style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 16,
                                            marginTop: 12,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textPrimary }}>
                                                    📏 Debt Burden Ratio (DBR)
                                                </Text>
                                                <TouchableOpacity onPress={() => dbrSheetRef.current?.present()}>
                                                    <Ionicons name="information-circle-outline" size={20} color={theme.colors.textSecondary} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.colors.border, overflow: 'hidden' }}>
                                                <View style={{
                                                    width: `${Math.min(affordResult.dbrUsed, 100)}%`,
                                                    height: '100%',
                                                    borderRadius: 5,
                                                    backgroundColor: affordResult.dbrUsed > 50 ? Colors.error : affordResult.dbrUsed > 35 ? Colors.warning : Colors.brand.emerald,
                                                }} />
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: affordResult.dbrUsed > 50 ? Colors.error : affordResult.dbrUsed > 35 ? Colors.warning : Colors.brand.emerald }}>
                                                    {affordResult.dbrUsed.toFixed(1)}% used
                                                </Text>
                                                <Text style={{ fontSize: 12, color: theme.colors.textTertiary }}>
                                                    {affordResult.dbrUsed > 50 ? '❌ Over limit — banks will likely reject' : affordResult.dbrUsed > 35 ? '⚠️ Approaching limit' : '✅ Healthy — good approval odds'}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </>
                        )}

                        {/* ─── Compare: Current Loan vs Buyout Offer ─── */}
                        {mode === 'comparison' && (
                            <>
                                {/* loan amount */}
                                <CalcInput
                                    label="Loan Amount (AED)"
                                    value={addThousandSeparators(compPrincipal)}
                                    onChangeText={(t) => setCompPrincipal(stripFormatting(t))}
                                    icon="cash-outline"
                                    theme={theme}
                                    prefix="AED"
                                />

                                {/* Current Loan section */}
                                <View style={{ marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444' }} />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                            Current Loan
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        <View style={{ flex: 1 }}>
                                            <CalcInput label="Interest Rate" value={compCurrentRate} onChangeText={setCompCurrentRate} icon="analytics-outline" theme={theme} color="#EF4444" suffix="%" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <CalcInput label="Remaining Term" value={compCurrentTenure} onChangeText={setCompCurrentTenure} icon="calendar-outline" theme={theme} color="#EF4444" suffix="mo" />
                                        </View>
                                    </View>
                                </View>

                                {/* New Offer section */}
                                <View style={{ marginTop: 4 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.brand.emerald }} />
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                                            New Buyout Offer
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        <View style={{ flex: 1 }}>
                                            <CalcInput label="New Rate" value={compNewRate} onChangeText={setCompNewRate} icon="analytics-outline" theme={theme} color={Colors.brand.emerald} suffix="%" />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <CalcInput label="New Term" value={compNewTenure} onChangeText={setCompNewTenure} icon="calendar-outline" theme={theme} color={Colors.brand.emerald} suffix="mo" />
                                        </View>
                                    </View>
                                </View>

                                {compResult && (
                                    <View style={{ marginTop: 20, gap: 12 }}>
                                        {/* Current Loan card */}
                                        <View style={{
                                            backgroundColor: theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 16,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' }} />
                                                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>Current Loan  ·  {compCurrentRate}%  ·  {compCurrentTenure} mo</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 0 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Monthly EMI</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAEDFull(compResult.emiCur)}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Total Repayment</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAEDFull(compResult.totalCur)}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Total Interest</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#EF4444' }}>{formatAEDFull(compResult.interestCur)}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* New Offer card */}
                                        <View style={{
                                            backgroundColor: compResult.newCheaper ? `${Colors.brand.emerald}10` : theme.colors.card,
                                            borderRadius: BorderRadius.lg,
                                            padding: 16,
                                            borderWidth: 1,
                                            borderColor: compResult.newCheaper ? Colors.brand.emerald : theme.colors.border,
                                        }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.brand.emerald }} />
                                                    <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.textSecondary }}>New Offer  ·  {compNewRate}%  ·  {compNewTenure} mo</Text>
                                                </View>
                                                {compResult.newCheaper && (
                                                    <View style={{ backgroundColor: `${Colors.brand.emerald}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                                                        <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.brand.emerald }}>BETTER</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <View style={{ flexDirection: 'row', gap: 0 }}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Monthly EMI</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAEDFull(compResult.emiNew)}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Total Repayment</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary }}>{formatAEDFull(compResult.totalNew)}</Text>
                                                </View>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>Total Interest</Text>
                                                    <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.brand.emerald }}>{formatAEDFull(compResult.interestNew)}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Savings summary banner */}
                                        <LinearGradient
                                            colors={compResult.newCheaper ? [`${Colors.brand.emerald}18`, `${Colors.brand.emerald}06`] : [`${Colors.brand.teal}10`, `${Colors.brand.teal}04`]}
                                            style={{ borderRadius: BorderRadius.lg, padding: 16, gap: 10 }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <Ionicons
                                                    name={compResult.newCheaper ? 'trending-down' : 'trending-up'}
                                                    size={26}
                                                    color={compResult.newCheaper ? Colors.brand.emerald : '#EF4444'}
                                                />
                                                <View style={{ flex: 1 }}>
                                                    <Text style={{ fontSize: 15, fontWeight: '800', color: theme.colors.textPrimary }}>
                                                        {compResult.newCheaper
                                                            ? `Save ${formatAEDFull(compResult.interestSaved)} in total interest`
                                                            : `New offer costs ${formatAEDFull(Math.abs(compResult.interestSaved))} more overall`}
                                                    </Text>
                                                    {compResult.monthlyDiff > 0 && (
                                                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                                                            {formatAEDFull(compResult.monthlyDiff)}/mo cheaper with the new offer
                                                        </Text>
                                                    )}
                                                    {compResult.monthlyDiff < 0 && (
                                                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                                                            {formatAEDFull(Math.abs(compResult.monthlyDiff))}/mo more expensive per month
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                            {/* Breakeven stat */}
                                            {compResult.breakevenMonths !== null && compResult.breakevenMonths > 0 && (
                                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: `${Colors.brand.emerald}20` }}>
                                                    <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} style={{ marginTop: 1 }} />
                                                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary, flex: 1, flexWrap: 'wrap' }}>
                                                        {'Breakeven in '}<Text style={{ fontWeight: '700', color: theme.colors.textPrimary }}>{compResult.breakevenMonths} months</Text>{' — after ~AED 1,500 restructuring fee'}
                                                    </Text>
                                                </View>
                                            )}
                                        </LinearGradient>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>

                <InfoBottomSheet
                    bottomSheetRef={dbrSheetRef}
                    title="Debt Burden Ratio (DBR)"
                    description="DBR is the percentage of your monthly salary that goes towards paying all debts combined — loans, credit cards, car finance, everything."
                    insightTitle="UAE Central Bank Rule"
                    insightText="By regulation, your total monthly debt payments cannot exceed 50% of your gross salary. Banks will reject your application if your DBR is already at or above this limit — even if you have a good credit score."
                    footerText="Tip: Consolidating multiple loans into one lower-rate facility reduces your DBR and improves approval odds."
                />

                <InfoBottomSheet
                    bottomSheetRef={interestRateSheetRef}
                    title="Interest Rate"
                    description="This is the annual interest rate on your current loan — the primary cost of borrowing. Enter the rate from your existing loan agreement or bank statement."
                    insightTitle="How it affects you"
                    insightText="Even a 1% difference in interest rate can cost or save you tens of thousands of dirhams over a full loan term. OLFi finds you the lowest available rate on the market to minimise this cost."
                    footerText="For Islamic financing, this is called the Profit Rate — mathematically equivalent for comparison purposes."
                />
            </SafeAreaView>
        </BottomSheetModalProvider>
    );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function CalcInput({
    label,
    value,
    onChangeText,
    icon,
    theme,
    color,
    prefix,
    suffix,
    placeholder,
    onInfoPress,
}: {
    label: string;
    value: string;
    onChangeText: (t: string) => void;
    icon: keyof typeof Ionicons.glyphMap;
    theme: any;
    color?: string;
    prefix?: string;
    suffix?: string;
    placeholder?: string;
    onInfoPress?: () => void;
}) {
    return (
        <View style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textSecondary }}>
                    {label}
                </Text>
                {onInfoPress && (
                    <TouchableOpacity onPress={onInfoPress} style={{ paddingHorizontal: 6, paddingVertical: 2 }}>
                        <Ionicons name="information-circle-outline" size={16} color={theme.colors.textTertiary} />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.md,
                borderWidth: 1,
                borderColor: theme.colors.border,
                paddingHorizontal: 14,
            }}>
                <Ionicons name={icon} size={18} color={color || theme.colors.textTertiary} style={{ marginRight: 10 }} />
                {prefix && (
                    <Text style={{ fontSize: 14, color: theme.colors.textTertiary, marginRight: 4 }}>{prefix}</Text>
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType="numeric"
                    placeholder={placeholder || '0'}
                    placeholderTextColor={theme.colors.textDisabled}
                    style={{
                        flex: 1,
                        fontSize: 16,
                        color: theme.colors.textPrimary,
                        paddingVertical: 12,
                    }}
                />
                {suffix && (
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textTertiary, marginLeft: 4 }}>{suffix}</Text>
                )}
            </View>
        </View>
    );
}

function ResultItem({ label, value }: { label: string; value: string }) {
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>{label}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{value}</Text>
        </View>
    );
}

function ExplainRow({ label, value, theme, bold, negative }: { label: string; value: string; theme: any; bold?: boolean; negative?: boolean }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>{label}</Text>
            <Text style={{
                fontSize: 13,
                fontWeight: bold ? '700' : '500',
                color: negative ? Colors.error : bold ? Colors.brand.emerald : theme.colors.textPrimary,
            }}>
                {value}
            </Text>
        </View>
    );
}
