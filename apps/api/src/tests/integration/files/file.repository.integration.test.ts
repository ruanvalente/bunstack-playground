import { beforeAll, beforeEach, describe, expect, test } from 'bun:test';

import { db } from '@/api/infrastructure/database/config';
import { FileSqliteRepository } from '@/api/infrastructure/repositories/sqlite/file.sqlite.repository';

describe('FileSqliteRepository - Integration', () => {
  let fileRepository: FileSqliteRepository;

  beforeAll(() => {
    db.run('DROP TABLE IF EXISTS task_attachments');
    db.run(`
      CREATE TABLE IF NOT EXISTS task_attachments (
        id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        mime_type TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
    `);
    db.run(
      'CREATE INDEX IF NOT EXISTS idx_task_attachments_task_id ON task_attachments(task_id)'
    );
    db.run(
      'CREATE INDEX IF NOT EXISTS idx_task_attachments_user_id ON task_attachments(user_id)'
    );
  });

  beforeEach(() => {
    db.run('DELETE FROM task_attachments');
    fileRepository = new FileSqliteRepository();
  });

  test('should create a new attachment', async () => {
    const attachment = await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'document.pdf',
      filePath: 'users/user-456/document.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    expect(attachment.id).toBeDefined();
    expect(attachment.taskId).toBe('task-123');
    expect(attachment.userId).toBe('user-456');
    expect(attachment.fileName).toBe('document.pdf');
    expect(attachment.filePath).toBe('users/user-456/document.pdf');
    expect(attachment.fileSize).toBe(1024);
    expect(attachment.mimeType).toBe('application/pdf');
    expect(attachment.createdAt).toBeDefined();
  });

  test('should find attachment by id', async () => {
    const created = await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'find-me.pdf',
      filePath: 'users/user-456/find-me.pdf',
      fileSize: 2048,
      mimeType: 'application/pdf',
    });

    const found = await fileRepository.findById(created.id, 'user-456');

    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
    expect(found!.fileName).toBe('find-me.pdf');
  });

  test('should return null when attachment not found by id', async () => {
    const found = await fileRepository.findById('non-existent', 'user-456');

    expect(found).toBeNull();
  });

  test('should return null when finding attachment with wrong userId', async () => {
    const created = await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'secret.pdf',
      filePath: 'users/user-456/secret.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const found = await fileRepository.findById(created.id, 'other-user');

    expect(found).toBeNull();
  });

  test('should find all attachments for a task', async () => {
    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'file1.pdf',
      filePath: 'users/user-456/file1.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });
    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'file2.pdf',
      filePath: 'users/user-456/file2.pdf',
      fileSize: 2048,
      mimeType: 'application/pdf',
    });

    const attachments = await fileRepository.findByTaskId(
      'task-123',
      'user-456'
    );

    expect(attachments).toHaveLength(2);
  });

  test('should return empty array when no attachments exist for task', async () => {
    const attachments = await fileRepository.findByTaskId(
      'task-123',
      'user-456'
    );

    expect(attachments).toHaveLength(0);
  });

  test('should only return attachments for specific task', async () => {
    await fileRepository.create({
      taskId: 'task-1',
      userId: 'user-456',
      fileName: 'task1-file.pdf',
      filePath: 'users/user-456/task1-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });
    await fileRepository.create({
      taskId: 'task-2',
      userId: 'user-456',
      fileName: 'task2-file.pdf',
      filePath: 'users/user-456/task2-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const task1Attachments = await fileRepository.findByTaskId(
      'task-1',
      'user-456'
    );
    const task2Attachments = await fileRepository.findByTaskId(
      'task-2',
      'user-456'
    );

    expect(task1Attachments).toHaveLength(1);
    expect(task1Attachments[0]!.fileName).toBe('task1-file.pdf');
    expect(task2Attachments).toHaveLength(1);
    expect(task2Attachments[0]!.fileName).toBe('task2-file.pdf');
  });

  test('should only return attachments for specific user', async () => {
    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-1',
      fileName: 'user1-file.pdf',
      filePath: 'users/user-1/user1-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });
    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-2',
      fileName: 'user2-file.pdf',
      filePath: 'users/user-2/user2-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const user1Attachments = await fileRepository.findByTaskId(
      'task-123',
      'user-1'
    );
    const user2Attachments = await fileRepository.findByTaskId(
      'task-123',
      'user-2'
    );

    expect(user1Attachments).toHaveLength(1);
    expect(user1Attachments[0]!.fileName).toBe('user1-file.pdf');
    expect(user2Attachments).toHaveLength(1);
    expect(user2Attachments[0]!.fileName).toBe('user2-file.pdf');
  });

  test('should delete attachment', async () => {
    const created = await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'to-delete.pdf',
      filePath: 'users/user-456/to-delete.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const deleted = await fileRepository.delete(created.id, 'user-456');

    expect(deleted).toBe(true);
    const found = await fileRepository.findById(created.id, 'user-456');
    expect(found).toBeNull();
  });

  test('should return false when deleting non-existent attachment', async () => {
    const deleted = await fileRepository.delete('non-existent', 'user-456');

    expect(deleted).toBe(false);
  });

  test('should not delete attachment from another user', async () => {
    const created = await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'secret.pdf',
      filePath: 'users/user-456/secret.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const deleted = await fileRepository.delete(created.id, 'other-user');

    expect(deleted).toBe(false);
    const found = await fileRepository.findById(created.id, 'user-456');
    expect(found).not.toBeNull();
  });

  test('should return attachments ordered by created_at DESC', async () => {
    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'first.pdf',
      filePath: 'users/user-456/first.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    await fileRepository.create({
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'second.pdf',
      filePath: 'users/user-456/second.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    const attachments = await fileRepository.findByTaskId(
      'task-123',
      'user-456'
    );

    expect(attachments[0]!.fileName).toBe('second.pdf');
    expect(attachments[1]!.fileName).toBe('first.pdf');
  });
});
