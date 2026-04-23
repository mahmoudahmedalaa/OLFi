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
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit">
                            <span className="w-2 h-2 rounded-full bg-brand-teal animate-pulse" />
                            <span className="text-xs font-medium tracking-wide text-base-beige/80 uppercase">The Future of Debt Consolidation</span>
                        </div>

                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.05] text-base-beige">
                            Crush your debt <br />
                            <span className="text-brand-teal">Reclaim your life</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-base-beige/60 leading-relaxed max-w-lg">
                            OLFi analyzes your liabilities and uses bias-free AI to construct the perfect refinancing options across UAE banks, giving you transparency and financial freedom.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                            <Link
                                href="https://apps.apple.com/app/"
                                target="_blank"
                                className="w-full sm:w-auto bg-base-beige text-base-dark hover:bg-white text-base font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-3"
                            >
                                <svg viewBox="0 0 384 512" className="w-6 h-6 fill-current">
                                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                                </svg>
                                Download on the App Store
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
