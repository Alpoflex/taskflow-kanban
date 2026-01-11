export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
    id: string;
    title: string;
    status: TaskStatus;
    createdAt: number;
}

export interface Column {
    id: TaskStatus;
    title: string;
}
