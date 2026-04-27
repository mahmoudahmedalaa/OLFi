import React from 'react';
import { View, StyleSheet, Platform, StyleProp, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/lib/theme-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GlassHeaderProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function GlassHeader({ children, style }: GlassHeaderProps) {
    const { theme } = useTheme();
    const isDark = theme.isDark;
    const insets = useSafeAreaInsets();
    const isIos = Platform.OS === 'ios';

    return (
        <View style={[{ zIndex: 100 }, style]}>
            {isIos && (
                <BlurView
                    intensity={80}
                    tint={isDark ? "dark" : "light"}
                    style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: isDark ? 'rgba(1, 24, 25, 0.6)' : 'rgba(225, 222, 209, 0.6)' }
                    ]}
                />
            )}
            <View
                style={{
                    paddingTop: insets.top + 12, // Add some padding below notch
                    paddingBottom: 20,
                    paddingHorizontal: 20,
                    backgroundColor: isIos ? 'transparent' : theme.colors.card,
                    borderBottomWidth: isIos ? 0 : 1,
                    borderBottomColor: theme.colors.border,
                }}
            >
                {children}
            </View>
            {/* Soft border constraint on iOS */}
            {isIos && (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    backgroundColor: theme.colors.border,
                    opacity: 0.5,
                }} />
            )}
        </View>
    );
}
