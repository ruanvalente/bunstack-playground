import { config } from "../../config";
import { TaskSqliteRepository } from "./task.sqlite.repository";
import { TaskSupabaseRepository } from "./task.supabase.repository";

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const useSupabase = isSupabaseConfigured || config.isProduction();

export function getTaskRepository() {
  if (useSupabase) {
    return new TaskSupabaseRepository();
  }
  
  return new TaskSqliteRepository();
}
