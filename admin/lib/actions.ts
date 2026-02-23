'use server';

import { supabase } from '@/lib/supabase';

// ── Banks ───────────────────────────────────────────
export async function fetchBanks() {
    const { data, error } = await supabase.from('banks').select('*').order('name');
    if (error) throw error;
    return data || [];
}

export async function createBank(payload: {
    name: string; name_ar?: string | null; logo_url?: string | null;
    website_url?: string | null; is_islamic: boolean; min_salary?: number | null;
}) {
    const { error } = await supabase.from('banks').insert(payload);
    if (error) throw error;
}

export async function updateBank(id: string, payload: {
    name: string; name_ar?: string | null; logo_url?: string | null;
    website_url?: string | null; is_islamic: boolean; min_salary?: number | null;
}) {
    const { error } = await supabase.from('banks').update(payload).eq('id', id);
    if (error) throw error;
}

export async function deleteBank(id: string) {
    const { error } = await supabase.from('banks').delete().eq('id', id);
    if (error) throw error;
}

// ── Products ────────────────────────────────────────
export async function fetchProducts() {
    const { data, error } = await supabase.from('bank_products').select('*, banks(name)').order('name');
    if (error) throw error;
    return data || [];
}

export async function fetchBanksList() {
    const { data, error } = await supabase.from('banks').select('id, name').order('name');
    if (error) throw error;
    return data || [];
}

export async function createProduct(payload: Record<string, unknown>) {
    const { error } = await supabase.from('bank_products').insert(payload);
    if (error) throw error;
}

export async function updateProduct(id: string, payload: Record<string, unknown>) {
    const { error } = await supabase.from('bank_products').update(payload).eq('id', id);
    if (error) throw error;
}

export async function deleteProduct(id: string) {
    const { error } = await supabase.from('bank_products').delete().eq('id', id);
    if (error) throw error;
}

export async function toggleProductActive(id: string, isActive: boolean) {
    const { error } = await supabase.from('bank_products').update({ is_active: !isActive }).eq('id', id);
    if (error) throw error;
}

// ── Notifications ───────────────────────────────────
export async function fetchNotifications() {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return data || [];
}

export async function fetchUsersList() {
    const { data: profiles, error: pErr } = await supabase.from('profiles').select('id, first_name, last_name, full_name');
    if (pErr) throw pErr;

    // Fetch emails from auth.users via admin API
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const emailMap: Record<string, string> = {};
    for (const u of authData?.users || []) {
        emailMap[u.id] = u.email || '';
    }

    return (profiles || []).map((p: Record<string, unknown>) => {
        const name = p.first_name
            ? `${p.first_name} ${p.last_name || ''}`.trim()
            : (p.full_name as string) || null;
        const email = emailMap[p.id as string] || '';
        const displayName = name || email || `User ${(p.id as string).slice(0, 8)}`;
        return { id: p.id as string, name: displayName, email };
    });
}

export async function sendNotification(payload: {
    user_id: string; title: string; body: string; type: string;
}) {
    const { error } = await supabase.from('notifications').insert(payload);
    if (error) throw error;
}

export async function broadcastNotification(title: string, body: string, type: string) {
    const users = await fetchUsersList();
    const inserts = users.map((u: { id: string }) => ({ user_id: u.id, title, body, type }));
    const { error } = await supabase.from('notifications').insert(inserts);
    if (error) throw error;
}

export async function deleteNotification(id: string) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) throw error;
}

