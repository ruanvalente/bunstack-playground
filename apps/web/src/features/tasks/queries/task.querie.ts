import { API_URL } from "../../../config/constants";
import { httpClient } from "../../../shared/http/http-client";
import type { Task, TaskAPIResponse } from "../../../shared/types/tasks.type";

export async function getTasks(): Promise<Array<Task>> {
  try {
    const response = await httpClient<TaskAPIResponse>(`${API_URL}/tasks`);
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
