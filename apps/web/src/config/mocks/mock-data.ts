import type { Task } from "../../shared/types/tasks.type";

export const MOCK_TASKS: Array<Task> = [
  {
    id: "1",
    title: "Implementar autenticação",
    completed: false,
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    title: "Configurar banco de dados",
    completed: true,
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "3",
    title: "Criar testes unitários",
    completed: false,
    createdAt: new Date("2026-01-18"),
  },
];

export async function simulateNetworkDelay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isMockEnabled(): boolean {
  return import.meta.env.VITE_USE_MOCK_DATA === "true";
}
