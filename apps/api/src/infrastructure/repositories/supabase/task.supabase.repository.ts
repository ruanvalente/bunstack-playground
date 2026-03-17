import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  TaskDTOWithDate,
} from '@bunstack-playground/shared';
import type { Task } from '@bunstack-playground/shared/domain';

import type { ITaskRepository } from '@/api/domain/repositories';
import { supabase } from '@/api/infrastructure/supabase';

const getSupabaseClient = () => {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    );
  }
  return supabase;
};

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

    const { data: rpcData, error: rpcError } = await getSupabaseClient().rpc(
      'get_tasks',
      {
        p_user_id: userId,
        p_page: page,
        p_page_size: pageSize,
        p_sort_by: sortBy,
        p_sort_order: sortOrder,
        p_status_filter: statusFilter,
        p_category_filter: categoryFilter,
      }
    );

    if (rpcError) {
      throw new Error(`Failed to fetch tasks: ${rpcError.message}`);
    }

    const tasks = (rpcData || []).map(mapRowToTask);
    const total = rpcData?.[0]?.total || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return {
      data: tasks,
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
    const { data, error } = await getSupabaseClient().rpc('get_task_by_id', {
      p_id: id,
      p_user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const taskData = Array.isArray(data) ? data[0] : data;
    if (!taskData) {
      return null;
    }

    return mapRowToTask(taskData);
  }

  async create(
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task> {
    const { data, error } = await getSupabaseClient().rpc('create_task', {
      p_title: title,
      p_user_id: userId,
      p_category_id: categoryId || null,
    });

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
    const { data, error } = await getSupabaseClient().rpc('update_task', {
      p_id: id,
      p_user_id: userId,
      p_title: title,
      p_category_id: categoryId || null,
    });

    if (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const taskData = Array.isArray(data) ? data[0] : data;
    if (!taskData) {
      return null;
    }

    return mapRowToTask(taskData);
  }

  async complete(
    id: string,
    completed: boolean,
    userId: string
  ): Promise<Task | null> {
    const { data, error } = await getSupabaseClient().rpc('complete_task', {
      p_id: id,
      p_user_id: userId,
      p_completed: completed,
    });

    if (error) {
      throw new Error(`Failed to update task completion: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    const taskData = Array.isArray(data) ? data[0] : data;
    if (!taskData) {
      return null;
    }

    return mapRowToTask(taskData);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const { data, error } = await getSupabaseClient().rpc('delete_task', {
      p_id: id,
      p_user_id: userId,
    });

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return Boolean(data);
  }
}

function mapRowToTask(row: any): TaskDTOWithDate {
  const parseDate = (dateValue: any): string => {
    if (!dateValue) return new Date().toISOString();
    if (dateValue instanceof Date) return dateValue.toISOString();
    const dateStr = String(dateValue);
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString();
    return date.toISOString();
  };

  const data = Array.isArray(row) ? row[0] : row;

  return {
    id: data.task_id || data.id,
    userId: data.task_user_id || data.user_id,
    title: data.task_title || data.title,
    completed: Boolean(data.task_completed ?? data.completed),
    categoryId: data.task_category_id ?? data.category_id ?? undefined,
    createdAt: parseDate(data.task_created_at ?? data.created_at),
    updatedAt: parseDate(data.task_updated_at ?? data.updated_at),
  };
}
