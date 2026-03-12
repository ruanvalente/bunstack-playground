import { beforeEach, describe, expect, test } from 'bun:test';

import { DeleteTaskUseCase } from '@/api/application/tasks/delete-task.use-case';
import { NotFoundError } from '@/api/domain/erros';

import { TaskRepositoryMock } from '../../mocks';

type DeleteTaskInput = {
  id: string;
  userId: string;
};

describe('DeleteTaskUseCase', () => {
  let taskRepositoryMock: TaskRepositoryMock;
  let deleteTaskUseCase: DeleteTaskUseCase;

  beforeEach(() => {
    taskRepositoryMock = new TaskRepositoryMock();
    deleteTaskUseCase = new DeleteTaskUseCase(taskRepositoryMock);
  });

  test('should delete task successfully', async () => {
    const input: DeleteTaskInput = {
      id: 'task-1',
      userId: 'user-123',
    };

    taskRepositoryMock.delete.mockResolvedValue(true);

    await deleteTaskUseCase.execute(input.id, input.userId);

    expect(taskRepositoryMock.delete).toHaveBeenCalledWith(
      input.id,
      input.userId
    );
  });

  test('should throw NotFoundError when task not found', async () => {
    const input: DeleteTaskInput = {
      id: 'non-existent-id',
      userId: 'user-123',
    };

    taskRepositoryMock.delete.mockResolvedValue(false);

    await expect(
      deleteTaskUseCase.execute(input.id, input.userId)
    ).rejects.toThrow(NotFoundError);
    await expect(
      deleteTaskUseCase.execute(input.id, input.userId)
    ).rejects.toThrow('Task not found');
  });
});
