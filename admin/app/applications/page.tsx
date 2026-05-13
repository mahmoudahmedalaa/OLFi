'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
    fetchApplicationDocuments,
    fetchApplicationEvents,
    fetchApplications,
    getDocumentSignedUrl,
    updateApplicationDocumentStatus,
    updateApplicationStatus,
    type AdminApplicationDocument,
    type AdminApplicationEvent,
} from '@/lib/actions';

type Application = Awaited<ReturnType<typeof fetchApplications>>[number];
type ActionType = 'review' | 'docs' | 'approve' | 'reject';

const STATUS_COLORS: Record<string, string> = {
    submitted: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    under_review: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    documents_required: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
    approved: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-300 border-red-500/20',
};

const STATUS_LABELS: Record<string, string> = {
    submitted: 'Submitted',
    under_review: 'Under Review',
    documents_required: 'Docs Required',
    approved: 'Approved',
    rejected: 'Rejected',
};

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'action_needed', label: 'Action Needed' },
    { key: 'submitted', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
];

function getUserName(app: Application) {
    return app.profile?.first_name
        ? `${app.profile.first_name} ${app.profile.last_name || ''}`.trim()
        : app.profile?.full_name || 'User';
}

function formatCurrency(value: unknown) {
    return `AED ${Number(value || 0).toLocaleString()}`;
}

