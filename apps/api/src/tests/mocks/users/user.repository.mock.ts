import { mock } from 'bun:test';

import type {
  PaginatedUsersResponseDTO,
  User,
} from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';

export class UserRepositoryMock implements IUserRepository {
  findAll = mock<() => Promise<PaginatedUsersResponseDTO>>(async () => ({
    data: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
    meta: {
      sortBy: 'created_at',
      sortOrder: 'DESC',
      timestamp: new Date().toISOString(),
    },
  }));

  findById = mock<() => Promise<User | null>>(async () => null);

  findByEmail = mock<() => Promise<User | null>>(async () => null);

  create = mock<() => Promise<User>>(async () => ({
    id: 'test-user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  update = mock<() => Promise<User | null>>(async () => null);

  delete = mock<() => Promise<boolean>>(async () => false);

  clear(): void {
    this.findAll.mockClear();
    this.findById.mockClear();
    this.findByEmail.mockClear();
    this.create.mockClear();
    this.update.mockClear();
    this.delete.mockClear();
  }
}

export const createMockUser = (overrides?: Partial<User>): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const createMockPaginatedUsersResponse = (
  users: User[],
  overrides?: Partial<PaginatedUsersResponseDTO>
): PaginatedUsersResponseDTO => ({
  data: users,
  pagination: {
    total: users.length,
    page: 1,
    pageSize: 10,
    totalPages: Math.ceil(users.length / 10),
    hasNextPage: false,
    hasPrevPage: false,
  },
  meta: {
    sortBy: 'created_at',
    sortOrder: 'DESC',
    timestamp: new Date().toISOString(),
  },
  ...overrides,
});
