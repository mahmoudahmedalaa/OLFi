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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius, Typography, Spacing } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { supabase } from '@/lib/supabase';
import { ComingSoonCards } from '@/components/coming-soon-modal';
import { hapticLight, hapticWarning } from '@/lib/haptics';
import GlassHeader from '@/components/ui/GlassHeader';

interface Profile {
    first_name: string | null;
    last_name: string | null;
    full_name: string | null;
    email: string | null;
    salary: number | null;
}

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { theme, mode, setMode } = useTheme();
    const { language, setLanguage } = useLanguage();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, full_name, salary')
                .eq('id', user.id)
                .maybeSingle();
            if (error) throw error;
            if (data) {
                setProfile({ ...data, email: user.email || null });
            } else {
                setProfile({ first_name: null, last_name: null, full_name: null, email: user.email || null, salary: null });
            }
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
        hapticWarning();
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

    const handleDeleteAccount = () => {
        hapticWarning();
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be cleared.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { error } = await supabase.rpc('delete_user_account');
                            if (error) throw error;
                            await signOut();
                            Alert.alert('Account Deleted', 'Your account has been completely removed.');
                        } catch (e: any) {
                            Alert.alert('Error', e.message);
                        }
                    },
                },
            ]
        );
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
        <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Glass Header */}
            <GlassHeader>
                <Text
                    style={{
                        ...Typography.h1,
                        color: theme.colors.textPrimary,
                    }}
                >
                    Profile
                </Text>
            </GlassHeader>

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120, paddingTop: Spacing.lg }}
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

                {/* User Card */}
                <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing['2xl'], marginTop: Spacing.sm }}>
                    <LinearGradient
                        colors={theme.gradients.card}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            borderRadius: BorderRadius.xl,
                            padding: Spacing['2xl'],
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator color={Colors.brand.emerald} style={{ paddingVertical: Spacing.lg }} />
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.lg }}>
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
                                    onPress={() => { hapticLight(); setMode(m); }}
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

                    {/* Language Toggle */}
                    <Text
                        style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: theme.colors.textTertiary,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            marginTop: 16,
                            marginBottom: 12,
                        }}
                    >
                        Language / اللغة
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
                        {(['en', 'ar'] as const).map((lang) => {
                            const isActive = language === lang;
                            const label = lang === 'en' ? 'English' : 'العربية';
                            const icon = lang === 'en' ? 'language-outline' : 'text-outline';
                            return (
                                <TouchableOpacity
                                    key={lang}
                                    onPress={async () => {
                                        hapticLight();
                                        await setLanguage(lang);
                                    }}
                                    style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 6,
                                        paddingVertical: 10,
                                        borderRadius: BorderRadius.sm,
                                        backgroundColor: isActive ? Colors.brand.teal : 'transparent',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name={icon as any}
                                        size={16}
                                        color={isActive ? '#fff' : theme.colors.textSecondary}
                                    />
                                    <Text
                                        style={{
                                            fontSize: 13,
                                            fontWeight: '600',
                                            color: isActive ? '#fff' : theme.colors.textSecondary,
                                        }}
                                    >
                                        {label}
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
                            { icon: 'person-outline', label: 'Edit Profile', onPress: () => router.push('/edit-profile' as any) },
                            { icon: 'notifications-outline', label: 'Notifications', onPress: () => router.push('/notification-settings' as any) },
                            { icon: 'lock-closed-outline', label: 'Security', onPress: () => router.push('/security-settings' as any) },
                        ]}
                        theme={theme}
                    />
                    <MenuSection
                        title="EDUCATION"
                        items={[
                            { icon: 'school-outline', label: 'Sharia Center', onPress: () => router.push('/sharia-center' as any) },
                        ]}
                        theme={theme}
                    />
                    <MenuSection
                        title="SUPPORT"
                        items={[
                            { icon: 'help-circle-outline', label: 'Help & FAQ', onPress: () => Alert.alert('Help & FAQ', 'Visit olfi.ae/help for answers to common questions.') },
                            { icon: 'chatbubble-outline', label: 'Contact Us', onPress: () => Alert.alert('Contact Us', 'Email us at support@olfi.ae') },
                            { icon: 'document-text-outline', label: 'Privacy Policy', onPress: () => router.push('/privacy-policy' as any) },
                        ]}
                        theme={theme}
                    />
                </View>

                {/* Coming Soon */}
                <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
                    <Text
                        style={{
                            ...Typography.overline,
                            color: theme.colors.textTertiary,
                            marginBottom: 12,
                        }}
                    >
                        COMING SOON
                    </Text>
                    <ComingSoonCards />
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

                    <TouchableOpacity
                        onPress={handleDeleteAccount}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: 16,
                            marginTop: 16,
                            backgroundColor: 'transparent',
                            borderRadius: BorderRadius.md,
                            borderWidth: 1,
                            borderColor: `${Colors.error}40`,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={20} color={theme.colors.textSecondary} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '600',
                                color: theme.colors.textSecondary,
                            }}
                        >
                            Delete Account
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
                    OLFi v1.0.0
                </Text>
            </ScrollView>
        </View>
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
