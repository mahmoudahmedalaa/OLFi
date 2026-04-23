'use client';

import { motion } from 'framer-motion';
import { AlertCircle, FileX, ShieldX } from 'lucide-react';

const problems = [
    {
        title: 'Trapped in high-profit rates',
        desc: 'Overpaying monthly because restructuring is too murky to navigate manually.',
        icon: AlertCircle
    },
    {
        title: 'Paperwork paralyses',
        desc: 'Endless physical visits, stamps, and manual verifications across multiple branches.',
        icon: FileX
    },
    {
        title: 'Opaque Halal options',
        desc: 'True Sharia-compliant choices are buried deep in bank portfolios or require tedious screening.',
        icon: ShieldX
    }
];

export function ProblemSection() {
    return (
        <section className="py-24 bg-base-beige border-t border-base-dark/5 relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm mb-4 block">The Current State</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-base-dark">
                        The debt trap
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((problem, idx) => {
                        const Icon = problem.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="bg-white/50 border border-base-dark/5 rounded-2xl p-8 hover:border-brand-teal/20 hover:shadow-xl hover:shadow-base-dark/[0.02] transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-base-dark/[0.03] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                                <div className="w-12 h-12 rounded-xl bg-white border border-base-dark/5 flex items-center justify-center text-base-dark mb-6 relative z-10 shadow-sm">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-base-dark mb-3 relative z-10">{problem.title}</h3>
                                <p className="text-base-dark/60 leading-relaxed relative z-10">
                                    {problem.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
