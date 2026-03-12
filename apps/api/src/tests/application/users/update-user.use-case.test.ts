import { beforeEach, describe, expect, test } from 'bun:test';

import type { UpdateUserDTO, User } from '@bunstack-playground/shared/http';

import { UpdateUserUseCase } from '@/api/application/users/update-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

type UpdateUserInput = {
  id: string;
  data: UpdateUserDTO;
};

describe('UpdateUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
  });

  test('should update user successfully when user exists', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const existingUser: User = createMockUser({
      id: userId,
      name: 'Test User',
    });

    const updatedUser: User = createMockUser({
      id: userId,
      name: 'Updated Name',
      role: 'ADMIN',
    });

    const input: UpdateUserInput = {
      id: userId,
      data: {
        name: 'Updated Name',
        role: 'ADMIN',
      },
    };

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(input.id, input.data);

    expect(result.name).toBe('Updated Name');
    expect(result.role).toBe('ADMIN');
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(input.id);
    expect(userRepositoryMock.update).toHaveBeenCalledWith(
      input.id,
      input.data
    );
  });

  test('should throw NotFoundError when user does not exist', async () => {
    const input: UpdateUserInput = {
      id: 'non-existent-id',
      data: {
        name: 'Updated Name',
      },
    };

    userRepositoryMock.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute(input.id, input.data)
    ).rejects.toThrow(NotFoundError);
    await expect(
      updateUserUseCase.execute(input.id, input.data)
    ).rejects.toThrow('User not found');
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError when update fails', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const existingUser: User = createMockUser({
      id: userId,
      name: 'Test User',
    });

    const input: UpdateUserInput = {
      id: userId,
      data: {
        name: 'Updated Name',
      },
    };

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute(input.id, input.data)
    ).rejects.toThrow(NotFoundError);
    await expect(
      updateUserUseCase.execute(input.id, input.data)
    ).rejects.toThrow('Failed to update user');
  });
});
