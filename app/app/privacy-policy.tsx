import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, BorderRadius, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

const SECTIONS = [
    {
        title: 'Information We Collect',
        icon: 'folder-outline',
        content: `We collect information you provide directly when using OLFi:

• **Account Information**: Name, email address, phone number
• **Financial Data**: Loan details, salary, employer, banking information
• **Identity Verification**: Nationality, residency status, Emirates ID details (when applicable)
• **Device Information**: Device type, operating system, app version
• **Usage Data**: Feature engagement, navigation patterns, session duration

We do NOT collect or store:
• Bank login credentials
• Biometric data stored on external servers`,
    },
    {
        title: 'How We Use Your Data',
        icon: 'bulb-outline',
        content: `Your information is used to:

• Calculate refinancing savings and generate personalized offers
• Submit loan applications to banks on your behalf
• Verify your identity for KYC compliance
• Improve our algorithms and user experience
• Send relevant notifications about your applications
• Comply with UAE Central Bank regulations and PDPL requirements`,
    },
    {
        title: 'Data Sharing',
        icon: 'people-outline',
        content: `We share your data only when necessary:

• **Banks & Financial Institutions**: Your loan and profile data is shared ONLY with banks you explicitly apply to - never without your consent
• **UAE Regulatory Bodies**: When required by law (e.g., AECB, UAE Central Bank)
• **Service Providers**: Our hosting (Supabase) and analytics providers operate under strict data processing agreements

We never sell your personal data to third parties for marketing purposes.`,
    },
    {
        title: 'Data Security',
        icon: 'shield-checkmark-outline',
        content: `We protect your data through:

• End-to-end encryption for all data in transit (TLS 1.3)
• AES-256 encryption for data at rest
• Row-level security policies in our database
• Regular security audits and penetration testing
• Secure authentication via Supabase Auth with JWT tokens
• Biometric authentication option for app access`,
    },
    {
        title: 'Data Retention & Deletion',
        icon: 'trash-outline',
        content: `• **Active accounts**: Data is retained for the duration of your account
• **Deleted accounts**: All personal data is permanently deleted within 30 days of account deletion
• **Application data**: Loan application records may be retained for up to 5 years to comply with UAE financial regulations
• **You can delete your account** at any time from Profile → Security → Delete Account`,
    },
    {
        title: 'Your Rights Under UAE PDPL',
        icon: 'document-text-outline',
        content: `Under the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021), you have the right to:

• **Access**: Request a copy of all data we hold about you
• **Rectification**: Correct inaccurate personal data
• **Erasure**: Request deletion of your data (subject to regulatory obligations)
• **Data Portability**: Receive your data in a structured, machine-readable format
• **Withdraw Consent**: Opt out of data processing at any time
• **Object**: Challenge automated decision-making

To exercise these rights, contact us at privacy@olfi.ae`,
    },
    {
        title: 'Contact Information',
        icon: 'mail-outline',
        content: `**Data Controller**: OLFi Technologies LLC
**Email**: privacy@olfi.ae
**General Support**: support@olfi.ae
**Address**: Dubai, United Arab Emirates

This policy was last updated on February 2025.`,
    },
];

export default function PrivacyPolicyScreen() {
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
                    Privacy Policy
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
                        <Ionicons name="shield-checkmark" size={24} color={Colors.brand.emerald} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={{ ...Typography.bodyBold, color: theme.colors.textPrimary, marginBottom: 2 }}>
                            Your Privacy Matters
                        </Text>
                        <Text style={{ ...Typography.caption, color: theme.colors.textSecondary, lineHeight: 18 }}>
                            Compliant with UAE PDPL (Federal Decree-Law No. 45/2021)
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
            </ScrollView>
        </SafeAreaView>
    );
}