// ── Applications ────────────────────────────────────
export async function fetchApplications() {
    const { data, error } = await supabase
        .from('refinance_applications')
        .select(`
            *,
            profile:profiles!refinance_applications_user_id_fkey (first_name, last_name, full_name),
            user_loan:user_loans!refinance_applications_user_loan_id_fkey (bank_name, loan_type, remaining_amount, interest_rate),
            bank_product:bank_products!refinance_applications_bank_product_id_fkey (name, bank:banks!bank_products_bank_id_fkey (name))
        `)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function updateApplicationStatus(
    id: string,
    status: string,
    adminNotes?: string | null,
    rejectionReason?: string | null,
    userId?: string
) {
    const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
    };
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;
    if (rejectionReason !== undefined) updatePayload.rejection_reason = rejectionReason;

    const { error } = await supabase
        .from('refinance_applications')
        .update(updatePayload)
        .eq('id', id);
    if (error) throw error;

    // Send notification to user
    if (userId) {
        const statusLabels: Record<string, string> = {
            under_review: 'Your application is now under review.',
            documents_required: 'Additional documents are needed for your application.',
            approved: 'Congratulations! Your refinance application has been approved! 🎉',
            rejected: 'Unfortunately, your refinance application could not be approved.',
        };
        const body = statusLabels[status] || `Your application status has been updated to: ${status}`;
        await supabase.from('notifications').insert({
            user_id: userId,
            title: 'Application Update',
            body,
            type: 'offer',
            data: { screen: 'my-applications' },
        });
    }
}

// ── Loan Management ────────────────────────────────
export async function fetchLoans() {
    const { data: loans, error } = await supabase
        .from('user_loans')
        .select('*, profile:profiles!user_loans_user_id_fkey (id, first_name, last_name, full_name)')
        .order('created_at', { ascending: false });
    if (error) throw error;

    // Get emails for user display
    const { data: authData } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const emailMap: Record<string, string> = {};
    for (const u of authData?.users || []) {
        emailMap[u.id] = u.email || '';
    }

    return (loans || []).map((loan: any) => {
        const p = loan.profile;
        const name = p?.first_name
            ? `${p.first_name} ${p.last_name || ''}`.trim()
            : p?.full_name || null;
        const email = emailMap[loan.user_id] || '';
        return {
            ...loan,
            user_display: name || email || `User ${loan.user_id.slice(0, 8)}`,
            user_email: email,
        };
    });
}

export async function updateLoanStatus(id: string, status: string) {
    const { error } = await supabase
        .from('user_loans')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
    if (error) throw error;
}

export async function updateLoanDetails(id: string, updates: Record<string, unknown>) {
    updates.updated_at = new Date().toISOString();
    const { error } = await supabase.from('user_loans').update(updates).eq('id', id);
    if (error) throw error;
}

export async function deleteLoan(id: string) {
    const { error } = await supabase.from('user_loans').delete().eq('id', id);
    if (error) throw error;
}

export async function fetchApplicationStats() {
    const { data, error } = await supabase
        .from('refinance_applications')
        .select('status');
    if (error) throw error;
    const stats: Record<string, number> = {
        submitted: 0, under_review: 0, documents_required: 0, approved: 0, rejected: 0, total: 0,
    };
    for (const app of data || []) {
        stats.total++;
        if (stats[app.status] !== undefined) stats[app.status]++;
    }
    return stats;
}

// ── Analytics ───────────────────────────────────────
export async function fetchAnalyticsSummary() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [events24h, events7d, events30d, activeUsers24h, activeUsers7d] = await Promise.all([
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', last24h),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', last7d),
        supabase.from('analytics_events').select('*', { count: 'exact', head: true }).gte('created_at', last30d),
        supabase.from('analytics_events').select('user_id').gte('created_at', last24h),
        supabase.from('analytics_events').select('user_id').gte('created_at', last7d),
    ]);

    const uniqueUsers24h = new Set((activeUsers24h.data || []).map((e: { user_id: string }) => e.user_id)).size;
    const uniqueUsers7d = new Set((activeUsers7d.data || []).map((e: { user_id: string }) => e.user_id)).size;

    // Fetch Total Debt Tracked
    const { data: loansData, error: lErr } = await supabase.from('user_loans').select('remaining_amount');
    let totalDebtTracked = 0;
    if (!lErr && loansData) {
        totalDebtTracked = loansData.reduce((acc, curr) => acc + (curr.remaining_amount || 0), 0);
    }

    // Fetch Average Savings Offered (for accepted/completed or all visible)
    // We'll calculate based on refinance_offers for simplicity or applications
    const { data: offersData, error: oErr } = await supabase.from('refinance_offers').select('net_savings');
    let averageSavings = 0;
    if (!oErr && offersData && offersData.length > 0) {
        const total = offersData.reduce((acc, curr) => acc + (curr.net_savings || 0), 0);
        averageSavings = Math.round(total / offersData.length);
    }

    return {
        events24h: events24h.count ?? 0,
        events7d: events7d.count ?? 0,
        events30d: events30d.count ?? 0,
        activeUsers24h: uniqueUsers24h,
        activeUsers7d: uniqueUsers7d,
        totalDebtTracked,
        averageSavings
    };
}

