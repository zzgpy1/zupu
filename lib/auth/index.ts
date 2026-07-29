import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDB } from '@/lib/db';

export const auth = betterAuth({
  // 使用 Drizzle 适配器连接 D1 (SQLite)
  database: drizzleAdapter(getDB(), {
    provider: 'sqlite', // D1 基于 SQLite，使用 sqlite 驱动
  }),
  // 启用邮箱密码登录
  emailAndPassword: {
    enabled: true,
  },
  // 会话配置
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 分钟缓存
    },
  },
  // 用户管理
  user: {
    deleteUser: {
      enabled: true, // 允许用户删除自己的账号
    },
  },
  // 可选：添加社交登录提供者
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  // },
  // 回调：可在登录成功后扩展 session
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

// 导出类型供其他地方使用
export type Auth = typeof auth;
