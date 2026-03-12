import { mock } from 'bun:test';

import type {
  CreateUserDTO,
  PaginatedUsersResponseDTO,
  PaginationQueryDTO,
  UpdateUserDTO,
  User,
} from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';

type UserWithoutId = Omit<User, 'id'>;
type UserWithOptionalFields = Partial<Omit<User, 'id' | 'email'>>;
type CreateUserInput = CreateUserDTO;
type UpdateUserInput = UpdateUserDTO;
type PaginationParams = PaginationQueryDTO;

type UserFindAllParams = (
  params: PaginationParams
) => Promise<PaginatedUsersResponseDTO>;
type UserFindByIdParams = (id: string) => Promise<User | null>;
type UserFindByEmailParams = (email: string) => Promise<User | null>;
type UserCreateParams = (data: CreateUserDTO) => Promise<User>;
type UserUpdateParams = (
  id: string,
  data: UpdateUserDTO
) => Promise<User | null>;
type UserDeleteParams = (id: string) => Promise<boolean>;

const DEFAULT_USER: UserWithoutId = {
  email: 'test@example.com',
  name: 'Test User',
  role: 'USER',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DEFAULT_PAGINATION = {
  total: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

const DEFAULT_META = {
  sortBy: 'created_at',
  sortOrder: 'DESC' as const,
  timestamp: new Date().toISOString(),
};

export class UserRepositoryMock implements IUserRepository {
  findAll = mock<UserFindAllParams>(async () => ({
    data: [],
    pagination: DEFAULT_PAGINATION,
    meta: DEFAULT_META,
  }));

  findById = mock<UserFindByIdParams>(async () => null);

  findByEmail = mock<UserFindByEmailParams>(async () => null);

  create = mock<UserCreateParams>(async () => ({
    id: 'test-user-1',
    ...DEFAULT_USER,
  }));

  update = mock<UserUpdateParams>(async () => null);

  delete = mock<UserDeleteParams>(async () => false);

  clear(): void {
    this.findAll.mockClear();
    this.findById.mockClear();
    this.findByEmail.mockClear();
    this.create.mockClear();
    this.update.mockClear();
    this.delete.mockClear();
  }
}

export type MockUserOverrides = Partial<Omit<User, 'id'>> &
  Partial<Pick<User, 'id'>>;

export const createMockUser = (overrides?: MockUserOverrides): User => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  ...DEFAULT_USER,
  ...overrides,
});

type PaginatedResponseOverrides = Partial<
  Omit<PaginatedUsersResponseDTO, 'data'>
> &
  Partial<Pick<PaginatedUsersResponseDTO, 'data'>>;

export const createMockPaginatedUsersResponse = (
  users: User[],
  overrides?: PaginatedResponseOverrides
): PaginatedUsersResponseDTO => ({
  data: users,
  pagination: {
    ...DEFAULT_PAGINATION,
    total: users.length,
    totalPages: Math.ceil(users.length / 10),
    ...overrides?.pagination,
  },
  meta: {
    ...DEFAULT_META,
    ...overrides?.meta,
  },
  ...overrides,
});
