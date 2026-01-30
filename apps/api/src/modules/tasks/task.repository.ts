import type {
  PaginatedTasksDomain,
  PaginationQueryDTO,
  Task,
} from "@bunstack-playground/shared";

export abstract class TaskRepositoryImpl {
  /**
   * Return all tasks with pagination
   * @param {PaginationQueryDTO} params - Pagination parameters
   * @returns {Promise<PaginatedTasksDomain>} Paginated tasks
   */
  abstract findAll(params: PaginationQueryDTO): Promise<PaginatedTasksDomain>;

  /**
   * Find task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Task | null>} Task or null if not found
   */
  abstract findById(id: string): Promise<Task | null>;

  /**
   * Create a new task
   * @param {string} title - Task title
   * @returns {Promise<Task>} Created task
   */
  abstract create(title: string): Promise<Task>;

  /**
   * Update title of a task
   * @param {string} id - Task ID
   * @param {string} title - New title
   * @returns {Promise<Task | null>} Updated task or null if not found
   */
  abstract updateTitle(id: string, title: string): Promise<Task | null>;

  /**
   * Update task completion status
   * @param {string} id - Task ID
   * @param {boolean} completed - Completion status
   * @returns {Promise<Task | null>} Updated task or null if not found
   */
  abstract complete(id: string, completed: boolean): Promise<Task | null>;

  /**
   * Remove a task
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} True if task was deleted, false if not found
   */
  abstract delete(id: string): Promise<boolean>;
}
