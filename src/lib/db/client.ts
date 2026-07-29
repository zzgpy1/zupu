import { drizzle } from 'drizzle-orm/d1';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import * as schema from './schema';

let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cachedDb) return cachedDb;

  const dbBinding = process.env.DB;
  if (dbBinding) {
    cachedDb = drizzle(dbBinding, { schema });
  } else {
    const sqlite = new Database('dev.db');
    const db = drizzleSQLite(sqlite, { schema });
    migrate(db, { migrationsFolder: './src/lib/db/migrations' });
    cachedDb = db;
  }

  return cachedDb;
}
