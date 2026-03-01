import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

import { API_VERSION } from '@bunstack-playground/shared';

import { CreateCategoryUseCase } from '@/api/application/categories/create-category.use-case';
import { DeleteCategoryUseCase } from '@/api/application/categories/delete-category.use-case';
import { ListCategoriesUseCase } from '@/api/application/categories/list-categories.use-case';
import { AppError, HttpStatus, UnauthorizedError } from '@/api/domain/erros';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';

const listCategoriesUseCase = new ListCategoriesUseCase();
const createCategoryUseCase = new CreateCategoryUseCase();
const deleteCategoryUseCase = new DeleteCategoryUseCase();

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

export const categoryController = new Elysia({
  prefix: `api/${API_VERSION}/categories`,
})

  .get(
    '/',
    async ({ headers }) => {
      const userId = await authenticateUser(headers);
      const categories = await listCategoriesUseCase.execute(userId);
      return categories;
    },
    {
      response: {
        200: t.Array(
          t.Object({
            id: t.String(),
            userId: t.String(),
            name: t.String(),
            color: t.String(),
            createdAt: t.String(),
          })
        ),
      },
      detail: {
        tags: ['Categories'],
        summary: 'List categories',
        description: 'Returns all categories for the authenticated user',
      },
    }
  )

  .post(
    '/',
    async ({ body, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        const bodyTyped = body as { name: string; color?: string };
        const category = await createCategoryUseCase.execute(
          bodyTyped.name,
          bodyTyped.color || '#3B82F6',
          userId
        );
        set.status = HttpStatus.CREATED;
        return category;
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
        name: t.String({ minLength: 1, maxLength: 50 }),
        color: t.Optional(t.String({ pattern: '^#[0-9A-Fa-f]{6}$' })),
      }),
      response: {
        201: t.Object({
          id: t.String(),
          userId: t.String(),
          name: t.String(),
          color: t.String(),
          createdAt: t.String(),
        }),
      },
      detail: {
        tags: ['Categories'],
        summary: 'Create category',
        description: 'Create a new category',
      },
    }
  )

  .delete(
    '/:id',
    async ({ params, set, headers }) => {
      try {
        const userId = await authenticateUser(headers);
        await deleteCategoryUseCase.execute(params.id, userId);
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
        tags: ['Categories'],
        summary: 'Delete category',
        description: 'Delete a category by ID',
      },
    }
  )

  .use(openapi());
