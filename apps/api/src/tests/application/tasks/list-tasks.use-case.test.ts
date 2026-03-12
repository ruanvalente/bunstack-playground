import { beforeEach, describe, expect, test } from 'bun:test';

import type { PaginationQueryDTO, Task } from '@bunstack-playground/shared';

import { ListTasksUseCase } from '@/api/application/tasks/list-tasks.use-case';

import {
  createMockPaginatedTasksResponse,
  createMockTask,
  TaskRepositoryMock,
} from '../../mocks';

type ListTasksInput = PaginationQueryDTO;
type UserId = string;

describe('ListTasksUseCase', () => {
  let taskRepositoryMock: TaskRepositoryMock;
  let listTasksUseCase: ListTasksUseCase;

  beforeEach(() => {
    taskRepositoryMock = new TaskRepositoryMock();
    listTasksUseCase = new ListTasksUseCase(taskRepositoryMock);
  });

  test('should list tasks with default pagination', async () => {
    const tasks = [
      createMockTask({ id: 'task-1', title: 'Task 1' }),
      createMockTask({ id: 'task-2', title: 'Task 2' }),
    ];

    const input: ListTasksInput = {
      page: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks, {
        pagination: {
          total: 2,
          page: 1,
          pageSize: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      })
    );

    const result = await listTasksUseCase.execute(input, userId);

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
    expect(taskRepositoryMock.findAll).toHaveBeenCalledWith(input, userId);
  });

  test('should list tasks with custom pagination', async () => {
    const tasks = [createMockTask({ id: 'task-1' })];

    const input: ListTasksInput = {
      page: 2,
      pageSize: 5,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks, {
        pagination: {
          total: 1,
          page: 2,
          pageSize: 5,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: true,
        },
      })
    );

    const result = await listTasksUseCase.execute(input, userId);

    expect(result.pagination.page).toBe(2);
    expect(result.pagination.pageSize).toBe(5);
    expect(taskRepositoryMock.findAll).toHaveBeenCalledWith(input, userId);
  });

  test('should list tasks with sorting', async () => {
    const tasks = [createMockTask({ id: 'task-1' })];

    const input: ListTasksInput = {
      page: 1,
      pageSize: 10,
      sortBy: 'updated_at',
      sortOrder: 'ASC',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks)
    );

    await listTasksUseCase.execute(input, userId);

    expect(taskRepositoryMock.findAll).toHaveBeenCalledWith(input, userId);
  });

  test('should list tasks with status filter', async () => {
    const tasks = [createMockTask({ id: 'task-1', completed: true })];

    const input: ListTasksInput = {
      page: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: 'DESC',
      statusFilter: 'completed',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks)
    );

    await listTasksUseCase.execute(input, userId);

    expect(taskRepositoryMock.findAll).toHaveBeenCalledWith(input, userId);
  });

  test('should list tasks with category filter', async () => {
    const tasks = [createMockTask({ id: 'task-1', categoryId: 'cat-1' })];

    const input: ListTasksInput = {
      page: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: 'DESC',
      categoryFilter: 'cat-1',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks)
    );

    await listTasksUseCase.execute(input, userId);

    expect(taskRepositoryMock.findAll).toHaveBeenCalledWith(input, userId);
  });

  test('should return empty list when no tasks exist', async () => {
    const input: ListTasksInput = {
      page: 1,
      pageSize: 10,
      sortBy: 'created_at',
      sortOrder: 'DESC',
    };
    const userId: UserId = 'user-123';

    taskRepositoryMock.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse([])
    );

    const result = await listTasksUseCase.execute(input, userId);

    expect(result.data).toHaveLength(0);
    expect(result.pagination.total).toBe(0);
  });
});
