import { beforeEach, describe, expect, test } from 'bun:test';

import { ListCategoriesUseCase } from '@/api/application/categories/list-categories.use-case';

import { createMockCategory, CategoryRepositoryMock } from '../../mocks';

describe('ListCategoriesUseCase', () => {
  let categoryRepositoryMock: CategoryRepositoryMock;

  beforeEach(() => {
    categoryRepositoryMock = new CategoryRepositoryMock();
  });

  test('should list categories calling seedDefaults first', async () => {
    const categories = [
      createMockCategory({ id: 'cat-1', name: 'Trabalho' }),
      createMockCategory({ id: 'cat-2', name: 'Pessoal' }),
    ];

    categoryRepositoryMock.findAll.mockResolvedValue(categories);

    const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepositoryMock);
    const result = await listCategoriesUseCase.execute('user-123');

    expect(result).toHaveLength(2);
    expect(categoryRepositoryMock.seedDefaults).toHaveBeenCalledWith('user-123');
    expect(categoryRepositoryMock.findAll).toHaveBeenCalledWith('user-123');
  });

  test('should return empty list when user has no categories', async () => {
    categoryRepositoryMock.findAll.mockResolvedValue([]);

    const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepositoryMock);
    const result = await listCategoriesUseCase.execute('user-123');

    expect(result).toHaveLength(0);
    expect(categoryRepositoryMock.seedDefaults).toHaveBeenCalled();
    expect(categoryRepositoryMock.findAll).toHaveBeenCalled();
  });

  test('should pass correct userId to repository methods', async () => {
    categoryRepositoryMock.findAll.mockResolvedValue([]);

    const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepositoryMock);
    await listCategoriesUseCase.execute('specific-user-id');

    expect(categoryRepositoryMock.seedDefaults).toHaveBeenCalledWith('specific-user-id');
    expect(categoryRepositoryMock.findAll).toHaveBeenCalledWith('specific-user-id');
  });

  test('should return seeded default categories', async () => {
    const defaultCategories = [
      createMockCategory({ name: 'Trabalho' }),
      createMockCategory({ name: 'Pessoal' }),
      createMockCategory({ name: 'Estudos' }),
      createMockCategory({ name: 'Compras' }),
      createMockCategory({ name: 'Saúde' }),
      createMockCategory({ name: 'Lazer' }),
    ];

    categoryRepositoryMock.findAll.mockResolvedValue(defaultCategories);

    const listCategoriesUseCase = new ListCategoriesUseCase(categoryRepositoryMock);
    const result = await listCategoriesUseCase.execute('user-123');

    expect(result).toHaveLength(6);
  });
});
