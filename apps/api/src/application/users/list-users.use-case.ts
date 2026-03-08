import type { PaginatedUsersResponseDTO } from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params?: {
    page?: number;
    pageSize?: number;
    sortOrder?: 'ASC' | 'DESC';
    sortBy?: string;
  }): Promise<PaginatedUsersResponseDTO> {
    return this.userRepository.findAll(params || {});
  }
}
