import { z } from "zod";

export const authUserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar_url: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const authSessionSchema = z.object({
  user: authUserSchema,
  access_token: z.string(),
  refresh_token: z.string().optional(),
  expires_at: z.number(),
});

export type AuthSession = z.infer<typeof authSessionSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  name: z.string().optional(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const authResponseSchema = z.object({
  user: authUserSchema.optional(),
  session: authSessionSchema.optional(),
  message: z.string().optional(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;

export const githubAuthUrlSchema = z.object({
  url: z.string(),
});

export type GithubAuthUrl = z.infer<typeof githubAuthUrlSchema>;
