import type { Task } from '@bunstack-playground/shared';
import type { ITaskRepository } from '@/api/domain/repositories';
import { NotFoundError, ValidationError } from '@/api/domain/erros';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(id: string, title: string, userId: string): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError('Title cannot be empty');
    }

    const task = await this.taskRepository.updateTitle(
      id,
      newTaskTitle,
      userId
    );

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return task;
  }
}
