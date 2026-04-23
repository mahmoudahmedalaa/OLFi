'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-base-dark">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-teal/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-teal/10 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-8 max-w-xl"
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-teal/40 bg-brand-teal/10 shadow-[0_0_15px_rgba(13,148,136,0.4)] hover:bg-brand-teal/20 transition-all cursor-default">
                                <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse shadow-[0_0_8px_rgba(13,148,136,0.8)]" />
                                <span className="text-[11px] font-bold tracking-wider text-base-beige uppercase">Early Access · UAE</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/40 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:bg-amber-500/20 transition-all cursor-default text-amber-400">
                                <span className="text-[11px] font-bold tracking-wider uppercase">Sharia Compliant ✦</span>
                            </div>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-[6.5rem] font-bold tracking-tighter leading-[1.1] text-base-beige whitespace-nowrap">
                            Lower your <br />
                            loan payments <br />
                            <em className="text-brand-teal italic font-medium">Refinance smarter</em>
                        </h1>

                        <p className="text-lg sm:text-xl text-base-beige/70 leading-relaxed max-w-xl">
                            OLFi aggregates Islamic finance loan offers from across the UAE into a one-stop shop. We soft score you with an OLFi score and use a bias-free AI engine to construct the perfect refinancing recommendation, giving you transparency and financial freedom.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <Link
                                href="#waitlist"
                                className="w-full sm:w-auto bg-brand-teal text-base-dark hover:bg-brand-teal/90 text-base font-bold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 text-center shadow-[0_0_20px_rgba(13,148,136,0.4)]"
                            >
                                Join the waitlist →
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative lg:ml-auto w-full max-w-[320px] mx-auto hidden lg:block"
                    >
                        {/* Phone Frame Mockup container */}
                        <div className="relative aspect-[9/19.5] w-full rounded-[48px] border-[8px] border-[#1A1A1A] bg-black shadow-2xl overflow-hidden shadow-brand-teal/20">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#1A1A1A] rounded-b-3xl z-20" />

                            <Image
                                src="/assets/Dashboard.PNG"
                                alt="OLFi Dashboard App Interface"
                                fill
                                className="object-cover z-10"
                                priority
                            />

                            {/* Screen reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
