'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';

const stagger = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.18, delayChildren: 0.3 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
    const t = useTranslations('hero');
    return (
        <section className="relative min-h-screen overflow-hidden bg-base-dark pt-36 pb-16 md:pt-40">
            <div className="absolute inset-0 z-0 pointer-events-none surface-grid-dark opacity-45" />
            <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-b from-transparent to-base-beige" />
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid min-h-[calc(100vh-12rem)] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="relative flex max-w-2xl flex-col gap-8"
                    >

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-beige/70">
                            <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-teal">{t('earlyAccess')}</span>
                            <span className="hidden h-px w-10 bg-white/20 sm:block" />
                            <span className="inline-flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-brand-teal" />
                                {t('sharia')}
                            </span>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl lg:text-[86px] font-bold tracking-tighter leading-[0.95] text-base-beige">
                            {t('headlineLine1')} <br className="hidden sm:block" /> {t('headlineLine2')} <br />
                            <em className="text-brand-teal italic font-medium">{t('headlineLine3')}</em>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="max-w-xl text-lg sm:text-xl text-base-beige/74 leading-relaxed">
                            {t('subheadline')}
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 pt-1">
                            <Link
                                href="#waitlist"
                                className="flex w-full items-center justify-center rounded-lg border border-base-beige bg-base-beige px-8 py-4 text-center text-base font-semibold text-base-dark transition-opacity duration-200 hover:opacity-90 sm:w-auto"
                            >
                                {t('joinWaitlist')}
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeUp} className="grid max-w-xl grid-cols-3 gap-5 border-t border-white/10 pt-6">
                            {[
                                ['01', 'Map liabilities'],
                                ['02', 'Filter offers'],
                                ['03', 'Apply cleanly'],
                            ].map(([num, label]) => (
                                <div key={num}>
                                    <p className="font-mono text-xl text-base-beige">{num}</p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-base-beige/45">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                        className="relative mx-auto hidden w-full max-w-[560px] md:block lg:ml-auto"
                    >
                        <div className="absolute -left-10 top-10 hidden w-[280px] rounded-2xl border border-white/10 bg-[#061f20] p-5 xl:block">
                            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
                                <span className="text-xs uppercase tracking-[0.18em] text-base-beige/45">Debt portfolio</span>
                                <span className="font-mono text-brand-teal">AED</span>
                            </div>
                            {[
                                ['Outstanding balance', '120,000'],
                                ['Estimated monthly relief', '1,520'],
                                ['Best matched rate', '4.49%'],
                            ].map(([label, value]) => (
                                <div key={label} className="flex flex-col gap-1 border-b border-white/5 py-3 last:border-0">
                                    <span className="text-sm text-base-beige/58">{label}</span>
                                    <span className="font-mono text-base-beige">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="relative ml-auto aspect-[9/19.5] w-[310px] overflow-hidden rounded-[46px] border-[8px] border-[#111616] bg-base-dark shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#131313] rounded-b-3xl z-20" />

                            <Image
                                src="/assets/Dashboard.PNG"
                                alt="OLFi Dashboard App Interface"
                                fill
                                className="object-cover z-10"
                                sizes="310px"
                                priority
                            />

                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none" />
                        </div>

                        <div className="absolute bottom-12 left-4 w-[280px] rounded-2xl border border-brand-teal/25 bg-base-dark p-5">
                            <p className="text-xs uppercase tracking-[0.18em] text-brand-teal">Application clarity</p>
                            <div className="mt-4 h-1.5 rounded-full bg-white/10">
                                <div className="h-full w-[64%] rounded-full bg-brand-teal" />
                            </div>
                            <div className="mt-4 flex justify-between text-xs text-base-beige/56">
                                <span>Matched</span>
                                <span>Docs</span>
                                <span>Bank review</span>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
