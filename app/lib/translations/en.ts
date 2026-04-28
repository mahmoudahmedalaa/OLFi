// Translation key shape — both en.ts and ar.ts must satisfy this interface
export interface TranslationKeys {
    common: {
        continue: string; back: string; skip: string; save: string; cancel: string;
        confirm: string; loading: string; error: string; success: string; aed: string;
    };
    onboarding: {
        next: string; getStarted: string;
        slide1: { title: string; desc: string };
        slide2: { title: string; desc: string };
        slide3: { title: string; desc: string };
        slide4: { title: string; desc: string };
    };
    tabs: { dashboard: string; loans: string; offers: string; profile: string };
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
        years: string; viewOffers: string; myLoans: string; noLoans: string;
        addFirstLoan: string; addLoan: string; olfiScore: string;
        scoreGood: string; scoreFair: string; scorePoor: string;
    };
    loans: {
        title: string; addLoan: string; totalDebt: string; monthlyPayments: string;
        noLoans: string; noLoansDesc: string; balance: string; monthly: string; rate: string; lender: string;
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
        loans: 'Loans',
        offers: 'Offers',
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
        myLoans: 'My Loans',
        noLoans: 'No loans added yet',
        addFirstLoan: 'Add your first loan to get started',
        addLoan: 'Add Loan',
        olfiScore: 'OLFi Score',
        scoreGood: 'Good standing',
        scoreFair: 'Fair standing',
        scorePoor: 'Needs attention',
    },

    // ── Loans ────────────────────────────────────────────────────────────────
    loans: {
        title: 'My Loans',
        addLoan: 'Add Loan',
        totalDebt: 'Total Outstanding',
        monthlyPayments: 'Monthly Payments',
        noLoans: 'No loans yet',
        noLoansDesc: 'Add your first loan to track and consolidate your debt',
        balance: 'Balance',
        monthly: 'Monthly',
        rate: 'Rate',
        lender: 'Lender',
    },

    // ── Offers ───────────────────────────────────────────────────────────────
    offers: {
        title: 'Refinancing Offers',
        subtitle: 'Personalised offers based on your profile',
        noOffers: 'No offers yet',
        noOffersDesc: 'Add your loans to see personalised refinancing offers',
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
