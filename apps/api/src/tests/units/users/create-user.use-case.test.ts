import { beforeEach, describe, expect, mock, test } from 'bun:test';

import type { CreateUserDTO, User } from '@bunstack-playground/shared/http';

import { CreateUserUseCase } from '@/api/application/users/create-user.use-case';
import { ConflictError } from '@/api/domain/erros';
import type { IUserRepository } from '@/api/domain/repositories';

const mockFindByEmail = mock<() => Promise<User | null>>(() =>
  Promise.resolve(null)
);
const mockCreate = mock(() => Promise.resolve({} as User));

const mockUserRepository = {
  findByEmail: mockFindByEmail as (email: string) => Promise<User | null>,
  create: mockCreate as (data: CreateUserDTO) => Promise<User>,
  findById: mock(() => Promise.resolve(null)),
  findAll: mock(() =>
    Promise.resolve({
      data: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      meta: {
        sortBy: 'created_at',
        sortOrder: 'DESC',
        timestamp: new Date().toISOString(),
      },
    })
  ),
  update: mock(() => Promise.resolve(null)),
  delete: mock(() => Promise.resolve(false)),
} as unknown as IUserRepository;

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    createUserUseCase = new CreateUserUseCase(mockUserRepository);
    mockFindByEmail.mockClear();
    mockCreate.mockClear();
  });

  test('should create user successfully when email does not exist', async () => {
    mockFindByEmail.mockResolvedValue(null);
    mockCreate.mockResolvedValue({
      id: 'new-user-id',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    const result = await createUserUseCase.execute(input);

    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('Test User');
    expect(mockFindByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockCreate).toHaveBeenCalledWith(input);
  });

  test('should throw ConflictError when email already exists', async () => {
    const existingUser: User = {
      id: 'existing-user-id',
      email: 'test@example.com',
      name: 'Existing User',
      role: 'USER',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockFindByEmail.mockResolvedValue(existingUser as User | null);

    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      ConflictError
    );
    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      'User with this email already exists'
    );
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
