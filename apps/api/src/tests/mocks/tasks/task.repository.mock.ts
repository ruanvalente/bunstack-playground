import { mock } from 'bun:test';

import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
} from '@bunstack-playground/shared';

import type { ITaskRepository } from '@/api/domain/repositories';

type TaskBase = Omit<Task, 'id' | 'userId'>;
type TaskCreateParams = (
  title: string,
  userId: string,
  categoryId?: string
) => Promise<Task>;
type TaskUpdateParams = (
  id: string,
  title: string,
  userId: string,
  categoryId?: string
) => Promise<Task | null>;
type TaskCompleteParams = (
  id: string,
  completed: boolean,
  userId: string
) => Promise<Task | null>;
type TaskDeleteParams = (id: string, userId: string) => Promise<boolean>;
type TaskFindByIdParams = (id: string, userId: string) => Promise<Task | null>;
type PaginationParams = PaginationQueryDTO;
type FindAllParams = (
  params: PaginationParams,
  userId: string
) => Promise<PaginatedTasksDomain>;

const DEFAULT_TASK: TaskBase = {
  title: 'Test Task',
  completed: false,
  categoryId: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

const DEFAULT_META = {
  sortBy: 'created_at' as const,
  sortOrder: 'DESC' as const,
  timestamp: new Date().toISOString(),
};

export class TaskRepositoryMock implements ITaskRepository {
  findAll = mock<FindAllParams>(async () => ({
    data: [],
    pagination: DEFAULT_PAGINATION,
    meta: DEFAULT_META,
  }));

  findById = mock<TaskFindByIdParams>(async () => null);

  create = mock<TaskCreateParams>(async () => ({
    id: 'test-task-1',
    userId: 'test-user-1',
    ...DEFAULT_TASK,
  }));

  updateTitle = mock<TaskUpdateParams>(async () => null);

  complete = mock<TaskCompleteParams>(async () => null);

  delete = mock<TaskDeleteParams>(async () => false);

  clear(): void {
    this.findAll.mockClear();
    this.findById.mockClear();
    this.create.mockClear();
    this.updateTitle.mockClear();
    this.complete.mockClear();
    this.delete.mockClear();
  }
}

export type MockTaskOverrides = Partial<Omit<Task, 'id' | 'userId'>> &
  Partial<Pick<Task, 'id' | 'userId'>>;

export const createMockTask = (overrides?: MockTaskOverrides): Task => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  userId: 'user-123',
  ...DEFAULT_TASK,
  ...overrides,
});

type PaginatedTasksOverrides = Partial<Omit<PaginatedTasksDomain, 'data'>> &
  Partial<Pick<PaginatedTasksDomain, 'data'>>;

export const createMockPaginatedTasksResponse = (
  tasks: Task[],
  overrides?: PaginatedTasksOverrides
): PaginatedTasksDomain => ({
  data: tasks,
  pagination: {
    ...DEFAULT_PAGINATION,
    total: tasks.length,
    totalPages: Math.ceil(tasks.length / 10),
    ...overrides?.pagination,
  },
  meta: {
    ...DEFAULT_META,
    ...overrides?.meta,
  },
  ...overrides,
});
