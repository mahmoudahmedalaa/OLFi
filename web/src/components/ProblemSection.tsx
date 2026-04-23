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
        <section className="py-24 bg-base-dark border-t border-white/5 relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm mb-4 block">The Current State</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-base-beige">
                        The debt trap in the UAE
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
                                className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 hover:border-red-500/40 transition-all duration-300 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 relative z-10">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-base-beige mb-3 relative z-10">{problem.title}</h3>
                                <p className="text-base-beige/60 leading-relaxed relative z-10">
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
