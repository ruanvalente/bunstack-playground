import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  TaskDTOWithDate,
} from '@bunstack-playground/shared';
import type { Task } from '@bunstack-playground/shared/domain';
import type { ITaskRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infrastructure/supabase';

export class TaskSupabaseRepository implements ITaskRepository {
  async findAll(
    params: PaginationQueryDTO,
    userId: string
  ): Promise<PaginatedTasksDomain> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
      statusFilter,
      categoryFilter,
    } = params;

    let query = supabase
      .from('tasks')
      .select(
        'id, user_id, title, completed, category_id, created_at, updated_at',
        {
          count: 'exact',
        }
      )
      .eq('user_id', userId);

    if (statusFilter === 'completed') {
      query = query.eq('completed', true);
    } else if (statusFilter === 'pending') {
      query = query.eq('completed', false);
    }

    if (categoryFilter) {
      query = query.eq('category_id', categoryFilter);
    }

    const { count, error: countError } = await query;

    if (countError) {
      throw new Error(`Failed to fetch tasks count: ${countError.message}`);
    }

    const total = count || 0;
    const offset = (page - 1) * pageSize;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    let dataQuery = supabase
      .from('tasks')
      .select(
        'id, user_id, title, completed, category_id, created_at, updated_at'
      )
      .eq('user_id', userId)
      .order(sortBy, { ascending: sortOrder === 'ASC' });

    if (statusFilter === 'completed') {
      dataQuery = dataQuery.eq('completed', true);
    } else if (statusFilter === 'pending') {
      dataQuery = dataQuery.eq('completed', false);
    }

    if (categoryFilter) {
      dataQuery = dataQuery.eq('category_id', categoryFilter);
    }

    const { data, error } = await dataQuery.range(
      offset,
      offset + pageSize - 1
    );

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return {
      data: data.map(mapRowToTask),
      pagination: {
        page,
        total,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        sortBy,
        sortOrder,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select(
        'id, user_id, title, completed, category_id, created_at, updated_at'
      )
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async create(
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, user_id: userId, category_id: categoryId || null }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return mapRowToTask(data);
  }

  async updateTitle(
    id: string,
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task | null> {
    const updateData: any = { title };
    if (categoryId !== undefined) {
      updateData.category_id = categoryId || null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async complete(
    id: string,
    completed: boolean,
    userId: string
  ): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to update task completion: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }
}

function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    completed: Boolean(row.completed),
    categoryId: row.category_id || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
