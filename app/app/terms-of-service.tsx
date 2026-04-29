import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

const SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        icon: 'checkmark-circle-outline',
        content: `By accessing or using the BuyOut application ("OLFi"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.`,
    },
    {
        title: '2. Description of Service',
        icon: 'information-circle-outline',
        content: `BuyOut is a financial technology platform that allows users to track their debts and submit consolidation or refinancing applications to partner banks. BuyOut is not a bank or a licensed financial institution. The approval of any loan consolidation application rests entirely with the partner banks.`,
    },
    {
        title: '3. User Responsibilities',
        icon: 'person-outline',
        content: `• You must provide accurate, current, and complete information.
• You are responsible for safeguarding your account credentials.
• You agree to use the service for lawful purposes only and in compliance with UAE laws.
• Submitting false financial documents or identity information is strictly prohibited and will result in account termination and potential legal action.`,
    },
    {
        title: '4. Data & Privacy',
        icon: 'lock-closed-outline',
        content: `Your privacy is important to us. By using BuyOut, you consent to the collection and use of your data as described in our Privacy Policy. We comply strictly with the UAE Personal Data Protection Law (Federal Decree-Law No. 45/2021).`,
    },
    {
        title: '5. Application Processing',
        icon: 'send-outline',
        content: `When you submit an application through BuyOut:
• We transmit your application data securely to the selected partner bank(s).
• We act only as a facilitator and make no guarantees regarding application approval.
• Processing times are subject to the individual partner bank's procedures.`,
    },
    {
        title: '6. Limitation of Liability',
        icon: 'shield-outline',
        content: `To the maximum extent permitted by UAE law, OLFi Technologies LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service or any decisions made by partner banks regarding your loan applications.`,
    },
    {
        title: '7. Revisions and Modifications',
        icon: 'sync-outline',
        content: `We reserve the right to modify these Terms at any time. We will notify users of any significant changes. Your continued use of the service following such modifications constitutes your acceptance of the revised Terms.`,
    },
    {
        title: '8. Governing Law',
        icon: 'business-outline',
        content: `These terms and your use of BuyOut are governed by the federal laws of the United Arab Emirates and the local laws of the Emirate of Dubai. Any disputes shall be subject to the exclusive jurisdiction of the courts in Dubai.`,
    },
];

export default function TermsOfServiceScreen() {
    const { theme } = useTheme();
    const router = useRouter();

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
                <Text style={{ ...Typography.h3, color: theme.colors.textPrimary, flex: 1 }}>
                    Terms of Service
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
                {/* Hero */}
                <View style={{
                    backgroundColor: Colors.brand.emerald + '10',
                    borderRadius: BorderRadius.lg,
                    padding: 20,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: Colors.brand.emerald + '20',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 14,
                }}>
                    <View style={{
                        width: 48,
                        height: 48,
                        borderRadius: 16,
                        backgroundColor: Colors.brand.emerald + '20',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Ionicons name="document-text" size={24} color={Colors.brand.emerald} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 2 }}>
                            Our Agreement
                        </Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, lineHeight: 18 }}>
                            Please review the terms binding your use of OLFi services.
                        </Text>
                    </View>
                </View>

                {/* Sections */}
                {SECTIONS.map((section, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: theme.colors.card,
                            borderRadius: BorderRadius.lg,
                            padding: 16,
                            marginBottom: 12,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <Ionicons name={section.icon as any} size={20} color={Colors.brand.emerald} />
                            <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary }}>
                                {section.title}
                            </Text>
                        </View>
                        <Text style={{
                            ...Typography.caption,
                            color: theme.colors.textSecondary,
                            lineHeight: 20,
                        }}>
                            {section.content}
                        </Text>
                    </View>
                ))}

                <Text style={{
                    ...Typography.caption,
                    color: theme.colors.textTertiary,
                    textAlign: 'center',
                    marginTop: 24
                }}>
                    Last updated: February 2025
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
