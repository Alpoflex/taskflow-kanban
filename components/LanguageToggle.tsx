'use client';

import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-8 right-8 z-50 flex items-center gap-2 px-5 py-3 bg-violet-500 brutal-btn rounded-full text-base font-black uppercase tracking-tight text-white hover:bg-violet-600"
        >
            <Globe size={20} strokeWidth={3} />
            <span>{language}</span>
        </button>
    );
}
