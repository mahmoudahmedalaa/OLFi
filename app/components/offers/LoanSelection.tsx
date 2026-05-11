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
            <View style={{ paddingHorizontal: 20, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, paddingRight: 16 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.textPrimary }}>
                        Select financing to consolidate
                    </Text>
                    <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginTop: 2 }}>
                        Choose 2 or more options
                    </Text>
                </View>
                <TouchableOpacity onPress={selectAllLoans}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: Colors.brand.emerald }}>
                        {selectedLoanIds.size === userLoans.length ? 'Deselect All' : 'Select All'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ paddingHorizontal: 20, gap: 8 }}>
                {userLoans.map(loan => {
                    const isSelected = selectedLoanIds.has(loan.id);
                    return (
                        <TouchableOpacity
                            key={loan.id}
                            activeOpacity={0.7}
                            onPress={() => toggleLoanSelection(loan.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: 14,
                                borderRadius: BorderRadius.md,
                                backgroundColor: isSelected ? `${Colors.brand.emerald}10` : theme.colors.card,
                                borderWidth: 1,
                                borderColor: isSelected ? Colors.brand.emerald : theme.colors.border,
                            }}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 }} numberOfLines={1}>
                                    {loan.bank_name || 'Bank'} {loan.loan_type.replace(/_/g, ' ')}
                                </Text>
                                <Text style={{ fontSize: 13, color: theme.colors.textSecondary }}>
                                    {formatAED(loan.remaining_amount)} <Text style={{ color: theme.colors.textTertiary }}>• {loan.interest_rate}% Interest Rate</Text>
                                </Text>
                            </View>
                            
                            <View style={{
                                width: 22,
                                height: 22,
                                borderRadius: 11,
                                borderWidth: 1,
                                borderColor: isSelected ? Colors.brand.emerald : theme.colors.border,
                                backgroundColor: isSelected ? Colors.brand.emerald : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}
