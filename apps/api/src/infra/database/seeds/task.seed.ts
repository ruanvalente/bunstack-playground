import { db } from "..";

/**
 * Seed initial tasks data
 */
export async function seedTasks(): Promise<void> {
  const count = db.prepare(`SELECT COUNT(*) as total FROM tasks`).get() as {
    total: number;
  };

  if (count.total > 0) {
    console.log("🟡 Seed de tasks ignorado (já existem registros) 🟡");
    return;
  }

  const now = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO tasks (id, title, completed, created_at)
    VALUES (?, ?, ?, ?)
  `);

  insert.run(crypto.randomUUID(), "Estudar Bun", 0, now);
  insert.run(crypto.randomUUID(), "Criar API de Tasks", 1, now);
  insert.run(crypto.randomUUID(), "Refatorar para Feature Module", 0, now);

  console.log("🟢 Seed de tasks executado com sucesso 🟢");
}
