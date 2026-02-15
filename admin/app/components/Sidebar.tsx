'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/banks', label: 'Banks', icon: '🏦' },
    { href: '/products', label: 'Products', icon: '📦' },
    { href: '/users', label: 'Users', icon: '👥' },
    { href: '/loans', label: 'Loans', icon: '💳' },
    { href: '/notifications', label: 'Notifications', icon: '🔔' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-xl font-bold text-emerald-400 tracking-tight">
                    BuyOut<span className="text-gray-500 font-normal ml-1 text-sm">Admin</span>
                </h1>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1">
                {nav.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                                }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <p className="text-xs text-gray-500">BuyOut © 2026</p>
            </div>
        </aside>
    );
}
