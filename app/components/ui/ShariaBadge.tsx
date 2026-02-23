import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius } from '@/lib/constants';

interface ShariaBadgeProps {
    variant?: 'default' | 'outline' | 'glass';
    size?: 'small' | 'medium';
    style?: ViewStyle;
}

export default function ShariaBadge({
    variant = 'default',
    size = 'small',
    style,
}: ShariaBadgeProps) {
    const isSmall = size === 'small';

    const baseStyle: ViewStyle = {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 4 : 6,
        borderRadius: BorderRadius.full,
    };

    let variantStyle: ViewStyle = {};
    let textColor = Colors.brand.emerald;
    let iconColor = Colors.brand.emerald;

    switch (variant) {
        case 'default':
            variantStyle = {
                backgroundColor: 'rgba(16, 185, 129, 0.1)', // Light Emerald
            };
            break;
        case 'outline':
            variantStyle = {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.3)',
            };
            break;
        case 'glass':
            variantStyle = {
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                borderWidth: 1,
                borderColor: 'rgba(16, 185, 129, 0.2)',
            };
            break;
    }

    return (
        <View style={[baseStyle, variantStyle, style]}>
            <Ionicons
                name="shield-checkmark"
                size={isSmall ? 12 : 14}
                color={iconColor}
                style={{ marginRight: isSmall ? 4 : 6 }}
            />
            <Text
                style={{
                    fontSize: isSmall ? 10 : 12,
                    fontWeight: '600',
                    color: textColor,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                }}
            >
                Fatwa Approved
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({});
