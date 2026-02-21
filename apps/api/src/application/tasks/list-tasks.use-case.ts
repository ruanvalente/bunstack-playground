import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
} from '@bunstack-playground/shared';
import type { ITaskRepository } from '@/api/domain/repositories';

export class ListTasksUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(params: PaginationQueryDTO): Promise<PaginatedTasksDomain> {
    return this.taskRepository.findAll(params);
  }
}
