import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-base-dark border-t border-white/5 pt-24 pb-8 overflow-hidden">
            {/* Massive CTA */}
            <div className="container mx-auto px-6 max-w-7xl border-b border-white/10 pb-24">
                <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] leading-[0.9] font-bold tracking-tighter text-base-beige mb-12 text-center uppercase break-words">
                    Ready to <br /> <span className="text-brand-teal italic">consolidate?</span>
                </h2>

                <div className="flex justify-center">
                    <Link
                        href="https://apps.apple.com/app/"
                        target="_blank"
                        className="bg-base-beige text-base-dark hover:bg-white text-lg font-medium px-8 md:px-12 py-4 md:py-5 rounded-lg transition duration-300 flex items-center justify-center gap-3 w-full sm:w-auto shadow-none"
                    >
                        <svg viewBox="0 0 384 512" className="w-8 h-8 fill-current">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                        </svg>
                        Download on the App Store
                    </Link>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="container mx-auto px-6 max-w-7xl pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-2xl font-bold tracking-tighter text-base-beige">
                    OLFi
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-base-beige/60">
                    <Link href="/privacy" className="hover:text-base-beige transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-base-beige transition-colors">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-base-beige transition-colors">Contact</Link>
                </div>

                <div className="text-sm text-base-beige/40 text-center md:text-right">
                    &copy; {new Date().getFullYear()} OLFi Technologies Ltd Dubai, UAE <br className="md:hidden" /> All rights reserved
                </div>
            </div>
        </footer>
    );
}
