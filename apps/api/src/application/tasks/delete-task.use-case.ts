import { NotFoundError } from '@/api/domain/erros';
import type { ITaskRepository } from '@/api/domain/repositories';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id, userId);

    if (!deleted) {
      throw new NotFoundError('Task not found');
    }
  }
}
