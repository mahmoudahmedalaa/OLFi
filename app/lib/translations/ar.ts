// Arabic translations - ported from web/messages/ar.json + mobile-specific additions
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
        edit: 'تعديل',
        delete: 'حذف',
        seeAll: 'عرض الكل',
        active: 'نشط',
        paidOff: 'مسدد',
        default_: 'متعثر',
        refinanced: 'مُعاد تمويله',
        all: 'الكل',
        completed: 'مكتمل',
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
        debts: 'ديوني',
        offers: 'العروض',
        applications: 'طلباتي',
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
        myDebts: 'ديوني',
        noDebts: 'لا توجد ديون مضافة بعد',
        addFirstDebt: 'أضف أول دين لك للبدء',
        addDebt: 'إضافة دين',
        olfiScore: 'تقييم OLFi',
        scoreGood: 'وضع جيد',
        scoreFair: 'وضع مقبول',
        scorePoor: 'يحتاج إلى اهتمام',
        quickActions: 'إجراءات سريعة',
        addFinance: 'إضافة دين',
        calculator: 'الحاسبة',
        compare: 'مقارنة',
        shariaCenter: 'مركز الشريعة',
        seeAllDebts: 'عرض الكل ←',
        loadingDebts: 'جاري تحميل الديون...',
        startTracking: 'ابدأ بتتبع ديونك واعثر على أسعار أفضل',
        compareOffers: 'قارن عروض OLFi',
        compareOffersDesc: 'توصيات مخصصة لتمويلك',
        financialHealth: 'الصحة المالية',
    },

    // ── Debt Summary Card ───────────────────────────────────────────────────
    debtSummary: {
        totalOutstanding: 'إجمالي المتبقي',
        noDebtsYet: 'لا توجد ديون بعد',
        monthlyEmi: 'القسط الشهري',
        potentialSavings: 'التوفير المحتمل',
        perMonth: '/شهرياً',
    },

    // ── Score Flip Card ─────────────────────────────────────────────────────
    scoreCard: {
        olfiScore: 'تقييم OLFi',
        excellent: 'ممتاز',
        good: 'جيد',
        fair: 'مقبول',
        poor: 'ضعيف',
        topPercent: 'أفضل 10% من المستخدمين',
        tapToFlip: 'اضغط للقلب',
        updatedLastMonth: 'تم التحديث الشهر الماضي',
        unlockTitle: 'افتح تقييم OLFi الخاص بك',
        unlockDesc: 'أضف ديناً لفتح تقييمك المخصص والحصول على أسعار حصرية',
        calculateScore: 'أضف ديناً للفتح',
        addDebtToUnlock: 'أضف ديناً لرؤية تقييمك',
        aecbCreditScore: 'تقييم AECB الائتماني',
        // Dynamic footer by score band
        excellentFooter: 'أفضل 10% من المستخدمين',
        goodFooter: 'أعلى من المتوسط',
        fairFooter: 'هناك مجال للتحسين',
        poorFooter: 'اتخذ إجراءً الآن',
        // AECB lock/unlock states
        aecbLocked: 'تقييم AECB مقفل',
        aecbLockedDesc: 'نتعاون مع AECB لاسترداد تقرير ائتمانك الرسمي. اضغط للبدء.',
        aecbUnlock: 'طلب التقرير الائتماني',
        aecbUnlockDesc: 'تم الطلب بأمان عبر OLFi. عادةً يستغرق 1-2 يوم عمل.',
        aecbPending: 'التقرير قيد الانتظار',
        aecbPendingDesc: 'جاري استرداد تقريرك الائتماني من AECB. تحقق لاحقاً.',
        // OLFi Score explanation modal
        explainTitle: 'كيف يعمل تقييم OLFi',
        explainExcellent: 'ممتاز (750–850)',
        explainExcellentDesc: 'نسبة دينك إلى دخلك صحية والحمل الكلي للديون قابل للإدارة. تؤهلك للحصول على أفضل معدلات OLFi.',
        explainGood: 'جيد (650–749)',
        explainGoodDesc: 'وضعك المالي جيد. تعديلات بسيطة قد ترفعك للفئة الممتازة وتفتح معدلات أفضل.',
        explainFair: 'مقبول (550–649)',
        explainFairDesc: 'التزاماتك الشهرية تضغط على دخلك. توحيد ديونك مع OLFi قد يخفض تقييمك فوراً.',
        explainPoor: 'ضعيف (300–549)',
        explainPoorDesc: 'حجم ديونك مرتفع نسبةً لدخلك. OLFi يمكنه مساعدتك بإعادة الهيكلة وتخفيف الضغط.',
        explainFormula: 'يُحسب التقييم من نسبة الدين إلى الدخل والرصيد الكلي والقسط الشهري - محدّث لحظياً.',
    },

    // ── Financial Health Card ───────────────────────────────────────────────
    healthCard: {
        addSalary: 'أضف راتبك لرؤية تقييم صحتك المالية',
        tapToUpdate: 'اضغط لتحديث ملفك الشخصي',
        monthlyDebt: 'الديون الشهرية',
        financingCost: 'تكلفة التمويل',
        shariaCompliant: '100% متوافق مع الشريعة',
        couldSave: 'يمكنك توفير ~',
        perMonth: '/شهرياً',
        checkOffers: 'تحقق من العروض المخصصة',
        dti: 'نسبة الدين إلى الدخل',
    },

    // ── Debt Preview Card (Dashboard) ──────────────────────────────────────
    debtPreview: {
        profitRate: 'نسبة الربح',
        remaining: 'المتبقي',
        monthlyEmi: 'القسط الشهري',
        repaid: 'مسدد',
        ofOriginal: 'من الدين الأصلي',
        potentialSavings: 'توفير محتمل: ~',
    },

    // ── Debts Tab ───────────────────────────────────────────────────────────
    debts: {
        title: 'ديوني',
        addDebt: 'إضافة دين',
        totalDebt: 'إجمالي المتبقي',
        monthlyPayments: 'الدفعات الشهرية',
        noDebts: 'لا توجد ديون بعد',
        noDebtsDesc: 'أضف أول دين لك لتتبع ديونك ودمجها',
        balance: 'الرصيد',
        monthly: 'شهرياً',
        rate: 'النسبة',
        lender: 'الجهة الممولة',
        deleteTitle: 'حذف الدين',
        deleteMessage: 'إزالة',
        noFiltered: 'لا توجد ديون',
        tryFilter: 'جرّب تغيير الفلتر',
    },

    // ── Offers ───────────────────────────────────────────────────────────────
    offers: {
        title: 'عروض إعادة التمويل',
        subtitle: 'عروض مخصصة بناءً على ملفك الائتماني',
        noOffers: 'لا توجد عروض بعد',
        noOffersDesc: 'أضف ديونك لتصلك عروض إعادة التمويل المخصصة',
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
        readOnlyDesc: 'لا يمكننا تحريك أموالك - أبداً',
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
