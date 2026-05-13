'use server';

import { supabase } from '@/lib/supabase';

type ProfileSummary = {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    full_name?: string | null;
};

type LoanWithProfile = {
    id: string;
    user_id: string;
    bank_name: string | null;
    loan_type: string;
    original_amount: number | string | null;
    remaining_amount: number | string | null;
    interest_rate: number | string | null;
    monthly_emi: number | string | null;
    tenure_months: number | string | null;
    start_date: string | null;
    status: string;
    created_at: string;
    profile?: ProfileSummary | null;
    [key: string]: unknown;
};

export type AdminLoan = {
    id: string;
    user_id: string;
    bank_name: string | null;
    loan_type: string;
    original_amount: number | string | null;
    remaining_amount: number | string | null;
    interest_rate: number | string | null;
    monthly_emi: number | string | null;
    tenure_months: number | string | null;
    start_date: string | null;
    status: string;
    created_at: string;
    profile?: ProfileSummary | null;
    user_display: string;
    user_email: string;
};

type RecentApplicationSummary = {
    id: string;
    status: string;
    monthly_savings: number | string | null;
    total_savings: number | string | null;
    created_at: string;
    profile?: ProfileSummary | null;
    bank_product?: {
        name?: string | null;
        bank?: { name?: string | null } | null;
    } | null;
};

export type AdminApplicationDocument = {
    id: string;
    user_id: string;
    application_id: string | null;
    document_type: string;
    file_name: string | null;
    status: string;
    notes: string | null;
    storage_bucket: string | null;
    storage_path: string | null;
    file_url: string;
    mime_type: string | null;
    file_size: number | null;
    created_at: string;
    updated_at: string | null;
};

export type AdminApplicationEvent = {
    id: string;
    application_id: string;
    user_id: string;
    event_type: string;
    status: string | null;
    title: string;
    body: string | null;
    actor_type: string;
    created_at: string;
};

type ActionResult<T> =
    | { data: T; error: null }
    | { data: null; error: string };

function getSafeErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message?: unknown }).message);
    }
    return 'Unknown admin data error.';
}

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
    const { data: applications, error } = await supabase
        .from('refinance_applications')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;

    const rows = applications || [];
    if (rows.length === 0) return [];

    const userIds = [...new Set(rows.map((app) => app.user_id).filter(Boolean))];
    const loanIds = [...new Set(rows.map((app) => app.user_loan_id).filter(Boolean))];
    const productIds = [...new Set(rows.map((app) => app.bank_product_id).filter(Boolean))];

    const [profiles, loans, products] = await Promise.all([
        userIds.length
            ? supabase.from('profiles').select('id, first_name, last_name, full_name, phone, salary, employer, kyc_status').in('id', userIds)
            : Promise.resolve({ data: [], error: null }),
        loanIds.length
            ? supabase.from('user_loans').select('id, bank_name, loan_type, original_amount, remaining_amount, interest_rate, monthly_emi, tenure_months, start_date, end_date, status').in('id', loanIds)
            : Promise.resolve({ data: [], error: null }),
        productIds.length
            ? supabase.from('bank_products').select('id, name, bank_id, product_type, interest_rate_min, interest_rate_max, min_amount, max_amount, min_tenure_months, max_tenure_months, processing_fee_pct, early_settlement_fee_pct, requires_salary_transfer, features, is_active').in('id', productIds)
            : Promise.resolve({ data: [], error: null }),
    ]);

    if (profiles.error) throw profiles.error;
    if (loans.error) throw loans.error;
    if (products.error) throw products.error;

    const bankIds = [...new Set((products.data || []).map((product) => product.bank_id).filter(Boolean))];
    const banks = bankIds.length
        ? await supabase.from('banks').select('id, name, is_islamic, min_salary, website_url').in('id', bankIds)
        : { data: [], error: null };
    if (banks.error) throw banks.error;

    const profileById = new Map((profiles.data || []).map((profile) => [profile.id, profile]));
    const loanById = new Map((loans.data || []).map((loan) => [loan.id, loan]));
    const bankById = new Map((banks.data || []).map((bank) => [bank.id, bank]));
    const productById = new Map((products.data || []).map((product) => [
        product.id,
        { ...product, bank: product.bank_id ? bankById.get(product.bank_id) || null : null },
    ]));

    return rows.map((app) => ({
        ...app,
        profile: profileById.get(app.user_id) || null,
        user_loan: loanById.get(app.user_loan_id) || null,
        bank_product: productById.get(app.bank_product_id) || null,
    }));
}

export async function fetchApplicationsResult(): Promise<ActionResult<Awaited<ReturnType<typeof fetchApplications>>>> {
    try {
        const data = await fetchApplications();
        return { data, error: null };
    } catch (error) {
        return { data: null, error: getSafeErrorMessage(error) };
    }
}

