import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/constants';

const LOAN_TYPES = [
    { key: 'personal', label: 'Personal Finance', icon: 'person' as const },
    { key: 'auto', label: 'Auto Finance', icon: 'car' as const },
];

interface LoanTypeSelectorProps {
    theme: any;
    loanType: string;
    setLoanType: (type: string) => void;
    labelStyle: any;
}

export default function LoanTypeSelector({ theme, loanType, setLoanType, labelStyle }: LoanTypeSelectorProps) {
    return (
        <>
            <Text style={labelStyle}>Financing Type</Text>
            <View
                style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 16,
                }}
            >
                {LOAN_TYPES.map((lt) => {
                    const isActive = loanType === lt.key;
                    return (
                        <TouchableOpacity
                            key={lt.key}
                            onPress={() => setLoanType(lt.key)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                paddingHorizontal: 14,
                                paddingVertical: 10,
                                borderRadius: 20,
                                backgroundColor: isActive
                                    ? Colors.brand.emerald
                                    : theme.colors.card,
                                borderWidth: isActive ? 0 : 1,
                                borderColor: theme.colors.border,
                            }}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={lt.icon}
                                size={14}
                                color={isActive ? '#fff' : theme.colors.textSecondary}
                            />
                            <Text
                                style={{
                                    fontSize: 13,
                                    fontWeight: '600',
                                    color: isActive ? '#fff' : theme.colors.textSecondary,
                                }}
                            >
                                {lt.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    );
}
