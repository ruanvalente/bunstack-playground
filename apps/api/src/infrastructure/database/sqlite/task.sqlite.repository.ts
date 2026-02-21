import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
  TaskDTOWithDate,
} from '@bunstack-playground/shared';
import { db } from '@/api/infra/database';
import type { ITaskRepository } from '@/api/domain/repositories';

export class TaskSqliteRepository implements ITaskRepository {
  async findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
      statusFilter,
    } = params;

    let whereClause = '';
    const queryParams: any[] = [];

    if (statusFilter === 'completed') {
      whereClause = 'WHERE completed = 1';
    } else if (statusFilter === 'pending') {
      whereClause = 'WHERE completed = 0';
    }

    const countResult = db
      .prepare(`SELECT COUNT(*) as count FROM tasks ${whereClause}`)
      .get(...queryParams) as { count: number };
    const total = countResult.count;

    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const rows = db
      .prepare(
        `
      SELECT id, title, completed, created_at, updated_at
      FROM tasks
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `
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
        sortBy,
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
    `
      )
      .get(id);

    return row ? mapRowToTask(row) : null;
  }

  async create(title: string): Promise<Task> {
    const taskId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `
    INSERT INTO tasks (id, title, completed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?)
  `
    ).run(taskId, title, 0, now, now);

    return {
      id: taskId,
      title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateTitle(id: string, title: string): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET title = ?, updated_at = ?
      WHERE id = ?
    `
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
    `
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
    `
      )
      .run(id);

    return result.changes > 0;
  }
}

function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
