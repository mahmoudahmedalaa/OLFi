import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

interface NotifSetting {
    key: string;
    title: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
    enabled: boolean;
}

export default function NotificationSettingsScreen() {
    const { theme } = useTheme();
    const [settings, setSettings] = useState<NotifSetting[]>([
        {
            key: 'rate_alerts',
            title: 'Rate Drop Alerts',
            description: 'Get notified when interest rates drop below your current rate',
            icon: 'trending-down',
            enabled: true,
        },
        {
            key: 'payment_reminders',
            title: 'Payment Reminders',
            description: 'Reminders before your EMI due dates',
            icon: 'calendar',
            enabled: true,
        },
        {
            key: 'new_offers',
            title: 'New Offers',
            description: 'Notifications about new bank products and promotions',
            icon: 'gift',
            enabled: true,
        },
        {
            key: 'savings_tips',
            title: 'Savings Insights',
            description: 'Weekly tips on how to reduce your debt faster',
            icon: 'bulb',
            enabled: false,
        },
        {
            key: 'app_updates',
            title: 'App Updates',
            description: 'Information about new features and improvements',
            icon: 'rocket',
            enabled: false,
        },
    ]);

    const toggleSetting = (key: string) => {
        setSettings(prev =>
            prev.map(s => s.key === key ? { ...s, enabled: !s.enabled } : s)
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                    Notifications
                </Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
                <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 20 }}>
                    Choose which notifications you&apos;d like to receive
                </Text>

                {settings.map((setting, idx) => (
                    <View
                        key={setting.key}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            padding: 16,
                            marginBottom: 10,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <View style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            backgroundColor: `${Colors.brand.emerald}12`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 14,
                        }}>
                            <Ionicons name={setting.icon} size={20} color={Colors.brand.emerald} />
                        </View>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                                {setting.title}
                            </Text>
                            <Text style={{ fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 }}>
                                {setting.description}
                            </Text>
                        </View>
                        <Switch
                            value={setting.enabled}
                            onValueChange={() => toggleSetting(setting.key)}
                            trackColor={{ false: theme.colors.border, true: Colors.brand.emerald }}
                            thumbColor="#fff"
                        />
                    </View>
                ))}

                {/* Info */}
                <View style={{
                    backgroundColor: `${Colors.brand.teal}10`,
                    borderRadius: BorderRadius.md,
                    padding: 14,
                    marginTop: 8,
                    flexDirection: 'row',
                    gap: 10,
                }}>
                    <Ionicons name="information-circle" size={18} color={Colors.brand.teal} />
                    <Text style={{ fontSize: 12, color: theme.colors.textSecondary, flex: 1 }}>
                        Push notification settings are also managed through your device&apos;s Settings app.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
