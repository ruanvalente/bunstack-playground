import type { Category } from '@bunstack-playground/shared';

export interface ICategoryRepository {
  findAll(userId: string): Promise<Category[]>;
  findById(id: string, userId: string): Promise<Category | null>;
  create(name: string, color: string, userId: string): Promise<Category>;
  delete(id: string, userId: string): Promise<boolean>;
  seedDefaults(userId: string): Promise<void>;
}
