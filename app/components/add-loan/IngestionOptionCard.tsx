import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { LinearGradient } from 'expo-linear-gradient';

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
            <View style={[styles.iconContainer, isPrimary ? { backgroundColor: 'rgba(255,255,255,0.2)' } : { backgroundColor: theme.colors.bg }]}>
                <Ionicons name={icon} size={24} color={isPrimary ? '#fff' : Colors.brand.emerald} />
            </View>
            <View style={styles.textContainer}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, isPrimary ? { color: '#fff' } : { color: theme.colors.textPrimary }]}>
                        {title}
                    </Text>
                    {tag && (
                        <View style={[styles.tag, { backgroundColor: isPrimary ? 'rgba(255,255,255,0.2)' : theme.colors.border }]}>
                            <Text style={[styles.tagText, isPrimary ? { color: '#fff' } : { color: theme.colors.textSecondary }]}>{tag}</Text>
                        </View>
                    )}
                </View>
                <Text style={[styles.description, isPrimary ? { color: 'rgba(255,255,255,0.8)' } : { color: theme.colors.textSecondary }]}>
                    {description}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isPrimary ? 'rgba(255,255,255,0.5)' : theme.colors.textTertiary} />
        </View>
    );

    if (isPrimary) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.touchable}>
                <LinearGradient
                    colors={theme.gradients.brand}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientCard}
                >
                    {content}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

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
    gradientCard: {
        padding: Spacing.xl,
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
