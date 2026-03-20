import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import {
  listFiles,
  type ListFilesInput,
} from '@/api/application/files/list-files.use-case';

const mockGetFileUrl = mock<(filePath: string) => Promise<string>>();

const mockSupabaseAdminFrom = mock<
  (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: any
      ) => {
        eq: (
          column2: string,
          value2: any
        ) => {
          order: (
            column: string,
            options: { ascending: boolean }
          ) => Promise<{ data: any; error: any }>;
        };
      };
    };
  }
>();

mock.module('@/api/infrastructure/storage/supabase.storage.client', () => ({
  getFileUrl: mockGetFileUrl,
}));

mock.module('@/api/infrastructure/supabase', () => ({
  supabaseAdmin: {
    from: mockSupabaseAdminFrom,
  },
}));

describe('listFiles Use Case', () => {
  const mockAttachments = [
    {
      id: 'attachment-1',
      task_id: 'task-123',
      user_id: 'user-123',
      file_name: 'file1.pdf',
      file_path: 'users/user-123/file1.pdf',
      file_size: 1024,
      mime_type: 'application/pdf',
      created_at: new Date().toISOString(),
    },
    {
      id: 'attachment-2',
      task_id: 'task-123',
      user_id: 'user-123',
      file_name: 'file2.pdf',
      file_path: 'users/user-123/file2.pdf',
      file_size: 2048,
      mime_type: 'application/pdf',
      created_at: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    mockGetFileUrl.mockImplementation((filePath: string) =>
      Promise.resolve(`https://storage.supabase.co/task-files/${filePath}`)
    );
  });

  afterEach(() => {
    mockGetFileUrl.mockClear();
    mockSupabaseAdminFrom.mockClear();
  });

  test('should list files with publicUrl generated', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({ data: mockAttachments, error: null }),
          }),
        }),
      }),
    } as any);

    const input: ListFilesInput = {
      taskId: 'task-123',
      userId: 'user-123',
    };

    const result = await listFiles(input);

    expect(result).toHaveLength(2);
    expect(result[0]!.id).toBe('attachment-1');
    expect(result[0]!.publicUrl).toBe(
      'https://storage.supabase.co/task-files/users/user-123/file1.pdf'
    );
    expect(result[1]!.id).toBe('attachment-2');
    expect(result[1]!.publicUrl).toBe(
      'https://storage.supabase.co/task-files/users/user-123/file2.pdf'
    );

    expect(mockGetFileUrl).toHaveBeenCalledTimes(2);
  });

  test('should return empty array when no attachments exist', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    } as any);

    const input: ListFilesInput = {
      taskId: 'task-123',
      userId: 'user-123',
    };

    const result = await listFiles(input);

    expect(result).toHaveLength(0);
    expect(mockGetFileUrl).not.toHaveBeenCalled();
  });

  test('should throw error when database query fails', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({
                data: null,
                error: { message: 'Database error' },
              }),
          }),
        }),
      }),
    } as any);

    const input: ListFilesInput = {
      taskId: 'task-123',
      userId: 'user-123',
    };

    await expect(listFiles(input)).rejects.toThrow(
      'Failed to fetch attachments: Database error'
    );
  });

  test('should filter by taskId and userId', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () =>
              Promise.resolve({ data: mockAttachments, error: null }),
          }),
        }),
      }),
    } as any);

    const input: ListFilesInput = {
      taskId: 'task-456',
      userId: 'user-789',
    };

    await listFiles(input);

    expect(mockSupabaseAdminFrom).toHaveBeenCalledWith('task_attachments');
  });
});
