import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import type { PaginationQueryDTO } from '@bunstack-playground/shared';

import { TaskSqliteRepository } from '@/api/infrastructure/repositories/sqlite/task.sqlite.repository';

import {
  clearTasksTable,
  seedTask,
  setupTasksTable,
} from '../../utils/task.seed';

const DEFAULT_QUERY: PaginationQueryDTO = {
  page: 1,
  pageSize: 10,
  sortOrder: 'DESC',
  sortBy: 'created_at',
};

describe('TaskSqliteRepository - Integration', () => {
  let taskRepository: TaskSqliteRepository;
  const userId = 'test-user-123';
  const otherUserId = 'other-user-456';

  beforeAll(() => {
    setupTasksTable();
  });

  beforeEach(() => {
    clearTasksTable();
    taskRepository = new TaskSqliteRepository();
  });

  describe('create', () => {
    test('should create a new task with all required fields', async () => {
      const task = await taskRepository.create('Test Task', userId);

      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.userId).toBe(userId);
      expect(task.completed).toBe(false);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    test('should create task with category when provided', async () => {
      const categoryId = 'category-123';
      const task = await taskRepository.create('Test Task', userId, categoryId);

      expect(task.categoryId).toBe(categoryId);
    });

    test('should create task without category when not provided', async () => {
      const task = await taskRepository.create('Test Task', userId);

      expect(task.categoryId).toBeUndefined();
    });
  });

  describe('findById', () => {
    test('should find task by id when it exists', async () => {
      const seeded = seedTask({ title: 'Find Me', completed: false, userId });
      const task = await taskRepository.findById(seeded.id, userId);

      expect(task).not.toBeNull();
      expect(task!.title).toBe('Find Me');
    });

    test('should return null for non-existent task id', async () => {
      const task = await taskRepository.findById('non-existent-id', userId);

      expect(task).toBeNull();
    });

    test('should return null when task belongs to different user', async () => {
      const seeded = seedTask({
        title: 'Other User Task',
        completed: false,
        userId,
      });
      const task = await taskRepository.findById(seeded.id, otherUserId);

      expect(task).toBeNull();
    });
  });

  describe('findAll', () => {
    test('should return empty list and pagination when no tasks exist', async () => {
      const result = await taskRepository.findAll(DEFAULT_QUERY, userId);

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    test('should return paginated tasks with correct metadata', async () => {
      for (let i = 0; i < 15; i++) {
        seedTask({ title: `Task ${i}`, completed: false, userId });
      }

      const result = await taskRepository.findAll(
        { ...DEFAULT_QUERY, page: 1, pageSize: 10 },
        userId
      );

      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.totalPages).toBe(2);
      expect(result.pagination.hasNextPage).toBe(true);
      expect(result.pagination.hasPrevPage).toBe(false);
    });

    test('should filter by status completed', async () => {
      seedTask({ title: 'Completed 1', completed: true, userId });
      seedTask({ title: 'Completed 2', completed: true, userId });
      seedTask({ title: 'Pending', completed: false, userId });

      const result = await taskRepository.findAll(
        { ...DEFAULT_QUERY, statusFilter: 'completed' },
        userId
      );

      expect(result.data).toHaveLength(2);
      expect(result.data.every((t) => t.completed === true)).toBe(true);
    });

    test('should filter by status pending', async () => {
      seedTask({ title: 'Completed', completed: true, userId });
      seedTask({ title: 'Pending 1', completed: false, userId });
      seedTask({ title: 'Pending 2', completed: false, userId });

      const result = await taskRepository.findAll(
        { ...DEFAULT_QUERY, statusFilter: 'pending' },
        userId
      );

      expect(result.data).toHaveLength(2);
      expect(result.data.every((t) => t.completed === false)).toBe(true);
    });

    test('should sort by created_at DESC', async () => {
      const now = new Date().toISOString();
      seedTask({
        title: 'First',
        completed: false,
        userId,
        createdAt: new Date(Date.now() - 2000).toISOString(),
      });
      seedTask({ title: 'Second', completed: false, userId, createdAt: now });

      const result = await taskRepository.findAll(DEFAULT_QUERY, userId);

      expect(result.data[0]!.title).toBe('Second');
      expect(result.data[1]!.title).toBe('First');
    });

    test('should sort by created_at ASC', async () => {
      const now = new Date().toISOString();
      seedTask({
        title: 'First',
        completed: false,
        userId,
        createdAt: new Date(Date.now() - 2000).toISOString(),
      });
      seedTask({ title: 'Second', completed: false, userId, createdAt: now });

      const result = await taskRepository.findAll(
        { ...DEFAULT_QUERY, sortOrder: 'ASC' },
        userId
      );

      expect(result.data[0]!.title).toBe('First');
      expect(result.data[1]!.title).toBe('Second');
    });

    test('should isolate data between users', async () => {
      seedTask({ title: 'User 1 Task', completed: false, userId });
      seedTask({ title: 'User 2 Task', completed: false, userId: otherUserId });

      const user1Result = await taskRepository.findAll(DEFAULT_QUERY, userId);
      const user2Result = await taskRepository.findAll(
        DEFAULT_QUERY,
        otherUserId
      );

      expect(user1Result.data).toHaveLength(1);
      expect(user2Result.data).toHaveLength(1);
      expect(user1Result.data[0]!.title).toBe('User 1 Task');
      expect(user2Result.data[0]!.title).toBe('User 2 Task');
    });
  });

  describe('updateTitle', () => {
    test('should update task title successfully', async () => {
      const seeded = seedTask({ title: 'Original', completed: false, userId });
      const updated = await taskRepository.updateTitle(
        seeded.id,
        'Updated Title',
        userId
      );

      expect(updated).not.toBeNull();
      expect(updated!.title).toBe('Updated Title');
    });

    test('should update task category', async () => {
      const seeded = seedTask({ title: 'Test', completed: false, userId });
      const categoryId = 'new-category-123';
      const updated = await taskRepository.updateTitle(
        seeded.id,
        seeded.title,
        userId,
        categoryId
      );

      expect(updated!.categoryId).toBe(categoryId);
    });

    test('should return null when task does not exist', async () => {
      const updated = await taskRepository.updateTitle(
        'non-existent-id',
        'New Title',
        userId
      );

      expect(updated).toBeNull();
    });

    test('should return null when updating other user task', async () => {
      const seeded = seedTask({ title: 'Original', completed: false, userId });
      const updated = await taskRepository.updateTitle(
        seeded.id,
        'Hacked Title',
        otherUserId
      );

      expect(updated).toBeNull();
    });
  });

  describe('complete', () => {
    test.each([true, false] as const)(
      'should mark task as $completed',
      async (completed) => {
        const seeded = seedTask({
          title: 'To Toggle',
          completed: !completed,
          userId,
        });
        const result = await taskRepository.complete(
          seeded.id,
          completed,
          userId
        );

        expect(result).not.toBeNull();
        expect(result!.completed).toBe(completed);
      }
    );

    test('should return null when task does not exist', async () => {
      const result = await taskRepository.complete(
        'non-existent-id',
        true,
        userId
      );

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    test('should delete task and verify removal', async () => {
      const seeded = seedTask({ title: 'To Delete', completed: false, userId });
      const deleted = await taskRepository.delete(seeded.id, userId);

      expect(deleted).toBe(true);
      expect(await taskRepository.findById(seeded.id, userId)).toBeNull();
    });

    test('should return false when task does not exist', async () => {
      const deleted = await taskRepository.delete('non-existent-id', userId);

      expect(deleted).toBe(false);
    });

    test('should return false when deleting other user task and preserve original', async () => {
      const seeded = seedTask({
        title: 'Other User Task',
        completed: false,
        userId,
      });
      const deleted = await taskRepository.delete(seeded.id, otherUserId);

      expect(deleted).toBe(false);
      expect(await taskRepository.findById(seeded.id, userId)).not.toBeNull();
    });
  });
});
