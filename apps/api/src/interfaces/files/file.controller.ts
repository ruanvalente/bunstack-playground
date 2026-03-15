import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

import { API_VERSION } from '@bunstack-playground/shared';
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZES,
} from '@bunstack-playground/shared/http';

import {
  deleteFile,
  executeCsvImport,
  listFiles,
  parseCsvPreview,
  uploadFile,
} from '@/api/application/files';
import { AppError, HttpStatus, UnauthorizedError } from '@/api/domain/erros';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';

type UploadBody = {
  file: {
    name: string;
    size: number;
    type: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
  };
  taskId: string;
};

type CsvBody = {
  file: {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
  };
};

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

  .post(
    '/upload',
    async ({ body, set, headers }) => {
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
    },
    {
      body: t.Object({
        file: t.File(),
        taskId: t.String({ format: 'uuid' }),
      }),
      response: {
        201: t.Object({
          id: t.String({ format: 'uuid' }),
          taskId: t.String({ format: 'uuid' }),
          userId: t.String(),
          fileName: t.String(),
          filePath: t.String(),
          fileSize: t.Integer(),
          mimeType: t.String(),
          createdAt: t.String({ format: 'date-time' }),
          publicUrl: t.Optional(t.String()),
        }),
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Files'],
        summary: 'Upload file',
        description: 'Upload a file to attach to a task',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file', 'taskId'],
                properties: {
                  file: { type: 'string', format: 'binary' },
                  taskId: { type: 'string', format: 'uuid' },
                },
              },
              example: {
                taskId: '123e4567-e89b-12d3-a456-426614174000',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'File uploaded successfully',
            content: {
              'application/json': {
                example: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  taskId: '123e4567-e89b-12d3-a456-426614174000',
                  userId: '123e4567-e89b-12d3-a456-426614174000',
                  fileName: 'document.pdf',
                  filePath:
                    'attachments/123e4567-e89b-12d3-a456-426614174000/document.pdf',
                  fileSize: 1024000,
                  mimeType: 'application/pdf',
                  createdAt: '2025-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    }
  )

  .get(
    '/task/:taskId',
    async ({ params, set, headers }) => {
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
    },
    {
      params: t.Object({
        taskId: t.String({ format: 'uuid' }),
      }),
      response: {
        200: t.Array(
          t.Object({
            id: t.String({ format: 'uuid' }),
            taskId: t.String({ format: 'uuid' }),
            userId: t.String(),
            fileName: t.String(),
            filePath: t.String(),
            fileSize: t.Integer(),
            mimeType: t.String(),
            createdAt: t.String({ format: 'date-time' }),
            publicUrl: t.Optional(t.String()),
          })
        ),
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Files'],
        summary: 'List task files',
        description: 'Get all files attached to a specific task',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'taskId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Task ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          '200': {
            description: 'Files retrieved successfully',
            content: {
              'application/json': {
                example: [
                  {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    taskId: '123e4567-e89b-12d3-a456-426614174000',
                    userId: '123e4567-e89b-12d3-a456-426614174000',
                    fileName: 'document.pdf',
                    filePath: 'attachments/123/document.pdf',
                    fileSize: 1024000,
                    mimeType: 'application/pdf',
                    createdAt: '2025-01-01T00:00:00.000Z',
                  },
                ],
              },
            },
          },
        },
      },
    }
  )

  .delete(
    '/:id',
    async ({ params, set, headers }) => {
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
    },
    {
      params: t.Object({
        id: t.String({ format: 'uuid' }),
      }),
      response: {
        204: t.Null(),
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Files'],
        summary: 'Delete file',
        description: 'Delete a file attachment by ID',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'File ID to delete',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          '204': {
            description: 'File deleted successfully',
          },
        },
      },
    }
  )

  .use(openapi());

export const csvController = new Elysia({
  prefix: `api/${API_VERSION}/tasks`,
})

  .post(
    '/import-csv',
    async ({ body, set, headers }) => {
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
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      detail: {
        tags: ['Tasks', 'CSV Import'],
        summary: 'Preview CSV import',
        description: 'Preview a CSV file before importing tasks',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'CSV preview generated successfully',
            content: {
              'application/json': {
                example: {
                  totalRows: 100,
                  validRows: 95,
                  toCreate: 80,
                  toUpdate: 15,
                  errors: [
                    {
                      row: 5,
                      message: 'Title too short',
                      data: { title: 'ab' },
                    },
                  ],
                  sampleData: [
                    {
                      title: 'Tarefa exemplo 1',
                      completed: false,
                      categoryName: 'Trabalho',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    }
  )

  .post(
    '/import-csv/confirm',
    async ({ body, set, headers }) => {
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
    },
    {
      body: t.Object({
        file: t.File(),
      }),
      detail: {
        tags: ['Tasks', 'CSV Import'],
        summary: 'Confirm CSV import',
        description: 'Confirm and execute the CSV import for tasks',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'CSV imported successfully',
            content: {
              'application/json': {
                example: {
                  success: 95,
                  errors: [
                    {
                      row: 5,
                      message: 'Title too short',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    }
  )

  .use(openapi());
