'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

const brands = [
    { name: 'Tabby', accent: '#3CFFD0', short: 'TB' },
    { name: 'Tamara', accent: '#FF6B9D', short: 'TM' },
    { name: 'DEWA', accent: '#00A4EF', short: 'DW' },
    { name: 'Etisalat', accent: '#FFD100', short: 'ET' },
    { name: 'Careem', accent: '#4CAF50', short: 'CR' },
    { name: 'Noon', accent: '#FFE134', short: 'NN' },
    { name: 'ADCB', accent: '#C6A962', short: 'AD' },
    { name: 'Emirates NBD', accent: '#E8584F', short: 'EN' },
    { name: 'Wio', accent: '#7B61FF', short: 'WI' },
    { name: 'Talabat', accent: '#FF5A00', short: 'TL' },
];

// Compute orbital positions in a circle around center
function getOrbitalStyle(index: number, total: number, radius: number) {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
        left: `calc(50% + ${x}px - 40px)`,
        top: `calc(50% + ${y}px - 20px)`,
    };
}

// Per-chip floating animation — each chip gets a unique organic drift
function getChipAnimation(index: number) {
    const patterns = [
        { y: [-6, 10, -6], x: [0, 8, 0], rotate: [-2, 2, -2] },
        { y: [0, 14, 0], x: [0, -10, 0], rotate: [3, -3, 3] },
        { y: [0, -12, 0], x: [5, -5, 5], scale: [1, 1.04, 1] },
        { y: [8, -6, 8], x: [-6, 6, -6], rotate: [-1, 1, -1] },
        { y: [-4, 8, -4], x: [0, -8, 0], rotate: [2, -2, 2] },
        { y: [6, -8, 6], x: [4, -4, 4], scale: [1, 1.03, 1] },
        { y: [0, 10, 0], x: [-8, 0, -8], rotate: [-3, 3, -3] },
        { y: [-8, 6, -8], x: [6, 0, 6], rotate: [1, -1, 1] },
        { y: [4, -10, 4], x: [0, 6, 0], scale: [1, 1.05, 1] },
        { y: [-6, 12, -6], x: [-4, 4, -4], rotate: [2, -2, 2] },
    ];
    return patterns[index % patterns.length];
}

