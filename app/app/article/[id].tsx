import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius } from '@/lib/constants';

type ArticleContent = {
    title: string;
    subtitle: string;
    icon: any;
    sections: {
        heading?: string;
        body: string;
    }[];
};

const ARTICLE_DATA: Record<string, ArticleContent> = {
    'murabaha': {
        title: 'Understanding Murabaha',
        subtitle: 'The foundation of Islamic asset financing.',
        icon: 'cube-outline',
        sections: [
            {
                body: 'When you want to buy an asset (like a car or machinery) using conventional finance, the bank lends you money and charges interest on that loan. In Islamic finance, lending money to make more money is prohibited (Riba).'
            },
            {
                heading: 'How Murabaha Solves This',
                body: 'Murabaha is an asset-backed contract. Instead of lending you money, the Islamic institution actually purchases the asset from the seller on your behalf. They take ownership, assuming the risk, however briefly.'
            },
            {
                heading: 'The Profit Mark-up',
                body: 'The institution then sells the asset to you at a pre-agreed profit mark-up. You pay this new total price in monthly installments. Because the profit is tied to an actual trade, the arrangement is fully Sharia-compliant.'
            }
        ]
    },
    'tawarruq': {
        title: 'Tawarruq (Commodity Murabaha)',
        subtitle: 'How personal cash financing is structured ethically.',
        icon: 'cash-outline',
        sections: [
            {
                body: 'While Murabaha is perfect for buying a specific asset (like a car), sometimes individuals need liquid cash to consolidate debts or cover personal expenses.'
            },
            {
                heading: 'The Mechanics of Tawarruq',
                body: 'Tawarruq involves the trade of commodities (like metals on the global market). The Islamic institution buys commodities and sells them to you at a deferred price with a mark-up (Murabaha). You then immediately sell the commodities to a third-party broker for spot cash.'
            },
            {
                heading: 'The Result',
                body: 'You receive the cash you need immediately, and you owe the institution the deferred price in installments. Because the transaction was facilitated through the actual buying and selling of physical commodities, it remains compliant.'
            }
        ]
    },
    'wakalah': {
        title: 'Wakalah (Agency Structure)',
        subtitle: 'How institutions act as your financial agent.',
        icon: 'briefcase-outline',
        sections: [
            {
                body: 'Wakalah translates to "Agency". It is a contract where one party delegates another to act on their behalf for a specific task.'
            },
            {
                heading: 'In Islamic Finance',
                body: 'When an institution uses a Wakalah structure, you appoint them as your agent to manage your funds or secure financing on your behalf. In return for their time, expertise, and operational effort, they charge a flat, transparent "Wakalah Fee".'
            },
            {
                heading: 'Transparency is Key',
                body: 'Unlike conventional interest which can fluctuate or compound, a Wakalah fee is predetermined. The agent is compensated for actual service rendered, not for the mere passage of time.'
            }
        ]
    },
    'ijarah': {
        title: 'Ijarah (Islamic Leasing)',
        subtitle: 'The ethical framework for leasing and auto financing.',
        icon: 'car-outline',
        sections: [
            {
                body: 'Ijarah is an Islamic leasing contract commonly used for auto finance and mortgages.'
            },
            {
                heading: 'How it Works',
                body: 'The bank buys the vehicle and retains ownership. They then lease the vehicle to you for a fixed monthly rental fee over a set period. Unlike conventional loans, the bank bears the ownership risks (such as major structural damage not caused by negligence).'
            },
            {
                heading: 'Transfer of Ownership',
                body: 'At the end of the lease term, the bank will either gift the car to you or sell it to you for a nominal token amount (Ijarah Muntahia Bittamleek), transferring full ownership to you.'
            }
        ]
    },
    'gharar-maysir': {
        title: 'Gharar & Maysir Explained',
        subtitle: 'Why hidden clauses and speculation are forbidden.',
        icon: 'shield-checkmark-outline',
        sections: [
            {
                heading: 'Gharar (Extreme Uncertainty)',
                body: 'Islamic finance demands absolute transparency. Gharar refers to deceptive uncertainty. If a contract has hidden fees, adjustable rates that are perfectly unpredictable, or conditions that the buyer cannot control, the contract becomes void. Both buyer and seller must know exactly what is being traded and for how much.'
            },
            {
                heading: 'Maysir (Speculation/Gambling)',
                body: 'Contracts that rely on sheer luck or gamble at the expense of another party are prohibited. In financing, this means banks cannot design products that trap users in spiraling compound debt resulting from unpredictable circumstances.'
            }
        ]
    },
    'qard-hasan': {
        title: 'Qard Hasan vs. Commercial Finance',
        subtitle: 'Understanding the purely benevolent loan.',
        icon: 'heart-outline',
        sections: [
            {
                body: 'In Islamic principles, when money is lent directly (cash for cash), it must be returned without any extra charge. Charging a premium on a cash loan is Riba.'
            },
            {
                heading: 'Qard Hasan',
                body: 'A "Qard Hasan" is a benevolent loan. It is provided out of goodwill, often to those in dire need, and the borrower repays only the exact principal amount borrowed. No profit is made.'
            },
            {
                heading: 'Commercial Finance',
                body: 'Institutions like BuyOut partner with banks that offer commercial finance. Because banks are businesses, they must generate profit. They achieve this ethically through trade structures (like Murabaha, Ijarah, or Wakalah) rather than through lending cash (Qard Hasan).'
            }
        ]
    },
    'fees-vs-interest': {
        title: 'Processing Fees vs. Riba',
        subtitle: 'Understanding justifiable costs.',
        icon: 'receipt-outline',
        sections: [
            {
                heading: 'The Riba Prohibition',
                body: 'Riba is the unjust generation of money from money. It is exploitative because the lender takes no risk and demands guaranteed compounding returns simply for delaying repayment.'
            },
            {
                heading: 'Why Administrative Fees are Allowed',
                body: 'When you apply for financing, the institution incurs actual, tangible costs: employee salaries for underwriting, credit bureau checks, document processing, and system maintenance.'
            },
            {
                heading: 'The Boundary',
                body: 'Islamic scholars permit banks to charge an upfront processing fee, provided the fee reflects the actual administrative cost of the service. It cannot be expressed as a percentage of the loan tied to time, and it cannot be designed as a disguised interest charge.'
            }
        ]
    },
    'dbr-uae': {
        title: 'Understanding DBR in the UAE',
        subtitle: 'How the 50% rule protects you.',
        icon: 'pie-chart-outline',
        sections: [
            {
                body: 'Debt Burden Ratio (DBR) is a critical metric used by all financial institutions in the UAE, mandated by the Central Bank.'
            },
            {
                heading: 'The 50% Rule',
                body: 'Your total monthly debt installments (including personal finance, auto finance, and credit card minimums) cannot exceed 50% of your total monthly income.'
            },
            {
                heading: 'Why It Matters',
                body: 'This regulation prevents individuals from becoming over-leveraged and drowning in debt they cannot service. BuyOut helps you calculate your DBR and find refinance offers that consolidate your payments to keep you safely below this 50% threshold, ensuring your financial wellbeing.'
            }
        ]
    }
};

