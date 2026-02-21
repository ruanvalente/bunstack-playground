import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  TaskDTOWithDate,
} from '@bunstack-playground/shared';
import type { Task } from '@bunstack-playground/shared/domain';
import type { ITaskRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infrastructure/supabase';

export class TaskSupabaseRepository implements ITaskRepository {
  async findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
      statusFilter,
    } = params;

    let query = supabase
      .from('tasks')
      .select('id, title, completed, created_at, updated_at', {
        count: 'exact',
      });

    if (statusFilter === 'completed') {
      query = query.eq('completed', true);
    } else if (statusFilter === 'pending') {
      query = query.eq('completed', false);
    }

    const { count, error: countError } = await query;

    if (countError) {
      throw new Error(`Failed to fetch tasks count: ${countError.message}`);
    }

    const total = count || 0;
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    let dataQuery = supabase
      .from('tasks')
      .select('id, title, completed, created_at, updated_at')
      .order(sortBy, { ascending: sortOrder === 'ASC' });

    if (statusFilter === 'completed') {
      dataQuery = dataQuery.eq('completed', true);
    } else if (statusFilter === 'pending') {
      dataQuery = dataQuery.eq('completed', false);
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

  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, title, completed, created_at')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async create(title: string): Promise<Task> {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return mapRowToTask(data);
  }

  async updateTitle(id: string, title: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ title })
      .eq('id', id)
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

  async complete(id: string, completed: boolean): Promise<Task | null> {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', id)
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

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }
}

function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}
