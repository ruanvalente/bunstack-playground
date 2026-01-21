import { Database } from "bun:sqlite";

/**
 * SQLite database instance
 *
 * This database is used as the single source of truth
 * for the application persistence layer.
 */
export const db = new Database("database.sqlite", {
  create: true,
});

/**
 * Enable foreign key constraints
 * (important for future relationships)
 */
db.run("PRAGMA foreign_keys = ON;");
