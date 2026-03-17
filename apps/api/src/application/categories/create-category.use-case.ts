import type { Category } from '@bunstack-playground/shared';

import type { ICategoryRepository } from '@/api/domain/repositories';
import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository?: ICategoryRepository) {}

  async execute(
    name: string,
    color: string,
    userId: string
  ): Promise<Category> {
    const repository = this.categoryRepository ?? getCategoryRepository();
    return repository.create(name, color, userId);
  }
}
