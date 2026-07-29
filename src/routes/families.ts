import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';
import { DatabaseClient } from '../db/client';
import { FamilyService } from '../services/family.service';
import { ResponseUtil } from '../utils/response';
import { FamilySchema } from '../utils/validators';

const families = new Hono<{ Bindings: Env }>();

// GET /api/families - 获取家族列表
families.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = (page - 1) * limit;

  const db = new DatabaseClient(c.env);
  const service = new FamilyService(db);
  const result = await service.findAll(limit, offset);

  return ResponseUtil.paginated(c, result.data, result.total, page, limit);
});

// GET /api/families/:id - 获取家族详情
families.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const service = new FamilyService(db);
  const family = await service.findById(id);

  if (!family) {
    return ResponseUtil.notFound(c, '家族');
  }

  return ResponseUtil.success(c, family);
});

// POST /api/families - 创建家族
families.post('/', async (c) => {
  const body = await c.req.json();
  const validated = FamilySchema.parse(body);

  const db = new DatabaseClient(c.env);
  const service = new FamilyService(db);
  const family = await service.create(validated);

  return ResponseUtil.success(c, family, '家族创建成功');
});

// PUT /api/families/:id - 更新家族
families.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const validated = FamilySchema.partial().parse(body);

  const db = new DatabaseClient(c.env);
  const service = new FamilyService(db);
  const family = await service.update(id, validated);

  if (!family) {
    return ResponseUtil.notFound(c, '家族');
  }

  return ResponseUtil.success(c, family, '家族更新成功');
});

// DELETE /api/families/:id - 删除家族
families.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const service = new FamilyService(db);
  const deleted = await service.delete(id);

  if (!deleted) {
    return ResponseUtil.notFound(c, '家族');
  }

  return ResponseUtil.success(c, null, '家族删除成功');
});

export default families;
