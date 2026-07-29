import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// 获取 D1 数据库绑定
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB?: D1Database;
    }
  }
}

export function getDB(env?: { DB: D1Database }) {
  // Cloudflare Workers 环境
  if (env?.DB) {
    return drizzle(env.DB, { schema });
  }
  // Next.js 开发/生产环境 (通过环境变量)
  if (process.env.DB) {
    // @ts-ignore - Cloudflare 绑定在 Next.js 中通过环境变量注入
    return drizzle(process.env.DB as unknown as D1Database, { schema });
  }
  throw new Error('D1 database not bound');
}

export type DB = ReturnType<typeof getDB>;
export { schema };
