/**
 * Refinance Calculator — Pure functions for loan comparison and savings calculation
 * BuyOut Phase 4.1
 */

export interface LoanDetails {
    remainingAmount: number;
    interestRate: number;       // Annual rate as percentage (e.g. 5.99)
    monthlyEmi: number;
    remainingMonths: number;
}

export interface BankOffer {
    productId: string;
    bankName: string;
    productName: string;
    interestRateMin: number;
    interestRateMax: number;
    processingFeePct: number | null;
    earlysettlementFeePct: number | null;
    maxTenureMonths: number | null;
    minAmount: number | null;
    maxAmount: number | null;
    isIslamic: boolean;
    features: string[];
}

export interface RefinanceResult {
    productId: string;
    bankName: string;
    productName: string;
    newRate: number;
    newEmi: number;
    newTenureMonths: number;
    monthlySavings: number;
    totalSavings: number;
    processingFee: number;
    netSavings: number;           // total_savings - processing_fee
    breakEvenMonths: number;      // months to recoup processing fee
    savingsPercentage: number;    // (totalSavings / total remaining cost) * 100
    isIslamic: boolean;
    features: string[];
}

/**
 * Calculate monthly EMI using standard reducing balance formula
 * EMI = P × r × (1 + r)^n / ((1 + r)^n - 1)
 *
 * @param principal — Loan principal (remaining amount)
 * @param annualRate — Annual interest rate as percentage (e.g. 5.99)
 * @param tenureMonths — Number of months
 */
