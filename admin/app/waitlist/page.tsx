'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchWaitlist } from '@/lib/actions';

export default function WaitlistPage() {
    const [waitlist, setWaitlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async () => {
        try {
            const data = await fetchWaitlist();
            setWaitlist(data);
        } catch (e) {
            console.error('Failed to load waitlist:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Waitlist Applications</h1>
                    <p className="text-sm text-gray-400 mt-1">Pre-launch signups for OLFi.</p>
                </div>
                <span className="text-sm px-4 py-2 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg border border-emerald-500/20">{waitlist.length} total signups</span>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-6 py-4 text-gray-400 font-medium">Email</th>
                            <th className="text-left px-6 py-4 text-gray-400 font-medium">Full Name</th>
                            <th className="text-right px-6 py-4 text-gray-400 font-medium whitespace-nowrap">Join Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {waitlist.map((entry: any) => (
                            <tr key={entry.id || entry.email} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-200">{entry.email}</td>
                                <td className="px-6 py-4 font-medium text-gray-200">{entry.full_name || '—'}</td>
                                <td className="px-6 py-4 text-right text-gray-500">
                                    {new Date(entry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </td>
                            </tr>
                        ))}
                        {waitlist.length === 0 && (
                            <tr><td colSpan={2} className="px-6 py-12 text-center text-gray-500 text-lg">No waitlist entries found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
