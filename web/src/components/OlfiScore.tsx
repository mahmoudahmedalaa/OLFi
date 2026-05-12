'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type OlfiScoreTranslationKey =
    | 'bullet1'
    | 'bullet2'
    | 'bullet3'
    | 'bullet4';

const signals = ['BNPL', 'Utilities', 'Daily spend', 'Banks', 'AECB'];

const lineVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
};

export function OlfiScore() {
    const t = useTranslations('olfiScore');
    const bullets = ['bullet1', 'bullet2', 'bullet3', 'bullet4'] satisfies OlfiScoreTranslationKey[];

    return (
        <section className="py-28 bg-base-dark border-t border-white/5 text-base-beige relative font-sans overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-16 items-center">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-teal"
                        >
                            {t('label')}
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.08 }}
                            className="text-4xl lg:text-6xl font-bold tracking-tighter leading-[1.02] mb-7"
                        >
                            {t('headline')}
                        </motion.h2>

                        <motion.ul
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                            className="space-y-4 text-base-beige/78 leading-relaxed"
                        >
                            {bullets.map((bullet, idx) => (
                                <motion.li
                                    key={bullet}
                                    variants={{
                                        hidden: { opacity: 0, x: -10 },
                                        show: { opacity: 1, x: 0, transition: { duration: 0.42 } },
                                    }}
                                    className="flex gap-4"
                                >
                                    <span className="mt-0.5 font-mono text-sm text-brand-teal">0{idx + 1}</span>
                                    <span>{t(bullet)}</span>
                                </motion.li>
                            ))}
                        </motion.ul>

                        <p className="text-xs text-base-beige/42 mt-8 leading-relaxed">{t('disclaimer')}</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="relative rounded-2xl border border-white/10 bg-[#061f20] p-6 md:p-8 overflow-hidden"
                    >
                        <div className="fine-noise absolute inset-0 opacity-50" />
                        <div className="relative z-10">
                            <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
                                <Image src="/assets/olfi-logo.png" alt="OLFi" width={79} height={32} className="opacity-90 brightness-150" />
                                <span className="font-mono text-xs uppercase tracking-[0.18em] text-base-beige/45">{t('olfiScoreText')}</span>
                            </div>

                            <div className="relative min-h-[360px]">
                                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 360" fill="none" aria-hidden="true">
                                    <motion.path
                                        variants={lineVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        d="M72 72 C160 72 160 180 260 180 C360 180 360 288 488 288"
                                        stroke="rgba(79,209,197,0.65)"
                                        strokeWidth="1.5"
                                    />
                                    <motion.path
                                        variants={lineVariants}
                                        initial="hidden"
                                        whileInView="show"
                                        viewport={{ once: true }}
                                        d="M72 288 C150 288 170 226 260 226 C354 226 382 72 488 72"
                                        stroke="rgba(225,222,209,0.22)"
                                        strokeWidth="1.5"
                                    />
                                </svg>

                                <div className="absolute left-0 top-4 grid gap-3">
                                    {signals.slice(0, 3).map((signal) => (
                                        <div key={signal} className="w-36 border border-white/10 bg-base-dark px-4 py-3">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-beige/54">{signal}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute left-1/2 top-1/2 flex h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-brand-teal/35 bg-base-dark">
                                    <span className="font-mono text-xs uppercase tracking-[0.16em] text-brand-teal">OLFi</span>
                                    <span className="mt-1 text-3xl font-bold text-base-beige">{t('olfiScoreText')}</span>
                                </div>

                                <div className="absolute right-0 bottom-4 grid gap-3">
                                    {signals.slice(3).map((signal) => (
                                        <div key={signal} className="w-36 border border-white/10 bg-base-dark px-4 py-3 text-right">
                                            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-base-beige/54">{signal}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-5">
                                <p className="text-sm text-base-beige/60 tracking-tight">{t('partnerLabel')}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
