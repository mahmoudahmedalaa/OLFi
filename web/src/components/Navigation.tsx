'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '../contexts/LanguageContext';

export function Navigation() {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const borderOpacity = useTransform(scrollY, [0, 80], [0, 0.08]);
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed top-0 left-0 right-0 z-50 py-6"
        >
            {/* Scroll-aware glass background */}
            <motion.div
                className="absolute inset-0 backdrop-blur-xl -z-10"
                style={{
                    opacity: bgOpacity,
                    backgroundColor: 'rgba(1, 16, 17, 0.85)',
                    borderBottom: '1px solid',
                    borderColor: useTransform(borderOpacity, (v) => `rgba(255,255,255,${v})`),
                }}
            />

            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    <Image src="/assets/olfi-logo.png" alt="OLFi Logo" width={100} height={40} className="w-auto h-8 opacity-90 hover:opacity-100 transition-opacity" />
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
                    <Link href="#features" className="hover:text-base-beige transition-colors">{t('nav.features')}</Link>
                    <Link href="#how-it-works" className="hover:text-base-beige transition-colors">{t('nav.howItWorks')}</Link>
                    <Link href="#compare" className="hover:text-base-beige transition-colors">{t('nav.compare')}</Link>
                    <Link href="#faq" className="hover:text-base-beige transition-colors">{t('nav.faq')}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="text-white/60 hover:text-white font-mono text-sm uppercase tracking-widest px-2 transition-colors cursor-pointer"
                    >
                        {language === 'en' ? 'عربي' : 'EN'}
                    </button>
                    <Link
                        href="#waitlist"
                        className="bg-transparent text-base-beige border border-white/10 hover:bg-white hover:text-base-dark text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                        {t('nav.joinWaitlist')}
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