async function recordApplicationEvent(payload: {
    applicationId: string;
    userId: string;
    eventType: 'status_update' | 'document_request' | 'document_received' | 'document_verified' | 'document_rejected' | 'admin_note';
    title: string;
    body?: string | null;
    status?: string | null;
    metadata?: Record<string, unknown>;
}) {
    const { error } = await supabase.from('application_events').insert({
        application_id: payload.applicationId,
        user_id: payload.userId,
        event_type: payload.eventType,
        title: payload.title,
        body: payload.body ?? null,
        status: payload.status ?? null,
        actor_type: 'admin',
        metadata: payload.metadata ?? {},
    });
    if (error) throw error;
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

    const eventCopy: Record<string, { title: string; body: string; type: 'status_update' | 'document_request' }> = {
        under_review: {
            title: 'Review started',
            body: adminNotes || 'The bank is reviewing this refinance application.',
            type: 'status_update',
        },
        documents_required: {
            title: 'Documents requested',
            body: adminNotes || 'Additional documents are needed before review can continue.',
            type: 'document_request',
        },
        approved: {
            title: 'Application approved',
            body: adminNotes || 'The bank approved this refinance application.',
            type: 'status_update',
        },
        rejected: {
            title: 'Application not approved',
            body: rejectionReason || 'The bank could not proceed with this refinance application.',
            type: 'status_update',
        },
    };

    if (userId && eventCopy[status]) {
        await recordApplicationEvent({
            applicationId: id,
            userId,
            eventType: eventCopy[status].type,
            title: eventCopy[status].title,
            body: eventCopy[status].body,
            status,
        });
    }

    // Send notification to user
    if (userId) {
        const statusLabels: Record<string, string> = {
            under_review: 'Your application is now under review.',
            documents_required: 'Additional documents are needed for your application.',
            approved: 'Your refinance application has been approved.',
            rejected: 'Unfortunately, your refinance application could not be approved.',
        };
        const body = statusLabels[status] || `Your application status has been updated to: ${status}`;
        await supabase.from('notifications').insert({
            user_id: userId,
            title: 'Application Update',
            body,
            type: status === 'documents_required' ? 'document' : 'offer',
            data: { screen: 'my-applications', application_id: id },
            application_id: id,
        });
    }
}

export async function fetchApplicationDocuments(applicationId: string): Promise<AdminApplicationDocument[]> {
    const { data, error } = await supabase
        .from('user_documents')
        .select('id, user_id, application_id, document_type, file_name, status, notes, storage_bucket, storage_path, file_url, mime_type, file_size, created_at, updated_at')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as AdminApplicationDocument[];
}

export async function fetchApplicationEvents(applicationId: string): Promise<AdminApplicationEvent[]> {
    const { data, error } = await supabase
        .from('application_events')
        .select('id, application_id, user_id, event_type, status, title, body, actor_type, created_at')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as AdminApplicationEvent[];
}

export async function updateApplicationDocumentStatus(
    documentId: string,
    status: 'verified' | 'rejected' | 'pending',
    notes?: string | null
) {
    const { data: document, error: fetchError } = await supabase
        .from('user_documents')
        .select('id, user_id, application_id, document_type, file_name')
        .eq('id', documentId)
        .single();
    if (fetchError) throw fetchError;

    const { error } = await supabase
        .from('user_documents')
        .update({
            status,
            notes: notes ?? null,
            updated_at: new Date().toISOString(),
        })
        .eq('id', documentId);
    if (error) throw error;

    if (document.application_id) {
        const documentLabel = String(document.document_type).replace(/_/g, ' ');
        const eventType = status === 'verified' ? 'document_verified' : status === 'rejected' ? 'document_rejected' : 'document_received';
        const title = status === 'verified'
            ? 'Document accepted'
            : status === 'rejected'
                ? 'Document needs replacement'
                : 'Document marked pending';
        const body = notes || `${documentLabel} was marked ${status}.`;

        await recordApplicationEvent({
            applicationId: document.application_id,
            userId: document.user_id,
            eventType,
            title,
            body,
            metadata: { document_id: document.id, document_type: document.document_type, file_name: document.file_name },
        });

        await supabase.from('notifications').insert({
            user_id: document.user_id,
            title,
            body,
            type: 'document',
            data: { screen: 'my-applications', application_id: document.application_id, document_id: document.id },
            application_id: document.application_id,
        });
    }
}

// ── Loan Management ────────────────────────────────
export async function fetchLoans(): Promise<AdminLoan[]> {
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

    return ((loans || []) as LoanWithProfile[]).map((loan) => {
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
        applications: (applications.data || []) as RecentApplicationSummary[],
        recentActivity: events.data || [],
    };
}

// ── Document Vault ──────────────────────────────────
export async function fetchUserDocuments(appId: string, userId: string): Promise<AdminApplicationDocument[]> {
    const { data, error } = await supabase
        .from('user_documents')
        .select('id, user_id, application_id, document_type, file_name, status, notes, storage_bucket, storage_path, file_url, mime_type, file_size, created_at, updated_at')
        .eq('user_id', userId)
        .eq('application_id', appId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as AdminApplicationDocument[];
}

export async function getDocumentSignedUrl(storagePath: string, bucket = 'user-documents') {
    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, 3600); // 1 hour expiry
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

// ── Waitlist ────────────────────────────────────────
export async function fetchWaitlist() {
    const { data, error } = await supabase.from('waitlist').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}
