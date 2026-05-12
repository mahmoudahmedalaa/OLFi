
// OLFI App v2 — Full rewrite with brand identity + all requested features
const { useState, useEffect, useRef, useCallback } = React;

// ── Brand tokens (BuyOut/OLFI brand guide) ─────────────────────
const B = {
  navy:    '#0F172A',
  navyMid: '#1E293B',
  navyLt:  '#334155',
  emerald: '#10B981',
  teal:    '#14B8A6',
  blue:    '#3B82F6',
  text:    '#F8FAFC',
  muted:   '#94A3B8',
  dim:     '#64748B',
  error:   '#EF4444',
  warn:    '#F59E0B',
  grad:    'linear-gradient(135deg, #10B981, #14B8A6)',
  gradPrem:'linear-gradient(135deg, #10B981, #3B82F6)',
  border:  'rgba(51,65,85,0.8)',
};

// ── Translations ───────────────────────────────────────────────
const T = {
  en: {
    getStarted: 'Get Started',
    logIn: 'Log In',
    alreadyHave: 'Already have an account?',
    signIn: 'Sign In',
    arabicTag: 'منصة إعادة التمويل المتوافقة مع الشريعة الإسلامية · الإمارات',
    slide1h: 'Ready to refinance smarter?',
    slide1s: 'One app. All your UAE debts. Best Sharia-compliant offers.',
    slide2h: 'See all your debts in one place',
    slide2s: 'Personal loans, cards, auto — unified, ranked, and ready to refinance.',
    slide3h: 'Convert to Sharia-compliant finance',
    slide3s: 'Switch from interest-based loans to certified Murābaḥa, Tawarruq & Ijāra.',
    slide4h: 'Know your real credit health',
    slide4s: 'Free CBUAE score + our proprietary OLFI Score — understand every factor.',
    dashboard: 'Dashboard',
    totalDebt: 'Total Debt',
    monthlyEMI: 'Monthly EMI',
    yourScore: 'Your Score',
    goodMorning: 'Good morning,',
    opportunities: 'Refinance Opportunity',
    savePer: 'Save AED',
    perMonth: '/mo',
    liabilities: 'Your Liabilities',
    viewAll: 'View All →',
    offers: 'Offers',
    score: 'Score',
    profile: 'Profile',
    home: 'Home',
    applyNow: 'Apply Now',
    bestMatch: '★ BEST MATCH',
    profitRate: 'profit rate',
    monthlySaving: 'Monthly Saving',
    newEMI: 'New EMI',
    scoreMatch: 'Score Match',
    filterAll: 'All',
    filterAPR: 'Lowest APR',
    filterEMI: 'Lowest EMI',
    filterFast: 'Fastest',
    filterTerm: 'Shortest Term',
    shariaOnly: '✦ Sharia-Compliant Offers Only',
  },
  ar: {
    getStarted: 'ابدأ الآن',
    logIn: 'تسجيل الدخول',
    alreadyHave: 'لديك حساب بالفعل؟',
    signIn: 'تسجيل الدخول',
    arabicTag: 'منصة إعادة التمويل المتوافقة مع الشريعة الإسلامية · الإمارات',
    slide1h: 'هل أنت مستعد لإعادة التمويل بذكاء؟',
    slide1s: 'تطبيق واحد. جميع ديونك في الإمارات. أفضل العروض الإسلامية.',
    slide2h: 'اطّلع على جميع ديونك في مكان واحد',
    slide2s: 'القروض الشخصية، البطاقات، السيارات — موحّدة ومصنّفة.',
    slide3h: 'تحوّل إلى التمويل الإسلامي',
    slide3s: 'انتقل من القروض الربوية إلى المرابحة والتورق والإجارة.',
    slide4h: 'اعرف صحّتك الائتمانية الحقيقية',
    slide4s: 'درجة المصرف المركزي مجانًا + درجة أولفي الخاصة.',
    dashboard: 'الرئيسية',
    totalDebt: 'إجمالي الديون',
    monthlyEMI: 'القسط الشهري',
    yourScore: 'درجتك',
    goodMorning: 'صباح الخير،',
    opportunities: 'فرصة إعادة التمويل',
    savePer: 'وفّر درهم',
    perMonth: '/شهر',
    liabilities: 'التزاماتك',
    viewAll: 'عرض الكل →',
    offers: 'العروض',
    score: 'الدرجة',
    profile: 'الملف',
    home: 'الرئيسية',
    applyNow: 'تقدّم الآن',
    bestMatch: '★ الأفضل',
    profitRate: 'معدل الربح',
    monthlySaving: 'التوفير الشهري',
    newEMI: 'القسط الجديد',
    scoreMatch: 'تطابق الدرجة',
    filterAll: 'الكل',
    filterAPR: 'أقل نسبة',
    filterEMI: 'أقل قسط',
    filterFast: 'الأسرع',
    filterTerm: 'أقصر مدة',
    shariaOnly: '✦ عروض متوافقة مع الشريعة فقط',
  },
  ur: {
    getStarted: 'شروع کریں',
    logIn: 'لاگ ان',
    alreadyHave: 'پہلے سے اکاؤنٹ ہے؟',
    signIn: 'سائن ان کریں',
    arabicTag: 'شریعت کے مطابق ری فائنانس پلیٹ فارم · یو اے ای',
    slide1h: 'ہوشیاری سے ری فائنانس کریں؟',
    slide1s: 'ایک ایپ۔ تمام UAE قرضے۔ بہترین اسلامی آفرز۔',
    slide2h: 'تمام قرضے ایک جگہ دیکھیں',
    slide2s: 'پرسنل لون، کارڈ، کار — یکجا، مرتب، ری فائنانس کے لیے تیار۔',
    slide3h: 'اسلامی مالیات میں تبدیل ہوں',
    slide3s: 'سودی قرضوں سے مرابحہ، تورق اور اجارہ میں منتقل ہوں۔',
    slide4h: 'اپنی کریڈٹ صحت جانیں',
    slide4s: 'مفت CBUAE اسکور + ہمارا OLFI اسکور۔',
    dashboard: 'ڈیش بورڈ',
    totalDebt: 'کل قرضہ',
    monthlyEMI: 'ماہانہ EMI',
    yourScore: 'آپ کا اسکور',
    goodMorning: 'صبح بخیر،',
    opportunities: 'ری فائنانس موقع',
    savePer: 'بچائیں AED',
    perMonth: '/ماہ',
    liabilities: 'آپ کے قرضے',
    viewAll: 'سب دیکھیں →',
    offers: 'آفرز',
    score: 'اسکور',
    profile: 'پروفائل',
    home: 'ہوم',
    applyNow: 'ابھی اپلائی کریں',
    bestMatch: '★ بہترین',
    profitRate: 'منافع کی شرح',
    monthlySaving: 'ماہانہ بچت',
    newEMI: 'نئی EMI',
    scoreMatch: 'اسکور میچ',
    filterAll: 'سب',
    filterAPR: 'کم APR',
    filterEMI: 'کم EMI',
    filterFast: 'تیز ترین',
    filterTerm: 'مختصر مدت',
    shariaOnly: '✦ صرف شریعت کے مطابق آفرز',
  },
  hi: {
    getStarted: 'शुरू करें',
    logIn: 'लॉग इन',
    alreadyHave: 'पहले से खाता है?',
    signIn: 'साइन इन करें',
    arabicTag: 'शरिया-अनुपालक रिफाइनेंस प्लेटफॉर्म · UAE',
    slide1h: 'स्मार्ट रिफाइनेंस के लिए तैयार?',
    slide1s: 'एक ऐप। सभी UAE लोन। सर्वश्रेष्ठ इस्लामिक ऑफर।',
    slide2h: 'सभी कर्ज एक जगह देखें',
    slide2s: 'पर्सनल लोन, कार्ड, ऑटो — एकीकृत और रिफाइनेंस के लिए तैयार।',
    slide3h: 'शरिया-अनुपालक वित्त में बदलें',
    slide3s: 'ब्याज-आधारित लोन से मुरबाहा, तवारुक और इजारा में स्विच करें।',
    slide4h: 'अपना असली क्रेडिट स्कोर जानें',
    slide4s: 'मुफ़्त CBUAE स्कोर + हमारा OLFI स्कोर।',
    dashboard: 'डैशबोर्ड',
    totalDebt: 'कुल कर्ज',
    monthlyEMI: 'मासिक EMI',
    yourScore: 'आपका स्कोर',
    goodMorning: 'सुप्रभात,',
    opportunities: 'रिफाइनेंस अवसर',
    savePer: 'बचाएं AED',
    perMonth: '/माह',
    liabilities: 'आपके लोन',
    viewAll: 'सब देखें →',
    offers: 'ऑफर',
    score: 'स्कोर',
    profile: 'प्रोफाइल',
    home: 'होम',
    applyNow: 'अभी आवेदन करें',
    bestMatch: '★ सर्वश्रेष्ठ',
    profitRate: 'लाभ दर',
    monthlySaving: 'मासिक बचत',
    newEMI: 'नई EMI',
    scoreMatch: 'स्कोर मिलान',
    filterAll: 'सभी',
    filterAPR: 'कम APR',
    filterEMI: 'कम EMI',
    filterFast: 'सबसे तेज़',
    filterTerm: 'कम अवधि',
    shariaOnly: '✦ केवल शरिया-अनुपालक ऑफर',
  },
};

// ── Tooltip / Info component ───────────────────────────────────
const TOOLTIPS = {
  olfiScore: {
    title: 'OLFI Score',
    body: 'OLFI Score is our proprietary credit-health metric combining your CBUAE bureau data, open-banking cash flow, payment discipline, and employment stability. Unlike a static bureau score, it updates in real-time and factors in your full financial behaviour — giving you a more accurate picture of your refinance eligibility.',
  },
  cbuaeScore: {
    title: 'CBUAE Credit Score',
    body: 'The CBUAE (Central Bank of UAE) credit score is the official bureau score issued by Al Etihad Credit Bureau (AECB). It ranges from 300 to 900 and reflects your repayment history across all UAE lenders. OLFI provides this score to you for free.',
  },
  murabaha: {
    title: 'Murābaḥa (مرابحة)',
    body: 'A Sharia-compliant sale contract where the bank buys an asset and sells it to you at a disclosed profit margin. No interest (riba) is charged. You pay in instalments at a fixed profit rate — fully halal.',
  },
  tawarruq: {
    title: 'Tawarruq (التورق)',
    body: 'A Sharia-compliant liquidity instrument. The bank purchases a commodity and sells it to you on a deferred basis. You then sell it to raise cash. Used for personal financing without riba.',
  },
  ijara: {
    title: 'Ijāra (الإجارة)',
    body: 'An Islamic leasing arrangement — the bank buys an asset and leases it to you for a fixed period. Similar to a hire-purchase but structured to be free of interest. Common for auto and property financing.',
  },
  dbr: {
    title: 'Debt Burden Ratio (DBR)',
    body: 'DBR is the percentage of your monthly income that goes toward debt repayments. The CBUAE caps DBR at 50% for salaried UAE residents. A lower DBR improves your refinance eligibility and the profit rates lenders offer you.',
  },
  apr: {
    title: 'APR / Profit Rate',
    body: 'For Sharia-compliant products, we show a "profit rate" rather than an interest rate. It works similarly — it\'s the annual cost of the financing expressed as a percentage of the outstanding amount. Lower is better.',
  },
  emi: {
    title: 'EMI (Equal Monthly Instalment)',
    body: 'Your fixed monthly payment toward a loan or financing facility. It covers both the principal amount and the profit/interest. Refinancing typically aims to reduce your EMI by securing a lower profit rate or extending the tenure.',
  },
};

