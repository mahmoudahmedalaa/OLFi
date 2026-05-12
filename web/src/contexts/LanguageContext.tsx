"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "../../messages/en.json";
import arMessages from "../../messages/ar.json";

type Language = "en" | "ar";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messagesMap: Record<Language, typeof enMessages> = {
    en: enMessages,
    ar: arMessages,
};

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

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isRtl: language === "ar" }}>
            <NextIntlClientProvider locale={language} messages={messagesMap[language]} timeZone="Asia/Dubai">
                {children}
            </NextIntlClientProvider>
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
