/**
 * BuyOut Design Tokens
 * 
 * Central source of truth for colors, spacing, and typography.
 * Used for inline styles when NativeWind classes aren't sufficient (e.g., LinearGradient).
 * Tailwind classes should be preferred — these are for programmatic use only.
 */

export const Colors = {
    // Brand palette — fintech premium, dark-first
    brand: {
        emerald: '#10B981',
        emeraldLight: '#34D399',
        emeraldDark: '#059669',
        teal: '#14B8A6',
        tealLight: '#2DD4BF',
        tealDark: '#0D9488',
    },

    // Backgrounds
    dark: {
        primary: '#0F172A',    // Slate 900 — main bg
        secondary: '#1E293B',  // Slate 800 — cards
        tertiary: '#334155',   // Slate 700 — elevated surfaces
        surface: '#475569',    // Slate 600 — inputs/borders
    },

    light: {
        primary: '#FFFFFF',
        secondary: '#F8FAFC',  // Slate 50
        tertiary: '#F1F5F9',   // Slate 100
        surface: '#E2E8F0',    // Slate 200
    },

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Text
    text: {
        dark: {
            primary: '#F8FAFC',
            secondary: '#94A3B8',
            tertiary: '#64748B',
            disabled: '#475569',
        },
        light: {
            primary: '#0F172A',
            secondary: '#475569',
            tertiary: '#94A3B8',
            disabled: '#CBD5E1',
        },
    },

    // Gradients (for LinearGradient)
    gradients: {
        brand: ['#10B981', '#14B8A6'],
        brandDark: ['#059669', '#0D9488'],
        card: ['#1E293B', '#0F172A'],
        cardElevated: ['#334155', '#1E293B'],
        premium: ['#10B981', '#3B82F6'],
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
