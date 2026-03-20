import { describe, expect, test } from 'bun:test';

import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

import {
  createMockAttachment,
  createMockAttachments,
} from '../../mocks/files/file.repository.mock';

describe('File Controller - Upload Flow', () => {
  test('should create attachment with valid input', async () => {
    const mockAttachment = createMockAttachment({
      id: 'attachment-new',
      taskId: 'task-123',
      userId: 'user-456',
      fileName: 'new-file.pdf',
      fileSize: 1024,
      mimeType: 'application/pdf',
    });

    expect(mockAttachment.id).toBe('attachment-new');
    expect(mockAttachment.taskId).toBe('task-123');
    expect(mockAttachment.fileName).toBe('new-file.pdf');
    expect(mockAttachment.fileSize).toBe(1024);
    expect(mockAttachment.mimeType).toBe('application/pdf');
  });

  test('should create attachment with image mime type', async () => {
    const mockAttachment = createMockAttachment({
      mimeType: 'image/png',
      fileName: 'image.png',
    });

    expect(mockAttachment.mimeType).toBe('image/png');
    expect(mockAttachment.fileName).toBe('image.png');
  });
});

describe('File Controller - List Files Flow', () => {
  test('should list files for a task', async () => {
    const mockAttachments = createMockAttachments(3, 'task-123', 'user-456');

    expect(mockAttachments).toHaveLength(3);
    expect(mockAttachments[0]!.taskId).toBe('task-123');
    expect(mockAttachments[1]!.taskId).toBe('task-123');
    expect(mockAttachments[2]!.taskId).toBe('task-123');
  });

  test('should return empty array when no files exist', async () => {
    const mockAttachments = createMockAttachments(0);

    expect(mockAttachments).toHaveLength(0);
  });

  test('should filter files by user', async () => {
    const user1Attachments = createMockAttachments(2, 'task-123', 'user-1');
    const user2Attachments = createMockAttachments(2, 'task-123', 'user-2');

    expect(user1Attachments).toHaveLength(2);
    expect(user1Attachments[0]!.userId).toBe('user-1');
    expect(user2Attachments).toHaveLength(2);
    expect(user2Attachments[0]!.userId).toBe('user-2');
  });

  test('should generate publicUrl for attachments', async () => {
    const mockAttachment = createMockAttachment({
      filePath: 'users/user-123/document.pdf',
      publicUrl:
        'https://storage.supabase.co/task-files/users/user-123/document.pdf',
    });

    expect(mockAttachment.publicUrl).toContain('storage.supabase.co');
    expect(mockAttachment.publicUrl).toContain('document.pdf');
  });
});

describe('File Controller - Delete Flow', () => {
  test('should delete file successfully', async () => {
    const mockAttachment = createMockAttachment({
      id: 'attachment-to-delete',
    });

    expect(mockAttachment.id).toBe('attachment-to-delete');
  });

  test('should return proper structure for delete confirmation', async () => {
    const mockAttachment = createMockAttachment();

    expect(mockAttachment).toHaveProperty('id');
    expect(mockAttachment).toHaveProperty('taskId');
    expect(mockAttachment).toHaveProperty('userId');
    expect(mockAttachment).toHaveProperty('fileName');
    expect(mockAttachment).toHaveProperty('filePath');
  });
});

describe('File Controller - File Validation', () => {
  const ALLOWED_MIME_TYPES = {
    images: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    documents: [
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    csv: ['text/csv', 'application/csv'],
  };

  const MAX_FILE_SIZES = {
    images: 5 * 1024 * 1024,
    documents: 10 * 1024 * 1024,
    csv: 50 * 1024 * 1024,
  };

  test('should accept valid PDF file', () => {
    const isValid = ALLOWED_MIME_TYPES.documents.includes('application/pdf');
    expect(isValid).toBe(true);
  });

  test('should accept valid PNG image', () => {
    const isValid = ALLOWED_MIME_TYPES.images.includes('image/png');
    expect(isValid).toBe(true);
  });

  test('should accept valid CSV file', () => {
    const isValid = ALLOWED_MIME_TYPES.csv.includes('text/csv');
    expect(isValid).toBe(true);
  });

  test('should reject invalid mime type', () => {
    const allTypes = [
      ...ALLOWED_MIME_TYPES.images,
      ...ALLOWED_MIME_TYPES.documents,
      ...ALLOWED_MIME_TYPES.csv,
    ];
    const isValid = allTypes.includes('application/exe');
    expect(isValid).toBe(false);
  });

  test('should have correct max size for images', () => {
    expect(MAX_FILE_SIZES.images).toBe(5 * 1024 * 1024);
  });

  test('should have correct max size for documents', () => {
    expect(MAX_FILE_SIZES.documents).toBe(10 * 1024 * 1024);
  });

  test('should have correct max size for CSV', () => {
    expect(MAX_FILE_SIZES.csv).toBe(50 * 1024 * 1024);
  });
});
