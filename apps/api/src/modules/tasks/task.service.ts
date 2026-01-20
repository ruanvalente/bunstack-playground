import type { Task } from "./task.model";

/**
 *  In-memory task storage
 */
const tasks: Array<Task> = [
  {
    id: "1",
    title: "Sample Task 1",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "2",
    title: "Sample Task 2",
    completed: true,
    createdAt: new Date(),
  },
  {
    id: "3",
    title: "Sample Task 3",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "4",
    title: "Sample Task 4",
    completed: true,
    createdAt: new Date(),
  },
];

/**
 * Task Service
 *
 * Responsible for handling business logic related to tasks.
 * Does not handle HTTP concerns (status codes, request/response).
 */
export const taskService = {
  /**
   * List all tasks.
   *
   * @returns {Task[]} List of tasks
   */
  list(): Task[] {
    return tasks;
  },

  /**
   * Create a new task.
   *
   * @param {string} title - Task title
   * @returns {Task} Newly created task
   */
  create(title: string): Task {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };

    tasks.push(task);
    return task;
  },

  /**
   * Update a task title.
   *
   * @param {string} id - Task identifier
   * @param {string} title - New task title
   * @returns {Task | null} Updated task or null if not found
   */
  update(id: string, title: string): Task | null {
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return null;
    }

    task.title = title;
    return task;
  },

  /**
   * Mark a task as completed.
   *
   * @param {string} id - Task identifier
   * @returns {Task | null} Updated task or null if not found
   */
  complete(id: string): Task | null {
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return null;
    }

    task.completed = true;
    return task;
  },

  /**
   * Delete a task.
   *
   * @param {string} id - Task identifier
   * @returns {boolean} True if task was deleted, false if not found
   */
  delete(id: string): boolean {
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return false;
    }

    tasks.splice(index, 1);
    return true;
  },

  /**
   * Find a task by ID.
   *
   * @param {string} id - Task identifier
   * @returns {Task | null} Task if found, otherwise null
   */
  findById(id: string): Task | null {
    return tasks.find((t) => t.id === id) ?? null;
  },
};
