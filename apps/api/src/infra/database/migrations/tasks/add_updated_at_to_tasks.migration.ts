import { db } from "../..";

export function addUpdatedAtToTasksMigration() {
  const tableInfo = db.prepare("PRAGMA table_info(tasks)").all() as { name: string }[];
  const columns = tableInfo.map((col) => col.name);

  if (!columns.includes("updated_at")) {
    db.run(`
      ALTER TABLE tasks ADD COLUMN updated_at TEXT;
    `);
  }
}
