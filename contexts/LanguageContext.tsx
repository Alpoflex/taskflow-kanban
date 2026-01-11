'use client';

import React, { createContext, useContext, useState } from 'react';
import { dictionary, Language } from '@/lib/dictionary';

type LanguageContextType = {
    language: Language;
    toggleLanguage: () => void;
    t: typeof dictionary.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'tr' : 'en'));
    };

    const value = {
        language,
        toggleLanguage,
        t: dictionary[language],
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
