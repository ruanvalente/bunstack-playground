import { config } from '@/api/config';
import { DashboardSqliteRepository } from './sqlite/dashboard.sqlite.repository';
import { DashboardSupabaseRepository } from './supabase/dashboard.supabase.repository';
import type { IDashboardRepository } from '@/api/domain/repositories';

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const useSupabase = isSupabaseConfigured || config.isProduction();

export function getDashboardRepository(): IDashboardRepository {
  if (useSupabase) {
    return new DashboardSupabaseRepository();
  }

  return new DashboardSqliteRepository();
}
