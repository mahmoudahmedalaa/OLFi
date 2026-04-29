import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './translations/en';
import ar from './translations/ar';

const LANGUAGE_KEY = '@olfi_language';

export type Language = 'en' | 'ar';

type DeepKeyPaths<T, Prefix extends string = ''> = {
    [K in keyof T]: T[K] extends object
    ? DeepKeyPaths<T[K], `${Prefix}${K & string}.`>
    : `${Prefix}${K & string}`;
}[keyof T];

type Translations = typeof en;

type NestedRecord = { [key: string]: NestedRecord | string };

function getNestedValue(obj: NestedRecord, path: string): string {
    const result = path.split('.').reduce<NestedRecord | string | undefined>(
        (acc, key) => (acc && typeof acc === 'object' ? acc[key] : undefined),
        obj
    );
    return typeof result === 'string' ? result : path;
}

interface LanguageContextType {
    language: Language;
    isRtl: boolean;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: DeepKeyPaths<Translations>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = { en, ar };

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');

    useEffect(() => {
        let mounted = true;
        AsyncStorage.getItem(LANGUAGE_KEY).then((stored) => {
            if (mounted && (stored === 'en' || stored === 'ar')) {
                setLanguageState(stored);
            }
        }).catch(() => { });
        return () => { mounted = false; };
    }, []);

    const setLanguage = async (lang: Language) => {
        setLanguageState(lang);
        await AsyncStorage.setItem(LANGUAGE_KEY, lang);
    };

    const t = (key: DeepKeyPaths<Translations>): string => {
        return getNestedValue(translations[language] as unknown as NestedRecord, key as string);
    };

    return (
        <LanguageContext.Provider value={{ language, isRtl: language === 'ar', setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used inside <LanguageProvider>');
    }
    return context;
}
