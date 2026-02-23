import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

export const FILTER_CHIPS = [
    { key: 'sharia', label: 'Sharia Compliant', icon: 'shield-checkmark' as const },
    { key: 'no_salary_transfer', label: 'No Salary Transfer', icon: 'wallet-outline' as const },
    { key: 'early_settlement', label: 'Early Settlement', icon: 'flash-outline' as const },
    { key: 'rate_lock', label: 'Rate Lock', icon: 'lock-closed-outline' as const },
    { key: 'debt_consolidation', label: 'Debt Consolidation', icon: 'git-merge-outline' as const },
    { key: 'no_guarantor', label: 'No Guarantor', icon: 'person-remove-outline' as const },
    { key: 'top_up', label: 'Top-Up Available', icon: 'add-circle-outline' as const },
    { key: 'fixed_rate', label: 'Fixed Rate', icon: 'trending-up-outline' as const },
];

interface FilterChipsProps {
    activeFilters: string[];
    toggleFilter: (key: string) => void;
}

export default function FilterChips({ activeFilters, toggleFilter }: FilterChipsProps) {
    const { theme } = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 20,
                gap: 8,
                paddingBottom: 16,
            }}
            style={{ marginBottom: 4 }}
        >
            {FILTER_CHIPS.map((chip) => {
                const isActive = activeFilters.includes(chip.key);
                return (
                    <TouchableOpacity
                        key={chip.key}
                        onPress={() => toggleFilter(chip.key)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: isActive
                                ? chip.key === 'sharia' ? Colors.brand.teal : Colors.brand.emerald
                                : theme.colors.card,
                            borderWidth: isActive ? 0 : 1,
                            borderColor: theme.colors.border,
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={chip.icon}
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
                            {chip.label}
                        </Text>
                        {isActive && (
                            <Ionicons name="close-circle" size={14} color="rgba(255,255,255,0.7)" />
                        )}
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}
