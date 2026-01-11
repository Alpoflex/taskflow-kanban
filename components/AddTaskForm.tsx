'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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
                className="w-full glass hover:bg-white/10 rounded-xl p-4 flex items-center gap-2 text-white/60 hover:text-white transition-all group"
            >
                <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-medium">{t.actions.addTask}</span>
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="glass rounded-xl p-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.actions.taskPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/30 mb-3"
                autoFocus
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className="flex-1 bg-primary hover:bg-primary/80 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all"
                >
                    {t.actions.addTask}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(false);
                        setTitle('');
                    }}
                    className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
