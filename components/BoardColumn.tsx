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

export default function BoardColumn({ title, status, tasks, onDeleteTask }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({
        id: status,
    });

    return (
        <div className="flex flex-col h-full min-w-[300px] glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {title}
                <span className="ml-auto text-sm text-white/40">({tasks.length})</span>
            </h2>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 min-h-[200px]",
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
                            <div className="text-center text-white/20 text-sm italic">
                                Drop tasks here
                            </div>
                        )}
                    </AnimatePresence>
                </SortableContext>
            </div>
        </div>
    );
}
