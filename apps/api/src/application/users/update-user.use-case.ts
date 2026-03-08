import type { UpdateUserDTO, User } from '@bunstack-playground/shared/http';

import { NotFoundError } from '@/api/domain/erros';
import type { IUserRepository } from '@/api/domain/repositories';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, input: UpdateUserDTO): Promise<User> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const updatedUser = await this.userRepository.update(id, input);

    if (!updatedUser) {
      throw new NotFoundError('Failed to update user');
    }

    return updatedUser;
  }
}
