'use client';

import { motion, Variants } from 'framer-motion';
import { Check, Minus, X, Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
const headerFadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const rowVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }),
};

const checkPop: Variants = {
    hidden: { scale: 0.5, opacity: 0 },
    show: (i: number) => ({
        scale: 1,
        opacity: 1,
        transition: { type: "spring" as const, stiffness: 300, damping: 20, delay: i * 0.06 + 0.2 },
    }),
};

export function ComparisonTable() {
    const t = useTranslations('compare');

    const compareData = [
        {
            feature: t('feat1'),
            traditional: true,
            creditors: false,
            olfi: true,
            tooltip: t('tooltip1'),
        },
        {
            feature: t('feat2'),
            traditional: true,
            creditors: true,
            olfi: true,
            tooltip: t('tooltip2'),
        },
        {
            feature: t('feat3'),
            traditional: true,
            creditors: false,
            olfi: true,
            tooltip: t('tooltip3'),
        },
        {
            feature: t('feat4'),
            traditional: true,
            creditors: false,
            olfi: false,
            tooltip: t('tooltip4'),
        },
        {
            feature: t('feat5'),
            traditional: false,
            creditors: true,
            olfi: true,
            tooltip: t('tooltip5'),
        },
        {
            feature: t('feat6'),
            traditional: false,
            creditors: false,
            olfi: true,
            tooltip: t('tooltip6'),
        },
        {
            feature: t('feat7'),
            traditional: false,
            creditors: false,
            olfi: true,
            tooltip: t('tooltip7'),
        },
        {
            feature: t('feat8'),
            traditional: false,
            creditors: false,
            olfi: true,
            tooltip: t('tooltip8'),
        },
    ];

    return (
        <section id="compare" className="scroll-mt-28 py-32 bg-base-beige text-base-dark relative">

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.15 } } }}
                    className="text-center mb-16"
                >
                    <motion.h2 variants={headerFadeUp} className="text-5xl font-bold tracking-tighter mb-4">
                        {t('headline')}
                    </motion.h2>
                    <motion.p variants={headerFadeUp} className="text-lg text-base-dark/70 max-w-xl mx-auto">
                        {t('subheadline')}
                    </motion.p>
                </motion.div>

                <div className="w-full">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="w-[45%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider">{t('featureCol')}</th>
                                <th className="w-[18%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider text-center">{t('traditional')}</th>
                                <th className="w-[18%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider text-center">{t('consultants')}</th>
                                <th className="w-[19%] pb-8 font-bold text-brand-teal text-lg tracking-tight text-center">{t('olfi')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-dark/10">
                            {compareData.map((row, idx) => (
                                <motion.tr
                                    key={idx}
                                    custom={idx}
                                    variants={rowVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, margin: "-40px" }}
                                    className="group hover:bg-white/50 transition-colors cursor-default"
                                >
                                    <td className="py-6 font-semibold text-lg relative">
                                        <span className="flex items-center gap-2 group/tooltip cursor-help relative w-fit">
                                            {row.feature}
                                            <Info className="w-4 h-4 text-base-dark/30 hover:text-base-dark" />

                                            {/* Tooltip */}
                                            <span className="absolute bottom-full left-0 mb-2 w-64 bg-base-dark text-white text-xs p-3 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 shadow-xl pointer-events-none">
                                                {row.tooltip}
                                                <svg className="absolute top-full left-4 w-3 h-3 text-base-dark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21L0 0h24L12 21z" /></svg>
                                            </span>
                                        </span>
                                    </td>

                                    <td className="py-6 text-center">
                                        {row.traditional ? (
                                            <Check className="w-6 h-6 mx-auto text-base-dark" />
                                        ) : (
                                            <X className="w-6 h-6 mx-auto text-base-dark/20" />
                                        )}
                                    </td>

                                    <td className="py-6 text-center">
                                        {row.creditors ? (
                                            <Check className="w-6 h-6 mx-auto text-base-dark" />
                                        ) : (
                                            <X className="w-6 h-6 mx-auto text-base-dark/20" />
                                        )}
                                    </td>

                                    <td className="py-6 text-center bg-brand-teal/5 relative">
                                        {idx === 0 && <div className="absolute inset-x-0 top-0 h-px bg-brand-teal/20" />}
                                        {idx === compareData.length - 1 && <div className="absolute inset-x-0 bottom-0 h-px bg-brand-teal/20" />}

                                        {row.olfi ? (
                                            <motion.div
                                                custom={idx}
                                                variants={checkPop}
                                                initial="hidden"
                                                whileInView="show"
                                                viewport={{ once: true }}
                                                className="inline-flex"
                                            >
                                                <Check className="w-6 h-6 mx-auto text-brand-teal" strokeWidth={3} />
                                            </motion.div>
                                        ) : (
                                            <Minus className="w-6 h-6 mx-auto text-brand-teal/20" />
                                        )}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
