import { fetchAnalyticsSummary, fetchTopEvents, fetchFunnel, fetchRecentEvents, fetchApplicationStats } from '@/lib/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AnalyticsPage() {
    const [summary, topEvents, funnel, recentEvents, appStats] = await Promise.all([
        fetchAnalyticsSummary(),
        fetchTopEvents(7),
        fetchFunnel(30),
        fetchRecentEvents(30),
        fetchApplicationStats(),
    ]);

    const funnelSteps = [
        { label: 'Screen Views', value: funnel.screenViews, color: 'text-blue-400', bg: 'bg-blue-500' },
        { label: 'Viewed Offers', value: funnel.offerViews, color: 'text-purple-400', bg: 'bg-purple-500' },
        { label: 'Started Apply', value: funnel.applyStarted, color: 'text-amber-400', bg: 'bg-amber-500' },
        { label: 'Applied', value: funnel.applied, color: 'text-emerald-400', bg: 'bg-emerald-500' },
    ];

    const maxFunnel = Math.max(...funnelSteps.map(s => s.value), 1);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Analytics</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                <div className="bg-blue-500/10 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Events (24h)</p>
                    <p className="text-3xl font-bold text-blue-400">{summary.events24h}</p>
                </div>
                <div className="bg-purple-500/10 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Events (7d)</p>
                    <p className="text-3xl font-bold text-purple-400">{summary.events7d}</p>
                </div>
                <div className="bg-cyan-500/10 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Events (30d)</p>
                    <p className="text-3xl font-bold text-cyan-400">{summary.events30d}</p>
                </div>
                <div className="bg-emerald-500/10 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Active Users (24h)</p>
                    <p className="text-3xl font-bold text-emerald-400">{summary.activeUsers24h}</p>
                </div>
                <div className="bg-amber-500/10 border border-gray-800 rounded-xl p-5">
                    <p className="text-sm text-gray-400 mb-1">Active Users (7d)</p>
                    <p className="text-3xl font-bold text-amber-400">{summary.activeUsers7d}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Conversion Funnel */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Conversion Funnel (30d)</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {funnelSteps.map((step, i) => (
                            <div key={step.label}>
                                <div className="flex justify-between mb-1">
                                    <span className={`text-sm font-medium ${step.color}`}>{step.label}</span>
                                    <span className="text-sm text-gray-400">
                                        {step.value} users
                                        {i > 0 && funnelSteps[i - 1].value > 0 && (
                                            <span className="ml-2 text-gray-500">
                                                ({Math.round((step.value / funnelSteps[i - 1].value) * 100)}%)
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3">
                                    <div
                                        className={`${step.bg} h-3 rounded-full transition-all`}
                                        style={{ width: `${Math.max(2, (step.value / maxFunnel) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Pipeline */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Application Pipeline</h2>
                    </div>
                    <div className="p-6 space-y-3">
                        {[
                            { label: 'Submitted', count: appStats.submitted, color: 'bg-blue-500', text: 'text-blue-400' },
                            { label: 'Under Review', count: appStats.under_review, color: 'bg-amber-500', text: 'text-amber-400' },
                            { label: 'Docs Required', count: appStats.documents_required, color: 'bg-orange-500', text: 'text-orange-400' },
                            { label: 'Approved', count: appStats.approved, color: 'bg-emerald-500', text: 'text-emerald-400' },
                            { label: 'Rejected', count: appStats.rejected, color: 'bg-red-500', text: 'text-red-400' },
                        ].map((stage) => (
                            <div key={stage.label} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                                <span className="text-sm text-gray-300 flex-1">{stage.label}</span>
                                <span className={`text-lg font-bold ${stage.text}`}>{stage.count}</span>
                            </div>
                        ))}
                        <div className="pt-3 mt-3 border-t border-gray-800 flex items-center gap-3">
                            <span className="text-sm text-gray-400 flex-1">Total</span>
                            <span className="text-lg font-bold text-white">{appStats.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Events Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Top Events (7d)</h2>
                    </div>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Event</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {topEvents.slice(0, 10).map((event: { name: string; count: number }) => (
                                <tr key={event.name} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-3">
                                        <code className="text-xs bg-gray-800 px-2 py-1 rounded text-emerald-400">
                                            {event.name}
                                        </code>
                                    </td>
                                    <td className="px-6 py-3 text-right font-mono">{event.count}</td>
                                </tr>
                            ))}
                            {topEvents.length === 0 && (
                                <tr><td colSpan={2} className="px-6 py-8 text-center text-gray-500">No events yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Recent Events */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Recent Events</h2>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-800/50 sticky top-0">
                                <tr>
                                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Event</th>
                                    <th className="text-left px-6 py-3 text-gray-400 font-medium">Screen</th>
                                    <th className="text-right px-6 py-3 text-gray-400 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {recentEvents.map((event: { id: string; event_name: string; screen: string | null; created_at: string }) => (
                                    <tr key={event.id} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-6 py-2">
                                            <code className="text-xs bg-gray-800 px-2 py-0.5 rounded text-cyan-400">
                                                {event.event_name}
                                            </code>
                                        </td>
                                        <td className="px-6 py-2 text-gray-400 text-xs">{event.screen || '—'}</td>
                                        <td className="px-6 py-2 text-right text-gray-500 text-xs">
                                            {new Date(event.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {recentEvents.length === 0 && (
                                    <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No events yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
