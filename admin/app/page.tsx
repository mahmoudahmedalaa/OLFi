import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getStats() {
  const [banks, products, users, loans] = await Promise.all([
    supabase.from('banks').select('*', { count: 'exact', head: true }),
    supabase.from('bank_products').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('user_loans').select('*', { count: 'exact', head: true }),
  ]);
  return {
    banks: banks.count ?? 0,
    products: products.count ?? 0,
    users: users.count ?? 0,
    loans: loans.count ?? 0,
  };
}

async function getRecentLoans() {
  const { data } = await supabase
    .from('user_loans')
    .select('id, bank_name, loan_type, original_amount, remaining_amount, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);
  return data || [];
}

export default async function Dashboard() {
  const stats = await getStats();
  const recentLoans = await getRecentLoans();

  const cards = [
    { label: 'Banks', value: stats.banks, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Products', value: stats.products, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Users', value: stats.users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Loans', value: stats.loans, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} border border-gray-800 rounded-xl p-6`}
          >
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Loans */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold">Recent Loans</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Bank</th>
              <th className="text-left px-6 py-3 text-gray-400 font-medium">Type</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Amount</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Remaining</th>
              <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
              <th className="text-right px-6 py-3 text-gray-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {recentLoans.map((loan: any) => (
              <tr key={loan.id} className="hover:bg-gray-800/30 transition-colors">
                <td className="px-6 py-4 font-medium">{loan.bank_name || '—'}</td>
                <td className="px-6 py-4 capitalize text-gray-300">{loan.loan_type}</td>
                <td className="px-6 py-4 text-right">AED {Number(loan.original_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-right">AED {Number(loan.remaining_amount).toLocaleString()}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                    loan.status === 'completed' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-red-500/10 text-red-400'
                    }`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-400">
                  {new Date(loan.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {recentLoans.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No loans yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
