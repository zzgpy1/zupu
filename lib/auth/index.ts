import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDB } from '@/lib/db';

export const auth = betterAuth({
  database: drizzleAdapter(getDB(), {
    provider: 'sqlite',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  // 可在此添加其他配置，如社交登录、回调等
});
