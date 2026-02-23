import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius } from '@/lib/constants';
import { LinearGradient } from 'expo-linear-gradient';
import ShariaBadge from '@/components/ui/ShariaBadge';

const KNOWLEDGE_ARTICLES = [
    {
        id: 'murabaha',
        title: 'Understanding Murabaha',
        description: 'How Islamic banks buy and sell assets to generate profit without charging interest.',
        icon: 'cube-outline',
    },
    {
        id: 'tawarruq',
        title: 'Tawarruq (Commodity Murabaha)',
        description: 'The structure used for personal finance where commodities are traded to provide liquid cash.',
        icon: 'cash-outline',
    },
    {
        id: 'wakalah',
        title: 'Wakalah (Agency Structure)',
        description: 'How agency fees operate when an institution acts on your behalf to secure financing.',
        icon: 'briefcase-outline',
    },
    {
        id: 'ijarah',
        title: 'Ijarah (Islamic Leasing)',
        description: 'The common structure for auto financing where the bank leases the vehicle to you.',
        icon: 'car-outline',
    },
    {
        id: 'fees-vs-interest',
        title: 'Processing Fees vs. Riba',
        description: 'The difference between actual administrative costs and disguised compound interest.',
        icon: 'receipt-outline',
    },
    {
        id: 'dbr-uae',
        title: 'Understanding DBR in the UAE',
        description: 'How Central Bank rules limit your debt obligations to 50% of your salary.',
        icon: 'pie-chart-outline',
    }
];

export default function ShariaCenterScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 }}>
                    Sharia Center
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

                {/* Hero Banner */}
                <LinearGradient
                    colors={theme.gradients.premium}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: BorderRadius.xl,
                        padding: 24,
                        marginBottom: 24,
                    }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Ionicons name="book" size={32} color="rgba(255,255,255,0.9)" />
                        <ShariaBadge variant="glass" />
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginTop: 16, marginBottom: 8 }}>
                        Financial clarity, without compromise.
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 22 }}>
                        Learn how BuyOut structures its refinancing offers to be 100% compliant with Islamic finance principles.
                    </Text>
                </LinearGradient>

                {/* Library Section */}
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 16 }}>
                    Knowledge Library
                </Text>

                <View style={{ gap: 12 }}>
                    {KNOWLEDGE_ARTICLES.map((article) => (
                        <TouchableOpacity
                            key={article.id}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: theme.colors.card,
                                borderRadius: BorderRadius.lg,
                                padding: 16,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                alignItems: 'center'
                            }}
                            activeOpacity={0.7}
                            onPress={() => router.push(`/article/${article.id}` as any)}
                        >
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: BorderRadius.md,
                                backgroundColor: `${Colors.brand.emerald}15`,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 16
                            }}>
                                <Ionicons name={article.icon as any} size={24} color={Colors.brand.emerald} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 }}>
                                    {article.title}
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 }}>
                                    {article.description}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} style={{ marginLeft: 8 }} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Certificates */}
                <View style={{ marginTop: 32 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 16 }}>
                        Fatwa & Certifications
                    </Text>
                    <View style={{
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.lg,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        alignItems: 'center',
                        borderStyle: 'dashed'
                    }}>
                        <Ionicons name="document-lock-outline" size={40} color={theme.colors.textTertiary} style={{ marginBottom: 12 }} />
                        <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary, textAlign: 'center', marginBottom: 6 }}>
                            Official Certification Pending
                        </Text>
                        <Text style={{ fontSize: 13, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 18 }}>
                            We are currently compiling our independent Sharia Board review. The official certificates will be accessible here soon.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