function InfoTooltip({ id, lang = 'en' }) {
  const [open, setOpen] = useState(false);
  const tip = TOOLTIPS[id];
  if (!tip) return null;
  return (
    <>
      <span
        onClick={e => { e.stopPropagation(); setOpen(true); }}
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 16, height: 16, borderRadius: '50%',
          background: 'rgba(16,185,129,0.2)', color: B.emerald,
          fontSize: 10, fontWeight: 900, cursor: 'pointer',
          flexShrink: 0, marginLeft: 4, lineHeight: 1,
          border: '1px solid rgba(16,185,129,0.4)',
        }}
      >?</span>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 9999, display: 'flex', alignItems: 'flex-end', padding: '0 0 40px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: B.navyMid, borderRadius: '24px 24px 0 0',
              padding: '24px 24px 32px', width: '100%',
              border: `1px solid ${B.navyLt}`,
              boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: B.navyLt, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: B.emerald, fontSize: 16, fontWeight: 900 }}>?</span>
              </div>
              <h3 style={{ color: B.text, fontSize: 18, fontWeight: 800, margin: 0 }}>{tip.title}</h3>
            </div>
            <p style={{ color: B.muted, fontSize: 14, lineHeight: 1.7, margin: '0 0 20px' }}>{tip.body}</p>
            <div
              onClick={() => setOpen(false)}
              style={{
                background: B.emerald, color: '#fff', borderRadius: 14,
                padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
            >Got it</div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Shared UI ──────────────────────────────────────────────────
function Btn({ children, onPress, variant = 'primary', style = {}, small = false }) {
  const [p, setP] = useState(false);
  const variants = {
    primary:   { background: B.grad, color: '#fff', boxShadow: '0 4px 20px rgba(16,185,129,0.35)' },
    secondary: { background: B.navyMid, color: B.text, border: `1px solid ${B.navyLt}` },
    outline:   { background: 'transparent', color: B.emerald, border: `1.5px solid ${B.emerald}` },
    ghost:     { background: 'transparent', color: B.muted },
    dark:      { background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' },
  };
  return (
    <div
      onMouseDown={() => setP(true)} onMouseUp={() => { setP(false); onPress && onPress(); }}
      onTouchStart={() => setP(true)} onTouchEnd={() => { setP(false); onPress && onPress(); }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 14, fontFamily: 'inherit', fontSize: small ? 13 : 16, fontWeight: 700,
        cursor: 'pointer', border: 'none', transition: 'all 0.15s',
        padding: small ? '10px 18px' : '15px 20px', width: '100%',
        opacity: p ? 0.82 : 1, transform: p ? 'scale(0.975)' : 'scale(1)',
        ...variants[variant], ...style,
      }}
    >{children}</div>
  );
}

function TopBar({ title, onBack, rightEl, light = false }) {
  const c = light ? '#fff' : B.text;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 8px', minHeight: 52 }}>
      {onBack
        ? <div onClick={onBack} style={{ cursor: 'pointer', padding: 6, marginLeft: -6 }}>
            <svg width="10" height="18" viewBox="0 0 10 18" fill="none"><path d="M9 1L1 9l8 8" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        : <div style={{ width: 28 }} />}
      <span style={{ fontSize: 16, fontWeight: 700, color: c, letterSpacing: -0.3 }}>{title}</span>
      {rightEl || <div style={{ width: 28 }} />}
    </div>
  );
}

function BottomTabs({ tab, onTab, t }) {
  const tabs = [
    { id: 'home',    label: t.home,    icon: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: 'offers',  label: t.offers,  icon: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke={c} strokeWidth="2"/><path d="M3 10h18M7 15h4" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg> },
    { id: 'apps',    label: 'My Apps', icon: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke={c} strokeWidth="2" strokeLinecap="round"/><rect x="9" y="3" width="6" height="4" rx="1" stroke={c} strokeWidth="2"/><path d="M9 12l2 2 4-4" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, badge: MY_APPS.filter(a=>a.status==='pending').length },
    { id: 'score',   label: t.score,   icon: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: 'profile', label: t.profile, icon: c => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="2"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="2" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{ display: 'flex', background: B.navyMid, borderTop: `1px solid ${B.navyLt}`, paddingBottom: 24, paddingTop: 10 }}>
      {tabs.map(tb => {
        const active = tab === tb.id;
        const c = active ? B.emerald : B.dim;
        return (
      <div key={tb.id} onClick={() => onTab(tb.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', position: 'relative' }}>
        {tb.icon(c)}
        {tb.badge > 0 && <div style={{ position:'absolute', top:0, right:'20%', width:14, height:14, borderRadius:'50%', background:B.warn, display:'flex', alignItems:'center', justifyContent:'center' }}><span style={{ fontSize:8, fontWeight:800, color:'#fff' }}>{tb.badge}</span></div>}
        <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: c }}>{tb.label}</span>
      </div>
        );
      })}
    </div>
  );
}

function LangPicker({ lang, setLang }) {
  const langs = [['en','EN'],['ar','عر'],['ur','اردو'],['hi','हि']];
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {langs.map(([id, label]) => (
        <div key={id} onClick={() => setLang(id)} style={{
          padding: '4px 9px', borderRadius: 8, cursor: 'pointer',
          background: lang === id ? B.emerald : 'rgba(255,255,255,0.1)',
          color: lang === id ? '#fff' : 'rgba(255,255,255,0.55)',
          fontSize: 11, fontWeight: 700, transition: 'all 0.15s',
        }}>{label}</div>
      ))}
    </div>
  );
}

