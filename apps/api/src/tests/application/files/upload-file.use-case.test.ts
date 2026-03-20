import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

import {
  uploadFile,
  type UploadFileInput,
} from '@/api/application/files/upload-file.use-case';

const mockUploadFileToStorage =
  mock<
    (
      userId: string,
      fileName: string,
      fileBuffer: Buffer,
      mimeType: string
    ) => Promise<{ path: string; url: string }>
  >();

const mockSupabaseAdminFrom = mock<
  (table: string) => {
    insert: (data: any) => {
      select: () => {
        single: () => Promise<{ data: any; error: any }>;
      };
    };
  }
>();

mock.module('@/api/infrastructure/storage/supabase.storage.client', () => ({
  uploadFile: mockUploadFileToStorage,
}));

mock.module('@/api/infrastructure/supabase', () => ({
  supabaseAdmin: {
    from: mockSupabaseAdminFrom,
  },
}));

describe('uploadFile Use Case', () => {
  const mockAttachmentData = {
    id: 'attachment-id-123',
    task_id: 'task-id-456',
    user_id: 'user-789',
    file_name: 'test.pdf',
    file_path: 'users/user-789/test.pdf',
    file_size: 1024,
    mime_type: 'application/pdf',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockUploadFileToStorage.mockResolvedValue({
      path: 'users/user-789/test.pdf',
      url: 'https://storage.supabase.co/task-files/users/user-789/test.pdf',
    });

    mockSupabaseAdminFrom.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({ data: mockAttachmentData, error: null }),
        }),
      }),
    } as any);
  });

  afterEach(() => {
    mockUploadFileToStorage.mockClear();
    mockSupabaseAdminFrom.mockClear();
  });

  test('should upload file successfully and return TaskAttachmentDTO', async () => {
    const input: UploadFileInput = {
      userId: 'user-789',
      taskId: 'task-id-456',
      fileName: 'test.pdf',
      fileBuffer: Buffer.from('test content'),
      mimeType: 'application/pdf',
      fileSize: 1024,
    };

    const result = await uploadFile(input);

    expect(result.id).toBe(mockAttachmentData.id);
    expect(result.taskId).toBe(mockAttachmentData.task_id);
    expect(result.userId).toBe(mockAttachmentData.user_id);
    expect(result.fileName).toBe(mockAttachmentData.file_name);
    expect(result.filePath).toBe(mockAttachmentData.file_path);
    expect(result.fileSize).toBe(mockAttachmentData.file_size);
    expect(result.mimeType).toBe(mockAttachmentData.mime_type);
    expect(result.publicUrl).toBe(
      'https://storage.supabase.co/task-files/users/user-789/test.pdf'
    );

    expect(mockUploadFileToStorage).toHaveBeenCalledWith(
      'user-789',
      'test.pdf',
      Buffer.from('test content'),
      'application/pdf'
    );

    expect(mockSupabaseAdminFrom).toHaveBeenCalledWith('task_attachments');
  });

  test('should throw error when storage upload fails', async () => {
    mockUploadFileToStorage.mockRejectedValue(
      new Error('Failed to upload file: Storage error')
    );

    const input: UploadFileInput = {
      userId: 'user-789',
      taskId: 'task-id-456',
      fileName: 'test.pdf',
      fileBuffer: Buffer.from('test content'),
      mimeType: 'application/pdf',
      fileSize: 1024,
    };

    await expect(uploadFile(input)).rejects.toThrow(
      'Failed to upload file: Storage error'
    );
  });

  test('should throw error when database insert fails', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      insert: () => ({
        select: () => ({
          single: () =>
            Promise.resolve({
              data: null,
              error: { message: 'Database insert error' },
            }),
        }),
      }),
    } as any);

    const input: UploadFileInput = {
      userId: 'user-789',
      taskId: 'task-id-456',
      fileName: 'test.pdf',
      fileBuffer: Buffer.from('test content'),
      mimeType: 'application/pdf',
      fileSize: 1024,
    };

    await expect(uploadFile(input)).rejects.toThrow(
      'Failed to create attachment record: Database insert error'
    );
  });
});
