'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        quote: "I'd been meaning to refinance for two years but always gave up on the paperwork. OLFi did it in 20 minutes. I'm saving AED 1,400 a month.",
        author: "Khalid A.",
        role: "Engineer, Dubai",
        initials: "KA"
    },
    {
        quote: "As a Muslim, finding a halal buyout always felt like guesswork. OLFi showed me three certified Islamic options in seconds. That alone was worth it.",
        author: "Sara A.",
        role: "Teacher, Abu Dhabi",
        initials: "SA"
    },
    {
        quote: "I had three loans from different banks. OLFi consolidated them into one and knocked AED 850 off my monthly payment. Couldn't believe how easy it was.",
        author: "Omar M.",
        role: "Marketing Manager, Sharjah",
        initials: "OM"
    }
];

export function BetaTestersStories() {
    return (
        <section className="py-24 bg-base-dark relative border-t border-white/5">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <span className="text-brand-teal uppercase tracking-[0.2em] font-mono text-sm mb-4 block">Early Community</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-base-beige">
                        Real stories from beta testers
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] hover:border-brand-teal/30 transition-all duration-300"
                        >
                            <div className="flex gap-1 mb-6 text-amber-400">
                                {[...Array(5)].map((_, idx) => (
                                    <Star key={idx} fill="currentColor" size={16} />
                                ))}
                            </div>

                            <p className="text-[15px] leading-relaxed text-base-beige/70 mb-8 italic">
                                "{testimonial.quote}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-10 h-10 rounded-full bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center text-brand-teal font-bold font-mono text-sm">
                                    {testimonial.initials}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-base-beige text-sm">{testimonial.author}</span>
                                    <span className="text-xs text-base-beige/40 uppercase tracking-widest">{testimonial.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