export async function fetchTopEvents(days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from('analytics_events')
        .select('event_name')
        .gte('created_at', since);
    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const e of data || []) {
        counts[e.event_name] = (counts[e.event_name] || 0) + 1;
    }

    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
}

export async function fetchFunnel(days: number = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
        .from('analytics_events')
        .select('event_name, user_id')
        .in('event_name', ['screen_view', 'offer_viewed', 'offer_apply_started', 'offer_applied'])
        .gte('created_at', since);
    if (error) throw error;

    const funnel = {
        screenViews: new Set<string>(),
        offerViews: new Set<string>(),
        applyStarted: new Set<string>(),
        applied: new Set<string>(),
    };

    for (const e of data || []) {
        const uid = e.user_id;
        if (e.event_name === 'screen_view') funnel.screenViews.add(uid);
        if (e.event_name === 'offer_viewed') funnel.offerViews.add(uid);
        if (e.event_name === 'offer_apply_started') funnel.applyStarted.add(uid);
        if (e.event_name === 'offer_applied') funnel.applied.add(uid);
    }

    return {
        screenViews: funnel.screenViews.size,
        offerViews: funnel.offerViews.size,
        applyStarted: funnel.applyStarted.size,
        applied: funnel.applied.size,
    };
}

export async function fetchRecentEvents(limit: number = 50) {
    const { data, error } = await supabase
        .from('analytics_events')
        .select('id, user_id, event_name, screen, created_at, event_data')
        .order('created_at', { ascending: false })
        .limit(limit);
    if (error) throw error;
    return data || [];
}

// ── User Detail ─────────────────────────────────────
export async function fetchUserDetail(userId: string) {
    const [profile, loans, applications, events] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('user_loans').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase
            .from('refinance_applications')
            .select('*, bank_product:bank_products!refinance_applications_bank_product_id_fkey(name, bank:banks!bank_products_bank_id_fkey(name))')
            .eq('user_id', userId)
            .order('created_at', { ascending: false }),
        supabase
            .from('analytics_events')
            .select('event_name, screen, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(30),
    ]);

    return {
        profile: profile.data,
        loans: loans.data || [],
        applications: applications.data || [],
        recentActivity: events.data || [],
    };
}

// ── Document Vault ──────────────────────────────────
export async function fetchUserDocuments(appId: string, userId: string) {
    const { data, error } = await supabase.storage.from('user_documents').list(`${userId}/${appId}`);
    if (error) {
        console.error('No documents found or bucket missing:', error.message);
        return [];
    }
    return data || [];
}

export async function getDocumentSignedUrl(filepath: string, appId: string, userId: string) {
    const { data, error } = await supabase.storage
        .from('user_documents')
        .createSignedUrl(`${userId}/${appId}/${filepath}`, 3600); // 1 hour expiry
    if (error) throw error;
    return data.signedUrl;
}

// ── Manual Offers ───────────────────────────────────
export async function fetchRecentManualOffers() {
    const { data, error } = await supabase
        .from('refinance_offers')
        .select('*, bank:banks(name), application:applications(id, profile:profiles(first_name, last_name))')
        .order('created_at', { ascending: false })
        .limit(10);
    if (error) throw error;
    return data || [];
}

export async function createManualOffer(offerData: Record<string, unknown>) {
    const { data, error } = await supabase
        .from('refinance_offers')
        .insert(offerData)
        .select('*, bank:banks(name), application:applications(id, profile:profiles(first_name, last_name))')
        .single();
    if (error) throw error;
    return data;
}
