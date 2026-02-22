'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchApplications, updateApplicationStatus } from '@/lib/actions';

const STATUS_COLORS: Record<string, string> = {
    submitted: 'bg-blue-500/10 text-blue-400',
    under_review: 'bg-amber-500/10 text-amber-400',
    documents_required: 'bg-orange-500/10 text-orange-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    rejected: 'bg-red-500/10 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    documents_required: 'Docs Required',
    approved: 'Approved',
    rejected: 'Rejected',
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionModal, setActionModal] = useState<{
        id: string;
        userId: string;
        type: 'approve' | 'reject' | 'docs' | 'review';
    } | null>(null);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await fetchApplications();
            setApplications(data);
        } catch (e) {
            console.error('Failed to load applications:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleAction = async () => {
        if (!actionModal) return;
        setSaving(true);
        try {
            const statusMap: Record<string, string> = {
                approve: 'approved',
                reject: 'rejected',
                docs: 'documents_required',
                review: 'under_review',
            };
            await updateApplicationStatus(
                actionModal.id,
                statusMap[actionModal.type],
                actionModal.type === 'docs' ? notes : undefined,
                actionModal.type === 'reject' ? notes : undefined,
                actionModal.userId
            );
            setActionModal(null);
            setNotes('');
            await load();
        } catch (e) {
            console.error('Failed to update:', e);
            alert('Failed to update application status');
        } finally {
            setSaving(false);
        }
    };

    const filtered = filter === 'all'
        ? applications
        : applications.filter((a) => a.status === filter);

    const stats = {
        total: applications.length,
        submitted: applications.filter((a) => a.status === 'submitted').length,
        under_review: applications.filter((a) => a.status === 'under_review').length,
        approved: applications.filter((a) => a.status === 'approved').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
    };

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
                <h1 className="text-2xl font-bold">Applications</h1>
                <span className="text-sm text-gray-400">{applications.length} total</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                    { label: 'Total', value: stats.total, color: 'text-white' },
                    { label: 'Submitted', value: stats.submitted, color: 'text-blue-400' },
                    { label: 'Under Review', value: stats.under_review, color: 'text-amber-400' },
                    { label: 'Approved', value: stats.approved, color: 'text-emerald-400' },
                    { label: 'Rejected', value: stats.rejected, color: 'text-red-400' },
                ].map((s) => (
                    <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                        <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['all', 'submitted', 'under_review', 'documents_required', 'approved', 'rejected'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {f === 'all' ? 'All' : STATUS_LABELS[f] || f}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">User</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Current Loan</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">New Product</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Savings/mo</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">New Rate</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Date</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filtered.map((app: any) => {
                            const userName = app.profile?.first_name
                                ? `${app.profile.first_name} ${app.profile.last_name || ''}`.trim()
                                : app.profile?.full_name || 'User';
                            const loanInfo = app.user_loan
                                ? `${app.user_loan.bank_name || 'Bank'} ${app.user_loan.loan_type}`
                                : '—';
                            const productInfo = app.bank_product
                                ? `${app.bank_product.bank?.name || ''} ${app.bank_product.name}`
                                : '—';

                            return (
                                <tr key={app.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{userName}</td>
                                    <td className="px-6 py-4 text-gray-300">{loanInfo}</td>
                                    <td className="px-6 py-4 text-gray-300">{productInfo}</td>
                                    <td className="px-6 py-4 text-right text-emerald-400 font-medium">
                                        AED {Number(app.monthly_savings || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-300">
                                        {app.new_rate}%
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || ''}`}>
                                            {STATUS_LABELS[app.status] || app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400">
                                        {new Date(app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {app.status === 'submitted' && (
                                                <button
                                                    onClick={() => setActionModal({ id: app.id, userId: app.user_id, type: 'review' })}
                                                    className="px-2 py-1 rounded text-xs bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                                                >
                                                    Review
                                                </button>
                                            )}
                                            {(app.status === 'submitted' || app.status === 'under_review') && (
                                                <>
                                                    <button
                                                        onClick={() => setActionModal({ id: app.id, userId: app.user_id, type: 'approve' })}
                                                        className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setActionModal({ id: app.id, userId: app.user_id, type: 'docs' })}
                                                        className="px-2 py-1 rounded text-xs bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
                                                    >
                                                        Docs
                                                    </button>
                                                    <button
                                                        onClick={() => setActionModal({ id: app.id, userId: app.user_id, type: 'reject' })}
                                                        className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {(app.status === 'approved' || app.status === 'rejected' || app.status === 'documents_required') && (
                                                <span className="text-xs text-gray-500">—</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No applications found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">
                            {actionModal.type === 'approve' && 'Approve Application'}
                            {actionModal.type === 'reject' && 'Reject Application'}
                            {actionModal.type === 'docs' && 'Request Documents'}
                            {actionModal.type === 'review' && 'Start Review'}
                        </h3>

                        {(actionModal.type === 'reject' || actionModal.type === 'docs') && (
                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">
                                    {actionModal.type === 'reject' ? 'Rejection Reason' : 'Documents Needed'}
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-emerald-500"
                                    rows={3}
                                    placeholder={
                                        actionModal.type === 'reject'
                                            ? 'Enter rejection reason...'
                                            : 'Describe which documents are needed...'
                                    }
                                />
                            </div>
                        )}

                        {actionModal.type === 'approve' && (
                            <p className="text-gray-300 text-sm mb-4">
                                Are you sure you want to approve this application? The user will be notified.
                            </p>
                        )}

                        {actionModal.type === 'review' && (
                            <p className="text-gray-300 text-sm mb-4">
                                Mark this application as &quot;Under Review&quot;? The user will be notified.
                            </p>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => { setActionModal(null); setNotes(''); }}
                                className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAction}
                                disabled={saving || ((actionModal.type === 'reject' || actionModal.type === 'docs') && !notes.trim())}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${actionModal.type === 'reject'
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : actionModal.type === 'approve'
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : 'bg-amber-500 text-white hover:bg-amber-600'
                                    }`}
                            >
                                {saving ? 'Saving...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
