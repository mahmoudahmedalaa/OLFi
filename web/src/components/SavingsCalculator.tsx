'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';

// Animated counter hook — smoothly counts from current to target
function useAnimatedCounter(target: number, duration: number = 800) {
    const [display, setDisplay] = useState(0);
    const frameRef = useRef<number | null>(null);
    const startRef = useRef<number | null>(null);
    const fromRef = useRef(0);

    useEffect(() => {
        fromRef.current = display;
        startRef.current = performance.now();

        const animate = (now: number) => {
            const elapsed = now - (startRef.current || now);
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(fromRef.current + (target - fromRef.current) * eased);
            setDisplay(current);
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            }
        };

        frameRef.current = requestAnimationFrame(animate);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target, duration]);

    return display;
}

const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const sliderVariants = {
    hidden: { opacity: 0, x: -20 },
    show: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    }),
};

export function SavingsCalculator() {
    const t = useTranslations('calculator');
    const [balance, setBalance] = useState(120000);
    const [rate, setRate] = useState(12.0);
    const [term, setTerm] = useState(36);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const calculateSavings = useCallback(() => {
        const rCurrent = (rate / 100) / 12;
        const currentPayment = (balance * rCurrent * Math.pow(1 + rCurrent, term)) / (Math.pow(1 + rCurrent, term) - 1);

        const newRate = Math.max(rate - 2, 0.1);
        const rNew = (newRate / 100) / 12;
        const newPayment = (balance * rNew * Math.pow(1 + rNew, term)) / (Math.pow(1 + rNew, term) - 1);

        const monthlySaving = currentPayment - newPayment;
        const totalSaving = monthlySaving * term;

        return Math.max(0, Math.round(totalSaving));
    }, [balance, rate, term]);

    const savings = calculateSavings();
    const animatedSavings = useAnimatedCounter(savings);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <section ref={sectionRef} className="scroll-mt-28 py-24 bg-base-dark relative border-t border-white/5" id="savings">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-16 relative overflow-hidden"
                >

                    <div className="relative z-10 flex flex-col gap-10">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 w-fit mb-6"
                            >
                                <span className="text-xs font-bold tracking-wide uppercase text-white">{t('label')}</span>
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-4xl lg:text-5xl font-bold tracking-tighter text-base-beige leading-tight"
                            >
                                {t('headline')}
                            </motion.h2>
                        </div>

                        <div className="space-y-8">
                            {/* Balance Input */}
                            <motion.div
                                custom={0}
                                variants={sliderVariants}
                                initial="hidden"
                                animate={isInView ? "show" : "hidden"}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slBalance">{t('totalOutstanding')}</label>
                                    <span className="text-xl font-bold text-base-beige">{formatCurrency(balance)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="20000"
                                    max="500000"
                                    step="5000"
                                    value={balance}
                                    onChange={(e) => setBalance(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,229,255,0.5)] [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]"
                                    id="slBalance"
                                />
                            </motion.div>

                            {/* Rate Input */}
                            <motion.div
                                custom={1}
                                variants={sliderVariants}
                                initial="hidden"
                                animate={isInView ? "show" : "hidden"}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slRate">{t('currentRate')}</label>
                                    <span className="text-xl font-bold text-base-beige">{rate.toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="4"
                                    max="36"
                                    step="0.5"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,229,255,0.5)] [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]"
                                    id="slRate"
                                />
                            </motion.div>

                            {/* Term Input */}
                            <motion.div
                                custom={2}
                                variants={sliderVariants}
                                initial="hidden"
                                animate={isInView ? "show" : "hidden"}
                                className="flex flex-col gap-3"
                            >
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slTerm">{t('remainingTenure')}</label>
                                    <span className="text-xl font-bold text-base-beige">{term} months</span>
                                </div>
                                <input
                                    type="range"
                                    min="6"
                                    max="60"
                                    step="1"
                                    value={term}
                                    onChange={(e) => setTerm(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(0,229,255,0.5)] [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-[0_0_20px_rgba(0,229,255,0.8)]"
                                    id="slTerm"
                                />
                            </motion.div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5, type: "spring", stiffness: 150, damping: 20 }}
                        className="relative z-10 flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-sm"
                    >
                        <div className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#4FD1C5] mb-4">
                            {formatCurrency(animatedSavings)}
                        </div>
                        <p className="text-lg text-base-beige/80 mb-6">
                            {t('estimatedTotal')}<br />{t('ifRefinance')}
                        </p>
                        <p className="text-xs text-white/60 uppercase tracking-widest font-mono text-center">
                            {t('disclaimer')}
                        </p>

                        <a
                            href="#waitlist"
                            className="mt-10 px-8 py-4 w-full text-center bg-base-beige text-base-dark border border-base-beige hover:opacity-90 rounded-xl font-bold transition-opacity duration-300"
                        >
                            {t('getOffer')}
                        </a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
