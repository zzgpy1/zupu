import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

let cachedDb: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (cachedDb) return cachedDb;
  // @ts-ignore - Cloudflare Pages 环境变量
  const dbBinding = process.env.DB;
  if (!dbBinding) {
    throw new Error('D1 binding (DB) not found. Please bind your D1 database.');
  }
  cachedDb = drizzle(dbBinding, { schema });
  return cachedDb;
}
