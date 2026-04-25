'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useInView } from 'framer-motion';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

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
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section ref={sectionRef} id="how-it-works" className="py-32 bg-base-dark relative border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-5xl font-bold tracking-tighter text-base-beige mb-6">
                        Your path to stability
                    </h2>
                    <p className="text-xl text-base-beige/60 max-w-2xl mx-auto">
                        Three simple steps to restructure your debt and regain control of your financial clarity
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    className="grid md:grid-cols-3 gap-12 relative"
                >
                    {/* Animated connecting line */}
                    <motion.div
                        className="absolute top-12 left-20 right-20 h-px bg-white/10 hidden md:block origin-left"
                        initial={{ scaleX: 0 }}
                        animate={isInView ? { scaleX: 1 } : {}}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    />

                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.num}
                            variants={stepVariants}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <motion.div
                                className="w-24 h-24 bg-base-dark border border-brand-teal/30 rounded-2xl flex items-center justify-center text-3xl font-bold text-brand-teal shadow-[0_0_30px_rgba(13,148,136,0.15)] mb-8 transform -rotate-3"
                                whileHover={{ rotate: 0, scale: 1.08 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                                {step.num}
                            </motion.div>
                            <h3 className="text-2xl font-bold text-base-beige mb-4 tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-base-beige/60 leading-relaxed max-w-xs">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
