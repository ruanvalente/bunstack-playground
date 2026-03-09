import { z } from 'zod';

export const userRoleSchema = z.enum(['ADMIN', 'USER']);

export const userStatusSchema = z.enum(['active', 'inactive']);

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  role: userRoleSchema,
  status: userStatusSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime().optional(),
});

export const userSchemaWithDate = userSchema.transform((data) => ({
  ...data,
  createdAt: new Date(data.createdAt).toISOString(),
  updatedAt: data.updatedAt
    ? new Date(data.updatedAt).toISOString()
    : undefined,
}));

const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(10, 'Password must be at most 10 characters')
  .refine((password) => /[a-zA-Z]/.test(password), {
    message: 'Password must contain at least one letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: 'Password must contain at least one special character',
  });

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordValidation,
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  role: userRoleSchema.default('USER'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
});

export const updateUserByAdminSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
});

export const editUserFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['ADMIN', 'USER']),
  status: z.enum(['active', 'inactive']),
});

export const deleteUserSchema = z.object({
  id: z.string().uuid(),
});

export const getUserSchema = z.object({
  id: z.string().uuid(),
});

export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type User = z.infer<typeof userSchema>;
export type UserWithDate = z.infer<typeof userSchemaWithDate>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UpdateUserByAdminDTO = z.infer<typeof updateUserByAdminSchema>;
export type EditUserFormData = z.infer<typeof editUserFormSchema>;
export type DeleteUserDTO = z.infer<typeof deleteUserSchema>;
export type GetUserDTO = z.infer<typeof getUserSchema>;

export const paginatedUsersResponseSchema = z.object({
  data: z.array(userSchema),
  pagination: z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1),
    totalPages: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  }),
  meta: z.object({
    sortBy: z.string(),
    sortOrder: z.string(),
    timestamp: z.iso.datetime(),
  }),
});

export type PaginatedUsersResponseDTO = z.infer<
  typeof paginatedUsersResponseSchema
>;
