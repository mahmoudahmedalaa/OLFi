import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getUsers() {
    // Fetch profiles and join with auth.users is not possible directly via client,
    // but profiles has all we need
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    return data || [];
}

async function getUserLoansCount() {
    const { data } = await supabase
        .from('user_loans')
        .select('user_id');
    const countMap: Record<string, number> = {};
    (data || []).forEach((l: any) => {
        countMap[l.user_id] = (countMap[l.user_id] || 0) + 1;
    });
    return countMap;
}

export default async function UsersPage() {
    const [users, loanCounts] = await Promise.all([
        getUsers(),
        getUserLoansCount(),
    ]);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Users</h1>
                <span className="text-sm text-gray-400">{users.length} total users</span>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Name</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Phone</th>
                            <th className="text-left px-6 py-3 text-gray-400 font-medium">Nationality</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Salary</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">KYC</th>
                            <th className="text-center px-6 py-3 text-gray-400 font-medium">Loans</th>
                            <th className="text-right px-6 py-3 text-gray-400 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map((u: any) => (
                            <tr key={u.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-6 py-4 font-medium">
                                    {u.first_name || u.full_name || 'Anonymous'}
                                    {u.last_name ? ` ${u.last_name}` : ''}
                                </td>
                                <td className="px-6 py-4 text-gray-300">{u.phone || '—'}</td>
                                <td className="px-6 py-4 text-gray-300">{u.nationality || '—'}</td>
                                <td className="px-6 py-4 text-right text-gray-300">
                                    {u.salary ? `AED ${Number(u.salary).toLocaleString()}` : '—'}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.kyc_status === 'verified' ? 'bg-emerald-500/10 text-emerald-400' :
                                        u.kyc_status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                                            'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                        {u.kyc_status || 'pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 font-medium">
                                        {loanCounts[u.id] || 0}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400">
                                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500">No users yet</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
