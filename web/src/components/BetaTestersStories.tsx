'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BetaTestersStories() {
    const t = useTranslations('stories');

    const testimonialsList = [
        {
            quote: t('t1_quote'),
            author: t('t1_author'),
            role: t('t1_role'),
            initials: t('t1_initials')
        },
        {
            quote: t('t2_quote'),
            author: t('t2_author'),
            role: t('t2_role'),
            initials: t('t2_initials')
        },
        {
            quote: t('t3_quote'),
            author: t('t3_author'),
            role: t('t3_role'),
            initials: t('t3_initials')
        }
    ];

    return (
        <section className="py-28 bg-base-beige relative border-t border-base-dark/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="mb-16 max-w-3xl">
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm mb-4 block">{t('label')}</span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-base-dark">
                        {t('headline')}
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-base-dark/10 bg-base-dark/10">
                    {testimonialsList.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-base-beige p-8 transition-colors duration-200 hover:bg-white/55"
                        >
                            <div className="flex gap-1 mb-6 text-amber-500">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} fill="currentColor" size={16} />
                                ))}
                            </div>

                            <p className="text-[15px] leading-relaxed text-base-dark/80 mb-8 italic">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal font-bold font-mono text-sm">
                                    {testimonial.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-base-dark text-sm">{testimonial.author}</span>
                                    <span className="text-xs text-base-dark/50 uppercase tracking-widest">{testimonial.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
