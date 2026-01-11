'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-8 right-8 z-50 flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium hover:bg-white/10 transition-all text-white/80 hover:text-white"
        >
            <Globe size={16} />
            <span className="uppercase">{language}</span>
        </button>
    );
}
