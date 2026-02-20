import { createTasksTableMigration } from './migrations/tasks/create_tasks_table.migration';
import { addUpdatedAtToTasksMigration } from './migrations/tasks/add_updated_at_to_tasks.migration';

/**
 * Run database migrations.
 *
 * This function is idempotent and can be safely executed
 * multiple times without affecting existing data.
 */
export function runMigrations() {
  // Import migrations here

  // Task-related migrations
  createTasksTableMigration();
  addUpdatedAtToTasksMigration();
}
