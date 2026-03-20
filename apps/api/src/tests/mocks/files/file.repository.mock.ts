import { mock } from 'bun:test';

import type { TaskAttachmentDTO } from '@bunstack-playground/shared/http';

type StorageUploadParams = (
  userId: string,
  fileName: string,
  fileBuffer: Buffer,
  mimeType: string
) => Promise<{ path: string; url: string }>;

type StorageDeleteParams = (filePath: string) => Promise<void>;

type StorageGetUrlParams = (filePath: string) => Promise<string>;

const DEFAULT_ATTACHMENT = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  taskId: '123e4567-e89b-12d3-a456-426614174001',
  userId: 'user-123',
  fileName: 'test.pdf',
  filePath: 'users/user-123/123e4567-e89b-12d3-a456-426614174000-test.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  createdAt: new Date().toISOString(),
  publicUrl: 'https://storage.supabase.co/task-files/users/user-123/test.pdf',
};

export class StorageClientMock {
  uploadFile = mock<StorageUploadParams>(async (userId, fileName) => ({
    path: `users/${userId}/${crypto.randomUUID()}-${fileName}`,
    url: `https://storage.supabase.co/task-files/users/${userId}/${fileName}`,
  }));

  deleteFile = mock<StorageDeleteParams>(async () => {});

  getFileUrl = mock<StorageGetUrlParams>(
    async (filePath) => `https://storage.supabase.co/task-files/${filePath}`
  );
}

export type MockAttachmentOverrides = Partial<TaskAttachmentDTO> &
  Partial<Pick<TaskAttachmentDTO, 'id'>>;

export const createMockAttachment = (
  overrides?: MockAttachmentOverrides
): TaskAttachmentDTO => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  taskId: '123e4567-e89b-12d3-a456-426614174001',
  userId: 'user-123',
  fileName: 'test.pdf',
  filePath: 'users/user-123/123e4567-e89b-12d3-a456-426614174000-test.pdf',
  fileSize: 1024,
  mimeType: 'application/pdf',
  createdAt: new Date().toISOString(),
  publicUrl: 'https://storage.supabase.co/task-files/users/user-123/test.pdf',
  ...overrides,
});

export const createMockAttachments = (
  count: number,
  taskId: string = '123e4567-e89b-12d3-a456-426614174001',
  userId: string = 'user-123'
): TaskAttachmentDTO[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockAttachment({
      id: `attachment-${i + 1}`,
      taskId,
      userId,
      fileName: `file-${i + 1}.pdf`,
    })
  );
};

export type CsvValidationError = {
  row: number;
  message: string;
  data?: Record<string, string>;
};

export type MockCsvPreview = {
  totalRows: number;
  validRows: number;
  toCreate: number;
  toUpdate: number;
  errors: CsvValidationError[];
  sampleData: Array<{
    title: string;
    completed: boolean;
    categoryName?: string;
  }>;
};

export const createMockCsvPreview = (
  overrides?: Partial<MockCsvPreview>
): MockCsvPreview => ({
  totalRows: 10,
  validRows: 10,
  toCreate: 10,
  toUpdate: 0,
  errors: [],
  sampleData: [
    { title: 'Task 1', completed: false, categoryName: 'Trabalho' },
    { title: 'Task 2', completed: true, categoryName: 'Pessoal' },
  ],
  ...overrides,
});

export type MockCsvImportResult = {
  success: number;
  errors: CsvValidationError[];
};

export const createMockCsvImportResult = (
  overrides?: Partial<MockCsvImportResult>
): MockCsvImportResult => ({
  success: 10,
  errors: [],
  ...overrides,
});
