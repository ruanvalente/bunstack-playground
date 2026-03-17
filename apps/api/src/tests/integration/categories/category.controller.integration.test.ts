import { beforeEach, describe, expect, mock, test } from 'bun:test';

import type { Category } from '@bunstack-playground/shared';

import type { ICategoryRepository } from '@/api/domain/repositories';

class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Map<string, Category> = new Map();

  findAll = mock<(userId: string) => Promise<Category[]>>(async (userId) => {
    return Array.from(this.categories.values()).filter(
      (c) => c.userId === userId
    );
  });

  findById = mock<(id: string, userId: string) => Promise<Category | null>>(
    async (id, userId) => {
      const category = this.categories.get(id);
      if (!category || category.userId !== userId) return null;
      return category;
    }
  );

  create = mock<
    (name: string, color: string, userId: string) => Promise<Category>
  >(async (name, color, userId) => {
    const category: Category = {
      id: crypto.randomUUID(),
      userId,
      name,
      color,
      createdAt: new Date().toISOString(),
    };
    this.categories.set(category.id, category);
    return category;
  });

  delete = mock<(id: string, userId: string) => Promise<boolean>>(
    async (id, userId) => {
      const category = this.categories.get(id);
      if (!category || category.userId !== userId) return false;
      return this.categories.delete(id);
    }
  );

  seedDefaults = mock<(userId: string) => Promise<void>>(async (userId) => {
    const defaults = [
      { name: 'Trabalho', color: '#3B82F6' },
      { name: 'Pessoal', color: '#10B981' },
      { name: 'Estudos', color: '#8B5CF6' },
      { name: 'Compras', color: '#F59E0B' },
      { name: 'Saúde', color: '#EF4444' },
      { name: 'Lazer', color: '#EC4899' },
    ];

    for (const cat of defaults) {
      const category: Category = {
        id: crypto.randomUUID(),
        userId,
        name: cat.name,
        color: cat.color,
        createdAt: new Date().toISOString(),
      };
      this.categories.set(category.id, category);
    }
  });

  clear(): void {
    this.categories.clear();
  }
}

describe('Category Controller - List Categories Flow', () => {
  test('should list categories for user', async () => {
    const repository = new InMemoryCategoryRepository();
    await repository.create('Trabalho', '#3B82F6', 'user-123');
    await repository.create('Pessoal', '#10B981', 'user-123');

    const categories = await repository.findAll('user-123');

    expect(categories).toHaveLength(2);
  });

  test('should return empty list when user has no categories', async () => {
    const repository = new InMemoryCategoryRepository();

    const categories = await repository.findAll('user-123');

    expect(categories).toHaveLength(0);
  });

  test('should only return categories for specific user', async () => {
    const repository = new InMemoryCategoryRepository();
    await repository.create('User 1 Cat', '#3B82F6', 'user-1');
    await repository.create('User 2 Cat', '#10B981', 'user-2');

    const user1Categories = await repository.findAll('user-1');
    const user2Categories = await repository.findAll('user-2');

    expect(user1Categories).toHaveLength(1);
    expect(user2Categories).toHaveLength(1);
  });

  test('should seed defaults before listing categories', async () => {
    const repository = new InMemoryCategoryRepository();

    await repository.seedDefaults('user-123');
    const categories = await repository.findAll('user-123');

    expect(categories).toHaveLength(6);
  });
});

describe('Category Controller - Create Category Flow', () => {
  test('should create category successfully', async () => {
    const repository = new InMemoryCategoryRepository();

    const category = await repository.create(
      'New Category',
      '#FF0000',
      'user-123'
    );

    expect(category.name).toBe('New Category');
    expect(category.color).toBe('#FF0000');
    expect(category.userId).toBe('user-123');
    expect(category.id).toBeDefined();
  });

  test('should create category with default color', async () => {
    const repository = new InMemoryCategoryRepository();

    const category = await repository.create('Category', '#3B82F6', 'user-123');

    expect(category.color).toBe('#3B82F6');
  });
});

describe('Category Controller - Delete Category Flow', () => {
  test('should delete category successfully', async () => {
    const repository = new InMemoryCategoryRepository();
    const category = await repository.create('To Delete', '#FF0000', 'user-123');

    const deleted = await repository.delete(category.id, 'user-123');

    expect(deleted).toBe(true);
    const found = await repository.findById(category.id, 'user-123');
    expect(found).toBeNull();
  });

  test('should return false when category not found', async () => {
    const repository = new InMemoryCategoryRepository();

    const deleted = await repository.delete('non-existent', 'user-123');

    expect(deleted).toBe(false);
  });

  test('should not delete category from another user', async () => {
    const repository = new InMemoryCategoryRepository();
    const category = await repository.create('User 1 Cat', '#3B82F6', 'user-1');

    const deleted = await repository.delete(category.id, 'user-2');

    expect(deleted).toBe(false);
    const found = await repository.findById(category.id, 'user-1');
    expect(found).not.toBeNull();
  });
});
