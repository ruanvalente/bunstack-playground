import { db } from '../../config/index';

export function addCategoryIdToTasksMigration() {
  try {
    db.run(`
      ALTER TABLE tasks ADD COLUMN category_id TEXT REFERENCES categories(id) ON DELETE SET NULL;
    `);
  } catch (error: any) {
    if (!error.message.includes('duplicate column name')) {
      throw error;
    }
  }

  try {
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
    `);
  } catch (error: any) {
    if (!error.message.includes('duplicate index name')) {
      throw error;
    }
  }
}
