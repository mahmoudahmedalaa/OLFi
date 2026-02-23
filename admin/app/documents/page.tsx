'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchApplications, fetchUserDocuments, getDocumentSignedUrl } from '@/lib/actions';

export default function DocumentVaultPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<any | null>(null);
    const [documents, setDocuments] = useState<any[]>([]);
    const [docsLoading, setDocsLoading] = useState(false);
    const [activeDocUrl, setActiveDocUrl] = useState<string | null>(null);

    const loadApps = useCallback(async () => {
        try {
            const data = await fetchApplications();
            // Only show apps that might have documents
            setApplications(data.filter((a: any) =>
                ['submitted', 'under_review', 'documents_required', 'approved'].includes(a.status)
            ));
        } catch (e) {
            console.error('Failed to load applications:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadApps();
    }, [loadApps]);

    const loadDocuments = async (appId: string, userId: string) => {
        setDocsLoading(true);
        setActiveDocUrl(null);
        try {
            // Fetch documents through server action to bypass client-side env variable issues
            const data = await fetchUserDocuments(appId, userId);
            setDocuments(data || []);
        } catch (e) {
            console.error('Failed to load documents:', e);
            setDocuments([]);
        } finally {
            setDocsLoading(false);
        }
    };

    const handleSelectApp = (app: any) => {
        setSelectedApp(app);
        loadDocuments(app.id, app.user_id);
    };

    const getDocUrl = async (filepath: string) => {
        if (!selectedApp) return;
        try {
            const signedUrl = await getDocumentSignedUrl(filepath, selectedApp.id, selectedApp.user_id);
            setActiveDocUrl(signedUrl);
        } catch (e) {
            console.error('Failed to get signed URL:', e);
            alert('Could not load document preview.');
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
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Left Sidebar - Applications List */}
            <div className="w-1/3 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                    <h2 className="text-lg font-bold">Applications</h2>
                    <p className="text-xs text-gray-400">Select an application to view documents</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {applications.map((app) => (
                        <button
                            key={app.id}
                            onClick={() => handleSelectApp(app)}
                            className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedApp?.id === app.id
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-gray-200">
                                    {app.profile?.first_name || 'User'} {app.profile?.last_name || ''}
                                </span>
                                <span className="text-xs px-2 py-1 rounded bg-gray-950 text-gray-400">
                                    {app.status}
                                </span>
                            </div>
                            <div className="text-xs text-gray-400">
                                <p>Bank: {app.bank_product?.bank?.name || 'Unknown'}</p>
                                <p className="mt-1 opacity-70">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </button>
                    ))}
                    {applications.length === 0 && (
                        <p className="text-center text-sm text-gray-500 mt-10">No applications pending review.</p>
                    )}
                </div>
            </div>

            {/* Right Pane - Document Viewer */}
            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl flex flex-col overflow-hidden">
                {!selectedApp ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <span className="text-4xl mb-4">📂</span>
                        <p>Select an application to view its documents.</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold">Document Vault</h2>
                                <p className="text-xs text-gray-400">
                                    App ID: <span className="font-mono">{selectedApp.id.split('-')[0]}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-1 overflow-hidden">
                            {/* Document List */}
                            <div className="w-1/3 border-r border-gray-800 flex flex-col p-4 space-y-2 overflow-y-auto">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Uploaded Files</h3>

                                {docsLoading ? (
                                    <div className="flex items-center justify-center p-8">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                                    </div>
                                ) : documents.length > 0 ? (
                                    documents.map((doc, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => getDocUrl(doc.name)}
                                            className="text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors border border-gray-700 flex items-center gap-3"
                                        >
                                            <span className="text-xl">📄</span>
                                            <div className="flex-1 truncate">
                                                <p className="text-sm font-medium text-gray-200 truncate">{doc.name}</p>
                                                <p className="text-xs text-gray-500">{(doc.metadata?.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-800 border-dashed">
                                        <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                                        <p className="text-xs text-gray-600 mt-1">Users can upload requirements from the app.</p>
                                    </div>
                                )}
                            </div>

                            {/* Viewer */}
                            <div className="flex-1 bg-gray-950 flex flex-col">
                                {activeDocUrl ? (
                                    <iframe
                                        src={activeDocUrl}
                                        className="w-full flex-1 border-none"
                                        title="Document Preview"
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
                                        <p>Select a document from the list to preview it here.</p>
                                        <p className="text-xs mt-2">Supports PDF, PNG, JPG</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
