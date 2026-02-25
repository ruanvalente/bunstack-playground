import { db } from '../../config/index';

const DEFAULT_CATEGORIES = [
  { name: 'Trabalho', color: '#3B82F6' },
  { name: 'Pessoal', color: '#10B981' },
  { name: 'Estudos', color: '#8B5CF6' },
  { name: 'Compras', color: '#F59E0B' },
  { name: 'Saúde', color: '#EF4444' },
  { name: 'Lazer', color: '#EC4899' },
];

export function createCategoriesTableMigration() {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      color TEXT NOT NULL DEFAULT '#3B82F6',
      created_at TEXT NOT NULL,
      UNIQUE(user_id, name)
    );
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
  `);
}

export function addCategoryIdToTasksMigration() {
  db.run(`
    ALTER TABLE tasks ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
  `);
}

export function seedDefaultCategories(userId: string) {
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