export default function ArticleScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme } = useTheme();

    const article = id ? ARTICLE_DATA[id] : null;

    if (!article) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.colors.textPrimary, fontSize: 18, fontWeight: '600' }}>Article not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20, padding: 12, backgroundColor: theme.colors.card, borderRadius: 8 }}>
                    <Text style={{ color: Colors.brand.emerald, fontWeight: '600' }}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderColor: theme.colors.border }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12, padding: 4 }}>
                    <Ionicons name="chevron-back" size={24} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary }}>
                    Sharia Center
                </Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

                {/* Article Header */}
                <View style={{
                    width: 64,
                    height: 64,
                    borderRadius: BorderRadius.xl,
                    backgroundColor: `${Colors.brand.emerald}15`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 20,
                }}>
                    <Ionicons name={article.icon} size={32} color={Colors.brand.emerald} />
                </View>

                <Text style={{ fontSize: 26, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 8 }}>
                    {article.title}
                </Text>
                <Text style={{ fontSize: 16, color: theme.colors.textSecondary, lineHeight: 24, marginBottom: 32 }}>
                    {article.subtitle}
                </Text>

                {/* Content Sections */}
                <View style={{ gap: 24 }}>
                    {article.sections.map((sec, i) => (
                        <View key={i}>
                            {sec.heading && (
                                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 10 }}>
                                    {sec.heading}
                                </Text>
                            )}
                            <Text style={{ fontSize: 15, color: theme.colors.textSecondary, lineHeight: 24 }}>
                                {sec.body}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Bottom Disclaimer */}
                <View style={{
                    marginTop: 40,
                    padding: 16,
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.lg,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    flexDirection: 'row',
                    alignItems: 'flex-start'
                }}>
                    <Ionicons name="information-circle" size={20} color={theme.colors.textTertiary} style={{ marginRight: 12, marginTop: 2 }} />
                    <Text style={{ flex: 1, fontSize: 13, color: theme.colors.textSecondary, lineHeight: 18 }}>
                        This article is provided for educational purposes only to help you understand the structures used by our partner institutions. BuyOut is an aggregator and credit broker, acting to connect you with Sharia-compliant products.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
