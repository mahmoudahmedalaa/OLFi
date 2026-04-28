// Arabic translations — ported from web/messages/ar.json + mobile-specific additions
import type { TranslationKeys } from './en';

const ar: TranslationKeys = {
    // ── Common ──────────────────────────────────────────────────────────────
    common: {
        continue: 'متابعة',
        back: 'رجوع',
        skip: 'تخطي',
        save: 'حفظ',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        loading: 'جاري التحميل...',
        error: 'خطأ',
        success: 'تمّ',
        aed: 'درهم',
    },

    onboarding: {
        next: 'التالي',
        getStarted: 'ابدأ الآن',
        slide1: {
            title: 'تحكم في\nمواردك المالية',
            desc: 'تقوم OLFi بتحليل محفظة ديونك وتجد لك عروضاً أفضل، مما يوفر لك الآلاف من مدفوعات الأرباح'
        },
        slide2: {
            title: 'جميع ديونك\nفي مكان واحد',
            desc: 'اربط حساباتك للحصول على صورة كاملة عن قروضك وبطاقاتك الائتمانية والتزامات الدفع'
        },
        slide3: {
            title: 'انتقل إلى إعادة\nتمويل أذكى',
            desc: 'نقوم بمقارنة المعدلات عبر بدائل التمويل الإسلامي حتى تتمكن من اختيار الأنسب لك'
        },
        slide4: {
            title: 'درجة OLFi\nتفتح لك عروضاً أفضل',
            desc: 'نظام التقييم لدينا يتجاوز مكاتب الائتمان، باستخدام بيانات الخدمات المصرفية المفتوحة لملف مالي أكثر إنصافاً'
        }
    },

    // ── Navigation tabs ──────────────────────────────────────────────────────
    tabs: {
        dashboard: 'الرئيسية',
        loans: 'قروضي',
        offers: 'العروض',
        profile: 'حسابي',
    },

    // ── Auth ─────────────────────────────────────────────────────────────────
    auth: {
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        email: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        firstName: 'الاسم الأول',
        lastName: 'اسم العائلة',
        forgotPassword: 'نسيت كلمة المرور؟',
        noAccount: 'ليس لديك حساب؟',
        haveAccount: 'لديك حساب بالفعل؟',
        signIn: 'دخول',
        welcomeBack: 'مرحباً بعودتك',
        loginWithFaceId: 'دخول بالبصمة',
        continueWithApple: 'متابعة باستخدام أبل',
        or: 'أو',
        resetPassword: 'إعادة تعيين كلمة المرور',
    },

    // ── OTP ──────────────────────────────────────────────────────────────────
    otp: {
        title: 'أدخل الرمز المكوّن من 6 أرقام',
        subtitle: 'أرسلنا رمز المصادقة إلى',
        verify: 'تحقق ومتابعة',
        error: 'الرجاء إدخال الرمز المكوّن من 6 أرقام.',
        invalidCode: 'رمز غير صحيح',
        invalidMessage: 'الرمز غير صحيح. استخدم 123456 للاختبار.',
    },

    // ── Dashboard ────────────────────────────────────────────────────────────
    dashboard: {
        greeting: 'صباح الخير',
        totalDebt: 'إجمالي الديون',
        monthlySavings: 'التوفير الشهري المتوقع',
        debtFreeIn: 'تخلّص من ديونك في',
        years: 'سنوات',
        viewOffers: 'عرض العروض',
        myLoans: 'قروضي',
        noLoans: 'لا توجد قروض مضافة بعد',
        addFirstLoan: 'أضف قرضك الأول للبدء',
        addLoan: 'إضافة قرض',
        olfiScore: 'تقييم OLFi',
        scoreGood: 'وضع جيد',
        scoreFair: 'وضع مقبول',
        scorePoor: 'يحتاج إلى اهتمام',
    },

    // ── Loans ────────────────────────────────────────────────────────────────
    loans: {
        title: 'قروضي',
        addLoan: 'إضافة قرض',
        totalDebt: 'إجمالي المتبقي',
        monthlyPayments: 'الدفعات الشهرية',
        noLoans: 'لا توجد قروض بعد',
        noLoansDesc: 'أضف قرضك الأول لتتبع ديونك ودمجها',
        balance: 'الرصيد',
        monthly: 'شهرياً',
        rate: 'النسبة',
        lender: 'الجهة الممولة',
    },

    // ── Offers ───────────────────────────────────────────────────────────────
    offers: {
        title: 'عروض إعادة التمويل',
        subtitle: 'عروض مخصصة بناءً على ملفك الائتماني',
        noOffers: 'لا توجد عروض بعد',
        noOffersDesc: 'أضف قروضك لتصلك عروض إعادة التمويل المخصصة',
        monthlySaving: 'التوفير الشهري',
        totalSaving: 'إجمالي التوفير',
        rate: 'النسبة',
        term: 'المدة',
        months: 'أشهر',
        applyNow: 'تقدّم الآن',
        islamicOnly: 'التمويل الإسلامي فقط',
    },

    // ── Profile ──────────────────────────────────────────────────────────────
    profile: {
        title: 'الحساب',
        account: 'بياناتي',
        preferences: 'التفضيلات',
        support: 'الدعم',
        language: 'اللغة',
        theme: 'المظهر',
        darkMode: 'الوضع الداكن',
        notifications: 'الإشعارات',
        security: 'الأمان والتحقق',
        helpCenter: 'مركز المساعدة',
        privacyPolicy: 'سياسة الخصوصية',
        termsOfService: 'الشروط والأحكام',
        contactUs: 'تواصل معنا',
        logOut: 'تسجيل الخروج',
        english: 'English',
        arabic: 'العربية',
        restartRequired: 'تم تغيير اللغة. أعد تشغيل التطبيق لتطبيق التغييرات الكاملة.',
        version: 'الإصدار',
    },

    // ── Calculator ───────────────────────────────────────────────────────────
    calculator: {
        title: 'الحاسبة',
        emi: 'القسط',
        affordability: 'القدرة الائتمانية',
        compare: 'مقارنة',
        financingAmount: 'مبلغ التمويل (درهم)',
        interestRate: 'نسبة الفائدة',
        expectedInterestRate: 'نسبة الفائدة المتوقعة',
        tenure: 'المدة',
        months: 'أشهر',
        salary: 'الراتب الشهري (درهم)',
        existingPayments: 'الدفعات الشهرية الحالية (درهم)',
        financingTerm: 'مدة التمويل المطلوبة',
        rateA: 'النسبة أ',
        rateB: 'النسبة ب',
        monthlyEmi: 'القسط الشهري',
        totalPayable: 'إجمالي المدفوع',
        totalInterest: 'إجمالي الفائدة',
        interestShare: 'نسبة الفائدة',
    },

    // ── KYC ─────────────────────────────────────────────────────────────────
    kyc: {
        title: 'التحقق من الهوية',
        step1Title: 'تحقق من هويتك',
        step1Desc: 'نحتاج إلى التحقق من هويتك للامتثال للوائح الإماراتية. يستغرق ذلك أقل من دقيقتين.',
        startVerification: 'ابدأ التحقق',
        faceTitle: 'مسح الوجه',
        faceDesc: 'انظر مباشرة إلى الكاميرا وابقَ ثابتاً',
        scanning: 'جاري المسح...',
        scanComplete: 'اكتمل المسح',
    },

    // ── Open Banking ────────────────────────────────────────────────────────
    openBanking: {
        title: 'ربط حسابك البنكي',
        subtitle: 'يستخدم OLFi الخدمات المصرفية المفتوحة لقراءة معاملاتك بأمان وتقديم عروض مخصصة لك',
        readOnly: 'صلاحية قراءة فقط',
        readOnlyDesc: 'لا يمكننا تحريك أموالك — أبداً',
        bankLevel: 'تشفير على مستوى البنوك',
        bankLevelDesc: 'مدعوم من Lean Technologies، خاضع لرقابة المصرف المركزي',
        revoke: 'إلغاء في أي وقت',
        revokeDesc: 'افصل حسابك البنكي فوراً من الإعدادات',
        connect: 'ربط حسابي البنكي',
        skipForNow: 'تخطي الآن',
        poweredBy: 'مدعوم من',
    },
} as const;

export default ar;
