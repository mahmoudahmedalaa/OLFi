// Translation key shape — both en.ts and ar.ts must satisfy this interface
export interface TranslationKeys {
    common: {
        continue: string; back: string; skip: string; save: string; cancel: string;
        confirm: string; loading: string; error: string; success: string; aed: string;
        edit: string; delete: string; seeAll: string; active: string; paidOff: string;
        default_: string; refinanced: string; all: string; completed: string;
    };
    onboarding: {
        next: string; getStarted: string;
        slide1: { title: string; desc: string };
        slide2: { title: string; desc: string };
        slide3: { title: string; desc: string };
        slide4: { title: string; desc: string };
    };
    tabs: { dashboard: string; debts: string; offers: string; applications: string; profile: string };
    auth: {
        login: string; signup: string; email: string; password: string;
        firstName: string; lastName: string; forgotPassword: string;
        noAccount: string; haveAccount: string; signIn: string;
        welcomeBack: string; loginWithFaceId: string; continueWithApple: string;
        or: string; resetPassword: string;
    };
    otp: { title: string; subtitle: string; verify: string; error: string; invalidCode: string; invalidMessage: string };
    dashboard: {
        greeting: string; totalDebt: string; monthlySavings: string; debtFreeIn: string;
        years: string; viewOffers: string; myDebts: string; noDebts: string;
        addFirstDebt: string; addDebt: string; olfiScore: string;
        scoreGood: string; scoreFair: string; scorePoor: string;
        quickActions: string; addFinance: string; calculator: string; compare: string;
        shariaCenter: string; seeAllDebts: string; loadingDebts: string;
        startTracking: string; compareOffers: string; compareOffersDesc: string;
        financialHealth: string;
    };
    debtSummary: {
        totalOutstanding: string; noDebtsYet: string; monthlyEmi: string;
        potentialSavings: string; perMonth: string;
    };
    scoreCard: {
        olfiScore: string; excellent: string; good: string; fair: string; poor: string;
        topPercent: string; tapToFlip: string; updatedLastMonth: string;
        unlockTitle: string; unlockDesc: string; calculateScore: string;
        addDebtToUnlock: string; aecbCreditScore: string;
        // Dynamic footer based on score band
        excellentFooter: string; goodFooter: string; fairFooter: string; poorFooter: string;
        // AECB lock/unlock
        aecbLocked: string; aecbLockedDesc: string; aecbUnlock: string; aecbUnlockDesc: string;
        aecbPending: string; aecbPendingDesc: string;
        // OLFi Score explanation modal
        explainTitle: string;
        explainExcellent: string; explainExcellentDesc: string;
        explainGood: string; explainGoodDesc: string;
        explainFair: string; explainFairDesc: string;
        explainPoor: string; explainPoorDesc: string;
        explainFormula: string;
    };
    healthCard: {
        addSalary: string; tapToUpdate: string; monthlyDebt: string;
        financingCost: string; shariaCompliant: string; couldSave: string;
        perMonth: string; checkOffers: string; dti: string;
    };
    debtPreview: {
        profitRate: string; remaining: string; monthlyEmi: string;
        repaid: string; ofOriginal: string; potentialSavings: string;
    };
    debts: {
        title: string; addDebt: string; totalDebt: string; monthlyPayments: string;
        noDebts: string; noDebtsDesc: string; balance: string; monthly: string;
        rate: string; lender: string; deleteTitle: string; deleteMessage: string;
        noFiltered: string; tryFilter: string;
    };
    offers: {
        title: string; subtitle: string; noOffers: string; noOffersDesc: string;
        monthlySaving: string; totalSaving: string; rate: string; term: string;
        months: string; applyNow: string; islamicOnly: string;
    };
    profile: {
        title: string; account: string; preferences: string; support: string;
        language: string; theme: string; darkMode: string; notifications: string;
        security: string; helpCenter: string; privacyPolicy: string; termsOfService: string;
        contactUs: string; logOut: string; english: string; arabic: string;
        restartRequired: string; version: string;
    };
    calculator: {
        title: string; emi: string; affordability: string; compare: string;
        financingAmount: string; interestRate: string; expectedInterestRate: string;
        tenure: string; months: string; salary: string; existingPayments: string;
        financingTerm: string; rateA: string; rateB: string; monthlyEmi: string;
        totalPayable: string; totalInterest: string; interestShare: string;
    };
    kyc: {
        title: string; step1Title: string; step1Desc: string; startVerification: string;
        faceTitle: string; faceDesc: string; scanning: string; scanComplete: string;
    };
    openBanking: {
        title: string; subtitle: string; readOnly: string; readOnlyDesc: string;
        bankLevel: string; bankLevelDesc: string; revoke: string; revokeDesc: string;
        connect: string; skipForNow: string; poweredBy: string;
    };
}

