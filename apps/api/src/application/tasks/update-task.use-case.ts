import type { Task } from '@bunstack-playground/shared';
import type { ITaskRepository } from '@/api/domain/repositories';
import { NotFoundError, ValidationError } from '@/api/shared/errors';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, title: string): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError('Title cannot be empty');
    }

    const task = await this.taskRepository.updateTitle(id, newTaskTitle);

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }
}
