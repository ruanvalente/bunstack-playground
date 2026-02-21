import { Database } from 'bun:sqlite';

export const db = new Database('database.sqlite', {
  create: true,
});

db.run('PRAGMA foreign_keys = ON;');
