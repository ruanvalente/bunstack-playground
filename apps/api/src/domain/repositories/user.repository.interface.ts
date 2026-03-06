import type {
  CreateUserDTO,
  PaginatedUsersResponseDTO,
  UpdateUserDTO,
  User,
} from '@bunstack-playground/shared/http';

export interface IUserRepository {
  findAll(params: {
    page?: number;
    pageSize?: number;
    sortOrder?: 'ASC' | 'DESC';
    sortBy?: string;
  }): Promise<PaginatedUsersResponseDTO>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: string, data: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}
