import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';

type LoanStatus = 'active' | 'completed' | 'pending';

interface Loan {
    id: string;
    bankName: string;
    type: string;
    originalAmount: number;
    remainingAmount: number;
    interestRate: number;
    monthlyEmi: number;
    startDate: string;
    endDate: string;
    status: LoanStatus;
    progress: number;
}

const mockLoans: Loan[] = [
    {
        id: '1',
        bankName: 'Emirates NBD',
        type: 'Personal Loan',
        originalAmount: 150000,
        remainingAmount: 120000,
        interestRate: 5.49,
        monthlyEmi: 2800,
        startDate: '2024-01',
        endDate: '2029-01',
        status: 'active',
        progress: 0.2,
    },
    {
        id: '2',
        bankName: 'ADCB',
        type: 'Auto Loan',
        originalAmount: 85000,
        remainingAmount: 65000,
        interestRate: 3.99,
        monthlyEmi: 1950,
        startDate: '2024-06',
        endDate: '2028-06',
        status: 'active',
        progress: 0.24,
    },
    {
        id: '3',
        bankName: 'Dubai Islamic Bank',
        type: 'Home Finance',
        originalAmount: 800000,
        remainingAmount: 750000,
        interestRate: 4.25,
        monthlyEmi: 5200,
        startDate: '2025-01',
        endDate: '2050-01',
        status: 'active',
        progress: 0.06,
    },
    {
        id: '4',
        bankName: 'Mashreq',
        type: 'Credit Card Balance',
        originalAmount: 25000,
        remainingAmount: 0,
        interestRate: 0,
        monthlyEmi: 0,
        startDate: '2023-06',
        endDate: '2024-12',
        status: 'completed',
        progress: 1.0,
    },
];

const filters: { key: 'all' | LoanStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
];

export default function LoansScreen() {
    const [activeFilter, setActiveFilter] = useState<'all' | LoanStatus>('all');

    const filteredLoans =
        activeFilter === 'all'
            ? mockLoans
            : mockLoans.filter((l) => l.status === activeFilter);

    const totalDebt = mockLoans
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + l.remainingAmount, 0);

    const totalEmi = mockLoans
        .filter((l) => l.status === 'active')
        .reduce((sum, l) => sum + l.monthlyEmi, 0);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.primary }}>
            {/* Header */}
            <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '700',
                            color: Colors.text.dark.primary,
                        }}
                    >
                        My Loans
                    </Text>
                    <TouchableOpacity
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: Colors.brand.emerald,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Summary strip */}
                <View
                    style={{
                        flexDirection: 'row',
                        gap: 24,
                        marginTop: 16,
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor: Colors.dark.secondary,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: Colors.dark.tertiary,
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 11,
                                color: Colors.text.dark.tertiary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Total Debt
                        </Text>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: Colors.text.dark.primary,
                                marginTop: 4,
                            }}
                        >
                            AED {totalDebt.toLocaleString()}
                        </Text>
                    </View>
                    <View style={{ width: 1, backgroundColor: Colors.dark.tertiary }} />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 11,
                                color: Colors.text.dark.tertiary,
                                textTransform: 'uppercase',
                                letterSpacing: 0.5,
                            }}
                        >
                            Monthly EMIs
                        </Text>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: Colors.text.dark.primary,
                                marginTop: 4,
                            }}
                        >
                            AED {totalEmi.toLocaleString()}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Filter Pills */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8 }}
                >
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter.key}
                            onPress={() => setActiveFilter(filter.key)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor:
                                    activeFilter === filter.key
                                        ? Colors.brand.emerald
                                        : Colors.dark.secondary,
                                borderWidth: activeFilter === filter.key ? 0 : 1,
                                borderColor: Colors.dark.tertiary,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color:
                                        activeFilter === filter.key
                                            ? '#fff'
                                            : Colors.text.dark.secondary,
                                }}
                            >
                                {filter.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Loan List */}
            <FlatList
                data={filteredLoans}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.dark.secondary,
                            borderRadius: BorderRadius.lg,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: Colors.dark.tertiary,
                        }}
                        activeOpacity={0.8}
                    >
                        {/* Header row */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 16,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: Colors.text.dark.primary,
                                    }}
                                >
                                    {item.bankName}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 13,
                                        color: Colors.text.dark.tertiary,
                                        marginTop: 2,
                                    }}
                                >
                                    {item.type} • {item.interestRate}% APR
                                </Text>
                            </View>
                            <StatusBadge status={item.status} />
                        </View>

                        {/* Details */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: Colors.text.dark.tertiary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Remaining
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: Colors.text.dark.primary,
                                        marginTop: 2,
                                    }}
                                >
                                    AED {item.remainingAmount.toLocaleString()}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text
                                    style={{
                                        fontSize: 11,
                                        color: Colors.text.dark.tertiary,
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5,
                                    }}
                                >
                                    Monthly EMI
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '600',
                                        color: Colors.text.dark.primary,
                                        marginTop: 2,
                                    }}
                                >
                                    AED {item.monthlyEmi.toLocaleString()}
                                </Text>
                            </View>
                        </View>

                        {/* Progress */}
                        <View
                            style={{
                                height: 4,
                                backgroundColor: Colors.dark.tertiary,
                                borderRadius: 2,
                                overflow: 'hidden',
                            }}
                        >
                            <View
                                style={{
                                    width: `${item.progress * 100}%`,
                                    height: '100%',
                                    backgroundColor:
                                        item.status === 'completed'
                                            ? Colors.success
                                            : Colors.brand.emerald,
                                    borderRadius: 2,
                                }}
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 6,
                            }}
                        >
                            <Text style={{ fontSize: 11, color: Colors.text.dark.tertiary }}>
                                {item.startDate}
                            </Text>
                            <Text style={{ fontSize: 11, color: Colors.text.dark.tertiary }}>
                                {Math.round(item.progress * 100)}% paid
                            </Text>
                            <Text style={{ fontSize: 11, color: Colors.text.dark.tertiary }}>
                                {item.endDate}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

function StatusBadge({ status }: { status: LoanStatus }) {
    const config = {
        active: { label: 'ACTIVE', color: Colors.brand.emerald },
        completed: { label: 'PAID OFF', color: Colors.success },
        pending: { label: 'PENDING', color: Colors.warning },
    };
    const c = config[status];
    return (
        <View
            style={{
                backgroundColor: `${c.color}15`,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
            }}
        >
            <Text style={{ fontSize: 11, fontWeight: '600', color: c.color }}>
                {c.label}
            </Text>
        </View>
    );
}
