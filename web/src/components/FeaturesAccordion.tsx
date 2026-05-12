'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function FeaturesAccordion() {
    const t = useTranslations('features');

    const featuresList = [
        {
            id: 1,
            num: '01',
            title: t('step1Title'),
            content: t('step1Desc'),
            image: '/assets/addloans.PNG',
        },
        {
            id: 2,
            num: '02',
            title: t('step2Title'),
            content: t('step2Desc'),
            image: '/assets/products.PNG',
        },
        {
            id: 3,
            num: '03',
            title: t('step3Title'),
            content: t('step3Desc'),
            image: '/assets/application_submitted.PNG',
        },
        {
            id: 4,
            num: '04',
            title: t('step4Title'),
            content: t('step4Desc'),
            image: '/assets/myloans.PNG',
        },
    ];

    const [activeFeature, setActiveFeature] = useState(featuresList[0]);

    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    return (
        <section ref={sectionRef} id="features" className="py-24 bg-base-beige border-t border-base-dark/5 text-base-dark relative">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Renalta-style Subtle Box Wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                    className="border border-base-dark/10 rounded-3xl overflow-hidden bg-base-beige grid lg:grid-cols-2 shadow-sm"
                >

                    {/* Left Column: Text & Tabs */}
                    <div className="p-8 lg:p-16 border-b lg:border-b-0 lg:border-r border-base-dark/10 flex flex-col justify-center gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <h2 className="text-4xl lg:text-5xl font-bold tracking-tighter leading-tight mb-4">
                                {t('headline')}
                            </h2>
                            <p className="text-lg text-base-dark/60 max-w-md">
                                {t('subheadline')}
                            </p>
                        </motion.div>

                        <div className="flex flex-col gap-3">
                            {featuresList.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveFeature(feature)}
                                    className={`text-left p-5 transition-all duration-300 rounded-xl border flex flex-col gap-1 relative overflow-hidden ${activeFeature.id === feature.id
                                        ? 'bg-white border-base-dark/10 shadow-sm'
                                        : 'bg-transparent border-transparent hover:border-base-dark/5'
                                        }`}
                                >
                                    {/* Active indicator bar */}
                                    {activeFeature.id === feature.id && (
                                        <motion.div
                                            layoutId="activeTabIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand-teal rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeFeature.id === feature.id ? 'bg-brand-teal text-white' : 'bg-base-dark/5 text-base-dark/60'}`}>
                                            {feature.num}
                                        </div>
                                        <h3 className={`text-xl font-bold tracking-tight ${activeFeature.id === feature.id ? 'text-base-dark' : 'text-base-dark/70'}`}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <AnimatePresence>
                                        {activeFeature.id === feature.id && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-base-dark/60 leading-relaxed overflow-hidden pl-11 pt-2"
                                            >
                                                {feature.content}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visual Mockup */}
                    <div className="relative p-8 lg:p-16 bg-[#e9e6d9] flex items-center justify-center overflow-hidden min-h-[600px]">
                        {/* Wavy subtle background line pattern */}
                        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "repeating-linear-gradient(45deg, #011819 0px, #011819 1px, transparent 1px, transparent 20px)" }} />

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative w-full max-w-[300px] mx-auto rounded-[48px] border-[8px] border-[#131313] bg-base-dark shadow-xl overflow-hidden aspect-[9/19.5] z-10"
                        >
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-[#131313] rounded-b-3xl z-20" />
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute inset-0 flex items-center justify-center bg-transparent"
                                >
                                    <Image
                                        src={activeFeature.image}
                                        alt={activeFeature.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}
