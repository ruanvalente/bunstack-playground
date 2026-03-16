import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { db } from '@/api/infrastructure/database/config';
import { CategorySqliteRepository } from '@/api/infrastructure/repositories/sqlite/category.sqlite.repository';

describe('CategorySqliteRepository - Integration', () => {
  let categoryRepository: CategorySqliteRepository;

  beforeAll(() => {
    db.run('DROP TABLE IF EXISTS categories');
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        color TEXT NOT NULL DEFAULT '#3B82F6',
        created_at TEXT NOT NULL,
        UNIQUE(user_id, name)
      );
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id)');
  });

  beforeEach(() => {
    db.run('DELETE FROM categories');
    categoryRepository = new CategorySqliteRepository();
  });

  test('should create a new category', async () => {
    const category = await categoryRepository.create(
      'Trabalho',
      '#3B82F6',
      'user-123'
    );

    expect(category.name).toBe('Trabalho');
    expect(category.color).toBe('#3B82F6');
    expect(category.userId).toBe('user-123');
    expect(category.id).toBeDefined();
  });

  test('should create category with default color', async () => {
    const category = await categoryRepository.create('Pessoal', '#3B82F6', 'user-123');

    expect(category.color).toBe('#3B82F6');
  });

  test('should find category by id', async () => {
    const createdCategory = await categoryRepository.create(
      'Find Me',
      '#FF0000',
      'user-123'
    );
    const foundCategory = await categoryRepository.findById(
      createdCategory.id,
      'user-123'
    );

    expect(foundCategory).not.toBeNull();
    expect(foundCategory!.name).toBe('Find Me');
  });

  test('should return null when category not found by id', async () => {
    const foundCategory = await categoryRepository.findById(
      'non-existent',
      'user-123'
    );

    expect(foundCategory).toBeNull();
  });

  test('should find all categories for a user', async () => {
    await categoryRepository.create('Category 1', '#3B82F6', 'user-123');
    await categoryRepository.create('Category 2', '#10B981', 'user-123');

    const categories = await categoryRepository.findAll('user-123');

    expect(categories).toHaveLength(2);
  });

  test('should return empty array when no categories exist', async () => {
    const categories = await categoryRepository.findAll('user-123');

    expect(categories).toHaveLength(0);
  });

  test('should only return categories for specific user', async () => {
    await categoryRepository.create('User 1 Category', '#3B82F6', 'user-1');
    await categoryRepository.create('User 2 Category', '#10B981', 'user-2');

    const user1Categories = await categoryRepository.findAll('user-1');
    const user2Categories = await categoryRepository.findAll('user-2');

    expect(user1Categories).toHaveLength(1);
    expect(user1Categories[0]!.name).toBe('User 1 Category');
    expect(user2Categories).toHaveLength(1);
    expect(user2Categories[0]!.name).toBe('User 2 Category');
  });

  test('should delete category', async () => {
    const createdCategory = await categoryRepository.create(
      'To Delete',
      '#FF0000',
      'user-123'
    );

    const deleted = await categoryRepository.delete(createdCategory.id, 'user-123');

    expect(deleted).toBe(true);
  });

  test('should return false when deleting non-existent category', async () => {
    const deleted = await categoryRepository.delete('non-existent', 'user-123');

    expect(deleted).toBe(false);
  });

  test('should not delete category from another user', async () => {
    await categoryRepository.create('User 1 Category', '#3B82F6', 'user-1');

    const deleted = await categoryRepository.delete(
      'any-id',
      'user-2'
    );

    expect(deleted).toBe(false);
  });

  test('should seed default categories when user has none', async () => {
    await categoryRepository.seedDefaults('user-123');

    const categories = await categoryRepository.findAll('user-123');

    expect(categories).toHaveLength(6);
    expect(categories.map((c) => c.name)).toContain('Trabalho');
    expect(categories.map((c) => c.name)).toContain('Pessoal');
    expect(categories.map((c) => c.name)).toContain('Estudos');
    expect(categories.map((c) => c.name)).toContain('Compras');
    expect(categories.map((c) => c.name)).toContain('Saúde');
    expect(categories.map((c) => c.name)).toContain('Lazer');
  });

  test('should not seed duplicate categories', async () => {
    await categoryRepository.seedDefaults('user-123');
    await categoryRepository.seedDefaults('user-123');

    const categories = await categoryRepository.findAll('user-123');

    expect(categories).toHaveLength(6);
  });

  test('should return categories ordered by name', async () => {
    await categoryRepository.create('Zebra', '#000000', 'user-123');
    await categoryRepository.create('Apple', '#FF0000', 'user-123');
    await categoryRepository.create('Banana', '#FFFF00', 'user-123');

    const categories = await categoryRepository.findAll('user-123');

    expect(categories[0]!.name).toBe('Apple');
    expect(categories[1]!.name).toBe('Banana');
    expect(categories[2]!.name).toBe('Zebra');
  });
});
