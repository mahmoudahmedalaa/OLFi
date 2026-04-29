import React, { useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import type { BankProduct } from '@/hooks/useOffersData';

const FEATURE_FILTERS = [
    { key: 'no_salary_transfer', label: 'No Salary Transfer', icon: 'wallet-outline' as const },
    { key: 'early_settlement', label: 'Early Settlement', icon: 'flash-outline' as const },
    { key: 'fixed_rate', label: 'Fixed Rate', icon: 'trending-up-outline' as const },
    { key: 'debt_consolidation', label: 'Debt Consolidation', icon: 'git-merge-outline' as const },
    { key: 'top_up', label: 'Top-Up Available', icon: 'add-circle-outline' as const },
];

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    activeFilters: string[];
    toggleFilter: (key: string) => void;
    selectedBanks: string[];
    toggleBank: (bankName: string) => void;
    products: BankProduct[];
    onClearAll: () => void;
}

export default function FilterModal({
    visible,
    onClose,
    activeFilters,
    toggleFilter,
    selectedBanks,
    toggleBank,
    products,
    onClearAll,
}: FilterModalProps) {
    const { theme } = useTheme();

    const availableBanks = useMemo(() => {
        const bankMap = new Map<string, string>();
        products.forEach((p) => {
            if (p.bank?.name && !bankMap.has(p.bank.name)) {
                bankMap.set(p.bank.name, p.bank.id);
            }
        });
        return Array.from(bankMap.entries())
            .map(([name, id]) => ({ name, id }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);

    const totalActive = activeFilters.length + selectedBanks.length;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
                {/* Header */}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: Spacing.xl,
                        paddingTop: Platform.OS === 'ios' ? 20 : Spacing.xl,
                        paddingBottom: Spacing.lg,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.border,
                    }}
                >
                    <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: '600',
                            color: theme.colors.textPrimary,
                        }}
                    >
                        Filters
                    </Text>
                    <TouchableOpacity onPress={onClearAll} disabled={totalActive === 0}>
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: totalActive > 0 ? Colors.brand.emerald : theme.colors.textDisabled,
                            }}
                        >
                            Clear All
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={{ padding: Spacing.xl, paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Bank Section */}
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                            marginBottom: Spacing.md,
                            letterSpacing: 0.3,
                        }}
                    >
                        Bank
                    </Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing['2xl'] }}>
                        {availableBanks.map((bank) => {
                            const isActive = selectedBanks.includes(bank.name);
                            return (
                                <TouchableOpacity
                                    key={bank.id}
                                    onPress={() => toggleBank(bank.name)}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 6,
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: BorderRadius.md,
                                        backgroundColor: isActive ? Colors.brand.emerald : theme.colors.card,
                                        borderWidth: isActive ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Ionicons
                                        name="business-outline"
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
                                        {bank.name}
                                    </Text>
                                    {isActive && (
                                        <Ionicons name="checkmark" size={14} color="rgba(255,255,255,0.9)" />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Features Section */}
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: '700',
                            color: theme.colors.textPrimary,
                            marginBottom: Spacing.md,
                            letterSpacing: 0.3,
                        }}
                    >
                        Features
                    </Text>
                    <View style={{ gap: 8 }}>
                        {FEATURE_FILTERS.map((filter) => {
                            const isActive = activeFilters.includes(filter.key);
                            return (
                                <TouchableOpacity
                                    key={filter.key}
                                    onPress={() => toggleFilter(filter.key)}
                                    activeOpacity={0.7}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 16,
                                        paddingVertical: 14,
                                        borderRadius: BorderRadius.md,
                                        backgroundColor: theme.colors.card,
                                        borderWidth: 1,
                                        borderColor: isActive ? Colors.brand.emerald : theme.colors.border,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <View
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                backgroundColor: isActive
                                                    ? `${Colors.brand.emerald}15`
                                                    : theme.colors.cardElevated,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Ionicons
                                                name={filter.icon}
                                                size={16}
                                                color={isActive ? Colors.brand.emerald : theme.colors.textTertiary}
                                            />
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontWeight: '500',
                                                color: theme.colors.textPrimary,
                                            }}
                                        >
                                            {filter.label}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            width: 22,
                                            height: 22,
                                            borderRadius: 6,
                                            borderWidth: isActive ? 0 : 1.5,
                                            borderColor: theme.colors.border,
                                            backgroundColor: isActive ? Colors.brand.emerald : 'transparent',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {isActive && (
                                            <Ionicons name="checkmark" size={14} color="#fff" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Apply Button */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: Spacing.xl,
                        paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
                        backgroundColor: theme.colors.bg,
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.border,
                    }}
                >
                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.8}
                        style={{
                            backgroundColor: Colors.brand.emerald,
                            borderRadius: BorderRadius.md,
                            height: 52,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            gap: 8,
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#fff',
                            }}
                        >
                            {totalActive > 0 ? `Apply Filters (${totalActive})` : 'Done'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
