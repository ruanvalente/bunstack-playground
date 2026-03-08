import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { API_VERSION } from '@shared/config/supabase';
import { axiosInstance } from '@shared/http/axios-client';
import { toast } from '@shared/ui/toaster';
import { useLanguage } from '@/web/shared/hooks/use-language';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt?: string;
};

type PaginatedUsersResponse = {
  data: User[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  meta: {
    sortBy: string;
    sortOrder: string;
    timestamp: string;
  };
};

type CreateUserInput = {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'USER';
};

type UpdateUserInput = {
  name?: string;
  role?: 'ADMIN' | 'USER';
  status?: 'active' | 'inactive';
};

async function fetchUsers(params?: {
  page?: number;
  pageSize?: number;
}): Promise<PaginatedUsersResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));

    const response = await axiosInstance.get<PaginatedUsersResponse>(
      `/api/${API_VERSION}/users?${searchParams.toString()}`
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch users', { cause: err });
  }
}

async function fetchUser(id: string): Promise<User> {
  try {
    const response = await axiosInstance.get<User>(
      `/api/${API_VERSION}/users/${id}`
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to fetch user', { cause: err });
  }
}

async function createUser(input: CreateUserInput): Promise<User> {
  try {
    const response = await axiosInstance.post<User>(
      `/api/${API_VERSION}/users`,
      input
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to create user', { cause: err });
  }
}

async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  try {
    const response = await axiosInstance.patch<User>(
      `/api/${API_VERSION}/users/${id}`,
      input
    );
    return response.data;
  } catch (err) {
    throw new Error('Failed to update user', { cause: err });
  }
}

async function deleteUser(id: string): Promise<void> {
  try {
    await axiosInstance.delete(`/api/${API_VERSION}/users/${id}`);
  } catch (err) {
    throw new Error('Failed to delete user', { cause: err });
  }
}

export function useUsers(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetchUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t.users.userCreated);
    },
    onError: () => {
      toast.error(t.users.failedToCreate);
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', data.id] });
      toast.success(t.users.userUpdated);
    },
    onError: () => {
      toast.error(t.users.failedToUpdate);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(t.users.userDeleted);
    },
    onError: () => {
      toast.error(t.users.failedToDelete);
    },
  });
}