// ── SCREEN: Welcome (story slides) ────────────────────────────
const STORY_SLIDES = [
  {
    bg: 'radial-gradient(ellipse at 30% 40%, #1a3a5c 0%, #0F172A 70%)',
    accent: B.emerald,
    tag: null,
    headline: (t) => t.slide1h,
    sub: (t) => t.slide1s,
    visual: () => (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(18)].map((_, i) => {
          const angle = (i / 18) * 360;
          const len = 120 + Math.random() * 120;
          const rad = angle * Math.PI / 180;
          return (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '45%',
              width: 1.5, height: len,
              background: `linear-gradient(to bottom, transparent, ${i % 3 === 0 ? B.emerald : i % 3 === 1 ? B.teal : B.blue}55)`,
              transformOrigin: '50% 0',
              transform: `rotate(${angle}deg) translateX(-50%)`,
              opacity: 0.6,
            }} />
          );
        })}
        <div style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)', width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }}/>
      </div>
    ),
  },
  {
    bg: `linear-gradient(160deg, #0F172A 0%, #0f2a1e 100%)`,
    accent: B.teal,
    headline: (t) => t.slide2h,
    sub: (t) => t.slide2s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '38%', transform: 'translate(-50%,-50%)', width: 240, pointerEvents: 'none' }}>
        {[
          { label: 'Personal Loan · FAB', val: 'AED 85,000', rate: '14.5%', color: '#C8102E' },
          { label: 'Credit Card · ENBD', val: 'AED 23,400', rate: '22.8%', color: '#E5A000' },
          { label: 'Auto Loan · ADCB', val: 'AED 42,000', rate: '8.9%', color: '#E31837' },
        ].map((item, i) => (
          <div key={i} style={{
            background: B.navyMid, borderRadius: 12, padding: '10px 14px', marginBottom: 8,
            border: `1px solid ${B.navyLt}`, display: 'flex', alignItems: 'center', gap: 10,
            opacity: 1 - i * 0.15, transform: `scale(${1 - i * 0.04})`,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 11, color: B.muted }}>{item.label}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: B.text }}>{item.val}</span>
            <span style={{ fontSize: 11, color: '#EF4444' }}>{item.rate}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: `linear-gradient(160deg, #0F172A 0%, #0a1f17 100%)`,
    accent: B.emerald,
    headline: (t) => t.slide3h,
    sub: (t) => t.slide3s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', textAlign: 'center', width: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#1a0f0f', borderRadius: 14, padding: '14px 18px', border: '1px solid #3a1515' }}>
            <div style={{ fontSize: 11, color: '#EF4444', fontWeight: 600, marginBottom: 4 }}>Interest</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#EF4444' }}>14.5%</div>
          </div>
          <div style={{ color: B.emerald, fontSize: 22 }}>→</div>
          <div style={{ background: 'rgba(16,185,129,0.12)', borderRadius: 14, padding: '14px 18px', border: `1px solid ${B.emerald}44` }}>
            <div style={{ fontSize: 11, color: B.emerald, fontWeight: 600, marginBottom: 4 }}>Murābaḥa</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: B.emerald }}>8.2%</div>
          </div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '8px 16px', border: `1px solid ${B.emerald}30` }}>
          <span style={{ fontSize: 12, color: B.emerald, fontWeight: 700 }}>☪️ AAOIFI Certified Sharia-Compliant</span>
        </div>
      </div>
    ),
  },
  {
    bg: `linear-gradient(160deg, #0F172A 0%, #0f1a2a 100%)`,
    accent: B.blue,
    headline: (t) => t.slide4h,
    sub: (t) => t.slide4s,
    visual: () => (
      <div style={{ position: 'absolute', left: '50%', top: '36%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', width: 240 }}>
        {[
          { label: 'OLFI Score', val: 724, max: 850, color: B.emerald, sub: 'AI + Open Banking' },
          { label: 'CBUAE Score', val: 718, max: 900, color: B.blue, sub: 'Via AECB Bureau' },
        ].map(s => (
          <div key={s.label} style={{ background: B.navyMid, borderRadius: 14, padding: '12px 16px', marginBottom: 10, border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: B.muted }}>{s.label}</span>
              <span style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</span>
            </div>
            <div style={{ background: B.navyLt, borderRadius: 99, height: 5 }}>
              <div style={{ width: `${(s.val / s.max) * 100}%`, background: s.color, height: '100%', borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 10, color: B.dim, marginTop: 5 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    ),
  },
];

function WelcomeScreen({ navigate, lang, setLang, t }) {
  const [slide, setSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const DURATION = 4000;
  const intervalRef = useRef(null);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = Date.now();
    const tick = () => {
      const pct = Math.min((Date.now() - start) / DURATION * 100, 100);
      setProgress(pct);
      if (pct < 100) { intervalRef.current = requestAnimationFrame(tick); }
      else { setSlide(s => (s + 1) % STORY_SLIDES.length); }
    };
    intervalRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(intervalRef.current);
  }, [slide, paused]);

  const s = STORY_SLIDES[slide];

  const handleTap = (e) => {
    // Ignore taps on buttons/interactive elements
    if (e.target.closest('button, a, [role=button], input, select')) return;
    // Ignore if it was a swipe (touchEndX set)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0) - rect.left;
    const isLeft = x < rect.width * 0.35;
    if (isLeft) {
      setSlide(s => Math.max(s - 1, 0));
    } else {
      setSlide(s => (s + 1) % STORY_SLIDES.length);
    }
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setPaused(true); };
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    setPaused(false);
    if (Math.abs(dx) < 10) {
      // treat as tap
      handleTap(e);
    }
  };

  return (
    <div
      style={{ height: '100%', background: s.bg, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', transition: 'background 0.6s ease', cursor: 'pointer' }}
      onClick={handleTap}
      onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}
    >
      {/* Slide visual */}
      {s.visual()}

      {/* Story progress bars */}
      <div style={{ position: 'absolute', top: 56, left: 16, right: 16, display: 'flex', gap: 4, zIndex: 10 }}>
        {STORY_SLIDES.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2.5, borderRadius: 2, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              background: '#fff',
              width: i < slide ? '100%' : i === slide ? `${progress}%` : '0%',
              transition: i === slide ? 'none' : 'width 0.3s',
            }} />
          </div>
        ))}
      </div>

      {/* Header row: logo + lang */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '66px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="olfi_logo.png" alt="OLFI" style={{ width: 38, height: 38, borderRadius: 10 }} />
          <span style={{ color: '#fff', fontSize: 22, fontWeight: 900, letterSpacing: -0.5 }}>OLFI</span>
        </div>
        <LangPicker lang={lang} setLang={setLang} />
      </div>

      {/* Slide dot nav */}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: 92, display: 'flex', gap: 5, zIndex: 10 }}>
        {STORY_SLIDES.map((_, i) => (
          <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 18 : 6, height: 6, borderRadius: 3, background: i === slide ? s.accent : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 28px 0', position: 'relative', zIndex: 10 }}>
        <h1 style={{ color: '#fff', fontSize: 30, fontWeight: 900, lineHeight: 1.2, margin: '0 0 12px', letterSpacing: -0.5, textWrap: 'pretty' }}>
          {s.headline(t)}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          {s.sub(t)}
        </p>
      </div>

      {/* CTA + Arabic tagline */}
      <div style={{ padding: '24px 24px 0', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Btn onPress={() => navigate('signup')} style={{ borderRadius: 16, padding: '17px 20px' }}>
          {t.getStarted}
        </Btn>
        <Btn variant="dark" onPress={() => navigate('signup')} style={{ borderRadius: 16, padding: '15px 20px' }}>
          {t.logIn}
        </Btn>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '4px 0 16px', lineHeight: 1.5, direction: 'rtl', fontFamily: 'system-ui' }}>
          {t.arabicTag}
        </p>
      </div>
    </div>
  );
}

// ── SCREEN: Sign Up ────────────────────────────────────────────
function SignUpScreen({ navigate, t }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const inp = {
    width: '100%', boxSizing: 'border-box', padding: '14px 16px',
    border: `1.5px solid ${B.navyLt}`, borderRadius: 12, fontSize: 15,
    background: B.navyMid, color: B.text, fontFamily: 'inherit', outline: 'none',
  };
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="" onBack={() => navigate('welcome')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 32px' }}>
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: B.text, margin: '0 0 6px', letterSpacing: -0.5 }}>Create your account</h2>
          <p style={{ color: B.muted, fontSize: 14, margin: 0 }}>Start your Sharia-compliant refinance journey</p>
        </div>
        {[
          { label: 'Full Name', ph: 'e.g. Ahmed Al Mansoori', val: name, set: setName, type: 'text' },
          { label: 'Mobile (+971)', ph: '+971 50 000 0000', val: phone, set: setPhone, type: 'tel' },
          { label: 'Email Address', ph: 'you@email.com', val: email, set: setEmail, type: 'email' },
        ].map(f => (
          <div key={f.label} style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: B.muted, display: 'block', marginBottom: 6 }}>{f.label}</label>
            <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} style={inp} />
          </div>
        ))}
        <div style={{ background: 'rgba(16,185,129,0.08)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, border: `1px solid rgba(16,185,129,0.2)` }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <p style={{ margin: 0, fontSize: 12, color: B.muted, lineHeight: 1.5 }}>Encrypted & secured. CBUAE / ADGM compliant. Never shared without consent.</p>
        </div>
        <Btn onPress={() => navigate('otp')}>Continue</Btn>
        <p style={{ textAlign: 'center', fontSize: 12, color: B.dim, marginTop: 16, lineHeight: 1.6 }}>
          By continuing you agree to our <span style={{ color: B.emerald }}>Terms</span> and <span style={{ color: B.emerald }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}

// ── SCREEN: OTP ────────────────────────────────────────────────
function OTPScreen({ navigate, t }) {
  const [otp] = useState(['5','3','8','2','1','9']);
  const [timer, setTimer] = useState(29);
  useEffect(() => { const id = setInterval(() => setTimer(v => v > 0 ? v - 1 : 0), 1000); return () => clearInterval(id); }, []);
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="" onBack={() => navigate('signup')} />
      <div style={{ flex: 1, padding: '24px 24px 32px' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: `1px solid rgba(16,185,129,0.2)` }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke={B.emerald} strokeWidth="2"/><path d="M9 18h6" stroke={B.emerald} strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: B.text, margin: '0 0 8px' }}>Verify your number</h2>
        <p style={{ color: B.muted, fontSize: 14, margin: '0 0 32px' }}>6-digit code sent to <strong style={{ color: B.text }}>+971 50 123 4567</strong></p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
          {otp.map((d, i) => (
            <div key={i} style={{ width: 46, height: 56, borderRadius: 12, background: B.navyMid, border: `2px solid ${i < 4 ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: B.text }}>
              {d}
            </div>
          ))}
        </div>
        <Btn onPress={() => navigate('kyc_id')}>Verify & Continue</Btn>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {timer > 0
            ? <p style={{ color: B.muted, fontSize: 14 }}>Resend in <strong style={{ color: B.emerald }}>0:{timer.toString().padStart(2, '0')}</strong></p>
            : <p style={{ color: B.emerald, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Resend Code</p>}
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: KYC Emirates ID ────────────────────────────────────
function KYCIdScreen({ navigate, t }) {
  const [uploaded, setUploaded] = useState({ front: false, back: false });
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Identity Verification" onBack={() => navigate('otp')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px 32px' }}>
        {/* Early Adopter Banner */}
        <div style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)', borderRadius: 16, padding: '16px 18px', marginBottom: 24 }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>⚡ EARLY ADOPTER</span>
          </div>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: '0 0 12px', lineHeight: 1.4 }}>Skip full KYC — explore the platform now. Complete verification before your first refinance.</p>
          <Btn onPress={() => navigate('kyc_face')} style={{ background: 'rgba(255,255,255,0.95)', color: B.navy, borderRadius: 12, padding: '12px 20px' }}>✓ Pass as Early Adopter</Btn>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: B.navyLt }} />
          <span style={{ color: B.dim, fontSize: 12, fontWeight: 600 }}>OR COMPLETE KYC</span>
          <div style={{ flex: 1, height: 1, background: B.navyLt }} />
        </div>

        <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.5, margin: '0 0 16px' }}>Upload a clear photo of your <strong style={{ color: B.text }}>Emirates ID</strong>. Required by CBUAE for UAE residents.</p>

        {[{ side: 'front', label: 'Emirates ID — Front', note: 'Your photo, name & ID number' }, { side: 'back', label: 'Emirates ID — Back', note: 'Expiry date & sponsor info' }].map(({ side, label, note }) => (
          <div key={side} onClick={() => setUploaded(u => ({ ...u, [side]: true }))} style={{ border: `2px dashed ${uploaded[side] ? B.emerald : B.navyLt}`, borderRadius: 16, padding: '20px 16px', marginBottom: 16, background: uploaded[side] ? 'rgba(16,185,129,0.05)' : B.navyMid, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
            {uploaded[side]
              ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: B.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: B.emerald }}>{label} uploaded</div>
                    <div style={{ fontSize: 12, color: B.muted }}>Tap to replace</div>
                  </div>
                </div>
              : <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🪪</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{label}</div>
                  <div style={{ fontSize: 12, color: B.muted, marginTop: 4 }}>{note}</div>
                  <div style={{ fontSize: 12, color: B.emerald, fontWeight: 600, marginTop: 8 }}>Tap to upload</div>
                </>
            }
          </div>
        ))}
        <Btn onPress={() => navigate('kyc_face')} variant={uploaded.front && uploaded.back ? 'primary' : 'outline'}>
          {uploaded.front && uploaded.back ? 'Continue' : 'Upload both sides to continue'}
        </Btn>
        <p style={{ textAlign: 'center', fontSize: 11, color: B.dim, marginTop: 12 }}>🔒 Encrypted · CBUAE Compliant · Never shared</p>
      </div>
    </div>
  );
}

// ── SCREEN: KYC Face ──────────────────────────────────────────
function KYCFaceScreen({ navigate, t }) {
  const [scanning, setScanning] = useState(false);
  const [done, setDone] = useState(false);
  const start = () => { setScanning(true); setTimeout(() => { setScanning(false); setDone(true); }, 2000); };
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Liveness Check" onBack={() => navigate('kyc_id')} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 24px 32px' }}>
        <div style={{ width: '100%', background: 'rgba(16,185,129,0.08)', borderRadius: 14, padding: '12px 16px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid rgba(16,185,129,0.2)` }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: B.emerald }}>Early Adopter Mode</div>
            <div style={{ fontSize: 12, color: B.muted }}>Skip — verify before first refinance</div>
          </div>
          <div onClick={() => navigate('open_banking')} style={{ background: B.emerald, color: '#fff', fontSize: 12, fontWeight: 700, padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}>Pass</div>
        </div>
        <div style={{ position: 'relative', marginBottom: 28, marginTop: 8 }}>
          <div style={{ width: 190, height: 190, borderRadius: '50%', border: `3px solid ${done ? B.emerald : scanning ? B.teal : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: B.navyMid, boxShadow: scanning ? `0 0 0 10px rgba(16,185,129,0.08)` : 'none', transition: 'all 0.4s' }}>
            {done
              ? <div style={{ textAlign: 'center' }}><div style={{ fontSize: 48, color: B.emerald }}>✓</div><div style={{ fontSize: 12, color: B.emerald, fontWeight: 700 }}>Verified</div></div>
              : <svg width="72" height="72" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={scanning ? B.teal : B.muted} strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={scanning ? B.teal : B.muted} strokeWidth="1.5" strokeLinecap="round"/></svg>
            }
          </div>
          {scanning && <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: `2px solid ${B.emerald}`, animation: 'spin 1.5s linear infinite' }} />}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 800, color: B.text, textAlign: 'center', margin: '0 0 8px' }}>{done ? 'Liveness Verified!' : 'Face Verification'}</h3>
        <p style={{ fontSize: 14, color: B.muted, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>{done ? 'Identity confirmed successfully.' : 'Look straight at the camera. Ensure good lighting.'}</p>
        {!done ? <Btn onPress={start} variant={scanning ? 'outline' : 'primary'}>{scanning ? 'Scanning…' : 'Start Face Scan'}</Btn> : <Btn onPress={() => navigate('open_banking')}>Continue</Btn>}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}

// ── SCREEN: Open Banking ───────────────────────────────────────
function OpenBankingScreen({ navigate, t }) {
  const [connected, setConnected] = useState([]);
  const banks = [
    { id: 'fab', name: 'First Abu Dhabi Bank', color: '#C8102E', short: 'FAB' },
    { id: 'enbd', name: 'Emirates NBD', color: '#1A1A1A', short: 'ENBD' },
    { id: 'adcb', name: 'ADCB', color: '#E31837', short: 'ADCB' },
    { id: 'dib', name: 'Dubai Islamic Bank', color: '#0A5C38', short: 'DIB' },
    { id: 'adib', name: 'Abu Dhabi Islamic Bank', color: '#1B1464', short: 'ADIB' },
  ];
  const toggle = id => setConnected(c => c.includes(id) ? c.filter(x => x !== id) : [...c, id]);
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title="Connect Accounts" onBack={() => navigate('kyc_face')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10B981, #14B8A6)', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Early Adopter — Skip for now</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>Use demo data to explore the platform</div>
          </div>
          <div onClick={() => navigate('dashboard')} style={{ background: 'rgba(255,255,255,0.9)', color: B.navy, fontSize: 12, fontWeight: 700, padding: '8px 14px', borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap' }}>Pass →</div>
        </div>
        <p style={{ fontSize: 14, color: B.muted, lineHeight: 1.5, marginBottom: 16 }}>Connect UAE bank accounts to import your liabilities. Powered by <strong style={{ color: B.text }}>Lean Technologies</strong> open banking consent.</p>
        {banks.map(b => {
          const on = connected.includes(b.id);
          return (
            <div key={b.id} onClick={() => toggle(b.id)} style={{ background: B.navyMid, borderRadius: 14, padding: '14px 16px', marginBottom: 10, border: `1.5px solid ${on ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{b.short}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: B.text }}>{b.name}</div>
                <div style={{ fontSize: 12, color: B.muted, marginTop: 1 }}>{on ? '✓ Connected' : 'Tap to connect'}</div>
              </div>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: on ? B.emerald : B.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
          );
        })}
        <div style={{ marginTop: 16 }}>
          <Btn onPress={() => navigate('dashboard')} variant={connected.length > 0 ? 'primary' : 'outline'}>
            {connected.length > 0 ? `Continue with ${connected.length} bank${connected.length > 1 ? 's' : ''}` : 'Connect at least one bank'}
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────
const DEBTS = [
  { id: 'pl', type: 'Personal Loan', bank: 'FAB', amount: 85000, rate: 14.5, emi: 2340, remaining: 42, color: '#C8102E' },
  { id: 'cc', type: 'Credit Card', bank: 'Emirates NBD', amount: 23400, rate: 22.8, emi: 1170, remaining: 18, color: '#E5A000' },
  { id: 'auto', type: 'Auto Loan', bank: 'ADCB', amount: 42000, rate: 8.9, emi: 1120, remaining: 36, color: '#E31837' },
];
const TOTAL_DEBT = DEBTS.reduce((s, d) => s + d.amount, 0);
const TOTAL_EMI  = DEBTS.reduce((s, d) => s + d.emi, 0);

// ── SCREEN: Dashboard ──────────────────────────────────────────
function DashboardScreen({ navigate, onTab, t }) {
  const [flipped, setFlipped] = useState(false);
  const [scoreAnim, setScoreAnim] = useState(0);
  useEffect(() => { setTimeout(() => setScoreAnim(724), 400); }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(160deg, #0a1628 0%, ${B.navyMid} 100%)`, padding: '56px 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src="olfi_logo.png" alt="" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <div>
                <p style={{ color: B.muted, fontSize: 12, margin: 0 }}>{t.goodMorning}</p>
                <h2 style={{ color: B.text, fontSize: 18, fontWeight: 800, margin: 0 }}>Ahmed Hassan 👋</h2>
              </div>
            </div>
            <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 12, background: B.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke={B.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div style={{ position: 'absolute', top: -2, right: -2, width: 10, height: 10, borderRadius: '50%', background: B.error, border: `2px solid ${B.navyMid}` }} />
            </div>
          </div>

          {/* Flip Score Card */}
          <div
            onClick={() => setFlipped(f => !f)}
            style={{ cursor: 'pointer', perspective: 600 }}
          >
            <div style={{ position: 'relative', transition: 'transform 0.6s', transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)', minHeight: 130 }}>
              {/* Front: OLFI Score */}
              <div style={{ background: `linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))`, borderRadius: 20, padding: '16px 20px', border: `1px solid rgba(16,185,129,0.25)`, backfaceVisibility: 'hidden', position: 'absolute', inset: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0, fontWeight: 700, letterSpacing: 0.8 }}>OLFI SCORE</p>
                    <InfoTooltip id="olfiScore" />
                  </div>
                  <span style={{ fontSize: 11, color: B.dim, background: B.navyLt, padding: '2px 8px', borderRadius: 6 }}>Tap to see CBUAE →</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: B.text, fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>{scoreAnim}</span>
                    <span style={{ color: B.muted, fontSize: 14, marginLeft: 4 }}>/850</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(16,185,129,0.2)', color: B.emerald, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, marginBottom: 4 }}>GOOD</div>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0 }}>↑ +12 this month</p>
                  </div>
                </div>
                <div style={{ background: B.navyLt, borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(scoreAnim / 850) * 100}%`, background: B.grad, height: '100%', borderRadius: 99, transition: 'width 1.2s ease' }} />
                </div>
              </div>

              {/* Back: CBUAE Score */}
              <div style={{ background: `linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))`, borderRadius: 20, padding: '16px 20px', border: `1px solid rgba(59,130,246,0.25)`, backfaceVisibility: 'hidden', position: 'absolute', inset: 0, transform: 'rotateY(180deg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0, fontWeight: 700, letterSpacing: 0.8 }}>CBUAE / AECB SCORE</p>
                    <InfoTooltip id="cbuaeScore" />
                  </div>
                  <span style={{ fontSize: 11, color: B.dim, background: B.navyLt, padding: '2px 8px', borderRadius: 6 }}>← Tap for OLFI</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: B.text, fontSize: 48, fontWeight: 900, letterSpacing: -2 }}>718</span>
                    <span style={{ color: B.muted, fontSize: 14, marginLeft: 4 }}>/900</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: 'rgba(59,130,246,0.2)', color: B.blue, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, marginBottom: 4 }}>GOOD</div>
                    <p style={{ color: B.muted, fontSize: 11, margin: 0 }}>Free via OLFI</p>
                  </div>
                </div>
                <div style={{ background: B.navyLt, borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${(718 / 900) * 100}%`, background: 'linear-gradient(90deg, #3B82F6, #6366F1)', height: '100%', borderRadius: 99 }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Totals */}
          <div style={{ background: B.navyMid, borderRadius: 20, padding: '18px 20px', border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: 0 }}>Total Debt Overview</h3>
              <span onClick={() => navigate('debt_detail')} style={{ fontSize: 11, color: B.emerald, fontWeight: 700, cursor: 'pointer' }}>{t.viewAll}</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[['TOTAL OWED', `AED ${TOTAL_DEBT.toLocaleString()}`, B.error], ['MONTHLY EMI', `AED ${TOTAL_EMI.toLocaleString()}`, B.text]].map(([l, v, c]) => (
                <div key={l} style={{ flex: 1, background: B.navy, borderRadius: 12, padding: '12px 14px' }}>
                  <p style={{ fontSize: 10, color: B.muted, margin: '0 0 4px', fontWeight: 600 }}>{l}</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: c, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Refinance Opportunity Banner */}
          <div onClick={() => { onTab('offers'); navigate('marketplace'); }} style={{ background: B.grad, borderRadius: 20, padding: '18px 20px', cursor: 'pointer', boxShadow: '0 4px 24px rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 6 }}>
                  <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.8 }}>✦ SHARIA-COMPLIANT</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, margin: '0 0 3px' }}>{t.opportunities}</p>
                <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 900, margin: 0 }}>{t.savePer} 680{t.perMonth}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: '4px 0 0' }}>via Dubai Islamic Bank — Murābaḥa <InfoTooltip id="murabaha" /></p>
              </div>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </div>

          {/* Debts */}
          <h3 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '4px 0 -4px' }}>{t.liabilities}</h3>
          {DEBTS.map(d => (
            <div key={d.id} onClick={() => navigate('debt_detail')} style={{ background: B.navyMid, borderRadius: 18, padding: '16px 18px', border: `1px solid ${B.navyLt}`, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                  {d.bank.split(' ')[0].substring(0, 4).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: B.text }}>{d.type}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: B.muted }}>{d.bank}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: B.text }}>AED {d.amount.toLocaleString()}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: B.error }}>{d.rate}% <InfoTooltip id="apr" /></p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[['EMI', `AED ${d.emi.toLocaleString()}`], ['Months Left', `${d.remaining} mo`], ['Type', 'Interest']].map(([l, v], i) => (
                  <div key={l} style={{ flex: 1, background: B.navy, borderRadius: 8, padding: '8px 10px' }}>
                    <p style={{ margin: 0, fontSize: 10, color: B.dim }}>{l}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: i === 2 ? B.error : B.text }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="home" onTab={id => { onTab(id); if (id === 'offers') navigate('marketplace'); if (id === 'score') navigate('score'); if (id === 'profile') navigate('profile'); }} t={t} />
    </div>
  );
}

