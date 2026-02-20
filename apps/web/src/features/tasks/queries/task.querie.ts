import type { Task } from '@bunstack-playground/shared/domain';
import type { PaginatedTasksResponseDTO } from '@bunstack-playground/shared/http';

import { httpClient } from '@shared/http/http-client';
import { API_URL, API_VERSION } from '@shared/config/supabase';

export type TaskFilters = {
  statusFilter?: 'completed' | 'pending';
  sortBy?: 'created_at' | 'updated_at';
  sortOrder?: 'ASC' | 'DESC';
};

export async function getTasks(
  page = 1,
  pageSize = 10,
  filters?: TaskFilters
): Promise<PaginatedTasksResponseDTO> {
  try {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    if (filters?.statusFilter) {
      params.set('statusFilter', filters.statusFilter);
    }
    if (filters?.sortBy) {
      params.set('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params.set('sortOrder', filters.sortOrder);
    }

    const response = await httpClient<PaginatedTasksResponseDTO>(
      `${API_URL}/api/${API_VERSION}/tasks?${params.toString()}`
    );
    return response;
  } catch (err) {
    throw new Error('Not is possible to fetch tasks. Please try again later.', {
      cause: err,
    });
  }
}

export async function toggleTask(
  taskId: string,
  completed: boolean
): Promise<Task> {
  try {
    const response = await httpClient<Task>(
      `${API_URL}/api/${API_VERSION}/tasks/${taskId}/complete`,
      {
        method: 'PATCH',
        body: JSON.stringify({ id: taskId, completed }),
      }
    );

    return response;
  } catch (err) {
    throw new Error('Not is possible to update the task. Please try again.', {
      cause: err,
    });
  }
}

export async function createTask(title: string): Promise<Task> {
  try {
    const response = await httpClient<Task>(
      `${API_URL}/api/${API_VERSION}/tasks`,
      {
        method: 'POST',
        body: JSON.stringify({ title }),
      }
    );

    return response;
  } catch (err) {
    throw new Error('Not is possible to create the task. Please try again.', {
      cause: err,
    });
  }
}
