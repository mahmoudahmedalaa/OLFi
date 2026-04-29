import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { formatAED } from '@/lib/refinance-calculator';
import type { UserLoan } from '@/hooks/useOffersData';

interface LoanSelectionProps {
    userLoans: UserLoan[];
    selectedLoanIds: Set<string>;
    toggleLoanSelection: (id: string) => void;
    selectAllLoans: () => void;
}

export default function LoanSelection({
    userLoans,
    selectedLoanIds,
    toggleLoanSelection,
    selectAllLoans,
}: LoanSelectionProps) {
    const { theme } = useTheme();

    if (userLoans.length < 2) return null;

    return (
        <View style={{ marginBottom: 24 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                        Select financing to consolidate
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                        Choose 2 or more financing options to see consolidation offers
                    </Text>
                </View>
                <TouchableOpacity onPress={selectAllLoans}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>
                        {selectedLoanIds.size === userLoans.length ? 'Deselect All' : 'Select All'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
            >
                {userLoans.map(loan => {
                    const isSelected = selectedLoanIds.has(loan.id);
                    return (
                        <TouchableOpacity
                            key={loan.id}
                            activeOpacity={0.7}
                            onPress={() => toggleLoanSelection(loan.id)}
                            style={{
                                width: 160,
                                padding: 12,
                                borderRadius: BorderRadius.md,
                                backgroundColor: isSelected ? `${Colors.brand.emerald}15` : theme.colors.card,
                                borderWidth: 1,
                                borderColor: isSelected ? Colors.brand.emerald : theme.colors.border,
                            }}
                        >
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                                <View style={{
                                    width: 28,
                                    height: 28,
                                    borderRadius: 14,
                                    backgroundColor: isSelected ? Colors.brand.emerald : theme.colors.cardElevated,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Ionicons
                                        name={isSelected ? "checkmark" : "card-outline"}
                                        size={isSelected ? 16 : 14}
                                        color={isSelected ? "#fff" : theme.colors.textTertiary}
                                    />
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 }} numberOfLines={1}>
                                {loan.bank_name || 'Bank'} {loan.loan_type.replace(/_/g, ' ')}
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                {formatAED(loan.remaining_amount)}
                            </Text>
                            <Text style={{ fontSize: 11, color: theme.colors.textTertiary, marginTop: 2 }}>
                                @ {loan.interest_rate}% Interest Rate
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}
