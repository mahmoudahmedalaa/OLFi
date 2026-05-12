import React, { useMemo } from 'react';
import { View, Text, StyleSheet , Platform } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useTheme } from '@/lib/theme-context';
import { BorderRadius } from '@/lib/constants';
import { BlurView } from 'expo-blur';

interface InfoBottomSheetProps {
    bottomSheetRef: React.RefObject<any>;
    title: string;
    description: string;
    insightTitle?: string;
    insightText?: string;
    footerText?: string;
}

export default function InfoBottomSheet({
    bottomSheetRef,
    title,
    description,
    insightTitle,
    insightText,
    footerText,
}: InfoBottomSheetProps) {
    const { theme } = useTheme();
    const snapPoints = useMemo(() => ['40%', '50%'], []);
    const isIos = Platform.OS === 'ios';

    const renderBackdrop = React.useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
            />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: isIos ? 'transparent' : theme.colors.card }}
            backgroundComponent={isIos ? (props) => (
                <View {...props} style={[props.style, { overflow: 'hidden', borderRadius: 24 }]}>
                    <BlurView
                        intensity={80}
                        tint={theme.isDark ? "dark" : "light"}
                        style={StyleSheet.absoluteFill}
                    />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)' }]} />
                </View>
            ) : undefined}
            handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary }}
        >
            <BottomSheetView style={{ flex: 1, padding: 24 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 12 }}>
                    {title}
                </Text>
                <Text style={{ fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 16 }}>
                    {description}
                </Text>

                {insightTitle && insightText && (
                    <View style={{
                        backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                        padding: 16,
                        borderRadius: BorderRadius.lg,
                        marginBottom: 16,
                        borderWidth: 1,
                        borderColor: theme.colors.border
                    }}>
                        <Text style={{ fontSize: 14, color: theme.colors.textPrimary, fontWeight: '600', marginBottom: 8 }}>
                            {insightTitle}
                        </Text>
                        <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20 }}>
                            {insightText}
                        </Text>
                    </View>
                )}

                {footerText && (
                    <Text style={{ fontSize: 14, color: theme.colors.textTertiary, textAlign: 'center', marginTop: 'auto', marginBottom: 20 }}>
                        {footerText}
                    </Text>
                )}
            </BottomSheetView>
        </BottomSheetModal>
    );
}
