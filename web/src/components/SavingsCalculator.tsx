'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function SavingsCalculator() {
    const [balance, setBalance] = useState(120000);
    const [rate, setRate] = useState(12.0);
    const [term, setTerm] = useState(36);

    // Simplistic calculator logic for illustrative purposes.
    // Monthly payment calculation: [P * r * (1 + r)^n] / [(1 + r)^n - 1]
    const calculateSavings = () => {
        // Current payment
        const rCurrent = (rate / 100) / 12;
        const currentPayment = (balance * rCurrent * Math.pow(1 + rCurrent, term)) / (Math.pow(1 + rCurrent, term) - 1);

        // Projected payment (assuming 2% rate reduction from current)
        const newRate = Math.max(rate - 2, 0.1); // floor at 0.1% to avoid division by 0
        const rNew = (newRate / 100) / 12;
        const newPayment = (balance * rNew * Math.pow(1 + rNew, term)) / (Math.pow(1 + rNew, term) - 1);

        const monthlySaving = currentPayment - newPayment;
        const totalSaving = monthlySaving * term;

        return Math.max(0, Math.round(totalSaving));
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <section className="py-24 bg-base-dark relative border-t border-white/5" id="savings">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-16 relative overflow-hidden">


                    <div className="relative z-10 flex flex-col gap-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 w-fit mb-6">
                                <span className="text-xs font-bold tracking-wide uppercase text-brand-teal">Savings Estimate</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-base-beige leading-tight">
                                See what you could save
                            </h2>
                        </div>

                        <div className="space-y-8">
                            {/* Balance Input */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slBalance">Total loan balance (AED)</label>
                                    <span className="text-xl font-bold text-base-beige">{formatCurrency(balance)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="20000"
                                    max="500000"
                                    step="5000"
                                    value={balance}
                                    onChange={(e) => setBalance(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full"
                                    id="slBalance"
                                />
                            </div>

                            {/* Rate Input */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slRate">Current average rate (%)</label>
                                    <span className="text-xl font-bold text-base-beige">{rate.toFixed(1)}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="4"
                                    max="36"
                                    step="0.5"
                                    value={rate}
                                    onChange={(e) => setRate(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full"
                                    id="slRate"
                                />
                            </div>

                            {/* Term Input */}
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm font-medium text-white/70 uppercase tracking-widest">
                                    <label htmlFor="slTerm">Remaining term (months)</label>
                                    <span className="text-xl font-bold text-base-beige">{term} months</span>
                                </div>
                                <input
                                    type="range"
                                    min="6"
                                    max="60"
                                    step="1"
                                    value={term}
                                    onChange={(e) => setTerm(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-brand-teal [&::-webkit-slider-thumb]:rounded-full"
                                    id="slTerm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Result Card */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-12 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <motion.div
                            key={balance + rate + term}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="text-5xl lg:text-7xl font-bold tracking-tighter text-brand-teal mb-4"
                        >
                            {formatCurrency(calculateSavings())}
                        </motion.div>
                        <p className="text-lg text-base-beige/80 mb-6">
                            Estimated total saving<br />if you refinance today
                        </p>
                        <p className="text-xs text-white/60 uppercase tracking-widest font-mono text-center">
                            Based on avg 2% rate reduction · illustrative
                        </p>

                        <a
                            href="#waitlist"
                            className="mt-10 px-8 py-4 w-full text-center bg-transparent text-base-beige border border-white/10 hover:bg-white hover:text-base-dark rounded-full font-bold transition-all duration-300"
                        >
                            Get my real offer →
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
