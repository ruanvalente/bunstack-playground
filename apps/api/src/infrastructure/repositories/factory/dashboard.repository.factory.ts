import { config } from '@/api/config';
import type { IDashboardRepository } from '@/api/domain/repositories';

import { DashboardSqliteRepository } from '../sqlite/dashboard.sqlite.repository';
import { DashboardSupabaseRepository } from '../supabase/dashboard.supabase.repository';

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
