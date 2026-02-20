import { config } from '../../config';
import { DashboardSqliteRepository } from './dashboard.sqlite.repository';
import { DashboardSupabaseRepository } from './dashboard.supabase.repository';

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const useSupabase = isSupabaseConfigured || config.isProduction();

export function getDashboardRepository() {
  if (useSupabase) {
    return new DashboardSupabaseRepository();
  }

  return new DashboardSqliteRepository();
}
