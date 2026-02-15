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
