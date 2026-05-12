'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getSupabase } from '@/utils/supabase';
import { Check, CreditCard, Sparkles } from 'lucide-react';

export function WaitlistCTA() {
    const t = useTranslations('waitlist');
    // Basic countdown logic to Q4 2026 (Oct 1, 2026 for illustration)
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        mins: 0,
        secs: 0
    });

    useEffect(() => {
        const targetDate = new Date('2026-10-01T00:00:00').getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    mins: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                    secs: Math.floor((difference % (1000 * 60)) / 1000)
                });
            }
        };

        const timerId = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(timerId);
    }, []);

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setErrorMsg('');

        try {
            // Uses static import but lazy initialization to prevent SSR build crashes
            const supabase = getSupabase();
            const { error } = await supabase.from('waitlist').insert([{ email, full_name: fullName }]);

            if (error && error.code !== '23505') { // 23505 is unique violation, meaning already on list, which we can treat as success
                throw error;
            }

            setSubmitted(true);
            setEmail('');
            setFullName('');
        } catch (err: unknown) {
            console.error('Waitlist error:', err);
            setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="scroll-mt-28 py-28 bg-base-dark relative border-t border-white/5" id="waitlist">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-[#061f20] border border-white/10 rounded-2xl p-8 md:p-16 lg:p-20 text-center relative overflow-hidden"
                >


                    <div className="relative z-10">
                        <p className="mb-8 font-mono text-xs font-bold tracking-[0.2em] uppercase text-brand-teal">{t('label')}</p>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-base-beige mb-6">
                            {t('headlinePart1')} <br className="hidden sm:block" />
                            {t('headlinePart2')} <em className="text-brand-teal font-medium not-italic">{t('headlinePart3')}</em>
                        </h2>

                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                            {t('description')}
                        </p>

                        {/* Form */}
                        {submitted ? (
                            <div className="max-w-md mx-auto p-6 bg-brand-teal/10 border border-brand-teal/30 rounded-2xl text-brand-teal font-medium mb-12">
                                {t('success')}
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder={t('namePlaceholder')}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-base-beige placeholder:text-base-beige/30 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                                        disabled={loading}
                                    />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('placeholder')}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-base-beige placeholder:text-base-beige/30 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                                        disabled={loading}
                                    />
                                    <button type="submit" disabled={loading} className="cursor-pointer bg-base-beige text-base-dark border border-base-beige font-bold px-8 py-4 rounded-xl hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? t('btnJoining') : t('btnJoin')}
                                    </button>
                                </form>
                                {errorMsg && <p className="text-red-400 text-sm mb-6">{errorMsg}</p>}
                            </>
                        )}
                        {!submitted && (
                            <p className="text-xs font-mono text-white/50 tracking-widest uppercase mb-12">
                                {t('spamNotice')}
                            </p>
                        )}

                        {/* Perks */}
                        <motion.div
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            variants={{
                                hidden: {},
                                show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
                            }}
                            className="flex flex-wrap items-center justify-center gap-6 mb-12"
                        >
                            {[
                                { Icon: Sparkles, label: t('perk1_label') },
                                { Icon: Check, label: t('perk2_label') },
                                { Icon: CreditCard, label: t('perk3_label') },
                            ].map((perk, i) => (
                                <motion.div
                                    key={i}
                                    variants={{
                                        hidden: { opacity: 0, y: 10 },
                                        show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                                    }}
                                    className="flex items-center gap-2 text-sm text-base-beige/70"
                                >
                                    <div className="w-7 h-7 rounded-full bg-base-dark border border-brand-teal/20 flex items-center justify-center text-brand-teal">
                                        <perk.Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <span>{perk.label}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Countdown */}
                        <div className="flex justify-center">
                            <div className="inline-flex border border-white/10 rounded-xl overflow-hidden bg-base-dark">
                                {[
                                    { value: timeLeft.days, label: t('countdown_days') },
                                    { value: timeLeft.hours, label: t('countdown_hours') },
                                    { value: timeLeft.mins, label: t('countdown_mins') },
                                    { value: timeLeft.secs, label: t('countdown_secs') },
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center px-6 py-4 border-r border-white/5 last:border-0 min-w-[90px]">
                                        <div className="relative h-[36px] overflow-hidden">
                                            <AnimatePresence mode="popLayout">
                                                <motion.span
                                                    key={unit.value}
                                                    initial={{ y: -36, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    exit={{ y: 36, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                    className="text-3xl font-display font-bold text-base-beige block"
                                                >
                                                    {unit.value.toString().padStart(2, '0')}
                                                </motion.span>
                                            </AnimatePresence>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/50 tracking-[0.15em] uppercase">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs font-mono text-brand-teal/60 tracking-widest uppercase mt-6">
                            {t('launchTarget')}
                        </p>
                    </div>
                </motion.div>
            </div >
        </section >
    );
}
