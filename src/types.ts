export interface Env {
  DB: D1Database;
}

// ===== 家族 =====
export interface Family {
  id: string;
  name: string;
  description: string | null;
  founder_id: string | null;
  cover_image: string | null;
  created_at: number;
  updated_at: number;
}

export interface CreateFamilyInput {
  name: string;
  description?: string;
  cover_image?: string;
}

export interface UpdateFamilyInput extends Partial<CreateFamilyInput> {}

// ===== 成员 =====
export interface Member {
  id: string;
  family_id: string;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  birth_year: number | null;
  birth_place: string | null;
  death_year: number | null;
  death_place: string | null;
  biography: string | null;
  avatar: string | null;
  generation: number;
  father_id: string | null;
  mother_id: string | null;
  spouse_id: string | null;
  sort_order: number;
  created_at: number;
  updated_at: number;
}

export interface CreateMemberInput {
  family_id: string;
  name: string;
  gender?: 'male' | 'female' | 'unknown';
  birth_year?: number | null;
  birth_place?: string | null;
  death_year?: number | null;
  death_place?: string | null;
  biography?: string | null;
  avatar?: string | null;
  generation?: number;
  father_id?: string | null;
  mother_id?: string | null;
  spouse_id?: string | null;
  sort_order?: number;
}

export interface UpdateMemberInput extends Partial<CreateMemberInput> {}

// ===== 成员树节点 =====
export interface MemberTreeNode extends Member {
  children: MemberTreeNode[];
  spouse?: MemberTreeNode | null;
  parents?: {
    father: Member | null;
    mother: Member | null;
  };
}

// ===== 关系 =====
export interface Relationship {
  id: string;
  member_id: string;
  related_id: string;
  relation_type: string;
  created_at: number;
}

export interface CreateRelationshipInput {
  member_id: string;
  related_id: string;
  relation_type: string;
}

// ===== 字辈 =====
export interface GenerationWord {
  id: string;
  family_id: string;
  generation: number;
  word: string;
  created_at: number;
}

export interface CreateGenerationWordInput {
  family_id: string;
  generation: number;
  word: string;
}

// ===== 统计数据 =====
export interface FamilyStatistics {
  total_members: number;
  total_generations: number;
  gender_ratio: {
    male: number;
    female: number;
    unknown: number;
  };
  generation_distribution: Array<{
    generation: number;
    count: number;
  }>;
  generation_words: Array<{
    generation: number;
    word: string;
    count: number;
  }>;
}

// ===== API 响应 =====
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
