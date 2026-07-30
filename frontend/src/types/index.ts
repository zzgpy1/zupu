export interface User {
  id: string;
  email: string;
  username: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  generation?: number;
  siblingOrder?: number;
  fatherId?: string | null;
  gender?: '男' | '女';
  officialPosition?: string;
  isAlive?: boolean;
  spouse?: string;
  remarks?: string;
  birthday?: string;
  deathDate?: string;
  residencePlace?: string;
  createdAt: number;
  updatedAt: number;
  children?: FamilyMember[]; // 前端树形结构使用
}
