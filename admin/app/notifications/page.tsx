'use client';
import { useEffect, useState } from 'react';
import {
    fetchNotifications, fetchUsersList,
    sendNotification, broadcastNotification, deleteNotification,
} from '@/lib/actions';

interface Notification {
    id: string; user_id: string; title: string; body: string;
    type: string; is_read: boolean; created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
    const [form, setForm] = useState({ user_id: '', title: '', body: '', type: 'info' });
    const [sending, setSending] = useState(false);
    const [broadcastMode, setBroadcastMode] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const [notifs, userList] = await Promise.all([fetchNotifications(), fetchUsersList()]);
        setNotifications(notifs as Notification[]);
        setUsers(userList);
        setLoading(false);
    };

    useEffect(() => { loadData(); }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        if (broadcastMode) {
            await broadcastNotification(form.title, form.body, form.type);
        } else {
            await sendNotification({ user_id: form.user_id, title: form.title, body: form.body, type: form.type });
        }
        setForm({ user_id: '', title: '', body: '', type: 'info' });
        setShowForm(false); setSending(false);
        loadData();
    };

    const handleDeleteNotif = async (id: string) => {
        await deleteNotification(id);
        loadData();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <button onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors">
                    {showForm ? 'Cancel' : '+ Send Notification'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSend} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8 space-y-4">
                    <div className="flex items-center gap-4 mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input type="radio" checked={!broadcastMode} onChange={() => setBroadcastMode(false)} className="accent-emerald-500" />
                            Single User
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input type="radio" checked={broadcastMode} onChange={() => setBroadcastMode(true)} className="accent-emerald-500" />
                            Broadcast to All
                        </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!broadcastMode && (
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">User *</label>
                                <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                                    <option value="">Select user...</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500">
                                {['info', 'offer', 'payment', 'document', 'system'].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Title *</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Body *</label>
                            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required rows={3}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none" />
                        </div>
                    </div>
                    <button type="submit" disabled={sending}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
                        {sending ? 'Sending...' : broadcastMode ? `Broadcast to ${users.length} Users` : 'Send Notification'}
                    </button>
                </form>
            )}

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Title</th>
                                <th className="text-left px-6 py-3 text-gray-400 font-medium">Body</th>
                                <th className="text-center px-6 py-3 text-gray-400 font-medium">Type</th>
                                <th className="text-center px-6 py-3 text-gray-400 font-medium">Read</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Date</th>
                                <th className="text-right px-6 py-3 text-gray-400 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {notifications.map((n) => (
                                <tr key={n.id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-6 py-4 font-medium max-w-[200px] truncate">{n.title}</td>
                                    <td className="px-6 py-4 text-gray-300 max-w-[300px] truncate">{n.body}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">{n.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {n.is_read ? '✓' : <span className="w-2 h-2 inline-block bg-emerald-400 rounded-full"></span>}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400">{new Date(n.created_at).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDeleteNotif(n.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {notifications.length === 0 && (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">No notifications sent yet</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
