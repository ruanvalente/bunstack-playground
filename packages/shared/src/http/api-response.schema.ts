import { z } from 'zod';

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  });

export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const paginatedMetaSchema = z.object({
  sortBy: z.string(),
  sortOrder: z.string(),
  timestamp: z.string().datetime(),
});

export type PaginatedMeta = z.infer<typeof paginatedMetaSchema>;

export type PaginationInfo = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    data: z.array(dataSchema),
    pagination: z.object({
      total: z.number().int().min(0),
      page: z.number().int().min(1),
      pageSize: z.number().int().min(1),
      totalPages: z.number().int().min(0),
      hasNextPage: z.boolean(),
      hasPrevPage: z.boolean(),
    }),
    meta: paginatedMetaSchema,
  });

export type PaginatedResponse<T> = {
  data: T[];
  pagination: PaginationInfo;
  meta: PaginatedMeta;
};
