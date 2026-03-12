import { describe, expect, test } from 'bun:test';

import type {
  CreateTaskDTO,
  UpdateTaskDTO,
} from '@bunstack-playground/shared/http';

import {
  CompleteTaskUseCase,
  CreateTaskUseCase,
  DeleteTaskUseCase,
  ListTasksUseCase,
  UpdateTaskUseCase,
} from '@/api/application/tasks';
import { NotFoundError, ValidationError } from '@/api/domain/erros/errors';

import {
  createMockPaginatedTasksResponse,
  createMockTask,
  TaskRepositoryMock,
} from '../../mocks';

describe('Task Controller - List Tasks Flow', () => {
  test('should list tasks with pagination parameters', async () => {
    const tasks = [
      createMockTask({ id: 'task-1', title: 'Task 1' }),
      createMockTask({ id: 'task-2', title: 'Task 2' }),
    ];

    const mockRepo = new TaskRepositoryMock();
    mockRepo.findAll.mockResolvedValue(
      createMockPaginatedTasksResponse(tasks, {
        pagination: {
          total: 2,
          page: 2,
          pageSize: 20,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: true,
        },
      })
    );

    const listTasksUseCase = new ListTasksUseCase(mockRepo);

    const result = await listTasksUseCase.execute(
      { page: 2, pageSize: 20, sortBy: 'created_at', sortOrder: 'DESC' },
      'user-123'
    );

    expect(result.data).toHaveLength(2);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.pageSize).toBe(20);
    expect(mockRepo.findAll).toHaveBeenCalledWith(
      { page: 2, pageSize: 20, sortBy: 'created_at', sortOrder: 'DESC' },
      'user-123'
    );
  });

  test('should filter tasks by status', async () => {
    const tasks = [createMockTask({ id: 'task-1', completed: true })];

    const mockRepo = new TaskRepositoryMock();
    mockRepo.findAll.mockResolvedValue(createMockPaginatedTasksResponse(tasks));

    const listTasksUseCase = new ListTasksUseCase(mockRepo);

    await listTasksUseCase.execute(
      {
        page: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC',
        statusFilter: 'completed',
      },
      'user-123'
    );

    expect(mockRepo.findAll).toHaveBeenCalledWith(
      {
        page: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC',
        statusFilter: 'completed',
      },
      'user-123'
    );
  });
});

describe('Task Controller - Create Task Flow', () => {
  test('should create task successfully', async () => {
    const newTask = createMockTask({
      id: 'new-task-id',
      title: 'New Task',
    });

    const mockRepo = new TaskRepositoryMock();
    mockRepo.create.mockResolvedValue(newTask);

    const createTaskUseCase = new CreateTaskUseCase(mockRepo);

    const result = await createTaskUseCase.execute('New Task', 'user-123');

    expect(result.title).toBe('New Task');
    expect(mockRepo.create).toHaveBeenCalledWith(
      'New Task',
      'user-123',
      undefined
    );
  });

  test('should create task with category', async () => {
    const newTask = createMockTask({
      id: 'new-task-id',
      title: 'Task with Category',
      categoryId: 'cat-1',
    });

    const mockRepo = new TaskRepositoryMock();
    mockRepo.create.mockResolvedValue(newTask);

    const createTaskUseCase = new CreateTaskUseCase(mockRepo);

    const result = await createTaskUseCase.execute(
      'Task with Category',
      'user-123',
      'cat-1'
    );

    expect(result.categoryId).toBe('cat-1');
  });

  test('should throw ValidationError when title is empty', async () => {
    const mockRepo = new TaskRepositoryMock();
    const createTaskUseCase = new CreateTaskUseCase(mockRepo);

    await expect(createTaskUseCase.execute('', 'user-123')).rejects.toThrow(
      ValidationError
    );
    await expect(createTaskUseCase.execute('', 'user-123')).rejects.toThrow(
      'Title cannot be empty'
    );
  });
});

describe('Task Controller - Update Task Flow', () => {
  test('should update task successfully', async () => {
    const existingTask = createMockTask({
      id: 'task-1',
      title: 'Old Title',
    });

    const updatedTask = createMockTask({
      id: 'task-1',
      title: 'New Title',
    });

    const mockRepo = new TaskRepositoryMock();
    mockRepo.updateTitle.mockResolvedValue(updatedTask);

    const updateTaskUseCase = new UpdateTaskUseCase(mockRepo);

    const input: UpdateTaskDTO = {
      id: 'task-1',
      title: 'New Title',
    };

    const result = await updateTaskUseCase.execute(
      'task-1',
      'New Title',
      'user-123'
    );

    expect(result.title).toBe('New Title');
  });

  test('should throw NotFoundError when task not found', async () => {
    const mockRepo = new TaskRepositoryMock();
    mockRepo.updateTitle.mockResolvedValue(null);

    const updateTaskUseCase = new UpdateTaskUseCase(mockRepo);

    await expect(
      updateTaskUseCase.execute('non-existent-id', 'New Title', 'user-123')
    ).rejects.toThrow(NotFoundError);
  });
});

describe('Task Controller - Complete Task Flow', () => {
  test('should complete task successfully', async () => {
    const completedTask = createMockTask({
      id: 'task-1',
      completed: true,
    });

    const mockRepo = new TaskRepositoryMock();
    mockRepo.complete.mockResolvedValue(completedTask);

    const completeTaskUseCase = new CompleteTaskUseCase(mockRepo);

    const result = await completeTaskUseCase.execute(
      'task-1',
      true,
      'user-123'
    );

    expect(result.completed).toBe(true);
    expect(mockRepo.complete).toHaveBeenCalledWith('task-1', true, 'user-123');
  });

  test('should uncomplete task successfully', async () => {
    const uncompletedTask = createMockTask({
      id: 'task-1',
      completed: false,
    });

    const mockRepo = new TaskRepositoryMock();
    mockRepo.complete.mockResolvedValue(uncompletedTask);

    const completeTaskUseCase = new CompleteTaskUseCase(mockRepo);

    const result = await completeTaskUseCase.execute(
      'task-1',
      false,
      'user-123'
    );

    expect(result.completed).toBe(false);
    expect(mockRepo.complete).toHaveBeenCalledWith('task-1', false, 'user-123');
  });

  test('should throw NotFoundError when task not found', async () => {
    const mockRepo = new TaskRepositoryMock();
    mockRepo.complete.mockResolvedValue(null);

    const completeTaskUseCase = new CompleteTaskUseCase(mockRepo);

    await expect(
      completeTaskUseCase.execute('non-existent-id', true, 'user-123')
    ).rejects.toThrow(NotFoundError);
  });
});

describe('Task Controller - Delete Task Flow', () => {
  test('should delete task successfully', async () => {
    const mockRepo = new TaskRepositoryMock();
    mockRepo.delete.mockResolvedValue(true);

    const deleteTaskUseCase = new DeleteTaskUseCase(mockRepo);

    await deleteTaskUseCase.execute('task-1', 'user-123');

    expect(mockRepo.delete).toHaveBeenCalledWith('task-1', 'user-123');
  });

  test('should throw NotFoundError when task not found', async () => {
    const mockRepo = new TaskRepositoryMock();
    mockRepo.delete.mockResolvedValue(false);

    const deleteTaskUseCase = new DeleteTaskUseCase(mockRepo);

    await expect(
      deleteTaskUseCase.execute('non-existent-id', 'user-123')
    ).rejects.toThrow(NotFoundError);
  });
});
