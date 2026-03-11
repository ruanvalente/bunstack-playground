import { beforeEach, describe, expect, test } from 'bun:test';

import { GetUserUseCase } from '@/api/application/users/get-user.use-case';
import { NotFoundError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

describe('GetUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let getUserUseCase: GetUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    getUserUseCase = new GetUserUseCase(userRepositoryMock);
  });

  test('should return user when user exists', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
    });
    userRepositoryMock.findById.mockResolvedValue(existingUser);

    const result = await getUserUseCase.execute(
      '123e4567-e89b-12d3-a456-426614174000'
    );

    expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(userRepositoryMock.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  test('should throw NotFoundError when user does not exist', async () => {
    userRepositoryMock.findById.mockResolvedValue(null);

    expect(getUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
    expect(getUserUseCase.execute('non-existent-id')).rejects.toThrow(
      'User not found'
    );
    expect(userRepositoryMock.findById).toHaveBeenCalledWith('non-existent-id');
  });
});
