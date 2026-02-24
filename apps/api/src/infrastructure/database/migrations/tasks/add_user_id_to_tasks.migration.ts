import { db } from '../../config/index';

export function addUserIdToTasksMigration() {
  db.run(`
    ALTER TABLE tasks ADD COLUMN user_id TEXT NOT NULL DEFAULT '';
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
  `);
}
