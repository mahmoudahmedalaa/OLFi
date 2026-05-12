import { supabase } from '@/lib/supabase';
import { fetchApplicationStats, fetchAnalyticsSummary } from '@/lib/actions';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type RecentLoan = Awaited<ReturnType<typeof getRecentLoans>>[number];
type RecentApplication = {
  id: string;
  status: string;
  monthly_savings: number | string | null;
  total_savings: number | string | null;
  created_at: string;
  profile?: {
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
  } | null;
  bank_product?: {
    name?: string | null;
    bank?: { name?: string | null } | null;
  } | null;
};

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

async function getRecentApplications() {
  const { data } = await supabase
    .from('refinance_applications')
    .select(`
            id, status, monthly_savings, total_savings, created_at,
            profile:profiles!refinance_applications_user_id_fkey (first_name, last_name, full_name),
            bank_product:bank_products!refinance_applications_bank_product_id_fkey (name, bank:banks!bank_products_bank_id_fkey (name))
        `)
    .order('created_at', { ascending: false })
    .limit(5);
  return (data || []) as unknown as RecentApplication[];
}

export default async function Dashboard() {
  const [stats, recentLoans, recentApps, appStats, analytics] = await Promise.all([
    getStats(),
    getRecentLoans(),
    getRecentApplications(),
    fetchApplicationStats(),
    fetchAnalyticsSummary(),
  ]);

  const cards = [
    { label: 'Banks', value: stats.banks, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Products', value: stats.products, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Users', value: stats.users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Loans', value: stats.loans, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Applications', value: appStats.total, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Active Users (24h)', value: analytics.activeUsers24h, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  const statusColors: Record<string, string> = {
    submitted: 'bg-blue-500/10 text-blue-400',
    under_review: 'bg-amber-500/10 text-amber-400',
    documents_required: 'bg-orange-500/10 text-orange-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    rejected: 'bg-red-500/10 text-red-400',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`${card.bg} border border-gray-800 rounded-xl p-5`}
          >
            <p className="text-sm text-gray-400 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-xl">📈</div>
          <div>
            <p className="text-sm text-gray-400">Activity Today</p>
            <p className="text-2xl font-bold text-emerald-400">{analytics.events24h}</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-xl">🔥</div>
          <div>
            <p className="text-sm text-gray-400">Activity (7d)</p>
            <p className="text-2xl font-bold text-purple-400">{analytics.events7d}</p>
          </div>
        </div>
        <Link href="/analytics" className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4 hover:bg-gray-800 transition-colors">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center text-xl">📊</div>
          <div>
            <p className="text-sm text-gray-400">View Full Analytics</p>
            <p className="text-lg font-bold text-cyan-400">→ Dashboard</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Loans */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Loans</h2>
            <Link href="/loans" className="text-sm text-emerald-400 hover:underline">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Bank</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Type</th>
                <th className="text-right px-6 py-3 text-gray-400 font-medium">Amount</th>
                <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentLoans.map((loan: RecentLoan) => (
                <tr key={loan.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-3 font-medium">{loan.bank_name || '—'}</td>
                  <td className="px-6 py-3 capitalize text-gray-300">{loan.loan_type}</td>
                  <td className="px-6 py-3 text-right">AED {Number(loan.original_amount).toLocaleString()}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {loan.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLoans.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No loans yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Applications */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Link href="/applications" className="text-sm text-emerald-400 hover:underline">View all →</Link>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">User</th>
                <th className="text-left px-6 py-3 text-gray-400 font-medium">Product</th>
                <th className="text-right px-6 py-3 text-gray-400 font-medium">Savings</th>
                <th className="text-center px-6 py-3 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {recentApps.map((app: RecentApplication) => {
                const appName = app.profile?.first_name
                  ? `${app.profile.first_name} ${app.profile.last_name || ''}`.trim()
                  : app.profile?.full_name || 'User';
                return (
                  <tr key={app.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{appName}</td>
                    <td className="px-6 py-3 text-gray-300">{app.bank_product?.bank?.name || '—'}</td>
                    <td className="px-6 py-3 text-right text-emerald-400">
                      AED {Number(app.monthly_savings).toLocaleString()}/mo
                    </td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[app.status] || 'bg-gray-800 text-gray-400'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {recentApps.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No applications yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
