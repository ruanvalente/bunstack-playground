import type { ICategoryRepository } from '@/api/domain/repositories';
import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository?: ICategoryRepository) {}

  async execute(id: string, userId: string): Promise<boolean> {
    const repository = this.categoryRepository ?? getCategoryRepository();
    return repository.delete(id, userId);
  }
}
