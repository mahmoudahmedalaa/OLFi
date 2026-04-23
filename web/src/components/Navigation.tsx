'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Navigation() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-dark/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-base-beige">
                    <Image src="/assets/olfi-logo.jpeg" alt="OLFi Logo" width={32} height={32} className="rounded-md" />
                    OLFi
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-base-beige/70">
                    <Link href="#features" className="hover:text-base-beige transition-colors">Features</Link>
                    <Link href="#how-it-works" className="hover:text-base-beige transition-colors">How it works</Link>
                    <Link href="#compare" className="hover:text-base-beige transition-colors">Compare</Link>
                    <Link href="#faq" className="hover:text-base-beige transition-colors">FAQ</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        href="https://apps.apple.com/app/"
                        target="_blank"
                        className="bg-brand-teal hover:bg-brand-teal/90 text-base-beige text-sm font-medium px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(13,148,136,0.3)] flex items-center gap-2"
                    >
                        Download App
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
