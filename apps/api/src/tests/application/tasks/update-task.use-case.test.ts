import { beforeEach, describe, expect, test } from 'bun:test';

import type { Task } from '@bunstack-playground/shared';

import { UpdateTaskUseCase } from '@/api/application/tasks/update-task.use-case';
import { NotFoundError, ValidationError } from '@/api/domain/erros';

import { createMockTask, TaskRepositoryMock } from '../../mocks';

type UpdateTaskInput = {
  id: string;
  title: string;
  userId: string;
  categoryId?: string;
};

describe('UpdateTaskUseCase', () => {
  let taskRepositoryMock: TaskRepositoryMock;
  let updateTaskUseCase: UpdateTaskUseCase;

  beforeEach(() => {
    taskRepositoryMock = new TaskRepositoryMock();
    updateTaskUseCase = new UpdateTaskUseCase(taskRepositoryMock);
  });

  test('should update task title successfully', async () => {
    const updatedTask: Task = createMockTask({
      id: 'task-1',
      title: 'Updated Title',
    });

    const input: UpdateTaskInput = {
      id: 'task-1',
      title: 'Updated Title',
      userId: 'user-123',
    };

    taskRepositoryMock.updateTitle.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(
      input.id,
      input.title,
      input.userId
    );

    expect(result.title).toBe('Updated Title');
    expect(taskRepositoryMock.updateTitle).toHaveBeenCalledWith(
      input.id,
      input.title,
      input.userId,
      undefined
    );
  });

  test('should update task with category', async () => {
    const updatedTask: Task = createMockTask({
      id: 'task-1',
      title: 'Task with Category',
      categoryId: 'cat-1',
    });

    const input: UpdateTaskInput = {
      id: 'task-1',
      title: 'Task with Category',
      userId: 'user-123',
      categoryId: 'cat-1',
    };

    taskRepositoryMock.updateTitle.mockResolvedValue(updatedTask);

    const result = await updateTaskUseCase.execute(
      input.id,
      input.title,
      input.userId,
      input.categoryId
    );

    expect(result.categoryId).toBe('cat-1');
    expect(taskRepositoryMock.updateTitle).toHaveBeenCalledWith(
      input.id,
      input.title,
      input.userId,
      input.categoryId
    );
  });

  test('should trim whitespace from title', async () => {
    const updatedTask: Task = createMockTask({
      id: 'task-1',
      title: 'Trimmed Title',
    });

    const input: UpdateTaskInput = {
      id: 'task-1',
      title: '  Trimmed Title  ',
      userId: 'user-123',
    };

    taskRepositoryMock.updateTitle.mockResolvedValue(updatedTask);

    await updateTaskUseCase.execute(input.id, input.title, input.userId);

    expect(taskRepositoryMock.updateTitle).toHaveBeenCalledWith(
      input.id,
      'Trimmed Title',
      input.userId,
      undefined
    );
  });

  test('should throw ValidationError when title is empty', async () => {
    const input: UpdateTaskInput = {
      id: 'task-1',
      title: '',
      userId: 'user-123',
    };

    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow(ValidationError);
    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow('Title cannot be empty');
    expect(taskRepositoryMock.updateTitle).not.toHaveBeenCalled();
  });

  test('should throw ValidationError when title is only whitespace', async () => {
    const input: UpdateTaskInput = {
      id: 'task-1',
      title: '   ',
      userId: 'user-123',
    };

    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow(ValidationError);
    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow('Title cannot be empty');
    expect(taskRepositoryMock.updateTitle).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError when task not found', async () => {
    const input: UpdateTaskInput = {
      id: 'non-existent-id',
      title: 'New Title',
      userId: 'user-123',
    };

    taskRepositoryMock.updateTitle.mockResolvedValue(null);

    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow(NotFoundError);
    await expect(
      updateTaskUseCase.execute(input.id, input.title, input.userId)
    ).rejects.toThrow('Task not found');
  });
});
