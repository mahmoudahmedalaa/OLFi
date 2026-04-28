import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '@/lib/language-context';
import { useTheme } from '@/lib/theme-context';
import { Colors, BorderRadius } from '@/lib/constants';

export function LanguageToggle({ style }: { style?: any }) {
    const { language, setLanguage } = useLanguage();
    const { theme } = useTheme();

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <TouchableOpacity
            onPress={toggleLang}
            activeOpacity={0.7}
            style={[
                {
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: BorderRadius.full,
                    backgroundColor: theme.colors.card,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                    alignSelf: 'flex-start',
                },
                style
            ]}
        >
            <Ionicons name="language-outline" size={16} color={theme.colors.textPrimary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.textPrimary }}>
                {language === 'en' ? 'العربية' : 'English'}
            </Text>
        </TouchableOpacity>
    );
}
