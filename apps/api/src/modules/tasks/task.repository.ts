import type {
  PaginatedTasksResponseDTO,
  PaginationQueryDTO,
} from "@bunstack-playground/shared";
import { db } from "@/api/infra/database";
import type { Task } from "@bunstack-playground/shared/domain";

export const taskRepository = {
  /**
   * Return all tasks with pagination
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Promise<PaginatedResult<Task>>} Paginated tasks
   */
  async findAll(
    params: PaginationQueryDTO,
  ): Promise<PaginatedTasksResponseDTO> {
    const { page = 1, pageSize = 10, sortOrder = "ASC" } = params;

    // Get total count
    const countResult = db
      .prepare("SELECT COUNT(*) as count FROM tasks")
      .get() as { count: number };
    const total = countResult.count;

    // Calculate pagination
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    // Get paginated data
    const rows = db
      .prepare(
        `
      SELECT id, title, completed, created_at
      FROM tasks
      ORDER BY created_at ${sortOrder}
      LIMIT ? OFFSET ?
    `,
      )
      .all(pageSize, offset);

    return {
      data: rows.map(mapRowToTask),
      pagination: {
        page,
        total,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        sortBy: "createdAt",
        sortOrder,
        timestamp: new Date().toISOString(),
      },
    };
  },

  /**
   * Find task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Task | null>} Task or null if not found
   */
  async findById(id: string): Promise<Task | null> {
    const row = db
      .prepare(
        `
      SELECT id, title, completed, created_at
      FROM tasks
      WHERE id = ?
    `,
      )
      .get(id);

    return row ? mapRowToTask(row) : null;
  },

  /**
   * Create a new task
   * @param {string} title - Task title
   * @returns {Promise<Task>} Create a task
   */
  async create(title: string): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: new Date().toDateString(),
    };

    db.prepare(
      `
      INSERT INTO tasks (id, title, completed, created_at)
      VALUES (?, ?, ?, ?)
    `,
    ).run(task.id, task.title, task.completed ? 1 : 0, task.createdAt);

    return task;
  },

  /**
   * Update title of a task
   * @param {string} id - Task ID
   * @param {string} title - New title
   * @returns {Promise<Task | null>} Updated task or null if not found
   */
  async updateTitle(id: string, title: string): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET title = ?
      WHERE id = ?
    `,
      )
      .run(title, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Checked a task as completed
   * @param {string} id - Task ID
   * @returns {Promise<Task | null>} Chekeada a task as completed or null if not found
   */
  async complete(id: string, completed: boolean): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET completed = ?
      WHERE id = ?
    `,
      )
      .run(completed ? 1 : 0, id);

    if (result.changes === 0) return null;

    return this.findById(id);
  },

  /**
   * Remove a task
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} True if task was deleted, false if not found
   */
  async delete(id: string): Promise<boolean> {
    const result = db
      .prepare(
        `
      DELETE FROM tasks
      WHERE id = ?
    `,
      )
      .run(id);

    return result.changes > 0;
  },
};

/**
 * Mapper internal (DB → Domain)
 * @param row - Database row
 * @returns {Task} Mapped task
 */
function mapRowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: new Date(row.created_at).toISOString(),
  };
}
