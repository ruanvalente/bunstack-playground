import { beforeEach, describe, expect, mock, test } from 'bun:test';

import type {
  CreateUserDTO,
  PaginatedUsersResponseDTO,
  UpdateUserDTO,
  User,
} from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';

class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  findAll = mock<
    (params: {
      page?: number;
      pageSize?: number;
      sortOrder?: 'ASC' | 'DESC';
      sortBy?: string;
    }) => Promise<PaginatedUsersResponseDTO>
  >(async (params) => {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 10;
    const users = Array.from(this.users.values());
    const start = (page - 1) * pageSize;
    const paginatedUsers = users.slice(start, start + pageSize);

    return {
      data: paginatedUsers,
      pagination: {
        total: users.length,
        page,
        pageSize,
        totalPages: Math.ceil(users.length / pageSize),
        hasNextPage: page < Math.ceil(users.length / pageSize),
        hasPrevPage: page > 1,
      },
      meta: {
        sortBy: params.sortBy ?? 'created_at',
        sortOrder: params.sortOrder ?? 'DESC',
        timestamp: new Date().toISOString(),
      },
    };
  });

  findById = mock<(id: string) => Promise<User | null>>(async (id) => {
    return this.users.get(id) ?? null;
  });

  findByEmail = mock<(email: string) => Promise<User | null>>(async (email) => {
    return (
      Array.from(this.users.values()).find((u) => u.email === email) ?? null
    );
  });

  create = mock<(data: CreateUserDTO) => Promise<User>>(async (data) => {
    const now = new Date().toISOString();
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      name: data.name,
      role: data.role ?? 'USER',
      status: 'active',
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  });

  update = mock<(id: string, data: UpdateUserDTO) => Promise<User | null>>(
    async (id, data) => {
      const user = this.users.get(id);
      if (!user) return null;

      const updatedUser: User = {
        ...user,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
  );

  delete = mock<(id: string) => Promise<boolean>>(async (id) => {
    return this.users.delete(id);
  });

  clear(): void {
    this.users.clear();
  }

  addUser(user: User): void {
    this.users.set(user.id, user);
  }
}

describe('UserRepository - Integration', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  test('should create a new user', async () => {
    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    const user = await repository.create(input);

    expect(user.email).toBe('test@example.com');
    expect(user.name).toBe('Test User');
    expect(user.role).toBe('USER');
    expect(user.status).toBe('active');
    expect(user.id).toBeDefined();
  });

  test('should find user by id', async () => {
    const input: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    };

    const created = await repository.create(input);
    const found = await repository.findById(created.id);

    expect(found).not.toBeNull();
    expect(found!.email).toBe('test@example.com');
  });

  test('should return null when user not found by id', async () => {
    const found = await repository.findById('non-existent-id');

    expect(found).toBeNull();
  });

  test('should find user by email', async () => {
    const input: CreateUserDTO = {
      email: 'findme@example.com',
      password: 'Password1!',
      name: 'Find Me',
      role: 'USER',
    };

    await repository.create(input);
    const found = await repository.findByEmail('findme@example.com');

    expect(found).not.toBeNull();
    expect(found!.name).toBe('Find Me');
  });

  test('should return null when user not found by email', async () => {
    const found = await repository.findByEmail('nonexistent@example.com');

    expect(found).toBeNull();
  });

  test('should find all users with pagination', async () => {
    await repository.create({
      email: 'user1@test.com',
      password: 'Pass1!',
      name: 'User 1',
      role: 'USER',
    });
    await repository.create({
      email: 'user2@test.com',
      password: 'Pass1!',
      name: 'User 2',
      role: 'USER',
    });
    await repository.create({
      email: 'user3@test.com',
      password: 'Pass1!',
      name: 'User 3',
      role: 'USER',
    });

    const result = await repository.findAll({ page: 1, pageSize: 2 });

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(3);
    expect(result.pagination.totalPages).toBe(2);
    expect(result.pagination.hasNextPage).toBe(true);
  });

  test('should update user', async () => {
    const created = await repository.create({
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Old Name',
      role: 'USER',
    });

    const updated = await repository.update(created.id, {
      name: 'New Name',
      role: 'ADMIN',
    });

    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('New Name');
    expect(updated!.role).toBe('ADMIN');
  });

  test('should return null when updating non-existent user', async () => {
    const updated = await repository.update('non-existent-id', {
      name: 'New Name',
    });

    expect(updated).toBeNull();
  });

  test('should delete user', async () => {
    const created = await repository.create({
      email: 'test@example.com',
      password: 'Password1!',
      name: 'Test User',
      role: 'USER',
    });

    const deleted = await repository.delete(created.id);

    expect(deleted).toBe(true);
    const found = await repository.findById(created.id);
    expect(found).toBeNull();
  });

  test('should return false when deleting non-existent user', async () => {
    const deleted = await repository.delete('non-existent-id');

    expect(deleted).toBe(false);
  });
});
