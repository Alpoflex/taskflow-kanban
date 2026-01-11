'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Sparkles } from 'lucide-react';
import BoardColumn from '@/components/BoardColumn';
import AddTaskForm from '@/components/AddTaskForm';
import LanguageToggle from '@/components/LanguageToggle';
import TaskCard from '@/components/TaskCard';
import { Task, TaskStatus } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const STORAGE_KEY = 'taskflow-tasks';

export default function Home() {
  const { t } = useLanguage();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load tasks', e);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const addTask = (title: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      status: 'todo',
      createdAt: Date.now(),
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    if (['todo', 'inProgress', 'done'].includes(newStatus)) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }

    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);

    if (activeTask && overTask && activeTask.status === overTask.status) {
      const activeIndex = tasks.findIndex((t) => t.id === active.id);
      const overIndex = tasks.findIndex((t) => t.id === over.id);

      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: t.columns.todo },
    { id: 'inProgress', title: t.columns.inProgress },
    { id: 'done', title: t.columns.done },
  ];

  return (
    <main className="min-h-screen p-8 relative">
      <LanguageToggle />

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4 bg-white px-8 py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0_0_#000]">
            <Sparkles size={40} strokeWidth={3} className="text-amber-500" fill="currentColor" />
            <h1 className="text-6xl font-black tracking-tighter text-black uppercase">
              {t.title}
            </h1>
            <Sparkles size={40} strokeWidth={3} className="text-pink-500" fill="currentColor" />
          </div>
          <p className="text-black font-bold uppercase tracking-wide text-lg bg-emerald-400 inline-block px-6 py-2 rounded-full border-3 border-black">
            {t.subtitle}
          </p>
        </header>

        <div className="mb-8">
          <AddTaskForm onAdd={addTask} />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                title={column.title}
                status={column.id}
                tasks={tasks.filter((t) => t.status === column.id)}
                onDeleteTask={deleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-12 scale-110">
                <TaskCard task={activeTask} onDelete={() => { }} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
