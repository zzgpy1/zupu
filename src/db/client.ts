import type { Env } from '../types';

export class DatabaseClient {
  private db: D1Database;

  constructor(env: Env) {
    this.db = env.DB;
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    const stmt = this.db.prepare(sql);
    const result = await stmt.bind(...params).all<T>();
    return result.results;
  }

  async queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async execute(sql: string, params: any[] = []): Promise<D1Result> {
    const stmt = this.db.prepare(sql);
    return await stmt.bind(...params).run();
  }

  async batch(statements: Array<{ sql: string; params: any[] }>): Promise<D1Result[]> {
    const stmts = statements.map(({ sql, params }) => {
      const stmt = this.db.prepare(sql);
      return stmt.bind(...params);
    });
    return await this.db.batch(stmts);
  }

  // 事务辅助
  async transaction<T>(callback: (client: DatabaseClient) => Promise<T>): Promise<T> {
    // D1 通过 batch 实现事务效果
    return await callback(this);
  }
}
