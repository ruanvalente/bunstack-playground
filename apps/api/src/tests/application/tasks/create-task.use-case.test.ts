import { beforeEach, describe, expect, test } from 'bun:test';

import type { Task } from '@bunstack-playground/shared';

import { CreateTaskUseCase } from '@/api/application/tasks/create-task.use-case';
import { ValidationError } from '@/api/domain/erros';

import { createMockTask, TaskRepositoryMock } from '../../mocks';

type CreateTaskInput = {
  title: string;
  userId: string;
  categoryId?: string;
};

describe('CreateTaskUseCase', () => {
  let taskRepositoryMock: TaskRepositoryMock;
  let createTaskUseCase: CreateTaskUseCase;

  beforeEach(() => {
    taskRepositoryMock = new TaskRepositoryMock();
    createTaskUseCase = new CreateTaskUseCase(taskRepositoryMock);
  });

  test('should create task successfully', async () => {
    const newTask: Task = createMockTask({
      id: 'new-task-id',
      title: 'New Task',
    });

    const input: CreateTaskInput = {
      title: 'New Task',
      userId: 'user-123',
    };

    taskRepositoryMock.create.mockResolvedValue(newTask);

    const result = await createTaskUseCase.execute(
      input.title,
      input.userId,
      input.categoryId
    );

    expect(result.title).toBe('New Task');
    expect(taskRepositoryMock.create).toHaveBeenCalledWith(
      input.title,
      input.userId,
      undefined
    );
  });

  test('should create task with category', async () => {
    const newTask: Task = createMockTask({
      id: 'new-task-id',
      title: 'Task with category',
      categoryId: 'cat-1',
    });

    const input: CreateTaskInput = {
      title: 'Task with category',
      userId: 'user-123',
      categoryId: 'cat-1',
    };

    taskRepositoryMock.create.mockResolvedValue(newTask);

    const result = await createTaskUseCase.execute(
      input.title,
      input.userId,
      input.categoryId
    );

    expect(result.categoryId).toBe('cat-1');
    expect(taskRepositoryMock.create).toHaveBeenCalledWith(
      input.title,
      input.userId,
      input.categoryId
    );
  });

  test('should trim whitespace from title', async () => {
    const newTask: Task = createMockTask({
      id: 'new-task-id',
      title: 'Trimmed Task',
    });

    const input: CreateTaskInput = {
      title: '  Trimmed Task  ',
      userId: 'user-123',
    };

    taskRepositoryMock.create.mockResolvedValue(newTask);

    await createTaskUseCase.execute(input.title, input.userId);

    expect(taskRepositoryMock.create).toHaveBeenCalledWith(
      'Trimmed Task',
      input.userId,
      undefined
    );
  });

  test('should throw ValidationError when title is empty', async () => {
    const input: CreateTaskInput = {
      title: '',
      userId: 'user-123',
    };

    await expect(
      createTaskUseCase.execute(input.title, input.userId)
    ).rejects.toThrow(ValidationError);
    await expect(
      createTaskUseCase.execute(input.title, input.userId)
    ).rejects.toThrow('Title cannot be empty');
    expect(taskRepositoryMock.create).not.toHaveBeenCalled();
  });

  test('should throw ValidationError when title is only whitespace', async () => {
    const input: CreateTaskInput = {
      title: '   ',
      userId: 'user-123',
    };

    await expect(
      createTaskUseCase.execute(input.title, input.userId)
    ).rejects.toThrow(ValidationError);
    await expect(
      createTaskUseCase.execute(input.title, input.userId)
    ).rejects.toThrow('Title cannot be empty');
    expect(taskRepositoryMock.create).not.toHaveBeenCalled();
  });
});
