import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
} from '@bunstack-playground/shared';

export interface ITaskRepository {
  findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain>;
  findById(id: string): Promise<Task | null>;
  create(title: string): Promise<Task>;
  updateTitle(id: string, title: string): Promise<Task | null>;
  complete(id: string, completed: boolean): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}
