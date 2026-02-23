import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Colors, BorderRadius } from '@/lib/constants';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

interface DatePickerModalProps {
    theme: any;
    showDatePicker: boolean;
    setShowDatePicker: (show: boolean) => void;
    selectedYear: number;
    setSelectedYear: (year: number) => void;
    selectedMonth: number;
    setSelectedMonth: (month: number) => void;
    years: number[];
}

export default function DatePickerModal({
    theme,
    showDatePicker,
    setShowDatePicker,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    years,
}: DatePickerModalProps) {
    return (
        <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
        >
            <TouchableOpacity
                style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
                activeOpacity={1}
                onPress={() => setShowDatePicker(false)}
            >
                <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View
                        style={{
                            backgroundColor: theme.colors.bg,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingBottom: 40,
                        }}
                    >
                        {/* Handle */}
                        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                            <View
                                style={{
                                    width: 36,
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: theme.colors.border,
                                }}
                            />
                        </View>

                        {/* Header */}
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                paddingBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '600',
                                    color: theme.colors.textPrimary,
                                }}
                            >
                                Select Start Date
                            </Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: '600',
                                        color: Colors.brand.emerald,
                                    }}
                                >
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Year selector */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingHorizontal: 16,
                                gap: 8,
                                paddingBottom: 16,
                            }}
                        >
                            {years.map((y) => (
                                <TouchableOpacity
                                    key={y}
                                    onPress={() => setSelectedYear(y)}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor:
                                            selectedYear === y
                                                ? Colors.brand.emerald
                                                : theme.colors.card,
                                        borderWidth: selectedYear === y ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: selectedYear === y ? '#fff' : theme.colors.textSecondary,
                                        }}
                                    >
                                        {y}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Month grid */}
                        <View
                            style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                paddingHorizontal: 16,
                                gap: 8,
                            }}
                        >
                            {MONTHS.map((m, i) => (
                                <TouchableOpacity
                                    key={m}
                                    onPress={() => setSelectedMonth(i)}
                                    style={{
                                        width: '30%',
                                        paddingVertical: 12,
                                        borderRadius: BorderRadius.md,
                                        alignItems: 'center',
                                        backgroundColor:
                                            selectedMonth === i
                                                ? Colors.brand.emerald
                                                : theme.colors.card,
                                        borderWidth: selectedMonth === i ? 0 : 1,
                                        borderColor: theme.colors.border,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '500',
                                            color:
                                                selectedMonth === i
                                                    ? '#fff'
                                                    : theme.colors.textPrimary,
                                        }}
                                    >
                                        {m.slice(0, 3)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
