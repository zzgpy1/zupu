import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './src/lib/db/migrations',
  dialect: 'sqlite',
  driver: 'd1',
  dbCredentials: {
    wranglerConfigPath: './wrangler.toml',
    dbName: 'zupu',
  },
} satisfies Config;
