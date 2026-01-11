'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddTaskFormProps {
    onAdd: (title: string) => void;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onAdd(title);
        setTitle('');
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 brutal-btn rounded-xl p-5 flex items-center justify-center gap-3 text-white hover:from-amber-600 hover:to-orange-700"
            >
                <Plus size={24} strokeWidth={3} />
                <span className="text-lg uppercase tracking-tight font-black">{t.actions.addTask}</span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white brutal-card rounded-xl p-6">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.actions.taskPlaceholder}
                className="w-full brutal-input rounded-lg px-4 py-3 text-base font-semibold placeholder:text-black/40 mb-4"
                autoFocus
            />
            <div className="flex gap-3">
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1 bg-emerald-500 text-white brutal-btn rounded-lg px-6 py-3 text-base uppercase tracking-tight hover:bg-emerald-600 font-black"
                >
                    {t.actions.addTask}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setTitle('');
                    }}
                    className="px-6 py-3 bg-red-500 text-white brutal-btn rounded-lg hover:bg-red-600 uppercase tracking-tight font-black"
                >
                    <X size={20} strokeWidth={3} />
                </button>
            </div>
        </form>
    );
}
