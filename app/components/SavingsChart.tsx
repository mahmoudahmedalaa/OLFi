import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient as SvgGradient, Stop, Mask, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { Colors, BorderRadius } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';

const CHART_WIDTH = Dimensions.get('window').width - 80;
const CHART_HEIGHT = 180;
const PADDING = { top: 20, right: 20, bottom: 30, left: 55 };

interface DataPoint {
    month: number;
    cumulativeSavings: number;
}

interface SavingsChartProps {
    data: DataPoint[];
    processingFee: number;
}

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function SavingsChart({ data, processingFee }: SavingsChartProps) {
    const { theme } = useTheme();

    const animatedMaskWidth = useSharedValue(0);

    useEffect(() => {
        animatedMaskWidth.value = 0;
        animatedMaskWidth.value = withDelay(
            300,
            withTiming(CHART_WIDTH, {
                duration: 1500,
                easing: Easing.out(Easing.cubic)
            })
        );
    }, [data, animatedMaskWidth]);

    const animatedRectProps = useAnimatedProps(() => {
        return {
            width: animatedMaskWidth.value
        };
    });

    if (data.length < 2) return null;

    const plotWidth = CHART_WIDTH - PADDING.left - PADDING.right;
    const plotHeight = CHART_HEIGHT - PADDING.top - PADDING.bottom;

    const maxMonth = Math.max(...data.map((d) => d.month));
    const minSavings = Math.min(...data.map((d) => d.cumulativeSavings), 0);
    const maxSavings = Math.max(...data.map((d) => d.cumulativeSavings));
    const savingsRange = maxSavings - minSavings || 1;

    const scaleX = (month: number) =>
        PADDING.left + (month / maxMonth) * plotWidth;
    const scaleY = (savings: number) =>
        PADDING.top + plotHeight - ((savings - minSavings) / savingsRange) * plotHeight;

    // Generate SVG path
    const pathPoints = data.map((d) => `${scaleX(d.month)},${scaleY(d.cumulativeSavings)}`);
    const linePath = `M ${pathPoints.join(' L ')}`;

    // Find break-even point (where cumulative savings cross 0)
    const breakEvenPoint = data.find((d) => d.cumulativeSavings >= 0);

    // Area fill path
    const zeroY = scaleY(0);
    const areaPath = `${linePath} L ${scaleX(data[data.length - 1].month)},${zeroY} L ${scaleX(data[0].month)},${zeroY} Z`;

    // Y-axis labels (4 evenly spaced)
    const yLabels = Array.from({ length: 5 }, (_, i) => {
        const val = minSavings + (savingsRange / 4) * i;
        return { value: Math.round(val), y: scaleY(val) };
    });

    // X-axis labels (start, middle, end)
    const xLabels = [
        { month: data[0].month, x: scaleX(data[0].month) },
        { month: Math.round(maxMonth / 2), x: scaleX(Math.round(maxMonth / 2)) },
        { month: maxMonth, x: scaleX(maxMonth) },
    ];

    const formatK = (n: number) => {
        if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(0)}K`;
        return `${n}`;
    };

    return (
        <View
            style={{
                backgroundColor: theme.colors.card,
                borderRadius: BorderRadius.lg,
                padding: 16,
                borderWidth: 1,
                borderColor: theme.colors.border,
            }}
        >
            <Text
                style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: theme.colors.textTertiary,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 12,
                }}
            >
                Savings Over Time
            </Text>

            <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                <Defs>
                    <SvgGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={Colors.brand.emerald} stopOpacity="0.3" />
                        <Stop offset="1" stopColor={Colors.brand.emerald} stopOpacity="0.02" />
                    </SvgGradient>
                    <Mask id="revealMask">
                        <AnimatedRect x="0" y="0" height={CHART_HEIGHT} fill="white" animatedProps={animatedRectProps} />
                    </Mask>
                </Defs>

                {/* Grid lines */}
                {yLabels.map((label, i) => (
                    <Line
                        key={i}
                        x1={PADDING.left}
                        y1={label.y}
                        x2={CHART_WIDTH - PADDING.right}
                        y2={label.y}
                        stroke={theme.colors.border}
                        strokeWidth={0.5}
                        strokeDasharray="4,4"
                    />
                ))}

                {/* Zero line (if applicable) */}
                {minSavings < 0 && (
                    <Line
                        x1={PADDING.left}
                        y1={zeroY}
                        x2={CHART_WIDTH - PADDING.right}
                        y2={zeroY}
                        stroke={theme.colors.textTertiary}
                        strokeWidth={1}
                        strokeDasharray="6,3"
                    />
                )}

                {/* Area fill */}
                <Path d={areaPath} fill="url(#areaGradient)" mask="url(#revealMask)" />

                {/* Main line */}
                <Path
                    d={linePath}
                    fill="none"
                    stroke={Colors.brand.emerald}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mask="url(#revealMask)"
                />

                {/* Endpoint dot */}
                <Circle
                    cx={scaleX(data[data.length - 1].month)}
                    cy={scaleY(data[data.length - 1].cumulativeSavings)}
                    r={4}
                    fill={Colors.brand.emerald}
                    stroke="#fff"
                    strokeWidth={2}
                    mask="url(#revealMask)"
                />

                {/* Break-even dot */}
                {breakEvenPoint && processingFee > 0 && (
                    <Circle
                        cx={scaleX(breakEvenPoint.month)}
                        cy={scaleY(breakEvenPoint.cumulativeSavings)}
                        r={3.5}
                        fill="#F59E0B"
                        stroke="#fff"
                        strokeWidth={2}
                        mask="url(#revealMask)"
                    />
                )}

                {/* Y-axis labels */}
                {yLabels.map((label, i) => (
                    <SvgText
                        key={i}
                        x={PADDING.left - 8}
                        y={label.y + 4}
                        fontSize={10}
                        fill={theme.colors.textTertiary}
                        textAnchor="end"
                    >
                        {formatK(label.value)}
                    </SvgText>
                ))}

                {/* X-axis labels */}
                {xLabels.map((label, i) => (
                    <SvgText
                        key={i}
                        x={label.x}
                        y={CHART_HEIGHT - 5}
                        fontSize={10}
                        fill={theme.colors.textTertiary}
                        textAnchor="middle"
                    >
                        {label.month}mo
                    </SvgText>
                ))}
            </Svg>

            {/* Legend */}
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: Colors.brand.emerald,
                        }}
                    />
                    <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                        Cumulative Savings
                    </Text>
                </View>
                {processingFee > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <View
                            style={{
                                width: 8,
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#F59E0B',
                            }}
                        />
                        <Text style={{ fontSize: 11, color: theme.colors.textTertiary }}>
                            Break-Even
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}
