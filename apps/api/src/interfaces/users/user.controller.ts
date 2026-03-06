import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

import { API_VERSION } from '@bunstack-playground/shared';
import {
  createUserSchema,
  paginatedUsersResponseSchema,
  updateUserSchema,
  userSchema,
} from '@bunstack-playground/shared/http';

import {
  CreateUserUseCase,
  DeleteUserUseCase,
  GetUserUseCase,
  ListUsersUseCase,
  UpdateUserUseCase,
} from '@/api/application/users';
import {
  AppError,
  ForbiddenError,
  HttpStatus,
  UnauthorizedError,
} from '@/api/domain/erros';
import { UserSupabaseRepository } from '@/api/infrastructure/repositories/supabase/user.supabase.repository';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';
import { supabaseAdmin } from '@/api/infrastructure/supabase/supabase.client';

const userRepository = new UserSupabaseRepository();
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserUseCase = new GetUserUseCase(userRepository);
const createUserUseCase = new CreateUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

async function authenticateUser(
  headers: Record<string, unknown>
): Promise<{ userId: string; role: string }> {
  const authHeader = headers.authorization as string | undefined;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.replace('Bearer ', '');

  const { data: user, error } = await supabaseAuth.auth.getUser(token);

  if (error || !user?.user) {
    throw new UnauthorizedError('Invalid or expired token');
  }

  const userId = user.user.id;

  const { data: userData } = await supabaseAdmin
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  const role = userData?.role || 'USER';

  if (role !== 'ADMIN') {
    throw new ForbiddenError('Access denied. Admin role required.');
  }

  return { userId, role };
}

