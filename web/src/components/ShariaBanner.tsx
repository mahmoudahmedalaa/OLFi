'use client';

import { motion } from 'framer-motion';

export function ShariaBanner() {
    return (
        <section className="bg-brand-teal overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:20px_20px]" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col gap-2 max-w-xl"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <svg className="w-8 h-8 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 0 0-7.743 16.33l-1.964 1.965a1 1 0 0 0 .707 1.707H8c3.923 0 7.394-2.012 9.333-5.068A10 10 0 1 0 12 2Z" />
                        </svg>
                        <span className="text-sm font-bold tracking-widest uppercase opacity-80">Islamic Finance Standard</span>
                    </div>
                    <h2 className="text-4xl font-bold tracking-tight">Fully Sharia-Compliant</h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Our engine features a strict compliance filter granting you access exclusively to Murābaḥa, Ijāra, and Tawarruq portfolios across the UAE.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="hidden md:flex flex-shrink-0 items-center justify-center w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-sm"
                >
                    <span className="text-white font-bold text-center tracking-tighter leading-tight" style={{ fontSize: '1.5rem' }}>
                        100%<br /><span className="text-sm">Verified</span>
                    </span>
                </motion.div>
            </div>
        </section>
    );
}
