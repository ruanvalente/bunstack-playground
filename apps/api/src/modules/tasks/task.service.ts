import { NotFoundError, ValidationError } from "../../shared/errors";
import type { Task } from "./task.model";
import {
  taskRepository,
  type PaginatedResult,
  type PaginationParams,
} from "./task.repository";

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
   * @param {PaginationParams} params - Pagination parameters
   * @returns {Promise<PaginatedResult<Task>>} Paginated list of tasks
   */
  async list(params: PaginationParams): Promise<PaginatedResult<Task>> {
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
   * @returns {Promise<Task>} Updated task
   * @throws {NotFoundError} If task does not exist
   */
  async complete(id: string): Promise<Task> {
    const task = await taskRepository.complete(id);

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