// ── SCREEN: Debt Detail ────────────────────────────────────────
function DebtDetailScreen({ navigate, t }) {
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={t.liabilities} onBack={() => navigate('dashboard')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        <div style={{ background: B.grad, borderRadius: 20, padding: '20px', marginBottom: 20 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, margin: '0 0 4px' }}>Total Outstanding</p>
          <p style={{ color: '#fff', fontSize: 32, fontWeight: 900, margin: '0 0 16px', letterSpacing: -0.5 }}>AED {TOTAL_DEBT.toLocaleString()}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['3', 'Active Debts'], [`AED ${TOTAL_EMI.toLocaleString()}`, 'Monthly EMI'], ['14.5%', 'Avg Rate']].map(([v, l]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 800, margin: '0 0 2px' }}>{v}</p>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
        {DEBTS.map(d => (
          <div key={d.id} style={{ background: B.navyMid, borderRadius: 18, padding: '18px', marginBottom: 12, border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{d.bank.split(' ')[0].substring(0, 4).toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: B.text }}>{d.bank}</p>
                <p style={{ margin: '2px 0 0', fontSize: 13, color: B.muted }}>{d.type}</p>
              </div>
              <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: '4px 10px' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: B.error }}>Interest-based</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[['Outstanding', `AED ${d.amount.toLocaleString()}`], ['Annual Rate', `${d.rate}%`], ['Monthly EMI', `AED ${d.emi.toLocaleString()}`], ['Remaining', `${d.remaining} months`]].map(([l, v]) => (
                <div key={l} style={{ background: B.navy, borderRadius: 10, padding: '10px 12px' }}>
                  <p style={{ margin: 0, fontSize: 11, color: B.dim }}>{l}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 700, color: B.text }}>{v}</p>
                </div>
              ))}
            </div>
            <div onClick={() => navigate('marketplace')} style={{ background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: `1px solid rgba(16,185,129,0.2)` }}>
              <span style={{ fontSize: 13, color: B.emerald, fontWeight: 600 }}>Refinance this →</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.emerald }}>Save {d.id === 'pl' ? 'AED 680/mo' : d.id === 'cc' ? 'AED 290/mo' : 'AED 180/mo'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCREEN: Marketplace ────────────────────────────────────────
const OFFERS = [
  { id: 'dib', bank: 'Dubai Islamic Bank', type: 'Murābaḥa', typeKey: 'murabaha', apr: 8.2, monthly: 2950, saving: 680, score: 96, approvalDays: 1, tenure: 48, color: '#0A5C38', featured: true },
  { id: 'adib', bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', typeKey: 'tawarruq', apr: 8.5, monthly: 2980, saving: 650, score: 93, approvalDays: 2, tenure: 42, color: '#1B1464', featured: false },
  { id: 'fab_i', bank: 'FAB Islamic', type: 'Murābaḥa', typeKey: 'murabaha', apr: 9.1, monthly: 3040, saving: 590, score: 88, approvalDays: 3, tenure: 36, color: '#C8102E', featured: false },
  { id: 'emi', bank: 'Emirates Islamic', type: 'Ijāra', typeKey: 'ijara', apr: 9.4, monthly: 3080, saving: 550, score: 85, approvalDays: 2, tenure: 60, color: '#006940', featured: false },
];

function MarketplaceScreen({ navigate, onTab, t }) {
  const [filter, setFilter] = useState('all');

  const sorted = [...OFFERS].sort((a, b) => {
    if (filter === 'apr')  return a.apr - b.apr;
    if (filter === 'emi')  return a.monthly - b.monthly;
    if (filter === 'fast') return a.approvalDays - b.approvalDays;
    if (filter === 'term') return a.tenure - b.tenure;
    return b.score - a.score;
  });

  const filters = [
    { id: 'all', label: t.filterAll },
    { id: 'apr', label: t.filterAPR },
    { id: 'emi', label: t.filterEMI },
    { id: 'fast', label: t.filterFast },
    { id: 'term', label: t.filterTerm },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {/* Header */}
        <div style={{ background: `linear-gradient(160deg, #0a1628 0%, ${B.navyMid} 100%)`, padding: '52px 20px 20px' }}>
          <TopBar title="" onBack={() => navigate('dashboard')} light />
          <div style={{ padding: '0 4px' }}>
            <h2 style={{ color: B.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Refinance Offers</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: B.emerald, fontSize: 12, fontWeight: 600 }}>{t.shariaOnly}</span>
              <InfoTooltip id="murabaha" />
            </div>
            <p style={{ color: B.muted, fontSize: 12, margin: '4px 0 0' }}>Matched to OLFI Score 724 · {OFFERS.length} offers</p>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Best saving pill */}
          <div style={{ background: B.navyMid, borderRadius: 14, padding: '14px 18px', marginBottom: 14, border: `1px solid ${B.navyLt}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, color: B.muted, margin: '0 0 2px' }}>Best available saving</p>
              <span style={{ fontSize: 22, fontWeight: 900, color: B.emerald }}>AED 680 / month</span>
            </div>
            <div style={{ background: 'rgba(16,185,129,0.15)', borderRadius: 10, padding: '6px 12px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: B.emerald }}>AED 32,640 total</span>
            </div>
          </div>

          {/* Sort filters */}
          <div style={{ display: 'flex', gap: 7, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
            {filters.map(f => (
              <div key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 99, background: filter === f.id ? B.emerald : B.navyMid, color: filter === f.id ? '#fff' : B.muted, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${filter === f.id ? B.emerald : B.navyLt}`, transition: 'all 0.15s' }}>
                {f.label}
              </div>
            ))}
          </div>

          {/* Offer cards */}
          {sorted.map(o => (
            <div key={o.id} onClick={() => navigate('offer_detail', o)} style={{ background: B.navyMid, borderRadius: 20, padding: '18px', marginBottom: 12, border: `1.5px solid ${o.featured && filter === 'all' ? B.emerald : B.navyLt}`, cursor: 'pointer', boxShadow: o.featured && filter === 'all' ? '0 4px 24px rgba(16,185,129,0.15)' : 'none', transition: 'all 0.15s' }}>
              {o.featured && filter === 'all' && (
                <div style={{ background: B.emerald, color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 0.8, padding: '3px 10px', borderRadius: 99, display: 'inline-block', marginBottom: 10 }}>{t.bestMatch}</div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: o.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
                  {o.bank.split(' ')[0].substring(0, 4).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: B.text }}>{o.bank}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                    <span style={{ background: 'rgba(16,185,129,0.15)', color: B.emerald, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✦ {o.type}</span>
                    <InfoTooltip id={o.typeKey} />
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: B.emerald }}>{o.apr}%</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: B.muted }}>{t.profitRate}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  [t.monthlySaving, `AED ${o.saving}`, B.emerald, 'rgba(16,185,129,0.08)'],
                  [t.newEMI, `AED ${o.monthly}`, B.text, B.navy],
                  [filter === 'fast' ? 'Approval' : filter === 'term' ? 'Tenure' : t.scoreMatch,
                   filter === 'fast' ? `${o.approvalDays}d` : filter === 'term' ? `${o.tenure}mo` : `${o.score}%`,
                   filter === 'fast' ? B.teal : B.text, B.navy],
                ].map(([l, v, c, bg]) => (
                  <div key={l} style={{ flex: 1, background: bg, borderRadius: 10, padding: '10px 12px' }}>
                    <p style={{ margin: 0, fontSize: 10, color: B.dim }}>{l}</p>
                    <p style={{ margin: '3px 0 0', fontSize: 14, fontWeight: 800, color: c }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="offers" onTab={id => { onTab(id); if (id === 'home') navigate('dashboard'); if (id === 'score') navigate('score'); if (id === 'profile') navigate('profile'); }} t={t} />
    </div>
  );
}

// ── SCREEN: Offer Detail ───────────────────────────────────────
function OfferDetailScreen({ navigate, offer = OFFERS[0], t }) {
  const totalSaving = offer.saving * offer.tenure;
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <TopBar title={offer.bank} onBack={() => navigate('marketplace')} />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        <div style={{ background: offer.color, borderRadius: 20, padding: '20px', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>
              {offer.bank.split(' ')[0].substring(0, 4).toUpperCase()}
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>{offer.bank}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>✦ {offer.type}</span>
                <InfoTooltip id={offer.typeKey} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[['Profit Rate', offer.apr + '%'], ['Tenure', offer.tenure + ' mo'], ['Approval', offer.approvalDays + ' day']].map(([l, v]) => (
              <div key={l} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, margin: '0 0 4px', fontWeight: 600 }}>{l}</p>
                <p style={{ color: '#fff', fontSize: 16, fontWeight: 800, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Before vs After */}
        <div style={{ background: B.navyMid, borderRadius: 20, padding: '18px', marginBottom: 14, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 14px' }}>Before vs After Refinance</h4>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'rgba(239,68,68,0.08)', borderRadius: 14, padding: '14px', border: '1px solid rgba(239,68,68,0.2)' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: B.error, margin: '0 0 8px' }}>CURRENT</p>
              <p style={{ fontSize: 10, color: B.dim, margin: '0 0 2px' }}>Monthly EMI</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: B.error, margin: '0 0 8px' }}>AED {TOTAL_EMI.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: B.dim, margin: 0 }}>Interest-based <InfoTooltip id="apr" /></p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke={B.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ flex: 1, background: 'rgba(16,185,129,0.08)', borderRadius: 14, padding: '14px', border: `1px solid rgba(16,185,129,0.3)` }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: B.emerald, margin: '0 0 8px' }}>NEW OFFER</p>
              <p style={{ fontSize: 10, color: B.dim, margin: '0 0 2px' }}>Monthly EMI</p>
              <p style={{ fontSize: 20, fontWeight: 900, color: B.emerald, margin: '0 0 8px' }}>AED {offer.monthly.toLocaleString()}</p>
              <p style={{ fontSize: 10, color: B.dim, margin: 0 }}>☪️ Sharia-certified</p>
            </div>
          </div>
        </div>

        {/* Savings */}
        <div style={{ background: B.navyMid, borderRadius: 20, padding: '18px', marginBottom: 14, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 14px' }}>Savings Summary</h4>
          {[['Monthly saving', `AED ${offer.saving.toLocaleString()}`, B.emerald], ['Total saving over term', `AED ${totalSaving.toLocaleString()}`, B.emerald], ['DBR reduction', '~8%', B.teal]].map(([l, v, c]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${B.navyLt}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 13, color: B.muted }}>{l}</span>
                {l.includes('DBR') && <InfoTooltip id="dbr" />}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: c }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Sharia cert */}
        <div style={{ background: 'rgba(16,185,129,0.07)', borderRadius: 14, padding: '14px 16px', marginBottom: 16, border: `1px solid rgba(16,185,129,0.2)`, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 20 }}>☪️</span>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: B.emerald, margin: '0 0 3px' }}>AAOIFI Sharia-Certified</p>
            <p style={{ fontSize: 12, color: B.muted, margin: 0, lineHeight: 1.5 }}>Certified by OLFI's Sharia Advisory Board. No riba involved.</p>
          </div>
        </div>

        <Btn onPress={() => navigate('apply_status')}>{t.applyNow} — {offer.bank}</Btn>
        <Btn onPress={() => navigate('marketplace')} variant="ghost" style={{ marginTop: 8 }}>Compare other offers</Btn>
      </div>
    </div>
  );
}

