import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { db } from '@/api/infrastructure/database/config';
import { TaskSqliteRepository } from '@/api/infrastructure/repositories/sqlite/task.sqlite.repository';

describe('TaskSqliteRepository - Integration', () => {
  let taskRepository: TaskSqliteRepository;

  beforeAll(() => {
    db.run('DROP TABLE IF EXISTS tasks');
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        category_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id)');
  });

  beforeEach(() => {
    db.run('DELETE FROM tasks');
    taskRepository = new TaskSqliteRepository();
  });

  test('should create a new task', async () => {
    const task = await taskRepository.create('Test Task', 'user-123');

    expect(task.title).toBe('Test Task');
    expect(task.userId).toBe('user-123');
    expect(task.completed).toBe(false);
    expect(task.id).toBeDefined();
  });

  test('should create task with category', async () => {
    const categoryId = 'cat-1';
    const task = await taskRepository.create(
      'Task with Category',
      'user-123',
      categoryId
    );

    expect(task.categoryId).toBe(categoryId);
  });

  test('should find task by id', async () => {
    const createdTask = await taskRepository.create('Find Me', 'user-123');
    const foundTask = await taskRepository.findById(createdTask.id, 'user-123');

    expect(foundTask).not.toBeNull();
    expect(foundTask!.title).toBe('Find Me');
  });

  test('should return null when task not found', async () => {
    const foundTask = await taskRepository.findById('non-existent', 'user-123');

    expect(foundTask).toBeNull();
  });

  test('should find all tasks with pagination', async () => {
    await taskRepository.create('Task 1', 'user-123');
    await taskRepository.create('Task 2', 'user-123');

    const result = await taskRepository.findAll(
      { page: 1, pageSize: 10, sortBy: 'created_at', sortOrder: 'DESC' },
      'user-123'
    );

    expect(result.data).toHaveLength(2);
    expect(result.pagination.total).toBe(2);
  });

  test('should filter tasks by status', async () => {
    await taskRepository.create('Task 1', 'user-123');
    const task2 = await taskRepository.create('Task 2', 'user-123');
    await taskRepository.complete(task2.id, true, 'user-123');

    const completedResult = await taskRepository.findAll(
      {
        page: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC',
        statusFilter: 'completed',
      },
      'user-123'
    );

    expect(completedResult.data).toHaveLength(1);
    expect(completedResult.data[0]!.completed).toBe(true);

    const pendingResult = await taskRepository.findAll(
      {
        page: 1,
        pageSize: 10,
        sortBy: 'created_at',
        sortOrder: 'DESC',
        statusFilter: 'pending',
      },
      'user-123'
    );

    expect(pendingResult.data).toHaveLength(1);
    expect(pendingResult.data[0]!.completed).toBe(false);
  });

  test('should update task title', async () => {
    const createdTask = await taskRepository.create(
      'Original Title',
      'user-123'
    );

    const updatedTask = await taskRepository.updateTitle(
      createdTask.id,
      'Updated Title',
      'user-123'
    );

    expect(updatedTask).not.toBeNull();
    expect(updatedTask!.title).toBe('Updated Title');
  });

  test('should update task category', async () => {
    const createdTask = await taskRepository.create('Task', 'user-123');

    const updatedTask = await taskRepository.updateTitle(
      createdTask.id,
      'Task',
      'user-123',
      'cat-1'
    );

    expect(updatedTask!.categoryId).toBe('cat-1');
  });

  test('should return null when updating non-existent task', async () => {
    const updatedTask = await taskRepository.updateTitle(
      'non-existent',
      'New Title',
      'user-123'
    );

    expect(updatedTask).toBeNull();
  });

  test('should complete task', async () => {
    const createdTask = await taskRepository.create('Task', 'user-123');

    const completedTask = await taskRepository.complete(
      createdTask.id,
      true,
      'user-123'
    );

    expect(completedTask!.completed).toBe(true);
  });

  test('should return null when completing non-existent task', async () => {
    const completedTask = await taskRepository.complete(
      'non-existent',
      true,
      'user-123'
    );

    expect(completedTask).toBeNull();
  });

  test('should delete task', async () => {
    const createdTask = await taskRepository.create('Task', 'user-123');

    const deleted = await taskRepository.delete(createdTask.id, 'user-123');

    expect(deleted).toBe(true);
  });

  test('should return false when deleting non-existent task', async () => {
    const deleted = await taskRepository.delete('non-existent', 'user-123');

    expect(deleted).toBe(false);
  });

  test('should only return tasks for specific user', async () => {
    await taskRepository.create('User 1 Task', 'user-1');
    await taskRepository.create('User 2 Task', 'user-2');

    const user1Tasks = await taskRepository.findAll(
      { page: 1, pageSize: 10, sortBy: 'created_at', sortOrder: 'DESC' },
      'user-1'
    );

    const user2Tasks = await taskRepository.findAll(
      { page: 1, pageSize: 10, sortBy: 'created_at', sortOrder: 'DESC' },
      'user-2'
    );

    expect(user1Tasks.data).toHaveLength(1);
    expect(user1Tasks.data[0]!.title).toBe('User 1 Task');
    expect(user2Tasks.data).toHaveLength(1);
    expect(user2Tasks.data[0]!.title).toBe('User 2 Task');
  });
});
