import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from './constants';

// ─── Types ───────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
    bg: string;
    card: string;
    cardElevated: string;
    surface: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textDisabled: string;
}

export interface ThemeGradients {
    card: [string, string];
    cardElevated: [string, string];
    premium: [string, string];
    brand: [string, string];
    brandDark: [string, string];
}

export interface Theme {
    colors: ThemeColors;
    gradients: ThemeGradients;
    isDark: boolean;
}

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

// ─── Theme definitions ───────────────────────────────────────────────
const darkTheme: Theme = {
    colors: {
        bg: Colors.dark.primary,
        card: Colors.dark.secondary,
        cardElevated: Colors.dark.tertiary,
        surface: Colors.dark.surface,
        border: Colors.dark.tertiary,
        textPrimary: Colors.text.dark.primary,
        textSecondary: Colors.text.dark.secondary,
        textTertiary: Colors.text.dark.tertiary,
        textDisabled: Colors.text.dark.disabled,
    },
    gradients: {
        card: ['#0A2525', '#011819'],
        cardElevated: ['#133030', '#0A2525'],
        premium: ['#011819', '#011819'],
        brand: ['#011819', '#0A2525'],
        brandDark: ['#0A2525', '#234E52'],
    },
    isDark: true,
};

const lightTheme: Theme = {
    colors: {
        bg: Colors.light.primary,
        card: Colors.light.secondary,
        cardElevated: Colors.light.tertiary,
        surface: Colors.light.surface,
        border: Colors.light.surface,
        textPrimary: Colors.text.light.primary,
        textSecondary: Colors.text.light.secondary,
        textTertiary: Colors.text.light.tertiary,
        textDisabled: Colors.text.light.disabled,
    },
    gradients: {
        card: ['#EDE9DD', '#E1DED1'],
        cardElevated: ['#D5D0C4', '#EDE9DD'],
        premium: ['#0A2525', '#011819'],
        brand: ['#011819', '#0A2525'],
        brandDark: ['#0A2525', '#234E52'],
    },
    isDark: false,
};

// ─── Context ─────────────────────────────────────────────────────────
const STORAGE_KEY = '@buyout_theme';

const ThemeContext = createContext<ThemeContextType>({
    theme: darkTheme,
    mode: 'dark',
    setMode: () => { },
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useSystemColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('dark');
    const [loaded, setLoaded] = useState(false);

    // Load persisted preference on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
            if (stored === 'light' || stored === 'dark' || stored === 'system') {
                setModeState(stored);
            }
            setLoaded(true);
        });
    }, []);

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        AsyncStorage.setItem(STORAGE_KEY, newMode);
    };

    const resolvedIsDark = useMemo(() => {
        if (mode === 'system') return systemScheme !== 'light';
        return mode === 'dark';
    }, [mode, systemScheme]);

    const theme = resolvedIsDark ? darkTheme : lightTheme;

    // Don't render children until we've loaded the persisted theme to avoid flash
    if (!loaded) return null;

    return (
        <ThemeContext.Provider value={{ theme, mode, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
