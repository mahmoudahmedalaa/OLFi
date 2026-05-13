/**
 * OLFi Design Tokens
 * 
 * Central source of truth for colors, spacing, and typography.
 * Used for inline styles when NativeWind classes aren't sufficient (e.g., LinearGradient).
 * Tailwind classes should be preferred - these are for programmatic use only.
 */

export const Colors = {
    // Brand palette - fintech premium, dark-first
    brand: {
        emerald: '#10B981',      // Emerald 500
        emeraldLight: '#34D399', // Emerald 400
        emeraldDark: '#047857',  // Emerald 700
        teal: '#4FD1C5',         // Teal 500
        tealLight: '#2DD4BF',    // Teal 400
        tealDark: '#0F766E',     // Teal 700
    },

    // Backgrounds
    dark: {
        primary: '#011819',
        secondary: '#0A2525',
        tertiary: '#133030',
        surface: '#1B3B3B',
    },

    light: {
        primary: '#E1DED1',
        secondary: '#EDE9DD',
        tertiary: '#D5D0C4',
        surface: '#C8C3B7',
    },

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Text
    text: {
        dark: {
            primary: '#E1DED1',
            secondary: '#C8C3B7',
            tertiary: '#94A3B8',
            disabled: '#475569',
        },
        light: {
            primary: '#011819',
            secondary: '#133030',
            tertiary: '#4A5568',
            disabled: '#A0AEC0',
        },
    },

    // Gradients (for LinearGradient)
    gradients: {
        brand: ['#011819', '#0A2525'],
        brandDark: ['#0A2525', '#234E52'],
        card: ['#0A2525', '#011819'],
        cardElevated: ['#133030', '#0A2525'],
        premium: ['#011819', '#011819'],
    },
} as const;

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
} as const;

export const BorderRadius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    '2xl': 28,
    full: 9999,
} as const;

export const Typography = {
    display: { fontSize: 32, fontWeight: '700' as const, lineHeight: 38 },
    h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 31 },
    h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 26 },
    h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
    bodyBold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
    caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
    captionBold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
    overline: { fontSize: 11, fontWeight: '600' as const, lineHeight: 16, letterSpacing: 0.5 },
} as const;
