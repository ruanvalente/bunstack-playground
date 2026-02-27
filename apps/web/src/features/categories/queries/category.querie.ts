import type {
  CategoryDTO,
  CreateCategoryDTO,
} from '@bunstack-playground/shared/http';

import { API_VERSION } from '@shared/config/supabase';
import { axiosInstance } from '@shared/http/axios-client';

export async function getCategories(): Promise<CategoryDTO[]> {
  try {
    const response = await axiosInstance.get<CategoryDTO[]>(
      `/api/${API_VERSION}/categories`
    );
    return response.data;
  } catch (err) {
    throw new Error('Unable to fetch categories. Please try again later.', {
      cause: err,
    });
  }
}

export async function createCategory(
  data: CreateCategoryDTO
): Promise<CategoryDTO> {
  try {
    const response = await axiosInstance.post<CategoryDTO>(
      `/api/${API_VERSION}/categories`,
      data
    );
    return response.data;
  } catch (err) {
    throw new Error('Unable to create category. Please try again later.', {
      cause: err,
    });
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    await axiosInstance.delete(`/api/${API_VERSION}/categories/${categoryId}`);
  } catch (err) {
    throw new Error('Unable to delete category. Please try again later.', {
      cause: err,
    });
  }
}
