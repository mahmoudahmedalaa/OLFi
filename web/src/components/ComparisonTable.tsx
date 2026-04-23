'use client';

import { Check, Minus, X, Info } from 'lucide-react';

const compareData = [
    {
        feature: 'Regulated Loan Products',
        traditional: true,
        creditors: false,
        olfi: true,
        tooltip: 'OLFi connects you strictly to UAE Central Bank regulated institutions',
    },
    {
        feature: 'Consolidates Multiple Debts',
        traditional: true,
        creditors: true,
        olfi: true,
        tooltip: 'All options allow you to consolidate, but how they source the buyout matters',
    },
    {
        feature: 'Zero Upfront Fees',
        traditional: true,
        creditors: false,
        olfi: true,
        tooltip: 'Banks and OLFi do not charge you upfront consultation fees; private consultants often do',
    },
    {
        feature: 'Physical Branch Access',
        traditional: true,
        creditors: false,
        olfi: false,
        tooltip: 'We operate 100% digitally to save you time and overhead costs associated with physical visits',
    },
    {
        feature: 'Market-Wide Aggregation',
        traditional: false,
        creditors: true,
        olfi: true,
        tooltip: 'We scan the entire UAE banking sector, ensuring you aren\'t limited to just one bank\'s rates',
    },
    {
        feature: 'Bias-Free Recommendations',
        traditional: false,
        creditors: false,
        olfi: true,
        tooltip: 'Unlike staff driven by specific commission quotas, our AI gives you objective, mathematical recommendations',
    },
    {
        feature: 'Instant Soft-Credit Offers',
        traditional: false,
        creditors: false,
        olfi: true,
        tooltip: 'Get pre-qualified offers and analyze your health without immediately hitting your AECB score',
    },
    {
        feature: 'Automated Sharia-Filtering',
        traditional: false,
        creditors: false,
        olfi: true,
        tooltip: 'One click filters the entire market down to strictly Islamic finance structures',
    },
];

export function ComparisonTable() {
    return (
        <section id="compare" className="py-32 bg-base-beige text-base-dark relative">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold tracking-tighter mb-4">
                        The intelligent choice
                    </h2>
                    <p className="text-lg text-base-dark/60 max-w-xl mx-auto">
                        See exactly how a bias-free aggregator gives you the upper hand when refinancing your existing debt
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="w-[45%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider">Feature</th>
                                <th className="w-[18%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider text-center">Traditional Banks</th>
                                <th className="w-[18%] pb-8 font-medium text-base-dark/50 text-sm uppercase tracking-wider text-center">Private Consultants</th>
                                <th className="w-[19%] pb-8 font-bold text-brand-teal text-lg tracking-tight text-center">OLFi AI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-dark/10">
                            {compareData.map((row, idx) => (
                                <tr key={idx} className="group hover:bg-white/50 transition-colors cursor-default">
                                    <td className="py-6 font-semibold text-lg relative">
                                        <span className="flex items-center gap-2 group/tooltip cursor-help relative w-fit">
                                            {row.feature}
                                            <Info className="w-4 h-4 text-base-dark/30 hover:text-base-dark" />

                                            {/* Tooltip */}
                                            <span className="absolute bottom-full left-0 mb-2 w-64 bg-base-dark text-white text-xs p-3 rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-10 shadow-xl pointer-events-none">
                                                {row.tooltip}
                                                <svg className="absolute top-full left-4 w-3 h-3 text-base-dark" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21L0 0h24L12 21z" /></svg>
                                            </span>
                                        </span>
                                    </td>

                                    <td className="py-6 text-center">
                                        {row.traditional ? (
                                            <Check className="w-6 h-6 mx-auto text-base-dark" />
                                        ) : (
                                            <X className="w-6 h-6 mx-auto text-base-dark/20" />
                                        )}
                                    </td>

                                    <td className="py-6 text-center">
                                        {row.creditors ? (
                                            <Check className="w-6 h-6 mx-auto text-base-dark" />
                                        ) : (
                                            <X className="w-6 h-6 mx-auto text-base-dark/20" />
                                        )}
                                    </td>

                                    <td className="py-6 text-center bg-brand-teal/5 relative">
                                        {idx === 0 && <div className="absolute inset-x-0 top-0 h-px bg-brand-teal/20" />}
                                        {idx === compareData.length - 1 && <div className="absolute inset-x-0 bottom-0 h-px bg-brand-teal/20" />}

                                        {row.olfi ? (
                                            <Check className="w-6 h-6 mx-auto text-brand-teal" strokeWidth={3} />
                                        ) : (
                                            <Minus className="w-6 h-6 mx-auto text-brand-teal/20" />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