export function OlfiScore() {
    const t = useTranslations('olfiScore');

    // Responsive radii: tighter on mobile, wider on large screens
    const orbitRadiusDesktop = 220;
    const orbitRadiusMobile = 160;

    return (
        <section className="py-24 bg-base-dark border-t border-white/5 text-base-beige relative font-sans overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-teal/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#1e293b]/20 blur-[150px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid lg:grid-cols-2 lg:gap-0 items-center border border-white/10 rounded-[40px] bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl relative">

                    {/* Wavy subtle background grid pattern inside card */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                    {/* Left Column: Text & Context */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center gap-8 relative z-20">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-block px-4 py-1.5 mb-8 rounded-full border border-brand-teal/20 text-xs font-bold tracking-widest uppercase bg-brand-teal/5 text-[#4FD1C5] shadow-[0_0_15px_rgba(0,229,255,0.15)]"
                            >
                                {t('label')}
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl lg:text-6xl font-bold tracking-tighter leading-[1.1] mb-6"
                            >
                                {t('headline')}
                            </motion.h2>

                            <motion.ul
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="space-y-4 text-white leading-relaxed font-medium mb-4"
                            >
                                {['bullet1', 'bullet2', 'bullet3', 'bullet4'].map((bullet, idx) => (
                                    <li key={idx} className="flex gap-3">
                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-teal shrink-0 shadow-[0_0_8px_#00e5ff]" />
                                        <span>{t(bullet as any)}</span>
                                    </li>
                                ))}
                            </motion.ul>
                            <p className="text-xs text-base-beige/40 italic mt-6">{t('disclaimer')}</p>
                        </div>

                        {/* Partner Footer inside left column */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="pt-6 mt-2 border-t border-white/10"
                        >
                            <p className="text-sm font-medium text-base-beige/60 tracking-tight">
                                {t('partnerLabel')}
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column: Floating Data Ecosystem */}
                    <div className="relative p-8 lg:p-0 h-[500px] lg:h-full flex items-center justify-center overflow-visible lg:overflow-hidden lg:min-h-[650px] border-l border-white/5 bg-gradient-to-br from-black/20 to-transparent">

                        {/* Central Hub: OLFi Score */}
                        <motion.div
                            className="relative z-20 w-56 h-56 rounded-full border border-brand-teal/30 bg-base-dark shadow-[0_0_60px_rgba(0,229,255,0.15)] flex flex-col items-center justify-center backdrop-blur-md"
                            animate={{ y: [-12, 12, -12] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            {/* Inner glowing core */}
                            <div className="absolute inset-0 rounded-full bg-brand-teal/10 blur-xl" />
                            <div className="absolute inset-3 rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center justify-center shadow-inner pt-2">
                                <Image src="/assets/olfi-logo.png" alt="OLFi" width={80} height={32} className="w-auto h-8 mb-2 opacity-90 brightness-150" />
                                <span className="relative text-3xl font-serif italic tracking-tight bg-gradient-to-br from-[#E2F2EE] via-white to-[#8A9C98] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)] text-center leading-tight">
                                    {t('olfiScoreText')}
                                </span>
                            </div>

                            {/* Rotating Inner Ring */}
                            <motion.div
                                className="absolute -inset-8 rounded-full border border-brand-teal/15 border-t-brand-teal/50"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            />
                            {/* Rotating Outer Ring */}
                            <motion.div
                                className="absolute -inset-16 rounded-full border border-white/5 border-b-white/20"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

                        {/* Orbiting Glassmorphic Brand Chips */}
                        {brands.map((brand, i) => {
                            const desktopPos = getOrbitalStyle(i, brands.length, orbitRadiusDesktop);
                            const mobilePos = getOrbitalStyle(i, brands.length, orbitRadiusMobile);
                            const chipAnim = getChipAnimation(i);

                            return (
                                <motion.div
                                    key={brand.name}
                                    className="absolute z-30 hidden lg:flex"
                                    style={desktopPos}
                                    animate={chipAnim}
                                    transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                                >
                                    <div
                                        className="relative px-4 py-2 rounded-full bg-white/[0.06] border backdrop-blur-2xl flex items-center gap-2.5 cursor-default group transition-all duration-300 hover:bg-white/[0.12]"
                                        style={{
                                            borderColor: `${brand.accent}25`,
                                            boxShadow: `0 0 20px ${brand.accent}10, inset 0 1px 0 rgba(255,255,255,0.06)`,
                                        }}
                                    >
                                        {/* Accent dot */}
                                        <div
                                            className="w-2 h-2 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: brand.accent,
                                                boxShadow: `0 0 8px ${brand.accent}80`,
                                            }}
                                        />
                                        {/* Brand name */}
                                        <span
                                            className="text-[11px] font-mono font-bold tracking-[0.15em] uppercase whitespace-nowrap"
                                            style={{ color: brand.accent }}
                                        >
                                            {brand.name}
                                        </span>
                                        {/* Subtle hover glow */}
                                        <div
                                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                                            style={{ boxShadow: `0 0 30px ${brand.accent}20` }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Mobile: Show brand chips in a compact arranged layout */}
                        {brands.map((brand, i) => {
                            const mobilePos = getOrbitalStyle(i, brands.length, orbitRadiusMobile);
                            const chipAnim = getChipAnimation(i);

                            return (
                                <motion.div
                                    key={`m-${brand.name}`}
                                    className="absolute z-30 flex lg:hidden"
                                    style={mobilePos}
                                    animate={chipAnim}
                                    transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                                >
                                    <div
                                        className="relative px-2.5 py-1.5 rounded-full bg-white/[0.06] border backdrop-blur-2xl flex items-center gap-1.5"
                                        style={{
                                            borderColor: `${brand.accent}25`,
                                            boxShadow: `0 0 12px ${brand.accent}10, inset 0 1px 0 rgba(255,255,255,0.06)`,
                                        }}
                                    >
                                        <div
                                            className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: brand.accent,
                                                boxShadow: `0 0 6px ${brand.accent}80`,
                                            }}
                                        />
                                        <span
                                            className="text-[9px] font-mono font-bold tracking-[0.12em] uppercase whitespace-nowrap"
                                            style={{ color: brand.accent }}
                                        >
                                            {brand.short}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Connecting Particles (Simulation of data flow) */}
                        <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none">
                            <motion.path
                                d="M -50 150 Q 150 250 350 150 Q 550 50 750 150"
                                stroke="#00e5ff"
                                strokeWidth="2.5"
                                fill="none"
                                strokeDasharray="5 15"
                                animate={{ strokeDashoffset: [0, -200] }}
                                transition={{ duration: 6, ease: "linear", repeat: Infinity }}
                            />
                            <motion.path
                                d="M 750 400 Q 550 250 350 350 Q 150 450 -50 350"
                                stroke="white"
                                strokeWidth="1"
                                fill="none"
                                strokeDasharray="3 12"
                                animate={{ strokeDashoffset: [200, 0] }}
                                transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                            />
                        </svg>
                    </div>

                </div>
            </div>

        </section>
    );
}
