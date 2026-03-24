import { db } from '@/api/infrastructure/database/config';

export type TaskSeed = {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export function setupTasksTable(): void {
  db.run('DROP TABLE IF EXISTS tasks');
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      category_id TEXT,
      created_at TEXT NOT NULL,
      user_id TEXT NOT NULL DEFAULT '',
      updated_at TEXT
    );
  `);
  db.run('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');
  db.run(
    'CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id)'
  );
}

export function clearTasksTable(): void {
  db.run('DELETE FROM tasks');
}

export function seedTask(
  task: Omit<TaskSeed, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
  }
): TaskSeed {
  const id = task.id ?? crypto.randomUUID();
  const now = new Date().toISOString();
  const createdAt = task.createdAt ?? now;
  const updatedAt = task.updatedAt ?? now;

  db.prepare(
    `
    INSERT INTO tasks (id, title, completed, user_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `
  ).run(
    id,
    task.title,
    task.completed ? 1 : 0,
    task.userId,
    createdAt,
    updatedAt
  );

  return {
    id,
    title: task.title,
    completed: task.completed,
    userId: task.userId,
    createdAt,
    updatedAt,
  };
}

export function seedTasks(
  tasks: Array<
    Omit<TaskSeed, 'id' | 'createdAt' | 'updatedAt'> & {
      id?: string;
      createdAt?: string;
      updatedAt?: string;
    }
  >
): TaskSeed[] {
  return tasks.map((task) => seedTask(task));
}

export function createTaskInPast(
  title: string,
  userId: string,
  completed: boolean,
  daysAgo: number,
  completedDaysAgo?: number
): TaskSeed {
  const createdDate = new Date();
  createdDate.setDate(createdDate.getDate() - daysAgo);

  const updatedDate =
    completed && completedDaysAgo !== undefined ? new Date() : createdDate;

  if (completed && completedDaysAgo !== undefined) {
    updatedDate.setDate(updatedDate.getDate() - completedDaysAgo);
  }

  return seedTask({
    title,
    userId,
    completed,
    createdAt: createdDate.toISOString(),
    updatedAt: updatedDate.toISOString(),
  });
}

export function seedUserTasks(
  userId: string,
  config: {
    totalTasks?: number;
    completedTasks?: number;
    daysRange?: number;
  }
): TaskSeed[] {
  const { totalTasks = 10, completedTasks = 5, daysRange = 30 } = config;
  const tasks: TaskSeed[] = [];

  for (let i = 0; i < totalTasks; i++) {
    const isCompleted = i < completedTasks;
    const daysAgo = Math.floor(Math.random() * daysRange);

    tasks.push(
      createTaskInPast(
        `Task ${i + 1}`,
        userId,
        isCompleted,
        daysAgo,
        isCompleted ? Math.floor(Math.random() * daysAgo) : undefined
      )
    );
  }

  return tasks;
}
