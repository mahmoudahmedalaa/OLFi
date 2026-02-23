'use client';

import { useState, useEffect } from 'react';
import { fetchApplications, fetchBanks, fetchRecentManualOffers, createManualOffer } from '@/lib/actions';

export default function ManualOffersPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedAppId, setSelectedAppId] = useState('');
    const [selectedBankId, setSelectedBankId] = useState('');
    const [offerAmount, setOfferAmount] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [tenureYears, setTenureYears] = useState('');
    const [processingFee, setProcessingFee] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // List of created offers
    const [recentOffers, setRecentOffers] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [appsData, banksData] = await Promise.all([
                    fetchApplications(),
                    fetchBanks()
                ]);

                // Only show apps that are in review or approved
                setApplications(appsData.filter((a: any) =>
                    ['under_review', 'approved'].includes(a.status)
                ));
                setBanks(banksData);

                // Load recent manual offers
                const offers = await fetchRecentManualOffers();
                setRecentOffers(offers || []);
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedAppId || !selectedBankId || !offerAmount || !interestRate || !tenureYears) {
            alert('Please fill all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            // Find application to get user_id
            const app = applications.find(a => a.id === selectedAppId);
            if (!app) throw new Error('Application not found');

            // Format offer data
            const offerData = {
                user_id: app.user_id,
                application_id: app.id,
                bank_id: selectedBankId,
                status: 'pending',

                // Financial terms
                offer_amount: parseFloat(offerAmount),
                interest_rate: parseFloat(interestRate),
                tenure_months: parseInt(tenureYears) * 12,
                processing_fee: processingFee ? parseFloat(processingFee) : 0,

                // Calculate EMI securely
                monthly_emi: calculateEMI(
                    parseFloat(offerAmount),
                    parseFloat(interestRate),
                    parseInt(tenureYears) * 12
                ),

                is_system_generated: false,
                is_manual_override: true
            };

            const data = await createManualOffer(offerData);

            alert('Manual offer created successfully!');

            // Re-fetch recent offers or prepend
            if (data) {
                setRecentOffers(prev => [data, ...prev].slice(0, 10));
            }

            // Reset form
            setSelectedAppId('');
            setSelectedBankId('');
            setOfferAmount('');
            setInterestRate('');
            setTenureYears('');
            setProcessingFee('');

        } catch (error: any) {
            console.error('Error creating offer:', error);
            alert(`Failed to create offer: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Standard reducing balance EMI calculation
    const calculateEMI = (principal: number, annualRate: number, months: number) => {
        if (annualRate === 0) return principal / months;
        const r = annualRate / 12 / 100;
        const p = principal;
        const n = months;
        const emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
        return Math.round(emi * 100) / 100; // Round to 2 decimal places
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Manual Offer Management</h1>
                    <p className="text-gray-400 mt-1">Create custom bank offers to override system defaults.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold mb-4">Create Custom Offer</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Application</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                value={selectedAppId}
                                onChange={e => setSelectedAppId(e.target.value)}
                                required
                            >
                                <option value="">Select Application...</option>
                                {applications.map(app => (
                                    <option key={app.id} value={app.id}>
                                        {app.profile?.first_name} {app.profile?.last_name} ({app.status})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lending Bank</label>
                            <select
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                value={selectedBankId}
                                onChange={e => setSelectedBankId(e.target.value)}
                                required
                            >
                                <option value="">Select Partner Bank...</option>
                                {banks.map(bank => (
                                    <option key={bank.id} value={bank.id}>
                                        {bank.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Approved Amount (AED)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                placeholder="e.g. 150000"
                                value={offerAmount}
                                onChange={e => setOfferAmount(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Flat Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                    placeholder="e.g. 5.99"
                                    value={interestRate}
                                    onChange={e => setInterestRate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Tenure (Years)</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                    placeholder="e.g. 4"
                                    value={tenureYears}
                                    onChange={e => setTenureYears(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Processing Fee (AED)</label>
                            <input
                                type="number"
                                className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-white"
                                placeholder="e.g. 1500"
                                value={processingFee}
                                onChange={e => setProcessingFee(e.target.value)}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-800">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isSubmitting
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                    }`}
                            >
                                {isSubmitting ? 'Pushing Offer...' : 'Create & Send Offer'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Offers List */}
                <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-hidden flex flex-col">
                    <h2 className="text-lg font-bold mb-4">Recent Manual Offers</h2>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-950 border-y border-gray-800">
                                <tr>
                                    <th className="px-4 py-3">Applicant</th>
                                    <th className="px-4 py-3">Bank</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">Rate</th>
                                    <th className="px-4 py-3">EMI</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOffers.map((offer) => (
                                    <tr key={offer.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="px-4 py-3 font-medium text-white">
                                            {offer.application?.profile?.first_name} {offer.application?.profile?.last_name}
                                        </td>
                                        <td className="px-4 py-3 text-emerald-400">{offer.bank?.name}</td>
                                        <td className="px-4 py-3">AED {Number(offer.offer_amount).toLocaleString()}</td>
                                        <td className="px-4 py-3">{offer.interest_rate}%</td>
                                        <td className="px-4 py-3 font-mono">AED {Number(offer.monthly_emi).toLocaleString()}</td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(offer.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                                {recentOffers.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                            No manual offers created yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
