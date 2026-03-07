import type {
  CreateUserDTO,
  PaginatedUsersResponseDTO,
  UpdateUserDTO,
  User,
} from '@bunstack-playground/shared/http';

import type { IUserRepository } from '@/api/domain/repositories';
import { supabaseAdmin } from '@/api/infrastructure/supabase/supabase.client';

const TABLE_NAME = 'users';

export class UserSupabaseRepository implements IUserRepository {
  async findAll(params?: {
    page?: number;
    pageSize?: number;
    sortOrder?: 'ASC' | 'DESC';
    sortBy?: string;
  }): Promise<PaginatedUsersResponseDTO> {
    const {
      page = 1,
      pageSize = 10,
      sortOrder = 'DESC',
      sortBy = 'created_at',
    } = params || {};

    const from = (page - 1) * pageSize;

    const { data, error, count } = await supabaseAdmin
      .from(TABLE_NAME)
      .select('*', { count: 'exact' })
      .order(sortBy, { ascending: sortOrder === 'ASC' })
      .range(from, from + pageSize - 1);

    if (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const users = (data || []).map(this.mapRowToUser);

    return {
      data: users,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        sortBy,
        sortOrder,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user by id:', error);
      throw new Error('Failed to fetch user');
    }

    return this.mapRowToUser(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching user by email:', error);
      throw new Error('Failed to fetch user');
    }

    return this.mapRowToUser(data);
  }

  async create(input: CreateUserDTO): Promise<User> {
    const now = new Date().toISOString();

    const existingUser = await this.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: input.password,
        email_confirm: true,
        user_metadata: {
          name: input.name,
          full_name: input.name,
        },
      });

    if (authError) {
      console.error('Error creating user in auth:', authError);
      throw new Error('Failed to create user in authentication');
    }

    const userId = authData.user.id;

    const existingById = await this.findById(userId);
    if (existingById) {
      return existingById;
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .insert({
        id: userId,
        email: input.email,
        name: input.name,
        role: input.role || 'USER',
        status: 'active',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user in database:', error);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error('Failed to create user');
    }

    return this.mapRowToUser(data);
  }

  async update(id: string, input: UpdateUserDTO): Promise<User | null> {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.role !== undefined) {
      updateData.role = input.role;
    }
    if (input.status !== undefined) {
      updateData.status = input.status;
    }

    const { data, error } = await supabaseAdmin
      .from(TABLE_NAME)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }

    return this.mapRowToUser(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }

    await supabaseAdmin.auth.admin.deleteUser(id);

    return true;
  }

  private mapRowToUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      name: row.name as string,
      role: row.role as 'ADMIN' | 'USER',
      status: row.status as 'active' | 'inactive',
      createdAt: new Date(row.created_at as string).toISOString(),
      updatedAt: row.updated_at
        ? new Date(row.updated_at as string).toISOString()
        : undefined,
    };
  }
}
