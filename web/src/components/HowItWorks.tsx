'use client';

import { motion } from 'framer-motion';

const steps = [
    {
        num: '01',
        title: 'Input Your Liabilities',
        desc: 'Securely link your UAE accounts manually or via explicit banking integration to surface your outstanding debts',
    },
    {
        num: '02',
        title: 'Get Unbiased Offers',
        desc: 'Our AI architecture analyzes your portfolio to present the optimal refinancing options from top UAE banks without bias',
    },
    {
        num: '03',
        title: 'Accept and Save',
        desc: 'Choose the best option to quickly consolidate your obligations into one simple payment and improve your credit profile',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-32 bg-base-dark relative border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-24">
                    <h2 className="text-5xl font-bold tracking-tighter text-base-beige mb-6">
                        Your path to stability
                    </h2>
                    <p className="text-xl text-base-beige/60 max-w-2xl mx-auto">
                        Three simple steps to restructure your debt and regain control of your financial clarity
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting line */}
                    <div className="absolute top-12 left-20 right-20 h-px bg-white/10 hidden md:block" />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            transition={{ duration: 0.6, delay: idx * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 bg-base-dark border border-brand-teal/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-teal shadow-[0_0_30px_rgba(13,148,136,0.15)] mb-8 transform -rotate-3 hover:rotate-0 transition-transform">
                                {step.num}
                            </div>
                            <h3 className="text-2xl font-bold text-base-beige mb-4 tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-base-beige/60 leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
