import type { Category } from '@bunstack-playground/shared';

import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class CreateCategoryUseCase {
  async execute(
    name: string,
    color: string,
    userId: string
  ): Promise<Category> {
    const categoryRepository = getCategoryRepository();
    return categoryRepository.create(name, color, userId);
  }
}
