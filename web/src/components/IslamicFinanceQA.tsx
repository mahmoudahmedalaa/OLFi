'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

export function IslamicFinanceQA() {
    const { t } = useLanguage();

    const offersList = [
        { bank: t('islamicQa.offer1.bank'), product: t('islamicQa.offer1.product'), rate: t('islamicQa.offer1.rate') },
        { bank: t('islamicQa.offer2.bank'), product: t('islamicQa.offer2.product'), rate: t('islamicQa.offer2.rate') },
        { bank: t('islamicQa.offer3.bank'), product: t('islamicQa.offer3.product'), rate: t('islamicQa.offer3.rate') }
    ];

    return (
        <section className="py-24 bg-base-dark relative border-t border-white/5" id="islamic-qa">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="bg-base-dark border border-white/10 rounded-3xl p-8 lg:p-16 relative overflow-hidden">

                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        {/* Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 w-fit mb-6">
                                <span className="text-xs font-bold tracking-wide uppercase text-white">{t('islamicQa.label')}</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-base-beige leading-tight mb-6 mt-4">
                                {t('islamicQa.headlineLine1')} <br />
                                {t('islamicQa.headlineLine2')}
                            </h2>
                            <p className="text-lg text-white/80 leading-relaxed mb-8">
                                {t('islamicQa.description')}
                            </p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 mt-2"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            <path d="M9 12l2 2 4-4" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-base-beige font-semibold text-lg">{t('islamicQa.verifiedLabel')}</p>
                                    <p className="text-white/60 text-sm">{t('islamicQa.verifiedSub')}</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Interactive Match UI */}
                        <div className="flex flex-col gap-6">
                            {/* User Question */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full"
                            >
                                <div className="text-xs font-mono text-white/50 tracking-widest uppercase mb-3">{t('islamicQa.youAsked')}</div>
                                <div className="text-base text-white/90 italic">
                                    {t('islamicQa.question')}
                                </div>
                            </motion.div>

                            {/* Response Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-brand-teal/10 border border-brand-teal/20 rounded-2xl p-6 self-start w-full relative overflow-hidden"
                            >
                                <div className="text-xs font-mono text-brand-teal tracking-widest uppercase mb-6 relative z-10">{t('islamicQa.resultLabel')}</div>

                                <div className="space-y-4 relative z-10">
                                    {offersList.map((offer, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-brand-teal/10 last:border-0 last:pb-0">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-base-beige">{offer.bank}</span>
                                                <span className="text-xs text-white/60">{offer.product}</span>
                                            </div>
                                            <span className="text-brand-teal font-mono font-bold tracking-tight">{offer.rate}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
