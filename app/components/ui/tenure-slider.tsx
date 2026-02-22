import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Colors, Typography } from '@/lib/constants';
import { useTheme } from '@/lib/theme-context';
import { hapticLight } from '@/lib/haptics';

export interface TenureSliderProps {
    tenure: number;
    onTenureChange: (val: number) => void;
    maxTenureMonths?: number;
}

export const TenureSlider: React.FC<TenureSliderProps> = ({
    tenure,
    onTenureChange,
    maxTenureMonths = 48
}) => {
    const { theme } = useTheme();

    return (
        <View>
            <Text style={{ ...Typography.captionBold, color: theme.colors.textSecondary, marginBottom: 12 }}>
                Duration: {tenure} Months {(tenure / 12).toFixed(1)} years
            </Text>
            <Slider
                style={{ width: '100%', height: 40, opacity: 1 }}
                minimumValue={12}
                maximumValue={maxTenureMonths}
                step={6}
                value={tenure}
                onValueChange={(val) => {
                    hapticLight();
                    onTenureChange(val);
                }}
                minimumTrackTintColor={Colors.brand.emerald}
                maximumTrackTintColor={theme.colors.border}
                thumbTintColor={Colors.brand.emerald}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>12m (Highest EMI)</Text>
                <Text style={{ ...Typography.caption, color: theme.colors.textTertiary }}>{maxTenureMonths}m (Lowest EMI)</Text>
            </View>
        </View>
    );
};
