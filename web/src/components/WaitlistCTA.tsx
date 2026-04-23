'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function WaitlistCTA() {
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
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        setErrorMsg('');

        try {
            // Dynamically import to keep it isolated from SSR if necessary, or just import at top
            const { supabase } = await import('@/utils/supabase');
            const { error } = await supabase.from('waitlist').insert([{ email }]);

            if (error && error.code !== '23505') { // 23505 is unique violation, meaning already on list, which we can treat as success
                throw error;
            }

            setSubmitted(true);
            setEmail('');
        } catch (err: any) {
            console.error('Waitlist error:', err);
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-24 bg-base-dark relative border-t border-white/5" id="waitlist">
            <div className="container mx-auto px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="bg-brand-teal/[0.03] border border-brand-teal/20 rounded-[2rem] p-8 md:p-16 lg:p-20 text-center relative overflow-hidden"
                >


                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 w-fit mb-8 mx-auto">
                            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                            <span className="text-xs font-bold tracking-wide uppercase text-white">Waitlist open · Pre-launch</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-base-beige mb-6">
                            Be first in line <br className="hidden sm:block" />
                            when <em className="text-brand-teal font-medium not-italic">OLFi goes live</em>
                        </h2>

                        <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
                            Join the waitlist now and unlock priority onboarding, a free one-time AECB credit scoring, and AED 100 cashback on your first referral
                        </p>

                        {/* Form */}
                        {submitted ? (
                            <div className="max-w-md mx-auto p-6 bg-brand-teal/10 border border-brand-teal/30 rounded-2xl text-brand-teal font-medium mb-12">
                                ✓ You're on the list. See you at launch.
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-6">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.ae"
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-base-beige placeholder:text-base-beige/30 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all"
                                        disabled={loading}
                                    />
                                    <button type="submit" disabled={loading} className="cursor-pointer bg-transparent text-base-beige border border-white/10 font-bold px-8 py-4 rounded-xl hover:bg-white hover:text-base-dark transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? 'Joining...' : 'Join waitlist →'}
                                    </button>
                                </form>
                                {errorMsg && <p className="text-red-400 text-sm mb-6">{errorMsg}</p>}
                            </>
                        )}
                        {!submitted && (
                            <p className="text-xs font-mono text-white/50 tracking-widest uppercase mb-12">
                                No spam. One email when sandbox opens. Your data stays yours.
                            </p>
                        )}

                        {/* Perks */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
                            {[
                                { icon: '★', label: 'Priority onboarding' },
                                { icon: '✓', label: 'Free AECB score' },
                                { icon: '﷼', label: 'AED 100 referral' },
                            ].map((perk, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-base-beige/70">
                                    <div className="w-6 h-6 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center text-brand-teal text-[10px]">
                                        {perk.icon}
                                    </div>
                                    <span>{perk.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Countdown */}
                        <div className="flex justify-center">
                            <div className="inline-flex border border-white/10 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm">
                                {[
                                    { value: timeLeft.days, label: 'Days' },
                                    { value: timeLeft.hours, label: 'Hours' },
                                    { value: timeLeft.mins, label: 'Mins' },
                                    { value: timeLeft.secs, label: 'Secs' },
                                ].map((unit, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center px-6 py-4 border-r border-white/5 last:border-0 min-w-[90px]">
                                        <span className="text-3xl font-display font-bold text-base-beige mb-1">{unit.value.toString().padStart(2, '0')}</span>
                                        <span className="text-[10px] font-mono text-white/50 tracking-[0.15em] uppercase">{unit.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs font-mono text-brand-teal/60 tracking-widest uppercase mt-6">
                            Target UAE sandbox launch · Q4 2026
                        </p>
                    </div>
                </motion.div>
            </div >
        </section >
    );
}
