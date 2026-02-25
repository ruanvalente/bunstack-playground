import { getCategoryRepository } from '@/api/infrastructure/repositories/factory/category.repository.factory';

export class DeleteCategoryUseCase {
  async execute(id: string, userId: string): Promise<boolean> {
    const categoryRepository = getCategoryRepository();
    return categoryRepository.delete(id, userId);
  }
}
