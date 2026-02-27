import { config } from '@/api/config';
import type { ICategoryRepository } from '@/api/domain/repositories';

import { CategorySqliteRepository } from '../sqlite/category.sqlite.repository';
import { CategorySupabaseRepository } from '../supabase/category.supabase.repository';

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY
);

const useSupabase = isSupabaseConfigured || config.isProduction();

export function getCategoryRepository(): ICategoryRepository {
  if (useSupabase) {
    return new CategorySupabaseRepository();
  }

  return new CategorySqliteRepository();
}
