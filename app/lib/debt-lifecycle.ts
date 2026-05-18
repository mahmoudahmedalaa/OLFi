import { supabase } from '@/lib/supabase';

export const ACTIVE_APPLICATION_STATUSES = ['submitted', 'under_review', 'documents_required', 'approved'];

export async function getActiveDebtApplication(loanId: string, userId: string) {
    const { data, error } = await supabase
        .from('refinance_applications')
        .select('id, status, created_at')
        .eq('user_id', userId)
        .eq('user_loan_id', loanId)
        .in('status', ACTIVE_APPLICATION_STATUSES)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export function debtLockedMessage(status?: string | null) {
    const statusLabel = status ? status.replace(/_/g, ' ') : 'active';
    return `This debt is already linked to an ${statusLabel} refinance application. To keep your application tracker accurate, you cannot delete or materially edit it until OLFi closes the application or marks it rejected.`;
}
