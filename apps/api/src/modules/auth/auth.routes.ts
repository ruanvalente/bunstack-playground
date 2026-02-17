import { Elysia, t } from "elysia";
import openapi from "@elysiajs/openapi";
import { supabaseAuth } from "@/api/infra/database/supabase/supabase.auth.client";
import {
  loginRequestSchema,
  registerRequestSchema,
  authResponseSchema,
  githubAuthUrlSchema,
  API_VERSION,
} from "@bunstack-playground/shared/http";

const GITHUB_REDIRECT_URL = `http://localhost:5173/auth/callback`;

export const authRoutes = new Elysia({ prefix: `api/${API_VERSION}/auth` })

  .post(
    "/register",
    async ({ body, set }) => {
      const { email, password, name } = body;

      const { data, error } = await supabaseAuth.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split("@")[0],
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
          "Registration successful. Please check your email for confirmation.",
      };
    },
    {
      body: registerRequestSchema,
      response: {
        201: authResponseSchema,
        400: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Auth"],
        summary: "Register new user",
        description: "Register a new user with email and password",
      },
    },
  )

  .post(
    "/login",
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
        user: data.user,
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
        tags: ["Auth"],
        summary: "Login user",
        description: "Login with email and password",
      },
    },
  )

  .post(
    "/logout",
    async ({ set }) => {
      const { error } = await supabaseAuth.auth.signOut();

      if (error) {
        set.status = 400;
        return { message: error.message };
      }

      return { message: "Logout successful" };
    },
    {
      response: {
        200: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Auth"],
        summary: "Logout user",
        description: "Logout the current user",
      },
    },
  )

  .get(
    "/user",
    async ({ headers, set }) => {
      const authHeader = headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        set.status = 401;
        return { message: "No token provided" };
      }

      const token = authHeader.replace("Bearer ", "");

      const { data: user, error } = await supabaseAuth.auth.getUser(token);

      if (error) {
        set.status = 401;
        return { message: error.message };
      }

      return { user: user.user };
    },
    {
      response: {
        200: t.Object({ user: t.Any() }),
        401: t.Object({ message: t.String() }),
      },
      detail: {
        tags: ["Auth"],
        summary: "Get current user",
        description: "Get the current authenticated user",
      },
    },
  )

  .get(
    "/github",
    async ({ set }) => {
      const { data, error } = await supabaseAuth.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: GITHUB_REDIRECT_URL,
          scopes: "read:user user:email",
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
        tags: ["Auth"],
        summary: "GitHub OAuth login",
        description: "Initiate GitHub OAuth login flow",
      },
    },
  )

  .get(
    "/github/callback",
    async ({ query, set }) => {
      const { code, error: queryError } = query;

      if (queryError) {
        set.headers["Location"] = "http://localhost:5173/auth?error=oauth_error";
        set.status = 302;
        return null;
      }

      if (!code) {
        set.headers["Location"] = "http://localhost:5173/auth?error=no_code";
        set.status = 302;
        return null;
      }

      const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code as string);

      if (error || !data.session) {
        console.error("OAuth exchange error:", error);
        set.headers["Location"] = "http://localhost:5173/auth?error=invalid_code";
        set.status = 302;
        return null;
      }

      const accessToken = data.session.access_token;
      const refreshToken = data.session.refresh_token;

      set.headers["Location"] = `http://localhost:5173/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken || ''}`;
      set.status = 302;
      return null;
    },
    {
      query: t.Object({
        code: t.Optional(t.String()),
        error: t.Optional(t.String()),
        error_description: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Auth"],
        summary: "GitHub OAuth callback",
        description: "Handle GitHub OAuth callback",
      },
    },
  )

  .use(openapi());
