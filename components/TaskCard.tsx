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

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={cn(
                "group p-4 glass rounded-xl transition-all hover:border-white/20",
                isDragging && "opacity-50 cursor-grabbing"
            )}
        >
            <div className="flex items-start gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="mt-1 cursor-grab active:cursor-grabbing text-white/30 hover:text-white/60 transition-colors"
                >
                    <GripVertical size={18} />
                </button>

                <p className="flex-1 text-sm text-white/90 break-words">
                    {task.title}
                </p>

                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                    title={t.actions.deleteTask}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
}
