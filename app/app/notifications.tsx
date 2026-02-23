import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { Colors } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Notification {
    id: string;
    type: 'rate_alert' | 'offer' | 'payment_reminder' | 'system';
    title: string;
    body: string;
    data: any;
    is_read: boolean;
    created_at: string;
}

const iconMap: Record<string, { name: string; color: string }> = {
    rate_alert: { name: 'trending-down', color: '#F59E0B' },
    offer: { name: 'gift', color: Colors.brand.emerald },
    payment_reminder: { name: 'alarm', color: '#EF4444' },
    system: { name: 'information-circle', color: '#6366F1' },
};

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setNotifications(data || []);
        } catch (e) {
            console.error('Failed to fetch notifications:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [fetchNotifications])
    );

    const markAsRead = async (id: string) => {
        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (e) {
            console.error('Failed to mark notification as read:', e);
        }
    };

    const markAllRead = async () => {
        if (!user) return;
        try {
            await supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);
            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;

    const formatTime = (iso: string) => {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        if (diffDays < 7) return `${diffDays}d ago`;
        return d.toLocaleDateString('en-AE', { month: 'short', day: 'numeric' });
    };

    const handlePress = (notification: Notification) => {
        markAsRead(notification.id);
        // Navigate based on type
        if (notification.type === 'offer' && notification.data?.product_id) {
            router.push({ pathname: '/offer-details' as any, params: { productId: notification.data.product_id } });
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                    Notifications
                </Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllRead}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>
                            Mark All Read
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.brand.emerald} />
                    <Text style={{ fontSize: 13, fontWeight: '500', color: Colors.brand.teal, fontStyle: 'italic', marginTop: 12, letterSpacing: 0.3 }}>your debt, rewritten</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 32, flexGrow: 1 }}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchNotifications(); }}
                            tintColor={Colors.brand.emerald}
                        />
                    }
                    ListEmptyComponent={
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 }}>
                            <Ionicons name="notifications-off-outline" size={48} color={theme.colors.textTertiary} />
                            <Text style={{ fontSize: 17, fontWeight: '600', color: theme.colors.textPrimary, marginTop: 16 }}>
                                No notifications yet
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 4 }}>
                                We&apos;ll notify you about better rates and offers
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const icon = iconMap[item.type] || iconMap.system;
                        return (
                            <TouchableOpacity
                                onPress={() => handlePress(item)}
                                activeOpacity={0.7}
                                style={{
                                    flexDirection: 'row',
                                    paddingHorizontal: 20,
                                    paddingVertical: 16,
                                    backgroundColor: item.is_read ? 'transparent' : `${Colors.brand.emerald}08`,
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.colors.border,
                                }}
                            >
                                {/* Icon */}
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: `${icon.color}15`,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 14,
                                }}>
                                    <Ionicons name={icon.name as any} size={20} color={icon.color} />
                                </View>

                                {/* Content */}
                                <View style={{ flex: 1 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <Text style={{
                                            fontSize: 15,
                                            fontWeight: item.is_read ? '500' : '600',
                                            color: theme.colors.textPrimary,
                                            flex: 1,
                                            marginRight: 8,
                                        }}>
                                            {item.title}
                                        </Text>
                                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                                            {formatTime(item.created_at)}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.textSecondary,
                                            marginTop: 4,
                                            lineHeight: 18,
                                        }}
                                        numberOfLines={2}
                                    >
                                        {item.body}
                                    </Text>
                                </View>

                                {/* Unread dot */}
                                {!item.is_read && (
                                    <View style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: Colors.brand.emerald,
                                        alignSelf: 'center',
                                        marginLeft: 8,
                                    }} />
                                )}
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}
