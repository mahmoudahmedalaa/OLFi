'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../contexts/LanguageContext';

export function Navigation() {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 80], [0, 1]);
    const t = useTranslations('nav');
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
        >
            {/* Scroll-aware glass background */}
            <motion.div
                className="absolute inset-0 -z-10"
                style={{
                    opacity: bgOpacity,
                    backgroundColor: 'rgba(1, 24, 25, 0.72)',
                }}
            />

            <div
                className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-base-dark/80 px-4 py-3 shadow-[0_16px_50px_rgba(0,0,0,0.18)] md:px-5"
            >
                <Link href="/" className="flex items-center">
                    <Image
                        src="/assets/olfi-logo.png"
                        alt="OLFi Logo"
                        width={79}
                        height={32}
                        loading="eager"
                        className="opacity-90 transition-opacity hover:opacity-100"
                    />
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
                    <Link href="#features" className="hover:text-base-beige transition-colors">{t('features')}</Link>
                    <Link href="#how-it-works" className="hover:text-base-beige transition-colors">{t('howItWorks')}</Link>
                    <Link href="#compare" className="hover:text-base-beige transition-colors">{t('compare')}</Link>
                    <Link href="#faq" className="hover:text-base-beige transition-colors">{t('faq')}</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="cursor-pointer text-sm font-medium text-white/75 transition-colors hover:text-base-beige"
                    >
                        {language === 'en' ? 'العربية' : 'EN'}
                    </button>
                    <Link
                        href="#waitlist"
                        className="flex items-center gap-2 rounded-lg border border-base-beige bg-base-beige px-5 py-2.5 text-sm font-semibold text-base-dark transition-opacity duration-200 hover:opacity-90"
                    >
                        {t('joinWaitlist')}
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
