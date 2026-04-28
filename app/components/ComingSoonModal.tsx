import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

interface ComingSoonModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export default function ComingSoonModal({ visible, onClose, title, description }: ComingSoonModalProps) {
    const { theme } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: Spacing.xl }}>
                <View style={{ backgroundColor: theme.colors.cardElevated, borderRadius: BorderRadius.xl, overflow: 'hidden' }}>
                    <LinearGradient
                        colors={theme.gradients.brand}
                        style={{ padding: Spacing.xl, alignItems: 'center' }}
                    >
                        <Ionicons name="sparkles" size={32} color="#fff" style={{ marginBottom: Spacing.sm }} />
                        <Text style={{ ...Typography.h3, color: '#fff', textAlign: 'center' }}>
                            {title}
                        </Text>
                    </LinearGradient>
                    <View style={{ padding: Spacing.xl }}>
                        <Text style={{ ...Typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: Spacing['2xl'] }}>
                            {description}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={{
                                backgroundColor: theme.colors.bg,
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                padding: Spacing.lg,
                                borderRadius: BorderRadius.md,
                                alignItems: 'center'
                            }}
                        >
                            <Text style={{ ...Typography.body, fontWeight: '600', color: theme.colors.textPrimary }}>
                                Got it
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
