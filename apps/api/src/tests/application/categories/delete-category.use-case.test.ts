import { beforeEach, describe, expect, test } from 'bun:test';

import { DeleteCategoryUseCase } from '@/api/application/categories/delete-category.use-case';

import { CategoryRepositoryMock } from '../../mocks';

describe('DeleteCategoryUseCase', () => {
  let categoryRepositoryMock: CategoryRepositoryMock;

  beforeEach(() => {
    categoryRepositoryMock = new CategoryRepositoryMock();
  });

  test('should delete category successfully', async () => {
    categoryRepositoryMock.delete.mockResolvedValue(true);

    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepositoryMock);
    const result = await deleteCategoryUseCase.execute('category-1', 'user-123');

    expect(result).toBe(true);
    expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(
      'category-1',
      'user-123'
    );
  });

  test('should return false when category not found', async () => {
    categoryRepositoryMock.delete.mockResolvedValue(false);

    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepositoryMock);
    const result = await deleteCategoryUseCase.execute('non-existent', 'user-123');

    expect(result).toBe(false);
    expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(
      'non-existent',
      'user-123'
    );
  });

  test('should pass correct id and userId to repository', async () => {
    categoryRepositoryMock.delete.mockResolvedValue(true);

    const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepositoryMock);
    await deleteCategoryUseCase.execute('specific-category-id', 'specific-user-id');

    expect(categoryRepositoryMock.delete).toHaveBeenCalledWith(
      'specific-category-id',
      'specific-user-id'
    );
  });
});
