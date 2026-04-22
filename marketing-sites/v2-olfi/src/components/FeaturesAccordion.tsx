'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const features = [
    {
        id: 1,
        title: 'Aggregate Your Liabilities',
        content: 'Manually add your loans or sync your UAE bank accounts securely. We pull your personal loans and credit cards into one unified dashboard.',
        image: '/assets/myloans.PNG',
    },
    {
        id: 2,
        title: 'Bias-Free AI Recommendations',
        content: 'Our intelligence engine scans multiple UAE banks to find the most optimal refinancing option tailored to you—completely free from external bias.',
        image: '/assets/products.PNG',
    },
    {
        id: 3,
        title: 'Track Your Application Pipeline',
        content: 'Once you accept the best offer, watch your application progress through each banking stage in real-time until final settlement.',
        image: '/assets/application_submitted.PNG',
    },
];

export function FeaturesAccordion() {
    const [activeFeature, setActiveFeature] = useState(features[0]);

    return (
        <section id="features" className="py-32 bg-base-beige text-base-dark border-t border-base-dark/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="flex flex-col gap-12">
                        <h2 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
                            Simplified <br />
                            <span className="text-brand-teal">Streamlined</span>
                        </h2>

                        <div className="flex flex-col gap-4">
                            {features.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveFeature(feature)}
                                    className={`text-left p-6 rounded-2xl transition-all duration-300 border ${activeFeature.id === feature.id
                                            ? 'bg-white border-brand-teal/20 shadow-xl shadow-brand-teal/5 lg:-translate-y-1'
                                            : 'bg-transparent border-transparent hover:bg-white/50'
                                        }`}
                                >
                                    <h3 className={`text-2xl font-bold tracking-tight mb-2 ${activeFeature.id === feature.id ? 'text-brand-teal' : 'text-base-dark/70'
                                        }`}>
                                        {feature.title}
                                    </h3>
                                    <AnimatePresence>
                                        {activeFeature.id === feature.id && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="text-lg text-base-dark/70 leading-relaxed overflow-hidden"
                                            >
                                                {feature.content}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative w-full max-w-[320px] mx-auto hidden lg:block rounded-[48px] border-[8px] border-black bg-black shadow-2xl overflow-hidden aspect-[9/19.5]">
                        {/* Notch */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-20" />
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                                className="relative w-full h-full bg-base-dark"
                            >
                                <Image
                                    src={activeFeature.image}
                                    alt={activeFeature.title}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
}