// ── SCREEN: Application Status ─────────────────────────────────
function ApplyStatusScreen({ navigate, onTab, t }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  const steps = [
    { label: 'Application Submitted', sub: 'Received by OLFI platform' },
    { label: 'Identity Verified', sub: 'KYC documents confirmed' },
    { label: 'Under Lender Review', sub: 'Dubai Islamic Bank reviewing profile', active: step === 2 },
    { label: 'Offer Accepted', sub: 'Awaiting digital signature' },
    { label: 'Refinance Complete', sub: 'Old debt settled, new contract active' },
  ];
  return (
    <div style={{ height: '100%', background: B.navy, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 24px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28, paddingTop: 16 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: `2px solid ${B.emerald}`, boxShadow: '0 0 0 10px rgba(16,185,129,0.06)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke={B.emerald} strokeWidth="2"/><path d="M8 12l3 3 5-5" stroke={B.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: B.text, margin: '0 0 8px' }}>Application Submitted!</h2>
          <p style={{ color: B.muted, fontSize: 14, margin: 0 }}>Processing with <strong style={{ color: B.text }}>Dubai Islamic Bank</strong></p>
        </div>
        <div style={{ background: B.navyMid, borderRadius: 16, padding: '16px 20px', marginBottom: 16, border: `1px solid ${B.navyLt}`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: B.dim, margin: '0 0 4px' }}>Reference</p>
          <p style={{ fontSize: 17, fontWeight: 800, color: B.text, margin: 0, letterSpacing: 1 }}>OLFI-DIB-2026-04912</p>
        </div>
        <div style={{ background: B.navyMid, borderRadius: 20, padding: '20px', marginBottom: 16, border: `1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: B.text, margin: '0 0 20px' }}>Application Status</h4>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: i < steps.length - 1 ? 20 : 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: i <= step ? B.emerald : B.navy, border: `2px solid ${i <= step ? B.emerald : B.navyLt}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s' }}>
                  {i <= step && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {s.active && i > step && <div style={{ width: 8, height: 8, borderRadius: '50%', background: B.warn }} />}
                </div>
                {i < steps.length - 1 && <div style={{ width: 2, height: 20, background: i < step ? B.emerald : B.navyLt, marginTop: 4, borderRadius: 2, transition: 'background 0.5s' }} />}
              </div>
              <div style={{ paddingTop: 2 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: i <= step ? B.text : B.muted }}>{s.label}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: B.dim }}>{s.sub}</p>
                {s.active && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 5, background: 'rgba(245,158,11,0.1)', borderRadius: 6, padding: '3px 10px', border: `1px solid rgba(245,158,11,0.2)` }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: B.warn, animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: 11, color: B.warn, fontWeight: 700 }}>In Progress</span>
                </div>}
              </div>
            </div>
          ))}
        </div>
        <Btn onPress={() => { onTab('home'); navigate('dashboard'); }}>Back to Dashboard</Btn>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}

