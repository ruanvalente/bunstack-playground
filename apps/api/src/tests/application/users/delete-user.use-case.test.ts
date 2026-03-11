import { beforeEach, describe, expect, test } from 'bun:test';

import { DeleteUserUseCase } from '@/api/application/users/delete-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

describe('DeleteUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let deleteUserUseCase: DeleteUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    deleteUserUseCase = new DeleteUserUseCase(userRepositoryMock);
  });

  test('should delete user successfully when user exists', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.delete.mockResolvedValue(true);

    await deleteUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000');

    expect(userRepositoryMock.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
    expect(userRepositoryMock.delete).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  test('should throw NotFoundError when user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    expect(deleteUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
    expect(deleteUserUseCase.execute('non-existent-id')).rejects.toThrow(
      'User not found'
    );
    expect(userRepositoryMock.delete).not.toHaveBeenCalled();
  });

  test('should throw NotFoundError when delete fails', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
    });

    userRepositoryMock.findById.mockResolvedValue(existingUser);
    userRepositoryMock.delete.mockResolvedValue(false);

    expect(
      deleteUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow(NotFoundError);
    expect(
      deleteUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000')
    ).rejects.toThrow('Failed to delete user');
  });
});
