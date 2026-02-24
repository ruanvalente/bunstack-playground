import type { Task } from '@bunstack-playground/shared/domain';
import type { PaginatedTasksResponseDTO } from '@bunstack-playground/shared/http';

import { axiosInstance } from '@shared/http/axios-client';
import { API_VERSION } from '@shared/config/supabase';

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

    const response = await axiosInstance.get<PaginatedTasksResponseDTO>(
      `/api/${API_VERSION}/tasks?${params.toString()}`
    );
    return response.data;
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
    const response = await axiosInstance.patch<Task>(
      `/api/${API_VERSION}/tasks/${taskId}/complete`,
      { id: taskId, completed }
    );

    return response.data;
  } catch (err) {
    throw new Error('Not is possible to update the task. Please try again.', {
      cause: err,
    });
  }
}

export async function createTask(title: string): Promise<Task> {
  try {
    const response = await axiosInstance.post<Task>(
      `/api/${API_VERSION}/tasks`,
      { title }
    );

    return response.data;
  } catch (err) {
    throw new Error('Not is possible to create the task. Please try again.', {
      cause: err,
    });
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/api/${API_VERSION}/tasks/${taskId}`);
  } catch (err) {
    throw new Error('Not is possible to delete the task. Please try again.', {
      cause: err,
    });
  }
}

export async function updateTaskTitle(
  taskId: string,
  title: string
): Promise<Task> {
  try {
    const response = await axiosInstance.put<Task>(
      `/api/${API_VERSION}/tasks/${taskId}`,
      { title }
    );

    return response.data;
  } catch (err) {
    throw new Error('Not is possible to update the task. Please try again.', {
      cause: err,
    });
  }
}
