import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BorderRadius } from '@/lib/constants';
import { Theme } from '@/lib/theme-context';

export function QuickActionCard({
    icon,
    label,
    color,
    theme,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    color: string;
    theme: Theme;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: `${color}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8,
                }}
            >
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: '600',
                    color: theme.colors.textSecondary,
                    textAlign: 'center',
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
