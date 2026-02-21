import type { ITaskRepository } from '@/api/domain/repositories';
import { NotFoundError } from '@/api/domain/errors';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError('Task not found');
    }
  }
}
