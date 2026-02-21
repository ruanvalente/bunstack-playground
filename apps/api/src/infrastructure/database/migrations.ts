import { createTasksTableMigration } from './migrations/tasks/create_tasks_table.migration';
import { addUpdatedAtToTasksMigration } from './migrations/tasks/add_updated_at_to_tasks.migration';

export function runMigrations() {
  createTasksTableMigration();
  addUpdatedAtToTasksMigration();
}
