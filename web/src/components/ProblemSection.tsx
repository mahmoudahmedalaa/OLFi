'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { AlertCircle, FileX, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
        const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(normalizedX);
        y.set(normalizedY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 800,
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function ProblemSection() {
    const t = useTranslations('problem');

    const problemsList = [
        {
            title: t('p1_title'),
            desc: t('p1_desc'),
            icon: AlertCircle
        },
        {
            title: t('p2_title'),
            desc: t('p2_desc'),
            icon: FileX
        },
        {
            title: t('p3_title'),
            desc: t('p3_desc'),
            icon: ShieldX
        }
    ];

    return (
        <section className="py-24 bg-base-beige border-t border-base-dark/5 relative">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm mb-4 block">{t('label')}</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-base-dark relative inline-block">
                        {t('headline')}
                        {/* Animated underline shimmer */}
                        <motion.div
                            className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-transparent via-brand-teal to-transparent"
                            initial={{ width: 0 }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        />
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {problemsList.map((problem, idx) => {
                        const Icon = problem.icon;
                        return (
                            <TiltCard
                                key={idx}
                                className="min-h-[260px] bg-white/55 border border-base-dark/5 rounded-2xl p-8 hover:border-brand-teal/25 hover:shadow-xl hover:shadow-base-dark/[0.035] transition-all duration-300 relative overflow-hidden group cursor-default"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-base-dark/[0.03] rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                                <motion.div
                                    className="w-12 h-12 rounded-xl bg-white border border-base-dark/5 flex items-center justify-center text-base-dark mb-6 relative z-10 shadow-sm"
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <Icon className="w-6 h-6" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-base-dark mb-3 relative z-10">{problem.title}</h3>
                                <p className="text-base-dark/60 leading-relaxed relative z-10">
                                    {problem.desc}
                                </p>
                            </TiltCard>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
