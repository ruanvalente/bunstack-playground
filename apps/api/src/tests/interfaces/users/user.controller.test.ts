import { describe, expect, test } from 'bun:test';

import type {
  CreateUserDTO,
  UpdateUserDTO,
} from '@bunstack-playground/shared/http';

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
} from '@/api/application/users';
import { ConflictError, NotFoundError } from '@/api/domain/erros/errors';

import {
  createMockPaginatedUsersResponse,
  createMockUser,
  UserRepositoryMock,
} from '../../mocks/users/user.repository.mock';

describe('User Controller - List Users Flow', () => {
  test('should list users with pagination parameters', async () => {
    const users = [
      createMockUser({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'user1@example.com',
        name: 'User One',
      }),
      createMockUser({
        id: '123e4567-e89b-12d3-a456-426614174001',
        email: 'user2@example.com',
        name: 'User Two',
        role: 'ADMIN',
      }),
    ];

    const mockRepo = new UserRepositoryMock();
    mockRepo.findAll.mockResolvedValue(
      createMockPaginatedUsersResponse(users, {
        pagination: {
          total: 2,
          page: 2,
          pageSize: 20,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: true,
        },
        meta: {
          sortBy: 'name',
          sortOrder: 'ASC',
          timestamp: new Date().toISOString(),
        },
      })
    );

    const listUsersUseCase = new ListUsersUseCase(mockRepo);

    const result = await listUsersUseCase.execute({
      page: 2,
      pageSize: 20,
      sortBy: 'name',
      sortOrder: 'ASC',
    });

    expect(result.data).toHaveLength(2);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.pageSize).toBe(20);
    expect(mockRepo.findAll).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      sortBy: 'name',
      sortOrder: 'ASC',
    });
  });
});

describe('User Controller - Get User Flow', () => {
  test('should get user by id successfully', async () => {
    const user = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
    });

    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(user);

    const getUserUseCase = new GetUserUseCase(mockRepo);

    const result = await getUserUseCase.execute(
      '123e4567-e89b-12d3-a456-426614174000'
    );

    expect(result.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(result.email).toBe('user@example.com');
    expect(mockRepo.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  test('should throw NotFoundError when user not found', async () => {
    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(null);

    const getUserUseCase = new GetUserUseCase(mockRepo);

    await expect(getUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
  });
});

describe('User Controller - Create User Flow', () => {
  test('should create user successfully', async () => {
    const newUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'newuser@example.com',
      name: 'New User',
    });

    const mockRepo = new UserRepositoryMock();
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.create.mockResolvedValue(newUser);

    const createUserUseCase = new CreateUserUseCase(mockRepo);

    const input: CreateUserDTO = {
      email: 'newuser@example.com',
      password: 'Password1!',
      name: 'New User',
      role: 'USER',
    };

    const result = await createUserUseCase.execute(input);

    expect(result.email).toBe('newuser@example.com');
    expect(result.name).toBe('New User');
    expect(mockRepo.findByEmail).toHaveBeenCalledWith('newuser@example.com');
    expect(mockRepo.create).toHaveBeenCalledWith(input);
  });

  test('should throw ConflictError when email already exists', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'existing@example.com',
      name: 'Existing User',
    });

    const mockRepo = new UserRepositoryMock();
    mockRepo.findByEmail.mockResolvedValue(existingUser);

    const createUserUseCase = new CreateUserUseCase(mockRepo);

    const input: CreateUserDTO = {
      email: 'existing@example.com',
      password: 'Password1!',
      name: 'New User',
      role: 'USER',
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      ConflictError
    );
  });
});

describe('User Controller - Update User Flow', () => {
  test('should update user successfully', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'Old Name',
    });

    const updatedUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'New Name',
      role: 'ADMIN',
    });

    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(existingUser);
    mockRepo.update.mockResolvedValue(updatedUser);

    const updateUserUseCase = new UpdateUserUseCase(mockRepo);

    const input: UpdateUserDTO = {
      name: 'New Name',
      role: 'ADMIN',
    };

    const result = await updateUserUseCase.execute(
      '123e4567-e89b-12d3-a456-426614174000',
      input
    );

    expect(result.name).toBe('New Name');
    expect(result.role).toBe('ADMIN');
  });

  test('should throw NotFoundError when user not found', async () => {
    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(null);

    const updateUserUseCase = new UpdateUserUseCase(mockRepo);

    const input: UpdateUserDTO = {
      name: 'New Name',
    };

    await expect(
      updateUserUseCase.execute('non-existent-id', input)
    ).rejects.toThrow(NotFoundError);
  });
});

describe('User Controller - Delete User Flow', () => {
  test('should delete user successfully', async () => {
    const existingUser = createMockUser({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'Test User',
    });

    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(existingUser);
    mockRepo.delete.mockResolvedValue(true);

    const deleteUserUseCase = new DeleteUserUseCase(mockRepo);

    await deleteUserUseCase.execute('123e4567-e89b-12d3-a456-426614174000');

    expect(mockRepo.findById).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
    expect(mockRepo.delete).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000'
    );
  });

  test('should throw NotFoundError when user not found', async () => {
    const mockRepo = new UserRepositoryMock();
    mockRepo.findById.mockResolvedValue(null);

    const deleteUserUseCase = new DeleteUserUseCase(mockRepo);

    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundError
    );
  });
});
