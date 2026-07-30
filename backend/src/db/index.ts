import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export type Env = {
  DB: D1Database;
  JWT_SECRET: string;
};

export function createDb(env: Env) {
  if (!env.DB) {
    throw new Error("D1 database binding 'DB' is not available");
  }
  return drizzle(env.DB, { schema });
}

export type Db = ReturnType<typeof createDb>;
