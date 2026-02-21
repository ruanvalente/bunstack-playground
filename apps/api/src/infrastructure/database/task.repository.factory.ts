import { config } from '@/api/config';
import { TaskSqliteRepository } from './sqlite/task.sqlite.repository';
import { TaskSupabaseRepository } from './supabase/task.supabase.repository';
import type { ITaskRepository } from '@/api/domain/repositories';

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const useSupabase = isSupabaseConfigured || config.isProduction();

export function getTaskRepository(): ITaskRepository {
  if (useSupabase) {
    return new TaskSupabaseRepository();
  }

  return new TaskSqliteRepository();
}