// English baseline translations
const en: TranslationKeys = {
    // ── Common ──────────────────────────────────────────────────────────────
    common: {
        continue: 'Continue',
        back: 'Back',
        skip: 'Skip',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        aed: 'AED',
        edit: 'Edit',
        delete: 'Delete',
        seeAll: 'See All',
        active: 'Active',
        paidOff: 'Paid Off',
        default_: 'Default',
        refinanced: 'Refinanced',
        all: 'All',
        completed: 'Completed',
    },

    onboarding: {
        next: 'Next',
        getStarted: 'Get Started',
        slide1: {
            title: 'Take Control of\nYour Finances',
            desc: 'OLFi analyzes your debt portfolio and finds you better deals, saving you thousands in profit payments'
        },
        slide2: {
            title: 'See All Your\nDebt in One Place',
            desc: 'Connect your accounts to get a complete picture of your loans, credit cards, and payment obligations'
        },
        slide3: {
            title: 'Switch to Smarter\nRefinancing',
            desc: 'We compare rates across Islamic financing alternatives so you can pick the one that fits you best'
        },
        slide4: {
            title: 'Your OLFi Score\nUnlocks Better Offers',
            desc: 'Our scoring system goes beyond credit bureaus, using Open Banking data for a fairer financial profile'
        }
    },

    // ── Navigation tabs ──────────────────────────────────────────────────────
    tabs: {
        dashboard: 'Dashboard',
        debts: 'Debts',
        offers: 'Offers',
        applications: 'Applications',
        profile: 'Profile',
    },

    // ── Auth ─────────────────────────────────────────────────────────────────
    auth: {
        login: 'Log in',
        signup: 'Create account',
        email: 'Email',
        password: 'Password',
        firstName: 'First name',
        lastName: 'Last name',
        forgotPassword: 'Forgot password?',
        noAccount: "Don't have an account?",
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        welcomeBack: 'Welcome back',
        loginWithFaceId: 'Login with Face ID',
        continueWithApple: 'Continue with Apple',
        or: 'or',
        resetPassword: 'Reset Password',
    },

    // ── OTP ──────────────────────────────────────────────────────────────────
    otp: {
        title: 'Enter 6-digit code',
        subtitle: 'We just sent an authentication code to',
        verify: 'Verify & Continue',
        error: 'Please enter the 6-digit code.',
        invalidCode: 'Invalid Code',
        invalidMessage: 'Incorrect code. Use 123456 for TestFlight testing.',
    },

    // ── Dashboard ────────────────────────────────────────────────────────────
    dashboard: {
        greeting: 'Good morning',
        totalDebt: 'Total Debt',
        monthlySavings: 'Est. Monthly Savings',
        debtFreeIn: 'Debt-free in',
        years: 'yrs',
        viewOffers: 'View Offers',
        myDebts: 'My Debts',
        noDebts: 'No debts added yet',
        addFirstDebt: 'Add your first debt to get started',
        addDebt: 'Add Debt',
        olfiScore: 'OLFi Score',
        scoreGood: 'Good standing',
        scoreFair: 'Fair standing',
        scorePoor: 'Needs attention',
        quickActions: 'Quick Actions',
        addFinance: 'Add Debt',
        calculator: 'Calculator',
        compare: 'Compare',
        shariaCenter: 'Sharia Center',
        seeAllDebts: 'See All →',
        loadingDebts: 'Loading debts...',
        startTracking: 'Start tracking your debts and find better rates',
        compareOffers: 'Compare OLFi Offers',
        compareOffersDesc: 'Personalized recommendations for your financing',
        financialHealth: 'Financial Health',
    },

    // ── Debt Summary Card ───────────────────────────────────────────────────
    debtSummary: {
        totalOutstanding: 'Total Outstanding',
        noDebtsYet: 'No debts yet',
        monthlyEmi: 'Monthly EMI',
        potentialSavings: 'Potential Savings',
        perMonth: '/mo',
    },

    // ── Score Flip Card ─────────────────────────────────────────────────────
    scoreCard: {
        olfiScore: 'OLFi Score',
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        poor: 'Poor',
        topPercent: 'Top 10% of users',
        tapToFlip: 'Tap to flip',
        updatedLastMonth: 'Updated last month',
        unlockTitle: 'Unlock Your OLFi Score',
        unlockDesc: 'Add a debt to unlock your personalized score and exclusive rates',
        calculateScore: 'Add Debt to Unlock',
        addDebtToUnlock: 'Add a debt to see your score',
        aecbCreditScore: 'AECB Credit Score',
        // Dynamic footer by score band
        excellentFooter: 'Top 10% of users',
        goodFooter: 'Above average standing',
        fairFooter: 'Room to improve',
        poorFooter: 'Take action now',
        // AECB lock/unlock states
        aecbLocked: 'AECB Score Locked',
        aecbLockedDesc: 'We partner with AECB to retrieve your official credit report. Tap to initiate.',
        aecbUnlock: 'Request Credit Report',
        aecbUnlockDesc: 'Securely requested via OLFi. Usually takes 1-2 business days.',
        aecbPending: 'Report Pending',
        aecbPendingDesc: 'Your AECB credit report is being retrieved. Check back soon.',
        // OLFi Score explanation modal
        explainTitle: 'How Your OLFi Score Works',
        explainExcellent: 'Excellent (750-850)',
        explainExcellentDesc: 'Your debt-to-income ratio is healthy and your total debt load is manageable. You qualify for the best OLFi refinancing rates.',
        explainGood: 'Good (650-749)',
        explainGoodDesc: 'Your finances are in good shape. Minor adjustments could push you into the Excellent band and unlock better rates.',
        explainFair: 'Fair (550-649)',
        explainFairDesc: 'Your monthly obligations are stretching your income. Consolidating debts with OLFi could help lower your score immediately.',
        explainPoor: 'Poor (300-549)',
        explainPoorDesc: 'Your debt burden is high relative to your income. OLFi can help you restructure and reduce pressure with a consolidated plan.',
        explainFormula: 'Score is calculated from your debt-to-income ratio, total outstanding balance, and monthly EMI load — updated in real time.',
    },

    // ── Financial Health Card ───────────────────────────────────────────────
    healthCard: {
        addSalary: 'Add your salary to see your health score',
        tapToUpdate: 'Tap to update your profile',
        monthlyDebt: 'Monthly Debt',
        financingCost: 'Financing Cost',
        shariaCompliant: '100% Sharia-Compliant',
        couldSave: 'You could save ~AED',
        perMonth: '/month',
        checkOffers: 'Check personalized offers',
        dti: 'Debt-to-Income',
    },

    // ── Debt Preview Card (Dashboard) ──────────────────────────────────────
    debtPreview: {
        profitRate: 'Profit Rate',
        remaining: 'Remaining',
        monthlyEmi: 'Monthly EMI',
        repaid: 'Repaid',
        ofOriginal: 'of original debt',
        potentialSavings: 'Potential savings: ~AED',
    },

    // ── Debts Tab ───────────────────────────────────────────────────────────
    debts: {
        title: 'My Debts',
        addDebt: 'Add Debt',
        totalDebt: 'Total Outstanding',
        monthlyPayments: 'Monthly Payments',
        noDebts: 'No debts yet',
        noDebtsDesc: 'Add your first debt to track and consolidate',
        balance: 'Balance',
        monthly: 'Monthly',
        rate: 'Rate',
        lender: 'Lender',
        deleteTitle: 'Delete Debt',
        deleteMessage: 'Remove',
        noFiltered: 'No debts found',
        tryFilter: 'Try changing the filter',
    },

    // ── Offers ───────────────────────────────────────────────────────────────
    offers: {
        title: 'Refinancing Offers',
        subtitle: 'Personalised offers based on your profile',
        noOffers: 'No offers yet',
        noOffersDesc: 'Add your debts to see personalised refinancing offers',
        monthlySaving: 'Monthly Saving',
        totalSaving: 'Total Saving',
        rate: 'Rate',
        term: 'Term',
        months: 'months',
        applyNow: 'Apply Now',
        islamicOnly: 'Islamic Finance Only',
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    profile: {
        title: 'Profile',
        account: 'Account',
        preferences: 'Preferences',
        support: 'Support',
        language: 'Language',
        theme: 'Theme',
        darkMode: 'Dark Mode',
        notifications: 'Notifications',
        security: 'Security & KYC',
        helpCenter: 'Help Center',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        contactUs: 'Contact Us',
        logOut: 'Log Out',
        english: 'English',
        arabic: 'العربية',
        restartRequired: 'Language changed. Please restart the app for the full effect.',
        version: 'Version',
    },

    // ── Calculator ───────────────────────────────────────────────────────────
    calculator: {
        title: 'Calculator',
        emi: 'EMI',
        affordability: 'Affordability',
        compare: 'Compare',
        financingAmount: 'Financing Amount (AED)',
        interestRate: 'Interest Rate',
        expectedInterestRate: 'Expected Interest Rate',
        tenure: 'Tenure',
        months: 'months',
        salary: 'Monthly Salary (AED)',
        existingPayments: 'Existing Monthly Payments (AED)',
        financingTerm: 'Desired Financing Term',
        rateA: 'Rate A',
        rateB: 'Rate B',
        monthlyEmi: 'Monthly EMI',
        totalPayable: 'Total Payable',
        totalInterest: 'Total Interest',
        interestShare: 'Interest Share',
    },

    // ── KYC ─────────────────────────────────────────────────────────────────
    kyc: {
        title: 'Identity Verification',
        step1Title: 'Verify your identity',
        step1Desc: 'We need to verify your identity to comply with UAE regulations. This takes under 2 minutes.',
        startVerification: 'Start Verification',
        faceTitle: 'Face scan',
        faceDesc: 'Look directly at the camera and keep still',
        scanning: 'Scanning...',
        scanComplete: 'Scan complete',
    },

    // ── Open Banking ────────────────────────────────────────────────────────
    openBanking: {
        title: 'Connect your bank',
        subtitle: 'OLFi uses Open Banking to securely read your transactions and give you personalised offers',
        readOnly: 'Read-only access',
        readOnlyDesc: 'We can never move your money — ever',
        bankLevel: 'Bank-level encryption',
        bankLevelDesc: 'Powered by Lean Technologies, regulated by CBUAE',
        revoke: 'Revoke anytime',
        revokeDesc: 'Disconnect your bank instantly from settings',
        connect: 'Connect My Bank',
        skipForNow: 'Skip for now',
        poweredBy: 'Powered by',
    },
};

export default en;
