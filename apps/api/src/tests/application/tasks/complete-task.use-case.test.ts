import { beforeEach, describe, expect, test } from 'bun:test';

import type { Task } from '@bunstack-playground/shared';

import { CompleteTaskUseCase } from '@/api/application/tasks/complete-task.use-case';
import { NotFoundError } from '@/api/domain/erros';

import { createMockTask, TaskRepositoryMock } from '../../mocks';

type CompleteTaskInput = {
  id: string;
  completed: boolean;
  userId: string;
};

describe('CompleteTaskUseCase', () => {
  let taskRepositoryMock: TaskRepositoryMock;
  let completeTaskUseCase: CompleteTaskUseCase;

  beforeEach(() => {
    taskRepositoryMock = new TaskRepositoryMock();
    completeTaskUseCase = new CompleteTaskUseCase(taskRepositoryMock);
  });

  test('should mark task as completed', async () => {
    const completedTask: Task = createMockTask({
      id: 'task-1',
      completed: true,
    });

    const input: CompleteTaskInput = {
      id: 'task-1',
      completed: true,
      userId: 'user-123',
    };

    taskRepositoryMock.complete.mockResolvedValue(completedTask);

    const result = await completeTaskUseCase.execute(
      input.id,
      input.completed,
      input.userId
    );

    expect(result.completed).toBe(true);
    expect(taskRepositoryMock.complete).toHaveBeenCalledWith(
      input.id,
      input.completed,
      input.userId
    );
  });

  test('should mark task as incomplete', async () => {
    const incompleteTask: Task = createMockTask({
      id: 'task-1',
      completed: false,
    });

    const input: CompleteTaskInput = {
      id: 'task-1',
      completed: false,
      userId: 'user-123',
    };

    taskRepositoryMock.complete.mockResolvedValue(incompleteTask);

    const result = await completeTaskUseCase.execute(
      input.id,
      input.completed,
      input.userId
    );

    expect(result.completed).toBe(false);
    expect(taskRepositoryMock.complete).toHaveBeenCalledWith(
      input.id,
      input.completed,
      input.userId
    );
  });

  test('should throw NotFoundError when task not found', async () => {
    const input: CompleteTaskInput = {
      id: 'non-existent-id',
      completed: true,
      userId: 'user-123',
    };

    taskRepositoryMock.complete.mockResolvedValue(null);

    await expect(
      completeTaskUseCase.execute(input.id, input.completed, input.userId)
    ).rejects.toThrow(NotFoundError);
    await expect(
      completeTaskUseCase.execute(input.id, input.completed, input.userId)
    ).rejects.toThrow('Task not found');
  });
});
