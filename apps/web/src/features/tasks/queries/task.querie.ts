import type { Task } from "@bunstack-playground/shared/domain";
import type { PaginatedTasksResponseDTO } from "@bunstack-playground/shared/http";

import { httpClient } from "../../../shared/http/http-client";
import { API_URL } from "../../../config/constants";

export async function getTasks(): Promise<Array<Task>> {
  try {
    const response = await httpClient<PaginatedTasksResponseDTO>(
      `${API_URL}/tasks`,
    );
    return response.data;
  } catch (err) {
    console.error("getTasks fail:", err);
    throw new Error("Not is possible to fetch tasks. Please try again later.");
  }
}

export async function toggleTask(taskId: string): Promise<Task> {
  try {
    const response = await httpClient<Task>(
      `${API_URL}/tasks/${taskId}/complete`,
      {
        method: "PATCH",
      },
    );

    return response;
  } catch (err) {
    console.error(`toggleTask(${taskId}) fail:`, err);
    throw new Error("Not is possible to update the task. Please try again.");
  }
}
