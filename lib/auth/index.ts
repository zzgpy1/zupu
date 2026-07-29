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
  socialProviders: {
    // 可选: GitHub, Google 等
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
  // 多租户支持：在 session 中存储用户 ID
  callbacks: {
    session: {
      async onSuccess({ session, user }) {
        return {
          ...session,
          user: {
            ...session.user,
            id: user.id,
          },
        };
      },
    },
  },
});

export type Auth = typeof auth;
