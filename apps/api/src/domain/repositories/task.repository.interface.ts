import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
} from '@bunstack-playground/shared';

export interface ITaskRepository {
  findAll(
    params: PaginationQueryDTO,
    userId: string
  ): Promise<PaginatedTasksDomain>;
  findById(id: string, userId: string): Promise<Task | null>;
  create(title: string, userId: string): Promise<Task>;
  updateTitle(id: string, title: string, userId: string): Promise<Task | null>;
  complete(
    id: string,
    completed: boolean,
    userId: string
  ): Promise<Task | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
