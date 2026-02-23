import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';
import FormInput from './FormInput';

interface Bank {
    id: string;
    name: string;
    is_islamic: boolean;
}

interface BankPickerProps {
    theme: any;
    banks: Bank[];
    loadingBanks: boolean;
    selectedBank: Bank | null;
    setSelectedBank: (bank: Bank | null) => void;
    showBankPicker: boolean;
    setShowBankPicker: (show: boolean) => void;
    customBankName: string;
    setCustomBankName: (name: string) => void;
    labelStyle: any;
}

export default function BankPicker({
    theme,
    banks,
    loadingBanks,
    selectedBank,
    setSelectedBank,
    showBankPicker,
    setShowBankPicker,
    customBankName,
    setCustomBankName,
    labelStyle,
}: BankPickerProps) {
    return (
        <>
            <Text style={labelStyle}>Bank</Text>
            <TouchableOpacity
                onPress={() => setShowBankPicker(!showBankPicker)}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.colors.card,
                    borderRadius: BorderRadius.md,
                    paddingHorizontal: 16,
                    height: 52,
                    marginBottom: showBankPicker ? 8 : 16,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                }}
            >
                <Text
                    style={{
                        fontSize: 15,
                        color: selectedBank
                            ? theme.colors.textPrimary
                            : theme.colors.textDisabled,
                    }}
                >
                    {selectedBank?.name || 'Select a bank'}
                </Text>
                <Ionicons
                    name={showBankPicker ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={theme.colors.textTertiary}
                />
            </TouchableOpacity>

            {showBankPicker && (
                <View
                    style={{
                        backgroundColor: theme.colors.card,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        marginBottom: 16,
                        overflow: 'hidden',
                        maxHeight: 250,
                    }}
                >
                    <ScrollView nestedScrollEnabled>
                        {loadingBanks ? (
                            <ActivityIndicator
                                style={{ padding: 20 }}
                                color={Colors.brand.emerald}
                            />
                        ) : (
                            <>
                                {banks.map((bank) => (
                                    <TouchableOpacity
                                        key={bank.id}
                                        onPress={() => {
                                            setSelectedBank(bank);
                                            setCustomBankName('');
                                            setShowBankPicker(false);
                                        }}
                                        style={{
                                            padding: 14,
                                            paddingHorizontal: 16,
                                            borderBottomWidth: 1,
                                            borderBottomColor: theme.colors.border,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor:
                                                selectedBank?.id === bank.id
                                                    ? `${Colors.brand.emerald}10`
                                                    : 'transparent',
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <Text style={{ fontSize: 15, color: theme.colors.textPrimary }}>
                                                {bank.name}
                                            </Text>
                                            {bank.is_islamic && (
                                                <View
                                                    style={{
                                                        backgroundColor: `${Colors.brand.teal}20`,
                                                        paddingHorizontal: 6,
                                                        paddingVertical: 2,
                                                        borderRadius: 4,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 10,
                                                            fontWeight: '600',
                                                            color: Colors.brand.teal,
                                                        }}
                                                    >
                                                        Islamic
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                        {selectedBank?.id === bank.id && (
                                            <Ionicons
                                                name="checkmark"
                                                size={18}
                                                color={Colors.brand.emerald}
                                            />
                                        )}
                                    </TouchableOpacity>
                                ))}
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedBank(null);
                                        setShowBankPicker(false);
                                    }}
                                    style={{
                                        padding: 14,
                                        paddingHorizontal: 16,
                                    }}
                                >
                                    <Text style={{ fontSize: 15, color: theme.colors.textSecondary }}>
                                        Other (type below)
                                    </Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            )}

            {!selectedBank && (
                <>
                    <Text style={labelStyle}>Bank Name (custom)</Text>
                    <FormInput
                        theme={theme}
                        placeholder="Enter bank name"
                        value={customBankName}
                        onChangeText={setCustomBankName}
                    />
                </>
            )}
        </>
    );
}
