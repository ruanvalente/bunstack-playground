import { beforeEach, describe, expect, test } from 'bun:test';

import type { CreateUserDTO, User } from '@bunstack-playground/shared/http';

import { CreateUserUseCase } from '@/api/application/users/create-user.use-case';
import { ConflictError } from '@/api/domain/erros';

import {
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

describe('CreateUserUseCase', () => {
  let userRepositoryMock: UserRepositoryMock;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    userRepositoryMock = new UserRepositoryMock();
    createUserUseCase = new CreateUserUseCase(userRepositoryMock);
  });

  test('should create user successfully when email does not exist', async () => {
    const newUser: User = createMockUser({
      id: 'new-user-id',
      email: 'test@example.com',
      name: 'Test User',
    });

    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    userRepositoryMock.findByEmail.mockResolvedValue(null);
    userRepositoryMock.create.mockResolvedValue(newUser);

    const result = await createUserUseCase.execute(input);

    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');
    expect(userRepositoryMock.findByEmail).toHaveBeenCalledWith(input.email);
    expect(userRepositoryMock.create).toHaveBeenCalledWith(input);
  });

  test('should throw ConflictError when email already exists', async () => {
    const existingUser: User = createMockUser({
      id: 'existing-user-id',
      email: 'test@example.com',
      name: 'Existing User',
    });

    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    userRepositoryMock.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      ConflictError
    );
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      'User with this email already exists'
    );
    expect(userRepositoryMock.create).not.toHaveBeenCalled();
  });
});
