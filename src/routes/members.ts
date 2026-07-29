import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../types';
import { DatabaseClient } from '../db/client';
import { MemberService } from '../services/member.service';
import { GenealogyService } from '../services/genealogy.service';
import { ResponseUtil } from '../utils/response';
import { MemberSchema } from '../utils/validators';

const members = new Hono<{ Bindings: Env }>();

// GET /api/members - 获取成员列表（按家族）
members.get('/', async (c) => {
  const familyId = c.req.query('family_id');
  if (!familyId) {
    return ResponseUtil.error(c, 'family_id 参数必填');
  }

  const page = parseInt(c.req.query('page') || '1');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = (page - 1) * limit;

  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);
  const result = await service.findByFamily(familyId, limit, offset);

  return ResponseUtil.paginated(c, result.data, result.total, page, limit);
});

// GET /api/members/:id - 获取成员详情
members.get('/:id', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);
  const member = await service.findById(id);

  if (!member) {
    return ResponseUtil.notFound(c, '成员');
  }

  return ResponseUtil.success(c, member);
});

// POST /api/members - 创建成员
members.post('/', async (c) => {
  const body = await c.req.json();
  const validated = MemberSchema.parse(body);

  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);
  const member = await service.create(validated);

  return ResponseUtil.success(c, member, '成员创建成功');
});

// PUT /api/members/:id - 更新成员
members.put('/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const validated = MemberSchema.partial().parse(body);

  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);
  const member = await service.update(id, validated);

  if (!member) {
    return ResponseUtil.notFound(c, '成员');
  }

  return ResponseUtil.success(c, member, '成员更新成功');
});

// DELETE /api/members/:id - 删除成员
members.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);

  try {
    const deleted = await service.delete(id);
    if (!deleted) {
      return ResponseUtil.notFound(c, '成员');
    }
    return ResponseUtil.success(c, null, '成员删除成功');
  } catch (error: any) {
    return ResponseUtil.error(c, error.message, 400);
  }
});

// GET /api/members/:id/tree - 获取族谱树
members.get('/:id/tree', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const service = new MemberService(db);

  const member = await service.findById(id);
  if (!member) {
    return ResponseUtil.notFound(c, '成员');
  }

  const tree = await service.getTree(member.family_id, id);
  return ResponseUtil.success(c, tree);
});

// GET /api/members/:id/ancestors - 获取祖先
members.get('/:id/ancestors', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const genealogy = new GenealogyService(db);
  const ancestors = await genealogy.getAncestors(id);

  return ResponseUtil.success(c, ancestors);
});

// GET /api/members/:id/descendants - 获取后代
members.get('/:id/descendants', async (c) => {
  const id = c.req.param('id');
  const db = new DatabaseClient(c.env);
  const genealogy = new GenealogyService(db);
  const descendants = await genealogy.getDescendants(id);

  return ResponseUtil.success(c, descendants);
});

// GET /api/members/path - 计算两个成员之间的路径
members.get('/path', async (c) => {
  const id1 = c.req.query('from');
  const id2 = c.req.query('to');

  if (!id1 || !id2) {
    return ResponseUtil.error(c, 'from 和 to 参数必填');
  }

  const db = new DatabaseClient(c.env);
  const genealogy = new GenealogyService(db);
  const path = await genealogy.findPath(id1, id2);

  return ResponseUtil.success(c, path);
});

export default members;
