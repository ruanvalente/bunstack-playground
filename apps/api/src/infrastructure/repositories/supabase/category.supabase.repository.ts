import type { Category } from '@bunstack-playground/shared';
import type { ICategoryRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infrastructure/supabase';

const DEFAULT_CATEGORIES = [
  { name: 'Trabalho', color: '#3B82F6' },
  { name: 'Pessoal', color: '#10B981' },
  { name: 'Estudos', color: '#8B5CF6' },
  { name: 'Compras', color: '#F59E0B' },
  { name: 'Saúde', color: '#EF4444' },
  { name: 'Lazer', color: '#EC4899' },
];

export class CategorySupabaseRepository implements ICategoryRepository {
  async ensureTableExists(): Promise<void> {
    const { error: checkError } = await supabase
      .from('categories')
      .select('id, user_id, name, color, created_at')
      .limit(1);

    if (
      checkError &&
      checkError.message.includes('relation') &&
      checkError.message.includes('does not exist')
    ) {
      throw new Error(
        'Categories table does not exist in Supabase. Please create it manually or run the seed migration.'
      );
    }
  }

  async findAll(userId: string): Promise<Category[]> {
    try {
      await this.ensureTableExists();
    } catch {
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, user_id, name, color, created_at')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data.map(mapRowToCategory);
  }

  async findById(id: string, userId: string): Promise<Category | null> {
    try {
      await this.ensureTableExists();
    } catch {
      return null;
    }

    const { data, error } = await supabase
      .from('categories')
      .select('id, user_id, name, color, created_at')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data ? mapRowToCategory(data) : null;
  }

  async create(name: string, color: string, userId: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, color, user_id: userId }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return mapRowToCategory(data);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }

    return true;
  }

  async seedDefaults(userId: string): Promise<void> {
    try {
      await this.ensureTableExists();
    } catch {
      return;
    }

    const { data: existing, error: checkError } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (checkError) {
      return;
    }

    if (!existing || existing.length === 0) {
      const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
        name: cat.name,
        color: cat.color,
        user_id: userId,
      }));

      const { error } = await supabase
        .from('categories')
        .insert(categoriesToInsert);

      if (error && !error.message.includes('duplicate')) {
        throw new Error(`Failed to seed default categories: ${error.message}`);
      }
    }
  }
}

function mapRowToCategory(row: any): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    color: row.color,
    createdAt: new Date(row.created_at).toISOString(),
  };
}
