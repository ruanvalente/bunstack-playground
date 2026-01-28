import type {
  PaginatedTasksResponseDTO,
  PaginationQueryDTO,
  Task,
} from "@bunstack-playground/shared";

import { NotFoundError, ValidationError } from "@/api/shared/errors";

import { taskRepository } from "./task.repository";

/**
 * Task Service
 *
 * Responsible for handling business logic related to tasks.
 * Does not handle HTTP concerns (status codes, request/response).
 */
export const taskService = {
  /**
   * List all tasks with pagination.
   *
   * @param {PaginationQueryDTO} params - Pagination parameters
   * @returns {Promise<PaginatedTasksResponseDTO>} Paginated list of tasks
   */
  async list(params: PaginationQueryDTO): Promise<PaginatedTasksResponseDTO> {
    return await taskRepository.findAll(params);
  },

  /**
   * Create a new task.
   *
   * @param {string} title - Task title
   * @returns {Promise<Task>} Newly created task
   * @throws {ValidationError} If title is empty
   */
  async create(title: string): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError("Title cannot be empty");
    }

    return taskRepository.create(newTaskTitle);
  },

  /**
   * Update a task title.
   *
   * @param {string} id - Task identifier
   * @param {string} title - New task title
   * @returns {Promise<Task>} Updated task
   * @throws {ValidationError} If title is empty
   * @throws {NotFoundError} If task does not exist
   */
  async update(id: string, title: string): Promise<Task> {
    const newTaskTitle = title.trim();

    if (newTaskTitle.length === 0 || !newTaskTitle) {
      throw new ValidationError("Title cannot be empty");
    }
    const task = await taskRepository.updateTitle(id, newTaskTitle);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return task;
  },

  /**
   * Mark a task as completed.
   *
   * @param {string} id - Task identifier
   * @param {boolean} completed - Completion status
   * @returns {Promise<Task>} Updated task
   * @throws {NotFoundError} If task does not exist
   */
  async complete(id: string, completed: boolean): Promise<Task> {
    const task = await taskRepository.complete(id, completed);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return task;
  },

  /**
   * Delete a task.
   *
   * @param {string} id - Task identifier
   * @throws {NotFoundError} If task does not exist
   */
  async delete(id: string): Promise<void> {
    const deleted = await taskRepository.delete(id);

    if (!deleted) {
      throw new NotFoundError("Task not found");
    }
  },
};
