import type {
  PaginatedTasksResponseDTO,
  PaginationQueryDTO,
  Task,
  TaskDTOWithDate,
} from "@bunstack-playground/shared";
import { db } from "@/api/infra/database";
import type { TaskRepositoryImpl } from "./task.repository";

export class TaskSqliteRepository implements TaskRepositoryImpl {
  async findAll(
    params: PaginationQueryDTO,
  ): Promise<PaginatedTasksResponseDTO> {
    const { page = 1, pageSize = 10, sortOrder = "ASC" } = params;

    const countResult = db
      .prepare("SELECT COUNT(*) as count FROM tasks")
      .get() as { count: number };
    const total = countResult.count;

    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const rows = db
      .prepare(
        `
      SELECT id, title, completed, created_at, updated_at
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
  }

  async findById(id: string): Promise<Task | null> {
    const row = db
      .prepare(
        `
      SELECT id, title, completed, created_at, updated_at
      FROM tasks
      WHERE id = ?
    `,
      )
      .get(id);

    return row ? mapRowToTask(row) : null;
  }

  async create(title: string): Promise<Task> {
    const taskId = crypto.randomUUID();
    const now = new Date();

    db.prepare(
      `
    INSERT INTO tasks (id, title, completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `,
    ).run(taskId, title, 0, now.toISOString(), now.toISOString());

    return {
      id: taskId,
      title,
      completed: false,
      createdAt: now.toISOString(),
      updatedAt: now.toString(),
    };
  }

  async updateTitle(id: string, title: string): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET title = ?, updated_at = ?
      WHERE id = ?
    `,
      )
      .run(title, new Date().toISOString(), id);

    if (result.changes === 0) return null;

    return this.findById(id);
  }

  async complete(id: string, completed: boolean): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET completed = ?, updated_at = ?
      WHERE id = ?
    `,
      )
      .run(completed ? 1 : 0, new Date().toISOString(), id);

    if (result.changes === 0) return null;

    return this.findById(id);
  }

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
  }
}

/**
 * Mapper internal (DB → Domain)
 * @param row - Database row
 * @returns {TaskDTOWithDate} Mapped task
 */
function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
