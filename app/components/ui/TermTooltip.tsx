/**
 * TermTooltip — reusable inline tooltip for acronyms and financial jargon.
 * Standardized across the app using a premium Bottom Sheet to prevent 
 * clipping and provide a native, elegant user experience.
 */
import React, { useCallback, useRef } from 'react';
import { Text, StyleSheet, TouchableOpacity, TextStyle, View } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme-context';
import { Colors, Typography, Spacing } from '@/lib/constants';

interface TermTooltipProps {
    /** The full term — shown bold in the popover title */
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
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
            />
        ),
        []
    );

    return (
        <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[styles.label, { color: theme.colors.textPrimary }, labelStyle]}>
                    {short ?? term}
                </Text>
                <TouchableOpacity
                    onPress={handlePresentModalPress}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="information-circle-outline" size={16} color={Colors.brand.emerald} />
                </TouchableOpacity>
            </View>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                enableDynamicSizing={true}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: theme.colors.bg }}
                handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={[styles.popTitle, { color: theme.colors.textPrimary }]}>
                        {term}
                    </Text>
                    <Text style={[styles.popBody, { color: theme.colors.textSecondary }]}>
                        {definition}
                    </Text>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
}

const styles = StyleSheet.create({
    label: {
        ...Typography.captionBold,
    },
    contentContainer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xl * 2.5, // Extra padding for safe area
    },
    popTitle: {
        ...Typography.h2,
        marginBottom: Spacing.sm,
    },
    popBody: {
        ...Typography.body,
        lineHeight: 24,
    },
});
