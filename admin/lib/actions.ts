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
