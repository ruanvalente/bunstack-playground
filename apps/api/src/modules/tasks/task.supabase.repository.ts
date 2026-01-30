import type {
  PaginatedTasksResponseDTO,
  PaginationQueryDTO,
  TaskDTOWithDate,
} from "@bunstack-playground/shared";
import type { Task } from "@bunstack-playground/shared/domain";
import type { TaskRepositoryImpl } from "./task.repository";
import { supabase } from "@/api/infra/database/supabase";

export class TaskSupabaseRepository implements TaskRepositoryImpl {
  async findAll(
    params: PaginationQueryDTO,
  ): Promise<PaginatedTasksResponseDTO> {
    const { page = 1, pageSize = 10, sortOrder = "ASC" } = params;

    const { count, error: countError } = await supabase
      .from("tasks")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(`Failed to fetch tasks count: ${countError.message}`);
    }

    const total = count || 0;
    const offset = (page - 1) * pageSize;
    const totalPages = Math.ceil(total / pageSize);

    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed, created_at, updated_at")
      .order("created_at", { ascending: sortOrder === "ASC" })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(`Failed to fetch tasks: ${error.message}`);
    }

    return {
      data: data.map(mapRowToTask),
      pagination: {
        page,
        total,
        pageSize,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      meta: {
        sortBy: "updatedAt",
        sortOrder,
        timestamp: new Date().toISOString(),
      },
    };
  }

  async findById(id: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .select("id, title, completed, created_at")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch task: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async create(title: string): Promise<Task> {
    const { data, error } = await supabase
      .from("tasks")
      .insert([{ title }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }

    return mapRowToTask(data);
  }

  async updateTitle(id: string, title: string): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ title })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to update task: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async complete(id: string, completed: boolean): Promise<Task | null> {
    const { data, error } = await supabase
      .from("tasks")
      .update({ completed })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to update task completion: ${error.message}`);
    }

    return data ? mapRowToTask(data) : null;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }

    return true;
  }
}

/**
 * Mapper internal (DB → Domain)
 * @param row - Database row
 * @returns {TaskDTOWithDate} Mapped task
 */
function mapRowToTask(row: any): TaskDTOWithDate {
  return {
    id: row.id,
    title: row.title,
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
