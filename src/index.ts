import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import type { Env } from './types';
import families from './routes/families';
import members from './routes/members';
import statistics from './routes/statistics';
import { ResponseUtil } from './utils/response';

const app = new Hono<{ Bindings: Env }>();

// 中间件
app.use('*', logger());
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
}));

// 健康检查
app.get('/', (c) => {
  return c.json({
    name: 'Pure Genealogy API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// 注册路由
app.route('/api/families', families);
app.route('/api/members', members);
app.route('/api/statistics', statistics);

// 404 处理
app.notFound((c) => {
  return ResponseUtil.error(c, '路由不存在', 404);
});

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err);
  return ResponseUtil.error(c, err.message || '服务器内部错误', 500);
});

export default app;
