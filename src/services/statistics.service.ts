import type { FamilyStatistics } from '../types';
import { DatabaseClient } from '../db/client';

export class StatisticsService {
  constructor(private db: DatabaseClient) {}

  async getFamilyStatistics(familyId: string): Promise<FamilyStatistics> {
    // 总成员数
    const totalResult = await this.db.queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM members WHERE family_id = ?',
      [familyId]
    );
    const total_members = totalResult?.total || 0;

    // 最大世代
    const genResult = await this.db.queryOne<{ max_gen: number }>(
      'SELECT MAX(generation) as max_gen FROM members WHERE family_id = ?',
      [familyId]
    );
    const total_generations = genResult?.max_gen || 0;

    // 性别比例
    const genderResults = await this.db.query<{ gender: string; count: number }>(
      `SELECT gender, COUNT(*) as count FROM members 
       WHERE family_id = ? GROUP BY gender`,
      [familyId]
    );
    const genderRatio = { male: 0, female: 0, unknown: 0 };
    for (const r of genderResults) {
      if (r.gender === 'male') genderRatio.male = r.count;
      else if (r.gender === 'female') genderRatio.female = r.count;
      else genderRatio.unknown = r.count;
    }

    // 世代分布
    const genDistribution = await this.db.query<{ generation: number; count: number }>(
      `SELECT generation, COUNT(*) as count FROM members 
       WHERE family_id = ? GROUP BY generation ORDER BY generation ASC`,
      [familyId]
    );

    // 字辈统计
    const wordResults = await this.db.query<{ generation: number; word: string; count: number }>(
      `SELECT gw.generation, gw.word, COUNT(m.id) as count
       FROM generation_words gw
       LEFT JOIN members m ON m.family_id = gw.family_id AND m.generation = gw.generation
       WHERE gw.family_id = ?
       GROUP BY gw.generation, gw.word
       ORDER BY gw.generation ASC`,
      [familyId]
    );

    return {
      total_members,
      total_generations,
      gender_ratio: genderRatio,
      generation_distribution: genDistribution,
      generation_words: wordResults,
    };
  }

  async getGenerationWords(familyId: string): Promise<Array<{ generation: number; word: string }>> {
    return await this.db.query(
      'SELECT generation, word FROM generation_words WHERE family_id = ? ORDER BY generation ASC',
      [familyId]
    );
  }

  async setGenerationWord(familyId: string, generation: number, word: string): Promise<void> {
    const exists = await this.db.queryOne(
      'SELECT id FROM generation_words WHERE family_id = ? AND generation = ?',
      [familyId, generation]
    );

    if (exists) {
      await this.db.execute(
        'UPDATE generation_words SET word = ? WHERE family_id = ? AND generation = ?',
        [word, familyId, generation]
      );
    } else {
      const id = crypto.randomUUID().replace(/-/g, '');
      const now = Math.floor(Date.now() / 1000);
      await this.db.execute(
        'INSERT INTO generation_words (id, family_id, generation, word, created_at) VALUES (?, ?, ?, ?, ?)',
        [id, familyId, generation, word, now]
      );
    }
  }
}
