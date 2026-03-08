import { NotFoundError } from '@/api/domain/erros';
import type { IUserRepository } from '@/api/domain/repositories';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundError('User not found');
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Failed to delete user');
    }
  }
}
