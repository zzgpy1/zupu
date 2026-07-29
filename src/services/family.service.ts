import type { Family, CreateFamilyInput, UpdateFamilyInput } from '../types';
import { DatabaseClient } from '../db/client';

export class FamilyService {
  constructor(private db: DatabaseClient) {}

  async findAll(limit: number = 100, offset: number = 0): Promise<{ data: Family[]; total: number }> {
    const countResult = await this.db.queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM families'
    );
    const total = countResult?.total || 0;

    const data = await this.db.query<Family>(
      `SELECT * FROM families ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return { data, total };
  }

  async findById(id: string): Promise<Family | null> {
    return await this.db.queryOne<Family>(
      'SELECT * FROM families WHERE id = ?',
      [id]
    );
  }

  async create(input: CreateFamilyInput): Promise<Family> {
    const id = crypto.randomUUID().replace(/-/g, '');
    const now = Math.floor(Date.now() / 1000);

    await this.db.execute(
      `INSERT INTO families (id, name, description, cover_image, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, input.name, input.description || null, input.cover_image || null, now, now]
    );

    const result = await this.findById(id);
    return result!;
  }

  async update(id: string, input: UpdateFamilyInput): Promise<Family | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const now = Math.floor(Date.now() / 1000);
    const updates: string[] = [];
    const values: any[] = [];

    if (input.name !== undefined) {
      updates.push('name = ?');
      values.push(input.name);
    }
    if (input.description !== undefined) {
      updates.push('description = ?');
      values.push(input.description);
    }
    if (input.cover_image !== undefined) {
      updates.push('cover_image = ?');
      values.push(input.cover_image);
    }
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    if (updates.length === 0) return existing;

    await this.db.execute(
      `UPDATE families SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.execute(
      'DELETE FROM families WHERE id = ?',
      [id]
    );
    return result.meta.changes > 0;
  }
}
