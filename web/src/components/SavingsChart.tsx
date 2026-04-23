'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

/**
 * Calculates total amount paid over the loan lifetime.
 * Returns an array of {month, remaining} for charting.
 */
function simulateLoan(principal: number, annualRate: number, monthlyPayment: number, maxMonths: number) {
    const monthlyRate = annualRate / 12;
    let balance = principal;
    const data: { month: number; balance: number }[] = [{ month: 0, balance: principal }];
    let totalPaid = 0;

    for (let m = 1; m <= maxMonths; m++) {
        const interest = balance * monthlyRate;
        const payment = Math.min(monthlyPayment, balance + interest);
        balance = Math.max(0, balance + interest - payment);
        totalPaid += payment;
        data.push({ month: m, balance });
        if (balance <= 0) break;
    }

    return { data, totalPaid, monthsToPayoff: data.length - 1 };
}

function toSvgPath(data: { month: number; balance: number }[], maxMonths: number, maxBalance: number, viewW: number, viewH: number, padY: number) {
    return data
        .map((d, i) => {
            const x = (d.month / maxMonths) * viewW;
            const y = padY + ((1 - d.balance / maxBalance) * (viewH - padY * 2));
            return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
        })
        .join(' ');
}

function toAreaPath(data: { month: number; balance: number }[], maxMonths: number, maxBalance: number, viewW: number, viewH: number, padY: number) {
    const line = toSvgPath(data, maxMonths, maxBalance, viewW, viewH, padY);
    const lastX = (data[data.length - 1].month / maxMonths) * viewW;
    const bottomY = viewH - padY;
    return `${line} L${lastX.toFixed(1)} ${bottomY.toFixed(1)} L0 ${bottomY.toFixed(1)} Z`;
}

