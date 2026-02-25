import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
  TaskDTOWithDate,
} from '@bunstack-playground/shared';
import { db } from '@/api/infrastructure/database/config';
import type { ITaskRepository } from '@/api/domain/repositories';

export class TaskSqliteRepository implements ITaskRepository {
  async findAll(
    params: PaginationQueryDTO,
    userId: string
  ): Promise<PaginatedTasksDomain> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
      statusFilter,
      categoryFilter,
    } = params;

    let whereClause = 'WHERE user_id = ?';
    const queryParams: any[] = [userId];

    if (statusFilter === 'completed') {
      whereClause += ' AND completed = 1';
    } else if (statusFilter === 'pending') {
      whereClause += ' AND completed = 0';
    }

    if (categoryFilter) {
      whereClause += ' AND category_id = ?';
      queryParams.push(categoryFilter);
    }

    const countResult = db
      .prepare(`SELECT COUNT(*) as count FROM tasks ${whereClause}`)
      .get(...queryParams) as { count: number };
    const total = countResult.count;

    const offset = (page - 1) * pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const rows = db
      .prepare(
        `
      SELECT id, user_id, title, completed, category_id, created_at, updated_at
      FROM tasks
      ${whereClause}
      ORDER BY ${sortBy} ${sortOrder}
      LIMIT ? OFFSET ?
    `
      )
      .all(...queryParams, pageSize, offset);

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

  async findById(id: string, userId: string): Promise<Task | null> {
    const row = db
      .prepare(
        `
      SELECT id, user_id, title, completed, category_id, created_at, updated_at
      FROM tasks
      WHERE id = ? AND user_id = ?
    `
      )
      .get(id, userId);

    return row ? mapRowToTask(row) : null;
  }

  async create(
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task> {
    const taskId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `
    INSERT INTO tasks (id, user_id, title, completed, category_id, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
    ).run(taskId, userId, title, 0, categoryId || null, now, now);

    return {
      id: taskId,
      userId,
      title,
      completed: false,
      categoryId: categoryId || undefined,
      createdAt: now,
      updatedAt: now,
    };
  }

  async updateTitle(
    id: string,
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task | null> {
    const updates: string[] = ['title = ?', 'updated_at = ?'];
    const params: any[] = [title, new Date().toISOString()];

    if (categoryId !== undefined) {
      updates.push('category_id = ?');
      params.push(categoryId || null);
    }

    params.push(id, userId);

    const result = db
      .prepare(
        `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = ? AND user_id = ?
    `
      )
      .run(...params);

    if (result.changes === 0) return null;

    return this.findById(id, userId);
  }

  async complete(
    id: string,
    completed: boolean,
    userId: string
  ): Promise<Task | null> {
    const result = db
      .prepare(
        `
      UPDATE tasks
      SET completed = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `
      )
      .run(completed ? 1 : 0, new Date().toISOString(), id, userId);

    if (result.changes === 0) return null;

    return this.findById(id, userId);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare(
        `
      DELETE FROM tasks
      WHERE id = ? AND user_id = ?
    `
      )
      .run(id, userId);

    return result.changes > 0;
  }
}

function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    completed: Boolean(row.completed),
    categoryId: row.category_id || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
