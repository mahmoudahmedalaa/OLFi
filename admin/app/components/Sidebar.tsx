'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuGroups = [
    {
        title: 'Dashboards',
        items: [
            { href: '/', label: 'Overview', icon: '📊' },
            { href: '/analytics', label: 'Analytics', icon: '📈' },
        ],
    },
    {
        title: 'Operations',
        items: [
            { href: '/applications', label: 'Applications', icon: '📋' },
            { href: '/documents', label: 'Document Vault', icon: '📂' },
            { href: '/offers', label: 'Manual Offers', icon: '⭐' },
        ],
    },
    {
        title: 'Partners & Products',
        items: [
            { href: '/banks', label: 'Banks', icon: '🏦' },
            { href: '/products', label: 'Products', icon: '📦' },
        ],
    },
    {
        title: 'Users & Notifications',
        items: [
            { href: '/users', label: 'Users', icon: '👥' },
            { href: '/loans', label: 'Loans', icon: '💳' },
            { href: '/notifications', label: 'Notifications', icon: '🔔' },
        ],
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
        menuGroups.reduce((acc, group) => ({ ...acc, [group.title]: true }), {})
    );

    const toggleGroup = (title: string) => {
        setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
                <h1 className="text-xl font-bold text-emerald-400 tracking-tight">
                    BuyOut<span className="text-gray-500 font-normal ml-1 text-sm">Admin</span>
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-6">
                {menuGroups.map((group) => (
                    <div key={group.title}>
                        <button
                            onClick={() => toggleGroup(group.title)}
                            className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2 hover:text-gray-300 transition-colors"
                        >
                            {group.title}
                            <span className="text-[10px]">{openGroups[group.title] ? '▼' : '▶'}</span>
                        </button>

                        {openGroups[group.title] && (
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                                }`}
                                        >
                                            <span className="text-lg opacity-80">{item.icon}</span>
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800 sticky bottom-0 bg-gray-900">
                <p className="text-xs text-gray-500">BuyOut © 2026</p>
            </div>
        </aside>
    );
}
