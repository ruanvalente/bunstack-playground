import type { Task } from '@bunstack-playground/shared';
import type { ITaskRepository } from '@/api/domain/repositories';
import { ValidationError } from '@/api/domain/errors';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(title: string): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError('Title cannot be empty');
    }

    return this.taskRepository.create(newTaskTitle);
  }
}
