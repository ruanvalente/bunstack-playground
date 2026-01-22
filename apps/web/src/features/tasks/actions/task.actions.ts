// import { API_URL } from "../../../config/constants";
// import type { Task, TaskAPIResponse } from "../../../shared/types/tasks.type";

import { API_URL } from "../../../config/constants";

// export async function getTasksAction(): Promise<TaskAPIResponse> {
//   try {
//     const response = await fetch(`${API_URL}/tasks`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to fetch tasks: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching tasks:", error);
//     throw error;
//   }
// }

// export async function toggleTaskAction(taskId: string): Promise<Task | null> {
//   try {
//     const response = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to toggle task: ${response.statusText}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error toggling task:", error);
//     throw error;
//   }
// }

export async function toggleTaskAction(taskId: string) {
  const response = await fetch(`${API_URL}/tasks/${taskId}/toggle`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar tarefa");
  }

  return response.json();
}
