import type { Category } from '@bunstack-playground/shared';

import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class ListCategoriesUseCase {
  async execute(userId: string): Promise<Category[]> {
    const categoryRepository = getCategoryRepository();
    await categoryRepository.seedDefaults(userId);
    return categoryRepository.findAll(userId);
  }
}
