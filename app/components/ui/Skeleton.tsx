import React, { useEffect } from 'react';
import { StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme-context';

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
    style?: StyleProp<ViewStyle>;
}

export default function Skeleton({ width, height, borderRadius = 4, style }: SkeletonProps) {
    const { theme } = useTheme();
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 800 }),
                withTiming(0.3, { duration: 800 })
            ),
            -1, // infinite repeat
            true // reverse
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: theme.colors.border,
                },
                animatedStyle,
                style,
            ]}
        />
    );
}
