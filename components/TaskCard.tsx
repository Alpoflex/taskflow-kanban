'use client';

import { motion } from 'framer-motion';
import { Trash2, GripVertical } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
}

const CARD_COLORS = [
    'bg-amber-300',
    'bg-emerald-300',
    'bg-rose-300',
    'bg-sky-300',
    'bg-violet-300',
];

export default function TaskCard({ task, onDelete }: TaskCardProps) {
    const { t } = useLanguage();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const colorIndex = task.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % CARD_COLORS.length;
    const bgColor = CARD_COLORS[colorIndex];

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
            className={cn(
                "group p-4 brutal-card",
                bgColor,
                isDragging && "opacity-50 cursor-grabbing rotate-6"
            )}
        >
            <div className="flex items-start gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-1 cursor-grab active:cursor-grabbing text-black/60 hover:text-black transition-colors"
                >
                    <GripVertical size={20} strokeWidth={3} />
                </button>

                <p className="flex-1 text-sm font-semibold text-black break-words">
                    {task.title}
                </p>

                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all brutal-btn-sm border-2 border-black"
                    title={t.actions.deleteTask}
                >
                    <Trash2 size={14} strokeWidth={3} />
                </button>
            </div>
        </motion.div>
    );
}
