"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { en } from "../translations/en";
import { ar } from "../translations/ar";

type Language = "en" | "ar";


interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("en");

    // On mount, check if there's a saved language
    useEffect(() => {
        const saved = localStorage.getItem("language") as Language;
        if (saved && (saved === "en" || saved === "ar")) {
            // eslint-disable-next-line
            setLanguage(saved);
        }
    }, []);

    // Update dir attribute globally when language changes
    useEffect(() => {
        const isRtl = language === "ar";
        document.documentElement.dir = isRtl ? "rtl" : "ltr";
        document.documentElement.lang = language;
        localStorage.setItem("language", language);
    }, [language]);

    const t = (key: string): string => {
        const dict = language === "en" ? en : ar;
        const keys = key.split(".");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any = dict;
        for (const k of keys) {
            if (value[k] === undefined) {
                return key; // return key if not found
            }
            value = value[k];
        }
        return value as unknown as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRtl: language === "ar" }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
