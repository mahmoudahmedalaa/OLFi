import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/lib/auth-context';
import { Colors, BorderRadius } from '@/lib/constants';

interface MenuItem {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    subtitle: string;
    onPress: () => void;
    badge?: string;
    chevron?: boolean;
}

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const email = user?.email || 'user@example.com';
    const initial = email.charAt(0).toUpperCase();

    const handleSignOut = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const menuSections: { title: string; items: MenuItem[] }[] = [
        {
            title: 'Account',
            items: [
                {
                    icon: 'person-outline',
                    label: 'Personal Info',
                    subtitle: 'Name, phone, Emirates ID',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'document-text-outline',
                    label: 'Documents',
                    subtitle: 'Salary slips, bank statements',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'shield-checkmark-outline',
                    label: 'Verification',
                    subtitle: 'Complete your KYC',
                    onPress: () => { },
                    badge: 'Required',
                    chevron: true,
                },
            ],
        },
        {
            title: 'Preferences',
            items: [
                {
                    icon: 'notifications-outline',
                    label: 'Notifications',
                    subtitle: 'Push, email, SMS',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'language-outline',
                    label: 'Language',
                    subtitle: 'English',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'moon-outline',
                    label: 'Appearance',
                    subtitle: 'Dark mode',
                    onPress: () => { },
                    chevron: true,
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: 'help-circle-outline',
                    label: 'Help Center',
                    subtitle: 'FAQs and support',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'chatbubble-outline',
                    label: 'Contact Us',
                    subtitle: 'Chat or email support',
                    onPress: () => { },
                    chevron: true,
                },
                {
                    icon: 'star-outline',
                    label: 'Rate BuyOut',
                    subtitle: 'Love the app? Leave a review',
                    onPress: () => { },
                    chevron: true,
                },
            ],
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.primary }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 32 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24 }}>
                    <View style={{ alignItems: 'center' }}>
                        <LinearGradient
                            colors={Colors.gradients.brand as unknown as [string, string]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 12,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 32,
                                    fontWeight: '700',
                                    color: '#fff',
                                }}
                            >
                                {initial}
                            </Text>
                        </LinearGradient>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: '600',
                                color: Colors.text.dark.primary,
                            }}
                        >
                            {email.split('@')[0]}
                        </Text>
                        <Text
                            style={{
                                fontSize: 13,
                                color: Colors.text.dark.tertiary,
                                marginTop: 2,
                            }}
                        >
                            {email}
                        </Text>

                        {/* Verification banner */}
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: `${Colors.warning}15`,
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: BorderRadius.md,
                                marginTop: 16,
                                gap: 8,
                            }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="warning" size={16} color={Colors.warning} />
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '500',
                                    color: Colors.warning,
                                }}
                            >
                                Complete verification to unlock full features
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Menu Sections */}
                {menuSections.map((section) => (
                    <View key={section.title} style={{ marginBottom: 24 }}>
                        <Text
                            style={{
                                fontSize: 13,
                                fontWeight: '600',
                                color: Colors.text.dark.tertiary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                                paddingHorizontal: 20,
                                marginBottom: 8,
                            }}
                        >
                            {section.title}
                        </Text>
                        <View
                            style={{
                                marginHorizontal: 20,
                                backgroundColor: Colors.dark.secondary,
                                borderRadius: BorderRadius.lg,
                                borderWidth: 1,
                                borderColor: Colors.dark.tertiary,
                                overflow: 'hidden',
                            }}
                        >
                            {section.items.map((item, index) => (
                                <TouchableOpacity
                                    key={item.label}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        padding: 16,
                                        borderBottomWidth:
                                            index < section.items.length - 1 ? 1 : 0,
                                        borderBottomColor: Colors.dark.tertiary,
                                    }}
                                    activeOpacity={0.7}
                                    onPress={item.onPress}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={22}
                                        color={Colors.text.dark.secondary}
                                    />
                                    <View style={{ flex: 1, marginLeft: 12 }}>
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: '500',
                                                color: Colors.text.dark.primary,
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: Colors.text.dark.tertiary,
                                                marginTop: 1,
                                            }}
                                        >
                                            {item.subtitle}
                                        </Text>
                                    </View>
                                    {item.badge && (
                                        <View
                                            style={{
                                                backgroundColor: `${Colors.warning}20`,
                                                paddingHorizontal: 8,
                                                paddingVertical: 3,
                                                borderRadius: 6,
                                                marginRight: 8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: '600',
                                                    color: Colors.warning,
                                                }}
                                            >
                                                {item.badge}
                                            </Text>
                                        </View>
                                    )}
                                    {item.chevron && (
                                        <Ionicons
                                            name="chevron-forward"
                                            size={18}
                                            color={Colors.text.dark.tertiary}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                ))}

                {/* Sign Out */}
                <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 16,
                            backgroundColor: Colors.dark.secondary,
                            borderRadius: BorderRadius.lg,
                            borderWidth: 1,
                            borderColor: `${Colors.error}30`,
                            gap: 8,
                        }}
                        activeOpacity={0.7}
                        onPress={handleSignOut}
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

                {/* App Version */}
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 11,
                        color: Colors.text.dark.disabled,
                        marginTop: 24,
                    }}
                >
                    BuyOut v1.0.0
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
