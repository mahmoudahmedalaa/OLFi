'use client';

import { motion } from 'framer-motion';

export function IslamicFinanceQA() {
    return (
        <section className="py-24 bg-base-dark relative border-t border-white/5" id="islamic-qa">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="bg-base-dark border border-brand-teal/20 rounded-3xl p-8 lg:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(13,148,136,0.1)]">
                    {/* Background glows */}
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-teal/10 blur-[100px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-teal/5 blur-[100px] rounded-full pointer-events-none" />

                    <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        {/* Text Content */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-teal/20 bg-brand-teal/10 w-fit mb-6 text-brand-teal">
                                <span className="text-xs font-bold tracking-wide uppercase">Islamic Finance Standard</span>
                            </div>
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter text-base-beige leading-tight mb-6 mt-4">
                                Riba-free <br />
                                By design
                            </h2>
                            <p className="text-lg text-base-beige/60 leading-relaxed mb-8">
                                Our compliance engine pre-filters every refinancing option before it reaches you. Only products structured under recognized Islamic finance frameworks are surfaced. Never exceptions, never manual toggles.
                            </p>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-4 mt-2"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full border-2 border-brand-teal/30 animate-ping" style={{ animationDuration: '3s' }} />
                                    <div className="w-16 h-16 rounded-full bg-brand-teal/10 border border-brand-teal/30 flex items-center justify-center backdrop-blur-sm">
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

                        {/* Interactive Match UI */}
                        <div className="flex flex-col gap-6">
                            {/* User Question */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md w-full"
                            >
                                <div className="text-xs font-mono text-base-beige/40 tracking-widest uppercase mb-3">You asked</div>
                                <div className="text-base text-base-beige/80 italic">
                                    "Are there halal buyout options for my ADCB loan?"
                                </div>
                            </motion.div>

                            {/* Response Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-brand-teal/10 border border-brand-teal/20 rounded-2xl p-6 backdrop-blur-md self-start w-full relative overflow-hidden shadow-[0_0_20px_rgba(13,148,136,0.15)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <div className="text-xs font-mono text-brand-teal tracking-widest uppercase mb-6 relative z-10">OLFi found 3 Sharia-compliant offers</div>

                                <div className="space-y-4 relative z-10">
                                    {[
                                        { bank: 'Dubai Islamic Bank', product: 'Islamic Personal Finance', rate: '4.49%' },
                                        { bank: 'Al Hilal Bank', product: 'Halal Cash Loan', rate: '4.85%' },
                                        { bank: 'Abu Dhabi Islamic Bank', product: 'Islamic Refinance', rate: '5.10%' }
                                    ].map((offer, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-brand-teal/10 last:border-0 last:pb-0">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium text-base-beige">{offer.bank}</span>
                                                <span className="text-xs text-base-beige/50">{offer.product}</span>
                                            </div>
                                            <span className="text-brand-teal font-mono font-bold tracking-tight">{offer.rate}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
