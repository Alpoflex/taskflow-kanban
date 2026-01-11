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

  // Load tasks from localStorage
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

  // Save to localStorage whenever tasks change
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

    // Update task status
    if (['todo', 'inProgress', 'done'].includes(newStatus)) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    }

    // Handle reordering within same column
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
    <main className="min-h-screen p-8 relative overflow-hidden">
      <LanguageToggle />

      {/* Background effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-2">
            {t.title}
          </h1>
          <p className="text-white/40 text-sm tracking-widest uppercase">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="rotate-6 opacity-80">
                <TaskCard task={activeTask} onDelete={() => { }} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
