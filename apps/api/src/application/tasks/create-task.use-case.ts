import type { Task } from '@bunstack-playground/shared';

import { ValidationError } from '@/api/domain/erros';
import type { ITaskRepository } from '@/api/domain/repositories';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(
    title: string,
    userId: string,
    categoryId?: string
  ): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError('Title cannot be empty');
    }

    return this.taskRepository.create(newTaskTitle, userId, categoryId);
  }
}
