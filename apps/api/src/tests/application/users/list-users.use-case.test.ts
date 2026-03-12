import { beforeEach, describe, expect, test } from 'bun:test';

import type { User } from '@bunstack-playground/shared/http';

import { ListUsersUseCase } from '@/api/application/users/list-users.use-case';

import {
  createMockPaginatedUsersResponse,
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

type ListUsersInput = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
};

describe('ListUsersUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let listUsersUseCase: ListUsersUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    listUsersUseCase = new ListUsersUseCase(userRepositoryMock);
  });

  test('should return paginated users successfully', async () => {
    const users: User[] = [
      createMockUser({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user1@example.com',
        name: 'User One',
      }),
      createMockUser({
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: 'user2@example.com',
        name: 'User Two',
        role: 'ADMIN',
      }),
    ];

    const input: ListUsersInput = {};

    const response = createMockPaginatedUsersResponse(users, {
      pagination: {
        total: 2,
        page: 1,
        pageSize: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });

    userRepositoryMock.findAll.mockResolvedValue(response);

    const result = await listUsersUseCase.execute(input);

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(input);
  });

  test('should use default pagination parameters when not provided', async () => {
    const input: ListUsersInput = {};
    const response = createMockPaginatedUsersResponse([]);

    userRepositoryMock.findAll.mockResolvedValue(response);

    await listUsersUseCase.execute(input);

    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(input);
  });

  test('should pass custom pagination parameters', async () => {
    const input: ListUsersInput = {
      page: 2,
      pageSize: 20,
      sortBy: 'name',
      sortOrder: 'ASC',
    };

    const response = createMockPaginatedUsersResponse([], {
      pagination: {
        total: 50,
        page: 2,
        pageSize: 20,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
      },
      meta: {
        sortBy: 'name',
        sortOrder: 'ASC',
        timestamp: new Date().toISOString(),
      },
    });

    userRepositoryMock.findAll.mockResolvedValue(response);

    const result = await listUsersUseCase.execute(input);

    expect(result.pagination.page).toBe(2);
    expect(result.pagination.pageSize).toBe(20);
    expect(userRepositoryMock.findAll).toHaveBeenCalledWith(input);
  });
});
