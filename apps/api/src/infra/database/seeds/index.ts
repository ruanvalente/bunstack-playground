import { seedTasks } from "./task.seed";

/**
 * Execute all database seeds
 */
export async function runSeeds() {
  await seedTasks();
}
