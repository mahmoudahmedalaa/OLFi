'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export function Navigation() {

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 right-0 z-50 py-6"
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 text-3xl font-bold tracking-tighter text-base-beige">
                    <Image src="/assets/olfi-logo.jpeg" alt="OLFi Logo" width={48} height={48} className="rounded-xl" />
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
                        href="#waitlist"
                        className="bg-base-beige text-base-dark hover:bg-brand-teal hover:text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center gap-2"
                    >
                        Join the waitlist
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
