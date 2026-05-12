'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
};

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.2 } },
};

export function Footer() {
    const t = useTranslations('footer');
    return (
        <footer className="bg-[#011011] border-t border-white/5 pt-20 pb-8 overflow-hidden">
            {/* Massive CTA */}
            <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                    className="container mx-auto px-6 max-w-7xl border-b border-white/10 pb-20"
            >
                <motion.h2
                    variants={fadeUp}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                    className="text-5xl sm:text-7xl md:text-8xl lg:text-[104px] leading-[0.92] font-bold tracking-tighter text-base-beige mb-10 text-center break-words"
                >
                    {t('headline')}
                </motion.h2>

                <motion.div
                    variants={fadeUp}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                    className="flex justify-center"
                >
                    <Link
                        href="https://apps.apple.com/app/"
                        target="_blank"
                        className="bg-transparent text-base-beige border border-white/10 hover:bg-white hover:text-base-dark text-lg font-medium px-8 md:px-12 py-4 md:py-5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-3 w-full sm:w-auto"
                    >
                        <svg viewBox="0 0 384 512" className="w-8 h-8 fill-current">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        {t('download')}
                    </Link>
                </motion.div>
            </motion.div>

            {/* Footer Bottom */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="container mx-auto px-6 max-w-7xl pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
            >
                <Link href="/" className="flex items-center">
                    <Image src="/assets/olfi-logo.png" alt="OLFi Logo" width={79} height={32} className="opacity-90 transition-opacity hover:opacity-100" />
                </Link>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
                    <Link href="/privacy" className="hover:text-base-beige transition-colors">{t('privacy')}</Link>
                    <Link href="/terms" className="hover:text-base-beige transition-colors">{t('terms')}</Link>
                    <Link href="/contact" className="hover:text-base-beige transition-colors">{t('contact')}</Link>
                </div>

                <div className="text-sm text-white/60 text-center md:text-right">
                    &copy; {new Date().getFullYear()} {t('rights')} <br className="md:hidden" /> {t('reserved')}
                </div>
            </motion.div>
        </footer>
    );
}
