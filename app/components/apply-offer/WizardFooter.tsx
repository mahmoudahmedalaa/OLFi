import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Typography } from '@/lib/constants';

interface Props {
    theme: any;
    step: number;
    canProceedStep0: boolean;
    canProceedStep2: boolean;
    submitting: boolean;
    animateToStep: (step: number) => void;
    handleSubmit: () => void;
}

export function WizardFooter({
    theme,
    step,
    canProceedStep0,
    canProceedStep2,
    submitting,
    animateToStep,
    handleSubmit,
}: Props) {
    return (
        <View style={{
            paddingHorizontal: 20,
            paddingBottom: 34,
            paddingTop: 12,
            backgroundColor: theme.colors.bg,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        }}>
            <TouchableOpacity
                onPress={() => {
                    if (step === 0) animateToStep(1);
                    else if (step === 1 && canProceedStep0) animateToStep(2);
                    else if (step === 2) animateToStep(3);
                    else if (step === 3 && canProceedStep2) handleSubmit();
                }}
                activeOpacity={0.8}
                disabled={
                    (step === 1 && !canProceedStep0) ||
                    (step === 3 && !canProceedStep2) ||
                    submitting
                }
            >
                <LinearGradient
                    colors={
                        (step === 1 && !canProceedStep0) || (step === 3 && !canProceedStep2)
                            ? ['#94A3B8', '#64748B']
                            : [Colors.brand.emerald, Colors.brand.emeraldDark]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        borderRadius: BorderRadius.md,
                        height: 56,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 8,
                    }}
                >
                    {submitting ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <>
                            <Text style={{ fontSize: 17, fontWeight: '700', color: '#fff' }}>
                                {step === 3 ? 'Submit Application' : 'Continue'}
                            </Text>
                            <Ionicons
                                name={step === 3 ? 'checkmark-circle' : 'arrow-forward'}
                                size={20}
                                color="#fff"
                            />
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>

            {step === 2 && (
                <TouchableOpacity
                    onPress={() => animateToStep(3)}
                    style={{ alignItems: 'center', marginTop: 12 }}
                >
                    <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>
                        Skip for now →
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
