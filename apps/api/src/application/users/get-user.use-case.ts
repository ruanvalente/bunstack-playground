import type { User } from '@bunstack-playground/shared/http';

import { NotFoundError } from '@/api/domain/erros';
import type { IUserRepository } from '@/api/domain/repositories';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