export const userController = new Elysia({
  prefix: `api/${API_VERSION}/users`,
})

  .get(
    '/',
    async ({ query, headers, set }) => {
      try {
        await authenticateUser(headers);

        const page = Number(query.page) || 1;
        const pageSize = Number(query.pageSize) || 10;
        const sortOrder = (query.sortOrder === 'ASC' ? 'ASC' : 'DESC') as
          | 'ASC'
          | 'DESC';
        const sortBy = (query.sortBy as string) || 'created_at';

        const result = await listUsersUseCase.execute({
          page,
          pageSize,
          sortOrder,
          sortBy,
        });

        return result;
      } catch (error) {
        console.error('GET /users error:', error);
        throw error;
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        pageSize: t.Optional(t.Number()),
        sortOrder: t.Optional(t.Union([t.Literal('ASC'), t.Literal('DESC')])),
        sortBy: t.Optional(t.String()),
      }),
      response: {
        200: paginatedUsersResponseSchema,
      },
      detail: {
        tags: ['Users'],
        summary: 'List all users',
        description:
          'Returns a paginated list of all users. Only ADMIN users can access this endpoint.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number for pagination',
          },
          {
            name: 'pageSize',
            in: 'query',
            schema: { type: 'integer', default: 10 },
            description: 'Number of items per page',
          },
          {
            name: 'sortOrder',
            in: 'query',
            schema: { type: 'string', enum: ['ASC', 'DESC'], default: 'DESC' },
            description: 'Sort order',
          },
          {
            name: 'sortBy',
            in: 'query',
            schema: { type: 'string', default: 'created_at' },
            description: 'Field to sort by',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/User',
                      },
                    },
                    pagination: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        pageSize: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        hasNextPage: { type: 'boolean' },
                        hasPrevPage: { type: 'boolean' },
                      },
                    },
                  },
                },
                example: {
                  data: [
                    {
                      id: '123e4567-e89b-12d3-a456-426614174000',
                      email: 'admin@example.com',
                      name: 'Admin User',
                      role: 'ADMIN',
                      status: 'active',
                      createdAt: '2025-01-01T00:00:00.000Z',
                      updatedAt: '2025-01-01T00:00:00.000Z',
                    },
                  ],
                  pagination: {
                    total: 1,
                    page: 1,
                    pageSize: 10,
                    totalPages: 1,
                    hasNextPage: false,
                    hasPrevPage: false,
                  },
                },
              },
            },
          },
        },
      },
    }
  )

  .get(
    '/:id',
    async ({ params, headers, set }) => {
      try {
        await authenticateUser(headers);

        const user = await getUserUseCase.execute(params.id);

        return user;
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
        200: userSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description:
          'Returns a single user by ID. Only ADMIN users can access this endpoint.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                example: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  email: 'admin@example.com',
                  name: 'Admin User',
                  role: 'ADMIN',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00.000Z',
                  updatedAt: '2025-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    }
  )

  .post(
    '/',
    async ({ body, set, headers }) => {
      try {
        await authenticateUser(headers);

        const bodyTyped = body as {
          email: string;
          password: string;
          name: string;
          role?: 'ADMIN' | 'USER';
        };

        const user = await createUserUseCase.execute({
          email: bodyTyped.email,
          password: bodyTyped.password,
          name: bodyTyped.name,
          role: bodyTyped.role || 'USER',
        });

        set.status = HttpStatus.CREATED;
        return user;
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
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        password: t.String({
          minLength: 6,
          description: 'User password (min 6 characters)',
        }),
        name: t.String({
          minLength: 1,
          maxLength: 100,
          description: 'User full name',
        }),
        role: t.Optional(t.Union([t.Literal('ADMIN'), t.Literal('USER')])),
      }),
      response: {
        201: userSchema,
        400: t.Object({ message: t.String() }),
        409: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Users'],
        summary: 'Create new user',
        description:
          'Creates a new user with the specified details. Only ADMIN users can access this endpoint.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  role: { type: 'string', enum: ['ADMIN', 'USER'] },
                },
              },
              example: {
                email: 'newuser@example.com',
                password: 'password123',
                name: 'New User',
                role: 'USER',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User created successfully',
            content: {
              'application/json': {
                example: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  email: 'newuser@example.com',
                  name: 'New User',
                  role: 'USER',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00.000Z',
                  updatedAt: '2025-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
    }
  )

  .patch(
    '/:id',
    async ({ params, body, set, headers }) => {
      try {
        await authenticateUser(headers);

        const bodyTyped = body as {
          name?: string;
          role?: 'ADMIN' | 'USER';
          status?: 'active' | 'inactive';
        };

        const user = await updateUserUseCase.execute(params.id, {
          name: bodyTyped.name,
          role: bodyTyped.role,
          status: bodyTyped.status,
        });

        return user;
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
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1, maxLength: 100 })),
        role: t.Optional(t.Union([t.Literal('ADMIN'), t.Literal('USER')])),
        status: t.Optional(
          t.Union([t.Literal('active'), t.Literal('inactive')])
        ),
      }),
      response: {
        200: userSchema,
        404: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Users'],
        summary: 'Update user',
        description:
          'Updates an existing user with the specified details. Only ADMIN users can access this endpoint.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User ID',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  role: { type: 'string', enum: ['ADMIN', 'USER'] },
                  status: { type: 'string', enum: ['active', 'inactive'] },
                },
              },
              example: {
                name: 'Updated Name',
                role: 'USER',
                status: 'active',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'User updated successfully',
            content: {
              'application/json': {
                example: {
                  id: '123e4567-e89b-12d3-a456-426614174000',
                  email: 'user@example.com',
                  name: 'Updated Name',
                  role: 'USER',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00.000Z',
                  updatedAt: '2025-01-02T00:00:00.000Z',
                },
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
        await authenticateUser(headers);

        await deleteUserUseCase.execute(params.id);

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
        tags: ['Users'],
        summary: 'Delete user',
        description:
          'Deletes a user by ID. Only ADMIN users can access this endpoint.',
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'User ID to delete',
            example: '123e4567-e89b-12d3-a456-426614174000',
          },
        ],
        responses: {
          '204': {
            description: 'User deleted successfully',
          },
        },
      },
    }
  )

  .use(openapi());
