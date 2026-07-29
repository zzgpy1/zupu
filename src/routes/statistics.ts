import { Hono } from 'hono';
import type { Env } from '../types';
import { DatabaseClient } from '../db/client';
import { StatisticsService } from '../services/statistics.service';
import { ResponseUtil } from '../utils/response';

const statistics = new Hono<{ Bindings: Env }>();

// GET /api/statistics/family/:familyId - 获取家族统计
statistics.get('/family/:familyId', async (c) => {
  const familyId = c.req.param('familyId');
  const db = new DatabaseClient(c.env);
  const service = new StatisticsService(db);
  const stats = await service.getFamilyStatistics(familyId);

  return ResponseUtil.success(c, stats);
});

// GET /api/statistics/family/:familyId/generation-words - 获取字辈
statistics.get('/family/:familyId/generation-words', async (c) => {
  const familyId = c.req.param('familyId');
  const db = new DatabaseClient(c.env);
  const service = new StatisticsService(db);
  const words = await service.getGenerationWords(familyId);

  return ResponseUtil.success(c, words);
});

// POST /api/statistics/family/:familyId/generation-words - 设置字辈
statistics.post('/family/:familyId/generation-words', async (c) => {
  const familyId = c.req.param('familyId');
  const body = await c.req.json();
  const { generation, word } = body;

  if (!generation || !word) {
    return ResponseUtil.error(c, 'generation 和 word 参数必填');
  }

  const db = new DatabaseClient(c.env);
  const service = new StatisticsService(db);
  await service.setGenerationWord(familyId, generation, word);

  return ResponseUtil.success(c, null, '字辈设置成功');
});

export default statistics;
