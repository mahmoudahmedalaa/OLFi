import { fetchUserDetail } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { profile, loans, applications, recentActivity } = await fetchUserDetail(id);

    if (!profile) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">User not found</p>
                <Link href="/users" className="text-emerald-400 hover:underline mt-4 inline-block">← Back to Users</Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        active: 'bg-emerald-500/10 text-emerald-400',
        completed: 'bg-blue-500/10 text-blue-400',
        submitted: 'bg-blue-500/10 text-blue-400',
        under_review: 'bg-amber-500/10 text-amber-400',
        documents_required: 'bg-orange-500/10 text-orange-400',
        approved: 'bg-emerald-500/10 text-emerald-400',
        rejected: 'bg-red-500/10 text-red-400',
    };

    const profileName = profile.first_name
        ? `${profile.first_name} ${profile.last_name || ''}`.trim()
        : profile.full_name || 'Unknown User';

    return (
        <div>
            <div className="flex items-center gap-4 mb-8">
                <Link href="/users" className="text-gray-400 hover:text-white transition-colors">← Users</Link>
                <h1 className="text-2xl font-bold">{profileName}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.kyc_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                        profile.kyc_status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                            'bg-amber-500/10 text-amber-400'
                    }`}>
                    KYC: {profile.kyc_status || 'pending'}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Profile</h2>
                    </div>
                    <div className="p-6 space-y-3 text-sm">
                        {[
                            ['Email', profile.id],
                            ['Phone', profile.phone],
                            ['Nationality', profile.nationality],
                            ['Employer', profile.employer],
                            ['Salary', profile.salary ? `AED ${Number(profile.salary).toLocaleString()}` : null],
                            ['Residency', profile.residency_status],
                            ['DOB', profile.date_of_birth],
                            ['Onboarded', profile.onboarding_completed ? 'Yes' : 'No'],
                            ['Joined', profile.created_at ? new Date(profile.created_at).toLocaleDateString() : null],
                        ].map(([label, value]) => (
                            <div key={label as string} className="flex justify-between">
                                <span className="text-gray-400">{label}</span>
                                <span className="text-gray-200">{(value as string) || '—'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User's Loans */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Loans ({loans.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {loans.map((loan: any) => (
                            <div key={loan.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium">{loan.bank_name || '—'}</p>
                                        <p className="text-xs text-gray-400 capitalize">{loan.loan_type}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[loan.status] || 'bg-gray-800 text-gray-400'}`}>
                                        {loan.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Remaining</p>
                                        <p className="text-gray-200">AED {Number(loan.remaining_amount).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Rate</p>
                                        <p className="text-gray-200">{Number(loan.interest_rate).toFixed(2)}%</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">EMI</p>
                                        <p className="text-gray-200">AED {Number(loan.monthly_emi).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Tenure</p>
                                        <p className="text-gray-200">{loan.tenure_months} months</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loans.length === 0 && (
                            <p className="px-6 py-8 text-center text-gray-500">No loans</p>
                        )}
                    </div>
                </div>

                {/* Applications */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800">
                        <h2 className="text-lg font-semibold">Applications ({applications.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {applications.map((app: any) => (
                            <div key={app.id} className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-medium text-sm">{app.bank_product?.bank?.name || '—'}</p>
                                        <p className="text-xs text-gray-400">{app.bank_product?.name || '—'}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[app.status] || 'bg-gray-800 text-gray-400'}`}>
                                        {app.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Monthly Savings</p>
                                        <p className="text-emerald-400">AED {Number(app.monthly_savings).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Total Savings</p>
                                        <p className="text-emerald-400">AED {Number(app.total_savings).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                        {applications.length === 0 && (
                            <p className="px-6 py-8 text-center text-gray-500">No applications</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="mt-8 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">Recent Activity</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {recentActivity.map((event: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                <code className="text-xs bg-gray-800 px-2 py-0.5 rounded text-cyan-400 flex-shrink-0">
                                    {event.event_name}
                                </code>
                                <span className="text-xs text-gray-500">{event.screen || '—'}</span>
                                <span className="text-xs text-gray-600 ml-auto">
                                    {new Date(event.created_at).toLocaleString()}
                                </span>
                            </div>
                        ))}
                        {recentActivity.length === 0 && (
                            <p className="text-center text-gray-500">No activity tracked yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
