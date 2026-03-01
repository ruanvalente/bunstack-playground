import type { Category } from '@bunstack-playground/shared';

import type { ICategoryRepository } from '@/api/domain/repositories';
import { db } from '@/api/infrastructure/database/config';

const DEFAULT_CATEGORIES = [
  { name: 'Trabalho', color: '#3B82F6' },
  { name: 'Pessoal', color: '#10B981' },
  { name: 'Estudos', color: '#8B5CF6' },
  { name: 'Compras', color: '#F59E0B' },
  { name: 'Saúde', color: '#EF4444' },
  { name: 'Lazer', color: '#EC4899' },
];

export class CategorySqliteRepository implements ICategoryRepository {
  async findAll(userId: string): Promise<Category[]> {
    const rows = db
      .prepare(
        `
      SELECT id, user_id, name, color, created_at
      FROM categories
      WHERE user_id = ?
      ORDER BY name ASC
    `
      )
      .all(userId) as any[];

    return rows.map(mapRowToCategory);
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    const row = db
      .prepare(
        `
      SELECT id, user_id, name, color, created_at
      FROM categories
      WHERE id = ? AND user_id = ?
    `
      )
      .get(id, userId);

    return row ? mapRowToCategory(row) : null;
  }

  async create(name: string, color: string, userId: string): Promise<Category> {
    const categoryId = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO categories (id, user_id, name, color, created_at)
      VALUES (?, ?, ?, ?, ?)
    `
    ).run(categoryId, userId, name, color, now);

    return {
      id: categoryId,
      userId,
      name,
      color,
      createdAt: now,
    };
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = db
      .prepare(
        `
      DELETE FROM categories
      WHERE id = ? AND user_id = ?
    `
      )
      .run(id, userId);

    return result.changes > 0;
  }

  async seedDefaults(userId: string): Promise<void> {
    const existingCategories = db
      .prepare('SELECT COUNT(*) as count FROM categories WHERE user_id = ?')
      .get(userId) as { count: number };

    if (existingCategories.count === 0) {
      const insertStmt = db.prepare(`
        INSERT INTO categories (id, user_id, name, color, created_at)
        VALUES (?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      for (const cat of DEFAULT_CATEGORIES) {
        insertStmt.run(crypto.randomUUID(), userId, cat.name, cat.color, now);
      }
    }
  }
}

function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
