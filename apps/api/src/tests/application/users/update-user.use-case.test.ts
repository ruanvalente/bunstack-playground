import { beforeEach, describe, expect, test } from 'bun:test';

import type { UpdateUserDTO } from '@bunstack-playground/shared/http';

import { UpdateUserUseCase } from '@/api/application/users/update-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

describe('UpdateUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    updateUserUseCase = new UpdateUserUseCase(userRepositoryMock);
  });

  test('should update user successfully when user exists', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
    });

    const updatedUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Updated Name',
      role: 'ADMIN',
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockResolvedValue(updatedUser);

    const input: UpdateUserDTO = {
      name: 'Updated Name',
      role: 'ADMIN',
    };

    const result = await updateUserUseCase.execute(
      '123e4567-e89b-12d3-a456-426614174000',
      input
    );

    expect(result.name).toBe('Updated Name');
    expect(result.role).toBe('ADMIN');
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
    expect(userRepositoryMock.update).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      input
    );
  });

  test('should throw NotFoundError when user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    const input: UpdateUserDTO = {
      name: 'Updated Name',
    };

    expect(updateUserUseCase.execute('non-existent-id', input)).rejects.toThrow(
      NotFoundError
    );
    expect(updateUserUseCase.execute('non-existent-id', input)).rejects.toThrow(
      'User not found'
    );
    expect(userRepositoryMock.update).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError when update fails', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Test User',
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.update.mockResolvedValue(null);

    const input: UpdateUserDTO = {
      name: 'Updated Name',
    };

    expect(
      updateUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000', input)
    ).rejects.toThrow(NotFoundError);
    expect(
      updateUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000', input)
    ).rejects.toThrow('Failed to update user');
  });
});
