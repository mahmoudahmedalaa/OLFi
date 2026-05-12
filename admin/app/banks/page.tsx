'use client';
import { useCallback, useEffect, useState } from 'react';
import { fetchBanks, createBank, updateBank, deleteBank } from '@/lib/actions';

interface Bank {
    id: string;
    name: string;
    name_ar: string | null;
    logo_url: string | null;
    website_url: string | null;
    is_islamic: boolean;
    min_salary: number | null;
    created_at: string;
}

const emptyForm = { name: '', name_ar: '', logo_url: '', website_url: '', is_islamic: false, min_salary: '' };

export default function BanksPage() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const loadBanks = useCallback(async () => {
        setLoading(true);
        const data = await fetchBanks();
        setBanks(data as Bank[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        void Promise.resolve().then(loadBanks);
    }, [loadBanks]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            name: form.name,
            name_ar: form.name_ar || null,
            logo_url: form.logo_url || null,
            website_url: form.website_url || null,
            is_islamic: form.is_islamic,
            min_salary: form.min_salary ? Number(form.min_salary) : null,
        };

        if (editing) {
            await updateBank(editing, payload);
        } else {
            await createBank(payload);
        }

        setForm(emptyForm);
        setEditing(null);
        setShowForm(false);
        setSaving(false);
        loadBanks();
    };

    const handleEdit = (bank: Bank) => {
        setForm({
            name: bank.name,
            name_ar: bank.name_ar || '',
            logo_url: bank.logo_url || '',
            website_url: bank.website_url || '',
            is_islamic: bank.is_islamic,
            min_salary: bank.min_salary?.toString() || '',
        });
        setEditing(bank.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this bank? This will also affect related products.')) return;
        await deleteBank(id);
        loadBanks();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Banks</h1>
                <button
                    onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    {showForm ? 'Cancel' : '+ Add Bank'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name *</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Name (Arabic)</label>
                            <input value={form.name_ar} onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" dir="rtl" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Logo URL</label>
                            <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Website URL</label>
                            <input value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Min Salary (AED)</label>
                            <input type="number" value={form.min_salary} onChange={(e) => setForm({ ...form, min_salary: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" checked={form.is_islamic} onChange={(e) => setForm({ ...form, is_islamic: e.target.checked })} className="w-4 h-4 accent-emerald-500" />
                            <label className="text-sm text-gray-300">Islamic Banking</label>
                        </div>
                    </div>
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                        {saving ? 'Saving...' : editing ? 'Update Bank' : 'Add Bank'}
                    </button>
                </form>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Name</th>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Arabic</th>
                                <th className="text-center px-6 py-3 text-gray-400 font-medium">Islamic</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Min Salary</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {banks.map((bank) => (
                                <tr key={bank.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            {bank.logo_url && (
                                                <span
                                                    aria-hidden="true"
                                                    className="w-8 h-8 rounded-full bg-gray-700 bg-cover bg-center"
                                                    style={{ backgroundImage: `url(${bank.logo_url})` }}
                                                />
                                            )}
                                            {bank.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400" dir="rtl">{bank.name_ar || '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        {bank.is_islamic ? <span className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-400">Yes</span> : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-300">
                                        {bank.min_salary ? `AED ${Number(bank.min_salary).toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(bank)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                        <button onClick={() => handleDelete(bank.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {banks.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No banks added yet</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
