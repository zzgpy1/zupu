import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// ============ Better Auth 认证表 ============
export const users = sqliteTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable('session', {
  id: text('id').primaryKey(),
  expiresAt: text('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => users.id),
});

export const accounts = sqliteTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => users.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: text('accessTokenExpiresAt'),
  refreshTokenExpiresAt: text('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const verifications = sqliteTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: text('expiresAt').notNull(),
  createdAt: text('createdAt').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updatedAt').notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ============ 族谱核心表 ============
export const familyMembers = sqliteTable('family_members', {
  id: text('id').primaryKey().default(sql`uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  generation: integer('generation'),
  siblingOrder: integer('sibling_order'),
  fatherId: text('father_id').references(() => familyMembers.id),
  motherId: text('mother_id').references(() => familyMembers.id),
  gender: text('gender', { enum: ['男', '女'] }),
  spouse: text('spouse'),
  birthday: text('birthday'),
  deathDate: text('death_date'),
  isAlive: integer('is_alive', { mode: 'boolean' }).default(true),
  residencePlace: text('residence_place'),
  officialPosition: text('official_position'),
  biography: text('biography'), // Slate.js 富文本 JSON
  remarks: text('remarks'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// ============ 族谱树表 (支持多族谱) ============
export const familyTrees = sqliteTable('family_trees', {
  id: text('id').primaryKey().default(sql`uuid()`),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  rootMemberId: text('root_member_id').references(() => familyMembers.id),
  isPublic: integer('is_public', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

// 族谱-成员关联表 (多对多，一个成员可属于多个族谱)
export const treeMembers = sqliteTable('tree_members', {
  treeId: text('tree_id').notNull().references(() => familyTrees.id),
  memberId: text('member_id').notNull().references(() => familyMembers.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  pk: primaryKey({ columns: [table.treeId, table.memberId] }),
}));

// 导出类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type FamilyMember = typeof familyMembers.$inferSelect;
export type NewFamilyMember = typeof familyMembers.$inferInsert;
export type FamilyTree = typeof familyTrees.$inferSelect;
export type NewFamilyTree = typeof familyTrees.$inferInsert;