// ── SCREEN: Profile ────────────────────────────────────────────
function ProfileScreen({ navigate, onTab, t, lang, setLang }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: `linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding: '52px 20px 28px', textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', background: B.navyLt, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 28 }}>👤</div>
          <h2 style={{ color: B.text, fontSize: 18, fontWeight: 800, margin: '0 0 4px' }}>Ahmed Hassan</h2>
          <p style={{ color: B.muted, fontSize: 13, margin: '0 0 10px' }}>ahmed.hassan@email.com</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
            <span style={{ background: 'rgba(16,185,129,0.15)', color: B.emerald, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>⚡ Early Adopter</span>
            <span style={{ background: 'rgba(245,158,11,0.15)', color: B.warn, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99 }}>KYC Pending</span>
          </div>
        </div>
        <div style={{ padding: '20px 16px' }}>
          {/* Language */}
          <p style={{ fontSize: 12, fontWeight: 700, color: B.dim, letterSpacing: 0.8, margin: '0 4px 8px', textTransform: 'uppercase' }}>Language</p>
          <div style={{ background: B.navyMid, borderRadius: 14, padding: '14px 18px', marginBottom: 20, border: `1px solid ${B.navyLt}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14, color: B.text, fontWeight: 600 }}>Select Language</span>
              <LangPicker lang={lang} setLang={setLang} />
            </div>
          </div>
          {[
            { section: 'Account', items: [
              { label: 'Complete KYC Verification', sub: 'Required before first refinance', action: () => navigate('kyc_id'), highlight: true },
              { label: 'Connect Bank Accounts', sub: 'Open banking via Lean Technologies', action: () => navigate('open_banking') },
              { label: 'Notification Settings', action: () => {} },
            ]},
            { section: 'Legal', items: [
              { label: 'Terms of Service', action: () => {} },
              { label: 'Privacy Policy', action: () => {} },
              { label: 'Sharia Compliance Framework', action: () => {} },
              { label: 'CBUAE Regulatory Info', action: () => {} },
            ]},
          ].map(group => (
            <div key={group.section} style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: B.dim, letterSpacing: 0.8, margin: '0 4px 8px', textTransform: 'uppercase' }}>{group.section}</p>
              <div style={{ background: B.navyMid, borderRadius: 14, overflow: 'hidden', border: `1px solid ${B.navyLt}` }}>
                {group.items.map((item, i) => (
                  <div key={item.label} onClick={item.action} style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: i < group.items.length - 1 ? `1px solid ${B.navyLt}` : 'none', background: item.highlight ? 'rgba(16,185,129,0.06)' : 'transparent' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: item.highlight ? B.emerald : B.text }}>{item.label}</p>
                      {item.sub && <p style={{ margin: '2px 0 0', fontSize: 12, color: B.muted }}>{item.sub}</p>}
                    </div>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none"><path d="M1 1l5 5-5 5" stroke={item.highlight ? B.emerald : B.dim} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Btn variant="outline" style={{ borderColor: B.error, color: B.error, background: 'rgba(239,68,68,0.06)' }} onPress={() => navigate('welcome')}>Sign Out</Btn>
        </div>
      </div>
      <BottomTabs tab="profile" onTab={id => { onTab(id); if (id === 'home') navigate('dashboard'); if (id === 'offers') navigate('marketplace'); if (id === 'score') navigate('score'); }} t={t} />
    </div>
  );
}

// ── SCREEN: My Applications ───────────────────────────────────
const MY_APPS = [
  {
    id: 'app1', bank: 'Dubai Islamic Bank', type: 'Murābaḥa', typeKey: 'murabaha',
    color: '#0A5C38', status: 'accepted', ref: 'OLFI-DIB-2026-04912',
    appliedDate: '18 Apr 2026', acceptedDate: '20 Apr 2026',
    amount: 150400, newEMI: 2950, saving: 680, apr: 8.2, tenure: 48,
    paidMonths: 1, totalMonths: 48,
    nextPayment: '20 May 2026', nextAmount: 2950,
    payments: [
      { month: 'May 2026', amount: 2950, principal: 1900, profit: 1050, balance: 148500, status: 'upcoming' },
      { month: 'Jun 2026', amount: 2950, principal: 1913, profit: 1037, balance: 146587, status: 'upcoming' },
      { month: 'Jul 2026', amount: 2950, principal: 1926, profit: 1024, balance: 144661, status: 'upcoming' },
    ],
  },
  {
    id: 'app2', bank: 'Abu Dhabi Islamic Bank', type: 'Tawarruq', typeKey: 'tawarruq',
    color: '#1B1464', status: 'pending', ref: 'OLFI-ADIB-2026-04913',
    appliedDate: '21 Apr 2026',
    amount: 150400, newEMI: 2980, saving: 650, apr: 8.5, tenure: 42,
    currentStep: 2,
  },
  {
    id: 'app3', bank: 'FAB Islamic', type: 'Murābaḥa', typeKey: 'murabaha',
    color: '#C8102E', status: 'declined', ref: 'OLFI-FAB-2026-04890',
    appliedDate: '10 Apr 2026', declinedDate: '14 Apr 2026',
    declineReason: 'DBR exceeds 50% threshold at time of application.',
    amount: 150400, newEMI: 3040, saving: 590, apr: 9.1, tenure: 36,
  },
];

