import { createTasksTableMigration } from './migrations/tasks/create_tasks_table.migration';
import { addUpdatedAtToTasksMigration } from './migrations/tasks/add_updated_at_to_tasks.migration';
import { addUserIdToTasksMigration } from './migrations/tasks/add_user_id_to_tasks.migration';

export function runMigrations() {
  createTasksTableMigration();
  addUpdatedAtToTasksMigration();
  addUserIdToTasksMigration();
}