export function SavingsChart() {
    const [debt, setDebt] = useState(250000);
    const [payment, setPayment] = useState(5000);
    const [animProgress, setAnimProgress] = useState(0);
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-50px' });

    useEffect(() => {
        if (isInView) {
            const start = Date.now();
            const duration = 1600;
            const tick = () => {
                const t = Math.min((Date.now() - start) / duration, 1);
                setAnimProgress(1 - Math.pow(1 - t, 3)); // ease-out cubic
                if (t < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }
    }, [isInView]);

    const CONV_RATE = 0.12;   // 12% conventional
    const OLFI_RATE = 0.045;  // 4.5% refinanced
    const MAX_MONTHS = 120;   // 10 year window

    const { conventional, refinanced, interestSaved, yearsSaved } = useMemo(() => {
        const conv = simulateLoan(debt, CONV_RATE, payment, MAX_MONTHS);
        const refi = simulateLoan(debt, OLFI_RATE, payment, MAX_MONTHS);
        const saved = conv.totalPaid - refi.totalPaid;
        const yrsSaved = Math.max(0, (conv.monthsToPayoff - refi.monthsToPayoff) / 12);
        return {
            conventional: conv,
            refinanced: refi,
            interestSaved: Math.max(0, saved),
            yearsSaved: yrsSaved,
        };
    }, [debt, payment]);

    const viewW = 100;
    const viewH = 60;
    const padY = 4;
    const maxBal = debt;
    const maxM = Math.max(conventional.monthsToPayoff, refinanced.monthsToPayoff, 12);

    const convPath = toSvgPath(conventional.data, maxM, maxBal, viewW, viewH, padY);
    const refiPath = toSvgPath(refinanced.data, maxM, maxBal, viewW, viewH, padY);
    const convArea = toAreaPath(conventional.data, maxM, maxBal, viewW, viewH, padY);
    const refiArea = toAreaPath(refinanced.data, maxM, maxBal, viewW, viewH, padY);

    const clipW = animProgress * viewW;

    const fmtAED = (v: number) => 'AED ' + Math.round(v).toLocaleString('en-US');

    return (
        <section ref={sectionRef} className="relative bg-base-dark overflow-hidden pt-28 pb-0">
            {/* Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="max-w-[1200px] mx-auto px-4 flex flex-col gap-2 pb-12 sm:pb-16">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent mb-4" />

                <div className="flex flex-col lg:flex-row gap-0 relative min-h-[520px] lg:min-h-[560px]">
                    {/* Left line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />
                    <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.06] hidden lg:block" />

                    {/* LEFT */}
                    <div className="flex-1 flex flex-col justify-center gap-6 px-4 sm:px-8 lg:px-12 py-8 lg:py-0">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/5 w-fit">
                            <span className="text-brand-teal text-sm">🏛️</span>
                            <span className="text-xs font-medium tracking-wide text-brand-teal/90 uppercase">
                                UAE Islamic Refinancing
                            </span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl font-medium text-white leading-[1.1] tracking-tight">
                            Lower Rates.
                            <br />
                            <span className="text-white/50">Zero Bias.</span>
                        </h1>

                        <p className="text-lg sm:text-xl font-light text-white/50 max-w-md">
                            See how much you save by refinancing through Sharia-compliant products (Murābaḥa, Ijāra, Tawarruq) powered by unbiased AI.
                        </p>

                        <div className="flex items-center gap-4 pt-2">
                            <Link
                                href="https://apps.apple.com/app/"
                                target="_blank"
                                className="transition duration-300 bg-brand-teal hover:bg-white text-white hover:text-base-dark font-medium px-6 py-3.5 rounded-lg text-sm"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden lg:block w-px bg-white/[0.08] mx-3" />

                    {/* RIGHT Chart */}
                    <div className="flex-1 mt-4 lg:mt-0">
                        <div className="relative w-full h-full min-h-[400px] sm:min-h-[500px]">
                            <div className="absolute inset-0 border border-white/[0.06] rounded-xl overflow-hidden">
                                {/* Chart legend */}
                                <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-0.5 bg-white/40 rounded-full" />
                                        <span className="text-white/40">Conventional (12%)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-0.5 bg-brand-teal rounded-full" />
                                        <span className="text-white/60">With OLFi (4.5%)</span>
                                    </div>
                                </div>

                                {/* Y axis label */}
                                <div className="absolute top-3 left-4 z-20">
                                    <span className="text-[10px] uppercase tracking-wider text-white/25">Remaining Debt</span>
                                </div>

                                {/* SVG Chart */}
                                <div className="relative h-[calc(100%-100px)] mx-0 mt-8">
                                    <svg
                                        viewBox={`0 0 ${viewW} ${viewH}`}
                                        preserveAspectRatio="none"
                                        className="w-full h-full"
                                        style={{ display: 'block' }}
                                    >
                                        <defs>
                                            <linearGradient id="convGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="white" stopOpacity="0.06" />
                                                <stop offset="100%" stopColor="white" stopOpacity="0.01" />
                                            </linearGradient>
                                            <linearGradient id="refiGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="rgb(13,148,136)" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="rgb(13,148,136)" stopOpacity="0.02" />
                                            </linearGradient>
                                            <clipPath id="reveal"><rect x="0" y="0" width={clipW} height={viewH} /></clipPath>
                                        </defs>

                                        {/* Horizontal grid lines */}
                                        {[0.25, 0.5, 0.75].map((frac) => (
                                            <line
                                                key={frac}
                                                x1="0" x2={viewW}
                                                y1={padY + frac * (viewH - padY * 2)}
                                                y2={padY + frac * (viewH - padY * 2)}
                                                stroke="white" strokeOpacity="0.04" strokeWidth="0.2"
                                            />
                                        ))}

                                        {/* Conventional area + line (gray) */}
                                        <path d={convArea} fill="url(#convGrad)" clipPath="url(#reveal)" />
                                        <path
                                            d={convPath} fill="none"
                                            stroke="rgba(255,255,255,0.25)" strokeWidth="0.4"
                                            vectorEffect="non-scaling-stroke" clipPath="url(#reveal)"
                                            strokeDasharray="4 3"
                                        />

                                        {/* OLFi area + line (teal) */}
                                        <path d={refiArea} fill="url(#refiGrad)" clipPath="url(#reveal)" />
                                        <path
                                            d={refiPath} fill="none"
                                            stroke="rgb(13,148,136)" strokeWidth="0.5"
                                            vectorEffect="non-scaling-stroke" clipPath="url(#reveal)"
                                            style={{ filter: 'drop-shadow(0 0 3px rgba(13,148,136,0.5))' }}
                                        />
                                    </svg>
                                </div>

                                {/* X axis labels */}
                                <div className="absolute bottom-[100px] left-0 right-0 flex justify-between px-4 text-[9px] text-white/20">
                                    <span>Now</span>
                                    <span>{Math.round(maxM / 24)}yr</span>
                                    <span>{Math.round(maxM / 12)}yr</span>
                                </div>

                                {/* Input row */}
                                <div className="absolute bottom-0 left-0 right-0 flex gap-2 text-white px-4 py-3 bg-base-dark/80 backdrop-blur-sm border-t border-white/[0.06]">
                                    <div className="flex-[1.2] relative">
                                        <span className="absolute top-2 left-3 text-[10px] text-white/40 uppercase tracking-wider">
                                            Total Debt
                                        </span>
                                        <span className="absolute left-3 bottom-2.5 text-white/50 text-sm pointer-events-none">AED</span>
                                        <input
                                            type="number" min={0} step={10000} value={debt}
                                            onChange={(e) => setDebt(Number(e.target.value) || 0)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-11 pr-2 pb-2 pt-6 outline-none text-sm text-white focus:border-brand-teal/40 transition-colors"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <span className="absolute top-2 left-3 text-[10px] text-white/40 uppercase tracking-wider">
                                            Monthly Payment
                                        </span>
                                        <span className="absolute left-3 bottom-2.5 text-white/50 text-sm pointer-events-none">AED</span>
                                        <input
                                            type="number" min={0} step={500} value={payment}
                                            onChange={(e) => setPayment(Number(e.target.value) || 0)}
                                            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-11 pr-2 pb-2 pt-6 outline-none text-sm text-white focus:border-brand-teal/40 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Floating projection card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="absolute top-5 left-5 z-20"
                            >
                                <div className="bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-xl overflow-hidden" style={{ minWidth: '210px' }}>
                                    <div className="flex flex-col gap-1 p-4">
                                        <span className="text-white/50 text-xs">Interest You Save</span>
                                        <span className="text-white text-xl font-semibold">
                                            {fmtAED(interestSaved)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-brand-teal/10 px-4 py-2.5 border-t border-white/[0.06]">
                                        <span className="text-brand-teal text-sm font-semibold">
                                            {yearsSaved.toFixed(1)} years
                                        </span>
                                        <span className="text-white/40 text-xs">faster payoff</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent mt-4" />
            </div>
        </section>
    );
}
