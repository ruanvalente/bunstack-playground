import { openapi } from '@elysiajs/openapi';
import { Elysia, t } from 'elysia';

import {
  API_VERSION,
  authResponseSchema,
  githubAuthUrlSchema,
  loginRequestSchema,
  registerRequestSchema,
} from '@bunstack-playground/shared/http';

import { config } from '@/api/config';
import { supabaseAuth } from '@/api/infrastructure/supabase/supabase.auth.client';
import { supabaseAdmin } from '@/api/infrastructure/supabase/supabase.client';

const GITHUB_REDIRECT_URL = `${config.frontendUrl}/auth/callback`;

export const authController = new Elysia({ prefix: `api/${API_VERSION}/auth` })

  .post(
    '/register',
    async ({ body, set }) => {
      const { email, password, name } = body;

      const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
        },
      });

      if (error) {
        set.status = 400;
        return {
          message: error.message,
        };
      }

      set.status = 201;
      return {
        user: data.user,
        session: data.session,
        message:
          'Registration successful. Please check your email for confirmation.',
      };
    },
    {
      body: registerRequestSchema,
      response: {
        201: authResponseSchema,
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Register new user',
        description: 'Register a new user with email and password',
      },
    }
  )

  .post(
    '/login',
    async ({ body, set }) => {
      const { email, password } = body;

      const { data, error } = await supabaseAuth.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set.status = 401;
        return {
          message: error.message,
        };
      }

      return {
        user: {
          ...data.user,
          user_metadata: data.user.user_metadata,
        },
        session: {
          user: data.user,
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at:
            data.session.expires_at ?? Math.floor(Date.now() / 1000) + 3600,
        },
      };
    },
    {
      body: loginRequestSchema,
      response: {
        200: authResponseSchema,
        401: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Login user',
        description: 'Login with email and password',
      },
    }
  )

  .post(
    '/logout',
    async ({ set }) => {
      const { error } = await supabaseAuth.auth.signOut();

      if (error) {
        set.status = 400;
        return { message: error.message };
      }

      return { message: 'Logout successful' };
    },
    {
      response: {
        200: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Logout user',
        description: 'Logout the current user',
      },
    }
  )

  .get(
    '/user',
    async ({ headers, set }) => {
      const authHeader = headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        set.status = 401;
        return { message: 'No token provided' };
      }

      const token = authHeader.replace('Bearer ', '');

      const { data: user, error } = await supabaseAuth.auth.getUser(token);

      if (error) {
        set.status = 401;
        return { message: error.message };
      }

      const userId = user.user.id;

      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('role, name, email')
        .eq('id', userId)
        .single();

      return {
        user: user.user,
        role: userData?.role || 'USER',
        name: userData?.name || user.user.user_metadata?.name,
        email: userData?.email || user.user.email,
      };
    },
    {
      response: {
        200: t.Object({
          user: t.Any(),
          role: t.String(),
          name: t.String(),
          email: t.String(),
        }),
        401: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Get current user',
        description: 'Get the current authenticated user with role',
      },
    }
  )

  .get(
    '/github',
    async ({ set }) => {
      const { data, error } = await supabaseAuth.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: GITHUB_REDIRECT_URL,
          scopes: 'read:user user:email',
        },
      });

      if (error) {
        set.status = 400;
        return { message: error.message };
      }

      return { url: data.url };
    },
    {
      response: {
        200: githubAuthUrlSchema,
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ['Auth'],
        summary: 'GitHub OAuth login',
        description: 'Initiate GitHub OAuth login flow',
      },
    }
  )

  .use(openapi());
