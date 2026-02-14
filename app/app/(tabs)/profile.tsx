import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { supabase } from '@/lib/supabase';

interface Profile {
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    email: string | null;
    monthly_income: number | null;
    employment_type: string | null;
    nationality: string | null;
}

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { theme, mode, setMode } = useTheme();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, full_name, email, monthly_income, employment_type, nationality')
                .eq('id', user.id)
                .maybeSingle();
            if (error) throw error;
            setProfile(data || { first_name: null, last_name: null, full_name: null, email: user.email || null, monthly_income: null, employment_type: null, nationality: null });
        } catch (e) {
            console.error('Failed to fetch profile:', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            fetchProfile();
        }, [fetchProfile])
    );

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await signOut();
                    } catch (e: any) {
                        Alert.alert('Error', e.message);
                    }
                },
            },
        ]);
    };

    const displayName = (profile?.first_name && profile?.last_name)
        ? `${profile.first_name} ${profile.last_name}`
        : profile?.full_name || user?.email?.split('@')[0] || 'User';
    const displayEmail = profile?.email || user?.email || '';
    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => {
                            setRefreshing(true);
                            fetchProfile();
                        }}
                        tintColor={Colors.brand.emerald}
                    />
                }
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Profile
                    </Text>
                </View>

                {/* User Card */}
                <View style={{ paddingHorizontal: 20, marginBottom: 24, marginTop: 8 }}>
                    <LinearGradient
                        colors={theme.gradients.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: BorderRadius.xl,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.brand.emerald} style={{ paddingVertical: 16 }} />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                <LinearGradient
                                    colors={theme.gradients.brand}
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 28,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: '700',
                                            color: '#fff',
                                        }}
                                    >
                                        {initials}
                                    </Text>
                                </LinearGradient>
                                <View style={{ flex: 1 }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: '700',
                                            color: theme.colors.textPrimary,
                                        }}
                                    >
                                        {displayName}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            color: theme.colors.textSecondary,
                                            marginTop: 4,
                                        }}
                                    >
                                        {displayEmail}
                                    </Text>
                                    {profile?.employment_type && (
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: theme.colors.textTertiary,
                                                marginTop: 2,
                                            }}
                                        >
                                            {profile.employment_type}
                                            {profile.nationality ? ` • ${profile.nationality}` : ''}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        )}
                    </LinearGradient>
                </View>

                {/* Appearance Section */}
                <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: theme.colors.textTertiary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            marginBottom: 12,
                        }}
                    >
                        Appearance
                    </Text>
                    <View
                        style={{
                            flexDirection: 'row',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.md,
                            padding: 4,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        {(['light', 'dark', 'system'] as const).map((m) => {
                            const isActive = mode === m;
                            const icons = {
                                light: 'sunny' as const,
                                dark: 'moon' as const,
                                system: 'phone-portrait-outline' as const,
                            };
                            return (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => setMode(m)}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        paddingVertical: 10,
                                        borderRadius: BorderRadius.sm,
                                        backgroundColor: isActive
                                            ? Colors.brand.emerald
                                            : 'transparent',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={icons[m]}
                                        size={16}
                                        color={isActive ? '#fff' : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: isActive ? '#fff' : theme.colors.textSecondary,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {m}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Menu Sections */}
                <View style={{ paddingHorizontal: 20 }}>
                    <MenuSection
                        title="GENERAL"
                        items={[
                            { icon: 'person-outline', label: 'Edit Profile', onPress: () => { } },
                            { icon: 'notifications-outline', label: 'Notifications', onPress: () => { } },
                            { icon: 'lock-closed-outline', label: 'Security', onPress: () => { } },
                        ]}
                        theme={theme}
                    />
                    <MenuSection
                        title="SUPPORT"
                        items={[
                            { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => { } },
                            { icon: 'chatbubble-outline', label: 'Contact Us', onPress: () => { } },
                            { icon: 'document-text-outline', label: 'Privacy Policy', onPress: () => { } },
                        ]}
                        theme={theme}
                    />
                </View>

                {/* Sign Out */}
                <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                    <TouchableOpacity
                        onPress={handleSignOut}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: 16,
                            backgroundColor: `${Colors.error}10`,
                            borderRadius: BorderRadius.md,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: Colors.error,
                            }}
                        >
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Version */}
                <Text
                    style={{
                        fontSize: 12,
                        color: theme.colors.textTertiary,
                        textAlign: 'center',
                        marginTop: 24,
                    }}
                >
                    BuyOut v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function MenuSection({
    title,
    items,
    theme,
}: {
    title: string;
    items: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }[];
    theme: ReturnType<typeof useTheme>['theme'];
}) {
    return (
        <View style={{ marginBottom: 24 }}>
            <Text
                style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: theme.colors.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 12,
                }}
            >
                {title}
            </Text>
            <View
                style={{
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            >
                {items.map((item, i) => (
                    <TouchableOpacity
                        key={item.label}
                        onPress={item.onPress}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: i < items.length - 1 ? 1 : 0,
                            borderBottomColor: theme.colors.border,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={item.icon}
                            size={22}
                            color={theme.colors.textSecondary}
                            style={{ marginRight: 14 }}
                        />
                        <Text
                            style={{
                                flex: 1,
                                fontSize: 15,
                                fontWeight: '500',
                                color: theme.colors.textPrimary,
                            }}
                        >
                            {item.label}
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.textTertiary}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
