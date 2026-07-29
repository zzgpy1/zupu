import type { Member, CreateMemberInput, UpdateMemberInput, MemberTreeNode } from '../types';
import { DatabaseClient } from '../db/client';

export class MemberService {
  constructor(private db: DatabaseClient) {}

  async findByFamily(
    familyId: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ data: Member[]; total: number }> {
    const countResult = await this.db.queryOne<{ total: number }>(
      'SELECT COUNT(*) as total FROM members WHERE family_id = ?',
      [familyId]
    );
    const total = countResult?.total || 0;

    const data = await this.db.query<Member>(
      `SELECT * FROM members WHERE family_id = ? ORDER BY generation ASC, sort_order ASC LIMIT ? OFFSET ?`,
      [familyId, limit, offset]
    );

    return { data, total };
  }

  async findById(id: string): Promise<Member | null> {
    return await this.db.queryOne<Member>(
      'SELECT * FROM members WHERE id = ?',
      [id]
    );
  }

  async create(input: CreateMemberInput): Promise<Member> {
    const id = crypto.randomUUID().replace(/-/g, '');
    const now = Math.floor(Date.now() / 1000);

    await this.db.execute(
      `INSERT INTO members (
        id, family_id, name, gender, birth_year, birth_place,
        death_year, death_place, biography, avatar, generation,
        father_id, mother_id, spouse_id, sort_order, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.family_id,
        input.name,
        input.gender || 'unknown',
        input.birth_year ?? null,
        input.birth_place ?? null,
        input.death_year ?? null,
        input.death_place ?? null,
        input.biography ?? null,
        input.avatar ?? null,
        input.generation || 1,
        input.father_id ?? null,
        input.mother_id ?? null,
        input.spouse_id ?? null,
        input.sort_order || 0,
        now,
        now,
      ]
    );

    const result = await this.findById(id);
    return result!;
  }

  async update(id: string, input: UpdateMemberInput): Promise<Member | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const now = Math.floor(Date.now() / 1000);
    const updates: string[] = [];
    const values: any[] = [];

    const fields = [
      'name', 'gender', 'birth_year', 'birth_place', 'death_year',
      'death_place', 'biography', 'avatar', 'generation',
      'father_id', 'mother_id', 'spouse_id', 'sort_order'
    ];

    for (const field of fields) {
      if (input[field as keyof UpdateMemberInput] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(input[field as keyof UpdateMemberInput] ?? null);
      }
    }

    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);

    if (updates.length === 0) return existing;

    await this.db.execute(
      `UPDATE members SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    // 先检查是否有子节点依赖
    const children = await this.db.query<{ id: string }>(
      'SELECT id FROM members WHERE father_id = ? OR mother_id = ?',
      [id, id]
    );
    if (children.length > 0) {
      throw new Error('该成员有子节点，无法删除');
    }

    const result = await this.db.execute(
      'DELETE FROM members WHERE id = ?',
      [id]
    );
    return result.meta.changes > 0;
  }

  async getTree(familyId: string, rootId?: string): Promise<MemberTreeNode[]> {
    // 获取所有成员
    const members = await this.db.query<Member>(
      'SELECT * FROM members WHERE family_id = ? ORDER BY generation ASC, sort_order ASC',
      [familyId]
    );

    if (members.length === 0) return [];

    // 构建映射
    const memberMap = new Map<string, MemberTreeNode>();
    const roots: MemberTreeNode[] = [];

    // 初始化所有节点
    for (const m of members) {
      memberMap.set(m.id, {
        ...m,
        children: [],
        spouse: null,
        parents: {
          father: null,
          mother: null,
        },
      });
    }

    // 构建树
    for (const m of members) {
      const node = memberMap.get(m.id)!;

      // 设置父母引用
      if (m.father_id && memberMap.has(m.father_id)) {
        node.parents!.father = memberMap.get(m.father_id)!;
      }
      if (m.mother_id && memberMap.has(m.mother_id)) {
        node.parents!.mother = memberMap.get(m.mother_id)!;
      }

      // 设置配偶
      if (m.spouse_id && memberMap.has(m.spouse_id)) {
        node.spouse = memberMap.get(m.spouse_id)!;
      }

      // 添加到父节点或根
      let isChild = false;
      if (m.father_id && memberMap.has(m.father_id)) {
        memberMap.get(m.father_id)!.children.push(node);
        isChild = true;
      }
      if (m.mother_id && memberMap.has(m.mother_id)) {
        memberMap.get(m.mother_id)!.children.push(node);
        isChild = true;
      }

      if (!isChild) {
        roots.push(node);
      }
    }

    // 如果指定了根节点
    if (rootId && memberMap.has(rootId)) {
      return [memberMap.get(rootId)!];
    }

    return roots;
  }
}
