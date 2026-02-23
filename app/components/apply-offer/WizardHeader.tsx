import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography } from '@/lib/constants';

interface Props {
    theme: any;
    step: number;
    totalSteps: number;
    animateToStep: (step: number) => void;
    router: any;
}

export function WizardHeader({
    theme,
    step,
    totalSteps,
    animateToStep,
    router,
}: Props) {
    return (
        <>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <TouchableOpacity
                    onPress={() => step > 0 ? animateToStep(step - 1) : router.back()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                    <Ionicons
                        name={step > 0 ? 'arrow-back' : 'close'}
                        size={24}
                        color={theme.colors.textPrimary}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary }}>
                        Step {step + 1} of {totalSteps}
                    </Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            {/* Progress Bar */}
            <View style={{
                flexDirection: 'row',
                gap: 4,
                paddingHorizontal: 20,
                paddingVertical: 8,
            }}>
                {Array.from({ length: totalSteps }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: 3,
                            borderRadius: 2,
                            backgroundColor: i <= step ? Colors.brand.emerald : theme.colors.border,
                        }}
                    />
                ))}
            </View>
        </>
    );
}
