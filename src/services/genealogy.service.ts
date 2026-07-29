import type { Member } from '../types';
import { DatabaseClient } from '../db/client';

export class GenealogyService {
  constructor(private db: DatabaseClient) {}

  /**
   * 获取某人的所有祖先（向上追溯）
   */
  async getAncestors(memberId: string): Promise<Member[]> {
    const ancestors: Member[] = [];
    let current = await this.db.queryOne<Member>(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );

    while (current) {
      if (current.father_id) {
        const father = await this.db.queryOne<Member>(
          'SELECT * FROM members WHERE id = ?',
          [current.father_id]
        );
        if (father) {
          ancestors.push(father);
          current = father;
          continue;
        }
      }
      if (current.mother_id) {
        const mother = await this.db.queryOne<Member>(
          'SELECT * FROM members WHERE id = ?',
          [current.mother_id]
        );
        if (mother) {
          ancestors.push(mother);
          current = mother;
          continue;
        }
      }
      break;
    }

    return ancestors;
  }

  /**
   * 获取某人的所有后代（向下追溯）
   */
  async getDescendants(memberId: string): Promise<Member[]> {
    const descendants: Member[] = [];
    const queue: string[] = [memberId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const children = await this.db.query<Member>(
        'SELECT * FROM members WHERE father_id = ? OR mother_id = ?',
        [currentId, currentId]
      );

      for (const child of children) {
        descendants.push(child);
        queue.push(child.id);
      }
    }

    return descendants;
  }

  /**
   * 计算两个成员之间的关系路径
   */
  async findPath(memberId1: string, memberId2: string): Promise<Member[]> {
    // 使用 BFS 查找最短路径
    const visited = new Set<string>();
    const queue: Array<{ id: string; path: Member[] }> = [];

    const start = await this.db.queryOne<Member>(
      'SELECT * FROM members WHERE id = ?',
      [memberId1]
    );
    if (!start) return [];

    queue.push({ id: memberId1, path: [start] });
    visited.add(memberId1);

    while (queue.length > 0) {
      const { id, path } = queue.shift()!;

      if (id === memberId2) {
        return path;
      }

      // 获取邻居：父母、子女、配偶
      const neighbors = await this.getNeighbors(id);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          queue.push({
            id: neighbor.id,
            path: [...path, neighbor],
          });
        }
      }
    }

    return [];
  }

  /**
   * 获取某人的所有关系节点（父母、子女、配偶）
   */
  private async getNeighbors(memberId: string): Promise<Member[]> {
    const member = await this.db.queryOne<Member>(
      'SELECT * FROM members WHERE id = ?',
      [memberId]
    );
    if (!member) return [];

    const neighbors: Member[] = [];
    const ids = new Set<string>();

    // 父母
    if (member.father_id) {
      const father = await this.db.queryOne<Member>(
        'SELECT * FROM members WHERE id = ?',
        [member.father_id]
      );
      if (father && !ids.has(father.id)) {
        neighbors.push(father);
        ids.add(father.id);
      }
    }
    if (member.mother_id) {
      const mother = await this.db.queryOne<Member>(
        'SELECT * FROM members WHERE id = ?',
        [member.mother_id]
      );
      if (mother && !ids.has(mother.id)) {
        neighbors.push(mother);
        ids.add(mother.id);
      }
    }

    // 子女
    const children = await this.db.query<Member>(
      'SELECT * FROM members WHERE father_id = ? OR mother_id = ?',
      [memberId, memberId]
    );
    for (const child of children) {
      if (!ids.has(child.id)) {
        neighbors.push(child);
        ids.add(child.id);
      }
    }

    // 配偶
    if (member.spouse_id) {
      const spouse = await this.db.queryOne<Member>(
        'SELECT * FROM members WHERE id = ?',
        [member.spouse_id]
      );
      if (spouse && !ids.has(spouse.id)) {
        neighbors.push(spouse);
        ids.add(spouse.id);
      }
    }

    return neighbors;
  }

  /**
   * 获取家族谱系（带层级信息）
   */
  async getPedigree(familyId: string, memberId?: string): Promise<any> {
    const members = await this.db.query<Member>(
      'SELECT * FROM members WHERE family_id = ? ORDER BY generation ASC',
      [familyId]
    );

    // 构建层级映射
    const generations: Map<number, Member[]> = new Map();
    const maxGen = members.reduce((max, m) => Math.max(max, m.generation), 0);

    for (const m of members) {
      if (!generations.has(m.generation)) {
        generations.set(m.generation, []);
      }
      generations.get(m.generation)!.push(m);
    }

    return {
      total_members: members.length,
      max_generation: maxGen,
      generations: Array.from(generations.entries()).sort((a, b) => a[0] - b[0]),
    };
  }
}
