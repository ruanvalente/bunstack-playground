import type { CreateUserDTO, User } from '@bunstack-playground/shared/http';

import { ConflictError } from '@/api/domain/erros';
import type { IUserRepository } from '@/api/domain/repositories';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictError('User with this email already exists');
    }

    return this.userRepository.create(input);
  }
}
