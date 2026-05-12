'use client';

import { motion } from 'framer-motion';
import { AlertCircle, FileX, ShieldX } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
    hidden: { opacity: 0, y: 22 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
};

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
        <section className="py-28 bg-base-beige border-t border-base-dark/5 relative surface-grid-light">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"
                >
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm block">{t('label')}</span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-base-dark max-w-3xl">
                        {t('headline')}
                    </h2>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid overflow-hidden rounded-2xl border border-base-dark/10 bg-base-dark/10 md:grid-cols-3 md:gap-px"
                >
                    {problemsList.map((problem, idx) => {
                        const Icon = problem.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                className="relative flex min-h-[300px] flex-col justify-between bg-base-beige p-8 md:p-10"
                            >
                                <div>
                                    <div className="mb-10 flex items-center justify-between">
                                        <span className="font-mono text-sm text-base-dark/35">0{idx + 1}</span>
                                        <span className="flex h-12 w-12 items-center justify-center border border-base-dark/10 text-base-dark">
                                            <Icon className="h-5 w-5" />
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-base-dark mb-4 tracking-tight">{problem.title}</h3>
                                </div>
                                <p className="text-base-dark/62 leading-relaxed">
                                    {problem.desc}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
