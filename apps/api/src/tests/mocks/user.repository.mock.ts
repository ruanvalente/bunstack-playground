import type {
  CreateUserDTO,
  PaginatedUsersResponseDTO,
  UpdateUserDTO,
  User,
} from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';

export class UserRepositoryMock implements IUserRepository {
  private users: User[] = [];
  private idCounter = 1;

  async findAll(params?: {
    page?: number;
    pageSize?: number;
    sortOrder?: 'ASC' | 'DESC';
    sortBy?: string;
  }): Promise<PaginatedUsersResponseDTO> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
    } = params || {};

    const sorted = [...this.users].sort((a, b) => {
      const aVal = a[sortBy as keyof User];
      const bVal = b[sortBy as keyof User];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortOrder === 'ASC' ? comparison : -comparison;
    });

    const start = (page - 1) * pageSize;
    const paginatedData = sorted.slice(start, start + pageSize);

    return {
      data: paginatedData,
      pagination: {
        total: this.users.length,
        page,
        pageSize,
        totalPages: Math.ceil(this.users.length / pageSize),
        hasNextPage: start + pageSize < this.users.length,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((u) => u.email === email) || null;
  }

  async create(data: CreateUserDTO): Promise<User> {
    const newUser: User = {
      id: `test-user-${this.idCounter++}`,
      email: data.email,
      name: data.name,
      role: data.role || 'USER',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updated = {
      ...this.users[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.users[index] = updated;
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  clear(): void {
    this.users = [];
    this.idCounter = 1;
  }

  addUser(user: User): void {
    this.users.push(user);
  }
}
