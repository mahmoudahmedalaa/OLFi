'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchLoans, updateLoanStatus, updateLoanDetails, deleteLoan } from '@/lib/actions';
import Link from 'next/link';

type Loan = Awaited<ReturnType<typeof fetchLoans>>[number];

const STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-400',
    completed: 'bg-blue-500/10 text-blue-400',
    refinanced: 'bg-purple-500/10 text-purple-400',
    defaulted: 'bg-red-500/10 text-red-400',
};

const LOAN_STATUSES = ['active', 'completed', 'refinanced', 'defaulted'];

export default function LoansPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [editForm, setEditForm] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await fetchLoans();
            setLoans(data);
        } catch (e) {
            console.error('Failed to load loans:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        setSaving(true);
        try {
            await updateLoanStatus(id, newStatus);
            await load();
            if (selectedLoan?.id === id) {
                setSelectedLoan((prev) => prev ? { ...prev, status: newStatus } : null);
            }
        } catch {
            alert('Failed to update status');
        } finally {
            setSaving(false);
        }
    };

    const handleEditSave = async () => {
        if (!selectedLoan) return;
        setSaving(true);
        try {
            const updates: Record<string, unknown> = {};
            if (editForm.bank_name !== undefined) updates.bank_name = editForm.bank_name;
            if (editForm.remaining_amount !== undefined) updates.remaining_amount = Number(editForm.remaining_amount);
            if (editForm.interest_rate !== undefined) updates.interest_rate = Number(editForm.interest_rate);
            if (editForm.monthly_emi !== undefined) updates.monthly_emi = Number(editForm.monthly_emi);
            if (editForm.tenure_months !== undefined) updates.tenure_months = Number(editForm.tenure_months);
            await updateLoanDetails(selectedLoan.id, updates);
            setEditMode(false);
            await load();
            setSelectedLoan(null);
        } catch {
            alert('Failed to update loan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this loan? This action cannot be undone.')) return;
        try {
            await deleteLoan(id);
            setSelectedLoan(null);
            await load();
        } catch {
            alert('Failed to delete loan');
        }
    };

    const filtered = filter === 'all' ? loans : loans.filter((l) => l.status === filter);

    const totalDebt = loans.reduce((sum, l) => sum + Number(l.remaining_amount), 0);
    const totalOriginal = loans.reduce((sum, l) => sum + Number(l.original_amount), 0);
    const avgRate = loans.length > 0
        ? (loans.reduce((sum, l) => sum + Number(l.interest_rate), 0) / loans.length).toFixed(2)
        : '0';
    const statusCounts = loans.reduce((acc: Record<string, number>, l) => {
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
    }, {});

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
                <h1 className="text-2xl font-bold">Loans</h1>
                <span className="text-sm text-gray-400">{loans.length} total loans</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Original</p>
                    <p className="text-lg font-bold text-blue-400">AED {totalOriginal.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Remaining</p>
                    <p className="text-lg font-bold text-amber-400">AED {totalDebt.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">Avg Rate</p>
                    <p className="text-lg font-bold text-purple-400">{avgRate}%</p>
                </div>
                {LOAN_STATUSES.map((s) => (
                    <div key={s} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-xs text-gray-400 mb-1 capitalize">{s}</p>
                        <p className={`text-lg font-bold ${STATUS_COLORS[s]?.split(' ')[1] || 'text-gray-300'}`}>
                            {statusCounts[s] || 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['all', ...LOAN_STATUSES].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${filter === f
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                            }`}
                    >
                        {f} {f !== 'all' && `(${statusCounts[f] || 0})`}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">User</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Bank</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Type</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Remaining</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Rate</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">EMI</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {filtered.map((loan) => (
                            <tr key={loan.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/users/${loan.user_id}`}
                                        className="text-sm font-medium hover:text-emerald-400 transition-colors"
                                    >
                                        {loan.user_display}
                                    </Link>
                                    {loan.user_email && (
                                        <p className="text-xs text-gray-500 mt-0.5">{loan.user_email}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium">{loan.bank_name || '—'}</td>
                                <td className="px-6 py-4 capitalize text-gray-300">{loan.loan_type}</td>
                                <td className="px-6 py-4 text-right">
                                    AED {Number(loan.remaining_amount).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-300">{loan.interest_rate}%</td>
                                <td className="px-6 py-4 text-right text-gray-300">
                                    AED {Number(loan.monthly_emi).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[loan.status] || 'bg-gray-800 text-gray-400'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex gap-1 justify-center">
                                        <button
                                            onClick={() => { setSelectedLoan(loan); setEditMode(false); }}
                                            className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleDelete(loan.id)}
                                            className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No loans found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Loan Detail Modal */}
            {selectedLoan && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-gray-900">
                            <div>
                                <h3 className="text-lg font-bold">Loan Details</h3>
                                <p className="text-sm text-gray-400">{selectedLoan.user_display}</p>
                            </div>
                            <button
                                onClick={() => { setSelectedLoan(null); setEditMode(false); }}
                                className="text-gray-400 hover:text-white text-xl"
                            >×</button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Status Management */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Status</label>
                                <div className="flex gap-2 flex-wrap">
                                    {LOAN_STATUSES.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleStatusChange(selectedLoan.id, s)}
                                            disabled={saving || selectedLoan.status === s}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${selectedLoan.status === s
                                                    ? `${STATUS_COLORS[s]} ring-1 ring-current`
                                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                } disabled:opacity-50`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Loan Info */}
                            {!editMode ? (
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {[
                                        ['Bank', selectedLoan.bank_name || '—'],
                                        ['Type', selectedLoan.loan_type],
                                        ['Original Amount', `AED ${Number(selectedLoan.original_amount).toLocaleString()}`],
                                        ['Remaining', `AED ${Number(selectedLoan.remaining_amount).toLocaleString()}`],
                                        ['Interest Rate', `${selectedLoan.interest_rate}%`],
                                        ['Monthly EMI', `AED ${Number(selectedLoan.monthly_emi).toLocaleString()}`],
                                        ['Tenure', `${selectedLoan.tenure_months} months`],
                                        ['Start Date', selectedLoan.start_date || '—'],
                                        ['Created', new Date(selectedLoan.created_at).toLocaleDateString()],
                                        ['User Email', selectedLoan.user_email || '—'],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <p className="text-gray-500 text-xs">{label}</p>
                                            <p className="text-gray-200 mt-0.5">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Bank Name', key: 'bank_name', value: selectedLoan.bank_name },
                                        { label: 'Remaining Amount', key: 'remaining_amount', value: selectedLoan.remaining_amount, type: 'number' },
                                        { label: 'Interest Rate (%)', key: 'interest_rate', value: selectedLoan.interest_rate, type: 'number', step: '0.01' },
                                        { label: 'Monthly EMI', key: 'monthly_emi', value: selectedLoan.monthly_emi, type: 'number' },
                                        { label: 'Tenure (months)', key: 'tenure_months', value: selectedLoan.tenure_months, type: 'number' },
                                    ].map((field) => (
                                        <div key={field.key}>
                                            <label className="block text-xs text-gray-400 mb-1">{field.label}</label>
                                            <input
                                                type={field.type || 'text'}
                                                step={field.step}
                                                value={editForm[field.key] ?? field.value ?? ''}
                                                onChange={(e) => setEditForm({ ...editForm, [field.key]: e.target.value })}
                                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 pt-2 border-t border-gray-800">
                                {!editMode ? (
                                    <>
                                        <button
                                            onClick={() => { setEditMode(true); setEditForm({}); }}
                                            className="px-4 py-2 rounded-lg text-sm bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                        >
                                            Edit Details
                                        </button>
                                        <Link
                                            href={`/users/${selectedLoan.user_id}`}
                                            className="px-4 py-2 rounded-lg text-sm bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                        >
                                            View User
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(selectedLoan.id)}
                                            className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors ml-auto"
                                        >
                                            Delete Loan
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleEditSave}
                                            disabled={saving}
                                            className="px-4 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                        >
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            onClick={() => { setEditMode(false); setEditForm({}); }}
                                            className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
