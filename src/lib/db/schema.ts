import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const families = sqliteTable('families', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description'),
  founderId: text('founder_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const members = sqliteTable('members', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  familyId: text('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  generationIndex: integer('generation_index'),
  generationChar: text('generation_char'),
  gender: text('gender', { enum: ['male', 'female', 'unknown'] }).default('unknown'),
  birthYear: integer('birth_year'),
  birthPlace: text('birth_place'),
  deathYear: integer('death_year'),
  deathPlace: text('death_place'),
  residence: text('residence'),
  officialTitle: text('official_title'),
  biography: text('biography'),
  avatarUrl: text('avatar_url'),
  isAlive: integer('is_alive', { mode: 'boolean' }).default(false),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export const relationships = sqliteTable('relationships', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  familyId: text('family_id').notNull().references(() => families.id, { onDelete: 'cascade' }),
  memberId: text('member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  relatedMemberId: text('related_member_id').notNull().references(() => members.id, { onDelete: 'cascade' }),
  relationType: text('relation_type', {
    enum: ['father', 'mother', 'child', 'spouse', 'sibling', 'adoptive_father', 'adoptive_mother'],
  }).notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
});

export type Family = typeof families.$inferSelect;
export type Member = typeof members.$inferSelect;
export type Relationship = typeof relationships.$inferSelect;
export type NewMember = typeof members.$inferInsert;
export type NewRelationship = typeof relationships.$inferInsert;
