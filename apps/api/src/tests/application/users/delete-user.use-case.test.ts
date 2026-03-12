import { beforeEach, describe, expect, test } from 'bun:test';

import type { User } from '@bunstack-playground/shared/http';

import { DeleteUserUseCase } from '@/api/application/users/delete-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

type DeleteUserInput = string;

describe('DeleteUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    deleteUserUseCase = new DeleteUserUseCase(userRepositoryMock);
  });

  test('should delete user successfully when user exists', async () => {
    const userId: DeleteUserInput = '123e4567-e89b-12d3-a456-426614174000';
    const existingUser: User = createMockUser({
      id: userId,
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.delete.mockResolvedValue(true);

    await deleteUserUseCase.execute(userId);

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(userId);
  });

  test('should throw NotFoundError when user does not exist', async () => {
    const userId: DeleteUserInput = 'non-existent-id';

    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      NotFoundError
    );
    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      'User not found'
    );
    expect(userRepositoryMock.delete).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError when delete fails', async () => {
    const userId: DeleteUserInput = '123e4567-e89b-12d3-a456-426614174000';
    const existingUser: User = createMockUser({
      id: userId,
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.delete.mockResolvedValue(false);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      NotFoundError
    );
    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(
      'Failed to delete user'
    );
  });
});