export function calculateEMI(
    principal: number,
    annualRate: number,
    tenureMonths: number
): number {
    if (annualRate === 0) return principal / tenureMonths;
    const monthlyRate = annualRate / 100 / 12;
    const factor = Math.pow(1 + monthlyRate, tenureMonths);
    return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate total cost of a loan (total of all EMI payments)
 */
export function totalLoanCost(emi: number, months: number): number {
    return emi * months;
}

/**
 * Calculate remaining months from current EMI and remaining amount
 * Useful when we only know EMI and balance, not original tenure
 */
export function estimateRemainingMonths(
    remainingAmount: number,
    monthlyEmi: number,
    annualRate: number
): number {
    if (annualRate === 0) return Math.ceil(remainingAmount / monthlyEmi);
    const monthlyRate = annualRate / 100 / 12;
    // n = -log(1 - P*r/EMI) / log(1+r)
    const inner = 1 - (remainingAmount * monthlyRate) / monthlyEmi;
    if (inner <= 0) return 360; // fallback to 30 years if formula breaks
    return Math.ceil(-Math.log(inner) / Math.log(1 + monthlyRate));
}

/**
 * Compare a user's current loan against a bank product and calculate savings.
 */
export function calculateRefinanceOffer(
    loan: LoanDetails,
    offer: BankOffer
): RefinanceResult | null {
    // Use the best available rate (minimum)
    const newRate = offer.interestRateMin;

    // Don't recommend if rate isn't better
    if (newRate >= loan.interestRate) return null;

    // Check amount eligibility
    if (offer.minAmount && loan.remainingAmount < offer.minAmount) return null;
    if (offer.maxAmount && loan.remainingAmount > offer.maxAmount) return null;

    // Use existing remaining months, capped by product max tenure
    const tenureMonths = offer.maxTenureMonths
        ? Math.min(loan.remainingMonths, offer.maxTenureMonths)
        : loan.remainingMonths;

    const newEmi = calculateEMI(loan.remainingAmount, newRate, tenureMonths);
    const monthlySavings = loan.monthlyEmi - newEmi;

    // Only show if there are meaningful savings (> AED 10/month)
    if (monthlySavings < 10) return null;

    const totalSavings = monthlySavings * tenureMonths;

    // Processing fee
    const processingFee = offer.processingFeePct
        ? (loan.remainingAmount * offer.processingFeePct) / 100
        : 0;

    const netSavings = totalSavings - processingFee;

    // Only recommend if net savings are positive
    if (netSavings <= 0) return null;

    const breakEvenMonths =
        processingFee > 0 ? Math.ceil(processingFee / monthlySavings) : 0;

    const currentTotalCost = loan.monthlyEmi * loan.remainingMonths;
    const savingsPercentage =
        currentTotalCost > 0 ? (totalSavings / currentTotalCost) * 100 : 0;

    return {
        productId: offer.productId,
        bankName: offer.bankName,
        productName: offer.productName,
        newRate,
        newEmi: Math.round(newEmi),
        newTenureMonths: tenureMonths,
        monthlySavings: Math.round(monthlySavings),
        totalSavings: Math.round(totalSavings),
        processingFee: Math.round(processingFee),
        netSavings: Math.round(netSavings),
        breakEvenMonths,
        savingsPercentage: Math.round(savingsPercentage * 10) / 10,
        isIslamic: offer.isIslamic,
        features: offer.features,
    };
}

/**
 * Generate amortization schedule for savings chart
 * Returns cumulative savings at each month
 */
export function generateSavingsTimeline(
    monthlySavings: number,
    processingFee: number,
    months: number
): { month: number; cumulativeSavings: number }[] {
    const timeline: { month: number; cumulativeSavings: number }[] = [];
    let cumulative = -processingFee; // Start negative (processing fee)

    for (let m = 1; m <= months; m++) {
        cumulative += monthlySavings;
        // Only push every Nth month to keep data manageable for charts
        const step = months <= 24 ? 1 : months <= 60 ? 3 : 6;
        if (m % step === 0 || m === 1 || m === months) {
            timeline.push({ month: m, cumulativeSavings: Math.round(cumulative) });
        }
    }
    return timeline;
}

/**
 * Rank and sort refinance results by net savings (descending)
 */
export function rankOffers(offers: RefinanceResult[]): RefinanceResult[] {
    return [...offers].sort((a, b) => b.netSavings - a.netSavings);
}

/**
 * Format AED currency
 */
export function formatAED(amount: number): string {
    if (amount >= 1_000_000) {
        return `AED ${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 10_000) {
        return `AED ${(amount / 1_000).toFixed(0)}K`;
    }
    return `AED ${amount.toLocaleString()}`;
}

// ─── Financial Health Report Functions ──────────────────────────────────

export interface HealthScore {
    score: 'excellent' | 'good' | 'fair' | 'poor';
    color: string;
    label: string;
    description: string;
    percentage: number; // 0-100 for gauge display
}

/**
 * Calculate Debt-to-Income ratio
 * DTI = (Total Monthly Debt Payments / Gross Monthly Income) × 100
 */
export function calculateDebtToIncome(totalMonthlyDebt: number, monthlySalary: number): number {
    if (monthlySalary <= 0) return 0;
    return Math.round((totalMonthlyDebt / monthlySalary) * 1000) / 10; // one decimal
}

/**
 * Get a health score based on DTI ratio
 * UAE banking standards:
 *  - Excellent: DTI < 20%
 *  - Good: 20-35%
 *  - Fair: 35-50%
 *  - Poor: > 50%
 */
export function getHealthScore(dtiRatio: number): HealthScore {
    if (dtiRatio < 20) {
        return {
            score: 'excellent',
            color: '#10B981', // emerald
            label: 'Excellent',
            description: 'Your debt level is very manageable. You have strong financial health.',
            percentage: Math.max(90, 100 - dtiRatio),
        };
    }
    if (dtiRatio < 35) {
        return {
            score: 'good',
            color: '#3B82F6', // blue
            label: 'Good',
            description: 'Your debt is within a healthy range. Keep your payments on track.',
            percentage: 70 + Math.round((35 - dtiRatio) / 15 * 20),
        };
    }
    if (dtiRatio < 50) {
        return {
            score: 'fair',
            color: '#F59E0B', // amber
            label: 'Fair',
            description: 'Your debt burden is moderate. Refinancing could help reduce your payments.',
            percentage: 40 + Math.round((50 - dtiRatio) / 15 * 30),
        };
    }
    return {
        score: 'poor',
        color: '#EF4444', // red
        label: 'Needs Attention',
        description: 'Your debt burden is high. We strongly recommend exploring refinance options.',
        percentage: Math.max(10, 40 - Math.round((dtiRatio - 50) / 2)),
    };
}

/**
 * Calculate total interest burden across all loans
 * Returns the total interest remaining to be paid
 */
export function calculateInterestBurden(
    loans: { remainingAmount: number; monthlyEmi: number; interestRate: number }[]
): number {
    let totalInterest = 0;
    for (const loan of loans) {
        const months = estimateRemainingMonths(loan.remainingAmount, loan.monthlyEmi, loan.interestRate);
        const totalPayments = loan.monthlyEmi * months;
        totalInterest += Math.max(0, totalPayments - loan.remainingAmount);
    }
    return Math.round(totalInterest);
}

/**
 * Calculate total potential savings across all loans against all products
 */
export function calculateTotalPotentialSavings(
    loans: LoanDetails[],
    products: BankOffer[]
): { totalMonthlySavings: number; totalNetSavings: number; bestOfferCount: number } {
    let totalMonthlySavings = 0;
    let totalNetSavings = 0;
    let bestOfferCount = 0;

    for (const loan of loans) {
        const results: RefinanceResult[] = [];
        for (const product of products) {
            const result = calculateRefinanceOffer(loan, product);
            if (result) results.push(result);
        }
        const ranked = rankOffers(results);
        if (ranked.length > 0) {
            totalMonthlySavings += ranked[0].monthlySavings;
            totalNetSavings += ranked[0].netSavings;
            bestOfferCount++;
        }
    }

    return { totalMonthlySavings, totalNetSavings, bestOfferCount };
}
