'use client';

import { BarChart3, Calculator, Link as LinkIcon, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
    {
        icon: LinkIcon,
        title: 'Market Aggregation',
        desc: 'Seamlessly link your existing liabilities. We analyze loans and cards across the UAE banking sector to find tailored alternatives.',
    },
    {
        icon: Calculator,
        title: 'Precision Savings Calculator',
        desc: 'Input your balances and dynamically visualize your lowered DBR (Debt Burden Ratio) and exact monthly savings.',
    },
    {
        icon: BarChart3,
        title: 'Soft Credit Projections',
        desc: 'Understand your credit standing and eligibility without impacting your official AECB score through hard inquiries.',
    },
    {
        icon: PieChart,
        title: 'Financial Health Analytics',
        desc: 'Track your repayment journey with elegant dashboards. See exactly when you\'ll be debt-free under our restructured plans.',
    },
];

export function SecurityGrid() {
    return (
        <section className="py-32 bg-base-dark border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    <div>
                        <h2 className="text-5xl font-bold tracking-tighter text-base-beige mb-6">
                            Empowering your <br />
                            <span className="text-brand-teal">Financial Reality</span>
                        </h2>
                        <p className="text-xl text-base-beige/60">
                            Beyond simple refinancing. OLFi acts as your intelligent co-pilot, delivering the analytics and tools you need to optimize your debt structure.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-brand-teal/30 transition-all cursor-crosshair relative overflow-hidden"
                            >
                                {/* Subtle hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <feature.icon className="w-10 h-10 text-brand-teal mb-6" strokeWidth={1.5} />
                                <h3 className="text-xl font-bold text-base-beige mb-3 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-base-beige/60 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
