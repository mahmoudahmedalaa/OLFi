import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { useAnimatedProps, useSharedValue, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useTheme } from '@/lib/theme-context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color: string;
    backgroundColor?: string;
    showPercentage?: boolean;
}

export default function CircularProgress({
    progress,
    size = 64,
    strokeWidth = 6,
    color,
    backgroundColor,
    showPercentage = true,
}: CircularProgressProps) {
    const { theme } = useTheme();
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const animatedProgress = useSharedValue(0);

    React.useEffect(() => {
        animatedProgress.value = 0;
        animatedProgress.value = withDelay(
            150,
            withTiming(progress, {
                duration: 1000,
                easing: Easing.out(Easing.cubic)
            })
        );
    }, [progress, animatedProgress]);

    const animatedCircleProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circumference * (1 - animatedProgress.value)
        };
    });

    const bgStrokeColor = backgroundColor || theme.colors.border;

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={size} height={size} style={{ position: 'absolute' }}>
                {/* Background Circle */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={bgStrokeColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    animatedProps={animatedCircleProps}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </Svg>
            {showPercentage && (
                <Text style={{ fontSize: size * 0.25, fontWeight: '700', color: theme.colors.textPrimary }}>
                    {Math.round(progress * 100)}%
                </Text>
            )}
        </View>
    );
}
