import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// 使用 better-auth 官方提供的 Next.js 适配器
export const { GET, POST } = toNextJsHandler(auth);
