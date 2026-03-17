import { beforeEach, describe, expect, test } from 'bun:test';

import { CreateCategoryUseCase } from '@/api/application/categories/create-category.use-case';

import { createMockCategory, CategoryRepositoryMock } from '../../mocks';

describe('CreateCategoryUseCase', () => {
  let categoryRepositoryMock: CategoryRepositoryMock;

  beforeEach(() => {
    categoryRepositoryMock = new CategoryRepositoryMock();
  });

  test('should create category successfully', async () => {
    const newCategory = createMockCategory({
      id: 'new-category-id',
      name: 'New Category',
      color: '#FF0000',
    });

    categoryRepositoryMock.create.mockResolvedValue(newCategory);

    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryMock);
    const result = await createCategoryUseCase.execute('New Category', '#FF0000', 'user-123');

    expect(result.name).toBe('New Category');
    expect(result.color).toBe('#FF0000');
    expect(categoryRepositoryMock.create).toHaveBeenCalledWith(
      'New Category',
      '#FF0000',
      'user-123'
    );
  });

  test('should create category with custom color', async () => {
    const newCategory = createMockCategory({
      name: 'Category',
      color: '#10B981',
    });

    categoryRepositoryMock.create.mockResolvedValue(newCategory);

    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryMock);
    const result = await createCategoryUseCase.execute('Category', '#10B981', 'user-123');

    expect(result.color).toBe('#10B981');
    expect(categoryRepositoryMock.create).toHaveBeenCalledWith(
      'Category',
      '#10B981',
      'user-123'
    );
  });

  test('should pass correct userId to repository', async () => {
    const newCategory = createMockCategory({
      userId: 'specific-user',
    });

    categoryRepositoryMock.create.mockResolvedValue(newCategory);

    const createCategoryUseCase = new CreateCategoryUseCase(categoryRepositoryMock);
    await createCategoryUseCase.execute('Category', '#3B82F6', 'specific-user');

    expect(categoryRepositoryMock.create).toHaveBeenCalledWith(
      'Category',
      '#3B82F6',
      'specific-user'
    );
  });
});
