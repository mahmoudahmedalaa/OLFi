'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const stagger = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.18, delayChildren: 0.3 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-base-dark">
            {/* Animated Ambient Orbs */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-brand-teal blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#00ffd1] blur-[150px]"
                />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="relative flex flex-col gap-8 max-w-xl border border-white/10 rounded-3xl p-8 sm:p-12"
                    >

                        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-teal/20 bg-brand-teal/5 hover:bg-brand-teal/10 transition-all cursor-default">
                                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                                <span className="text-[11px] font-bold tracking-wider text-white uppercase">Early Access · UAE</span>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-all cursor-default text-amber-500">
                                <span className="text-[11px] font-bold tracking-wider uppercase text-white">Sharia Compliant ✦</span>
                            </div>
                        </motion.div>

                        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-base-beige">
                            Lower your <br className="hidden sm:block" /> loan payments <br />
                            <em className="text-brand-teal italic font-medium">Refinance smarter</em>
                        </motion.h1>

                        <motion.p variants={fadeUp} className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                            OLFi aggregates Islamic finance loan offers into a bias-free AI engine that constructs the perfect refinancing recommendation for you, delivering transparency and financial freedom.
                        </motion.p>

                        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <Link
                                href="#waitlist"
                                className="w-full sm:w-auto bg-transparent text-base-beige border border-white/10 hover:bg-white hover:text-base-dark text-lg font-medium px-8 py-3.5 rounded-lg transition-all duration-300 text-center flex items-center justify-center"
                            >
                                Join the waitlist
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
                        className="relative lg:ml-auto w-full max-w-[320px] mx-auto hidden lg:block"
                    >
                        {/* Phone Frame Mockup container with gentle float */}
                        <motion.div
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="relative aspect-[9/19.5] w-full rounded-[48px] border-[8px] border-[#131313] bg-base-dark shadow-2xl overflow-hidden"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#131313] rounded-b-3xl z-20" />

                            <Image
                                src="/assets/Dashboard.PNG"
                                alt="OLFi Dashboard App Interface"
                                fill
                                className="object-cover z-10"
                                priority
                            />

                            {/* Screen reflection */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-20 pointer-events-none" />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
