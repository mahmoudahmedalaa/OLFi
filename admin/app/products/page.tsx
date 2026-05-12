'use client';
import { useCallback, useEffect, useState } from 'react';
import {
    fetchProducts, fetchBanksList,
    createProduct, updateProduct, deleteProduct, toggleProductActive,
} from '@/lib/actions';

interface Bank { id: string; name: string; }
interface Product {
    id: string; bank_id: string; product_type: string; name: string;
    interest_rate_min: number | null; interest_rate_max: number | null;
    min_amount: number | null; max_amount: number | null;
    min_tenure_months: number | null; max_tenure_months: number | null;
    processing_fee_pct: number | null; early_settlement_fee_pct: number | null;
    requires_salary_transfer: boolean; features: string[]; is_active: boolean;
    created_at: string; banks?: { name: string };
}

const TYPES = ['personal', 'auto', 'mortgage', 'credit_card', 'business'];
const emptyForm = {
    bank_id: '', product_type: 'personal', name: '',
    interest_rate_min: '', interest_rate_max: '',
    min_amount: '', max_amount: '',
    min_tenure_months: '', max_tenure_months: '',
    processing_fee_pct: '', early_settlement_fee_pct: '',
    requires_salary_transfer: false, features: '', is_active: true,
};

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [filterType, setFilterType] = useState('all');

    const loadData = useCallback(async () => {
        setLoading(true);
        const [prods, bks] = await Promise.all([fetchProducts(), fetchBanksList()]);
        setProducts(prods as Product[]);
        setBanks(bks as Bank[]);
        setLoading(false);
    }, []);

    useEffect(() => {
        void Promise.resolve().then(loadData);
    }, [loadData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const payload = {
            bank_id: form.bank_id,
            product_type: form.product_type,
            name: form.name,
            interest_rate_min: form.interest_rate_min ? Number(form.interest_rate_min) : null,
            interest_rate_max: form.interest_rate_max ? Number(form.interest_rate_max) : null,
            min_amount: form.min_amount ? Number(form.min_amount) : null,
            max_amount: form.max_amount ? Number(form.max_amount) : null,
            min_tenure_months: form.min_tenure_months ? Number(form.min_tenure_months) : null,
            max_tenure_months: form.max_tenure_months ? Number(form.max_tenure_months) : null,
            processing_fee_pct: form.processing_fee_pct ? Number(form.processing_fee_pct) : null,
            early_settlement_fee_pct: form.early_settlement_fee_pct ? Number(form.early_settlement_fee_pct) : null,
            requires_salary_transfer: form.requires_salary_transfer,
            features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
            is_active: form.is_active,
        };
        if (editing) await updateProduct(editing, payload);
        else await createProduct(payload);
        setForm(emptyForm); setEditing(null); setShowForm(false); setSaving(false);
        loadData();
    };

    const handleEdit = (p: Product) => {
        setForm({
            bank_id: p.bank_id, product_type: p.product_type, name: p.name,
            interest_rate_min: p.interest_rate_min?.toString() || '',
            interest_rate_max: p.interest_rate_max?.toString() || '',
            min_amount: p.min_amount?.toString() || '',
            max_amount: p.max_amount?.toString() || '',
            min_tenure_months: p.min_tenure_months?.toString() || '',
            max_tenure_months: p.max_tenure_months?.toString() || '',
            processing_fee_pct: p.processing_fee_pct?.toString() || '',
            early_settlement_fee_pct: p.early_settlement_fee_pct?.toString() || '',
            requires_salary_transfer: p.requires_salary_transfer,
            features: Array.isArray(p.features) ? p.features.join(', ') : '',
            is_active: p.is_active,
        });
        setEditing(p.id); setShowForm(true);
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await deleteProduct(id); loadData();
    };

    const handleToggle = async (id: string, active: boolean) => {
        await toggleProductActive(id, active); loadData();
    };

    const filtered = filterType === 'all' ? products : products.filter(p => p.product_type === filterType);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Products</h1>
                <button onClick={() => { setForm(emptyForm); setEditing(null); setShowForm(!showForm); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                    {showForm ? 'Cancel' : '+ Add Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Bank *</label>
                            <select value={form.bank_id} onChange={(e) => setForm({ ...form, bank_id: e.target.value })} required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                                <option value="">Select bank...</option>
                                {banks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type *</label>
                            <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                                {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Product Name *</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Min Rate %</label>
                            <input type="number" step="0.01" value={form.interest_rate_min} onChange={(e) => setForm({ ...form, interest_rate_min: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Max Rate %</label>
                            <input type="number" step="0.01" value={form.interest_rate_max} onChange={(e) => setForm({ ...form, interest_rate_max: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Min Amount</label>
                            <input type="number" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Max Amount</label>
                            <input type="number" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Min Tenure (months)</label>
                            <input type="number" value={form.min_tenure_months} onChange={(e) => setForm({ ...form, min_tenure_months: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Max Tenure (months)</label>
                            <input type="number" value={form.max_tenure_months} onChange={(e) => setForm({ ...form, max_tenure_months: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Processing Fee %</label>
                            <input type="number" step="0.01" value={form.processing_fee_pct} onChange={(e) => setForm({ ...form, processing_fee_pct: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Early Settlement Fee %</label>
                            <input type="number" step="0.01" value={form.early_settlement_fee_pct} onChange={(e) => setForm({ ...form, early_settlement_fee_pct: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Features (comma-separated)</label>
                            <input value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="e.g. No guarantor, Balance transfer"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input type="checkbox" checked={form.requires_salary_transfer} onChange={(e) => setForm({ ...form, requires_salary_transfer: e.target.checked })} className="accent-emerald-500" />
                            Requires Salary Transfer
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="accent-emerald-500" />
                            Active
                        </label>
                    </div>
                    <button type="submit" disabled={saving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                        {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                    </button>
                </form>
            )}

            <div className="flex gap-2 mb-4">
                {['all', ...TYPES].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filterType === t ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                            }`}>
                        {t.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Product</th>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Bank</th>
                                <th className="text-center px-6 py-3 text-gray-400 font-medium">Type</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Rate Range</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Amount Range</th>
                                <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium">{p.name}</td>
                                    <td className="px-6 py-4 text-gray-300">{p.banks?.name || '—'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 capitalize">{p.product_type.replace('_', ' ')}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-300">
                                        {p.interest_rate_min && p.interest_rate_max ? `${p.interest_rate_min}% – ${p.interest_rate_max}%` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-300">
                                        {p.min_amount && p.max_amount ? `${Number(p.min_amount).toLocaleString()} – ${Number(p.max_amount).toLocaleString()}` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleToggle(p.id, p.is_active)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${p.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(p)} className="text-blue-400 hover:text-blue-300 text-sm">Edit</button>
                                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No products found</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