function ApplicationsScreen({ navigate, onTab, t }) {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? MY_APPS : MY_APPS.filter(a => a.status === filter);
  const statusColors = { accepted: B.emerald, pending: B.warn, declined: B.error };
  const statusLabels = { accepted: '✓ Accepted', pending: '⏳ Under Review', declined: '✗ Declined' };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: B.navy }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ background: `linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding: '52px 20px 20px' }}>
          <h2 style={{ color: B.text, fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>My Applications</h2>
          <p style={{ color: B.muted, fontSize: 13, margin: 0 }}>Track every refinance you've applied for</p>
        </div>

        <div style={{ padding: '16px' }}>
          {/* Summary pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[['all','All',MY_APPS.length],['accepted','Accepted',MY_APPS.filter(a=>a.status==='accepted').length],['pending','Pending',MY_APPS.filter(a=>a.status==='pending').length],['declined','Declined',MY_APPS.filter(a=>a.status==='declined').length]].map(([id,label,count])=>(
              <div key={id} onClick={()=>setFilter(id)} style={{ flex:1, padding:'8px 6px', borderRadius:12, background: filter===id ? B.emerald : B.navyMid, border:`1px solid ${filter===id?B.emerald:B.navyLt}`, textAlign:'center', cursor:'pointer', transition:'all 0.15s' }}>
                <div style={{ fontSize:16, fontWeight:900, color: filter===id?'#fff':B.text }}>{count}</div>
                <div style={{ fontSize:10, fontWeight:600, color: filter===id?'rgba(255,255,255,0.8)':B.dim }}>{label}</div>
              </div>
            ))}
          </div>

          {filtered.map(app => (
            <div key={app.id} onClick={()=>app.status!=='declined'&&navigate('app_detail',app)} style={{ background: B.navyMid, borderRadius: 20, padding: '18px', marginBottom: 12, border:`1.5px solid ${app.status==='accepted'?'rgba(16,185,129,0.3)':B.navyLt}`, cursor: app.status==='declined'?'default':'pointer', boxShadow: app.status==='accepted'?'0 4px 20px rgba(16,185,129,0.1)':'none' }}>
              {/* Bank row */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:13, background:app.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#fff' }}>
                  {app.bank.split(' ')[0].substring(0,4).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:B.text }}>{app.bank}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:4, marginTop:3 }}>
                    <span style={{ background:'rgba(16,185,129,0.12)', color:B.emerald, fontSize:11, fontWeight:700, padding:'1px 7px', borderRadius:99 }}>✦ {app.type}</span>
                  </div>
                </div>
                <div style={{ background:`rgba(${app.status==='accepted'?'16,185,129':app.status==='pending'?'245,158,11':'239,68,68'},0.12)`, borderRadius:8, padding:'4px 10px' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:statusColors[app.status] }}>{statusLabels[app.status]}</span>
                </div>
              </div>

              {/* Key metrics */}
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                {[['APR', app.apr+'%'], ['New EMI', 'AED '+app.newEMI], ['Saving', 'AED '+app.saving+'/mo']].map(([l,v])=>(
                  <div key={l} style={{ flex:1, background:B.navy, borderRadius:10, padding:'9px 10px' }}>
                    <p style={{ margin:0, fontSize:10, color:B.dim }}>{l}</p>
                    <p style={{ margin:'2px 0 0', fontSize:13, fontWeight:700, color:B.text }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Status-specific content */}
              {app.status==='accepted' && (
                <div style={{ background:'rgba(16,185,129,0.08)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:B.muted }}>Repayment Progress</span>
                    <span style={{ fontSize:12, fontWeight:700, color:B.emerald }}>{app.paidMonths}/{app.totalMonths} months</span>
                  </div>
                  <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                    <div style={{ width:`${(app.paidMonths/app.totalMonths)*100}%`, background:B.grad, height:'100%', borderRadius:99 }}/>
                  </div>
                  <p style={{ fontSize:11, color:B.muted, margin:'6px 0 0' }}>Next: AED {app.nextAmount.toLocaleString()} due {app.nextPayment}</p>
                </div>
              )}
              {app.status==='pending' && (
                <div style={{ background:'rgba(245,158,11,0.08)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(245,158,11,0.2)', display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:B.warn, flexShrink:0, animation:'pulse 1.5s infinite' }}/>
                  <p style={{ fontSize:12, color:B.warn, margin:0 }}>Under review — typically 1–2 business days</p>
                </div>
              )}
              {app.status==='declined' && (
                <div style={{ background:'rgba(239,68,68,0.07)', borderRadius:12, padding:'10px 14px', border:'1px solid rgba(239,68,68,0.2)' }}>
                  <p style={{ fontSize:11, color:B.error, margin:0 }}>{app.declineReason} <span onClick={e=>{e.stopPropagation();navigate('marketplace')}} style={{ color:B.emerald, fontWeight:700, cursor:'pointer' }}>Try another offer →</span></p>
                </div>
              )}

              <p style={{ fontSize:11, color:B.dim, margin:'10px 0 0' }}>Ref: {app.ref} · Applied {app.appliedDate}</p>
            </div>
          ))}
        </div>
      </div>
      <BottomTabs tab="apps" onTab={id=>{ onTab(id); if(id==='home') navigate('dashboard'); if(id==='offers') navigate('marketplace'); if(id==='score') navigate('score'); if(id==='profile') navigate('profile'); }} t={t} />
    </div>
  );
}

// ── SCREEN: Application Detail ─────────────────────────────────
function ApplicationDetailScreen({ navigate, appData, t }) {
  const app = appData || MY_APPS[0];
  const [tab, setTab] = useState('overview');
  const totalPaid = app.paidMonths * app.newEMI;
  const totalProfit = app.payments ? app.payments.reduce((s,p)=>s+p.profit,0)*app.totalMonths/app.payments.length : 0;

  return (
    <div style={{ height:'100%', background:B.navy, display:'flex', flexDirection:'column' }}>
      <TopBar title={app.bank} onBack={()=>navigate('applications')} />
      <div style={{ flex:1, overflow:'auto', padding:'0 16px 24px' }}>

        {/* Header card */}
        <div style={{ background:app.color, borderRadius:20, padding:'18px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
            <div>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:12, margin:'0 0 2px' }}>Active Refinancing</p>
              <p style={{ color:'#fff', fontSize:28, fontWeight:900, margin:0, letterSpacing:-0.5 }}>AED {app.newEMI.toLocaleString()}<span style={{ fontSize:14, fontWeight:500 }}>/mo</span></p>
            </div>
            <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:10, padding:'6px 12px' }}>
              <span style={{ color:'#fff', fontSize:11, fontWeight:700 }}>✓ ACTIVE</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[['APR',app.apr+'%'],['Tenure',app.tenure+' mo'],['Saving','AED '+app.saving+'/mo']].map(([l,v])=>(
              <div key={l} style={{ flex:1, background:'rgba(255,255,255,0.12)', borderRadius:10, padding:'10px 8px', textAlign:'center' }}>
                <p style={{ color:'rgba(255,255,255,0.65)', fontSize:10, margin:'0 0 3px' }}>{l}</p>
                <p style={{ color:'#fff', fontSize:14, fontWeight:800, margin:0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Repayment progress */}
        <div style={{ background:B.navyMid, borderRadius:18, padding:'18px', marginBottom:14, border:`1px solid ${B.navyLt}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>Repayment Progress</h4>
            <span style={{ fontSize:13, fontWeight:700, color:B.emerald }}>{app.paidMonths}/{app.totalMonths} paid</span>
          </div>
          <div style={{ background:B.navyLt, borderRadius:99, height:8, marginBottom:10, overflow:'hidden' }}>
            <div style={{ width:`${(app.paidMonths/app.totalMonths)*100}%`, background:B.grad, height:'100%', borderRadius:99 }}/>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[
              ['Paid to date', `AED ${(app.paidMonths*app.newEMI).toLocaleString()}`],
              ['Remaining', `AED ${((app.totalMonths-app.paidMonths)*app.newEMI).toLocaleString()}`],
              ['Outstanding', `AED ${(app.amount-(app.paidMonths*app.newEMI*0.6)).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`],
            ].map(([l,v])=>(
              <div key={l} style={{ flex:1, background:B.navy, borderRadius:10, padding:'10px 8px' }}>
                <p style={{ fontSize:10, color:B.dim, margin:'0 0 3px' }}>{l}</p>
                <p style={{ fontSize:12, fontWeight:700, color:B.text, margin:0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next payment */}
        <div style={{ background:'rgba(16,185,129,0.08)', borderRadius:16, padding:'16px', marginBottom:14, border:`1px solid rgba(16,185,129,0.25)`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ fontSize:11, color:B.muted, margin:'0 0 3px', fontWeight:600 }}>NEXT PAYMENT</p>
            <p style={{ fontSize:20, fontWeight:900, color:B.emerald, margin:'0 0 2px' }}>AED {app.nextAmount.toLocaleString()}</p>
            <p style={{ fontSize:12, color:B.muted, margin:0 }}>Due {app.nextPayment}</p>
          </div>
          <div style={{ background:B.emerald, borderRadius:12, padding:'12px 18px', cursor:'pointer' }}>
            <p style={{ color:'#fff', fontWeight:700, fontSize:13, margin:0 }}>Pay Now</p>
          </div>
        </div>

        {/* Payment schedule */}
        <div style={{ background:B.navyMid, borderRadius:18, padding:'18px', border:`1px solid ${B.navyLt}` }}>
          <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Upcoming Payments</h4>
          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, marginBottom:8 }}>
            {['Month','EMI','Principal','Profit'].map(h=>(
              <p key={h} style={{ fontSize:10, fontWeight:700, color:B.dim, margin:0, textAlign:h!=='Month'?'right':'left' }}>{h}</p>
            ))}
          </div>
          {app.payments.map((p,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:4, padding:'10px 0', borderTop:`1px solid ${B.navyLt}`, alignItems:'center' }}>
              <p style={{ fontSize:12, color:B.text, margin:0, fontWeight:600 }}>{p.month}</p>
              <p style={{ fontSize:12, fontWeight:700, color:B.emerald, margin:0, textAlign:'right' }}>AED {p.amount.toLocaleString()}</p>
              <p style={{ fontSize:12, color:B.text, margin:0, textAlign:'right' }}>AED {p.principal.toLocaleString()}</p>
              <p style={{ fontSize:12, color:B.muted, margin:0, textAlign:'right' }}>AED {p.profit.toLocaleString()}</p>
            </div>
          ))}
          <div style={{ marginTop:12, padding:'10px 14px', background:B.navy, borderRadius:10 }}>
            <p style={{ fontSize:11, color:B.muted, margin:'0 0 2px' }}>Total Profit (Murābaḥa) over full term</p>
            <p style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>AED {Math.round(app.newEMI*app.tenure - app.amount).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Updated ScoreScreen with full alt-score breakdown ──────────
function ScoreScreen({ navigate, onTab, t }) {
  const [view, setView] = useState('olfi');

  const olfiFactors = [
    { label: 'Loan Repayment History', score: 88, weight: '25%', color: B.emerald, tip: 'On-time payments on all active UAE loans. Based on AECB + open banking data.' },
    { label: 'Credit Card & BNPL Discipline', score: 72, weight: '15%', color: B.warn, tip: 'Credit card utilisation, minimum payment behaviour, BNPL on-time completion.' },
    { label: 'Bill Payments (DEWA, ADDC, Telecom)', score: 90, weight: '15%', color: B.emerald, tip: 'Utility bills (DEWA, ADDC, Etisalat, du), telecom contracts, and municipality fees paid on time — pulled via open banking.' },
    { label: 'Open Banking Cash Flow', score: 68, weight: '20%', color: B.warn, tip: 'Monthly income consistency, salary crediting pattern, and spending-to-income ratio from your live bank feeds via Lean Technologies.' },
    { label: 'Employment & Salary Stability', score: 95, weight: '10%', color: B.emerald, tip: 'Continuous salary credits from the same employer for 6+ months. Visa status and employment tenure.' },
    { label: 'Spending Behaviour', score: 74, weight: '10%', color: B.warn, tip: 'Discretionary vs essential spending ratio, cash withdrawal frequency, and presence of savings or investment credits.' },
    { label: 'Debt-to-Income Ratio (DBR)', score: 61, weight: '5%', color: '#EF4444', tip: 'Your current monthly obligations as a % of gross income. CBUAE cap is 50%. Lower DBR = higher score on this factor.' },
  ];

  const cbuaeFactors = [
    { label: 'Payment History', score: 85, color: B.blue, detail: 'On-time payments across all UAE credit facilities' },
    { label: 'Credit Utilisation', score: 70, color: B.blue, detail: 'Current balance vs total credit limit across all cards' },
    { label: 'Length of Credit History', score: 78, color: B.blue, detail: 'Average age of all open credit accounts in UAE' },
    { label: 'New Credit Enquiries', score: 82, color: B.blue, detail: 'Hard enquiries in the last 12 months' },
    { label: 'Credit Mix', score: 75, color: B.blue, detail: 'Variety of credit types: loans, cards, auto' },
  ];

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:B.navy }}>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ background:`linear-gradient(160deg, #0a1628, ${B.navyMid})`, padding:'52px 20px 24px' }}>
          <TopBar title="" onBack={()=>{ onTab('home'); navigate('dashboard'); }} light />
          {/* Toggle */}
          <div style={{ display:'flex', background:B.navyLt, borderRadius:12, padding:3, marginBottom:20 }}>
            {[['olfi','OLFI Score'],['cbuae','CBUAE Score']].map(([id,label])=>(
              <div key={id} onClick={()=>setView(id)} style={{ flex:1, padding:'9px', borderRadius:10, background: view===id?(id==='olfi'?B.emerald:B.blue):'transparent', color: view===id?'#fff':B.muted, fontWeight:700, fontSize:13, textAlign:'center', cursor:'pointer', transition:'all 0.2s' }}>
                {label}
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:4 }}>
              <p style={{ color:B.muted, fontSize:11, margin:0, fontWeight:700, letterSpacing:0.8 }}>
                {view==='olfi' ? 'OLFI ALTERNATIVE CREDIT SCORE' : 'CBUAE / AECB OFFICIAL SCORE'}
              </p>
              <InfoTooltip id={view==='olfi'?'olfiScore':'cbuaeScore'} />
            </div>
            <div style={{ fontSize:68, fontWeight:900, color:B.text, lineHeight:1, letterSpacing:-2 }}>{view==='olfi'?724:718}</div>
            <div style={{ fontSize:14, color:view==='olfi'?B.emerald:B.blue, fontWeight:700, margin:'6px 0 2px' }}>GOOD STANDING</div>
            <p style={{ color:B.dim, fontSize:12 }}>/{view==='olfi'?850:900} · Better than 68% of users · ↑ +12 this month</p>
          </div>
        </div>

        <div style={{ padding:'16px' }}>
          {view==='olfi' ? (
            <>
              <div style={{ background:B.navyMid, borderRadius:20, padding:'18px', marginBottom:14, border:`1px solid ${B.navyLt}` }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:16 }}>
                  <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:0 }}>Alternative Score Breakdown</h4>
                  <InfoTooltip id="olfiScore" />
                </div>
                <div style={{ background:B.navy, borderRadius:12, padding:'10px 14px', marginBottom:16, display:'flex', gap:10, alignItems:'center' }}>
                  <span style={{ fontSize:18 }}>🏦</span>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, color:B.emerald, margin:'0 0 1px' }}>Beyond the bureau</p>
                    <p style={{ fontSize:11, color:B.muted, margin:0, lineHeight:1.4 }}>OLFI Score uses real financial behaviour — bills, cash flow, spending patterns — not just bureau data.</p>
                  </div>
                </div>
                {olfiFactors.map(f=>(
                  <div key={f.label} style={{ marginBottom:16 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6, alignItems:'flex-start', gap:8 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4, flex:1 }}>
                        <span style={{ fontSize:12, color:B.muted, lineHeight:1.3 }}>{f.label}</span>
                        <InfoTooltip id={null} />
                        {/* inline tip */}
                      </div>
                      <div style={{ display:'flex', gap:6, alignItems:'center', flexShrink:0 }}>
                        <span style={{ fontSize:10, color:B.dim, background:B.navyLt, padding:'1px 6px', borderRadius:6 }}>{f.weight}</span>
                        <span style={{ fontSize:13, fontWeight:800, color:f.color, minWidth:28, textAlign:'right' }}>{f.score}</span>
                      </div>
                    </div>
                    <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                      <div style={{ width:`${f.score}%`, background:f.color, height:'100%', borderRadius:99, transition:'width 1s ease' }}/>
                    </div>
                    <p style={{ fontSize:10, color:B.dim, margin:'4px 0 0', lineHeight:1.4 }}>{f.tip}</p>
                  </div>
                ))}
              </div>

              {/* Bill payments highlight */}
              <div style={{ background:B.navyMid, borderRadius:18, padding:'18px', marginBottom:14, border:`1px solid ${B.navyLt}` }}>
                <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Recent Bill Payments</h4>
                {[
                  { name:'DEWA', amount:'AED 420', date:'1 Apr', status:'on-time', icon:'⚡' },
                  { name:'Etisalat (e&)', amount:'AED 299', date:'5 Apr', status:'on-time', icon:'📱' },
                  { name:'ADDC', amount:'AED 310', date:'2 Apr', status:'on-time', icon:'💧' },
                  { name:'Salik', amount:'AED 100', date:'15 Apr', status:'on-time', icon:'🚗' },
                ].map(b=>(
                  <div key={b.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${B.navyLt}` }}>
                    <span style={{ fontSize:20 }}>{b.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:600, color:B.text }}>{b.name}</p>
                      <p style={{ margin:'1px 0 0', fontSize:11, color:B.dim }}>{b.date} 2026</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ margin:0, fontSize:13, fontWeight:700, color:B.text }}>{b.amount}</p>
                      <p style={{ margin:'1px 0 0', fontSize:10, color:B.emerald, fontWeight:700 }}>✓ On-time</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ background:B.navyMid, borderRadius:20, padding:'18px', marginBottom:14, border:`1px solid ${B.navyLt}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <div style={{ width:44, height:44, borderRadius:14, background:'#1B1464', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'#fff', fontSize:9, fontWeight:800, letterSpacing:0.5 }}>AECB</span>
                </div>
                <div>
                  <p style={{ margin:0, fontSize:14, fontWeight:700, color:B.text }}>Al Etihad Credit Bureau</p>
                  <p style={{ margin:'3px 0 0', fontSize:12, color:B.muted }}>Official UAE credit bureau · Free via OLFI</p>
                </div>
              </div>
              {cbuaeFactors.map(f=>(
                <div key={f.label} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:12, color:B.muted }}>{f.label}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:f.color }}>{f.score}</span>
                  </div>
                  <div style={{ background:B.navyLt, borderRadius:99, height:5 }}>
                    <div style={{ width:`${f.score}%`, background:'linear-gradient(90deg,#3B82F6,#6366F1)', height:'100%', borderRadius:99 }}/>
                  </div>
                  <p style={{ fontSize:10, color:B.dim, margin:'4px 0 0' }}>{f.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* Improvement tips */}
          <div style={{ background:B.navyMid, borderRadius:20, padding:'18px', border:`1px solid ${B.navyLt}` }}>
            <h4 style={{ fontSize:14, fontWeight:700, color:B.text, margin:'0 0 14px' }}>Improvement Tips</h4>
            {[
              { tip:'Pay credit card in full this month', impact:'+12 pts', icon:'💳' },
              { tip:'Set up direct debit for DEWA & telecom', impact:'+8 pts', icon:'⚡' },
              { tip:'Reduce credit utilisation below 30%', impact:'+6 pts', icon:'📉' },
              { tip:'Avoid new credit applications for 3 months', impact:'+5 pts', icon:'🚫' },
            ].map(tip=>(
              <div key={tip.tip} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${B.navyLt}` }}>
                <span style={{ fontSize:20 }}>{tip.icon}</span>
                <p style={{ flex:1, margin:0, fontSize:13, color:B.muted, lineHeight:1.4 }}>{tip.tip}</p>
                <span style={{ fontSize:12, fontWeight:800, color:B.emerald, whiteSpace:'nowrap' }}>{tip.impact}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomTabs tab="score" onTab={id=>{ onTab(id); if(id==='home') navigate('dashboard'); if(id==='offers') navigate('marketplace'); if(id==='apps') navigate('applications'); if(id==='profile') navigate('profile'); }} t={t} />
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────
function App() {
  const [screen, setScreen]   = useState(() => localStorage.getItem('olfi_screen') || 'welcome');
  const [tab, setTab]         = useState('home');
  const [lang, setLang]       = useState(() => localStorage.getItem('olfi_lang') || 'en');
  const [offerData, setOffer] = useState(OFFERS[0]);
  const [appData, setAppData] = useState(MY_APPS[0]);
  const t = T[lang] || T.en;

  const navigate = (to, data) => {
    if (data && to === 'offer_detail') setOffer(data);
    if (data && to === 'app_detail') setAppData(data);
    setScreen(to);
    localStorage.setItem('olfi_screen', to);
  };
  const onTab = (id) => {
    setTab(id);
    if (id === 'apps') navigate('applications');
  };

  const handleLang = (l) => { setLang(l); localStorage.setItem('olfi_lang', l); };

  const props = { navigate, onTab, t, lang, setLang: handleLang };

  const map = {
    welcome:      <WelcomeScreen {...props} />,
    signup:       <SignUpScreen {...props} />,
    otp:          <OTPScreen {...props} />,
    kyc_id:       <KYCIdScreen {...props} />,
    kyc_face:     <KYCFaceScreen {...props} />,
    open_banking: <OpenBankingScreen {...props} />,
    dashboard:    <DashboardScreen {...props} />,
    debt_detail:  <DebtDetailScreen {...props} />,
    marketplace:  <MarketplaceScreen {...props} />,
    offer_detail: <OfferDetailScreen {...props} offer={offerData} />,
    apply_status: <ApplyStatusScreen {...props} />,
    applications: <ApplicationsScreen {...props} />,
    app_detail:   <ApplicationDetailScreen {...props} appData={appData} />,
    score:        <ScoreScreen {...props} />,
    profile:      <ProfileScreen {...props} />,
  };

  return (
    <div className="iphone17-shell">
      <div className="iphone17-btn silent"/>
      <div className="iphone17-btn vol-up"/>
      <div className="iphone17-btn vol-dn"/>
      <div className="iphone17-btn power"/>
      <IOSDevice width={393} height={852} dark>
        <div style={{ height: '100%', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}>
          {map[screen] || map.welcome}
        </div>
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
