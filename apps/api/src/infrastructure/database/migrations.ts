import { addCategoryIdToTasksMigration } from './migrations/tasks/add_category_id_to_tasks.migration';
import { addUpdatedAtToTasksMigration } from './migrations/tasks/add_updated_at_to_tasks.migration';
import { addUserIdToTasksMigration } from './migrations/tasks/add_user_id_to_tasks.migration';
import { createCategoriesTableMigration } from './migrations/tasks/create_categories_table.migration';
import { createTasksTableMigration } from './migrations/tasks/create_tasks_table.migration';

export function runMigrations() {
  createTasksTableMigration();
  addUpdatedAtToTasksMigration();
  addUserIdToTasksMigration();
  createCategoriesTableMigration();
  addCategoryIdToTasksMigration();
}
