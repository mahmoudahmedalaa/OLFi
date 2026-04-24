'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function FAQAccordion() {
    const [open, setOpen] = useState<number | null>(0);
    const { t } = useLanguage();

    const faqsList = [
        { q: t('faq.q1.q'), a: t('faq.q1.a') },
        { q: t('faq.q2.q'), a: t('faq.q2.a') },
        { q: t('faq.q3.q'), a: t('faq.q3.a') },
        { q: t('faq.q4.q'), a: t('faq.q4.a') },
        { q: t('faq.q5.q'), a: t('faq.q5.a') }
    ];

    return (
        <section id="faq" className="py-32 bg-base-dark border-t border-white/5">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-5xl font-bold tracking-tighter text-base-beige mb-16 text-center">
                    {t('faq.headline')}
                </h2>

                <div className="flex flex-col gap-4">
                    {faqsList.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${open === idx ? 'bg-white/5 border-brand-teal/30' : 'bg-transparent border-white/10 hover:border-white/20'
                                }`}
                        >
                            <button
                                className="w-full text-left p-6 flex justify-between items-center"
                                onClick={() => setOpen(open === idx ? null : idx)}
                            >
                                <span className="font-medium text-lg text-base-beige pr-8">{faq.q}</span>
                                <span className="text-brand-teal flex-shrink-0">
                                    {open === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {open === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-base-beige/60 text-base leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
