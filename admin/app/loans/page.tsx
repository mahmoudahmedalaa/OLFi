import { supabase } from '@/lib/supabase';

async function getLoans() {
    const { data } = await supabase
        .from('user_loans')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
}

export default async function LoansPage() {
    const loans = await getLoans();

    const totalDebt = loans.reduce((sum: number, l: any) => sum + Number(l.remaining_amount), 0);
    const totalOriginal = loans.reduce((sum: number, l: any) => sum + Number(l.original_amount), 0);
    const avgRate = loans.length > 0
        ? (loans.reduce((sum: number, l: any) => sum + Number(l.interest_rate), 0) / loans.length).toFixed(2)
        : '0';

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Loans</h1>
                <span className="text-sm text-gray-400">{loans.length} total loans</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-sm text-gray-400 mb-1">Total Original</p>
                    <p className="text-2xl font-bold text-blue-400">AED {totalOriginal.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-sm text-gray-400 mb-1">Total Remaining</p>
                    <p className="text-2xl font-bold text-amber-400">AED {totalDebt.toLocaleString()}</p>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <p className="text-sm text-gray-400 mb-1">Avg Interest Rate</p>
                    <p className="text-2xl font-bold text-purple-400">{avgRate}%</p>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Bank</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Type</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Original</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Remaining</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Rate</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">EMI</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Start</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loans.map((loan: any) => (
                            <tr key={loan.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium">{loan.bank_name || '—'}</td>
                                <td className="px-6 py-4 capitalize text-gray-300">{loan.loan_type}</td>
                                <td className="px-6 py-4 text-right">AED {Number(loan.original_amount).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">AED {Number(loan.remaining_amount).toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-gray-300">{loan.interest_rate}%</td>
                                <td className="px-6 py-4 text-right text-gray-300">AED {Number(loan.monthly_emi).toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                            loan.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                                                loan.status === 'refinanced' ? 'bg-purple-500/10 text-purple-400' :
                                                    'bg-red-500/10 text-red-400'
                                        }`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400">
                                    {loan.start_date || '—'}
                                </td>
                            </tr>
                        ))}
                        {loans.length === 0 && (
                            <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-500">No loans yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
