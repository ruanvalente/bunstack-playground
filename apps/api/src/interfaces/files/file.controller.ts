import { Elysia } from 'elysia';

import {
  uploadFile,
  deleteFile,
  listFiles,
  parseCsvPreview,
  executeCsvImport,
} from '@/api/application/files';
import { AppError, HttpStatus, UnauthorizedError } from '@/api/domain/erros';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';
import { API_VERSION } from '@bunstack-playground/shared';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES,
} from '@bunstack-playground/shared/http';

interface UploadBody {
  file: {
    name: string;
    size: number;
    type: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
  };
  taskId: string;
}

interface CsvBody {
  file: {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
  };
}

async function authenticateUser(
  headers: Record<string, unknown>
): Promise<string> {
  const authHeader = headers.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: user, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user?.user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  return user.user.id;
}

function validateFileType(mimeType: string): boolean {
  const allAllowedTypes: string[] = [
    ...ALLOWED_MIME_TYPES.images,
    ...ALLOWED_MIME_TYPES.documents,
    ...ALLOWED_MIME_TYPES.csv,
  ];
  return allAllowedTypes.includes(mimeType);
}

function getMaxFileSize(mimeType: string): number {
  if (ALLOWED_MIME_TYPES.images.includes(mimeType as any)) {
    return MAX_FILE_SIZES.images;
  }
  if (ALLOWED_MIME_TYPES.csv.includes(mimeType as any)) {
    return MAX_FILE_SIZES.csv;
  }
  return MAX_FILE_SIZES.documents;
}

export const fileController = new Elysia({
  prefix: `api/${API_VERSION}/files`,
})

  .post('/upload', async ({ body, set, headers }) => {
    try {
      const userId = await authenticateUser(headers);
      const typedBody = body as unknown as UploadBody;

      const file = typedBody.file;
      const taskId = typedBody.taskId;

      if (!file?.name || !file?.size || !file?.type) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'Invalid file format' };
      }

      if (!validateFileType(file.type)) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'File type not allowed' };
      }

      const maxSize = getMaxFileSize(file.type);
      if (file.size > maxSize) {
        set.status = HttpStatus.BAD_REQUEST;
        return {
          message: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB`,
        };
      }

      if (!taskId) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'taskId is required' };
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const attachment = await uploadFile({
        userId,
        taskId,
        fileName: file.name,
        fileBuffer,
        mimeType: file.type,
        fileSize: file.size,
      });

      set.status = HttpStatus.CREATED;
      return attachment;
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      console.error('Upload error:', error);
      return { message: 'Internal server error' };
    }
  })

  .get('/task/:taskId', async ({ params, set, headers }) => {
    try {
      const userId = await authenticateUser(headers);
      const files = await listFiles({
        taskId: params.taskId,
        userId,
      });
      return files;
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return { message: 'Internal server error' };
    }
  })

  .delete('/:id', async ({ params, set, headers }) => {
    try {
      const userId = await authenticateUser(headers);
      await deleteFile({
        id: params.id,
        userId,
      });
      set.status = HttpStatus.NO_CONTENT;
      return null;
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      return { message: 'Internal server error' };
    }
  });

export const csvController = new Elysia({
  prefix: `api/${API_VERSION}/tasks`,
})

  .post('/import-csv', async ({ body, set, headers }) => {
    try {
      const userId = await authenticateUser(headers);
      const typedBody = body as unknown as CsvBody;

      const file = typedBody.file;

      if (!file?.name) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'Invalid file format' };
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'File must be a CSV' };
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      if (buffer.length > MAX_FILE_SIZES.csv) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'CSV file too large. Maximum size is 50MB' };
      }

      const preview = await parseCsvPreview(buffer, file.name);
      return preview;
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      console.error('CSV preview error:', error);
      return { message: 'Internal server error' };
    }
  })

  .post('/import-csv/confirm', async ({ body, set, headers }) => {
    try {
      const userId = await authenticateUser(headers);
      const typedBody = body as unknown as CsvBody;

      const file = typedBody.file;

      if (!file?.name) {
        set.status = HttpStatus.BAD_REQUEST;
        return { message: 'Invalid file format' };
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await executeCsvImport(buffer, userId);

      return {
        success: result.success,
        errors: result.errors,
      };
    } catch (error) {
      if (error instanceof AppError) {
        set.status = error.statusCode;
        return { message: error.message };
      }
      set.status = HttpStatus.INTERNAL_SERVER_ERROR;
      console.error('CSV import error:', error);
      return { message: 'Internal server error' };
    }
  });
