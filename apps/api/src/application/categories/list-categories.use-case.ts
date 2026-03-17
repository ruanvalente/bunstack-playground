import type { Category } from '@bunstack-playground/shared';

import type { ICategoryRepository } from '@/api/domain/repositories';
import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository?: ICategoryRepository) {}

  async execute(userId: string): Promise<Category[]> {
    const repository = this.categoryRepository ?? getCategoryRepository();
    await repository.seedDefaults(userId);
    return repository.findAll(userId);
  }
}
