import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

import {
  deleteFile,
  type DeleteFileInput,
} from '@/api/application/files/delete-file.use-case';

const mockDeleteFileFromStorage = mock<(filePath: string) => Promise<void>>();

const mockSupabaseAdminFrom = mock<
  (table: string) => {
    select: (columns?: string) => {
      eq: (
        column: string,
        value: any
      ) => {
        single: () => Promise<{ data: any; error: any }>;
      };
    };
    delete: () => {
      eq: (column: string, value: any) => Promise<{ error: any }>;
    };
  }
>();

mock.module('@/api/infrastructure/storage/supabase.storage.client', () => ({
  deleteFile: mockDeleteFileFromStorage,
}));

mock.module('@/api/infrastructure/supabase', () => ({
  supabaseAdmin: {
    from: mockSupabaseAdminFrom,
  },
}));

describe('deleteFile Use Case', () => {
  beforeEach(() => {
    mockDeleteFileFromStorage.mockResolvedValue(undefined);
    mockSupabaseAdminFrom.mockClear();
  });

  afterEach(() => {
    mockDeleteFileFromStorage.mockClear();
    mockSupabaseAdminFrom.mockClear();
  });

  test('should delete file successfully and return true', async () => {
    const mockAttachment = {
      file_path: 'users/user-123/attachment-id.pdf',
      user_id: 'user-123',
    };

    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockAttachment, error: null }),
        }),
      }),
    } as any);

    mockSupabaseAdminFrom
      .mockReturnValueOnce({
        select: () => ({
          eq: () => ({
            single: () =>
              Promise.resolve({ data: mockAttachment, error: null }),
          }),
        }),
      } as any)
      .mockReturnValueOnce({
        delete: () => ({
          eq: () => Promise.resolve({ error: null }),
        }),
      } as any);

    const input: DeleteFileInput = {
      id: 'attachment-id',
      userId: 'user-123',
    };

    const result = await deleteFile(input);

    expect(result).toBe(true);
    expect(mockDeleteFileFromStorage).toHaveBeenCalledWith(
      'users/user-123/attachment-id.pdf'
    );
  });

  test('should throw error when attachment not found', async () => {
    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: null, error: { message: 'Not found' } }),
        }),
      }),
    } as any);

    const input: DeleteFileInput = {
      id: 'non-existent-id',
      userId: 'user-123',
    };

    await expect(deleteFile(input)).rejects.toThrow('Attachment not found');
  });

  test('should throw error when user is not the owner', async () => {
    const mockAttachment = {
      file_path: 'users/other-user/attachment-id.pdf',
      user_id: 'other-user',
    };

    mockSupabaseAdminFrom.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockAttachment, error: null }),
        }),
      }),
    } as any);

    const input: DeleteFileInput = {
      id: 'attachment-id',
      userId: 'user-123',
    };

    await expect(deleteFile(input)).rejects.toThrow(
      'Unauthorized to delete this file'
    );
  });

  test('should throw error when database delete fails', async () => {
    const mockAttachment = {
      file_path: 'users/user-123/attachment-id.pdf',
      user_id: 'user-123',
    };

    mockSupabaseAdminFrom.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: mockAttachment, error: null }),
        }),
      }),
    } as any);

    mockSupabaseAdminFrom.mockReturnValueOnce({
      delete: () => ({
        eq: () => Promise.resolve({ error: { message: 'Delete failed' } }),
      }),
    } as any);

    const input: DeleteFileInput = {
      id: 'attachment-id',
      userId: 'user-123',
    };

    await expect(deleteFile(input)).rejects.toThrow(
      'Failed to delete attachment record: Delete failed'
    );
  });
});
