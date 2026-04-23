'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    {
        q: "How does the AI recommendation work?",
        a: "Our algorithm assesses your total outstanding liabilities, calculates your Debt Burden Ratio (DBR), and cross-references it with live banking products to find optimizations. All without any human bias."
    },
    {
        q: "Is OLFi a bank?",
        a: "No, OLFi is an aggregator and intelligent orchestration platform. We map the market to find you the best refinance opportunities, but the actual loans are provided by UAE Central Bank regulated institutions."
    },
    {
        q: "Do you offer Islamic solutions?",
        a: "Yes. All our products are vetted to be fully Sharia-compliant, meaning we only match you with recognized Islamic finance options."
    },
    {
        q: "Does using OLFi impact my credit score?",
        a: "Checking your options on OLFi relies on soft-checks and algorithm estimates. Your AECB score will only undergo a hard-check once you officially submit your finalized application to the chosen bank."
    },
    {
        q: "Are there hidden fees?",
        a: "We do not charge you upfront fees to use the platform. We negotiate directly with the banks, acting as an acquisition partner."
    }
];

export function FAQAccordion() {
    const [open, setOpen] = useState<number | null>(0);

    return (
        <section id="faq" className="py-32 bg-base-dark border-t border-white/5">
            <div className="container mx-auto px-6 max-w-3xl">
                <h2 className="text-5xl font-bold tracking-tighter text-base-beige mb-16 text-center">
                    FAQ
                </h2>

                <div className="flex flex-col gap-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl border transition-colors duration-300 overflow-hidden ${open === idx ? 'bg-white/5 border-brand-teal/30' : 'bg-transparent border-white/10 hover:border-white/20'
                                }`}
                        >
                            <button
                                className="w-full text-left p-6 flex justify-between items-center"
                                onClick={() => setOpen(open === idx ? null : idx)}
                            >
                                <span className="font-medium text-lg text-base-beige pr-8">{faq.q}</span>
                                <span className="text-brand-teal flex-shrink-0">
                                    {open === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {open === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-base-beige/60 text-base leading-relaxed">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
