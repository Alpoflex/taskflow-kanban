export type Language = 'en' | 'tr';

export const dictionary = {
    en: {
        title: "TaskFlow",
        subtitle: "Organize Your Work",
        columns: {
            todo: "To Do",
            inProgress: "In Progress",
            done: "Done",
        },
        actions: {
            addTask: "Add Task",
            deleteTask: "Delete",
            taskPlaceholder: "Enter task description...",
        },
    },
    tr: {
        title: "TaskFlow",
        subtitle: "İşlerini Düzenle",
        columns: {
            todo: "Yapılacak",
            inProgress: "Devam Ediyor",
            done: "Tamamlandı",
        },
        actions: {
            addTask: "Görev Ekle",
            deleteTask: "Sil",
            taskPlaceholder: "Görev açıklaması girin...",
        },
    }
};
