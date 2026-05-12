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
        <section ref={sectionRef} id="how-it-works" className="scroll-mt-28 py-32 bg-base-dark relative border-t border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="mb-20 max-w-3xl"
                >
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-base-beige mb-6">
                        Your path to stability
                    </h2>
                    <p className="text-xl text-base-beige/60 max-w-2xl">
                        Three simple steps to restructure your debt and regain control of your financial clarity
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "show" : "hidden"}
                    className="grid overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3 md:gap-px relative"
                >
                    {steps.map((step) => (
                        <motion.div
                            key={step.num}
                            variants={stepVariants}
                            className="relative z-10 flex min-h-[350px] flex-col justify-between bg-base-dark p-8 md:p-10"
                        >
                            <span className="font-mono text-5xl text-brand-teal">
                                {step.num}
                            </span>
                            <div>
                                <h3 className="text-2xl font-bold text-base-beige mb-4 tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-base-beige/60 leading-relaxed max-w-xs">
                                    {step.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
