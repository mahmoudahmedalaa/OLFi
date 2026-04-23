'use client';

import { motion } from 'framer-motion';

const pillars = [
    {
        title: 'Cost-Plus Financing',
        desc: 'The bank purchases an asset and sells it to you at a pre-agreed profit margin',
        icon: (
            <svg className="w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 100 7h5a3.5 3.5 0 110 7H6" />
            </svg>
        ),
    },
    {
        title: 'Lease-to-Own',
        desc: 'A structure where you make payments towards full ownership of the underlying asset',
        icon: (
            <svg className="w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        title: 'Commodity Trading',
        desc: 'Monetized commodity transactions that deliver liquidity while maintaining full regulatory compliance',
        icon: (
            <svg className="w-8 h-8 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8" />
                <path d="M12 18V6" />
            </svg>
        ),
    },
];

export function ShariaBanner() {
    return (
        <section className="py-32 bg-base-dark relative overflow-hidden border-t border-white/5">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_50%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* LEFT: Copy + Verification Badge */}
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-teal/80">
                                Islamic Finance Standard
                            </span>
                        </div>

                        <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-tight text-base-beige">
                            Every product is <br />
                            <span className="text-brand-teal">Sharia-verified</span>
                        </h2>

                        <p className="text-xl text-base-beige/50 leading-relaxed max-w-lg">
                            Our compliance engine pre-filters every refinancing option before it reaches you Only products structured under recognized Islamic finance frameworks are surfaced never exceptions, never manual toggles
                        </p>

                        {/* Verification badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-4 mt-2"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center">
                                    <svg className="w-7 h-7 text-brand-teal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <p className="text-base-beige font-semibold text-lg">100% Verified</p>
                                <p className="text-base-beige/40 text-sm">UAE Central Bank compliant structures only</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: Three Compliance Pillars */}
                    <div className="flex flex-col gap-5">
                        {pillars.map((pillar, idx) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="group p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-brand-teal/20 transition-all relative overflow-hidden"
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative z-10 flex items-start gap-5">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {pillar.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-base-beige mb-2 tracking-tight">
                                            {pillar.title}
                                        </h3>
                                        <p className="text-sm text-base-beige/50 leading-relaxed">
                                            {pillar.desc}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