function formatDocumentType(type: string) {
    return type
        .split('_')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
    const [documents, setDocuments] = useState<AdminApplicationDocument[]>([]);
    const [events, setEvents] = useState<AdminApplicationEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [actionModal, setActionModal] = useState<{ type: ActionType; app: Application } | null>(null);
    const [documentModal, setDocumentModal] = useState<{ status: 'verified' | 'rejected' | 'pending'; document: AdminApplicationDocument } | null>(null);
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const selectedApp = applications.find((app) => app.id === selectedAppId) || null;

    const load = useCallback(async () => {
        try {
            setLoadError(null);
            const data = await fetchApplications();
            setApplications(data);
            setSelectedAppId((current) => current || data[0]?.id || null);
        } catch (e) {
            console.error('Failed to load applications:', e);
            setLoadError(e instanceof Error ? e.message : 'Failed to load applications.');
        } finally {
            setLoading(false);
        }
    }, []);

    const loadDetails = useCallback(async (appId: string) => {
        setDetailsLoading(true);
        try {
            const [docs, eventRows] = await Promise.all([
                fetchApplicationDocuments(appId),
                fetchApplicationEvents(appId),
            ]);
            setDocuments(docs);
            setEvents(eventRows);
        } catch (e) {
            console.error('Failed to load application details:', e);
            setDocuments([]);
            setEvents([]);
        } finally {
            setDetailsLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        if (selectedAppId) {
            loadDetails(selectedAppId);
        }
    }, [selectedAppId, loadDetails]);

    const stats = useMemo(() => ({
        total: applications.length,
        action_needed: applications.filter((app) => app.status === 'documents_required').length,
        submitted: applications.filter((app) => app.status === 'submitted').length,
        under_review: applications.filter((app) => app.status === 'under_review').length,
        approved: applications.filter((app) => app.status === 'approved').length,
        rejected: applications.filter((app) => app.status === 'rejected').length,
    }), [applications]);

    const filtered = useMemo(() => {
        if (filter === 'all') return applications;
        if (filter === 'action_needed') return applications.filter((app) => app.status === 'documents_required');
        return applications.filter((app) => app.status === filter);
    }, [applications, filter]);

    const handleAction = async () => {
        if (!actionModal) return;
        setSaving(true);
        try {
            const statusMap: Record<ActionType, string> = {
                review: 'under_review',
                docs: 'documents_required',
                approve: 'approved',
                reject: 'rejected',
            };
            await updateApplicationStatus(
                actionModal.app.id,
                statusMap[actionModal.type],
                actionModal.type === 'docs' || actionModal.type === 'review' || actionModal.type === 'approve' ? notes || null : undefined,
                actionModal.type === 'reject' ? notes : undefined,
                actionModal.app.user_id
            );
            setActionModal(null);
            setNotes('');
            await load();
            await loadDetails(actionModal.app.id);
        } catch (e) {
            console.error('Failed to update application:', e);
            alert('Failed to update application.');
        } finally {
            setSaving(false);
        }
    };

    const handleDocumentStatus = async () => {
        if (!documentModal) return;
        setSaving(true);
        try {
            await updateApplicationDocumentStatus(documentModal.document.id, documentModal.status, notes || null);
            setDocumentModal(null);
            setNotes('');
            if (selectedAppId) await loadDetails(selectedAppId);
        } catch (e) {
            console.error('Failed to update document:', e);
            alert('Failed to update document.');
        } finally {
            setSaving(false);
        }
    };

    const openDocument = async (document: AdminApplicationDocument) => {
        const storagePath = document.storage_path || document.file_url;
        const bucket = document.storage_bucket || 'user-documents';
        try {
            const signedUrl = await getDocumentSignedUrl(storagePath, bucket);
            window.open(signedUrl, '_blank', 'noopener,noreferrer');
        } catch (e) {
            console.error('Failed to open document:', e);
            alert('Could not open document.');
        }
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
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Application Operations</h1>
                    <p className="text-sm text-gray-400 mt-1">Review applications, request documents, and update users from one queue.</p>
                </div>
                <button
                    onClick={load}
                    className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-sm text-gray-300 hover:bg-gray-800"
                >
                    Refresh
                </button>
            </div>

            {loadError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    <p className="font-semibold">Could not load applications.</p>
                    <p className="mt-1 text-red-100/80">{loadError}</p>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[
                    { label: 'Total', value: stats.total, color: 'text-white' },
                    { label: 'Action', value: stats.action_needed, color: 'text-orange-300' },
                    { label: 'Submitted', value: stats.submitted, color: 'text-blue-300' },
                    { label: 'Review', value: stats.under_review, color: 'text-amber-300' },
                    { label: 'Approved', value: stats.approved, color: 'text-emerald-300' },
                    { label: 'Rejected', value: stats.rejected, color: 'text-red-300' },
                ].map((item) => (
                    <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((item) => (
                    <button
                        key={item.key}
                        onClick={() => setFilter(item.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === item.key
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200 hover:bg-gray-800'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)] gap-6">
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                        <h2 className="font-semibold">Queue</h2>
                        <span className="text-xs text-gray-500">{filtered.length} shown</span>
                    </div>
                    <div className="divide-y divide-gray-800">
                        {filtered.map((app) => {
                            const productInfo = app.bank_product
                                ? `${app.bank_product.bank?.name || ''} ${app.bank_product.name}`.trim()
                                : 'No product';
                            const loanInfo = app.user_loan
                                ? `${app.user_loan.bank_name || 'Bank'} ${app.user_loan.loan_type}`.replace(/_/g, ' ')
                                : 'No loan';
                            const isSelected = selectedAppId === app.id;

                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`w-full text-left px-5 py-4 transition-colors ${isSelected ? 'bg-emerald-500/10' : 'hover:bg-gray-800/50'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[app.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                                    {STATUS_LABELS[app.status] || app.status}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(app.updated_at || app.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                            <p className="font-semibold truncate">{getUserName(app)}</p>
                                            <p className="text-sm text-gray-400 truncate">{loanInfo} to {productInfo}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-emerald-300 font-semibold">{formatCurrency(app.monthly_savings)}/mo</p>
                                            <p className="text-xs text-gray-500 mt-1">{app.new_rate}% new rate</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                        {filtered.length === 0 && (
                            <div className="px-6 py-10 text-center text-gray-500">No applications in this queue.</div>
                        )}
                    </div>
                </div>

                <aside className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden min-h-[620px]">
                    {!selectedApp ? (
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select an application to review.
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="px-5 py-4 border-b border-gray-800">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Selected Application</p>
                                        <h2 className="text-lg font-bold mt-1">{getUserName(selectedApp)}</h2>
                                        <p className="text-sm text-gray-400 mt-1 font-mono">{selectedApp.id.slice(0, 8)}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full border text-xs font-medium ${STATUS_COLORS[selectedApp.status] || 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                                        {STATUS_LABELS[selectedApp.status] || selectedApp.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 space-y-5 overflow-y-auto">
                                <section className="grid grid-cols-2 gap-3">
                                    <InfoTile label="Monthly Savings" value={formatCurrency(selectedApp.monthly_savings)} tone="text-emerald-300" />
                                    <InfoTile label="Total Savings" value={formatCurrency(selectedApp.total_savings)} tone="text-emerald-300" />
                                    <InfoTile label="New Rate" value={`${selectedApp.new_rate}%`} />
                                    <InfoTile label="New EMI" value={formatCurrency(selectedApp.new_emi)} />
                                </section>

                                <section className="bg-gray-950/60 border border-gray-800 rounded-xl p-4">
                                    <h3 className="text-sm font-semibold mb-3">Workflow Actions</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <ActionButton label="Start Review" tone="amber" disabled={selectedApp.status === 'under_review'} onClick={() => { setNotes(''); setActionModal({ type: 'review', app: selectedApp }); }} />
                                        <ActionButton label="Request Docs" tone="orange" onClick={() => { setNotes(''); setActionModal({ type: 'docs', app: selectedApp }); }} />
                                        <ActionButton label="Approve" tone="emerald" disabled={selectedApp.status === 'approved'} onClick={() => { setNotes(''); setActionModal({ type: 'approve', app: selectedApp }); }} />
                                        <ActionButton label="Reject" tone="red" disabled={selectedApp.status === 'rejected'} onClick={() => { setNotes(''); setActionModal({ type: 'reject', app: selectedApp }); }} />
                                    </div>
                                </section>

                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold">Documents</h3>
                                        {detailsLoading && <span className="text-xs text-gray-500">Loading...</span>}
                                    </div>
                                    <div className="space-y-2">
                                        {documents.map((document) => (
                                            <div key={document.id} className="bg-gray-950/60 border border-gray-800 rounded-xl p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="font-medium truncate">{document.file_name || formatDocumentType(document.document_type)}</p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {formatDocumentType(document.document_type)} · {document.status} · {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'size unknown'}
                                                        </p>
                                                        {document.notes && <p className="text-xs text-gray-400 mt-2">{document.notes}</p>}
                                                    </div>
                                                    <button onClick={() => openDocument(document)} className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-300 hover:bg-gray-700">
                                                        Open
                                                    </button>
                                                </div>
                                                <div className="flex gap-2 mt-3">
                                                    <button onClick={() => { setNotes(''); setDocumentModal({ status: 'verified', document }); }} className="px-2 py-1 rounded text-xs bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20">
                                                        Accept
                                                    </button>
                                                    <button onClick={() => { setNotes(''); setDocumentModal({ status: 'rejected', document }); }} className="px-2 py-1 rounded text-xs bg-red-500/10 text-red-300 hover:bg-red-500/20">
                                                        Reject
                                                    </button>
                                                    <button onClick={() => { setNotes(''); setDocumentModal({ status: 'pending', document }); }} className="px-2 py-1 rounded text-xs bg-gray-800 text-gray-300 hover:bg-gray-700">
                                                        Mark Pending
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {documents.length === 0 && (
                                            <div className="border border-dashed border-gray-800 rounded-xl p-5 text-center text-sm text-gray-500">
                                                No uploaded documents for this application yet.
                                            </div>
                                        )}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-semibold mb-3">Timeline</h3>
                                    <div className="space-y-3">
                                        {events.map((event) => (
                                            <div key={event.id} className="flex gap-3">
                                                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium">{event.title}</p>
                                                    {event.body && <p className="text-xs text-gray-400 mt-1">{event.body}</p>}
                                                    <p className="text-xs text-gray-600 mt-1">{new Date(event.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {events.length === 0 && (
                                            <p className="text-sm text-gray-500">No timeline events yet. New status and document actions will appear here.</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {actionModal && (
                <Modal title={getActionTitle(actionModal.type)}>
                    {(actionModal.type === 'docs' || actionModal.type === 'reject' || actionModal.type === 'review' || actionModal.type === 'approve') && (
                        <textarea
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-emerald-500"
                            rows={4}
                            placeholder={getActionPlaceholder(actionModal.type)}
                        />
                    )}
                    <ModalActions
                        saving={saving}
                        confirmLabel="Save Update"
                        confirmDisabled={saving || ((actionModal.type === 'docs' || actionModal.type === 'reject') && !notes.trim())}
                        onCancel={() => { setActionModal(null); setNotes(''); }}
                        onConfirm={handleAction}
                        tone={actionModal.type}
                    />
                </Modal>
            )}

            {documentModal && (
                <Modal title={`${documentModal.status === 'verified' ? 'Accept' : documentModal.status === 'rejected' ? 'Reject' : 'Mark Pending'} Document`}>
                    <p className="text-sm text-gray-400 mb-3">
                        {documentModal.document.file_name || formatDocumentType(documentModal.document.document_type)}
                    </p>
                    <textarea
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-emerald-500"
                        rows={3}
                        placeholder="Optional note for the user or internal record..."
                    />
                    <ModalActions
                        saving={saving}
                        confirmLabel="Update Document"
                        onCancel={() => { setDocumentModal(null); setNotes(''); }}
                        onConfirm={handleDocumentStatus}
                        tone={documentModal.status === 'verified' ? 'approve' : documentModal.status === 'rejected' ? 'reject' : 'review'}
                    />
                </Modal>
            )}
        </div>
    );
}

function InfoTile({ label, value, tone = 'text-white' }: { label: string; value: string; tone?: string }) {
    return (
        <div className="bg-gray-950/60 border border-gray-800 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className={`font-semibold ${tone}`}>{value}</p>
        </div>
    );
}

function ActionButton({ label, tone, disabled, onClick }: { label: string; tone: 'amber' | 'orange' | 'emerald' | 'red'; disabled?: boolean; onClick: () => void }) {
    const tones = {
        amber: 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20',
        orange: 'bg-orange-500/10 text-orange-300 hover:bg-orange-500/20',
        emerald: 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20',
        red: 'bg-red-500/10 text-red-300 hover:bg-red-500/20',
    };
    return (
        <button disabled={disabled} onClick={onClick} className={`px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed ${tones[tone]}`}>
            {label}
        </button>
    );
}

function Modal({ title, children }: { title: string; children: ReactNode }) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg">
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
}

function ModalActions({
    saving,
    confirmLabel,
    confirmDisabled,
    onCancel,
    onConfirm,
    tone,
}: {
    saving: boolean;
    confirmLabel: string;
    confirmDisabled?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    tone: ActionType;
}) {
    const toneClass = tone === 'reject'
        ? 'bg-red-500 hover:bg-red-600'
        : tone === 'docs'
            ? 'bg-orange-500 hover:bg-orange-600'
            : tone === 'review'
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-emerald-500 hover:bg-emerald-600';
    return (
        <div className="flex gap-3 justify-end mt-5">
            <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm bg-gray-800 text-gray-300 hover:bg-gray-700">
                Cancel
            </button>
            <button onClick={onConfirm} disabled={confirmDisabled || saving} className={`px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 ${toneClass}`}>
                {saving ? 'Saving...' : confirmLabel}
            </button>
        </div>
    );
}

function getActionTitle(type: ActionType) {
    if (type === 'review') return 'Start Bank Review';
    if (type === 'docs') return 'Request Documents';
    if (type === 'approve') return 'Approve Application';
    return 'Reject Application';
}

function getActionPlaceholder(type: ActionType) {
    if (type === 'docs') return 'Example: Please upload latest salary certificate and 3 months of bank statements.';
    if (type === 'reject') return 'Explain the decision clearly and professionally.';
    if (type === 'approve') return 'Optional approval note for the user.';
    return 'Optional note about what is being reviewed.';
}
