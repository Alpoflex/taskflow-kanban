'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { Task, TaskStatus } from '@/types';
import { cn } from '@/lib/utils';

interface BoardColumnProps {
    title: string;
    status: TaskStatus;
    tasks: Task[];
    onDeleteTask: (id: string) => void;
}

const COLUMN_STYLES = {
    todo: 'bg-amber-500 border-amber-700 text-white',
    inProgress: 'bg-emerald-500 border-emerald-700 text-white',
    done: 'bg-rose-500 border-rose-700 text-white',
};

export default function BoardColumn({ title, status, tasks, onDeleteTask }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    const columnStyle = COLUMN_STYLES[status];

    return (
        <div className="flex flex-col h-full min-w-[320px]">
            {/* Column Header */}
            <div className={cn(
                "mb-4 p-4 border-4 border-black font-black text-lg uppercase tracking-tight",
                columnStyle
            )}>
                <div className="flex items-center justify-between">
                    <span>{title}</span>
                    <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded-full">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Tasks Container */}
            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 p-4 bg-white/40 border-4 border-black rounded-lg min-h-[400px]",
                    tasks.length === 0 && "flex items-center justify-center"
                )}
            >
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    <AnimatePresence>
                        {tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onDelete={onDeleteTask}
                                />
                            ))
                        ) : (
                            <div className="text-center text-black/30 text-sm font-bold uppercase">
                                Drop Here
                            </div>
                        )}
                    </AnimatePresence>
                </SortableContext>
            </div>
        </div>
    );
}
