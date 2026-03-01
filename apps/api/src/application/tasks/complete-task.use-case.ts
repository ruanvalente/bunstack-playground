import type { Task } from '@bunstack-playground/shared';

import { NotFoundError } from '@/api/domain/erros';
import type { ITaskRepository } from '@/api/domain/repositories';

export class CompleteTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, completed: boolean, userId: string): Promise<Task> {
    const task = await this.taskRepository.complete(id, completed, userId);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }
}
