import { mock } from 'bun:test';

import type { Category } from '@bunstack-playground/shared';

import type { ICategoryRepository } from '@/api/domain/repositories';

type CategoryFindAllParams = (userId: string) => Promise<Category[]>;
type CategoryFindByIdParams = (id: string, userId: string) => Promise<Category | null>;
type CategoryCreateParams = (
  name: string,
  color: string,
  userId: string
) => Promise<Category>;
type CategoryDeleteParams = (id: string, userId: string) => Promise<boolean>;
type CategorySeedDefaultsParams = (userId: string) => Promise<void>;

const DEFAULT_CATEGORY = {
  userId: 'test-user-1',
  name: 'Test Category',
  color: '#3B82F6',
  createdAt: new Date().toISOString(),
};

export class CategoryRepositoryMock implements ICategoryRepository {
  findAll = mock<CategoryFindAllParams>(async () => []);

  findById = mock<CategoryFindByIdParams>(async () => null);

  create = mock<CategoryCreateParams>(async (name, color, userId) => ({
    id: 'test-category-1',
    userId,
    name,
    color,
    createdAt: new Date().toISOString(),
  }));

  delete = mock<CategoryDeleteParams>(async () => false);

  seedDefaults = mock<CategorySeedDefaultsParams>(async () => {});

  clear(): void {
    this.findAll.mockClear();
    this.findById.mockClear();
    this.create.mockClear();
    this.delete.mockClear();
    this.seedDefaults.mockClear();
  }
}

export type MockCategoryOverrides = Partial<Omit<Category, 'id'>> &
  Partial<Pick<Category, 'id'>>;

export const createMockCategory = (
  overrides?: MockCategoryOverrides
): Category => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  ...DEFAULT_CATEGORY,
  ...overrides,
});
