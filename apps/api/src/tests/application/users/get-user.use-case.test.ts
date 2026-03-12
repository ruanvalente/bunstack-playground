import { beforeEach, describe, expect, test } from 'bun:test';

import type { User } from '@bunstack-playground/shared/http';

import { GetUserUseCase } from '@/api/application/users/get-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

type GetUserInput = string;

describe('GetUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    getUserUseCase = new GetUserUseCase(userRepositoryMock);
  });

  test('should return user when user exists', async () => {
    const userId: GetUserInput = '123e4567-e89b-12d3-a456-426614174000';
    const existingUser: User = createMockUser({
      id: userId,
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);

    const result = await getUserUseCase.execute(userId);

    expect(result.id).toBe(userId);
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });

  test('should throw NotFoundError when user does not exist', async () => {
    const userId: GetUserInput = 'non-existent-id';

    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(getUserUseCase.execute(userId)).rejects.toThrow(NotFoundError);
    await expect(getUserUseCase.execute(userId)).rejects.toThrow(
      'User not found'
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(userId);
  });
});
