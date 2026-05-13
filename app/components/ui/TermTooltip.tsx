/**
 * TermTooltip - reusable inline tooltip for acronyms and financial jargon.
 *
 * Usage:
 *   <TermTooltip term="EMI" definition="Equated Monthly Instalment..." />
 *   <TermTooltip term="Debt-to-Income Ratio (DTI)" short="DTI" definition="..." labelStyle={{ fontSize: 13 }} />
 *
 * Uses the render-function pattern for `from` prop to be fully type-safe
 * with react-native-popover-view.
 */
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextStyle, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius, Typography } from '@/lib/constants';

interface TermTooltipProps {
    /** The full term - shown bold in the popover title */
    term: string;
    /** Plain-English explanation shown in the popover body */
    definition: string;
    /** Short label to display inline (defaults to `term`) */
    short?: string;
    /** Merge extra styles into the tappable label Text */
    labelStyle?: TextStyle;
}

export function TermTooltip({ term, definition, short, labelStyle }: TermTooltipProps) {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const iconColor = typeof labelStyle?.color === 'string' ? labelStyle.color : Colors.brand.emerald;

    return (
        <Popover
            isVisible={visible}
            onRequestClose={() => setVisible(false)}
            from={(sourceRef) => (
                <TouchableOpacity
                    ref={sourceRef as any}
                    onPress={() => setVisible(true)}
                    hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                    activeOpacity={0.7}
                    style={styles.trigger}
                >
                    <Text style={[styles.label, { color: Colors.brand.emerald }, labelStyle]}>
                        {short ?? term}
                    </Text>
                    <Ionicons name="information-circle-outline" size={14} color={iconColor} />
                </TouchableOpacity>
            )}
            placement={PopoverPlacement.BOTTOM}
            popoverStyle={{
                backgroundColor: theme.colors.cardElevated,
                borderRadius: BorderRadius.md,
                padding: 14,
                maxWidth: 260,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
            backgroundStyle={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
            arrowSize={{ width: 14, height: 7 }}
        >
            <View>
                <Text style={[styles.popTitle, { color: theme.colors.textPrimary }]}>
                    {term}
                </Text>
                <Text style={[styles.popBody, { color: theme.colors.textSecondary }]}>
                    {definition}
                </Text>
            </View>
        </Popover>
    );
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        alignSelf: 'flex-start',
    },
    label: {
        ...Typography.captionBold,
    },
    popTitle: {
        ...Typography.bodyBold,
        marginBottom: 6,
    },
    popBody: {
        ...Typography.caption,
        lineHeight: 18,
    },
});
