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
    const { data, error } = await supabase.from('profiles').select('id, first_name, last_name, full_name');
    if (error) throw error;
    return (data || []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        name: p.first_name ? `${p.first_name} ${p.last_name || ''}`.trim() : (p.full_name as string) || 'User',
    }));
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
