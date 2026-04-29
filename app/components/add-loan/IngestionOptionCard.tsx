import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

interface IngestionOptionCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    onPress: () => void;
    tag?: string;
    isPrimary?: boolean;
}

export default function IngestionOptionCard({
    icon,
    title,
    description,
    onPress,
    tag,
    isPrimary = false,
}: IngestionOptionCardProps) {
    const { theme } = useTheme();

    const content = (
        <View style={styles.contentContainer}>
            <View style={[styles.iconContainer, { backgroundColor: isPrimary ? `${Colors.brand.emerald}15` : theme.colors.bg }]}>
                <Ionicons name={icon} size={24} color={Colors.brand.emerald} />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        {title}
                    </Text>
                    {tag && (
                        <View style={[styles.tag, { backgroundColor: isPrimary ? `${Colors.brand.emerald}15` : theme.colors.border }]}>
                            <Text style={[styles.tagText, { color: isPrimary ? Colors.brand.emerald : theme.colors.textSecondary }]}>{tag}</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                    {description}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
        </View>
    );

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.touchable, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderWidth: 1 }]}
        >
            {content}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchable: {
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.lg,
        overflow: 'hidden',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.lg,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        ...Typography.h3,
        flexShrink: 1,
        marginRight: Spacing.sm,
    },
    description: {
        ...Typography.caption,
        lineHeight: 20,
    },
    tag: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    tagText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
